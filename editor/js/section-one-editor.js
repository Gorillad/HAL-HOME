/**
 * Designer Editor — Section One (Hero / Slideshow)
 * Handles:
 *  - Section nav tab switching (Header ↔ Section One)
 *  - Live preview updates via postMessage to the section-one-preview iframe
 *  - Draft load/save (piggy-backs on the main designer draft, namespace "s1")
 *  - Slide background image upload
 */

(function () {
  'use strict';

  /* ── Constants ───────────────────────────────────────────────── */

  const TEMPLATE = window.__designerSlug || 'woolf';

  const DEFAULTS = {
    slide0Eyebrow: '500,000+ SKUs',
    slide0Title:   'Industrial supplies for every job site and shop floor',
    slide0Text:    'From cutting tools to safety gear — source what you need from one trusted catalog with fast shipping and expert support.',
    slide0Btn1Label: 'Browse Catalog',
    slide0Btn1Url:   '/catalog',
    slide0Btn2Label: 'Request a Quote',
    slide0Btn2Url:   '/contact',
    slide0BgSrc:   '',

    slide1Eyebrow: 'Safety & PPE',
    slide1Title:   'Keep your team protected and compliant',
    slide1Text:    'Gloves, eye protection, fall protection, respiratory, and more — stocked for industrial, construction, and manufacturing environments.',
    slide1Btn1Label: 'Shop Safety',
    slide1Btn1Url:   '/industrial-supplies?category=Safety',
    slide1Btn2Label: 'Browse All Categories',
    slide1Btn2Url:   '/catalog',
    slide1BgSrc:   '',

    slide2Eyebrow: 'Cutting & Machining',
    slide2Title:   'Precision tooling for production and maintenance',
    slide2Text:    'Milling, turning, threading, holemaking, and workholding — the brands and part numbers your machinists rely on.',
    slide2Btn1Label: 'Shop Cutting Tools',
    slide2Btn1Url:   '/industrial-supplies?category=Cutting+Tools',
    slide2Btn2Label: 'Browse Milling',
    slide2Btn2Url:   '/industrial-supplies?category=Milling',
    slide2BgSrc:   '',

    trust0Text: 'Fast shipping nationwide',
    trust1Text: 'Trusted industrial brands',
    trust2Text: 'Dedicated account support',

    catsTitle:    'Shop by Category',
    catsSubtitle: 'Browse our most popular product lines',
  };

  /* ── State ───────────────────────────────────────────────────── */

  let draft = Object.assign({}, DEFAULTS);
  let autosaveTimer = null;
  let frameReady = false;
  let pendingMessages = [];

  /* ── DOM refs ────────────────────────────────────────────────── */

  const frame         = document.getElementById('woolSectionOneFrame');
  const frameWrap     = document.getElementById('woolSectionOnePreviewWrap');
  const headerWrap    = document.getElementById('woolPreviewWrap');
  const sectionHeader = document.getElementById('woolSectionHeader');
  const sectionOne    = document.getElementById('woolSectionOne');
  const tabBtns       = document.querySelectorAll('[data-section]');

  /* ── Section tab switching ───────────────────────────────────── */

  function activateSection(section) {
    tabBtns.forEach((btn) => {
      const isActive = btn.dataset.section === section;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (section === 'header') {
      sectionHeader.hidden = false;
      sectionOne.hidden    = true;
      headerWrap.hidden    = false;
      frameWrap.hidden     = true;
    } else if (section === 'sectionOne') {
      sectionHeader.hidden = true;
      sectionOne.hidden    = false;
      headerWrap.hidden    = true;
      frameWrap.hidden     = false;
    }
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => activateSection(btn.dataset.section));
  });

  /* ── postMessage bridge to the preview iframe ────────────────── */

  function sendToFrame(payload) {
    if (!frameReady) {
      pendingMessages.push(payload);
      return;
    }
    try {
      frame.contentWindow.postMessage({ type: 's1Update', payload }, '*');
    } catch (_) {}
  }

  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 's1Ready') {
      frameReady = true;
      pendingMessages.forEach((msg) => {
        try { frame.contentWindow.postMessage({ type: 's1Update', payload: msg }, '*'); } catch (_) {}
      });
      pendingMessages = [];
      sendFullState();
    }
  });

  frame.addEventListener('load', () => {
    frameReady = false;
  });

  function sendFullState() {
    sendToFrame({ all: draft });
  }

  /* ── Apply a single field to the live preview ───────────────── */

  const FIELD_MAP = {
    slide0Eyebrow:  (v) => ({ id: 's1-s0-eyebrow', text: v }),
    slide0Title:    (v) => ({ id: 's1-s0-title',   text: v }),
    slide0Text:     (v) => ({ id: 's1-s0-text',    text: v }),
    slide0Btn1Label:(v) => ({ id: 's1-s0-btn1',    text: v }),
    slide0Btn1Url:  (v) => ({ id: 's1-s0-btn1',    href: v }),
    slide0Btn2Label:(v) => ({ id: 's1-s0-btn2',    text: v }),
    slide0Btn2Url:  (v) => ({ id: 's1-s0-btn2',    href: v }),
    slide0BgSrc:    (v) => ({ id: 's1-slide-0',    bgSrc: v }),

    slide1Eyebrow:  (v) => ({ id: 's1-s1-eyebrow', text: v }),
    slide1Title:    (v) => ({ id: 's1-s1-title',   text: v }),
    slide1Text:     (v) => ({ id: 's1-s1-text',    text: v }),
    slide1Btn1Label:(v) => ({ id: 's1-s1-btn1',    text: v }),
    slide1Btn1Url:  (v) => ({ id: 's1-s1-btn1',    href: v }),
    slide1Btn2Label:(v) => ({ id: 's1-s1-btn2',    text: v }),
    slide1Btn2Url:  (v) => ({ id: 's1-s1-btn2',    href: v }),
    slide1BgSrc:    (v) => ({ id: 's1-slide-1',    bgSrc: v }),

    slide2Eyebrow:  (v) => ({ id: 's1-s2-eyebrow', text: v }),
    slide2Title:    (v) => ({ id: 's1-s2-title',   text: v }),
    slide2Text:     (v) => ({ id: 's1-s2-text',    text: v }),
    slide2Btn1Label:(v) => ({ id: 's1-s2-btn1',    text: v }),
    slide2Btn1Url:  (v) => ({ id: 's1-s2-btn1',    href: v }),
    slide2Btn2Label:(v) => ({ id: 's1-s2-btn2',    text: v }),
    slide2Btn2Url:  (v) => ({ id: 's1-s2-btn2',    href: v }),
    slide2BgSrc:    (v) => ({ id: 's1-slide-2',    bgSrc: v }),

    trust0Text:  (v) => ({ id: 's1-trust-0-text', text: v }),
    trust1Text:  (v) => ({ id: 's1-trust-1-text', text: v }),
    trust2Text:  (v) => ({ id: 's1-trust-2-text', text: v }),

    catsTitle:    (v) => ({ id: 's1-cats-heading', text: v }),
    catsSubtitle: (v) => ({ id: 's1-cats-subtitle', text: v }),
  };

  function applyS1Field(key, value) {
    draft[key] = value;
    const mapper = FIELD_MAP[key];
    if (mapper) sendToFrame(mapper(value));
    scheduleAutosave();
  }

  /* ── Input listeners ─────────────────────────────────────────── */

  document.querySelectorAll('[data-s1-field]').forEach((el) => {
    const key = el.dataset.s1Field;
    const evType = (el.tagName === 'TEXTAREA' || el.type === 'text') ? 'input' : 'change';
    el.addEventListener(evType, () => applyS1Field(key, el.value));
  });

  /* ── Slide background image upload ──────────────────────────── */

  const BG_SLOTS = [
    { fileInput: 'df-s1-s0-bg', thumbImg: 's1Slide0BgImg', thumbEmpty: 's1Slide0BgEmpty', removeBtn: 's1Slide0BgRemoveBtn', field: 'slide0BgSrc' },
    { fileInput: 'df-s1-s1-bg', thumbImg: 's1Slide1BgImg', thumbEmpty: 's1Slide1BgEmpty', removeBtn: 's1Slide1BgRemoveBtn', field: 'slide1BgSrc' },
    { fileInput: 'df-s1-s2-bg', thumbImg: 's1Slide2BgImg', thumbEmpty: 's1Slide2BgEmpty', removeBtn: 's1Slide2BgRemoveBtn', field: 'slide2BgSrc' },
  ];

  BG_SLOTS.forEach(({ fileInput, thumbImg, thumbEmpty, removeBtn, field }) => {
    const inputEl   = document.getElementById(fileInput);
    const imgEl     = document.getElementById(thumbImg);
    const emptyEl   = document.getElementById(thumbEmpty);
    const removeEl  = document.getElementById(removeBtn);
    if (!inputEl) return;

    inputEl.addEventListener('change', () => {
      const file = inputEl.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target.result;
        imgEl.src = src;
        imgEl.hidden = false;
        emptyEl.hidden = true;
        removeEl.hidden = false;
        applyS1Field(field, src);
      };
      reader.readAsDataURL(file);
    });

    removeEl.addEventListener('click', () => {
      inputEl.value = '';
      imgEl.src = '';
      imgEl.hidden = true;
      emptyEl.hidden = false;
      removeEl.hidden = true;
      applyS1Field(field, '');
    });
  });

  /* ── Draft persistence ───────────────────────────────────────── */

  function showToast(msg) {
    const toast = document.getElementById('saveToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  function scheduleAutosave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(saveDraft, 1400);
  }

  async function saveDraft() {
    try {
      const body = Object.assign({}, window.__woolDraft || {}, { _s1: draft, _template: TEMPLATE });
      await fetch(`/api/designer/draft?template=${TEMPLATE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      showToast('Draft saved');
    } catch (_) {
      showToast('Save failed — check connection');
    }
  }

  async function loadDraft() {
    try {
      const res = await fetch(`/api/designer/draft?template=${TEMPLATE}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data._s1) {
        Object.assign(draft, data._s1);
      }
    } catch (_) {}
    populateFields();
  }

  function populateFields() {
    document.querySelectorAll('[data-s1-field]').forEach((el) => {
      const key = el.dataset.s1Field;
      if (draft[key] !== undefined) el.value = draft[key];
    });

    BG_SLOTS.forEach(({ thumbImg, thumbEmpty, removeBtn, field }) => {
      const src = draft[field];
      if (!src) return;
      const imgEl    = document.getElementById(thumbImg);
      const emptyEl  = document.getElementById(thumbEmpty);
      const removeEl = document.getElementById(removeBtn);
      if (imgEl) { imgEl.src = src; imgEl.hidden = false; }
      if (emptyEl) emptyEl.hidden = true;
      if (removeEl) removeEl.hidden = false;
    });
  }

  /* ── Expose draft to main designer-editor for combined save ─── */
  Object.defineProperty(window, '__s1Draft', { get: () => draft });

  /* ── Init ────────────────────────────────────────────────────── */

  loadDraft();

})();
