/**
 * Section editor base — shared factory for Designer section editors.
 *
 * Every homepage section (hero / Section One, Section Two-Four, Footer) edits a
 * same-origin preview iframe the same way the header editor does: by writing
 * directly into the iframe's contentDocument. This factory encapsulates that
 * pattern so each section module is just a config object.
 *
 * Draft model:
 *   The combined per-template draft is a flat object whose top-level keys are
 *   either header fields (managed by designer-editor.js) or section namespaces
 *   such as `_s1`, `_s2`, `_footer`. Each section owns ONE namespace. To avoid
 *   sections clobbering one another (or the header), every live section draft is
 *   registered on `window.__designerSectionDrafts[namespace]`, and saves merge:
 *     header draft (window.__woolDraft)  +  all registered section drafts.
 *
 * Usage:
 *   const editor = window.createSectionEditor({
 *     template, namespace, frameId,
 *     defaults, fieldMap,
 *     fieldSelector, fieldDatasetKey,
 *     bgSlots,            // optional
 *     onFieldFocus,       // optional (key, iframeDoc) => void
 *   });
 *   editor.activate();    // call when the section's preview becomes visible
 */
(function () {
    'use strict';

    // Shared registries: live draft objects keyed by namespace, and the editor
    // instances keyed by section key (for the nav controller + Meta panel).
    window.__designerSectionDrafts = window.__designerSectionDrafts || {};
    window.__designerSectionEditors = window.__designerSectionEditors || {};

    /**
     * Build the combined draft body for a save: header fields plus every
     * registered section namespace. Reads live references so the most recent
     * edits from all sections are always included.
     */
    function buildCombinedDraft(template) {
        var headerDraft = (typeof window.__woolDraft === 'object' && window.__woolDraft)
            ? window.__woolDraft
            : {};
        var body = Object.assign({}, headerDraft, { _template: template });
        var sections = window.__designerSectionDrafts || {};
        Object.keys(sections).forEach(function (ns) {
            body[ns] = sections[ns];
        });
        return body;
    }
    // Expose so the header editor can merge all sections on its own saves.
    window.buildCombinedDesignerDraft = buildCombinedDraft;

    /* ── Persistence (works with OR without the Node server) ──────────────
       localStorage is the source of truth so the editor behaves like the
       premium template editors (no server required). When the Node app server
       is present, we ALSO POST to /api so drafts sync per-account — but a
       missing/failed API never blocks editing. */
    function lsKey(template) { return 'logicxo-designer-' + template; }

    function loadCombinedLocal(template) {
        try { return JSON.parse(localStorage.getItem(lsKey(template))) || null; }
        catch (e) { return null; }
    }

    function saveCombinedLocal(template, obj) {
        try { localStorage.setItem(lsKey(template), JSON.stringify(obj)); return true; }
        catch (e) { return false; }
    }

    // Resolve the draft API endpoint. It is only served by the Node app on
    // :4242; window.DESIGNER_API_BASE (set in designer.html) points there when
    // the editor runs on a static dev server so calls don't 404.
    function apiUrl(template) {
        return (window.DESIGNER_API_BASE || '') + '/api/designer/draft?template=' + template;
    }

    // Best-effort server sync; resolves regardless of success. Skipped entirely
    // when no API is present (e.g. static Live Server) so nothing 404s.
    function syncCombinedToApi(template, obj) {
        if (!window.DESIGNER_API_ENABLED) return Promise.resolve();
        try {
            return fetch(apiUrl(template), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(obj),
            }).then(function () {}, function () {});
        } catch (e) { return Promise.resolve(); }
    }

    window.designerSaveCombined = function (template) {
        var obj = buildCombinedDraft(template);
        saveCombinedLocal(template, obj);
        syncCombinedToApi(template, obj);
        return obj;
    };

    window.designerLoadCombined = function (template) {
        var local = loadCombinedLocal(template);
        if (local) return Promise.resolve(local);
        // No local copy yet. Only ask the API when one exists (Node app); on a
        // static server there is no API, so stay localStorage-only (no 404).
        if (!window.DESIGNER_API_ENABLED) return Promise.resolve(null);
        try {
            return fetch(apiUrl(template), { credentials: 'include' })
                .then(function (res) { return res.ok ? res.json() : null; })
                .then(function (data) { return (data && (data.draft || data)) || null; })
                .catch(function () { return null; });
        } catch (e) { return Promise.resolve(null); }
    };

    function createSectionEditor(config) {
        var template       = config.template || window.__designerSlug || 'woolf';
        var namespace      = config.namespace;
        var fieldMap       = config.fieldMap || {};
        var defaults       = config.defaults || {};
        var fieldSelector  = config.fieldSelector;
        var fieldDatasetKey = config.fieldDatasetKey;
        var bgSlots        = config.bgSlots || [];
        var onFieldFocus   = config.onFieldFocus;

        var frame = document.getElementById(config.frameId);

        var draft = Object.assign({}, defaults);
        // Register this section's live draft so saves never drop it.
        window.__designerSectionDrafts[namespace] = draft;

        var iframeDoc = null;
        var iframeReady = false;
        var draftReady = false;
        var autosaveTimer = null;
        var metaCss = '';

        /* ── iframe DOM access ─────────────────────────────────────── */

        function onReady() {
            if (!iframeReady || !draftReady) return;
            applyAllFields();
            applyMetaCss();
        }

        // Inject a shared <style> (driven by the global Meta panel) into this
        // section's iframe head so typography/color overrides apply everywhere.
        function applyMetaCss() {
            if (!iframeDoc) return;
            var head = iframeDoc.head || iframeDoc.getElementsByTagName('head')[0];
            if (!head) return;
            var styleEl = iframeDoc.getElementById('__designer-meta-overrides__');
            if (!styleEl) {
                styleEl = iframeDoc.createElement('style');
                styleEl.id = '__designer-meta-overrides__';
                head.appendChild(styleEl);
            }
            styleEl.textContent = metaCss;
        }

        function injectMetaCss(css) {
            metaCss = css || '';
            applyMetaCss();
        }

        function initPreviewIframe() {
            if (!frame) return;
            frame.addEventListener('load', function () {
                try {
                    iframeDoc = frame.contentDocument || frame.contentWindow.document;
                    iframeReady = true;
                    onReady();
                } catch (e) {
                    console.error('[' + namespace + '] Cannot access iframe DOM:', e);
                }
            });
            try {
                var doc = frame.contentDocument || frame.contentWindow.document;
                if (doc && doc.readyState === 'complete' && doc.body) {
                    iframeDoc = doc;
                    iframeReady = true;
                    onReady();
                }
            } catch (e) { /* same-origin; should not throw */ }
        }

        /* ── Live preview: direct DOM writes ───────────────────────── */

        function applyField(key, value) {
            if (!iframeDoc || value === undefined) return;
            var map = fieldMap[key];
            if (!map) return;
            var el = iframeDoc.getElementById(map.id);
            if (!el) return;
            if (map.prop === 'text') {
                el.textContent = value;
            } else if (map.prop === 'href') {
                el.setAttribute('href', value);
            } else if (map.prop === 'html') {
                el.innerHTML = value;
            } else if (map.prop === 'bg') {
                el.style.backgroundImage = value ? 'url("' + value + '")' : '';
            } else if (map.prop === 'src') {
                el.setAttribute('src', value);
            }
        }

        function applyAllFields() {
            if (!iframeDoc) return;
            Object.keys(fieldMap).forEach(function (key) {
                if (draft[key] !== undefined) applyField(key, draft[key]);
            });
            fitHeight();
        }

        function fitHeight() {
            if (!iframeDoc || !iframeDoc.documentElement) return;
            var h = iframeDoc.documentElement.scrollHeight;
            if (h > 100) frame.style.height = h + 'px';
        }

        function setFieldLive(key, value) {
            draft[key] = value;
            applyField(key, value);
            fitHeight();
            scheduleAutosave();
        }

        /* ── Input listeners ───────────────────────────────────────── */

        function bindInputs() {
            if (!fieldSelector) return;
            document.querySelectorAll(fieldSelector).forEach(function (el) {
                var key = fieldDatasetKey ? el.dataset[fieldDatasetKey] : el.getAttribute('data-field');
                if (!key) return;
                var evType = (el.tagName === 'TEXTAREA' || el.type === 'text') ? 'input' : 'change';
                el.addEventListener(evType, function () { setFieldLive(key, el.value); });
                if (typeof onFieldFocus === 'function') {
                    el.addEventListener('focus', function () { onFieldFocus(key, iframeDoc); });
                }
            });
        }

        /* ── Image upload slots ────────────────────────────────────── */

        function bindBgSlots() {
            bgSlots.forEach(function (slot) {
                var inputEl  = document.getElementById(slot.fileInput);
                var imgEl    = document.getElementById(slot.thumbImg);
                var emptyEl  = document.getElementById(slot.thumbEmpty);
                var removeEl = document.getElementById(slot.removeBtn);
                if (!inputEl) return;

                inputEl.addEventListener('change', function () {
                    var file = inputEl.files[0];
                    if (!file) return;
                    var reader = new FileReader();
                    reader.onload = function (ev) {
                        var src = ev.target.result;
                        if (imgEl) { imgEl.src = src; imgEl.hidden = false; }
                        if (emptyEl) emptyEl.hidden = true;
                        if (removeEl) removeEl.hidden = false;
                        setFieldLive(slot.field, src);
                    };
                    reader.readAsDataURL(file);
                });

                if (removeEl) {
                    removeEl.addEventListener('click', function () {
                        inputEl.value = '';
                        if (imgEl) { imgEl.src = ''; imgEl.hidden = true; }
                        if (emptyEl) emptyEl.hidden = false;
                        removeEl.hidden = true;
                        setFieldLive(slot.field, '');
                    });
                }
            });
        }

        /* ── Draft persistence ─────────────────────────────────────── */

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
            window.designerSaveCombined(template);
            showToast('Draft saved');
        }

        function loadDraft() {
            return Promise.resolve(window.designerLoadCombined(template))
                .then(function (saved) {
                    if (saved && saved[namespace]) Object.assign(draft, saved[namespace]);
                })
                .catch(function () {})
                .then(function () {
                    populateFields();
                    draftReady = true;
                    onReady();
                });
        }

        function populateFields() {
            if (fieldSelector) {
                document.querySelectorAll(fieldSelector).forEach(function (el) {
                    var key = fieldDatasetKey ? el.dataset[fieldDatasetKey] : el.getAttribute('data-field');
                    if (key && draft[key] !== undefined) el.value = draft[key];
                });
            }
            bgSlots.forEach(function (slot) {
                var src = draft[slot.field];
                if (!src) return;
                var imgEl    = document.getElementById(slot.thumbImg);
                var emptyEl  = document.getElementById(slot.thumbEmpty);
                var removeEl = document.getElementById(slot.removeBtn);
                if (imgEl) { imgEl.src = src; imgEl.hidden = false; }
                if (emptyEl) emptyEl.hidden = true;
                if (removeEl) removeEl.hidden = false;
            });
        }

        /* ── Init ──────────────────────────────────────────────────── */

        initPreviewIframe();
        bindInputs();
        bindBgSlots();
        loadDraft();

        // Serialize the customized section markup (top-level body elements,
        // minus scripts) for the developer handoff export.
        function getSectionHtml() {
            if (!iframeDoc || !iframeDoc.body) return '';
            var parts = [];
            Array.prototype.forEach.call(iframeDoc.body.children, function (node) {
                if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
                parts.push(node.outerHTML);
            });
            return parts.join('\n');
        }

        var api = {
            namespace: namespace,
            getDraft: function () { return draft; },
            activate: fitHeight,        // re-measure once the wrap is visible
            applyAllFields: applyAllFields,
            injectMetaCss: injectMetaCss,
            getSectionHtml: getSectionHtml,
        };

        if (config.sectionKey) window.__designerSectionEditors[config.sectionKey] = api;
        return api;
    }

    window.createSectionEditor = createSectionEditor;
})();
