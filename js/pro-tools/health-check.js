(function () {
    'use strict';

    var root = document.getElementById('websiteHealthCheck');
    if (!root) return;

    var form = root.querySelector('#ptHealthForm');
    var input = root.querySelector('#ptHealthUrl');
    var button = root.querySelector('#ptHealthSubmit');
    var statusEl = root.querySelector('#ptHealthStatus');
    var results = root.querySelector('#ptHealthResults');
    var connectLink = root.querySelector('#ptHealthConnect');
    var lastReport = null;
    var STORAGE_KEY = 'logicxo-health-check-last';

    function updateConnectLink(report) {
        if (!connectLink) return;
        var targetUrl = (report && (report.inputUrl || report.finalUrl)) || (input && input.value) || '';
        targetUrl = String(targetUrl).trim();
        if (!targetUrl) {
            connectLink.href = 'pro-tools-health-report.html';
            return;
        }
        connectLink.href = 'pro-tools-health-report.html?url=' + encodeURIComponent(targetUrl);
    }

    function setBusy(busy) {
        if (button) {
            button.disabled = busy;
            button.textContent = busy ? 'Checking…' : 'Check';
        }
        if (input) input.disabled = busy;
    }

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

    function setText(id, text) {
        var el = root.querySelector('#' + id);
        if (el) el.textContent = text;
    }

    function setBadge(id, text, tone) {
        var el = root.querySelector('#' + id);
        if (!el) return;
        el.textContent = text;
        el.dataset.tone = tone || '';
    }

    function render(report) {
        results.hidden = false;
        results.setAttribute('data-ready', 'true');

        if (report.up) {
            setBadge('ptHealthUp', 'Up', 'good');
        } else if (report.reachable === false) {
            setBadge('ptHealthUp', 'Down', 'bad');
        } else {
            setBadge('ptHealthUp', 'Issue', 'warn');
        }

        setText('ptHealthHttp', report.statusCode != null ? String(report.statusCode) : '—');

        if (report.responseTimeMs != null) {
            setText('ptHealthTime', Math.round(report.responseTimeMs) + ' ms');
            var grade = report.grade || '—';
            var gradeTone = grade === 'Fast' ? 'good' : grade === 'OK' ? 'ok' : grade === 'Slow' ? 'warn' : '';
            setBadge('ptHealthGrade', grade, gradeTone);
        } else {
            setText('ptHealthTime', '—');
            setBadge('ptHealthGrade', '—', '');
        }

        if (report.ssl) {
            var sslValid = report.ssl.valid === true;
            setBadge('ptHealthSsl', sslValid ? 'Valid' : 'Invalid', sslValid ? 'good' : 'bad');
            setText('ptHealthIssuer', report.ssl.issuer || report.ssl.error || '—');
            if (report.ssl.daysToExpiry != null) {
                var days = report.ssl.daysToExpiry;
                var dayText = days < 0
                    ? 'Expired ' + Math.abs(days) + ' days ago'
                    : days + ' days';
                setText('ptHealthExpiry', dayText);
                var expiryEl = root.querySelector('#ptHealthExpiry');
                if (expiryEl) {
                    expiryEl.dataset.tone = (days < 14) ? 'warn' : '';
                }
            } else {
                setText('ptHealthExpiry', '—');
            }
        } else {
            setBadge('ptHealthSsl', 'Unavailable', 'warn');
            setText('ptHealthIssuer', '—');
            setText('ptHealthExpiry', '—');
        }

        if (report.httpsRedirect && report.httpsRedirect.checked) {
            var enforced = report.httpsRedirect.redirectsToHttps === true;
            setBadge('ptHealthHttps', enforced ? 'Yes' : 'No', enforced ? 'good' : 'warn');
            setText('ptHealthFinalUrl', report.httpsRedirect.finalUrl || report.finalUrl || '—');
        } else {
            setBadge('ptHealthHttps', 'Unavailable', 'warn');
            setText('ptHealthFinalUrl', (report.httpsRedirect && report.httpsRedirect.error)
                || report.finalUrl
                || '—');
        }

        var sizeText = formatBytes(report.pageSizeBytes);
        if (report.pageSizeTruncated) sizeText += '+';
        setText('ptHealthSize', sizeText);

        if (report.partial && report.errors && report.errors.length) {
            setStatus('Partial results — some checks timed out or failed.', 'warn');
        } else if (!report.up && report.errors && report.errors.length) {
            setStatus(report.errors[0].message || 'Could not fully check that site.', 'warn');
        } else {
            setStatus('', '');
        }

        lastReport = report;
        updateConnectLink(report);
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(report));
        } catch (e) { /* ignore */ }
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var url = (input && input.value || '').trim();
        if (!url) {
            setStatus('Enter a website URL.', 'warn');
            results.hidden = true;
            return;
        }

        setBusy(true);
        setStatus('Running checks…', '');
        results.hidden = true;

        fetch('/api/health-check', {
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
                    results.hidden = true;
                    setStatus(payload.data.error || 'Could not run the health check.', 'warn');
                    return;
                }
                render(payload.data);
            })
            .catch(function () {
                results.hidden = true;
                var protocol = window.location.protocol || '';
                var port = window.location.port || '';
                var wrongOrigin = protocol === 'file:'
                    || port === '5500'
                    || port === '5501';
                if (wrongOrigin) {
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
            })
            .finally(function () {
                setBusy(false);
            });
    });

    if (input) {
        input.addEventListener('input', function () {
            updateConnectLink(lastReport);
        });
    }
    updateConnectLink(null);
})();
