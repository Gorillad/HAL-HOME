(function () {
    'use strict';

    var STORAGE_KEY = 'logicxo-health-check-last';
    var root = document.getElementById('healthReport');
    if (!root) return;

    var hostEl = root.querySelector('#ptReportHost');
    var checkedEl = root.querySelector('#ptReportChecked');
    var statusEl = root.querySelector('#ptReportStatus');
    var loadingEl = root.querySelector('#ptReportLoading');
    var emptyEl = root.querySelector('#ptReportEmpty');
    var bodyEl = root.querySelector('#ptReportBody');
    var form = root.querySelector('#ptReportForm');
    var urlInput = root.querySelector('#ptReportUrl');
    var refreshBtn = root.querySelector('#ptReportRefresh');
    var currentUrl = '';

    function setStatus(message, kind) {
        if (!statusEl) return;
        statusEl.hidden = !message;
        statusEl.textContent = message || '';
        statusEl.dataset.kind = kind || '';
    }

    function formatBytes(n) {
        if (n == null || !Number.isFinite(n)) return '—';
        if (n < 1024) return n + ' B';
        if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
        return (n / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function formatWhen(iso) {
        if (!iso) return '—';
        try {
            return new Date(iso).toLocaleString();
        } catch (e) {
            return iso;
        }
    }

    function hostnameOf(url) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return url || '—';
        }
    }

    function computeScore(report) {
        var score = 0;
        var max = 100;

        if (report.up) score += 40;
        else if (report.reachable) score += 10;

        if (report.grade === 'Fast') score += 25;
        else if (report.grade === 'OK') score += 15;
        else if (report.grade === 'Slow') score += 5;

        if (report.ssl && report.ssl.valid) {
            if (report.ssl.daysToExpiry != null && report.ssl.daysToExpiry < 14) score += 10;
            else score += 20;
        }

        if (report.httpsRedirect && report.httpsRedirect.redirectsToHttps) score += 15;

        if (report.pageSizeBytes != null) {
            if (report.pageSizeBytes < 500 * 1024) score += 10;
            else if (report.pageSizeBytes < 1.5 * 1024 * 1024) score += 5;
        }

        score = Math.max(0, Math.min(max, score));
        var label = 'Needs attention';
        if (score >= 85) label = 'Strong';
        else if (score >= 70) label = 'Good';
        else if (score >= 50) label = 'Fair';
        return { score: score, label: label };
    }

    function buildNotes(report) {
        var notes = [];

        if (report.up) {
            notes.push({ tone: 'good', text: 'Site responded successfully and looks reachable from our probe.' });
        } else if (report.reachable === false) {
            notes.push({ tone: 'bad', text: 'Site did not respond. Confirm DNS, hosting, and that the URL is public.' });
        } else {
            notes.push({ tone: 'warn', text: 'Site responded with an unexpected status. Review HTTP status and redirects.' });
        }

        if (report.grade === 'Fast') {
            notes.push({ tone: 'good', text: 'Response time is Fast (under 500 ms).' });
        } else if (report.grade === 'OK') {
            notes.push({ tone: 'ok', text: 'Response time is OK (500–1500 ms). Watch for slowdowns during peak traffic.' });
        } else if (report.grade === 'Slow') {
            notes.push({ tone: 'warn', text: 'Response time is Slow (over 1500 ms). Consider caching, CDN, or origin performance.' });
        }

        if (report.ssl && report.ssl.valid) {
            if (report.ssl.daysToExpiry != null && report.ssl.daysToExpiry < 14) {
                notes.push({
                    tone: 'warn',
                    text: 'SSL is valid but expires in ' + report.ssl.daysToExpiry + ' days. Renew soon to avoid downtime.',
                });
            } else {
                notes.push({
                    tone: 'good',
                    text: 'SSL certificate is valid'
                        + (report.ssl.issuer ? ' (' + report.ssl.issuer + ')' : '')
                        + (report.ssl.daysToExpiry != null ? ' · ' + report.ssl.daysToExpiry + ' days left' : '')
                        + '.',
                });
            }
        } else {
            notes.push({ tone: 'bad', text: 'SSL could not be verified. Visitors may see browser warnings.' });
        }

        if (report.httpsRedirect && report.httpsRedirect.checked) {
            if (report.httpsRedirect.redirectsToHttps) {
                notes.push({ tone: 'good', text: 'HTTP redirects to HTTPS. Final URL: ' + (report.httpsRedirect.finalUrl || '—') });
            } else {
                notes.push({
                    tone: 'warn',
                    text: 'HTTP does not force HTTPS. Enforce HTTPS to protect shoppers and improve trust.',
                });
            }
        }

        if (report.pageSizeBytes != null) {
            if (report.pageSizeBytes > 1.5 * 1024 * 1024) {
                notes.push({ tone: 'warn', text: 'HTML payload is large (' + formatBytes(report.pageSizeBytes) + '). Heavy pages feel slower on mobile.' });
            } else {
                notes.push({ tone: 'ok', text: 'Page size measured at ' + formatBytes(report.pageSizeBytes) + (report.pageSizeTruncated ? '+' : '') + '.' });
            }
        }

        notes.push({
            tone: 'ok',
            text: 'This is a one-time probe. Continuous uptime, response-time history, and owner alerts are available when you connect 24/7 monitoring.',
        });

        return notes;
    }

    function setText(id, text) {
        var el = root.querySelector('#' + id);
        if (el) el.textContent = text;
    }

    function showSections(mode) {
        if (loadingEl) loadingEl.hidden = mode !== 'loading';
        if (emptyEl) emptyEl.hidden = mode !== 'empty';
        if (bodyEl) bodyEl.hidden = mode !== 'body';
    }

    function render(report) {
        currentUrl = report.inputUrl || report.finalUrl || '';
        var scored = computeScore(report);
        var notes = buildNotes(report);

        if (hostEl) hostEl.textContent = hostnameOf(currentUrl);
        if (checkedEl) checkedEl.textContent = 'Checked ' + formatWhen(report.checkedAt);

        setText('ptReportScore', String(scored.score));
        var scoreLabel = root.querySelector('#ptReportScoreLabel');
        if (scoreLabel) {
            scoreLabel.textContent = scored.label;
            scoreLabel.dataset.tone = scored.score >= 70 ? 'good' : scored.score >= 50 ? 'ok' : 'warn';
        }

        var snap = root.querySelector('#ptReportSnapshot');
        if (snap) {
            snap.innerHTML = '';
            var items = [
                report.up ? 'Up' : 'Down / issue',
                report.grade ? ('Speed: ' + report.grade) : 'Speed: —',
                (report.ssl && report.ssl.valid) ? 'SSL valid' : 'SSL issue',
                (report.httpsRedirect && report.httpsRedirect.redirectsToHttps) ? 'HTTPS enforced' : 'HTTPS not enforced',
            ];
            items.forEach(function (t) {
                var li = document.createElement('li');
                li.textContent = t;
                snap.appendChild(li);
            });
        }

        setText('ptRAvail', report.reachable === false ? 'No' : report.reachable ? 'Yes' : '—');
        setText('ptRStatus', report.statusCode != null ? String(report.statusCode) : '—');
        setText('ptRFinal', report.finalUrl || '—');
        setText('ptRTime', report.responseTimeMs != null ? Math.round(report.responseTimeMs) + ' ms' : '—');
        setText('ptRGrade', report.grade || '—');
        setText('ptRSize', formatBytes(report.pageSizeBytes) + (report.pageSizeTruncated ? '+' : ''));

        if (report.ssl) {
            setText('ptRSsl', report.ssl.valid ? 'Valid' : 'Invalid');
            setText('ptRIssuer', report.ssl.issuer || report.ssl.error || '—');
            if (report.ssl.daysToExpiry != null) {
                var days = report.ssl.daysToExpiry;
                setText('ptRExpiry', days < 0 ? ('Expired ' + Math.abs(days) + ' days ago') : (days + ' days'));
            } else {
                setText('ptRExpiry', '—');
            }
        } else {
            setText('ptRSsl', 'Unavailable');
            setText('ptRIssuer', '—');
            setText('ptRExpiry', '—');
        }

        if (report.httpsRedirect && report.httpsRedirect.checked) {
            setText('ptRHttps', report.httpsRedirect.redirectsToHttps ? 'Yes' : 'No');
        } else {
            setText('ptRHttps', 'Unavailable');
        }

        var notesList = root.querySelector('#ptReportNotes');
        if (notesList) {
            notesList.innerHTML = '';
            notes.forEach(function (note) {
                var li = document.createElement('li');
                li.dataset.tone = note.tone || '';
                li.textContent = note.text;
                notesList.appendChild(li);
            });
        }

        showSections('body');
        setStatus('', '');
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(report));
        } catch (e) { /* ignore */ }
    }

    function fetchReport(url) {
        showSections('loading');
        setStatus('', '');
        return fetch('/api/health-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url }),
        })
            .then(function (res) {
                return res.json().then(function (data) {
                    return { res: res, data: data };
                });
            })
            .then(function (payload) {
                if (!payload.res.ok || payload.data.ok === false) {
                    showSections('empty');
                    setStatus(payload.data.error || 'Could not run the health check.', 'warn');
                    return;
                }
                render(payload.data);
            })
            .catch(function () {
                showSections('empty');
                var protocol = window.location.protocol || '';
                var port = window.location.port || '';
                if (protocol === 'file:' || port === '5500' || port === '5501') {
                    setStatus(
                        'Open this page via the app server at http://localhost:4242 — the health check needs the Node backend.',
                        'warn'
                    );
                } else {
                    setStatus(
                        'Could not reach the health check service. Run `npm start` and open http://localhost:4242/pro-tools.html',
                        'warn'
                    );
                }
            });
    }

    function readStored() {
        try {
            var raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function init() {
        var params = new URLSearchParams(window.location.search);
        var urlParam = (params.get('url') || '').trim();
        var stored = readStored();

        if (urlParam) {
            if (urlInput) urlInput.value = urlParam;
            // Prefer a fresh check when arriving with ?url=
            fetchReport(urlParam);
            return;
        }

        if (stored && stored.ok !== false && (stored.inputUrl || stored.finalUrl)) {
            render(stored);
            return;
        }

        showSections('empty');
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var url = (urlInput && urlInput.value || '').trim();
            if (!url) {
                setStatus('Enter a website URL.', 'warn');
                return;
            }
            fetchReport(url);
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            if (!currentUrl) {
                showSections('empty');
                return;
            }
            fetchReport(currentUrl);
        });
    }

    init();
})();
