document.addEventListener('DOMContentLoaded', () => {
    initEditorSiteNav();
});

function initEditorSiteNav() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.site-nav-toggle');
    const panel = document.getElementById('site-nav-panel');
    const backdrop = document.querySelector('.site-nav-backdrop');
    if (!nav || !toggle || !panel || !backdrop) return;

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

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) closeMenu();
        else openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    panel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            closeMenu();
            toggle.focus();
        }
    });

    window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
        if (e.matches) closeMenu();
    });
}
