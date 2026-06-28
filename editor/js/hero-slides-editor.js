/**
 * Woolf Designer — dynamic Hero Slides editor.
 * Manages slides[] in the draft, sidebar UI, and live iframe DOM rebuild.
 */
(function () {
    'use strict';

    var MAX_SLIDES = 8;
    var MIN_SLIDES = 1;

    var DEFAULT_SLIDES = [
        {
            eyebrow: '500,000+ SKUs',
            title: 'Industrial supplies for every job site and shop floor',
            text: 'From cutting tools to safety gear — source what you need from one trusted catalog with fast shipping and expert support.',
            bgSrc: '',
            slideLinkUrl: '',
            btn1Label: 'Browse Catalog',
            btn1Url: '/catalog',
            btn2Label: 'Request a Quote',
            btn2Url: '/contact',
        },
        {
            eyebrow: 'Safety & PPE',
            title: 'Keep your team protected and compliant',
            text: 'Gloves, eye protection, fall protection, respiratory, and more — stocked for industrial, construction, and manufacturing environments.',
            bgSrc: '',
            slideLinkUrl: '',
            btn1Label: 'Shop Safety',
            btn1Url: '/industrial-supplies?category=Safety',
            btn2Label: 'Browse All Categories',
            btn2Url: '/catalog',
        },
        {
            eyebrow: 'Cutting & Machining',
            title: 'Precision tooling for production and maintenance',
            text: 'Milling, turning, threading, holemaking, and workholding — the brands and part numbers your machinists rely on.',
            bgSrc: '',
            slideLinkUrl: '',
            btn1Label: 'Shop Cutting Tools',
            btn1Url: '/industrial-supplies?category=Cutting+Tools',
            btn2Label: 'Browse Milling',
            btn2Url: '/industrial-supplies?category=Milling',
        },
    ];

    var DEFAULT_OVERLAY = {
        color: '#081525',
        opacity: 92,
    };

    var mountEl = null;
    var overlayMountEl = null;
    var getSlidesFn = null;
    var setSlidesFn = null;
    var getOverlayFn = null;
    var setOverlayFn = null;
    var onUpdateFn = null;
    var getIframeDocFn = null;
    var overlayControlsBound = false;

    function cloneSlides(slides) {
        return JSON.parse(JSON.stringify(slides || DEFAULT_SLIDES));
    }

    function emptySlide() {
        return {
            eyebrow: '',
            title: 'New slide headline',
            text: '',
            bgSrc: '',
            slideLinkUrl: '',
            btn1Label: '',
            btn1Url: '',
            btn2Label: '',
            btn2Url: '',
        };
    }

    function normalizeHex(value, fallback) {
        var hex = String(value || fallback || DEFAULT_OVERLAY.color).trim();
        if (!hex.startsWith('#')) hex = '#' + hex;
        if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return fallback || DEFAULT_OVERLAY.color;
        return hex.toLowerCase();
    }

    function hexToRgb(hex) {
        var value = normalizeHex(hex);
        return {
            r: parseInt(value.slice(1, 3), 16),
            g: parseInt(value.slice(3, 5), 16),
            b: parseInt(value.slice(5, 7), 16),
        };
    }

    function normalizeOpacity(value) {
        var num = parseInt(value, 10);
        if (isNaN(num)) return DEFAULT_OVERLAY.opacity;
        return Math.max(0, Math.min(100, num));
    }

    function migrateOverlayFromDraft(draft) {
        return {
            color: normalizeHex(draft && draft.heroOverlayColor, DEFAULT_OVERLAY.color),
            opacity: normalizeOpacity(draft && draft.heroOverlayOpacity !== undefined
                ? draft.heroOverlayOpacity
                : DEFAULT_OVERLAY.opacity),
        };
    }

    function applyOverlayToDocument(doc, overlay) {
        if (!doc) return;
        var root = doc.querySelector('[data-hero-slideshow]');
        if (!root) return;
        var settings = overlay || DEFAULT_OVERLAY;
        var rgb = hexToRgb(settings.color);
        var opacity = normalizeOpacity(settings.opacity) / 100;
        root.style.setProperty('--hero-overlay-r', String(rgb.r));
        root.style.setProperty('--hero-overlay-g', String(rgb.g));
        root.style.setProperty('--hero-overlay-b', String(rgb.b));
        root.style.setProperty('--hero-overlay-opacity', String(opacity));
    }

    function commitOverlay(overlay) {
        var next = {
            color: normalizeHex(overlay.color, DEFAULT_OVERLAY.color),
            opacity: normalizeOpacity(overlay.opacity),
        };
        if (setOverlayFn) setOverlayFn(next);
        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (doc) applyOverlayToDocument(doc, next);
        syncOverlayControls(next);
        if (onUpdateFn) onUpdateFn(null, { overlay: true });
    }

    function syncOverlayControls(overlay) {
        if (!overlayMountEl) return;
        var settings = overlay || migrateOverlayFromDraft({});
        var colorInput = overlayMountEl.querySelector('#hero-overlay-color');
        var hexInput = overlayMountEl.querySelector('#hero-overlay-color-hex');
        var opacityInput = overlayMountEl.querySelector('#hero-overlay-opacity');
        var opacityVal = overlayMountEl.querySelector('#hero-overlay-opacity-val');
        if (colorInput) colorInput.value = settings.color;
        if (hexInput) hexInput.value = settings.color;
        if (opacityInput) opacityInput.value = String(settings.opacity);
        if (opacityVal) opacityVal.textContent = settings.opacity + '%';
    }

    function renderOverlayControls() {
        if (!overlayMountEl) return;
        overlayMountEl.innerHTML = ''
            + '<p class="editor-field-label" style="margin:0 0 8px">Image overlay</p>'
            + '<p class="editor-field-hint" style="margin:0 0 10px">Color and strength of the fade over slide backgrounds. Set strength to 0% to show the image with no overlay.</p>'
            + '<div class="editor-field">'
            + '<label class="editor-field-label" for="hero-overlay-color">Overlay color</label>'
            + '<div class="editor-color-pair">'
            + '<input type="color" id="hero-overlay-color" value="' + escAttr(DEFAULT_OVERLAY.color) + '">'
            + '<input type="text" id="hero-overlay-color-hex" class="editor-color-hex editor-field-input" value="' + escAttr(DEFAULT_OVERLAY.color) + '" maxlength="7" aria-label="Overlay color hex">'
            + '</div>'
            + '</div>'
            + '<div class="editor-field">'
            + '<label class="editor-field-label" for="hero-overlay-opacity">Overlay strength</label>'
            + '<div class="editor-range-row">'
            + '<input type="range" id="hero-overlay-opacity" min="0" max="100" step="1" value="' + DEFAULT_OVERLAY.opacity + '">'
            + '<span class="editor-range-value" id="hero-overlay-opacity-val">' + DEFAULT_OVERLAY.opacity + '%</span>'
            + '</div>'
            + '</div>';

        if (overlayControlsBound) return;
        overlayControlsBound = true;

        overlayMountEl.addEventListener('input', function (e) {
            var target = e.target;
            var overlay = getOverlayFn ? getOverlayFn() : migrateOverlayFromDraft({});

            if (target.id === 'hero-overlay-color') {
                overlay.color = normalizeHex(target.value, DEFAULT_OVERLAY.color);
                commitOverlay(overlay);
                return;
            }
            if (target.id === 'hero-overlay-opacity') {
                overlay.opacity = normalizeOpacity(target.value);
                commitOverlay(overlay);
            }
        });

        overlayMountEl.addEventListener('change', function (e) {
            if (e.target.id !== 'hero-overlay-color-hex') return;
            var overlay = getOverlayFn ? getOverlayFn() : migrateOverlayFromDraft({});
            var hex = normalizeHex(e.target.value, overlay.color);
            overlay.color = hex;
            commitOverlay(overlay);
        });
    }

    function migrateFromDraft(draft) {
        if (draft && draft.heroSlides && Array.isArray(draft.heroSlides) && draft.heroSlides.length) {
            return cloneSlides(draft.heroSlides);
        }
        var slides = [];
        var i;
        for (i = 1; i <= 3; i += 1) {
            var title = draft && draft['hero' + i + 'Title'];
            var eyebrow = draft && draft['hero' + i + 'Eyebrow'];
            if (title || eyebrow) {
                slides.push({
                    eyebrow: draft['hero' + i + 'Eyebrow'] || '',
                    title: draft['hero' + i + 'Title'] || '',
                    text: draft['hero' + i + 'Text'] || '',
                    bgSrc: draft['hero' + i + 'BgSrc'] || '',
                    slideLinkUrl: draft['hero' + i + 'LinkUrl'] || '',
                    btn1Label: draft['hero' + i + 'Btn1Label'] || '',
                    btn1Url: draft['hero' + i + 'Btn1Url'] || '',
                    btn2Label: draft['hero' + i + 'Btn2Label'] || '',
                    btn2Url: draft['hero' + i + 'Btn2Url'] || '',
                });
            }
        }
        return slides.length ? slides : cloneSlides(DEFAULT_SLIDES);
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

    function cssUrl(value) {
        if (!value) return '';
        return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    function buildSlideHtml(slide, index, isActive) {
        var headingTag = index === 0 ? 'h1' : 'h2';
        var bgAttr = slide.bgSrc
            ? ' style="background-image:url(&quot;' + escAttr(cssUrl(slide.bgSrc)) + '&quot;)"'
            : '';
        var linkHtml = slide.slideLinkUrl
            ? '<a class="hero__slide-link" href="' + escAttr(slide.slideLinkUrl) + '" tabindex="-1" aria-hidden="true"></a>'
            : '';
        var actions = '';
        if (slide.btn1Label) {
            actions += '<a class="hero__btn hero__btn--primary" href="' + escAttr(slide.btn1Url || '#') + '">' + escText(slide.btn1Label) + '</a>';
        }
        if (slide.btn2Label) {
            actions += '<a class="hero__btn hero__btn--secondary" href="' + escAttr(slide.btn2Url || '#') + '">' + escText(slide.btn2Label) + '</a>';
        }

        return ''
            + '<article class="hero__slide hero__slide--custom' + (isActive ? ' is-active' : '') + '" id="hero-slide-' + index + '" aria-hidden="' + (isActive ? 'false' : 'true') + '"' + bgAttr + '>'
            + linkHtml
            + '<div class="hero__content">'
            + (slide.eyebrow ? '<p class="hero__eyebrow">' + escText(slide.eyebrow) + '</p>' : '')
            + '<' + headingTag + ' class="hero__title">' + escText(slide.title) + '</' + headingTag + '>'
            + (slide.text ? '<p class="hero__text">' + escText(slide.text) + '</p>' : '')
            + (actions ? '<div class="hero__actions">' + actions + '</div>' : '')
            + '</div>'
            + '</article>';
    }

    function patchSlideInDocument(doc, slide, index) {
        if (!doc) return false;
        var slideEl = doc.getElementById('hero-slide-' + index);
        if (!slideEl) return false;

        var eyebrowEl = slideEl.querySelector('.hero__eyebrow');
        if (slide.eyebrow) {
            if (!eyebrowEl) {
                eyebrowEl = doc.createElement('p');
                eyebrowEl.className = 'hero__eyebrow';
                slideEl.querySelector('.hero__content').insertBefore(
                    eyebrowEl,
                    slideEl.querySelector('.hero__title')
                );
            }
            eyebrowEl.textContent = slide.eyebrow;
        } else if (eyebrowEl) {
            eyebrowEl.remove();
        }

        var titleEl = slideEl.querySelector('.hero__title');
        if (titleEl) titleEl.textContent = slide.title || '';

        var textEl = slideEl.querySelector('.hero__text');
        if (slide.text) {
            if (!textEl) {
                textEl = doc.createElement('p');
                textEl.className = 'hero__text';
                var actions = slideEl.querySelector('.hero__actions');
                slideEl.querySelector('.hero__content').insertBefore(textEl, actions || null);
            }
            textEl.textContent = slide.text;
        } else if (textEl) {
            textEl.remove();
        }

        var actionsEl = slideEl.querySelector('.hero__actions');
        if (!actionsEl && (slide.btn1Label || slide.btn2Label)) {
            actionsEl = doc.createElement('div');
            actionsEl.className = 'hero__actions';
            slideEl.querySelector('.hero__content').appendChild(actionsEl);
        }

        function syncBtn(selector, label, url, primary) {
            if (!actionsEl) return;
            var btn = actionsEl.querySelector(selector);
            if (label) {
                if (!btn) {
                    btn = doc.createElement('a');
                    btn.className = 'hero__btn ' + (primary ? 'hero__btn--primary' : 'hero__btn--secondary');
                    actionsEl.appendChild(btn);
                }
                btn.textContent = label;
                btn.setAttribute('href', url || '#');
            } else if (btn) {
                btn.remove();
            }
        }

        syncBtn('.hero__btn--primary', slide.btn1Label, slide.btn1Url, true);
        syncBtn('.hero__btn--secondary', slide.btn2Label, slide.btn2Url, false);
        if (actionsEl && !actionsEl.children.length) actionsEl.remove();

        slideEl.style.backgroundImage = slide.bgSrc ? 'url("' + cssUrl(slide.bgSrc) + '")' : '';

        var linkEl = slideEl.querySelector('.hero__slide-link');
        if (slide.slideLinkUrl) {
            if (!linkEl) {
                linkEl = doc.createElement('a');
                linkEl.className = 'hero__slide-link';
                linkEl.setAttribute('tabindex', '-1');
                linkEl.setAttribute('aria-hidden', 'true');
                slideEl.insertBefore(linkEl, slideEl.firstChild);
            }
            linkEl.setAttribute('href', slide.slideLinkUrl);
        } else if (linkEl) {
            linkEl.remove();
        }

        return true;
    }

    function applyToDocument(doc, slides) {
        if (!doc || !slides || !slides.length) return;
        var root = doc.querySelector('[data-hero-slideshow]');
        if (!root) return;
        var track = root.querySelector('.hero__track');
        var dotsWrap = root.querySelector('.hero__dots');
        if (!track || !dotsWrap) return;

        track.innerHTML = slides.map(function (slide, index) {
            return buildSlideHtml(slide, index, index === 0);
        }).join('\n');

        dotsWrap.innerHTML = slides.map(function (slide, index) {
            return ''
                + '<button type="button" class="hero__dot' + (index === 0 ? ' is-active' : '') + '" role="tab" aria-selected="' + (index === 0 ? 'true' : 'false') + '" aria-label="Slide ' + (index + 1) + '"></button>';
        }).join('\n');

        var win = doc.defaultView;
        if (win && typeof win.initHeroSlideshow === 'function') {
            win.initHeroSlideshow(root);
        }
        if (typeof window.__fitFullSite === 'function') {
            setTimeout(window.__fitFullSite, 60);
        }
        if (getOverlayFn) {
            applyOverlayToDocument(doc, getOverlayFn());
        }
    }

    function focusSlideInPreview(index) {
        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (!doc) return;
        var dots = doc.querySelectorAll('.hero__dot');
        if (dots[index]) dots[index].click();
    }

    function commitSlides(slides, options) {
        options = options || {};
        if (setSlidesFn) setSlidesFn(slides);

        var doc = getIframeDocFn ? getIframeDocFn() : null;
        if (doc && options.mode === 'patch' && typeof options.index === 'number') {
            if (!patchSlideInDocument(doc, slides[options.index], options.index)) {
                applyToDocument(doc, slides);
            }
        } else if (doc) {
            applyToDocument(doc, slides);
        }

        if (onUpdateFn) onUpdateFn(slides, options);
    }

    function updateSlideField(index, key, value, mode) {
        var slides = cloneSlides(getSlidesFn ? getSlidesFn() : DEFAULT_SLIDES);
        if (!slides[index]) return;
        slides[index][key] = value;
        commitSlides(slides, { mode: mode || 'patch', index: index });
    }

    function renderPanel() {
        if (!mountEl) return;
        var slides = cloneSlides(getSlidesFn ? getSlidesFn() : DEFAULT_SLIDES);

        mountEl.innerHTML = slides.map(function (slide, index) {
            return ''
                + '<details class="designer-slide-group hero-slide-editor-card" data-slide-index="' + index + '">'
                + '<summary class="designer-slide-group-head">Slide ' + (index + 1)
                + (slide.title ? ' — ' + escText(slide.title).substring(0, 42) : '')
                + '</summary>'
                + '<div class="designer-slide-group-body">'
                + field('Eyebrow', 'eyebrow', slide.eyebrow, index)
                + field('Headline', 'title', slide.title, index)
                + textarea('Body text', 'text', slide.text, index)
                + field('Slide link URL <span class="editor-field-hint-inline">(optional — whole slide)</span>', 'slideLinkUrl', slide.slideLinkUrl, index, '/promo')
                + bgWidget(index, slide.bgSrc)
                + '<p class="editor-field-label" style="margin:8px 0 4px">Button 1</p>'
                + inlinePair(index, 'btn1Label', slide.btn1Label, 'btn1Url', slide.btn1Url, 'Label', 'URL', 'Browse Catalog', '/catalog')
                + '<p class="editor-field-label" style="margin:8px 0 4px">Button 2</p>'
                + inlinePair(index, 'btn2Label', slide.btn2Label, 'btn2Url', slide.btn2Url, 'Label', 'URL', 'Learn more', '/about')
                + (slides.length > MIN_SLIDES
                    ? '<button type="button" class="hero-slide-remove-btn" data-action="remove" data-index="' + index + '">Remove slide</button>'
                    : '')
                + '</div>'
                + '</details>';
        }).join('');

        var addBtn = document.getElementById('heroSlidesAddBtn');
        if (addBtn) addBtn.disabled = slides.length >= MAX_SLIDES;

        bindPanelEvents();
    }

    function field(label, key, value, index, placeholder) {
        return ''
            + '<div class="editor-field">'
            + '<label class="editor-field-label">' + label + '</label>'
            + '<input type="text" class="editor-field-input hero-slide-input" data-index="' + index + '" data-key="' + key + '" value="' + escAttr(value) + '"'
            + (placeholder ? ' placeholder="' + escAttr(placeholder) + '"' : '')
            + '>'
            + '</div>';
    }

    function textarea(label, key, value, index) {
        return ''
            + '<div class="editor-field">'
            + '<label class="editor-field-label">' + label + '</label>'
            + '<textarea class="editor-field-input editor-field-textarea hero-slide-input" rows="2" data-index="' + index + '" data-key="' + key + '">' + escText(value) + '</textarea>'
            + '</div>';
    }

    function inlinePair(index, labelKey, labelVal, urlKey, urlVal, labelA, labelB, phA, phB) {
        return ''
            + '<div class="editor-field editor-field--inline">'
            + '<div><label class="editor-field-label">' + labelA + '</label>'
            + '<input type="text" class="editor-field-input hero-slide-input" data-index="' + index + '" data-key="' + labelKey + '" value="' + escAttr(labelVal) + '" placeholder="' + escAttr(phA) + '"></div>'
            + '<div><label class="editor-field-label">' + labelB + '</label>'
            + '<input type="text" class="editor-field-input hero-slide-input" data-index="' + index + '" data-key="' + urlKey + '" value="' + escAttr(urlVal) + '" placeholder="' + escAttr(phB) + '"></div>'
            + '</div>';
    }

    function bgWidget(index, src) {
        var hasSrc = !!src;
        return ''
            + '<div class="editor-field">'
            + '<label class="editor-field-label">Background image</label>'
            + '<div class="editor-slide-bg-widget">'
            + '<div class="editor-slide-bg-thumb">'
            + (hasSrc
                ? '<img src="' + escAttr(src) + '" alt="" class="hero-slide-bg-preview">'
                : '<span class="editor-slide-bg-thumb-empty">Default theme image</span>')
            + '</div>'
            + '<div class="editor-slide-bg-actions">'
            + '<label class="editor-logo-file-label">Upload'
            + '<input type="file" accept="image/*" class="hero-slide-bg-file" data-index="' + index + '" hidden>'
            + '</label>'
            + (hasSrc ? '<button type="button" class="editor-logo-remove-btn hero-slide-bg-remove" data-index="' + index + '">Remove</button>' : '')
            + '</div>'
            + '</div>'
            + '<p class="editor-field-hint">Recommended: <strong>1920×600 px</strong> min (wide landscape).</p>'
            + '</div>';
    }

    function bindPanelEvents() {
        if (!mountEl) return;

        mountEl.querySelectorAll('.hero-slide-input').forEach(function (input) {
            var ev = input.tagName === 'TEXTAREA' || input.type === 'text' ? 'input' : 'change';
            input.addEventListener(ev, function () {
                var index = parseInt(input.dataset.index, 10);
                updateSlideField(index, input.dataset.key, input.value);
            });
            input.addEventListener('focus', function () {
                focusSlideInPreview(parseInt(input.dataset.index, 10));
            });
        });

        mountEl.querySelectorAll('.hero-slide-bg-file').forEach(function (input) {
            input.addEventListener('change', function () {
                var file = input.files && input.files[0];
                if (!file) return;
                var index = parseInt(input.dataset.index, 10);
                var reader = new FileReader();
                reader.onload = function (evt) {
                    updateSlideField(index, 'bgSrc', evt.target.result, 'patch');
                    renderPanel();
                };
                reader.readAsDataURL(file);
                input.value = '';
            });
        });

        mountEl.querySelectorAll('.hero-slide-bg-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                updateSlideField(parseInt(btn.dataset.index, 10), 'bgSrc', '', 'patch');
                renderPanel();
            });
        });

        mountEl.querySelectorAll('[data-action="remove"]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var slides = cloneSlides(getSlidesFn ? getSlidesFn() : DEFAULT_SLIDES);
                var index = parseInt(btn.dataset.index, 10);
                if (slides.length <= MIN_SLIDES) return;
                slides.splice(index, 1);
                commitSlides(slides, { mode: 'rebuild' });
                renderPanel();
            });
        });
    }

    function init(options) {
        mountEl = options.mount || document.getElementById('heroSlidesEditorMount');
        overlayMountEl = options.overlayMount || document.getElementById('heroOverlayControls');
        getSlidesFn = options.getSlides;
        setSlidesFn = options.setSlides;
        getOverlayFn = options.getOverlay;
        setOverlayFn = options.setOverlay;
        onUpdateFn = options.onUpdate;
        getIframeDocFn = options.getIframeDoc;

        renderOverlayControls();
        syncOverlayControls(getOverlayFn ? getOverlayFn() : DEFAULT_OVERLAY);

        var addBtn = document.getElementById('heroSlidesAddBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                var slides = cloneSlides(getSlidesFn ? getSlidesFn() : DEFAULT_SLIDES);
                if (slides.length >= MAX_SLIDES) return;
                slides.push(emptySlide());
                commitSlides(slides, { mode: 'rebuild' });
                renderPanel();
            });
        }
    }

    window.HeroSlidesEditor = {
        DEFAULT_SLIDES: DEFAULT_SLIDES,
        DEFAULT_OVERLAY: DEFAULT_OVERLAY,
        MAX_SLIDES: MAX_SLIDES,
        MIN_SLIDES: MIN_SLIDES,
        cloneSlides: cloneSlides,
        emptySlide: emptySlide,
        migrateFromDraft: migrateFromDraft,
        migrateOverlayFromDraft: migrateOverlayFromDraft,
        applyToDocument: applyToDocument,
        applyOverlayToDocument: applyOverlayToDocument,
        renderPanel: renderPanel,
        syncOverlayControls: syncOverlayControls,
        init: init,
    };
}());
