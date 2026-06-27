/**
 * IBC Master — Header JavaScript
 * Path: /data/js/header.js
 *
 * Handles:
 *  - Mega menu toggle (All Products button)
 *  - Mobile drawer toggle (hamburger)
 *  - Overlay show/hide
 *  - Close on Escape key
 *  - Close on outside click
 *  - Mobile search row injection
 */

(function () {
  'use strict';

  // ── Element refs ──────────────────────────────────────────────
  const allProdBtn     = document.querySelector('.all-prod-btn');
  const megaMenu       = document.getElementById('mega-menu');
  const hamburgerBtn   = document.querySelector('.hamburger-btn');
  const mobileDrawer   = document.getElementById('mobile-drawer');
  const overlay        = document.getElementById('header-overlay');

  // ── State ─────────────────────────────────────────────────────
  let megaOpen   = false;
  let drawerOpen = false;

  // ── Helpers ───────────────────────────────────────────────────

  function openMega() {
    if (drawerOpen) closeDrawer();
    megaOpen = true;
    megaMenu.hidden = false;
    allProdBtn.setAttribute('aria-expanded', 'true');
    showOverlay();
  }

  function closeMega() {
    megaOpen = false;
    megaMenu.hidden = true;
    allProdBtn.setAttribute('aria-expanded', 'false');
    if (!drawerOpen) hideOverlay();
  }

  function openDrawer() {
    if (megaOpen) closeMega();
    drawerOpen = true;
    mobileDrawer.hidden = false;
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Close navigation menu');
    showOverlay();
    setTimeout(() => mobileDrawer.querySelector('a, button')?.focus(), 50);
  }

  function closeDrawer() {
    drawerOpen = false;
    mobileDrawer.hidden = true;
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
    if (!megaOpen) hideOverlay();
  }

  function showOverlay() {
    overlay.classList.add('is-visible');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }

  function hideOverlay() {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function closeAll() {
    if (megaOpen)   closeMega();
    if (drawerOpen) closeDrawer();
  }

  // ── All Products — mega menu toggle ───────────────────────────
  if (allProdBtn && megaMenu) {
    allProdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (megaOpen) { closeMega(); } else { openMega(); }
    });
  }

  // ── Hamburger — mobile drawer toggle ──────────────────────────
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      if (drawerOpen) { closeDrawer(); } else { openDrawer(); }
    });
  }

  // ── Overlay click — close everything ──────────────────────────
  if (overlay) {
    overlay.addEventListener('click', closeAll);
  }

  // ── Escape key — close everything ─────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const wasMega   = megaOpen;
      const wasDrawer = drawerOpen;
      if (!wasMega && !wasDrawer) return;
      closeAll();
      if (wasDrawer) hamburgerBtn?.focus();
      else if (wasMega) allProdBtn?.focus();
    }
  });

  // ── Click outside mega menu (desktop) ─────────────────────────
  document.addEventListener('click', (e) => {
    if (
      megaOpen &&
      !megaMenu.contains(e.target) &&
      !allProdBtn.contains(e.target)
    ) {
      closeMega();
    }
  });

  // ── Mobile: inject search row into .main-nav__inner ───────────
  function injectMobileSearch() {
    const existing = document.querySelector('.mobile-search-row');
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      existing?.remove();
      return;
    }

    if (existing) return;

    const navInner = document.querySelector('.main-nav__center') || document.querySelector('.main-nav__inner');
    if (!navInner) return;

    const row = document.createElement('div');
    row.className = 'mobile-search-row';
    row.innerHTML = `
      <input
        type="search"
        placeholder="Enter keyword, item, model, or part #"
        aria-label="Search catalog"
        name="q"
      />
      <button type="button" aria-label="Search">
        <img src="data/images/icons/search-white.svg" alt="" width="17" height="17" />
      </button>
    `;

    const input  = row.querySelector('input');
    const button = row.querySelector('button');

    function submitSearch() {
      const term = input.value.trim();
      if (term) window.location.href = `/industrial-supplies?q=${encodeURIComponent(term)}`;
    }

    button.addEventListener('click', submitSearch);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitSearch(); });

    navInner.appendChild(row);
  }

  // ── Desktop search form submit ─────────────────────────────────
  const desktopSearchBtn   = document.querySelector('.search-btn');
  const desktopSearchInput = document.querySelector('.search-input');

  if (desktopSearchBtn && desktopSearchInput) {
    function submitDesktopSearch() {
      const term = desktopSearchInput.value.trim();
      if (term) window.location.href = `/industrial-supplies?q=${encodeURIComponent(term)}`;
    }

    desktopSearchBtn.addEventListener('click', submitDesktopSearch);
    desktopSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitDesktopSearch();
    });
  }

  // ── Responsive: mobile search injection ───────────────────────
  window.addEventListener('resize', injectMobileSearch);

  // ── Init ──────────────────────────────────────────────────────
  injectMobileSearch();

})();
