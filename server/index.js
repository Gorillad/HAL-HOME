require('dotenv').config();

const express = require('express');
const path = require('path');
const Stripe = require('stripe');
const {
    loadProducts,
    formatMoney,
    renderOrderEmail,
    saveToOutbox,
    getFromOutbox,
    parseSessionItems,
} = require('./email');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 4242;
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey && !stripeKey.includes('your_secret_key')
    ? new Stripe(stripeKey)
    : null;

const app = express();

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) {
        return res.status(503).send('Stripe not configured');
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        if (webhookSecret && !webhookSecret.includes('your_webhook')) {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
            event = JSON.parse(req.body.toString());
        }
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            await generateConfirmationEmail(session.id);
            console.log(`[email] Confirmation saved for session ${session.id}`);
        } catch (err) {
            console.error('Failed to generate confirmation email:', err);
        }
    }

    res.json({ received: true });
});

app.use(express.json());
app.use(express.static(ROOT));

app.get('/api/config', (_req, res) => {
    res.json({
        stripeConfigured: Boolean(stripe),
        testMode: Boolean(stripe),
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    });
});

app.post('/api/create-checkout-session', async (req, res) => {
    if (!stripe) {
        return res.status(503).json({
            error: 'Stripe is not configured. Copy .env.example to .env and add your test API keys.',
        });
    }

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty.' });
    }

    const products = loadProducts();
    const lineItems = [];
    let hasSubscription = false;
    let hasOneTime = false;

    for (const { id, qty } of items) {
        const product = products[id];
        const quantity = Math.max(1, parseInt(qty, 10) || 1);
        if (!product) {
            return res.status(400).json({ error: `Unknown product: ${id}` });
        }

        if (product.type === 'subscription') hasSubscription = true;
        else hasOneTime = true;

        const priceData = {
            currency: 'usd',
            product_data: {
                name: product.name,
                metadata: { product_id: product.id },
            },
            unit_amount: product.price * 100,
        };

        if (product.type === 'subscription') {
            priceData.recurring = { interval: product.interval };
        }

        lineItems.push({ price_data: priceData, quantity });
    }

    const mode = hasSubscription ? 'subscription' : 'payment';

    try {
        const session = await stripe.checkout.sessions.create({
            mode,
            line_items: lineItems,
            success_url: `${BASE_URL}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/index.html#pricing`,
            billing_address_collection: 'auto',
            customer_email: undefined,
            metadata: {
                cart_items: JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty }))),
            },
            payment_method_types: ['card'],
        });

        res.json({ url: session.url, sessionId: session.id });
    } catch (err) {
        console.error('Checkout session error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/checkout-session', async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ error: 'Stripe not configured.' });
    }

    const { session_id: sessionId } = req.query;
    if (!sessionId) {
        return res.status(400).json({ error: 'Missing session_id.' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'line_items.data.price.product'],
        });

        const products = loadProducts();
        const items = parseSessionItems(session, products);
        const total = (session.amount_total || 0) / 100;

        if (session.payment_status === 'paid' && !getFromOutbox(sessionId)) {
            await generateConfirmationEmail(sessionId);
        }

        res.json({
            id: session.id,
            status: session.payment_status,
            customerEmail: session.customer_details?.email || session.customer_email,
            customerName: session.customer_details?.name || '',
            total,
            totalFormatted: formatMoney(total),
            items,
            emailPreviewUrl: `/api/preview-email?session_id=${sessionId}`,
        });
    } catch (err) {
        console.error('Session retrieve error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/preview-email', async (req, res) => {
    const { session_id: sessionId } = req.query;
    if (!sessionId) {
        return res.status(400).send('Missing session_id.');
    }

    let html = getFromOutbox(sessionId);
    if (!html && stripe) {
        try {
            html = await generateConfirmationEmail(sessionId);
        } catch (err) {
            return res.status(404).send('Confirmation email not found.');
        }
    }

    if (!html) {
        return res.status(503).send('Email preview unavailable — configure Stripe and complete a test checkout.');
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
});

async function generateConfirmationEmail(sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'line_items.data.price.product'],
    });

    const products = loadProducts();
    const items = parseSessionItems(session, products);
    const total = (session.amount_total || 0) / 100;
    const orderId = sessionId.replace('cs_test_', '').slice(0, 8).toUpperCase();

    const html = renderOrderEmail({
        customerName: session.customer_details?.name?.split(' ')[0] || 'there',
        customerEmail: session.customer_details?.email || session.customer_email,
        orderId,
        items,
        total,
    });

    saveToOutbox(sessionId, html);
    return html;
}

app.listen(PORT, () => {
    console.log(`LogicXO server running at ${BASE_URL}`);
    if (!stripe) {
        console.warn('⚠  Stripe not configured — copy .env.example to .env and add sk_test_ / pk_test_ keys');
    } else {
        console.log('✓  Stripe TEST mode ready — use card 4242 4242 4242 4242');
    }
});
