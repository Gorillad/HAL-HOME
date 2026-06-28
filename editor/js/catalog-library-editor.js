/**
 * Woolf Designer — Catalog Library section editor.
 */
(function () {
    'use strict';

    var MAX_CATALOGS = 12;
    var MIN_CATALOGS = 1;

    var DEFAULT_TITLE = 'Vendor Catalog Library';
    var DEFAULT_SUBTITLE = 'Browse and download digital catalogs from the manufacturers we represent';
    var DEFAULT_ALL_LABEL = 'View all catalogs';
    var DEFAULT_ALL_URL = '/catalogs';

    var PDF_ACTION_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>';

    var DEFAULT_CATALOGS = [
        {
            vendor: 'Bessey',
            title: 'Induction Bearing Heaters User Manual',
            meta: 'SC110D, SC110V, BC & BCS Models',
            coverSrc: 'data/images/pdf/pdf-1.png',
            pdfUrl: 'data/catalogs/bessey-induction-heaters.pdf',
        },
        {
            vendor: 'Emuge Franken',
            title: 'High Precision FPC Milling/Drilling Chucks',
            meta: 'CAT Dual Contact & HSK Models',
            coverSrc: 'data/images/pdf/pdf-2.png',
            pdfUrl: 'data/catalogs/emuge-franken-fpc-chucks.pdf',
        },
        {
            vendor: 'Bahco',
            title: 'Bandsaw Blades Catalog',
            meta: 'Full Line Reference',
            coverSrc: 'data/images/pdf/pdf-4.png',
            pdfUrl: 'data/catalogs/bahco-bandsaw-blades.pdf',
        },
        {
            vendor: 'OSG',
            title: 'The A Brand — Tooling Master Class',
            meta: 'Product Brochure',
            coverSrc: 'data/images/pdf/pdf-8.png',
            pdfUrl: 'data/catalogs/osg-a-brand.pdf',
        },
    ];

    var mountEl = null;
    var headerMountEl = null;
    var getCatalogsFn = null;
    var setCatalogsFn = null;
    var getHeaderFn = null;
    var setHeaderFn = null;
    var onUpdateFn = null;
    var getIframeDocFn = null;
    var headerControlsBound = false;

    function cloneCatalogs(items) {
        return JSON.parse(JSON.stringify(items || DEFAULT_CATALOGS));
    }

    function emptyCatalog() {
        return {
            vendor: 'Manufacturer',
            title: 'New catalog',
            meta: '',
            coverSrc: '',
            pdfUrl: '',
        };
    }

    function migrateHeaderFromDraft(draft) {
        return {
            title: (draft && draft.catalogTitle) || DEFAULT_TITLE,
            subtitle: (draft && draft.catalogSubtitle) || DEFAULT_SUBTITLE,
            allLabel: (draft && draft.catalogAllLabel) || DEFAULT_ALL_LABEL,
            allUrl: (draft && draft.catalogAllUrl) || DEFAULT_ALL_URL,
        };
    }

    function migrateFromDraft(draft) {
        if (draft && draft.catalogItems && Array.isArray(draft.catalogItems) && draft.catalogItems.length) {
            return cloneCatalogs(draft.catalogItems);
        }
        return cloneCatalogs(DEFAULT_CATALOGS);
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

    function getCatalogRoot(doc) {
        if (!doc) return null;
        return doc.querySelector('.section-three');
    }

    function buildCatalogCardHtml(item, index) {
        var coverSrc = item.coverSrc || 'data/images/pdf/pdf-1.png';
        var pdfUrl = item.pdfUrl || '#';
        return ''
            + '<li class="catalog-card" id="catalog-item-' + index + '">'
            + '<a class="catalog-card__link" href="' + escAttr(pdfUrl) + '" target="_blank" rel="noopener noreferrer">'
            + '<div class="catalog-card__cover">'
            + '<img src="' + escAttr(coverSrc) + '" alt="' + escAttr(item.title || 'Catalog cover') + '" width="280" height="360" loading="lazy">'
            + '<span class="catalog-card__badge">PDF</span>'
            + '</div>'
            + '<div class="catalog-card__body">'
            + '<p class="catalog-card__vendor">' + escText(item.vendor || '') + '</p>'
            + '<h3 class="catalog-card__title">' + escText(item.title || 'Catalog') + '</h3>'
            + '<p class="catalog-card__meta">' + escText(item.meta || '') + '</p>'
            + '<span class="catalog-card__action">View PDF ' + PDF_ACTION_SVG + '</span>'
            + '</div>'
            + '</a>'
            + '</li>';
    }

    function applyHeaderToDocument(doc, header) {
        var root = getCatalogRoot(doc);
        if (!root) return;
        var titleEl = root.querySelector('#catalog-library-heading') || root.querySelector('.catalog-library__title');
        var subtitleEl = root.querySelector('#catalog-library-subtitle') || root.querySelector('.catalog-library__subtitle');
        var allEl = root.querySelector('.catalog-library__all');
        if (titleEl) titleEl.textContent = header.title || DEFAULT_TITLE;
        if (subtitleEl) subtitleEl.textContent = header.subtitle || DEFAULT_SUBTITLE;
        if (allEl) {
            allEl.textContent = header.allLabel || DEFAULT_ALL_LABEL;
            allEl.setAttribute('href', header.allUrl || DEFAULT_ALL_URL);
        }
    }

    function applyToDocument(doc, catalogs, header) {
        if (!doc) return;
        var root = getCatalogRoot(doc);
        if (!root) return;
        var track = root.querySelector('.catalog-library__track');
        if (!track) return;

        var items = catalogs && catalogs.length ? catalogs : DEFAULT_CATALOGS;
        track.innerHTML = items.map(buildCatalogCardHtml).join('\n');

        var h = header || migrateHeaderFromDraft({});
        applyHeaderToDocument(doc, h);

        var showcase = root.querySelector('[data-catalog-carousel]');
        if (showcase) {
            showcase.classList.toggle('is-single', items.length <= 1);
            showcase.classList.toggle('is-carousel', items.length > 1);
        }

        var win = doc.defaultView;
        if (win && typeof win.initCatalogCarousel === 'function') {
            setTimeout(function () { win.initCatalogCarousel(showcase); }, 40);
        }

        if (typeof window.__fitFullSite === 'function') {
            setTimeout(window.__fitFullSite, 60);
        }
    }

    function patchCatalogInDocument(doc, item, index) {
        if (!doc) return false;
        var card = doc.getElementById('catalog-item-' + index);
        if (!card) return false;

        var link = card.querySelector('.catalog-card__link');
        var vendorEl = card.querySelector('.catalog-card__vendor');
        var titleEl = card.querySelector('.catalog-card__title');
        var metaEl = card.querySelector('.catalog-card__meta');
        var imgEl = card.querySelector('.catalog-card__cover img');

        if (link) link.setAttribute('href', item.pdfUrl || '#');
        if (vendorEl) vendorEl.textContent = item.vendor || '';
        if (titleEl) titleEl.textContent = item.title || '';
        if (metaEl) metaEl.textContent = item.meta || '';
        if (imgEl) {
            if (item.coverSrc) imgEl.setAttribute('src', item.coverSrc);
            imgEl.setAttribute('alt', item.title || 'Catalog cover');
        }
        return true;
    }

    function commitCatalogs(catalogs, options) {
        options = options || {};
        if (setCatalogsFn) setCatalogsFn(catalogs);

        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (doc) {
            var header = getHeaderFn ? getHeaderFn() : null;
            if (options.mode === 'patch' && typeof options.index === 'number') {
                if (patchCatalogInDocument(doc, catalogs[options.index], options.index)) {
                    var showcase = doc.querySelector('[data-catalog-carousel]');
                    var win = doc.defaultView;
                    if (win && typeof win.initCatalogCarousel === 'function') {
                        win.initCatalogCarousel(showcase);
                    }
                } else {
                    applyToDocument(doc, catalogs, header);
                }
            } else {
                applyToDocument(doc, catalogs, header);
            }
        }

        if (onUpdateFn) onUpdateFn(catalogs, options);
    }

    function commitHeader(header) {
        var next = {
            title: header.title || DEFAULT_TITLE,
            subtitle: header.subtitle || DEFAULT_SUBTITLE,
            allLabel: header.allLabel || DEFAULT_ALL_LABEL,
            allUrl: header.allUrl || DEFAULT_ALL_URL,
        };
        if (setHeaderFn) setHeaderFn(next);
        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (doc) applyHeaderToDocument(doc, next);
        syncHeaderControls(next);
        if (onUpdateFn) onUpdateFn(null, { header: true });
    }

    function syncHeaderControls(header) {
        if (!headerMountEl) return;
        var titleInput = headerMountEl.querySelector('#catalog-lib-title');
        var subtitleInput = headerMountEl.querySelector('#catalog-lib-subtitle');
        var allLabelInput = headerMountEl.querySelector('#catalog-lib-all-label');
        var allUrlInput = headerMountEl.querySelector('#catalog-lib-all-url');
        if (titleInput && document.activeElement !== titleInput) titleInput.value = header.title;
        if (subtitleInput && document.activeElement !== subtitleInput) subtitleInput.value = header.subtitle;
        if (allLabelInput && document.activeElement !== allLabelInput) allLabelInput.value = header.allLabel;
        if (allUrlInput && document.activeElement !== allUrlInput) allUrlInput.value = header.allUrl;
    }

    function renderHeaderControls() {
        if (!headerMountEl) return;
        var header = getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({});

        headerMountEl.innerHTML = ''
            + '<div class="editor-field">'
            + '<label class="editor-field-label" for="catalog-lib-title">Section title</label>'
            + '<input type="text" id="catalog-lib-title" class="editor-field-input" value="' + escAttr(header.title) + '">'
            + '</div>'
            + '<div class="editor-field">'
            + '<label class="editor-field-label" for="catalog-lib-subtitle">Subtitle</label>'
            + '<input type="text" id="catalog-lib-subtitle" class="editor-field-input" value="' + escAttr(header.subtitle) + '">'
            + '</div>'
            + '<div class="editor-field editor-field--inline">'
            + '<div>'
            + '<label class="editor-field-label" for="catalog-lib-all-label">"View all" label</label>'
            + '<input type="text" id="catalog-lib-all-label" class="editor-field-input" value="' + escAttr(header.allLabel) + '">'
            + '</div>'
            + '<div>'
            + '<label class="editor-field-label" for="catalog-lib-all-url">"View all" URL</label>'
            + '<input type="text" id="catalog-lib-all-url" class="editor-field-input" value="' + escAttr(header.allUrl) + '">'
            + '</div>'
            + '</div>';

        if (headerControlsBound) return;
        headerControlsBound = true;

        headerMountEl.addEventListener('input', function (e) {
            var target = e.target;
            var current = getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({});
            if (target.id === 'catalog-lib-title') {
                current.title = target.value;
                commitHeader(current);
            } else if (target.id === 'catalog-lib-subtitle') {
                current.subtitle = target.value;
                commitHeader(current);
            } else if (target.id === 'catalog-lib-all-label') {
                current.allLabel = target.value;
                commitHeader(current);
            } else if (target.id === 'catalog-lib-all-url') {
                current.allUrl = target.value;
                commitHeader(current);
            }
        });
    }

    function updateCatalogField(index, key, value, mode) {
        var catalogs = cloneCatalogs(getCatalogsFn ? getCatalogsFn() : DEFAULT_CATALOGS);
        if (!catalogs[index]) return;
        catalogs[index][key] = value;
        commitCatalogs(catalogs, { mode: mode || 'patch', index: index });
    }

    function renderPanel() {
        if (!mountEl) return;
        var catalogs = cloneCatalogs(getCatalogsFn ? getCatalogsFn() : DEFAULT_CATALOGS);

        mountEl.innerHTML = catalogs.map(function (item, index) {
            var hasCover = !!item.coverSrc;
            return ''
                + '<details class="designer-slide-group hero-slide-editor-card" data-catalog-index="' + index + '">'
                + '<summary class="designer-slide-group-head">Catalog ' + (index + 1)
                + (item.title ? ' — ' + escText(item.title).substring(0, 36) : '')
                + '</summary>'
                + '<div class="designer-slide-group-body">'
                + field('Manufacturer / vendor', 'vendor', item.vendor, index, 'Bessey')
                + field('Catalog title', 'title', item.title, index, 'Product catalog')
                + field('Subtitle / meta line', 'meta', item.meta, index, 'Full line reference')
                + field('PDF link URL', 'pdfUrl', item.pdfUrl, index, 'data/catalogs/example.pdf')
                + '<div class="editor-field">'
                + '<label class="editor-field-label">Cover image</label>'
                + '<div class="editor-slide-bg-widget">'
                + '<div class="editor-slide-bg-thumb">'
                + (hasCover
                    ? '<img src="' + escAttr(item.coverSrc) + '" alt="" class="catalog-cover-preview">'
                    : '<span class="editor-slide-bg-thumb-empty">No cover uploaded</span>')
                + '</div>'
                + '<div class="editor-slide-bg-actions">'
                + '<label class="editor-logo-file-label">Upload'
                + '<input type="file" accept="image/*" class="catalog-cover-file" data-index="' + index + '" hidden>'
                + '</label>'
                + (hasCover ? '<button type="button" class="editor-logo-remove-btn catalog-cover-remove" data-index="' + index + '">Remove</button>' : '')
                + '</div>'
                + '</div>'
                + '<p class="editor-field-hint">Recommended: <strong>280×360 px</strong> (7:9 portrait).</p>'
                + '</div>'
                + (catalogs.length > MIN_CATALOGS
                    ? '<button type="button" class="hero-slide-remove-btn" data-action="remove-catalog" data-index="' + index + '">Remove catalog</button>'
                    : '')
                + '</div>'
                + '</details>';
        }).join('');

        var addBtn = document.getElementById('catalogLibraryAddBtn');
        if (addBtn) addBtn.disabled = catalogs.length >= MAX_CATALOGS;

        bindPanelEvents();
    }

    function field(label, key, value, index, placeholder) {
        return ''
            + '<div class="editor-field">'
            + '<label class="editor-field-label">' + label + '</label>'
            + '<input type="text" class="editor-field-input catalog-lib-input" data-index="' + index + '" data-key="' + key + '" value="' + escAttr(value) + '"'
            + (placeholder ? ' placeholder="' + escAttr(placeholder) + '"' : '')
            + '>'
            + '</div>';
    }

    function bindPanelEvents() {
        if (!mountEl) return;

        mountEl.querySelectorAll('.catalog-lib-input').forEach(function (input) {
            input.addEventListener('input', function () {
                updateCatalogField(parseInt(input.dataset.index, 10), input.dataset.key, input.value, 'patch');
            });
        });

        mountEl.querySelectorAll('.catalog-cover-file').forEach(function (input) {
            input.addEventListener('change', function () {
                var file = input.files && input.files[0];
                if (!file) return;
                var index = parseInt(input.dataset.index, 10);
                var reader = new FileReader();
                reader.onload = function (evt) {
                    updateCatalogField(index, 'coverSrc', evt.target.result, 'patch');
                    renderPanel();
                };
                reader.readAsDataURL(file);
                input.value = '';
            });
        });

        mountEl.querySelectorAll('.catalog-cover-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var index = parseInt(btn.dataset.index, 10);
                var catalogs = cloneCatalogs(getCatalogsFn ? getCatalogsFn() : DEFAULT_CATALOGS);
                if (!catalogs[index]) return;
                catalogs[index].coverSrc = DEFAULT_CATALOGS[index]
                    ? DEFAULT_CATALOGS[index].coverSrc
                    : '';
                commitCatalogs(catalogs, { mode: 'patch', index: index });
                renderPanel();
            });
        });

        mountEl.querySelectorAll('[data-action="remove-catalog"]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var catalogs = cloneCatalogs(getCatalogsFn ? getCatalogsFn() : DEFAULT_CATALOGS);
                var index = parseInt(btn.dataset.index, 10);
                if (catalogs.length <= MIN_CATALOGS) return;
                catalogs.splice(index, 1);
                commitCatalogs(catalogs, { mode: 'rebuild' });
                renderPanel();
            });
        });
    }

    function init(options) {
        mountEl = options.mount || document.getElementById('catalogLibraryEditorMount');
        headerMountEl = options.headerMount || document.getElementById('catalogLibraryHeaderControls');
        getCatalogsFn = options.getCatalogs;
        setCatalogsFn = options.setCatalogs;
        getHeaderFn = options.getHeader;
        setHeaderFn = options.setHeader;
        onUpdateFn = options.onUpdate;
        getIframeDocFn = options.getIframeDoc;

        renderHeaderControls();
        syncHeaderControls(getHeaderFn ? getHeaderFn() : migrateHeaderFromDraft({}));

        var addBtn = document.getElementById('catalogLibraryAddBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                var catalogs = cloneCatalogs(getCatalogsFn ? getCatalogsFn() : DEFAULT_CATALOGS);
                if (catalogs.length >= MAX_CATALOGS) return;
                catalogs.push(emptyCatalog());
                commitCatalogs(catalogs, { mode: 'rebuild' });
                renderPanel();
            });
        }
    }

    window.CatalogLibraryEditor = {
        DEFAULT_CATALOGS: DEFAULT_CATALOGS,
        DEFAULT_TITLE: DEFAULT_TITLE,
        DEFAULT_SUBTITLE: DEFAULT_SUBTITLE,
        DEFAULT_ALL_LABEL: DEFAULT_ALL_LABEL,
        DEFAULT_ALL_URL: DEFAULT_ALL_URL,
        MAX_CATALOGS: MAX_CATALOGS,
        MIN_CATALOGS: MIN_CATALOGS,
        migrateFromDraft: migrateFromDraft,
        migrateHeaderFromDraft: migrateHeaderFromDraft,
        applyToDocument: applyToDocument,
        renderPanel: renderPanel,
        syncHeaderControls: syncHeaderControls,
        init: init,
    };
}());
