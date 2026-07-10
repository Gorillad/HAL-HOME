/**
 * Avalon Designer editor — header, Sections 1–3, footer + live iframe preview.
 */
(function () {
    'use strict';

    var TEMPLATE = 'avalon';
    var LS_KEY = 'logicxo-designer-avalon';

    var DEFAULTS = {
        logoSrc: 'data/images/avalon-logo.png',
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

        s2RuleLabel: 'Featured Collections',
        s2Heading: 'Signature Pieces',
        s2Subtitle: 'Museum-quality fixtures and designer silhouettes — curated for spaces that command attention.',
        s2Tile1Src: 'data/images/collections/Art+Deco+Chandeliers+-+Cafe+Americain,+Amsterdam.webp',
        s2Tile1Label: 'Art Deco Chandeliers',
        s2Tile1Url: '/catalog/lighting/ceiling-lights/chandeliers',
        s2Tile1Alt: 'Art Deco chandeliers at Cafe Americain, Amsterdam',
        s2Tile2Src: 'data/images/collections/Art+Deco+Light+Fixture+-+Disney.webp',
        s2Tile2Label: 'Architectural Classics',
        s2Tile2Url: '/catalog/lighting/ceiling-lights/chandeliers',
        s2Tile2Alt: 'Art Deco light fixture inspired by classic Hollywood design',
        s2Tile3Src: 'data/images/collections/pendants.jpg',
        s2Tile3Label: 'Designer Pendants',
        s2Tile3Url: '/catalog/lighting/ceiling-lights/pendants',
        s2Tile3Alt: 'Sculpted pendant lights over a kitchen island',
        s2Tile4Src: 'data/images/collections/chandelier.jpg',
        s2Tile4Label: 'Statement Chandeliers',
        s2Tile4Url: '/catalog/lighting/ceiling-lights/chandeliers',
        s2Tile4Alt: 'Crystal chandelier in a formal dining room',

        s3RuleLabel: 'The Atelier',
        s3Eyebrow: 'Our Story',
        s3Headline: 'Light, Considered as Architecture',
        s3Body: 'Avalon was founded on a simple conviction: lighting is not an afterthought — it is the architectural gesture that defines a room. We curate designer fixtures with the rigor of a fine gallery, sourcing pieces that honor craftsmanship, proportion, and the enduring geometry of the Art Deco tradition.',
        s3StoryLinkLabel: 'Discover Avalon',
        s3StoryLinkUrl: '/about',
        s3TestimonialEyebrow: 'From Our Clients',
        s3Quote: 'Avalon helped us source fixtures that elevated every room in the project. The curation felt personal — never catalog, always considered.',
        s3Cite: '— E. Whitmore, Interior Designer',
        s3CtaLabel: 'Request a Consultation',
        s3CtaUrl: '/contact',

        reviewsEyebrow: 'Google Reviews',
        reviewsHeading: 'What Our Customers Say',
        reviewsRating: '4.9',
        reviewsCount: 'Based on 127 reviews',
        reviewsLinkLabel: 'See all reviews on Google',
        reviewsLinkUrl: 'https://www.google.com/maps',
        review1Quote: 'Exceptional service and a stunning selection of Art Deco fixtures. Avalon sourced the perfect chandelier for our dining room renovation.',
        review1Author: 'Sarah M.',
        review1Date: '2 weeks ago',
        review2Quote: 'Professional, knowledgeable team. White-glove delivery was flawless — highly recommend for trade and residential projects alike.',
        review2Author: 'James R., Architect',
        review2Date: '1 month ago',
        review3Quote: 'The curation is unlike any lighting showroom I have visited. Every piece feels intentional and museum-quality.',
        review3Author: 'Elena K.',
        review3Date: '3 weeks ago',

        expertEyebrow: 'Design Consultation',
        expertHeadline: 'Get Personalized Advice from a Lighting Expert',
        expertCopy: 'Our specialists help you choose scale, finish, and placement for every room — from statement chandeliers to layered accent light. Complimentary for residential projects and trade partners.',
        expertCtaLabel: 'Book a Consultation',
        expertCtaUrl: '/contact',
        expertImg1Src: 'data/images/hero/primary.jpg',
        expertImg1Alt: 'Lighting expert reviewing fixture selections with a client',
        expertImg2Src: 'data/images/catalog/hall-lantern.jpg',
        expertImg2Alt: 'Elegant hall lantern fixture in a curated showroom display',
        expertImg3Src: 'data/images/hero/gettyimages-802161384-612x612.jpg',
        expertImg3Alt: 'Warm interior with designer pendant lighting over a dining table',

        footerTagline: 'Art Deco inspired luxury lighting for residential and hospitality projects.',
        footerCol1Head: 'Shop',
        footerCol1Link1Label: 'Chandeliers',
        footerCol1Link1Url: '/catalog/lighting/ceiling-lights/chandeliers',
        footerCol1Link2Label: 'Pendants',
        footerCol1Link2Url: '/catalog/lighting/ceiling-lights/pendants',
        footerCol1Link3Label: 'Outdoor',
        footerCol1Link3Url: '/catalog/outdoor',
        footerCol1Link4Label: 'Brands',
        footerCol1Link4Url: '/brands',
        footerCol2Head: 'Company',
        footerCol2Link1Label: 'About Avalon',
        footerCol2Link1Url: '/about',
        footerCol2Link2Label: 'Trade Program',
        footerCol2Link2Url: '/trade',
        footerCol2Link3Label: 'Contact',
        footerCol2Link3Url: '/contact',
        footerCol2Link4Label: 'Privacy',
        footerCol2Link4Url: '/privacy',
        footerCopyright: '© 2026 Avalon Lighting. All rights reserved.',
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
        {
            field: 's2Tile1Src',
            fileInput: 'sf-s2-tile1-file',
            thumbImg: 'sf-s2-tile1-thumb',
            thumbEmpty: 'sf-s2-tile1-thumb-empty',
            removeBtn: 'sf-s2-tile1-remove',
        },
        {
            field: 's2Tile2Src',
            fileInput: 'sf-s2-tile2-file',
            thumbImg: 'sf-s2-tile2-thumb',
            thumbEmpty: 'sf-s2-tile2-thumb-empty',
            removeBtn: 'sf-s2-tile2-remove',
        },
        {
            field: 's2Tile3Src',
            fileInput: 'sf-s2-tile3-file',
            thumbImg: 'sf-s2-tile3-thumb',
            thumbEmpty: 'sf-s2-tile3-thumb-empty',
            removeBtn: 'sf-s2-tile3-remove',
        },
        {
            field: 's2Tile4Src',
            fileInput: 'sf-s2-tile4-file',
            thumbImg: 'sf-s2-tile4-thumb',
            thumbEmpty: 'sf-s2-tile4-thumb-empty',
            removeBtn: 'sf-s2-tile4-remove',
        },
        {
            field: 'expertImg1Src',
            fileInput: 'sf-expert-img1-file',
            thumbImg: 'sf-expert-img1-thumb',
            thumbEmpty: 'sf-expert-img1-thumb-empty',
            removeBtn: 'sf-expert-img1-remove',
        },
        {
            field: 'expertImg2Src',
            fileInput: 'sf-expert-img2-file',
            thumbImg: 'sf-expert-img2-thumb',
            thumbEmpty: 'sf-expert-img2-thumb-empty',
            removeBtn: 'sf-expert-img2-remove',
        },
        {
            field: 'expertImg3Src',
            fileInput: 'sf-expert-img3-file',
            thumbImg: 'sf-expert-img3-thumb',
            thumbEmpty: 'sf-expert-img3-thumb-empty',
            removeBtn: 'sf-expert-img3-remove',
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
    var panelSection2 = null;
    var panelSection3 = null;
    var panelFooter = null;
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

    function migrateDraft(saved) {
        if (!saved || typeof saved !== 'object') return saved;
        if (saved.logoSrc && /scera-logo/i.test(String(saved.logoSrc))) {
            saved.logoSrc = DEFAULTS.logoSrc;
        }
        return saved;
    }

    function loadDraft() {
        try {
            var raw = localStorage.getItem(LS_KEY);
            if (!raw) {
                raw = localStorage.getItem('logicxo-designer-scera');
                if (raw) {
                    localStorage.setItem(LS_KEY, raw);
                    localStorage.removeItem('logicxo-designer-scera');
                }
            }
            if (raw) return Promise.resolve(migrateDraft(JSON.parse(raw)));
        } catch (e) { /* ignore */ }
        if (!window.DESIGNER_API_ENABLED) return Promise.resolve(null);
        var url = (window.DESIGNER_API_BASE || '') + '/api/designer/draft?template=' + TEMPLATE;
        return fetch(url, { credentials: 'include' })
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (data) {
                var saved = (data && (data.draft || data)) || null;
                return migrateDraft(saved);
            })
            .catch(function () { return null; });
    }

    function qsel(sel) {
        return iframeDoc ? iframeDoc.querySelector(sel) : null;
    }

    function applyLogo() {
        var src = draft.logoSrc || DEFAULTS.logoSrc;
        var headerLogo = qsel('#avalonHeaderLogo');
        var footerLogo = qsel('#avalonFooterLogo');
        if (headerLogo) headerLogo.src = src;
        if (footerLogo) footerLogo.src = src;

        var root = iframeDoc && iframeDoc.documentElement;
        if (root) {
            root.style.setProperty('--avalon-header-logo-h', (draft.logoSize || DEFAULTS.logoSize) + 'px');
        }
    }

    function applyLogoLink() {
        var url = draft.logoUrl || DEFAULTS.logoUrl;
        var link = qsel('#avalonLogoLink');
        if (link) link.setAttribute('href', url);
        var footerLink = qsel('#avalonFooterLogoLink');
        if (footerLink) footerLink.setAttribute('href', url);
    }

    function applyTopBarCopy() {
        var el = qsel('#avalonTopBarCopy');
        if (el) el.textContent = draft.topBarCopy || DEFAULTS.topBarCopy;
    }

    function applySearchPlaceholder() {
        var el = qsel('#avalonSearchInput');
        if (el) el.setAttribute('placeholder', draft.searchPlaceholder || DEFAULTS.searchPlaceholder);
    }

    function applyHero() {
        var primaryImg = qsel('#avalonHeroPrimaryImg');
        if (primaryImg) {
            primaryImg.src = draft.heroPrimarySrc || DEFAULTS.heroPrimarySrc;
            primaryImg.alt = draft.heroPrimaryAlt || DEFAULTS.heroPrimaryAlt;
        }

        var eyebrow = qsel('#avalonHeroEyebrow');
        if (eyebrow) eyebrow.textContent = draft.heroEyebrow || DEFAULTS.heroEyebrow;

        var h1 = qsel('#avalonHeroHeadline1');
        var h2 = qsel('#avalonHeroHeadline2');
        var h3 = qsel('#avalonHeroHeadline3');
        if (h1) h1.textContent = draft.heroHeadline1 || DEFAULTS.heroHeadline1;
        if (h2) h2.textContent = draft.heroHeadline2 || DEFAULTS.heroHeadline2;
        if (h3) h3.textContent = draft.heroHeadline3 || DEFAULTS.heroHeadline3;

        var copy = qsel('#avalonHeroCopy');
        if (copy) copy.textContent = draft.heroCopy || DEFAULTS.heroCopy;

        var cta = qsel('#avalonHeroCta');
        if (cta) {
            cta.textContent = draft.heroCtaLabel || DEFAULTS.heroCtaLabel;
            cta.setAttribute('href', draft.heroCtaUrl || DEFAULTS.heroCtaUrl);
        }

        var tile1Img = qsel('#avalonHeroTile1Img');
        if (tile1Img) tile1Img.src = draft.heroTile1Src || DEFAULTS.heroTile1Src;

        var tile1Link = qsel('#avalonHeroTile1Link');
        if (tile1Link) tile1Link.setAttribute('href', draft.heroTile1Url || DEFAULTS.heroTile1Url);

        var tile1Heading = qsel('#avalonHeroTile1Heading');
        if (tile1Heading) tile1Heading.textContent = draft.heroTile1Heading || DEFAULTS.heroTile1Heading;

        var tile1Tag = qsel('#avalonHeroTile1Tag');
        if (tile1Tag) tile1Tag.textContent = draft.heroTile1Tag || DEFAULTS.heroTile1Tag;

        var tile2Img = qsel('#avalonHeroTile2Img');
        if (tile2Img) tile2Img.src = draft.heroTile2Src || DEFAULTS.heroTile2Src;

        var tile2Link = qsel('#avalonHeroTile2Link');
        if (tile2Link) tile2Link.setAttribute('href', draft.heroTile2Url || DEFAULTS.heroTile2Url);

        var tile2Heading = qsel('#avalonHeroTile2Heading');
        if (tile2Heading) tile2Heading.textContent = draft.heroTile2Heading || DEFAULTS.heroTile2Heading;

        var tile2Tag = qsel('#avalonHeroTile2Tag');
        if (tile2Tag) tile2Tag.textContent = draft.heroTile2Tag || DEFAULTS.heroTile2Tag;
    }

    function applySection2() {
        var rule = qsel('#avalonS2RuleLabel');
        if (rule) rule.textContent = draft.s2RuleLabel || DEFAULTS.s2RuleLabel;

        var heading = qsel('#avalonS2Heading');
        if (heading) heading.textContent = draft.s2Heading || DEFAULTS.s2Heading;

        var subtitle = qsel('#avalonS2Subtitle');
        if (subtitle) subtitle.textContent = draft.s2Subtitle || DEFAULTS.s2Subtitle;

        [1, 2, 3, 4].forEach(function (n) {
            var srcKey = 's2Tile' + n + 'Src';
            var labelKey = 's2Tile' + n + 'Label';
            var urlKey = 's2Tile' + n + 'Url';
            var altKey = 's2Tile' + n + 'Alt';

            var img = qsel('#avalonS2Tile' + n + 'Img');
            if (img) {
                img.src = draft[srcKey] || DEFAULTS[srcKey];
                img.alt = draft[altKey] || DEFAULTS[altKey];
            }

            var link = qsel('#avalonS2Tile' + n + 'Link');
            if (link) link.setAttribute('href', draft[urlKey] || DEFAULTS[urlKey]);

            var label = qsel('#avalonS2Tile' + n + 'Label');
            if (label) label.textContent = draft[labelKey] || DEFAULTS[labelKey];
        });
    }

    function applySection3() {
        var rule = qsel('#avalonS3RuleLabel');
        if (rule) rule.textContent = draft.s3RuleLabel || DEFAULTS.s3RuleLabel;

        var eyebrow = qsel('#avalonS3Eyebrow');
        if (eyebrow) eyebrow.textContent = draft.s3Eyebrow || DEFAULTS.s3Eyebrow;

        var headline = qsel('#avalonS3Headline');
        if (headline) headline.textContent = draft.s3Headline || DEFAULTS.s3Headline;

        var body = qsel('#avalonS3Body');
        if (body) body.textContent = draft.s3Body || DEFAULTS.s3Body;

        var storyLink = qsel('#avalonS3StoryLink');
        if (storyLink) {
            storyLink.textContent = draft.s3StoryLinkLabel || DEFAULTS.s3StoryLinkLabel;
            storyLink.setAttribute('href', draft.s3StoryLinkUrl || DEFAULTS.s3StoryLinkUrl);
        }

        var testEyebrow = qsel('#avalonS3TestimonialEyebrow');
        if (testEyebrow) testEyebrow.textContent = draft.s3TestimonialEyebrow || DEFAULTS.s3TestimonialEyebrow;

        var quote = qsel('#avalonS3Quote');
        if (quote) quote.textContent = draft.s3Quote || DEFAULTS.s3Quote;

        var cite = qsel('#avalonS3Cite');
        if (cite) cite.textContent = draft.s3Cite || DEFAULTS.s3Cite;

        var cta = qsel('#avalonS3Cta');
        if (cta) {
            cta.textContent = draft.s3CtaLabel || DEFAULTS.s3CtaLabel;
            cta.setAttribute('href', draft.s3CtaUrl || DEFAULTS.s3CtaUrl);
        }
    }

    function applyReviewCard(n) {
        var quote = qsel('#avalonReview' + n + 'Quote');
        var author = qsel('#avalonReview' + n + 'Author');
        var date = qsel('#avalonReview' + n + 'Date');
        var quoteKey = 'review' + n + 'Quote';
        var authorKey = 'review' + n + 'Author';
        var dateKey = 'review' + n + 'Date';
        if (quote) quote.textContent = draft[quoteKey] || DEFAULTS[quoteKey];
        if (author) author.textContent = draft[authorKey] || DEFAULTS[authorKey];
        if (date) date.textContent = draft[dateKey] || DEFAULTS[dateKey];
    }

    function applyReviews() {
        var eyebrow = qsel('#avalonReviewsEyebrow');
        if (eyebrow) eyebrow.textContent = draft.reviewsEyebrow || DEFAULTS.reviewsEyebrow;

        var heading = qsel('#avalonReviewsHeading');
        if (heading) heading.textContent = draft.reviewsHeading || DEFAULTS.reviewsHeading;

        var rating = qsel('#avalonReviewsRating');
        if (rating) rating.textContent = draft.reviewsRating || DEFAULTS.reviewsRating;

        var count = qsel('#avalonReviewsCount');
        if (count) count.textContent = draft.reviewsCount || DEFAULTS.reviewsCount;

        var link = qsel('#avalonReviewsLink');
        if (link) {
            link.textContent = draft.reviewsLinkLabel || DEFAULTS.reviewsLinkLabel;
            link.setAttribute('href', draft.reviewsLinkUrl || DEFAULTS.reviewsLinkUrl);
        }

        applyReviewCard(1);
        applyReviewCard(2);
        applyReviewCard(3);
    }

    function applyExpert() {
        var eyebrow = qsel('#avalonExpertEyebrow');
        if (eyebrow) eyebrow.textContent = draft.expertEyebrow || DEFAULTS.expertEyebrow;

        var headline = qsel('#avalonExpertHeadline');
        if (headline) headline.textContent = draft.expertHeadline || DEFAULTS.expertHeadline;

        var copy = qsel('#avalonExpertCopy');
        if (copy) copy.textContent = draft.expertCopy || DEFAULTS.expertCopy;

        var cta = qsel('#avalonExpertCta');
        if (cta) {
            cta.textContent = draft.expertCtaLabel || DEFAULTS.expertCtaLabel;
            cta.setAttribute('href', draft.expertCtaUrl || DEFAULTS.expertCtaUrl);
        }

        [1, 2, 3].forEach(function (n) {
            var img = qsel('#avalonExpertImg' + n);
            var srcKey = 'expertImg' + n + 'Src';
            var altKey = 'expertImg' + n + 'Alt';
            if (img) {
                img.src = draft[srcKey] || DEFAULTS[srcKey];
                img.alt = draft[altKey] || DEFAULTS[altKey];
            }
        });
    }

    function applyFooterLink(col, n) {
        var labelKey = 'footerCol' + col + 'Link' + n + 'Label';
        var urlKey = 'footerCol' + col + 'Link' + n + 'Url';
        var el = qsel('#avalonFooterCol' + col + 'Link' + n);
        if (!el) return;
        el.textContent = draft[labelKey] || DEFAULTS[labelKey];
        el.setAttribute('href', draft[urlKey] || DEFAULTS[urlKey]);
    }

    function applyFooter() {
        var tagline = qsel('#avalonFooterTagline');
        if (tagline) tagline.textContent = draft.footerTagline || DEFAULTS.footerTagline;

        var col1Head = qsel('#avalonFooterCol1Head');
        if (col1Head) col1Head.textContent = draft.footerCol1Head || DEFAULTS.footerCol1Head;

        var col2Head = qsel('#avalonFooterCol2Head');
        if (col2Head) col2Head.textContent = draft.footerCol2Head || DEFAULTS.footerCol2Head;

        var i;
        for (i = 1; i <= 4; i++) {
            applyFooterLink(1, i);
            applyFooterLink(2, i);
        }

        var copyright = qsel('#avalonFooterCopyright');
        if (copyright) copyright.textContent = draft.footerCopyright || DEFAULTS.footerCopyright;
    }

    function applyAll() {
        if (!iframeDoc) return;
        applyLogo();
        applyLogoLink();
        applyTopBarCopy();
        applySearchPlaceholder();
        applyHero();
        applySection2();
        applySection3();
        applyReviews();
        applyExpert();
        applyFooter();
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
            thumbImg.src = '../designer_editor/avalon/' + displaySrc;
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

        var panel = $('avalonFieldPanel');
        if (!panel) return;
        panel.querySelectorAll('[data-avalon-field]').forEach(function (el) {
            var key = el.dataset.avalonField;
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
                applyAll();
                scheduleSave();
            };
            reader.readAsDataURL(file);
            fileInput.value = '';
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', function () {
                draft[slot.field] = DEFAULTS[slot.field];
                updateImageThumb(slot, draft[slot.field]);
                applyAll();
                scheduleSave();
            });
        }
    }

    function scrollPreviewTo(selector) {
        var el = qsel(selector);
        if (el && iframeDoc && iframeDoc.defaultView) {
            iframeDoc.defaultView.scrollTo({ top: el.offsetTop - 12, behavior: 'smooth' });
        }
    }

    function bindSectionTabs() {
        if (!sectionTabs) return;
        sectionTabs.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-avalon-section]');
            if (!btn) return;
            var section = btn.getAttribute('data-avalon-section');
            sectionTabs.querySelectorAll('.designer-section-tab').forEach(function (tab) {
                var active = tab === btn;
                tab.classList.toggle('is-active', active);
                tab.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            if (panelHeader) panelHeader.hidden = section !== 'header';
            if (panelSection1) panelSection1.hidden = section !== 'section1';
            if (panelSection2) panelSection2.hidden = section !== 'section2';
            if (panelSection3) panelSection3.hidden = section !== 'section3';
            if (panelFooter) panelFooter.hidden = section !== 'footer';
            if (section === 'section1') scrollPreviewTo('.avalon-hero');
            if (section === 'section2') scrollPreviewTo('#avalonSection2');
            if (section === 'section3') scrollPreviewTo('#avalonSection3');
            if (section === 'footer') scrollPreviewTo('#avalonSiteFooter');
        });
    }

    function bindPanel() {
        var panel = $('avalonFieldPanel');
        if (!panel) return;

        panel.addEventListener('input', function (e) {
            var t = e.target;
            if (!t || !t.dataset || !t.dataset.avalonField) return;
            var key = t.dataset.avalonField;
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
        frame = $('avalonFullSiteFrame');
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
        if ((window.__designerSlug || '') !== 'avalon') return;

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
        panelHeader = $('avalonPanelHeader');
        panelSection1 = $('avalonPanelSection1');
        panelSection2 = $('avalonPanelSection2');
        panelSection3 = $('avalonPanelSection3');
        panelFooter = $('avalonPanelFooter');
        sectionTabs = $('avalonSectionTabs');

        draft = Object.assign({}, DEFAULTS);
        window.__avalonDraft = draft;

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

    window.AvalonEditor = { init: init };
})();
