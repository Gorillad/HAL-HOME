/**
 * IBC Master — Section One (Hero slideshow)
 * Exposes initHeroSlideshow() so the Designer editor can rebuild slides live.
 */
(function () {
  'use strict';

  var activeCleanup = null;

  function initHeroSlideshow(rootEl) {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }

    var root = rootEl || document.querySelector('[data-hero-slideshow]');
    if (!root) return;

    var track = root.querySelector('.hero__track');
    var prevBtn = root.querySelector('.hero__arrow--prev');
    var nextBtn = root.querySelector('.hero__arrow--next');

    function getSlides() {
      return Array.from(root.querySelectorAll('.hero__slide'));
    }

    function getDots() {
      return Array.from(root.querySelectorAll('.hero__dot'));
    }

    var slides = getSlides();
    if (!track || slides.length === 0) return;

    var index = slides.findIndex(function (s) { return s.classList.contains('is-active'); });
    if (index < 0) index = 0;

    var timer = null;
    var interval = 6000;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var handlers = [];

    function on(el, type, fn) {
      if (!el) return;
      el.addEventListener(type, fn);
      handlers.push([el, type, fn]);
    }

    function goTo(i) {
      slides = getSlides();
      var dots = getDots();
      if (!slides.length) return;

      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';

      slides.forEach(function (slide, n) {
        slide.classList.toggle('is-active', n === index);
        slide.setAttribute('aria-hidden', n === index ? 'false' : 'true');
      });

      dots.forEach(function (dot, n) {
        dot.classList.toggle('is-active', n === index);
        dot.setAttribute('aria-selected', n === index ? 'true' : 'false');
      });
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function stopAutoplay() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function startAutoplay() {
      if (reducedMotion || getSlides().length < 2) return;
      stopAutoplay();
      timer = window.setInterval(next, interval);
    }

    function onNextClick() { next(); startAutoplay(); }
    function onPrevClick() { prev(); startAutoplay(); }
    function onDotClick(i) {
      return function () {
        goTo(i);
        startAutoplay();
      };
    }
    function onMouseEnter() { stopAutoplay(); }
    function onMouseLeave() { startAutoplay(); }
    function onFocusIn() { stopAutoplay(); }
    function onFocusOut() { startAutoplay(); }
    function onKeydown(e) {
      if (!root.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
      if (e.key === 'ArrowRight') { next(); startAutoplay(); }
    }

    on(nextBtn, 'click', onNextClick);
    on(prevBtn, 'click', onPrevClick);
    getDots().forEach(function (dot, i) {
      on(dot, 'click', onDotClick(i));
    });
    on(root, 'mouseenter', onMouseEnter);
    on(root, 'mouseleave', onMouseLeave);
    on(root, 'focusin', onFocusIn);
    on(root, 'focusout', onFocusOut);
    on(document, 'keydown', onKeydown);

    activeCleanup = function () {
      stopAutoplay();
      handlers.forEach(function (entry) {
        entry[0].removeEventListener(entry[1], entry[2]);
      });
      handlers = [];
    };

    goTo(index);
    startAutoplay();
  }

  window.initHeroSlideshow = initHeroSlideshow;
  initHeroSlideshow();

  function initBrandsCarousel(rootEl) {
    var root = rootEl || document.querySelector('[data-brands-carousel]');
    if (!root) return;

    var track = root.querySelector('.brands__carousel-track');
    var brandsSection = root.closest('.brands');
    if (!track || !brandsSection) return;

    if (!track.children.length) {
      var cards = brandsSection.querySelectorAll('.brands__grid .brand-card');
      if (!cards.length) return;

      var allLink = brandsSection.querySelector('.brands__all');
      var allUrl = allLink ? allLink.getAttribute('href') || '/brands' : '/brands';
      var allLabel = allLink ? allLink.textContent.trim() || 'View all brands' : 'View all brands';

      var itemsHtml = Array.from(cards).map(function (card) {
        var img = card.querySelector('img');
        var href = card.getAttribute('href') || '#';
        var src = img ? img.getAttribute('src') || '' : '';
        var alt = img ? img.getAttribute('alt') || '' : '';
        return ''
          + '<a class="brand-carousel__item" href="' + href + '">'
          + '<img src="' + src + '" alt="' + alt + '" width="120" height="36" loading="lazy">'
          + '</a>';
      }).join('');

      var allHtml = ''
        + '<a class="brand-carousel__item brand-carousel__item--all" href="' + allUrl + '">'
        + '<span class="brand-carousel__all-label">' + allLabel + '</span>'
        + '<span class="brand-carousel__all-arrow" aria-hidden="true">→</span>'
        + '</a>';

      var groupHtml = itemsHtml + allHtml;
      track.innerHTML = ''
        + '<div class="brands__carousel-group" aria-hidden="true">' + groupHtml + '</div>'
        + '<div class="brands__carousel-group">' + groupHtml + '</div>';
    }

    var groupCount = root.querySelectorAll('.brands__carousel-group .brand-carousel__item:not(.brand-carousel__item--all)').length;
    var halfCount = Math.max(1, Math.floor(groupCount / 2));
    var duration = Math.max(36, Math.min(90, halfCount * 3));
    root.style.setProperty('--brands-carousel-duration', duration + 's');
  }

  window.initBrandsCarousel = initBrandsCarousel;
  initBrandsCarousel();
}());
