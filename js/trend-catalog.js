(function initTrendCatalogPage() {
    function boot() {
        if (window.Footer) Footer.load();

        const header = document.querySelector('.trend-catalog-header');
        const menuToggle = document.querySelector('.trend-catalog-menu-toggle');
        const actions = document.getElementById('trendCatalogActions');
        const helpToggle = document.querySelector('.trend-catalog-help-toggle');
        const helpMenu = document.getElementById('expertHelpDropdown');

        if (!header) return;

        const navHandledByHeaderJs = window.__lxoCatalogHeaderJs === true;

        function setMobileMenu(open) {
            if (!menuToggle || !actions) return;
            header.classList.toggle('is-open', open);
            document.body.classList.toggle('catalog-header-open', open);
            document.querySelector('.sb-nav')?.classList.toggle('is-open', open);
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', open ? 'Close catalog menu' : 'Open catalog menu');
        }

        function setHelpMenu(open) {
            if (!helpToggle || !helpMenu) return;
            helpToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            helpMenu.hidden = !open;
        }

        if (!navHandledByHeaderJs) {
            menuToggle?.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
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
        }

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

    const DEPARTMENT_TREND_CATEGORIES = {
        lighting: ['chandeliers', 'pendants', 'bath-vanity'],
        outdoor: ['outdoor'],
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

    const CATALOG_LED_BULB_BASE = 'https://www.catalog.logicxo.com/lighting-fixtures/light-bulbs/led-bulbs/100-120';

    function buildLedBulbCatalogUrl(wattageSlug) {
        const wattagePath = wattageSlug ? `/wattage-${wattageSlug}` : '';
        return `${CATALOG_LED_BULB_BASE}${wattagePath}?limitRange=0`;
    }

    const CHANDELIER_BULB_SHOP = {
        warm2700: {
            filterUrl: buildLedBulbCatalogUrl('5w'),
            filterLabel: 'Browse by filter · LED · 120V · 5W',
            keyword: 'E12 2700K dimmable LED',
            keywordLabel: 'Search · candelabra (E12) · 2700K dimmable',
        },
        crystalFilament: {
            filterUrl: buildLedBulbCatalogUrl('5w'),
            filterLabel: 'Browse by filter · LED · 120V · 5W',
            keyword: 'E12 candelabra filament clear 2700K',
            keywordLabel: 'Search · clear candelabra (E12) filament',
        },
        modern3000: {
            filterUrl: buildLedBulbCatalogUrl('5w'),
            filterLabel: 'Browse by filter · LED · 120V · 5W',
            keyword: '3000K dimmable LED chandelier',
            keywordLabel: 'Search · 3000K chandelier bulbs',
        },
        vintage2200: {
            filterUrl: buildLedBulbCatalogUrl('5w'),
            filterLabel: 'Browse by filter · LED · 120V · 5W',
            keyword: '2200K filament E12',
            keywordLabel: 'Search · vintage candelabra (E12) · 2200K',
        },
        allLed: {
            filterUrl: buildLedBulbCatalogUrl(''),
            filterLabel: 'Browse all LED bulbs · 120V',
            keyword: 'chandelier bulbs',
            keywordLabel: 'Search · chandelier bulbs',
        },
    };

    function getChandelierBulbKeywordUrl(key) {
        return buildCatalogSearchUrl(CHANDELIER_BULB_SHOP[key].keyword);
    }

    const CHANDELIER_BULB_CATALOG_URLS = {
        warm2700: CHANDELIER_BULB_SHOP.warm2700.filterUrl,
        crystalFilament: CHANDELIER_BULB_SHOP.crystalFilament.filterUrl,
        modern3000: CHANDELIER_BULB_SHOP.modern3000.filterUrl,
        vintage2200: CHANDELIER_BULB_SHOP.vintage2200.filterUrl,
        allLed: CHANDELIER_BULB_SHOP.allLed.filterUrl,
    };

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
        renderMegaMenuPromoTrends(normalizedCards);
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

    function findDepartmentTrendCard(cards, categories) {
        return categories
            .map((category) => cards.find((card) => card.category === category))
            .find(Boolean) || null;
    }

    function renderMegaMenuPromoTrends(cards) {
        document.querySelectorAll('[data-trend-promo]').forEach((promoCard) => {
            const departmentKey = promoCard.getAttribute('data-trend-promo');
            const categories = DEPARTMENT_TREND_CATEGORIES[departmentKey];
            if (!categories) return;

            const card = findDepartmentTrendCard(cards, categories);
            const config = card ? CATEGORY_CONFIG[card.category] : null;
            const link = promoCard.querySelector('.sb-promo-link');
            if (!card || !config || !link) return;

            const badge = link.querySelector('.sb-promo-badge');
            const title = link.querySelector('.sb-promo-title');
            const text = link.querySelector('.sb-promo-text');
            const tags = link.querySelector('.mega-menu-promo-tags');
            const cta = link.querySelector('.sb-promo-cta');
            const topFinish = card.finishes?.[0] || '';

            link.href = buildTrendUrl(config, card);
            link.classList.add('sb-promo-link--trend');
            link.setAttribute(
                'aria-label',
                topFinish
                    ? `Shop ${formatFinishLabel(topFinish)} ${card.label}: ${card.trend}`
                    : `Shop ${card.label}: ${card.trend}`,
            );

            if (badge) badge.textContent = 'Trending Now';
            if (title) title.textContent = formatTrendLinkLabel(card, config);
            if (text) text.textContent = card.trend;
            if (cta) {
                cta.textContent = topFinish
                    ? `Shop ${formatFinishLabel(topFinish)} ${card.label}`
                    : `Shop ${card.label}`;
            }

            if (tags) {
                tags.replaceChildren(...(card.finishes || []).slice(0, 3).map((finish) => {
                    const tag = document.createElement('span');
                    tag.textContent = formatFinishLabel(finish);
                    return tag;
                }));
            }
        });
    }

    const DEFAULT_GUIDE_FEED = {
        updatedLabel: 'Updated weekly',
        eyebrow: 'Trends & Inspiration',
        title: "What's trending in lighting — guides backed by real customer questions.",
        intro: 'Our team tracks what shoppers ask, search, and buy each week to spotlight the trends, finishes, and layouts lighting customers care about right now.',
        featuredTitle: 'Featured Guide',
        questionTitle: "This week's most asked lighting questions",
        guides: [{
            id: 'chandelier-bulb-temperature',
            category: 'Bulbs',
            title: 'What Color Temperature Is Best for Chandeliers? The Complete Bulb Guide',
            question: 'What color temperature is best for chandeliers?',
            summary: '2700K warm white, dimmable LED, and CRI 90+ — plus base sizes, bulb shapes, and dimmer tips.',
            readTime: '10 min read',
            articleUrl: 'guides/chandelier-bulb-temperature.html',
            image: 'images/trend-catalog/chandelier-bulb-temperature.png',
            url: 'guides/chandelier-bulb-temperature.html',
            featured: true,
            productLinks: [{
                label: CHANDELIER_BULB_SHOP.warm2700.filterLabel,
                url: CHANDELIER_BULB_SHOP.warm2700.filterUrl,
            }, {
                label: CHANDELIER_BULB_SHOP.warm2700.keywordLabel,
                url: getChandelierBulbKeywordUrl('warm2700'),
            }],
        }, {
            category: 'Dining Room',
            title: 'How to Choose the Right Size Chandelier for Your Dining Room',
            question: 'What size chandelier do I need for my dining table?',
            summary: 'Room and table formulas, hanging height, and FAQ — the pro sizing guide for dining chandeliers.',
            readTime: '8 min read',
            articleUrl: 'guides/dining-room-chandelier-size.html',
            image: 'images/trend-catalog/dining-room-chandelier-size.png',
            url: 'guides/dining-room-chandelier-size.html',
            productLinks: [{
                label: 'Shop Chandeliers',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/chandeliers',
            }],
        }, {
            id: 'kitchen-light-count',
            category: 'Kitchen',
            title: 'How Many Lights Should You Have in Your Kitchen? A Simple Guide to Spacing, Layering, and Zero Dark Zones',
            question: 'How many pendant lights do I need over an island?',
            summary: 'Recessed formulas, island pendant spacing, under-cabinet placement, and a dark-zone checklist for kitchens.',
            readTime: '12 min read',
            articleUrl: 'guides/kitchen-light-count.html',
            image: 'images/trend-catalog/kitchen-light-count-01.png',
            url: 'guides/kitchen-light-count.html',
            productLinks: [{
                label: 'Shop Island Pendants',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/pendants',
            }, {
                label: 'Shop Under-Cabinet Lighting',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/under-cabinet',
            }],
        }, {
            id: 'lighting-finish-guide',
            category: 'Finishes',
            title: 'How to Pick the Right Finish for Your Lighting Fixtures (And When to Match, Contrast, or Mix)',
            question: 'Should lighting finishes match hardware?',
            summary: 'When to match, contrast, or mix — warm/cool finish map, dominant + accent formula, and 2026 trends.',
            readTime: '12 min read',
            articleUrl: 'guides/lighting-finish-guide.html',
            image: 'images/trend-catalog/lighting-finish-guide.png',
            url: 'guides/lighting-finish-guide.html',
            productLinks: [{
                label: 'Explore Trending Finishes',
                url: 'https://www.catalog.logicxo.com/catalog?itemNumVal=brass%20black%20bronze%20lighting&limitRange=0',
            }, {
                label: 'Shop Brass Chandeliers',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/chandeliers/brass?limitRange=0',
            }],
        }, {
            id: 'pendant-vs-island-lighting',
            category: 'Kitchen',
            title: 'Pendant Lighting vs. Island Lighting: What\'s the Difference? (A Clear Answer)',
            question: 'Are pendant lights and island lights the same thing?',
            summary: 'Pendants are a fixture type; island lighting is a location — when to choose a pendant row vs one linear fixture.',
            readTime: '8 min read',
            articleUrl: 'guides/pendant-vs-island-lighting.html',
            image: 'images/trend-catalog/pendant-vs-island-lighting-01.png',
            url: 'guides/pendant-vs-island-lighting.html',
            productLinks: [{
                label: 'Shop Pendants',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/pendants',
            }, {
                label: 'Shop Island & Linear Lighting',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/directional-lights/directional-island-lights',
            }],
        }, {
            id: 'living-room-layered-lighting',
            category: 'Living Room',
            title: 'How to Layer Lighting in Your Living Room: Ambient, Task, and Accent Done Right',
            question: 'How do I make a living room feel warm but bright enough?',
            summary: 'Ambient, task, and accent layers — the pro recipe, worked example, and mistakes that make rooms flat or harsh.',
            readTime: '10 min read',
            articleUrl: 'guides/living-room-layered-lighting.html',
            image: 'images/trend-catalog/living-room-layered-lighting.png',
            url: 'guides/living-room-layered-lighting.html',
            productLinks: [{
                label: 'Search Living Room Lighting',
                url: 'https://www.catalog.logicxo.com/catalog?itemNumVal=living%20room%20lighting&limitRange=0',
            }, {
                label: 'Shop Chandeliers',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/chandeliers',
            }],
        }, {
            id: 'outdoor-lighting-curb-appeal',
            category: 'Outdoor',
            title: 'Outdoor Lighting Ideas for Your Home Exterior: Wall Lights, Path Lights, and the Warm Glow That Makes It All Work',
            question: 'What outdoor lights improve curb appeal?',
            summary: 'Wall light sizing, path spacing, warm Kelvin rules, and a complete starter plan for curb appeal.',
            readTime: '12 min read',
            articleUrl: 'guides/outdoor-lighting-curb-appeal.html',
            image: 'images/trend-catalog/outdoor-lighting-curb-01.png',
            url: 'guides/outdoor-lighting-curb-appeal.html',
            productLinks: [{
                label: 'Shop Outdoor Lighting',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/exterior',
            }, {
                label: 'Shop Outdoor Wall Lights',
                url: 'https://www.catalog.logicxo.com/lighting-fixtures/sconces/outdoor-wall-lights',
            }],
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

    function createGuideQuestionCard(guide) {
        const card = document.createElement('a');
        card.className = 'trend-guide-question-card';
        card.href = getGuideHref(guide);

        if (guide.image) {
            const thumb = document.createElement('div');
            thumb.className = 'trend-guide-question-thumb';
            const image = document.createElement('img');
            image.src = guide.image;
            image.alt = '';
            image.loading = 'lazy';
            thumb.appendChild(image);
            card.appendChild(thumb);
        }

        const body = document.createElement('div');
        body.className = 'trend-guide-question-body';

        const category = document.createElement('span');
        category.textContent = guide.category;

        const question = document.createElement('strong');
        question.textContent = guide.question;

        const meta = document.createElement('small');
        meta.textContent = guide.readTime ? `${guide.readTime} · Read guide` : 'Read guide';

        body.append(category, question, meta);
        card.appendChild(body);
        return card;
    }

    function renderGuideQuestions(container, guides, featuredGuide) {
        if (!container) return;
        container.innerHTML = '';
        guides
            .filter((guide) => guide !== featuredGuide)
            .slice(0, 5)
            .forEach((guide) => {
                container.appendChild(createGuideQuestionCard(guide));
            });
    }

    function createGuideCard(guide) {
        const card = document.createElement('a');
        card.className = 'trend-guide-card';
        card.href = getGuideHref(guide);

        if (guide.image) {
            const media = document.createElement('div');
            media.className = 'trend-guide-card-media';
            const image = document.createElement('img');
            image.src = guide.image;
            image.alt = guide.title;
            image.loading = 'lazy';
            media.appendChild(image);
            card.appendChild(media);
        }

        const body = document.createElement('div');
        body.className = 'trend-guide-card-body';

        const category = document.createElement('span');
        category.textContent = guide.category;
        const title = document.createElement('strong');
        title.textContent = guide.title;
        const summary = document.createElement('small');
        summary.textContent = guide.summary;
        const cta = document.createElement('em');
        cta.textContent = guide.readTime ? `${guide.readTime} · Read Guide` : 'Read Guide';

        body.append(category, title, summary, cta);
        card.appendChild(body);
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
        renderGuideQuestions(section.querySelector('[data-guide-questions]'), feed.guides, featuredGuide);
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
        const hasTrendUi = document.querySelector('[data-trend-category]')
            || document.querySelector('[data-trend-promo]')
            || document.querySelector('.sb-nav .sb-menu');
        if (!hasTrendUi) return;

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
