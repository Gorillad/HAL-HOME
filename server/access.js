const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { sendAccessRequestEmail } = require('./email');

const SESSION_COOKIE = 'lx_editor_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const REQUESTS_PATH = path.join(__dirname, 'data', 'access-requests.json');

function getSessionSecret() {
    return process.env.EDITOR_SESSION_SECRET || 'logicxo-dev-session-secret-change-me';
}

function getCredentials() {
    return {
        username: process.env.EDITOR_USERNAME || 'admin',
        password: process.env.EDITOR_PASSWORD || '12345',
    };
}

function getCookie(req, name) {
    const raw = req.headers.cookie || '';
    const match = raw.match(new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function signSession(payload) {
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto.createHmac('sha256', getSessionSecret()).update(data).digest('base64url');
    return `${data}.${sig}`;
}

function verifySession(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [data, sig] = parts;
    const expected = crypto.createHmac('sha256', getSessionSecret()).update(data).digest('base64url');
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return null;
    }

    try {
        const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
        if (!payload.exp || payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

function setSessionCookie(res, token) {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader(
        'Set-Cookie',
        `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_MAX_AGE_MS / 1000)}${secure}`,
    );
}

function clearSessionCookie(res) {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader(
        'Set-Cookie',
        `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
    );
}

function createSessionToken(username) {
    return signSession({
        user: username,
        exp: Date.now() + SESSION_MAX_AGE_MS,
    });
}

function isValidNextPath(nextPath) {
    if (!nextPath || typeof nextPath !== 'string') return false;
    if (!nextPath.startsWith('/')) return false;
    if (nextPath.startsWith('//')) return false;
    return true;
}

function saveAccessRequest(entry) {
    const dir = path.dirname(REQUESTS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let existing = [];
    if (fs.existsSync(REQUESTS_PATH)) {
        try {
            existing = JSON.parse(fs.readFileSync(REQUESTS_PATH, 'utf8'));
        } catch {
            existing = [];
        }
    }

    existing.push(entry);
    fs.writeFileSync(REQUESTS_PATH, JSON.stringify(existing, null, 2));
}

function handleLogin(req, res) {
    const { username, password } = req.body || {};
    const creds = getCredentials();

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const userOk = username === creds.username;
    const passOk = password === creds.password;

    if (!userOk || !passOk) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = createSessionToken(username);
    setSessionCookie(res, token);

    const nextPath = isValidNextPath(req.body.next) ? req.body.next : '/index.html#template-editor';
    return res.json({ ok: true, redirect: nextPath });
}

function handleLogout(_req, res) {
    clearSessionCookie(res);
    return res.json({ ok: true });
}

function handleSessionCheck(req, res) {
    const token = getCookie(req, SESSION_COOKIE);
    const session = verifySession(token);
    if (!session) {
        return res.status(401).json({ authenticated: false });
    }
    return res.json({ authenticated: true, user: session.user });
}

async function handleRequestAccess(req, res) {
    const { name, email, company, username, message } = req.body || {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !String(name).trim()) {
        return res.status(400).json({ error: 'Please enter your name.' });
    }
    if (!email || !emailPattern.test(String(email).trim())) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const entry = {
        id: crypto.randomBytes(8).toString('hex'),
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        company: company ? String(company).trim() : '',
        username: username ? String(username).trim() : '',
        message: message ? String(message).trim() : '',
        requestedAt: new Date().toISOString(),
    };

    try {
        saveAccessRequest(entry);
        const result = await sendAccessRequestEmail(entry);
        console.log(`[access] Request saved from ${entry.email}`);
        return res.json({ ok: true, emailed: result.sent, to: result.to });
    } catch (err) {
        console.error('Failed to process access request:', err);
        return res.status(500).json({ error: 'Could not send your request. Please email hello@logicxo.com.' });
    }
}

function requireEditorAuth(req, res, next) {
    const token = getCookie(req, SESSION_COOKIE);
    if (verifySession(token)) {
        return next();
    }

    const nextPath = encodeURIComponent(req.originalUrl);
    return res.redirect(`/editor/login.html?next=${nextPath}`);
}

module.exports = {
    SESSION_COOKIE,
    getCookie,
    verifySession,
    handleLogin,
    handleLogout,
    handleSessionCheck,
    handleRequestAccess,
    requireEditorAuth,
    isValidNextPath,
};
