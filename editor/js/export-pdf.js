/**
 * Build Showroom homepage developer handoff: PDF + image files in a ZIP.
 * Requires showroom-capture.js, jspdf, and JSZip.
 */
window.exportShowroomHandoff = async function exportShowroomHandoff(options) {
    const {
        headerEl,
        heroEl,
        categoriesEl,
        aboutEl,
        featureTilesEl,
        youMayLikeEl,
        getInspiredEl,
        footerEl,
        copyrightEl,
        galleryCatalogEl,
        sketchEl,
        spotlightSections = [],
        spec,
        assets = [],
        pdfFilename = 'showroom-homepage-brief.pdf',
        zipFilename = 'showroom-homepage-handoff.zip',
        guideMeta = {},
        onProgress,
    } = options;

    const isGallery = spec?.design === 'gallery';
    const isMcQueen = spec?.design === 'classic';
    const isSpotlight = spec?.design === 'spotlight';
    /** Classic (gallery) + McQueen share the support-agent FTP/CMS package shape. */
    const isSupportHandoff = isGallery || isMcQueen;
    /**
     * Support package layout:
     *   data/logicx/{css,js,images}  — FTP only
     *   html/ + meta-data-*.html  — CMS paste (ZIP parent, not FTP)
     */
    const GALLERY_PACKAGE_ROOT = 'data/logicx';
    const GALLERY_SERVER_ROOT = '/data/logicx';
    const GALLERY_CSS_ZIP_DIR = `${GALLERY_PACKAGE_ROOT}/css`;
    const GALLERY_JS_ZIP_DIR = `${GALLERY_PACKAGE_ROOT}/js`;
    const GALLERY_IMAGES_ZIP_DIR = `${GALLERY_PACKAGE_ROOT}/images`;
    const GALLERY_HTML_ZIP_DIR = 'html';
    const GALLERY_META_SNIPPET_ZIP = 'meta-data-global-css-snippet.html';
    const GALLERY_CSS_SERVER = `${GALLERY_SERVER_ROOT}/css`;
    const GALLERY_JS_SERVER = `${GALLERY_SERVER_ROOT}/js`;
    const GALLERY_IMAGES_SERVER = `${GALLERY_SERVER_ROOT}/images`;
    const GALLERY_NAV_JS_ZIP = `${GALLERY_JS_ZIP_DIR}/gallery-nav.js`;
    const GALLERY_NAV_JS_SERVER = `${GALLERY_JS_SERVER}/gallery-nav.js`;
    const resolvedHandoffAssets = assets.filter(
        (asset) => asset.dataUrl && String(asset.dataUrl).startsWith('data:'),
    );

    const handoffGuide = window.ShowroomHandoffGuide || {};
    const classicAssetVersionApi = window.ShowroomClassicAssetVersion || null;
    const exportedAt = new Date();
    const packageId = guideMeta.packageId
        || (handoffGuide.buildPackageId ? handoffGuide.buildPackageId() : `SHR-${Date.now().toString(36).toUpperCase().slice(-6)}`);
    const handoffVersion = guideMeta.handoffVersion
        || (handoffGuide.buildHandoffVersion
            ? handoffGuide.buildHandoffVersion(exportedAt)
            : exportedAt.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14));
    const galleryAssetVersion = classicAssetVersionApi
        ? classicAssetVersionApi.normalize(guideMeta.assetVersion ?? guideMeta.galleryAssetVersion)
        : Math.max(0, parseInt(guideMeta.assetVersion ?? guideMeta.galleryAssetVersion, 10) || 0);
    const galleryAssetQuery = `?v${galleryAssetVersion}`;
    const withGalleryAssetQuery = (url) => {
        const base = String(url || '').split('?')[0];
        return base ? `${base}${galleryAssetQuery}` : galleryAssetQuery;
    };
    const withVersion = (filename) => (
        handoffGuide.withHandoffVersion
            ? handoffGuide.withHandoffVersion(filename, handoffVersion)
            : String(filename || '').replace(/(\.[^.]+)$/, `-${handoffVersion}$1`)
    );
    const versionedPdfFilename = withVersion(pdfFilename);
    const versionedZipFilename = withVersion(zipFilename);
    const coverMeta = {
        companyName: guideMeta.companyName || spec?.footer?.companyName || spec?.copyright?.companyName || 'Your Showroom',
        templateLabel: guideMeta.templateLabel || spec?.template || 'Showroom',
        design: guideMeta.design || spec?.design || 'classic',
        packageId,
        handoffVersion,
        logoDataUrl: guideMeta.logoDataUrl || '',
        pdfFilename: versionedPdfFilename,
        hasHandoffImages: resolvedHandoffAssets.length > 0,
    };

    function assetIncludedInHandoff(filename) {
        return resolvedHandoffAssets.some((asset) => asset.filename === filename);
    }

    function galleryHandoffImageLine(filename, defaultLabel) {
        return assetIncludedInHandoff(filename)
            ? `Yes — ${filename}`
            : `No — template default (${defaultLabel})`;
    }

    function galleryHandoffAssetListLine(prefix) {
        const matches = resolvedHandoffAssets
            .map((asset) => asset.filename)
            .filter((filename) => filename && filename.startsWith(prefix));
        if (!matches.length) {
            return 'No — template defaults (source separately)';
        }
        return `Yes — ${matches.join(', ')}`;
    }

    function spotlightHandoffImageLine(filename, defaultLabel) {
        return galleryHandoffImageLine(filename, defaultLabel);
    }

    function spotlightHandoffAssetListLine(prefix) {
        return galleryHandoffAssetListLine(prefix);
    }

    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if (typeof html2canvas !== 'function' || !JsPDF) {
        throw new Error('PDF libraries not loaded.');
    }
    if (typeof JSZip === 'undefined') {
        throw new Error('JSZip not loaded.');
    }
    if (!window.ShowroomCapture?.captureElement || !window.ShowroomCapture?.isCapturable) {
        throw new Error('Showroom capture utilities not loaded.');
    }

    const { captureElement, isCapturable } = window.ShowroomCapture;

    const doc = new JsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
    const margin = 48;
    const labelColW = 210;
    const specColGap = 12;
    const previewEdge = 28;
    const previewLabelH = 12;
    let pageW = doc.internal.pageSize.getWidth();
    let pageH = doc.internal.pageSize.getHeight();
    let contentW = pageW - margin * 2;
    let pageOrientation = 'p';
    let y = margin;

    function syncPageMetrics() {
        pageW = doc.internal.pageSize.getWidth();
        pageH = doc.internal.pageSize.getHeight();
        contentW = pageW - margin * 2;
    }

    function addFormattedPage(orientation) {
        doc.addPage('letter', orientation);
        pageOrientation = orientation;
        y = margin;
        syncPageMetrics();
    }

    function lineHeight(fontSize) {
        return Math.ceil(fontSize * 1.4);
    }

    function textBlockHeight(lines, fontSize) {
        const count = Array.isArray(lines) ? lines.length : 1;
        return count * lineHeight(fontSize);
    }

    function ensureSpace(needed, bottomMargin = margin) {
        if (y + needed > pageH - bottomMargin) {
            addFormattedPage(pageOrientation);
        }
    }

    function parseDimensions(dimensions) {
        const match = String(dimensions || '').match(/(\d+)\s*×\s*(\d+)/i);
        if (!match) return null;
        return { width: Number(match[1]), height: Number(match[2]) };
    }

    function fitImageInBox(imgW, imgH, boxW, boxH) {
        if (!imgW || !imgH) {
            return { width: boxW, height: boxH, scale: 1 };
        }
        const scale = Math.min(boxW / imgW, boxH / imgH);
        return {
            width: imgW * scale,
            height: imgH * scale,
            scale,
        };
    }

    function fitCanvasInBox(canvas, boxW, boxH) {
        const aspect = canvas.width / canvas.height;
        let drawW = boxW;
        let drawH = drawW / aspect;
        if (drawH > boxH) {
            drawH = boxH;
            drawW = drawH * aspect;
        }
        return { drawW, drawH };
    }

    function loadImageMetrics(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
            img.onerror = () => reject(new Error('Image failed to load for PDF.'));
            img.src = dataUrl;
        });
    }

    function drawFramedImage(dataUrl, format, x, yPos, width, height) {
        const pad = 1;
        doc.setDrawColor(210, 214, 220);
        doc.setLineWidth(0.75);
        doc.rect(x - pad, yPos - pad, width + pad * 2, height + pad * 2);
        doc.addImage(dataUrl, format, x, yPos, width, height, undefined, 'SLOW');
    }

    function writeLines(text, opts = {}) {
        const {
            bold = false,
            size = 10,
            color = [0, 0, 0],
            indent = 0,
            gap = 8,
            maxWidth = contentW - indent,
        } = opts;

        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);

        const safeText = pdfAscii(text);
        const lines = doc.splitTextToSize(safeText, Math.max(24, maxWidth));
        const blockH = textBlockHeight(lines, size);
        ensureSpace(blockH + gap);
        doc.text(lines, margin + indent, y);
        y += blockH + gap;
    }

    function writeSectionTitle(title) {
        ensureSpace(44);
        if (y > margin + 24) {
            y += 8;
        }
        writeLines(title, { bold: true, size: 13, gap: 4 });
        doc.setDrawColor(201, 169, 110);
        doc.setLineWidth(1.25);
        doc.line(margin, y, margin + 48, y);
        y += 12;
    }

    function writeSubsectionTitle(title) {
        ensureSpace(28);
        writeLines(title, { bold: true, size: 11, gap: 6 });
    }

    function writeCodeBlock(code, opts = {}) {
        const {
            size = 8,
            gap = 12,
            pad = 10,
            maxWidth = contentW - pad * 2,
        } = opts;
        const codeText = pdfAscii(String(code || '').trim() || '-');

        doc.setFont('courier', 'normal');
        doc.setFontSize(size);
        doc.setTextColor(20, 20, 20);

        const lines = doc.splitTextToSize(codeText, maxWidth);
        const blockH = textBlockHeight(lines, size) + pad * 2;
        ensureSpace(blockH + gap);

        doc.setDrawColor(220, 224, 230);
        doc.setFillColor(248, 249, 251);
        doc.setLineWidth(0.75);
        doc.rect(margin, y, contentW, blockH, 'FD');
        doc.text(lines, margin + pad, y + pad + lineHeight(size) - 2);
        y += blockH + gap;
    }

    /**
     * jsPDF Helvetica is WinAnsi-only. Unicode arrows/dashes/quotes corrupt glyphs
     * (often shown as "!" and oddly spaced letters). Keep PDF text ASCII-safe.
     */
    function pdfAscii(text) {
        return String(text ?? '')
            .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
            .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
            .replace(/\u2026/g, '...')
            .replace(/[\u2013\u2014]/g, ' - ')
            .replace(/\u2192/g, '->')
            .replace(/\u00b7/g, ' | ')
            .replace(/\u00a0/g, ' ')
            .replace(/[^\t\n\r\x20-\x7E]/g, '');
    }

    function writeSpecRows(rows) {
        const valueColW = contentW - labelColW - specColGap;

        for (const [label, value] of rows) {
            const labelLines = doc.splitTextToSize(`${pdfAscii(label)}:`, labelColW);
            const valueLines = doc.splitTextToSize(pdfAscii(value ?? '-'), valueColW);
            const labelH = textBlockHeight(labelLines, 10);
            const valueH = textBlockHeight(valueLines, 10);
            const rowH = Math.max(labelH, valueH) + 8;
            ensureSpace(rowH);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(34, 47, 54);
            doc.text(labelLines, margin, y);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(45, 55, 65);
            doc.text(valueLines, margin + labelColW + specColGap, y);

            y += rowH;
        }
    }

    function writeItemList(items, formatLine) {
        items.forEach((item, index) => {
            writeLines(formatLine(item, index), { size: 9, color: [70, 70, 70], gap: 6 });
        });
    }

    /** jsPDF built-in fonts are WinAnsi - use ASCII arrows, not Unicode */
    function pdfLinkLine(label, url, suffix = '') {
        const safeLabel = pdfAscii(String(label || '-').trim() || '-');
        const safeUrl = pdfAscii(String(url || '-').trim() || '-');
        return suffix ? `${safeLabel}  ${safeUrl}  ${suffix}` : `${safeLabel}  ${safeUrl}`;
    }

    /**
     * Aligned label/URL rows for nav and link groups.
     * Keeps hierarchy readable: label column + URL column.
     */
    function writeDefinitionRows(rows, opts = {}) {
        const indent = opts.indent || 0;
        const labelW = opts.labelW || 150;
        const size = opts.size || 9;
        const gap = opts.gap == null ? 5 : opts.gap;
        const labelColor = opts.labelColor || [90, 100, 110];
        const valueColor = opts.valueColor || [34, 47, 54];
        const valueX = margin + indent + labelW + 10;
        const valueW = Math.max(40, contentW - indent - labelW - 10);

        (rows || []).forEach(([label, value]) => {
            const labelLines = doc.splitTextToSize(pdfAscii(label || '-'), labelW);
            const valueLines = doc.splitTextToSize(pdfAscii(value ?? '-'), valueW);
            const rowH = Math.max(textBlockHeight(labelLines, size), textBlockHeight(valueLines, size)) + gap;
            ensureSpace(rowH);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(size);
            doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
            doc.text(labelLines, margin + indent, y);

            doc.setTextColor(valueColor[0], valueColor[1], valueColor[2]);
            doc.text(valueLines, valueX, y);

            y += rowH;
        });
    }

    function writeMainNavCatalog(navItems, opts = {}) {
        const items = Array.isArray(navItems) ? navItems : [];
        if (!items.length) return;
        const includeHidden = opts.includeHidden === true;

        writeSubsectionTitle(opts.title || 'Main navigation');
        writeLines(
            opts.intro
                || 'Top-level categories with dropdown subcategories. Parent URL is the category landing page; listed children are the dropdown links.',
            { size: 9, color: [90, 100, 110], gap: 12 },
        );

        items.forEach((item, index) => {
            const label = String(item.label || 'Category').trim() || 'Category';
            const url = String(item.url || '').trim();
            const allSubs = Array.isArray(item.subcategories) ? item.subcategories : [];
            const subs = includeHidden
                ? allSubs
                : allSubs.filter((sub) => sub.visible !== false);

            if (index > 0) {
                y += 8;
            }
            ensureSpace(56);

            // Category band
            const bandH = 22;
            doc.setFillColor(245, 247, 249);
            doc.setDrawColor(226, 232, 238);
            doc.setLineWidth(0.6);
            doc.rect(margin, y - 4, contentW, bandH, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(34, 47, 54);
            doc.text(pdfAscii(label), margin + 8, y + 10);
            y += bandH + 6;

            writeDefinitionRows([
                ['Parent URL', url || '(none)'],
            ], { indent: 8, labelW: 88, size: 9, gap: 4 });

            if (subs.length) {
                writeLines('Subcategories', {
                    bold: true,
                    size: 9,
                    indent: 8,
                    gap: 4,
                    color: [70, 80, 90],
                });
                writeDefinitionRows(
                    subs.map((sub) => {
                        const subLabel = String(sub.label || '-').trim() || '-';
                        const subUrl = String(sub.url || '-').trim() || '-';
                        const status = includeHidden && sub.visible === false ? '  (hidden)' : '';
                        return [subLabel, `${subUrl}${status}`];
                    }),
                    {
                        indent: 16,
                        labelW: 150,
                        size: 9,
                        gap: 4,
                        labelColor: [55, 65, 75],
                        valueColor: [34, 47, 54],
                    },
                );
            } else {
                writeLines('No subcategories configured.', {
                    size: 9,
                    indent: 8,
                    gap: 4,
                    color: [120, 130, 140],
                });
            }
        });

        y += 6;
    }

    function writeSubcategoryList(items, formatLine) {
        items.forEach((item, index) => {
            const text = pdfAscii(String(formatLine(item, index)));
            const size = 8;
            doc.setFont('courier', 'normal');
            doc.setFontSize(size);
            doc.setTextColor(70, 70, 70);

            const lines = doc.splitTextToSize(text, contentW);
            const blockH = textBlockHeight(lines, size);
            ensureSpace(blockH + 6);
            doc.text(lines, margin, y);
            y += blockH + 6;
        });
    }

    function writePreviewLabel(heading) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(90, 90, 90);
        doc.text(pdfAscii(heading), previewEdge, previewEdge + 8);
    }

    async function appendCanvasPreview(canvas, heading) {
        addFormattedPage('l');
        syncPageMetrics();

        const boxW = pageW - previewEdge * 2;
        const boxH = pageH - previewEdge * 2 - previewLabelH - 6;
        const { drawW, drawH } = fitCanvasInBox(canvas, boxW, boxH);
        const drawX = previewEdge + (boxW - drawW) / 2;
        const drawY = previewEdge + previewLabelH + 6;

        writePreviewLabel(heading);
        drawFramedImage(canvas.toDataURL('image/png'), 'PNG', drawX, drawY, drawW, drawH);
    }

    async function appendAssetPage(asset) {
        if (!asset.dataUrl) return;

        addFormattedPage('p');
        syncPageMetrics();

        const captionReserve = 22;
        const assetPad = 32;
        const imageBoxW = contentW;
        const imageBoxH = pageH - assetPad * 2 - captionReserve;

        let imgW;
        let imgH;
        try {
            ({ width: imgW, height: imgH } = await loadImageMetrics(asset.dataUrl));
        } catch {
            const parsed = parseDimensions(asset.dimensions);
            imgW = parsed?.width || imageBoxW;
            imgH = parsed?.height || imageBoxH;
        }

        const { width: drawW, height: drawH } = fitImageInBox(imgW, imgH, imageBoxW, imageBoxH);
        const drawX = margin + (imageBoxW - drawW) / 2;
        const drawY = assetPad + Math.max(0, (imageBoxH - drawH) / 2);

        drawFramedImage(
            asset.dataUrl,
            detectImageFormat(asset.dataUrl),
            drawX,
            drawY,
            drawW,
            drawH,
        );

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        const caption = `${asset.filename}  |  ${asset.label}  |  ${asset.dimensions || '-'}`;
        const captionLines = doc.splitTextToSize(pdfAscii(caption), contentW);
        const captionBlockH = textBlockHeight(captionLines, 7);
        doc.text(captionLines, margin, pageH - assetPad - captionBlockH + lineHeight(7));
    }

    // ——— Branded cover page ———
    if (handoffGuide.appendShowroomPdfCover) {
        handoffGuide.appendShowroomPdfCover(doc, coverMeta);
        y = margin;
    }

    // ——— Spec pages ———
    writeLines('Showroom Homepage — Developer Handoff', { bold: true, size: 18, gap: 10 });
    writeLines(`Generated ${new Date().toLocaleString()}`, { size: 9, color: [90, 90, 90], gap: 14 });
    writeLines(
        'This PDF lists copy, links, and layout notes. Section layout previews follow on separate pages.',
        { size: 9, color: [90, 90, 90], gap: 6 },
    );
    writeLines(
        isGallery
            ? (resolvedHandoffAssets.length
                ? 'This Classic template handoff covers Header, Hero, Catalog Highlights, Footer, and Copyright. The header logo and any client-replaced images are included in the ZIP. Other template default images are shown in layout previews only.'
                : 'This Classic template handoff covers Header, Hero, Catalog Highlights, Footer, and Copyright. No image files could be resolved for export — check that editor/gallery assets are available.')
            : isSpotlight
                ? (resolvedHandoffAssets.length
                    ? 'This Spotlight template handoff covers Header, Hero, On Sale, Shop by Room, About Us, Categories, Brands, Newsletter, and Footer (with copyright + ADA bar). All handoff images are included in the ZIP and on dedicated PDF pages after the layout previews.'
                    : 'This Spotlight template handoff covers Header, Hero, On Sale, Shop by Room, About Us, Categories, Brands, Newsletter, and Footer (with copyright + ADA bar). Image files could not be resolved for export — check that spotlight/ assets are available.')
                : 'Handoff images include the header logo plus About Us, feature cards, You May Like, and Get Inspired photos (when configured). A separate footer logo is included only when it differs from the header. Hero images and featured category thumbnails are not bundled — source those on the live site.',
        { size: 9, color: [90, 90, 90], gap: 16 },
    );

    const copyrightForAda = spec.copyright || spec.footer || {};
    const footerForAda = spec.footer || {};
    const adaCompanyName = copyrightForAda.copyrightName
        || copyrightForAda.companyName
        || footerForAda.copyrightName
        || footerForAda.companyName
        || 'Company Name';
    const adaPasteMarkup = copyrightForAda.copyrightPasteMarkup
        || copyrightForAda.copyrightMarkup
        || footerForAda.copyrightPasteMarkup
        || footerForAda.copyrightMarkup
        || `<div id="rightCol"> &copy; ${new Date().getFullYear()} ${adaCompanyName} | All Rights Reserved <a ajax-popup="ada-compliance::ADA Compliance::600px">ADA Compliant</a></div>`;

    writeSectionTitle('Required — Footer ADA compliance (all websites)');
    writeLines(
        'Place the markup below at the very bottom of every website footer. This ADA compliance line is mandatory on all sites.',
        { size: 9, color: [140, 30, 30], gap: 8 },
    );
    writeLines(
        'Copy from the code block below or use spec/footer-copyright-snippet.html in the ZIP.',
        { size: 9, color: [90, 90, 90], gap: 8 },
    );
    writeSpecRows([
        ['Company name', adaCompanyName],
        ['Placement', 'Very bottom of footer on every page/site'],
        ['Popup attribute', copyrightForAda.adaCompliancePopup || footerForAda.adaCompliancePopup || 'ada-compliance::ADA Compliance::600px'],
    ]);
    writeLines('Copy-paste markup', { bold: true, size: 10, gap: 6 });
    writeCodeBlock(adaPasteMarkup);

    writeSectionTitle('Header');
    const header = spec.header || {};
    const headerBanner = header.banner || {};
    const headerToolbar = header.toolbar || {};
    const headerMainNav = header.mainNav || {};
    const headerBannerLinks = normalizeFooterLinksForExport(headerBanner.links);
    const headerMainNavItems = Array.isArray(headerMainNav.items) ? headerMainNav.items : [];
    if (isGallery) {
        const topBar = header.topBar || {};
        const utilities = topBar.utilities || {};
        const galleryNavItems = Array.isArray(header.mainNav?.items) ? header.mainNav.items : [];

        writeSubsectionTitle('Message bar');
        writeSpecRows([
            ['Sticky message bar', header.sticky === true
                ? 'Yes - pin message bar only (logo + main nav scroll away). Production: CSS position: sticky on the message bar only.'
                : 'No'],
            ['Sticky scope', header.stickyScope || 'message-bar-only'],
            ['Background color', topBar.backgroundColor || '-'],
            ['Text color', topBar.textColor || topBar.centerCopyColor || '-'],
            ['Center copy', topBar.centerCopy || '-'],
            ['Wishlist', pdfLinkLine(utilities.wishlist?.label, utilities.wishlist?.url)],
            ['Sign in', pdfLinkLine(utilities.signIn?.label, utilities.signIn?.url)],
        ]);

        writeSubsectionTitle('Primary header');
        writeSpecRows([
            ['Layout', header.layout || 'gallery'],
            ['Content column width', header.contentColumnWidth || '1440 px'],
            ['Header logo size', header.logoSizePx
                ? `${header.logoSizePx} px display height | width auto`
                : (header.logoDimensions || 'max 150 px high')],
            ['Header logo in handoff', galleryHandoffImageLine('header-logo.png', 'hardcoded in template')],
            ['Main nav alignment', header.mainNav?.alignment
                || 'desktop: logo left · nav · search | tablet ≤1100: logo above · nav + search centered | phone ≤700: logo · search · hamburger'],
            ['Dropdown menus', header.mainNav?.hasDropdowns !== false
                ? 'Yes - one dropdown per top-level category'
                : 'No'],
            ['Category count', galleryNavItems.length ? String(galleryNavItems.length) : '0'],
            ['Search bar', header.mainNav?.search?.hardcoded !== false
                ? `Hardcoded - placeholder "${header.mainNav?.search?.placeholder || 'Search...'}"`
                : '-'],
        ]);

        writeMainNavCatalog(galleryNavItems, {
            title: 'Main navigation',
            intro: 'Top-level categories with dropdown subcategories. Parent URL is the category landing page; listed children are the dropdown links shown under each category.',
        });
    } else if (isSpotlight) {
        const spotlightTopBar = header.topBar || {};
        const spotlightNavLinks = Array.isArray(header.mainNav?.items) ? header.mainNav.items : [];
        writeSpecRows([
            ['Layout', header.layout || 'spotlight'],
            ['Content column width', header.contentColumnWidth || '1479 px'],
            ['Top bar background', spotlightTopBar.backgroundColor || '—'],
            ['Top bar text', spotlightTopBar.textColor || '—'],
            ['Address line', spotlightTopBar.address || '—'],
            ['Phone line', spotlightTopBar.phone || '—'],
            ['Header logo size', header.logoSizePx
                ? `${header.logoSizePx} px display height · width auto`
                : (header.logoDimensions || 'max 220 × 68 px')],
            ['Header logo in handoff', spotlightHandoffImageLine('header-logo.png', 'hardcoded in template')],
            ['Search bar', header.toolbar?.searchBarHardcoded !== false
                ? `Hardcoded — placeholder “${header.toolbar?.searchPlaceholder || 'what can we find for you?'}”`
                : '—'],
            ['Toolbar icons', header.toolbar?.iconsHardcoded !== false ? 'Hardcoded — not editable in template' : '—'],
            ['Main navigation', header.mainNav?.editable !== false ? 'Editable in template editor' : '—'],
            ['Category count', spotlightNavLinks.length ? String(spotlightNavLinks.length) : '0'],
        ]);
        const spotlightBannerLinks = normalizeFooterLinksForExport(spotlightTopBar.links);
        if (spotlightBannerLinks.length) {
            writeLines('Top banner links', { bold: true, size: 10, gap: 4 });
            writeItemList(
                spotlightBannerLinks,
                (item) => `${item.label}: ${item.url || '—'}`,
            );
        }
        if (spotlightNavLinks.length) {
            writeMainNavCatalog(spotlightNavLinks, {
                title: 'Main navigation',
                intro: 'Top-level navigation links for the Spotlight template.',
            });
        }
    } else {
        writeSpecRows([
            ['Top banner height', headerBanner.height || '50 px'],
            ['Banner background', headerBanner.backgroundColor || '#000000'],
            ['Banner text', headerBanner.textColor || '#ffffff'],
            ['Banner alignment', headerBanner.alignment || 'right'],
            ['Link separator', headerBanner.separator || '|'],
        ]);
        if (headerBannerLinks.length) {
            writeLines('Top banner links', { bold: true, size: 10, gap: 4 });
            writeItemList(
                headerBannerLinks,
                (item) => `${item.label}: ${item.url || '—'}`,
            );
        }
        writeSpecRows([
            ['Content column width', header.contentColumnWidth || '1429 px'],
            ['Main toolbar layout', headerToolbar.layout || 'search left · logo center · icons right'],
            ['Search bar', headerToolbar.searchBarHardcoded !== false ? 'Hardcoded — not editable in template' : '—'],
            ['Search placeholder', headerToolbar.searchPlaceholder || 'Enter Keyword or Item#'],
            ['Search style', headerToolbar.searchStyle || 'Single bottom border underline'],
            ['Toolbar icons', headerToolbar.iconsHardcoded !== false ? 'Hardcoded — not editable in template' : '—'],
            ['Header logo size', header.logoSizePx
                ? `${header.logoSizePx} px display height · width auto`
                : (header.logoDimensions || 'max 220 × 68 px')],
            ['Header logo in handoff', galleryHandoffImageLine('header-logo.png', 'template default')],
            ['Footer uses header logo', header.logoSharedWithFooter !== false ? 'Yes' : 'No'],
        ]);
        const headerToolbarIcons = Array.isArray(headerToolbar.icons) ? headerToolbar.icons : [];
        if (headerToolbarIcons.length) {
            writeLines('Toolbar icons', { bold: true, size: 10, gap: 4 });
            writeItemList(
                headerToolbarIcons,
                (item) => pdfLinkLine(item.label || item.id, item.url),
            );
        }
        writeSpecRows([
            ['Main navigation', headerMainNav.editable !== false ? 'Editable in template editor' : '—'],
            ['Dropdown menus', headerMainNav.hasDropdowns !== false ? 'Yes — one per top-level item' : 'No'],
            ['Nav font size', headerMainNav.fontSize || '15 px'],
            ['Nav alignment', headerMainNav.alignment || 'Full content width · first category aligns with search · last category aligns with cart'],
            ['Category count', headerMainNavItems.length ? String(headerMainNavItems.length) : '0'],
            ['Subcategories pending', headerMainNav.subcategoriesPending ? 'Yes — some categories need links' : 'No'],
        ]);
        if (headerMainNavItems.length) {
            writeMainNavCatalog(headerMainNavItems, {
                title: 'Main navigation',
                includeHidden: true,
                intro: 'Top-level categories with dropdown subcategories. Parent URL is the category landing page; listed children are the dropdown links shown under each category. Hidden children are marked (hidden).',
            });
        }
    }

    writeSectionTitle('Hero');
    const galleryHero = spec.hero || {};
    const galleryHeroOverlay = galleryHero.primary?.overlay || {};
    const galleryHeroButton = galleryHeroOverlay.button || {};
    const galleryHeroSecondaryTopOverlay = galleryHero.secondaryTop?.overlay || {};
    const galleryHeroSecondaryBottomOverlay = galleryHero.secondaryBottom?.overlay || {};
    if (isGallery) {
        writeSpecRows([
            ['Layout', galleryHero.layout || 'split-lifestyle'],
            ['Hero size', `${galleryHero.width || '1440 px'} × ${galleryHero.height || '500 px'}`],
            ['Text backdrop', galleryHeroOverlay.backdrop || 'translucent charcoal text panel + left scrim'],
            ['Backdrop panel', galleryHeroOverlay.backdropTokens?.panelBackground || 'rgba(18, 16, 14, 0.52)'],
            ['Backdrop edge', galleryHeroOverlay.backdropTokens?.panelEdgeGradient || 'left charcoal fade'],
            ['Headline font', galleryHeroOverlay.headlineFont || "'Josefin Sans', sans-serif"],
            ['Headline style', galleryHeroOverlay.headlineStyle || 'medium tall sans-serif uppercase'],
            ['Headline weight', galleryHeroOverlay.headlineWeight || 500],
            ['Large image headline line 1', galleryHeroOverlay.headline?.[0] || '(hidden)'],
            ['Large image headline line 2', galleryHeroOverlay.headline?.[1] || '(hidden)'],
            ['Large image headline line 3', galleryHeroOverlay.headline?.[2] || '(hidden)'],
            ['Large image copy', galleryHeroOverlay.copy || '—'],
            ['Hero text color', galleryHeroOverlay.textColor || '#ffffff'],
            ['Shop button label', galleryHeroButton.label || '—'],
            ['Shop button link', galleryHeroButton.url || '—'],
            ['Shop button background', galleryHeroButton.backgroundColor || '#2b2b2b'],
            ['Shop button text', galleryHeroButton.textColor || '#ffffff'],
            ['Top right image heading', galleryHeroSecondaryTopOverlay.heading || '—'],
            ['Top right image link', galleryHeroSecondaryTopOverlay.url || '—'],
            ['Bottom right image heading', galleryHeroSecondaryBottomOverlay.heading || '—'],
            ['Bottom right image link', galleryHeroSecondaryBottomOverlay.url || '—'],
            ['Hero images in handoff', galleryHandoffAssetListLine('gallery-hero-')],
        ]);
    } else if (isSpotlight) {
        const spotlightHero = spec.hero || {};
        const spotlightSlides = Array.isArray(spotlightHero.slides) ? spotlightHero.slides : [];
        writeSpecRows([
            ['Layout', spotlightHero.layout || 'carousel'],
            ['Slide count', String(spotlightHero.slideCount || spotlightSlides.length || 0)],
            ['Hero images in handoff', spotlightHandoffAssetListLine('spotlight-hero-slide-')],
        ]);
        if (spotlightSlides.length) {
            writeLines('Carousel slides', { bold: true, size: 10, gap: 4 });
            writeItemList(
                spotlightSlides,
                (slide) => `${slide.index || '—'}. ${slide.imageFilename || '—'}`,
            );
        }
    } else {
        writeSpecRows([
            ['Collection title', spec.title],
            ['Description', spec.description],
            ['CTA button', spec.cta],
            ['CTA button visible', spec.heroCtaVisible !== false ? 'Yes' : 'No'],
            ['CTA button background', spec.heroCtaBackgroundColor || spec.copyBackgroundColor || '#44301f'],
            ['CTA button text', spec.heroCtaTextColor || '#ffffff'],
            ['Copy background', spec.copyBackgroundColor],
            ['Copy text', spec.copyTextColor || '—'],
            ['Hero images in handoff', 'No — upload separately'],
            ['Product image size', spec.productImageSize || '563 × 342 px'],
            ['Lifestyle image size', spec.lifestyleImageSize || '854 × 670 px min'],
        ]);
    }

    const aboutUs = spec.aboutUs || {};
    const featureTiles = spec.featureTiles || {};
    const youMayLike = spec.youMayLike || {};
    const getInspired = spec.getInspired || {};
    const primaryButton = aboutUs.primaryButton || {};
    const secondaryButton = aboutUs.secondaryButton || {};
    const featureLeft = featureTiles.left || {};
    const featureRight = featureTiles.right || {};
    const leftButton = featureLeft.button || {};
    const rightButton = featureRight.button || {};
    const youMayLikeItems = youMayLike.items || [];
    const getInspiredItems = getInspired.items || [];

    if (isGallery) {
        writeSectionTitle('Catalog Highlights');
        const catalogHighlights = spec.catalogHighlights || {};
        const catalogTiles = Array.isArray(catalogHighlights.tiles) ? catalogHighlights.tiles : [];
        writeSpecRows([
            ['Layout', catalogHighlights.layout || 'four-tile-row'],
            ['Alignment', catalogHighlights.alignment || '—'],
            ['Label style', catalogHighlights.labelStyle || '—'],
            ['Links to catalog', catalogHighlights.linksToCatalog !== false ? 'Yes' : 'No'],
            ['Tile images in handoff', galleryHandoffAssetListLine('gallery-catalog-tile-')],
        ]);
        if (catalogTiles.length) {
            writeSubsectionTitle('Catalog tiles');
            writeDefinitionRows(
                catalogTiles.map((tile) => [
                    String(tile.label || `Tile ${tile.index || ''}`).trim() || 'Tile',
                    String(tile.url || '-').trim() || '-',
                ]),
                { indent: 0, labelW: 170, size: 9, gap: 5 },
            );
        }
    } else if (isSpotlight) {
        const onSale = spec.onSale || {};
        writeSectionTitle('On Sale');
        writeSpecRows([
            ['Heading', onSale.heading || '—'],
            ['Image in handoff', spotlightHandoffImageLine('spotlight-on-sale.png', 'template default')],
        ]);

        const shopByRoom = spec.shopByRoom || {};
        const roomTiles = Array.isArray(shopByRoom.tiles) ? shopByRoom.tiles : [];
        writeSectionTitle('Shop by Room');
        writeSpecRows([
            ['Heading', shopByRoom.heading || '—'],
            ['Tile images in handoff', spotlightHandoffAssetListLine('spotlight-shop-by-room-')],
        ]);
        if (roomTiles.length) {
            writeItemList(roomTiles, (tile) => `${tile.index || '—'}. ${tile.label || '—'}: ${tile.url || '—'}`);
        }

        const spotlightAbout = spec.aboutUs || {};
        writeSectionTitle('About Us');
        writeSpecRows([
            ['Heading', spotlightAbout.heading || '—'],
            ['Copy', spotlightAbout.copy || '—'],
            ['Image in handoff', spotlightHandoffImageLine('spotlight-about.jpg', 'template default')],
        ]);

        const spotlightCategories = spec.categories || {};
        const categoryTiles = Array.isArray(spotlightCategories.tiles) ? spotlightCategories.tiles : [];
        writeSectionTitle('Categories');
        writeSpecRows([
            ['Heading', spotlightCategories.heading || '—'],
            ['Tile images in handoff', spotlightHandoffAssetListLine('spotlight-category-')],
        ]);
        if (categoryTiles.length) {
            writeItemList(categoryTiles, (tile) => `${tile.index || '—'}. ${tile.label || '—'}: ${tile.url || '—'}`);
        }

        const spotlightBrands = spec.brands || {};
        writeSectionTitle('Brands');
        writeSpecRows([
            ['Heading', spotlightBrands.heading || '—'],
            ['Image in handoff', spotlightHandoffImageLine('spotlight-brands.png', 'template default')],
        ]);

        const newsletter = spec.newsletter || {};
        writeSectionTitle('Newsletter');
        writeSpecRows([
            ['Heading', newsletter.heading || '—'],
            ['Copy', newsletter.copy || '—'],
            ['Submit button', newsletter.buttonLabel || 'Submit'],
            ['CTA box heading', newsletter.ctaHeading || '—'],
            ['CTA copy', newsletter.ctaCopy || '—'],
            ['Shop button', pdfLinkLine(newsletter.ctaShopLabel, newsletter.ctaShopUrl)],
            ['Contact button', pdfLinkLine(newsletter.ctaContactLabel, newsletter.ctaContactUrl)],
        ]);
    } else {
        writeSectionTitle('Featured Categories');
        const featuredCategoryList = Array.isArray(spec.featuredCategories) ? spec.featuredCategories : [];
        const visibleCategoryCount = featuredCategoryList.filter((category) => category.visible !== false).length;
        writeSpecRows([
            ['Shop All link', spec.shopAllUrl || '/catalog'],
            ['Card size', spec.featuredCategoryCardSize || '300 × 70 px'],
            ['Thumbnail size', spec.featuredCategoryThumbnailSize || '70 × 70 px'],
            ['Category images in handoff', 'No — thumbnails are hardcoded in the template'],
            ['Visible on site', `${visibleCategoryCount} of ${featuredCategoryList.length}`],
        ]);
        if (featuredCategoryList.length) {
            writeLines('Category visibility', { bold: true, size: 10, gap: 4 });
            writeItemList(featuredCategoryList, (category) => (
                `${category.label || category.id || '—'} · ${category.visible !== false ? 'Visible' : 'Hidden'}`
            ));
        }

        writeSectionTitle('About Us');
        writeSpecRows([
            ['Header', aboutUs.header],
            ['Paragraph', aboutUs.paragraph],
            ['Employee photo size', aboutUs.employeeImageSize || '417 × 282 px'],
            ['Employee photo in handoff', 'Yes — about-employee-image.png'],
            ['Primary button', pdfLinkLine(primaryButton.label, primaryButton.url)],
            ['Secondary button', pdfLinkLine(secondaryButton.label, secondaryButton.url)],
            ['Button background', aboutUs.buttonBackgroundColor || '#2b2b2b'],
            ['Button text', aboutUs.buttonTextColor || '#ffffff'],
        ]);

        writeSectionTitle('Feature Cards');
        writeSpecRows([
            ['Photo size', featureTiles.imageSize || '780 × 1014 px'],
            ['Feature photos in handoff', 'Yes — feature-left-image.png and feature-right-image.png'],
            ['Left header', featureLeft.header],
            ['Left copy', featureLeft.paragraph],
            ['Left button visible', leftButton.visible !== false ? 'Yes' : 'No'],
            ['Left button', pdfLinkLine(leftButton.label, leftButton.url)],
            ['Right header', featureRight.header],
            ['Right copy', featureRight.paragraph],
            ['Right button visible', rightButton.visible !== false ? 'Yes' : 'No'],
            ['Right button', pdfLinkLine(rightButton.label, rightButton.url)],
            ['Button background', featureTiles.buttonBackgroundColor || '#2b2b2b'],
            ['Button text', featureTiles.buttonTextColor || '#ffffff'],
        ]);

        writeSectionTitle('You May Like');
        writeSpecRows([
            ['Title', youMayLike.title || 'You May Like'],
            ['Image size', youMayLike.imageSize || '500 × 750 px'],
            ['Product count', String(youMayLike.itemCount || youMayLikeItems.length || 0)],
            ['Product images in handoff', 'Yes — one file per configured item'],
            ['Live site', 'Title, name, and price from You May Like dashboard attribute'],
        ]);
        writeItemList(youMayLikeItems, (item) => (
            `${item.index || '—'}. ${item.itemNumber || '—'}`
        ));

        writeSectionTitle('Get Inspired');
        writeSpecRows([
            ['Title', getInspired.title || 'Get Inspired'],
            ['Lifestyle photo size', getInspired.lifestyleImageSize || '508 × 610 px'],
            ['Lifestyle photo in handoff', 'Yes — get-inspired-lifestyle.png'],
            ['Grid card size', getInspired.cardImageSize || '155 × 155 px'],
            ['Grid card images in handoff', 'No — resolved from catalog on the live site'],
            ['Live site', 'Name, price, and image from You May Like dashboard attribute'],
        ]);
        writeItemList(getInspiredItems, (item) => (
            `${item.index || '—'}. Item #${item.itemNumber || '—'} (${item.row || '—'} row) · ${item.previewTitle || '—'}`
        ));
    }

    writeSectionTitle('Footer');
    const footer = spec.footer || {};
    const footerSocial = footer.social || {};
    const footerQuickLinks = normalizeFooterLinksForExport(footer.quickLinks);
    const footerPolicies = normalizeFooterLinksForExport(footer.policies);
    const formatFooterSocial = (entry) => {
        if (!entry) return '—';
        if (typeof entry === 'string') return entry || '—';
        const status = entry.visible === false ? 'hidden' : 'shown';
        const icon = entry.iconClass ? ` · ${entry.iconClass}` : '';
        return `${entry.url || '—'} (${status}${icon})`;
    };
    const copyrightSection = spec.copyright || null;
    const isClassicFooter = footer.layout === 'four-column';
    const isSpotlightFooter = footer.layout === 'five-column';
    const footerSpecRows = isClassicFooter || isSpotlightFooter ? [] : [
        ['Footer logo', footer.logoUseHeader !== false ? 'Same as header logo' : (footer.logoFilename || 'footer-logo.png')],
        ['Footer logo size', footer.logoDimensions || 'max 280 × 94 px'],
        ['Footer logo in handoff', footer.logoUseHeader !== false
            ? 'No — uses header logo'
            : 'Yes — footer-logo.png'],
        ['Email', footer.email],
        ['Company', footer.companyName],
        ['Address', footer.address],
        ['Phone', footer.phone],
        ['Facebook', formatFooterSocial(footerSocial.facebook)],
        ['Instagram', formatFooterSocial(footerSocial.instagram)],
        ['X', formatFooterSocial(footerSocial.x)],
        ['YouTube', formatFooterSocial(footerSocial.youtube)],
        ['LinkedIn', formatFooterSocial(footerSocial.linkedin)],
    ];
    if (!copyrightSection && !isClassicFooter && !isSpotlightFooter) {
        footerSpecRows.push(
            ['Copyright', footer.copyrightSpec
                || `© ${new Date().getFullYear()} ${footer.copyrightName || footer.companyName || '—'} | All Rights Reserved · ADA Compliant (ada-compliance::ADA Compliance::600px)`],
            ['Copyright markup', footer.copyrightPasteMarkup || footer.copyrightMarkup || '—'],
        );
    }
    if (footerSpecRows.length) {
        writeSpecRows(footerSpecRows);
    }
    if (isClassicFooter) {
        writeSpecRows([
            ['Layout', 'Four-column footer'],
            ['Background color', footer.backgroundColor || '—'],
            ['Text color', footer.textColor || '—'],
            ['About company', footer.companyName || '—'],
            ['About copy', footer.aboutCopy || '—'],
            ['Contact address', footer.address || '—'],
        ]);
        const storeHours = footer.storeHours || {};
        writeSpecRows([
            ['Store hours (Mon–Fri)', storeHours.mondayFriday || '—'],
            ['Store hours (Saturday)', storeHours.saturday || '—'],
            ['Store hours (Sunday)', storeHours.sunday || '—'],
            ['YouTube', formatFooterSocial(footerSocial.youtube)],
            ['X', formatFooterSocial(footerSocial.x || footerSocial.twitter)],
            ['Facebook', formatFooterSocial(footerSocial.facebook)],
            ['Instagram', formatFooterSocial(footerSocial.instagram)],
            ['LinkedIn', formatFooterSocial(footerSocial.linkedin)],
            ['TikTok', formatFooterSocial(footerSocial.tiktok)],
        ]);
        const linkGroups = footer.linkGroups || {};
        Object.values(linkGroups).forEach((group) => {
            const links = Array.isArray(group?.links) ? group.links : [];
            if (!links.length) return;
            writeSubsectionTitle(group.heading || 'Links');
            writeDefinitionRows(
                links.map((item) => [
                    String(item.label || '-').trim() || '-',
                    String(item.url || '-').trim() || '-',
                ]),
                { indent: 0, labelW: 150, size: 9, gap: 5 },
            );
        });
    }
    if (isSpotlightFooter) {
        const profileLinks = normalizeFooterLinksForExport(footer.profileLinks);
        const companyInfoItems = Array.isArray(footer.companyInfoItems) && footer.companyInfoItems.length
            ? normalizeFooterLinksForExport(footer.companyInfoItems)
            : normalizeFooterLinksForExport([
                { label: footer.companyInfo?.hoursWeekday, url: '', visible: true },
                { label: footer.companyInfo?.hoursSaturday, url: '', visible: true },
                { label: footer.companyInfo?.hoursSunday, url: '', visible: true },
                { label: footer.companyInfo?.phone ? `Phone Number: ${footer.companyInfo.phone}` : '', url: footer.companyInfo?.phone ? `tel:${String(footer.companyInfo.phone).replace(/\D/g, '')}` : '', visible: true },
                { label: footer.companyInfo?.email, url: footer.companyInfo?.email ? `mailto:${footer.companyInfo.email}` : '', visible: true },
            ]);
        writeSpecRows([
            ['Layout', 'Five-column footer with copyright bar'],
            ['Background color', footer.backgroundColor || '#254155'],
            ['Text color', footer.textColor || '#c7d2dd'],
            ['Copyright bar background', footer.copyrightBarBackgroundColor || '#1a3347'],
            ['Copyright bar text color', footer.copyrightBarTextColor || '#a8b8c6'],
            ['Footer logo in handoff', spotlightHandoffImageLine('spotlight-footer-logo.png', 'template default')],
            ['Footer logo link', footer.logoUrl || '/'],
            ['Map embed', footer.mapNote || 'Live Google Maps from business address'],
            ['Company name', footer.companyName || '—'],
            ['Copyright company name', footer.copyrightName || footer.companyName || '—'],
            ['Copyright', footer.copyrightSpec || '—'],
            ['Copyright markup', footer.copyrightPasteMarkup || footer.copyrightMarkup || '—'],
            ['Facebook', formatFooterSocial(footerSocial.facebook)],
            ['Instagram', formatFooterSocial(footerSocial.instagram)],
            ['X', formatFooterSocial(footerSocial.x)],
            ['LinkedIn', formatFooterSocial(footerSocial.linkedin)],
            ['YouTube', formatFooterSocial(footerSocial.youtube)],
        ]);
        if (footerQuickLinks.length) {
            writeLines(footer.quickLinksHeading || 'Quick links', { bold: true, size: 10, gap: 4 });
            writeItemList(footerQuickLinks, (item) => `${item.label}: ${item.url || '—'}`);
        }
        if (footerPolicies.length) {
            writeLines(footer.policiesHeading || 'Policies', { bold: true, size: 10, gap: 4 });
            writeItemList(footerPolicies, (item) => `${item.label}: ${item.url || '—'}`);
        }
        if (profileLinks.length) {
            writeLines(footer.profileLinksHeading || 'Your profile', { bold: true, size: 10, gap: 4 });
            writeItemList(profileLinks, (item) => `${item.label}: ${item.url || '—'}`);
        }
        if (companyInfoItems.length) {
            writeLines(footer.companyInfoHeading || 'Company info', { bold: true, size: 10, gap: 4 });
            writeItemList(companyInfoItems, (item) => (
                item.url ? `${item.label}: ${item.url}` : item.label
            ));
        }
    }
    if (copyrightSection) {
        writeSectionTitle('Copyright');
        writeLines(
            'Separate section below the footer. Required ADA compliance markup must appear on every site.',
            { size: 9, color: [90, 90, 90], gap: 8 },
        );
        writeSpecRows([
            ['Company name', copyrightSection.companyName || copyrightSection.copyrightName || '—'],
            ['Background color', copyrightSection.backgroundColor || '—'],
            ['Text color', copyrightSection.textColor || '—'],
            ['Copyright', copyrightSection.copyrightSpec
                || `© ${new Date().getFullYear()} ${copyrightSection.copyrightName || copyrightSection.companyName || '—'} | All Rights Reserved · ADA Compliant (ada-compliance::ADA Compliance::600px)`],
            ['Copyright markup', copyrightSection.copyrightPasteMarkup || copyrightSection.copyrightMarkup || '—'],
        ]);
    }
    if (!isClassicFooter && !isSpotlightFooter && footerQuickLinks.length) {
        writeLines('Quick Links', { bold: true, size: 10, gap: 4 });
        writeItemList(
            footerQuickLinks,
            (item) => `${item.label}: ${item.url || '—'}`,
        );
    }
    if (!isClassicFooter && !isSpotlightFooter && footerPolicies.length) {
        writeLines('Policies', { bold: true, size: 10, gap: 4 });
        writeItemList(
            footerPolicies,
            (item) => `${item.label}: ${item.url || '—'}`,
        );
    }

    if (isSupportHandoff) {
        writeSectionTitle('Homepage stylesheet (support install)');
        writeSpecRows([
            ['FTP upload', 'Upload the data/ folder from this ZIP to the site root'],
            ['Handoff path', `${GALLERY_CSS_ZIP_DIR}/styles.css`],
            ['Server path', `${GALLERY_CSS_SERVER}/styles.css`],
            ...(isGallery ? [['Phone nav script', GALLERY_NAV_JS_SERVER]] : []),
            ['Dashboard section', 'Meta Data, JavaScript & CSS (Global)'],
            ['Snippet file', GALLERY_META_SNIPPET_ZIP],
            ['Asset version', `v${galleryAssetVersion} (CSS${isGallery ? ', JS' : ''}, images ?v query)`],
            ['Stylesheet link', `<link rel="stylesheet" href="${GALLERY_CSS_SERVER}/styles.css${galleryAssetQuery}">`],
        ]);
        writeLines(
            isGallery
                ? 'Support: FTP upload data/ (css + js + images under data/logicx/). Paste meta-data-global-css-snippet.html into Meta Data / Global CSS, then paste html/* into CMS regions. Bump Asset version in the editor when replacing CSS/JS/images.'
                : 'Support: FTP upload data/ (css + images under data/logicx/). Paste meta-data-global-css-snippet.html into Meta Data / Global CSS, then paste html/* into CMS regions (header through section_7 + footer). Bump Asset version in the editor when replacing CSS/images.',
            { size: 9, color: [90, 90, 90], gap: 10 },
        );
    }

    writeSectionTitle('Handoff images');
    if (!resolvedHandoffAssets.length) {
        writeLines(
            isSpotlight
                ? 'No image files could be resolved for this handoff. Check that editor/Spotlight assets are available and try exporting again.'
                : 'No client images are included in this handoff.',
            { size: 9, color: [90, 90, 90], gap: 8 },
        );
    } else {
        writeLines('These files are included in the ZIP and shown on the following pages.', { size: 9, color: [90, 90, 90], gap: 6 });
        writeItemList(resolvedHandoffAssets, (asset, index) => (
            `${index + 1}. ${isSupportHandoff ? 'data/logicx/images' : 'images'}/${asset.filename} — ${asset.label} (${asset.dimensions})`
        ));
    }

    // ——— Layout previews (one section per page group) ———
    const heroTarget = heroEl || options.previewEl;
    if (!heroTarget) {
        throw new Error('Nothing to capture for hero preview.');
    }

    const previewCaptureSteps = [];
    if (isCapturable(headerEl)) {
        previewCaptureSteps.push({ el: headerEl, label: 'Preview — Header' });
    }
    previewCaptureSteps.push({ el: heroTarget, label: 'Preview — Hero' });

    if (isSpotlight) {
        spotlightSections.forEach((section) => {
            if (isCapturable(section.el)) {
                previewCaptureSteps.push({ el: section.el, label: section.label });
            }
        });
    } else {
        if (isGallery && isCapturable(galleryCatalogEl)) {
            previewCaptureSteps.push({ el: galleryCatalogEl, label: 'Preview — Catalog Highlights' });
        }
        if (!isGallery && isCapturable(categoriesEl)) {
            previewCaptureSteps.push({ el: categoriesEl, label: 'Preview — Featured Categories' });
        }
        if (!isGallery && isCapturable(aboutEl)) {
            previewCaptureSteps.push({ el: aboutEl, label: 'Preview — About Us' });
        }
        if (!isGallery && isCapturable(featureTilesEl)) {
            previewCaptureSteps.push({ el: featureTilesEl, label: 'Preview — Feature Cards' });
        }
        if (!isGallery && isCapturable(youMayLikeEl)) {
            previewCaptureSteps.push({ el: youMayLikeEl, label: 'Preview — You May Like' });
        }
        if (!isGallery && isCapturable(getInspiredEl)) {
            previewCaptureSteps.push({ el: getInspiredEl, label: 'Preview — Get Inspired' });
        }
        if (isCapturable(footerEl)) {
            previewCaptureSteps.push({ el: footerEl, label: 'Preview — Footer' });
        }
        if (isCapturable(copyrightEl)) {
            previewCaptureSteps.push({ el: copyrightEl, label: 'Preview — Copyright' });
        }
    }

    for (let stepIndex = 0; stepIndex < previewCaptureSteps.length; stepIndex += 1) {
        const step = previewCaptureSteps[stepIndex];
        if (typeof onProgress === 'function') {
            onProgress({
                phase: 'capture',
                current: stepIndex + 1,
                total: previewCaptureSteps.length,
                label: step.label.replace(/^Preview — /, ''),
            });
        }
        await appendCanvasPreview(await captureElement(step.el), step.label);
    }

    if (typeof onProgress === 'function') {
        onProgress({ phase: 'packaging', current: previewCaptureSteps.length, total: previewCaptureSteps.length });
    }

    // ——— Uploaded asset pages ———
    for (const asset of resolvedHandoffAssets) {
        await appendAssetPage(asset);
    }

    const pdfBlob = doc.output('blob');
    const handoffImageZipPath = (filename) => (
        isSupportHandoff ? `${GALLERY_IMAGES_ZIP_DIR}/${filename}` : `images/${filename}`
    );

    async function fetchTextForHandoff(url) {
        const response = await fetch(url, { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error(`Could not load handoff asset: ${url} (${response.status})`);
        }
        return response.text();
    }

    /**
     * Homepage stylesheets for FTP upload (Classic gallery + McQueen).
     * ZIP: data/logicx/css/[file] → live: /data/logicx/css/[file]
     */
    async function loadSupportHandoffStylesheets() {
        if (!isSupportHandoff) return [];
        const files = [
            {
                zipPath: `${GALLERY_CSS_ZIP_DIR}/styles.css`,
                sourceUrl: isGallery ? 'gallery/data/css/styles.css' : 'classic/data/css/styles.css',
                serverPath: `${GALLERY_CSS_SERVER}/styles.css`,
            },
        ];
        const loaded = [];
        for (const file of files) {
            try {
                const content = await fetchTextForHandoff(file.sourceUrl);
                loaded.push({ ...file, content });
            } catch (err) {
                console.warn(err);
            }
        }
        return loaded;
    }

    async function loadGalleryHandoffScripts() {
        if (!isGallery) return [];
        const files = [
            {
                zipPath: GALLERY_NAV_JS_ZIP,
                sourceUrl: 'gallery/data/js/gallery-nav.js',
                serverPath: GALLERY_NAV_JS_SERVER,
            },
        ];
        const loaded = [];
        for (const file of files) {
            try {
                const content = await fetchTextForHandoff(file.sourceUrl);
                loaded.push({ ...file, content });
            } catch (err) {
                console.warn(err);
            }
        }
        return loaded;
    }

    const galleryStylesheets = await loadSupportHandoffStylesheets();
    const galleryScripts = await loadGalleryHandoffScripts();
    const galleryStylesheetNames = galleryStylesheets.map((file) => file.zipPath.split('/').pop());
    const primaryStylesheet = galleryStylesheets[0] || null;
    const primaryStylesheetServerPath = primaryStylesheet
        ? primaryStylesheet.serverPath
        : `${GALLERY_CSS_SERVER}/styles.css`;
    const primaryStylesheetCacheBust = withGalleryAssetQuery(primaryStylesheetServerPath);
    const galleryNavScript = galleryScripts[0] || null;
    const galleryNavScriptSrc = galleryNavScript
        ? withGalleryAssetQuery(galleryNavScript.serverPath)
        : '';

    const supportTemplateLabel = isGallery ? 'Classic' : isMcQueen ? 'McQueen' : 'Showroom';
    const metaDataGlobalSnippet = [
        '<!--',
        `  Support — paste into: Meta Data, JavaScript & CSS (Global)`,
        '  ---------------------------------------------------------',
        `  Template: ${supportTemplateLabel}`,
        `  Handoff version: ${handoffVersion}`,
        `  Package ID: ${packageId}`,
        `  Asset version: v${galleryAssetVersion} (CSS + images cache-bust${isGallery ? ' + JS' : ''})`,
        '  1. Upload the data/ folder from this ZIP to the site root via FTP.',
        `  2. Stylesheet file: ${GALLERY_CSS_ZIP_DIR}/${primaryStylesheet ? primaryStylesheet.zipPath.split('/').pop() : 'styles.css'}`,
        `  3. Live URL: ${primaryStylesheetServerPath}`,
        '  4. Paste (or merge) the tags below into Meta Data / Global CSS.',
        '  5. REQUIRED: keep both enhanced-search lines — new databases need them',
        '     so #searchEngine / enhanced-search.js can bind on the live site.',
        ...(isGallery ? [
            '  6. REQUIRED: keep gallery-nav.js — phone hamburger + accordion nav.',
            `  7. Keep ?v${galleryAssetVersion} on CSS/JS (and image URLs in pasted HTML).`,
            '     Bump Asset version in the Showroom editor when replacing those files.',
            '  8. Confirm styles.css is on FTP at the Live URL below (homepage looks unstyled if missing).',
        ] : [
            `  6. Keep ?v${galleryAssetVersion} on CSS (and image URLs in pasted HTML).`,
            '     Bump Asset version in the Showroom editor when replacing those files.',
            '  7. Confirm styles.css is on FTP at the Live URL below (homepage looks unstyled if missing).',
        ]),
        '-->',
        '<link href="/JavaScript/templateScripts/enhanced-search/enhanced-search.css" rel="stylesheet">',
        '<script src="/JavaScript/templateScripts/enhanced-search/enhanced-search.js"></script>',
        `<link rel="stylesheet" href="${primaryStylesheetCacheBust}">`,
        ...(isGallery && galleryNavScriptSrc ? [`<script src="${galleryNavScriptSrc}"></script>`] : []),
        '',
    ].join('\n');

    const cssFolderReadme = [
        `Homepage stylesheet — ${supportTemplateLabel} (FTP)`,
        '===================================',
        '',
        'This folder is FTP-only (inside data/logicx/):',
        `  ${GALLERY_CSS_ZIP_DIR}/`,
        '',
        'Support install:',
        '  1. Upload the top-level data/ folder from the ZIP to the site root.',
        `  2. Live path must be exactly: ${GALLERY_CSS_SERVER}/styles.css`,
        '  3. Paste meta-data-global-css-snippet.html (ZIP root) into',
        '     Meta Data, JavaScript & CSS (Global).',
        '',
        'Files:',
        ...(galleryStylesheetNames.length
            ? galleryStylesheetNames.map((name) => `  - ${name}  →  ${GALLERY_CSS_SERVER}/${name}`)
            : [`  - styles.css  →  ${GALLERY_CSS_SERVER}/styles.css`]),
        '',
        'Content max-width: 1440px (message bar, header, hero, catalog, footer, copyright).',
        'Confirm in styles.css: --showroom-content-max: 1440px; and max-width: 1440px;',
        '',
        `Asset version for this package: v${galleryAssetVersion}`,
        `  Meta Data link must use: ${primaryStylesheetCacheBust}`,
        '',
        'If the homepage looks unstyled, open the Live URL in a browser.',
        'A 404 means FTP path or Meta Data link is wrong.',
        '',
        'Example Meta Data link (after FTP):',
        `  <link rel="stylesheet" href="${primaryStylesheetCacheBust}">`,
        '',
    ].join('\n');

    const jsFolderReadme = [
        'Homepage scripts — Classic (FTP)',
        '================================',
        '',
        'This folder is FTP-only (inside data/logicx/):',
        `  ${GALLERY_JS_ZIP_DIR}/`,
        '',
        'Files:',
        `  - gallery-nav.js  →  ${GALLERY_NAV_JS_SERVER}`,
        '',
        'Required for phone header: hamburger opens main nav;',
        'tapping a category expands its dropdown.',
        '',
        `Asset version for this package: v${galleryAssetVersion}`,
        '',
        'Meta Data script tag (also in meta-data-global-css-snippet.html):',
        `  <script src="${galleryNavScriptSrc}"></script>`,
        '',
    ].join('\n');

    /**
     * Classic CMS paste HTML — serialize the live preview DOM (single source of truth).
     * Dashboard regions: header → section_1 → section_2 → footer (footer + copyright).
     */
    const GALLERY_PREVIEW_ID_TO_IMAGE = {
        previewGalleryLogo: 'header-logo.png',
        previewGalleryHeroPrimaryImage: 'gallery-hero-primary.jpg',
        previewGalleryHeroSecondaryTopImage: 'gallery-hero-secondary-top.jpg',
        previewGalleryHeroSecondaryBottomImage: 'gallery-hero-secondary-bottom.jpg',
    };

    const GALLERY_DEFAULT_PATH_TO_IMAGE = {
        'gallery/xologic-logo.png': 'header-logo.png',
        'gallery/quorum1.jpg': 'gallery-hero-primary.jpg',
        'gallery/chandelier4.jpg': 'gallery-hero-secondary-top.jpg',
        'gallery/pendants3.jpg': 'gallery-hero-secondary-bottom.jpg',
        'gallery/bathroom1.jpg': 'gallery-catalog-tile-1.jpg',
        'gallery/exterior1.jpg': 'gallery-catalog-tile-2.jpg',
        'gallery/fans1.jpg': 'gallery-catalog-tile-3.jpg',
        'gallery/hall-lantern3.jpg': 'gallery-catalog-tile-4.jpg',
    };

    function galleryCmsImagePath(filename) {
        return withGalleryAssetQuery(`${GALLERY_IMAGES_SERVER}/${filename}`);
    }

    function stampGalleryAssetBanner(content, kind) {
        const body = String(content || '');
        const label = isGallery ? 'Classic' : isMcQueen ? 'McQueen' : 'Showroom';
        const banner = [
            `/* ${label} handoff asset version: v${galleryAssetVersion} (${kind}) */`,
            `/* Bump Asset version in the Showroom editor when replacing this file on FTP. */`,
            '',
        ].join('\n');
        if (body.includes(`handoff asset version: v${galleryAssetVersion}`)) return body;
        return banner + body;
    }

    function galleryRelativeImageKey(src) {
        const value = String(src || '');
        if (!value || value.startsWith('data:')) return '';
        try {
            const url = new URL(value, window.location.href);
            const match = url.pathname.match(/(?:^|\/)(gallery\/[^/?#]+)$/i);
            if (match) return match[1].replace(/^\/+/, '');
        } catch {
            /* ignore */
        }
        const loose = value.match(/(gallery\/[^/?#]+)/i);
        return loose ? loose[1] : '';
    }

    function buildGalleryCmsSrcLookup(assets) {
        const bySrc = new Map();
        for (const asset of assets) {
            if (!asset?.filename || !asset.dataUrl) continue;
            const path = galleryCmsImagePath(asset.filename);
            bySrc.set(String(asset.dataUrl), path);
        }
        Object.entries(GALLERY_DEFAULT_PATH_TO_IMAGE).forEach(([rel, filename]) => {
            bySrc.set(rel, galleryCmsImagePath(filename));
        });
        return bySrc;
    }

    function resolveGalleryCmsImageSrc(img, srcLookup, catalogTileIndex) {
        const attrSrc = img.getAttribute('src') || '';
        const liveSrc = img.src || attrSrc;
        if (srcLookup.has(attrSrc)) return srcLookup.get(attrSrc);
        if (liveSrc && srcLookup.has(liveSrc)) return srcLookup.get(liveSrc);

        const rel = galleryRelativeImageKey(attrSrc || liveSrc);
        if (rel && srcLookup.has(rel)) return srcLookup.get(rel);

        const id = img.id || '';
        if (GALLERY_PREVIEW_ID_TO_IMAGE[id]) {
            return galleryCmsImagePath(GALLERY_PREVIEW_ID_TO_IMAGE[id]);
        }
        if (id.startsWith('previewGalleryCatalogTile-') && catalogTileIndex > 0) {
            return galleryCmsImagePath(`gallery-catalog-tile-${catalogTileIndex}.jpg`);
        }
        return '';
    }

    function escapeHtmlAttr(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Fixed enhanced-search module for Classic header handoff.
     * IDs/attrs are bound by enhanced-search.js — do not rename or restructure.
     * Only placeholder text may vary.
     */
    function buildGalleryEnhancedSearchModule(placeholder) {
        const ph = escapeHtmlAttr(placeholder || 'Search...');
        return [
            '<div id="searchEngine" class="showroom-gallery-main-nav-search">',
            '  <div id="searchInputBox" class="enhanced-search" style="display:flex;align-items:center;width:100%">',
            `    <input class="showroom-gallery-main-nav-search-input" type="text"`,
            `           name="itemNumVal" placeholder="${ph}" aria-label="Search Keywords"`,
            '           search="categories" results="6">',
            '    <button id="searchSubmitBtn" class="showroom-gallery-main-nav-search-icon"',
            '            type="submit" aria-label="Submit Search"',
            '            style="background:none;border:0;padding:0;cursor:pointer">',
            '      <i class="fa fa-search" aria-hidden="true"></i>',
            '    </button>',
            '  </div>',
            '</div>',
        ].join('\n');
    }

    function resolveGallerySearchPlaceholder(sourceEl) {
        const fromSpec = spec?.header?.toolbar?.searchPlaceholder
            || spec?.header?.search?.placeholder;
        if (typeof fromSpec === 'string' && fromSpec.trim()) return fromSpec.trim();

        const fromPreview = sourceEl?.querySelector?.('.showroom-gallery-main-nav-search-input')
            ?.getAttribute('placeholder');
        if (typeof fromPreview === 'string' && fromPreview.trim()) return fromPreview.trim();

        return 'Search...';
    }

    function injectGalleryEnhancedSearchModule(clone, sourceEl) {
        if (!clone) return clone;
        const slot = clone.querySelector('.showroom-gallery-main-nav-search');
        if (!slot || !slot.parentNode) return clone;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = buildGalleryEnhancedSearchModule(
            resolveGallerySearchPlaceholder(sourceEl),
        ).trim();
        const moduleEl = wrapper.firstElementChild;
        if (moduleEl) slot.replaceWith(moduleEl);
        return clone;
    }

    function sanitizeGalleryCmsClone(root, srcLookup) {
        if (!root) return null;
        const clone = root.cloneNode(true);
        clone.removeAttribute('hidden');
        clone.classList.remove('is-preview-stuck', 'editor-preview-image-jump-target');
        clone.style.removeProperty('transform');

        // Rewrite image paths while preview ids still exist on the clone.
        let catalogTileIndex = 0;
        clone.querySelectorAll('img').forEach((img) => {
            const inCatalogTile = Boolean(img.closest('.showroom-gallery-catalog-tile'));
            if (inCatalogTile) catalogTileIndex += 1;
            const nextSrc = resolveGalleryCmsImageSrc(img, srcLookup, inCatalogTile ? catalogTileIndex : 0);
            if (nextSrc) {
                img.setAttribute('src', nextSrc);
                img.removeAttribute('srcset');
            }
            img.removeAttribute('hidden');
        });

        clone.querySelectorAll('*').forEach((el) => {
            el.classList.remove('is-preview-stuck', 'editor-preview-image-jump-target');
            el.removeAttribute('data-editor-jump-target');
            if (el.hasAttribute('style') && /transform/i.test(el.getAttribute('style') || '')) {
                el.style.removeProperty('transform');
            }
            // Keep enhanced-search binding ids (#searchEngine, #searchInputBox, #searchSubmitBtn).
            if (el.id && (/^preview/i.test(el.id) || /^showroom/i.test(el.id))) {
                el.removeAttribute('id');
            }
            if (el.matches('input, button, textarea, select')) {
                el.removeAttribute('disabled');
                el.removeAttribute('aria-disabled');
            }
            el.classList.remove('is-nav-open', 'is-open');
        });

        const galleryNav = clone.querySelector('.showroom-gallery-main-nav');
        const galleryToggle = clone.querySelector('.showroom-gallery-menu-toggle');
        if (galleryNav) {
            galleryNav.id = 'galleryMainNav';
        }
        if (galleryToggle) {
            galleryToggle.removeAttribute('aria-hidden');
            galleryToggle.removeAttribute('tabindex');
            galleryToggle.removeAttribute('disabled');
            galleryToggle.setAttribute('aria-expanded', 'false');
            galleryToggle.setAttribute('aria-label', 'Open menu');
            if (galleryNav) {
                galleryToggle.setAttribute('aria-controls', 'galleryMainNav');
            }
        }

        // Ensure hero text panels keep a real rgba background in CMS paste HTML.
        // Some hosts strip CSS custom properties; inline background survives.
        const defaultPanelBg = 'rgba(18, 16, 14, 0.52)';
        const heroPanel = clone.querySelector('.showroom-gallery-hero-primary-panel');
        if (heroPanel && !String(heroPanel.style.background || '').trim()) {
            heroPanel.style.background = defaultPanelBg;
        }
        clone.querySelectorAll('.showroom-gallery-hero-secondary-heading').forEach((heading) => {
            if (!String(heading.style.background || '').trim()) {
                heading.style.background = defaultPanelBg;
            }
        });

        return clone;
    }

    function serializeGalleryCmsRegion(el, srcLookup, label, pasteRegion, options = {}) {
        if (!el) return '';
        let clone = sanitizeGalleryCmsClone(el, srcLookup);
        if (!clone) return '';
        if (options.injectEnhancedSearch) {
            clone = injectGalleryEnhancedSearchModule(clone, el);
        }
        const date = new Date().toLocaleDateString();
        return [
            `<!-- Showroom Classic — ${label} | LogicX Showroom Editor · ${date} -->`,
            `<!-- Handoff version: ${handoffVersion} | Package ID: ${packageId} -->`,
            `<!-- Asset version: v${galleryAssetVersion} (CSS/JS/images ?v${galleryAssetVersion}) -->`,
            `<!-- Paste into CMS region: ${pasteRegion} -->`,
            `<!-- Requires ${GALLERY_CSS_SERVER}/styles.css${galleryAssetQuery} and images under ${GALLERY_IMAGES_SERVER}/ -->`,
            options.injectEnhancedSearch
                ? '<!-- Search module is fixed for enhanced-search.js (#searchEngine / #searchInputBox / #searchSubmitBtn) -->'
                : null,
            '',
            clone.outerHTML,
            '',
        ].filter((line) => line !== null).join('\n');
    }

    function collectShowroomClassesFromHtml(html) {
        const classes = new Set();
        const re = /class\s*=\s*["']([^"']+)["']/gi;
        let match;
        while ((match = re.exec(html)) !== null) {
            match[1].split(/\s+/).forEach((name) => {
                if (name.startsWith('showroom-')) classes.add(name);
            });
        }
        return classes;
    }

    function collectShowroomClassesFromCss(cssText) {
        const classes = new Set();
        const re = /\.((?:showroom-)[a-zA-Z0-9_-]+)/g;
        let match;
        while ((match = re.exec(cssText || '')) !== null) {
            classes.add(match[1]);
        }
        return classes;
    }

    function warnGalleryHtmlCssDrift(htmlFiles, cssText) {
        if (!cssText) return;
        const cssClasses = collectShowroomClassesFromCss(cssText);
        const missing = [];
        htmlFiles.forEach((file) => {
            collectShowroomClassesFromHtml(file.content).forEach((name) => {
                if (!cssClasses.has(name)) missing.push(`${file.path}: .${name}`);
            });
        });
        if (missing.length) {
            console.warn(
                '[showroom handoff] .showroom-* classes in exported HTML missing from styles.css:\n'
                + missing.join('\n'),
            );
        }
    }

    function buildGalleryCmsHtmlFiles() {
        if (!isGallery) return [];
        const srcLookup = buildGalleryCmsSrcLookup(resolvedHandoffAssets);
        const headerHtml = serializeGalleryCmsRegion(
            headerEl,
            srcLookup,
            'Header (message bar + logo + main nav + search)',
            'header',
            { injectEnhancedSearch: true },
        );
        const section1Html = serializeGalleryCmsRegion(
            heroEl,
            srcLookup,
            'Hero (split lifestyle)',
            'section_1',
        );
        const section2Html = serializeGalleryCmsRegion(
            galleryCatalogEl,
            srcLookup,
            'Catalog Highlights (four tiles)',
            'section_2',
        );

        const footerParts = [];
        const footerClone = sanitizeGalleryCmsClone(footerEl, srcLookup);
        const copyrightClone = sanitizeGalleryCmsClone(copyrightEl, srcLookup);
        if (footerClone) footerParts.push(footerClone.outerHTML);
        if (copyrightClone) footerParts.push(copyrightClone.outerHTML);
        const date = new Date().toLocaleDateString();
        const footerHtml = footerParts.length
            ? [
                `<!-- Showroom Classic — Footer + Copyright/ADA | LogicX Showroom Editor · ${date} -->`,
                `<!-- Handoff version: ${handoffVersion} | Package ID: ${packageId} -->`,
                `<!-- Asset version: v${galleryAssetVersion} (CSS/JS/images ?v${galleryAssetVersion}) -->`,
                '<!-- Paste into CMS region: footer -->',
                `<!-- Requires ${GALLERY_CSS_SERVER}/styles.css${galleryAssetQuery} and images under ${GALLERY_IMAGES_SERVER}/ -->`,
                '',
                footerParts.join('\n\n'),
                '',
            ].join('\n')
            : '';

        const files = [
            { path: `${GALLERY_HTML_ZIP_DIR}/header.html`, content: headerHtml },
            { path: `${GALLERY_HTML_ZIP_DIR}/section_1.html`, content: section1Html },
            { path: `${GALLERY_HTML_ZIP_DIR}/section_2.html`, content: section2Html },
            { path: `${GALLERY_HTML_ZIP_DIR}/footer.html`, content: footerHtml },
        ].filter((file) => file.content);

        const cssText = galleryStylesheets[0]?.content || '';
        warnGalleryHtmlCssDrift(files, cssText);

        files.push({
            path: `${GALLERY_HTML_ZIP_DIR}/README.txt`,
            content: [
                'Showroom Classic — CMS paste HTML (support)',
                '==========================================',
                '',
                `Handoff version: ${handoffVersion}`,
                `Package ID: ${packageId}`,
                '',
                'These files are for CMS paste only — do NOT upload html/ via FTP.',
                'Copy-paste each file into the matching dashboard region:',
                '',
                '  html/header.html     →  header',
                '  html/section_1.html  →  section_1   (hero)',
                '  html/section_2.html  →  section_2   (catalog highlights)',
                '  html/footer.html     →  footer      (columns + copyright/ADA)',
                '',
                'Install order (support agent):',
                '  1. FTP upload data/ only (css + images under data/logicx/)',
                '  2. Paste meta-data-global-css-snippet.html (ZIP root)',
                '     into dashboard → Meta Data, JavaScript & CSS (Global)',
                `  3. Confirm styles.css loads at ${GALLERY_CSS_SERVER}/styles.css`,
                `  4. Confirm images are at ${GALLERY_IMAGES_SERVER}/`,
                '  5. Paste these html/*.html files into the CMS regions above',
                '',
                'meta and section_3 CMS regions are not used by this template.',
                '',
            ].join('\n'),
        });

        return files;
    }

    /**
     * McQueen CMS paste HTML — header + sections 1–7 + footer.
     * Dashboard regions: header → section_1…section_7 → footer.
     */
    const MCQUEEN_PREVIEW_ID_TO_IMAGE = {
        previewHeaderLogo: 'header-logo.png',
        previewProductImage: 'hero-product.jpg',
        previewLifestyleImage: 'hero-lifestyle.jpg',
        previewAboutPhoto: 'about-employee-image.png',
        previewFeatureLeftImage: 'feature-left-image.png',
        previewFeatureRightImage: 'feature-right-image.png',
        previewGetInspiredLifestyleImage: 'get-inspired-lifestyle.png',
        previewFooterLogo: 'footer-logo.png',
    };

    const MCQUEEN_DEFAULT_PATH_TO_IMAGE = {
        'classic/header/logo-classic.png': 'header-logo.png',
        'classic/gemma.jpg': 'hero-product.jpg',
        'classic/Gemma_FR33738VBZ_H_Models-min.jpg': 'hero-lifestyle.jpg',
        'classic/lady-showroom.jpg': 'about-employee-image.png',
        'classic/kitchEnclavePhoto-min.jpg': 'feature-left-image.png',
        'classic/exteriorLightingPhoto-min.jpg': 'feature-right-image.png',
        'classic/get-inspired/Everett_4398BN_Models.jpg': 'get-inspired-lifestyle.png',
    };

    function mcQueenRelativeImageKey(src) {
        const value = String(src || '');
        if (!value || value.startsWith('data:')) return '';
        try {
            const url = new URL(value, window.location.href);
            const match = url.pathname.match(/(?:^|\/)(classic\/.+)$/i);
            if (match) return match[1].replace(/^\/+/, '');
        } catch {
            /* ignore */
        }
        const loose = value.match(/(classic\/[^?#]+)/i);
        return loose ? loose[1].split('?')[0] : '';
    }

    function buildMcQueenCmsSrcLookup(assetList) {
        const bySrc = new Map();
        for (const asset of assetList) {
            if (!asset?.filename || !asset.dataUrl) continue;
            bySrc.set(String(asset.dataUrl), galleryCmsImagePath(asset.filename));
        }
        Object.entries(MCQUEEN_DEFAULT_PATH_TO_IMAGE).forEach(([rel, filename]) => {
            bySrc.set(rel, galleryCmsImagePath(filename));
        });
        return bySrc;
    }

    function resolveMcQueenCmsImageSrc(img, srcLookup) {
        const attrSrc = img.getAttribute('src') || '';
        const liveSrc = img.src || attrSrc;
        if (srcLookup.has(attrSrc)) return srcLookup.get(attrSrc);
        if (liveSrc && srcLookup.has(liveSrc)) return srcLookup.get(liveSrc);

        const rel = mcQueenRelativeImageKey(attrSrc || liveSrc);
        if (rel && srcLookup.has(rel)) return srcLookup.get(rel);
        // Try basename match against default map keys
        if (rel) {
            const hit = Object.entries(MCQUEEN_DEFAULT_PATH_TO_IMAGE).find(([key]) => (
                key === rel || key.endsWith(rel) || rel.endsWith(key)
            ));
            if (hit) return galleryCmsImagePath(hit[1]);
        }

        const id = img.id || '';
        if (MCQUEEN_PREVIEW_ID_TO_IMAGE[id]) {
            return galleryCmsImagePath(MCQUEEN_PREVIEW_ID_TO_IMAGE[id]);
        }
        if (id.startsWith('previewYouMayLikeImage-')) {
            const n = id.replace('previewYouMayLikeImage-', '');
            return galleryCmsImagePath(`you-may-like-${n}.png`);
        }
        if (id.startsWith('previewGetInspiredCard-')) {
            const n = id.replace(/\D+/g, '');
            if (n) return galleryCmsImagePath(`get-inspired-card-${n}.png`);
        }
        return '';
    }

    function buildMcQueenEnhancedSearchModule(placeholder) {
        const ph = escapeHtmlAttr(placeholder || 'Enter Keyword or Item#');
        return [
            '<div id="searchEngine" class="showroom-header-search">',
            '  <div id="searchInputBox" class="enhanced-search" style="display:flex;align-items:center;width:100%">',
            `    <input class="showroom-header-search-input" type="text"`,
            `           name="itemNumVal" placeholder="${ph}" aria-label="Search Keywords"`,
            '           search="categories" results="6">',
            '    <button id="searchSubmitBtn" class="showroom-header-search-icon"',
            '            type="submit" aria-label="Submit Search"',
            '            style="background:none;border:0;padding:0;cursor:pointer">',
            '      <i class="fa fa-search" aria-hidden="true"></i>',
            '    </button>',
            '  </div>',
            '</div>',
        ].join('\n');
    }

    function injectMcQueenEnhancedSearchModule(clone, sourceEl) {
        if (!clone) return clone;
        const slot = clone.querySelector('.showroom-header-search');
        if (!slot || !slot.parentNode) return clone;
        const fromPreview = sourceEl?.querySelector?.('.showroom-header-search-input')
            ?.getAttribute('placeholder');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = buildMcQueenEnhancedSearchModule(
            (fromPreview && fromPreview.trim()) || 'Enter Keyword or Item#',
        ).trim();
        const moduleEl = wrapper.firstElementChild;
        if (moduleEl) slot.replaceWith(moduleEl);
        return clone;
    }

    function sanitizeMcQueenCmsClone(root, srcLookup) {
        if (!root) return null;
        const clone = root.cloneNode(true);
        clone.removeAttribute('hidden');
        clone.classList.remove('is-preview-stuck', 'editor-preview-image-jump-target', 'is-hidden');
        clone.style.removeProperty('transform');

        clone.querySelectorAll('img').forEach((img) => {
            const nextSrc = resolveMcQueenCmsImageSrc(img, srcLookup);
            if (nextSrc) {
                img.setAttribute('src', nextSrc);
                img.removeAttribute('srcset');
            }
            img.removeAttribute('hidden');
        });

        clone.querySelectorAll('*').forEach((el) => {
            el.classList.remove('is-preview-stuck', 'editor-preview-image-jump-target');
            el.removeAttribute('data-editor-jump-target');
            if (el.hasAttribute('style') && /transform/i.test(el.getAttribute('style') || '')) {
                el.style.removeProperty('transform');
            }
            if (el.id && (/^preview/i.test(el.id) || /^showroom/i.test(el.id))) {
                el.removeAttribute('id');
            }
            if (el.matches('input, button, textarea, select')) {
                el.removeAttribute('disabled');
                el.removeAttribute('aria-disabled');
            }
        });

        return clone;
    }

    function serializeMcQueenCmsRegion(el, srcLookup, label, pasteRegion, options = {}) {
        if (!el) return '';
        let clone = sanitizeMcQueenCmsClone(el, srcLookup);
        if (!clone) return '';
        if (options.injectEnhancedSearch) {
            clone = injectMcQueenEnhancedSearchModule(clone, el);
        }
        const date = new Date().toLocaleDateString();
        return [
            `<!-- Showroom McQueen — ${label} | LogicX Showroom Editor · ${date} -->`,
            `<!-- Handoff version: ${handoffVersion} | Package ID: ${packageId} -->`,
            `<!-- Asset version: v${galleryAssetVersion} (CSS/images ?v${galleryAssetVersion}) -->`,
            `<!-- Paste into CMS region: ${pasteRegion} -->`,
            `<!-- Requires ${GALLERY_CSS_SERVER}/styles.css${galleryAssetQuery} and images under ${GALLERY_IMAGES_SERVER}/ -->`,
            options.injectEnhancedSearch
                ? '<!-- Search module is fixed for enhanced-search.js (#searchEngine / #searchInputBox / #searchSubmitBtn) -->'
                : null,
            '',
            clone.outerHTML,
            '',
        ].filter((line) => line !== null).join('\n');
    }

    function buildMcQueenCmsHtmlFiles() {
        if (!isMcQueen) return [];
        const srcLookup = buildMcQueenCmsSrcLookup(resolvedHandoffAssets);
        const files = [
            {
                path: `${GALLERY_HTML_ZIP_DIR}/header.html`,
                content: serializeMcQueenCmsRegion(
                    headerEl,
                    srcLookup,
                    'Header (banner + logo + search + main nav)',
                    'header',
                    { injectEnhancedSearch: true },
                ),
            },
            {
                path: `${GALLERY_HTML_ZIP_DIR}/section_1.html`,
                content: serializeMcQueenCmsRegion(heroEl, srcLookup, 'Hero', 'section_1'),
            },
            {
                path: `${GALLERY_HTML_ZIP_DIR}/section_2.html`,
                content: serializeMcQueenCmsRegion(categoriesEl, srcLookup, 'Featured Categories', 'section_2'),
            },
            {
                path: `${GALLERY_HTML_ZIP_DIR}/section_3.html`,
                content: serializeMcQueenCmsRegion(aboutEl, srcLookup, 'About Us', 'section_3'),
            },
            {
                path: `${GALLERY_HTML_ZIP_DIR}/section_4.html`,
                content: serializeMcQueenCmsRegion(featureTilesEl, srcLookup, 'Feature Cards', 'section_4'),
            },
            {
                path: `${GALLERY_HTML_ZIP_DIR}/section_5.html`,
                content: (sketchEl && !sketchEl.classList.contains('is-hidden') && !sketchEl.hidden)
                    ? serializeMcQueenCmsRegion(sketchEl, srcLookup, 'Sketch Section', 'section_5')
                    : '',
            },
            {
                path: `${GALLERY_HTML_ZIP_DIR}/section_6.html`,
                content: serializeMcQueenCmsRegion(youMayLikeEl, srcLookup, 'You May Like', 'section_6'),
            },
            {
                path: `${GALLERY_HTML_ZIP_DIR}/section_7.html`,
                content: serializeMcQueenCmsRegion(getInspiredEl, srcLookup, 'Get Inspired', 'section_7'),
            },
            {
                path: `${GALLERY_HTML_ZIP_DIR}/footer.html`,
                content: serializeMcQueenCmsRegion(footerEl, srcLookup, 'Footer (+ copyright/ADA)', 'footer'),
            },
        ].filter((file) => file.content);

        const cssText = galleryStylesheets[0]?.content || '';
        warnGalleryHtmlCssDrift(files, cssText);

        files.push({
            path: `${GALLERY_HTML_ZIP_DIR}/README.txt`,
            content: [
                'Showroom McQueen — CMS paste HTML (support)',
                '==========================================',
                '',
                `Handoff version: ${handoffVersion}`,
                `Package ID: ${packageId}`,
                '',
                'These files are for CMS paste only — do NOT upload html/ via FTP.',
                'Copy-paste each file into the matching dashboard region:',
                '',
                '  html/header.html     →  header',
                '  html/section_1.html  →  section_1   (hero)',
                '  html/section_2.html  →  section_2   (featured categories)',
                '  html/section_3.html  →  section_3   (about us)',
                '  html/section_4.html  →  section_4   (feature cards)',
                '  html/section_5.html  →  section_5   (sketch — when present)',
                '  html/section_6.html  →  section_6   (you may like)',
                '  html/section_7.html  →  section_7   (get inspired)',
                '  html/footer.html     →  footer      (columns + copyright/ADA)',
                '',
                'Install order (support agent):',
                '  1. FTP upload data/ only (css + images under data/logicx/)',
                '  2. Paste meta-data-global-css-snippet.html (ZIP root)',
                '     into dashboard → Meta Data, JavaScript & CSS (Global)',
                `  3. Confirm styles.css loads at ${GALLERY_CSS_SERVER}/styles.css`,
                `  4. Confirm images are at ${GALLERY_IMAGES_SERVER}/`,
                '  5. Paste these html/*.html files into the CMS regions above',
                '',
                'meta CMS region is not used by this template.',
                '',
            ].join('\n'),
        });

        return files;
    }

    const galleryCmsHtmlFiles = isGallery
        ? buildGalleryCmsHtmlFiles()
        : isMcQueen
            ? buildMcQueenCmsHtmlFiles()
            : [];

    const specJsonShared = {
        template: spec.template || 'Showroom',
        design: spec.design || 'classic',
        sections: isGallery
            ? ['header', 'homepage-hero', 'catalog-highlights', 'footer', 'copyright']
            : isSpotlight
                ? ['header', 'homepage-hero', 'on-sale', 'shop-by-room', 'about-us', 'categories', 'brands', 'newsletter', 'footer']
                : ['header', 'homepage-hero', 'featured-categories', 'about-us', 'feature-cards', 'you-may-like', 'get-inspired', 'footer'],
        generatedAt: exportedAt.toISOString(),
        packageId,
        handoffVersion,
        adaCompliance: {
            required: true,
            placement: 'Very bottom of footer on every website',
            companyName: adaCompanyName,
            markup: adaPasteMarkup,
            popupAttribute: footerForAda.adaCompliancePopup || 'ada-compliance::ADA Compliance::600px',
            snippetFile: 'spec/footer-copyright-snippet.html',
        },
        assets: assets.map((a) => ({
            filename: a.filename,
            zipPath: a.dataUrl && String(a.dataUrl).startsWith('data:')
                ? handoffImageZipPath(a.filename)
                : null,
            label: a.label,
            dimensions: a.dimensions,
            included: Boolean(a.dataUrl && String(a.dataUrl).startsWith('data:')),
        })),
        stylesheets: isSupportHandoff
            ? galleryStylesheets.map((file) => ({
                filename: file.zipPath.split('/').pop(),
                zipPath: file.zipPath,
                serverPath: file.serverPath,
                note: `FTP upload data/ → live ${GALLERY_CSS_SERVER}/[file-name].css`,
            }))
            : [],
        supportInstall: isSupportHandoff
            ? {
                ftpUploadFolder: 'data/',
                ftpContents: isGallery
                    ? ['logicx/css', 'logicx/js', 'logicx/images']
                    : ['logicx/css', 'logicx/images'],
                packageRoot: GALLERY_PACKAGE_ROOT,
                serverRoot: GALLERY_SERVER_ROOT,
                globalMetaSection: 'Meta Data, JavaScript & CSS (Global)',
                snippetFile: GALLERY_META_SNIPPET_ZIP,
                cssZipPath: `${GALLERY_CSS_ZIP_DIR}/`,
                cssServerPath: `${GALLERY_CSS_SERVER}/`,
                imagesZipPath: `${GALLERY_IMAGES_ZIP_DIR}/`,
                imagesServerPath: `${GALLERY_IMAGES_SERVER}/`,
                htmlZipPath: `${GALLERY_HTML_ZIP_DIR}/`,
                htmlPasteOnly: true,
                metaPasteOnly: true,
                assetVersion: galleryAssetVersion,
                assetQuery: galleryAssetQuery,
                stylesheetHref: primaryStylesheetCacheBust,
                scriptHref: galleryNavScriptSrc || undefined,
            }
            : null,
        /** @deprecated use supportInstall — kept for older tooling that still reads devops */
        devops: isSupportHandoff
            ? {
                globalMetaSection: 'Meta Data, JavaScript & CSS (Global)',
                snippetFile: GALLERY_META_SNIPPET_ZIP,
                cssUploadPath: `${GALLERY_CSS_ZIP_DIR}/`,
                cssServerPath: `${GALLERY_CSS_SERVER}/`,
                assetVersion: galleryAssetVersion,
                stylesheetHref: primaryStylesheetCacheBust,
            }
            : null,
    };

    const specJson = isGallery
        ? {
            ...specJsonShared,
            header: {
                layout: header.layout || 'gallery',
                sticky: header.sticky === true,
                stickyScope: header.stickyScope || 'message-bar-only',
                stickyProductionNote: header.stickyProductionNote
                    || 'Pin only the message bar with CSS position: sticky; top: 0. Logo, main nav, and search must scroll away.',
                logoSharedWithFooter: header.logoSharedWithFooter !== false,
                logo: {
                    filename: header.logoFilename || 'header-logo.png',
                    dimensions: header.logoDimensions || 'max 150 px high',
                    logoSizePx: header.logoSizePx || null,
                    includedInHandoff: assetIncludedInHandoff('header-logo.png'),
                },
                contentColumnWidth: header.contentColumnWidth || '1440 px',
                topBar: header.topBar || {},
                mainNav: header.mainNav || {},
            },
            hero: spec.hero || {},
            catalogHighlights: spec.catalogHighlights || {},
            footer: spec.footer || {},
            copyright: spec.copyright ? {
                companyName: spec.copyright.companyName || spec.copyright.copyrightName || '',
                backgroundColor: spec.copyright.backgroundColor || '',
                textColor: spec.copyright.textColor || '',
                copyrightName: spec.copyright.copyrightName || spec.copyright.companyName || '',
                copyrightSpec: spec.copyright.copyrightSpec || '',
                copyrightMarkup: spec.copyright.copyrightMarkup || '',
                copyrightPasteMarkup: spec.copyright.copyrightPasteMarkup || adaPasteMarkup,
                adaCompliancePopup: spec.copyright.adaCompliancePopup || 'ada-compliance::ADA Compliance::600px',
            } : null,
            imageHandoffPolicy: {
                headerLogo: assetIncludedInHandoff('header-logo.png'),
                heroImages: resolvedHandoffAssets.some((asset) => (
                    String(asset.filename || '').startsWith('gallery-hero-')
                )),
                catalogHighlightTileImages: resolvedHandoffAssets.some((asset) => (
                    String(asset.filename || '').startsWith('gallery-catalog-tile-')
                )),
                templateDefaultsExcluded: true,
            },
        }
        : isSpotlight
            ? {
                ...specJsonShared,
                header: spec.header || {},
                hero: spec.hero || {},
                onSale: spec.onSale || {},
                shopByRoom: spec.shopByRoom || {},
                aboutUs: spec.aboutUs || {},
                categories: spec.categories || {},
                brands: spec.brands || {},
                newsletter: spec.newsletter || {},
                footer: spec.footer || {},
                imageHandoffPolicy: {
                    headerLogo: assetIncludedInHandoff('header-logo.png'),
                    heroSlides: resolvedHandoffAssets.some((asset) => (
                        String(asset.filename || '').startsWith('spotlight-hero-slide-')
                    )),
                    sectionImages: resolvedHandoffAssets.some((asset) => (
                        String(asset.filename || '').startsWith('spotlight-')
                    )),
                    templateDefaultsExcluded: false,
                },
            }
            : {
            ...specJsonShared,
            copy: {
                title: spec.title || '',
                description: spec.description || '',
                cta: spec.cta || '',
                ctaVisible: spec.heroCtaVisible !== false,
                ctaBackgroundColor: spec.heroCtaBackgroundColor || '',
                ctaTextColor: spec.heroCtaTextColor || '#ffffff',
                backgroundColor: spec.copyBackgroundColor || '',
                textColor: spec.copyTextColor || '',
            },
            header: {
                layout: header.layout || 'classic',
                logoSharedWithFooter: header.logoSharedWithFooter !== false,
                logo: {
                    filename: header.logoFilename || 'header-logo.png',
                    dimensions: header.logoDimensions || 'max 220 × 68 px',
                    logoSizePx: header.logoSizePx || null,
                    includedInHandoff: assetIncludedInHandoff('header-logo.png'),
                },
                contentColumnWidth: header.contentColumnWidth || '1429 px',
                banner: {
                    height: headerBanner.height || '50 px',
                    backgroundColor: headerBanner.backgroundColor || '#000000',
                    textColor: headerBanner.textColor || '#ffffff',
                    alignment: headerBanner.alignment || 'right',
                    separator: headerBanner.separator || '|',
                    links: headerBannerLinks,
                },
                toolbar: {
                    layout: headerToolbar.layout || 'search left · logo center · icons right',
                    searchBarHardcoded: headerToolbar.searchBarHardcoded !== false,
                    searchPlaceholder: headerToolbar.searchPlaceholder || 'Enter Keyword or Item#',
                    searchStyle: headerToolbar.searchStyle || 'Single bottom border underline',
                    iconsHardcoded: headerToolbar.iconsHardcoded !== false,
                    icons: Array.isArray(headerToolbar.icons) ? headerToolbar.icons : [],
                },
                mainNav: {
                    editable: headerMainNav.editable !== false,
                    hasDropdowns: headerMainNav.hasDropdowns !== false,
                    fontSize: headerMainNav.fontSize || '15 px',
                    alignment: headerMainNav.alignment || 'Full content width · first category aligns with search · last category aligns with cart',
                    subcategoriesPending: headerMainNav.subcategoriesPending === true,
                    items: headerMainNavItems.map((item) => ({
                        id: item.id || '',
                        label: item.label || '',
                        url: item.url || '',
                        subcategories: (Array.isArray(item.subcategories) ? item.subcategories : []).map((sub) => ({
                            id: sub.id || '',
                            label: sub.label || '',
                            url: sub.url || '',
                            visible: sub.visible !== false,
                        })),
                    })),
                },
            },
            featuredCategories: {
                shopAllUrl: spec.shopAllUrl || '/catalog',
                cardDimensions: spec.featuredCategoryCardSize || '300 × 70 px',
                thumbnailSize: spec.featuredCategoryThumbnailSize || '70 × 70 px',
                imagesHardcoded: spec.featuredCategoryImagesHardcoded !== false,
                imagesIncludedInHandoff: false,
                categories: Array.isArray(spec.featuredCategories) ? spec.featuredCategories : [],
            },
            aboutUs: {
                header: aboutUs.header || '',
                paragraph: aboutUs.paragraph || '',
                employeeImage: {
                    filename: 'about-employee-image.png',
                    dimensions: aboutUs.employeeImageSize || '417 × 282 px',
                    includedInHandoff: true,
                },
                buttonBackgroundColor: aboutUs.buttonBackgroundColor || '#2b2b2b',
                buttonTextColor: aboutUs.buttonTextColor || '#ffffff',
                primaryButton: {
                    label: primaryButton.label || '',
                    url: primaryButton.url || '',
                },
                secondaryButton: {
                    label: secondaryButton.label || '',
                    url: secondaryButton.url || '',
                },
            },
            featureTiles: {
                imageSize: featureTiles.imageSize || '780 × 1014 px',
                buttonBackgroundColor: featureTiles.buttonBackgroundColor || '#2b2b2b',
                buttonTextColor: featureTiles.buttonTextColor || '#ffffff',
                left: {
                    header: featureLeft.header || '',
                    paragraph: featureLeft.paragraph || '',
                    image: {
                        filename: 'feature-left-image.png',
                        dimensions: featureTiles.imageSize || '780 × 1014 px',
                        includedInHandoff: true,
                    },
                    button: {
                        label: leftButton.label || '',
                        url: leftButton.url || '',
                        visible: leftButton.visible !== false,
                    },
                },
                right: {
                    header: featureRight.header || '',
                    paragraph: featureRight.paragraph || '',
                    image: {
                        filename: 'feature-right-image.png',
                        dimensions: featureTiles.imageSize || '780 × 1014 px',
                        includedInHandoff: true,
                    },
                    button: {
                        label: rightButton.label || '',
                        url: rightButton.url || '',
                        visible: rightButton.visible !== false,
                    },
                },
            },
            youMayLike: {
                title: youMayLike.title || 'You May Like',
                imageSize: youMayLike.imageSize || '500 × 750 px',
                imagesIncludedInHandoff: true,
                catalogResolvedOnLiveSite: youMayLike.catalogResolvedOnLiveSite !== false,
                items: youMayLikeItems.map((item) => ({
                    itemNumber: item.itemNumber || '',
                    imageFilename: item.imageFilename || '',
                    previewTitle: item.previewTitle || '',
                    previewPrice: item.previewPrice || '',
                })),
            },
            getInspired: {
                title: getInspired.title || 'Get Inspired',
                lifestyleImage: {
                    filename: 'get-inspired-lifestyle.png',
                    dimensions: getInspired.lifestyleImageSize || '508 × 610 px',
                    includedInHandoff: true,
                },
                cardImageSize: getInspired.cardImageSize || '155 × 155 px',
                gridLayout: getInspired.gridLayout || '4 columns × 2 rows',
                gridImagesIncludedInHandoff: false,
                imageDirectory: getInspired.imageDirectory || 'editor/classic/get-inspired/',
                catalogResolvedOnLiveSite: getInspired.catalogResolvedOnLiveSite !== false,
                items: getInspiredItems.map((item) => ({
                    itemNumber: item.itemNumber || '',
                    row: item.row || '',
                    previewImageFile: item.previewImageFile || '',
                    previewTitle: item.previewTitle || '',
                    previewPrice: item.previewPrice || '',
                })),
            },
            footer: {
                logoUseHeader: footer.logoUseHeader !== false,
                logo: {
                    filename: footer.logoFilename || 'footer-logo.png',
                    dimensions: footer.logoDimensions || 'max 280 × 94 px',
                    includedInHandoff: footer.logoUseHeader === false,
                },
                email: footer.email || '',
                companyName: footer.companyName || '',
                address: footer.address || '',
                phone: footer.phone || '',
                copyrightName: footer.copyrightName || footer.companyName || '',
                copyrightSpec: footer.copyrightSpec || '',
                copyrightMarkup: footer.copyrightMarkup || '',
                copyrightPasteMarkup: footer.copyrightPasteMarkup || adaPasteMarkup,
                adaCompliancePopup: footer.adaCompliancePopup || 'ada-compliance::ADA Compliance::600px',
                social: {
                    facebook: typeof footerSocial.facebook === 'object'
                        ? footerSocial.facebook
                        : { url: footerSocial.facebook || '', visible: true },
                    instagram: typeof footerSocial.instagram === 'object'
                        ? footerSocial.instagram
                        : { url: footerSocial.instagram || '', visible: true },
                    x: typeof footerSocial.x === 'object'
                        ? footerSocial.x
                        : { url: footerSocial.x || '', visible: true },
                    youtube: typeof footerSocial.youtube === 'object'
                        ? footerSocial.youtube
                        : { url: footerSocial.youtube || '', visible: true },
                    linkedin: typeof footerSocial.linkedin === 'object'
                        ? footerSocial.linkedin
                        : { url: footerSocial.linkedin || '', visible: true },
                },
                quickLinks: footerQuickLinks,
                policies: footerPolicies,
            },
            imageHandoffPolicy: {
                headerLogo: assetIncludedInHandoff('header-logo.png'),
                heroImages: false,
                featuredCategoryThumbnails: false,
                aboutEmployeePhoto: true,
                featureCardPhotos: true,
                youMayLikePhotos: true,
                getInspiredLifestylePhoto: true,
                getInspiredGridPhotos: false,
                footerLogoOnlyWhenDifferentFromHeader: true,
            },
            slots: {
                product: {
                    filename: 'product-image.png',
                    dimensions: spec.productImageSize || '563 × 342 px',
                    includedInHandoff: false,
                },
                lifestyle: {
                    filename: 'lifestyle-image.png',
                    dimensions: spec.lifestyleImageSize || '854 × 670 px min',
                    includedInHandoff: false,
                },
            },
        };

    const adaSnippetFile = [
        '<!-- REQUIRED: Paste at the very bottom of every website footer. -->',
        adaPasteMarkup,
        '',
    ].join('\n');

    const readmeText = isGallery
        ? [
            'Showroom Classic — Support Handoff',
            '=================================',
            '',
            'START HERE: Open WELCOME-GUIDE.html, then follow the support install steps.',
            '',
            'FTP — only data/ (css + images under data/logicx/)',
            '  Upload data/ from this ZIP to the site root.',
            `  Live base path: ${GALLERY_SERVER_ROOT}/`,
            '  Do NOT FTP html/ or meta-data-global-css-snippet.html — those are paste-only.',
            '',
            `Handoff version: ${handoffVersion}`,
            `Package ID: ${packageId}`,
            '',
            '1. WELCOME-GUIDE.html — Support install overview',
            '2. HANDOFF-VERSION.txt — Version stamp for debugging',
            `3. ${versionedPdfFilename} — Brief + layout previews (reference)`,
            '4. data/logicx/ — FTP only',
            `   ${GALLERY_CSS_ZIP_DIR}/styles.css → ${GALLERY_CSS_SERVER}/styles.css`,
            `   ${GALLERY_IMAGES_ZIP_DIR}/ → ${GALLERY_IMAGES_SERVER}/`,
            '5. meta-data-global-css-snippet.html (ZIP root) — paste into Meta Data / Global CSS',
            '6. html/ (ZIP root) — CMS paste markup',
            '   html/header.html     → CMS region header',
            '   html/section_1.html  → CMS region section_1 (hero)',
            '   html/section_2.html  → CMS region section_2 (catalog)',
            '   html/footer.html     → CMS region footer (+ copyright/ADA)',
            '7. spec/homepage-spec.json — Structured reference (optional)',
            '8. spec/footer-copyright-snippet.html — ADA reference (also in html/footer.html)',
            '',
            'SUPPORT INSTALL ORDER',
            '  1. FTP upload data/ (css + images under data/logicx/)',
            '  2. Paste meta-data-global-css-snippet.html into Meta Data / Global CSS',
            `  3. Verify ${GALLERY_CSS_SERVER}/styles.css loads in the browser (not 404)`,
            '  4. Paste html/*.html into CMS regions — see html/README.txt',
            '',
            `Example stylesheet link: <link rel="stylesheet" href="${primaryStylesheetCacheBust}">`,
            '',
            'Catalog URLs use /lighting-fixtures as the root. Sticky applies to the message bar only.',
            resolvedHandoffAssets.length
                ? 'Handoff image files are listed in the PDF under “Handoff images”.'
                : 'Template default images are shown in layout previews only — source those separately on the live site.',
        ].join('\n')
        : isMcQueen
            ? [
                'Showroom McQueen — Support Handoff',
                '=================================',
                '',
                'START HERE: Open WELCOME-GUIDE.html, then follow the support install steps.',
                '',
                'FTP — only data/ (css + images under data/logicx/)',
                '  Upload data/ from this ZIP to the site root.',
                `  Live base path: ${GALLERY_SERVER_ROOT}/`,
                '  Do NOT FTP html/ or meta-data-global-css-snippet.html — those are paste-only.',
                '',
                `Handoff version: ${handoffVersion}`,
                `Package ID: ${packageId}`,
                '',
                '1. WELCOME-GUIDE.html — Support install overview',
                '2. HANDOFF-VERSION.txt — Version stamp for debugging',
                `3. ${versionedPdfFilename} — Brief + layout previews (reference)`,
                '4. data/logicx/ — FTP only',
                `   ${GALLERY_CSS_ZIP_DIR}/styles.css → ${GALLERY_CSS_SERVER}/styles.css`,
                `   ${GALLERY_IMAGES_ZIP_DIR}/ → ${GALLERY_IMAGES_SERVER}/`,
                '5. meta-data-global-css-snippet.html (ZIP root) — paste into Meta Data / Global CSS',
                '6. html/ (ZIP root) — CMS paste markup',
                '   html/header.html     → CMS region header',
                '   html/section_1.html  → CMS region section_1 (hero)',
                '   html/section_2.html  → CMS region section_2 (featured categories)',
                '   html/section_3.html  → CMS region section_3 (about us)',
                '   html/section_4.html  → CMS region section_4 (feature cards)',
                '   html/section_5.html  → CMS region section_5 (sketch, when present)',
                '   html/section_6.html  → CMS region section_6 (you may like)',
                '   html/section_7.html  → CMS region section_7 (get inspired)',
                '   html/footer.html     → CMS region footer (+ copyright/ADA)',
                '7. spec/homepage-spec.json — Structured reference (optional)',
                '8. spec/footer-copyright-snippet.html — ADA reference (also in html/footer.html)',
                '',
                'SUPPORT INSTALL ORDER',
                '  1. FTP upload data/ (css + images under data/logicx/)',
                '  2. Paste meta-data-global-css-snippet.html into Meta Data / Global CSS',
                `  3. Verify ${GALLERY_CSS_SERVER}/styles.css loads in the browser (not 404)`,
                '  4. Paste html/*.html into CMS regions — see html/README.txt',
                '',
                `Example stylesheet link: <link rel="stylesheet" href="${primaryStylesheetCacheBust}">`,
                '',
                resolvedHandoffAssets.length
                    ? 'Handoff image files are listed in the PDF under “Handoff images”.'
                    : 'Template default images are shown in layout previews only — source those separately on the live site.',
            ].join('\n')
        : isSpotlight
            ? [
                'Showroom Spotlight — Developer Handoff',
                '======================================',
                '',
                `Handoff version: ${handoffVersion}`,
                `Package ID: ${packageId}`,
                '',
                'START HERE: Open WELCOME-GUIDE.html in your browser, then read the PDF brief.',
                '',
                'REQUIRED — ADA compliance footer (all websites)',
                'Place spec/footer-copyright-snippet.html markup at the very bottom of every site footer.',
                '',
                '1. WELCOME-GUIDE.html — Package overview and install workflow',
                '2. HANDOFF-VERSION.txt — Version stamp for debugging',
                `3. ${versionedPdfFilename} (ZIP root) — Branded cover, copy spec, layout previews, handoff image list`,
                resolvedHandoffAssets.length
                    ? '4. images/ — All handoff image files (header logo, hero slides, section images, footer logo)'
                    : '4. images/ — Omitted (image files could not be resolved for export)',
                '5. spec/homepage-spec.json — Machine-readable spec (Header, Hero, sections, Footer)',
                '6. spec/footer-copyright-snippet.html — Copy-paste copyright + ADA compliance markup',
                '',
                resolvedHandoffAssets.length
                    ? 'Handoff image files are listed in the PDF under “Handoff images”.'
                    : 'Check that editor/Spotlight assets are present and reload the editor before exporting again.',
            ].join('\n')
            : [
            'Showroom Homepage — Developer Handoff',
            '=====================================',
            '',
            `Handoff version: ${handoffVersion}`,
            `Package ID: ${packageId}`,
            '',
            'START HERE: Open WELCOME-GUIDE.html in your browser, then read the PDF brief.',
            '',
            'REQUIRED — ADA compliance footer (all websites)',
            'Place spec/footer-copyright-snippet.html markup at the very bottom of every site footer.',
            '',
            '1. WELCOME-GUIDE.html — Package overview and install workflow',
            '2. HANDOFF-VERSION.txt — Version stamp for debugging',
            `3. ${versionedPdfFilename} (ZIP root) — Branded cover, copy spec, layout previews, and handoff image list`,
            '4. images/ — Client image files referenced in the PDF',
            '5. spec/homepage-spec.json — Machine-readable spec',
            '6. spec/footer-copyright-snippet.html — Copy-paste copyright + ADA compliance markup',
            '',
            'Handoff image files (when present): Header logo, About Us employee photo, feature card photos,',
            'You May Like product images, Get Inspired lifestyle photo, and footer logo only when',
            'it differs from the header. Hero images and featured category thumbnails are not bundled.',
        ].join('\n');

    const zip = new JSZip();
    zip.file(versionedPdfFilename, pdfBlob);
    zip.file('HANDOFF-VERSION.txt', [
        'LogicX Showroom — Handoff Version',
        '================================',
        '',
        `Handoff version: ${handoffVersion}`,
        `Package ID:      ${packageId}`,
        ...(isSupportHandoff ? [
            `Asset version:   v${galleryAssetVersion}`,
            `  CSS:    ${primaryStylesheetCacheBust}`,
            ...(isGallery && galleryNavScriptSrc ? [`  JS:     ${galleryNavScriptSrc}`] : []),
            `  Images: ${GALLERY_IMAGES_SERVER}/[file]${galleryAssetQuery}`,
        ] : []),
        `Template:        ${coverMeta.templateLabel}`,
        `Design:          ${coverMeta.design}`,
        `Company:         ${coverMeta.companyName}`,
        `Exported at:     ${exportedAt.toISOString()}`,
        `ZIP filename:    ${versionedZipFilename}`,
        `PDF filename:    ${versionedPdfFilename}`,
        '',
        'Use this file when debugging a live site so you know which export package was installed.',
        '',
    ].join('\n'));

    const hasGalleryCmsHtml = galleryCmsHtmlFiles.some(
        (file) => (file.path.startsWith('html/') || file.path.includes('/html/'))
            && file.path.endsWith('.html'),
    );

    if (handoffGuide.buildShowroomHandoffGuide) {
        zip.file('WELCOME-GUIDE.html', handoffGuide.buildShowroomHandoffGuide({
            ...coverMeta,
            hasStylesheets: galleryStylesheets.length > 0,
            hasCmsHtml: hasGalleryCmsHtml,
            stylesheetHref: primaryStylesheetCacheBust,
            assetVersion: isSupportHandoff ? galleryAssetVersion : undefined,
            packageRoot: isSupportHandoff ? GALLERY_PACKAGE_ROOT : '',
            serverRoot: isSupportHandoff ? GALLERY_SERVER_ROOT : '',
            metaSnippetPath: isSupportHandoff ? GALLERY_META_SNIPPET_ZIP : '',
            htmlDir: isSupportHandoff ? GALLERY_HTML_ZIP_DIR : '',
            cssDir: isSupportHandoff ? GALLERY_CSS_ZIP_DIR : '',
            imagesDir: isSupportHandoff ? GALLERY_IMAGES_ZIP_DIR : '',
            cssServerPath: isSupportHandoff ? GALLERY_CSS_SERVER : '',
            imagesServerPath: isSupportHandoff ? GALLERY_IMAGES_SERVER : '',
        }));
    }
    if (handoffGuide.buildShowroomHandoffReadme) {
        zip.file('HANDOFF-README.txt', handoffGuide.buildShowroomHandoffReadme({
            ...coverMeta,
            hasStylesheets: galleryStylesheets.length > 0,
            hasCmsHtml: hasGalleryCmsHtml,
            stylesheetHref: primaryStylesheetCacheBust,
            assetVersion: isSupportHandoff ? galleryAssetVersion : undefined,
            packageRoot: isSupportHandoff ? GALLERY_PACKAGE_ROOT : '',
            serverRoot: isSupportHandoff ? GALLERY_SERVER_ROOT : '',
            metaSnippetPath: isSupportHandoff ? GALLERY_META_SNIPPET_ZIP : '',
            htmlDir: isSupportHandoff ? GALLERY_HTML_ZIP_DIR : '',
            cssDir: isSupportHandoff ? GALLERY_CSS_ZIP_DIR : '',
            imagesDir: isSupportHandoff ? GALLERY_IMAGES_ZIP_DIR : '',
            cssServerPath: isSupportHandoff ? GALLERY_CSS_SERVER : '',
            imagesServerPath: isSupportHandoff ? GALLERY_IMAGES_SERVER : '',
        }));
    }

    for (const asset of resolvedHandoffAssets) {
        if (!String(asset.dataUrl).startsWith('data:')) continue;
        zip.file(handoffImageZipPath(asset.filename), dataUrlToBlob(asset.dataUrl));
    }

    for (const stylesheet of galleryStylesheets) {
        zip.file(
            stylesheet.zipPath,
            isSupportHandoff ? stampGalleryAssetBanner(stylesheet.content, 'css') : stylesheet.content,
        );
    }
    for (const script of galleryScripts) {
        zip.file(
            script.zipPath,
            isSupportHandoff ? stampGalleryAssetBanner(script.content, 'js') : script.content,
        );
    }
    if (isSupportHandoff) {
        zip.file(`${GALLERY_CSS_ZIP_DIR}/README.txt`, cssFolderReadme);
        if (galleryScripts.length) {
            zip.file(`${GALLERY_JS_ZIP_DIR}/README.txt`, jsFolderReadme);
        }
        zip.file(GALLERY_META_SNIPPET_ZIP, metaDataGlobalSnippet);
        zip.file(`${GALLERY_PACKAGE_ROOT}/README.txt`, [
            `LogicX ${supportTemplateLabel} homepage — FTP package (css${isGallery ? ' + js' : ''} + images)`,
            '=======================================================',
            '',
            `Handoff version: ${handoffVersion}`,
            `Package ID: ${packageId}`,
            `Asset version: v${galleryAssetVersion}`,
            '',
            'Upload the top-level data/ folder from this ZIP to the site root.',
            `Live base path: ${GALLERY_SERVER_ROOT}/`,
            '',
            'Contents (FTP):',
            `  css/     → ${GALLERY_CSS_SERVER}/`,
            ...(isGallery ? [`  js/      → ${GALLERY_JS_SERVER}/`] : []),
            `  images/  → ${GALLERY_IMAGES_SERVER}/`,
            '',
            'NOT in this folder (paste from ZIP root instead):',
            '  html/                             → CMS regions',
            '  meta-data-global-css-snippet.html → Meta Data, JavaScript & CSS (Global)',
            '',
            'Homepage looks unstyled if styles.css is missing at:',
            `  ${primaryStylesheetCacheBust}`,
            '',
            ...(isGallery ? [
                'Phone hamburger requires gallery-nav.js at:',
                `  ${galleryNavScriptSrc}`,
                '',
            ] : []),
            `After replacing CSS/JS/images, bump Asset version in the editor (now v${galleryAssetVersion})`,
            'and re-paste Meta Data + HTML so browsers load the new files.',
            '',
        ].join('\n'));
    }

    for (const file of galleryCmsHtmlFiles) {
        zip.file(file.path, file.content);
    }

    zip.file('spec/homepage-spec.json', JSON.stringify(specJson, null, 2));
    zip.file('spec/footer-copyright-snippet.html', adaSnippetFile);
    zip.file('spec/README.txt', readmeText);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, versionedZipFilename);

    return { pdfBlob, zipBlob, handoffVersion, packageId, zipFilename: versionedZipFilename };
};

function normalizeFooterLinksForExport(links) {
    if (Array.isArray(links)) {
        return links
            .filter((link) => link?.visible !== false)
            .map((link) => ({
                label: String(link?.label || '').trim(),
                url: String(link?.url || '').trim(),
            }))
            .filter((link) => link.label || link.url);
    }

    if (links && typeof links === 'object') {
        return Object.entries(links).map(([label, url]) => ({
            label: String(label || '').trim(),
            url: String(url || '').trim(),
        }));
    }

    return [];
}

function detectImageFormat(dataUrl) {
    if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) {
        return 'JPEG';
    }
    return 'PNG';
}

function dataUrlToBlob(dataUrl) {
    if (!dataUrl || !String(dataUrl).startsWith('data:')) {
        throw new Error('Invalid asset data URL.');
    }
    const commaIndex = dataUrl.indexOf(',');
    const header = dataUrl.slice(0, commaIndex);
    const base64 = dataUrl.slice(commaIndex + 1);
    const mime = (header.match(/:(.*?);/) || [])[1] || 'application/octet-stream';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
