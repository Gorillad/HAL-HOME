/**
 * Cardiff Designer editor — coastal homepage live iframe preview.
 */
(function () {
    'use strict';

    var TEMPLATE = 'cardiff';
    var LS_KEY = 'logicxo-designer-cardiff';

    var DEFAULTS = {
        logoSrc: 'data/images/cardiff-logo.png',
        logoUrl: '/',
        logoSize: 72,
        topBarCopy: 'Free design guidance · Coastal delivery specialists',
        searchPlaceholder: 'Find coastal lighting you\'ll love…',
        headerAccountUrl: '/account',
        headerWishlistUrl: '/wishlist',
        headerCartUrl: '/cart',

        colorPrimary: '#c76469',
        colorSecondary: '#c79a64',
        colorAccent: '#64c7c2',
        colorBg: '#f4e9e8',
        colorText: '#2f2a2a',
        colorButtonText: '#ffffff',
        colorButtonHoverBg: '#c79a64',
        colorButtonHoverText: '#ffffff',

        heroImg: 'data/images/catalog/kichen-cardiff.png',
        heroHeadline: 'Summer Sale',
        heroCopy: 'The best summer projects start with great lighting.',
        heroDiscount: '50% Off',
        heroCode: 'SUMMER',
        heroCtaLabel: 'Shop & Save',
        heroCtaUrl: '/sale',
        heroFineprint: '*Featured Product: 60587-48',

        catEyebrow: 'Shop the Shoreline',
        catHeading: 'Category bands for every coastal room',
        catIntro: 'From woven pendants to linen-shaded lamps — find the silhouette that softens your space.',

        cat1Tag: 'Woven textures',
        cat1Title: 'Woven Pendants',
        cat1Copy: 'Seagrass, jute, and rattan silhouettes with warm brass',
        cat1Url: '/catalog/lighting/ceiling-lights/pendants',
        cat1Img: 'data/images/rooms/pendent-cardiff.png',

        cat2Tag: 'Dining glow',
        cat2Title: 'Dining Chandeliers',
        cat2Copy: 'Beaded and organic fixtures for serene gatherings',
        cat2Url: '/catalog/lighting/ceiling-lights/chandeliers',
        cat2Img: 'data/images/rooms/dinning-cardiff.png',

        cat3Tag: 'Bath & vanity',
        cat3Title: 'Bath Lighting',
        cat3Copy: 'Soft coastal finishes for bright, calm baths',
        cat3Url: '/catalog/lighting/wall-lights/bathroom-vanity-lights',
        cat3Img: 'data/images/catalog/bathroom-cardiff.png',

        cat4Tag: 'Seaside outdoor',
        cat4Title: 'Patio Lanterns',
        cat4Copy: 'Rope-hung lanterns for porches, decks, and entries',
        cat4Url: '/catalog/outdoor',
        cat4Img: 'data/images/catalog/outdoor-cardiff.png',

        storyEyebrow: 'The Cardiff Point of View',
        storyHeading: 'Rooms that breathe with the tide',
        storyCopy: 'We curate lighting that leans into natural materials and soft coastal color — never heavy, never harsh.',
        storyCtaLabel: 'Our Coastal Story',
        storyCtaUrl: '/about',
        storyImg: 'data/images/rooms/bar-rooom-cardiff.png',

        expertEyebrow: 'Lighting Specialists',
        expertHeadline: 'Need help choosing coastal finishes?',
        expertCopy: 'Tell us about your rooms — we’ll recommend woven textures, metals, and shade styles that stay serene year-round.',
        expertCtaLabel: 'Ask a Specialist',
        expertCtaUrl: '/contact'
    };

    var draft = null;
    var draftReady = false;
    var iframeDoc = null;
    var iframeReady = false;
    var frame = null;
    var saveToast = null;
    var saveTimer = null;

    function $(id) { return document.getElementById(id); }

    function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveDraft, 400);
    }

    function showSaveToast() {
        if (!saveToast) return;
        saveToast.textContent = 'Cardiff draft saved';
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
                body: JSON.stringify(payload)
            }).catch(function () { /* offline */ });
        }
        showSaveToast();
    }

    function loadDraft() {
        try {
            var raw = localStorage.getItem(LS_KEY);
            if (raw) return Promise.resolve(migrateDraft(JSON.parse(raw)));
        } catch (e) { /* ignore */ }
        if (!window.DESIGNER_API_ENABLED) return Promise.resolve(null);
        return fetch((window.DESIGNER_API_BASE || '') + '/api/designer/draft?template=' + TEMPLATE, { credentials: 'include' })
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (data) { return migrateDraft((data && (data.draft || data)) || null); })
            .catch(function () { return null; });
    }

    function migrateDraft(saved) {
        if (!saved || typeof saved !== 'object') return saved;
        if (saved.logoSrc && /cardiff-logo\.svg/i.test(String(saved.logoSrc))) {
            saved.logoSrc = DEFAULTS.logoSrc;
        }
        var imageUpgrades = {
            heroImg: [
                'data/images/hero/primary.jpg',
                'data/images/hero/hero-01.png'
            ],
            cat1Img: [
                'data/images/catalog/pendants.jpg',
                'data/images/hero/hero-03.png'
            ],
            cat2Img: [
                'data/images/catalog/lantern.jpg',
                'data/images/hero/hero-04.png'
            ],
            cat3Img: [
                'data/images/rooms/living.jpg',
                'data/images/catalog/vanity.jpg'
            ],
            cat4Img: [
                'data/images/hero/secondary.jpg',
                'data/images/hero/hero-02.png'
            ],
            storyImg: [
                'data/images/rooms/living.jpg',
                'data/images/hero/hero-04.png'
            ]
        };
        Object.keys(imageUpgrades).forEach(function (key) {
            if (imageUpgrades[key].indexOf(saved[key]) !== -1) {
                saved[key] = DEFAULTS[key];
                if (key.indexOf('cat') === 0) {
                    var n = key.charAt(3);
                    ['Tag', 'Title', 'Copy', 'Url'].forEach(function (suffix) {
                        var field = 'cat' + n + suffix;
                        if (DEFAULTS[field] !== undefined) saved[field] = DEFAULTS[field];
                    });
                }
            }
        });
        // Upgrade previous split-hero defaults to promo-card hero
        if (
            saved.heroHeadline === 'Light that feels like sea air' ||
            saved.heroEyebrow === 'Coastal Lighting Collection'
        ) {
            saved.heroImg = DEFAULTS.heroImg;
            saved.heroHeadline = DEFAULTS.heroHeadline;
            saved.heroCopy = DEFAULTS.heroCopy;
            saved.heroDiscount = DEFAULTS.heroDiscount;
            saved.heroCode = DEFAULTS.heroCode;
            saved.heroCtaLabel = DEFAULTS.heroCtaLabel;
            saved.heroCtaUrl = DEFAULTS.heroCtaUrl;
            saved.heroFineprint = DEFAULTS.heroFineprint;
        }
        if (saved.colorSea === '#4a7c9b' || saved.colorPrimary === undefined) {
            if (!saved.colorPrimary) saved.colorPrimary = DEFAULTS.colorPrimary;
        }
        if (saved.colorSeaDeep === '#1f3a4a' || saved.colorSecondary === undefined) {
            if (!saved.colorSecondary) saved.colorSecondary = DEFAULTS.colorSecondary;
        }
        if (saved.colorSeaLight === '#8eb8d4' || saved.colorAccent === undefined) {
            if (!saved.colorAccent) saved.colorAccent = DEFAULTS.colorAccent;
        }
        if (saved.colorSand === '#e8dfd0' || saved.colorBg === undefined) {
            if (!saved.colorBg) saved.colorBg = DEFAULTS.colorBg;
        }
        if (!saved.colorText) saved.colorText = DEFAULTS.colorText;
        if (saved.colorButtonHoverBg === '#4a7c9b') {
            saved.colorButtonHoverBg = DEFAULTS.colorButtonHoverBg;
        }
        return saved;
    }

    function qsel(sel) {
        return iframeDoc ? iframeDoc.querySelector(sel) : null;
    }

    function setText(sel, value) {
        var el = qsel(sel);
        if (el) el.textContent = value;
    }

    function setHref(sel, value) {
        var el = qsel(sel);
        if (el) el.setAttribute('href', value);
    }

    function setSrc(sel, value) {
        var el = qsel(sel);
        if (el) el.src = value;
    }

    function cv(key) {
        return draft[key] !== undefined && draft[key] !== null ? draft[key] : DEFAULTS[key];
    }

    function applyColors() {
        if (!iframeDoc) return;
        var styleId = '__cardiff-designer-colors__';
        var el = iframeDoc.getElementById(styleId);
        if (!el) {
            el = iframeDoc.createElement('style');
            el.id = styleId;
            iframeDoc.head.appendChild(el);
        }
        el.textContent = ''
            + ':root {'
            + '--cardiff-primary: ' + cv('colorPrimary') + ';'
            + '--cardiff-secondary: ' + cv('colorSecondary') + ';'
            + '--cardiff-accent: ' + cv('colorAccent') + ';'
            + '--cardiff-bg: ' + cv('colorBg') + ';'
            + '--cardiff-text: ' + cv('colorText') + ';'
            + '--cardiff-sea: ' + cv('colorPrimary') + ';'
            + '--cardiff-sea-deep: ' + cv('colorPrimary') + ';'
            + '--cardiff-sea-light: ' + cv('colorAccent') + ';'
            + '--cardiff-brass: ' + cv('colorSecondary') + ';'
            + '--cardiff-btn-bg: ' + cv('colorPrimary') + ';'
            + '--cardiff-btn-text: ' + cv('colorButtonText') + ';'
            + '--cardiff-btn-hover-bg: ' + cv('colorButtonHoverBg') + ';'
            + '--cardiff-btn-hover-text: ' + cv('colorButtonHoverText') + ';'
            + '}';
    }

    function applyLogo() {
        var src = cv('logoSrc');
        setSrc('#cardiffHeaderLogo', src);
        setSrc('#cardiffFooterLogo', src);
        var root = iframeDoc && iframeDoc.documentElement;
        if (root) root.style.setProperty('--cardiff-header-logo-h', (cv('logoSize') || 56) + 'px');
        setHref('#cardiffLogoLink', cv('logoUrl'));
        setHref('#cardiffFooterLogoLink', cv('logoUrl'));
    }

    function applyHeader() {
        setText('#cardiffTopBarCopy', cv('topBarCopy'));
        var search = qsel('#cardiffSearchInput');
        if (search) search.setAttribute('placeholder', cv('searchPlaceholder'));
        setHref('#cardiffHeaderAccountLink', cv('headerAccountUrl'));
        setHref('#cardiffHeaderWishlistLink', cv('headerWishlistUrl'));
        setHref('#cardiffHeaderCartLink', cv('headerCartUrl'));
    }

    function applyHero() {
        setSrc('#cardiffHeroImg', cv('heroImg'));
        setText('#cardiffHeroHeadline', cv('heroHeadline'));
        setText('#cardiffHeroCopy', cv('heroCopy'));
        setText('#cardiffHeroDiscount', cv('heroDiscount'));
        setText('#cardiffHeroCode', cv('heroCode'));
        setText('#cardiffHeroCta', cv('heroCtaLabel'));
        setHref('#cardiffHeroCta', cv('heroCtaUrl'));
        setText('#cardiffHeroFineprint', cv('heroFineprint'));
    }

    function applyCategories() {
        setText('#cardiffCatEyebrow', cv('catEyebrow'));
        setText('#cardiffCatHeading', cv('catHeading'));
        setText('#cardiffCatIntro', cv('catIntro'));
        for (var i = 1; i <= 4; i++) {
            setText('#cardiffCat' + i + 'Tag', cv('cat' + i + 'Tag'));
            setText('#cardiffCat' + i + 'Title', cv('cat' + i + 'Title'));
            setText('#cardiffCat' + i + 'Copy', cv('cat' + i + 'Copy'));
            setHref('#cardiffCat' + i + 'Link', cv('cat' + i + 'Url'));
            setSrc('#cardiffCat' + i + 'Img', cv('cat' + i + 'Img'));
        }
    }

    function applyStoryExpert() {
        setSrc('#cardiffStoryImg', cv('storyImg'));
        setText('#cardiffStoryEyebrow', cv('storyEyebrow'));
        setText('#cardiffStoryHeading', cv('storyHeading'));
        setText('#cardiffStoryCopy', cv('storyCopy'));
        setText('#cardiffStoryCta', cv('storyCtaLabel'));
        setHref('#cardiffStoryCta', cv('storyCtaUrl'));
        setText('#cardiffExpertEyebrow', cv('expertEyebrow'));
        setText('#cardiffExpertHeadline', cv('expertHeadline'));
        setText('#cardiffExpertCopy', cv('expertCopy'));
        setText('#cardiffExpertCta', cv('expertCtaLabel'));
        setHref('#cardiffExpertCta', cv('expertCtaUrl'));
    }

    function applyAll() {
        if (!iframeDoc) return;
        applyColors();
        applyLogo();
        applyHeader();
        applyHero();
        applyCategories();
        applyStoryExpert();
    }

    function onReady() {
        if (!draftReady || !iframeReady) return;
        applyAll();
        if (typeof window.__fitFullSite === 'function') window.__fitFullSite();
    }

    function populatePanel() {
        var panel = $('cardiffFieldPanel');
        if (!panel) return;
        panel.querySelectorAll('[data-cardiff-field]').forEach(function (el) {
            var key = el.dataset.cardiffField;
            if (!key || DEFAULTS[key] === undefined) return;
            el.value = cv(key);
        });
        panel.querySelectorAll('[data-cardiff-color]').forEach(function (el) {
            var key = el.dataset.cardiffColor;
            if (!key) return;
            el.value = cv(key);
        });
        panel.querySelectorAll('[data-cardiff-color-hex]').forEach(function (el) {
            var key = el.dataset.cardiffColorHex;
            if (!key) return;
            el.value = cv(key);
        });
        var sizeVal = $('cf-logo-size-val');
        if (sizeVal) sizeVal.textContent = cv('logoSize') + 'px';
    }

    function normalizeHexColor(value) {
        if (value == null) return null;
        var v = String(value).trim().toLowerCase();
        if (!v) return null;
        var rgbMatch = v.match(/^rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})/i);
        if (rgbMatch) {
            return '#' + rgbMatch.slice(1, 4).map(function (n) {
                return Math.max(0, Math.min(255, parseInt(n, 10))).toString(16).padStart(2, '0');
            }).join('');
        }
        if (v.charAt(0) === '#') v = v.slice(1);
        v = v.replace(/[^0-9a-f]/g, '');
        if (v.length === 3) v = v.split('').map(function (ch) { return ch + ch; }).join('');
        if (v.length >= 8) v = v.slice(0, 6);
        else if (v.length > 6) v = v.slice(0, 6);
        return /^[0-9a-f]{6}$/.test(v) ? '#' + v : null;
    }

    function bindPanel() {
        var panel = $('cardiffFieldPanel');
        if (!panel) return;

        panel.querySelectorAll('[data-cardiff-field]').forEach(function (el) {
            el.addEventListener('input', function () {
                var key = el.dataset.cardiffField;
                if (!key) return;
                draft[key] = el.type === 'range' ? Number(el.value) : el.value;
                if (key === 'logoSize') {
                    var sizeVal = $('cf-logo-size-val');
                    if (sizeVal) sizeVal.textContent = draft[key] + 'px';
                }
                applyAll();
                scheduleSave();
            });
        });

        panel.querySelectorAll('[data-cardiff-color]').forEach(function (picker) {
            picker.addEventListener('input', function () {
                var key = picker.dataset.cardiffColor;
                if (!key) return;
                draft[key] = picker.value;
                var hex = panel.querySelector('[data-cardiff-color-hex="' + key + '"]');
                if (hex) hex.value = picker.value;
                applyColors();
                scheduleSave();
            });
        });

        panel.querySelectorAll('[data-cardiff-color-hex]').forEach(function (hexInput) {
            hexInput.removeAttribute('maxlength');
            hexInput.setAttribute('placeholder', '#RRGGBB');

            function commitHex(raw) {
                var key = hexInput.dataset.cardiffColorHex;
                if (!key) return;
                var norm = normalizeHexColor(raw);
                if (!norm) return;
                hexInput.value = norm;
                draft[key] = norm;
                var picker = panel.querySelector('[data-cardiff-color="' + key + '"]');
                if (picker) picker.value = norm;
                applyColors();
                scheduleSave();
            }

            hexInput.addEventListener('paste', function (event) {
                event.preventDefault();
                var pasted = (event.clipboardData || window.clipboardData)
                    ? (event.clipboardData || window.clipboardData).getData('text')
                    : '';
                commitHex(pasted);
            });
            hexInput.addEventListener('input', function () {
                commitHex(hexInput.value);
            });
            hexInput.addEventListener('change', function () {
                commitHex(hexInput.value);
            });
        });

        var logoFile = $('cf-logo-file');
        if (logoFile) {
            logoFile.addEventListener('change', function () {
                var file = logoFile.files && logoFile.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function (evt) {
                    draft.logoSrc = evt.target.result;
                    applyLogo();
                    scheduleSave();
                };
                reader.readAsDataURL(file);
            });
        }

        var logoRemove = $('cf-logo-remove');
        if (logoRemove) {
            logoRemove.addEventListener('click', function () {
                draft.logoSrc = DEFAULTS.logoSrc;
                applyLogo();
                scheduleSave();
            });
        }

        for (var i = 1; i <= 4; i++) {
            (function (n) {
                var input = $('cf-cat' + n + '-file');
                if (!input) return;
                input.addEventListener('change', function () {
                    var file = input.files && input.files[0];
                    if (!file) return;
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        draft['cat' + n + 'Img'] = evt.target.result;
                        applyCategories();
                        scheduleSave();
                    };
                    reader.readAsDataURL(file);
                });
            })(i);
        }

        var heroFile = $('cf-hero-file');
        if (heroFile) {
            heroFile.addEventListener('change', function () {
                var file = heroFile.files && heroFile.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function (evt) {
                    draft.heroImg = evt.target.result;
                    applyHero();
                    scheduleSave();
                };
                reader.readAsDataURL(file);
            });
        }
    }

    function initPreview() {
        frame = $('cardiffFullSiteFrame');
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
        if ((window.__designerSlug || '') !== 'cardiff') return;

        saveToast = $('saveToast');
        draft = Object.assign({}, DEFAULTS);
        window.__cardiffDraft = draft;

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
            scheduleSave();
        });
    }

    window.CardiffEditor = { init: init };
})();
