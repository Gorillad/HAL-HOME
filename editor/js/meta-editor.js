/**
 * Designer Editor — Meta (global) panel.
 *
 * Unlike the per-section editors, Meta has no single preview iframe: its
 * typography/color overrides are injected into EVERY section preview via each
 * editor's injectMetaCss(). pageTitle / metaDescription are stored in the
 * `_meta` namespace for the developer handoff. Persists through the same
 * combined-draft save as the sections.
 */
(function () {
  'use strict';

  var TEMPLATE = window.__designerSlug || 'woolf';
  var NAMESPACE = '_meta';

  window.__designerSectionDrafts = window.__designerSectionDrafts || {};
  window.__designerSectionEditors = window.__designerSectionEditors || {};

  var DEFAULTS = { fontFamily: '', accentColor: '', pageTitle: '', metaDescription: '' };
  var draft = Object.assign({}, DEFAULTS);
  window.__designerSectionDrafts[NAMESPACE] = draft;

  var autosaveTimer = null;

  function buildMetaCss() {
    var css = '';
    if (draft.fontFamily) {
      css += 'body, body * { font-family: ' + draft.fontFamily + ' !important; }\n';
    }
    if (draft.accentColor) {
      var c = draft.accentColor;
      css += ':root { --accent: ' + c + '; --color-accent: ' + c + '; }\n';
      css += 'a { color: ' + c + '; }\n';
      css += '.about-block__btn--primary, .cta-band__btn--primary, .quick-order__submit, .catalog-library__all { background-color: ' + c + '; border-color: ' + c + '; }\n';
    }
    return css;
  }

  function applyMeta() {
    var css = buildMetaCss();
    var editors = window.__designerSectionEditors || {};
    Object.keys(editors).forEach(function (key) {
      var ed = editors[key];
      if (ed && typeof ed.injectMetaCss === 'function') ed.injectMetaCss(css);
    });
  }

  function showToast(msg) {
    var toast = document.getElementById('saveToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
  }

  function scheduleAutosave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(saveDraft, 1400);
  }

  function saveDraft() {
    if (typeof window.designerSaveCombined === 'function') {
      window.designerSaveCombined(TEMPLATE);
    }
    showToast('Draft saved');
  }

  function bindInputs() {
    document.querySelectorAll('[data-meta-field]').forEach(function (el) {
      var key = el.dataset.metaField;
      if (!key) return;
      var evType = (el.tagName === 'TEXTAREA' || el.type === 'text') ? 'input' : 'change';
      el.addEventListener(evType, function () {
        draft[key] = el.value;
        applyMeta();
        scheduleAutosave();
      });
    });
  }

  function populateFields() {
    document.querySelectorAll('[data-meta-field]').forEach(function (el) {
      var key = el.dataset.metaField;
      if (key && draft[key] !== undefined) el.value = draft[key];
    });
  }

  function loadDraft() {
    var loader = (typeof window.designerLoadCombined === 'function')
      ? window.designerLoadCombined(TEMPLATE)
      : Promise.resolve(null);
    return Promise.resolve(loader)
      .then(function (saved) {
        if (saved && saved[NAMESPACE]) Object.assign(draft, saved[NAMESPACE]);
      })
      .catch(function () {})
      .then(function () { populateFields(); applyMeta(); });
  }

  bindInputs();
  loadDraft();

  // Register so the nav controller can "activate" Meta (re-apply on show).
  window.__designerSectionEditors.meta = { activate: applyMeta, injectMetaCss: function () {} };
})();
