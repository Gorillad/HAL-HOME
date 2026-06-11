function initSiteAccessGate() {
    const gate = document.getElementById('siteAccessGate');
    const loginView = document.getElementById('siteAccessLoginView');
    const requestView = document.getElementById('siteAccessRequestView');
    const loginForm = document.getElementById('siteAccessLoginForm');
    const requestForm = document.getElementById('siteAccessRequestForm');
    const loginMsg = document.getElementById('siteAccessLoginMsg');
    const requestMsg = document.getElementById('siteAccessRequestMsg');
    const loginSubmit = document.getElementById('siteAccessLoginSubmit');

    if (!gate || !window.EditorAccess) return;

    function showView(view) {
        const isLogin = view === 'login';
        if (loginView) loginView.hidden = !isLogin;
        if (requestView) requestView.hidden = isLogin;
        if (loginMsg) loginMsg.hidden = true;
        if (requestMsg) requestMsg.hidden = true;
    }

    const POST_LOGIN_PATH = '/editor/knowledge-base.html';

    function goToEditorGuide() {
        EditorAccess.markAuthenticated();
        window.location.replace(POST_LOGIN_PATH);
    }

    function lockSite() {
        EditorAccess.markUnauthenticated();
        showView('login');
        loginForm?.reset();
        requestForm?.reset();
        window.scrollTo(0, 0);
        document.getElementById('siteAccessUsername')?.focus();
    }

    document.getElementById('siteNavLogout')?.addEventListener('click', () => {
        EditorAccess.logout().then(lockSite);
    });

    document.getElementById('siteAccessShowRequest')?.addEventListener('click', () => showView('request'));
    document.getElementById('siteAccessShowLogin')?.addEventListener('click', () => showView('login'));

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (loginMsg) loginMsg.hidden = true;

        const username = document.getElementById('siteAccessUsername')?.value.trim();
        const password = document.getElementById('siteAccessPassword')?.value;

        if (!username || !password) {
            EditorAccess.showMessage(loginMsg, 'Please enter your username and password.', 'error');
            return;
        }

        loginSubmit.disabled = true;

        try {
            await EditorAccess.login(username, password, POST_LOGIN_PATH);
            goToEditorGuide();
        } catch (err) {
            EditorAccess.showMessage(loginMsg, err.message || 'Sign in failed. Check your credentials.', 'error');
        } finally {
            loginSubmit.disabled = false;
        }
    });

    requestForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (requestMsg) requestMsg.hidden = true;

        const payload = {
            name: document.getElementById('siteAccessRequestName')?.value.trim(),
            email: document.getElementById('siteAccessRequestEmail')?.value.trim(),
            company: document.getElementById('siteAccessRequestCompany')?.value.trim(),
            username: document.getElementById('siteAccessRequestUsername')?.value.trim(),
            message: document.getElementById('siteAccessRequestMessage')?.value.trim(),
        };

        if (!payload.name) {
            EditorAccess.showMessage(requestMsg, 'Please enter your name.', 'error');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(payload.email || '')) {
            EditorAccess.showMessage(requestMsg, 'Please enter a valid work email.', 'error');
            return;
        }

        try {
            await EditorAccess.requestAccess(payload);
            requestForm.reset();
            EditorAccess.showMessage(
                requestMsg,
                'Thanks — we received your request and will follow up within one business day.',
                'success',
            );
        } catch (err) {
            EditorAccess.showMessage(
                requestMsg,
                err.message || 'Could not submit your request. Email hello@logicxo.com.',
                'error',
            );
        }
    });

    EditorAccess.checkSession().then((ok) => {
        if (ok) {
            goToEditorGuide();
        } else {
            document.body.classList.add('site-locked');
            showView('login');
            document.getElementById('siteAccessUsername')?.focus();
        }
    });
}
