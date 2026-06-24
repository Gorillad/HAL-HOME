(function guardEditorPage() {
    const html = document.documentElement;

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
