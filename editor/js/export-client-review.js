/**
 * Client-facing homepage review package — fillable PDF + agent JSON/previews.
 * Separate from developer handoff (export-pdf.js).
 * Requires ShowroomCapture, jsPDF, and JSZip (loaded in showroom.html).
 */
(function () {
    'use strict';

    const CLIENT_SERVICES_EMAIL = 'clientservices@xologic.com';

    function escapeHtml(text) {
        return String(text ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function slugify(text) {
        return String(text || 'showroom')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 48) || 'showroom';
    }

    function pdfFieldName(prefix, id) {
        return String(prefix + '_' + String(id || 'field').replace(/[^a-zA-Z0-9_]/g, '_'))
            .slice(0, 48);
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.rel = 'noopener';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        window.setTimeout(function () {
            if (link.parentNode) link.parentNode.removeChild(link);
            URL.revokeObjectURL(url);
        }, 250);
    }

    function buildPackageId() {
        if (window.ShowroomHandoffGuide?.buildPackageId) {
            return window.ShowroomHandoffGuide.buildPackageId();
        }
        return 'REV-' + Date.now().toString(36).toUpperCase().slice(-6);
    }

    function detectImageFormat(dataUrl) {
        return String(dataUrl || '').startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
    }

    function buildReviewData(meta, sections) {
        return {
            packageId: meta.packageId,
            companyName: meta.companyName,
            templateLabel: meta.templateLabel,
            design: meta.design,
            generatedAt: new Date().toISOString(),
            submittedAt: null,
            reviewerName: '',
            reviewerEmail: '',
            overallNotes: '',
            sections: sections.map((section) => ({
                id: section.id,
                label: section.label,
                previewFile: `agent/previews/${section.id}.png`,
                previewDataUrl: section.previewDataUrl || section.dataUrl || '',
                status: null,
                notes: '',
                priority: 'normal',
            })),
        };
    }

    function buildClientReviewPdf(reviewData) {
        const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
        if (!JsPDF) {
            throw new Error('PDF library not loaded.');
        }

        const doc = new JsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
        const margin = 48;
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const contentW = pageW - margin * 2;
        const fieldColW = Math.min(contentW * 0.55, 300);
        let y = margin;

        function addPage(extraTopSpace) {
            doc.addPage();
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
            const lines = doc.splitTextToSize(String(text || ''), contentW);
            const blockH = lines.length * Math.ceil(size * 1.35);
            ensureSpace(blockH + gap);
            doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
            doc.setFontSize(size);
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text(lines, margin, y);
            y += blockH + gap;
        }

        function addTextField(fieldName, x, fieldY, width, height, multiline) {
            if (typeof doc.AcroFormTextField !== 'function') return;
            const field = new doc.AcroFormTextField();
            field.fieldName = fieldName;
            field.x = x;
            field.y = fieldY;
            field.width = width;
            field.height = height;
            field.multiline = !!multiline;
            field.showWhenPrinted = true;
            field.value = '';
            doc.addField(field);
        }

        function addComboField(fieldName, x, fieldY, width, height, options) {
            if (typeof doc.AcroFormComboBox !== 'function') return;
            const field = new doc.AcroFormComboBox();
            field.fieldName = fieldName;
            field.x = x;
            field.y = fieldY;
            field.width = width;
            field.height = height;
            field.showWhenPrinted = true;
            field.setOptions(options);
            field.value = options[0] || '';
            doc.addField(field);
        }

        const generatedDate = new Date(reviewData.generatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Cover page
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
        doc.text('Fill in the form fields, save this PDF, and email it back.', pageW / 2, pageH - 72, { align: 'center' });

        // Instructions
        addPage(20);
        drawGoldRule(y);
        y += 18;
        writeLines('How to open and complete this review', { bold: true, size: 16, gap: 12 });
        const calloutY = y;
        const calloutPad = 16;
        const calloutInnerW = contentW - calloutPad * 2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const calloutLines = doc.splitTextToSize(
            'Open this PDF in Microsoft Edge, Preview (Mac), or Adobe Acrobat Reader. '
            + 'Click each box to type your feedback, then save the file and email it back.',
            calloutInnerW,
        );
        const calloutH = calloutLines.length * 14 + calloutPad * 2 + 6;
        drawSoftPanel(margin, calloutY, contentW, calloutH);
        doc.setTextColor(34, 47, 54);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('QUICK START', margin + calloutPad, calloutY + calloutPad + 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(74, 86, 96);
        doc.text(calloutLines, margin + calloutPad, calloutY + calloutPad + 18);
        y = calloutY + calloutH + 18;
        writeLines(
            'This PDF has fillable boxes you can type into — just like a paper form, but digital. '
            + 'No web browser required.',
            { size: 11, gap: 10 },
        );
        writeLines('1. Open this PDF in Adobe Acrobat Reader, Preview (Mac), or Microsoft Edge.', { size: 10, gap: 6 });
        writeLines('2. Click each box to enter your name, email, and feedback for every homepage section.', { size: 10, gap: 6 });
        writeLines('3. Choose a rating for each section and add notes where you want changes.', { size: 10, gap: 6 });
        writeLines('4. When finished, choose File → Save or Save As and keep the same PDF file.', { size: 10, gap: 6 });
        writeLines('5. Email the saved PDF to your LogicX onboarding agent:', { size: 10, gap: 4 });
        writeLines(CLIENT_SERVICES_EMAIL, { bold: true, size: 11, gap: 12 });
        writeLines(
            'Tip: If boxes do not let you type, try opening the PDF in Adobe Acrobat Reader (free) or Microsoft Edge.',
            { size: 9, color: [90, 104, 114], gap: 8 },
        );

        // Contact + overall fields
        addPage(20);
        drawGoldRule(y);
        y += 18;
        writeLines('Your contact information', { bold: true, size: 14, gap: 12 });
        writeLines('Your name', { bold: true, size: 10, gap: 4 });
        const nameFieldY = y;
        y += 22;
        addTextField('reviewer_name', margin, nameFieldY, fieldColW, 18, false);

        writeLines('Your email', { bold: true, size: 10, gap: 6 });
        const emailFieldY = y;
        y += 22;
        addTextField('reviewer_email', margin, emailFieldY, fieldColW, 18, false);

        y += 10;
        const overallPanelY = y;
        const overallPanelPad = 14;
        const overallFieldH = 72;
        const overallPanelH = overallPanelPad * 2 + 28 + overallFieldH;
        drawSoftPanel(margin, overallPanelY, fieldColW + overallPanelPad * 2, overallPanelH);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(34, 47, 54);
        doc.text('Overall comments', margin + overallPanelPad, overallPanelY + overallPanelPad + 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(120, 132, 142);
        doc.text('(optional)', margin + overallPanelPad + 98, overallPanelY + overallPanelPad + 2);
        const overallFieldY = overallPanelY + overallPanelPad + 22;
        addTextField('overall_notes', margin + overallPanelPad, overallFieldY, fieldColW, overallFieldH, true);
        y = overallPanelY + overallPanelH + 8;

        const sections = Array.isArray(reviewData.sections) ? reviewData.sections : [];
        const statusOptions = ['', 'Looks good', 'Needs changes', 'Not sure'];
        const priorityOptions = ['Normal', 'High — must fix before launch', 'Low — nice to have'];

        sections.forEach(function (section, index) {
            addPage();
            writeLines((index + 1) + '. ' + section.label, { bold: true, size: 14, gap: 8 });

            const imageSrc = section.previewDataUrl || '';
            const imageBoxH = 210;
            if (imageSrc) {
                try {
                    ensureSpace(imageBoxH + 12);
                    doc.addImage(imageSrc, detectImageFormat(imageSrc), margin, y, contentW, imageBoxH, undefined, 'FAST');
                    y += imageBoxH + 14;
                } catch (err) {
                    writeLines('Screenshot preview unavailable for this section.', { size: 9, color: [120, 120, 120], gap: 8 });
                }
            }

            writeLines('Your rating', { bold: true, size: 10, gap: 4 });
            const statusFieldY = y;
            y += 20;
            addComboField(
                pdfFieldName('status', section.id),
                margin,
                statusFieldY,
                contentW * 0.45,
                16,
                statusOptions,
            );

            writeLines('Notes or suggested updates', { bold: true, size: 10, gap: 4 });
            const notesFieldY = y;
            y += 92;
            addTextField(
                pdfFieldName('notes', section.id),
                margin,
                notesFieldY,
                contentW,
                84,
                true,
            );

            writeLines('Priority (if changes needed)', { bold: true, size: 10, gap: 4 });
            const priorityFieldY = y;
            y += 20;
            addComboField(
                pdfFieldName('priority', section.id),
                margin,
                priorityFieldY,
                contentW * 0.55,
                16,
                priorityOptions,
            );
        });

        return doc.output('blob');
    }

    function buildStartHereText(reviewData, pdfFilename) {
        return [
            `${reviewData.companyName} — Homepage Review`,
            '==========================================',
            '',
            'FOR THE CLIENT',
            '',
            `1. Open ${pdfFilename} (double-click — opens in your PDF app).`,
            '2. Click the boxes in the PDF to type your feedback.',
            '3. Save the PDF when you are done (File → Save or Save As).',
            '4. Email the saved PDF to your LogicX onboarding agent:',
            '   ' + CLIENT_SERVICES_EMAIL,
            '',
            'RECOMMENDED APPS',
            '- Windows: Microsoft Edge or Adobe Acrobat Reader (free)',
            '- Mac: Preview or Adobe Acrobat Reader',
            '',
            'You can ignore the agent folder — that is for the LogicX team only.',
            '',
            `Reference: ${reviewData.packageId}`,
            `Template: ${reviewData.templateLabel}`,
        ].join('\n');
    }

    function buildAgentReadmeText(reviewData, pdfFilename) {
        return [
            'LogicX internal — client review tools',
            '====================================',
            '',
            'PACKAGE LAYOUT',
            `- ../${pdfFilename} — fillable PDF for the client (only file they need).`,
            '- previews/ — section PNG captures.',
            '- review-data.json — structured template at export time.',
            '- agent-summary.html — optional JSON summary viewer.',
            '',
            'CLIENT WORKFLOW',
            '- Client opens the PDF, fills in form fields, saves, and emails it back.',
            '- Client emails the completed PDF to ' + CLIENT_SERVICES_EMAIL + '.',
            '',
            'ONBOARDING AGENT',
            '- Send the ZIP or only the PDF to the client.',
            '- When the PDF returns, route it to web development.',
            '- Use agent-summary.html + review-data.json for structured reference if needed.',
            '',
            `Package ID: ${reviewData.packageId}`,
            `Template: ${reviewData.templateLabel} (${reviewData.design})`,
            `Generated: ${reviewData.generatedAt}`,
        ].join('\n');
    }

    function buildAgentSummaryHtml() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Showroom Client Review — Agent Summary</title>
  <style>
    :root { --gold: #c9a96e; --charcoal: #222f36; --muted: #5a6872; --border: #d8dee4; --bg: #f4f6f8; }
    body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: var(--bg); color: var(--charcoal); line-height: 1.5; }
    .wrap { max-width: 960px; margin: 0 auto; padding: 1.5rem; }
    header { background: #222f36; color: #fff; padding: 1.5rem; margin-bottom: 1.5rem; }
    header h1 { margin: 0 0 0.25rem; font-size: 1.4rem; }
    header p { margin: 0; color: #c7d2dd; }
    .panel { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 1.25rem; margin-bottom: 1rem; }
    .load-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
    .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    .badge-changes { background: #fde8e8; color: #9b1c1c; }
    .badge-unsure { background: #fff7e6; color: #9a6700; }
    .badge-approved { background: #e6f4ea; color: #1e6b3a; }
    .item { border-top: 1px solid var(--border); padding: 1rem 0; }
    .item:first-child { border-top: none; padding-top: 0; }
    .item h3 { margin: 0 0 0.35rem; font-size: 1rem; }
    .item p { margin: 0.25rem 0; }
    .muted { color: var(--muted); font-size: 0.9rem; }
    .priority-high { color: #9b1c1c; font-weight: 700; }
    ul.checklist { margin: 0.5rem 0 0; padding-left: 1.2rem; }
  </style>
</head>
<body>
  <header>
    <div class="wrap" style="padding:0;">
      <p style="color:var(--gold);font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 0.35rem;">LogicX Onboarding</p>
      <h1>Client review summary</h1>
      <p>Internal LogicX tool — load review-data.json exported with the client PDF package.</p>
    </div>
  </header>

  <div class="wrap">
    <div class="panel">
      <div class="load-row">
        <label for="review-file"><strong>Load review-data.json</strong></label>
        <input type="file" id="review-file" accept="application/json,.json">
      </div>
      <p class="muted" style="margin:0.75rem 0 0;">Clients complete the fillable PDF and email it to ${escapeHtml(CLIENT_SERVICES_EMAIL)}. Use this tool with the JSON template from the agent folder for structured dev handoff.</p>
    </div>

    <div id="summary-content" hidden>
      <div class="panel" id="summary-meta"></div>
      <div class="panel">
        <h2 style="margin-top:0;">Action items — needs changes</h2>
        <div id="changes-list"></div>
      </div>
      <div class="panel">
        <h2 style="margin-top:0;">Follow up — not sure</h2>
        <div id="unsure-list"></div>
      </div>
      <div class="panel">
        <h2 style="margin-top:0;">Approved sections</h2>
        <div id="approved-list"></div>
      </div>
      <div class="panel" id="overall-panel" hidden>
        <h2 style="margin-top:0;">Overall client notes</h2>
        <p id="overall-notes"></p>
      </div>
      <div class="panel">
        <h2 style="margin-top:0;">Dev handoff checklist</h2>
        <ul class="checklist" id="dev-checklist"></ul>
      </div>
    </div>
  </div>

  <script>
    function badge(status) {
      if (status === 'approved') return '<span class="badge badge-approved">Looks good</span>';
      if (status === 'changes') return '<span class="badge badge-changes">Needs changes</span>';
      if (status === 'unsure') return '<span class="badge badge-unsure">Not sure</span>';
      return '<span class="badge">No response</span>';
    }

    function renderItem(section) {
      const priority = section.priority === 'high'
        ? '<p class="priority-high">Priority: High — must fix before launch</p>'
        : section.priority === 'low'
          ? '<p class="muted">Priority: Low — nice to have</p>'
          : '';
      const notes = section.notes
        ? '<p><strong>Client notes:</strong> ' + escapeHtml(section.notes) + '</p>'
        : '<p class="muted">No notes provided.</p>';
      return '<div class="item"><h3>' + escapeHtml(section.label) +
        ' ' + badge(section.status) + '</h3>' + priority + notes + '</div>';
    }

    function escapeHtml(text) {
      return String(text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function renderSummary(data) {
      document.getElementById('summary-content').hidden = false;
      document.getElementById('summary-meta').innerHTML =
        '<p><strong>Company:</strong> ' + escapeHtml(data.companyName) + '</p>' +
        '<p><strong>Template:</strong> ' + escapeHtml(data.templateLabel) + ' (' + escapeHtml(data.design) + ')</p>' +
        '<p><strong>Package:</strong> ' + escapeHtml(data.packageId) + '</p>' +
        '<p><strong>Reviewer:</strong> ' + escapeHtml(data.reviewerName || '—') +
        (data.reviewerEmail ? ' · ' + escapeHtml(data.reviewerEmail) : '') + '</p>' +
        '<p><strong>Submitted:</strong> ' + escapeHtml(data.submittedAt || 'Not yet submitted') + '</p>';

      const sections = Array.isArray(data.sections) ? data.sections : [];
      const changes = sections.filter(function (s) { return s.status === 'changes'; });
      const unsure = sections.filter(function (s) { return s.status === 'unsure'; });
      const approved = sections.filter(function (s) { return s.status === 'approved'; });

      document.getElementById('changes-list').innerHTML = changes.length
        ? changes.map(renderItem).join('')
        : '<p class="muted">No sections marked as needing changes.</p>';
      document.getElementById('unsure-list').innerHTML = unsure.length
        ? unsure.map(renderItem).join('')
        : '<p class="muted">No sections marked as not sure.</p>';
      document.getElementById('approved-list').innerHTML = approved.length
        ? approved.map(function (s) { return '<p>✓ ' + escapeHtml(s.label) + '</p>'; }).join('')
        : '<p class="muted">No sections marked as approved yet.</p>';

      if (data.overallNotes) {
        document.getElementById('overall-panel').hidden = false;
        document.getElementById('overall-notes').textContent = data.overallNotes;
      }

      const checklist = [];
      changes.forEach(function (s) {
        checklist.push('Update ' + s.label + (s.notes ? ': ' + s.notes : ''));
      });
      unsure.forEach(function (s) {
        checklist.push('Clarify with client — ' + s.label + (s.notes ? ': ' + s.notes : ''));
      });
      if (data.overallNotes) checklist.push('Overall: ' + data.overallNotes);
      document.getElementById('dev-checklist').innerHTML = checklist.length
        ? checklist.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('')
        : '<li class="muted">No action items yet.</li>';
    }

    document.getElementById('review-file').addEventListener('change', function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          renderSummary(JSON.parse(reader.result));
        } catch (err) {
          alert('Could not read review-data.json — ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  </script>
</body>
</html>`;
    }

    window.exportShowroomClientReview = async function exportShowroomClientReview(options) {
        const {
            sections = [],
            meta = {},
            zipFilename,
            onProgress,
        } = options;

        if (!window.ShowroomCapture?.captureElementAsDataUrl || !window.ShowroomCapture?.isCapturable) {
            throw new Error('Showroom capture utilities not loaded.');
        }
        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip not loaded.');
        }

        const { captureElementAsDataUrl, isCapturable } = window.ShowroomCapture;
        const packageId = meta.packageId || buildPackageId();
        const reviewMeta = {
            packageId,
            companyName: meta.companyName || 'Your Showroom',
            templateLabel: meta.templateLabel || 'Showroom',
            design: meta.design || 'classic',
        };

        const capturableSections = sections.filter((section) => isCapturable(section.el));
        if (!capturableSections.length) {
            throw new Error('No visible sections could be captured for review.');
        }

        const capturedSections = [];
        if (typeof onProgress === 'function') {
            onProgress({
                phase: 'start',
                total: capturableSections.length,
            });
        }

        const getReviewCaptureOptions = (sectionId) => {
            const captureOptions = {
                scale: 1.35,
                timeoutMs: 60000,
                imageTimeout: 12000,
            };

            if (sectionId === 'header') {
                captureOptions.timeoutMs = 90000;
            } else if (sectionId === 'sketch-section') {
                captureOptions.scale = 1.25;
                captureOptions.imageTimeout = 15000;
            } else if (sectionId === 'you-may-like' || sectionId === 'get-inspired') {
                captureOptions.scale = 1.1;
                captureOptions.timeoutMs = 90000;
                captureOptions.imageTimeout = 15000;
            }

            return captureOptions;
        };

        for (let index = 0; index < capturableSections.length; index += 1) {
            const section = capturableSections[index];
            if (typeof onProgress === 'function') {
                onProgress({
                    phase: 'capture-start',
                    current: index + 1,
                    total: capturableSections.length,
                    label: section.label,
                });
            }
            const dataUrl = await captureElementAsDataUrl(section.el, getReviewCaptureOptions(section.id));
            capturedSections.push({
                id: section.id,
                label: section.label,
                dataUrl,
                previewDataUrl: dataUrl,
            });
            if (typeof onProgress === 'function') {
                onProgress({
                    phase: 'capture',
                    current: index + 1,
                    total: capturableSections.length,
                    label: section.label,
                });
            }
        }

        if (typeof onProgress === 'function') {
            onProgress({ phase: 'pdf', current: capturableSections.length, total: capturableSections.length });
        }

        const reviewData = buildReviewData(reviewMeta, capturedSections);
        const pdfFilename = `${slugify(reviewMeta.companyName)}-homepage-review.pdf`;
        const pdfBlob = buildClientReviewPdf(reviewData);

        if (typeof onProgress === 'function') {
            onProgress({ phase: 'packaging', current: capturableSections.length, total: capturableSections.length });
        }

        const zip = new JSZip();
        const agentFolder = zip.folder('agent');
        const previewsFolder = agentFolder.folder('previews');

        for (const section of capturedSections) {
            previewsFolder.file(`${section.id}.png`, dataUrlToBlob(section.dataUrl));
        }

        zip.file(pdfFilename, pdfBlob);
        zip.file('START-HERE.txt', buildStartHereText(reviewData, pdfFilename));
        agentFolder.file('README.txt', buildAgentReadmeText(reviewData, pdfFilename));
        agentFolder.file('agent-summary.html', buildAgentSummaryHtml());
        agentFolder.file('review-data.json', JSON.stringify(reviewData, null, 2));

        const resolvedZipName = zipFilename
            || `${slugify(reviewMeta.companyName)}-client-review.zip`;
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, resolvedZipName);

        return { zipBlob, reviewData, pdfBlob };
    };

    function dataUrlToBlob(dataUrl) {
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
}());
