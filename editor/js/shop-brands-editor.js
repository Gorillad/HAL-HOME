/**
 * Woolf Designer — Shop by Brand section editor.
 */
(function () {
    'use strict';

    var MAX_BRANDS = 24;
    var MIN_BRANDS = 1;

    var DEFAULT_TITLE = 'Shop by Brand';
    var DEFAULT_SUBTITLE = 'Authorized lines from the manufacturers your team specifies every day';
    var DEFAULT_ALL_LABEL = 'View all brands';
    var DEFAULT_ALL_URL = '/brands';
    var DEFAULT_CAROUSEL_BG = '#e6ebf0';

    var DEFAULT_BRANDS = [
        { name: '3M Standard Abrasives', url: '/industrial-supplies?brand=3M', logoSrc: 'data/images/brands/1179631.jpg' },
        { name: 'Acheteck', url: '/industrial-supplies?brand=Acheteck', logoSrc: 'data/images/brands/1176491.jpg' },
        { name: 'Allied Machine & Engineering', url: '/industrial-supplies?brand=Allied+Machine', logoSrc: 'data/images/brands/allied.png' },
        { name: 'CGW Camel Grinding Wheels', url: '/industrial-supplies?brand=CGW', logoSrc: 'data/images/brands/10649.jpg' },
        { name: 'Coxreels', url: '/industrial-supplies?brand=Coxreels', logoSrc: 'data/images/brands/1177751.jpg' },
        { name: 'Crescent Tools', url: '/industrial-supplies?brand=Crescent+Tools', logoSrc: 'data/images/brands/1144381.jpg' },
        { name: 'Dapra Milling Solutions', url: '/industrial-supplies?brand=Dapra', logoSrc: 'data/images/brands/dapra.png' },
        { name: 'Emuge Franken', url: '/industrial-supplies?brand=Emuge+Franken', logoSrc: 'data/images/brands/10857.jpg' },
        { name: 'Greenfield Industries', url: '/industrial-supplies?brand=Greenfield+Industries', logoSrc: 'data/images/brands/10677.jpg' },
        { name: 'Jergens', url: '/industrial-supplies?brand=Jergens', logoSrc: 'data/images/brands/1150681.jpg' },
        { name: 'OSG', url: '/industrial-supplies?brand=OSG', logoSrc: 'data/images/brands/1128891.jpg' },
        { name: 'Walter Surface Technologies', url: '/industrial-supplies?brand=Walter', logoSrc: 'data/images/brands/walter.png' },
        { name: 'Haimer', url: '/industrial-supplies?brand=Haimer', logoSrc: 'data/images/brands/haimer.png' },
        { name: 'MCR Safety', url: '/industrial-supplies?brand=MCR+Safety', logoSrc: 'data/images/brands/7043.png' },
        { name: 'Missouri Tools Company', url: '/industrial-supplies?brand=Missouri+Tools+Company', logoSrc: 'data/images/brands/missouri-tools-co.jpg' },
        { name: 'Bahco', url: '/industrial-supplies?brand=Bahco', logoSrc: 'data/images/brands/1153951.jpg' },
        { name: 'Bessey', url: '/industrial-supplies?brand=Bessey', logoSrc: 'data/images/brands/1152441.jpg' },
        { name: 'Adenna', url: '/industrial-supplies?brand=Adenna', logoSrc: 'data/images/brands/1174791.jpg' },
    ];

    var mountEl = null;
    var headerMountEl = null;
    var getBrandsFn = null;
    var setBrandsFn = null;
    var getHeaderFn = null;
    var setHeaderFn = null;
    var onUpdateFn = null;
    var getIframeDocFn = null;
    var headerControlsBound = false;

    function cloneBrands(items) {
        return JSON.parse(JSON.stringify(items || DEFAULT_BRANDS));
    }

    function emptyBrand() {
        return {
            name: 'New brand',
            url: '/brands',
            logoSrc: '',
        };
    }

    function normalizeHex(value, fallback) {
        var hex = String(value || fallback || DEFAULT_CAROUSEL_BG).trim();
        if (!hex.startsWith('#')) hex = '#' + hex;
        if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return fallback || DEFAULT_CAROUSEL_BG;
        return hex.toLowerCase();
    }

    function migrateHeaderFromDraft(draft) {
        return {
            title: (draft && draft.shopBrandsTitle) || DEFAULT_TITLE,
            subtitle: (draft && draft.shopBrandsSubtitle) || DEFAULT_SUBTITLE,
            allLabel: (draft && draft.shopBrandsAllLabel) || DEFAULT_ALL_LABEL,
            allUrl: (draft && draft.shopBrandsAllUrl) || DEFAULT_ALL_URL,
            carouselBg: normalizeHex(draft && draft.shopBrandsCarouselBg, DEFAULT_CAROUSEL_BG),
        };
    }

    function migrateFromDraft(draft) {
        if (draft && draft.shopBrands && Array.isArray(draft.shopBrands) && draft.shopBrands.length) {
            return cloneBrands(draft.shopBrands);
        }
        return cloneBrands(DEFAULT_BRANDS);
    }

    function escAttr(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;');
    }

    function escText(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;');
    }

    function getBrandsRoot(doc) {
        if (!doc) return null;
        return doc.querySelector('.brands');
    }

    function buildBrandHtml(brand, index) {
        var logoSrc = brand.logoSrc || 'data/images/brands/1179631.jpg';
        return ''
            + '<li>'
            + '<a class="brand-card" href="' + escAttr(brand.url || '#') + '" id="shop-brand-' + index + '">'
            + '<img src="' + escAttr(logoSrc) + '" alt="' + escAttr(brand.name || 'Brand') + '" width="120" height="48" loading="lazy">'
            + '</a>'
            + '</li>';
    }

    function buildCarouselItemHtml(brand) {
        var logoSrc = brand.logoSrc || 'data/images/brands/1179631.jpg';
        return ''
            + '<a class="brand-carousel__item" href="' + escAttr(brand.url || '#') + '">'
            + '<img src="' + escAttr(logoSrc) + '" alt="' + escAttr(brand.name || 'Brand') + '" width="120" height="36" loading="lazy">'
            + '</a>';
    }

    function buildCarouselAllHtml(header) {
        var h = header || migrateHeaderFromDraft({});
        return ''
            + '<a class="brand-carousel__item brand-carousel__item--all" href="' + escAttr(h.allUrl || DEFAULT_ALL_URL) + '">'
            + '<span class="brand-carousel__all-label">' + escText(h.allLabel || DEFAULT_ALL_LABEL) + '</span>'
            + '<span class="brand-carousel__all-arrow" aria-hidden="true">→</span>'
            + '</a>';
    }

    function buildCarouselGroupHtml(brands, header) {
        var items = brands && brands.length ? brands : DEFAULT_BRANDS;
        return items.map(buildCarouselItemHtml).join('') + buildCarouselAllHtml(header);
    }

    function setCarouselDuration(carouselEl, brandCount) {
        if (!carouselEl) return;
        var count = brandCount || DEFAULT_BRANDS.length;
        var duration = Math.max(36, Math.min(90, count * 3));
        carouselEl.style.setProperty('--brands-carousel-duration', duration + 's');
    }

    function applyCarouselBackground(doc, bg) {
        if (!doc) return;
        var carousel = doc.querySelector('[data-brands-carousel]');
        if (carousel) {
            carousel.style.backgroundColor = normalizeHex(bg, DEFAULT_CAROUSEL_BG);
        }
    }

    function applyCarouselToDocument(doc, brands, header) {
        if (!doc) return;
        var root = getBrandsRoot(doc);
        if (!root) return;
        var carousel = root.querySelector('[data-brands-carousel]');
        if (!carousel) return;
        var track = carousel.querySelector('.brands__carousel-track');
        if (!track) return;

        var items = brands && brands.length ? brands : DEFAULT_BRANDS;
        var h = header || migrateHeaderFromDraft({});
        var groupHtml = buildCarouselGroupHtml(items, h);

        track.innerHTML = ''
            + '<div class="brands__carousel-group" aria-hidden="true">' + groupHtml + '</div>'
            + '<div class="brands__carousel-group">' + groupHtml + '</div>';

        setCarouselDuration(carousel, items.length);
        applyCarouselBackground(doc, h.carouselBg);

        if (typeof doc.defaultView !== 'undefined' && doc.defaultView.initBrandsCarousel) {
            doc.defaultView.initBrandsCarousel(carousel);
        }
    }

    function applyHeaderToDocument(doc, header) {
        var root = getBrandsRoot(doc);
        if (!root) return;
        var titleEl = root.querySelector('#brands-heading') || root.querySelector('.brands__title');
        var subtitleEl = root.querySelector('#brands-subtitle') || root.querySelector('.brands__subtitle');
        var allEl = root.querySelector('.brands__all');
        if (titleEl) titleEl.textContent = header.title || DEFAULT_TITLE;
        if (subtitleEl) subtitleEl.textContent = header.subtitle || DEFAULT_SUBTITLE;
        if (allEl) {
            allEl.textContent = header.allLabel || DEFAULT_ALL_LABEL;
            allEl.setAttribute('href', header.allUrl || DEFAULT_ALL_URL);
        }
        root.querySelectorAll('.brand-carousel__item--all').forEach(function (el) {
            el.setAttribute('href', header.allUrl || DEFAULT_ALL_URL);
            var labelEl = el.querySelector('.brand-carousel__all-label');
            if (labelEl) labelEl.textContent = header.allLabel || DEFAULT_ALL_LABEL;
        });
        applyCarouselBackground(doc, header.carouselBg);
    }

    function applyToDocument(doc, brands, header) {
        if (!doc) return;
        var root = getBrandsRoot(doc);
        if (!root) return;
        var grid = root.querySelector('.brands__grid');
        if (!grid) return;

        var items = brands && brands.length ? brands : DEFAULT_BRANDS;
        grid.innerHTML = items.map(buildBrandHtml).join('\n');
        var h = header || migrateHeaderFromDraft({});
        applyHeaderToDocument(doc, h);
        applyCarouselToDocument(doc, items, h);

        if (typeof window.__fitFullSite === 'function') {
            setTimeout(window.__fitFullSite, 60);
        }
    }

    function patchBrandInDocument(doc, brand, index) {
        if (!doc) return false;
        var card = doc.getElementById('shop-brand-' + index);
        if (!card) return false;

        card.setAttribute('href', brand.url || '#');
        var imgEl = card.querySelector('img');
        if (imgEl) {
            if (brand.logoSrc) imgEl.setAttribute('src', brand.logoSrc);
            imgEl.setAttribute('alt', brand.name || '');
        }
        return true;
    }

    function patchBrandInDocumentOrRebuild(doc, brands, index, header) {
        if (patchBrandInDocument(doc, brands[index], index)) {
            applyCarouselToDocument(doc, brands, header);
            return;
        }
        applyToDocument(doc, brands, header);
    }

    function commitBrands(brands, options) {
        options = options || {};
        if (setBrandsFn) setBrandsFn(brands);

        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (doc) {
            var header = getHeaderFn ? getHeaderFn() : null;
            if (options.mode === 'patch' && typeof options.index === 'number') {
                patchBrandInDocumentOrRebuild(doc, brands, options.index, header);
            } else {
                applyToDocument(doc, brands, header);
            }
        }

        if (onUpdateFn) onUpdateFn(brands, options);
    }

    function commitHeader(header) {
        var next = {
            title: header.title || DEFAULT_TITLE,
            subtitle: header.subtitle || DEFAULT_SUBTITLE,
            allLabel: header.allLabel || DEFAULT_ALL_LABEL,
            allUrl: header.allUrl || DEFAULT_ALL_URL,
            carouselBg: normalizeHex(header.carouselBg, DEFAULT_CAROUSEL_BG),
        };
        if (setHeaderFn) setHeaderFn(next);
        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (doc) {
            applyHeaderToDocument(doc, next);
            if (getBrandsFn) {
                applyCarouselToDocument(doc, getBrandsFn(), next);
            }
        }
        syncHeaderControls(next);
        if (onUpdateFn) onUpdateFn(null, { header: true });
    }

    function syncHeaderControls(header) {
        if (!headerMountEl) return;
        var titleInput = headerMountEl.querySelector('#shop-brands-title');
        var subtitleInput = headerMountEl.querySelector('#shop-brands-subtitle');
        var allLabelInput = headerMountEl.querySelector('#shop-brands-all-label');
        var allUrlInput = headerMountEl.querySelector('#shop-brands-all-url');
        if (titleInput && document.activeElement !== titleInput) titleInput.value = header.title;
        if (subtitleInput && document.activeElement !== subtitleInput) subtitleInput.value = header.subtitle;
        if (allLabelInput && document.activeElement !== allLabelInput) allLabelInput.value = header.allLabel;
        if (allUrlInput && document.activeElement !== allUrlInput) allUrlInput.value = header.allUrl;
        var carouselColorInput = headerMountEl.querySelector('#shop-brands-carousel-bg');
        var carouselHexInput = headerMountEl.querySelector('#shop-brands-carousel-bg-hex');
        if (carouselColorInput && document.activeElement !== carouselColorInput) {
            carouselColorInput.value = header.carouselBg;
        }
        if (carouselHexInput && document.activeElement !== carouselHexInput) {
            carouselHexInput.value = header.carouselBg;
        }
    }

    function renderHeaderControls() {
        if (!headerMountEl) return;
        var header = getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({});

        headerMountEl.innerHTML = ''
            + '<div class="editor-field">'
            + '<label class="editor-field-label" for="shop-brands-title">Section title</label>'
            + '<input type="text" id="shop-brands-title" class="editor-field-input" value="' + escAttr(header.title) + '">'
            + '</div>'
            + '<div class="editor-field">'
            + '<label class="editor-field-label" for="shop-brands-subtitle">Subtitle</label>'
            + '<input type="text" id="shop-brands-subtitle" class="editor-field-input" value="' + escAttr(header.subtitle) + '">'
            + '</div>'
            + '<div class="editor-field editor-field--inline">'
            + '<div>'
            + '<label class="editor-field-label" for="shop-brands-all-label">"View all" label</label>'
            + '<input type="text" id="shop-brands-all-label" class="editor-field-input" value="' + escAttr(header.allLabel) + '">'
            + '</div>'
            + '<div>'
            + '<label class="editor-field-label" for="shop-brands-all-url">"View all" URL</label>'
            + '<input type="text" id="shop-brands-all-url" class="editor-field-input" value="' + escAttr(header.allUrl) + '">'
            + '</div>'
            + '</div>'
            + '<div class="editor-field">'
            + '<label class="editor-field-label" for="shop-brands-carousel-bg">Carousel background</label>'
            + '<div class="editor-color-pair">'
            + '<input type="color" id="shop-brands-carousel-bg" value="' + escAttr(header.carouselBg) + '">'
            + '<input type="text" id="shop-brands-carousel-bg-hex" class="editor-color-hex editor-field-input" value="' + escAttr(header.carouselBg) + '" maxlength="7" aria-label="Carousel background hex">'
            + '</div>'
            + '</div>';

        if (headerControlsBound) return;
        headerControlsBound = true;

        headerMountEl.addEventListener('input', function (e) {
            var target = e.target;
            var current = getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({});
            if (target.id === 'shop-brands-title') {
                current.title = target.value;
                commitHeader(current);
            } else if (target.id === 'shop-brands-subtitle') {
                current.subtitle = target.value;
                commitHeader(current);
            } else if (target.id === 'shop-brands-all-label') {
                current.allLabel = target.value;
                commitHeader(current);
            } else if (target.id === 'shop-brands-all-url') {
                current.allUrl = target.value;
                commitHeader(current);
            } else if (target.id === 'shop-brands-carousel-bg') {
                current.carouselBg = normalizeHex(target.value, DEFAULT_CAROUSEL_BG);
                commitHeader(current);
            }
        });

        headerMountEl.addEventListener('change', function (e) {
            if (e.target.id !== 'shop-brands-carousel-bg-hex') return;
            var current = getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({});
            current.carouselBg = normalizeHex(e.target.value, current.carouselBg);
            commitHeader(current);
        });
    }

    function updateBrandField(index, key, value, mode) {
        var brands = cloneBrands(getBrandsFn ? getBrandsFn() : DEFAULT_BRANDS);
        if (!brands[index]) return;
        brands[index][key] = value;
        commitBrands(brands, { mode: mode || 'patch', index: index });
    }

    function renderPanel() {
        if (!mountEl) return;
        var brands = cloneBrands(getBrandsFn ? getBrandsFn() : DEFAULT_BRANDS);

        mountEl.innerHTML = brands.map(function (brand, index) {
            var hasLogo = !!brand.logoSrc;
            return ''
                + '<details class="designer-slide-group hero-slide-editor-card" data-brand-index="' + index + '">'
                + '<summary class="designer-slide-group-head">Brand ' + (index + 1)
                + (brand.name ? ' — ' + escText(brand.name).substring(0, 36) : '')
                + '</summary>'
                + '<div class="designer-slide-group-body">'
                + field('Brand name', 'name', brand.name, index, '3M Standard Abrasives')
                + field('Link URL', 'url', brand.url, index, '/industrial-supplies?brand=3M')
                + '<div class="editor-field">'
                + '<label class="editor-field-label">Brand logo</label>'
                + '<div class="editor-slide-bg-widget">'
                + '<div class="editor-slide-bg-thumb">'
                + (hasLogo
                    ? '<img src="' + escAttr(brand.logoSrc) + '" alt="" class="shop-brand-logo-preview">'
                    : '<span class="editor-slide-bg-thumb-empty">No logo uploaded</span>')
                + '</div>'
                + '<div class="editor-slide-bg-actions">'
                + '<label class="editor-logo-file-label">Upload'
                + '<input type="file" accept="image/*" class="shop-brand-logo-file" data-index="' + index + '" hidden>'
                + '</label>'
                + (hasLogo ? '<button type="button" class="editor-logo-remove-btn shop-brand-logo-remove" data-index="' + index + '">Remove</button>' : '')
                + '</div>'
                + '</div>'
                + '<p class="editor-field-hint">Recommended: <strong>120×48 px</strong> max display; wide horizontal logos.</p>'
                + '</div>'
                + (brands.length > MIN_BRANDS
                    ? '<button type="button" class="hero-slide-remove-btn" data-action="remove-brand" data-index="' + index + '">Remove brand</button>'
                    : '')
                + '</div>'
                + '</details>';
        }).join('');

        var addBtn = document.getElementById('shopBrandsAddBtn');
        if (addBtn) addBtn.disabled = brands.length >= MAX_BRANDS;

        bindPanelEvents();
    }

    function field(label, key, value, index, placeholder) {
        return ''
            + '<div class="editor-field">'
            + '<label class="editor-field-label">' + label + '</label>'
            + '<input type="text" class="editor-field-input shop-brand-input" data-index="' + index + '" data-key="' + key + '" value="' + escAttr(value) + '"'
            + (placeholder ? ' placeholder="' + escAttr(placeholder) + '"' : '')
            + '>'
            + '</div>';
    }

    function bindPanelEvents() {
        if (!mountEl) return;

        mountEl.querySelectorAll('.shop-brand-input').forEach(function (input) {
            input.addEventListener('input', function () {
                updateBrandField(parseInt(input.dataset.index, 10), input.dataset.key, input.value, 'patch');
            });
        });

        mountEl.querySelectorAll('.shop-brand-logo-file').forEach(function (input) {
            input.addEventListener('change', function () {
                var file = input.files && input.files[0];
                if (!file) return;
                var index = parseInt(input.dataset.index, 10);
                var reader = new FileReader();
                reader.onload = function (evt) {
                    updateBrandField(index, 'logoSrc', evt.target.result, 'patch');
                    renderPanel();
                };
                reader.readAsDataURL(file);
                input.value = '';
            });
        });

        mountEl.querySelectorAll('.shop-brand-logo-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var index = parseInt(btn.dataset.index, 10);
                var brands = cloneBrands(getBrandsFn ? getBrandsFn() : DEFAULT_BRANDS);
                if (!brands[index]) return;
                brands[index].logoSrc = DEFAULT_BRANDS[index]
                    ? DEFAULT_BRANDS[index].logoSrc
                    : '';
                commitBrands(brands, { mode: 'patch', index: index });
                renderPanel();
            });
        });

        mountEl.querySelectorAll('[data-action="remove-brand"]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var brands = cloneBrands(getBrandsFn ? getBrandsFn() : DEFAULT_BRANDS);
                var index = parseInt(btn.dataset.index, 10);
                if (brands.length <= MIN_BRANDS) return;
                brands.splice(index, 1);
                commitBrands(brands, { mode: 'rebuild' });
                renderPanel();
            });
        });
    }

    function init(options) {
        mountEl = options.mount || document.getElementById('shopBrandsEditorMount');
        headerMountEl = options.headerMount || document.getElementById('shopBrandsHeaderControls');
        getBrandsFn = options.getBrands;
        setBrandsFn = options.setBrands;
        getHeaderFn = options.getHeader;
        setHeaderFn = options.setHeader;
        onUpdateFn = options.onUpdate;
        getIframeDocFn = options.getIframeDoc;

        renderHeaderControls();
        syncHeaderControls(getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({}));

        var addBtn = document.getElementById('shopBrandsAddBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                var brands = cloneBrands(getBrandsFn ? getBrandsFn() : DEFAULT_BRANDS);
                if (brands.length >= MAX_BRANDS) return;
                brands.push(emptyBrand());
                commitBrands(brands, { mode: 'rebuild' });
                renderPanel();
            });
        }
    }

    window.ShopBrandsEditor = {
        DEFAULT_BRANDS: DEFAULT_BRANDS,
        DEFAULT_TITLE: DEFAULT_TITLE,
        DEFAULT_SUBTITLE: DEFAULT_SUBTITLE,
        DEFAULT_ALL_LABEL: DEFAULT_ALL_LABEL,
        DEFAULT_ALL_URL: DEFAULT_ALL_URL,
        DEFAULT_CAROUSEL_BG: DEFAULT_CAROUSEL_BG,
        MAX_BRANDS: MAX_BRANDS,
        MIN_BRANDS: MIN_BRANDS,
        migrateFromDraft: migrateFromDraft,
        migrateHeaderFromDraft: migrateHeaderFromDraft,
        applyToDocument: applyToDocument,
        renderPanel: renderPanel,
        syncHeaderControls: syncHeaderControls,
        init: init,
    };
}());
