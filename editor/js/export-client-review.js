/**
 * Client-facing homepage review package — fillable PDF + agent JSON/previews.
 * Separate from developer handoff (export-pdf.js).
 * Requires ShowroomCapture, jsPDF, and JSZip (loaded in showroom.html).
 */
(function () {
    'use strict';

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

    function buildPackageId() {
        if (window.ShowroomHandoffGuide?.buildPackageId) {
            return window.ShowroomHandoffGuide.buildPackageId();
        }
        return 'REV-' + Date.now().toString(36).toUpperCase().slice(-6);
    }

    function loadCaptureMetrics(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
            img.onerror = () => resolve({ width: 0, height: 0 });
            img.src = dataUrl;
        });
    }

    function buildWindowsChromeLauncherBat() {
        return '@echo off\r\nsetlocal EnableExtensions\r\nset "REVIEW=%~dp0Homepage-Review.html"\r\nif not exist "%REVIEW%" (echo Could not find Homepage-Review.html & pause & exit /b 1)\r\nif exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" "%REVIEW%" & exit /b 0)\r\nif exist "%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe" (start "" "%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe" "%REVIEW%" & exit /b 0)\r\nif exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" "%REVIEW%" & exit /b 0)\r\nstart "" "%REVIEW%"\r\n';
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
                captureWidth: section.captureWidth || 0,
                captureHeight: section.captureHeight || 0,
                status: null,
                notes: '',
                priority: 'normal',
            })),
        };
    }

    function buildReviewDataForAgentJson(reviewData) {
        return {
            ...reviewData,
            sections: reviewData.sections.map((section) => ({
                id: section.id,
                label: section.label,
                previewFile: section.previewFile,
                status: section.status,
                notes: section.notes,
                priority: section.priority,
            })),
        };
    }

    function buildStartHereText(reviewData, pdfFilename) {
        return [
            `${reviewData.companyName} — Homepage Review`,
            '',
            'BEST EXPERIENCE (recommended)',
            '1. Double-click START-REVIEW-IN-CHROME.bat (Windows) or open Homepage-Review.html in Chrome.',
            '2. Review each section — use the radio buttons and notes boxes.',
            '3. Click Print or save as PDF, then return the PDF to your onboarding agent.',
            '',
            'ALTERNATIVE',
            `Open ${pdfFilename} — fillable PDF with section previews and radio buttons.`,
            '',
            `Ref ${reviewData.packageId} · ${reviewData.templateLabel}`,
        ].join('\n');
    }

    function buildAgentReadmeText(reviewData, pdfFilename) {
        return [
            'LogicX internal — client review tools',
            '====================================',
            '',
            'PACKAGE LAYOUT',
            '- ../Homepage-Review.html — primary client form (radio buttons + notes).',
            '- ../START-REVIEW-IN-CHROME.bat — Windows launcher for the HTML form.',
            `- ../${pdfFilename} — fillable PDF backup (landscape previews + radio feedback pages).`,
            '- previews/ — section PNG captures.',
            '- review-data.json — structured template at export time.',
            '- agent-summary.html — optional JSON summary viewer.',
            '',
            'CLIENT WORKFLOW',
            '- Client opens Homepage-Review.html, fills in feedback, prints/saves as PDF, and returns it.',
            '- PDF-only clients can use the fillable PDF instead.',
            '',
            'ONBOARDING AGENT',
            '- Send the ZIP; tell clients to start with Homepage-Review.html or the .bat launcher.',
            '- When feedback returns, route to web development.',
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
      <p class="muted" style="margin:0.75rem 0 0;">Load review-data.json from the agent folder for structured dev handoff.</p>
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
            pdfFilename: pdfFilenameOption,
            onProgress,
        } = options;

        if (!window.ShowroomCapture?.captureElementAsDataUrl || !window.ShowroomCapture?.isCapturable) {
            throw new Error('Showroom capture utilities not loaded.');
        }
        if (!window.ExportClientReviewBuilders?.buildClientReviewPdf) {
            throw new Error('Client review builders not loaded.');
        }
        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip not loaded.');
        }

        const { buildClientReviewPdf, buildClientReviewHtml } = window.ExportClientReviewBuilders;

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
            const { width: captureWidth, height: captureHeight } = await loadCaptureMetrics(dataUrl);
            capturedSections.push({
                id: section.id,
                label: section.label,
                dataUrl,
                previewDataUrl: dataUrl,
                captureWidth,
                captureHeight,
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
        const pdfFilename = pdfFilenameOption
            || `${slugify(reviewMeta.companyName)}-homepage-review.pdf`;

        let pdfBlob;
        try {
            pdfBlob = await buildClientReviewPdf(reviewData);
        } catch (pdfErr) {
            console.error('Review PDF build failed', pdfErr);
            throw new Error(`PDF build failed — ${pdfErr.message || pdfErr}`);
        }

        const htmlContent = buildClientReviewHtml(reviewData);

        if (typeof onProgress === 'function') {
            onProgress({ phase: 'packaging', current: capturableSections.length, total: capturableSections.length });
        }

        const zip = new JSZip();
        const agentFolder = zip.folder('agent');
        const previewsFolder = agentFolder.folder('previews');

        for (const section of capturedSections) {
            previewsFolder.file(`${section.id}.png`, dataUrlToBlob(section.dataUrl));
        }

        zip.file('Homepage-Review.html', htmlContent);
        zip.file('START-REVIEW-IN-CHROME.bat', buildWindowsChromeLauncherBat());
        zip.file(pdfFilename, pdfBlob);
        zip.file('START-HERE.txt', buildStartHereText(reviewData, pdfFilename));
        agentFolder.file('README.txt', buildAgentReadmeText(reviewData, pdfFilename));
        agentFolder.file('agent-summary.html', buildAgentSummaryHtml());
        agentFolder.file('review-data.json', JSON.stringify(buildReviewDataForAgentJson(reviewData), null, 2));

        const resolvedZipName = zipFilename
            || `${slugify(reviewMeta.companyName)}-client-review.zip`;
        let zipBlob;
        try {
            zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 },
            });
        } catch (zipErr) {
            console.error('Review ZIP packaging failed', zipErr);
            throw new Error(`ZIP packaging failed — ${zipErr.message || zipErr}`);
        }
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
