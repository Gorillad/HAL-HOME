/**
 * Classic (gallery) header — phone menu toggle + accordion dropdowns.
 * Loaded via Meta Data: /data/logicx/js/gallery-nav.js
 */
(function initGalleryNav(global) {
    var PHONE_MQ = '(max-width: 700px)';
    var bound = false;

    function isPhone() {
        return global.matchMedia && global.matchMedia(PHONE_MQ).matches;
    }

    function findBars(root) {
        var scope = root && root.querySelectorAll ? root : document;
        return Array.prototype.slice.call(scope.querySelectorAll('.showroom-gallery-primary-bar'));
    }

    function setNavOpen(bar, open) {
        if (!bar) return;
        bar.classList.toggle('is-nav-open', open);
        var toggle = bar.querySelector('.showroom-gallery-menu-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }
        if (!open) {
            bar.querySelectorAll('.showroom-main-nav-item.is-open').forEach(function (item) {
                item.classList.remove('is-open');
            });
        }
    }

    function closeAll(root) {
        findBars(root).forEach(function (bar) {
            setNavOpen(bar, false);
        });
    }

    function onDocumentClick(event) {
        var toggle = event.target.closest && event.target.closest('.showroom-gallery-menu-toggle');
        if (toggle) {
            var bar = toggle.closest('.showroom-gallery-primary-bar');
            if (!bar) return;
            event.preventDefault();
            setNavOpen(bar, !bar.classList.contains('is-nav-open'));
            return;
        }

        if (!isPhone()) return;

        var trigger = event.target.closest && event.target.closest('.showroom-gallery-main-nav-links .showroom-main-nav-item.has-dropdown > .showroom-main-nav-trigger');
        if (trigger) {
            var item = trigger.closest('.showroom-main-nav-item');
            var bar = trigger.closest('.showroom-gallery-primary-bar');
            if (!item || !bar || !bar.classList.contains('is-nav-open')) return;
            // Expand/collapse on phone; subcategory links still navigate normally.
            event.preventDefault();
            var opening = !item.classList.contains('is-open');
            bar.querySelectorAll('.showroom-main-nav-item.is-open').forEach(function (openItem) {
                if (openItem !== item) openItem.classList.remove('is-open');
            });
            item.classList.toggle('is-open', opening);
        }
    }

    function onKeydown(event) {
        if (event.key === 'Escape') closeAll(document);
    }

    function onResize() {
        if (!isPhone()) closeAll(document);
    }

    function bind() {
        if (bound || typeof document === 'undefined') return;
        bound = true;
        document.addEventListener('click', onDocumentClick);
        document.addEventListener('keydown', onKeydown);
        global.addEventListener('resize', onResize);
    }

    function init() {
        bind();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    global.ShowroomGalleryNav = {
        init: init,
        closeAll: closeAll,
        setNavOpen: setNavOpen,
    };
}(typeof window !== 'undefined' ? window : this));
