document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    const loading = document.getElementById('thankYouLoading');
    const errorBlock = document.getElementById('thankYouError');
    const successBlock = document.getElementById('thankYouSuccess');

    if (!sessionId) {
        showError('No order reference found. If you completed checkout, use the link from your confirmation email.');
        return;
    }

    try {
        const res = await fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();

        if (!res.ok) {
            showError(data.error || 'Could not load order details.');
            return;
        }

        if (data.status !== 'paid') {
            showError('Payment was not completed. Please try checkout again or contact support.');
            return;
        }

        localStorage.removeItem('logicxo-cart');

        loading.hidden = true;
        successBlock.hidden = false;

        document.getElementById('thankYouEmail').textContent = data.customerEmail || 'your email';
        document.getElementById('thankYouOrderId').textContent = data.id.replace('cs_test_', '').slice(0, 8).toUpperCase();
        document.getElementById('thankYouTotal').textContent = data.totalFormatted;

        if (data.tax > 0) {
            const subtotalEl = document.getElementById('thankYouSubtotal');
            const taxEl = document.getElementById('thankYouTax');
            subtotalEl.hidden = false;
            taxEl.hidden = false;
            document.getElementById('thankYouSubtotalAmount').textContent = data.subtotalFormatted;
            document.getElementById('thankYouTaxAmount').textContent = data.taxFormatted;
        }

        const itemsEl = document.getElementById('thankYouItems');
        itemsEl.innerHTML = data.items.map((item) => `
            <li>
                <span>${item.name}${item.qty > 1 ? ` × ${item.qty}` : ''}</span>
                <span>${formatMoney(item.lineTotal)}</span>
            </li>
        `).join('');

        const hasDesign = data.items.some((item) => String(item.id).startsWith('design-') || item.name.toLowerCase().includes('design') || item.name.toLowerCase().includes('banner') || item.name.toLowerCase().includes('pop-up') || item.name.toLowerCase().includes('campaign kit') || item.name.toLowerCase().includes('refresh') || item.name.toLowerCase().includes('email template'));

        if (hasDesign) {
            const designBlock = document.getElementById('thankYouDesignBlock');
            designBlock.hidden = false;
            document.getElementById('thankYouBriefLink').href = `creative-brief.html?order=${encodeURIComponent(sessionId)}`;
        }

        const previewLink = document.getElementById('thankYouEmailPreview');
        previewLink.href = data.emailPreviewUrl || `/api/preview-email?session_id=${encodeURIComponent(sessionId)}`;
    } catch {
        showError('Network error — please refresh or contact support@logicxo.com.');
    }

    function showError(message) {
        loading.hidden = true;
        errorBlock.hidden = false;
        document.getElementById('thankYouErrorMsg').textContent = message;
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
});
