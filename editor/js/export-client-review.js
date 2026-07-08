/**
 * Client-facing homepage review package — screenshots + feedback form.
 * Separate from developer handoff (export-pdf.js).
 * Requires ShowroomCapture, html2canvas, and JSZip (loaded in showroom.html).
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

    function sanitizeInlineScript(scriptText) {
        return String(scriptText || '').replace(/<\/script>/gi, '<\\/script>');
    }

    function buildPackageId() {
        if (window.ShowroomHandoffGuide?.buildPackageId) {
            return window.ShowroomHandoffGuide.buildPackageId();
        }
        return 'REV-' + Date.now().toString(36).toUpperCase().slice(-6);
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

    function buildClientReviewHtml(reviewData, jspdfInlineScript) {
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
            const preview = escapeHtml(section.previewDataUrl || section.previewFile);
            return `
<section class="review-section" id="section-${sid}" data-section-id="${sid}">
  <div class="review-section-head">
    <h2>${index + 1}. ${label}</h2>
  </div>
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
    <textarea id="notes-${sid}" rows="3" placeholder="Tell us what you'd like changed, or what you love about this section."></textarea>
    <label class="review-priority-label" for="priority-${sid}">Priority (if changes needed)</label>
    <select id="priority-${sid}">
      <option value="normal">Normal</option>
      <option value="high">High — must fix before launch</option>
      <option value="low">Low — nice to have</option>
    </select>
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
    :root {
      --gold: #c9a96e;
      --charcoal: #222f36;
      --muted: #5a6872;
      --border: #d8dee4;
      --bg: #f4f6f8;
      --white: #fff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      color: var(--charcoal);
      background: var(--bg);
      line-height: 1.5;
    }
    .review-header {
      background: linear-gradient(135deg, #1a252b 0%, #222f36 100%);
      color: var(--white);
      padding: 2rem 1.5rem 2.5rem;
    }
    .review-header-inner { max-width: 920px; margin: 0 auto; }
    .review-kicker {
      color: var(--gold);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 0.5rem;
    }
    .review-header h1 { margin: 0 0 0.35rem; font-size: 1.75rem; }
    .review-meta { margin: 0; color: #c7d2dd; font-size: 0.95rem; }
    .review-intro, .review-section, .review-actions, .review-contact {
      max-width: 920px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .review-intro {
      background: var(--white);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
      margin-top: -1.25rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 8px 24px rgba(26, 37, 43, 0.08);
    }
    .review-intro ol { margin: 0.75rem 0 0; padding-left: 1.25rem; }
    .review-contact {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin: 1.5rem auto 0;
    }
    .review-intro a {
      color: var(--gold);
      font-weight: 600;
    }
    .review-contact label { display: block; font-weight: 600; margin-bottom: 0.35rem; }
    .review-contact input, textarea, select {
      width: 100%;
      font: inherit;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.65rem 0.75rem;
      background: var(--white);
    }
    .review-section {
      background: var(--white);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem 1.5rem 1.5rem;
      margin-bottom: 1.25rem;
    }
    .review-section-head h2 { margin: 0; font-size: 1.2rem; }
    .review-preview { margin: 1rem 0; }
    .review-preview img {
      width: 100%;
      height: auto;
      border: 1px solid var(--border);
      border-radius: 8px;
      display: block;
      background: #fff;
    }
    .review-preview figcaption {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: var(--muted);
    }
    fieldset.review-feedback {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem;
      margin: 0;
    }
    fieldset.review-feedback legend { font-weight: 700; padding: 0 0.35rem; }
    .review-status-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem 1.25rem;
      margin: 0.75rem 0 1rem;
    }
    .review-status-group label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; }
    .review-notes-label, .review-priority-label {
      display: block;
      font-weight: 600;
      margin: 0.75rem 0 0.35rem;
    }
    .review-actions {
      padding: 1.5rem;
      margin-bottom: 2.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }
    .review-actions button {
      font: inherit;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      padding: 0.75rem 1.25rem;
      cursor: pointer;
    }
    .btn-primary { background: var(--gold); color: #1a252b; }
    .btn-primary:disabled { opacity: 0.7; cursor: wait; }
    .btn-secondary { background: #eef2f6; color: var(--charcoal); border: 1px solid var(--border); }
    .review-save-status { color: var(--muted); font-size: 0.9rem; }
    .review-browser-tip {
      max-width: 920px;
      margin: 1rem auto 0;
      padding: 0 1.5rem;
    }
    .review-browser-tip-inner {
      background: #fff8e8;
      border: 1px solid #e8d4a8;
      border-radius: 10px;
      padding: 1rem 1.25rem;
      font-size: 0.9rem;
      line-height: 1.55;
    }
    .review-browser-tip-inner strong { color: var(--charcoal); }
    .review-workflow-note {
      margin: 0.75rem 0 0;
      padding: 0.75rem 0.9rem;
      border-radius: 8px;
      background: #eef6ff;
      border: 1px solid #c8ddf5;
      font-size: 0.9rem;
    }
    @media print {
      .review-browser-tip,
      .review-actions,
      .review-workflow-note { display: none !important; }
      body { background: #fff; }
      .review-section { break-inside: avoid; page-break-inside: avoid; }
      .review-status-group input { display: none; }
      .review-status-group label::after {
        content: " — " attr(data-print-value);
        font-weight: 600;
      }
    }
    @media (max-width: 640px) {
      .review-contact { grid-template-columns: 1fr; }
    }
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

  <div class="review-browser-tip">
    <div class="review-browser-tip-inner">
      <strong>How to open this file:</strong> Unzip the package, then open <strong>Homepage-Review.html</strong> in your web browser.
      <strong>Google Chrome</strong> is recommended (also works in Microsoft Edge, Firefox, and Safari).
      Do not open it in Word, Preview, or Adobe Acrobat — those apps cannot run the feedback form.
      If double-click opens the wrong program, right-click the file → <em>Open with</em> → Chrome.
    </div>
  </div>

  <div class="review-intro">
    <p><strong>Thank you for reviewing your homepage design.</strong> This page is your feedback form — enter all notes here in your browser before you submit.</p>
    <p class="review-workflow-note"><strong>Important:</strong> You edit your answers <em>on this page</em>, not in the PDF. The PDF is a read-only summary you email back when finished (like printing a completed form).</p>
    <ol>
      <li>Mark each section as <em>Looks good</em>, <em>Needs changes</em>, or <em>Not sure</em>.</li>
      <li>Add notes with as much detail as you can — wording, colors, photos, links, etc.</li>
      <li>Click <strong>Download feedback PDF</strong> and email the file to your LogicX onboarding agent at <a href="mailto:${escapeHtml(CLIENT_SERVICES_EMAIL)}">${escapeHtml(CLIENT_SERVICES_EMAIL)}</a>.</li>
      <li>If PDF download does not work in your browser, use <strong>Print or save as PDF</strong> instead, or download the JSON backup and mention that in your email.</li>
    </ol>
    <p style="margin:0.75rem 0 0;color:var(--muted);font-size:0.9rem;">You only need this page — the <strong>agent</strong> folder is for your LogicX team and can be ignored.</p>
  </div>

  <div class="review-contact">
    <div>
      <label for="reviewer-name">Your name</label>
      <input id="reviewer-name" type="text" autocomplete="name" placeholder="Jane Smith">
    </div>
    <div>
      <label for="reviewer-email">Your email</label>
      <input id="reviewer-email" type="email" autocomplete="email" placeholder="you@company.com">
    </div>
  </div>

  <label class="review-notes-label review-intro" for="overall-notes" style="display:block;margin-top:1.5rem;">Overall comments (optional)</label>
  <div class="review-intro" style="margin-top:0.5rem;">
    <textarea id="overall-notes" rows="4" placeholder="Anything that applies to the whole homepage — brand voice, general direction, launch timing, etc."></textarea>
  </div>

  <main style="margin-top:1.5rem;">
    ${sectionBlocks}
  </main>

  <div class="review-actions">
    <button type="button" class="btn-primary" id="save-review-btn">Download feedback PDF</button>
    <button type="button" class="btn-secondary" id="print-review-btn">Print or save as PDF</button>
    <button type="button" class="btn-secondary" id="save-json-btn">Download feedback backup (JSON)</button>
    <span class="review-save-status" id="save-status" aria-live="polite"></span>
  </div>

  <script>${sanitizeInlineScript(jspdfInlineScript)}</script>
  <script id="review-data-embedded" type="application/json">${JSON.stringify(reviewData)}</script>
  <script>
    (function () {
      const baseData = JSON.parse(document.getElementById('review-data-embedded').textContent);
      const saveBtn = document.getElementById('save-review-btn');
      const saveStatus = document.getElementById('save-status');

      function statusLabel(value) {
        if (value === 'approved') return 'Looks good';
        if (value === 'changes') return 'Needs changes';
        if (value === 'unsure') return 'Not sure';
        return 'No response';
      }

      function priorityLabel(value) {
        if (value === 'high') return 'High — must fix before launch';
        if (value === 'low') return 'Low — nice to have';
        return 'Normal';
      }

      function collectReviewData() {
        const data = JSON.parse(JSON.stringify(baseData));
        data.reviewerName = document.getElementById('reviewer-name').value.trim();
        data.reviewerEmail = document.getElementById('reviewer-email').value.trim();
        data.overallNotes = document.getElementById('overall-notes').value.trim();
        data.submittedAt = new Date().toISOString();
        data.sections = data.sections.map(function (section) {
          const statusInput = document.querySelector('input[name="status-' + section.id + '"]:checked');
          const notesEl = document.getElementById('notes-' + section.id);
          const priorityEl = document.getElementById('priority-' + section.id);
          return {
            id: section.id,
            label: section.label,
            previewFile: section.previewFile,
            previewDataUrl: section.previewDataUrl || '',
            status: statusInput ? statusInput.value : null,
            notes: notesEl ? notesEl.value.trim() : '',
            priority: priorityEl ? priorityEl.value : 'normal',
          };
        });
        return data;
      }

      function slugify(text) {
        return String(text || 'homepage')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 48) || 'homepage';
      }

      function detectImageFormat(dataUrl) {
        return String(dataUrl || '').startsWith('data:image/jpeg') ? 'JPEG' : 'PNG';
      }

      async function buildFeedbackPdf(data) {
        const JsPDF = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : window.jsPDF;
        if (!JsPDF) throw new Error('PDF library missing from this file. Use Print or save as PDF instead.');

        const doc = new JsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
        const margin = 48;
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const contentW = pageW - margin * 2;
        let y = margin;

        function ensureSpace(needed, bottomMargin) {
          const bottom = bottomMargin == null ? margin : bottomMargin;
          if (y + needed > pageH - bottom) {
            doc.addPage();
            y = margin;
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

        doc.setFillColor(26, 37, 43);
        doc.rect(0, 0, pageW, 78, 'F');
        doc.setTextColor(201, 169, 110);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('LOGICX SHOWROOM · CLIENT FEEDBACK', margin, 28);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text(String(data.companyName || 'Homepage Review'), margin, 52);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(String(data.templateLabel || 'Showroom') + ' template · Ref ' + String(data.packageId || ''), margin, 68);

        y = 96;
        const submitted = data.submittedAt
          ? new Date(data.submittedAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
          : new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

        writeLines('Feedback summary', { bold: true, size: 14, gap: 6 });
        writeLines('Submitted: ' + submitted, { size: 9, color: [90, 90, 90], gap: 4 });
        if (data.reviewerName || data.reviewerEmail) {
          writeLines(
            'From: ' + (data.reviewerName || '—') + (data.reviewerEmail ? ' · ' + data.reviewerEmail : ''),
            { size: 10, gap: 8 },
          );
        }

        const sections = Array.isArray(data.sections) ? data.sections : [];
        const approved = sections.filter(function (s) { return s.status === 'approved'; }).length;
        const changes = sections.filter(function (s) { return s.status === 'changes'; }).length;
        const unsure = sections.filter(function (s) { return s.status === 'unsure'; }).length;
        writeLines(
          'Looks good: ' + approved + ' · Needs changes: ' + changes + ' · Not sure: ' + unsure,
          { size: 10, gap: 10 },
        );

        if (data.overallNotes) {
          writeLines('Overall comments', { bold: true, size: 11, gap: 4 });
          writeLines(data.overallNotes, { size: 10, gap: 12 });
        }

        writeLines('Return this PDF to: ${CLIENT_SERVICES_EMAIL}', { size: 9, color: [90, 90, 90], gap: 12 });

        for (let index = 0; index < sections.length; index += 1) {
          const section = sections[index];
          ensureSpace(120);
          writeLines((index + 1) + '. ' + section.label, { bold: true, size: 12, gap: 4 });
          writeLines('Status: ' + statusLabel(section.status), { size: 10, gap: 4 });
          if (section.status === 'changes' || section.status === 'unsure') {
            writeLines('Priority: ' + priorityLabel(section.priority), { size: 10, gap: 4 });
          }
          writeLines(section.notes ? ('Notes: ' + section.notes) : 'Notes: —', { size: 10, gap: 8 });

          const imageSrc = section.previewDataUrl || section.previewFile;
          if (imageSrc) {
            try {
              const boxW = contentW;
              const boxH = 150;
              ensureSpace(boxH + 16);
              doc.addImage(imageSrc, detectImageFormat(imageSrc), margin, y, boxW, boxH, undefined, 'FAST');
              y += boxH + 16;
            } catch (err) {
              writeLines('Screenshot could not be embedded in PDF.', { size: 9, color: [120, 120, 120], gap: 8 });
            }
          }
        }

        return doc.output('blob');
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

      function finishPdfDownload(data, pdfBlob) {
        var filename = slugify(data.companyName) + '-homepage-feedback.pdf';
        downloadBlob(pdfBlob, filename);
        saveStatus.textContent = 'PDF downloaded — email this file to your LogicX onboarding agent.';
      }

      function preparePrintLabels() {
        document.querySelectorAll('.review-status-group label').forEach(function (label) {
          const input = label.querySelector('input[type="radio"]');
          if (!input) return;
          label.setAttribute('data-print-value', input.value === 'approved' ? 'Looks good' : input.value === 'changes' ? 'Needs changes' : input.value === 'unsure' ? 'Not sure' : 'No response');
        });
        document.querySelectorAll('.review-status-group').forEach(function (group) {
          const checked = group.querySelector('input[type="radio"]:checked');
          group.querySelectorAll('label').forEach(function (label) {
            const input = label.querySelector('input[type="radio"]');
            if (!input) return;
            label.style.fontWeight = checked && input === checked ? '700' : '400';
          });
        });
      }

      saveBtn.addEventListener('click', async function () {
        saveBtn.disabled = true;
        saveStatus.textContent = 'Building your feedback PDF…';
        try {
          const data = collectReviewData();
          const pdfBlob = await buildFeedbackPdf(data);
          finishPdfDownload(data, pdfBlob);
        } catch (err) {
          saveStatus.textContent = 'Could not create PDF automatically. Use Print or save as PDF, or download the JSON backup. ' + (err && err.message ? err.message : '');
        } finally {
          saveBtn.disabled = false;
        }
      });

      document.getElementById('print-review-btn').addEventListener('click', function () {
        preparePrintLabels();
        saveStatus.textContent = 'Opening print dialog — choose Save as PDF if available.';
        window.print();
      });

      document.getElementById('save-json-btn').addEventListener('click', function () {
        const data = collectReviewData();
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(jsonBlob, slugify(data.companyName) + '-homepage-feedback.json');
        saveStatus.textContent = 'JSON backup downloaded — attach this file if PDF export fails.';
      });
    })();
  </script>
</body>
</html>`;
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
      <p>Internal LogicX tool — load structured review data when routing updates to web development.</p>
    </div>
  </header>

  <div class="wrap">
    <div class="panel">
      <div class="load-row">
        <label for="review-file"><strong>Load review-data.json</strong></label>
        <input type="file" id="review-file" accept="application/json,.json">
      </div>
      <p class="muted" style="margin:0.75rem 0 0;">Clients open Homepage-Review.html, download a feedback PDF, and email it to ${escapeHtml(CLIENT_SERVICES_EMAIL)}. Use this tool when you have structured JSON for developer handoff.</p>
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

    function buildOpenFirstText(reviewData) {
        return [
            `${reviewData.companyName} — Homepage Review`,
            '==========================================',
            '',
            'OPEN THIS FILE IN A WEB BROWSER',
            '',
            '1. Unzip the entire package first.',
            '2. Double-click Homepage-Review.html',
            '   - Recommended: Google Chrome',
            '   - Also works: Microsoft Edge, Firefox, Safari',
            '3. If the wrong app opens, right-click Homepage-Review.html',
            '   → Open with → Google Chrome (or Edge).',
            '',
            'Do NOT open in Word, Preview, or Adobe Acrobat.',
            'Those programs cannot run the interactive feedback form.',
            '',
            'HOW FEEDBACK WORKS',
            '- You type your answers on the Homepage-Review.html page.',
            '- The PDF is a finished summary to email back — not an editable form.',
            '- If PDF download fails, use "Print or save as PDF" in the browser.',
            '',
            'SUBMIT',
            `Email your PDF (or JSON backup) to ${CLIENT_SERVICES_EMAIL}`,
            '',
            `Reference: ${reviewData.packageId}`,
        ].join('\n');
    }

    function buildReadmeText(reviewData) {
        return [
            `${reviewData.companyName} — Homepage Client Review`,
            '==========================================',
            '',
            'PACKAGE LAYOUT',
            '- Homepage-Review.html — send this to the client (only file they need to open).',
            '- agent/ — internal LogicX tools, screenshots, and reference files.',
            '',
            'FOR THE CLIENT',
            '1. Unzip this package and open Homepage-Review.html in Google Chrome (or Edge, Firefox, Safari).',
            '2. See OPEN-FIRST.txt if double-click opens the wrong program.',
            '3. Enter all feedback on the web page — the PDF is a read-only summary, not an editable form.',
            '4. Click "Download feedback PDF" (or "Print or save as PDF" as a fallback).',
            '5. Email the PDF back to their LogicX onboarding agent at ' + CLIENT_SERVICES_EMAIL + '.',
            '',
            'The client can ignore the agent folder entirely.',
            '',
            `Reference: ${reviewData.packageId}`,
            `Template: ${reviewData.templateLabel}`,
        ].join('\n');
    }

    function buildAgentReadmeText(reviewData) {
        return [
            'LogicX internal — client review tools',
            '====================================',
            '',
            'PACKAGE LAYOUT',
            '- ../Homepage-Review.html — client feedback form (screenshots embedded).',
            '- previews/ — section PNG captures for reference.',
            '- lib/jspdf.umd.min.js — PDF library (also embedded in Homepage-Review.html for offline use).',
            '- agent-summary.html — load review-data.json for dev handoff summary.',
            '- review-data.json — structured template (optional; client workflow uses PDF).',
            '',
            'CLIENT WORKFLOW',
            '- Client opens Homepage-Review.html in Chrome (recommended) or any modern browser.',
            '- Client enters feedback on the HTML page, then downloads a PDF summary.',
            '- PDF is read-only — not a fillable Acrobat form. HTML page is the editing surface.',
            '- Client emails the PDF to ' + CLIENT_SERVICES_EMAIL + ' (JSON backup acceptable if PDF fails).',
            '',
            'ONBOARDING AGENT',
            '- Share the ZIP or only Homepage-Review.html with the client.',
            '- When the PDF returns, route it to web development.',
            '- Use agent-summary.html + review-data.json only if you have structured JSON.',
            '',
            `Package ID: ${reviewData.packageId}`,
            `Template: ${reviewData.templateLabel} (${reviewData.design})`,
            `Generated: ${reviewData.generatedAt}`,
        ].join('\n');
    }

    async function bundleVendorScript(zip, vendorPath, zipPath) {
        const response = await fetch(vendorPath);
        if (!response.ok) {
            throw new Error(`Could not bundle ${vendorPath} for the review package.`);
        }
        zip.file(zipPath, await response.text());
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
            const options = {
                scale: 1.35,
                timeoutMs: 60000,
                imageTimeout: 12000,
            };

            if (sectionId === 'header') {
                options.timeoutMs = 90000;
            } else if (sectionId === 'sketch-section') {
                options.scale = 1.25;
                options.imageTimeout = 15000;
            } else if (sectionId === 'you-may-like' || sectionId === 'get-inspired') {
                options.scale = 1.1;
                options.timeoutMs = 90000;
                options.imageTimeout = 15000;
            }

            return options;
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
            onProgress({ phase: 'packaging', current: capturableSections.length, total: capturableSections.length });
        }

        const reviewData = buildReviewData(reviewMeta, capturedSections);
        const zip = new JSZip();
        const agentFolder = zip.folder('agent');
        const previewsFolder = agentFolder.folder('previews');

        const jspdfResponse = await fetch('vendor/jspdf.umd.min.js');
        if (!jspdfResponse.ok) {
            throw new Error('Could not load PDF library for the review package.');
        }
        const jspdfInlineScript = await jspdfResponse.text();

        for (const section of capturedSections) {
            previewsFolder.file(`${section.id}.png`, dataUrlToBlob(section.dataUrl));
        }

        await bundleVendorScript(zip, 'vendor/jspdf.umd.min.js', 'agent/lib/jspdf.umd.min.js');

        zip.file('OPEN-FIRST.txt', buildOpenFirstText(reviewData));
        zip.file('Homepage-Review.html', buildClientReviewHtml(reviewData, jspdfInlineScript));
        agentFolder.file('README.txt', buildAgentReadmeText(reviewData));
        agentFolder.file('REVIEW-README.txt', buildReadmeText(reviewData));
        agentFolder.file('agent-summary.html', buildAgentSummaryHtml());
        agentFolder.file('review-data.json', JSON.stringify(reviewData, null, 2));

        const resolvedZipName = zipFilename
            || `${slugify(reviewMeta.companyName)}-client-review.zip`;
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, resolvedZipName);

        return { zipBlob, reviewData };
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
