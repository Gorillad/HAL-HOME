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

        window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
            if (event.matches) setMobileMenu(false);
        });

        initTrendCategoryCards();
    }

    const TREND_API_URL = 'https://logicx-trend.gorillad.workers.dev';
    const TREND_CACHE_KEY = 'lxo_trend_catalog_cards';
    const TREND_CACHE_DATE_KEY = 'lxo_trend_catalog_cards_date';

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

    function buildFinishUrl(baseUrl, finishes) {
        const firstFinish = Array.isArray(finishes) ? finishes[0] : '';
        const slug = getFinishSlug(firstFinish);
        if (!slug) return baseUrl;
        return `${baseUrl.replace(/\?.*$/, '')}/${encodeURIComponent(slug)}?limitRange=0`;
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
                const swatch = document.createElement('span');
                swatch.className = 'trend-card-swatch';
                swatch.style.background = getFinishColor(finish);
                swatch.title = finish;
                swatch.setAttribute('aria-label', finish);
                swatches.appendChild(swatch);
            });
        }
    }

    function renderTrendCards(cards) {
        normalizeTrendCards(cards).forEach(renderTrendCard);
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
