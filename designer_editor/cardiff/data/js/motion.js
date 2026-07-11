/**
 * Cardiff motion — scroll reveal + sticky header glass.
 */
(function () {
    'use strict';

    function initReveal() {
        var nodes = document.querySelectorAll('.cardiff-reveal');
        if (!nodes.length || !('IntersectionObserver' in window)) {
            nodes.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        nodes.forEach(function (el) { io.observe(el); });
    }

    function initHeader() {
        var header = document.getElementById('cardiffSiteHeader');
        if (!header) return;
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 12);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function init() {
        initReveal();
        initHeader();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
