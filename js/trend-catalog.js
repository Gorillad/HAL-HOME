(function initTrendCatalogPage() {
    function boot() {
        const header = document.querySelector('.trend-catalog-header');
        const menuToggle = document.querySelector('.trend-catalog-menu-toggle');
        const actions = document.getElementById('trendCatalogActions');
        const helpToggle = document.querySelector('.trend-catalog-help-toggle');
        const helpMenu = document.getElementById('expertHelpDropdown');

        if (!header) return;

        function setMobileMenu(open) {
            if (!menuToggle || !actions) return;
            header.classList.toggle('is-open', open);
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', open ? 'Close catalog menu' : 'Open catalog menu');
        }

        function setHelpMenu(open) {
            if (!helpToggle || !helpMenu) return;
            helpToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            helpMenu.hidden = !open;
        }

        menuToggle?.addEventListener('click', () => {
            setMobileMenu(!header.classList.contains('is-open'));
        });

        helpToggle?.addEventListener('click', (event) => {
            event.stopPropagation();
            setHelpMenu(helpMenu?.hidden);
        });

        document.querySelectorAll('.sb-nav a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 1023px)').matches) {
                    setMobileMenu(false);
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (helpMenu && !helpMenu.hidden && !event.target.closest('.trend-catalog-help')) {
                setHelpMenu(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            setHelpMenu(false);
            setMobileMenu(false);
        });

        window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
            if (event.matches) setMobileMenu(false);
        });

        initTrendCategoryCards();
        initInspirationGuides();
    }

    const TREND_API_URL = 'https://logicx-trend.gorillad.workers.dev';
    const TREND_CACHE_KEY = 'lxo_trend_catalog_cards';
    const TREND_CACHE_DATE_KEY = 'lxo_trend_catalog_cards_date';
    const GUIDE_FEED_URL = 'data/inspiration-guides.json';

    const CATEGORY_CONFIG = {
        chandeliers: {
            label: 'Chandeliers',
            baseUrl: 'https://www.catalog.logicxo.com/lighting-fixtures/chandeliers',
            fallbackTrend: 'Sculptural chandeliers with warm metallic finishes are defining foyers and open dining spaces.',
            fallbackFinishes: ['brass', 'black', 'bronze'],
        },
        pendants: {
            label: 'Pendants',
            baseUrl: 'https://www.catalog.logicxo.com/lighting-fixtures/pendants',
            fallbackTrend: 'Oversized pendants are bringing tailored statement lighting to kitchen islands and bars.',
            fallbackFinishes: ['black', 'nickel', 'brass'],
        },
        'bath-vanity': {
            label: 'Bath & Vanity',
            baseUrl: 'https://www.catalog.logicxo.com/lighting-fixtures/bathroom-fixtures/vanity-lights',
            fallbackTrend: 'Clean vanity bars and soft globe forms are making bath lighting feel more elevated.',
            fallbackFinishes: ['nickel', 'black', 'chrome'],
        },
        outdoor: {
            label: 'Outdoor',
            baseUrl: 'https://www.catalog.logicxo.com/lighting-fixtures/exterior',
            menuUrlMode: 'search',
            fallbackTrend: 'Dark-sky outdoor fixtures and textured black lanterns are leading exterior refreshes.',
            fallbackFinishes: ['black', 'bronze', 'brass'],
        },
    };

    const FINISH_COLORS = {
        aluminum: '#b0b4b8',
        'antique-brass': '#a07840',
        black: '#1c1c1c',
        blue: '#2a4a7a',
        brass: '#c9a96e',
        bronze: '#6b4226',
        brown: '#6b4226',
        chrome: '#c8cdd2',
        copper: '#b87333',
        gold: '#d4af37',
        gray: '#808080',
        green: '#4a6741',
        nickel: '#8a9099',
        pewter: '#8a8d8f',
        pink: '#c9a0a0',
        platinum: '#c0c0c0',
        red: '#8b2020',
        rust: '#8b4513',
        silver: '#adb5bd',
        steel: '#8a9099',
        white: '#f0ede8',
        wood: '#8b6914',
        yellow: '#c9b84c',
    };

    const FINISH_SLUGS = {
        aluminum: 'aluminum',
        'antique brass': 'antique-brass',
        'antique-brass': 'antique-brass',
        black: 'black',
        'matte black': 'black',
        'flat black': 'black',
        'gloss black': 'black',
        blue: 'blue',
        brass: 'brass',
        'aged brass': 'brass',
        'satin brass': 'brass',
        'burnished brass': 'brass',
        'warm gold': 'brass',
        bronze: 'bronze',
        'oil rubbed bronze': 'bronze',
        brown: 'brown',
        chrome: 'chrome',
        'polished chrome': 'chrome',
        copper: 'copper',
        gold: 'gold',
        gray: 'gray',
        grey: 'gray',
        green: 'green',
        nickel: 'nickel',
        'brushed nickel': 'nickel',
        'polished nickel': 'nickel',
        'satin nickel': 'nickel',
        pewter: 'pewter',
        pink: 'pink',
        platinum: 'platinum',
        red: 'red',
        rust: 'rust',
        silver: 'silver',
        steel: 'steel',
        'stainless steel': 'steel',
        white: 'white',
        wood: 'wood',
        yellow: 'yellow',
    };

    function getMSTDateString() {
        const now = new Date();
        const mst = new Date(now.getTime() - (7 * 60 * 60 * 1000));
        return mst.toISOString().slice(0, 10);
    }

    function getFinishSlug(name) {
        const key = String(name || '').toLowerCase().trim();
        return FINISH_SLUGS[key] || key.replace(/\s+/g, '-');
    }

    function getFinishColor(name) {
        return FINISH_COLORS[getFinishSlug(name)] || '#888888';
    }

    function formatFinishLabel(name) {
        return String(name || '')
            .trim()
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    function createFinishSwatch(finish, options = {}) {
        const wrap = document.createElement('span');
        wrap.className = 'trend-finish-swatch-wrap';

        const swatch = document.createElement('span');
        swatch.className = options.hero
            ? 'trend-card-swatch trend-card-swatch--hero'
            : 'trend-card-swatch';
        swatch.style.background = getFinishColor(finish);
        swatch.setAttribute('aria-hidden', 'true');

        const label = formatFinishLabel(finish);
        const tip = document.createElement('span');
        tip.className = 'trend-finish-swatch-label';
        tip.textContent = label;
        tip.setAttribute('role', 'tooltip');

        wrap.title = label;
        wrap.appendChild(swatch);
        wrap.appendChild(tip);
        return wrap;
    }

    function collectHeroFinishes(cards) {
        const finishes = [];

        cards.forEach((card) => {
            (card.finishes || []).forEach((finish) => {
                if (finishes.length >= 3) return;
                const slug = getFinishSlug(finish);
                if (!finishes.some((item) => getFinishSlug(item) === slug)) {
                    finishes.push(finish);
                }
            });
        });

        return finishes;
    }

    function renderHeroFinishSwatches(cards) {
        const container = document.querySelector('[data-hero-finish-list]');
        if (!container) return;

        const finishes = collectHeroFinishes(cards);
        if (!finishes.length) return;

        container.replaceChildren(...finishes.map((finish) => createFinishSwatch(finish, { hero: true })));
    }

    function buildFinishUrl(baseUrl, finishes) {
        const firstFinish = Array.isArray(finishes) ? finishes[0] : '';
        const slug = getFinishSlug(firstFinish);
        if (!slug) return baseUrl;
        return `${baseUrl.replace(/\?.*$/, '')}/${encodeURIComponent(slug)}?limitRange=0`;
    }

    function buildTrendSearchKeywords(card, config) {
        const stopWords = new Set([
            'and', 'are', 'for', 'the', 'with', 'into', 'that', 'this', 'from', 'more',
            'feel', 'feels', 'lighting', 'fixtures', 'fixture', 'spaces', 'refreshes',
        ]);
        const topFinish = card.finishes?.[0] || '';
        const words = [topFinish, config.label, card.trend]
            .join(' ')
            .toLowerCase()
            .replace(/&/g, ' and ')
            .replace(/[^a-z0-9\s-]/g, ' ')
            .split(/\s+/)
            .filter((word, index, source) => word.length > 2 && !stopWords.has(word) && source.indexOf(word) === index);

        return words.slice(0, 7).join(' ') || config.label;
    }

    function buildCatalogSearchUrl(keywords) {
        return `https://www.catalog.logicxo.com/catalog?itemNumVal=${encodeURIComponent(keywords)}&limitRange=0`;
    }

    function buildTrendUrl(config, card, options = {}) {
        if (!options.forceSearch && config.baseUrl) {
            return buildFinishUrl(config.baseUrl, card.finishes);
        }

        return buildCatalogSearchUrl(buildTrendSearchKeywords(card, config));
    }

    function fallbackTrendCards() {
        return Object.entries(CATEGORY_CONFIG).map(([category, config]) => ({
            category,
            label: config.label,
            trend: config.fallbackTrend,
            finishes: config.fallbackFinishes,
        }));
    }

    function normalizeTrendCards(cards) {
        const source = Array.isArray(cards) ? cards : [];
        return Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
            const match = source.find((card) => card && card.category === category) || {};
            const finishes = Array.isArray(match.finishes) && match.finishes.length
                ? match.finishes.slice(0, 3)
                : config.fallbackFinishes;

            return {
                category,
                label: match.label || config.label,
                trend: match.trend || config.fallbackTrend,
                finishes,
            };
        });
    }

    function readCachedTrendCards() {
        try {
            if (localStorage.getItem(TREND_CACHE_DATE_KEY) !== getMSTDateString()) return null;
            const cached = JSON.parse(localStorage.getItem(TREND_CACHE_KEY) || 'null');
            return cached ? normalizeTrendCards(cached) : null;
        } catch {
            return null;
        }
    }

    function writeCachedTrendCards(cards) {
        try {
            localStorage.setItem(TREND_CACHE_DATE_KEY, getMSTDateString());
            localStorage.setItem(TREND_CACHE_KEY, JSON.stringify(cards));
        } catch {
            // localStorage can be unavailable in private browsing.
        }
    }

    function parseTrendResponse(data) {
        if (Array.isArray(data?.cards)) return data.cards;

        const raw = data?.content?.[0]?.text || data?.text || '';
        if (!raw) throw new Error('Trend API response did not include card content.');

        const clean = String(raw).replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);
        return parsed.cards;
    }

    async function fetchTrendCards() {
        const response = await fetch(TREND_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-6',
                max_tokens: 520,
                messages: [{
                    role: 'user',
                    content: 'You are a lighting industry trend expert for LogicX. Respond ONLY with raw JSON, no markdown. Return exactly this shape: {"cards":[{"category":"chandeliers","label":"Chandeliers","trend":"one punchy sentence max 18 words","finishes":["finish 1","finish 2","finish 3"]},{"category":"pendants","label":"Pendants","trend":"one punchy sentence max 18 words","finishes":["finish 1","finish 2","finish 3"]},{"category":"bath-vanity","label":"Bath & Vanity","trend":"one punchy sentence max 18 words","finishes":["finish 1","finish 2","finish 3"]},{"category":"outdoor","label":"Outdoor","trend":"one punchy sentence max 18 words","finishes":["finish 1","finish 2","finish 3"]}]}. Use ONLY these finish names: brass, antique-brass, black, bronze, nickel, chrome, gold, copper, silver, white, steel, aluminum, pewter, rust, brown, gray, green, red, blue, pink, yellow, wood, platinum.',
                }],
            }),
        });

        if (!response.ok) throw new Error(`Trend API failed with ${response.status}`);
        const data = await response.json();
        return normalizeTrendCards(parseTrendResponse(data));
    }

    function renderTrendCard(card) {
        const config = CATEGORY_CONFIG[card.category];
        const el = document.querySelector(`[data-trend-category="${card.category}"]`);
        if (!config || !el) return;

        const copy = el.querySelector('[data-trend-copy]');
        const swatches = el.querySelector('[data-trend-swatches]');
        const cta = el.querySelector('[data-trend-cta]');
        const finishUrl = buildFinishUrl(config.baseUrl, card.finishes);
        const topFinish = card.finishes?.[0] || '';

        el.href = finishUrl;
        el.classList.add('is-loaded');
        if (copy) copy.textContent = card.trend;
        if (cta) cta.textContent = topFinish ? `Shop ${topFinish} ${card.label}` : `Shop ${card.label}`;

        if (swatches) {
            swatches.innerHTML = '';
            card.finishes.slice(0, 3).forEach((finish) => {
                swatches.appendChild(createFinishSwatch(finish));
            });
        }
    }

    function renderTrendCards(cards) {
        const normalizedCards = normalizeTrendCards(cards);
        normalizedCards.forEach(renderTrendCard);
        renderHeroFinishSwatches(normalizedCards);
        renderMegaMenuTrendingColumn(normalizedCards);
    }

    function findTopLevelDropdown(href) {
        const topLink = document.querySelector(`.sb-menu > li > a[href="${href}"]`);
        return topLink?.parentElement?.querySelector(':scope > .sb-mega-menu') || null;
    }

    function formatTrendLinkLabel(card, config) {
        const topFinish = card.finishes?.[0] || '';
        if (config.menuUrlMode === 'search') {
            return topFinish ? `${topFinish} Outdoor Trend` : 'Outdoor Trend';
        }
        return topFinish ? `${topFinish} ${config.label}` : config.label;
    }

    function createTrendingMenuItem(card, config) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'trend-menu-link';
        link.href = buildTrendUrl(config, card, {
            forceSearch: config.menuUrlMode === 'search',
        });

        const label = document.createElement('span');
        label.textContent = formatTrendLinkLabel(card, config);
        const summary = document.createElement('small');
        summary.textContent = card.trend;

        link.append(label, summary);
        item.appendChild(link);
        return item;
    }

    function createTrendingMenuColumn(cards) {
        const column = document.createElement('div');
        column.className = 'sb-col sb-col-trending';
        column.setAttribute('data-trend-menu-column', '');

        const list = document.createElement('ul');
        const heading = document.createElement('li');
        const headingText = document.createElement('strong');
        headingText.textContent = 'Trending';
        heading.appendChild(headingText);
        list.appendChild(heading);

        cards.forEach((card) => {
            const config = CATEGORY_CONFIG[card.category];
            if (config) list.appendChild(createTrendingMenuItem(card, config));
        });

        column.appendChild(list);
        return column;
    }

    function renderMegaMenuTrendingColumn(cards) {
        document.querySelectorAll('[data-trend-menu-column]').forEach((column) => column.remove());

        const dropdown = findTopLevelDropdown('https://www.catalog.logicxo.com/lighting-fixtures');
        if (!dropdown) return;

        dropdown.prepend(createTrendingMenuColumn(cards));
    }

    const DEFAULT_GUIDE_FEED = {
        updatedLabel: 'Updated weekly',
        eyebrow: 'Inspiration - Lighting Guides',
        title: 'Research-backed lighting advice for better decisions.',
        intro: 'Our team studies customer questions, online search behavior, showroom insights, and lighting industry trends to help shoppers choose fixtures, finishes, bulbs, and layouts with confidence.',
        featuredTitle: 'Featured Guide',
        questionTitle: "This week's most asked lighting questions",
        guides: [{
            category: 'Dining Room',
            title: 'How to Choose the Right Size Chandelier for Your Dining Room',
            question: 'What size chandelier do I need for my dining table?',
            summary: 'Room and table formulas, hanging height, and FAQ — the pro sizing guide for dining chandeliers.',
            readTime: '8 min read',
            articleUrl: 'guides/dining-room-chandelier-size.html',
            image: 'images/trend-catalog/Chandelier for dining room.png',
            url: 'guides/dining-room-chandelier-size.html',
            featured: true,
            productLinks: [{
                label: 'Shop Chandeliers',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/chandeliers',
            }],
        }, {
            id: 'chandelier-bulb-temperature',
            category: 'Bulbs',
            title: 'What Color Temperature Is Best for Chandeliers? The Complete Bulb Guide',
            question: 'What color temperature is best for chandeliers?',
            summary: '2700K warm white, dimmable LED, and CRI 90+ — plus base sizes, bulb shapes, and dimmer tips.',
            readTime: '10 min read',
            articleUrl: 'guides/chandelier-bulb-temperature.html',
            image: 'images/trend-catalog/Chandelier-2.png',
            url: 'guides/chandelier-bulb-temperature.html',
            productLinks: [{
                label: 'Search Chandelier Bulbs',
                url: 'https://www.catalog.logicxo.com/catalog?itemNumVal=chandelier%20bulbs&limitRange=0',
            }, {
                label: 'Shop Chandeliers',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/chandeliers',
            }],
        }, {
            category: 'Kitchen',
            title: 'How Many Lights Should You Have in Your Kitchen?',
            question: 'How many pendant lights do I need over an island?',
            summary: 'A simple guide to spacing pendants, layering task lighting, and avoiding dark work zones.',
            image: 'images/trend-catalog/Pendant-Light.png',
            url: 'https://www.catalog.logicxo.com/lighting-fixtures/pendants',
        }],
    };

    function setText(selector, value, root = document) {
        const el = root.querySelector(selector);
        if (el && value) el.textContent = value;
    }

    function getGuideHref(guide) {
        return guide?.articleUrl || guide?.url || '#';
    }

    function normalizeGuideFeed(feed) {
        const source = feed && Array.isArray(feed.guides) ? feed : DEFAULT_GUIDE_FEED;
        const guides = source.guides
            .filter((guide) => guide && guide.title && guide.summary)
            .map((guide, index) => ({
                id: guide.id || '',
                category: guide.category || 'Lighting Guide',
                title: guide.title,
                question: guide.question || guide.title,
                summary: guide.summary,
                image: guide.image || '',
                url: guide.url || '#',
                articleUrl: guide.articleUrl || '',
                readTime: guide.readTime || '',
                featured: Boolean(guide.featured) || index === 0,
                productLinks: Array.isArray(guide.productLinks) ? guide.productLinks : [],
            }));

        return {
            ...DEFAULT_GUIDE_FEED,
            ...source,
            guides,
        };
    }

    async function fetchGuideFeed() {
        const response = await fetch(GUIDE_FEED_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Guide feed failed with ${response.status}`);
        return response.json();
    }

    function createGuideLink(label, url, className) {
        const link = document.createElement('a');
        link.href = url || '#';
        link.className = className;
        link.textContent = label;
        return link;
    }

    function renderGuideFeature(container, guide, feed) {
        if (!container || !guide) return;
        container.innerHTML = '';
        const guideHref = getGuideHref(guide);

        if (guide.image) {
            const imageWrap = document.createElement('a');
            imageWrap.href = guideHref;
            imageWrap.className = 'trend-guide-feature-image';
            const image = document.createElement('img');
            image.src = guide.image;
            image.alt = guide.title;
            image.loading = 'lazy';
            imageWrap.appendChild(image);
            container.appendChild(imageWrap);
        }

        const body = document.createElement('div');
        body.className = 'trend-guide-feature-body';
        const label = document.createElement('span');
        label.textContent = feed.featuredTitle || 'Featured Guide';
        const category = document.createElement('em');
        category.textContent = guide.category;
        const title = document.createElement('h3');
        title.textContent = guide.title;
        if (guide.readTime) {
            const readTime = document.createElement('p');
            readTime.className = 'trend-guide-feature-readtime';
            readTime.textContent = guide.readTime;
            body.append(label, category, title, readTime);
        } else {
            body.append(label, category, title);
        }
        const summary = document.createElement('p');
        summary.textContent = guide.summary;
        const ctaLabel = guide.articleUrl ? 'Read Full Guide' : 'Read Quick Guide';
        const cta = createGuideLink(ctaLabel, guideHref, 'trend-guide-link');

        body.appendChild(summary);
        body.appendChild(cta);
        if (guide.productLinks.length) {
            const products = document.createElement('div');
            products.className = 'trend-guide-products';
            guide.productLinks.slice(0, 2).forEach((product) => {
                products.appendChild(createGuideLink(product.label, product.url, 'trend-guide-product-link'));
            });
            body.appendChild(products);
        }

        container.appendChild(body);
    }

    function renderGuideQuestions(container, guides) {
        if (!container) return;
        container.innerHTML = '';
        guides.slice(0, 4).forEach((guide) => {
            const item = document.createElement('li');
            const link = createGuideLink(guide.question, getGuideHref(guide), '');
            item.appendChild(link);
            container.appendChild(item);
        });
    }

    function createGuideCard(guide) {
        const card = document.createElement('a');
        card.className = 'trend-guide-card';
        card.href = getGuideHref(guide);

        const category = document.createElement('span');
        category.textContent = guide.category;
        const title = document.createElement('strong');
        title.textContent = guide.title;
        const summary = document.createElement('small');
        summary.textContent = guide.summary;
        const cta = document.createElement('em');
        cta.textContent = 'Read Guide';

        card.append(category, title, summary, cta);
        return card;
    }

    function renderGuideGrid(container, guides, featuredGuide) {
        if (!container) return;
        container.innerHTML = '';
        guides
            .filter((guide) => guide !== featuredGuide)
            .slice(0, 6)
            .forEach((guide) => {
                container.appendChild(createGuideCard(guide));
            });
    }

    function renderInspirationGuides(feedData) {
        const section = document.querySelector('[data-inspiration-guides]');
        if (!section) return;

        const feed = normalizeGuideFeed(feedData);
        const featuredGuide = feed.guides.find((guide) => guide.featured) || feed.guides[0];

        setText('[data-guide-eyebrow]', feed.eyebrow, section);
        setText('[data-guide-title]', feed.title, section);
        setText('[data-guide-intro]', feed.intro, section);
        setText('[data-guide-updated]', feed.updatedLabel, section);
        setText('[data-guide-question-title]', feed.questionTitle, section);
        renderGuideFeature(section.querySelector('[data-guide-feature]'), featuredGuide, feed);
        renderGuideQuestions(section.querySelector('[data-guide-questions]'), feed.guides);
        renderGuideGrid(section.querySelector('[data-guide-grid]'), feed.guides, featuredGuide);
    }

    async function initInspirationGuides() {
        if (!document.querySelector('[data-inspiration-guides]')) return;

        try {
            renderInspirationGuides(await fetchGuideFeed());
        } catch {
            renderInspirationGuides(DEFAULT_GUIDE_FEED);
        }
    }

    async function initTrendCategoryCards() {
        if (!document.querySelector('[data-trend-category]')) return;

        const cached = readCachedTrendCards();
        if (cached) {
            renderTrendCards(cached);
            return;
        }

        try {
            const cards = await fetchTrendCards();
            writeCachedTrendCards(cards);
            renderTrendCards(cards);
        } catch {
            renderTrendCards(fallbackTrendCards());
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
}());
