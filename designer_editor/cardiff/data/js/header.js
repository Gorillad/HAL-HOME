/**
 * Cardiff header — mega menu hover / keyboard behavior.
 */
(function () {
    'use strict';

    var nav = null;
    var docListenersBound = false;
    var closeTimer = null;

    function getNav() {
        return document.getElementById('cardiffMainNav');
    }

    function closeAll() {
        if (!nav) return;
        nav.querySelectorAll('.cardiff-nav__item[data-has-mega]').forEach(function (item) {
            item.classList.remove('is-open');
            var panel = item.querySelector('.cardiff-mega-panel');
            var trigger = item.querySelector('.cardiff-nav__link');
            if (panel) panel.hidden = true;
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    }

    function openItem(item) {
        closeAll();
        item.classList.add('is-open');
        var panel = item.querySelector('.cardiff-mega-panel');
        var trigger = item.querySelector('.cardiff-nav__link');
        if (panel) panel.hidden = false;
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    function bindDocListeners() {
        if (docListenersBound) return;
        docListenersBound = true;

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeAll();
        });

        document.addEventListener('click', function (e) {
            if (nav && !nav.contains(e.target)) closeAll();
        });
    }

    function initMegaNav() {
        nav = getNav();
        if (!nav) return;

        bindDocListeners();

        nav.querySelectorAll('.cardiff-nav__item[data-has-mega]').forEach(function (item) {
            var trigger = item.querySelector('.cardiff-nav__link');
            if (!trigger || trigger.dataset.megaBound === '1') return;
            trigger.dataset.megaBound = '1';

            item.addEventListener('mouseenter', function () {
                clearTimeout(closeTimer);
                openItem(item);
            });

            item.addEventListener('mouseleave', function () {
                closeTimer = setTimeout(closeAll, 160);
            });

            trigger.addEventListener('focus', function () {
                clearTimeout(closeTimer);
                openItem(item);
            });
        });
    }

    window.__cardiffMegaNavInit = initMegaNav;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMegaNav);
    } else {
        initMegaNav();
    }
})();
