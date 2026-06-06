const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUTBOX_DIR = path.join(__dirname, 'outbox');

function loadProducts() {
    const raw = fs.readFileSync(path.join(ROOT, 'data', 'products.json'), 'utf8');
    return JSON.parse(raw);
}

function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function buildOrderItemsRows(items) {
    return items.map((item) => `
                <tr>
                  <td style="padding:12px 16px;font-size:14px;color:#2b2b2b;border-top:1px solid #d8e3ec;">
                    ${item.name}${item.qty > 1 ? ` &times; ${item.qty}` : ''}
                    <span style="float:right;font-weight:600;">${formatMoney(item.lineTotal)}</span>
                  </td>
                </tr>`).join('');
}

function hasDesignItems(items) {
    return items.some((item) => item.id.startsWith('design-'));
}

function renderOrderEmail({ customerName, customerEmail, orderId, items, total }) {
    const templatePath = path.join(ROOT, 'emails', 'order-confirmation.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    const designCallout = hasDesignItems(items)
        ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;background-color:#e8f4fb;border-radius:8px;border-left:4px solid #1a7bbd;">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#146294;">Creative brief needed</p>
                    <p style="margin:0;font-size:14px;color:#5c5c5c;line-height:1.6;">Your order includes design services. Complete our brief so we can start on your pop-ups, banners, or email templates.</p>
                    <p style="margin:12px 0 0;"><a href="${process.env.BASE_URL}/creative-brief.html?order={{order_id}}" style="display:inline-block;padding:10px 18px;background-color:#1a7bbd;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">Complete Creative Brief</a></p>
                  </td>
                </tr>
              </table>`.replace(/\{\{order_id\}\}/g, orderId)
        : '';

    const designNextStep = hasDesignItems(items)
        ? '<li>Complete your <strong>Creative Brief</strong> so our design team can begin (link above).</li>'
        : '';

    html = html
        .replace(/\{\{customer_name\}\}/g, customerName || 'there')
        .replace(/\{\{customer_email\}\}/g, customerEmail || '')
        .replace(/\{\{order_id\}\}/g, orderId)
        .replace(/\{\{order_total\}\}/g, formatMoney(total))
        .replace('{{order_items_rows}}', buildOrderItemsRows(items))
        .replace('{{design_callout}}', designCallout)
        .replace('{{design_next_step}}', designNextStep);

    return html;
}

function saveToOutbox(sessionId, html) {
    if (!fs.existsSync(OUTBOX_DIR)) {
        fs.mkdirSync(OUTBOX_DIR, { recursive: true });
    }
    const filePath = path.join(OUTBOX_DIR, `${sessionId}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
    return filePath;
}

function getFromOutbox(sessionId) {
    const filePath = path.join(OUTBOX_DIR, `${sessionId}.html`);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, 'utf8');
}

function parseSessionItems(session, products) {
    const lineItems = session.line_items?.data || [];
    return lineItems.map((line) => {
        const qty = line.quantity || 1;
        const unitAmount = (line.price?.unit_amount || 0) / 100;
        return {
            id: line.price?.product?.metadata?.product_id || line.description,
            name: line.description || line.price?.product?.name || 'Item',
            qty,
            lineTotal: unitAmount * qty,
        };
    });
}

module.exports = {
    loadProducts,
    formatMoney,
    renderOrderEmail,
    saveToOutbox,
    getFromOutbox,
    parseSessionItems,
    hasDesignItems,
};
