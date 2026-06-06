# HAL-HOME — LogicXO Marketing Homepage

Marketing site for LogicXO / XOLogic with homepage templates, design services, and Stripe test checkout.

## Run locally (with Stripe test checkout)

```bash
cd HAL-HOME
cp .env.example .env
# Add your sk_test_ and pk_test_ keys from https://dashboard.stripe.com/test/apikeys
npm install
npm start
```

Open http://localhost:4242

> Use `npm start` instead of `python -m http.server` — checkout requires the Node API server.

## Stripe test mode

1. Create a free [Stripe account](https://dashboard.stripe.com/register) and stay in **Test mode**.
2. Copy **Publishable** and **Secret** test keys into `.env`.
3. Add items to cart → **Proceed to Checkout**.
4. Pay with test card `4242 4242 4242 4242`, any future expiry, any CVC.
5. You'll land on `thank-you.html` with order summary and a **Preview Confirmation Email** link.

### Email template

Edit the post-purchase email design at:

```
emails/order-confirmation.html
```

After each test checkout, a rendered preview is saved to `server/outbox/{session_id}.html` (gitignored). Open it in a browser or use the thank-you page preview link.

### Webhooks (optional)

For automatic email generation on payment:

```bash
stripe listen --forward-to localhost:4242/api/webhook
```

Copy the webhook signing secret into `.env` as `STRIPE_WEBHOOK_SECRET`.

## Project structure

```
HAL-HOME/
├── index.html              # Homepage
├── thank-you.html          # Post-checkout confirmation
├── creative-brief.html     # Design services intake form
├── emails/
│   └── order-confirmation.html   # Editable email template
├── data/products.json      # Product catalog (cart + checkout)
├── server/index.js         # Stripe Checkout API (test mode)
├── js/cart.js              # Cart + checkout redirect
└── shared/footer/          # Shared footer from HALXO
```

## Support site

- Nav Support link: https://support.logicxo.com/
