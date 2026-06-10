# LogicXO Marketing Site

Marketing site for [logicxo.com](https://logicxo.com): homepage templates, design services, showroom homepage editor, and Stripe checkout (test mode locally; live when Stripe is activated).

> **Repo note:** GitHub repo may still be named `HAL-HOME`. The local folder name does not affect deployment.

## Run locally

```bash
npm install
cp .env.example .env
# Add sk_test_ / pk_test_ keys from https://dashboard.stripe.com/test/apikeys
npm start
```

Open http://localhost:4242

Use `npm start` (not a static file server) — cart checkout requires the Node API.

## Project structure

```
├── index.html                 # Marketing homepage
├── thank-you.html             # Post-checkout confirmation
├── creative-brief.html        # Design services intake (post-order)
├── css/style.css              # Site styles
├── js/
│   ├── main.js                # Nav, pricing toggle, contact form
│   ├── cart.js                # Cart + Stripe Checkout redirect
│   └── thank-you.js           # Order summary after checkout
├── images/                    # Logo, favicons, homepage hero
├── data/
│   ├── products.json          # Catalog (cart + checkout line items)
│   ├── contacts.json          # Email addresses (canonical list)
│   └── template-defaults.json # Default showroom editor content
├── editor/                    # Showroom homepage template editor
│   ├── showroom.html
│   ├── css/editor.css
│   ├── js/showroom-editor.js
│   ├── js/export-pdf.js
│   ├── gallery/               # Gallery template default images
│   ├── classic/               # Classic template images (categories, get-inspired, etc.)
│   ├── assets/                # Shared editor assets (e.g. rubber-duck.svg)
│   └── vendor/                # html2canvas, jsPDF, JSZip (PDF export)
├── server/
│   ├── index.js               # Express: static files + Stripe API
│   └── email.js               # Order confirmation email rendering
├── emails/
│   └── order-confirmation.html
├── shared/footer/             # Portable footer (sync with support site)
└── docs/
    └── CONTACTS.md            # Contact email usage guide
```

## Stripe (test mode)

1. Create a [Stripe account](https://dashboard.stripe.com/register) and stay in **Test mode**.
2. Copy test keys into `.env`.
3. Add items to cart → **Proceed to Checkout**.
4. Test card: `4242 4242 4242 4242`, any future expiry, any CVC. Billing address required.
5. Land on `thank-you.html` with order summary and email preview link.

**Branding:** [Dashboard → Settings → Branding](https://dashboard.stripe.com/settings/branding) — logo + accent `#1a7bbd`.

**Sales tax:** 12% by default (`STRIPE_TAX_PERCENT=12`). Set `STRIPE_AUTOMATIC_TAX=true` for Stripe Tax later.

**Webhooks (optional):**

```bash
stripe listen --forward-to localhost:4242/api/webhook
```

Copy the signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`.

## Showroom editor

Open http://localhost:4242/editor/showroom.html — customize the showroom homepage template, export PDF/ZIP.

## Email template

Edit post-purchase email at `emails/order-confirmation.html`. Test previews save to `server/outbox/` (gitignored).

## Related sites

| Site | URL |
|------|-----|
| Marketing | logicxo.com (this repo) |
| Support KB | https://support.logicxo.com/ |
| Support repo | [HALXO](https://github.com/Gorillad/HALXO) |

## Version

Current release: **v1.0.0** — see [CHANGELOG.md](CHANGELOG.md).
