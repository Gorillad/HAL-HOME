/**
 * Woolf Designer — Shop by Category section editor.
 */
(function () {
    'use strict';

    var MAX_CATEGORIES = 12;
    var MIN_CATEGORIES = 1;

    var DEFAULT_TITLE = 'Shop by Category';
    var DEFAULT_SUBTITLE = 'Browse our most popular product lines';

    var DEFAULT_CATEGORIES = [
        { name: 'Safety & PPE', url: '/industrial-supplies?category=Safety', imageSrc: 'data/images/category/d2-safety.webp' },
        { name: 'Cutting Tools', url: '/industrial-supplies?category=Cutting+Tools', imageSrc: 'data/images/category/d2-cuttingtools.webp' },
        { name: 'Hand Tools', url: '/industrial-supplies?category=Hand+Tools', imageSrc: 'data/images/category/d2-tools.webp' },
        { name: 'Abrasives', url: '/industrial-supplies?category=Abrasives', imageSrc: 'data/images/category/d2-abrasives.webp' },
        { name: 'Electrical', url: '/industrial-supplies?category=Electrical+Supplies', imageSrc: 'data/images/category/d2-electrical.webp' },
        { name: 'Fasteners', url: '/industrial-supplies?category=Fasteners', imageSrc: 'data/images/category/d2-fasteners.webp' },
        { name: 'Machinery', url: '/industrial-supplies?category=Machinery', imageSrc: 'data/images/category/d2-machinery.webp' },
        { name: 'Adhesives', url: '/industrial-supplies?category=Adhesives', imageSrc: 'data/images/category/d2-adhesives.webp' },
    ];

    var mountEl = null;
    var headerMountEl = null;
    var getCategoriesFn = null;
    var setCategoriesFn = null;
    var getHeaderFn = null;
    var setHeaderFn = null;
    var onUpdateFn = null;
    var getIframeDocFn = null;
    var headerControlsBound = false;

    function cloneCategories(items) {
        return JSON.parse(JSON.stringify(items || DEFAULT_CATEGORIES));
    }

    function emptyCategory() {
        return {
            name: 'New category',
            url: '/catalog',
            imageSrc: '',
        };
    }

    function migrateHeaderFromDraft(draft) {
        return {
            title: (draft && draft.shopCategoriesTitle) || DEFAULT_TITLE,
            subtitle: (draft && draft.shopCategoriesSubtitle) || DEFAULT_SUBTITLE,
        };
    }

    function migrateFromDraft(draft) {
        if (draft && draft.shopCategories && Array.isArray(draft.shopCategories) && draft.shopCategories.length) {
            return cloneCategories(draft.shopCategories);
        }
        return cloneCategories(DEFAULT_CATEGORIES);
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

    function getCategoriesRoot(doc) {
        if (!doc) return null;
        return doc.querySelector('.categories');
    }

    function buildCategoryHtml(cat, index) {
        var imgSrc = cat.imageSrc || 'data/images/category/d2-safety.webp';
        return ''
            + '<li>'
            + '<a class="category-card" href="' + escAttr(cat.url || '#') + '" id="shop-cat-' + index + '">'
            + '<span class="category-card__media">'
            + '<img src="' + escAttr(imgSrc) + '" alt="" width="280" height="210" loading="lazy">'
            + '</span>'
            + '<span class="category-card__name">' + escText(cat.name || 'Category') + '</span>'
            + '</a>'
            + '</li>';
    }

    function applyHeaderToDocument(doc, header) {
        var root = getCategoriesRoot(doc);
        if (!root) return;
        var titleEl = root.querySelector('#categories-heading') || root.querySelector('.categories__title');
        var subtitleEl = root.querySelector('#categories-subtitle') || root.querySelector('.categories__subtitle');
        if (titleEl) titleEl.textContent = header.title || DEFAULT_TITLE;
        if (subtitleEl) subtitleEl.textContent = header.subtitle || DEFAULT_SUBTITLE;
    }

    function applyToDocument(doc, categories, header) {
        if (!doc) return;
        var root = getCategoriesRoot(doc);
        if (!root) return;
        var grid = root.querySelector('.categories__grid');
        if (!grid) return;

        var items = categories && categories.length ? categories : DEFAULT_CATEGORIES;
        grid.innerHTML = items.map(buildCategoryHtml).join('\n');
        applyHeaderToDocument(doc, header || migrateHeaderFromDraft({}));

        if (typeof window.__fitFullSite === 'function') {
            setTimeout(window.__fitFullSite, 60);
        }
    }

    function patchCategoryInDocument(doc, cat, index) {
        if (!doc) return false;
        var card = doc.getElementById('shop-cat-' + index);
        if (!card) return false;

        card.setAttribute('href', cat.url || '#');
        var nameEl = card.querySelector('.category-card__name');
        var imgEl = card.querySelector('.category-card__media img');
        if (nameEl) nameEl.textContent = cat.name || '';
        if (imgEl && cat.imageSrc) imgEl.setAttribute('src', cat.imageSrc);
        return true;
    }

    function commitCategories(categories, options) {
        options = options || {};
        if (setCategoriesFn) setCategoriesFn(categories);

        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (doc) {
            if (options.mode === 'patch' && typeof options.index === 'number') {
                if (!patchCategoryInDocument(doc, categories[options.index], options.index)) {
                    applyToDocument(doc, categories, getHeaderFn ? getHeaderFn() : null);
                }
            } else {
                applyToDocument(doc, categories, getHeaderFn ? getHeaderFn() : null);
            }
        }

        if (onUpdateFn) onUpdateFn(categories, options);
    }

    function commitHeader(header) {
        var next = {
            title: header.title || DEFAULT_TITLE,
            subtitle: header.subtitle || DEFAULT_SUBTITLE,
        };
        if (setHeaderFn) setHeaderFn(next);
        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (doc) applyHeaderToDocument(doc, next);
        syncHeaderControls(next);
        if (onUpdateFn) onUpdateFn(null, { header: true });
    }

    function syncHeaderControls(header) {
        if (!headerMountEl) return;
        var titleInput = headerMountEl.querySelector('#shop-cats-title');
        var subtitleInput = headerMountEl.querySelector('#shop-cats-subtitle');
        if (titleInput && document.activeElement !== titleInput) titleInput.value = header.title;
        if (subtitleInput && document.activeElement !== subtitleInput) subtitleInput.value = header.subtitle;
    }

    function renderHeaderControls() {
        if (!headerMountEl) return;
        var header = getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({});

        headerMountEl.innerHTML = ''
            + '<div class="editor-field">'
            + '<label class="editor-field-label" for="shop-cats-title">Section title</label>'
            + '<input type="text" id="shop-cats-title" class="editor-field-input" value="' + escAttr(header.title) + '">'
            + '</div>'
            + '<div class="editor-field">'
            + '<label class="editor-field-label" for="shop-cats-subtitle">Subtitle</label>'
            + '<input type="text" id="shop-cats-subtitle" class="editor-field-input" value="' + escAttr(header.subtitle) + '">'
            + '</div>';

        if (headerControlsBound) return;
        headerControlsBound = true;

        headerMountEl.addEventListener('input', function (e) {
            var target = e.target;
            var current = getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({});
            if (target.id === 'shop-cats-title') {
                current.title = target.value;
                commitHeader(current);
            } else if (target.id === 'shop-cats-subtitle') {
                current.subtitle = target.value;
                commitHeader(current);
            }
        });
    }

    function updateCategoryField(index, key, value, mode) {
        var categories = cloneCategories(getCategoriesFn ? getCategoriesFn() : DEFAULT_CATEGORIES);
        if (!categories[index]) return;
        categories[index][key] = value;
        commitCategories(categories, { mode: mode || 'patch', index: index });
    }

    function renderPanel() {
        if (!mountEl) return;
        var categories = cloneCategories(getCategoriesFn ? getCategoriesFn() : DEFAULT_CATEGORIES);

        mountEl.innerHTML = categories.map(function (cat, index) {
            var hasImg = !!cat.imageSrc;
            return ''
                + '<details class="designer-slide-group hero-slide-editor-card" data-cat-index="' + index + '">'
                + '<summary class="designer-slide-group-head">Category ' + (index + 1)
                + (cat.name ? ' — ' + escText(cat.name).substring(0, 36) : '')
                + '</summary>'
                + '<div class="designer-slide-group-body">'
                + field('Category name', 'name', cat.name, index, 'Safety & PPE')
                + field('Link URL', 'url', cat.url, index, '/industrial-supplies?category=Safety')
                + '<div class="editor-field">'
                + '<label class="editor-field-label">Category image</label>'
                + '<div class="editor-slide-bg-widget">'
                + '<div class="editor-slide-bg-thumb">'
                + (hasImg
                    ? '<img src="' + escAttr(cat.imageSrc) + '" alt="" class="shop-cat-bg-preview">'
                    : '<span class="editor-slide-bg-thumb-empty">No image uploaded</span>')
                + '</div>'
                + '<div class="editor-slide-bg-actions">'
                + '<label class="editor-logo-file-label">Upload'
                + '<input type="file" accept="image/*" class="shop-cat-image-file" data-index="' + index + '" hidden>'
                + '</label>'
                + (hasImg ? '<button type="button" class="editor-logo-remove-btn shop-cat-image-remove" data-index="' + index + '">Remove</button>' : '')
                + '</div>'
                + '</div>'
                + '<p class="editor-field-hint">Recommended: <strong>280×210 px</strong> (4:3).</p>'
                + '</div>'
                + (categories.length > MIN_CATEGORIES
                    ? '<button type="button" class="hero-slide-remove-btn" data-action="remove-cat" data-index="' + index + '">Remove category</button>'
                    : '')
                + '</div>'
                + '</details>';
        }).join('');

        var addBtn = document.getElementById('shopCategoriesAddBtn');
        if (addBtn) addBtn.disabled = categories.length >= MAX_CATEGORIES;

        bindPanelEvents();
    }

    function field(label, key, value, index, placeholder) {
        return ''
            + '<div class="editor-field">'
            + '<label class="editor-field-label">' + label + '</label>'
            + '<input type="text" class="editor-field-input shop-cat-input" data-index="' + index + '" data-key="' + key + '" value="' + escAttr(value) + '"'
            + (placeholder ? ' placeholder="' + escAttr(placeholder) + '"' : '')
            + '>'
            + '</div>';
    }

    function bindPanelEvents() {
        if (!mountEl) return;

        mountEl.querySelectorAll('.shop-cat-input').forEach(function (input) {
            input.addEventListener('input', function () {
                updateCategoryField(parseInt(input.dataset.index, 10), input.dataset.key, input.value, 'patch');
            });
        });

        mountEl.querySelectorAll('.shop-cat-image-file').forEach(function (input) {
            input.addEventListener('change', function () {
                var file = input.files && input.files[0];
                if (!file) return;
                var index = parseInt(input.dataset.index, 10);
                var reader = new FileReader();
                reader.onload = function (evt) {
                    updateCategoryField(index, 'imageSrc', evt.target.result, 'patch');
                    renderPanel();
                };
                reader.readAsDataURL(file);
                input.value = '';
            });
        });

        mountEl.querySelectorAll('.shop-cat-image-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var index = parseInt(btn.dataset.index, 10);
                var categories = cloneCategories(getCategoriesFn ? getCategoriesFn() : DEFAULT_CATEGORIES);
                if (!categories[index]) return;
                categories[index].imageSrc = DEFAULT_CATEGORIES[index]
                    ? DEFAULT_CATEGORIES[index].imageSrc
                    : '';
                commitCategories(categories, { mode: 'patch', index: index });
                renderPanel();
            });
        });

        mountEl.querySelectorAll('[data-action="remove-cat"]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var categories = cloneCategories(getCategoriesFn ? getCategoriesFn() : DEFAULT_CATEGORIES);
                var index = parseInt(btn.dataset.index, 10);
                if (categories.length <= MIN_CATEGORIES) return;
                categories.splice(index, 1);
                commitCategories(categories, { mode: 'rebuild' });
                renderPanel();
            });
        });
    }

    function init(options) {
        mountEl = options.mount || document.getElementById('shopCategoriesEditorMount');
        headerMountEl = options.headerMount || document.getElementById('shopCategoriesHeaderControls');
        getCategoriesFn = options.getCategories;
        setCategoriesFn = options.setCategories;
        getHeaderFn = options.getHeader;
        setHeaderFn = options.setHeader;
        onUpdateFn = options.onUpdate;
        getIframeDocFn = options.getIframeDoc;

        renderHeaderControls();
        syncHeaderControls(getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({}));

        var addBtn = document.getElementById('shopCategoriesAddBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                var categories = cloneCategories(getCategoriesFn ? getCategoriesFn() : DEFAULT_CATEGORIES);
                if (categories.length >= MAX_CATEGORIES) return;
                categories.push(emptyCategory());
                commitCategories(categories, { mode: 'rebuild' });
                renderPanel();
            });
        }
    }

    window.ShopCategoriesEditor = {
        DEFAULT_CATEGORIES: DEFAULT_CATEGORIES,
        DEFAULT_TITLE: DEFAULT_TITLE,
        DEFAULT_SUBTITLE: DEFAULT_SUBTITLE,
        MAX_CATEGORIES: MAX_CATEGORIES,
        MIN_CATEGORIES: MIN_CATEGORIES,
        migrateFromDraft: migrateFromDraft,
        migrateHeaderFromDraft: migrateHeaderFromDraft,
        applyToDocument: applyToDocument,
        renderPanel: renderPanel,
        syncHeaderControls: syncHeaderControls,
        init: init,
    };
}());
