/**
 * LogicXO shared footer — auto year, newsletter feedback, back-to-top.
 */
const Footer = (() => {
    function initYear() {
        const yearEl = document.getElementById('footerYear');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }

    function initNewsletter() {
        const form = document.getElementById('footerNewsletter');
        const input = document.getElementById('footerEmail');
        const msg = document.getElementById('footerNewsletterMsg');
        if (!form || !input || !msg) return;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = input.value.trim();

            if (!emailPattern.test(value)) {
                msg.hidden = false;
                msg.textContent = 'Please enter a valid email address.';
                msg.classList.add('is-error');
                msg.classList.remove('is-success');
                input.focus();
                return;
            }

            msg.hidden = false;
            msg.textContent = 'Thanks! You are on the list.';
            msg.classList.add('is-success');
            msg.classList.remove('is-error');
            form.reset();
        });
    }

    function initBackToTop() {
        const btn = document.getElementById('footerBackToTop');
        if (!btn) return;
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function load() {
        initYear();
        initNewsletter();
        initBackToTop();
    }

    return { load };
})();
