/**
 * Designer Editor — section navigation.
 *
 * Drives the section tabs: shows the matching left-panel sub-panel and the
 * matching preview iframe wrap, updates tab state, and calls the section
 * editor's activate() (height fit / meta re-apply) once its preview is visible.
 *
 * The Header is owned by designer-editor.js; the other sections register an
 * editor on window.__designerSectionEditors via section-editor-base.js.
 */
(function () {
  'use strict';

  // sectionKey -> { panel: field-panel id, wrap: preview-wrap id (or null) }
  // The editor is consolidated to a single Full Site surface; the left column
  // is built out top-down inside #woolFullSite.
  var SECTIONS = {
    fullSite: { panel: 'woolFullSite', wrap: 'woolFullSitePreviewWrap' },
  };

  var tabBtns = document.querySelectorAll('#woolSectionTabs [data-section]');
  if (!tabBtns.length) return;

  function el(id) { return id ? document.getElementById(id) : null; }

  function activate(section) {
    var target = SECTIONS[section];
    if (!target) return;

    tabBtns.forEach(function (btn) {
      var isActive = btn.dataset.section === section;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Toggle left field sub-panels.
    Object.keys(SECTIONS).forEach(function (key) {
      var panel = el(SECTIONS[key].panel);
      if (panel) panel.hidden = (key !== section);
    });

    // Toggle preview wraps. Meta has no preview wrap — keep the last one shown.
    if (target.wrap) {
      Object.keys(SECTIONS).forEach(function (key) {
        var wrapId = SECTIONS[key].wrap;
        if (!wrapId) return;
        var wrap = el(wrapId);
        if (wrap) wrap.hidden = (wrapId !== target.wrap);
      });
    }

    // Let the editor re-measure its iframe height now that the wrap is visible.
    var editor = (window.__designerSectionEditors || {})[section];
    if (editor && typeof editor.activate === 'function') {
      // Defer so layout has applied the un-hidden wrap before measuring.
      setTimeout(editor.activate, 0);
    }

    // Full Site has no editor; fit its (now-visible) iframe to its content.
    if (section === 'fullSite' && typeof window.__fitFullSite === 'function') {
      setTimeout(window.__fitFullSite, 60);
    }
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { activate(btn.dataset.section); });
  });

  // Full Site is the single editing surface — activate it on load.
  activate('fullSite');
})();
