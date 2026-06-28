window.EditorAccess = (function initEditorAccessModule() {
    const DEV_USERNAME = 'admin';
    const DEV_PASSWORD = 'Logic050601';
    const DEV_SERVER_PORT = '4242';
    const CLIENT_SESSION_KEY = 'lx-site-session';

    let authenticated = false;

    function showMessage(el, text, type) {
        if (!el) return;
        el.hidden = false;
        el.textContent = text;
        el.classList.toggle('is-success', type === 'success');
        el.classList.toggle('is-error', type === 'error');
    }

    function normalizeUsername(value) {
        return String(value || '').trim().toLowerCase();
    }

    function normalizePassword(value) {
        return String(value || '').trim();
    }

    function normalizeEditorPath(href) {
        if (!href) return null;
        try {
            const url = new URL(href, window.location.origin);
            if (!url.pathname.startsWith('/editor/')) return null;
            return `${url.pathname}${url.search}`;
        } catch {
            return null;
        }
    }

    function setClientSession(user) {
        try {
            sessionStorage.setItem(CLIENT_SESSION_KEY, user || '1');
        } catch {
            // sessionStorage unavailable
        }
        authenticated = true;
    }

    function getClientSessionUser() {
        try {
            const value = sessionStorage.getItem(CLIENT_SESSION_KEY);
            return value && value !== '1' ? value : null;
        } catch {
            return null;
        }
    }

    function clearClientSession() {
        try {
            sessionStorage.removeItem(CLIENT_SESSION_KEY);
        } catch {
            // ignore
        }
        authenticated = false;
    }

    function isLocalDevHost() {
        const host = window.location.hostname;
        return !host
            || host === 'localhost'
            || host === '127.0.0.1'
            || host === '[::1]';
    }

    function getDevServerUrl() {
        const host = window.location.hostname || 'localhost';
        return `http://${host}:${DEV_SERVER_PORT}`;
    }

    function getApiBases() {
        const bases = [''];
        if (isLocalDevHost() && window.location.port !== DEV_SERVER_PORT) {
            bases.push(getDevServerUrl());
        }
        return bases;
    }

    function isNetworkError(err) {
        if (!err) return false;
        const message = String(err.message || err);
        return message.includes('Failed to fetch') || message.includes('NetworkError');
    }

    function isApiUnavailableStatus(status) {
        return status === 404 || status === 405 || status === 502 || status === 503;
    }

    function devCredentialsMatch(username, password) {
        if (!isLocalDevHost()) return false;
        return (
            normalizeUsername(username) === normalizeUsername(DEV_USERNAME)
            && normalizePassword(password) === DEV_PASSWORD
        );
    }

    function offlineLogin(user) {
        authenticated = true;
        setClientSession(user);
        return {
            ok: true,
            user,
            offline: true,
        };
    }

    function serverNotFoundMessage() {
        const port = window.location.port || '80';
        if (isLocalDevHost() && port !== DEV_SERVER_PORT) {
            return `You're on port ${port}, but sign-in runs on port ${DEV_SERVER_PORT}. Open http://localhost:${DEV_SERVER_PORT} (run npm start first).`;
        }
        return `Sign-in server not found. Run npm start, then open http://localhost:${DEV_SERVER_PORT}.`;
    }

    async function apiFetch(path, options = {}) {
        const { retryUnavailable = false, ...fetchOptions } = options;
        let lastUnavailable = null;
        let lastError = null;

        for (const base of getApiBases()) {
            try {
                const res = await fetch(`${base}${path}`, {
                    credentials: 'include',
                    ...fetchOptions,
                });
                if (retryUnavailable && isApiUnavailableStatus(res.status)) {
                    lastUnavailable = { res, base };
                    continue;
                }
                return { res, base };
            } catch (err) {
                lastError = err;
            }
        }

        if (lastUnavailable) return lastUnavailable;
        throw lastError || new Error('Failed to fetch');
    }

    async function checkSession() {
        try {
            const { res } = await apiFetch('/api/editor/session', { retryUnavailable: true });
            const data = await res.json().catch(() => ({}));

            if (res.ok && data.authenticated) {
                authenticated = true;
                setClientSession(data.user || getClientSessionUser());
                return { ok: true, user: data.user || getClientSessionUser(), source: 'server' };
            }

            if (res.status === 401) {
                clearClientSession();
                return { ok: false, user: null, source: 'server' };
            }
        } catch {
            // Server unreachable below
        }

        clearClientSession();
        return { ok: false, user: null, source: 'none' };
    }

    async function login(username, password) {
        const normalizedUser = normalizeUsername(username);
        const normalizedPass = normalizePassword(password);

        if (!normalizedUser || !normalizedPass) {
            throw new Error('Please enter your email and password.');
        }

        const payload = JSON.stringify({ username: normalizedUser, password: normalizedPass });
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
        };

        try {
            const { res } = await apiFetch('/api/editor/login', { ...requestOptions, retryUnavailable: true });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                authenticated = true;
                setClientSession(normalizedUser);
                return { ...data, user: normalizedUser };
            }

            if (res.status === 401 || res.status === 400) {
                throw new Error(data.error || 'Invalid email or password.');
            }

            if (isLocalDevHost() && isApiUnavailableStatus(res.status) && devCredentialsMatch(normalizedUser, normalizedPass)) {
                return offlineLogin(normalizedUser);
            }

            if (isApiUnavailableStatus(res.status)) {
                throw new Error(serverNotFoundMessage());
            }

            throw new Error('Could not sign in right now. Please try again.');
        } catch (err) {
            if (!isNetworkError(err)) throw err;

            if (devCredentialsMatch(normalizedUser, normalizedPass)) {
                return offlineLogin(normalizedUser);
            }

            throw new Error(serverNotFoundMessage());
        }
    }

    async function logout() {
        try {
            await apiFetch('/api/editor/logout', { method: 'POST' });
        } catch {
            // ignore
        }
        clearClientSession();
    }

    function redirectToTemplatesLogin(editorPath, reason) {
        const params = new URLSearchParams();
        if (editorPath) params.set('editor_next', editorPath);
        if (reason) params.set('session', reason);
        const query = params.toString();
        window.location.assign(`/index.html${query ? `?${query}` : ''}#templates`);
    }

    function bindEditorNavigation() {
        // The editors are self-contained: previews load by relative path and
        // drafts persist to localStorage, so they run on whatever origin serves
        // them (including a static server like VS Code Live Server) with no Node
        // server required. Keep editor links on the CURRENT origin instead of
        // redirecting to the dev server port — that redirect was the cause of
        // "Open http://localhost:4242" dead-link/blank-page errors when the
        // Node server wasn't running.
        document.querySelectorAll('a[href*="/editor/"], a[href^="editor/"]').forEach((link) => {
            const editorPath = normalizeEditorPath(link.getAttribute('href'));
            if (!editorPath) return;
            link.setAttribute('href', editorPath);
        });
    }

    return {
        checkSession,
        login,
        logout,
        showMessage,
        bindEditorNavigation,
        normalizeEditorPath,
        redirectToTemplatesLogin,
    };
})();
