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
const {
    handleLogin,
    handleLogout,
    handleSessionCheck,
    handleRequestAccess,
    requireEditorAuth,
} = require('./access');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 4242;
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey && !stripeKey.includes('your_secret_key')
    ? new Stripe(stripeKey)
    : null;
const automaticTaxEnabled = process.env.STRIPE_AUTOMATIC_TAX === 'true';
const taxPercent = automaticTaxEnabled
    ? 0
    : Math.max(0, Number.parseFloat(process.env.STRIPE_TAX_PERCENT || '12') || 12);

let cachedTaxRateId = null;

function formatCheckoutMoney(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

async function getTaxRateId() {
    if (!stripe || taxPercent <= 0) return null;

    const configuredRateId = process.env.STRIPE_TAX_RATE_ID;
    if (configuredRateId && !configuredRateId.includes('your_tax_rate')) {
        return configuredRateId;
    }

    if (cachedTaxRateId) return cachedTaxRateId;

    const rates = await stripe.taxRates.list({ active: true, limit: 100 });
    const existing = rates.data.find((rate) => (
        rate.percentage === taxPercent
        && rate.inclusive === false
        && rate.display_name === 'Sales tax'
    ));

    if (existing) {
        cachedTaxRateId = existing.id;
        return cachedTaxRateId;
    }

    const created = await stripe.taxRates.create({
        display_name: 'Sales tax',
        description: `${taxPercent}% sales tax`,
        percentage: taxPercent,
        inclusive: false,
    });
    cachedTaxRateId = created.id;
    return cachedTaxRateId;
}

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

app.post('/api/editor/login', handleLogin);
app.post('/api/editor/logout', handleLogout);
app.get('/api/editor/session', handleSessionCheck);
app.post('/api/editor/request-access', (req, res) => {
    Promise.resolve(handleRequestAccess(req, res)).catch((err) => {
        console.error('Access request handler error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Could not send your request. Please email hello@logicxo.com.' });
        }
    });
});

app.get('/editor/showroom.html', requireEditorAuth, (_req, res) => {
    res.sendFile(path.join(ROOT, 'editor', 'showroom.html'));
});

app.get('/editor/knowledge-base.html', requireEditorAuth, (_req, res) => {
    res.sendFile(path.join(ROOT, 'editor', 'knowledge-base.html'));
});

app.get('/editor/login.html', (_req, res) => {
    res.sendFile(path.join(ROOT, 'editor', 'login.html'));
});

app.use(express.static(ROOT));

app.get('/api/config', (_req, res) => {
    res.json({
        stripeConfigured: Boolean(stripe),
        testMode: Boolean(stripe),
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
        automaticTax: automaticTaxEnabled,
        taxPercent: automaticTaxEnabled ? 0 : taxPercent,
        billingAddressRequired: true,
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

        if (automaticTaxEnabled) {
            priceData.tax_behavior = 'exclusive';
        }

        lineItems.push({ price_data: priceData, quantity });
    }

    const mode = hasSubscription ? 'subscription' : 'payment';

    const sessionParams = {
        mode,
        line_items: lineItems,
        success_url: `${BASE_URL}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${BASE_URL}/index.html#pricing`,
        billing_address_collection: 'required',
        metadata: {
            cart_items: JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty }))),
        },
        payment_method_types: ['card'],
    };

    if (automaticTaxEnabled) {
        sessionParams.automatic_tax = { enabled: true };
        sessionParams.customer_update = { address: 'auto' };
    }

    try {
        if (!automaticTaxEnabled && taxPercent > 0) {
            const taxRateId = await getTaxRateId();
            if (taxRateId) {
                sessionParams.default_tax_rates = [taxRateId];
            }
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

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
        const subtotal = (session.amount_subtotal || 0) / 100;
        const tax = (session.total_details?.amount_tax || 0) / 100;

        if (session.payment_status === 'paid' && !getFromOutbox(sessionId)) {
            await generateConfirmationEmail(sessionId);
        }

        res.json({
            id: session.id,
            status: session.payment_status,
            customerEmail: session.customer_details?.email || session.customer_email,
            customerName: session.customer_details?.name || '',
            subtotal,
            subtotalFormatted: formatCheckoutMoney(subtotal),
            tax,
            taxFormatted: formatCheckoutMoney(tax),
            total,
            totalFormatted: formatCheckoutMoney(total),
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
        if (automaticTaxEnabled) {
            console.log('✓  Automatic tax enabled — enable Stripe Tax in your test dashboard');
        } else if (taxPercent > 0) {
            console.log(`✓  Checkout sales tax set to ${taxPercent}%`);
        }
    }
});
