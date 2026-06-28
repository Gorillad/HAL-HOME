/**
 * IBC Master — Section Three (Catalog Library carousel)
 */
(function () {
  'use strict';

  var activeCleanup = null;

  function initCatalogCarousel(rootEl) {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }

    var root = rootEl || document.querySelector('[data-catalog-carousel]');
    if (!root) return;

    var track = root.querySelector('.catalog-library__track');
    var viewport = root.querySelector('.catalog-library__viewport');
    var prevBtn = root.querySelector('.catalog-library__arrow--prev');
    var nextBtn = root.querySelector('.catalog-library__arrow--next');
    if (!track || !viewport) return;

    var cards = Array.from(track.querySelectorAll('.catalog-card'));
    var count = cards.length;

    root.classList.toggle('is-single', count <= 1);
    root.classList.toggle('is-carousel', count > 1);

    if (count <= 1) return;

    var index = 0;
    var handlers = [];

    function on(el, type, fn) {
      if (!el) return;
      el.addEventListener(type, fn);
      handlers.push([el, type, fn]);
    }

    function getPerView() {
      var w = viewport.clientWidth;
      if (w >= 1024) return Math.min(4, count);
      if (w >= 640) return Math.min(2, count);
      return 1;
    }

    function maxIndex() {
      return Math.max(0, count - getPerView());
    }

    function stepSize() {
      var card = track.querySelector('.catalog-card');
      if (!card) return 0;
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      return card.offsetWidth + gap;
    }

    function layoutCards() {
      var perView = getPerView();
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      var cardWidth = (viewport.clientWidth - gap * (perView - 1)) / perView;
      cards.forEach(function (card) {
        card.style.flexBasis = cardWidth + 'px';
        card.style.maxWidth = cardWidth + 'px';
      });
    }

    function update() {
      layoutCards();
      index = Math.min(index, maxIndex());
      track.style.transform = 'translateX(' + (-index * stepSize()) + 'px)';
      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= maxIndex();
    }

    function onPrev() {
      index = Math.max(0, index - 1);
      update();
    }

    function onNext() {
      index = Math.min(maxIndex(), index + 1);
      update();
    }

    function onResize() {
      update();
    }

    function onKeydown(e) {
      if (!root.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
    }

    on(prevBtn, 'click', onPrev);
    on(nextBtn, 'click', onNext);
    on(window, 'resize', onResize);
    on(document, 'keydown', onKeydown);

    activeCleanup = function () {
      handlers.forEach(function (entry) {
        entry[0].removeEventListener(entry[1], entry[2]);
      });
      handlers = [];
      track.style.transform = '';
      cards.forEach(function (card) {
        card.style.flexBasis = '';
        card.style.maxWidth = '';
      });
    };

    update();
  }

  window.initCatalogCarousel = initCatalogCarousel;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initCatalogCarousel(); });
  } else {
    initCatalogCarousel();
  }
}());
