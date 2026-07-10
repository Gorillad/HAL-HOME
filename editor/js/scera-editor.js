/**
 * SCERA Designer editor — header + Section 1 (static hero) + live iframe preview.
 */
(function () {
    'use strict';

    var TEMPLATE = 'scera';
    var LS_KEY = 'logicxo-designer-scera';

    var DEFAULTS = {
        logoSrc: 'data/images/scera-logo.png',
        logoUrl: '/',
        logoSize: 88,
        topBarCopy: 'Complimentary design consultation · White-glove delivery',
        searchPlaceholder: 'Find a fixture…',

        heroPrimarySrc: 'data/images/hero/chrysler-building.jpg',
        heroPrimaryAlt: 'Art Deco Chrysler Building facade at golden hour',
        heroEyebrow: 'Designer Lighting & Fine Fixtures',
        heroHeadline1: 'Where Light',
        heroHeadline2: 'Becomes',
        heroHeadline3: 'Sculpture',
        heroCopy: 'Explore curated chandeliers, pendants, and architectural fixtures from the makers and designers trusted by interior professionals worldwide.',
        heroCtaLabel: 'Shop the Collection',
        heroCtaUrl: '/catalog/lighting',
        heroTile1Src: 'data/images/collections/chandelier.jpg',
        heroTile1Heading: 'Chandeliers',
        heroTile1Tag: 'Shop statement pieces',
        heroTile1Url: '/catalog/lighting/ceiling-lights/chandeliers',
        heroTile2Src: 'data/images/collections/pendants.jpg',
        heroTile2Heading: 'Pendants',
        heroTile2Tag: 'Shop sculpted light',
        heroTile2Url: '/catalog/lighting/ceiling-lights/pendants',
    };

    var IMAGE_SLOTS = [
        {
            field: 'heroPrimarySrc',
            fileInput: 'sf-hero-primary-file',
            thumbImg: 'sf-hero-primary-thumb',
            thumbEmpty: 'sf-hero-primary-thumb-empty',
            removeBtn: 'sf-hero-primary-remove',
        },
        {
            field: 'heroTile1Src',
            fileInput: 'sf-hero-tile1-file',
            thumbImg: 'sf-hero-tile1-thumb',
            thumbEmpty: 'sf-hero-tile1-thumb-empty',
            removeBtn: 'sf-hero-tile1-remove',
        },
        {
            field: 'heroTile2Src',
            fileInput: 'sf-hero-tile2-file',
            thumbImg: 'sf-hero-tile2-thumb',
            thumbEmpty: 'sf-hero-tile2-thumb-empty',
            removeBtn: 'sf-hero-tile2-remove',
        },
    ];

    var draft = {};
    var iframeDoc = null;
    var iframeReady = false;
    var draftReady = false;
    var saveTimer = null;

    var frame = null;
    var saveToast = null;
    var logoFileInput = null;
    var logoRemoveBtn = null;
    var logoThumbImg = null;
    var logoThumbEmpty = null;
    var logoUrlInput = null;
    var logoSizeInput = null;
    var logoSizeVal = null;
    var topBarCopyInput = null;
    var searchPlaceholderInput = null;
    var panelHeader = null;
    var panelSection1 = null;
    var sectionTabs = null;

    function $(id) { return document.getElementById(id); }

    function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveDraft, 400);
    }

    function showSaveToast() {
        if (!saveToast) return;
        saveToast.textContent = 'Saved';
        saveToast.classList.add('is-visible');
        clearTimeout(showSaveToast._t);
        showSaveToast._t = setTimeout(function () {
            saveToast.classList.remove('is-visible');
        }, 1400);
    }

    function saveDraft() {
        var payload = Object.assign({}, draft, { _template: TEMPLATE });
        try { localStorage.setItem(LS_KEY, JSON.stringify(payload)); } catch (e) { /* quota */ }
        if (window.DESIGNER_API_ENABLED) {
            var url = (window.DESIGNER_API_BASE || '') + '/api/designer/draft?template=' + TEMPLATE;
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            }).catch(function () {});
        }
        showSaveToast();
    }

    function loadDraft() {
        try {
            var raw = localStorage.getItem(LS_KEY);
            if (raw) return Promise.resolve(JSON.parse(raw));
        } catch (e) { /* ignore */ }
        if (!window.DESIGNER_API_ENABLED) return Promise.resolve(null);
        var url = (window.DESIGNER_API_BASE || '') + '/api/designer/draft?template=' + TEMPLATE;
        return fetch(url, { credentials: 'include' })
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (data) { return (data && (data.draft || data)) || null; })
            .catch(function () { return null; });
    }

    function qsel(sel) {
        return iframeDoc ? iframeDoc.querySelector(sel) : null;
    }

    function applyLogo() {
        var src = draft.logoSrc || DEFAULTS.logoSrc;
        var headerLogo = qsel('#sceraHeaderLogo');
        var footerLogo = qsel('#sceraFooterLogo');
        if (headerLogo) headerLogo.src = src;
        if (footerLogo) footerLogo.src = src;

        var root = iframeDoc && iframeDoc.documentElement;
        if (root) {
            root.style.setProperty('--scera-header-logo-h', (draft.logoSize || DEFAULTS.logoSize) + 'px');
        }
    }

    function applyLogoLink() {
        var link = qsel('#sceraLogoLink');
        if (link) link.setAttribute('href', draft.logoUrl || DEFAULTS.logoUrl);
    }

    function applyTopBarCopy() {
        var el = qsel('#sceraTopBarCopy');
        if (el) el.textContent = draft.topBarCopy || DEFAULTS.topBarCopy;
    }

    function applySearchPlaceholder() {
        var el = qsel('#sceraSearchInput');
        if (el) el.setAttribute('placeholder', draft.searchPlaceholder || DEFAULTS.searchPlaceholder);
    }

    function applyHero() {
        var primaryImg = qsel('#sceraHeroPrimaryImg');
        if (primaryImg) {
            primaryImg.src = draft.heroPrimarySrc || DEFAULTS.heroPrimarySrc;
            primaryImg.alt = draft.heroPrimaryAlt || DEFAULTS.heroPrimaryAlt;
        }

        var eyebrow = qsel('#sceraHeroEyebrow');
        if (eyebrow) eyebrow.textContent = draft.heroEyebrow || DEFAULTS.heroEyebrow;

        var h1 = qsel('#sceraHeroHeadline1');
        var h2 = qsel('#sceraHeroHeadline2');
        var h3 = qsel('#sceraHeroHeadline3');
        if (h1) h1.textContent = draft.heroHeadline1 || DEFAULTS.heroHeadline1;
        if (h2) h2.textContent = draft.heroHeadline2 || DEFAULTS.heroHeadline2;
        if (h3) h3.textContent = draft.heroHeadline3 || DEFAULTS.heroHeadline3;

        var copy = qsel('#sceraHeroCopy');
        if (copy) copy.textContent = draft.heroCopy || DEFAULTS.heroCopy;

        var cta = qsel('#sceraHeroCta');
        if (cta) {
            cta.textContent = draft.heroCtaLabel || DEFAULTS.heroCtaLabel;
            cta.setAttribute('href', draft.heroCtaUrl || DEFAULTS.heroCtaUrl);
        }

        var tile1Img = qsel('#sceraHeroTile1Img');
        if (tile1Img) tile1Img.src = draft.heroTile1Src || DEFAULTS.heroTile1Src;

        var tile1Link = qsel('#sceraHeroTile1Link');
        if (tile1Link) tile1Link.setAttribute('href', draft.heroTile1Url || DEFAULTS.heroTile1Url);

        var tile1Heading = qsel('#sceraHeroTile1Heading');
        if (tile1Heading) tile1Heading.textContent = draft.heroTile1Heading || DEFAULTS.heroTile1Heading;

        var tile1Tag = qsel('#sceraHeroTile1Tag');
        if (tile1Tag) tile1Tag.textContent = draft.heroTile1Tag || DEFAULTS.heroTile1Tag;

        var tile2Img = qsel('#sceraHeroTile2Img');
        if (tile2Img) tile2Img.src = draft.heroTile2Src || DEFAULTS.heroTile2Src;

        var tile2Link = qsel('#sceraHeroTile2Link');
        if (tile2Link) tile2Link.setAttribute('href', draft.heroTile2Url || DEFAULTS.heroTile2Url);

        var tile2Heading = qsel('#sceraHeroTile2Heading');
        if (tile2Heading) tile2Heading.textContent = draft.heroTile2Heading || DEFAULTS.heroTile2Heading;

        var tile2Tag = qsel('#sceraHeroTile2Tag');
        if (tile2Tag) tile2Tag.textContent = draft.heroTile2Tag || DEFAULTS.heroTile2Tag;
    }

    function applyAll() {
        if (!iframeDoc) return;
        applyLogo();
        applyLogoLink();
        applyTopBarCopy();
        applySearchPlaceholder();
        applyHero();
        if (typeof window.__fitFullSite === 'function') window.__fitFullSite();
    }

    function onReady() {
        if (!iframeReady || !draftReady) return;
        applyAll();
    }

    function isCustomImage(src) {
        return !!(src && src.indexOf('data:') === 0);
    }

    function updateLogoThumb(src) {
        if (!logoThumbImg || !logoThumbEmpty || !logoRemoveBtn) return;
        if (isCustomImage(src)) {
            logoThumbImg.src = src;
            logoThumbImg.hidden = false;
            logoThumbEmpty.hidden = true;
            logoRemoveBtn.hidden = false;
        } else {
            logoThumbImg.src = '';
            logoThumbImg.hidden = true;
            logoThumbEmpty.hidden = false;
            logoRemoveBtn.hidden = true;
        }
    }

    function updateImageThumb(slot, src) {
        var thumbImg = $(slot.thumbImg);
        var thumbEmpty = $(slot.thumbEmpty);
        var removeBtn = $(slot.removeBtn);
        if (!thumbImg || !thumbEmpty || !removeBtn) return;

        var displaySrc = isCustomImage(src) ? src : (src || DEFAULTS[slot.field]);
        if (isCustomImage(src)) {
            thumbImg.src = displaySrc;
            thumbImg.hidden = false;
            thumbEmpty.hidden = true;
            removeBtn.hidden = false;
        } else if (displaySrc && displaySrc.indexOf('data/') === 0) {
            thumbImg.src = '../designer_editor/scera/' + displaySrc;
            thumbImg.hidden = false;
            thumbEmpty.hidden = true;
            removeBtn.hidden = true;
        } else {
            thumbImg.src = '';
            thumbImg.hidden = true;
            thumbEmpty.hidden = false;
            removeBtn.hidden = true;
        }
    }

    function populatePanel() {
        if (logoUrlInput) logoUrlInput.value = draft.logoUrl || DEFAULTS.logoUrl;
        if (logoSizeInput) logoSizeInput.value = String(draft.logoSize || DEFAULTS.logoSize);
        if (logoSizeVal) logoSizeVal.textContent = (draft.logoSize || DEFAULTS.logoSize) + 'px';
        if (topBarCopyInput) topBarCopyInput.value = draft.topBarCopy || DEFAULTS.topBarCopy;
        if (searchPlaceholderInput) searchPlaceholderInput.value = draft.searchPlaceholder || DEFAULTS.searchPlaceholder;
        updateLogoThumb(draft.logoSrc);

        var panel = $('sceraFieldPanel');
        if (!panel) return;
        panel.querySelectorAll('[data-scera-field]').forEach(function (el) {
            var key = el.dataset.sceraField;
            if (!key || DEFAULTS[key] === undefined) return;
            el.value = draft[key] !== undefined && draft[key] !== null ? draft[key] : DEFAULTS[key];
        });

        IMAGE_SLOTS.forEach(function (slot) {
            updateImageThumb(slot, draft[slot.field]);
        });
    }

    function bindImageSlot(slot) {
        var fileInput = $(slot.fileInput);
        var removeBtn = $(slot.removeBtn);
        if (!fileInput) return;

        fileInput.addEventListener('change', function () {
            var file = fileInput.files && fileInput.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (evt) {
                draft[slot.field] = evt.target.result;
                updateImageThumb(slot, draft[slot.field]);
                applyHero();
                scheduleSave();
            };
            reader.readAsDataURL(file);
            fileInput.value = '';
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', function () {
                draft[slot.field] = DEFAULTS[slot.field];
                updateImageThumb(slot, draft[slot.field]);
                applyHero();
                scheduleSave();
            });
        }
    }

    function bindSectionTabs() {
        if (!sectionTabs) return;
        sectionTabs.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-scera-section]');
            if (!btn) return;
            var section = btn.getAttribute('data-scera-section');
            sectionTabs.querySelectorAll('.designer-section-tab').forEach(function (tab) {
                var active = tab === btn;
                tab.classList.toggle('is-active', active);
                tab.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            if (panelHeader) panelHeader.hidden = section !== 'header';
            if (panelSection1) panelSection1.hidden = section !== 'section1';
            if (section === 'section1') {
                var hero = qsel('.scera-hero');
                if (hero && iframeDoc && iframeDoc.defaultView) {
                    iframeDoc.defaultView.scrollTo({ top: hero.offsetTop - 12, behavior: 'smooth' });
                }
            }
        });
    }

    function bindPanel() {
        var panel = $('sceraFieldPanel');
        if (!panel) return;

        panel.addEventListener('input', function (e) {
            var t = e.target;
            if (!t || !t.dataset || !t.dataset.sceraField) return;
            var key = t.dataset.sceraField;
            draft[key] = key === 'logoSize'
                ? (parseInt(t.value, 10) || DEFAULTS.logoSize)
                : t.value;
            if (key === 'logoSize' && logoSizeVal) logoSizeVal.textContent = t.value + 'px';
            applyAll();
            scheduleSave();
        });

        if (logoFileInput) {
            logoFileInput.addEventListener('change', function () {
                var file = logoFileInput.files && logoFileInput.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function (evt) {
                    draft.logoSrc = evt.target.result;
                    updateLogoThumb(draft.logoSrc);
                    applyLogo();
                    scheduleSave();
                };
                reader.readAsDataURL(file);
                logoFileInput.value = '';
            });
        }

        if (logoRemoveBtn) {
            logoRemoveBtn.addEventListener('click', function () {
                draft.logoSrc = DEFAULTS.logoSrc;
                updateLogoThumb('');
                applyLogo();
                scheduleSave();
            });
        }

        IMAGE_SLOTS.forEach(bindImageSlot);
        bindSectionTabs();
    }

    function initPreview() {
        frame = $('sceraFullSiteFrame');
        if (!frame) return;

        function hook() {
            try {
                iframeDoc = frame.contentDocument || frame.contentWindow.document;
                iframeReady = true;
                onReady();
            } catch (e) { /* not ready */ }
        }

        frame.addEventListener('load', hook);
        hook();
    }

    function init() {
        if ((window.__designerSlug || '') !== 'scera') return;

        saveToast = $('saveToast');
        logoFileInput = $('sf-logo-file');
        logoRemoveBtn = $('sf-logo-remove');
        logoThumbImg = $('sf-logo-thumb');
        logoThumbEmpty = $('sf-logo-thumb-empty');
        logoUrlInput = $('sf-logo-url');
        logoSizeInput = $('sf-logo-size');
        logoSizeVal = $('sf-logo-size-val');
        topBarCopyInput = $('sf-top-bar-copy');
        searchPlaceholderInput = $('sf-search-placeholder');
        panelHeader = $('sceraPanelHeader');
        panelSection1 = $('sceraPanelSection1');
        sectionTabs = $('sceraSectionTabs');

        draft = Object.assign({}, DEFAULTS);
        window.__sceraDraft = draft;

        initPreview();
        bindPanel();

        loadDraft().then(function (saved) {
            if (saved && typeof saved === 'object') {
                Object.keys(DEFAULTS).forEach(function (key) {
                    if (saved[key] !== undefined && saved[key] !== null) draft[key] = saved[key];
                });
            }
            populatePanel();
            draftReady = true;
            onReady();
        });
    }

    window.SceraEditor = { init: init };
})();
