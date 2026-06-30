function initTemplatesAccessGate() {
    const gate = document.getElementById('templatesAccessGate');
    const welcome = document.getElementById('templatesWelcomeBar');
    const welcomeText = document.getElementById('templatesWelcomeText');
    const content = document.getElementById('templatesContent');
    const hero = document.getElementById('templatesHero');
    const form = document.getElementById('templatesLoginForm');
    const msg = document.getElementById('templatesLoginMsg');
    const resume = document.getElementById('templatesLoginResume');
    const submit = document.getElementById('templatesLoginSubmit');
    const heroImages = hero ? [...hero.querySelectorAll('.home-templates-hero-image')] : [];

    if (!gate || !content || !window.EditorAccess) return;

    const passwordInput = document.getElementById('templatesLoginPassword');
    const passwordToggle = document.getElementById('templatesLoginPasswordToggle');

    function initPasswordToggle() {
        if (!passwordInput || !passwordToggle) return;

        passwordToggle.addEventListener('click', () => {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            passwordToggle.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
            passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
        });
    }

    initPasswordToggle();

    const HERO_ROTATE_MS = 8000;
    let heroRotateTimer = null;

    function stopHeroRotation() {
        if (heroRotateTimer) {
            clearInterval(heroRotateTimer);
            heroRotateTimer = null;
        }
    }

    function showHero(index) {
        heroImages.forEach((img, i) => {
            img.classList.toggle('is-active', i === index);
            img.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });
    }

    function initHeroRotation() {
        if (heroImages.length < 2) return;

        let index = Math.floor(Math.random() * heroImages.length);
        showHero(index);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        stopHeroRotation();
        heroRotateTimer = setInterval(() => {
            index = (index + 1) % heroImages.length;
            showHero(index);
        }, HERO_ROTATE_MS);
    }

    function getEditorNextPath() {
        const params = new URLSearchParams(window.location.search);
        const next = params.get('editor_next');
        if (!next || !next.startsWith('/editor/')) return null;
        return next;
    }

    function showResumePrompt() {
        if (!resume) return;

        const params = new URLSearchParams(window.location.search);
        const editorNext = params.get('editor_next');
        const sessionState = params.get('session');

        if (!editorNext || !editorNext.startsWith('/editor/')) {
            resume.hidden = true;
            return;
        }

        resume.hidden = false;
        if (sessionState === 'expired') {
            resume.textContent = 'Your previous session ended. Sign in again to return to the template editor.';
        } else {
            resume.textContent = 'Sign in to access the template editor.';
        }
    }

    function clearResumeQuery() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('editor_next') && !params.has('session')) return;

        params.delete('editor_next');
        params.delete('session');
        const query = params.toString();
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
        window.history.replaceState(null, '', nextUrl);
        if (resume) resume.hidden = true;
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

    function unlock(user, options = {}) {
        const { redirectToEditor = false, scrollToTemplates = false, offline = false } = options;
        const editorNext = redirectToEditor ? getEditorNextPath() : null;

        clearResumeQuery();

        stopHeroRotation();
        gate.hidden = true;
        if (welcome) {
            welcome.hidden = false;
            if (welcomeText) welcomeText.textContent = formatWelcome(user, offline);
        }
        content.hidden = false;
        content.removeAttribute('aria-hidden');
        setLogoutVisible(true);

        if (editorNext) {
            window.location.assign(editorNext);
            return;
        }

        if (scrollToTemplates) {
            content.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function lock() {
        gate.hidden = false;
        gate.classList.remove('home-templates-gate--unlocked');
        if (welcome) welcome.hidden = true;
        content.hidden = true;
        content.setAttribute('aria-hidden', 'true');
        setLogoutVisible(false);
        form?.reset();
        if (passwordInput) passwordInput.type = 'password';
        if (passwordToggle) {
            passwordToggle.setAttribute('aria-pressed', 'false');
            passwordToggle.setAttribute('aria-label', 'Show password');
        }
        if (msg) msg.hidden = true;
        showResumePrompt();
        initHeroRotation();
    }

    function handleLogout(btn) {
        var doLogout = function () {
            clearResumeQuery();
            EditorAccess.logout().then(lock);
        };
        if (window.triggerOneUp) {
            // Each click queues another jump; logout fires after the last one settles
            window.triggerOneUp(btn || null, doLogout);
        } else {
            doLogout();
        }
    }

    var templatesLogoutBtn = document.getElementById('templatesLogout');
    var siteNavLogoutBtn   = document.getElementById('siteNavLogout');

    if (templatesLogoutBtn) {
        templatesLogoutBtn.addEventListener('click', function () { handleLogout(this); });
    }
    if (siteNavLogoutBtn) {
        siteNavLogoutBtn.addEventListener('click', function () { handleLogout(this); });
    }

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (msg) msg.hidden = true;

        const email = document.getElementById('templatesLoginEmail')?.value.trim();
        const password = document.getElementById('templatesLoginPassword')?.value;

        if (!email || !password) {
            EditorAccess.showMessage(msg, 'Please enter your email and password.', 'error');
            return;
        }

        if (submit) submit.disabled = true;

        try {
            const result = await EditorAccess.login(email, password);
            const user = result.user || email.toLowerCase();
            unlock(user, {
                redirectToEditor: Boolean(getEditorNextPath()),
                scrollToTemplates: false,
                offline: Boolean(result.offline),
            });
        } catch (err) {
            EditorAccess.showMessage(msg, err.message || 'Sign in failed. Check your credentials.', 'error');
        } finally {
            if (submit) submit.disabled = false;
        }
    });

    EditorAccess.checkSession().then(function (session) {
        if (session.ok) {
            const resumeEditor = Boolean(getEditorNextPath());
            unlock(session.user, {
                redirectToEditor: resumeEditor,
                scrollToTemplates: false,
                offline: Boolean(session.offline),
            });
            return;
        }
        lock();
    });
}
