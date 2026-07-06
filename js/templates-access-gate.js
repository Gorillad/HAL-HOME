function initTemplatesAccessGate() {
    const welcome = document.getElementById('templatesWelcomeBar');
    const welcomeText = document.getElementById('templatesWelcomeText');
    const content = document.getElementById('templatesContent');

    function showTemplates() {
        if (content) {
            content.hidden = false;
            content.removeAttribute('aria-hidden');
        }
    }

    showTemplates();

    if (!window.EditorAccess) return;

    function getEditorNextPath() {
        const params = new URLSearchParams(window.location.search);
        const next = params.get('editor_next');
        if (!next || !next.startsWith('/editor/')) return null;
        return next;
    }

    function clearResumeQuery() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('editor_next') && !params.has('session')) return;

        params.delete('editor_next');
        params.delete('session');
        const query = params.toString();
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
        window.history.replaceState(null, '', nextUrl);
    }

    function formatWelcome(user, offline) {
        if (offline) {
            return `Signed in as ${user}. Run npm start and open http://localhost:4242 for the full editor.`;
        }
        if (user && user.includes('@')) {
            return `You're signed in as ${user} — pick a template tier below to get started.`;
        }
        return "You're signed in — pick a template tier below to get started.";
    }

    function setLogoutVisible(visible) {
        const navLogout = document.getElementById('siteNavLogout');
        if (navLogout) navLogout.hidden = !visible;
    }

    function showSignedInState(user, options = {}) {
        const { offline = false, showWelcome = true } = options;

        clearResumeQuery();
        showTemplates();

        if (welcome) {
            if (showWelcome && user) {
                welcome.hidden = false;
                welcome.removeAttribute('aria-hidden');
                if (welcomeText) welcomeText.textContent = formatWelcome(user, offline);
            } else {
                welcome.hidden = true;
                welcome.setAttribute('aria-hidden', 'true');
            }
        }

        setLogoutVisible(Boolean(user));
    }

    function handleLogout(btn) {
        const doLogout = function () {
            clearResumeQuery();
            EditorAccess.logout().then(function () {
                showTemplates();
                if (welcome) {
                    welcome.hidden = true;
                    welcome.setAttribute('aria-hidden', 'true');
                }
                setLogoutVisible(false);
            });
        };

        if (window.triggerOneUp) {
            window.triggerOneUp(btn || null, doLogout);
        } else {
            doLogout();
        }
    }

    const templatesLogoutBtn = document.getElementById('templatesLogout');
    const siteNavLogoutBtn = document.getElementById('siteNavLogout');

    if (templatesLogoutBtn) {
        templatesLogoutBtn.addEventListener('click', function () { handleLogout(this); });
    }
    if (siteNavLogoutBtn) {
        siteNavLogoutBtn.addEventListener('click', function () { handleLogout(this); });
    }

    EditorAccess.checkSession().then(function (session) {
        showTemplates();

        const editorNext = getEditorNextPath();
        if (session.ok && editorNext) {
            clearResumeQuery();
            window.location.assign(editorNext);
            return;
        }

        if (session.ok && session.user) {
            showSignedInState(session.user, {
                offline: Boolean(session.offline),
                showWelcome: !session.betaOpen,
            });
            return;
        }

        if (welcome) {
            welcome.hidden = true;
            welcome.setAttribute('aria-hidden', 'true');
        }
        setLogoutVisible(false);
    });
}
