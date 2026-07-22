/**
 * McQueen Plus — mega menu open / close (hover + keyboard).
 */
(function () {
    'use strict';

    function getNav() {
        return document.getElementById('mqPlusMegaNav');
    }

    function closeAll(exceptItem) {
        var nav = getNav();
        if (!nav) return;
        nav.querySelectorAll('.mq-plus-mega-nav__item[data-has-mega]').forEach(function (item) {
            if (exceptItem && item === exceptItem) return;
            var panel = item.querySelector('.mq-plus-mega-panel');
            var trigger = item.querySelector('.mq-plus-mega-nav__trigger');
            item.classList.remove('is-open');
            if (panel) panel.hidden = true;
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    }

    function openItem(item) {
        if (!item || !item.hasAttribute('data-has-mega')) return;
        closeAll(item);
        var panel = item.querySelector('.mq-plus-mega-panel');
        var trigger = item.querySelector('.mq-plus-mega-nav__trigger');
        item.classList.add('is-open');
        if (panel) panel.hidden = false;
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    function initMegaNav() {
        var nav = getNav();
        if (!nav) return;

        nav.querySelectorAll('.mq-plus-mega-nav__item[data-has-mega]').forEach(function (item) {
            var trigger = item.querySelector('.mq-plus-mega-nav__trigger');
            if (!trigger || trigger.dataset.megaBound === '1') return;
            trigger.dataset.megaBound = '1';

            item.addEventListener('mouseenter', function () { openItem(item); });
            item.addEventListener('mouseleave', function () { closeAll(); });

            trigger.addEventListener('click', function (event) {
                if (!item.hasAttribute('data-has-mega')) return;
                var isOpen = item.classList.contains('is-open');
                if (!isOpen) {
                    event.preventDefault();
                    openItem(item);
                }
            });

            trigger.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') {
                    closeAll();
                    trigger.focus();
                }
            });
        });

        document.addEventListener('click', function (event) {
            if (!nav.contains(event.target)) closeAll();
        });
    }

    window.__mqPlusMegaNavInit = initMegaNav;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMegaNav);
    } else {
        initMegaNav();
    }
})();
