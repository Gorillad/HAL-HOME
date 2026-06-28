/**
 * Woolf Designer — Premium PDF + ZIP developer handoff export.
 * Requires JSZip; PDF generation requires html2canvas + jsPDF.
 */
(function () {
    'use strict';

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

    var STATIC_ICON_PATHS = [
        'data/images/icons/search.svg',
        'data/images/icons/search-white.svg',
        'data/images/icons/account.svg',
        'data/images/icons/cart.svg',
        'data/images/icons/pdf.svg',
        'data/images/icons/social/facebook.svg',
        'data/images/icons/social/linkedin.svg',
        'data/images/icons/social/youtube.svg',
        'data/images/icons/social/x.svg',
    ];

    var COLOR_KEYS = [
        'colorBlue', 'colorNavy', 'colorNavyDark', 'colorTopbarText',
        'colorSubnavText', 'colorMegaHead', 'colorMegaLink', 'ctaBgColor',
    ];

    var COLOR_LABELS = {
        colorBlue: 'Primary blue',
        colorNavy: 'Main nav background',
        colorNavyDark: 'Top bar background',
        colorTopbarText: 'Top bar text',
        colorSubnavText: 'Sub-nav link text',
        colorMegaHead: 'Mega menu headings',
        colorMegaLink: 'Mega menu links',
        ctaBgColor: 'CTA band background',
    };

    function cv(draft, defaults, key) {
        return draft[key] !== undefined ? draft[key] : defaults[key];
    }

    function getExtFromMime(mime) {
        var map = {
            'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg',
            'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg',
            'image/x-icon': 'ico', 'image/vnd.microsoft.icon': 'ico',
            'application/pdf': 'pdf',
        };
        return map[mime] || 'png';
    }

    function fetchText(url) {
        return fetch(url, { credentials: 'include' }).then(function (r) {
            if (!r.ok) throw new Error('Failed: ' + url);
            return r.text();
        });
    }

    function fetchBlob(url) {
        return fetch(url, { credentials: 'include' }).then(function (r) {
            if (!r.ok) throw new Error('Failed: ' + url);
            return r.blob();
        });
    }

    function dataUrlToZip(zip, dataUrl, zipPath) {
        var match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!match) return null;
        zip.file(zipPath, match[2], { base64: true });
        return zipPath;
    }

    function normalizeAssetRef(ref) {
        if (!ref || typeof ref !== 'string') return null;
        ref = ref.trim().replace(/^["']|["']$/g, '');
        if (!ref || ref === '#' || ref.startsWith('tel:') || ref.startsWith('mailto:')) return null;
        if (ref.startsWith('javascript:')) return null;
        if (/^https?:\/\//i.test(ref)) return null;
        if (ref.startsWith('data:')) return ref;
        if (ref.startsWith('/data/')) return ref.slice(1);
        if (ref.startsWith('data/')) return ref;
        return null;
    }

    function serverPathFromZipPath(zipPath) {
        return zipPath.charAt(0) === '/' ? zipPath : '/' + zipPath;
    }

    function extractUrlsFromHtml(html) {
        var urls = [];
        if (!html) return urls;
        var reSrc = /\b(?:src|href)=["']([^"']+)["']/gi;
        var m;
        while ((m = reSrc.exec(html)) !== null) urls.push(m[1]);
        var reBg = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
        while ((m = reBg.exec(html)) !== null) urls.push(m[1]);
        return urls;
    }

    function collectDraftAssetRefs(draft) {
        var refs = [];
        (draft.heroSlides || []).forEach(function (slide, i) {
            if (slide && slide.bgSrc) refs.push({ ref: slide.bgSrc, hint: 'data/images/hero/slide-' + (i + 1) });
        });
        (draft.shopCategories || []).forEach(function (cat, i) {
            if (cat && cat.imageSrc) refs.push({ ref: cat.imageSrc, hint: 'data/images/category/category-' + (i + 1) });
        });
        (draft.shopBrands || []).forEach(function (brand, i) {
            if (brand && brand.logoSrc) refs.push({ ref: brand.logoSrc, hint: 'data/images/brands/brand-' + (i + 1) });
        });
        (draft.catalogItems || []).forEach(function (item, i) {
            if (item && item.coverSrc) refs.push({ ref: item.coverSrc, hint: 'data/images/pdf/catalog-' + (i + 1) });
            if (item && item.pdfUrl) refs.push({ ref: item.pdfUrl, hint: 'data/catalogs/catalog-' + (i + 1) });
        });
        if (draft.logoSrc) refs.push({ ref: draft.logoSrc, hint: 'data/images/header/logo' });
        if (draft.faviconSrc) refs.push({ ref: draft.faviconSrc, hint: 'data/images/header/favicon' });
        if (draft.footerLogoSrc) refs.push({ ref: draft.footerLogoSrc, hint: 'data/images/footer/logo' });
        if (draft.aboutImageSrc) refs.push({ ref: draft.aboutImageSrc, hint: 'data/images/about/company-photo' });
        return refs;
    }

    function guessZipPath(ref, hint) {
        if (ref.indexOf('data:') === 0) {
            var mime = (ref.match(/^data:([^;]+)/) || [])[1] || 'image/png';
            var ext = getExtFromMime(mime);
            if (hint.indexOf('catalog-') >= 0 && mime === 'application/pdf') {
                return hint + '.' + ext;
            }
            return hint + '.' + ext;
        }
        var normalized = normalizeAssetRef(ref);
        if (!normalized) return null;
        return normalized;
    }

    function replaceAllPaths(html, pathMap) {
        var out = html;
        Object.keys(pathMap).sort(function (a, b) { return b.length - a.length; }).forEach(function (from) {
            var to = pathMap[from];
            if (from && to) out = out.split(from).join(to);
        });
        return out;
    }

    function stripDesignerOnlyFromHtml(html) {
        return html
            .replace(/<style id="__designer-overrides__">[\s\S]*?<\/style>/gi, '')
            .replace(/<style id="__designer-header-logo-size__">[\s\S]*?<\/style>/gi, '')
            .replace(/<style id="__designer-footer-logo-size__">[\s\S]*?<\/style>/gi, '');
    }

    function extractHeroBlock(iframeDoc) {
        var hero = iframeDoc.querySelector('.hero');
        var trust = iframeDoc.querySelector('.hero__trust');
        var date = new Date().toLocaleDateString();
        var parts = [
            '<!-- The Woolf — Hero Block | LogicX Designer Editor · ' + date + ' -->',
            '<!-- Paste into XO Section One (hero area). Requires /data/css/section-one.css and /data/js/section-one.js -->',
            '',
        ];
        if (hero) parts.push(hero.outerHTML);
        if (trust) parts.push('', trust.outerHTML);
        return parts.join('\n');
    }

    function extractSectionOneBlock(iframeDoc) {
        var section = iframeDoc.querySelector('.section-one');
        if (!section) return '';
        var clone = section.cloneNode(true);
        clone.querySelectorAll('.hero, .hero__trust').forEach(function (el) { el.remove(); });
        var date = new Date().toLocaleDateString();
        return [
            '<!-- The Woolf — Section One (Categories + Brands) | LogicX Designer Editor · ' + date + ' -->',
            '<!-- Paste below the hero in XO Section One. Requires /data/css/section-one.css -->',
            '',
            clone.innerHTML.trim(),
        ].join('\n');
    }

    function extractSectionBlock(iframeDoc, selector, label, pasteNote) {
        var el = iframeDoc.querySelector(selector);
        if (!el) return '';
        var date = new Date().toLocaleDateString();
        return [
            '<!-- The Woolf — ' + label + ' | LogicX Designer Editor · ' + date + ' -->',
            '<!-- ' + pasteNote + ' -->',
            '',
            el.outerHTML,
        ].join('\n');
    }

    function buildDesignTokensCss(draft, defaults) {
        var lines = [
            '/* The Woolf — Design tokens | Generated by LogicX Designer Editor */',
            ':root {',
        ];
        COLOR_KEYS.forEach(function (key) {
            var val = cv(draft, defaults, key);
            if (val) {
                var cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^color-/, '--ibc-').replace(/^cta-/, '--cta-');
                if (key === 'colorBlue') lines.push('  --ibc-blue: ' + val + ';');
                else if (key === 'colorNavy') lines.push('  --ibc-navy: ' + val + ';');
                else if (key === 'colorNavyDark') lines.push('  --ibc-navy-dark: ' + val + ';');
                else if (key === 'ctaBgColor') lines.push('  --cta-band-bg: ' + val + ';');
                else lines.push('  /* ' + key + ' */ ' + val + ';');
            }
        });
        lines.push('}');
        lines.push('');
        lines.push('body {');
        lines.push("  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;");
        lines.push('}');
        lines.push('');
        lines.push('/* Google Fonts: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap */');
        if (draft.logoSize || defaults.logoSize) {
            lines.push('.main-nav__logo img { height: ' + cv(draft, defaults, 'logoSize') + 'px; width: auto; }');
        }
        return lines.join('\n');
    }

    function buildHomepageSpec(draft, defaults, pkgId) {
        var spec = {
            template: 'woolf',
            packageId: pkgId,
            exportedAt: new Date().toISOString(),
            branding: {
                companyName: cv(draft, defaults, 'companyName'),
                phone: cv(draft, defaults, 'phone'),
                logoSrc: cv(draft, defaults, 'logoSrc'),
                logoUrl: cv(draft, defaults, 'logoUrl'),
                logoSize: cv(draft, defaults, 'logoSize'),
                faviconSrc: cv(draft, defaults, 'faviconSrc'),
            },
            colors: {},
            typography: {
                fontFamily: 'Inter',
                googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
                weights: [400, 500, 600, 700],
            },
            heroSlides: draft.heroSlides || [],
            shopCategories: draft.shopCategories || [],
            shopBrands: draft.shopBrands || [],
            catalogItems: draft.catalogItems || [],
            sectionVisibility: {
                ctaVisible: cv(draft, defaults, 'ctaVisible'),
                qoVisible: cv(draft, defaults, 'qoVisible'),
            },
            footer: {},
        };
        COLOR_KEYS.forEach(function (key) {
            spec.colors[key] = cv(draft, defaults, key);
        });
        Object.keys(defaults).forEach(function (key) {
            if (key.indexOf('footer') === 0 && draft[key] !== undefined) {
                spec.footer[key] = draft[key];
            } else if (key.indexOf('footer') === 0) {
                spec.footer[key] = defaults[key];
            }
        });
        return spec;
    }

    function buildHandoffReadme() {
        return [
            'THE WOOLF — PREMIUM HANDOFF PACKAGE',
            '===================================',
            '',
            'START HERE',
            '----------',
            '  1. woolf-homepage-brief.pdf   — Developer brief (colors, previews, asset list)',
            '  2. WELCOME-GUIDE.html         — Client-facing install guide (open in browser)',
            '  3. HANDOFF-README.txt         — This file',
            '',
            'XO PASTE ORDER',
            '--------------',
            '  Step 1: global-head-snippet.html  →  Meta Data, JavaScript & CSS (Global)',
            '  Step 2: header-block.html           →  Header',
            '  Step 3: sections/hero/hero-block.html',
            '  Step 4: sections/section-one/section-one-block.html  (categories + brands)',
            '  Step 5: sections/section-two/section-two-block.html   (about)',
            '  Step 6: sections/section-three/section-three-block.html (catalog library)',
            '  Step 7: sections/section-four/section-four-block.html (CTA + quick order)',
            '  Step 8: sections/footer/footer-block.html',
            '',
            'SERVER UPLOADS (File Manager / FTP)',
            '-----------------------------------',
            '  Upload the entire data/ folder to your server root:',
            '    data/css/       →  /data/css/',
            '    data/js/        →  /data/js/',
            '    data/images/    →  /data/images/',
            '    data/catalogs/  →  /data/catalogs/  (if present)',
            '',
            'DEVELOPER REFERENCE',
            '-------------------',
            '  spec/homepage-spec.json   — Machine-readable configuration',
            '  spec/design-tokens.css    — Color and typography tokens',
            '  homepage.html             — Full assembled page for local preview',
            '',
            'Generated by LogicX Designer Editor — ' + new Date().toLocaleDateString(),
        ].join('\n');
    }

    function sectionReadme(title, pasteTarget, deps) {
        return [
            title.toUpperCase(),
            '='.repeat(title.length),
            '',
            'Paste target: ' + pasteTarget,
            '',
            'Required assets:',
        ].concat(deps.map(function (d) { return '  - ' + d; })).concat([
            '',
            'Copy the HTML from the *-block.html file in this folder and paste into your XO template section.',
        ]).join('\n');
    }

    async function resolveAssets(zip, fetchBase, htmlParts, draft, pathMap, assetInventory) {
        var pending = [];
        var seen = {};

        function register(original, zipPath, usedIn) {
            if (!original || !zipPath || seen[original]) return;
            seen[original] = true;
            var server = serverPathFromZipPath(zipPath);
            pathMap[original] = server;
            if (original.indexOf('data/') === 0) pathMap['/' + original] = server;
            if (original.charAt(0) === '/' && original.indexOf('/data/') === 0) {
                pathMap[original.slice(1)] = server;
            }
            assetInventory.push({ original: original, zipPath: zipPath, serverPath: server, usedIn: usedIn || '' });
        }

        collectDraftAssetRefs(draft).forEach(function (item) {
            var zp = guessZipPath(item.ref, item.hint);
            if (zp) register(item.ref, zp, 'draft');
        });

        htmlParts.forEach(function (html) {
            extractUrlsFromHtml(html).forEach(function (ref) {
                var norm = normalizeAssetRef(ref);
                if (norm && !seen[ref] && !seen[norm]) {
                    register(ref, norm, 'html');
                    if (ref !== norm) register(norm, norm, 'html');
                }
            });
        });

        STATIC_ICON_PATHS.forEach(function (p) {
            register(p, p, 'icons');
        });

        var fetchedZipPaths = {};
        Object.keys(pathMap).forEach(function (original) {
            var zipPath = pathMap[original].replace(/^\//, '');
            if (fetchedZipPaths[zipPath]) return;
            fetchedZipPaths[zipPath] = true;
            if (original.indexOf('data:') === 0) {
                pending.push(Promise.resolve().then(function () {
                    dataUrlToZip(zip, original, zipPath);
                }));
            } else {
                var fetchPath = original.replace(/^\//, '');
                var url = fetchBase + fetchPath;
                pending.push(
                    fetchBlob(url).then(function (blob) {
                        zip.file(zipPath, blob);
                    }).catch(function () {
                        return fetchText(url).then(function (text) {
                            zip.file(zipPath, text);
                        });
                    }).catch(function () { /* optional asset missing */ })
                );
            }
        });

        await Promise.all(pending);
        return pathMap;
    }

    async function generatePdfBrief(options) {
        var JsPDF = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : window.jsPDF;
        if (typeof html2canvas !== 'function' || !JsPDF) {
            return null;
        }

        var iframeDoc = options.iframeDoc;
        var draft = options.draft;
        var defaults = options.defaults;
        var assetInventory = options.assetInventory || [];
        var companyName = cv(draft, defaults, 'companyName');
        var pkgId = options.packageId;
        var margin = 48;
        var doc = new JsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
        var pageW = doc.internal.pageSize.getWidth();
        var pageH = doc.internal.pageSize.getHeight();
        var contentW = pageW - margin * 2;
        var y = margin;

        function ensureSpace(needed) {
            if (y + needed > pageH - margin) {
                doc.addPage();
                y = margin;
            }
        }

        function writeLines(lines, size, color, gap) {
            size = size || 10;
            gap = gap || 8;
            color = color || [30, 30, 30];
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(size);
            doc.setTextColor(color[0], color[1], color[2]);
            (Array.isArray(lines) ? lines : [lines]).forEach(function (line) {
                var wrapped = doc.splitTextToSize(String(line), contentW);
                ensureSpace(wrapped.length * (size + 4) + gap);
                doc.text(wrapped, margin, y);
                y += wrapped.length * (size + 4);
            });
            y += gap;
        }

        function writeHeading(text) {
            ensureSpace(28);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.setTextColor(13, 33, 55);
            doc.text(text, margin, y);
            y += 24;
        }

        // Cover
        doc.setFillColor(8, 21, 37);
        doc.rect(0, 0, pageW, pageH, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28);
        doc.text('The Woolf', margin, 120);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Homepage Developer Brief', margin, 148);
        doc.text(companyName, margin, 200);
        doc.setFontSize(10);
        doc.text('Package ID: ' + pkgId, margin, pageH - 80);
        doc.text('Issued: ' + new Date().toLocaleDateString(), margin, pageH - 64);
        doc.addPage();
        y = margin;

        writeHeading('Design tokens — colors');
        COLOR_KEYS.forEach(function (key) {
            var val = cv(draft, defaults, key);
            if (!val) return;
            ensureSpace(18);
            doc.setFillColor(val);
            doc.rect(margin, y - 10, 14, 14, 'F');
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(30, 30, 30);
            doc.text((COLOR_LABELS[key] || key) + ': ' + val, margin + 22, y);
            y += 18;
        });
        y += 12;

        writeHeading('Typography');
        writeLines([
            'Font family: Inter (Google Fonts)',
            'URL: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            'Weights used: 400, 500, 600, 700',
        ], 10);

        writeHeading('XO install checklist');
        [
            '1. Upload data/ folder to server root',
            '2. Paste global-head-snippet.html → Meta Data, JavaScript & CSS (Global)',
            '3. Paste header-block.html → Header',
            '4. Paste sections/hero/hero-block.html → Section One (hero)',
            '5. Paste sections/section-one/section-one-block.html → Section One (categories + brands)',
            '6. Paste sections/section-two/section-two-block.html → Section Two',
            '7. Paste sections/section-three/section-three-block.html → Section Three',
            '8. Paste sections/section-four/section-four-block.html → Section Four',
            '9. Paste sections/footer/footer-block.html → Footer',
        ].forEach(function (line) { writeLines(line, 9); });

        var captureSections = [
            { label: 'Hero slideshow', selector: '.section-one', clip: function (el) { return el; } },
            { label: 'About us', selector: '.section-two' },
            { label: 'Catalog library', selector: '.section-three' },
            { label: 'CTA + Quick order', selector: '.section-four' },
            { label: 'Footer', selector: '.site-footer' },
        ];

        for (var i = 0; i < captureSections.length; i++) {
            var cap = captureSections[i];
            var el = iframeDoc.querySelector(cap.selector);
            if (!el) continue;
            try {
                var canvas = await html2canvas(el, {
                    scale: 1,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                });
                doc.addPage();
                y = margin;
                writeHeading('Preview — ' + cap.label);
                var imgData = canvas.toDataURL('image/jpeg', 0.92);
                var maxW = contentW;
                var maxH = pageH - margin * 2 - 30;
                var ratio = Math.min(maxW / canvas.width, maxH / canvas.height, 1);
                var drawW = canvas.width * ratio;
                var drawH = canvas.height * ratio;
                doc.addImage(imgData, 'JPEG', margin, y, drawW, drawH);
            } catch (err) {
                console.warn('[woolf export] Section capture failed:', cap.label, err);
            }
        }

        doc.addPage();
        y = margin;
        writeHeading('Asset inventory');
        if (!assetInventory.length) {
            writeLines('No bundled assets — template defaults only.', 9);
        } else {
            assetInventory.slice(0, 80).forEach(function (asset) {
                writeLines(asset.serverPath + (asset.usedIn ? ' (' + asset.usedIn + ')' : ''), 8, [60, 60, 60], 4);
            });
            if (assetInventory.length > 80) {
                writeLines('… and ' + (assetInventory.length - 80) + ' more (see spec/homepage-spec.json)', 8);
            }
        }

        return doc.output('blob');
    }

    async function exportWoolfHandoff(options) {
        var iframeDoc = options.iframeDoc;
        var draft = options.draft || {};
        var defaults = options.defaults || {};
        var fetchBase = options.fetchBase || '../designer_editor/woolf/';
        var buildWelcomeGuide = options.buildWelcomeGuide;
        var buildGlobalHeadSnippet = options.buildGlobalHeadSnippet;
        var buildHeaderBlock = options.buildHeaderBlock;
        var inlineIconSvgs = options.inlineIconSvgs || function (h) { return h; };

        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip not loaded.');
        }
        if (!iframeDoc) {
            throw new Error('Preview not ready.');
        }

        var zip = new JSZip();
        var pathMap = {};
        var assetInventory = [];
        var pkgId = 'WLF-' + Date.now().toString(36).toUpperCase().slice(-6);

        var htmlContent = '<!DOCTYPE html>\n' + iframeDoc.documentElement.outerHTML;
        htmlContent = stripDesignerOnlyFromHtml(htmlContent);

        var heroHtml = extractHeroBlock(iframeDoc);
        var sectionOneHtml = extractSectionOneBlock(iframeDoc);
        var sectionTwoHtml = extractSectionBlock(
            iframeDoc, '.section-two', 'Section Two — About',
            'Paste into XO Section Two. Requires /data/css/section-two.css'
        );
        var sectionThreeHtml = extractSectionBlock(
            iframeDoc, '.section-three', 'Section Three — Catalog Library',
            'Paste into XO Section Three. Requires /data/css/section-three.css and /data/js/section-three.js'
        );
        var sectionFourHtml = extractSectionBlock(
            iframeDoc, '.section-four', 'Section Four — CTA + Quick Order',
            'Paste into XO Section Four. Requires /data/css/section-four.css'
        );
        var footerEl = iframeDoc.querySelector('footer.site-footer');
        var footerHtml = footerEl ? [
            '<!-- The Woolf — Footer Block | LogicX Designer Editor · ' + new Date().toLocaleDateString() + ' -->',
            '<!-- Paste into XO Footer. Requires /data/css/footer.css -->',
            '',
            footerEl.outerHTML,
        ].join('\n') : '';

        var globalHtml = buildGlobalHeadSnippet ? buildGlobalHeadSnippet() : '';
        var headerHtml = buildHeaderBlock ? buildHeaderBlock() : '';
        var welcomeHtml = buildWelcomeGuide ? buildWelcomeGuide() : '';

        headerHtml = stripDesignerOnlyFromHtml(headerHtml);
        headerHtml = inlineIconSvgs(headerHtml);

        var htmlParts = [htmlContent, heroHtml, sectionOneHtml, sectionTwoHtml, sectionThreeHtml, sectionFourHtml, footerHtml, headerHtml, globalHtml];

        await resolveAssets(zip, fetchBase, htmlParts, draft, pathMap, assetInventory);

        htmlContent = replaceAllPaths(htmlContent, pathMap);
        heroHtml = replaceAllPaths(heroHtml, pathMap);
        sectionOneHtml = replaceAllPaths(sectionOneHtml, pathMap);
        sectionTwoHtml = replaceAllPaths(sectionTwoHtml, pathMap);
        sectionThreeHtml = replaceAllPaths(sectionThreeHtml, pathMap);
        sectionFourHtml = replaceAllPaths(sectionFourHtml, pathMap);
        footerHtml = replaceAllPaths(footerHtml, pathMap);
        headerHtml = replaceAllPaths(headerHtml, pathMap);
        globalHtml = replaceAllPaths(globalHtml, pathMap);
        welcomeHtml = replaceAllPaths(welcomeHtml, pathMap);

        htmlContent = stripDesignerOnlyFromHtml(htmlContent);

        var cssResults = await Promise.all(CSS_FILES.map(function (f) {
            return fetchText(fetchBase + f).then(function (text) { return { path: f, text: text }; });
        }));
        var jsResults = await Promise.all(JS_FILES.map(function (f) {
            return fetchText(fetchBase + f).then(function (text) { return { path: f, text: text }; })
                .catch(function () { return null; });
        }));

        cssResults.forEach(function (item) {
            if (item) zip.file(item.path, item.text);
        });
        jsResults.forEach(function (item) {
            if (item) zip.file(item.path, item.text);
        });

        var pdfBlob = await generatePdfBrief({
            iframeDoc: iframeDoc,
            draft: draft,
            defaults: defaults,
            assetInventory: assetInventory,
            packageId: pkgId,
        });
        if (pdfBlob) {
            zip.file('woolf-homepage-brief.pdf', pdfBlob);
        }

        zip.file('WELCOME-GUIDE.html', welcomeHtml);
        zip.file('HANDOFF-README.txt', buildHandoffReadme());
        zip.file('global-head-snippet.html', globalHtml);
        zip.file('header-block.html', headerHtml);
        zip.file('homepage.html', htmlContent);

        zip.file('sections/hero/README.txt', sectionReadme('Hero', 'XO Section One — hero area', [
            '/data/css/section-one.css', '/data/js/section-one.js', '/data/images/hero/',
        ]));
        zip.file('sections/hero/hero-block.html', heroHtml);

        zip.file('sections/section-one/README.txt', sectionReadme('Section One', 'XO Section One — below hero', [
            '/data/css/section-one.css', '/data/images/category/', '/data/images/brands/',
        ]));
        zip.file('sections/section-one/section-one-block.html', sectionOneHtml);

        zip.file('sections/section-two/README.txt', sectionReadme('Section Two', 'XO Section Two — about block', [
            '/data/css/section-two.css', '/data/images/about/',
        ]));
        zip.file('sections/section-two/section-two-block.html', sectionTwoHtml);
        zip.file('sections/section-three/README.txt', sectionReadme('Section Three', 'XO Section Three — catalog library', [
            '/data/css/section-three.css', '/data/js/section-three.js', '/data/images/pdf/', '/data/catalogs/',
        ]));
        zip.file('sections/section-three/section-three-block.html', sectionThreeHtml);
        zip.file('sections/section-four/README.txt', sectionReadme('Section Four', 'XO Section Four — CTA + quick order', [
            '/data/css/section-four.css',
        ]));
        zip.file('sections/section-four/section-four-block.html', sectionFourHtml);

        zip.file('sections/footer/README.txt', sectionReadme('Footer', 'XO Footer section', [
            '/data/css/footer.css', '/data/images/footer/', '/data/images/icons/social/',
        ]));
        zip.file('sections/footer/footer-block.html', footerHtml);

        zip.file('spec/homepage-spec.json', JSON.stringify(buildHomepageSpec(draft, defaults, pkgId), null, 2));
        zip.file('spec/design-tokens.css', buildDesignTokensCss(draft, defaults));
        zip.file('spec/README.txt', [
            'Developer specification files',
            '=============================',
            '',
            'homepage-spec.json  — Full draft configuration (JSON)',
            'design-tokens.css   — Color and typography tokens for reference',
        ].join('\n'));

        return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
    }

    window.exportWoolfHandoff = exportWoolfHandoff;
})();
