/**
 * Build Showroom homepage developer handoff: PDF + image files in a ZIP.
 * Requires html2canvas, jspdf, and JSZip.
 */
window.exportShowroomHandoff = async function exportShowroomHandoff(options) {
    const {
        headerEl,
        heroEl,
        categoriesEl,
        aboutEl,
        featureTilesEl,
        sketchSectionEl,
        youMayLikeEl,
        getInspiredEl,
        footerEl,
        spec,
        assets = [],
        pdfFilename = 'showroom-homepage-brief.pdf',
        zipFilename = 'showroom-homepage-handoff.zip',
    } = options;

    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if (typeof html2canvas !== 'function' || !JsPDF) {
        throw new Error('PDF libraries not loaded.');
    }
    if (typeof JSZip === 'undefined') {
        throw new Error('JSZip not loaded.');
    }

    const doc = new JsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
    const margin = 48;
    const labelColW = 118;
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

        const lines = doc.splitTextToSize(String(text), maxWidth);
        const blockH = textBlockHeight(lines, size);
        ensureSpace(blockH + gap);
        doc.text(lines, margin + indent, y);
        y += blockH + gap;
    }

    function writeSectionTitle(title) {
        ensureSpace(36);
        if (y > margin + 24) {
            y += 10;
        }
        writeLines(title, { bold: true, size: 12, gap: 10 });
    }

    function writeCodeBlock(code, opts = {}) {
        const {
            size = 8,
            gap = 12,
            pad = 10,
            maxWidth = contentW - pad * 2,
        } = opts;
        const codeText = String(code || '').trim() || '—';

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

    function writeSpecRows(rows) {
        for (const [label, value] of rows) {
            const valueLines = doc.splitTextToSize(String(value ?? '—'), contentW - labelColW);
            const rowH = Math.max(lineHeight(10), textBlockHeight(valueLines, 10)) + 8;
            ensureSpace(rowH);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`${label}:`, margin, y);

            doc.setFont('helvetica', 'normal');
            doc.text(valueLines, margin + labelColW, y);

            y += rowH;
        }
    }

    function writeItemList(items, formatLine) {
        items.forEach((item, index) => {
            writeLines(formatLine(item, index), { size: 9, color: [70, 70, 70], gap: 6 });
        });
    }

    /** jsPDF built-in fonts are WinAnsi — use ASCII arrows, not Unicode → */
    function pdfLinkLine(label, url, suffix = '') {
        const safeLabel = String(label || '-').trim() || '-';
        const safeUrl = String(url || '-').trim() || '-';
        return suffix ? `${safeLabel} -> ${safeUrl} ${suffix}` : `${safeLabel} -> ${safeUrl}`;
    }

    function writeSubcategoryList(items, formatLine) {
        items.forEach((item, index) => {
            const text = String(formatLine(item, index));
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

    function prepareCloneForCapture(clonedDoc, clonedEl) {
        if (clonedEl) {
            clonedEl.classList.add('is-pdf-export-capture');
            clonedEl.style.transform = 'none';
            clonedEl.style.boxShadow = 'none';
        }

        const previewFrame = clonedDoc.getElementById('showroomPreview');
        if (previewFrame) {
            previewFrame.classList.add('is-pdf-export-capture');
            previewFrame.style.transform = 'none';
            previewFrame.style.boxShadow = 'none';
        }

        clonedDoc.querySelectorAll('.showroom-you-may-like-track').forEach((track) => {
            track.style.overflow = 'visible';
            track.scrollLeft = 0;
        });
        clonedDoc.querySelectorAll('.showroom-you-may-like-viewport').forEach((viewport) => {
            viewport.style.overflow = 'visible';
        });
        clonedDoc.querySelectorAll('.showroom-hero-copy, .showroom-feature-card-overlay').forEach((panel) => {
            panel.style.overflow = 'hidden';
        });
    }

    async function captureElement(el) {
        if (!el) {
            throw new Error('Nothing to capture for layout preview.');
        }

        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 15000,
            onclone: prepareCloneForCapture,
        });

        if (!canvas.width || !canvas.height) {
            throw new Error('Layout capture failed.');
        }

        return canvas;
    }

    function writePreviewLabel(heading) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(90, 90, 90);
        doc.text(heading, previewEdge, previewEdge + 8);
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
        const caption = `${asset.filename}  ·  ${asset.label}  ·  ${asset.dimensions || '—'}`;
        const captionLines = doc.splitTextToSize(caption, contentW);
        const captionBlockH = textBlockHeight(captionLines, 7);
        doc.text(captionLines, margin, pageH - assetPad - captionBlockH + lineHeight(7));
    }

    // ——— Spec pages ———
    writeLines('Showroom Homepage — Developer Handoff', { bold: true, size: 18, gap: 10 });
    writeLines(`Generated ${new Date().toLocaleString()}`, { size: 9, color: [90, 90, 90], gap: 14 });
    writeLines(
        'This PDF lists copy, links, and layout notes. Section previews and uploaded assets follow on separate pages. Full image files are also in the ZIP.',
        { size: 9, color: [90, 90, 90], gap: 16 },
    );

    const footerForAda = spec.footer || {};
    const adaCompanyName = footerForAda.copyrightName || footerForAda.companyName || 'Company Name';
    const adaPasteMarkup = footerForAda.copyrightPasteMarkup
        || footerForAda.copyrightMarkup
        || `<div id="rightCol"> &copy; ${new Date().getFullYear()} ${adaCompanyName} | All Rights Reserved <a ajax-popup="ada-compliance::ADA Compliance::600px">ADA Compliant</a></div>`;

    writeSectionTitle('Required — Footer ADA compliance (all websites)');
    writeLines(
        'Place the markup below at the very bottom of every website footer. This ADA compliance line is mandatory on all sites.',
        { size: 9, color: [140, 30, 30], gap: 8 },
    );
    writeLines(
        'Copy from the code block below or use footer-copyright-snippet.html in the ZIP.',
        { size: 9, color: [90, 90, 90], gap: 8 },
    );
    writeSpecRows([
        ['Company name', adaCompanyName],
        ['Placement', 'Very bottom of footer on every page/site'],
        ['Popup attribute', footerForAda.adaCompliancePopup || 'ada-compliance::ADA Compliance::600px'],
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
        ['Header logo', header.logoFilename || 'header-logo.png'],
        ['Header logo size', header.logoDimensions || 'max 220 × 68 px'],
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
        writeLines('Top-level categories', { bold: true, size: 10, gap: 4 });
        writeLines(
            headerMainNavItems.map((item) => {
                const categoryUrl = String(item.url || '').trim();
                return categoryUrl ? `${item.label || '—'} (${categoryUrl})` : (item.label || '—');
            }).join(' · '),
            { size: 9, gap: 8 },
        );
        headerMainNavItems.forEach((item) => {
            writeLines(item.label || item.id || 'Category', { bold: true, size: 10, gap: 4 });
            if (item.url) {
                writeLines(`Category link: ${item.url}`, { size: 9, gap: 4 });
            }
            const subs = Array.isArray(item.subcategories) ? item.subcategories : [];
            if (!subs.length) {
                writeLines('No subcategories configured yet.', { size: 9, color: [90, 90, 90], gap: 8 });
                return;
            }
            writeSubcategoryList(
                subs,
                (sub) => {
                    const status = `(${sub.visible === false ? 'hidden' : 'shown'})`;
                    return pdfLinkLine(sub.label, sub.url, status);
                },
            );
            y += 4;
        });
    }

    writeSectionTitle('Hero');
    writeSpecRows([
        ['Collection title', spec.title],
        ['Description', spec.description],
        ['CTA button', spec.cta],
        ['CTA button visible', spec.heroCtaVisible !== false ? 'Yes' : 'No'],
        ['CTA button background', spec.heroCtaBackgroundColor || spec.copyBackgroundColor || '#44301f'],
        ['CTA button text', spec.heroCtaTextColor || '#ffffff'],
        ['Copy background', spec.copyBackgroundColor],
        ['Product image', spec.productImageSize || '563 × 342 px'],
        ['Lifestyle image', spec.lifestyleImageSize || '854 × 670 px min'],
    ]);

    writeSectionTitle('Featured Categories');
    const visibleCategories = spec.featuredCategories || [];
    writeSpecRows([
        ['Shop All link', spec.shopAllUrl || '/catalog'],
        ['Card size', spec.featuredCategoryCardSize || '300 × 70 px'],
        ['Thumbnail size', spec.featuredCategoryThumbnailSize || '70 × 70 px'],
        ['Category images', spec.featuredCategoryImagesHardcoded ? 'Hardcoded — not editable in template' : '—'],
        ['Image directory', spec.featuredCategoryImageDirectory || 'editor/classic/featured-categories/'],
        ['Visible count', String(visibleCategories.length)],
    ]);
    if (visibleCategories.length) {
        writeItemList(visibleCategories, (category) => (
            `${category.label || category.id || '—'} · ${category.imageFile || '—'}`
        ));
    }

    writeSectionTitle('About Us');
    const aboutUs = spec.aboutUs || {};
    const primaryButton = aboutUs.primaryButton || {};
    const secondaryButton = aboutUs.secondaryButton || {};
    writeSpecRows([
        ['Header', aboutUs.header],
        ['Paragraph', aboutUs.paragraph],
        ['Employee photo', aboutUs.employeeImageSize || '417 × 282 px'],
        ['Primary button', pdfLinkLine(primaryButton.label, primaryButton.url)],
        ['Secondary button', pdfLinkLine(secondaryButton.label, secondaryButton.url)],
        ['Button background', aboutUs.buttonBackgroundColor || '#2b2b2b'],
        ['Button text', aboutUs.buttonTextColor || '#ffffff'],
    ]);

    writeSectionTitle('Feature Cards');
    const featureTiles = spec.featureTiles || {};
    const featureLeft = featureTiles.left || {};
    const featureRight = featureTiles.right || {};
    const leftButton = featureLeft.button || {};
    const rightButton = featureRight.button || {};
    writeSpecRows([
        ['Photo size', featureTiles.imageSize || '780 × 1014 px'],
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

    writeSectionTitle('Sketch Section');
    const sketchSection = spec.sketchSection || {};
    const sketchCards = sketchSection.cards || [];
    writeSpecRows([
        ['Visible', sketchSection.visible !== false ? 'Yes' : 'No'],
        ['Icon size', sketchSection.imageSize || '180 × 78 px'],
    ]);
    if (sketchSection.visible !== false) {
        writeItemList(sketchCards, (card, index) => (
            `${index + 1}. ${card.header || '—'} — ${card.imageFile || '—'}`
        ));
    }

    writeSectionTitle('You May Like');
    const youMayLike = spec.youMayLike || {};
    const youMayLikeItems = youMayLike.items || [];
    writeSpecRows([
        ['Title', youMayLike.title || 'You May Like'],
        ['Image size', youMayLike.imageSize || '500 × 750 px'],
        ['Product count', String(youMayLike.itemCount || youMayLikeItems.length || 0)],
        ['Live site', 'Title, name, and price from You May Like dashboard attribute'],
    ]);
    writeItemList(youMayLikeItems, (item) => (
        `${item.index || '—'}. ${item.itemNumber || '—'}`
    ));

    writeSectionTitle('Get Inspired');
    const getInspired = spec.getInspired || {};
    const getInspiredItems = getInspired.items || [];
    writeSpecRows([
        ['Title', getInspired.title || 'Get Inspired'],
        ['Lifestyle (left)', getInspired.lifestyleImageSize || '508 × 610 px'],
        ['Grid cards', getInspired.cardImageSize || '155 × 155 px'],
        ['Live site', 'Name, price, and image from You May Like dashboard attribute'],
    ]);
    writeItemList(getInspiredItems, (item) => (
        `${item.index || '—'}. Item #${item.itemNumber || '—'} (${item.row || '—'} row) · ${item.previewTitle || '—'}`
    ));

    writeSectionTitle('Footer');
    const footer = spec.footer || {};
    const footerSocial = footer.social || {};
    const footerQuickLinks = normalizeFooterLinksForExport(footer.quickLinks);
    const footerPolicies = normalizeFooterLinksForExport(footer.policies);
    const formatFooterSocial = (entry) => {
        if (!entry) return '—';
        if (typeof entry === 'string') return entry || '—';
        const status = entry.visible === false ? 'hidden' : 'shown';
        return `${entry.url || '—'} (${status})`;
    };
    writeSpecRows([
        ['Footer logo', footer.logoUseHeader !== false ? 'Same as header (header-logo.png)' : (footer.logoFilename || 'footer-logo.png')],
        ['Footer logo size', footer.logoDimensions || 'max 280 × 94 px'],
        ['Email', footer.email],
        ['Company', footer.companyName],
        ['Address', footer.address],
        ['Phone', footer.phone],
        ['Copyright', footer.copyrightSpec
            || `© ${new Date().getFullYear()} ${footer.copyrightName || footer.companyName || '—'} | All Rights Reserved · ADA Compliant (ada-compliance::ADA Compliance::600px)`],
        ['Copyright markup', footer.copyrightPasteMarkup || footer.copyrightMarkup || '—'],
        ['Facebook', formatFooterSocial(footerSocial.facebook)],
        ['Instagram', formatFooterSocial(footerSocial.instagram)],
        ['X', formatFooterSocial(footerSocial.x)],
        ['YouTube', formatFooterSocial(footerSocial.youtube)],
        ['LinkedIn', formatFooterSocial(footerSocial.linkedin)],
    ]);
    if (footerQuickLinks.length) {
        writeLines('Quick Links', { bold: true, size: 10, gap: 4 });
        writeItemList(
            footerQuickLinks,
            (item) => `${item.label}: ${item.url || '—'}`,
        );
    }
    if (footerPolicies.length) {
        writeLines('Policies', { bold: true, size: 10, gap: 4 });
        writeItemList(
            footerPolicies,
            (item) => `${item.label}: ${item.url || '—'}`,
        );
    }

    writeSectionTitle('ZIP assets');
    const includedAssets = assets.filter((asset) => asset.dataUrl);
    if (!includedAssets.length) {
        writeLines('No images uploaded in this draft.', { size: 9, color: [90, 90, 90], gap: 8 });
    } else {
        writeItemList(includedAssets, (asset, index) => (
            `${index + 1}. ${asset.filename} — ${asset.label} (${asset.dimensions})`
        ));
    }

    // ——— Layout previews (one section per page group) ———
    const heroTarget = heroEl || options.previewEl;
    if (!heroTarget) {
        throw new Error('Nothing to capture for hero preview.');
    }

    if (headerEl) {
        await appendCanvasPreview(await captureElement(headerEl), 'Preview — Header');
    }

    await appendCanvasPreview(await captureElement(heroTarget), 'Preview — Hero');

    if (categoriesEl) {
        await appendCanvasPreview(await captureElement(categoriesEl), 'Preview — Featured Categories');
    }
    if (aboutEl) {
        await appendCanvasPreview(await captureElement(aboutEl), 'Preview — About Us');
    }
    if (featureTilesEl) {
        await appendCanvasPreview(await captureElement(featureTilesEl), 'Preview — Feature Cards');
    }
    if (sketchSectionEl && sketchSection.visible !== false) {
        await appendCanvasPreview(await captureElement(sketchSectionEl), 'Preview — Sketch Section');
    }
    if (youMayLikeEl) {
        await appendCanvasPreview(await captureElement(youMayLikeEl), 'Preview — You May Like');
    }
    if (getInspiredEl) {
        await appendCanvasPreview(await captureElement(getInspiredEl), 'Preview — Get Inspired');
    }
    if (footerEl) {
        await appendCanvasPreview(await captureElement(footerEl), 'Preview — Footer');
    }

    // ——— Uploaded asset pages ———
    for (const asset of includedAssets) {
        await appendAssetPage(asset);
    }

    const pdfBlob = doc.output('blob');

    const zip = new JSZip();
    zip.file(pdfFilename, pdfBlob);

    const specJson = {
        template: spec.template || 'Showroom',
        sections: ['header', 'homepage-hero', 'featured-categories', 'about-us', 'feature-cards', 'sketch-section', 'you-may-like', 'get-inspired', 'footer'],
        generatedAt: new Date().toISOString(),
        adaCompliance: {
            required: true,
            placement: 'Very bottom of footer on every website',
            companyName: adaCompanyName,
            markup: adaPasteMarkup,
            popupAttribute: footerForAda.adaCompliancePopup || 'ada-compliance::ADA Compliance::600px',
            snippetFile: 'footer-copyright-snippet.html',
        },
        copy: {
            title: spec.title || '',
            description: spec.description || '',
            cta: spec.cta || '',
            ctaVisible: spec.heroCtaVisible !== false,
            ctaBackgroundColor: spec.heroCtaBackgroundColor || '',
            ctaTextColor: spec.heroCtaTextColor || '#ffffff',
            backgroundColor: spec.copyBackgroundColor || '',
        },
        header: {
            logoSharedWithFooter: header.logoSharedWithFooter !== false,
            logo: {
                filename: header.logoFilename || 'header-logo.png',
                dimensions: header.logoDimensions || 'max 220 × 68 px',
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
            imageDirectory: spec.featuredCategoryImageDirectory || 'editor/classic/featured-categories/',
            imagesHardcoded: spec.featuredCategoryImagesHardcoded !== false,
            visible: spec.featuredCategories || [],
        },
        aboutUs: {
            header: aboutUs.header || '',
            paragraph: aboutUs.paragraph || '',
            employeeImage: {
                filename: 'about-employee-image.png',
                dimensions: aboutUs.employeeImageSize || '417 × 282 px',
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
                image: { filename: 'feature-left-image.png', dimensions: featureTiles.imageSize || '780 × 1014 px' },
                button: {
                    label: leftButton.label || '',
                    url: leftButton.url || '',
                    visible: leftButton.visible !== false,
                },
            },
            right: {
                header: featureRight.header || '',
                paragraph: featureRight.paragraph || '',
                image: { filename: 'feature-right-image.png', dimensions: featureTiles.imageSize || '780 × 1014 px' },
                button: {
                    label: rightButton.label || '',
                    url: rightButton.url || '',
                    visible: rightButton.visible !== false,
                },
            },
        },
        sketchSection: {
            visible: sketchSection.visible !== false,
            imageSize: sketchSection.imageSize || '180 × 78 px',
            imageDirectory: sketchSection.imageDirectory || 'editor/classic/sketch-section/',
            cards: sketchCards.map((card) => ({
                id: card.id || '',
                imageFile: card.imageFile || '',
                header: card.header || '',
                paragraph: card.paragraph || '',
            })),
        },
        youMayLike: {
            title: youMayLike.title || 'You May Like',
            imageSize: youMayLike.imageSize || '500 × 750 px',
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
            },
            cardImageSize: getInspired.cardImageSize || '155 × 155 px',
            gridLayout: getInspired.gridLayout || '4 columns × 2 rows',
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
        slots: {
            product: { filename: 'product-image.png', dimensions: spec.productImageSize || '563 × 342 px' },
            lifestyle: { filename: 'lifestyle-image.png', dimensions: spec.lifestyleImageSize || '854 × 670 px min' },
        },
        assets: assets.map((a) => ({
            filename: a.filename,
            label: a.label,
            dimensions: a.dimensions,
            included: Boolean(a.dataUrl),
        })),
    };

    zip.file('homepage-spec.json', JSON.stringify(specJson, null, 2));
    const adaSnippetFile = [
        '<!-- REQUIRED: Paste at the very bottom of every website footer. -->',
        adaPasteMarkup,
        '',
    ].join('\n');

    zip.file('footer-copyright-snippet.html', adaSnippetFile);
    zip.file('README.txt', [
        'Showroom Homepage — Developer Handoff',
        '=====================================',
        '',
        'REQUIRED — ADA compliance footer (all websites)',
        'Place footer-copyright-snippet.html markup at the very bottom of every site footer.',
        '',
        `${pdfFilename} — Copy spec (header, main nav, all sections), layout previews, and uploaded assets`,
        'homepage-spec.json — Machine-readable spec',
        'footer-copyright-snippet.html — Copy-paste copyright + ADA compliance markup',
        '',
        'Image files in this ZIP match the filenames listed in the PDF spec.',
    ].join('\n'));

    for (const asset of includedAssets) {
        zip.file(asset.filename, dataUrlToBlob(asset.dataUrl));
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, zipFilename);

    return { pdfBlob, zipBlob };
};

function normalizeFooterLinksForExport(links) {
    if (Array.isArray(links)) {
        return links
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
    const [header, base64] = dataUrl.split(',');
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
