/**
 * Avalon header — mega menu hover / keyboard behavior.
 */
(function () {
    'use strict';

    var nav = document.getElementById('avalonMegaNav');
    if (!nav) return;

    var items = nav.querySelectorAll('.avalon-mega-nav__item[data-has-mega]');
    var closeTimer = null;

    function closeAll() {
        items.forEach(function (item) {
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

    items.forEach(function (item) {
        var trigger = item.querySelector('.avalon-mega-nav__trigger');
        if (!trigger) return;

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

    nav.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAll();
    });

    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) closeAll();
    });
})();
