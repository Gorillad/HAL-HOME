/**
 * Avalon Designer — dynamic mega navigation editor.
 */
(function () {
    'use strict';

    var MAX_NAV_ITEMS = 8;
    var MIN_NAV_ITEMS = 1;
    var MAX_COLUMNS = 6;
    var MAX_LINKS = 14;

    var LAYOUT_OPTIONS = [
        { value: 'lighting', label: '5 columns (Lighting)' },
        { value: 'fans', label: '3 columns (Fans)' },
        { value: 'furniture-decor', label: '2 columns (Furniture)' },
        { value: 'outdoor', label: '4 columns (Outdoor)' },
        { value: 'shop-by-room', label: 'Room grid (Shop by Room)' },
        { value: 'brands', label: '2 columns (Brands)' },
        { value: 'auto', label: 'Auto-fit columns' },
    ];

    var DEFAULT_NAV = [
        {
            id: 'lighting', label: 'Lighting', href: '/catalog/lighting', visible: true, layout: 'lighting',
            columns: [
                { head: 'Ceiling Lights', visible: true, links: [
                    { label: 'Chandeliers', href: '/catalog/lighting/ceiling-lights/chandeliers', visible: true },
                    { label: 'Pendants', href: '/catalog/lighting/ceiling-lights/pendants', visible: true },
                    { label: 'Mini Pendants', href: '/catalog/lighting/ceiling-lights/mini-pendants', visible: true },
                    { label: 'Flush Mounts', href: '/catalog/lighting/ceiling-lights/flush-mounts', visible: true },
                    { label: 'Semi-Flush Mounts', href: '/catalog/lighting/ceiling-lights/semi-flush-mounts', visible: true },
                    { label: 'Track Lighting', href: '/catalog/lighting/ceiling-lights/track-lighting', visible: true },
                    { label: 'More Ceiling Lights', href: '/catalog/lighting/ceiling-lights/more', visible: true },
                ]},
                { head: 'Wall Lights', visible: true, links: [
                    { label: 'Wall Sconces', href: '/catalog/lighting/wall-lights/wall-sconces', visible: true },
                    { label: 'Bathroom Vanity Lights', href: '/catalog/lighting/wall-lights/bathroom-vanity-lights', visible: true },
                    { label: 'Picture Lights', href: '/catalog/lighting/wall-lights/picture-lights', visible: true },
                    { label: 'Swing Arm / Wall Lamps', href: '/catalog/lighting/wall-lights/swing-arm-wall-lamps', visible: true },
                    { label: 'Cabinet Lighting', href: '/catalog/lighting/wall-lights/cabinet-lighting', visible: true },
                    { label: 'Spot Lights', href: '/catalog/lighting/wall-lights/spot-lights', visible: true },
                ]},
                { head: 'Outdoor Lighting', visible: true, links: [
                    { label: 'Outdoor Wall Lights', href: '/catalog/lighting/outdoor-lighting/outdoor-wall-lights', visible: true },
                    { label: 'Outdoor Pendants', href: '/catalog/lighting/outdoor-lighting/outdoor-pendants', visible: true },
                    { label: 'Outdoor Chandeliers', href: '/catalog/lighting/outdoor-lighting/outdoor-chandeliers', visible: true },
                    { label: 'Outdoor Ceiling Lights', href: '/catalog/lighting/outdoor-lighting/outdoor-ceiling-lights', visible: true },
                    { label: 'Pathway Lighting', href: '/catalog/lighting/outdoor-lighting/pathway-lighting', visible: true },
                    { label: 'Landscape Lighting', href: '/catalog/lighting/outdoor-lighting/landscape-lighting', visible: true },
                    { label: 'Outdoor Accessories', href: '/catalog/lighting/outdoor-lighting/outdoor-accessories', visible: true },
                    { label: 'More Outdoor', href: '/catalog/lighting/outdoor-lighting/more', visible: true },
                ]},
                { head: 'Lamps', visible: true, links: [
                    { label: 'Table Lamps', href: '/catalog/lighting/lamps/table-lamps', visible: true },
                    { label: 'Floor Lamps', href: '/catalog/lighting/lamps/floor-lamps', visible: true },
                    { label: 'Desk Lamps', href: '/catalog/lighting/lamps/desk-lamps', visible: true },
                    { label: 'Task Lamps', href: '/catalog/lighting/lamps/task-lamps', visible: true },
                ]},
                { head: 'Accessories', visible: true, links: [
                    { label: 'Light Bulbs', href: '/catalog/lighting/accessories/light-bulbs', visible: true },
                    { label: 'Dimmers & Switches', href: '/catalog/lighting/accessories/dimmers-switches', visible: true },
                ]},
            ],
        },
        {
            id: 'fans', label: 'Fans', href: '/catalog/fans', visible: true, layout: 'fans',
            columns: [
                { head: 'Fans', visible: true, links: [
                    { label: 'Indoor Ceiling Fans', href: '/catalog/fans/indoor-ceiling-fans', visible: true },
                    { label: 'Outdoor Fans', href: '/catalog/fans/outdoor-fans', visible: true },
                    { label: 'Portable Fans', href: '/catalog/fans/portable-fans', visible: true },
                    { label: 'Wall Fans', href: '/catalog/fans/wall-fans', visible: true },
                ]},
                { head: 'Fans', visible: true, links: [
                    { label: 'Belt Fans', href: '/catalog/fans/belt-fans', visible: true },
                    { label: 'Fandeliers', href: '/catalog/fans/fandeliers', visible: true },
                    { label: 'Huggers', href: '/catalog/fans/huggers', visible: true },
                    { label: 'More Fans', href: '/catalog/fans/more', visible: true },
                ]},
                { head: 'Fan Accessories', visible: true, links: [
                    { label: 'Fan Light Kits', href: '/catalog/fans/fan-light-kits', visible: true },
                    { label: 'Fandeliers', href: '/catalog/fans/fandeliers', visible: true },
                    { label: 'Dual Motor Fans', href: '/catalog/fans/dual-motor-fans', visible: true },
                    { label: 'Fan Accessories', href: '/catalog/fans/fan-accessories', visible: true },
                ]},
            ],
        },
        {
            id: 'furniture-decor', label: 'Furniture & Decor', href: '/catalog/furniture-decor', visible: true, layout: 'furniture-decor',
            columns: [
                { head: 'Home Decor', visible: true, links: [
                    { label: 'Area Rugs', href: '/catalog/furniture-decor/home-decor/area-rugs', visible: true },
                    { label: 'Vases', href: '/catalog/furniture-decor/home-decor/vases', visible: true },
                    { label: 'Wall Accents', href: '/catalog/furniture-decor/home-decor/wall-accents', visible: true },
                    { label: 'Sculptures', href: '/catalog/furniture-decor/home-decor/sculptures', visible: true },
                    { label: 'Decorative Objects & Figurines', href: '/catalog/furniture-decor/home-decor/decorative-objects-figurines', visible: true },
                    { label: 'Decorative Bowls', href: '/catalog/furniture-decor/home-decor/decorative-bowls', visible: true },
                    { label: 'More Home Decor', href: '/catalog/furniture-decor/home-decor/more', visible: true },
                ]},
                { head: 'Furniture', visible: true, links: [
                    { label: 'End & Side Tables', href: '/catalog/furniture-decor/furniture/end-side-tables', visible: true },
                    { label: 'Console Tables', href: '/catalog/furniture-decor/furniture/console-tables', visible: true },
                    { label: 'Ottomans & Stools', href: '/catalog/furniture-decor/furniture/ottomans-stools', visible: true },
                    { label: 'Coffee Tables', href: '/catalog/furniture-decor/furniture/coffee-tables', visible: true },
                    { label: 'Chairs', href: '/catalog/furniture-decor/furniture/chairs', visible: true },
                    { label: 'Cabinets', href: '/catalog/furniture-decor/furniture/cabinets', visible: true },
                    { label: 'More Furniture', href: '/catalog/furniture-decor/furniture/more', visible: true },
                ]},
            ],
        },
        {
            id: 'outdoor', label: 'Outdoor', href: '/catalog/outdoor', visible: true, layout: 'outdoor',
            columns: [
                { head: 'Patio & Outdoor Furniture', visible: true, links: [
                    { label: 'Outdoor Chairs', href: '/catalog/outdoor/patio-outdoor-furniture/outdoor-chairs', visible: true },
                    { label: 'Other Outdoor Furniture', href: '/catalog/outdoor/patio-outdoor-furniture/other-outdoor-furniture', visible: true },
                    { label: 'Outdoor Ottomans & Stools', href: '/catalog/outdoor/patio-outdoor-furniture/outdoor-ottomans-stools', visible: true },
                    { label: 'Outdoor Tables', href: '/catalog/outdoor/patio-outdoor-furniture/outdoor-tables', visible: true },
                ]},
                { head: 'Outdoor Decor', visible: true, links: [
                    { label: 'Bird Feeders', href: '/catalog/outdoor/outdoor-decor/bird-feeders', visible: true },
                    { label: 'Outdoor Door Bells', href: '/catalog/outdoor/outdoor-decor/outdoor-door-bells', visible: true },
                    { label: 'Outdoor Lanterns', href: '/catalog/outdoor/outdoor-decor/outdoor-lanterns', visible: true },
                    { label: 'More Outdoor Decor', href: '/catalog/outdoor/outdoor-decor/more', visible: true },
                ]},
                { head: 'Outdoor Lighting', visible: true, links: [
                    { label: 'Outdoor Wall Lights', href: '/catalog/outdoor/outdoor-lighting/outdoor-wall-lights', visible: true },
                    { label: 'Outdoor Pendants / Chandeliers', href: '/catalog/outdoor/outdoor-lighting/outdoor-pendants-chandeliers', visible: true },
                    { label: 'Outdoor Ceiling Lights', href: '/catalog/outdoor/outdoor-lighting/outdoor-ceiling-lights', visible: true },
                    { label: 'Post Lights & Accessories', href: '/catalog/outdoor/outdoor-lighting/post-lights-accessories', visible: true },
                    { label: 'Pathway Lighting', href: '/catalog/outdoor/outdoor-lighting/pathway-lighting', visible: true },
                    { label: 'Landscape Lighting', href: '/catalog/outdoor/outdoor-lighting/landscape-lighting', visible: true },
                    { label: 'More Outdoor Lighting', href: '/catalog/outdoor/outdoor-lighting/more', visible: true },
                ]},
                { head: 'Outdoor Fans', visible: true, links: [
                    { label: 'Outdoor Fans', href: '/catalog/outdoor/outdoor-fans', visible: true },
                ]},
            ],
        },
        {
            id: 'shop-by-room', label: 'Shop by Room', href: '/shop-by-room', visible: true, layout: 'shop-by-room',
            columns: [
                { head: 'Interior', visible: true, links: [
                    { label: 'Bathroom', href: '/shop-by-room/bathroom', visible: true, image: 'data/images/rooms/bathroom.jpg' },
                    { label: 'Bedroom', href: '/shop-by-room/bedroom', visible: true, image: 'data/images/rooms/bedroom.jpg' },
                    { label: 'Dining Room', href: '/shop-by-room/dining-room', visible: true, image: 'data/images/rooms/dining-room.jpg' },
                    { label: 'Kitchen', href: '/shop-by-room/kitchen', visible: true, image: 'data/images/rooms/kitchen.jpg' },
                    { label: 'Living Room', href: '/shop-by-room/living-room', visible: true, image: 'data/images/rooms/living-room.jpg' },
                    { label: 'Office / Den', href: '/shop-by-room/office-den', visible: true, image: 'data/images/rooms/office-den.jpg' },
                    { label: 'Entry / Foyer', href: '/shop-by-room/entry-foyer', visible: true, image: 'data/images/rooms/entry-foyer.jpg' },
                    { label: 'Outdoor / Patio', href: '/shop-by-room/outdoor-patio', visible: true, image: 'data/images/rooms/outdoor-patio.jpg' },
                ]},
            ],
        },
        {
            id: 'brands', label: 'Brands', href: '/brands', visible: true, layout: 'brands',
            columns: [
                { head: 'Popular Brands', visible: true, links: [
                    { label: 'Visual Comfort & Co. Architectural Collection', href: '/brands/visual-comfort-co-architectural-collection', visible: true },
                    { label: 'Visual Comfort & Co. Fan Collection', href: '/brands/visual-comfort-co-fan-collection', visible: true },
                    { label: 'Visual Comfort & Co. Modern Collection', href: '/brands/visual-comfort-co-modern-collection', visible: true },
                    { label: 'Visual Comfort & Co. Signature Collection', href: '/brands/visual-comfort-co-signature-collection', visible: true },
                    { label: 'Visual Comfort & Co. Studio Collection', href: '/brands/visual-comfort-co-studio-collection', visible: true },
                    { label: 'Visual Comfort RL', href: '/brands/visual-comfort-rl', visible: true },
                    { label: 'WAC US', href: '/brands/wac-us', visible: true },
                    { label: 'Hinkley', href: '/brands/hinkley', visible: true },
                ]},
                { head: 'Popular Brands', visible: true, links: [
                    { label: 'Lib & Co.', href: '/brands/lib-co', visible: true },
                    { label: 'Fine Art Handcrafted Lighting', href: '/brands/fine-art-handcrafted-lighting', visible: true },
                    { label: 'Hubbardton Forge', href: '/brands/hubbardton-forge', visible: true },
                    { label: 'Hammerton', href: '/brands/hammerton', visible: true },
                    { label: 'Quoizel', href: '/brands/quoizel', visible: true },
                    { label: 'Nora', href: '/brands/nora', visible: true },
                    { label: 'Eurofase', href: '/brands/eurofase', visible: true },
                    { label: 'Progress', href: '/brands/progress', visible: true },
                    { label: 'More Brands', href: '/brands/more', visible: true },
                ]},
            ],
        },
    ];

    var mountEl = null;
    var getNavFn = null;
    var setNavFn = null;
    var onUpdateFn = null;
    var getIframeDocFn = null;

    function cloneNav(items) {
        return JSON.parse(JSON.stringify(items || DEFAULT_NAV));
    }

    function escAttr(v) {
        return String(v || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }

    function escText(v) {
        return String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    }

    function slugify(text) {
        return String(text || 'nav-item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'nav-item';
    }

    function emptyLink() {
        return { label: 'New link', href: '/catalog', visible: true };
    }

    function emptyColumn() {
        return { head: 'New column', visible: true, links: [emptyLink()] };
    }

    function emptyNavItem() {
        return {
            id: 'nav-' + Date.now(),
            label: 'New category',
            href: '/catalog',
            visible: true,
            layout: 'auto',
            columns: [emptyColumn()],
        };
    }

    function migrateFromDraft(draft) {
        if (draft && draft.navCatalog && Array.isArray(draft.navCatalog) && draft.navCatalog.length) {
            return cloneNav(draft.navCatalog);
        }
        return cloneNav(DEFAULT_NAV);
    }

    function panelLayoutClass(item) {
        if (item.layout && item.layout !== 'auto') {
            return 'avalon-mega-panel__inner--' + item.layout;
        }
        var cols = (item.columns || []).filter(function (c) { return c.visible !== false; }).length || 1;
        return 'avalon-mega-panel__inner--auto';
    }

    function buildColumnHtml(col) {
        if (col.visible === false) return '';
        var links = (col.links || []).filter(function (l) { return l.visible !== false; });
        if (!links.length && !col.head) return '';
        return ''
            + '<div class="avalon-mega-col">'
            + (col.head ? '<h3 class="avalon-mega-col__head">' + escText(col.head) + '</h3>' : '')
            + links.map(function (link) {
                return '<a href="' + escAttr(link.href || '#') + '">' + escText(link.label || 'Link') + '</a>';
            }).join('')
            + '</div>';
    }

    function buildRoomGridHtml(item) {
        var col = (item.columns && item.columns[0]) || { head: 'Interior', links: [] };
        var links = (col.links || []).filter(function (l) { return l.visible !== false; });
        return ''
            + '<div class="avalon-mega-room-section">'
            + '<h3 class="avalon-mega-room-section__head">' + escText(col.head || 'Interior') + '</h3>'
            + '<div class="avalon-mega-room-grid">'
            + links.map(function (link) {
                var img = link.image || 'data/images/rooms/bathroom.jpg';
                return ''
                    + '<a class="avalon-mega-room-card" href="' + escAttr(link.href || '#') + '">'
                    + '<span class="avalon-mega-room-card__thumb">'
                    + '<img src="' + escAttr(img) + '" alt="" width="96" height="72" loading="lazy">'
                    + '</span>'
                    + '<span class="avalon-mega-room-card__label">' + escText(link.label || 'Room') + '</span>'
                    + '</a>';
            }).join('')
            + '</div></div>';
    }

    function buildNavItemHtml(item) {
        if (item.visible === false) return '';
        var panelId = 'avalon-mega-' + slugify(item.id);
        var innerClass = panelLayoutClass(item);
        var innerContent = item.layout === 'shop-by-room'
            ? buildRoomGridHtml(item)
            : (item.columns || []).map(buildColumnHtml).join('');

        return ''
            + '<li class="avalon-mega-nav__item" data-has-mega>'
            + '<a href="' + escAttr(item.href || '#') + '" class="avalon-mega-nav__trigger" aria-expanded="false" aria-controls="' + panelId + '">' + escText(item.label || 'Category') + '</a>'
            + '<div class="avalon-mega-panel" id="' + panelId + '" hidden>'
            + '<div class="avalon-mega-panel__inner ' + innerClass + '">'
            + innerContent
            + '</div></div></li>';
    }

    function applyToDocument(doc, navItems) {
        if (!doc) return;
        var list = doc.querySelector('#avalonMegaNav .avalon-mega-nav__list');
        if (!list) return;

        var items = (navItems || DEFAULT_NAV).filter(function (i) { return i.visible !== false; });
        list.innerHTML = items.map(buildNavItemHtml).join('\n');

        var win = doc.defaultView;
        if (win && typeof win.__avalonMegaNavInit === 'function') {
            win.__avalonMegaNavInit();
        }
        if (typeof window.__fitFullSite === 'function') {
            setTimeout(window.__fitFullSite, 60);
        }
    }

    function commitNav(navItems) {
        if (setNavFn) setNavFn(navItems);
        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (doc) applyToDocument(doc, navItems);
        if (onUpdateFn) onUpdateFn(navItems);
    }

    function getNav() {
        return cloneNav(getNavFn ? getNavFn() : DEFAULT_NAV);
    }

    function updateNav(mutator, options) {
        options = options || {};
        var nav = getNav();
        mutator(nav);
        commitNav(nav);
        if (!options.skipRender) renderPanel();
    }

    function textField(label, value, attrs) {
        attrs = attrs || '';
        return '<div class="editor-field"><label class="editor-field-label">' + label + '</label>'
            + '<input type="text" class="editor-field-input avalon-nav-input" value="' + escAttr(value) + '" ' + attrs + '></div>';
    }

    function renderPanel() {
        if (!mountEl) return;
        var nav = getNav();

        mountEl.innerHTML = nav.map(function (item, ni) {
            var colsHtml = (item.columns || []).map(function (col, ci) {
                var linksHtml = (col.links || []).map(function (link, li) {
                    var roomImg = item.layout === 'shop-by-room'
                        ? '<div class="editor-field"><label class="editor-field-label">Room image path</label>'
                            + '<input type="text" class="editor-field-input avalon-nav-input" data-ni="' + ni + '" data-ci="' + ci + '" data-li="' + li + '" data-key="image" value="' + escAttr(link.image || '') + '" placeholder="data/images/rooms/bathroom.jpg">'
                            + '</div>'
                        : '';
                    return ''
                        + '<details class="designer-slide-group" style="margin-top:6px">'
                        + '<summary class="designer-slide-group-head">Link ' + (li + 1) + (link.label ? ' — ' + escText(link.label).substring(0, 28) : '') + '</summary>'
                        + '<div class="designer-slide-group-body">'
                        + '<label class="mega-link-hide-toggle"><input type="checkbox" class="avalon-nav-check" data-ni="' + ni + '" data-ci="' + ci + '" data-li="' + li + '" data-key="visible" ' + (link.visible !== false ? 'checked' : '') + '> Show link</label>'
                        + textField('Label', link.label, 'data-ni="' + ni + '" data-ci="' + ci + '" data-li="' + li + '" data-key="label"')
                        + textField('URL', link.href, 'data-ni="' + ni + '" data-ci="' + ci + '" data-li="' + li + '" data-key="href"')
                        + roomImg
                        + ((col.links || []).length > 1
                            ? '<button type="button" class="hero-slide-remove-btn avalon-nav-action" data-action="remove-link" data-ni="' + ni + '" data-ci="' + ci + '" data-li="' + li + '">Remove link</button>'
                            : '')
                        + '</div></details>';
                }).join('');

                return ''
                    + '<details class="designer-slide-group" open style="margin-top:8px">'
                    + '<summary class="designer-slide-group-head">Column ' + (ci + 1) + (col.head ? ' — ' + escText(col.head).substring(0, 24) : '') + '</summary>'
                    + '<div class="designer-slide-group-body">'
                    + '<label class="mega-link-hide-toggle"><input type="checkbox" class="avalon-nav-check" data-ni="' + ni + '" data-ci="' + ci + '" data-key="col-visible" ' + (col.visible !== false ? 'checked' : '') + '> Show column</label>'
                    + textField('Column heading', col.head, 'data-ni="' + ni + '" data-ci="' + ci + '" data-key="head"')
                    + '<p class="editor-field-label" style="margin:8px 0 4px">Sub-links</p>'
                    + linksHtml
                    + '<button type="button" class="hero-slides-add-btn avalon-nav-action" data-action="add-link" data-ni="' + ni + '" data-ci="' + ci + '">+ Add link</button>'
                    + (item.layout !== 'shop-by-room' && (item.columns || []).length > 1
                        ? '<button type="button" class="hero-slide-remove-btn avalon-nav-action" data-action="remove-col" data-ni="' + ni + '" data-ci="' + ci + '">Remove column</button>'
                        : '')
                    + '</div></details>';
            }).join('');

            var layoutOpts = LAYOUT_OPTIONS.map(function (opt) {
                return '<option value="' + escAttr(opt.value) + '"' + (item.layout === opt.value ? ' selected' : '') + '>' + escText(opt.label) + '</option>';
            }).join('');

            return ''
                + '<details class="designer-slide-group hero-slide-editor-card" open>'
                + '<summary class="designer-slide-group-head">Nav ' + (ni + 1) + (item.label ? ' — ' + escText(item.label) : '') + '</summary>'
                + '<div class="designer-slide-group-body">'
                + '<label class="mega-link-hide-toggle"><input type="checkbox" class="avalon-nav-check" data-ni="' + ni + '" data-key="item-visible" ' + (item.visible !== false ? 'checked' : '') + '> Show in navigation</label>'
                + textField('Nav label', item.label, 'data-ni="' + ni + '" data-key="label"')
                + textField('Nav URL', item.href, 'data-ni="' + ni + '" data-key="href"')
                + '<div class="editor-field"><label class="editor-field-label">Panel layout</label>'
                + '<select class="editor-field-input avalon-nav-select" data-ni="' + ni + '" data-key="layout">' + layoutOpts + '</select></div>'
                + colsHtml
                + (item.layout !== 'shop-by-room'
                    ? '<button type="button" class="hero-slides-add-btn avalon-nav-action" data-action="add-col" data-ni="' + ni + '">+ Add column</button>'
                    : '')
                + (nav.length > MIN_NAV_ITEMS
                    ? '<button type="button" class="hero-slide-remove-btn avalon-nav-action" data-action="remove-nav" data-ni="' + ni + '">Remove nav item</button>'
                    : '')
                + '</div></details>';
        }).join('');

        var addBtn = document.getElementById('avalonNavAddBtn');
        if (addBtn) addBtn.disabled = nav.length >= MAX_NAV_ITEMS;
        bindPanelEvents();
    }

    function bindPanelEvents() {
        if (!mountEl) return;

        mountEl.querySelectorAll('.avalon-nav-input').forEach(function (input) {
            input.addEventListener('input', function () {
                var ni = +input.dataset.ni;
                var ci = input.dataset.ci !== undefined ? +input.dataset.ci : -1;
                var li = input.dataset.li !== undefined ? +input.dataset.li : -1;
                var key = input.dataset.key;
                updateNav(function (nav) {
                    if (li >= 0) nav[ni].columns[ci].links[li][key] = input.value;
                    else if (ci >= 0) nav[ni].columns[ci][key] = input.value;
                    else if (key === 'label' || key === 'href') nav[ni][key] = input.value;
                }, { skipRender: true });
            });
        });

        mountEl.querySelectorAll('.avalon-nav-select').forEach(function (select) {
            select.addEventListener('change', function () {
                var ni = +select.dataset.ni;
                updateNav(function (nav) {
                    nav[ni].layout = select.value;
                }, { skipRender: true });
            });
        });

        mountEl.querySelectorAll('.avalon-nav-check').forEach(function (cb) {
            cb.addEventListener('change', function () {
                var ni = +cb.dataset.ni;
                var ci = cb.dataset.ci !== undefined ? +cb.dataset.ci : -1;
                var li = cb.dataset.li !== undefined ? +cb.dataset.li : -1;
                var key = cb.dataset.key;
                updateNav(function (nav) {
                    if (key === 'item-visible') nav[ni].visible = cb.checked;
                    else if (key === 'col-visible') nav[ni].columns[ci].visible = cb.checked;
                    else if (li >= 0) nav[ni].columns[ci].links[li].visible = cb.checked;
                }, { skipRender: true });
            });
        });

        mountEl.querySelectorAll('.avalon-nav-action').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var action = btn.dataset.action;
                var ni = +btn.dataset.ni;
                var ci = btn.dataset.ci !== undefined ? +btn.dataset.ci : -1;
                var li = btn.dataset.li !== undefined ? +btn.dataset.li : -1;

                updateNav(function (nav) {
                    if (action === 'add-link' && nav[ni].columns[ci].links.length < MAX_LINKS) {
                        nav[ni].columns[ci].links.push(emptyLink());
                    } else if (action === 'remove-link') {
                        nav[ni].columns[ci].links.splice(li, 1);
                    } else if (action === 'add-col' && nav[ni].columns.length < MAX_COLUMNS) {
                        nav[ni].columns.push(emptyColumn());
                    } else if (action === 'remove-col') {
                        nav[ni].columns.splice(ci, 1);
                    } else if (action === 'remove-nav' && nav.length > MIN_NAV_ITEMS) {
                        nav.splice(ni, 1);
                    }
                });
            });
        });
    }

    function init(options) {
        mountEl = options.mount || document.getElementById('avalonNavEditorMount');
        getNavFn = options.getNav;
        setNavFn = options.setNav;
        onUpdateFn = options.onUpdate;
        getIframeDocFn = options.getIframeDoc;

        var addBtn = document.getElementById('avalonNavAddBtn');
        if (addBtn && !addBtn.dataset.bound) {
            addBtn.dataset.bound = '1';
            addBtn.addEventListener('click', function () {
                updateNav(function (nav) {
                    if (nav.length < MAX_NAV_ITEMS) nav.push(emptyNavItem());
                });
            });
        }

        renderPanel();
    }

    window.AvalonNavEditor = {
        DEFAULT_NAV: DEFAULT_NAV,
        migrateFromDraft: migrateFromDraft,
        applyToDocument: applyToDocument,
        renderPanel: renderPanel,
        init: init,
    };
}());
