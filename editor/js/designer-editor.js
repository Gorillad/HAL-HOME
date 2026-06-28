/**
 * editor/js/designer-editor.js
 * Designer editor — The Woolf template
 *
 * Features:
 *  - Loads the template in an iframe (same-origin)
 *  - Applies field changes to the iframe DOM in real time
 *  - Autosaves draft to the server (per-account, debounced)
 *  - Exports a ZIP with customized HTML + all CSS/JS files
 */

(function () {
    'use strict';

    // ── Constants ────────────────────────────────────────────────────

    const TEMPLATE       = 'woolf';
    const PREVIEW_URL    = '../designer_editor/woolf/header-preview.html';
    const IFRAME_WIDTH   = 1280; // design width of the template
    const SAVE_DEBOUNCE  = 1800; // ms after last change to auto-save

    const FOOTER_LOGO_SIZE_MIN = 50;
    const FOOTER_LOGO_SIZE_MAX = 95; // recommended maximum display height
    const HEADER_LOGO_SIZE_MIN = 36;
    const HEADER_LOGO_SIZE_MAX = 80; // recommended maximum display height in main nav
    const HEADER_NAV_MIN_GAP = 20; // minimum space between All Products and search bar

    // ── Default draft values (Woolf template defaults) ────────────────

    const DEFAULTS = {
        companyName:   'IBC Master',
        logoUrl:       '/',
        logoSrc:       'data/images/ibc-logo-reverse.svg',
        logoSize:      56,
        faviconSrc:    '',
        footerLogoSrc:   '',
        footerLogoSize:  FOOTER_LOGO_SIZE_MAX,
        footerLogoUrl:   '/',
        footerTagline: 'Your source for industrial supplies, tooling, safety, and MRO products — shipped nationwide.',
        footerShopHeading:     'Shop',
        footerServiceHeading:  'Customer Service',
        footerContactHeading:  'Contact',
        footerShopVisible:     true,
        footerServiceVisible:  true,
        footerContactVisible:  true,
        footerShopL1Visible: true, footerShopL1Label: 'Catalog',              footerShopL1Url: '/catalog',
        footerShopL2Visible: true, footerShopL2Label: 'Industrial Supplies', footerShopL2Url: '/industrial-supplies',
        footerShopL3Visible: true, footerShopL3Label: 'Shop by Brand',       footerShopL3Url: '/brands',
        footerShopL4Visible: true, footerShopL4Label: 'Safety & PPE',        footerShopL4Url: '/industrial-supplies?category=Safety',
        footerShopL5Visible: true, footerShopL5Label: 'Cutting Tools',       footerShopL5Url: '/industrial-supplies?category=Cutting+Tools',
        footerShopL6Visible: true, footerShopL6Label: 'Clearance',           footerShopL6Url: '/clearance',
        footerServiceL1Visible: true, footerServiceL1Label: 'Contact Us',           footerServiceL1Url: '/contact',
        footerServiceL2Visible: true, footerServiceL2Label: 'My Account',           footerServiceL2Url: '/account',
        footerServiceL3Visible: true, footerServiceL3Label: 'Quick Order',          footerServiceL3Url: '/quick-order',
        footerServiceL4Visible: true, footerServiceL4Label: 'Shipping & Delivery',  footerServiceL4Url: '/shipping',
        footerServiceL5Visible: true, footerServiceL5Label: 'Returns & Exchanges',  footerServiceL5Url: '/returns',
        footerServiceL6Visible: true, footerServiceL6Label: 'FAQ',                    footerServiceL6Url: '/faq',
        footerCopy: '',
        footerLegalL1Visible: true, footerLegalL1Label: 'Privacy Policy', footerLegalL1Url: '/privacy',
        footerLegalL2Visible: true, footerLegalL2Label: 'Terms of Use',   footerLegalL2Url: '/terms',
        footerLegalL3Visible: true, footerLegalL3Label: 'Accessibility',  footerLegalL3Url: '/accessibility',
        footerContactPhoneVisible:   true,
        footerContactEmailVisible:   true,
        footerContactHoursVisible:   true,
        footerContactAddressVisible: true,
        footerSocialFbVisible: true,
        footerSocialLiVisible: true,
        footerSocialYtVisible: true,
        footerSocialXVisible:  true,
        colorBlue:        '#004fa3',
        colorNavy:        '#0d2137',
        colorNavyDark:    '#081525',
        colorTopbarText:  '#ffffff',
        colorSubnavText:  '#0d2137',
        colorMegaHead:    '#0d2137',
        colorMegaLink:    '#4a5568',
        catalogUrl:    '/catalog',
        aboutUrl:      '/about-us',
        contactUrl:    '/contact-us',
        phone:         '1-800-555-1234',
        phoneHref:     'tel:18005551234',
        authUrl:       '/login.php',
        cartUrl:       '/cart',
        // About
        aboutEyebrow:  'About Us',
        aboutTitle:    'Supplying industry with the parts and products that keep operations running',
        aboutText1:    'IBC Master is a full-line industrial distributor serving manufacturing, construction, maintenance, and MRO teams across North America. From cutting tools and safety equipment to hydraulics and electrical supplies, we help customers find the right product — fast.',
        aboutText2:    'Our team combines deep product knowledge with responsive service, whether you are stocking a plant floor, outfitting a job site, or sourcing a hard-to-find part number. We partner with leading manufacturers so you get the brands you trust, backed by people who understand your business.',
        aboutBtn1Label: 'Learn More About IBC',
        aboutBtn1Url:  '/about',
        aboutBtn2Label: 'Contact Our Team',
        aboutBtn2Url:  '/contact',
        aboutImageSrc: 'data/images/about/spacexs-new-profile-picture-showing-the-interstage-and-v0-8JBeO-PFL5IKys9c4o0dlwu_071nBq7gq2HX0fMN-mI.webp',
        aboutImageAlt: 'IBC Master warehouse and distribution center',
        stat1Value:    '25+',
        stat1Label:    'Years in business',
        stat2Value:    '500K+',
        stat2Label:    'Products in catalog',
        stat3Value:    'Nationwide',
        stat3Label:    'Shipping & support',
        // CTA section
        ctaVisible:    true,
        ctaEyebrow:    'Talk to our team',
        ctaTitle:      'Need help sourcing the right product?',
        ctaText:       'Our team is ready to assist with quotes, bulk orders, and hard-to-find parts for your operation.',
        ctaBtn1Label:  'Request a Quote',
        ctaBtn1Url:    '/contact',
        ctaBtn2Label:  'Open an Account',
        ctaBtn2Url:    '/sign-up',
        ctaShowPhone:  true,
        ctaBgColor:    '#004fa3',
        // Catalog Library (section three)
        catalogTitle:    'Vendor Catalog Library',
        catalogSubtitle: 'Browse and download digital catalogs from the manufacturers we represent',
        catalogAllLabel: 'View all catalogs',
        catalogAllUrl:   '/catalogs',
        // Quick Order (section four)
        qoVisible:   true,
        qoTitle:    'Quick Order',
        qoSubtitle: 'Know your part number? Enter it below to search and order fast.',
        qoSubmit:   'Search & Order',
        // Sub-nav quick links
        subNavL1Visible: true, subNavL1Label: 'Industrial Supplies', subNavL1Url: '#',
        subNavL2Visible: true, subNavL2Label: 'Safety & PPE',        subNavL2Url: '#',
        subNavL3Visible: true, subNavL3Label: 'Tools & Equipment',   subNavL3Url: '#',
        subNavL4Visible: true, subNavL4Label: 'Electrical',          subNavL4Url: '#',
        subNavL5Visible: true, subNavL5Label: 'Hydraulics',          subNavL5Url: '#',
        subNavL6Visible: true, subNavL6Label: 'Fasteners',           subNavL6Url: '#',
        subNavL7Visible: true, subNavL7Label: 'Clearance',           subNavL7Url: '#',
        // Mega menu columns  (URLs left blank — client will fill in)
        megaC1Visible: true,  megaC1Head: 'Cutting & Machining',
        megaC1L1Visible: true, megaC1L1Label: 'Cutting Tools',          megaC1L1Url: '#',
        megaC1L2Visible: true, megaC1L2Label: 'Milling',                megaC1L2Url: '#',
        megaC1L3Visible: true, megaC1L3Label: 'Turning',                megaC1L3Url: '#',
        megaC1L4Visible: true, megaC1L4Label: 'Threading',              megaC1L4Url: '#',
        megaC1L5Visible: true, megaC1L5Label: 'Holemaking',             megaC1L5Url: '#',
        megaC2Visible: true,  megaC2Head: 'Tooling & Workholding',
        megaC2L1Visible: true, megaC2L1Label: 'Tooling Systems',        megaC2L1Url: '#',
        megaC2L2Visible: true, megaC2L2Label: 'Tooling Components',     megaC2L2Url: '#',
        megaC2L3Visible: true, megaC2L3Label: 'Machine Tool Accessories', megaC2L3Url: '#',
        megaC2L4Visible: true, megaC2L4Label: 'Workholding',            megaC2L4Url: '#',
        megaC3Visible: true,  megaC3Head: 'Hand & Power Tools',
        megaC3L1Visible: true, megaC3L1Label: 'Hand Tools',             megaC3L1Url: '#',
        megaC3L2Visible: true, megaC3L2Label: 'Power Tools',            megaC3L2Url: '#',
        megaC3L3Visible: true, megaC3L3Label: 'Abrasives',              megaC3L3Url: '#',
        megaC3L4Visible: true, megaC3L4Label: 'Hardware',               megaC3L4Url: '#',
        megaC4Visible: true,  megaC4Head: 'Safety & Facility',
        megaC4L1Visible: true, megaC4L1Label: 'Safety & PPE',           megaC4L1Url: '#',
        megaC4L2Visible: true, megaC4L2Label: 'Cleaning & Janitorial',  megaC4L2Url: '#',
        megaC4L3Visible: true, megaC4L3Label: 'Office Supplies',        megaC4L3Url: '#',
        megaC4L4Visible: true, megaC4L4Label: 'Outdoor Equipment',      megaC4L4Url: '#',
        megaC5Visible: true,  megaC5Head: 'Mechanical & Fluid',
        megaC5L1Visible: true, megaC5L1Label: 'Hydraulics',             megaC5L1Url: '#',
        megaC5L2Visible: true, megaC5L2Label: 'Pneumatics',             megaC5L2Url: '#',
        megaC5L3Visible: true, megaC5L3Label: 'Pumps',                  megaC5L3Url: '#',
        megaC5L4Visible: true, megaC5L4Label: 'Power Transmission',     megaC5L4Url: '#',
        megaC6Visible: true,  megaC6Head: 'Electrical & Other',
        megaC6L1Visible: true, megaC6L1Label: 'Electrical Supplies',    megaC6L1Url: '#',
        megaC6L2Visible: true, megaC6L2Label: 'Electronics',            megaC6L2Url: '#',
        megaC6L3Visible: true, megaC6L3Label: 'Welding',                megaC6L3Url: '#',
        megaC6L4Visible: true, megaC6L4Label: 'Material Handling',      megaC6L4Url: '#',
        // Footer
        footerEmail:   'sales@ibcmaster.com',
        footerAddress: '1200 Industrial Parkway\nHouston, TX 77001',
        footerHours:   'Mon–Fri, 7:00 AM – 6:00 PM CT',
        footerSocialLabel: 'Follow IBC Master',
        footerSocialFb: 'https://www.facebook.com/',
        footerSocialLi: 'https://www.linkedin.com/',
        footerSocialYt: 'https://www.youtube.com/',
        footerSocialX:  'https://x.com/',
    };

    // ── State ────────────────────────────────────────────────────────

    var draft     = {};
    var iframeDoc = null;
    var saveTimer = null;
    var isDirty   = false;
    var exportInProgress = false;

    var EXPORT_BTN_LABEL = 'Export handoff';
    var EXPORT_BTN_SUCCESS_LABEL = 'Evolved 🕺';

    // ── DOM references ────────────────────────────────────────────────

    var previewFrame       = document.getElementById('woolFullSiteFrame');
    var previewWrap        = document.getElementById('woolFullSitePreviewWrap');
    var previewScaler      = document.getElementById('previewScaler');
    var editorStatus       = document.getElementById('editorStatus');
    var exportBtn          = document.getElementById('exportHandoffBtn');
    var resetBtn           = document.getElementById('resetDraftBtn');
    var saveToast          = document.getElementById('saveToast');
    var woolFieldPanel     = document.getElementById('woolFieldPanel');
    var designerScaffold   = document.getElementById('designerScaffold');
    var scaffoldPreview    = document.getElementById('designerScaffoldPreview');
    var previewLabel       = document.getElementById('designerPreviewLabel');
    var scaleHint          = document.getElementById('previewScaleHint');
    var templateNameEl     = document.getElementById('editorTemplateName');
    var logoFileInput      = document.getElementById('df-logo-file');
    var logoThumbImg       = document.getElementById('logoThumbImg');
    var logoThumbEmpty     = document.getElementById('logoThumbEmpty');
    var logoRemoveBtn      = document.getElementById('logoRemoveBtn');
    var logoUrlInput       = document.getElementById('df-logo-src');
    var faviconFileInput   = document.getElementById('df-favicon-file');
    var faviconThumbImg    = document.getElementById('faviconThumbImg');
    var faviconThumbEmpty  = document.getElementById('faviconThumbEmpty');
    var faviconRemoveBtn   = document.getElementById('faviconRemoveBtn');
    var footerLogoFileInput = document.getElementById('df-footer-logo-file');
    var footerLogoThumbImg  = document.getElementById('footerLogoThumbImg');
    var footerLogoThumbEmpty = document.getElementById('footerLogoThumbEmpty');
    var footerLogoRemoveBtn = document.getElementById('footerLogoRemoveBtn');
    var footerLogoSizeVal   = document.getElementById('footerLogoSizeVal');
    var headerLogoSizeVal   = document.getElementById('headerLogoSizeVal');
    var aboutImageFileInput = document.getElementById('df-about-image-file');
    var aboutImageThumbImg  = document.getElementById('aboutImageThumbImg');
    var aboutImageThumbEmpty = document.getElementById('aboutImageThumbEmpty');
    var aboutImageRemoveBtn = document.getElementById('aboutImageRemoveBtn');

    // ── Utility helpers ───────────────────────────────────────────────

    function setText(el, txt) {
        if (el) el.textContent = txt;
    }

    function setAttr(el, attr, val) {
        if (el) el.setAttribute(attr, val);
    }

    function isel(sel) {
        return iframeDoc ? iframeDoc.querySelector(sel) : null;
    }

    function iselAll(sel) {
        return iframeDoc ? Array.from(iframeDoc.querySelectorAll(sel)) : [];
    }

    // ── Mega menu helpers ─────────────────────────────────────────────

    function getMegaColEl(n) {
        return iselAll('.mega-col')[n - 1] || null;
    }
    function getMegaLinkEl(n, m) {
        var col = getMegaColEl(n);
        return col ? col.querySelectorAll('a')[m - 1] || null : null;
    }
    function setVisible(el, show) {
        if (!el) return;
        el.style.display = show ? '' : 'none';
    }

    function getSubNavBarLinkEl(n) {
        return iselAll('.sub-nav__links a')[n - 1] || null;
    }

    function getMegaSubNavLinkEl(n) {
        return iselAll('.mega-menu__subnav-links a')[n - 1] || null;
    }

    function setSubNavLinkState(n, opts) {
        var barLink = getSubNavBarLinkEl(n);
        var megaLink = getMegaSubNavLinkEl(n);
        var barLi = barLink ? barLink.closest('li') : null;
        var megaLi = megaLink ? megaLink.closest('li') : null;

        if (opts.visible !== undefined) {
            var show = opts.visible === true || opts.visible === 'true' || opts.visible === undefined;
            setVisible(barLi || barLink, show);
            setVisible(megaLi || megaLink, show);
        }
        if (opts.label !== undefined && opts.label !== null) {
            setText(barLink, opts.label);
            setText(megaLink, opts.label);
        }
        if (opts.url !== undefined && opts.url !== null) {
            setAttr(barLink, 'href', opts.url);
            setAttr(megaLink, 'href', opts.url);
        }
    }

    // Find a .site-footer__contact-item whose label span matches a keyword
    function getContactItem(keyword) {
        var items = iselAll('.site-footer__contact-item');
        return items.find(function (item) {
            var lbl = item.querySelector('.site-footer__contact-label');
            return lbl && lbl.textContent.toLowerCase().includes(keyword.toLowerCase());
        }) || null;
    }

    // Replace only the text nodes in a footer contact item (preserving label span)
    function setContactText(item, val) {
        if (!item) return;
        Array.from(item.childNodes).forEach(function (node) {
            if (node.nodeType === 3) node.textContent = '\n' + val + '\n'; // TEXT_NODE
        });
    }

    // Replace the address content (allows <br>) in a footer contact item
    function setContactAddress(item, val) {
        if (!item) return;
        var labelSpan = item.querySelector('.site-footer__contact-label');
        item.innerHTML = '';
        if (labelSpan) item.appendChild(labelSpan);
        var t = iframeDoc.createTextNode('\n');
        item.appendChild(t);
        var span = iframeDoc.createElement('span');
        span.innerHTML = val.replace(/\n/g, '<br>');
        item.appendChild(span);
    }

    function getFooterLogoSrc() {
        var footerSrc = draft.footerLogoSrc;
        if (footerSrc) return footerSrc;
        return draft.logoSrc !== undefined ? draft.logoSrc : DEFAULTS.logoSrc;
    }

    function clampFooterLogoSize(size) {
        var n = parseInt(size, 10);
        if (isNaN(n)) n = FOOTER_LOGO_SIZE_MAX;
        return Math.min(FOOTER_LOGO_SIZE_MAX, Math.max(FOOTER_LOGO_SIZE_MIN, n));
    }

    function clampHeaderLogoSize(size) {
        var n = parseInt(size, 10);
        if (isNaN(n)) n = DEFAULTS.logoSize;
        return Math.min(HEADER_LOGO_SIZE_MAX, Math.max(HEADER_LOGO_SIZE_MIN, n));
    }

    function forceIframeLayout() {
        if (!iframeDoc || !iframeDoc.body) return;
        void iframeDoc.body.offsetHeight;
    }

    function isHeaderNavDesktopLayout() {
        if (!iframeDoc) return false;
        var allProd = isel('.all-prod-btn');
        if (!allProd) return false;
        var win = iframeDoc.defaultView;
        if (!win) return false;
        return allProd.offsetWidth > 0 && win.getComputedStyle(allProd).display !== 'none';
    }

    function headerNavHasInsufficientGap() {
        if (!iframeDoc || !isHeaderNavDesktopLayout()) return false;
        var allProd = isel('.all-prod-btn');
        var center = isel('.main-nav__center');
        if (!allProd || !center) return false;
        var btnRect = allProd.getBoundingClientRect();
        var centerRect = center.getBoundingClientRect();
        return btnRect.right + HEADER_NAV_MIN_GAP > centerRect.left;
    }

    function setHeaderLogoHeightInDom(size) {
        if (!iframeDoc) return;
        var height = clampHeaderLogoSize(size);
        var img = isel('.main-nav__logo img');
        if (img) {
            img.style.height = height + 'px';
            img.style.width = 'auto';
        }
        var styleId = '__designer-header-logo-size__';
        var styleEl = iframeDoc.getElementById(styleId);
        if (!styleEl) {
            styleEl = iframeDoc.createElement('style');
            styleEl.id = styleId;
            iframeDoc.head.appendChild(styleEl);
        }
        styleEl.textContent = [
            '.main-nav__logo { overflow: hidden; flex-shrink: 0; }',
            '.main-nav__logo img {',
            '  height: ' + height + 'px !important;',
            '  width: auto !important;',
            '  object-fit: contain;',
            '}',
        ].join('\n');
    }

    function syncHeaderLogoSizeControls(size, rejected) {
        var fitted = clampHeaderLogoSize(size);
        var sizeInput = document.getElementById('df-header-logo-size');
        if (sizeInput && sizeInput.value !== String(fitted)) {
            sizeInput.value = fitted;
        }
        if (headerLogoSizeVal) {
            var label = fitted + 'px';
            if (rejected) label += ' — needs more space';
            else if (fitted === HEADER_LOGO_SIZE_MAX) label += ' (max)';
            headerLogoSizeVal.textContent = label;
        }
    }

    function attemptHeaderLogoSize(requestedSize, previousSize) {
        if (!iframeDoc) {
            return { accepted: true, size: clampHeaderLogoSize(previousSize) };
        }
        var target = clampHeaderLogoSize(requestedSize);
        var previous = clampHeaderLogoSize(previousSize);
        if (!isHeaderNavDesktopLayout()) {
            setHeaderLogoHeightInDom(target);
            return { accepted: true, size: target };
        }
        setHeaderLogoHeightInDom(target);
        forceIframeLayout();
        if (!headerNavHasInsufficientGap()) {
            return { accepted: true, size: target };
        }
        setHeaderLogoHeightInDom(previous);
        forceIframeLayout();
        return { accepted: false, size: previous };
    }

    function fitHeaderLogoSizeToNav(requestedSize) {
        if (!iframeDoc) return clampHeaderLogoSize(requestedSize);
        var target = clampHeaderLogoSize(requestedSize);
        if (!isHeaderNavDesktopLayout()) {
            setHeaderLogoHeightInDom(target);
            return target;
        }
        setHeaderLogoHeightInDom(target);
        forceIframeLayout();
        if (!headerNavHasInsufficientGap()) return target;
        for (var size = target - 1; size >= HEADER_LOGO_SIZE_MIN; size--) {
            setHeaderLogoHeightInDom(size);
            forceIframeLayout();
            if (!headerNavHasInsufficientGap()) return size;
        }
        setHeaderLogoHeightInDom(HEADER_LOGO_SIZE_MIN);
        return HEADER_LOGO_SIZE_MIN;
    }

    function applyHeaderLogoSize() {
        if (!iframeDoc) return HEADER_LOGO_SIZE_MIN;
        var requested = clampHeaderLogoSize(
            draft.logoSize !== undefined ? draft.logoSize : DEFAULTS.logoSize
        );
        var fitted = fitHeaderLogoSizeToNav(requested);
        if (draft.logoSize !== fitted) draft.logoSize = fitted;
        setHeaderLogoHeightInDom(fitted);
        syncHeaderLogoSizeControls(fitted, false);
        return fitted;
    }

    function applyHeaderLogo() {
        if (!iframeDoc) return;
        var src = draft.logoSrc !== undefined ? draft.logoSrc : DEFAULTS.logoSrc;
        var name = draft.companyName !== undefined ? draft.companyName : DEFAULTS.companyName;
        var img = isel('.main-nav__logo img');
        if (img) {
            img.setAttribute('src', src);
            img.setAttribute('alt', name + ' Industrial Supplies');
            if (img.complete) {
                applyHeaderLogoSize();
            } else {
                img.onload = function () {
                    img.onload = null;
                    applyHeaderLogoSize();
                };
            }
        } else {
            applyHeaderLogoSize();
        }
        if (!draft.footerLogoSrc) applyFooterLogo();
    }

    function applyFooterLogoSize() {
        if (!iframeDoc) return;
        var size = clampFooterLogoSize(
            draft.footerLogoSize !== undefined ? draft.footerLogoSize : DEFAULTS.footerLogoSize
        );
        var img = isel('.site-footer__logo img');
        if (img) {
            img.style.height = size + 'px';
            img.style.width = 'auto';
        }
        var styleId = '__designer-footer-logo-size__';
        var styleEl = iframeDoc.getElementById(styleId);
        if (!styleEl) {
            styleEl = iframeDoc.createElement('style');
            styleEl.id = styleId;
            iframeDoc.head.appendChild(styleEl);
        }
        styleEl.textContent = '.site-footer__logo img { height: ' + size + 'px !important; width: auto; }';
    }

    function applyFooterLogo() {
        if (!iframeDoc) return;
        var src = getFooterLogoSrc();
        var img = isel('.site-footer__logo img');
        var name = draft.companyName !== undefined ? draft.companyName : DEFAULTS.companyName;
        if (img) {
            img.setAttribute('src', src);
            img.setAttribute('alt', name + ' Industrial Supplies');
        }
        applyFooterLogoSize();
    }

    function updateFooterCopy() {
        var copyEl = isel('.site-footer__copy');
        if (!copyEl) return;
        if (draft.footerCopy) {
            copyEl.textContent = draft.footerCopy;
            return;
        }
        var name = draft.companyName !== undefined ? draft.companyName : DEFAULTS.companyName;
        copyEl.textContent = '© ' + new Date().getFullYear() + ' ' + name + '. All rights reserved.';
    }

    function setFooterNavLink(section, linkNum, label, url) {
        var li = getFooterNavLinkLi(section, linkNum);
        if (!li) return;
        var link = li.querySelector('a');
        if (!link) return;
        if (label !== null && label !== undefined) link.textContent = label;
        if (url !== null && url !== undefined) link.setAttribute('href', url);
    }

    function getFooterShopCol() {
        return isel('[aria-labelledby="footer-shop-heading"]');
    }
    function getFooterServiceCol() {
        return isel('[aria-labelledby="footer-service-heading"]');
    }
    function getFooterContactCol() {
        return isel('[aria-labelledby="footer-contact-heading"]');
    }
    function getFooterNavLinkLi(section, linkNum) {
        var col = section === 'shop' ? getFooterShopCol() : getFooterServiceCol();
        if (!col) return null;
        return col.querySelectorAll('.site-footer__links li')[linkNum - 1] || null;
    }
    function getFooterLegalLi(linkNum) {
        return iselAll('.site-footer__legal li')[linkNum - 1] || null;
    }
    function setFooterLegalLink(linkNum, label, url) {
        var li = getFooterLegalLi(linkNum);
        if (!li) return;
        var link = li.querySelector('a');
        if (!link) return;
        if (label !== null && label !== undefined) link.textContent = label;
        if (url !== null && url !== undefined) link.setAttribute('href', url);
    }

    // ── Design slug routing ───────────────────────────────────────────

    var slug = window.__designerSlug || 'woolf';

    function initRouting() {
        // Mark active nav link
        document.querySelectorAll('[data-designer-design]').forEach(function (link) {
            link.classList.toggle(
                'editor-section-nav-link--active',
                link.dataset.designerDesign === slug
            );
        });

        // Template name badge
        var names = { woolf: 'The Woolf', gallery: 'Gallery', curator: 'Curator', canvas: 'Canvas' };
        var name = names[slug] || slug;
        if (templateNameEl) templateNameEl.textContent = name;
        if (previewLabel) previewLabel.textContent = name;

        if (slug === 'woolf') {
            if (woolFieldPanel) woolFieldPanel.hidden = false;
            if (designerScaffold) designerScaffold.hidden = true;
            if (previewWrap) previewWrap.hidden = false;
            if (scaffoldPreview) scaffoldPreview.hidden = true;
        } else {
            if (woolFieldPanel) woolFieldPanel.hidden = true;
            if (designerScaffold) designerScaffold.hidden = false;
            if (previewWrap) previewWrap.hidden = true;
            if (scaffoldPreview) scaffoldPreview.hidden = false;
            var scaffoldTitle = document.getElementById('scaffoldTemplateName');
            if (scaffoldTitle) scaffoldTitle.textContent = name + ' — coming soon';
            // Disable export for non-Woolf designs
            if (exportBtn) exportBtn.disabled = true;
        }
    }

    function scaleIframe() {
        // No scaling — iframe fills the panel at 100% width
        if (scaleHint) scaleHint.textContent = '100%';
    }

    // ── Apply a single field value to the iframe DOM ──────────────────

    function applyColors() {
        if (!iframeDoc) return;
        var el = iframeDoc.getElementById('__designer-overrides__');
        if (!el) {
            el = iframeDoc.createElement('style');
            el.id = '__designer-overrides__';
            iframeDoc.head.appendChild(el);
        }
        function cv(key) { return draft[key] !== undefined ? draft[key] : DEFAULTS[key]; }
        el.textContent = [
            ':root {',
            '  --ibc-blue: '            + cv('colorBlue')       + ';',
            '  --ibc-blue-hover: '      + cv('colorBlue')       + ';',
            '  --ibc-navy: '            + cv('colorNavy')       + ';',
            '  --ibc-navy-dark: '       + cv('colorNavyDark')   + ';',
            '  --ibc-topbar-text: '     + cv('colorTopbarText') + ';',
            '  --ibc-subnav-text: '     + cv('colorSubnavText') + ';',
            '  --ibc-mega-head-color: ' + cv('colorMegaHead')   + ';',
            '  --ibc-mega-link-color: ' + cv('colorMegaLink')   + ';',
            '}',
            /* Apply the new vars to actual selectors */
            '.top-bar__links a, .top-bar__phone, .top-bar__auth { color: var(--ibc-topbar-text) !important; }',
            '.sub-nav__links { justify-content: center !important; }',
            '.sub-nav__links a, .mega-menu__subnav-links a { color: var(--ibc-subnav-text) !important; }',
            '.mega-menu__subnav-links { justify-content: center !important; }',
            '.mega-col__head { color: var(--ibc-mega-head-color) !important; }',
            '.mega-col a { color: var(--ibc-mega-link-color) !important; }',
        ].join('\n');
    }

    function applyField(key, val) {
        if (!iframeDoc || val === undefined) return;

        // Color fields — batch update :root vars
        if (key === 'colorBlue' || key === 'colorNavy' || key === 'colorNavyDark' ||
            key === 'colorTopbarText' || key === 'colorSubnavText' ||
            key === 'colorMegaHead' || key === 'colorMegaLink') {
            applyColors();
            return;
        }

        switch (key) {
            // Branding
            case 'companyName':
                setText(iframeDoc.querySelector('title'), val + ' — Industrial Supplies, MRO & Safety Products');
                updateFooterCopy();
                applyHeaderLogo();
                break;
            case 'logoUrl':
                iselAll('.main-nav__logo').forEach(function (el) {
                    setAttr(el, 'href', val);
                });
                break;
            case 'logoSrc':
                applyHeaderLogo();
                if (!draft.footerLogoSrc) applyFooterLogo();
                break;
            case 'logoSize':
                applyHeaderLogoSize();
                break;
            case 'footerLogoSrc':
                applyFooterLogo();
                break;
            case 'footerLogoSize':
                applyFooterLogoSize();
                break;
            case 'footerLogoUrl':
                setAttr(isel('.site-footer__logo'), 'href', val);
                break;
            case 'footerTagline':
                setText(isel('.site-footer__tagline'), val);
                break;

            // Header nav URLs
            case 'catalogUrl':
                iselAll('.top-bar__links a[href*="catalog"], .sub-nav__links a[href*="catalog"]').forEach(function (el) {
                    setAttr(el, 'href', val);
                });
                break;
            case 'aboutUrl':
                iselAll('.top-bar__links a[href*="about"]').forEach(function (el) {
                    setAttr(el, 'href', val);
                });
                break;
            case 'contactUrl':
                iselAll('.top-bar__links a[href*="contact"]').forEach(function (el) {
                    setAttr(el, 'href', val);
                });
                break;

            // Header + footer phone (tel: href auto-generated from the number)
            case 'phone': {
                var telHref = 'tel:' + val.replace(/\D/g, '');
                draft.phoneHref = telHref;
                iselAll('.top-bar__phone').forEach(function (el) {
                    setText(el, val);
                    setAttr(el, 'href', telHref);
                });
                iselAll('[href^="tel:"]').forEach(function (el) {
                    el.textContent = val;
                    setAttr(el, 'href', telHref);
                });
                break;
            }
            case 'authUrl':
                iselAll('.top-bar__auth').forEach(function (el) {
                    setAttr(el, 'href', val);
                });
                break;
            case 'cartUrl':
                iselAll('.nav-cart').forEach(function (el) {
                    setAttr(el, 'href', val);
                });
                break;

            // About
            case 'aboutEyebrow':
                setText(isel('.about-block__eyebrow'), val); break;
            case 'aboutTitle':
                setText(isel('.about-block__title'), val); break;
            case 'aboutText1': {
                var texts1 = iselAll('.about-block__text');
                if (texts1[0]) texts1[0].textContent = val;
                break;
            }
            case 'aboutText2': {
                var texts2 = iselAll('.about-block__text');
                if (texts2[1]) texts2[1].textContent = val;
                break;
            }
            case 'aboutBtn1Label':
                setText(isel('.about-block__btn--primary'), val); break;
            case 'aboutBtn1Url':
                setAttr(isel('.about-block__btn--primary'), 'href', val); break;
            case 'aboutBtn2Label':
                setText(isel('.about-block__btn--secondary'), val); break;
            case 'aboutBtn2Url':
                setAttr(isel('.about-block__btn--secondary'), 'href', val); break;

            case 'aboutImageSrc':
                iselAll('.about-block__image').forEach(function (img) {
                    img.setAttribute('src', val);
                });
                break;
            case 'aboutImageAlt':
                iselAll('.about-block__image').forEach(function (img) {
                    img.setAttribute('alt', val);
                });
                break;

            // Stats
            case 'stat1Value': setText(isel('.about-block__stat:nth-child(1) .about-block__stat-value'), val); break;
            case 'stat1Label': setText(isel('.about-block__stat:nth-child(1) .about-block__stat-label'), val); break;
            case 'stat2Value': setText(isel('.about-block__stat:nth-child(2) .about-block__stat-value'), val); break;
            case 'stat2Label': setText(isel('.about-block__stat:nth-child(2) .about-block__stat-label'), val); break;
            case 'stat3Value': setText(isel('.about-block__stat:nth-child(3) .about-block__stat-value'), val); break;
            case 'stat3Label': setText(isel('.about-block__stat:nth-child(3) .about-block__stat-label'), val); break;

            // CTA
            case 'ctaVisible':
                setVisible(isel('.cta-band'), val === true || val === 'true' || val === undefined);
                if (typeof window.__fitFullSite === 'function') {
                    setTimeout(window.__fitFullSite, 60);
                }
                break;
            case 'ctaEyebrow': {
                var ctaEyebrow = isel('.cta-band__eyebrow');
                if (ctaEyebrow) {
                    setText(ctaEyebrow, val);
                    setVisible(ctaEyebrow, val && String(val).trim());
                }
                break;
            }
            case 'ctaTitle':
                setText(isel('.cta-band__title'), val); break;
            case 'ctaText':
                setText(isel('.cta-band__text'), val); break;
            case 'ctaBtn1Label':
                setText(isel('.cta-band__btn--primary'), val); break;
            case 'ctaBtn1Url':
                setAttr(isel('.cta-band__btn--primary'), 'href', val); break;
            case 'ctaBtn2Label':
                setText(isel('.cta-band__btn--secondary'), val); break;
            case 'ctaBtn2Url':
                setAttr(isel('.cta-band__btn--secondary'), 'href', val); break;
            case 'ctaShowPhone':
                setVisible(isel('.cta-band__btn--phone'), val === true || val === 'true' || val === undefined);
                break;
            case 'ctaBgColor': {
                var ctaBand = isel('.cta-band');
                if (ctaBand && val) {
                    ctaBand.style.backgroundColor = val;
                }
                break;
            }

            case 'footerSocialLabel':
                setText(isel('.site-footer__social-label'), val); break;

            case 'footerShopHeading':
                setText(isel('#footer-shop-heading'), val); break;
            case 'footerServiceHeading':
                setText(isel('#footer-service-heading'), val); break;
            case 'footerContactHeading':
                setText(isel('#footer-contact-heading'), val); break;
            case 'footerShopVisible':
                setVisible(getFooterShopCol(), val === true || val === 'true' || val === undefined);
                break;
            case 'footerServiceVisible':
                setVisible(getFooterServiceCol(), val === true || val === 'true' || val === undefined);
                break;
            case 'footerContactVisible':
                setVisible(getFooterContactCol(), val === true || val === 'true' || val === undefined);
                break;
            case 'footerContactPhoneVisible':
                setVisible(getContactItem('phone'), val === true || val === 'true' || val === undefined);
                break;
            case 'footerContactEmailVisible':
                setVisible(getContactItem('email'), val === true || val === 'true' || val === undefined);
                break;
            case 'footerContactHoursVisible':
                setVisible(getContactItem('hours'), val === true || val === 'true' || val === undefined);
                break;
            case 'footerContactAddressVisible':
                setVisible(getContactItem('address'), val === true || val === 'true' || val === undefined);
                break;
            case 'footerCopy':
                updateFooterCopy(); break;

            // Catalog Library (section three)
            case 'catalogTitle':
                setText(isel('.catalog-library__title'), val); break;
            case 'catalogSubtitle':
                setText(isel('.catalog-library__subtitle'), val); break;
            case 'catalogAllLabel':
                setText(isel('.catalog-library__all'), val); break;
            case 'catalogAllUrl':
                setAttr(isel('.catalog-library__all'), 'href', val); break;

            // Quick Order (section four)
            case 'qoVisible':
                setVisible(isel('.quick-order'), val === true || val === 'true' || val === undefined);
                if (typeof window.__fitFullSite === 'function') {
                    setTimeout(window.__fitFullSite, 60);
                }
                break;
            case 'qoTitle':
                setText(isel('.quick-order__title'), val); break;
            case 'qoSubtitle':
                setText(isel('.quick-order__subtitle'), val); break;
            case 'qoSubmit':
                setText(isel('.quick-order__submit'), val); break;

            // Footer contact
            case 'footerEmail': {
                var emailItem = getContactItem('email');
                var emailLink = emailItem ? emailItem.querySelector('a') : null;
                if (emailLink) { emailLink.href = 'mailto:' + val; emailLink.textContent = val; }
                break;
            }
            case 'footerAddress':
                setContactAddress(getContactItem('address'), val); break;
            case 'footerHours':
                setContactText(getContactItem('hours'), val); break;
            case 'footerSocialFb':
                setAttr(isel('.site-footer__social-link[aria-label="Facebook"]'), 'href', val); break;
            case 'footerSocialLi':
                setAttr(isel('.site-footer__social-link[aria-label="LinkedIn"]'), 'href', val); break;
            case 'footerSocialYt':
                setAttr(isel('.site-footer__social-link[aria-label="YouTube"]'), 'href', val); break;
            case 'footerSocialX':
                setAttr(isel('.site-footer__social-link[aria-label="X"]'), 'href', val); break;
            case 'footerSocialFbVisible':
                setVisible(isel('.site-footer__social-link[aria-label="Facebook"]'), val === true || val === 'true' || val === undefined);
                break;
            case 'footerSocialLiVisible':
                setVisible(isel('.site-footer__social-link[aria-label="LinkedIn"]'), val === true || val === 'true' || val === undefined);
                break;
            case 'footerSocialYtVisible':
                setVisible(isel('.site-footer__social-link[aria-label="YouTube"]'), val === true || val === 'true' || val === undefined);
                break;
            case 'footerSocialXVisible':
                setVisible(isel('.site-footer__social-link[aria-label="X"]'), val === true || val === 'true' || val === undefined);
                break;

            default: {
                var mc, ml, sn, fl;

                // ── Footer nav: footerShopL1Label / footerShopL1Url / footerServiceL1* / footerLegalL1*
                if ((fl = key.match(/^footerShopL(\d+)Visible$/))) {
                    setVisible(getFooterNavLinkLi('shop', +fl[1]), val === true || val === 'true' || val === undefined);
                } else if ((fl = key.match(/^footerShopL(\d+)Label$/))) {
                    setFooterNavLink('shop', +fl[1], val, null);
                } else if ((fl = key.match(/^footerShopL(\d+)Url$/))) {
                    setFooterNavLink('shop', +fl[1], null, val);
                } else if ((fl = key.match(/^footerServiceL(\d+)Visible$/))) {
                    setVisible(getFooterNavLinkLi('service', +fl[1]), val === true || val === 'true' || val === undefined);
                } else if ((fl = key.match(/^footerServiceL(\d+)Label$/))) {
                    setFooterNavLink('service', +fl[1], val, null);
                } else if ((fl = key.match(/^footerServiceL(\d+)Url$/))) {
                    setFooterNavLink('service', +fl[1], null, val);
                } else if ((fl = key.match(/^footerLegalL(\d+)Visible$/))) {
                    setVisible(getFooterLegalLi(+fl[1]), val === true || val === 'true' || val === undefined);
                } else if ((fl = key.match(/^footerLegalL(\d+)Label$/))) {
                    setFooterLegalLink(+fl[1], val, null);
                } else if ((fl = key.match(/^footerLegalL(\d+)Url$/))) {
                    setFooterLegalLink(+fl[1], null, val);

                // ── Sub-nav: subNavLmVisible / subNavLmLabel / subNavLmUrl (bar + mega menu footer)
                } else if ((sn = key.match(/^subNavL(\d+)Visible$/))) {
                    setSubNavLinkState(+sn[1], { visible: val });
                } else if ((sn = key.match(/^subNavL(\d+)Label$/))) {
                    setSubNavLinkState(+sn[1], { label: val });
                } else if ((sn = key.match(/^subNavL(\d+)Url$/))) {
                    setSubNavLinkState(+sn[1], { url: val });

                // ── Mega menu: megaCnVisible / megaCnHead / megaCnLmVisible / megaCnLmLabel / megaCnLmUrl
                } else if ((mc = key.match(/^megaC(\d)Visible$/))) {
                    setVisible(getMegaColEl(+mc[1]), val === true || val === 'true' || val === undefined);
                } else if ((mc = key.match(/^megaC(\d)Head$/))) {
                    var colEl = getMegaColEl(+mc[1]);
                    if (colEl) setText(colEl.querySelector('.mega-col__head'), val);
                } else if ((ml = key.match(/^megaC(\d)L(\d)Visible$/))) {
                    setVisible(getMegaLinkEl(+ml[1], +ml[2]), val === true || val === 'true' || val === undefined);
                } else if ((ml = key.match(/^megaC(\d)L(\d)Label$/))) {
                    setText(getMegaLinkEl(+ml[1], +ml[2]), val);
                } else if ((ml = key.match(/^megaC(\d)L(\d)Url$/))) {
                    setAttr(getMegaLinkEl(+ml[1], +ml[2]), 'href', val);
                }
            }
        }
    }

    function ensureHeroSlides() {
        if (window.HeroSlidesEditor) {
            draft.heroSlides = window.HeroSlidesEditor.migrateFromDraft(draft);
            var overlay = window.HeroSlidesEditor.migrateOverlayFromDraft(draft);
            draft.heroOverlayColor = overlay.color;
            draft.heroOverlayOpacity = overlay.opacity;
        }
    }

    function ensureShopCategories() {
        if (window.ShopCategoriesEditor) {
            draft.shopCategories = window.ShopCategoriesEditor.migrateFromDraft(draft);
            draft.shopCategoriesTitle = (draft.shopCategoriesTitle !== undefined)
                ? draft.shopCategoriesTitle
                : window.ShopCategoriesEditor.DEFAULT_TITLE;
            draft.shopCategoriesSubtitle = (draft.shopCategoriesSubtitle !== undefined)
                ? draft.shopCategoriesSubtitle
                : window.ShopCategoriesEditor.DEFAULT_SUBTITLE;
        }
    }

    function getShopCategoriesHeader() {
        return {
            title: draft.shopCategoriesTitle || (window.ShopCategoriesEditor && window.ShopCategoriesEditor.DEFAULT_TITLE) || 'Shop by Category',
            subtitle: draft.shopCategoriesSubtitle || (window.ShopCategoriesEditor && window.ShopCategoriesEditor.DEFAULT_SUBTITLE) || '',
        };
    }

    function ensureShopBrands() {
        if (window.ShopBrandsEditor) {
            draft.shopBrands = window.ShopBrandsEditor.migrateFromDraft(draft);
            draft.shopBrandsTitle = (draft.shopBrandsTitle !== undefined)
                ? draft.shopBrandsTitle
                : window.ShopBrandsEditor.DEFAULT_TITLE;
            draft.shopBrandsSubtitle = (draft.shopBrandsSubtitle !== undefined)
                ? draft.shopBrandsSubtitle
                : window.ShopBrandsEditor.DEFAULT_SUBTITLE;
            draft.shopBrandsAllLabel = (draft.shopBrandsAllLabel !== undefined)
                ? draft.shopBrandsAllLabel
                : window.ShopBrandsEditor.DEFAULT_ALL_LABEL;
            draft.shopBrandsAllUrl = (draft.shopBrandsAllUrl !== undefined)
                ? draft.shopBrandsAllUrl
                : window.ShopBrandsEditor.DEFAULT_ALL_URL;
            draft.shopBrandsCarouselBg = (draft.shopBrandsCarouselBg !== undefined)
                ? draft.shopBrandsCarouselBg
                : window.ShopBrandsEditor.DEFAULT_CAROUSEL_BG;
        }
    }

    function getShopBrandsHeader() {
        return {
            title: draft.shopBrandsTitle || (window.ShopBrandsEditor && window.ShopBrandsEditor.DEFAULT_TITLE) || 'Shop by Brand',
            subtitle: draft.shopBrandsSubtitle || (window.ShopBrandsEditor && window.ShopBrandsEditor.DEFAULT_SUBTITLE) || '',
            allLabel: draft.shopBrandsAllLabel || (window.ShopBrandsEditor && window.ShopBrandsEditor.DEFAULT_ALL_LABEL) || 'View all brands',
            allUrl: draft.shopBrandsAllUrl || (window.ShopBrandsEditor && window.ShopBrandsEditor.DEFAULT_ALL_URL) || '/brands',
            carouselBg: draft.shopBrandsCarouselBg || (window.ShopBrandsEditor && window.ShopBrandsEditor.DEFAULT_CAROUSEL_BG) || '#e6ebf0',
        };
    }

    function ensureCatalogLibrary() {
        if (window.CatalogLibraryEditor) {
            draft.catalogItems = window.CatalogLibraryEditor.migrateFromDraft(draft);
            draft.catalogTitle = (draft.catalogTitle !== undefined)
                ? draft.catalogTitle
                : window.CatalogLibraryEditor.DEFAULT_TITLE;
            draft.catalogSubtitle = (draft.catalogSubtitle !== undefined)
                ? draft.catalogSubtitle
                : window.CatalogLibraryEditor.DEFAULT_SUBTITLE;
            draft.catalogAllLabel = (draft.catalogAllLabel !== undefined)
                ? draft.catalogAllLabel
                : window.CatalogLibraryEditor.DEFAULT_ALL_LABEL;
            draft.catalogAllUrl = (draft.catalogAllUrl !== undefined)
                ? draft.catalogAllUrl
                : window.CatalogLibraryEditor.DEFAULT_ALL_URL;
        }
    }

    function getCatalogLibraryHeader() {
        return {
            title: draft.catalogTitle || (window.CatalogLibraryEditor && window.CatalogLibraryEditor.DEFAULT_TITLE) || 'Vendor Catalog Library',
            subtitle: draft.catalogSubtitle || (window.CatalogLibraryEditor && window.CatalogLibraryEditor.DEFAULT_SUBTITLE) || '',
            allLabel: draft.catalogAllLabel || (window.CatalogLibraryEditor && window.CatalogLibraryEditor.DEFAULT_ALL_LABEL) || 'View all catalogs',
            allUrl: draft.catalogAllUrl || (window.CatalogLibraryEditor && window.CatalogLibraryEditor.DEFAULT_ALL_URL) || '/catalogs',
        };
    }

    // Apply all draft fields to the iframe
    function applyAllFields() {
        if (!iframeDoc) return;
        applyColors();
        Object.keys(DEFAULTS).forEach(function (key) {
            var val = draft[key] !== undefined ? draft[key] : DEFAULTS[key];
            applyField(key, val);
        });
        applyFooterLogo();
        applyHeaderLogo();
        updateFooterCopy();
        ensureHeroSlides();
        if (window.HeroSlidesEditor && draft.heroSlides) {
            window.HeroSlidesEditor.applyToDocument(iframeDoc, draft.heroSlides);
        }
        if (window.HeroSlidesEditor) {
            window.HeroSlidesEditor.applyOverlayToDocument(iframeDoc, {
                color: draft.heroOverlayColor,
                opacity: draft.heroOverlayOpacity,
            });
        }
        ensureShopCategories();
        if (window.ShopCategoriesEditor && draft.shopCategories) {
            window.ShopCategoriesEditor.applyToDocument(iframeDoc, draft.shopCategories, getShopCategoriesHeader());
        }
        ensureShopBrands();
        if (window.ShopBrandsEditor && draft.shopBrands) {
            window.ShopBrandsEditor.applyToDocument(iframeDoc, draft.shopBrands, getShopBrandsHeader());
        }
        ensureCatalogLibrary();
        if (window.CatalogLibraryEditor && draft.catalogItems) {
            window.CatalogLibraryEditor.applyToDocument(iframeDoc, draft.catalogItems, getCatalogLibraryHeader());
        }
    }

    // ── Populate form fields from draft ───────────────────────────────

    function populatePanel() {
        document.querySelectorAll('[data-field]').forEach(function (input) {
            var key = input.dataset.field;
            var val = draft[key] !== undefined ? draft[key] : DEFAULTS[key];
            if (input.type === 'checkbox') {
                input.checked = val === undefined ? true : (val === true || val === 'true');
            } else {
                if (val !== undefined) input.value = val;
            }
        });
        // Sync color hex inputs
        document.querySelectorAll('[data-field-hex]').forEach(function (hexInput) {
            var key = hexInput.dataset.fieldHex;
            var colorInput = document.querySelector('[data-field="' + key + '"][type="color"]');
            if (colorInput) hexInput.value = colorInput.value;
        });
        // Sync favicon thumbnail
        var faviconVal = draft.faviconSrc !== undefined ? draft.faviconSrc : DEFAULTS.faviconSrc;
        updateFaviconThumb(faviconVal || '');

        // Sync logo thumbnail
        var logoVal = draft.logoSrc !== undefined ? draft.logoSrc : DEFAULTS.logoSrc;
        // Only show thumb for uploaded data URLs; URL/path hints are shown via the text input
        updateLogoThumb(logoVal && logoVal.startsWith('data:') ? logoVal : '');
        // Clear the URL field if using a data URL (show it only for URL-type src values)
        if (logoUrlInput) {
            logoUrlInput.value = (logoVal && logoVal.startsWith('data:')) ? '' : (logoVal || '');
        }

        var footerLogoVal = draft.footerLogoSrc || '';
        updateFooterLogoThumb(footerLogoVal);
        var footerSize = clampFooterLogoSize(
            draft.footerLogoSize !== undefined ? draft.footerLogoSize : DEFAULTS.footerLogoSize
        );
        if (draft.footerLogoSize !== footerSize) draft.footerLogoSize = footerSize;
        if (footerLogoSizeVal) {
            footerLogoSizeVal.textContent = footerSize + 'px' +
                (footerSize === FOOTER_LOGO_SIZE_MAX ? ' (max)' : '');
        }
        var footerSizeInput = document.getElementById('df-footer-logo-size');
        if (footerSizeInput && footerSizeInput.value !== String(footerSize)) {
            footerSizeInput.value = footerSize;
        }
        var headerSize = clampHeaderLogoSize(
            draft.logoSize !== undefined ? draft.logoSize : DEFAULTS.logoSize
        );
        syncHeaderLogoSizeControls(headerSize, false);
        var headerSizeInput = document.getElementById('df-header-logo-size');
        if (headerSizeInput && headerSizeInput.value !== String(headerSize)) {
            headerSizeInput.value = headerSize;
        }
        var aboutImageVal = draft.aboutImageSrc !== undefined ? draft.aboutImageSrc : DEFAULTS.aboutImageSrc;
        updateAboutImageThumb(aboutImageVal || '');
        if (window.HeroSlidesEditor) {
            window.HeroSlidesEditor.renderPanel();
            window.HeroSlidesEditor.syncOverlayControls({
                color: draft.heroOverlayColor,
                opacity: draft.heroOverlayOpacity,
            });
        }
        if (window.ShopCategoriesEditor) {
            window.ShopCategoriesEditor.renderPanel();
            window.ShopCategoriesEditor.syncHeaderControls(getShopCategoriesHeader());
        }
        if (window.ShopBrandsEditor) {
            window.ShopBrandsEditor.renderPanel();
            window.ShopBrandsEditor.syncHeaderControls(getShopBrandsHeader());
        }
        if (window.CatalogLibraryEditor) {
            window.CatalogLibraryEditor.renderPanel();
            window.CatalogLibraryEditor.syncHeaderControls(getCatalogLibraryHeader());
        }
    }

    // ── Bind field panel inputs ───────────────────────────────────────

    function onFieldChange(e) {
        var input = e.target;
        var key   = input.dataset.field;
        if (!key) return;

        var val = input.type === 'checkbox' ? input.checked : input.value;
        if (input.type === 'range') val = parseInt(val, 10);

        if (key === 'logoSize') {
            var prevLogoSize = clampHeaderLogoSize(
                draft.logoSize !== undefined ? draft.logoSize : DEFAULTS.logoSize
            );
            var logoResult = attemptHeaderLogoSize(val, prevLogoSize);
            draft.logoSize = logoResult.size;
            input.value = logoResult.size;
            syncHeaderLogoSizeControls(logoResult.size, !logoResult.accepted);
            scheduleSave();
            return;
        }

        if (key === 'footerLogoSize') val = clampFooterLogoSize(val);
        draft[key] = val;

        // Keep color + hex inputs in sync
        if (input.type === 'color') {
            var hexSibling = input.parentNode.querySelector('[data-field-hex="' + key + '"]');
            if (hexSibling) hexSibling.value = val;
        }

        applyField(key, val);
        if (input.type === 'range' && key === 'footerLogoSize' && footerLogoSizeVal) {
            footerLogoSizeVal.textContent = val + 'px' +
                (val === FOOTER_LOGO_SIZE_MAX ? ' (max)' : '');
        }
        scheduleSave();
    }

    function onHexChange(e) {
        var hexInput = e.target;
        var key = hexInput.dataset.fieldHex;
        if (!key) return;
        var val = hexInput.value.trim();
        if (!/^#[0-9a-fA-F]{6}$/.test(val)) return;
        var colorInput = document.querySelector('[data-field="' + key + '"][type="color"]');
        if (colorInput) colorInput.value = val;
        draft[key] = val;
        applyField(key, val);
        scheduleSave();
    }

    function bindFieldPanel() {
        var panel = document.getElementById('woolFieldPanel');
        if (!panel) return;
        panel.addEventListener('input', onFieldChange);
        // Hex inputs fire on blur for better UX
        panel.querySelectorAll('[data-field-hex]').forEach(function (el) {
            el.addEventListener('change', onHexChange);
        });
        // Phone auto-format: XXX-XXX-XXXX  or  1-XXX-XXX-XXXX
        var phoneInput = document.getElementById('df-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function () {
                var pos    = phoneInput.selectionStart;
                var digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
                var formatted = '';

                if (digits.length === 0) {
                    formatted = '';
                } else if (digits[0] === '1') {
                    // Country code path: 1-XXX-XXX-XXXX
                    var local = digits.slice(1);
                    if (local.length === 0) {
                        formatted = '1';
                    } else if (local.length <= 3) {
                        formatted = '1-' + local;
                    } else if (local.length <= 6) {
                        formatted = '1-' + local.slice(0, 3) + '-' + local.slice(3);
                    } else {
                        formatted = '1-' + local.slice(0, 3) + '-' + local.slice(3, 6) + '-' + local.slice(6);
                    }
                } else {
                    // No country code: XXX-XXX-XXXX
                    if (digits.length <= 3) {
                        formatted = digits;
                    } else if (digits.length <= 6) {
                        formatted = digits.slice(0, 3) + '-' + digits.slice(3);
                    } else {
                        formatted = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
                    }
                }

                if (phoneInput.value !== formatted) {
                    var rawBefore = phoneInput.value.slice(0, pos).replace(/\D/g, '').length;
                    phoneInput.value = formatted;
                    var newPos = 0, count = 0;
                    while (newPos < formatted.length && count < rawBefore) {
                        if (formatted[newPos] !== '-') count++;
                        newPos++;
                    }
                    phoneInput.setSelectionRange(newPos, newPos);
                }
            });
        }
    }

    // ── Logo thumbnail helper ─────────────────────────────────────────

    function updateLogoThumb(src) {
        if (!logoThumbImg || !logoThumbEmpty || !logoRemoveBtn) return;
        if (src) {
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

    function bindLogoUpload() {
        if (!logoFileInput) return;

        // File picker → convert to data URL → apply
        logoFileInput.addEventListener('change', function () {
            var file = logoFileInput.files && logoFileInput.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (evt) {
                var dataUrl = evt.target.result;
                draft.logoSrc = dataUrl;
                if (logoUrlInput) logoUrlInput.value = '';
                updateLogoThumb(dataUrl);
                applyField('logoSrc', dataUrl);
                scheduleSave();
            };
            reader.readAsDataURL(file);
            // Reset so re-selecting same file fires change again
            logoFileInput.value = '';
        });

        // Remove button → restore default logo
        if (logoRemoveBtn) {
            logoRemoveBtn.addEventListener('click', function () {
                draft.logoSrc = DEFAULTS.logoSrc;
                if (logoUrlInput) logoUrlInput.value = '';
                updateLogoThumb('');
                applyField('logoSrc', DEFAULTS.logoSrc);
                scheduleSave();
            });
        }
    }

    function updateFooterLogoThumb(src) {
        if (!footerLogoThumbImg || !footerLogoThumbEmpty || !footerLogoRemoveBtn) return;
        if (src && src.indexOf('data:') === 0) {
            footerLogoThumbImg.src = src;
            footerLogoThumbImg.hidden = false;
            footerLogoThumbEmpty.hidden = true;
            footerLogoRemoveBtn.hidden = false;
        } else {
            footerLogoThumbImg.src = '';
            footerLogoThumbImg.hidden = true;
            footerLogoThumbEmpty.hidden = false;
            footerLogoThumbEmpty.textContent = 'Using header logo';
            footerLogoRemoveBtn.hidden = true;
        }
    }

    function bindFooterLogoUpload() {
        if (!footerLogoFileInput) return;

        footerLogoFileInput.addEventListener('change', function () {
            var file = footerLogoFileInput.files && footerLogoFileInput.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (evt) {
                var dataUrl = evt.target.result;
                draft.footerLogoSrc = dataUrl;
                updateFooterLogoThumb(dataUrl);
                applyFooterLogo();
                scheduleSave();
            };
            reader.readAsDataURL(file);
            footerLogoFileInput.value = '';
        });

        if (footerLogoRemoveBtn) {
            footerLogoRemoveBtn.addEventListener('click', function () {
                draft.footerLogoSrc = '';
                updateFooterLogoThumb('');
                applyFooterLogo();
                scheduleSave();
            });
        }
    }

    function updateAboutImageThumb(src) {
        if (!aboutImageThumbImg || !aboutImageThumbEmpty || !aboutImageRemoveBtn) return;
        if (src) {
            aboutImageThumbImg.src = src;
            aboutImageThumbImg.hidden = false;
            aboutImageThumbEmpty.hidden = true;
            aboutImageRemoveBtn.hidden = src.indexOf('data:') !== 0;
        } else {
            aboutImageThumbImg.src = '';
            aboutImageThumbImg.hidden = true;
            aboutImageThumbEmpty.hidden = false;
            aboutImageRemoveBtn.hidden = true;
        }
    }

    function bindAboutImageUpload() {
        if (!aboutImageFileInput) return;

        aboutImageFileInput.addEventListener('change', function () {
            var file = aboutImageFileInput.files && aboutImageFileInput.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (evt) {
                var dataUrl = evt.target.result;
                draft.aboutImageSrc = dataUrl;
                updateAboutImageThumb(dataUrl);
                applyField('aboutImageSrc', dataUrl);
                scheduleSave();
            };
            reader.readAsDataURL(file);
            aboutImageFileInput.value = '';
        });

        if (aboutImageRemoveBtn) {
            aboutImageRemoveBtn.addEventListener('click', function () {
                draft.aboutImageSrc = DEFAULTS.aboutImageSrc;
                updateAboutImageThumb(DEFAULTS.aboutImageSrc);
                applyField('aboutImageSrc', DEFAULTS.aboutImageSrc);
                scheduleSave();
            });
        }
    }

    // ── Favicon upload helper ─────────────────────────────────────────

    function updateFaviconThumb(src) {
        if (!faviconThumbImg || !faviconThumbEmpty || !faviconRemoveBtn) return;
        if (src) {
            faviconThumbImg.src = src;
            faviconThumbImg.hidden = false;
            faviconThumbEmpty.hidden = true;
            faviconRemoveBtn.hidden = false;
        } else {
            faviconThumbImg.src = '';
            faviconThumbImg.hidden = true;
            faviconThumbEmpty.hidden = false;
            faviconRemoveBtn.hidden = true;
        }
    }

    function bindFaviconUpload() {
        if (!faviconFileInput) return;
        faviconFileInput.addEventListener('change', function () {
            var file = faviconFileInput.files && faviconFileInput.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (evt) {
                var dataUrl = evt.target.result;
                draft.faviconSrc = dataUrl;
                updateFaviconThumb(dataUrl);
                // Update the iframe's favicon link for live preview
                if (iframeDoc) {
                    var link = iframeDoc.querySelector('link[rel*="icon"]');
                    if (!link) {
                        link = iframeDoc.createElement('link');
                        link.rel = 'icon';
                        iframeDoc.head.appendChild(link);
                    }
                    link.href = dataUrl;
                }
                scheduleSave();
            };
            reader.readAsDataURL(file);
            faviconFileInput.value = '';
        });
        if (faviconRemoveBtn) {
            faviconRemoveBtn.addEventListener('click', function () {
                draft.faviconSrc = '';
                updateFaviconThumb('');
                scheduleSave();
            });
        }
    }

    // ── Autosave ──────────────────────────────────────────────────────

    function scheduleSave() {
        isDirty = true;
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(saveDraft, SAVE_DEBOUNCE);
        setStatus('Unsaved changes…', false);
    }

    function setStatus(msg, isOk) {
        if (!editorStatus) return;
        editorStatus.textContent = msg;
        editorStatus.className   = 'editor-status' + (isOk === false ? ' editor-status--warn' : '');
    }

    function showToast(msg) {
        if (!saveToast) return;
        saveToast.textContent = msg;
        saveToast.classList.add('is-visible');
        setTimeout(function () { saveToast.classList.remove('is-visible'); }, 2200);
    }

    // Expose header draft so section-one-editor.js can merge before its own save
    Object.defineProperty(window, '__woolDraft', { get: function () { return draft; } });

    function saveDraft(options) {
        options = options || {};
        if (!isDirty) return;
        isDirty = false;
        // localStorage is the source of truth (works with or without the Node
        // server); the helper also best-effort syncs to /api when present.
        // buildCombinedDraft pulls header fields (via window.__woolDraft) plus
        // every registered section namespace, so nothing is dropped.
        if (typeof window.designerSaveCombined === 'function') {
            window.designerSaveCombined(TEMPLATE);
            if (!options.silent) {
                setStatus('Draft saved', true);
                showToast('Draft saved ✓');
            }
            return;
        }
        // Fallback: API only (older load order). Skip the network call when no
        // API is present (static Live Server) so nothing 404s.
        if (!window.DESIGNER_API_ENABLED) {
            if (!options.silent) {
                setStatus('Draft saved', true);
                showToast('Draft saved ✓');
            }
            return;
        }
        var payload = Object.assign({ _template: TEMPLATE }, draft);
        var sections = window.__designerSectionDrafts || {};
        Object.keys(sections).forEach(function (ns) { payload[ns] = sections[ns]; });
        fetch((window.DESIGNER_API_BASE || '') + '/api/designer/draft?template=' + TEMPLATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.ok) {
                if (!options.silent) {
                    setStatus('Draft saved', true);
                    showToast('Draft saved ✓');
                }
            } else {
                setStatus('Save failed — ' + (data.error || 'unknown error'), false);
            }
        })
        .catch(function (err) {
            console.error('[designer] Save error:', err);
            setStatus('Save failed — check connection', false);
        });
    }

    function loadDraft() {
        var loader = (typeof window.designerLoadCombined === 'function')
            ? window.designerLoadCombined(TEMPLATE)
            : Promise.resolve(null);
        return Promise.resolve(loader)
            .then(function (saved) {
                if (saved && typeof saved === 'object') {
                    draft = saved;
                    ensureHeroSlides();
                    ensureShopCategories();
                    ensureShopBrands();
                    ensureCatalogLibrary();
                    setStatus('Draft loaded', true);
                } else {
                    draft = {};
                    ensureHeroSlides();
                    ensureShopCategories();
                    ensureShopBrands();
                    ensureCatalogLibrary();
                    setStatus('New draft', true);
                }
            })
            .catch(function (err) {
                console.warn('[designer] Could not load draft:', err);
                draft = {};
                ensureHeroSlides();
                ensureShopCategories();
                ensureShopBrands();
                ensureCatalogLibrary();
            });
    }

    // ── iframe loading ────────────────────────────────────────────────

    var iframeReady = false;
    var draftReady  = false;
    var headerNavResizeTimer = null;

    function bindHeaderNavResize() {
        if (!iframeDoc || !iframeDoc.defaultView) return;
        var win = iframeDoc.defaultView;
        if (win.__designerHeaderNavResizeBound) return;
        win.__designerHeaderNavResizeBound = true;
        win.addEventListener('resize', function () {
            clearTimeout(headerNavResizeTimer);
            headerNavResizeTimer = setTimeout(function () {
                if (!iframeDoc) return;
                var fitted = applyHeaderLogoSize();
                if (draft.logoSize !== fitted) {
                    draft.logoSize = fitted;
                    scheduleSave();
                }
            }, 120);
        });
    }

    function onIframeReady() {
        if (!iframeReady || !draftReady) return;
        bindHeaderNavResize();
        applyAllFields();
    }

    function initPreviewIframe() {
        if (!previewFrame || slug !== 'woolf') return;

        // src is already set in HTML — just hook the load event for DOM access
        previewFrame.addEventListener('load', function () {
            try {
                iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                iframeReady = true;
                scaleIframe();
                onIframeReady();
            } catch (e) {
                console.error('[designer] Cannot access iframe DOM:', e);
            }
        });

        // If the iframe already loaded before this listener was registered
        try {
            var doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            if (doc && doc.readyState === 'complete' && doc.body) {
                iframeDoc = doc;
                iframeReady = true;
                scaleIframe();
                onIframeReady();
            }
        } catch (e) { /* cross-origin guard */ }
    }

    // ── Export button UI ──────────────────────────────────────────────

    function getExportButton() {
        return document.getElementById('exportHandoffBtn');
    }

    function renderExportButtonAsEvolved() {
        var btn = getExportButton();
        if (!btn) return;
        btn.disabled = false;
        btn.classList.remove('is-exporting');
        btn.classList.add('is-evolved');
        btn.textContent = EXPORT_BTN_SUCCESS_LABEL;
        btn.setAttribute('aria-label', 'Handoff exported successfully');
    }

    function resetExportButton() {
        var btn = getExportButton();
        if (!btn) return;
        btn.disabled = false;
        btn.classList.remove('is-exporting', 'is-evolved');
        btn.textContent = EXPORT_BTN_LABEL;
        btn.removeAttribute('aria-label');
    }

    function setExportSuccess() {
        renderExportButtonAsEvolved();
        draft.handoffExported = true;
        isDirty = true;
        saveDraft({ silent: true });
    }

    function applyExportButtonState() {
        if (exportInProgress) return;
        if (draft.handoffExported) {
            renderExportButtonAsEvolved();
            return;
        }
        resetExportButton();
    }

    // ── Reset to defaults ─────────────────────────────────────────────

    function initResetBtn() {
        if (!resetBtn) return;
        resetBtn.style.display = '';
        resetBtn.addEventListener('click', function () {
            if (!confirm('Reset all fields to the original template defaults? Your saved draft will be overwritten.')) return;
            draft = {};
            ensureHeroSlides();
            ensureShopCategories();
            ensureShopBrands();
            ensureCatalogLibrary();
            populatePanel();
            applyAllFields();
            resetExportButton();
            isDirty = true;
            saveDraft();
        });
    }

    // ── Export handoff (JSZip) ────────────────────────────────────────

    var CSS_FILES = [
        'data/css/header.css',
        'data/css/section-one.css',
        'data/css/section-two.css',
        'data/css/section-three.css',
        'data/css/section-four.css',
        'data/css/footer.css',
    ];

    var JS_FILES = [
        'data/js/header.js',
        'data/js/section-one.js',
        'data/js/section-three.js',
    ];

    // ── Build the premium welcome / install guide HTML ────────────────

    function buildWelcomeGuide() {
        var companyName  = draft.companyName  || DEFAULTS.companyName;
        var phoneNumber  = draft.phone        || DEFAULTS.phone        || '';
        var primaryBlue  = draft.colorBlue    || DEFAULTS.colorBlue;
        var colorGold    = draft.colorGold    || DEFAULTS.colorGold    || '#c8a44a';
        var navy         = draft.colorNavy    || DEFAULTS.colorNavy;
        var navyDark     = draft.colorNavyDark|| DEFAULTS.colorNavyDark;
        var colorTopBar  = draft.colorTopBarBg|| DEFAULTS.colorTopBarBg|| navyDark;
        var colorSubnav  = draft.colorSubnavBg|| DEFAULTS.colorSubnavBg|| primaryBlue;
        var hasLogo      = !!(draft.logoSrc   || DEFAULTS.logoSrc);
        var hasFavicon   = !!(draft.faviconSrc|| DEFAULTS.faviconSrc);
        var date         = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
        var pkgId        = 'WLF-' + Date.now().toString(36).toUpperCase().slice(-6);

        function draftVal(key) { return draft[key] !== undefined ? draft[key] : DEFAULTS[key]; }

        var swatches = [
            { label: 'Top bar bg',      color: draftVal('colorNavyDark') },
            { label: 'Primary blue',    color: primaryBlue },
            { label: 'Main nav',        color: navy },
            { label: 'Top bar text',    color: draftVal('colorTopbarText') },
            { label: 'Sub-nav text',    color: draftVal('colorSubnavText') },
            { label: 'Mega headings',   color: draftVal('colorMegaHead') },
            { label: 'Mega links',      color: draftVal('colorMegaLink') },
            { label: 'CTA band',        color: draftVal('ctaBgColor') },
            { label: 'Accent',          color: colorGold },
        ];
        var swatchHtml = swatches.map(function(s) {
            return '<div class="swatch"><div class="swatch-chip" style="background:' + s.color + '"></div>' +
                   '<div class="swatch-label">' + s.label + '</div>' +
                   '<div class="swatch-hex">' + s.color + '</div></div>';
        }).join('');

        var configRows = [
            ['Company Name',  companyName],
            ['Phone Number',  phoneNumber || '—'],
            ['Logo',          hasLogo   ? '✓ Uploaded' : '— Not uploaded'],
            ['Favicon',       hasFavicon? '✓ Uploaded' : '— Not uploaded'],
            ['Template',      'The Woolf — Industrial E-Commerce'],
            ['Package ID',    pkgId],
        ];
        var configHtml = configRows.map(function(r) {
            return '<div class="config-row"><div class="config-key">' + r[0] + '</div><div class="config-val">' + r[1] + '</div></div>';
        }).join('');

        var css = [
            '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap");',
            '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}',
            'html{font-size:16px}',
            'body{font-family:"Inter",sans-serif;background:#f4f5f7;color:#1a2333;-webkit-print-color-adjust:exact;print-color-adjust:exact}',

            /* ── Cover ── */
            '.cover{background:' + navyDark + ';min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:0;position:relative;overflow:hidden;page-break-after:always}',
            '.cover-bg-circle{position:absolute;border-radius:50%;background:rgba(255,255,255,0.025)}',
            '.cover-bg-c1{width:700px;height:700px;top:-200px;right:-180px}',
            '.cover-bg-c2{width:400px;height:400px;bottom:-100px;left:-80px}',
            '.cover-bg-lines{position:absolute;inset:0;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.015) 0px,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 60px);pointer-events:none}',
            '.cover-top{padding:48px 64px;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1}',
            '.cover-brand{font-size:0.7rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.4)}',
            '.cover-badge{background:rgba(200,164,74,0.15);border:1px solid rgba(200,164,74,0.4);border-radius:4px;padding:6px 14px;font-size:0.65rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:' + colorGold + '}',
            '.cover-center{flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 64px;position:relative;z-index:1}',
            '.cover-eyebrow{font-size:0.75rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:24px}',
            '.cover-rule{width:56px;height:2px;background:linear-gradient(90deg,' + colorGold + ',transparent);margin-bottom:28px}',
            '.cover-title{font-family:"Cormorant Garamond",serif;font-size:clamp(4rem,10vw,7rem);font-weight:600;color:#fff;line-height:0.95;letter-spacing:-0.02em;margin-bottom:20px}',
            '.cover-subtitle{font-family:"Cormorant Garamond",serif;font-size:1.4rem;font-weight:400;font-style:italic;color:rgba(255,255,255,0.5);margin-bottom:48px}',
            '.cover-for{display:inline-flex;flex-direction:column;gap:4px;border-left:3px solid ' + colorGold + ';padding-left:20px}',
            '.cover-for-label{font-size:0.6rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.3)}',
            '.cover-for-name{font-size:1.5rem;font-weight:600;color:#fff;letter-spacing:-0.01em}',
            '.cover-bottom{padding:36px 64px;display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid rgba(255,255,255,0.06);position:relative;z-index:1}',
            '.cover-meta-grid{display:flex;gap:40px}',
            '.cover-meta-item{display:flex;flex-direction:column;gap:4px}',
            '.cover-meta-label{font-size:0.58rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28)}',
            '.cover-meta-value{font-size:0.8rem;font-weight:600;color:rgba(255,255,255,0.75)}',
            '.cover-stripe{position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,' + navyDark + ' 0%,' + primaryBlue + ' 30%,' + colorGold + ' 60%,#e8c96a 100%)}',

            /* ── Page body ── */
            '.page{max-width:820px;margin:0 auto;padding:72px 48px 96px}',

            /* ── Welcome letter ── */
            '.letter{background:#fff;border-radius:16px;padding:44px 48px;margin-bottom:56px;box-shadow:0 4px 32px rgba(0,0,0,0.07);position:relative;overflow:hidden}',
            '.letter::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,' + primaryBlue + ',' + colorGold + ')}',
            '.letter-greeting{font-family:"Cormorant Garamond",serif;font-size:2rem;font-weight:600;color:' + navyDark + ';margin-bottom:20px}',
            '.letter p{font-size:0.9375rem;line-height:1.85;color:#4a5568;margin-bottom:12px}',
            '.letter p:last-child{margin-bottom:0}',
            '.letter-sig{margin-top:28px;padding-top:24px;border-top:1px solid #f0f4f8;font-family:"Cormorant Garamond",serif;font-style:italic;font-size:1.1rem;color:#718096}',

            /* ── Sections ── */
            '.section{margin-bottom:56px}',
            '.section-eyebrow{font-size:0.6rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:' + colorGold + ';margin-bottom:8px}',
            '.section-heading{font-family:"Cormorant Garamond",serif;font-size:2rem;font-weight:600;color:' + navyDark + ';margin-bottom:4px;line-height:1.1}',
            '.section-rule{width:40px;height:2px;background:' + colorGold + ';margin:14px 0 28px}',

            /* ── Brand config ── */
            '.config-table{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06)}',
            '.config-row{display:grid;grid-template-columns:180px 1fr;border-bottom:1px solid #f0f4f8}',
            '.config-row:last-child{border-bottom:none}',
            '.config-key{padding:14px 20px;font-size:0.8rem;font-weight:600;color:#718096;background:#fafbfc;text-transform:uppercase;letter-spacing:0.05em}',
            '.config-val{padding:14px 20px;font-size:0.875rem;font-weight:500;color:' + navyDark + '}',

            /* ── Color swatches ── */
            '.swatches{display:flex;gap:16px;flex-wrap:wrap;margin-top:24px}',
            '.swatch{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);min-width:110px;flex:1}',
            '.swatch-chip{height:64px;width:100%}',
            '.swatch-label{padding:8px 12px 2px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a0aec0}',
            '.swatch-hex{padding:0 12px 10px;font-size:0.8rem;font-family:ui-monospace,monospace;font-weight:600;color:' + navyDark + '}',

            /* ── Steps ── */
            '.steps{display:flex;flex-direction:column;gap:0}',
            '.step{display:grid;grid-template-columns:52px 1fr;gap:0 20px;position:relative}',
            '.step:not(:last-child)::after{content:"";position:absolute;left:25px;top:52px;bottom:0;width:2px;background:linear-gradient(to bottom,' + primaryBlue + '22,transparent)}',
            '.step-num{width:52px;height:52px;border-radius:50%;background:' + primaryBlue + ';color:#fff;font-size:1rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1;box-shadow:0 4px 16px ' + primaryBlue + '44}',
            '.step-body{padding-bottom:32px;padding-top:2px}',
            '.step-title{font-size:1rem;font-weight:700;color:' + navyDark + ';margin-bottom:6px;padding-top:12px}',
            '.step-desc{font-size:0.875rem;line-height:1.75;color:#4a5568}',
            '.step-path{display:inline-flex;align-items:center;gap:6px;margin-top:8px;background:#f0f4ff;border:1px solid #d0d9f0;border-radius:6px;padding:6px 12px;font-size:0.8rem;font-family:ui-monospace,monospace;color:' + primaryBlue + ';font-weight:600}',

            /* ── File cards ── */
            '.files{display:flex;flex-direction:column;gap:12px}',
            '.file-card{background:#fff;border-radius:12px;padding:20px 22px;box-shadow:0 2px 12px rgba(0,0,0,0.06);display:grid;grid-template-columns:44px 1fr;gap:0 16px;align-items:start;border-left:3px solid transparent}',
            '.file-card.priority{border-left-color:' + colorGold + '}',
            '.file-icon{width:44px;height:44px;border-radius:8px;background:' + navyDark + ';display:flex;align-items:center;justify-content:center;flex-shrink:0}',
            '.file-icon svg{fill:none;stroke:' + colorGold + ';stroke-width:1.6}',
            '.file-name{font-size:0.875rem;font-weight:700;font-family:ui-monospace,monospace;color:' + navyDark + ';margin-bottom:4px}',
            '.file-desc{font-size:0.8125rem;color:#718096;line-height:1.6}',
            'code{background:#f0f4f8;border-radius:3px;padding:1px 5px;font-size:0.8em;font-family:ui-monospace,monospace;color:' + primaryBlue + '}',

            /* ── Upload table ── */
            '.upload-table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)}',
            '.upload-table th{padding:12px 18px;text-align:left;font-size:0.65rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0aec0;background:#fafbfc;border-bottom:2px solid #f0f4f8}',
            '.upload-table td{padding:13px 18px;font-size:0.8125rem;font-family:ui-monospace,monospace;border-bottom:1px solid #f0f4f8;color:' + navyDark + '}',
            '.upload-table tr:last-child td{border-bottom:none}',
            '.upload-arrow{color:#c8a44a;font-weight:700;padding:0 8px;font-family:sans-serif}',

            /* ── Footer ── */
            '.footer{margin-top:72px;padding-top:32px;border-top:2px solid #e2e8ee;display:flex;justify-content:space-between;align-items:center}',
            '.footer-brand{font-family:"Cormorant Garamond",serif;font-size:1.2rem;font-weight:600;color:' + navyDark + '}',
            '.footer-right{text-align:right}',
            '.footer-pkg{font-size:0.7rem;font-family:ui-monospace,monospace;color:#a0aec0;margin-bottom:2px}',
            '.footer-date{font-size:0.75rem;color:#a0aec0}',

            /* ── Print ── */
            '@media print{',
            'body{background:#fff}',
            '.cover{min-height:100vh;page-break-after:always;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
            '.letter,.file-card,.config-table,.upload-table{box-shadow:none}',
            '.page{padding:48px 0}',
            '}',
        ].join('\n');

        var html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n' +
            '<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
            '<title>The Woolf — ' + companyName + ' Installation Guide</title>\n' +
            '<style>\n' + css + '\n</style>\n</head>\n<body>\n';

        /* ════ COVER PAGE ════ */
        html += '<div class="cover">\n';
        html += '  <div class="cover-bg-circle cover-bg-c1"></div>\n';
        html += '  <div class="cover-bg-circle cover-bg-c2"></div>\n';
        html += '  <div class="cover-bg-lines"></div>\n';
        html += '  <div class="cover-top">\n';
        html += '    <div class="cover-brand">LogicX Designer &nbsp;·&nbsp; Premium Template Studio</div>\n';
        html += '    <div class="cover-badge">Exclusive Package</div>\n';
        html += '  </div>\n';
        html += '  <div class="cover-center">\n';
        html += '    <div class="cover-eyebrow">Premium E-Commerce Website Template</div>\n';
        html += '    <div class="cover-rule"></div>\n';
        html += '    <div class="cover-title">The Woolf</div>\n';
        html += '    <div class="cover-subtitle">Industrial Supply &amp; Distribution</div>\n';
        html += '    <div class="cover-for">\n';
        html += '      <div class="cover-for-label">Exclusively Prepared For</div>\n';
        html += '      <div class="cover-for-name">' + companyName + '</div>\n';
        html += '    </div>\n';
        html += '  </div>\n';
        html += '  <div class="cover-bottom">\n';
        html += '    <div class="cover-meta-grid">\n';
        html += '      <div class="cover-meta-item"><div class="cover-meta-label">Package ID</div><div class="cover-meta-value">' + pkgId + '</div></div>\n';
        html += '      <div class="cover-meta-item"><div class="cover-meta-label">Date Issued</div><div class="cover-meta-value">' + date + '</div></div>\n';
        html += '      <div class="cover-meta-item"><div class="cover-meta-label">Platform</div><div class="cover-meta-value">XO System</div></div>\n';
        html += '      <div class="cover-meta-item"><div class="cover-meta-label">Section</div><div class="cover-meta-value">Header &amp; Navigation</div></div>\n';
        html += '    </div>\n';
        html += '  </div>\n';
        html += '  <div class="cover-stripe"></div>\n';
        html += '</div>\n';

        /* ════ BODY ════ */
        html += '<div class="page">\n';

        /* Welcome letter */
        html += '<div class="letter">\n';
        html += '  <div class="letter-greeting">Dear ' + companyName + ' Team,</div>\n';
        html += '  <p>Congratulations on your new premium website. Inside this package you\'ll find everything needed to bring <strong>The Woolf</strong> to life on your XO storefront — custom-configured with your company name, brand colors, phone number, navigation links, mega menu categories, and logo.</p>\n';
        html += '  <p>This guide walks your developer or onboarding team through installation step by step. The process takes about 15 minutes. Keep this document somewhere safe — it\'s your complete reference for the header section of your new site.</p>\n';
        html += '  <div class="letter-sig">The LogicX Designer Team</div>\n';
        html += '</div>\n';

        /* Brand configuration */
        html += '<div class="section">\n';
        html += '  <div class="section-eyebrow">Your Configuration</div>\n';
        html += '  <div class="section-heading">Brand Summary</div>\n';
        html += '  <div class="section-rule"></div>\n';
        html += '  <div class="config-table">' + configHtml + '</div>\n';
        html += '  <div class="swatches">' + swatchHtml + '</div>\n';
        html += '  <p style="margin-top:20px;font-size:0.875rem;color:#4a5568;line-height:1.7"><strong>Typography:</strong> Inter (400, 500, 600, 700) via Google Fonts — <code>https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap</code><br>See <code>spec/design-tokens.css</code> in the handoff ZIP for developer reference.</p>\n';
        html += '</div>\n';

        /* Install steps */
        html += '<div class="section">\n';
        html += '  <div class="section-eyebrow">Step-by-Step</div>\n';
        html += '  <div class="section-heading">Installing Your Header</div>\n';
        html += '  <div class="section-rule"></div>\n';
        html += '  <div class="steps">\n';
        html += '    <div class="step"><div class="step-num">1</div><div class="step-body"><div class="step-title">Upload Your Files to the Server</div><div class="step-desc">Using your XO File Manager or FTP, upload the contents of the <code>data/</code> folder from this ZIP to your server root. This places the stylesheet, script, icon, and image files at the correct paths before any HTML is installed.</div></div></div>\n';
        html += '    <div class="step"><div class="step-num">2</div><div class="step-body"><div class="step-title">Log In as Admin</div><div class="step-desc">Sign in to your XO dashboard with your administrator credentials.</div></div></div>\n';
        html += '    <div class="step"><div class="step-num">3</div><div class="step-body"><div class="step-title">Open Web Settings</div><div class="step-desc">In the left sidebar, navigate to: <span class="step-path">Settings → Web Settings</span></div></div></div>\n';
        html += '    <div class="step"><div class="step-num">4</div><div class="step-body"><div class="step-title">Click Web Preferences → HTML</div><div class="step-desc">Select <strong>Web Preferences</strong>, then click the <strong>HTML</strong> tab to access all custom HTML input sections.</div></div></div>\n';
        html += '    <div class="step"><div class="step-num">5</div><div class="step-body"><div class="step-title">Install Global Head Snippet</div><div class="step-desc">Open <strong>global-head-snippet.html</strong>, copy all of the code, and paste it into the <strong>"Meta Data, JavaScript &amp; CSS (Global)"</strong> section. Before saving, update the two <code>yourwebsite.com</code> placeholders with your real domain. This installs your page title, SEO tags, favicon, stylesheet links, and navigation scripts. Save your changes.</div></div></div>\n';
        html += '    <div class="step"><div class="step-num">6</div><div class="step-body"><div class="step-title">Install Header Block</div><div class="step-desc">Open <strong>header-block.html</strong>, copy all of the code, and paste it into the <strong>"Header"</strong> section. Save your changes.</div></div></div>\n';
        html += '    <div class="step"><div class="step-num">7</div><div class="step-body"><div class="step-title">Verify Your Storefront</div><div class="step-desc">Visit your live storefront. Your custom logo, navigation, mega menu, search bar, and brand colors should all appear correctly. If icons are missing, confirm the <code>data/images/icons/</code> folder was uploaded in Step 1.</div></div></div>\n';
        html += '  </div>\n';
        html += '</div>\n';

        /* Package contents */
        html += '<div class="section">\n';
        html += '  <div class="section-eyebrow">What\'s Inside</div>\n';
        html += '  <div class="section-heading">Package Contents</div>\n';
        html += '  <div class="section-rule"></div>\n';
        html += '  <div class="files">\n';
        html += '    <div class="file-card priority"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">woolf-homepage-brief.pdf</div><div class="file-desc"><strong>Developer brief</strong> — color tokens, section previews, asset inventory, and XO install checklist.</div></div></div>\n';
        html += '    <div class="file-card priority"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">global-head-snippet.html</div><div class="file-desc"><strong>Install first</strong> — paste into <em>Meta Data, JavaScript &amp; CSS (Global)</em>. Contains page title, SEO tags, Open Graph, favicon, stylesheet links, and navigation scripts.</div></div></div>\n';
        html += '    <div class="file-card priority"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">header-block.html</div><div class="file-desc"><strong>Install second</strong> — paste into the <em>Header</em> section. Contains your full navigation bar, top bar, mega menu, sub-nav, and search form.</div></div></div>\n';
        html += '    <div class="file-card"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">sections/</div><div class="file-desc">Per-section HTML blocks (hero, categories, about, catalogs, CTA, footer) with README.txt paste instructions in each folder.</div></div></div>\n';
        html += '    <div class="file-card"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">homepage.html</div><div class="file-desc">Complete assembled homepage — for standalone deployment or local preview outside the XO system.</div></div></div>\n';
        html += '    <div class="file-card"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">spec/</div><div class="file-desc">Developer reference — <code>homepage-spec.json</code> (machine-readable config) and <code>design-tokens.css</code> (color + typography tokens).</div></div></div>\n';
        html += '    <div class="file-card"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">data/</div><div class="file-desc">All stylesheets, scripts, images, icons, and catalog PDFs — upload the entire folder to your server root.</div></div></div>\n';
        html += '  </div>\n';
        html += '</div>\n';

        /* Server upload reference */
        html += '<div class="section">\n';
        html += '  <div class="section-eyebrow">File Manager / FTP</div>\n';
        html += '  <div class="section-heading">Server Upload Reference</div>\n';
        html += '  <div class="section-rule"></div>\n';
        html += '  <table class="upload-table">\n';
        html += '    <thead><tr><th>File in ZIP</th><th></th><th>Upload to Server Path</th></tr></thead>\n';
        html += '    <tbody>\n';
        html += '      <tr><td>data/css/</td><td class="upload-arrow">→</td><td>/data/css/</td></tr>\n';
        html += '      <tr><td>data/js/</td><td class="upload-arrow">→</td><td>/data/js/</td></tr>\n';
        html += '      <tr><td>data/images/</td><td class="upload-arrow">→</td><td>/data/images/</td></tr>\n';
        html += '      <tr><td>data/catalogs/</td><td class="upload-arrow">→</td><td>/data/catalogs/</td></tr>\n';
        html += '    </tbody>\n';
        html += '  </table>\n';
        html += '  <p style="margin-top:14px;font-size:0.8rem;color:#a0aec0"><strong>Cache busting:</strong> After updating <code>header.css</code> or <code>header.js</code>, increment the version parameter in <code>global-head-snippet.html</code> from <code>?v1</code> to <code>?v2</code> to force browsers to reload the latest file.</p>\n';
        html += '</div>\n';

        /* Footer */
        html += '<div class="footer">\n';
        html += '  <div class="footer-brand">LogicX Designer</div>\n';
        html += '  <div class="footer-right">\n';
        html += '    <div class="footer-pkg">Package ID: ' + pkgId + '</div>\n';
        html += '    <div class="footer-date">Issued ' + date + ' &nbsp;·&nbsp; ' + companyName + ' &nbsp;·&nbsp; The Woolf</div>\n';
        html += '  </div>\n';
        html += '</div>\n';

        html += '</div>\n</body>\n</html>';
        return html;
    }

    // ── Build global-head-snippet.html ───────────────────────────────
    // XO system: Meta Data, JavaScript & CSS (Global)
    // Contains everything that belongs in the site-wide <head>:
    // meta tags, favicon, stylesheets, scripts, and analytics placeholder.

    function buildGlobalHeadSnippet() {
        var date        = new Date().toLocaleDateString();
        var companyName = draft.companyName || DEFAULTS.companyName;
        var primaryBlue = draft.colorBlue   || DEFAULTS.colorBlue;
        var faviconHref = draft.faviconSrc  || DEFAULTS.faviconSrc || '/data/images/header/favicon.png';

        return [
            '<!-- The Woolf — Meta Data, JavaScript & CSS (Global) | LogicX Designer Editor · ' + date + ' -->',
            '',
            '<!-- ── Page metadata ───────────────────────────────── -->',
            '<meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
            '',
            '<title>' + companyName + ' | Industrial Supplies, Tooling &amp; Safety Products</title>',
            '<meta name="description" content="' + companyName + ' is your source for industrial supplies, cutting tools, safety equipment, and MRO products — shipped nationwide.">',
            '<meta name="keywords" content="industrial supplies, cutting tools, safety PPE, MRO products, tooling, fasteners, hydraulics, ' + companyName + '">',
            '<meta name="author"      content="' + companyName + '">',
            '<meta name="robots"      content="index, follow">',
            '<meta name="theme-color" content="' + primaryBlue + '">',
            '',
            '<!-- ── Open Graph (Facebook, LinkedIn, Slack previews) ─ -->',
            '<meta property="og:type"        content="website">',
            '<meta property="og:site_name"   content="' + companyName + '">',
            '<meta property="og:title"       content="' + companyName + ' | Industrial Supplies, Tooling &amp; Safety">',
            '<meta property="og:description" content="' + companyName + ' — industrial supplies, cutting tools, safety equipment, and MRO products shipped nationwide.">',
            '<meta property="og:url"         content="https://www.yourwebsite.com">',
            '<meta property="og:image"       content="/data/images/header/social-share.jpg">',
            '',
            '<!-- ── Twitter / X Card ────────────────────────────── -->',
            '<meta name="twitter:card"        content="summary_large_image">',
            '<meta name="twitter:title"       content="' + companyName + ' | Industrial Supplies">',
            '<meta name="twitter:description" content="' + companyName + ' — your source for industrial supplies, tooling, safety, and MRO products.">',
            '<meta name="twitter:image"       content="/data/images/header/social-share.jpg">',
            '',
            '<link rel="canonical" href="https://www.yourwebsite.com">',
            '',
            '<!-- ── Favicon ─────────────────────────────────────── -->',
            '<link rel="icon"             type="image/png"  href="' + faviconHref + '">',
            '<link rel="apple-touch-icon" sizes="180x180"   href="' + faviconHref + '">',
            '',
            '<!-- ── Template stylesheets ────────────────────────── -->',
            '<link rel="stylesheet" href="/data/css/header.css?v1" type="text/css">',
            '<link rel="stylesheet" href="/JavaScript/templateScripts/enhanced-search/enhanced-search.css?v1" type="text/css">',
            '',
            '<!-- ── Template scripts ────────────────────────────── -->',
            '<script src="/JavaScript/templateScripts/enhanced-search/enhanced-search.js?v1"></script>',
            '<script src="/data/js/header.js?v1"></script>',
            '',
            '<!-- ── Analytics ───────────────────────────────────── -->',
            '<!-- Paste your Google Analytics, Google Tag Manager,   -->',
            '<!-- Mailchimp, Constant Contact, or other third-party  -->',
            '<!-- tracking scripts below this line.                  -->',
            '',
        ].join('\n');
    }

    // ── Build header-block.html ───────────────────────────────────────
    // Paste this into XO: Header (HTML section)

    // Replace <img> icon references with inline SVGs so the exported HTML
    // has zero external image dependencies.
    var INLINE_ICONS = {
        '/data/images/icons/search.svg':
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        '/data/images/icons/search-white.svg':
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        '/data/images/icons/account.svg':
            '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        '/data/images/icons/cart.svg':
            '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    };

    function inlineIconSvgs(html) {
        // Replace every <img src="PATH" ...> for known icons with the SVG markup.
        // The regex matches the whole <img> tag regardless of attribute order.
        Object.keys(INLINE_ICONS).forEach(function (path) {
            var escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var re = new RegExp('<img[^>]*src=["\']' + escaped + '["\'][^>]*>', 'gi');
            html = html.replace(re, INLINE_ICONS[path]);
        });
        return html;
    }

    function buildHeaderBlock() {
        if (!iframeDoc) return '';
        var date = new Date().toLocaleDateString();

        var topBar     = iframeDoc.querySelector('.top-bar');
        var siteHeader = iframeDoc.querySelector('header.site-header');
        var overrides  = iframeDoc.getElementById('__designer-overrides__');

        var topBarHtml    = topBar     ? topBar.outerHTML     : '';
        var headerHtml    = siteHeader ? siteHeader.outerHTML : '';
        var overridesHtml = overrides  ? '<style id="__designer-overrides__">' + overrides.textContent + '</style>' : '';

        return [
            '<!-- The Woolf — Header Block | LogicX Designer Editor · ' + date + ' -->',
            '',
            overridesHtml,
            '',
            topBarHtml,
            '',
            headerHtml,
        ].join('\n');
    }

    function runExport() {
        if (!iframeDoc) {
            alert('Preview is still loading. Please wait a moment and try again.');
            return;
        }
        if (typeof window.exportWoolfHandoff !== 'function') {
            alert('Export module not loaded. Please reload the page and try again.');
            return;
        }

        exportInProgress = true;
        var btn = getExportButton();
        if (btn) {
            btn.disabled = true;
            btn.classList.remove('is-evolved');
            btn.classList.add('is-exporting');
            btn.textContent = 'Exporting…';
        }

        var exportSucceeded = false;

        window.exportWoolfHandoff({
            iframeDoc: iframeDoc,
            draft: draft,
            defaults: DEFAULTS,
            fetchBase: '../designer_editor/woolf/',
            buildWelcomeGuide: buildWelcomeGuide,
            buildGlobalHeadSnippet: buildGlobalHeadSnippet,
            buildHeaderBlock: buildHeaderBlock,
            inlineIconSvgs: inlineIconSvgs,
        })
        .then(function (blob) {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'woolf-handoff.zip';
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                URL.revokeObjectURL(a.href);
                document.body.removeChild(a);
            }, 1000);
            exportSucceeded = true;
            showToast('Export downloaded!');
        })
        .catch(function (err) {
            console.error('[designer] Export failed:', err);
            alert('Export failed: ' + err.message);
        })
        .finally(function () {
            exportInProgress = false;
            if (exportSucceeded) {
                setExportSuccess();
            } else if (draft.handoffExported) {
                renderExportButtonAsEvolved();
            } else {
                resetExportButton();
            }
        });
    }

    // ── Init ─────────────────────────────────────────────────────────

    function init() {
        initRouting();
        scaleIframe();

        if (slug !== 'woolf') return;

        // Hook the iframe load event (src already set in HTML, loading now)
        initPreviewIframe();

        // Load draft in parallel; apply fields once both iframe + draft are ready
        loadDraft().then(function () {
            populatePanel();
            draftReady = true;
            onIframeReady(); // applies if iframe already loaded; no-op if still loading
            applyExportButtonState();
        });

        bindFieldPanel();
        bindLogoUpload();
        bindFooterLogoUpload();
        bindFaviconUpload();
        bindAboutImageUpload();
        initResetBtn();

        if (window.HeroSlidesEditor) {
            window.HeroSlidesEditor.init({
                mount: document.getElementById('heroSlidesEditorMount'),
                overlayMount: document.getElementById('heroOverlayControls'),
                getSlides: function () { return draft.heroSlides; },
                setSlides: function (slides) { draft.heroSlides = slides; },
                getOverlay: function () {
                    return {
                        color: draft.heroOverlayColor,
                        opacity: draft.heroOverlayOpacity,
                    };
                },
                setOverlay: function (overlay) {
                    draft.heroOverlayColor = overlay.color;
                    draft.heroOverlayOpacity = overlay.opacity;
                },
                getIframeDoc: function () { return iframeDoc; },
                onUpdate: function () {
                    scheduleSave();
                },
            });
        }

        if (window.ShopCategoriesEditor) {
            window.ShopCategoriesEditor.init({
                mount: document.getElementById('shopCategoriesEditorMount'),
                headerMount: document.getElementById('shopCategoriesHeaderControls'),
                getCategories: function () { return draft.shopCategories; },
                setCategories: function (categories) { draft.shopCategories = categories; },
                getHeader: getShopCategoriesHeader,
                setHeader: function (header) {
                    draft.shopCategoriesTitle = header.title;
                    draft.shopCategoriesSubtitle = header.subtitle;
                },
                getIframeDoc: function () { return iframeDoc; },
                onUpdate: function () {
                    scheduleSave();
                },
            });
        }

        if (window.ShopBrandsEditor) {
            window.ShopBrandsEditor.init({
                mount: document.getElementById('shopBrandsEditorMount'),
                headerMount: document.getElementById('shopBrandsHeaderControls'),
                getBrands: function () { return draft.shopBrands; },
                setBrands: function (brands) { draft.shopBrands = brands; },
                getHeader: getShopBrandsHeader,
                setHeader: function (header) {
                    draft.shopBrandsTitle = header.title;
                    draft.shopBrandsSubtitle = header.subtitle;
                    draft.shopBrandsAllLabel = header.allLabel;
                    draft.shopBrandsAllUrl = header.allUrl;
                    draft.shopBrandsCarouselBg = header.carouselBg;
                },
                getIframeDoc: function () { return iframeDoc; },
                onUpdate: function () {
                    scheduleSave();
                },
            });
        }

        if (window.CatalogLibraryEditor) {
            window.CatalogLibraryEditor.init({
                mount: document.getElementById('catalogLibraryEditorMount'),
                headerMount: document.getElementById('catalogLibraryHeaderControls'),
                getCatalogs: function () { return draft.catalogItems; },
                setCatalogs: function (catalogs) { draft.catalogItems = catalogs; },
                getHeader: getCatalogLibraryHeader,
                setHeader: function (header) {
                    draft.catalogTitle = header.title;
                    draft.catalogSubtitle = header.subtitle;
                    draft.catalogAllLabel = header.allLabel;
                    draft.catalogAllUrl = header.allUrl;
                },
                getIframeDoc: function () { return iframeDoc; },
                onUpdate: function () {
                    scheduleSave();
                },
            });
        }

        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.addEventListener('click', runExport);
        }

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(scaleIframe, 120);
        });

        window.addEventListener('beforeunload', function () {
            if (isDirty) saveDraft();
        });
    }

    document.addEventListener('DOMContentLoaded', init);

}());
