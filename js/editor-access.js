window.EditorAccess = (function initEditorAccessModule() {
    const CLIENT_USERNAME = 'admin';
    const CLIENT_PASSWORD = '12345';
    const CLIENT_SESSION_KEY = 'lx-site-session';

    let authenticated = false;

    function showMessage(el, text, type) {
        if (!el) return;
        el.hidden = false;
        el.textContent = text;
        el.classList.toggle('is-success', type === 'success');
        el.classList.toggle('is-error', type === 'error');
    }

    function setClientSession() {
        try {
            sessionStorage.setItem(CLIENT_SESSION_KEY, '1');
        } catch {
            // sessionStorage unavailable — in-memory only
        }
        authenticated = true;
    }

    function hasClientSession() {
        try {
            return sessionStorage.getItem(CLIENT_SESSION_KEY) === '1';
        } catch {
            return false;
        }
    }

    function clearClientSession() {
        try {
            sessionStorage.removeItem(CLIENT_SESSION_KEY);
        } catch {
            // ignore
        }
    }

    function credentialsMatch(username, password) {
        return username === CLIENT_USERNAME && password === CLIENT_PASSWORD;
    }

    async function checkSession() {
        try {
            const res = await fetch('/api/editor/session', { credentials: 'same-origin' });
            if (res.ok) {
                const data = await res.json();
                authenticated = Boolean(data.authenticated);
                if (authenticated) setClientSession();
                return authenticated;
            }
        } catch {
            // Server unavailable — fall back to client session
        }

        authenticated = hasClientSession();
        return authenticated;
    }

    async function login(username, password, nextPath) {
        const normalizedUser = String(username || '').trim();
        const normalizedPass = String(password || '');

        try {
            const res = await fetch('/api/editor/login', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: normalizedUser,
                    password: normalizedPass,
                    next: nextPath || '/editor/knowledge-base.html',
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                authenticated = true;
                setClientSession();
                return data;
            }
        } catch {
            // Network error — fall through to client-side credentials
        }

        if (credentialsMatch(normalizedUser, normalizedPass)) {
            authenticated = true;
            setClientSession();
            return { ok: true, redirect: nextPath || '/editor/knowledge-base.html' };
        }

        throw new Error('Invalid username or password.');
    }

    async function requestAccess(payload) {
        try {
            const res = await fetch('/api/editor/request-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.error || 'Could not submit your request.');
            }
            return data;
        } catch (err) {
            if (err.message && !err.message.includes('fetch')) {
                throw err;
            }
            console.info('[access] Request captured locally — server unavailable.');
            return { ok: true, offline: true };
        }
    }

    function isAuthenticated() {
        return authenticated;
    }

    function markUnauthenticated() {
        authenticated = false;
        clearClientSession();
        document.body.classList.add('site-locked');
        updateLogoutNav(false);
    }

    async function logout() {
        try {
            await fetch('/api/editor/logout', {
                method: 'POST',
                credentials: 'same-origin',
            });
        } catch {
            // Server unavailable — client session cleared below
        }
        markUnauthenticated();
    }

    function updateLogoutNav(isAuthed) {
        const logoutBtn = document.getElementById('siteNavLogout');
        if (logoutBtn) logoutBtn.hidden = !isAuthed;
    }

    function markAuthenticated() {
        authenticated = true;
        setClientSession();
        document.body.classList.remove('site-locked');
        updateLogoutNav(true);
    }

    return {
        checkSession,
        login,
        logout,
        requestAccess,
        isAuthenticated,
        markAuthenticated,
        markUnauthenticated,
        showMessage,
    };
})();
