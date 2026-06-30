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
        doc.text(`Package ID  ${packageId}`, margin, pageH - 72);
        doc.text(`Issued  ${dateStr}`, margin, pageH - 56);
        doc.text('Open WELCOME-GUIDE.html in this ZIP for the full rundown', margin, pageH - 40);

        doc.setFillColor(201, 169, 110);
        doc.rect(0, pageH - 5, pageW, 5, 'F');

        doc.addPage();
    }

    function buildShowroomHandoffGuide(meta) {
        const companyName = escapeHtml(meta.companyName || 'Your Showroom');
        const templateLabel = escapeHtml(meta.templateLabel || 'Showroom');
        const design = meta.design || 'classic';
        const packageId = escapeHtml(meta.packageId || buildPackageId());
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

        const imageNote = hasImages
            ? 'Client-provided images are included in the <code>images/</code> folder.'
            : 'This export uses template default images — upload final assets on the live site.';

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
            `    <div><strong>Package ID</strong><br>${packageId}</div>`,
            `    <div><strong>Issued</strong><br>${escapeHtml(date)}</div>`,
            `    <div><strong>Sections</strong><br>${sections.length} documented</div>`,
            '  </div>',
            '</div>',
            '<div class="page">',
            '<div class="card card-accent">',
            `  <h2>Welcome, ${companyName}</h2>`,
            `  <p>This package contains everything your developer or onboarding team needs to implement the <strong>${templateLabel}</strong> showroom homepage — copy, links, layout previews, and configuration notes.</p>`,
            '  <p>Start with the PDF brief for the full technical spec and section screenshots, then use the JSON spec and HTML snippets for implementation. The ADA compliance footer markup is required on every page of the live site.</p>',
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
            '    <div class="step"><div class="step-num">1</div><div class="step-body"><div class="step-title">Open the developer brief</div><div class="step-desc">Read <code>', pdfFilename, '</code> first — it includes copy, URLs, colors, layout preview captures, and the handoff image inventory.</div></div></div>',
            '    <div class="step"><div class="step-num">2</div><div class="step-body"><div class="step-title">Use the machine-readable spec</div><div class="step-desc">Import or reference <code>spec/homepage-spec.json</code> for structured field values, section order, and asset filenames.</div></div></div>',
            '    <div class="step"><div class="step-num">3</div><div class="step-body"><div class="step-title">Install ADA footer markup</div><div class="step-desc">Copy <code>spec/footer-copyright-snippet.html</code> to the very bottom of every site footer — this is mandatory on all LogicX showroom sites.</div></div></div>',
            `    <div class="step"><div class="step-num">4</div><div class="step-body"><div class="step-title">Upload image assets</div><div class="step-desc">${imageNote}</div></div></div>`,
            '    <div class="step"><div class="step-num">5</div><div class="step-body"><div class="step-title">Build each homepage section</div><div class="step-desc">Match the layout previews in the PDF. Use the spec for exact copy, button labels, navigation links, and footer contact details.</div></div></div>',
            '  </div>',
            '</div>',
            '<div class="section">',
            '  <div class="section-label">Package contents</div>',
            '  <h2>What\'s in this ZIP</h2>',
            '  <div class="file-list">',
            `    <div class="file-item is-primary"><div class="file-name">${pdfFilename}</div><div class="file-desc">Developer brief with a branded cover, full copy spec, layout preview screenshots, and handoff image list.</div></div>`,
            '    <div class="file-item is-primary"><div class="file-name">WELCOME-GUIDE.html</div><div class="file-desc">This guide — open in any browser for a readable overview of the package and recommended install steps.</div></div>',
            '    <div class="file-item"><div class="file-name">spec/homepage-spec.json</div><div class="file-desc">Structured configuration: header, hero, sections, footer, copyright, and asset metadata.</div></div>',
            '    <div class="file-item"><div class="file-name">spec/footer-copyright-snippet.html</div><div class="file-desc">Required ADA compliance + copyright markup for the site footer.</div></div>',
            hasImages
                ? '    <div class="file-item"><div class="file-name">images/</div><div class="file-desc">Client-uploaded image files referenced in the brief (logos, hero photos, section images).</div></div>'
                : '',
            '    <div class="file-item"><div class="file-name">spec/README.txt</div><div class="file-desc">Quick reference index for developers.</div></div>',
            '  </div>',
            '</div>',
            '<div class="footer-note">',
            `  <span>LogicX Showroom · ${templateLabel}</span>`,
            `  <span>${packageId} · ${escapeHtml(date)}</span>`,
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

        return [
            `${templateLabel.toUpperCase()} — SHOWROOM HANDOFF PACKAGE`,
            '='.repeat(40),
            '',
            'START HERE',
            '----------',
            '  1. WELCOME-GUIDE.html         — Open in browser for package overview',
            `  2. ${pdfFilename}   — Developer brief (cover + spec + previews)`,
            '  3. spec/homepage-spec.json    — Machine-readable configuration',
            '  4. spec/footer-copyright-snippet.html — Required ADA footer markup',
            hasImages ? '  5. images/                    — Client-uploaded handoff images' : '',
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
        appendShowroomPdfCover,
        buildShowroomHandoffGuide,
        buildShowroomHandoffReadme,
    };
}());
