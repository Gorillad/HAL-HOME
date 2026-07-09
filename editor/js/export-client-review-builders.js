/**
 * Client review PDF + HTML builders (loaded before export-client-review.js).
 */
(function () {
    'use strict';

    function escapeHtml(text) {
        return String(text ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function pdfFieldName(prefix, id) {
        return String(prefix + '_' + String(id || 'field').replace(/[^a-zA-Z0-9_]/g, '_'))
            .slice(0, 48);
    }

    function detectImageFormat(dataUrl) {
        return String(dataUrl || '').startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
    }

    function fitImageInBox(imgW, imgH, boxW, boxH) {
        if (!imgW || !imgH) {
            return { width: boxW, height: boxH };
        }
        const scale = Math.min(boxW / imgW, boxH / imgH);
        return {
            width: imgW * scale,
            height: imgH * scale,
        };
    }

    function buildClientReviewPdf(reviewData) {
        const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
        if (!JsPDF) {
            throw new Error('PDF library not loaded.');
        }

        const doc = new JsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
        const margin = 48;
        let pageW = doc.internal.pageSize.getWidth();
        let pageH = doc.internal.pageSize.getHeight();
        let contentW = pageW - margin * 2;
        let y = margin;

        function syncPageMetrics() {
            pageW = doc.internal.pageSize.getWidth();
            pageH = doc.internal.pageSize.getHeight();
            contentW = pageW - margin * 2;
        }

        function addPage(extraTopSpace) {
            doc.addPage();
            syncPageMetrics();
            y = margin + (extraTopSpace || 0);
        }

        function drawSoftPanel(x, panelY, width, height) {
            doc.setFillColor(255, 249, 238);
            doc.setDrawColor(221, 198, 152);
            doc.setLineWidth(0.6);
            doc.rect(x, panelY, width, height, 'FD');
        }

        function drawGoldRule(ruleY) {
            doc.setDrawColor(201, 169, 110);
            doc.setLineWidth(1);
            doc.line(margin, ruleY, margin + 56, ruleY);
        }

        function ensureSpace(needed, bottomMargin) {
            const bottom = bottomMargin == null ? margin : bottomMargin;
            if (y + needed > pageH - bottom) {
                addPage();
            }
        }

        function writeLines(text, options) {
            const opts = options || {};
            const size = opts.size || 10;
            const gap = opts.gap == null ? 8 : opts.gap;
            const color = opts.color || [34, 47, 54];
            const maxWidth = opts.maxWidth || contentW;
            const lines = doc.splitTextToSize(String(text || ''), maxWidth);
            const blockH = lines.length * Math.ceil(size * 1.35);
            ensureSpace(blockH + gap);
            doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
            doc.setFontSize(size);
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text(lines, margin + (opts.indent || 0), y);
            y += blockH + gap;
        }

        function drawFieldBox(x, fieldY, width, height) {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(168, 178, 188);
            doc.setLineWidth(0.85);
            doc.rect(x, fieldY, width, height, 'FD');
        }

        function getTextWidth(text, fontSize) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(fontSize);
            return doc.getTextWidth(String(text || ''));
        }

        function addTextField(fieldName, x, fieldY, width, height, multiline) {
            drawFieldBox(x, fieldY, width, height);
            if (typeof doc.AcroFormTextField !== 'function') return;
            try {
                const inset = 3;
                const field = new doc.AcroFormTextField();
                field.fieldName = fieldName;
                field.x = x + inset;
                field.y = fieldY + inset;
                field.width = Math.max(12, width - inset * 2);
                field.height = Math.max(12, height - inset * 2);
                field.multiline = !!multiline;
                field.showWhenPrinted = true;
                field.value = '';
                if (doc.AcroFormAppearance?.TextField?.default) {
                    field.setAppearance(doc.AcroFormAppearance.TextField.default);
                }
                doc.addField(field);
            } catch (fieldErr) {
                console.warn('Review PDF text field skipped', fieldName, fieldErr);
            }
        }

        function addRadioGroupRow(groupName, choices, startY, layout) {
            const opts = layout || {};
            const rowPad = opts.rowPad == null ? 12 : opts.rowPad;
            const rowW = contentW - rowPad * 2;
            const rowX = margin + rowPad;
            const radioSize = 11;
            const labelGap = 5;
            const colGap = opts.colGap == null ? 18 : opts.colGap;
            const fontSize = opts.fontSize || 9;
            const rowH = opts.rowHeight || 22;

            const optionWidths = choices.map((choice) => (
                radioSize + labelGap + getTextWidth(choice.label, fontSize) + 6
            ));
            const totalWidth = optionWidths.reduce((sum, width) => sum + width, 0)
                + colGap * Math.max(0, choices.length - 1);
            const useRow = totalWidth <= rowW;
            let nextY = startY;

            function drawFallbackOption(x, ry, label) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(fontSize);
                doc.setTextColor(34, 47, 54);
                doc.circle(x + 5.5, ry + 5.5, 5, 'S');
                doc.text(label, x + radioSize + labelGap, ry + 9);
            }

            if (!useRow) {
                let ry = startY;
                if (typeof doc.AcroFormRadioButton !== 'function') {
                    choices.forEach((choice) => {
                        drawFallbackOption(rowX, ry, choice.label);
                        ry += 18;
                    });
                    return ry + 4;
                }

                try {
                    const radioGroup = new doc.AcroFormRadioButton();
                    radioGroup.fieldName = groupName;
                    choices.forEach((choice) => {
                        const option = radioGroup.createOption(choice.value);
                        option.x = rowX;
                        option.y = ry;
                        option.width = radioSize;
                        option.height = radioSize;
                        doc.setFont('helvetica', 'normal');
                        doc.setFontSize(fontSize);
                        doc.setTextColor(34, 47, 54);
                        doc.text(choice.label, rowX + radioSize + labelGap, ry + 9);
                        ry += 18;
                    });
                    if (doc.AcroFormAppearance?.RadioButton?.Circle) {
                        radioGroup.setAppearance(doc.AcroFormAppearance.RadioButton.Circle);
                    }
                    doc.addField(radioGroup);
                } catch (fieldErr) {
                    console.warn('Review PDF radio field skipped', groupName, fieldErr);
                    choices.forEach((choice) => {
                        drawFallbackOption(rowX, ry, choice.label);
                        ry += 18;
                    });
                }
                return ry + 6;
            }

            let cursorX = rowX + Math.max(0, (rowW - totalWidth) / 2);
            const ry = startY;

            if (typeof doc.AcroFormRadioButton !== 'function') {
                choices.forEach((choice, index) => {
                    drawFallbackOption(cursorX, ry, choice.label);
                    cursorX += optionWidths[index] + colGap;
                });
                return startY + rowH + 6;
            }

            try {
                const radioGroup = new doc.AcroFormRadioButton();
                radioGroup.fieldName = groupName;

                choices.forEach((choice, index) => {
                    const option = radioGroup.createOption(choice.value);
                    option.x = cursorX;
                    option.y = ry;
                    option.width = radioSize;
                    option.height = radioSize;
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(fontSize);
                    doc.setTextColor(34, 47, 54);
                    doc.text(choice.label, cursorX + radioSize + labelGap, ry + 9);
                    cursorX += optionWidths[index] + colGap;
                });

                if (doc.AcroFormAppearance?.RadioButton?.Circle) {
                    radioGroup.setAppearance(doc.AcroFormAppearance.RadioButton.Circle);
                }
                doc.addField(radioGroup);
                nextY = startY + rowH + 6;
            } catch (fieldErr) {
                console.warn('Review PDF radio field skipped', groupName, fieldErr);
                cursorX = rowX + Math.max(0, (rowW - totalWidth) / 2);
                choices.forEach((choice, index) => {
                    drawFallbackOption(cursorX, ry, choice.label);
                    cursorX += optionWidths[index] + colGap;
                });
                nextY = startY + rowH + 6;
            }

            return nextY;
        }

        function appendSectionPage(section, index) {
            addPage();
            writeLines((index + 1) + '. ' + section.label, { bold: true, size: 14, gap: 8 });

            const imageSrc = section.previewDataUrl || '';
            if (imageSrc) {
                const imgW = section.captureWidth || 1400;
                const imgH = section.captureHeight || 900;
                const maxImageH = 210;
                const { width: drawW, height: drawH } = fitImageInBox(imgW, imgH, contentW, maxImageH);
                try {
                    ensureSpace(drawH + 14);
                    const drawX = margin + (contentW - drawW) / 2;
                    doc.setDrawColor(210, 214, 220);
                    doc.setLineWidth(0.75);
                    doc.rect(drawX - 1, y - 1, drawW + 2, drawH + 2);
                    doc.addImage(imageSrc, detectImageFormat(imageSrc), drawX, y, drawW, drawH, undefined, 'FAST');
                    y += drawH + 14;
                } catch (imageErr) {
                    writeLines('Screenshot preview unavailable for this section.', {
                        size: 9,
                        color: [120, 132, 142],
                        gap: 8,
                    });
                    console.warn('Review PDF preview failed for section', section.id, imageErr);
                }
            }

            const panelW = contentW;
            const panelStartY = y;
            const notesFieldH = 84;
            const panelH = 28 + 52 + notesFieldH + 52;
            drawSoftPanel(margin, panelStartY, panelW, panelH);

            y = panelStartY + 12;
            writeLines('Your feedback', { bold: true, size: 10, gap: 6, maxWidth: panelW - 24 });
            y = addRadioGroupRow(
                pdfFieldName('status', section.id),
                [
                    { value: 'approved', label: 'Looks good' },
                    { value: 'changes', label: 'Needs changes' },
                    { value: 'unsure', label: 'Not sure' },
                ],
                y,
                { rowPad: 12, fontSize: 9, colGap: 22 },
            );

            writeLines('Notes or suggested updates', { bold: true, size: 10, gap: 4, maxWidth: panelW - 24 });
            const notesY = y;
            y += notesFieldH + 8;
            addTextField(
                pdfFieldName('notes', section.id),
                margin + 12,
                notesY,
                panelW - 24,
                notesFieldH,
                true,
            );

            writeLines('Priority (if changes needed)', { bold: true, size: 10, gap: 4, maxWidth: panelW - 24 });
            y = addRadioGroupRow(
                pdfFieldName('priority', section.id),
                [
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High' },
                    { value: 'low', label: 'Low' },
                ],
                y,
                { rowPad: 12, fontSize: 9, colGap: 36 },
            );
            y = panelStartY + panelH + 8;
        }

        const generatedDate = new Date(reviewData.generatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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
        doc.text('Homepage Review Package', margin, 118);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(26);
        doc.text(String(reviewData.templateLabel || 'Showroom'), pageW / 2, 200, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(200, 208, 216);
        doc.text('Client feedback form', pageW / 2, 228, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(160, 170, 180);
        doc.text('PREPARED FOR', pageW / 2, 272, { align: 'center' });
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text(
            doc.splitTextToSize(String(reviewData.companyName || 'Your Showroom'), pageW - margin * 2),
            pageW / 2,
            292,
            { align: 'center' },
        );
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(180, 188, 196);
        doc.text('Package ' + String(reviewData.packageId || ''), pageW / 2, 340, { align: 'center' });
        doc.text('Generated ' + generatedDate, pageW / 2, 356, { align: 'center' });
        doc.setTextColor(201, 169, 110);
        doc.setFontSize(9);
        doc.text('Open Homepage-Review.html for the best form experience', pageW / 2, pageH - 72, { align: 'center' });

        addPage(12);
        drawGoldRule(y);
        y += 14;
        writeLines('Your feedback', { bold: true, size: 13, gap: 10 });

        const contactFieldW = Math.min(contentW, 420);
        const contactFieldX = margin + (contentW - contactFieldW) / 2;
        const singleLineFieldH = 22;

        writeLines('Your name', { bold: true, size: 10, gap: 4, indent: contactFieldX - margin, maxWidth: contactFieldW });
        const nameFieldY = y;
        y += singleLineFieldH + 10;
        addTextField('reviewer_name', contactFieldX, nameFieldY, contactFieldW, singleLineFieldH, false);

        writeLines('Your email', { bold: true, size: 10, gap: 4, indent: contactFieldX - margin, maxWidth: contactFieldW });
        const emailFieldY = y;
        y += singleLineFieldH + 14;
        addTextField('reviewer_email', contactFieldX, emailFieldY, contactFieldW, singleLineFieldH, false);

        y += 8;
        const overallPanelY = y;
        const overallPanelPad = 14;
        const overallFieldH = 108;
        const overallPanelW = contactFieldW + overallPanelPad * 2;
        const overallPanelX = contactFieldX - overallPanelPad;
        const overallPanelH = overallPanelPad * 2 + 28 + overallFieldH;
        drawSoftPanel(overallPanelX, overallPanelY, overallPanelW, overallPanelH);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(34, 47, 54);
        doc.text('Overall comments', contactFieldX, overallPanelY + overallPanelPad + 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(120, 132, 142);
        doc.text('(optional)', contactFieldX + 98, overallPanelY + overallPanelPad + 2);
        addTextField(
            'overall_notes',
            contactFieldX,
            overallPanelY + overallPanelPad + 22,
            contactFieldW,
            overallFieldH,
            true,
        );

        const sections = Array.isArray(reviewData.sections) ? reviewData.sections : [];
        sections.forEach((section, index) => {
            appendSectionPage(section, index);
        });

        return doc.output('blob');
    }

    function buildClientReviewHtml(reviewData) {
        const companyName = escapeHtml(reviewData.companyName);
        const templateLabel = escapeHtml(reviewData.templateLabel);
        const packageId = escapeHtml(reviewData.packageId);
        const generatedDate = new Date(reviewData.generatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const sectionBlocks = reviewData.sections.map((section, index) => {
            const sid = escapeHtml(section.id);
            const label = escapeHtml(section.label);
            const preview = escapeHtml(section.previewFile || `agent/previews/${section.id}.png`);
            return `
<section class="review-section" id="section-${sid}">
  <div class="review-section-head"><h2>${index + 1}. ${label}</h2></div>
  <figure class="review-preview">
    <img src="${preview}" alt="Preview of ${label}" loading="lazy">
    <figcaption>Current design — ${label}</figcaption>
  </figure>
  <fieldset class="review-feedback">
    <legend>Your feedback</legend>
    <div class="review-status-group" role="radiogroup" aria-label="Status for ${label}">
      <label><input type="radio" name="status-${sid}" value="approved"> Looks good</label>
      <label><input type="radio" name="status-${sid}" value="changes"> Needs changes</label>
      <label><input type="radio" name="status-${sid}" value="unsure"> Not sure</label>
    </div>
    <label class="review-notes-label" for="notes-${sid}">Notes or suggested updates</label>
    <textarea id="notes-${sid}" rows="4" placeholder="Tell us what you'd like changed, or what you love about this section."></textarea>
    <p class="review-priority-label">Priority (if changes needed)</p>
    <div class="review-priority-group" role="radiogroup" aria-label="Priority for ${label}">
      <label><input type="radio" name="priority-${sid}" value="normal" checked> Normal</label>
      <label><input type="radio" name="priority-${sid}" value="high"> High — must fix before launch</label>
      <label><input type="radio" name="priority-${sid}" value="low"> Low — nice to have</label>
    </div>
  </fieldset>
</section>`;
        }).join('\n');

        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${companyName} — Homepage Review</title>
  <style>
    :root { --gold: #c9a96e; --charcoal: #222f36; --muted: #5a6872; --border: #d8dee4; --bg: #f4f6f8; --white: #fff; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Segoe UI", system-ui, -apple-system, sans-serif; color: var(--charcoal); background: var(--bg); line-height: 1.5; }
    .review-header { background: linear-gradient(135deg, #1a252b 0%, #222f36 100%); color: var(--white); padding: 2rem 1.5rem 2.5rem; }
    .review-header-inner { max-width: 920px; margin: 0 auto; }
    .review-kicker { color: var(--gold); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 0.5rem; }
    .review-header h1 { margin: 0 0 0.35rem; font-size: 1.75rem; }
    .review-meta { margin: 0; color: #c7d2dd; font-size: 0.95rem; }
    .review-intro, .review-section, .review-actions, .review-contact { max-width: 920px; margin: 0 auto; padding: 0 1.5rem; }
    .review-intro { background: var(--white); border: 1px solid var(--border); border-radius: 10px; padding: 1.25rem 1.5rem; margin-top: -1.25rem; margin-bottom: 1.5rem; box-shadow: 0 8px 24px rgba(26, 37, 43, 0.08); }
    .review-contact { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem auto 0; }
    .review-contact label, .review-notes-label, .review-priority-label { display: block; font-weight: 600; margin-bottom: 0.35rem; }
    .review-overall { margin-top: 1.25rem; }
    .optional { font-weight: 500; color: var(--muted); font-size: 0.9rem; }
    .review-contact input, textarea { width: 100%; font: inherit; border: 1px solid var(--border); border-radius: 8px; padding: 0.65rem 0.75rem; background: var(--white); }
    .review-section { background: var(--white); border: 1px solid var(--border); border-radius: 10px; padding: 1.25rem 1.5rem 1.5rem; margin-bottom: 1.25rem; }
    .review-section-head h2 { margin: 0; font-size: 1.2rem; }
    .review-preview { margin: 1rem 0; }
    .review-preview img { width: 100%; height: auto; border: 1px solid var(--border); border-radius: 8px; display: block; background: #fff; }
    .review-preview figcaption { margin-top: 0.5rem; font-size: 0.85rem; color: var(--muted); }
    fieldset.review-feedback { border: 1px solid var(--border); border-radius: 8px; padding: 1rem; margin: 0; background: #fffaf2; }
    fieldset.review-feedback legend { font-weight: 700; padding: 0 0.35rem; }
    .review-status-group, .review-priority-group { display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem; margin: 0.75rem 0 1rem; }
    .review-status-group label, .review-priority-group label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-weight: 500; }
    .review-actions { padding: 1.5rem; margin-bottom: 2.5rem; }
    .review-actions button { font: inherit; font-weight: 600; border: none; border-radius: 8px; padding: 0.75rem 1.25rem; cursor: pointer; background: var(--gold); color: #1a252b; }
    @media print { .review-actions { display: none; } .review-section { break-inside: avoid; page-break-inside: avoid; } }
    @media (max-width: 640px) { .review-contact { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header class="review-header">
    <div class="review-header-inner">
      <p class="review-kicker">LogicX Showroom · Client Review</p>
      <h1>${companyName}</h1>
      <p class="review-meta">${templateLabel} template · Package ${packageId} · Generated ${generatedDate}</p>
    </div>
  </header>
  <div class="review-intro">
    <p><strong>Review each section below.</strong> Mark your rating, add notes, then print or save as PDF and return to your onboarding agent.</p>
  </div>
  <div class="review-contact">
    <div><label for="reviewer-name">Your name</label><input id="reviewer-name" type="text" autocomplete="name"></div>
    <div><label for="reviewer-email">Your email</label><input id="reviewer-email" type="email" autocomplete="email"></div>
  </div>
  <div class="review-intro review-overall">
    <label class="review-notes-label" for="overall-notes">Overall comments <span class="optional">(optional)</span></label>
    <textarea id="overall-notes" rows="4" placeholder="Anything that applies to the whole homepage, not just one section."></textarea>
  </div>
  <main style="margin-top:1.5rem;">${sectionBlocks}</main>
  <div class="review-actions"><button type="button" onclick="window.print()">Print or save as PDF</button></div>
</body>
</html>`;
    }

    window.ExportClientReviewBuilders = {
        buildClientReviewPdf,
        buildClientReviewHtml,
    };
}());
