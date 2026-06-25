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
    const PREVIEW_URL    = '/designer-templates/woolf/header-preview.html';
    const IFRAME_WIDTH   = 1280; // design width of the template
    const SAVE_DEBOUNCE  = 1800; // ms after last change to auto-save

    // ── Default draft values (Woolf template defaults) ────────────────

    const DEFAULTS = {
        companyName:   'IBC Master',
        logoUrl:       '/',
        logoSrc:       'data/images/ibc-logo-reverse.svg',
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

    function saveDraft() {
        if (!isDirty) return;
        isDirty = false;
        var payload = Object.assign({ _template: TEMPLATE }, draft);
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
        return fetch('/api/designer/draft?template=' + TEMPLATE, {
            credentials: 'include',
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.draft && typeof data.draft === 'object') {
                draft = data.draft;
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
        '  index.html          — Your customized homepage (deploy at root)',
        '  header-block.html   — Header HTML snippet (paste into XO system)',
        '  data/css/           — Stylesheet files (all required)',
        '  data/js/            — JavaScript files (all required)',
        '',
        'HEADER BLOCK (header-block.html)',
        '--------------------------------',
        'This file contains only the raw header HTML — no <html>, <head>,',
        'or <body> tags. It is ready to paste directly into your platform.',
        '',
        'HOW TO INSTALL IN THE XO SYSTEM:',
        '  1. Log in to your dashboard as Admin',
        '  2. In the left sidebar click: Settings → Web Settings',
        '  3. Click Web Preferences',
        '  4. Click HTML',
        '  5. Open the Header section',
        '  6. Copy and paste the contents of header-block.html into that field',
        '  7. Save your changes',
        '',
        'IMAGES',
        '------',
        'Copy the data/images/ folder from the original template alongside',
        'index.html. Image uploads and replacements will be added in a',
        'future release of the designer editor.',
        '',
        'DEPLOYMENT',
        '----------',
        '1. Upload index.html to your web root.',
        '2. Upload the full data/ folder (css, js, and images) alongside it.',
        '3. Test locally with a static file server before going live.',
        '',
        'Generated by LogicX Designer Editor — ' + new Date().toLocaleDateString(),
    ].join('\n');

    // ── Build the premium welcome / install guide HTML ────────────────

    function buildWelcomeGuide() {
        var companyName = draft.companyName || DEFAULTS.companyName;
        var date        = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        var primaryBlue = draft.colorBlue  || DEFAULTS.colorBlue;
        var navy        = draft.colorNavy  || DEFAULTS.colorNavy;
        var navyDark    = draft.colorNavyDark || DEFAULTS.colorNavyDark;

        return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>The Woolf — Installation Guide</title>\n<style>\n' +
        '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap");\n' +
        '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n' +
        'html{font-size:16px}\n' +
        'body{font-family:"Inter",sans-serif;background:#f7f8fa;color:#1a2333;-webkit-print-color-adjust:exact;print-color-adjust:exact}\n' +

        /* Cover */
        '.cover{background:' + navyDark + ';min-height:320px;display:flex;flex-direction:column;justify-content:flex-end;padding:56px 64px 48px;position:relative;overflow:hidden}\n' +
        '.cover::before{content:"";position:absolute;top:-80px;right:-80px;width:420px;height:420px;border-radius:50%;background:rgba(255,255,255,0.03)}\n' +
        '.cover::after{content:"";position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,' + primaryBlue + ',#c8a44a,#e8c96a)}\n' +
        '.cover-eyebrow{font-family:"Inter",sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:18px}\n' +
        '.cover-title{font-family:"Cormorant Garamond",serif;font-size:4rem;font-weight:600;color:#fff;line-height:1.05;letter-spacing:-0.01em;margin-bottom:12px}\n' +
        '.cover-subtitle{font-size:1rem;color:rgba(255,255,255,0.55);font-weight:400;margin-bottom:32px}\n' +
        '.cover-meta{display:flex;gap:40px}\n' +
        '.cover-meta-item{border-left:2px solid #c8a44a;padding-left:14px}\n' +
        '.cover-meta-label{font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:4px}\n' +
        '.cover-meta-value{font-size:0.875rem;font-weight:600;color:#fff}\n' +

        /* Body */
        '.body{max-width:780px;margin:0 auto;padding:56px 40px 80px}\n' +
        '.welcome-box{background:#fff;border-radius:12px;padding:32px 36px;border-left:4px solid #c8a44a;margin-bottom:48px;box-shadow:0 2px 16px rgba(0,0,0,0.06)}\n' +
        '.welcome-box h2{font-family:"Cormorant Garamond",serif;font-size:1.6rem;font-weight:600;color:' + navyDark + ';margin-bottom:10px}\n' +
        '.welcome-box p{font-size:0.9375rem;line-height:1.7;color:#4a5568}\n' +

        /* Section headings */
        '.section{margin-bottom:48px}\n' +
        '.section-label{font-size:0.65rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#c8a44a;margin-bottom:14px}\n' +
        '.section-title{font-family:"Cormorant Garamond",serif;font-size:1.5rem;font-weight:600;color:' + navyDark + ';margin-bottom:20px}\n' +

        /* Steps */
        '.steps{display:flex;flex-direction:column;gap:0}\n' +
        '.step{display:grid;grid-template-columns:44px 1fr;gap:0 20px;position:relative}\n' +
        '.step:not(:last-child)::before{content:"";position:absolute;left:21px;top:44px;bottom:-12px;width:2px;background:#e2e8ee}\n' +
        '.step-num{width:44px;height:44px;border-radius:50%;background:' + navy + ';color:#fff;font-size:0.875rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1}\n' +
        '.step-body{padding-bottom:28px}\n' +
        '.step-title{font-size:0.9375rem;font-weight:700;color:' + navyDark + ';margin-bottom:4px;padding-top:10px}\n' +
        '.step-desc{font-size:0.875rem;line-height:1.65;color:#4a5568}\n' +
        '.step-path{display:inline-block;margin-top:6px;background:#f0f4ff;border:1px solid #d0d9f0;border-radius:4px;padding:4px 10px;font-size:0.8rem;font-family:ui-monospace,monospace;color:' + primaryBlue + ';font-weight:600}\n' +

        /* Files */
        '.files{display:flex;flex-direction:column;gap:10px}\n' +
        '.file-row{display:grid;grid-template-columns:auto 1fr;gap:12px 16px;align-items:start;background:#fff;border-radius:8px;padding:16px 18px;box-shadow:0 1px 4px rgba(0,0,0,0.06)}\n' +
        '.file-icon{width:36px;height:36px;border-radius:6px;background:' + navy + ';display:flex;align-items:center;justify-content:center;flex-shrink:0}\n' +
        '.file-icon svg{fill:none;stroke:#c8a44a;stroke-width:1.8}\n' +
        '.file-name{font-size:0.85rem;font-weight:700;font-family:ui-monospace,monospace;color:' + navyDark + ';margin-bottom:2px}\n' +
        '.file-desc{font-size:0.8125rem;color:#718096;line-height:1.5}\n' +

        /* Assets */
        '.assets{background:#fff;border-radius:8px;padding:20px 22px;box-shadow:0 1px 4px rgba(0,0,0,0.06)}\n' +
        '.asset-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f0f4f8}\n' +
        '.asset-row:last-child{border-bottom:none}\n' +
        '.asset-dot{width:8px;height:8px;border-radius:50%;background:' + primaryBlue + ';flex-shrink:0}\n' +
        '.asset-name{font-size:0.8125rem;font-family:ui-monospace,monospace;font-weight:600;color:' + navyDark + ';flex:1}\n' +
        '.asset-note{font-size:0.78rem;color:#718096}\n' +

        /* Footer */
        '.footer{border-top:1px solid #e2e8ee;margin-top:64px;padding-top:28px;display:flex;justify-content:space-between;align-items:center}\n' +
        '.footer-brand{font-size:0.8rem;font-weight:700;letter-spacing:0.06em;color:' + navyDark + '}\n' +
        '.footer-note{font-size:0.75rem;color:#a0aec0}\n' +

        /* Print */
        '@media print{\n' +
        'body{background:#fff}\n' +
        '.cover{-webkit-print-color-adjust:exact;print-color-adjust:exact}\n' +
        '.body{padding:40px 0}\n' +
        '.welcome-box,.file-row,.assets{box-shadow:none;border:1px solid #e2e8ee}\n' +
        '}\n' +
        '</style>\n</head>\n<body>\n' +

        /* Cover */
        '<div class="cover">\n' +
        '  <div class="cover-eyebrow">LogicX Designer — Premium Template Package</div>\n' +
        '  <div class="cover-title">The Woolf</div>\n' +
        '  <div class="cover-subtitle">Industrial E-Commerce Website — Installation &amp; Setup Guide</div>\n' +
        '  <div class="cover-meta">\n' +
        '    <div class="cover-meta-item"><div class="cover-meta-label">Prepared for</div><div class="cover-meta-value">' + companyName + '</div></div>\n' +
        '    <div class="cover-meta-item"><div class="cover-meta-label">Date</div><div class="cover-meta-value">' + date + '</div></div>\n' +
        '    <div class="cover-meta-item"><div class="cover-meta-label">Package</div><div class="cover-meta-value">Header Section</div></div>\n' +
        '  </div>\n' +
        '</div>\n' +

        /* Body */
        '<div class="body">\n' +

        /* Welcome */
        '  <div class="welcome-box">\n' +
        '    <h2>Welcome, ' + companyName + '</h2>\n' +
        '    <p>This package contains your custom-branded header for <strong>The Woolf</strong> template, configured specifically for your business. The header includes your company logo, navigation, phone number, product categories, and all links — ready to install in your XO system dashboard.</p>\n' +
        '  </div>\n' +

        /* Install steps */
        '  <div class="section">\n' +
        '    <div class="section-label">Step-by-Step</div>\n' +
        '    <div class="section-title">Installing Your Header in the XO System</div>\n' +
        '    <div class="steps">\n' +
        '      <div class="step"><div class="step-num">1</div><div class="step-body"><div class="step-title">Log in as Admin</div><div class="step-desc">Sign in to your XO dashboard with your administrator credentials.</div></div></div>\n' +
        '      <div class="step"><div class="step-num">2</div><div class="step-body"><div class="step-title">Open Web Settings</div><div class="step-desc">In the left sidebar, navigate to:<br><span class="step-path">Settings → Web Settings</span></div></div></div>\n' +
        '      <div class="step"><div class="step-num">3</div><div class="step-body"><div class="step-title">Click Web Preferences</div><div class="step-desc">Select <strong>Web Preferences</strong> from the settings options.</div></div></div>\n' +
        '      <div class="step"><div class="step-num">4</div><div class="step-body"><div class="step-title">Open the HTML Tab</div><div class="step-desc">Click on <strong>HTML</strong> to access the custom HTML fields.</div></div></div>\n' +
        '      <div class="step"><div class="step-num">5</div><div class="step-body"><div class="step-title">Paste Your Header Code</div><div class="step-desc">Open <strong>header-block.html</strong> from this package, select all the code, and paste it into the Header section field.</div></div></div>\n' +
        '      <div class="step"><div class="step-num">6</div><div class="step-body"><div class="step-title">Save &amp; Verify</div><div class="step-desc">Click Save, then visit your storefront to confirm the header is displaying correctly.</div></div></div>\n' +
        '    </div>\n' +
        '  </div>\n' +

        /* Files */
        '  <div class="section">\n' +
        '    <div class="section-label">Package Contents</div>\n' +
        '    <div class="section-title">What\'s in Your ZIP File</div>\n' +
        '    <div class="files">\n' +
        '      <div class="file-row"><div class="file-icon"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">header-block.html</div><div class="file-desc">Your customized header HTML — paste this directly into the XO system Header section. No &lt;html&gt; or &lt;body&gt; tags needed.</div></div></div>\n' +
        '      <div class="file-row"><div class="file-icon"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="file-name">index.html</div><div class="file-desc">Full homepage HTML — for standalone deployment outside the XO system.</div></div></div>\n' +
        '      <div class="file-row"><div class="file-icon"><svg width="18" height="18" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div><div><div class="file-name">data/css/header.css</div><div class="file-desc">Stylesheet for the header. Must be loaded in your platform\'s &lt;head&gt; before the header block renders.</div></div></div>\n' +
        '      <div class="file-row"><div class="file-icon"><svg width="18" height="18" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div><div><div class="file-name">data/js/header.js</div><div class="file-desc">Powers the mega menu, mobile drawer, and interactive navigation. Load after your CSS.</div></div></div>\n' +
        '    </div>\n' +
        '  </div>\n' +

        /* Required assets */
        '  <div class="section">\n' +
        '    <div class="section-label">Required</div>\n' +
        '    <div class="section-title">Assets to Load in Your &lt;head&gt;</div>\n' +
        '    <div class="assets">\n' +
        '      <div class="asset-row"><div class="asset-dot"></div><div class="asset-name">data/css/header.css</div><div class="asset-note">Header stylesheet</div></div>\n' +
        '      <div class="asset-row"><div class="asset-dot"></div><div class="asset-name">data/js/header.js</div><div class="asset-note">Navigation behavior</div></div>\n' +
        '      <div class="asset-row"><div class="asset-dot"></div><div class="asset-name">data/images/</div><div class="asset-note">Icons, logo, images — upload to your server</div></div>\n' +
        '    </div>\n' +
        '  </div>\n' +

        /* Footer */
        '  <div class="footer">\n' +
        '    <div class="footer-brand">LogicX Designer</div>\n' +
        '    <div class="footer-note">Generated ' + date + ' · The Woolf Premium Template · Prepared for ' + companyName + '</div>\n' +
        '  </div>\n' +

        '</div>\n</body>\n</html>';
    }

    // ── Build the header-block.html snippet ──────────────────────────

    function buildHeaderBlock() {
        if (!iframeDoc) return '';
        var date = new Date().toLocaleDateString();

        // Grab the two header elements from the live (customized) iframe DOM
        var topBar    = iframeDoc.querySelector('.top-bar');
        var siteHeader = iframeDoc.querySelector('header.site-header');
        var overrides  = iframeDoc.getElementById('__designer-overrides__');

        var topBarHtml    = topBar     ? topBar.outerHTML     : '';
        var headerHtml    = siteHeader ? siteHeader.outerHTML : '';
        var overridesHtml = overrides  ? '<style id="__designer-overrides__">' + overrides.textContent + '</style>' : '';

        return [
            '<!-- ============================================================',
            '     THE WOOLF — HEADER BLOCK',
            '     Generated by LogicX Designer Editor',
            '     Date: ' + date,
            '     ============================================================',
            '',
            '     HOW TO INSTALL THIS HEADER (XO System)',
            '     ────────────────────────────────────────',
            '     1. Log in to your dashboard as Admin',
            '     2. In the left sidebar click:',
            '        Settings → Web Settings',
            '     3. Click Web Preferences',
            '     4. Click HTML',
            '     5. Open the Header section',
            '     6. Copy and paste the contents of this file',
            '        into that field',
            '     7. Save your changes',
            '',
            '     WHAT THIS SECTION INCLUDES:',
            '     Top bar, company logo, navigation, search bar,',
            '     All Products mega menu, quick-link sub-nav,',
            '     and Sign Up / Login buttons.',
            '',
            '     REQUIRED ASSETS (add to your platform\'s <head>):',
            '     - data/css/header.css  — header styles',
            '     - data/js/header.js    — mega menu & mobile nav behavior',
            '     ============================================================ -->',
            '',
            '<!-- Custom color and style overrides set in the designer editor -->',
            overridesHtml,
            '',
            '<!-- TOP BAR: Logo, navigation links, phone number, Sign Up / Login -->',
            topBarHtml,
            '',
            '<!-- SITE HEADER: Main nav bar, search, All Products mega menu,',
            '     sub-nav quick links, account and cart icons -->',
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

        // Fetch all CSS and JS files from the server
        var cssBase = '/designer-templates/woolf/';
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

        Promise.all(cssPromises.concat(jsPromises).concat([headerCssPromise, headerJsPromise]))
        .then(function (results) {
            zip.file('index.html', htmlContent);
            zip.file('header-block.html', buildHeaderBlock());
            zip.file('WELCOME-GUIDE.html', buildWelcomeGuide());
            zip.file('HANDOFF-README.txt', HANDOFF_README);

            // Add all CSS/JS (drop the last two which were header-only fetches above)
            results.slice(0, cssPromises.length + jsPromises.length).forEach(function (item) {
                if (item) zip.file(item.path, item.text);
            });

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
