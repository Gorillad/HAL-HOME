/**
 * Avalon Motion Pack — hero entrance, Ken Burns, scroll reveal, header glass, CTA shimmer.
 */
(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var html = document.documentElement;
    var HERO_KEY = 'avalon-hero-entered';

    var STAGGER_GROUPS = [
        { root: '.avalon-trust__list', items: '.avalon-trust__item', delay: 80 },
        { root: '.avalon-s2-grid', items: '.avalon-s2-card', delay: 100 },
        { root: '.avalon-reviews__grid', items: '.avalon-review-card', delay: 120 },
        { root: '.avalon-expert__gallery', items: '.avalon-expert__figure', delay: 90 },
    ];

    var REVEAL_SELECTORS = [
        '.avalon-trade__inner',
        '.avalon-brands__inner',
        '.avalon-catalog-intro',
        '.avalon-s2-gallery',
        '.avalon-story__col--brand',
        '.avalon-story__col--voice',
        '.avalon-reviews__intro',
        '.avalon-expert__content',
        '.avalon-footer__masthead',
        '.avalon-footer__newsletter-inner',
    ];

    var RULE_SELECTORS = [
        '.avalon-deco-rule',
        '.avalon-story__rule',
        '.avalon-hero-primary-rule',
    ];

    var SHIMMER_SELECTORS = [
        '.avalon-hero-primary-cta',
        '.avalon-trade__cta',
        '.avalon-s2-gallery__cta',
        '.avalon-story__cta',
        '.avalon-expert__cta',
        '.avalon-footer__newsletter-btn',
    ];

    function markShimmerTargets() {
        SHIMMER_SELECTORS.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                el.classList.add('avalon-motion-shimmer');
            });
        });
    }

    function initHeroEntrance() {
        var primary = document.querySelector('.avalon-hero-primary');
        var heroRule = document.querySelector('.avalon-hero-primary-rule');
        if (heroRule) heroRule.classList.add('avalon-motion-rule');

        if (reduced) {
            html.classList.add('avalon-hero-entered');
            if (primary) primary.classList.add('is-ken-burns');
            if (heroRule) heroRule.classList.add('is-motion-visible');
            return;
        }

        html.classList.add('avalon-motion-enabled');

        var seen = false;
        try { seen = sessionStorage.getItem(HERO_KEY) === '1'; } catch (e) { /* private mode */ }

        if (seen) {
            html.classList.add('avalon-hero-entered');
            if (primary) primary.classList.add('is-ken-burns');
            if (heroRule) heroRule.classList.add('is-motion-visible');
            return;
        }

        requestAnimationFrame(function () {
            html.classList.add('avalon-hero-entered');
            if (primary) primary.classList.add('is-ken-burns');
            if (heroRule) heroRule.classList.add('is-motion-visible');
            try { sessionStorage.setItem(HERO_KEY, '1'); } catch (e) { /* ignore */ }
        });
    }

    function initScrollHeader() {
        var header = document.getElementById('avalonSiteHeader');
        if (!header) return;

        var threshold = 48;

        function onScroll() {
            header.classList.toggle('is-scrolled', window.scrollY > threshold);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initReveals() {
        if (reduced) return;

        REVEAL_SELECTORS.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                el.classList.add('avalon-motion-reveal');
            });
        });

        STAGGER_GROUPS.forEach(function (group) {
            var root = document.querySelector(group.root);
            if (!root) return;

            root.querySelectorAll(group.items).forEach(function (el, index) {
                el.classList.add('avalon-motion-reveal');
                el.style.setProperty('--motion-delay', (index * group.delay) + 'ms');
            });
        });

        RULE_SELECTORS.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                if (!el.classList.contains('avalon-motion-rule')) {
                    el.classList.add('avalon-motion-rule');
                }
            });
        });

        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.avalon-motion-reveal, .avalon-motion-rule').forEach(function (el) {
                el.classList.add('is-motion-visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-motion-visible');
                observer.unobserve(entry.target);
            });
        }, {
            root: null,
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.12,
        });

        document.querySelectorAll('.avalon-motion-reveal, .avalon-motion-rule').forEach(function (el) {
            if (el.classList.contains('avalon-hero-primary-rule') && html.classList.contains('avalon-hero-entered')) {
                return;
            }
            observer.observe(el);
        });
    }

    function initKenBurnsPause() {
        var img = document.querySelector('.avalon-hero-primary.is-ken-burns > img');
        if (!img) return;

        document.addEventListener('visibilitychange', function () {
            img.classList.toggle('is-paused', document.hidden);
        });
    }

    function init() {
        if (reduced) {
            html.classList.add('avalon-motion-reduced', 'avalon-hero-entered');
        }

        markShimmerTargets();
        initHeroEntrance();
        initScrollHeader();
        initReveals();
        initKenBurnsPause();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
