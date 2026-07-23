'use strict';

const http = require('http');
const https = require('https');
const net = require('net');
const { URL } = require('url');
const dns = require('dns').promises;

const TIMEOUT_MS = 10000;
const MAX_REDIRECTS = 5;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 10;
const USER_AGENT = 'LogicX-HealthCheck/1.0 (+https://logicxo.com/pro-tools)';

const rateBuckets = new Map();

function getClientIp(req) {
    const xf = req.headers['x-forwarded-for'];
    if (typeof xf === 'string' && xf.trim()) {
        return xf.split(',')[0].trim();
    }
    return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    let bucket = rateBuckets.get(ip);
    if (!bucket || now - bucket.windowStart > RATE_WINDOW_MS) {
        bucket = { windowStart: now, count: 0 };
        rateBuckets.set(ip, bucket);
    }
    bucket.count += 1;
    if (bucket.count > RATE_MAX) {
        const retryAfterSec = Math.ceil((bucket.windowStart + RATE_WINDOW_MS - now) / 1000);
        return { ok: false, retryAfterSec };
    }
    return { ok: true };
}

function isPrivateIp(ip) {
    if (!ip || net.isIP(ip) === 0) return true;

    if (net.isIP(ip) === 4) {
        const p = ip.split('.').map(Number);
        if (p[0] === 0 || p[0] === 10 || p[0] === 127) return true;
        if (p[0] === 169 && p[1] === 254) return true;
        if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
        if (p[0] === 192 && p[1] === 168) return true;
        if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true;
        if (p[0] === 192 && p[1] === 0 && (p[2] === 0 || p[2] === 2)) return true;
        if (p[0] === 198 && (p[1] === 18 || p[1] === 19)) return true;
        if (p[0] === 198 && p[1] === 51 && p[2] === 100) return true;
        if (p[0] === 203 && p[1] === 0 && p[2] === 113) return true;
        if (p[0] >= 224) return true;
        return false;
    }

    const n = ip.toLowerCase();
    if (n === '::1' || n === '::') return true;
    if (n.startsWith('fc') || n.startsWith('fd')) return true;
    if (n.startsWith('fe80')) return true;
    if (n.startsWith('::ffff:')) {
        return isPrivateIp(n.slice(7));
    }
    return false;
}

function isBlockedHostname(hostname) {
    const h = String(hostname || '').toLowerCase().replace(/\.$/, '');
    if (!h) return true;
    if (h === 'localhost' || h.endsWith('.localhost')) return true;
    if (h.endsWith('.local') || h.endsWith('.internal') || h.endsWith('.intranet')) return true;
    if (h.endsWith('.lan') || h.endsWith('.home') || h.endsWith('.corp')) return true;
    if (h === 'metadata.google.internal') return true;
    if (h === 'metadata' || h.endsWith('.metadata')) return true;
    return false;
}

function normalizeUrlInput(raw) {
    let input = String(raw || '').trim();
    if (!input) {
        const err = new Error('Enter a website URL.');
        err.code = 'INVALID_URL';
        throw err;
    }
    if (!/^https?:\/\//i.test(input)) {
        input = `https://${input}`;
    }

    let parsed;
    try {
        parsed = new URL(input);
    } catch {
        const err = new Error('That does not look like a valid URL.');
        err.code = 'INVALID_URL';
        throw err;
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        const err = new Error('Only http and https URLs are allowed.');
        err.code = 'INVALID_URL';
        throw err;
    }
    if (parsed.username || parsed.password) {
        const err = new Error('URLs with credentials are not allowed.');
        err.code = 'INVALID_URL';
        throw err;
    }
    if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
        const err = new Error('Only standard ports (80 / 443) are allowed.');
        err.code = 'INVALID_URL';
        throw err;
    }
    if (isBlockedHostname(parsed.hostname)) {
        const err = new Error('That host is not allowed.');
        err.code = 'BLOCKED_HOST';
        throw err;
    }
    if (net.isIP(parsed.hostname) && isPrivateIp(parsed.hostname)) {
        const err = new Error('Private or internal addresses are not allowed.');
        err.code = 'BLOCKED_HOST';
        throw err;
    }

    return parsed;
}

async function assertPublicHost(hostname) {
    if (isBlockedHostname(hostname)) {
        const err = new Error('That host is not allowed.');
        err.code = 'BLOCKED_HOST';
        throw err;
    }
    if (net.isIP(hostname)) {
        if (isPrivateIp(hostname)) {
            const err = new Error('Private or internal addresses are not allowed.');
            err.code = 'BLOCKED_HOST';
            throw err;
        }
        return;
    }

    let records;
    try {
        records = await dns.lookup(hostname, { all: true, verbatim: true });
    } catch {
        const err = new Error('Could not resolve that hostname.');
        err.code = 'DNS_FAIL';
        throw err;
    }

    if (!records.length) {
        const err = new Error('Could not resolve that hostname.');
        err.code = 'DNS_FAIL';
        throw err;
    }

    for (const rec of records) {
        if (isPrivateIp(rec.address)) {
            const err = new Error('Private or internal addresses are not allowed.');
            err.code = 'BLOCKED_HOST';
            throw err;
        }
    }
}

function gradeLatency(ms) {
    if (ms == null || !Number.isFinite(ms)) return null;
    if (ms < 500) return 'Fast';
    if (ms <= 1500) return 'OK';
    return 'Slow';
}

function formatIssuer(cert) {
    if (!cert || !cert.issuer) return null;
    const iss = cert.issuer;
    return iss.O || iss.CN || iss.OU || null;
}

function daysUntil(date) {
    if (!date || Number.isNaN(date.getTime())) return null;
    return Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function requestOnce(urlObj, { method = 'GET', timeoutMs = TIMEOUT_MS, maxBytes = MAX_BODY_BYTES } = {}) {
    return new Promise((resolve, reject) => {
        const lib = urlObj.protocol === 'https:' ? https : http;
        const started = Date.now();
        let settled = false;

        const req = lib.request(
            {
                protocol: urlObj.protocol,
                hostname: urlObj.hostname,
                port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                path: `${urlObj.pathname || '/'}${urlObj.search || ''}`,
                method,
                headers: {
                    'User-Agent': USER_AGENT,
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Encoding': 'identity',
                    Connection: 'close',
                },
                timeout: timeoutMs,
                rejectUnauthorized: true,
            },
            (res) => {
                const chunks = [];
                let size = 0;
                let truncated = false;

                res.on('data', (chunk) => {
                    if (truncated) return;
                    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
                    if (size + buf.length > maxBytes) {
                        const remain = Math.max(0, maxBytes - size);
                        if (remain > 0) chunks.push(buf.subarray(0, remain));
                        size = maxBytes;
                        truncated = true;
                        res.destroy();
                        return;
                    }
                    chunks.push(buf);
                    size += buf.length;
                });

                res.on('end', () => finish());
                res.on('close', () => {
                    if (!settled) finish();
                });

                function finish() {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timer);
                    const latencyMs = Date.now() - started;
                    let ssl = null;
                    if (urlObj.protocol === 'https:' && res.socket) {
                        try {
                            const cert = res.socket.getPeerCertificate && res.socket.getPeerCertificate();
                            if (cert && Object.keys(cert).length) {
                                const validTo = cert.valid_to ? new Date(cert.valid_to) : null;
                                const validFrom = cert.valid_from ? new Date(cert.valid_from) : null;
                                const now = Date.now();
                                const withinDates = Boolean(
                                    validFrom && validTo
                                    && now >= validFrom.getTime()
                                    && now <= validTo.getTime()
                                );
                                ssl = {
                                    valid: Boolean(res.socket.authorized) && withinDates,
                                    authorized: Boolean(res.socket.authorized),
                                    issuer: formatIssuer(cert),
                                    validTo: validTo ? validTo.toISOString() : null,
                                    daysToExpiry: daysUntil(validTo),
                                    authorizationError: res.socket.authorizationError || null,
                                };
                            }
                        } catch {
                            ssl = null;
                        }
                    }

                    resolve({
                        statusCode: res.statusCode || 0,
                        headers: res.headers,
                        latencyMs,
                        bodyBytes: size,
                        truncated,
                        finalUrl: urlObj.toString(),
                        ssl,
                        location: res.headers.location || null,
                    });
                }
            }
        );

        const timer = setTimeout(() => {
            if (settled) return;
            settled = true;
            req.destroy();
            const err = new Error('Request timed out.');
            err.code = 'TIMEOUT';
            reject(err);
        }, timeoutMs);

        req.on('timeout', () => {
            req.destroy();
        });

        req.on('error', (err) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            reject(err);
        });

        req.end();
    });
}

async function followRedirects(startUrl, options = {}) {
    let current = new URL(startUrl.toString());
    let redirects = 0;
    let last;

    while (redirects <= MAX_REDIRECTS) {
        await assertPublicHost(current.hostname);
        last = await requestOnce(current, options);

        const code = last.statusCode;
        if (code >= 300 && code < 400 && last.location) {
            let next;
            try {
                next = new URL(last.location, current);
            } catch {
                break;
            }
            if (next.protocol !== 'http:' && next.protocol !== 'https:') break;
            if (next.port && next.port !== '80' && next.port !== '443') {
                const err = new Error('Redirect targeted a non-standard port.');
                err.code = 'BLOCKED_HOST';
                throw err;
            }
            current = next;
            redirects += 1;
            continue;
        }

        return {
            ...last,
            finalUrl: current.toString(),
            redirectCount: redirects,
        };
    }

    return {
        ...last,
        finalUrl: current.toString(),
        redirectCount: redirects,
        redirectLimitReached: true,
    };
}

async function checkHttpsEnforced(hostname) {
    const httpUrl = new URL(`http://${hostname}/`);
    await assertPublicHost(hostname);
    const result = await followRedirects(httpUrl, { timeoutMs: TIMEOUT_MS });
    const final = new URL(result.finalUrl);
    return {
        checked: true,
        httpStatus: result.statusCode,
        finalUrl: result.finalUrl,
        redirectsToHttps: final.protocol === 'https:',
        error: null,
    };
}

async function runHealthCheck(rawUrl) {
    const parsed = normalizeUrlInput(rawUrl);
    await assertPublicHost(parsed.hostname);

    const result = {
        ok: true,
        inputUrl: parsed.toString(),
        checkedAt: new Date().toISOString(),
        reachable: null,
        statusCode: null,
        up: null,
        responseTimeMs: null,
        grade: null,
        finalUrl: null,
        pageSizeBytes: null,
        pageSizeTruncated: false,
        ssl: null,
        httpsRedirect: null,
        errors: [],
        partial: false,
    };

    try {
        const probe = await followRedirects(parsed, { timeoutMs: TIMEOUT_MS });
        result.reachable = true;
        result.statusCode = probe.statusCode;
        result.up = probe.statusCode >= 200 && probe.statusCode < 400;
        result.responseTimeMs = probe.latencyMs;
        result.grade = gradeLatency(probe.latencyMs);
        result.finalUrl = probe.finalUrl;
        result.pageSizeBytes = probe.bodyBytes;
        result.pageSizeTruncated = Boolean(probe.truncated);
        result.ssl = probe.ssl;
    } catch (err) {
        result.reachable = false;
        result.up = false;
        result.partial = true;
        result.errors.push({
            stage: 'probe',
            code: err.code || 'PROBE_FAIL',
            message: friendlyError(err),
        });
    }

    // If the main probe landed on HTTP (or SSL missing), try a direct HTTPS cert read.
    if (!result.ssl) {
        try {
            const httpsUrl = new URL(`https://${parsed.hostname}/`);
            const sslProbe = await followRedirects(httpsUrl, { timeoutMs: TIMEOUT_MS, method: 'GET' });
            if (sslProbe.ssl) {
                result.ssl = sslProbe.ssl;
            } else {
                result.ssl = {
                    valid: false,
                    issuer: null,
                    daysToExpiry: null,
                    error: 'No certificate details returned.',
                };
            }
        } catch (err) {
            result.partial = true;
            result.ssl = {
                valid: false,
                issuer: null,
                daysToExpiry: null,
                error: friendlyError(err),
            };
            result.errors.push({
                stage: 'ssl',
                code: err.code || 'SSL_FAIL',
                message: friendlyError(err),
            });
        }
    }

    try {
        result.httpsRedirect = await checkHttpsEnforced(parsed.hostname);
    } catch (err) {
        result.partial = true;
        result.httpsRedirect = {
            checked: false,
            redirectsToHttps: null,
            finalUrl: null,
            error: friendlyError(err),
        };
        result.errors.push({
            stage: 'https_redirect',
            code: err.code || 'REDIRECT_FAIL',
            message: friendlyError(err),
        });
    }

    if (result.ssl && result.ssl.daysToExpiry != null && result.ssl.daysToExpiry < 14) {
        result.ssl.expiringSoon = true;
    }

    return result;
}

function friendlyError(err) {
    if (!err) return 'Something went wrong.';
    if (err.code === 'TIMEOUT') return 'The check timed out after 10 seconds.';
    if (err.code === 'BLOCKED_HOST') return err.message;
    if (err.code === 'INVALID_URL') return err.message;
    if (err.code === 'DNS_FAIL') return err.message;
    if (err.code === 'ENOTFOUND') return 'Could not resolve that hostname.';
    if (err.code === 'CERT_HAS_EXPIRED') return 'SSL certificate has expired.';
    if (err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || err.code === 'CERT_UNTRUSTED') {
        return 'SSL certificate could not be verified.';
    }
    if (err.code === 'ECONNREFUSED') return 'Connection refused.';
    if (err.code === 'ECONNRESET') return 'Connection reset.';
    if (err.code === 'EAI_AGAIN') return 'Temporary DNS failure.';
    return err.message || 'The site could not be reached.';
}

function createHealthCheckHandler() {
    return async function healthCheckHandler(req, res) {
        const ip = getClientIp(req);
        const limit = checkRateLimit(ip);
        if (!limit.ok) {
            res.setHeader('Retry-After', String(limit.retryAfterSec));
            return res.status(429).json({
                ok: false,
                error: 'Too many checks from your network. Please try again later.',
                code: 'RATE_LIMIT',
            });
        }

        const url = req.body && req.body.url;
        try {
            const report = await runHealthCheck(url);
            return res.json(report);
        } catch (err) {
            const status = err.code === 'INVALID_URL' || err.code === 'BLOCKED_HOST' || err.code === 'DNS_FAIL'
                ? 400
                : 500;
            return res.status(status).json({
                ok: false,
                error: friendlyError(err),
                code: err.code || 'ERROR',
            });
        }
    };
}

module.exports = {
    runHealthCheck,
    createHealthCheckHandler,
    normalizeUrlInput,
    assertPublicHost,
    isPrivateIp,
    gradeLatency,
    TIMEOUT_MS,
};
