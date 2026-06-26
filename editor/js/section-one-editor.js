/**
 * Designer Editor — Section One (Hero / Slideshow)
 *
 * Thin config layer over createSectionEditor (section-editor-base.js). The base
 * handles same-origin DOM writes into the preview iframe, height fitting, and
 * the namespaced draft merge. This file supplies the Woolf Section One field
 * map plus the header/sectionOne tab switching for the preview pane.
 */
(function () {
  'use strict';

  if (typeof window.createSectionEditor !== 'function') return;

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

  const FIELD_MAP = {
    slide0Eyebrow:   { id: 's1-s0-eyebrow', prop: 'text' },
    slide0Title:     { id: 's1-s0-title',   prop: 'text' },
    slide0Text:      { id: 's1-s0-text',    prop: 'text' },
    slide0Btn1Label: { id: 's1-s0-btn1',    prop: 'text' },
    slide0Btn1Url:   { id: 's1-s0-btn1',    prop: 'href' },
    slide0Btn2Label: { id: 's1-s0-btn2',    prop: 'text' },
    slide0Btn2Url:   { id: 's1-s0-btn2',    prop: 'href' },
    slide0BgSrc:     { id: 's1-slide-0',    prop: 'bg'   },

    slide1Eyebrow:   { id: 's1-s1-eyebrow', prop: 'text' },
    slide1Title:     { id: 's1-s1-title',   prop: 'text' },
    slide1Text:      { id: 's1-s1-text',    prop: 'text' },
    slide1Btn1Label: { id: 's1-s1-btn1',    prop: 'text' },
    slide1Btn1Url:   { id: 's1-s1-btn1',    prop: 'href' },
    slide1Btn2Label: { id: 's1-s1-btn2',    prop: 'text' },
    slide1Btn2Url:   { id: 's1-s1-btn2',    prop: 'href' },
    slide1BgSrc:     { id: 's1-slide-1',    prop: 'bg'   },

    slide2Eyebrow:   { id: 's1-s2-eyebrow', prop: 'text' },
    slide2Title:     { id: 's1-s2-title',   prop: 'text' },
    slide2Text:      { id: 's1-s2-text',    prop: 'text' },
    slide2Btn1Label: { id: 's1-s2-btn1',    prop: 'text' },
    slide2Btn1Url:   { id: 's1-s2-btn1',    prop: 'href' },
    slide2Btn2Label: { id: 's1-s2-btn2',    prop: 'text' },
    slide2Btn2Url:   { id: 's1-s2-btn2',    prop: 'href' },
    slide2BgSrc:     { id: 's1-slide-2',    prop: 'bg'   },

    trust0Text:  { id: 's1-trust-0-text', prop: 'text' },
    trust1Text:  { id: 's1-trust-1-text', prop: 'text' },
    trust2Text:  { id: 's1-trust-2-text', prop: 'text' },

    catsTitle:    { id: 's1-cats-heading',  prop: 'text' },
    catsSubtitle: { id: 's1-cats-subtitle', prop: 'text' },
  };

  const BG_SLOTS = [
    { fileInput: 'df-s1-s0-bg', thumbImg: 's1Slide0BgImg', thumbEmpty: 's1Slide0BgEmpty', removeBtn: 's1Slide0BgRemoveBtn', field: 'slide0BgSrc' },
    { fileInput: 'df-s1-s1-bg', thumbImg: 's1Slide1BgImg', thumbEmpty: 's1Slide1BgEmpty', removeBtn: 's1Slide1BgRemoveBtn', field: 'slide1BgSrc' },
    { fileInput: 'df-s1-s2-bg', thumbImg: 's1Slide2BgImg', thumbEmpty: 's1Slide2BgEmpty', removeBtn: 's1Slide2BgRemoveBtn', field: 'slide2BgSrc' },
  ];

  // Focus a slide field → click the matching dot inside the iframe so the
  // slideshow JS stays in sync and the edited slide is visible.
  function slideIndexFromKey(key) {
    if (key.indexOf('slide0') === 0) return 0;
    if (key.indexOf('slide1') === 0) return 1;
    if (key.indexOf('slide2') === 0) return 2;
    return null;
  }

  function onFieldFocus(key, iframeDoc) {
    if (!iframeDoc) return;
    const idx = slideIndexFromKey(key);
    if (idx === null) return;
    const dots = iframeDoc.querySelectorAll('.hero__dot');
    if (dots[idx]) dots[idx].click();
  }

  const editor = window.createSectionEditor({
    template: TEMPLATE,
    namespace: '_s1',
    sectionKey: 'sectionOne',
    frameId: 'woolSectionOneFrame',
    defaults: DEFAULTS,
    fieldMap: FIELD_MAP,
    fieldSelector: '[data-s1-field]',
    fieldDatasetKey: 's1Field',
    bgSlots: BG_SLOTS,
    onFieldFocus: onFieldFocus,
  });

  /* Back-compat: some code reads window.__s1Draft. */
  Object.defineProperty(window, '__s1Draft', { get: function () { return editor.getDraft(); } });

})();
