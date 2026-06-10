(function initEditorLoginPage() {
    const params = new URLSearchParams(window.location.search);
    const nextPath = params.get('next') || '/index.html#template-editor';

    const loginView = document.getElementById('loginView');
    const requestView = document.getElementById('requestView');
    const loginForm = document.getElementById('loginForm');
    const requestForm = document.getElementById('requestAccessForm');
    const loginMsg = document.getElementById('loginFormMsg');
    const requestMsg = document.getElementById('requestFormMsg');
    const loginSubmit = document.getElementById('loginSubmit');

    function showView(view) {
        const isLogin = view === 'login';
        loginView.hidden = !isLogin;
        requestView.hidden = isLogin;
        if (loginMsg) loginMsg.hidden = true;
        if (requestMsg) requestMsg.hidden = true;
    }

    document.getElementById('showRequestAccess')?.addEventListener('click', () => showView('request'));
    document.getElementById('showLogin')?.addEventListener('click', () => showView('login'));

    EditorAccess.checkSession().then((ok) => {
        if (ok) window.location.replace(nextPath);
    });

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (loginMsg) loginMsg.hidden = true;

        const username = document.getElementById('loginUsername')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;

        if (!username || !password) {
            EditorAccess.showMessage(loginMsg, 'Please enter your username and password.', 'error');
            return;
        }

        loginSubmit.disabled = true;

        try {
            const data = await EditorAccess.login(username, password, nextPath);
            window.location.replace(data.redirect || nextPath);
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
            name: document.getElementById('requestName')?.value.trim(),
            email: document.getElementById('requestEmail')?.value.trim(),
            company: document.getElementById('requestCompany')?.value.trim(),
            username: document.getElementById('requestUsername')?.value.trim(),
            message: document.getElementById('requestMessage')?.value.trim(),
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
                err.message || 'Could not reach the server. Email hello@logicxo.com to request access.',
                'error',
            );
        }
    });
})();
