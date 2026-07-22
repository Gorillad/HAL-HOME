/**
 * McQueen Plus Designer editor — McQueen-based premium homepage with mega menu.
 */
(function () {
    'use strict';

    var TEMPLATE = 'mcqueen-plus';
    var LS_KEY = 'logicxo-designer-mcqueen-plus';

    var DEFAULT_NAV = [
        {
            id: 'ceiling-lights',
            label: 'Ceiling Lights',
            href: '/lighting-fixtures/chandeliers',
            visible: true,
            columns: [
                {
                    head: 'Chandeliers',
                    links: [
                        { label: 'Chandeliers', href: '/lighting-fixtures/chandeliers' },
                        { label: 'Candle Chandeliers', href: '/lighting-fixtures/candle-chandeliers' },
                        { label: 'Down Chandeliers', href: '/lighting-fixtures/chandeliers/down-chandeliers' },
                        { label: 'Up Chandeliers', href: '/lighting-fixtures/chandeliers/up-chandeliers' },
                    ],
                },
                {
                    head: 'More Ceiling',
                    links: [
                        { label: 'Ring Chandeliers', href: '/lighting-fixtures/chandeliers/ring-chandeliers' },
                        { label: 'Other Chandeliers', href: '/lighting-fixtures/chandeliers/other-chandeliers' },
                        { label: 'Accessories', href: '/lighting-fixtures/chandeliers/chandelier-accessories' },
                    ],
                },
            ],
        },
        {
            id: 'wall-fixtures',
            label: 'Wall Fixtures',
            href: '/lighting-fixtures/sconces',
            visible: true,
            columns: [
                {
                    head: 'Sconces',
                    links: [
                        { label: 'Sconces', href: '/lighting-fixtures/sconces' },
                        { label: 'Wall Sconces', href: '/lighting-fixtures/sconces/wall-sconces' },
                        { label: 'Outdoor Wall Lights', href: '/lighting-fixtures/sconces/outdoor-wall-lights' },
                    ],
                },
                {
                    head: 'More',
                    links: [
                        { label: 'Picture Display Lights', href: '/lighting-fixtures/sconces/picture-display-lights' },
                        { label: 'Other Wall Lights', href: '/lighting-fixtures/sconces/other-wall-lights' },
                        { label: 'Accessories', href: '/lighting-fixtures/sconces/sconce-accessories' },
                    ],
                },
            ],
        },
        {
            id: 'fans',
            label: 'Fans',
            href: '/lighting-fixtures/fans',
            visible: true,
            columns: [
                {
                    head: 'Ceiling Fans',
                    links: [
                        { label: 'Ceiling Fans', href: '/lighting-fixtures/fans/ceiling-fans' },
                        { label: 'With Light', href: '/lighting-fixtures/fans/ceiling-fans-with-light' },
                        { label: 'Huggers', href: '/lighting-fixtures/fans/huggers' },
                        { label: 'Fandeliers', href: '/lighting-fixtures/fans/fandeliers' },
                    ],
                },
                {
                    head: 'Specialty',
                    links: [
                        { label: 'Outdoor Fans', href: '/lighting-fixtures/fans/outdoor-fans' },
                        { label: 'Wall Fans', href: '/lighting-fixtures/fans/wall-fans' },
                        { label: 'Portable Fans', href: '/lighting-fixtures/fans/portable-fans' },
                        { label: 'Belt Fans', href: '/lighting-fixtures/fans/belt-fans' },
                    ],
                },
                {
                    head: 'More',
                    links: [
                        { label: 'Dual Motor', href: '/lighting-fixtures/fans/dual-motor-fans' },
                        { label: 'Other Fans', href: '/lighting-fixtures/fans/other-fans' },
                    ],
                },
            ],
        },
        {
            id: 'bathroom',
            label: 'Bathroom',
            href: '/lighting-fixtures/bathroom-fixtures',
            visible: true,
            columns: [
                {
                    head: 'Bath Lighting',
                    links: [
                        { label: 'Vanity Lights', href: '/lighting-fixtures/bathroom-fixtures/vanity-lights' },
                        { label: 'Bathroom Sconces', href: '/lighting-fixtures/bathroom-fixtures/bathroom-sconces' },
                        { label: 'Bath Fans', href: '/lighting-fixtures/bathroom-fixtures/bath-fans' },
                    ],
                },
                {
                    head: 'More',
                    links: [
                        { label: 'Bathroom Fixtures', href: '/lighting-fixtures/bathroom-fixtures' },
                        { label: 'Other Bathroom', href: '/lighting-fixtures/bathroom-fixtures/other-bathroom-fixtures' },
                    ],
                },
            ],
        },
        {
            id: 'outdoor',
            label: 'Outdoor',
            href: '/lighting-fixtures/exterior',
            visible: true,
            columns: [
                {
                    head: 'Exterior Lights',
                    links: [
                        { label: 'Exterior Chandeliers', href: '/lighting-fixtures/exterior/exterior-chandeliers' },
                        { label: 'Exterior Pendants', href: '/lighting-fixtures/exterior/exterior-pendants' },
                        { label: 'Wall Lanterns', href: '/lighting-fixtures/exterior/wall-lanterns' },
                        { label: 'Hanging Lanterns', href: '/lighting-fixtures/exterior/hanging-lanterns' },
                    ],
                },
                {
                    head: 'Posts & Path',
                    links: [
                        { label: 'Posts', href: '/lighting-fixtures/exterior/posts' },
                        { label: 'Post Mount Lights', href: '/lighting-fixtures/exterior/post-mount-lights' },
                        { label: 'Bollards', href: '/lighting-fixtures/exterior/bollards' },
                        { label: 'Deck Lights', href: '/lighting-fixtures/exterior/deck-lights' },
                    ],
                },
                {
                    head: 'More Exterior',
                    links: [
                        { label: 'Exterior Fans', href: '/lighting-fixtures/exterior/exterior-fans' },
                        { label: 'Solar Lights', href: '/lighting-fixtures/exterior/solar-lights' },
                        { label: 'Other Exterior', href: '/lighting-fixtures/exterior/other-exterior' },
                    ],
                },
            ],
        },
        {
            id: 'shop-by-brand',
            label: 'Shop by Brand',
            href: '/brands',
            visible: true,
            columns: [],
        },
    ];

    var DEFAULTS = {
        companyName: 'McQueen Plus',
        logoSrc: 'data/images/Alveraanlogo_v1.png',
        logoUrl: '/',
        logoSize: 56,
        bannerBg: '#000000',
        bannerText: '#ffffff',
        searchPlaceholder: 'Enter Keyword or Item#',
        heroTitle: 'Gemma',
        heroText: 'A sculptural crystal collection that brings gallery light into the dining room and foyer.',
        heroCtaLabel: 'Explore Gemma',
        heroCtaUrl: '/collections/gemma',
        aboutTitle: 'About Us',
        aboutText: 'McQueen Plus builds on the trusted McQueen showroom layout with premium navigation and room to grow into richer merchandising experiences.',
        aboutCtaLabel: 'Learn More',
        aboutCtaUrl: '/about-us',
        navItems: DEFAULT_NAV.map(cloneNavItem),
    };

    var draft = null;
    var draftReady = false;
    var iframeDoc = null;
    var iframeReady = false;
    var frame = null;
    var saveToast = null;
    var saveTimer = null;

    function $(id) { return document.getElementById(id); }

    function cloneNavItem(item) {
        return {
            id: item.id,
            label: item.label,
            href: item.href || '',
            visible: item.visible !== false,
            columns: (item.columns || []).map(function (col) {
                return {
                    head: col.head || '',
                    links: (col.links || []).map(function (link) {
                        return { label: link.label || '', href: link.href || '' };
                    }),
                };
            }),
        };
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveDraft, 400);
    }

    function showSaveToast() {
        if (!saveToast) return;
        saveToast.textContent = 'McQueen Plus draft saved';
        saveToast.classList.add('is-visible');
        setTimeout(function () { saveToast.classList.remove('is-visible'); }, 1400);
    }

    function saveDraft() {
        var payload = Object.assign({ _template: TEMPLATE }, draft);
        try { localStorage.setItem(LS_KEY, JSON.stringify(payload)); } catch (e) { /* quota */ }
        if (window.DESIGNER_API_ENABLED) {
            fetch((window.DESIGNER_API_BASE || '') + '/api/designer/draft?template=' + TEMPLATE, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).catch(function () { /* offline */ });
        }
        showSaveToast();
    }

    function loadDraft() {
        try {
            var raw = localStorage.getItem(LS_KEY);
            if (raw) return Promise.resolve(JSON.parse(raw));
        } catch (e) { /* ignore */ }

        if (!window.DESIGNER_API_ENABLED) return Promise.resolve(null);

        return fetch((window.DESIGNER_API_BASE || '') + '/api/designer/draft?template=' + TEMPLATE, {
            credentials: 'include',
        }).then(function (res) {
            if (!res.ok) return null;
            return res.json();
        }).catch(function () { return null; });
    }

    function colClass(count) {
        var n = Math.max(2, Math.min(5, count || 2));
        return 'mq-plus-mega-panel__inner mq-plus-mega-panel__inner--cols-' + n;
    }

    function renderMegaNav() {
        if (!iframeDoc) return;
        var list = iframeDoc.getElementById('mqPlusMegaNavList');
        if (!list) return;

        var items = Array.isArray(draft.navItems) ? draft.navItems : DEFAULT_NAV;
        var html = '';

        items.forEach(function (item, index) {
            if (!item || item.visible === false) return;
            var id = item.id || ('nav-' + index);
            var panelId = 'mq-mega-' + id;
            var hasMega = Array.isArray(item.columns) && item.columns.length > 0;
            var label = escapeHtml(item.label || 'Nav');
            var href = escapeHtml(item.href || '#');

            html += '<li class="mq-plus-mega-nav__item"' + (hasMega ? ' data-has-mega' : '') + '>';
            html += '<a href="' + href + '" class="mq-plus-mega-nav__trigger" aria-expanded="false"'
                + (hasMega ? ' aria-controls="' + escapeHtml(panelId) + '"' : '') + '>' + label + '</a>';

            if (hasMega) {
                html += '<div class="mq-plus-mega-panel" id="' + escapeHtml(panelId) + '" hidden>';
                html += '<div class="' + colClass(item.columns.length) + '">';
                item.columns.forEach(function (col) {
                    html += '<div class="mq-plus-mega-col">';
                    if (col.head) html += '<h3 class="mq-plus-mega-col__head">' + escapeHtml(col.head) + '</h3>';
                    (col.links || []).forEach(function (link) {
                        if (!link || !link.label) return;
                        html += '<a href="' + escapeHtml(link.href || '#') + '">' + escapeHtml(link.label) + '</a>';
                    });
                    html += '</div>';
                });
                html += '</div></div>';
            }

            html += '</li>';
        });

        list.innerHTML = html;

        try {
            if (iframeDoc.defaultView && typeof iframeDoc.defaultView.__mqPlusMegaNavInit === 'function') {
                iframeDoc.defaultView.__mqPlusMegaNavInit();
            }
        } catch (e) { /* ignore */ }
    }

    function applyHeader() {
        if (!iframeDoc) return;
        var logo = iframeDoc.getElementById('mqPlusHeaderLogo');
        var logoLink = iframeDoc.getElementById('mqPlusLogoLink');
        var banner = iframeDoc.getElementById('mqPlusBanner');
        var search = iframeDoc.getElementById('mqPlusSearchInput');
        var company = iframeDoc.getElementById('mqPlusCompanyName');

        if (logo) {
            logo.src = draft.logoSrc || DEFAULTS.logoSrc;
            logo.style.height = (draft.logoSize || DEFAULTS.logoSize) + 'px';
            logo.alt = draft.companyName || DEFAULTS.companyName;
        }
        if (logoLink) logoLink.href = draft.logoUrl || '/';
        if (banner) {
            banner.style.backgroundColor = draft.bannerBg || DEFAULTS.bannerBg;
            banner.style.setProperty('--header-banner-text', draft.bannerText || DEFAULTS.bannerText);
        }
        if (search) search.placeholder = draft.searchPlaceholder || DEFAULTS.searchPlaceholder;
        if (company) company.textContent = draft.companyName || DEFAULTS.companyName;
    }

    function applyHero() {
        if (!iframeDoc) return;
        var title = iframeDoc.getElementById('mqPlusHeroTitle');
        var text = iframeDoc.getElementById('mqPlusHeroText');
        var cta = iframeDoc.getElementById('mqPlusHeroCta');
        if (title) title.textContent = draft.heroTitle || DEFAULTS.heroTitle;
        if (text) text.textContent = draft.heroText || DEFAULTS.heroText;
        if (cta) {
            cta.textContent = draft.heroCtaLabel || DEFAULTS.heroCtaLabel;
            cta.href = draft.heroCtaUrl || DEFAULTS.heroCtaUrl;
        }
    }

    function applyAbout() {
        if (!iframeDoc) return;
        var title = iframeDoc.getElementById('mqPlusAboutTitle');
        var text = iframeDoc.getElementById('mqPlusAboutText');
        var cta = iframeDoc.getElementById('mqPlusAboutCta');
        if (title) title.textContent = draft.aboutTitle || DEFAULTS.aboutTitle;
        if (text) text.innerHTML = '<p>' + escapeHtml(draft.aboutText || DEFAULTS.aboutText) + '</p>';
        if (cta) {
            cta.textContent = draft.aboutCtaLabel || DEFAULTS.aboutCtaLabel;
            cta.href = draft.aboutCtaUrl || DEFAULTS.aboutCtaUrl;
        }
    }

    function applyAll() {
        applyHeader();
        renderMegaNav();
        applyHero();
        applyAbout();
        if (typeof window.__fitFullSite === 'function') window.__fitFullSite();
    }

    function onReady() {
        if (!draftReady || !iframeReady) return;
        applyAll();
    }

    function populatePanel() {
        var map = {
            'mqp-company-name': 'companyName',
            'mqp-logo-url': 'logoUrl',
            'mqp-logo-size': 'logoSize',
            'mqp-banner-bg': 'bannerBg',
            'mqp-banner-text': 'bannerText',
            'mqp-search-placeholder': 'searchPlaceholder',
            'mqp-hero-title': 'heroTitle',
            'mqp-hero-text': 'heroText',
            'mqp-hero-cta-label': 'heroCtaLabel',
            'mqp-hero-cta-url': 'heroCtaUrl',
            'mqp-about-title': 'aboutTitle',
            'mqp-about-text': 'aboutText',
            'mqp-about-cta-label': 'aboutCtaLabel',
            'mqp-about-cta-url': 'aboutCtaUrl',
        };
        Object.keys(map).forEach(function (id) {
            var el = $(id);
            if (!el) return;
            var key = map[id];
            el.value = draft[key] != null ? draft[key] : DEFAULTS[key];
        });
        var sizeVal = $('mqp-logo-size-val');
        if (sizeVal) sizeVal.textContent = (draft.logoSize || DEFAULTS.logoSize) + 'px';
        renderNavEditor();
    }

    function renderNavEditor() {
        var mount = $('mqpNavEditorMount');
        if (!mount) return;
        var items = Array.isArray(draft.navItems) ? draft.navItems : [];
        var html = '';

        items.forEach(function (item, index) {
            html += '<details class="designer-group" style="margin-bottom:10px">';
            html += '<summary class="designer-group-head">' + escapeHtml(item.label || ('Item ' + (index + 1))) + '</summary>';
            html += '<div class="designer-group-body">';
            html += '<div class="editor-field"><label class="editor-field-label">Label</label>';
            html += '<input type="text" class="editor-field-input" data-mqp-nav="' + index + '" data-mqp-nav-field="label" value="' + escapeHtml(item.label || '') + '"></div>';
            html += '<div class="editor-field"><label class="editor-field-label">URL</label>';
            html += '<input type="text" class="editor-field-input" data-mqp-nav="' + index + '" data-mqp-nav-field="href" value="' + escapeHtml(item.href || '') + '"></div>';
            html += '<p class="editor-field-hint" style="margin:0 0 8px">Mega columns: ' + ((item.columns && item.columns.length) || 0) + ' — edit structure in a later upgrade; labels/URLs update the live mega menu now.</p>';
            html += '</div></details>';
        });

        mount.innerHTML = html || '<p class="editor-field-hint">No nav items.</p>';

        mount.querySelectorAll('[data-mqp-nav]').forEach(function (input) {
            input.addEventListener('input', function () {
                var idx = Number(input.getAttribute('data-mqp-nav'));
                var field = input.getAttribute('data-mqp-nav-field');
                if (!draft.navItems[idx] || !field) return;
                draft.navItems[idx][field] = input.value;
                renderMegaNav();
                scheduleSave();
            });
        });
    }

    function bindPanel() {
        var panel = $('mcqueenPlusFieldPanel');
        if (!panel) return;

        panel.querySelectorAll('[data-mqp-field]').forEach(function (input) {
            var key = input.getAttribute('data-mqp-field');
            if (!key) return;
            input.addEventListener('input', function () {
                var value = input.type === 'range' ? Number(input.value) : input.value;
                draft[key] = value;
                if (key === 'logoSize') {
                    var sizeVal = $('mqp-logo-size-val');
                    if (sizeVal) sizeVal.textContent = value + 'px';
                }
                applyAll();
                scheduleSave();
            });
        });

        var logoFile = $('mqp-logo-file');
        if (logoFile) {
            logoFile.addEventListener('change', function () {
                var file = logoFile.files && logoFile.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function (evt) {
                    draft.logoSrc = evt.target.result;
                    applyHeader();
                    scheduleSave();
                };
                reader.readAsDataURL(file);
            });
        }

        var logoReset = $('mqp-logo-reset');
        if (logoReset) {
            logoReset.addEventListener('click', function () {
                draft.logoSrc = DEFAULTS.logoSrc;
                applyHeader();
                scheduleSave();
            });
        }
    }

    function initPreview() {
        frame = $('mcqueenPlusFullSiteFrame');
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
        if ((window.__designerSlug || '') !== 'mcqueen-plus') return;

        saveToast = $('saveToast');
        draft = Object.assign({}, DEFAULTS, { navItems: DEFAULT_NAV.map(cloneNavItem) });
        window.__mcqueenPlusDraft = draft;

        initPreview();
        bindPanel();

        loadDraft().then(function (saved) {
            if (saved && typeof saved === 'object') {
                Object.keys(DEFAULTS).forEach(function (key) {
                    if (key === 'navItems') return;
                    if (saved[key] !== undefined && saved[key] !== null) draft[key] = saved[key];
                });
                if (Array.isArray(saved.navItems) && saved.navItems.length) {
                    draft.navItems = saved.navItems.map(cloneNavItem);
                }
            }
            populatePanel();
            draftReady = true;
            onReady();
            scheduleSave();
        });
    }

    window.McQueenPlusEditor = { init: init };
})();
