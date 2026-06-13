const SHOWCASE_PROJECTS = [
    {
        id: 'modern',
        name: 'Modern Lighting Co.',
        tag: 'Contemporary showroom',
        accent: '#C9A96E',
        desktopImg: 'images/built-for-showrooms/modern_desktop_2.png',
        mobileImg: 'images/built-for-showrooms/modern_mobile.png',
    },
    {
        id: 'coastal',
        name: 'Coastal Illumination',
        tag: 'Coastal & natural',
        accent: '#8FB4C4',
        desktopImg: 'images/built-for-showrooms/coastal_desktop.png',
        mobileImg: 'images/built-for-showrooms/coastal_mobile.png',
    },
    {
        id: 'heritage',
        name: 'Heritage Fixtures',
        tag: 'Traditional & timeless',
        accent: '#B08D57',
        desktopImg: 'images/built-for-showrooms/heritage_desktop_1.png',
        mobileImg: 'images/built-for-showrooms/heritage_mobile_1.png',
    },
];

function renderShowcaseScreen(project, isPhone) {
    const imgSrc = isPhone ? project.mobileImg : project.desktopImg;

    if (imgSrc) {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `${project.name} ${isPhone ? 'mobile' : 'homepage'} view`;
        img.className = 'showcase-screen-image';
        img.loading = 'lazy';
        return img;
    }

    const cellCount = isPhone ? 4 : project.cols;
    const screen = document.createElement('div');
    screen.className = `showcase-screen${isPhone ? ' showcase-screen--phone' : ''}`;
    screen.style.setProperty('--showcase-accent', project.accent);
    screen.style.setProperty('--showcase-hero-grad', project.heroGrad);

    const nav = document.createElement('div');
    nav.className = 'showcase-screen-nav';
    nav.innerHTML = '<span class="showcase-screen-logo"></span>';

    const hero = document.createElement('div');
    hero.className = 'showcase-screen-hero';
    hero.innerHTML = '<span class="showcase-screen-hero-line showcase-screen-hero-line--wide"></span><span class="showcase-screen-hero-line showcase-screen-hero-line--accent"></span>';

    const grid = document.createElement('div');
    grid.className = 'showcase-screen-grid';
    grid.style.setProperty('--showcase-cols', String(cellCount));
    for (let i = 0; i < cellCount; i += 1) {
        const cell = document.createElement('span');
        cell.className = 'showcase-screen-cell';
        grid.appendChild(cell);
    }

    screen.append(nav, hero, grid);
    return screen;
}

function initShowcase() {
    const section = document.getElementById('showcase');
    const laptopScreen = document.getElementById('showcaseLaptopScreen');
    const phoneScreen = document.getElementById('showcasePhoneScreen');
    const tagEl = document.getElementById('showcaseTag');
    const tabs = document.getElementById('showcaseTabs');
    if (!section || !laptopScreen || !phoneScreen || !tagEl || !tabs) return;

    let active = 0;

    function setProject(index) {
        active = index;
        const project = SHOWCASE_PROJECTS[index];

        laptopScreen.replaceChildren(renderShowcaseScreen(project, false));
        phoneScreen.replaceChildren(renderShowcaseScreen(project, true));

        tagEl.textContent = project.tag;
        tagEl.style.color = project.accent;

        tabs.querySelectorAll('[role="tab"]').forEach((tab, i) => {
            const isActive = i === index;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            if (isActive) {
                tab.style.backgroundColor = project.accent;
                tab.style.borderColor = project.accent;
                tab.style.color = '#0a0a0a';
            } else {
                tab.style.backgroundColor = '';
                tab.style.borderColor = '';
                tab.style.color = '';
            }
        });
    }

    SHOWCASE_PROJECTS.forEach((project, i) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'home-showcase-tab';
        tab.setAttribute('role', 'tab');
        tab.id = `showcase-tab-${project.id}`;
        tab.setAttribute('aria-controls', 'showcaseLaptopScreen');
        tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        tab.textContent = project.name;
        tab.addEventListener('click', () => setProject(i));
        tabs.appendChild(tab);
    });

    setProject(0);
}
