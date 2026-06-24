/**
 * LogicX cart — localStorage + Stripe Checkout (test mode).
 */
const Cart = (() => {
    const STORAGE_KEY = 'logicxo-cart';

    let CATALOG = {};
    let items = [];
    let checkoutLoading = false;

    async function loadCatalog() {
        try {
            const res = await fetch('/data/products.json');
            CATALOG = await res.json();
        } catch {
            console.error('Failed to load product catalog.');
            CATALOG = {};
        }
    }

    function load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            items = saved ? JSON.parse(saved) : [];
        } catch {
            items = [];
        }
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function getCount() {
        return items.reduce((sum, item) => sum + item.qty, 0);
    }

    function getSubtotal() {
        return items.reduce((sum, item) => {
            const product = CATALOG[item.id];
            return product ? sum + product.price * item.qty : sum;
        }, 0);
    }

    function add(productId) {
        const product = CATALOG[productId];
        if (!product) return false;

        if (product.type === 'subscription') {
            items = items.filter((item) => {
                const p = CATALOG[item.id];
                return !p || p.type !== 'subscription';
            });
        }

        const existing = items.find((item) => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            items.push({ id: productId, qty: 1 });
        }

        save();
        dispatchChange();
        openDrawer();
        return true;
    }

    function remove(productId) {
        items = items.filter((item) => item.id !== productId);
        save();
        dispatchChange();
    }

    function setQty(productId, qty) {
        if (qty < 1) {
            remove(productId);
            return;
        }
        const item = items.find((i) => i.id === productId);
        if (item) {
            item.qty = qty;
            save();
            dispatchChange();
        }
    }

    function clear() {
        items = [];
        save();
        dispatchChange();
    }

    function formatPrice(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    }

    function dispatchChange() {
        document.dispatchEvent(new CustomEvent('cart:updated'));
    }

    async function checkout() {
        if (items.length === 0 || checkoutLoading) return;

        const checkoutBtn = document.getElementById('cartCheckout');
        const noteEl = document.getElementById('cartStripeNote');

        checkoutLoading = true;
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Redirecting…';
        }

        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Checkout failed.');
            }

            window.location.href = data.url;
        } catch (err) {
            if (noteEl) {
                noteEl.textContent = err.message;
                noteEl.classList.add('is-error');
            } else {
                alert(err.message);
            }
            checkoutLoading = false;
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Proceed to Checkout';
            }
        }
    }

    async function initUI() {
        await loadCatalog();
        load();
        render();
        bindEvents();
        updateStripeNote();

        document.addEventListener('cart:updated', render);

        document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-add-to-cart');
                add(id);
            });
        });
    }

    async function updateStripeNote() {
        const noteEl = document.getElementById('cartStripeNote');
        if (!noteEl) return;

        try {
            const res = await fetch('/api/config');
            const config = await res.json();
            if (config.stripeConfigured) {
                let taxNote = '';
                if (config.automaticTax) {
                    taxNote = ' Tax calculated at checkout.';
                } else if (config.taxPercent > 0) {
                    taxNote = ` ${config.taxPercent}% sales tax added at checkout.`;
                }
                noteEl.textContent = `Test mode — card 4242 4242 4242 4242, any future date, any CVC. Billing address required.${taxNote}`;
                noteEl.classList.remove('is-error');
            } else {
                noteEl.textContent = 'Add Stripe test keys to .env to enable checkout.';
                noteEl.classList.add('is-error');
            }
        } catch {
            noteEl.textContent = 'Run npm start to enable Stripe checkout.';
            noteEl.classList.add('is-error');
        }
    }

    function bindEvents() {
        const toggle = document.getElementById('cartToggle');
        const closeBtn = document.getElementById('cartClose');
        const backdrop = document.getElementById('cartBackdrop');
        const checkoutBtn = document.getElementById('cartCheckout');

        toggle?.addEventListener('click', openDrawer);
        closeBtn?.addEventListener('click', closeDrawer);
        backdrop?.addEventListener('click', closeDrawer);
        checkoutBtn?.addEventListener('click', checkout);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('cart-open')) {
                closeDrawer();
            }
        });
    }

    function openDrawer() {
        document.body.classList.add('cart-open');
        document.getElementById('cartDrawer')?.setAttribute('aria-hidden', 'false');
    }

    function closeDrawer() {
        document.body.classList.remove('cart-open');
        document.getElementById('cartDrawer')?.setAttribute('aria-hidden', 'true');
    }

    function render() {
        const countEl = document.getElementById('cartCount');
        const listEl = document.getElementById('cartItems');
        const emptyEl = document.getElementById('cartEmpty');
        const footerEl = document.getElementById('cartFooter');
        const subtotalEl = document.getElementById('cartSubtotal');

        const count = getCount();
        if (countEl) {
            countEl.textContent = count;
            countEl.hidden = count === 0;
        }

        if (!listEl) return;

        if (items.length === 0) {
            listEl.innerHTML = '';
            emptyEl.hidden = false;
            footerEl.hidden = true;
            return;
        }

        emptyEl.hidden = true;
        footerEl.hidden = false;

        listEl.innerHTML = items.map((item) => {
            const product = CATALOG[item.id];
            if (!product) return '';
            const lineTotal = formatPrice(product.price * item.qty);
            const note = product.note ? `<span class="cart-item-note">${product.note}</span>` : '';
            return `
                <li class="cart-item" data-id="${product.id}">
                    <div class="cart-item-info">
                        <strong>${product.name}</strong>
                        ${note}
                        <span class="cart-item-price">${lineTotal}</span>
                    </div>
                    <div class="cart-item-actions">
                        <button type="button" class="cart-qty-btn" data-action="decrease" aria-label="Decrease quantity">−</button>
                        <span class="cart-qty">${item.qty}</span>
                        <button type="button" class="cart-qty-btn" data-action="increase" aria-label="Increase quantity">+</button>
                        <button type="button" class="cart-remove" aria-label="Remove item">&times;</button>
                    </div>
                </li>
            `;
        }).join('');

        if (subtotalEl) subtotalEl.textContent = formatPrice(getSubtotal());

        listEl.querySelectorAll('.cart-item').forEach((row) => {
            const id = row.getAttribute('data-id');
            row.querySelector('[data-action="decrease"]')?.addEventListener('click', () => {
                const item = items.find((i) => i.id === id);
                if (item) setQty(id, item.qty - 1);
            });
            row.querySelector('[data-action="increase"]')?.addEventListener('click', () => {
                const item = items.find((i) => i.id === id);
                if (item) setQty(id, item.qty + 1);
            });
            row.querySelector('.cart-remove')?.addEventListener('click', () => remove(id));
        });
    }

    return { initUI, add, clear, formatPrice };
})();
