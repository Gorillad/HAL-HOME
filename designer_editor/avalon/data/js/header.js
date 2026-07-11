/**
 * Avalon header — mega menu hover / keyboard behavior (re-init after nav rebuild).
 */
(function () {
    'use strict';

    var nav = null;
    var docListenersBound = false;
    var closeTimer = null;

    function getNav() {
        return document.getElementById('avalonMegaNav');
    }

    function closeAll() {
        if (!nav) return;
        nav.querySelectorAll('.avalon-mega-nav__item[data-has-mega]').forEach(function (item) {
            item.classList.remove('is-open');
            var panel = item.querySelector('.avalon-mega-panel');
            var trigger = item.querySelector('.avalon-mega-nav__trigger');
            if (panel) panel.hidden = true;
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    }

    function openItem(item) {
        closeAll();
        item.classList.add('is-open');
        var panel = item.querySelector('.avalon-mega-panel');
        var trigger = item.querySelector('.avalon-mega-nav__trigger');
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

        nav.querySelectorAll('.avalon-mega-nav__item[data-has-mega]').forEach(function (item) {
            var trigger = item.querySelector('.avalon-mega-nav__trigger');
            if (!trigger || trigger.dataset.megaBound === '1') return;
            trigger.dataset.megaBound = '1';

            item.addEventListener('mouseenter', function () {
                clearTimeout(closeTimer);
                openItem(item);
            });

            item.addEventListener('mouseleave', function () {
                closeTimer = setTimeout(closeAll, 120);
            });

            trigger.addEventListener('focus', function () {
                clearTimeout(closeTimer);
                openItem(item);
            });
        });
    }

    window.__avalonMegaNavInit = initMegaNav;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMegaNav);
    } else {
        initMegaNav();
    }
})();
