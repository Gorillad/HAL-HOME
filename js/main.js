document.addEventListener('DOMContentLoaded', () => {
    if (window.Footer) Footer.load();
    initMobileNav();
    initSmoothScroll();
    initContactForm();
    initPricingToggle();
    initShowroomDesignTabs();
    initDesignerDesignTabs();
    initEasterEggLinks();
    initShowcase();
    initAboutVideo();
    initProblemReveal();
    // DEV: homepage login gate disabled — restore initSiteAccessGate() for production
    // initSiteAccessGate();
    if (window.EditorAccess) {
        EditorAccess.markAuthenticated();
    }
    if (window.Cart) Cart.initUI();
});

function initEasterEggLinks() {
    const modal = document.getElementById('easterEggVideoModal');
    const iframe = document.getElementById('easterEggVideoFrame');
    if (!modal || !iframe) return;

    const panel = modal.querySelector('.easter-egg-video-modal-panel');

    let closeTimer = null;

    function closeEasterEggVideo() {
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }
        iframe.onload = null;
        iframe.removeAttribute('src');
        panel?.classList.remove('is-pending');
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
    }

    function openEasterEggVideo(videoId, startSeconds, durationMs) {
        closeEasterEggVideo();

        const embed = new URL(`https://www.youtube.com/embed/${encodeURIComponent(videoId)}`);
        embed.searchParams.set('start', String(startSeconds));
        embed.searchParams.set('autoplay', '1');
        embed.searchParams.set('rel', '0');
        embed.searchParams.set('playsinline', '1');
        embed.searchParams.set('modestbranding', '1');
        embed.searchParams.set('controls', '0');
        embed.searchParams.set('disablekb', '1');
        embed.searchParams.set('fs', '0');
        embed.searchParams.set('iv_load_policy', '3');
        embed.searchParams.set('cc_load_policy', '0');
        if (window.location.origin && window.location.origin !== 'null') {
            embed.searchParams.set('origin', window.location.origin);
        }

        panel?.classList.add('is-pending');
        iframe.onload = () => {
            window.setTimeout(() => panel?.classList.remove('is-pending'), 300);
        };

        iframe.src = embed.toString();
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        closeTimer = window.setTimeout(closeEasterEggVideo, durationMs);
    }

    modal.querySelector('.easter-egg-video-modal-backdrop')?.addEventListener('click', closeEasterEggVideo);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hidden) {
            closeEasterEggVideo();
        }
    });

    document.querySelectorAll('.site-easter-egg-link[data-yt-video][data-yt-start]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const videoId = link.dataset.ytVideo;
            const startSeconds = Number.parseInt(link.dataset.ytStart, 10);
            const durationMs = Number.parseInt(link.dataset.ytDuration || '10000', 10);
            if (!videoId || Number.isNaN(startSeconds)) return;
            openEasterEggVideo(videoId, startSeconds, Number.isNaN(durationMs) ? 10000 : durationMs);
        });
    });
}

function initMobileNav() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.site-nav-toggle');
    const panel = document.getElementById('site-nav-panel');
    const backdrop = document.querySelector('.site-nav-backdrop');
    if (!nav || !toggle || !panel || !backdrop) return;

    const links = panel.querySelectorAll('a[href^="#"]');

    function openMenu() {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close menu');
        backdrop.hidden = false;
        document.body.classList.add('nav-open');
    }

    function closeMenu() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        backdrop.hidden = true;
        document.body.classList.remove('nav-open');
    }

    function isMenuOpen() {
        return nav.classList.contains('is-open');
    }

    toggle.addEventListener('click', () => {
        if (isMenuOpen()) closeMenu();
        else openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    links.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen()) {
            closeMenu();
            toggle.focus();
        }
    });

    window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
        if (e.matches) closeMenu();
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (!id || id === '#') return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', id);
        });
    });
}

function formatPlanSavings(monthly, annual) {
    const yearlyIfMonthly = monthly * 12;
    const yearlyIfAnnual = annual * 12;
    const savings = yearlyIfMonthly - yearlyIfAnnual;
    const percent = Math.round((savings / yearlyIfMonthly) * 100);
    return `Save $${savings.toLocaleString()}/year (${percent}% vs monthly)`;
}

function updatePricingSavings(billing) {
    document.querySelectorAll('.pricing-card').forEach((card) => {
        const priceEl = card.querySelector('.pricing-price');
        const savingsEl = card.querySelector('.pricing-savings');
        if (!priceEl || !savingsEl) return;

        const monthly = Number(priceEl.dataset.monthly);
        const annual = Number(priceEl.dataset.annual);

        if (billing === 'annual' && monthly > annual) {
            savingsEl.textContent = formatPlanSavings(monthly, annual);
            savingsEl.hidden = false;
        } else {
            savingsEl.hidden = true;
            savingsEl.textContent = '';
        }
    });
}

function initPricingToggle() {
    const buttons = document.querySelectorAll('.billing-toggle-btn');
    const prices = document.querySelectorAll('.pricing-price');
    const notes = document.querySelectorAll('.pricing-note[data-annual-note]');
    let billing = 'monthly';

    function applyBilling(period) {
        billing = period;

        prices.forEach((el) => {
            const val = el.getAttribute(`data-${billing}`);
            el.textContent = `$${Number(val).toLocaleString()}`;
        });

        notes.forEach((el) => {
            if (billing === 'annual') {
                el.textContent = el.getAttribute('data-annual-note');
            } else {
                el.textContent = el.dataset.monthlyDefault || 'No contract — cancel anytime';
            }
        });

        updatePricingSavings(billing);

        document.querySelectorAll('[data-add-plan]').forEach((btn) => {
            btn.dataset.billing = billing;
        });
    }

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            buttons.forEach((b) => {
                const active = b === btn;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });

            applyBilling(btn.getAttribute('data-billing'));
        });
    });

    notes.forEach((el) => {
        el.dataset.monthlyDefault = el.textContent;
    });

    document.querySelectorAll('[data-add-plan]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-add-plan');
            const period = btn.dataset.billing || billing;
            const productId = `plan-${plan}-${period === 'annual' ? 'annual' : 'monthly'}`;
            Cart.add(productId);
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const msg = document.getElementById('contactFormMsg');
    if (!form || !nameInput || !emailInput || !msg) return;

    const interestSelect = document.getElementById('contactInterest');
    const params = new URLSearchParams(window.location.search);
    const interest = params.get('interest');
    if (interestSelect && interest) {
        const option = interestSelect.querySelector(`option[value="${CSS.escape(interest)}"]`);
        if (option) interestSelect.value = interest;
    } else if (interestSelect && /request-a-quote/i.test(window.location.pathname)) {
        interestSelect.value = 'quote';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (!name) {
            showContactMsg(msg, 'Please enter your name.', 'error');
            nameInput.focus();
            return;
        }

        if (!emailPattern.test(email)) {
            showContactMsg(msg, 'Please enter a valid work email.', 'error');
            emailInput.focus();
            return;
        }

        showContactMsg(msg, 'Thanks! Our team will reach out within one business day.', 'success');
        form.reset();
    });
}

function showContactMsg(el, text, type) {
    el.hidden = false;
    el.textContent = text;
    el.classList.toggle('is-success', type === 'success');
    el.classList.toggle('is-error', type === 'error');
}

function initShowroomDesignTabs() {
    const card = document.querySelector('.template-card--showroom');
    if (!card) return;

    const tablist = card.querySelector('.showroom-design-tabs');
    if (!tablist) return;

    const tabs = [...tablist.querySelectorAll('.showroom-design-tab')];
    const views = [...card.querySelectorAll('.showroom-design-view')];
    const viewsContainer = card.querySelector('.showroom-design-views');
    const editorBtn = document.getElementById('showroomEditorBtn');
    const designNote = document.getElementById('showroomDesignNote');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const designLabels = {
        classic: 'McQueen',
        gallery: 'Classic',
        spotlight: 'Spotlight',
    };

    function applyDesign(design) {
        const label = designLabels[design] || 'McQueen';

        tabs.forEach((item) => {
            const isActive = item.dataset.showroomDesign === design;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        views.forEach((view) => {
            const isActive = view.dataset.showroomDesign === design;
            view.classList.toggle('is-active', isActive);
            view.hidden = !isActive;
        });

        if (editorBtn && design) {
            editorBtn.href = `editor/showroom.html?design=${encodeURIComponent(design)}`;
            editorBtn.textContent = `Open ${label} editor`;
            editorBtn.setAttribute('aria-label', `Open ${label} template in Showroom editor`);
        }

        if (designNote) {
            designNote.textContent = `${label} selected — open the editor to customize this layout.`;
        }
    }

    function setActiveDesign(design) {
        const activeView = views.find((view) => view.dataset.showroomDesign === design);
        if (!activeView || (activeView.classList.contains('is-active') && !activeView.hidden)) return;

        if (prefersReducedMotion || !viewsContainer) {
            applyDesign(design);
            return;
        }

        viewsContainer.classList.add('is-switching');
        window.setTimeout(() => {
            applyDesign(design);
            requestAnimationFrame(() => {
                viewsContainer.classList.remove('is-switching');
            });
        }, 140);
    }

    tablist.addEventListener('click', (e) => {
        const tab = e.target.closest('.showroom-design-tab');
        if (!tab || !tablist.contains(tab)) return;

        const design = tab.dataset.showroomDesign;
        if (!design) return;

        setActiveDesign(design);
    });

    const activeTab = tabs.find((tab) => tab.classList.contains('is-active'));
    if (activeTab?.dataset.showroomDesign) {
        applyDesign(activeTab.dataset.showroomDesign);
    }
}

function initDesignerDesignTabs() {
    const card = document.querySelector('.template-card--featured');
    if (!card) return;

    const tablist = card.querySelector('.designer-design-tabs');
    if (!tablist) return;

    const tabs = [...tablist.querySelectorAll('.showroom-design-tab')];
    const views = [...card.querySelectorAll('.designer-design-view')];
    const viewsContainer = card.querySelector('.designer-design-views');
    const editorBtn = document.getElementById('designerEditorBtn');
    const designNote = document.getElementById('designerDesignNote');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const designLabels = {
        gallery: 'Gallery',
        curator: 'Curator',
        canvas: 'Canvas',
    };

    function applyDesign(design) {
        const label = designLabels[design] || 'Gallery';

        tabs.forEach((item) => {
            const isActive = item.dataset.designerDesign === design;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        views.forEach((view) => {
            const isActive = view.dataset.designerDesign === design;
            view.classList.toggle('is-active', isActive);
            view.hidden = !isActive;
        });

        if (editorBtn && design) {
            editorBtn.href = `editor/designer.html?design=${encodeURIComponent(design)}`;
            editorBtn.textContent = `Open ${label} editor`;
            editorBtn.setAttribute('aria-label', `Open ${label} template in Designer editor`);
        }

        if (designNote) {
            designNote.textContent = `${label} selected — open the editor to customize this layout.`;
        }
    }

    function setActiveDesign(design) {
        const activeView = views.find((view) => view.dataset.designerDesign === design);
        if (!activeView || (activeView.classList.contains('is-active') && !activeView.hidden)) return;

        if (prefersReducedMotion || !viewsContainer) {
            applyDesign(design);
            return;
        }

        viewsContainer.classList.add('is-switching');
        window.setTimeout(() => {
            applyDesign(design);
            requestAnimationFrame(() => {
                viewsContainer.classList.remove('is-switching');
            });
        }, 140);
    }

    tablist.addEventListener('click', (e) => {
        const tab = e.target.closest('.showroom-design-tab');
        if (!tab || !tablist.contains(tab)) return;

        const design = tab.dataset.designerDesign;
        if (!design) return;

        setActiveDesign(design);
    });

    const activeTab = tabs.find((tab) => tab.classList.contains('is-active'));
    if (activeTab?.dataset.designerDesign) {
        applyDesign(activeTab.dataset.designerDesign);
    }
}

function initProblemReveal() {
    const section = document.getElementById('the-problem');
    const pains = document.getElementById('problemPains');
    if (!section || !pains) return;

    const cards = [...pains.querySelectorAll('.home-problem-pain-card')];
    if (cards.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cards.forEach((card) => card.classList.add('is-visible'));
        return;
    }

    cards.forEach((card) => {
        card.style.opacity = '0';
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                cards.forEach((card) => {
                    card.style.opacity = '';
                    card.classList.add('is-visible');
                });
                observer.disconnect();
            });
        },
        { threshold: 0.25, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(section);
}

function initAboutVideo() {
    const section = document.getElementById('who-we-are');
    const video = document.querySelector('.home-story-about-video');
    const overlay = document.getElementById('aboutVideoOverlay');
    const frame = video?.closest('.home-story-about-video-frame');
    if (!section || !video) return;

    function showOverlay() {
        if (!overlay || overlay.classList.contains('is-visible')) return;
        overlay.hidden = false;
        frame?.classList.add('is-replayable');
        requestAnimationFrame(() => overlay.classList.add('is-visible'));
    }

    function hideOverlay() {
        if (!overlay) return;
        overlay.classList.remove('is-visible');
        overlay.hidden = true;
        frame?.classList.remove('is-replayable');
    }

    function replayVideo() {
        hideOverlay();
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise?.catch) {
            playPromise.catch(() => {});
        }
    }

    video.addEventListener('ended', showOverlay);

    frame?.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        if (!video.ended) return;
        replayVideo();
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.pause();
        return;
    }

    video.muted = true;
    let hasPlayed = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || hasPlayed) return;

                hasPlayed = true;
                observer.disconnect();

                const playPromise = video.play();
                if (playPromise?.catch) {
                    playPromise.catch(() => {});
                }
            });
        },
        { threshold: 0.35 }
    );

    observer.observe(section);
}

function initHeroRays() {
    const hero = document.querySelector('.hero');
    const beams = document.querySelector('.hero-rays-beams');
    const source = document.querySelector('.hero-rays-source');
    if (!hero || !beams || !source) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        beams.style.transform = `rotate(${(x - 0.2) * 7}deg) translateX(${(x - 0.2) * 36}px) scale(1.02)`;
        source.style.transform = `translate(${x * 22}px, ${y * 10}px) scale(1.04)`;
    });

    hero.addEventListener('mouseleave', () => {
        beams.style.transform = '';
        source.style.transform = '';
    });
}
