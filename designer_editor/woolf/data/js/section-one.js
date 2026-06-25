/**
 * IBC Master — Section One (Hero slideshow)
 */
(function () {
  'use strict';

  const root = document.querySelector('[data-hero-slideshow]');
  if (!root) return;

  const track   = root.querySelector('.hero__track');
  const slides  = Array.from(root.querySelectorAll('.hero__slide'));
  const dots    = Array.from(root.querySelectorAll('.hero__dot'));
  const prevBtn = root.querySelector('.hero__arrow--prev');
  const nextBtn = root.querySelector('.hero__arrow--next');

  if (!track || slides.length === 0) return;

  let index = slides.findIndex((s) => s.classList.contains('is-active'));
  if (index < 0) index = 0;

  let timer = null;
  const interval = 6000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, n) => {
      slide.classList.toggle('is-active', n === index);
      slide.setAttribute('aria-hidden', n === index ? 'false' : 'true');
    });

    dots.forEach((dot, n) => {
      dot.classList.toggle('is-active', n === index);
      dot.setAttribute('aria-selected', n === index ? 'true' : 'false');
    });
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    if (reducedMotion || slides.length < 2) return;
    stopAutoplay();
    timer = window.setInterval(next, interval);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  nextBtn?.addEventListener('click', () => { next(); startAutoplay(); });
  prevBtn?.addEventListener('click', () => { prev(); startAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAutoplay();
    });
  });

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  document.addEventListener('keydown', (e) => {
    if (!root.contains(document.activeElement) && document.activeElement !== document.body) return;
    if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
    if (e.key === 'ArrowRight') { next(); startAutoplay(); }
  });

  goTo(index);
  startAutoplay();
})();
