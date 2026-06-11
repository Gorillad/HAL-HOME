/**
 * Spotlight showroom template — editor preview, fields, and sync.
 * Loaded before showroom-editor.js; integrated when ?design=spotlight.
 */
window.SpotlightEditor = (function createSpotlightEditorModule() {
    const IMAGE_DIR = 'spotlight/';
    const DEFAULT_HEADER_LOGO = `${IMAGE_DIR}xologic-logo.png`;
    const DEFAULT_HEADER_BANNER_BG = '#254155';
    const DEFAULT_HEADER_BANNER_TEXT = '#ffffff';
    const DEFAULT_BANNER_ADDRESS = 'XOLogic Software: 123 Software Dr, American Fork, UT 88888';
    const DEFAULT_BANNER_PHONE = '(123) - 456 - 7890';
    const SPOTLIGHT_HEADER_BANNER_LINKS = [
        { label: 'On Clearance', defaultUrl: '/clearance' },
        { label: 'On Display', defaultUrl: '/on-display' },
    ];
    const DEFAULT_ON_SALE_IMAGE = `${IMAGE_DIR}whats-on-sale/om-sale.png`;
    const DEFAULT_ABOUT_IMAGE = `${IMAGE_DIR}about-us/about-us.webp`;
    const DEFAULT_BRANDS_IMAGE = `${IMAGE_DIR}our-brands/our-brands.png`;
    const DEFAULT_FOOTER_LOGO = `${IMAGE_DIR}footer/xologic-logo-white.png`;
    const DEFAULT_FOOTER_MAP = `${IMAGE_DIR}footer/map.png`;

    const HERO_SLIDE_DEFAULTS = [
        `${IMAGE_DIR}slide-show/slide1.webp`,
        `${IMAGE_DIR}slide-show/slide2.webp`,
        `${IMAGE_DIR}slide-show/slide3.webp`,
    ];

    const SHOP_BY_ROOM_DEFAULTS = [
        { id: 'bedroom', label: 'Bedroom', defaultUrl: '/catalog/bedroom', defaultImage: `${IMAGE_DIR}shop-by-room/bedroom.webp` },
        { id: 'kitchen', label: 'Kitchen', defaultUrl: '/catalog/kitchen', defaultImage: `${IMAGE_DIR}shop-by-room/kitchen.webp` },
        { id: 'bathroom', label: 'Bathroom', defaultUrl: '/catalog/bathroom', defaultImage: `${IMAGE_DIR}shop-by-room/bathroom.webp` },
        { id: 'living-room', label: 'Living Room', defaultUrl: '/catalog/living-room', defaultImage: `${IMAGE_DIR}shop-by-room/livingroom.webp` },
        { id: 'hallway', label: 'Hallway', defaultUrl: '/catalog/hallway', defaultImage: `${IMAGE_DIR}shop-by-room/hallway.webp` },
        { id: 'dining', label: 'Dining', defaultUrl: '/catalog/dining', defaultImage: `${IMAGE_DIR}shop-by-room/bedroom (1).webp` },
    ];

    const CATEGORY_DEFAULTS = [
        { id: 'pendants', label: 'Pendants', defaultUrl: '/catalog/pendants', defaultImage: `${IMAGE_DIR}World-by-category/pendants.webp` },
        { id: 'lamps', label: 'Lamps', defaultUrl: '/catalog/lamps', defaultImage: `${IMAGE_DIR}World-by-category/lamps.webp` },
        { id: 'mini-chandeliers', label: 'Mini Chandeliers', defaultUrl: '/catalog/mini-chandeliers', defaultImage: `${IMAGE_DIR}World-by-category/mini-chandeliers.webp` },
        { id: 'ceiling-fans', label: 'Ceiling Fans', defaultUrl: '/catalog/ceiling-fans', defaultImage: `${IMAGE_DIR}World-by-category/ceiling-fan.webp` },
        { id: 'outdoor', label: 'Outdoor Lighting', defaultUrl: '/catalog/outdoor', defaultImage: `${IMAGE_DIR}World-by-category/outdoor-lighting-category.webp` },
        { id: 'lamp-shades', label: 'Lamp Shades', defaultUrl: '/catalog/lamp-shades', defaultImage: `${IMAGE_DIR}World-by-category/lamp-shades.webp` },
    ];

    const DEFAULT_ON_SALE_HEADING = "What's On Sale";
    const DEFAULT_SHOP_BY_ROOM_HEADING = 'Shop By Room';
    const DEFAULT_CATEGORY_HEADING = 'Shop By Category';
    const DEFAULT_BRANDS_HEADING = 'Our Brands';
    const DEFAULT_ABOUT_HEADING = 'About Us';
    const DEFAULT_ABOUT_COPY = [
        'We are a team of passionate individuals who believe that the right lighting can transform any space, be it a home, office, or public space. Our company was founded with the aim of providing our customers with high-quality lighting solutions that not only meet their needs but also exceed their expectations.',
        'At our company, we pride ourselves on our extensive range of lighting products. Whether you are looking for a stylish pendant light for your living room, a functional desk lamp for your home office, or industrial lighting for your commercial space, we have you covered. Our products are carefully selected from the best manufacturers, ensuring that you get the best quality and value for your money.',
    ].join('\n\n');
    const LEGACY_ABOUT_COPY = 'Visit our showroom to experience lighting in person. Our team helps you find fixtures that fit your space, style, and budget.';
    const DEFAULT_NEWSLETTER_HEADING = 'Stay in the Loop';
    const DEFAULT_NEWSLETTER_COPY = 'Product updates, vendor tips, and seasonal promos — straight to your inbox.';
    const DEFAULT_NEWSLETTER_BUTTON = 'Subscribe';
    const DEFAULT_FOOTER_COMPANY = 'Your Lighting Showroom';
    const DEFAULT_FOOTER_ADDRESS = '123 Lighting Way\nSuite 400\nAnytown, USA';
    const DEFAULT_FOOTER_PHONE = '(800) 555-1234';
    const DEFAULT_FOOTER_EMAIL = 'hello@company.com';

    const HEADER_TOOLBAR_ICONS = [
        { id: 'signup', label: 'Sign Up', iconClass: 'fas fa-user-plus headerIcon', url: '#' },
        { id: 'login', label: 'Login', iconClass: 'fa fa-user headerIcon', url: '#' },
        { id: 'wishlist', label: 'Wishlist', iconClass: 'fa fa-heart headerIcon', url: '#' },
        { id: 'cart', label: 'Cart', iconClass: 'fas fa-shopping-cart headerIcon', url: '#' },
    ];

    const SPOTLIGHT_MAIN_NAV_TEMPLATE = [
        {
            id: 'shop-by-room',
            label: 'Shop by Room',
            url: '/catalog/shop-by-room',
            hasDropdown: true,
            subcategories: SHOP_BY_ROOM_DEFAULTS.map((room) => ({
                id: `shop-by-room-${room.id}`,
                label: room.label,
                url: room.defaultUrl,
            })),
        },
        {
            id: 'popular-categories',
            label: 'Popular Categories',
            url: '/catalog',
            hasDropdown: true,
            subcategories: CATEGORY_DEFAULTS.map((cat) => ({
                id: `popular-${cat.id}`,
                label: cat.label,
                url: cat.defaultUrl,
            })),
        },
        {
            id: 'chandeliers',
            label: 'Chandeliers',
            url: '/lighting-fixtures/chandeliers',
            hasDropdown: true,
            subcategories: [
                { id: 'chandeliers-all', label: 'All Chandeliers', url: '/lighting-fixtures/chandeliers' },
                { id: 'chandeliers-mini', label: 'Mini Chandeliers', url: '/catalog/mini-chandeliers' },
                { id: 'chandeliers-ring', label: 'Ring Chandeliers', url: '/lighting-fixtures/chandeliers/ring-chandeliers' },
                { id: 'chandeliers-candle', label: 'Candle Chandeliers', url: '/lighting-fixtures/candle-chandeliers' },
                { id: 'chandeliers-up', label: 'Up Chandeliers', url: '/lighting-fixtures/chandeliers/up-chandeliers' },
            ],
        },
        {
            id: 'outdoors',
            label: 'Outdoors',
            url: '/lighting-fixtures/exterior',
            hasDropdown: true,
            subcategories: [
                { id: 'outdoors-exterior', label: 'Exterior', url: '/lighting-fixtures/exterior' },
                { id: 'outdoors-wall', label: 'Wall Lights', url: '/lighting-fixtures/exterior/wall-lights' },
                { id: 'outdoors-pendants', label: 'Pendants', url: '/lighting-fixtures/exterior/exterior-pendants' },
                { id: 'outdoors-post', label: 'Post Lights', url: '/lighting-fixtures/exterior/post-mount-lights' },
                { id: 'outdoors-lanterns', label: 'Hanging Lanterns', url: '/lighting-fixtures/exterior/hanging-lanterns' },
            ],
        },
        {
            id: 'directional-lights',
            label: 'Directional Lights',
            url: '/lighting-fixtures/directional',
            hasDropdown: true,
            subcategories: [
                { id: 'directional-recessed', label: 'Recessed Lights', url: '/lighting-fixtures/recessed-lights' },
                { id: 'directional-track', label: 'Track Lighting', url: '/lighting-fixtures/track-lighting' },
                { id: 'directional-spot', label: 'Spot Lights', url: '/lighting-fixtures/spot-lights' },
                { id: 'directional-accent', label: 'Accent Lighting', url: '/lighting-fixtures/accent-lighting' },
                { id: 'directional-under-cabinet', label: 'Under Cabinet', url: '/lighting-fixtures/under-cabinet' },
            ],
        },
        {
            id: 'about-us',
            label: 'About Us',
            url: '/about-us',
            hasDropdown: false,
            subcategories: [],
        },
        {
            id: 'contact-us',
            label: 'Contact Us',
            url: '/contact-us',
            hasDropdown: false,
            subcategories: [],
        },
    ];

    const MCQUEEN_MAIN_NAV_IDS = new Set([
        'ceiling-lights',
        'wall-fixtures',
        'fans',
        'bathroom',
        'outdoor',
        'other-categories',
        'shop-by-brand',
    ]);
    const SPOTLIGHT_MAIN_NAV_REQUIRED_IDS = ['shop-by-room', 'popular-categories', 'about-us', 'contact-us'];

    let ctx = null;
    let carouselIndex = 0;
    let carouselTimer = null;
    let refs = {};

    function defaultTiles(defaults) {
        return defaults.map((tile) => ({
            id: tile.id,
            label: tile.label,
            url: tile.defaultUrl,
            image: tile.defaultImage,
        }));
    }

    function isLegacyMcQueenBannerLinks(links) {
        if (!Array.isArray(links) || !links.length) return true;
        const normalized = links.map((l) => String(l.label || '').trim().toLowerCase());
        const mcQueenLabels = ['home', 'about us', 'contact'];
        return normalized.length === 3 && mcQueenLabels.every((label) => normalized.includes(label));
    }

    function createSpotlightNavSubcategory(data = {}, index = 0, prefix = 'sns') {
        return {
            id: data.id || `${prefix}-${index + 1}`,
            label: String(data.label || '').trim() || 'Subcategory',
            url: String(data.url || '').trim() || '/',
            visible: data.visible !== false,
        };
    }

    function createSpotlightNavItem(data = {}) {
        const id = data.id || `sn-${Math.random().toString(36).slice(2, 8)}`;
        const subcategories = Array.isArray(data.subcategories)
            ? data.subcategories.map((sub, index) => createSpotlightNavSubcategory(sub, index, `${id}-sub`))
            : [];

        return {
            id,
            label: String(data.label || '').trim() || 'Category',
            url: String(data.url || '').trim(),
            hasDropdown: data.hasDropdown !== false,
            subcategories,
        };
    }

    function defaultSpotlightMainNavItems() {
        return SPOTLIGHT_MAIN_NAV_TEMPLATE.map((item) => createSpotlightNavItem(item));
    }

    function navItemHasDropdown(item) {
        if (!item || item.hasDropdown === false) return false;
        return item.id !== 'about-us' && item.id !== 'contact-us';
    }

    function isLegacyMcQueenMainNav(items) {
        if (!Array.isArray(items) || !items.length) return true;
        const ids = new Set(items.map((item) => String(item.id || '').trim()));
        if ([...MCQUEEN_MAIN_NAV_IDS].some((id) => ids.has(id))) return true;
        return !SPOTLIGHT_MAIN_NAV_REQUIRED_IDS.every((id) => ids.has(id));
    }

    function migrateSpotlightMainNavItems(data) {
        const defaults = defaultSpotlightMainNavItems();
        if (!Array.isArray(data.mainNavItems) || isLegacyMcQueenMainNav(data.mainNavItems)) {
            return defaults;
        }

        return defaults.map((defaultItem) => {
            const savedItem = data.mainNavItems.find((item) => item.id === defaultItem.id);
            if (!savedItem) return defaultItem;

            const savedSubs = Array.isArray(savedItem.subcategories) ? savedItem.subcategories : [];
            let subcategories;

            if (defaultItem.subcategories.length) {
                subcategories = defaultItem.subcategories.map((defaultSub) => {
                    const savedSub = savedSubs.find((sub) => sub.id === defaultSub.id)
                        || savedSubs.find((sub) => sub.label === defaultSub.label);
                    if (!savedSub) return defaultSub;
                    return createSpotlightNavSubcategory({
                        ...defaultSub,
                        ...savedSub,
                        id: defaultSub.id,
                    }, 0, defaultItem.id);
                });

                savedSubs.forEach((savedSub, index) => {
                    if (!subcategories.some((sub) => sub.id === savedSub.id)) {
                        subcategories.push(createSpotlightNavSubcategory(savedSub, index, defaultItem.id));
                    }
                });
            } else {
                subcategories = savedSubs.map((sub, index) => createSpotlightNavSubcategory(sub, index, defaultItem.id));
            }

            return createSpotlightNavItem({
                id: defaultItem.id,
                label: savedItem.label || defaultItem.label,
                url: savedItem.url || defaultItem.url || '',
                hasDropdown: defaultItem.hasDropdown,
                subcategories,
            });
        });
    }

    function renderSpotlightMainNavItem(item, escapeHtml) {
        const label = escapeHtml(item.label || 'Category');
        const categoryUrl = String(item.url || '').trim();

        if (!navItemHasDropdown(item)) {
            const href = escapeHtml(categoryUrl || '#');
            return (
                `<li class="showroom-main-nav-item showroom-main-nav-item--link">
                    <a href="${href}" class="showroom-main-nav-trigger showroom-main-nav-direct-link">${label}</a>
                </li>`
            );
        }

        const subs = (item.subcategories || []).filter((s) => s.visible !== false);
        const dropdown = subs.length
            ? `<ul class="showroom-main-nav-dropdown">${subs.map((sub) => (
                `<li><a href="${escapeHtml(sub.url || '#')}">${escapeHtml(sub.label || 'Link')}</a></li>`
            )).join('')}</ul>`
            : `<ul class="showroom-main-nav-dropdown showroom-main-nav-dropdown--empty" aria-hidden="true"><li><span class="showroom-main-nav-dropdown-placeholder">Subcategories coming soon</span></li></ul>`;
        const triggerLabel = categoryUrl
            ? `<a href="${escapeHtml(categoryUrl)}" class="showroom-main-nav-label-link">${label}</a>`
            : `<span class="showroom-main-nav-label">${label}</span>`;

        return (
            `<li class="showroom-main-nav-item has-dropdown">
                <div class="showroom-main-nav-trigger" aria-haspopup="true">
                    ${triggerLabel}
                    <i class="fa-solid fa-chevron-down showroom-main-nav-caret" aria-hidden="true"></i>
                </div>
                ${dropdown}
            </li>`
        );
    }

    function defaultSpotlightState() {
        return {
            spotlightBannerAddress: DEFAULT_BANNER_ADDRESS,
            spotlightBannerPhone: DEFAULT_BANNER_PHONE,
            spotlightHeroSlides: HERO_SLIDE_DEFAULTS.map((image, index) => ({
                id: `slide-${index + 1}`,
                image,
            })),
            spotlightOnSaleHeading: DEFAULT_ON_SALE_HEADING,
            spotlightOnSaleImage: DEFAULT_ON_SALE_IMAGE,
            spotlightShopByRoomHeading: DEFAULT_SHOP_BY_ROOM_HEADING,
            spotlightShopByRoomTiles: defaultTiles(SHOP_BY_ROOM_DEFAULTS),
            spotlightAboutHeading: DEFAULT_ABOUT_HEADING,
            spotlightAboutCopy: DEFAULT_ABOUT_COPY,
            spotlightAboutImage: DEFAULT_ABOUT_IMAGE,
            spotlightCategoryHeading: DEFAULT_CATEGORY_HEADING,
            spotlightCategoryTiles: defaultTiles(CATEGORY_DEFAULTS),
            spotlightBrandsHeading: DEFAULT_BRANDS_HEADING,
            spotlightBrandsImage: DEFAULT_BRANDS_IMAGE,
            spotlightNewsletterHeading: DEFAULT_NEWSLETTER_HEADING,
            spotlightNewsletterCopy: DEFAULT_NEWSLETTER_COPY,
            spotlightNewsletterButtonLabel: DEFAULT_NEWSLETTER_BUTTON,
            spotlightFooterLogoImage: DEFAULT_FOOTER_LOGO,
            spotlightFooterMapImage: DEFAULT_FOOTER_MAP,
            spotlightFooterCompanyName: DEFAULT_FOOTER_COMPANY,
            spotlightFooterAddress: DEFAULT_FOOTER_ADDRESS,
            spotlightFooterPhone: DEFAULT_FOOTER_PHONE,
            spotlightFooterEmail: DEFAULT_FOOTER_EMAIL,
        };
    }

    function isBundledImage(src) {
        if (!src || typeof src !== 'string') return false;
        return src.startsWith(IMAGE_DIR) && !src.startsWith('data:');
    }

    function resolveImage(saved, fallback) {
        if (!saved || typeof saved !== 'string') return fallback;
        if (saved.startsWith('data:')) return saved;
        if (isBundledImage(saved) || saved.startsWith('classic/') || saved.startsWith('gallery/')) {
            return fallback;
        }
        return saved;
    }

    function migrateTiles(savedTiles, defaults) {
        return defaults.map((def) => {
            const saved = Array.isArray(savedTiles)
                ? savedTiles.find((t) => t.id === def.id) || {}
                : {};
            return {
                id: def.id,
                label: String(saved.label || def.label).trim() || def.label,
                url: String(saved.url || def.defaultUrl).trim() || def.defaultUrl,
                image: resolveImage(saved.image, def.defaultImage),
            };
        });
    }

    function mergeSpotlightState(state, saved) {
        const defaults = defaultSpotlightState();
        const data = saved && typeof saved === 'object' ? saved : {};

        state.spotlightHeroSlides = HERO_SLIDE_DEFAULTS.map((fallback, index) => {
            const slideId = `slide-${index + 1}`;
            const savedSlide = Array.isArray(data.spotlightHeroSlides)
                ? data.spotlightHeroSlides.find((s) => s.id === slideId) || data.spotlightHeroSlides[index] || {}
                : {};
            return {
                id: slideId,
                image: resolveImage(savedSlide.image, fallback),
            };
        });

        state.spotlightOnSaleHeading = data.spotlightOnSaleHeading || defaults.spotlightOnSaleHeading;
        state.spotlightOnSaleImage = resolveImage(data.spotlightOnSaleImage, defaults.spotlightOnSaleImage);
        state.spotlightShopByRoomHeading = data.spotlightShopByRoomHeading || defaults.spotlightShopByRoomHeading;
        state.spotlightShopByRoomTiles = migrateTiles(data.spotlightShopByRoomTiles, SHOP_BY_ROOM_DEFAULTS);
        state.spotlightAboutHeading = data.spotlightAboutHeading || defaults.spotlightAboutHeading;
        const savedAboutCopy = data.spotlightAboutCopy || '';
        state.spotlightAboutCopy = (!savedAboutCopy || savedAboutCopy === LEGACY_ABOUT_COPY)
            ? defaults.spotlightAboutCopy
            : savedAboutCopy;
        state.spotlightAboutImage = resolveImage(data.spotlightAboutImage, defaults.spotlightAboutImage);
        state.spotlightCategoryHeading = data.spotlightCategoryHeading || defaults.spotlightCategoryHeading;
        state.spotlightCategoryTiles = migrateTiles(data.spotlightCategoryTiles, CATEGORY_DEFAULTS);
        state.spotlightBrandsHeading = data.spotlightBrandsHeading || defaults.spotlightBrandsHeading;
        state.spotlightBrandsImage = resolveImage(data.spotlightBrandsImage, defaults.spotlightBrandsImage);
        state.spotlightNewsletterHeading = data.spotlightNewsletterHeading || defaults.spotlightNewsletterHeading;
        state.spotlightNewsletterCopy = data.spotlightNewsletterCopy || defaults.spotlightNewsletterCopy;
        state.spotlightNewsletterButtonLabel = data.spotlightNewsletterButtonLabel || defaults.spotlightNewsletterButtonLabel;
        state.spotlightFooterLogoImage = resolveImage(data.spotlightFooterLogoImage, defaults.spotlightFooterLogoImage);
        state.spotlightFooterMapImage = resolveImage(data.spotlightFooterMapImage, defaults.spotlightFooterMapImage);
        state.spotlightFooterCompanyName = data.spotlightFooterCompanyName || defaults.spotlightFooterCompanyName;
        state.spotlightFooterAddress = data.spotlightFooterAddress || defaults.spotlightFooterAddress;
        state.spotlightFooterPhone = data.spotlightFooterPhone || defaults.spotlightFooterPhone;
        state.spotlightFooterEmail = data.spotlightFooterEmail || defaults.spotlightFooterEmail;

        const savedBannerBg = String(data.headerBannerBackgroundColor || '').trim().toLowerCase();
        state.headerBannerBackgroundColor = savedBannerBg && savedBannerBg !== '#000000' && savedBannerBg !== '#000'
            ? data.headerBannerBackgroundColor
            : DEFAULT_HEADER_BANNER_BG;
        state.headerBannerTextColor = data.headerBannerTextColor || DEFAULT_HEADER_BANNER_TEXT;
        state.spotlightBannerAddress = data.spotlightBannerAddress || DEFAULT_BANNER_ADDRESS;
        state.spotlightBannerPhone = data.spotlightBannerPhone || DEFAULT_BANNER_PHONE;

        if (isLegacyMcQueenBannerLinks(data.headerBannerLinks)) {
            state.headerBannerLinks = SPOTLIGHT_HEADER_BANNER_LINKS.map((link, index) => ({
                id: `hbl-spotlight-${index + 1}`,
                label: link.label,
                url: link.defaultUrl,
            }));
        }

        if (isLegacyMcQueenMainNav(data.mainNavItems)) {
            state.mainNavItems = defaultSpotlightMainNavItems();
        }

        if (!isBundledImage(state.headerLogoImage) && !String(state.headerLogoImage || '').startsWith('data:')) {
            state.headerLogoImage = DEFAULT_HEADER_LOGO;
        } else if (!state.headerLogoImage) {
            state.headerLogoImage = DEFAULT_HEADER_LOGO;
        }
    }

    function cacheRefs() {
        refs = {
            editorHeroSpotlight: document.getElementById('editorHeroSpotlight'),
            showroomSpotlightSections: document.getElementById('showroomSpotlightSections'),
            showroomHeaderSpotlight: document.getElementById('showroomHeaderSpotlight'),
            showroomHeroSpotlight: document.getElementById('showroomHeroSpotlight'),
            previewSpotlightHeaderBanner: document.getElementById('previewSpotlightHeaderBanner'),
            previewSpotlightBannerAddress: document.getElementById('previewSpotlightBannerAddress'),
            previewSpotlightHeaderBannerLinks: document.getElementById('previewSpotlightHeaderBannerLinks'),
            previewSpotlightHeaderLogo: document.getElementById('previewSpotlightHeaderLogo'),
            previewSpotlightHeaderLogoWrap: document.getElementById('previewSpotlightHeaderLogoWrap'),
            previewSpotlightHeaderIcons: document.getElementById('previewSpotlightHeaderIcons'),
            previewSpotlightMainNav: document.getElementById('previewSpotlightMainNav'),
            previewSpotlightCarousel: document.getElementById('previewSpotlightCarousel'),
            previewSpotlightCarouselPrev: document.getElementById('previewSpotlightCarouselPrev'),
            previewSpotlightCarouselNext: document.getElementById('previewSpotlightCarouselNext'),
            previewSpotlightCarouselDots: document.getElementById('previewSpotlightCarouselDots'),
            previewSpotlightOnSaleHeading: document.getElementById('previewSpotlightOnSaleHeading'),
            previewSpotlightOnSaleImage: document.getElementById('previewSpotlightOnSaleImage'),
            previewSpotlightOnSaleWrap: document.getElementById('previewSpotlightOnSaleWrap'),
            previewSpotlightShopByRoomHeading: document.getElementById('previewSpotlightShopByRoomHeading'),
            previewSpotlightShopByRoomGrid: document.getElementById('previewSpotlightShopByRoomGrid'),
            previewSpotlightAboutHeading: document.getElementById('previewSpotlightAboutHeading'),
            previewSpotlightAboutCopyHeading: document.getElementById('previewSpotlightAboutCopyHeading'),
            previewSpotlightAboutCopy: document.getElementById('previewSpotlightAboutCopy'),
            previewSpotlightAboutImage: document.getElementById('previewSpotlightAboutImage'),
            previewSpotlightAboutImageWrap: document.getElementById('previewSpotlightAboutImageWrap'),
            previewSpotlightCategoryHeading: document.getElementById('previewSpotlightCategoryHeading'),
            previewSpotlightCategoryGrid: document.getElementById('previewSpotlightCategoryGrid'),
            previewSpotlightBrandsHeading: document.getElementById('previewSpotlightBrandsHeading'),
            previewSpotlightBrandsImage: document.getElementById('previewSpotlightBrandsImage'),
            previewSpotlightBrandsWrap: document.getElementById('previewSpotlightBrandsWrap'),
            previewSpotlightNewsletterHeading: document.getElementById('previewSpotlightNewsletterHeading'),
            previewSpotlightNewsletterCopy: document.getElementById('previewSpotlightNewsletterCopy'),
            previewSpotlightNewsletterButton: document.getElementById('previewSpotlightNewsletterButton'),
            previewSpotlightFooterLogo: document.getElementById('previewSpotlightFooterLogo'),
            previewSpotlightFooterLogoWrap: document.getElementById('previewSpotlightFooterLogoWrap'),
            previewSpotlightFooterMap: document.getElementById('previewSpotlightFooterMap'),
            previewSpotlightFooterMapWrap: document.getElementById('previewSpotlightFooterMapWrap'),
            previewSpotlightFooterCompany: document.getElementById('previewSpotlightFooterCompany'),
            previewSpotlightFooterAddress: document.getElementById('previewSpotlightFooterAddress'),
            previewSpotlightFooterPhone: document.getElementById('previewSpotlightFooterPhone'),
            previewSpotlightFooterEmail: document.getElementById('previewSpotlightFooterEmail'),
            spotlightHeroSlidesEditor: document.getElementById('spotlightHeroSlidesEditor'),
            spotlightShopByRoomEditor: document.getElementById('spotlightShopByRoomEditor'),
            spotlightCategoryEditor: document.getElementById('spotlightCategoryEditor'),
            fieldSpotlightOnSaleHeading: document.getElementById('fieldSpotlightOnSaleHeading'),
            fieldSpotlightShopByRoomHeading: document.getElementById('fieldSpotlightShopByRoomHeading'),
            fieldSpotlightAboutHeading: document.getElementById('fieldSpotlightAboutHeading'),
            fieldSpotlightAboutCopy: document.getElementById('fieldSpotlightAboutCopy'),
            fieldSpotlightCategoryHeading: document.getElementById('fieldSpotlightCategoryHeading'),
            fieldSpotlightBrandsHeading: document.getElementById('fieldSpotlightBrandsHeading'),
            fieldSpotlightNewsletterHeading: document.getElementById('fieldSpotlightNewsletterHeading'),
            fieldSpotlightNewsletterCopy: document.getElementById('fieldSpotlightNewsletterCopy'),
            fieldSpotlightNewsletterButtonLabel: document.getElementById('fieldSpotlightNewsletterButtonLabel'),
            fieldSpotlightFooterCompanyName: document.getElementById('fieldSpotlightFooterCompanyName'),
            fieldSpotlightFooterAddress: document.getElementById('fieldSpotlightFooterAddress'),
            fieldSpotlightFooterPhone: document.getElementById('fieldSpotlightFooterPhone'),
            fieldSpotlightFooterEmail: document.getElementById('fieldSpotlightFooterEmail'),
            fieldSpotlightBannerAddress: document.getElementById('fieldSpotlightBannerAddress'),
            fieldSpotlightBannerPhone: document.getElementById('fieldSpotlightBannerPhone'),
            editorSpotlightBannerFields: document.getElementById('editorSpotlightBannerFields'),
            fieldSpotlightAboutImage: document.getElementById('fieldSpotlightAboutImage'),
            fieldSpotlightFooterLogo: document.getElementById('fieldSpotlightFooterLogo'),
            fieldSpotlightFooterMap: document.getElementById('fieldSpotlightFooterMap'),
            editorHeaderSpotlightHint: document.getElementById('editorHeaderSpotlightHint'),
            editorHeaderClassicHint: document.getElementById('editorHeaderClassicHint'),
        };
    }

    function applyUI() {
        const isSpotlight = true;
        const hide = (el, hidden) => { if (el) el.hidden = hidden; };

        hide(refs.editorHeroSpotlight, !isSpotlight);
        hide(refs.showroomSpotlightSections, !isSpotlight);
        hide(refs.showroomHeaderSpotlight, !isSpotlight);
        hide(refs.showroomHeroSpotlight, !isSpotlight);

        if (refs.editorHeaderSpotlightHint) refs.editorHeaderSpotlightHint.hidden = false;
        if (refs.editorHeaderClassicHint) refs.editorHeaderClassicHint.hidden = true;

        document.querySelectorAll('.editor-section-nav-link--spotlight').forEach((link) => {
            link.hidden = false;
        });
        document.querySelectorAll('.editor-section-nav-link--mcqueen, .editor-section-nav-link--gallery').forEach((link) => {
            if (link.classList.contains('editor-section-nav-link--shared')) return;
            link.hidden = true;
        });

        ctx.hideMcQueenGalleryUI();
    }

    function renderTileEditor(container, tiles, prefix) {
        if (!container) return;
        const { escapeHtml } = ctx;

        container.innerHTML = tiles.map((tile, index) => {
            const tileName = tile.label || `Tile ${index + 1}`;
            return (
                `<div class="editor-gallery-catalog-tile-group" data-tile-id="${tile.id}">
                    <p class="editor-gallery-catalog-tile-name">${escapeHtml(tileName)}</p>
                    <div class="editor-field">
                        <label for="field${prefix}Image-${tile.id}">Image</label>
                        <div class="editor-upload">
                            <div class="editor-upload-preview editor-upload-preview--gallery-catalog-tile is-empty" id="uploadPreview${prefix}-${tile.id}"></div>
                            <input type="file" id="field${prefix}Image-${tile.id}" data-spotlight-tile-group="${prefix}" data-tile-id="${tile.id}" accept="image/*">
                        </div>
                    </div>
                    <div class="editor-field editor-field--compact">
                        <label for="field${prefix}Label-${tile.id}">Label</label>
                        <input type="text" id="field${prefix}Label-${tile.id}" value="${escapeHtml(tile.label)}" data-spotlight-tile-group="${prefix}" data-tile-id="${tile.id}" data-tile-field="label" autocomplete="off">
                    </div>
                    <div class="editor-field editor-field--compact">
                        <label for="field${prefix}Url-${tile.id}">Link</label>
                        <input type="text" id="field${prefix}Url-${tile.id}" value="${escapeHtml(tile.url)}" data-spotlight-tile-group="${prefix}" data-tile-id="${tile.id}" data-tile-field="url" autocomplete="off" placeholder="/catalog/...">
                    </div>
                </div>`
            );
        }).join('');

        tiles.forEach((tile) => {
            ctx.setUploadPreviewImage(
                document.getElementById(`uploadPreview${prefix}-${tile.id}`),
                tile.image,
            );
        });
    }

    function renderHeroSlidesEditor() {
        const container = refs.spotlightHeroSlidesEditor;
        if (!container) return;
        const { escapeHtml, getState } = ctx;
        const state = getState();

        container.innerHTML = state.spotlightHeroSlides.map((slide, index) => (
            `<div class="editor-field">
                <label for="fieldSpotlightSlide-${slide.id}">Slide ${index + 1} image</label>
                <div class="editor-upload">
                    <div class="editor-upload-preview editor-upload-preview--spotlight-slide is-empty" id="uploadPreviewSpotlightSlide-${slide.id}"></div>
                    <input type="file" id="fieldSpotlightSlide-${slide.id}" data-spotlight-slide-id="${slide.id}" accept="image/*">
                </div>
            </div>`
        )).join('');

        state.spotlightHeroSlides.forEach((slide) => {
            ctx.setUploadPreviewImage(
                document.getElementById(`uploadPreviewSpotlightSlide-${slide.id}`),
                slide.image,
            );
        });
    }

    function renderEditors() {
        const state = ctx.getState();
        renderHeroSlidesEditor();
        renderTileEditor(refs.spotlightShopByRoomEditor, state.spotlightShopByRoomTiles, 'SpotlightRoom');
        renderTileEditor(refs.spotlightCategoryEditor, state.spotlightCategoryTiles, 'SpotlightCategory');
    }

    function getTileArray(groupKey) {
        const state = ctx.getState();
        if (groupKey === 'SpotlightRoom') return state.spotlightShopByRoomTiles;
        if (groupKey === 'SpotlightCategory') return state.spotlightCategoryTiles;
        return null;
    }

    function readTileFieldsFromEditor() {
        document.querySelectorAll('[data-spotlight-tile-group][data-tile-field]').forEach((input) => {
            const tiles = getTileArray(input.dataset.spotlightTileGroup);
            const tile = tiles && tiles.find((t) => t.id === input.dataset.tileId);
            if (tile) tile[input.dataset.tileField] = input.value.trim();
        });
    }

    function populateFormFields() {
        const state = ctx.getState();
        const set = (el, val) => { if (el) el.value = val || ''; };

        set(refs.fieldSpotlightOnSaleHeading, state.spotlightOnSaleHeading);
        set(refs.fieldSpotlightShopByRoomHeading, state.spotlightShopByRoomHeading);
        set(refs.fieldSpotlightAboutHeading, state.spotlightAboutHeading);
        set(refs.fieldSpotlightAboutCopy, state.spotlightAboutCopy);
        set(refs.fieldSpotlightCategoryHeading, state.spotlightCategoryHeading);
        set(refs.fieldSpotlightBrandsHeading, state.spotlightBrandsHeading);
        set(refs.fieldSpotlightNewsletterHeading, state.spotlightNewsletterHeading);
        set(refs.fieldSpotlightNewsletterCopy, state.spotlightNewsletterCopy);
        set(refs.fieldSpotlightNewsletterButtonLabel, state.spotlightNewsletterButtonLabel);
        set(refs.fieldSpotlightFooterCompanyName, state.spotlightFooterCompanyName);
        set(refs.fieldSpotlightFooterAddress, state.spotlightFooterAddress);
        set(refs.fieldSpotlightFooterPhone, state.spotlightFooterPhone);
        set(refs.fieldSpotlightFooterEmail, state.spotlightFooterEmail);
        set(refs.fieldSpotlightBannerAddress, state.spotlightBannerAddress);
        set(refs.fieldSpotlightBannerPhone, state.spotlightBannerPhone);

        ctx.setUploadPreviewImage(
            document.getElementById('uploadPreviewSpotlightAbout'),
            state.spotlightAboutImage,
        );
        ctx.setUploadPreviewImage(
            document.getElementById('uploadPreviewSpotlightFooterLogo'),
            state.spotlightFooterLogoImage,
        );
        ctx.setUploadPreviewImage(
            document.getElementById('uploadPreviewSpotlightFooterMap'),
            state.spotlightFooterMapImage,
        );
    }

    function readFormFields() {
        const state = ctx.getState();
        const val = (el) => (el ? el.value.trim() : '');

        state.spotlightOnSaleHeading = val(refs.fieldSpotlightOnSaleHeading) || DEFAULT_ON_SALE_HEADING;
        state.spotlightShopByRoomHeading = val(refs.fieldSpotlightShopByRoomHeading) || DEFAULT_SHOP_BY_ROOM_HEADING;
        state.spotlightAboutHeading = val(refs.fieldSpotlightAboutHeading) || DEFAULT_ABOUT_HEADING;
        state.spotlightAboutCopy = val(refs.fieldSpotlightAboutCopy) || DEFAULT_ABOUT_COPY;
        state.spotlightCategoryHeading = val(refs.fieldSpotlightCategoryHeading) || DEFAULT_CATEGORY_HEADING;
        state.spotlightBrandsHeading = val(refs.fieldSpotlightBrandsHeading) || DEFAULT_BRANDS_HEADING;
        state.spotlightNewsletterHeading = val(refs.fieldSpotlightNewsletterHeading) || DEFAULT_NEWSLETTER_HEADING;
        state.spotlightNewsletterCopy = val(refs.fieldSpotlightNewsletterCopy) || DEFAULT_NEWSLETTER_COPY;
        state.spotlightNewsletterButtonLabel = val(refs.fieldSpotlightNewsletterButtonLabel) || DEFAULT_NEWSLETTER_BUTTON;
        state.spotlightFooterCompanyName = val(refs.fieldSpotlightFooterCompanyName) || DEFAULT_FOOTER_COMPANY;
        state.spotlightFooterAddress = val(refs.fieldSpotlightFooterAddress) || DEFAULT_FOOTER_ADDRESS;
        state.spotlightFooterPhone = val(refs.fieldSpotlightFooterPhone) || DEFAULT_FOOTER_PHONE;
        state.spotlightFooterEmail = val(refs.fieldSpotlightFooterEmail) || DEFAULT_FOOTER_EMAIL;
        state.spotlightBannerAddress = val(refs.fieldSpotlightBannerAddress) || DEFAULT_BANNER_ADDRESS;
        state.spotlightBannerPhone = val(refs.fieldSpotlightBannerPhone) || DEFAULT_BANNER_PHONE;

        readTileFieldsFromEditor();
    }

    function renderTileGrid(gridEl, tiles, gridClass) {
        if (!gridEl) return;
        const { escapeHtml } = ctx;

        gridEl.innerHTML = tiles.map((tile) => {
            const label = escapeHtml(tile.label || '');
            const url = escapeHtml(tile.url || '#');
            const imgMarkup = tile.image
                ? `<img src="${tile.image}" alt="">`
                : '';
            return (
                `<a class="${gridClass}-tile${tile.image ? '' : ' is-empty'}" href="${url}" data-tile-id="${tile.id}">
                    ${imgMarkup}
                    <span class="${gridClass}-tile-label">${label}</span>
                </a>`
            );
        }).join('');
    }

    function syncCarousel(activeIndex) {
        const state = ctx.getState();
        const slides = state.spotlightHeroSlides || [];
        if (!refs.previewSpotlightCarousel) return;

        if (activeIndex !== undefined) {
            carouselIndex = ((activeIndex % slides.length) + slides.length) % slides.length;
        }

        refs.previewSpotlightCarousel.innerHTML = slides.map((slide, index) => (
            `<div class="showroom-spotlight-carousel-slide${index === carouselIndex ? ' is-active' : ''}" data-slide-index="${index}">
                ${slide.image ? `<img src="${slide.image}" alt="">` : ''}
            </div>`
        )).join('');

        if (refs.previewSpotlightCarouselDots) {
            refs.previewSpotlightCarouselDots.innerHTML = slides.map((_, index) => (
                `<button type="button" class="showroom-spotlight-carousel-dot${index === carouselIndex ? ' is-active' : ''}" data-slide-index="${index}" aria-label="Go to slide ${index + 1}"></button>`
            )).join('');
        }
    }

    function startCarousel() {
        clearInterval(carouselTimer);
        carouselTimer = setInterval(() => {
            const state = ctx.getState();
            const count = (state.spotlightHeroSlides || []).length;
            if (count > 1) syncCarousel(carouselIndex + 1);
        }, 5000);
    }

    function syncHeaderPreview() {
        const state = ctx.getState();
        const { escapeHtml, normalizeHex, normalizeHexColor, applyImage } = ctx;

        applyImage(refs.previewSpotlightHeaderLogo, refs.previewSpotlightHeaderLogoWrap, state.headerLogoImage);
        ctx.syncLogoUploadPreviews();

        const bannerBg = normalizeHex(state.headerBannerBackgroundColor || DEFAULT_HEADER_BANNER_BG);
        const bannerText = normalizeHexColor(state.headerBannerTextColor, DEFAULT_HEADER_BANNER_TEXT);
        if (refs.previewSpotlightHeaderBanner) {
            refs.previewSpotlightHeaderBanner.style.backgroundColor = bannerBg;
            refs.previewSpotlightHeaderBanner.style.setProperty('--header-banner-text', bannerText);
        }

        if (refs.previewSpotlightBannerAddress) {
            refs.previewSpotlightBannerAddress.textContent = state.spotlightBannerAddress || DEFAULT_BANNER_ADDRESS;
        }

        if (refs.previewSpotlightHeaderBannerLinks) {
            const links = (state.headerBannerLinks || []).filter((l) => l.label || l.url);
            const phone = state.spotlightBannerPhone || DEFAULT_BANNER_PHONE;
            const phoneDigits = String(phone).replace(/\D/g, '');
            const linksHtml = links.map((link) => (
                `<a href="${escapeHtml(link.url || '#')}">${escapeHtml(link.label || 'Link')}</a>`
            )).join('');
            const phoneHtml = `<a href="tel:${escapeHtml(phoneDigits)}" class="showroom-spotlight-banner-phone">${escapeHtml(phone)}</a>`;
            refs.previewSpotlightHeaderBannerLinks.innerHTML = linksHtml + phoneHtml;
        }

        if (refs.previewSpotlightHeaderIcons) {
            refs.previewSpotlightHeaderIcons.innerHTML = HEADER_TOOLBAR_ICONS.map((item) => (
                `<a href="${escapeHtml(item.url)}" class="showroom-spotlight-header-icon" aria-label="${escapeHtml(item.label)}" title="${escapeHtml(item.label)}">
                    <i class="${item.iconClass}" aria-hidden="true"></i>
                    <span class="showroom-spotlight-header-icon-label">${escapeHtml(item.label)}</span>
                </a>`
            )).join('');
        }

        if (refs.previewSpotlightMainNav) {
            refs.previewSpotlightMainNav.innerHTML = (
                `<ul class="showroom-main-nav-list">${(state.mainNavItems || []).map((item) => (
                    renderSpotlightMainNavItem(item, escapeHtml)
                )).join('')}</ul>`
            );
        }
    }

    function syncPreview() {
        const state = ctx.getState();
        const { applyImage, escapeHtml } = ctx;

        syncHeaderPreview();
        syncCarousel(carouselIndex);

        if (refs.previewSpotlightOnSaleHeading) {
            refs.previewSpotlightOnSaleHeading.textContent = state.spotlightOnSaleHeading || DEFAULT_ON_SALE_HEADING;
        }
        applyImage(refs.previewSpotlightOnSaleImage, refs.previewSpotlightOnSaleWrap, state.spotlightOnSaleImage);

        if (refs.previewSpotlightShopByRoomHeading) {
            refs.previewSpotlightShopByRoomHeading.textContent = state.spotlightShopByRoomHeading || DEFAULT_SHOP_BY_ROOM_HEADING;
        }
        renderTileGrid(refs.previewSpotlightShopByRoomGrid, state.spotlightShopByRoomTiles, 'showroom-spotlight-room');

        if (refs.previewSpotlightAboutHeading) refs.previewSpotlightAboutHeading.textContent = state.spotlightAboutHeading;
        if (refs.previewSpotlightAboutCopyHeading) {
            refs.previewSpotlightAboutCopyHeading.textContent = state.spotlightAboutHeading || DEFAULT_ABOUT_HEADING;
        }
        if (refs.previewSpotlightAboutCopy) {
            const copy = state.spotlightAboutCopy || DEFAULT_ABOUT_COPY;
            const paragraphs = copy.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
            refs.previewSpotlightAboutCopy.innerHTML = paragraphs.map((paragraph) => (
                `<p>${escapeHtml(paragraph)}</p>`
            )).join('');
        }
        applyImage(refs.previewSpotlightAboutImage, refs.previewSpotlightAboutImageWrap, state.spotlightAboutImage);

        if (refs.previewSpotlightCategoryHeading) {
            refs.previewSpotlightCategoryHeading.textContent = state.spotlightCategoryHeading || DEFAULT_CATEGORY_HEADING;
        }
        renderTileGrid(refs.previewSpotlightCategoryGrid, state.spotlightCategoryTiles, 'showroom-spotlight-category');

        if (refs.previewSpotlightBrandsHeading) {
            refs.previewSpotlightBrandsHeading.textContent = state.spotlightBrandsHeading || DEFAULT_BRANDS_HEADING;
        }
        applyImage(refs.previewSpotlightBrandsImage, refs.previewSpotlightBrandsWrap, state.spotlightBrandsImage);

        if (refs.previewSpotlightNewsletterHeading) refs.previewSpotlightNewsletterHeading.textContent = state.spotlightNewsletterHeading;
        if (refs.previewSpotlightNewsletterCopy) refs.previewSpotlightNewsletterCopy.textContent = state.spotlightNewsletterCopy;
        if (refs.previewSpotlightNewsletterButton) refs.previewSpotlightNewsletterButton.textContent = state.spotlightNewsletterButtonLabel;

        applyImage(refs.previewSpotlightFooterLogo, refs.previewSpotlightFooterLogoWrap, state.spotlightFooterLogoImage);
        applyImage(refs.previewSpotlightFooterMap, refs.previewSpotlightFooterMapWrap, state.spotlightFooterMapImage);
        if (refs.previewSpotlightFooterCompany) refs.previewSpotlightFooterCompany.textContent = state.spotlightFooterCompanyName;
        if (refs.previewSpotlightFooterAddress) {
            refs.previewSpotlightFooterAddress.innerHTML = escapeHtml(state.spotlightFooterAddress || '').replace(/\n/g, '<br>');
        }
        if (refs.previewSpotlightFooterPhone) {
            refs.previewSpotlightFooterPhone.textContent = state.spotlightFooterPhone;
            refs.previewSpotlightFooterPhone.href = `tel:${String(state.spotlightFooterPhone).replace(/\D/g, '')}`;
        }
        if (refs.previewSpotlightFooterEmail) {
            refs.previewSpotlightFooterEmail.textContent = state.spotlightFooterEmail;
            refs.previewSpotlightFooterEmail.href = `mailto:${state.spotlightFooterEmail}`;
        }

        ctx.scheduleFitPreviewScale();
    }

    function bindEvents() {
        document.querySelectorAll('[data-spotlight-field]').forEach((input) => {
            input.addEventListener('input', () => {
                readFormFields();
                syncPreview();
                ctx.saveState({ silent: true });
            });
        });

        document.querySelectorAll('[data-spotlight-tile-field]').forEach((input) => {
            input.addEventListener('input', () => {
                readTileFieldsFromEditor();
                syncPreview();
                ctx.saveState({ silent: true });
            });
        });

        if (refs.previewSpotlightCarouselPrev) {
            refs.previewSpotlightCarouselPrev.addEventListener('click', () => {
                syncCarousel(carouselIndex - 1);
                startCarousel();
            });
        }

        if (refs.previewSpotlightCarouselNext) {
            refs.previewSpotlightCarouselNext.addEventListener('click', () => {
                syncCarousel(carouselIndex + 1);
                startCarousel();
            });
        }

        if (refs.previewSpotlightCarouselDots) {
            refs.previewSpotlightCarouselDots.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-slide-index]');
                if (!btn) return;
                syncCarousel(parseInt(btn.dataset.slideIndex, 10));
                startCarousel();
            });
        }

        document.addEventListener('change', async (e) => {
            const slideInput = e.target.closest('[data-spotlight-slide-id]');
            if (slideInput && slideInput.files && slideInput.files[0]) {
                const state = ctx.getState();
                const slide = state.spotlightHeroSlides.find((s) => s.id === slideInput.dataset.spotlightSlideId);
                if (!slide) return;
                const dataUrl = await ctx.readFileAsDataUrl(slideInput.files[0]);
                slide.image = dataUrl;
                ctx.setUploadPreviewImage(
                    document.getElementById(`uploadPreviewSpotlightSlide-${slide.id}`),
                    dataUrl,
                );
                syncCarousel();
                ctx.saveState({ silent: true });
                slideInput.value = '';
                return;
            }

            const tileInput = e.target.closest('[data-spotlight-tile-group][data-tile-id]');
            if (tileInput && tileInput.files && tileInput.files[0]) {
                const tiles = getTileArray(tileInput.dataset.spotlightTileGroup);
                const tile = tiles && tiles.find((t) => t.id === tileInput.dataset.tileId);
                if (!tile) return;
                const prefix = tileInput.dataset.spotlightTileGroup;
                const dataUrl = await ctx.readFileAsDataUrl(tileInput.files[0]);
                tile.image = dataUrl;
                ctx.setUploadPreviewImage(
                    document.getElementById(`uploadPreview${prefix}-${tile.id}`),
                    dataUrl,
                );
                syncPreview();
                ctx.saveState({ silent: true });
                tileInput.value = '';
                return;
            }

            const aboutInput = e.target.closest('#fieldSpotlightAboutImage');
            if (aboutInput && aboutInput.files && aboutInput.files[0]) {
                const dataUrl = await ctx.readFileAsDataUrl(aboutInput.files[0]);
                ctx.getState().spotlightAboutImage = dataUrl;
                ctx.setUploadPreviewImage(document.getElementById('uploadPreviewSpotlightAbout'), dataUrl);
                syncPreview();
                ctx.saveState({ silent: true });
                aboutInput.value = '';
                return;
            }

            const footerLogoInput = e.target.closest('#fieldSpotlightFooterLogo');
            if (footerLogoInput && footerLogoInput.files && footerLogoInput.files[0]) {
                const dataUrl = await ctx.readFileAsDataUrl(footerLogoInput.files[0]);
                ctx.getState().spotlightFooterLogoImage = dataUrl;
                ctx.setUploadPreviewImage(document.getElementById('uploadPreviewSpotlightFooterLogo'), dataUrl);
                syncPreview();
                ctx.saveState({ silent: true });
                footerLogoInput.value = '';
                return;
            }

            const footerMapInput = e.target.closest('#fieldSpotlightFooterMap');
            if (footerMapInput && footerMapInput.files && footerMapInput.files[0]) {
                const dataUrl = await ctx.readFileAsDataUrl(footerMapInput.files[0]);
                ctx.getState().spotlightFooterMapImage = dataUrl;
                ctx.setUploadPreviewImage(document.getElementById('uploadPreviewSpotlightFooterMap'), dataUrl);
                syncPreview();
                ctx.saveState({ silent: true });
                footerMapInput.value = '';
            }
        });
    }

    function finishInit(options = {}) {
        cacheRefs();
        renderEditors();
        populateFormFields();
        applyUI();
        ctx.renderMainNavEditor();
        ctx.renderHeaderBannerEditor();
        ctx.renderHeaderJumpNav();
        syncPreview();
        startCarousel();
        bindEvents();

        if (options.restoredDraft) {
            ctx.setStatus('Draft restored');
        }
    }

    function integrate(context) {
        ctx = context;
        const state = ctx.getState();
        const defaults = defaultSpotlightState();
        Object.keys(defaults).forEach((key) => {
            if (state[key] === undefined) {
                state[key] = defaults[key];
            }
        });
        cacheRefs();
    }

    function migrateLoaded(saved) {
        const patch = {};
        mergeSpotlightState(patch, saved);
        const result = { ...saved, ...patch };
        if (patch.headerBannerLinks) {
            result.headerBannerLinks = patch.headerBannerLinks;
        }
        if (patch.mainNavItems) {
            result.mainNavItems = patch.mainNavItems;
        }
        return result;
    }

    function applyDataToState(data) {
        if (!data || typeof data !== 'object') return;
        mergeSpotlightState(ctx.getState(), data);
    }

    return {
        integrate,
        migrateLoaded,
        applyDataToState,
        finishInit,
        syncPreview,
        syncHeaderPreview,
        readFormFields,
        populateFormFields,
        applyUI,
        DEFAULT_HEADER_LOGO,
        DEFAULT_HEADER_BANNER_BG,
        DEFAULT_HEADER_BANNER_TEXT,
        SPOTLIGHT_HEADER_BANNER_LINKS,
        isLegacyMcQueenBannerLinks,
        defaultMainNavItems: defaultSpotlightMainNavItems,
        migrateMainNavItems: migrateSpotlightMainNavItems,
    };
})();
