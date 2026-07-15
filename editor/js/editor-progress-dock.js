/**
 * Bottom progress dock — section completion vs template baseline.
 * Loaded before showroom-editor.js; initialized from the editor init flow.
 */
(function () {
    const SECTIONS = {
        classic: [
            { id: 'editor-section-header', label: 'Header' },
            { id: 'editor-section-hero', label: 'Hero' },
            { id: 'editor-section-featured-categories', label: 'Featured Categories' },
            { id: 'editor-section-about-us', label: 'About Us' },
            { id: 'editor-section-feature-cards', label: 'Feature Cards' },
            { id: 'editor-section-sketch-section', label: 'Sketch Section' },
            { id: 'editor-section-you-may-like', label: 'You May Like' },
            { id: 'editor-section-get-inspired', label: 'Get Inspired' },
            { id: 'editor-section-footer', label: 'Footer' },
        ],
        gallery: [
            { id: 'editor-section-header', label: 'Header' },
            { id: 'editor-section-gallery-main-nav', label: 'Main Navigation' },
            { id: 'editor-section-hero', label: 'Hero' },
            { id: 'editor-section-gallery-catalog', label: 'Catalog Highlights' },
            { id: 'editor-section-footer-classic', label: 'Footer' },
            { id: 'editor-section-copyright-classic', label: 'Copyright' },
        ],
        spotlight: [
            { id: 'editor-section-header', label: 'Header' },
            { id: 'editor-section-hero', label: 'Hero' },
            { id: 'editor-section-spotlight-on-sale', label: 'On Sale' },
            { id: 'editor-section-spotlight-shop-by-room', label: 'Shop by Room' },
            { id: 'editor-section-spotlight-about', label: 'About Us' },
            { id: 'editor-section-spotlight-category', label: 'Categories' },
            { id: 'editor-section-spotlight-brands', label: 'Brands' },
            { id: 'editor-section-spotlight-newsletter', label: 'Newsletter' },
            { id: 'editor-section-spotlight-footer', label: 'Footer' },
        ],
    };

    const CLASSIC_HEADER_KEYS = [
        'headerBannerBackgroundColor',
        'headerBannerTextColor',
        'headerBannerLinks',
        'mainNavItems',
        'headerLogoImage',
    ];

    const CLASSIC_HERO_KEYS = [
        'title',
        'description',
        'cta',
        'copyBackgroundColor',
        'copyTextColor',
        'heroCtaBackgroundColor',
        'heroCtaTextColor',
        'heroCtaVisible',
        'productImage',
        'lifestyleImage',
        'shopAllUrl',
    ];

    const GALLERY_HEADER_KEYS = [
        'headerLogoImage',
        'galleryHeaderSticky',
        'galleryHeaderBarBackgroundColor',
        'galleryHeaderBarTextColor',
        'galleryHeaderCenterCopy',
        'galleryHeaderWishlistLabel',
        'galleryHeaderWishlistUrl',
        'galleryHeaderSignInLabel',
        'galleryHeaderSignInUrl',
    ];

    const GALLERY_MAIN_NAV_KEYS = [
        'galleryMainNavItems',
    ];

    const GALLERY_HERO_KEYS = [
        'galleryHeroPrimaryImage',
        'galleryHeroSecondaryTopImage',
        'galleryHeroSecondaryTopHeading',
        'galleryHeroSecondaryTopUrl',
        'galleryHeroSecondaryBottomImage',
        'galleryHeroSecondaryBottomHeading',
        'galleryHeroSecondaryBottomUrl',
        'galleryHeroHeadlineLine1',
        'galleryHeroHeadlineLine2',
        'galleryHeroHeadlineLine3',
        'galleryHeroCopy',
        'galleryHeroButtonLabel',
        'galleryHeroButtonUrl',
        'galleryHeroButtonBackgroundColor',
        'galleryHeroButtonTextColor',
    ];

    const SPOTLIGHT_HEADER_KEYS = [
        'headerBannerBackgroundColor',
        'headerBannerTextColor',
        'headerBannerLinks',
        'mainNavItems',
        'headerLogoImage',
        'spotlightBannerAddress',
        'spotlightBannerPhone',
        'spotlightHeaderLogoUrl',
        'spotlightHeaderSignUpUrl',
        'spotlightHeaderLoginUrl',
        'spotlightHeaderWishlistUrl',
        'spotlightHeaderCartUrl',
    ];

    const SPOTLIGHT_HERO_KEYS = ['spotlightHeroSlides'];

    let ctx = null;
    let dockEl = null;
    let listEl = null;
    let countEl = null;
    let barFillEl = null;
    let hintEl = null;
    let toggleEl = null;
    let innerEl = null;
    let expanded = false;

    function pick(state, keys) {
        const slice = {};
        keys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(state, key)) {
                slice[key] = state[key];
            }
        });
        return slice;
    }

    function pickSectionSlice(sectionId, state, design) {
        switch (sectionId) {
            case 'editor-section-header':
                if (design === 'gallery') return pick(state, GALLERY_HEADER_KEYS);
                if (design === 'spotlight') return pick(state, SPOTLIGHT_HEADER_KEYS);
                return pick(state, CLASSIC_HEADER_KEYS);
            case 'editor-section-gallery-main-nav':
                return pick(state, GALLERY_MAIN_NAV_KEYS);
            case 'editor-section-hero':
                if (design === 'gallery') return pick(state, GALLERY_HERO_KEYS);
                if (design === 'spotlight') return pick(state, SPOTLIGHT_HERO_KEYS);
                return pick(state, CLASSIC_HERO_KEYS);
            case 'editor-section-featured-categories':
                return pick(state, ['featuredCategories']);
            case 'editor-section-about-us':
                return pick(state, [
                    'aboutHeader',
                    'aboutParagraph',
                    'aboutPrimaryLabel',
                    'aboutPrimaryUrl',
                    'aboutSecondaryLabel',
                    'aboutSecondaryUrl',
                    'aboutButtonBackgroundColor',
                    'aboutButtonTextColor',
                    'aboutEmployeeImage',
                ]);
            case 'editor-section-feature-cards':
                return pick(state, [
                    'featureLeftHeader',
                    'featureLeftParagraph',
                    'featureLeftButtonLabel',
                    'featureLeftButtonUrl',
                    'featureLeftButtonVisible',
                    'featureLeftImage',
                    'featureRightHeader',
                    'featureRightParagraph',
                    'featureRightButtonLabel',
                    'featureRightButtonUrl',
                    'featureRightButtonVisible',
                    'featureRightImage',
                    'featureButtonBackgroundColor',
                    'featureButtonTextColor',
                ]);
            case 'editor-section-sketch-section':
                return pick(state, ['sketchSectionVisible']);
            case 'editor-section-you-may-like':
                return pick(state, ['youMayLikeItems']);
            case 'editor-section-get-inspired':
                return pick(state, ['getInspiredLifestyleImage', 'getInspiredItems']);
            case 'editor-section-footer':
                return pick(state, [
                    'footerLogoImage',
                    'footerLogoUseHeader',
                    'footerEmail',
                    'footerFacebookUrl',
                    'footerFacebookVisible',
                    'footerInstagramUrl',
                    'footerInstagramVisible',
                    'footerXUrl',
                    'footerXVisible',
                    'footerYoutubeUrl',
                    'footerYoutubeVisible',
                    'footerLinkedinUrl',
                    'footerLinkedinVisible',
                    'footerQuickLinks',
                    'footerPolicyLinks',
                    'footerCompanyName',
                    'footerAddress',
                    'footerPhone',
                    'footerCopyrightName',
                ]);
            case 'editor-section-gallery-catalog':
                return pick(state, ['galleryCatalogTiles']);
            case 'editor-section-footer-classic':
                return pick(state, [
                    'classicFooterCompanyName',
                    'classicFooterAboutCopy',
                    'classicFooterShopLinks',
                    'classicFooterAboutLinks',
                    'classicFooterAccountLinks',
                    'classicFooterAddress',
                    'classicFooterHoursMonFri',
                    'classicFooterHoursSaturday',
                    'classicFooterHoursSunday',
                    'classicFooterBackgroundColor',
                    'classicFooterTextColor',
                ]);
            case 'editor-section-copyright-classic':
                return pick(state, [
                    'classicFooterCopyrightName',
                    'classicFooterCopyrightTextColor',
                    'classicFooterCopyrightBackgroundColor',
                ]);
            case 'editor-section-spotlight-on-sale':
                return pick(state, [
                    'spotlightOnSaleHeading',
                    'spotlightOnSaleUrl',
                    'spotlightOnSaleImage',
                ]);
            case 'editor-section-spotlight-shop-by-room':
                return pick(state, ['spotlightShopByRoomHeading', 'spotlightShopByRoomTiles']);
            case 'editor-section-spotlight-about':
                return pick(state, [
                    'spotlightAboutHeading',
                    'spotlightAboutCopy',
                    'spotlightAboutImage',
                ]);
            case 'editor-section-spotlight-category':
                return pick(state, ['spotlightCategoryHeading', 'spotlightCategoryTiles']);
            case 'editor-section-spotlight-brands':
                return pick(state, [
                    'spotlightBrandsHeading',
                    'spotlightBrandsUrl',
                    'spotlightBrandsImage',
                ]);
            case 'editor-section-spotlight-newsletter':
                return pick(state, [
                    'spotlightNewsletterHeading',
                    'spotlightNewsletterCopy',
                    'spotlightNewsletterButtonLabel',
                    'spotlightNewsletterCtaHeading',
                    'spotlightNewsletterCtaCopy',
                    'spotlightNewsletterCtaShopLabel',
                    'spotlightNewsletterCtaShopUrl',
                    'spotlightNewsletterCtaContactLabel',
                    'spotlightNewsletterCtaContactUrl',
                ]);
            case 'editor-section-spotlight-footer':
                return pick(state, [
                    'spotlightFooterLogoImage',
                    'spotlightFooterLogoUrl',
                    'spotlightFooterAdaUrl',
                    'spotlightFooterQuickLinksHeading',
                    'spotlightFooterPolicyLinksHeading',
                    'spotlightFooterProfileLinksHeading',
                    'spotlightFooterCompanyInfoHeading',
                    'spotlightFooterQuickLinks',
                    'spotlightFooterPolicyLinks',
                    'spotlightFooterProfileLinks',
                    'spotlightFooterCompanyInfoItems',
                    'spotlightFooterBackgroundColor',
                    'spotlightFooterTextColor',
                    'spotlightFooterCopyrightBackgroundColor',
                    'spotlightFooterCopyrightTextColor',
                    'spotlightFooterCompanyName',
                    'spotlightFooterCopyrightName',
                    'spotlightFooterFacebookUrl',
                    'spotlightFooterFacebookVisible',
                    'spotlightFooterInstagramUrl',
                    'spotlightFooterInstagramVisible',
                    'spotlightFooterXUrl',
                    'spotlightFooterXVisible',
                    'spotlightFooterLinkedinUrl',
                    'spotlightFooterLinkedinVisible',
                    'spotlightFooterYoutubeUrl',
                    'spotlightFooterYoutubeVisible',
                ]);
            default:
                return {};
        }
    }

    function isUploadedImage(value) {
        return typeof value === 'string' && value.startsWith('data:');
    }

    function normalizeForCompare(value) {
        if (value === null || value === undefined) return null;

        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (isUploadedImage(trimmed)) return { __upload: trimmed.slice(0, 64) };
            if (!trimmed) return '';
            if (/\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(trimmed) || trimmed.includes('/')) {
                return { __asset: trimmed.replace(/^\.?\//, '').split('?')[0] };
            }
            return trimmed;
        }

        if (typeof value === 'number' || typeof value === 'boolean') return value;

        if (Array.isArray(value)) {
            return value.map((item) => normalizeForCompare(item));
        }

        if (typeof value === 'object') {
            const normalized = {};
            Object.keys(value).sort().forEach((key) => {
                normalized[key] = normalizeForCompare(value[key]);
            });
            return normalized;
        }

        return value;
    }

    function slicesEqual(currentSlice, baselineSlice) {
        return JSON.stringify(normalizeForCompare(currentSlice))
            === JSON.stringify(normalizeForCompare(baselineSlice));
    }

    function getSectionStatus(sectionId, state, baseline, reviewedSections) {
        if (Array.isArray(reviewedSections) && reviewedSections.includes(sectionId)) {
            return 'reviewed';
        }

        const design = ctx.getDesign();
        const currentSlice = pickSectionSlice(sectionId, state, design);
        const baselineSlice = pickSectionSlice(sectionId, baseline, design);

        if (slicesEqual(currentSlice, baselineSlice)) {
            return 'default';
        }

        return 'customized';
    }

    function getReviewedSections(state) {
        return Array.isArray(state.reviewedSections) ? state.reviewedSections : [];
    }

    function setSectionReviewed(sectionId, reviewed) {
        const state = ctx.getState();
        const current = new Set(getReviewedSections(state));
        if (reviewed) {
            current.add(sectionId);
        } else {
            current.delete(sectionId);
        }
        state.reviewedSections = [...current];
        ctx.saveState({ silent: true });
        ctx.onReviewChange?.(sectionId, reviewed);
    }

    function statusLabel(status) {
        if (status === 'reviewed') return 'Reviewed';
        if (status === 'customized') return 'Customized';
        return 'Template default';
    }

    function statusIcon(status) {
        if (status === 'reviewed') return 'fa-circle-check';
        if (status === 'customized') return 'fa-pen';
        return 'fa-circle';
    }

    function render() {
        if (!ctx || !listEl) return;

        const design = ctx.getDesign();
        const sections = SECTIONS[design] || [];
        const state = ctx.getState();
        const baseline = ctx.getBaselineState();
        let reviewed = getReviewedSections(state);

        reviewed = reviewed.filter((sectionId) => {
            const currentSlice = pickSectionSlice(sectionId, state, design);
            const baselineSlice = pickSectionSlice(sectionId, baseline, design);
            return !slicesEqual(currentSlice, baselineSlice);
        });
        if (reviewed.length !== getReviewedSections(state).length) {
            state.reviewedSections = reviewed;
            ctx.saveState({ silent: true });
        }

        let customizedCount = 0;
        let reviewedCount = 0;

        listEl.innerHTML = sections.map((section) => {
            const status = getSectionStatus(section.id, state, baseline, reviewed);
            if (status === 'customized' || status === 'reviewed') customizedCount += 1;
            if (status === 'reviewed') reviewedCount += 1;

            const isReviewed = status === 'reviewed';
            const canReview = status !== 'default';

            return (
                `<li class="editor-progress-item editor-progress-item--${status}">
                    <button type="button" class="editor-progress-jump" data-section-id="${section.id}">
                        <span class="editor-progress-item-icon" aria-hidden="true">
                            <i class="fa-solid ${statusIcon(status)}"></i>
                        </span>
                        <span class="editor-progress-item-text">
                            <span class="editor-progress-item-label">${section.label}</span>
                            <span class="editor-progress-item-status">${statusLabel(status)}</span>
                        </span>
                    </button>
                    <button type="button"
                        class="editor-progress-review${isReviewed ? ' is-active' : ''}"
                        data-section-id="${section.id}"
                        data-reviewed="${isReviewed ? 'true' : 'false'}"
                        aria-pressed="${isReviewed ? 'true' : 'false'}"
                        aria-label="${isReviewed ? `Clear reviewed mark for ${section.label}` : `Mark ${section.label} as reviewed`}"
                        title="${isReviewed ? 'Clear reviewed mark' : 'Mark as reviewed'}"
                        ${canReview ? '' : 'disabled'}>
                        <i class="fa-solid fa-check" aria-hidden="true"></i>
                    </button>
                </li>`
            );
        }).join('');

        const total = sections.length;
        const pct = total ? Math.round((customizedCount / total) * 100) : 0;

        if (countEl) {
            countEl.textContent = `${customizedCount} of ${total} sections customized`;
        }
        if (barFillEl) {
            barFillEl.style.width = `${pct}%`;
        }
        if (hintEl) {
            const remaining = total - customizedCount;
            if (remaining <= 0) {
                hintEl.textContent = reviewedCount === total
                    ? 'All sections reviewed — ready to export when you are.'
                    : 'Every section has changes — mark sections reviewed as you proofread.';
            } else {
                hintEl.textContent = `${remaining} section${remaining === 1 ? '' : 's'} still use template defaults — export anytime.`;
            }
        }

        if (toggleEl) {
            const summary = `${customizedCount}/${total} customized`;
            toggleEl.setAttribute('data-summary', summary);
            const summaryEl = toggleEl.querySelector('.editor-progress-dock-toggle-summary');
            if (summaryEl) summaryEl.textContent = summary;
        }

        const progressBar = document.getElementById('editorProgressBar');
        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', String(pct));
        }
    }

    function bindDockEvents() {
        if (!listEl) return;

        listEl.addEventListener('click', (event) => {
            const jumpBtn = event.target.closest('.editor-progress-jump');
            if (jumpBtn) {
                const sectionId = jumpBtn.dataset.sectionId;
                if (sectionId) ctx.onJump(sectionId);
                return;
            }

            const reviewBtn = event.target.closest('.editor-progress-review');
            if (reviewBtn && !reviewBtn.disabled) {
                const sectionId = reviewBtn.dataset.sectionId;
                const isReviewed = reviewBtn.dataset.reviewed === 'true';
                setSectionReviewed(sectionId, !isReviewed);
            }
        });

        if (toggleEl && innerEl) {
            toggleEl.addEventListener('click', () => {
                expanded = !expanded;
                dockEl.classList.toggle('is-collapsed', !expanded);
                toggleEl.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });
        }
    }

    function setExpanded(nextExpanded) {
        expanded = nextExpanded;
        if (dockEl) dockEl.classList.toggle('is-collapsed', !expanded);
        if (toggleEl) toggleEl.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    function init(context) {
        ctx = context;
        dockEl = document.getElementById('editorProgressDock');
        listEl = document.getElementById('editorProgressList');
        countEl = document.getElementById('editorProgressCount');
        barFillEl = document.getElementById('editorProgressBarFill');
        hintEl = document.getElementById('editorProgressHint');
        toggleEl = document.getElementById('editorProgressDockToggle');
        innerEl = document.getElementById('editorProgressDockInner');

        if (!dockEl) return;

        bindDockEvents();
        setExpanded(false);
        render();
    }

    function update() {
        render();
    }

    window.EditorProgressDock = {
        init,
        update,
        getSectionStatus,
        pickSectionSlice,
    };
}());
