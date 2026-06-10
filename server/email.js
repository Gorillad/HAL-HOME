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

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderAccessRequestEmail(entry) {
    const rows = [
        ['Name', entry.name],
        ['Email', entry.email],
        ['Company', entry.company || '—'],
        ['Preferred username', entry.username || '—'],
        ['Submitted', entry.requestedAt],
    ];

    const tableRows = rows.map(([label, value]) => `
        <tr>
          <td style="padding:10px 14px;font-size:13px;font-weight:600;color:#5c5c5c;border-top:1px solid #d8e3ec;width:160px;">${escapeHtml(label)}</td>
          <td style="padding:10px 14px;font-size:14px;color:#2b2b2b;border-top:1px solid #d8e3ec;">${escapeHtml(value)}</td>
        </tr>`).join('');

    const messageBlock = entry.message
        ? `<p style="margin:20px 0 8px;font-size:13px;font-weight:700;color:#146294;">Message</p>
           <p style="margin:0;font-size:14px;color:#2b2b2b;line-height:1.6;white-space:pre-wrap;">${escapeHtml(entry.message)}</p>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;background:#eef4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #d8e3ec;border-radius:10px;overflow:hidden;">
    <tr>
      <td style="padding:24px 24px 12px;background:#1a7bbd;color:#ffffff;">
        <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;opacity:0.85;">LogicXO</p>
        <h1 style="margin:0;font-size:22px;font-weight:700;">New homepage access request</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <p style="margin:0 0 16px;font-size:14px;color:#5c5c5c;line-height:1.6;">Someone submitted the login page access form.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${tableRows}</table>
        ${messageBlock}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderAccessRequestText(entry) {
    return [
        'New LogicXO homepage access request',
        '',
        `Name: ${entry.name}`,
        `Email: ${entry.email}`,
        `Company: ${entry.company || '—'}`,
        `Preferred username: ${entry.username || '—'}`,
        `Submitted: ${entry.requestedAt}`,
        entry.message ? `\nMessage:\n${entry.message}` : '',
    ].filter(Boolean).join('\n');
}

function saveAccessRequestToOutbox(requestId, html) {
    if (!fs.existsSync(OUTBOX_DIR)) {
        fs.mkdirSync(OUTBOX_DIR, { recursive: true });
    }
    const filePath = path.join(OUTBOX_DIR, `access-${requestId}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
    return filePath;
}

function getAccessRequestFromOutbox(requestId) {
    const filePath = path.join(OUTBOX_DIR, `access-${requestId}.html`);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, 'utf8');
}

function isSmtpConfigured() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    return Boolean(
        host
        && user
        && pass
        && !host.includes('your_smtp')
        && !user.includes('your_smtp')
        && !pass.includes('your_smtp'),
    );
}

async function sendAccessRequestEmail(entry) {
    const to = process.env.ACCESS_REQUEST_EMAIL || 'hello@logicxo.com';
    const from = process.env.SMTP_FROM || 'noreply@logicxo.com';
    const html = renderAccessRequestEmail(entry);
    const text = renderAccessRequestText(entry);

    saveAccessRequestToOutbox(entry.id, html);

    if (!isSmtpConfigured()) {
        console.warn(`[access] SMTP not configured — request ${entry.id} saved to outbox only (intended for ${to})`);
        return { sent: false, to };
    }

    const nodemailer = require('nodemailer');
    const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from,
        to,
        replyTo: entry.email,
        subject: `LogicXO access request — ${entry.name}`,
        text,
        html,
    });

    console.log(`[access] Request email sent to ${to} for ${entry.email}`);
    return { sent: true, to };
}

module.exports = {
    loadProducts,
    formatMoney,
    renderOrderEmail,
    saveToOutbox,
    getFromOutbox,
    parseSessionItems,
    hasDesignItems,
    sendAccessRequestEmail,
    getAccessRequestFromOutbox,
};
