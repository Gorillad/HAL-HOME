(function guardEditorPage() {
    const html = document.documentElement;

    /* ── Dev shortcut ─────────────────────────────────────────────
       When running locally (localhost / 127.0.0.1) the editor is
       open without a login. The server also auto-authenticates
       localhost requests. Production deployments always require a
       valid session cookie.
    ──────────────────────────────────────────────────────────── */
    const host = window.location.hostname;
    const isDev = host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '';
    if (isDev) {
        html.classList.remove('editor-auth-pending');
        return;
    }

    function redirectToLogin(reason) {
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.replace(`/index.html?editor_next=${next}&session=${reason}#templates`);
    }

    if (!window.EditorAccess) {
        redirectToLogin('required');
        return;
    }

    EditorAccess.checkSession().then((session) => {
        if (session.ok) {
            html.classList.remove('editor-auth-pending');
            return;
        }
        redirectToLogin('required');
    });
})();
