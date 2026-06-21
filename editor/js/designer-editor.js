(function () {
    const TEMPLATE_DESIGNS = {
        gallery: 'Gallery',
        curator: 'Curator',
        canvas: 'Canvas',
        woolf: 'The Woolf',
    };

    const DEFAULT_DESIGN = 'gallery';

    function getTemplateDesign() {
        const param = new URLSearchParams(window.location.search).get('design');
        return Object.prototype.hasOwnProperty.call(TEMPLATE_DESIGNS, param) ? param : DEFAULT_DESIGN;
    }

    function normalizeDesignInUrl(design) {
        const url = new URL(window.location.href);
        const current = url.searchParams.get('design');
        if (current === design) return;
        url.searchParams.set('design', design);
        window.history.replaceState(null, '', url);
    }

    const templateDesign = getTemplateDesign();
    normalizeDesignInUrl(templateDesign);

    function applyTemplateDesignUI() {
        const label = TEMPLATE_DESIGNS[templateDesign];
        const nameEl = document.getElementById('editorTemplateName');
        if (nameEl) nameEl.textContent = label;

        document.title = `Designer Homepage Editor — ${label} — LogicXO`;
        document.body.classList.add('editor-page--designer');
        document.body.classList.add(`editor-page--${templateDesign}`);
        document.body.dataset.templateDesign = templateDesign;

        document.querySelectorAll('.designer-template-nav-link').forEach((link) => {
            const isActive = link.dataset.designerDesign === templateDesign;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        const previewLabel = document.getElementById('designerPreviewTemplateLabel');
        if (previewLabel) previewLabel.textContent = label;

        const scaffoldName = document.getElementById('designerScaffoldTemplateName');
        if (scaffoldName) scaffoldName.textContent = label;
    }

    applyTemplateDesignUI();
})();
