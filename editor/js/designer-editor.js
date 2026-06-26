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

    // ── Default draft values (Woolf template defaults) ────────────────

    const DEFAULTS = {
        companyName:   'IBC Master',
        logoUrl:       '/',
        logoSrc:       'data/images/ibc-logo-reverse.svg',
        faviconSrc:    '',
        footerTagline: 'Your source for industrial supplies, tooling, safety, and MRO products — shipped nationwide.',
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
        // Hero slide 1
        hero1Eyebrow:  '500,000+ SKUs',
        hero1Title:    'Industrial supplies for every job site and shop floor',
        hero1Text:     'From cutting tools to safety gear — source what you need from one trusted catalog with fast shipping and expert support.',
        hero1Btn1Label: 'Browse Catalog',
        hero1Btn1Url:  '/catalog',
        hero1Btn2Label: 'Request a Quote',
        hero1Btn2Url:  '/contact',
        // Hero slide 2
        hero2Eyebrow:  'Safety & PPE',
        hero2Title:    'Keep your team protected and compliant',
        hero2Text:     'Gloves, eye protection, fall protection, respiratory, and more — stocked for industrial, construction, and manufacturing environments.',
        hero2Btn1Label: 'Shop Safety',
        hero2Btn1Url:  '/industrial-supplies?category=Safety',
        hero2Btn2Label: 'Browse All Categories',
        hero2Btn2Url:  '/catalog',
        // Hero slide 3
        hero3Eyebrow:  'Cutting & Machining',
        hero3Title:    'Precision tooling for production and maintenance',
        hero3Text:     'Milling, turning, threading, holemaking, and workholding — the brands and part numbers your machinists rely on.',
        hero3Btn1Label: 'Shop Cutting Tools',
        hero3Btn1Url:  '/industrial-supplies?category=Cutting+Tools',
        hero3Btn2Label: 'Browse Milling',
        hero3Btn2Url:  '/industrial-supplies?category=Milling',
        // About
        aboutEyebrow:  'About Us',
        aboutTitle:    'Supplying industry with the parts and products that keep operations running',
        aboutText1:    'IBC Master is a full-line industrial distributor serving manufacturing, construction, maintenance, and MRO teams across North America. From cutting tools and safety equipment to hydraulics and electrical supplies, we help customers find the right product — fast.',
        aboutText2:    'Our team combines deep product knowledge with responsive service, whether you are stocking a plant floor, outfitting a job site, or sourcing a hard-to-find part number. We partner with leading manufacturers so you get the brands you trust, backed by people who understand your business.',
        aboutBtn1Label: 'Learn More About IBC',
        aboutBtn1Url:  '/about',
        aboutBtn2Label: 'Contact Our Team',
        aboutBtn2Url:  '/contact',
        stat1Value:    '25+',
        stat1Label:    'Years in business',
        stat2Value:    '500K+',
        stat2Label:    'Products in catalog',
        stat3Value:    'Nationwide',
        stat3Label:    'Shipping & support',
        // CTA section
        ctaTitle:      'Need help sourcing the right product?',
        ctaText:       'Our team is ready to assist with quotes, bulk orders, and hard-to-find parts for your operation.',
        ctaBtn1Label:  'Request a Quote',
        ctaBtn1Url:    '/contact',
        ctaBtn2Label:  'Open an Account',
        ctaBtn2Url:    '/sign-up',
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

    // ── DOM references ────────────────────────────────────────────────

    var previewFrame       = document.getElementById('woolPreviewFrame');
    var previewWrap        = document.getElementById('woolPreviewWrap');
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
            '.sub-nav__links a { color: var(--ibc-subnav-text) !important; }',
            '.mega-col__head { color: var(--ibc-mega-head-color) !important; }',
            '.mega-col a { color: var(--ibc-mega-link-color) !important; }',
            /* Logo containment — prevents overflow regardless of uploaded image size */
            '.top-bar__logo { overflow: hidden; max-width: 220px; }',
            '.top-bar__logo img {',
            '  max-width: 100%;',
            '  max-height: 44px;',
            '  width: auto;',
            '  height: auto;',
            '  object-fit: contain;',
            '  display: block;',
            '}',
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
                iselAll('.site-footer__copy').forEach(function (el) {
                    el.textContent = '© ' + new Date().getFullYear() + ' ' + val + '. All rights reserved.';
                });
                break;
            case 'logoUrl':
                iselAll('.top-bar__logo, .site-footer__logo').forEach(function (el) {
                    setAttr(el, 'href', val);
                });
                break;
            case 'logoSrc':
                iselAll('.top-bar__logo img, .site-footer__logo img').forEach(function (img) {
                    img.setAttribute('src', val);
                    img.setAttribute('alt', draft.companyName || val);
                });
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

            // Hero slide 1
            case 'hero1Eyebrow':
                setText(isel('.hero__slide:nth-child(1) .hero__eyebrow'), val); break;
            case 'hero1Title':
                setText(isel('.hero__slide:nth-child(1) .hero__title'), val); break;
            case 'hero1Text':
                setText(isel('.hero__slide:nth-child(1) .hero__text'), val); break;
            case 'hero1Btn1Label':
                setText(isel('.hero__slide:nth-child(1) .hero__btn--primary'), val); break;
            case 'hero1Btn1Url':
                setAttr(isel('.hero__slide:nth-child(1) .hero__btn--primary'), 'href', val); break;
            case 'hero1Btn2Label':
                setText(isel('.hero__slide:nth-child(1) .hero__btn--secondary'), val); break;
            case 'hero1Btn2Url':
                setAttr(isel('.hero__slide:nth-child(1) .hero__btn--secondary'), 'href', val); break;

            // Hero slide 2
            case 'hero2Eyebrow':
                setText(isel('.hero__slide:nth-child(2) .hero__eyebrow'), val); break;
            case 'hero2Title':
                setText(isel('.hero__slide:nth-child(2) .hero__title'), val); break;
            case 'hero2Text':
                setText(isel('.hero__slide:nth-child(2) .hero__text'), val); break;
            case 'hero2Btn1Label':
                setText(isel('.hero__slide:nth-child(2) .hero__btn--primary'), val); break;
            case 'hero2Btn1Url':
                setAttr(isel('.hero__slide:nth-child(2) .hero__btn--primary'), 'href', val); break;
            case 'hero2Btn2Label':
                setText(isel('.hero__slide:nth-child(2) .hero__btn--secondary'), val); break;
            case 'hero2Btn2Url':
                setAttr(isel('.hero__slide:nth-child(2) .hero__btn--secondary'), 'href', val); break;

            // Hero slide 3
            case 'hero3Eyebrow':
                setText(isel('.hero__slide:nth-child(3) .hero__eyebrow'), val); break;
            case 'hero3Title':
                setText(isel('.hero__slide:nth-child(3) .hero__title'), val); break;
            case 'hero3Text':
                setText(isel('.hero__slide:nth-child(3) .hero__text'), val); break;
            case 'hero3Btn1Label':
                setText(isel('.hero__slide:nth-child(3) .hero__btn--primary'), val); break;
            case 'hero3Btn1Url':
                setAttr(isel('.hero__slide:nth-child(3) .hero__btn--primary'), 'href', val); break;
            case 'hero3Btn2Label':
                setText(isel('.hero__slide:nth-child(3) .hero__btn--secondary'), val); break;
            case 'hero3Btn2Url':
                setAttr(isel('.hero__slide:nth-child(3) .hero__btn--secondary'), 'href', val); break;

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

            // Stats
            case 'stat1Value': setText(isel('.about-block__stat:nth-child(1) .about-block__stat-value'), val); break;
            case 'stat1Label': setText(isel('.about-block__stat:nth-child(1) .about-block__stat-label'), val); break;
            case 'stat2Value': setText(isel('.about-block__stat:nth-child(2) .about-block__stat-value'), val); break;
            case 'stat2Label': setText(isel('.about-block__stat:nth-child(2) .about-block__stat-label'), val); break;
            case 'stat3Value': setText(isel('.about-block__stat:nth-child(3) .about-block__stat-value'), val); break;
            case 'stat3Label': setText(isel('.about-block__stat:nth-child(3) .about-block__stat-label'), val); break;

            // CTA
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

            default: {
                var mc, ml, sn;

                // ── Sub-nav: subNavLmVisible / subNavLmLabel / subNavLmUrl
                if ((sn = key.match(/^subNavL(\d+)Visible$/))) {
                    setVisible(iselAll('.sub-nav__links a')[+sn[1] - 1] || null, val === true || val === 'true' || val === undefined);
                } else if ((sn = key.match(/^subNavL(\d+)Label$/))) {
                    setText(iselAll('.sub-nav__links a')[+sn[1] - 1] || null, val);
                } else if ((sn = key.match(/^subNavL(\d+)Url$/))) {
                    setAttr(iselAll('.sub-nav__links a')[+sn[1] - 1] || null, 'href', val);

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

    // Apply all draft fields to the iframe
    function applyAllFields() {
        if (!iframeDoc) return;
        applyColors();
        Object.keys(DEFAULTS).forEach(function (key) {
            var val = draft[key] !== undefined ? draft[key] : DEFAULTS[key];
            applyField(key, val);
        });
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
    }

    // ── Bind field panel inputs ───────────────────────────────────────

    function onFieldChange(e) {
        var input = e.target;
        var key   = input.dataset.field;
        if (!key) return;

        var val = input.type === 'checkbox' ? input.checked : input.value;
        draft[key] = val;

        // Keep color + hex inputs in sync
        if (input.type === 'color') {
            var hexSibling = input.parentNode.querySelector('[data-field-hex="' + key + '"]');
            if (hexSibling) hexSibling.value = val;
        }

        applyField(key, val);
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

    function saveDraft() {
        if (!isDirty) return;
        isDirty = false;
        // localStorage is the source of truth (works with or without the Node
        // server); the helper also best-effort syncs to /api when present.
        // buildCombinedDraft pulls header fields (via window.__woolDraft) plus
        // every registered section namespace, so nothing is dropped.
        if (typeof window.designerSaveCombined === 'function') {
            window.designerSaveCombined(TEMPLATE);
            setStatus('Draft saved', true);
            showToast('Draft saved ✓');
            return;
        }
        // Fallback: API only (older load order)
        var payload = Object.assign({ _template: TEMPLATE }, draft);
        var sections = window.__designerSectionDrafts || {};
        Object.keys(sections).forEach(function (ns) { payload[ns] = sections[ns]; });
        fetch('/api/designer/draft?template=' + TEMPLATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.ok) {
                setStatus('Draft saved', true);
                showToast('Draft saved ✓');
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
                    setStatus('Draft loaded', true);
                } else {
                    draft = {};
                    setStatus('New draft', true);
                }
            })
            .catch(function (err) {
                console.warn('[designer] Could not load draft:', err);
                draft = {};
            });
    }

    // ── iframe loading ────────────────────────────────────────────────

    var iframeReady = false;
    var draftReady  = false;

    function onIframeReady() {
        if (!iframeReady || !draftReady) return;
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

    // ── Reset to defaults ─────────────────────────────────────────────

    function initResetBtn() {
        if (!resetBtn) return;
        resetBtn.style.display = '';
        resetBtn.addEventListener('click', function () {
            if (!confirm('Reset all fields to the original template defaults? Your saved draft will be overwritten.')) return;
            draft = {};
            populatePanel();
            applyAllFields();
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
    ];

    function fetchText(url) {
        return fetch(url, { credentials: 'include' }).then(function (r) {
            if (!r.ok) throw new Error('Failed: ' + url);
            return r.text();
        });
    }

    var HANDOFF_README = [
        'THE WOOLF — HANDOFF PACKAGE',
        '============================',
        '',
        'This ZIP contains your customized website files.',
        '',
        'CONTENTS',
        '--------',
        '  WELCOME-GUIDE.html        — Premium install guide (open in browser)',
        '  global-head-snippet.html  — Meta tags + favicon + CSS/JS (XO Global section)',
        '  header-block.html         — Header HTML (XO Header section)',
        '  section-one-block.html    — Hero / slideshow HTML (XO Section One)',
        '  section-two-block.html    — About block HTML (XO Section Two)',
        '  section-three-block.html  — Catalog library HTML (XO Section Three)',
        '  section-four-block.html   — Quick order + CTA HTML (XO Section Four)',
        '  footer-block.html         — Footer HTML (XO Footer section)',
        '  homepage.html             — Full assembled homepage (standalone preview)',
        '  index.html                — Header preview document (reference)',
        '  data/css/                 — Stylesheet files (upload to server)',
        '  data/js/                  — JavaScript files (upload to server)',
        '  data/images/icons/        — Navigation icon SVGs (upload to server)',
        '  data/images/header/       — Logo + favicon image files (upload to server)',
        '',
        'XO SYSTEM INSTALL ORDER',
        '-----------------------',
        'Step 1: Paste global-head-snippet.html into:',
        '        Web Preferences → HTML → Meta Data, JavaScript & CSS (Global)',
        '',
        'Step 2: Paste header-block.html into:',
        '        Web Preferences → HTML → Header',
        '',
        'See WELCOME-GUIDE.html for full step-by-step instructions.',
        '',
        'SERVER FILE UPLOADS',
        '-------------------',
        'Upload these files to your XO server (via File Manager or FTP):',
        '',
        '  data/css/header.css          →  /data/css/header.css',
        '  data/js/header.js            →  /data/js/header.js',
        '  data/images/icons/           →  /data/images/icons/',
        '  data/images/header/          →  /data/images/header/',
        '  (logo/favicon folder only present if images were uploaded in the editor)',
        '',
        'NOTE: When you update header.css or header.js, increment the version',
        'parameter in global-head-snippet.html (?v1 → ?v2) to bust browser cache.',
        '',
        'STANDALONE DEPLOYMENT (outside XO)',
        '-----------------------------------',
        '1. Upload index.html to your web root.',
        '2. Upload the full data/ folder (css, js, and images) alongside it.',
        '3. Test locally with a static file server before going live.',
        '',
        'Generated by LogicX Designer Editor — ' + new Date().toLocaleDateString(),
    ].join('\n');

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

        var swatches = [
            { label: 'Top Bar',    color: colorTopBar },
            { label: 'Primary',    color: primaryBlue },
            { label: 'Sub-nav',    color: colorSubnav },
            { label: 'Accent',     color: colorGold   },
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
        html += '    <div class="file-card priority"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">global-head-snippet.html</div><div class="file-desc"><strong>Install first</strong> — paste into <em>Meta Data, JavaScript &amp; CSS (Global)</em>. Contains page title, SEO tags, Open Graph, favicon, stylesheet link (<code>/data/css/header.css?v1</code>), and navigation scripts.</div></div></div>\n';
        html += '    <div class="file-card priority"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">header-block.html</div><div class="file-desc"><strong>Install second</strong> — paste into the <em>Header</em> section. Contains your full navigation bar, top bar, mega menu, sub-nav, and search form.</div></div></div>\n';
        html += '    <div class="file-card"><div class="file-icon"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">index.html</div><div class="file-desc">Complete homepage HTML — for standalone deployment or preview outside the XO system.</div></div></div>\n';
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
        html += '      <tr><td>data/css/header.css</td><td class="upload-arrow">→</td><td>/data/css/header.css</td></tr>\n';
        html += '      <tr><td>data/js/header.js</td><td class="upload-arrow">→</td><td>/data/js/header.js</td></tr>\n';
        html += '      <tr><td>data/images/icons/</td><td class="upload-arrow">→</td><td>/data/images/icons/</td></tr>\n';
        html += '      <tr><td>data/images/header/</td><td class="upload-arrow">→</td><td>/data/images/header/</td></tr>\n';
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

    // ── Image export helpers ──────────────────────────────────────────

    function getExtFromMime(mime) {
        var map = {
            'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif',
            'image/webp': 'webp', 'image/svg+xml': 'svg',
            'image/x-icon': 'ico', 'image/vnd.microsoft.icon': 'ico'
        };
        return map[mime] || 'png';
    }

    // Writes a data URL into the ZIP as a binary file and returns the zip path.
    function dataUrlToZip(zip, dataUrl, zipPath) {
        var match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!match) return null;
        zip.file(zipPath, match[2], { base64: true });
        return zipPath;
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

        var ZipCtor = (typeof JSZip !== 'undefined') ? JSZip : null;
        if (!ZipCtor) {
            alert('JSZip not loaded. Please reload the page and try again.');
            return;
        }

        if (exportBtn) {
            exportBtn.disabled = true;
            exportBtn.textContent = 'Exporting…';
        }

        var zip = new ZipCtor();

        // Serialize the modified iframe HTML
        var htmlContent = '<!DOCTYPE html>\n' + iframeDoc.documentElement.outerHTML;

        // Fetch all CSS and JS files. Relative path resolves on both the Node
        // app server and a static server (e.g. Live Server).
        var cssBase = '../designer_editor/woolf/';
        var cssPromises = CSS_FILES.map(function (f) {
            return fetchText(cssBase + f).then(function (text) { return { path: f, text: text }; });
        });
        var jsPromises = JS_FILES.map(function (f) {
            return fetchText(cssBase + f).then(function (text) { return { path: f, text: text }; })
                   .catch(function () { return null; }); // not all JS files may exist
        });

        // Only fetch header CSS/JS for the header-block export
        var headerCssPromise = fetchText(cssBase + 'data/css/header.css')
            .catch(function () { return null; });
        var headerJsPromise  = fetchText(cssBase + 'data/js/header.js')
            .catch(function () { return null; });

        // Fetch all icon SVGs so they land in data/images/icons/ in the ZIP
        var iconPaths = [
            'data/images/icons/search.svg',
            'data/images/icons/search-white.svg',
            'data/images/icons/account.svg',
            'data/images/icons/cart.svg',
            'data/images/icons/pdf.svg',
        ];
        var iconPromises = iconPaths.map(function (p) {
            return fetchText(cssBase + p)
                .then(function (text) { return { path: p, text: text }; })
                .catch(function () { return null; });
        });

        Promise.all(cssPromises.concat(jsPromises).concat([headerCssPromise, headerJsPromise]).concat(iconPromises))
        .then(function (results) {

            // ── Extract uploaded logo + favicon into data/images/header/ ──────
            var logoSrc    = draft.logoSrc    || '';
            var faviconSrc = draft.faviconSrc || '';
            var logoServerPath    = null;
            var faviconServerPath = null;

            if (logoSrc.indexOf('data:') === 0) {
                var logoMime = (logoSrc.match(/^data:([^;]+)/) || [])[1] || 'image/png';
                var logoZipPath = 'data/images/header/logo.' + getExtFromMime(logoMime);
                if (dataUrlToZip(zip, logoSrc, logoZipPath)) {
                    logoServerPath = '/' + logoZipPath;
                }
            }

            if (faviconSrc.indexOf('data:') === 0) {
                var favMime = (faviconSrc.match(/^data:([^;]+)/) || [])[1] || 'image/png';
                var favZipPath = 'data/images/header/favicon.' + getExtFromMime(favMime);
                if (dataUrlToZip(zip, faviconSrc, favZipPath)) {
                    faviconServerPath = '/' + favZipPath;
                }
            }

            // ── Build HTML snippets, then swap data URLs for file paths ───────
            var globalHtml  = buildGlobalHeadSnippet();
            var headerHtml  = buildHeaderBlock();
            var welcomeHtml = buildWelcomeGuide();

            if (logoServerPath && logoSrc) {
                htmlContent = htmlContent.split(logoSrc).join(logoServerPath);
                headerHtml  = headerHtml.split(logoSrc).join(logoServerPath);
                welcomeHtml = welcomeHtml.split(logoSrc).join(logoServerPath);
            }
            if (faviconServerPath && faviconSrc) {
                htmlContent = htmlContent.split(faviconSrc).join(faviconServerPath);
                globalHtml  = globalHtml.split(faviconSrc).join(faviconServerPath);
                welcomeHtml = welcomeHtml.split(faviconSrc).join(faviconServerPath);
            }

            zip.file('index.html', htmlContent);
            zip.file('global-head-snippet.html', globalHtml);
            zip.file('header-block.html', headerHtml);
            zip.file('WELCOME-GUIDE.html', welcomeHtml);
            zip.file('HANDOFF-README.txt', HANDOFF_README);

            // Add all page CSS/JS
            results.slice(0, cssPromises.length + jsPromises.length).forEach(function (item) {
                if (item) zip.file(item.path, item.text);
            });

            // Add header CSS + JS
            var headerCssResult = results[cssPromises.length + jsPromises.length];
            var headerJsResult  = results[cssPromises.length + jsPromises.length + 1];
            if (headerCssResult) zip.file('data/css/header.css', headerCssResult);
            if (headerJsResult)  zip.file('data/js/header.js',  headerJsResult);

            // Add icon SVGs into data/images/icons/
            results.slice(cssPromises.length + jsPromises.length + 2).forEach(function (item) {
                if (item) zip.file(item.path, item.text);
            });

            // ── Section blocks + full homepage assembly ───────────────────────
            var editors = window.__designerSectionEditors || {};
            var SECTION_ORDER = [
                { key: 'sectionOne',   file: 'section-one-block.html',   css: 'data/css/section-one.css' },
                { key: 'sectionTwo',   file: 'section-two-block.html',   css: 'data/css/section-two.css' },
                { key: 'sectionThree', file: 'section-three-block.html', css: 'data/css/section-three.css' },
                { key: 'sectionFour',  file: 'section-four-block.html',  css: 'data/css/section-four.css' },
                { key: 'footer',       file: 'footer-block.html',        css: 'data/css/footer.css' },
            ];

            function swapAssetUrls(html) {
                if (logoServerPath && logoSrc) html = html.split(logoSrc).join(logoServerPath);
                if (faviconServerPath && faviconSrc) html = html.split(faviconSrc).join(faviconServerPath);
                return html;
            }

            var sectionBodies = [];
            var usedCss = ['data/css/header.css'];
            SECTION_ORDER.forEach(function (s) {
                var ed = editors[s.key];
                if (!ed || typeof ed.getSectionHtml !== 'function') return;
                var html = swapAssetUrls(ed.getSectionHtml());
                if (!html) return;
                zip.file(s.file, '<!-- The Woolf — ' + s.key + ' | LogicX Designer Editor -->\n' + html);
                sectionBodies.push(html);
                usedCss.push(s.css);
            });

            // Recompute the global Meta override CSS for the standalone homepage.
            var metaDraft = (window.__designerSectionDrafts || {})._meta || {};
            var metaCss = '';
            if (metaDraft.fontFamily) metaCss += 'body, body * { font-family: ' + metaDraft.fontFamily + ' !important; }';
            if (metaDraft.accentColor) {
                metaCss += 'a { color: ' + metaDraft.accentColor + '; }';
                metaCss += '.about-block__btn--primary,.cta-band__btn--primary,.quick-order__submit,.catalog-library__all{background-color:' + metaDraft.accentColor + ';border-color:' + metaDraft.accentColor + ';}';
            }

            var pageTitle = (metaDraft.pageTitle || (draft.companyName || DEFAULTS.companyName) + ' — Home');
            var pageDesc  = metaDraft.metaDescription || '';
            var cssLinks  = usedCss.map(function (c) { return '  <link rel="stylesheet" href="' + c + '">'; }).join('\n');
            var headerBody = swapAssetUrls(buildHeaderBlock());

            var homepageHtml = [
                '<!DOCTYPE html>',
                '<html lang="en">',
                '<head>',
                '  <meta charset="UTF-8">',
                '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                '  <title>' + pageTitle + '</title>',
                (pageDesc ? '  <meta name="description" content="' + pageDesc.replace(/"/g, '&quot;') + '">' : ''),
                '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">',
                cssLinks,
                (metaCss ? '  <style id="__designer-meta-overrides__">' + metaCss + '</style>' : ''),
                '</head>',
                '<body>',
                headerBody,
                sectionBodies.join('\n'),
                '  <script src="data/js/header.js"></script>',
                '  <script src="data/js/section-one.js"></script>',
                '</body>',
                '</html>',
            ].filter(Boolean).join('\n');

            zip.file('homepage.html', homepageHtml);

            return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
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
            showToast('Export downloaded!');
        })
        .catch(function (err) {
            console.error('[designer] Export failed:', err);
            alert('Export failed: ' + err.message);
        })
        .finally(function () {
            if (exportBtn) {
                exportBtn.disabled = false;
                exportBtn.textContent = 'Export handoff';
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
        });

        bindFieldPanel();
        bindLogoUpload();
        bindFaviconUpload();
        initResetBtn();

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
