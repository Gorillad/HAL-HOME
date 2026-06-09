document.addEventListener('DOMContentLoaded', () => {
    Footer.load();
    initMobileNav();
    initSmoothScroll();
    initContactForm();
    initPricingToggle();
    initHeroRays();
    Cart.initUI();
});

function initMobileNav() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.site-nav-toggle');
    const panel = document.getElementById('site-nav-panel');
    const backdrop = document.querySelector('.site-nav-backdrop');
    if (!nav || !toggle || !panel || !backdrop) return;

    const links = panel.querySelectorAll('a[href^="#"]');

    function openMenu() {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close menu');
        backdrop.hidden = false;
        document.body.classList.add('nav-open');
    }

    function closeMenu() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        backdrop.hidden = true;
        document.body.classList.remove('nav-open');
    }

    function isMenuOpen() {
        return nav.classList.contains('is-open');
    }

    toggle.addEventListener('click', () => {
        if (isMenuOpen()) closeMenu();
        else openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    links.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen()) {
            closeMenu();
            toggle.focus();
        }
    });

    window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
        if (e.matches) closeMenu();
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (!id || id === '#') return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', id);
        });
    });
}

function formatPlanSavings(monthly, annual) {
    const yearlyIfMonthly = monthly * 12;
    const yearlyIfAnnual = annual * 12;
    const savings = yearlyIfMonthly - yearlyIfAnnual;
    const percent = Math.round((savings / yearlyIfMonthly) * 100);
    return `Save $${savings.toLocaleString()}/year (${percent}% vs monthly)`;
}

function updatePricingSavings(billing) {
    document.querySelectorAll('.pricing-card').forEach((card) => {
        const priceEl = card.querySelector('.pricing-price');
        const savingsEl = card.querySelector('.pricing-savings');
        if (!priceEl || !savingsEl) return;

        const monthly = Number(priceEl.dataset.monthly);
        const annual = Number(priceEl.dataset.annual);

        if (billing === 'annual' && monthly > annual) {
            savingsEl.textContent = formatPlanSavings(monthly, annual);
            savingsEl.hidden = false;
        } else {
            savingsEl.hidden = true;
            savingsEl.textContent = '';
        }
    });
}

function initPricingToggle() {
    const buttons = document.querySelectorAll('.billing-toggle-btn');
    const prices = document.querySelectorAll('.pricing-price');
    const notes = document.querySelectorAll('.pricing-note[data-annual-note]');
    let billing = 'monthly';

    function applyBilling(period) {
        billing = period;

        prices.forEach((el) => {
            const val = el.getAttribute(`data-${billing}`);
            el.textContent = `$${Number(val).toLocaleString()}`;
        });

        notes.forEach((el) => {
            if (billing === 'annual') {
                el.textContent = el.getAttribute('data-annual-note');
            } else {
                el.textContent = el.dataset.monthlyDefault || 'No contract — cancel anytime';
            }
        });

        updatePricingSavings(billing);

        document.querySelectorAll('[data-add-plan]').forEach((btn) => {
            btn.dataset.billing = billing;
        });
    }

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            buttons.forEach((b) => {
                const active = b === btn;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });

            applyBilling(btn.getAttribute('data-billing'));
        });
    });

    notes.forEach((el) => {
        el.dataset.monthlyDefault = el.textContent;
    });

    document.querySelectorAll('[data-add-plan]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-add-plan');
            const period = btn.dataset.billing || billing;
            const productId = `plan-${plan}-${period === 'annual' ? 'annual' : 'monthly'}`;
            Cart.add(productId);
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const msg = document.getElementById('contactFormMsg');
    if (!form || !nameInput || !emailInput || !msg) return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (!name) {
            showContactMsg(msg, 'Please enter your name.', 'error');
            nameInput.focus();
            return;
        }

        if (!emailPattern.test(email)) {
            showContactMsg(msg, 'Please enter a valid work email.', 'error');
            emailInput.focus();
            return;
        }

        showContactMsg(msg, 'Thanks! Our team will reach out within one business day.', 'success');
        form.reset();
    });
}

function showContactMsg(el, text, type) {
    el.hidden = false;
    el.textContent = text;
    el.classList.toggle('is-success', type === 'success');
    el.classList.toggle('is-error', type === 'error');
}

function initHeroRays() {
    const hero = document.querySelector('.hero');
    const beams = document.querySelector('.hero-rays-beams');
    const source = document.querySelector('.hero-rays-source');
    if (!hero || !beams || !source) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        beams.style.transform = `rotate(${(x - 0.2) * 7}deg) translateX(${(x - 0.2) * 36}px) scale(1.02)`;
        source.style.transform = `translate(${x * 22}px, ${y * 10}px) scale(1.04)`;
    });

    hero.addEventListener('mouseleave', () => {
        beams.style.transform = '';
        source.style.transform = '';
    });
}
