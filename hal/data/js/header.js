/**
 * LogicX Trend Catalog header — mobile hamburger + mega nav.
 * Uses document-level click delegation so it still works if XOLogic
 * injects the custom header after DOMContentLoaded.
 */
(function initCatalogHeader() {
    function setMobileMenu(open) {
        const header = document.querySelector('.trend-catalog-header');
        const menuToggle = document.querySelector('.trend-catalog-menu-toggle');
        const megaNav = document.querySelector('.sb-nav');

        if (!header) return false;

        header.classList.toggle('is-open', open);
        document.body.classList.toggle('catalog-header-open', open);
        megaNav?.classList.toggle('is-open', open);

        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', open ? 'Close catalog menu' : 'Open catalog menu');
        }

        return true;
    }

    function setHelpMenu(open) {
        const helpToggle = document.querySelector('.trend-catalog-help-toggle');
        const helpMenu = document.getElementById('expertHelpDropdown');
        if (!helpToggle || !helpMenu) return;
        helpToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        helpMenu.hidden = !open;
    }

    function bindDelegatedHandlers() {
        if (window.__lxoCatalogHeaderBound) return;
        window.__lxoCatalogHeaderBound = true;
        window.__lxoCatalogHeaderJs = true;

        document.addEventListener('click', (event) => {
            const menuToggle = event.target.closest('.trend-catalog-menu-toggle');
            if (menuToggle) {
                event.preventDefault();
                event.stopPropagation();
                const header = menuToggle.closest('.trend-catalog-header');
                setMobileMenu(Boolean(header && !header.classList.contains('is-open')));
                return;
            }

            const helpToggle = event.target.closest('.trend-catalog-help-toggle');
            if (helpToggle) {
                event.stopPropagation();
                const helpMenu = document.getElementById('expertHelpDropdown');
                setHelpMenu(Boolean(helpMenu?.hidden));
            }
        }, true);

        document.addEventListener('click', (event) => {
            const helpMenu = document.getElementById('expertHelpDropdown');
            if (helpMenu && !helpMenu.hidden && !event.target.closest('.trend-catalog-help')) {
                setHelpMenu(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            setHelpMenu(false);
            setMobileMenu(false);
        });

        document.querySelectorAll('.sb-nav a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 1023px)').matches) {
                    setMobileMenu(false);
                    setHelpMenu(false);
                }
            });
        });

        window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
            if (event.matches) {
                setMobileMenu(false);
                setHelpMenu(false);
            }
        });
    }

    bindDelegatedHandlers();
}());
