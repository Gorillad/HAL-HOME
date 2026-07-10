/**
 * Avalon — Featured brands infinite marquee carousel.
 */
(function () {
    'use strict';

    var MARQUEE_ID = 'avalonBrandsMarquee';
    var GROUP_ID = 'avalonBrandsMarqueeGroup';
    var SCROLL_SPEED = 36;
    var resizeTimer = null;

    function getMarquee() {
        return document.getElementById(MARQUEE_ID);
    }

    function getGroup() {
        return document.getElementById(GROUP_ID);
    }

    function visibleBrandCount(group) {
        if (!group) return 0;
        return group.querySelectorAll('.avalon-brands__link:not(.is-hidden)').length;
    }

    function refreshMarquee() {
        var marquee = getMarquee();
        var group = getGroup();
        if (!marquee || !group) return;

        marquee.querySelectorAll('.avalon-brands__marquee-group--clone').forEach(function (el) {
            el.remove();
        });

        marquee.classList.remove('is-animated');
        marquee.style.removeProperty('--avalon-brands-duration');
        marquee.style.transform = '';

        if (visibleBrandCount(group) < 2) return;

        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        var clone = group.cloneNode(true);
        clone.classList.add('avalon-brands__marquee-group--clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('id');
        clone.querySelectorAll('[id]').forEach(function (el) {
            el.removeAttribute('id');
        });
        marquee.appendChild(clone);

        var groupWidth = group.getBoundingClientRect().width;
        if (groupWidth <= 0) return;

        var duration = Math.max(24, groupWidth / SCROLL_SPEED);
        marquee.style.setProperty('--avalon-brands-duration', duration + 's');
        marquee.classList.add('is-animated');
    }

    function scheduleRefresh() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refreshMarquee, 120);
    }

    function init() {
        requestAnimationFrame(function () {
            refreshMarquee();
        });

        window.addEventListener('resize', scheduleRefresh, { passive: true });

        document.addEventListener('visibilitychange', function () {
            var marquee = getMarquee();
            if (!marquee) return;
            marquee.style.animationPlayState = document.hidden ? 'paused' : 'running';
        });
    }

    window.__avalonBrandsRefresh = refreshMarquee;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
