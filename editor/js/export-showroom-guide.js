/**
 * Showroom handoff — welcome HTML guide + PDF cover page.
 * Loaded before export-pdf.js; used by exportShowroomHandoff.
 */
(function () {
    'use strict';

    const GOLD = '#c9a96e';
    const CHARCOAL = '#222f36';
    const CHARCOAL_DEEP = '#1a252b';

    function escapeHtml(text) {
        return String(text ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function detectImageFormat(dataUrl) {
        const src = String(dataUrl || '');
        if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) {
            return 'JPEG';
        }
        return 'PNG';
    }

    function buildPackageId() {
        return 'SHR-' + Date.now().toString(36).toUpperCase().slice(-6);
    }

    /** Human-readable export stamp for debugging which ZIP is on the client site. */
    function buildHandoffVersion(date) {
        const d = date instanceof Date ? date : new Date();
        const pad = (n) => String(n).padStart(2, '0');
        return (
            `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
            + `-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
        );
    }

    function withHandoffVersion(filename, version) {
        const name = String(filename || '');
        const ver = String(version || '').trim();
        if (!ver || !name) return name;
        if (name.includes(`-${ver}.`) || name.endsWith(`-${ver}`)) return name;
        return name.replace(/(\.[^.]+)$/, `-${ver}$1`);
    }

    function getSectionList(meta) {
        const design = meta.design || 'classic';
        if (design === 'gallery') {
            return ['Header', 'Hero', 'Catalog Highlights', 'Footer', 'Copyright'];
        }
        if (design === 'spotlight') {
            return [
                'Header', 'Hero', 'On Sale', 'Shop by Room', 'About Us',
                'Categories', 'Brands', 'Newsletter', 'Footer',
            ];
        }
        return [
            'Header', 'Hero', 'Featured Categories', 'About Us', 'Feature Cards',
            'You May Like', 'Get Inspired', 'Footer',
        ];
    }

    function appendShowroomPdfCover(doc, meta) {
        const margin = 48;
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const companyName = String(meta.companyName || 'Your Showroom').trim() || 'Your Showroom';
        const templateLabel = String(meta.templateLabel || 'Showroom').trim() || 'Showroom';
        const packageId = meta.packageId || buildPackageId();
        const handoffVersion = meta.handoffVersion || buildHandoffVersion();
        const dateStr = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });

        doc.setFillColor(26, 37, 43);
        doc.rect(0, 0, pageW, pageH, 'F');
        doc.setFillColor(34, 47, 54);
        doc.rect(0, pageH * 0.38, pageW, pageH * 0.62, 'F');

        doc.setDrawColor(201, 169, 110);
        doc.setLineWidth(2);
        doc.line(margin, 96, margin + 72, 96);

        doc.setTextColor(201, 169, 110);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('LOGICX SHOWROOM', margin, 82);

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text('Homepage Handoff Package', margin, 118);

        let titleY = 200;
        const logoDataUrl = meta.logoDataUrl && String(meta.logoDataUrl).startsWith('data:')
            ? meta.logoDataUrl
            : '';

        if (logoDataUrl) {
            try {
                const maxLogoW = 260;
                const maxLogoH = 72;
                const props = doc.getImageProperties(logoDataUrl);
                const scale = Math.min(maxLogoW / props.width, maxLogoH / props.height, 1);
                const drawW = props.width * scale;
                const drawH = props.height * scale;
                const drawX = (pageW - drawW) / 2;
                doc.addImage(
                    logoDataUrl,
                    detectImageFormat(logoDataUrl),
                    drawX,
                    148,
                    drawW,
                    drawH,
                );
                titleY = 148 + drawH + 36;
            } catch (err) {
                console.warn('[showroom export] PDF cover logo skipped:', err);
            }
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(26);
        doc.text(templateLabel, pageW / 2, titleY, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(200, 208, 216);
        doc.text('Showroom Homepage Template', pageW / 2, titleY + 28, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(160, 170, 180);
        doc.text('PREPARED FOR', pageW / 2, titleY + 72, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        const companyLines = doc.splitTextToSize(companyName, pageW - margin * 2);
        doc.text(companyLines, pageW / 2, titleY + 92, { align: 'center' });

        const sections = getSectionList(meta);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(140, 150, 160);
        doc.text(
            `${sections.length} homepage sections documented in this package`,
            pageW / 2,
            titleY + 92 + companyLines.length * 20 + 16,
            { align: 'center' },
        );

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(120, 130, 140);
        doc.text(`Handoff version  ${handoffVersion}`, margin, pageH - 72);
        doc.text(`Package ID  ${packageId}  ·  Issued  ${dateStr}`, margin, pageH - 56);
        doc.text('Open HANDOFF-VERSION.txt or WELCOME-GUIDE.html to confirm this package', margin, pageH - 40);

        doc.setFillColor(201, 169, 110);
        doc.rect(0, pageH - 5, pageW, 5, 'F');

        doc.addPage();
    }

    function buildShowroomHandoffGuide(meta) {
        const companyName = escapeHtml(meta.companyName || 'Your Showroom');
        const templateLabel = escapeHtml(meta.templateLabel || 'Showroom');
        const design = meta.design || 'classic';
        const packageId = escapeHtml(meta.packageId || buildPackageId());
        const handoffVersion = escapeHtml(meta.handoffVersion || buildHandoffVersion());
        const pdfFilename = escapeHtml(meta.pdfFilename || 'showroom-homepage-brief.pdf');
        const hasImages = Boolean(meta.hasHandoffImages);
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
        const sections = getSectionList(meta);
        const logoDataUrl = meta.logoDataUrl && String(meta.logoDataUrl).startsWith('data:')
            ? meta.logoDataUrl
            : '';
        const logoBlock = logoDataUrl
            ? `<img class="cover-logo" src="${logoDataUrl}" alt="${companyName} logo">`
            : `<div class="cover-logo-placeholder">${companyName}</div>`;

        const sectionTags = sections.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join('');

        const css = [
            '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");',
            '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}',
            'html{font-size:16px}',
            'body{font-family:"Inter",system-ui,sans-serif;background:#eef0f3;color:#1e293b;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
            '.cover{background:linear-gradient(165deg,' + CHARCOAL_DEEP + ' 0%,' + CHARCOAL + ' 55%,#2a3842 100%);min-height:100vh;display:flex;flex-direction:column;padding:48px 56px 40px;position:relative;page-break-after:always;color:#fff}',
            '.cover::after{content:"";position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,' + GOLD + ',#e8d5a8)}',
            '.cover-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:48px}',
            '.cover-brand{font-size:0.68rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.45)}',
            '.cover-pill{font-size:0.65rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:6px 12px;border-radius:999px;border:1px solid rgba(201,169,110,0.45);color:' + GOLD + '}',
            '.cover-main{flex:1;display:flex;flex-direction:column;justify-content:center;max-width:640px}',
            '.cover-logo{max-width:280px;max-height:80px;width:auto;height:auto;margin-bottom:28px;display:block}',
            '.cover-logo-placeholder{font-size:1.5rem;font-weight:700;margin-bottom:28px;color:#fff}',
            '.cover-eyebrow{font-size:0.72rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:12px}',
            '.cover-title{font-size:clamp(2rem,5vw,2.75rem);font-weight:700;line-height:1.1;margin-bottom:8px}',
            '.cover-template{font-size:1.05rem;color:rgba(255,255,255,0.55);margin-bottom:32px}',
            '.cover-for-label{font-size:0.62rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:6px}',
            '.cover-for-name{font-size:1.35rem;font-weight:600}',
            '.cover-meta{margin-top:auto;padding-top:32px;display:flex;gap:32px;flex-wrap:wrap;font-size:0.78rem;color:rgba(255,255,255,0.5)}',
            '.cover-meta strong{color:rgba(255,255,255,0.85);font-weight:600}',
            '.page{max-width:760px;margin:0 auto;padding:56px 32px 80px}',
            '.card{background:#fff;border-radius:12px;padding:32px 36px;margin-bottom:40px;border:1px solid #e2e8f0;box-shadow:0 2px 12px rgba(15,23,42,0.04)}',
            '.card-accent{border-top:3px solid ' + GOLD + '}',
            '.card h2{font-size:1.35rem;font-weight:700;margin-bottom:16px;color:' + CHARCOAL + '}',
            '.card p{font-size:0.9375rem;line-height:1.75;color:#475569;margin-bottom:12px}',
            '.card p:last-child{margin-bottom:0}',
            '.section{margin-bottom:48px}',
            '.section-label{font-size:0.62rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:' + GOLD + ';margin-bottom:6px}',
            '.section h2{font-size:1.5rem;font-weight:700;color:' + CHARCOAL + ';margin-bottom:20px}',
            '.tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}',
            '.tag{font-size:0.72rem;font-weight:600;padding:5px 10px;border-radius:6px;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0}',
            '.file-list{display:flex;flex-direction:column;gap:10px}',
            '.file-item{display:grid;grid-template-columns:1fr;gap:4px;padding:16px 18px;border-radius:10px;background:#fff;border:1px solid #e2e8f0}',
            '.file-item.is-primary{border-left:3px solid ' + GOLD + '}',
            '.file-name{font-size:0.85rem;font-weight:700;font-family:ui-monospace,monospace;color:' + CHARCOAL + '}',
            '.file-desc{font-size:0.8125rem;line-height:1.6;color:#64748b}',
            '.steps{counter-reset:step;display:flex;flex-direction:column;gap:0}',
            '.step{display:grid;grid-template-columns:36px 1fr;gap:16px;padding-bottom:24px;position:relative}',
            '.step:not(:last-child)::before{content:"";position:absolute;left:17px;top:36px;bottom:0;width:2px;background:#e2e8f0}',
            '.step-num{width:36px;height:36px;border-radius:50%;background:' + CHARCOAL + ';color:#fff;font-size:0.85rem;font-weight:700;display:flex;align-items:center;justify-content:center;position:relative;z-index:1}',
            '.step-body{padding-top:4px}',
            '.step-title{font-size:0.9375rem;font-weight:700;color:' + CHARCOAL + ';margin-bottom:4px}',
            '.step-desc{font-size:0.875rem;line-height:1.65;color:#64748b}',
            'code{background:#f1f5f9;border-radius:4px;padding:1px 6px;font-size:0.85em;font-family:ui-monospace,monospace;color:#334155}',
            '.footer-note{margin-top:48px;padding-top:24px;border-top:1px solid #cbd5e1;font-size:0.78rem;color:#94a3b8;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}',
            '@media print{body{background:#fff}.card,.file-item{box-shadow:none;break-inside:avoid}.cover{min-height:100vh}}',
        ].join('\n');

        const hasStylesheets = Boolean(meta.hasStylesheets);
        const isClassicSupport = design === 'gallery';
        const packageRoot = meta.packageRoot || 'data/logicx';
        const serverRoot = meta.serverRoot || '/data/logicx';
        const metaSnippetPath = meta.metaSnippetPath || 'meta-data-global-css-snippet.html';
        const htmlDir = meta.htmlDir || 'html';
        const cssDir = meta.cssDir || `${packageRoot}/css`;
        const imagesDir = meta.imagesDir || `${packageRoot}/images`;
        const cssServerPath = meta.cssServerPath || `${serverRoot}/css`;
        const imagesServerPath = meta.imagesServerPath || `${serverRoot}/images`;
        const stylesheetHref = meta.stylesheetHref || `${cssServerPath}/styles.css?v8`;

        const imageNote = hasImages
            ? `Client images are in <code>${escapeHtml(imagesDir)}/</code> (live: <code>${escapeHtml(imagesServerPath)}/</code>).`
            : 'This export uses template default images — upload final assets on the live site if needed.';

        const hasCmsHtml = isClassicSupport || Boolean(meta.hasCmsHtml);

        const cssStep = isClassicSupport
            ? [
                '    <div class="step"><div class="step-num">4</div><div class="step-body"><div class="step-title">FTP upload data/ (css + images only)</div><div class="step-desc">Upload the top-level <code>data/</code> folder from this ZIP to the site root. Live paths: <code>/data/logicx/css/</code> and <code>/data/logicx/images/</code>. Do <strong>not</strong> FTP <code>html/</code> or <code>meta-data-global-css-snippet.html</code> — those are paste-only from the ZIP root.</div></div></div>',
                '    <div class="step"><div class="step-num">5</div><div class="step-body"><div class="step-title">Paste Meta Data / Global CSS</div><div class="step-desc">Open the client dashboard → <strong>Meta Data, JavaScript &amp; CSS (Global)</strong>. Paste the contents of <code>', escapeHtml(metaSnippetPath), '</code> from the ZIP root (keep both enhanced-search lines; wire <code>', escapeHtml(stylesheetHref), '</code>). Then open that stylesheet URL in a browser — it must not 404 or the homepage will look broken.</div></div></div>',
                `    <div class="step"><div class="step-num">6</div><div class="step-body"><div class="step-title">Confirm images on FTP</div><div class="step-desc">${imageNote}</div></div></div>`,
                '    <div class="step"><div class="step-num">7</div><div class="step-body"><div class="step-title">Paste homepage HTML into CMS regions</div><div class="step-desc">Open <code>', escapeHtml(htmlDir), '/README.txt</code>, then paste <code>header.html</code> → <strong>header</strong>, <code>section_1.html</code> → <strong>section_1</strong>, <code>section_2.html</code> → <strong>section_2</strong>, and <code>footer.html</code> → <strong>footer</strong>. Use the live preview markup — do not rebuild by hand.</div></div></div>',
            ].join('\n')
            : hasStylesheets
                ? [
                    '    <div class="step"><div class="step-num">4</div><div class="step-body"><div class="step-title">Upload homepage CSS</div><div class="step-desc">Upload stylesheets from this ZIP and wire them in Global Meta.</div></div></div>',
                    `    <div class="step"><div class="step-num">5</div><div class="step-body"><div class="step-title">Upload image assets</div><div class="step-desc">${imageNote}</div></div></div>`,
                    '    <div class="step"><div class="step-num">6</div><div class="step-body"><div class="step-title">Build each homepage section</div><div class="step-desc">Match the layout previews in the PDF. Use the spec for exact copy, button labels, navigation links, and footer contact details.</div></div></div>',
                ].join('\n')
                : [
                    `    <div class="step"><div class="step-num">4</div><div class="step-body"><div class="step-title">Upload image assets</div><div class="step-desc">${imageNote}</div></div></div>`,
                    '    <div class="step"><div class="step-num">5</div><div class="step-body"><div class="step-title">Build each homepage section</div><div class="step-desc">Match the layout previews in the PDF. Use the spec for exact copy, button labels, navigation links, and footer contact details.</div></div></div>',
                ].join('\n');

        const cssFileItems = isClassicSupport
            ? [
                `    <div class="file-item is-primary"><div class="file-name">data/</div><div class="file-desc">FTP only — css + images under <code>data/logicx/</code>. Live base: <code>${escapeHtml(serverRoot)}/</code>.</div></div>`,
                `    <div class="file-item is-primary"><div class="file-name">${escapeHtml(cssDir)}/styles.css</div><div class="file-desc">Homepage stylesheet → <code>${escapeHtml(cssServerPath)}/styles.css</code> (must load; 404 = broken homepage).</div></div>`,
                `    <div class="file-item is-primary"><div class="file-name">${escapeHtml(metaSnippetPath)}</div><div class="file-desc">ZIP root — paste into <strong>Meta Data, JavaScript &amp; CSS (Global)</strong>. Not for FTP.</div></div>`,
            ].join('\n')
            : hasStylesheets
                ? [
                    '    <div class="file-item is-primary"><div class="file-name">data/css/styles.css</div><div class="file-desc">Homepage stylesheet for hosting upload.</div></div>',
                ].join('\n')
                : '';

        const cmsHtmlFileItems = hasCmsHtml
            ? [
                `    <div class="file-item is-primary"><div class="file-name">${escapeHtml(htmlDir)}/</div><div class="file-desc">CMS paste markup from the live preview. <code>header.html</code> → header, <code>section_1.html</code> → section_1, <code>section_2.html</code> → section_2, <code>footer.html</code> → footer (includes copyright/ADA).</div></div>`,
            ].join('\n')
            : '';

        return [
            '<!DOCTYPE html>',
            '<html lang="en">',
            '<head>',
            '<meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width,initial-scale=1">',
            `<title>${templateLabel} — ${companyName} Handoff Guide</title>`,
            '<style>', css, '</style>',
            '</head>',
            '<body>',
            '<div class="cover">',
            '  <div class="cover-top">',
            '    <div class="cover-brand">LogicX Showroom Editor</div>',
            '    <div class="cover-pill">Handoff Package</div>',
            '  </div>',
            '  <div class="cover-main">',
            logoBlock,
            '    <div class="cover-eyebrow">Homepage template</div>',
            `    <div class="cover-title">${companyName}</div>`,
            `    <div class="cover-template">${templateLabel} layout · configured in the Showroom editor</div>`,
            '    <div class="cover-for-label">Package prepared for</div>',
            `    <div class="cover-for-name">${companyName}</div>`,
            '  </div>',
            '  <div class="cover-meta">',
            `    <div><strong>Handoff version</strong><br>${handoffVersion}</div>`,
            `    <div><strong>Package ID</strong><br>${packageId}</div>`,
            `    <div><strong>Issued</strong><br>${escapeHtml(date)}</div>`,
            `    <div><strong>Sections</strong><br>${sections.length} documented</div>`,
            '  </div>',
            '</div>',
            '<div class="page">',
            '<div class="card card-accent">',
            `  <h2>Welcome, ${companyName}</h2>`,
            `  <p>This package is for the onboarding / tech support agent implementing the <strong>${templateLabel}</strong> homepage with the client — FTP assets, paste Meta Data CSS, then paste CMS HTML. No web developer required for a standard install.</p>`,
            hasCmsHtml
                ? `  <p>FTP <code>data/</code> (css + images under <code>data/logicx/</code>), paste <code>${escapeHtml(metaSnippetPath)}</code> into <strong>Meta Data, JavaScript &amp; CSS (Global)</strong>, verify the stylesheet URL loads, then paste <code>${escapeHtml(htmlDir)}/</code> into each CMS region. Copyright/ADA is already at the bottom of <code>footer.html</code>.</p>`
                : '  <p>Start with the PDF brief for the full technical spec and section screenshots, then use the JSON spec, CSS, and HTML snippets for implementation. The ADA compliance footer markup is required on every page of the live site.</p>',
            '</div>',
            '<div class="section">',
            '  <div class="section-label">Homepage scope</div>',
            '  <h2>Sections in this template</h2>',
            '  <div class="tags">', sectionTags, '</div>',
            '</div>',
            '<div class="section">',
            '  <div class="section-label">Getting started</div>',
            '  <h2>Recommended workflow</h2>',
            '  <div class="steps">',
            hasCmsHtml
                ? [
                    '    <div class="step"><div class="step-num">1</div><div class="step-body"><div class="step-title">Skim the brief</div><div class="step-desc">Open <code>', pdfFilename, '</code> for layout previews and the image inventory. You will paste HTML — do not rebuild sections from the PDF.</div></div></div>',
                    '    <div class="step"><div class="step-num">2</div><div class="step-body"><div class="step-title">Read the CMS paste map</div><div class="step-desc">Open <code>', escapeHtml(htmlDir), '/README.txt</code> for which file goes into which dashboard region.</div></div></div>',
                    '    <div class="step"><div class="step-num">3</div><div class="step-body"><div class="step-title">Copyright / ADA is in the footer file</div><div class="step-desc"><code>', escapeHtml(htmlDir), '/footer.html</code> already includes the copyright + ADA block at the bottom.</div></div></div>',
                ].join('\n')
                : [
                    '    <div class="step"><div class="step-num">1</div><div class="step-body"><div class="step-title">Open the developer brief</div><div class="step-desc">Read <code>', pdfFilename, '</code> first — it includes copy, URLs, colors, layout preview captures, and the handoff image inventory.</div></div></div>',
                    '    <div class="step"><div class="step-num">2</div><div class="step-body"><div class="step-title">Use the machine-readable spec</div><div class="step-desc">Import or reference <code>spec/homepage-spec.json</code> for structured field values, section order, and asset filenames.</div></div></div>',
                    '    <div class="step"><div class="step-num">3</div><div class="step-body"><div class="step-title">Install ADA footer markup</div><div class="step-desc">Copy <code>spec/footer-copyright-snippet.html</code> to the very bottom of every site footer — this is mandatory on all LogicX showroom sites.</div></div></div>',
                ].join('\n'),
            cssStep,
            '  </div>',
            '</div>',
            '<div class="section">',
            '  <div class="section-label">Package contents</div>',
            '  <h2>What\'s in this ZIP</h2>',
            '  <div class="file-list">',
            `    <div class="file-item is-primary"><div class="file-name">${pdfFilename}</div><div class="file-desc">Developer brief with a branded cover, full copy spec, layout preview screenshots, and handoff image list.</div></div>`,
            '    <div class="file-item is-primary"><div class="file-name">WELCOME-GUIDE.html</div><div class="file-desc">This guide — open in any browser for a readable overview of the package and recommended install steps.</div></div>',
            cmsHtmlFileItems,
            cssFileItems,
            '    <div class="file-item"><div class="file-name">spec/homepage-spec.json</div><div class="file-desc">Structured configuration: header, hero, sections, footer, copyright, stylesheets, and asset metadata.</div></div>',
            '    <div class="file-item"><div class="file-name">spec/footer-copyright-snippet.html</div><div class="file-desc">Required ADA compliance + copyright markup for the site footer.</div></div>',
            hasImages
                ? '    <div class="file-item"><div class="file-name">images/</div><div class="file-desc">Client-uploaded image files referenced in the brief (logos, hero photos, section images).</div></div>'
                : '',
            '    <div class="file-item"><div class="file-name">spec/README.txt</div><div class="file-desc">Quick reference index for developers.</div></div>',
            '  </div>',
            '</div>',
            '<div class="footer-note">',
            `  <span>LogicX Showroom · ${templateLabel}</span>`,
            `  <span>v${handoffVersion} · ${packageId} · ${escapeHtml(date)}</span>`,
            '</div>',
            '</div>',
            '</body>',
            '</html>',
        ].join('\n');
    }

    function buildShowroomHandoffReadme(meta) {
        const templateLabel = meta.templateLabel || 'Showroom';
        const pdfFilename = meta.pdfFilename || 'showroom-homepage-brief.pdf';
        const hasImages = Boolean(meta.hasHandoffImages);
        const hasStylesheets = Boolean(meta.hasStylesheets);
        const design = meta.design || 'classic';
        const handoffVersion = meta.handoffVersion || buildHandoffVersion();
        const packageId = meta.packageId || buildPackageId();
        const packageRoot = meta.packageRoot || 'data/logicx';
        const serverRoot = meta.serverRoot || '/data/logicx';
        const metaSnippetPath = meta.metaSnippetPath || 'meta-data-global-css-snippet.html';
        const htmlDir = meta.htmlDir || 'html';
        const cssDir = meta.cssDir || `${packageRoot}/css`;
        const imagesDir = meta.imagesDir || `${packageRoot}/images`;
        const cssServerPath = meta.cssServerPath || `${serverRoot}/css`;
        const imagesServerPath = meta.imagesServerPath || `${serverRoot}/images`;
        const stylesheetHref = meta.stylesheetHref || `${cssServerPath}/styles.css?v8`;

        if (design === 'gallery') {
            return [
                `${templateLabel.toUpperCase()} — SUPPORT HANDOFF PACKAGE`,
                '='.repeat(40),
                '',
                'HANDOFF VERSION',
                '--------------',
                `  ${handoffVersion}`,
                `  Package ID: ${packageId}`,
                '  See also: HANDOFF-VERSION.txt',
                '',
                'START HERE',
                '----------',
                '  1. WELCOME-GUIDE.html         — Open in browser (support install steps)',
                `  2. ${pdfFilename}   — Brief + layout previews`,
                '  3. data/logicx/               — FTP only (css + images)',
                `       Live base: ${serverRoot}/`,
                `  4. ${metaSnippetPath} — paste into Meta Data / Global CSS`,
                `  5. ${htmlDir}/                  — CMS paste files (not FTP)`,
                '',
                'FTP TREE (inside data/)',
                '-----------------------',
                `  ${cssDir}/styles.css`,
                `    → ${cssServerPath}/styles.css`,
                hasImages ? `  ${imagesDir}/` : '',
                hasImages ? `    → ${imagesServerPath}/` : '',
                '',
                'SUPPORT INSTALL ORDER',
                '---------------------',
                '  1. FTP upload data/ to the site root (css + images under data/logicx/)',
                `  2. Paste ${metaSnippetPath}`,
                '     into Meta Data, JavaScript & CSS (Global)',
                `  3. Verify ${cssServerPath}/styles.css loads (not 404)`,
                `  4. Paste ${htmlDir}/*.html into CMS regions:`,
                '       header.html     → header',
                '       section_1.html  → section_1',
                '       section_2.html  → section_2',
                '       footer.html     → footer (includes copyright/ADA)',
                '',
                'STYLESHEET LINK',
                '---------------',
                `  <link rel="stylesheet" href="${stylesheetHref}">`,
                '',
                'REFERENCE (optional)',
                '--------------------',
                '  spec/homepage-spec.json',
                '  spec/footer-copyright-snippet.html',
                '',
                'Generated by LogicX Showroom Editor — ' + new Date().toLocaleDateString(),
            ].filter(Boolean).join('\n');
        }

        return [
            `${templateLabel.toUpperCase()} — SHOWROOM HANDOFF PACKAGE`,
            '='.repeat(40),
            '',
            'HANDOFF VERSION',
            '--------------',
            `  ${handoffVersion}`,
            `  Package ID: ${packageId}`,
            '  See also: HANDOFF-VERSION.txt',
            '',
            'START HERE',
            '----------',
            '  1. WELCOME-GUIDE.html         — Open in browser for package overview',
            `  2. ${pdfFilename}   — Brief (cover + spec + previews)`,
            '  3. spec/homepage-spec.json    — Machine-readable configuration',
            '  4. spec/footer-copyright-snippet.html — Required ADA footer markup',
            hasStylesheets ? '  5. data/css/styles.css         — Homepage stylesheet' : '',
            hasImages ? '  6. images/                    — Client-uploaded handoff images' : '',
            '',
            'REQUIRED',
            '--------',
            '  Paste spec/footer-copyright-snippet.html at the very bottom of every site footer.',
            '',
            'Generated by LogicX Showroom Editor — ' + new Date().toLocaleDateString(),
        ].filter(Boolean).join('\n');
    }

    window.ShowroomHandoffGuide = {
        buildPackageId,
        buildHandoffVersion,
        withHandoffVersion,
        appendShowroomPdfCover,
        buildShowroomHandoffGuide,
        buildShowroomHandoffReadme,
    };
}());
