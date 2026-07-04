(function initTrendCatalogPage() {
    function boot() {
        const header = document.querySelector('.trend-catalog-header');
        const menuToggle = document.querySelector('.trend-catalog-menu-toggle');
        const actions = document.getElementById('trendCatalogActions');
        const helpToggle = document.querySelector('.trend-catalog-help-toggle');
        const helpMenu = document.getElementById('expertHelpDropdown');

        if (!header) return;

        function setMobileMenu(open) {
            if (!menuToggle || !actions) return;
            header.classList.toggle('is-open', open);
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', open ? 'Close catalog menu' : 'Open catalog menu');
        }

        function setHelpMenu(open) {
            if (!helpToggle || !helpMenu) return;
            helpToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            helpMenu.hidden = !open;
        }

        menuToggle?.addEventListener('click', () => {
            setMobileMenu(!header.classList.contains('is-open'));
        });

        helpToggle?.addEventListener('click', (event) => {
            event.stopPropagation();
            setHelpMenu(helpMenu?.hidden);
        });

        document.addEventListener('click', (event) => {
            if (helpMenu && !helpMenu.hidden && !event.target.closest('.trend-catalog-help')) {
                setHelpMenu(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            setHelpMenu(false);
            setMobileMenu(false);
        });

        window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
            if (event.matches) setMobileMenu(false);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
}());
