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
    const DEFAULT_FOOTER_MAP_REFERENCE = `${IMAGE_DIR}footer/map.png`;

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
    const DEFAULT_CATEGORY_HEADING = 'Light Up Your World By Category';
    const DEFAULT_BRANDS_HEADING = 'Our Brands';
    const DEFAULT_ABOUT_HEADING = 'About Us';
    const DEFAULT_ABOUT_COPY = [
        'We are a team of passionate individuals who believe that the right lighting can transform any space, be it a home, office, or public space. Our company was founded with the aim of providing our customers with high-quality lighting solutions that not only meet their needs but also exceed their expectations.',
        'At our company, we pride ourselves on our extensive range of lighting products. Whether you are looking for a stylish pendant light for your living room, a functional desk lamp for your home office, or industrial lighting for your commercial space, we have you covered. Our products are carefully selected from the best manufacturers, ensuring that you get the best quality and value for your money.',
    ].join('\n\n');
    const LEGACY_ABOUT_COPY = 'Visit our showroom to experience lighting in person. Our team helps you find fixtures that fit your space, style, and budget.';
    const DEFAULT_NEWSLETTER_HEADING = 'Sign up for our newsletters';
    const DEFAULT_NEWSLETTER_COPY = 'Are you looking to bring a new level of brightness and beauty to your home or office? Sign up for our lighting showroom newsletter today and be the first to receive exclusive updates on the latest lighting trends, new product launches, and special promotions. With our expert advice and curated selection of high-quality lighting fixtures, you can create the perfect ambiance and enhance any space. Don\'t miss out on this opportunity to elevate your lighting game - join our community today!';
    const LEGACY_NEWSLETTER_COPY = 'Product updates, vendor tips, and seasonal promos — straight to your inbox.';
    const DEFAULT_NEWSLETTER_BUTTON = 'Submit';
    const LEGACY_NEWSLETTER_BUTTON = 'Subscribe';
    const DEFAULT_NEWSLETTER_CTA_HEADING = 'Want To See More?';
    const DEFAULT_NEWSLETTER_CTA_COPY = 'Visit our catalog today and explore our extensive selection of lighting options. Don\'t wait any longer to transform your space with beautiful and functional lighting.';
    const DEFAULT_NEWSLETTER_CTA_SHOP_LABEL = 'Shop With Us Today';
    const DEFAULT_NEWSLETTER_CTA_SHOP_URL = '/catalog';
    const DEFAULT_NEWSLETTER_CTA_CONTACT_LABEL = 'Contact our store';
    const DEFAULT_NEWSLETTER_CTA_CONTACT_URL = '/contact-us';
    const DEFAULT_FOOTER_PHONE = '123-456-7890';
    const DEFAULT_FOOTER_EMAIL = 'sells@exologic.com';
    const DEFAULT_FOOTER_HOURS_WEEKDAY = 'Monday through Friday 9:00 AM to 5:00';
    const DEFAULT_FOOTER_HOURS_SATURDAY = 'Closed on Saturday';
    const DEFAULT_FOOTER_HOURS_SUNDAY = 'Closed on Sunday';
    const LEGACY_FOOTER_EMAIL = 'hello@company.com';
    const LEGACY_FOOTER_PHONE = '(800) 555-1234';
    const LEGACY_FOOTER_PHONE_SPOTLIGHT = '12345 67809';

    const SPOTLIGHT_FOOTER_QUICK_LINKS = [
        { id: 'about-us', label: 'About Us', stateKey: 'spotlightFooterQuickAboutUrl', defaultUrl: '/about-us' },
        { id: 'contact-us', label: 'Contact Us', stateKey: 'spotlightFooterQuickContactUrl', defaultUrl: '/contact-us' },
        { id: 'call-us', label: 'Call Us', stateKey: 'spotlightFooterQuickCallUrl', defaultUrl: 'tel:1234567890' },
        { id: 'shop-now', label: 'Shop Now', stateKey: 'spotlightFooterQuickShopUrl', defaultUrl: '/catalog' },
        { id: 'brands', label: 'Brands', stateKey: 'spotlightFooterQuickBrandsUrl', defaultUrl: '/brands' },
    ];

    const SPOTLIGHT_FOOTER_POLICY_LINKS = [
        { id: 'terms', label: 'Terms and Conditions', stateKey: 'spotlightFooterPolicyTermsUrl', defaultUrl: '/terms-and-conditions' },
        { id: 'privacy', label: 'Privacy', stateKey: 'spotlightFooterPolicyPrivacyUrl', defaultUrl: '/privacy' },
        { id: 'returns', label: 'Returns', stateKey: 'spotlightFooterPolicyReturnsUrl', defaultUrl: '/returns' },
    ];

    const SPOTLIGHT_FOOTER_PROFILE_LINKS = [
        { id: 'login', label: 'Login', stateKey: 'spotlightFooterProfileLoginUrl', defaultUrl: '/login' },
        { id: 'cart', label: 'Cart', stateKey: 'spotlightFooterProfileCartUrl', defaultUrl: '/cart' },
    ];

    const DEFAULT_FOOTER_COMPANY_NAME = 'XOLogic Software';
    const FOOTER_ADA_POPUP = 'ada-compliance::ADA Compliance::600px';

    const SPOTLIGHT_FOOTER_SOCIAL_LINKS = [
        {
            id: 'facebook',
            label: 'Facebook',
            urlKey: 'spotlightFooterFacebookUrl',
            visibleKey: 'spotlightFooterFacebookVisible',
            iconClass: 'fa-brands fa-facebook-f',
        },
        {
            id: 'instagram',
            label: 'Instagram',
            urlKey: 'spotlightFooterInstagramUrl',
            visibleKey: 'spotlightFooterInstagramVisible',
            iconClass: 'fa-brands fa-instagram',
        },
        {
            id: 'x',
            label: 'X',
            urlKey: 'spotlightFooterXUrl',
            visibleKey: 'spotlightFooterXVisible',
            iconClass: 'fa-brands fa-x-twitter',
        },
        {
            id: 'linkedin',
            label: 'LinkedIn',
            urlKey: 'spotlightFooterLinkedinUrl',
            visibleKey: 'spotlightFooterLinkedinVisible',
            iconClass: 'fa-brands fa-linkedin-in',
        },
        {
            id: 'youtube',
            label: 'YouTube',
            urlKey: 'spotlightFooterYoutubeUrl',
            visibleKey: 'spotlightFooterYoutubeVisible',
            iconClass: 'fa-brands fa-youtube',
        },
    ];

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
            spotlightNewsletterCtaHeading: DEFAULT_NEWSLETTER_CTA_HEADING,
            spotlightNewsletterCtaCopy: DEFAULT_NEWSLETTER_CTA_COPY,
            spotlightNewsletterCtaShopLabel: DEFAULT_NEWSLETTER_CTA_SHOP_LABEL,
            spotlightNewsletterCtaShopUrl: DEFAULT_NEWSLETTER_CTA_SHOP_URL,
            spotlightNewsletterCtaContactLabel: DEFAULT_NEWSLETTER_CTA_CONTACT_LABEL,
            spotlightNewsletterCtaContactUrl: DEFAULT_NEWSLETTER_CTA_CONTACT_URL,
            spotlightFooterLogoImage: DEFAULT_FOOTER_LOGO,
            spotlightFooterQuickAboutUrl: SPOTLIGHT_FOOTER_QUICK_LINKS[0].defaultUrl,
            spotlightFooterQuickContactUrl: SPOTLIGHT_FOOTER_QUICK_LINKS[1].defaultUrl,
            spotlightFooterQuickCallUrl: SPOTLIGHT_FOOTER_QUICK_LINKS[2].defaultUrl,
            spotlightFooterQuickShopUrl: SPOTLIGHT_FOOTER_QUICK_LINKS[3].defaultUrl,
            spotlightFooterQuickBrandsUrl: SPOTLIGHT_FOOTER_QUICK_LINKS[4].defaultUrl,
            spotlightFooterPolicyTermsUrl: SPOTLIGHT_FOOTER_POLICY_LINKS[0].defaultUrl,
            spotlightFooterPolicyPrivacyUrl: SPOTLIGHT_FOOTER_POLICY_LINKS[1].defaultUrl,
            spotlightFooterPolicyReturnsUrl: SPOTLIGHT_FOOTER_POLICY_LINKS[2].defaultUrl,
            spotlightFooterProfileLoginUrl: SPOTLIGHT_FOOTER_PROFILE_LINKS[0].defaultUrl,
            spotlightFooterProfileCartUrl: SPOTLIGHT_FOOTER_PROFILE_LINKS[1].defaultUrl,
            spotlightFooterHoursWeekday: DEFAULT_FOOTER_HOURS_WEEKDAY,
            spotlightFooterHoursSaturday: DEFAULT_FOOTER_HOURS_SATURDAY,
            spotlightFooterHoursSunday: DEFAULT_FOOTER_HOURS_SUNDAY,
            spotlightFooterPhone: DEFAULT_FOOTER_PHONE,
            spotlightFooterEmail: DEFAULT_FOOTER_EMAIL,
            spotlightFooterCompanyName: DEFAULT_FOOTER_COMPANY_NAME,
            spotlightFooterCopyrightName: '',
            spotlightFooterFacebookUrl: '',
            spotlightFooterFacebookVisible: true,
            spotlightFooterInstagramUrl: '',
            spotlightFooterInstagramVisible: true,
            spotlightFooterXUrl: '',
            spotlightFooterXVisible: true,
            spotlightFooterLinkedinUrl: '',
            spotlightFooterLinkedinVisible: true,
            spotlightFooterYoutubeUrl: '',
            spotlightFooterYoutubeVisible: true,
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
        const savedCategoryHeading = data.spotlightCategoryHeading || '';
        state.spotlightCategoryHeading = savedCategoryHeading === 'Shop By Category'
            ? defaults.spotlightCategoryHeading
            : (savedCategoryHeading || defaults.spotlightCategoryHeading);
        state.spotlightCategoryTiles = migrateTiles(data.spotlightCategoryTiles, CATEGORY_DEFAULTS);
        state.spotlightBrandsHeading = data.spotlightBrandsHeading || defaults.spotlightBrandsHeading;
        state.spotlightBrandsImage = resolveImage(data.spotlightBrandsImage, defaults.spotlightBrandsImage);
        const savedNewsletterHeading = data.spotlightNewsletterHeading || '';
        state.spotlightNewsletterHeading = savedNewsletterHeading === 'Stay in the Loop'
            ? defaults.spotlightNewsletterHeading
            : (savedNewsletterHeading || defaults.spotlightNewsletterHeading);
        const savedNewsletterCopy = data.spotlightNewsletterCopy || '';
        state.spotlightNewsletterCopy = (!savedNewsletterCopy || savedNewsletterCopy === LEGACY_NEWSLETTER_COPY)
            ? defaults.spotlightNewsletterCopy
            : savedNewsletterCopy;
        const savedNewsletterButton = data.spotlightNewsletterButtonLabel || '';
        state.spotlightNewsletterButtonLabel = savedNewsletterButton === LEGACY_NEWSLETTER_BUTTON
            ? defaults.spotlightNewsletterButtonLabel
            : (savedNewsletterButton || defaults.spotlightNewsletterButtonLabel);
        state.spotlightNewsletterCtaHeading = data.spotlightNewsletterCtaHeading || defaults.spotlightNewsletterCtaHeading;
        state.spotlightNewsletterCtaCopy = data.spotlightNewsletterCtaCopy || defaults.spotlightNewsletterCtaCopy;
        state.spotlightNewsletterCtaShopLabel = data.spotlightNewsletterCtaShopLabel || defaults.spotlightNewsletterCtaShopLabel;
        state.spotlightNewsletterCtaShopUrl = data.spotlightNewsletterCtaShopUrl || defaults.spotlightNewsletterCtaShopUrl;
        state.spotlightNewsletterCtaContactLabel = data.spotlightNewsletterCtaContactLabel || defaults.spotlightNewsletterCtaContactLabel;
        state.spotlightNewsletterCtaContactUrl = data.spotlightNewsletterCtaContactUrl || defaults.spotlightNewsletterCtaContactUrl;
        state.spotlightFooterLogoImage = resolveImage(data.spotlightFooterLogoImage, defaults.spotlightFooterLogoImage);
        SPOTLIGHT_FOOTER_QUICK_LINKS.forEach((link) => {
            state[link.stateKey] = data[link.stateKey] || defaults[link.stateKey];
        });
        SPOTLIGHT_FOOTER_POLICY_LINKS.forEach((link) => {
            state[link.stateKey] = data[link.stateKey] || defaults[link.stateKey];
        });
        SPOTLIGHT_FOOTER_PROFILE_LINKS.forEach((link) => {
            state[link.stateKey] = data[link.stateKey] || defaults[link.stateKey];
        });
        state.spotlightFooterHoursWeekday = data.spotlightFooterHoursWeekday || defaults.spotlightFooterHoursWeekday;
        state.spotlightFooterHoursSaturday = data.spotlightFooterHoursSaturday || defaults.spotlightFooterHoursSaturday;
        state.spotlightFooterHoursSunday = data.spotlightFooterHoursSunday || defaults.spotlightFooterHoursSunday;
        const savedFooterPhone = data.spotlightFooterPhone || '';
        state.spotlightFooterPhone = (savedFooterPhone === LEGACY_FOOTER_PHONE || savedFooterPhone === LEGACY_FOOTER_PHONE_SPOTLIGHT)
            ? defaults.spotlightFooterPhone
            : (savedFooterPhone || defaults.spotlightFooterPhone);
        const savedFooterEmail = data.spotlightFooterEmail || '';
        state.spotlightFooterEmail = savedFooterEmail === LEGACY_FOOTER_EMAIL
            ? defaults.spotlightFooterEmail
            : (savedFooterEmail || defaults.spotlightFooterEmail);
        state.spotlightFooterCompanyName = data.spotlightFooterCompanyName || defaults.spotlightFooterCompanyName;
        state.spotlightFooterCopyrightName = data.spotlightFooterCopyrightName ?? defaults.spotlightFooterCopyrightName;
        SPOTLIGHT_FOOTER_SOCIAL_LINKS.forEach((social) => {
            state[social.urlKey] = data[social.urlKey] || '';
            state[social.visibleKey] = data[social.visibleKey] !== false;
        });

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
            previewSpotlightNewsletterCtaHeading: document.getElementById('previewSpotlightNewsletterCtaHeading'),
            previewSpotlightNewsletterCtaCopy: document.getElementById('previewSpotlightNewsletterCtaCopy'),
            previewSpotlightNewsletterCtaShop: document.getElementById('previewSpotlightNewsletterCtaShop'),
            previewSpotlightNewsletterCtaContact: document.getElementById('previewSpotlightNewsletterCtaContact'),
            previewSpotlightFooterLogo: document.getElementById('previewSpotlightFooterLogo'),
            previewSpotlightFooterLogoWrap: document.getElementById('previewSpotlightFooterLogoWrap'),
            previewSpotlightFooterMap: document.getElementById('previewSpotlightFooterMap'),
            previewSpotlightFooterMapWrap: document.getElementById('previewSpotlightFooterMapWrap'),
            previewSpotlightFooterQuickLinks: document.getElementById('previewSpotlightFooterQuickLinks'),
            previewSpotlightFooterPolicyLinks: document.getElementById('previewSpotlightFooterPolicyLinks'),
            previewSpotlightFooterProfileLinks: document.getElementById('previewSpotlightFooterProfileLinks'),
            previewSpotlightFooterHoursWeekday: document.getElementById('previewSpotlightFooterHoursWeekday'),
            previewSpotlightFooterHoursSaturday: document.getElementById('previewSpotlightFooterHoursSaturday'),
            previewSpotlightFooterHoursSunday: document.getElementById('previewSpotlightFooterHoursSunday'),
            previewSpotlightFooterPhone: document.getElementById('previewSpotlightFooterPhone'),
            previewSpotlightFooterEmail: document.getElementById('previewSpotlightFooterEmail'),
            previewSpotlightFooterCopyright: document.getElementById('previewSpotlightFooterCopyright'),
            previewSpotlightFooterSocial: document.getElementById('previewSpotlightFooterSocial'),
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
            fieldSpotlightNewsletterCtaHeading: document.getElementById('fieldSpotlightNewsletterCtaHeading'),
            fieldSpotlightNewsletterCtaCopy: document.getElementById('fieldSpotlightNewsletterCtaCopy'),
            fieldSpotlightNewsletterCtaShopLabel: document.getElementById('fieldSpotlightNewsletterCtaShopLabel'),
            fieldSpotlightNewsletterCtaShopUrl: document.getElementById('fieldSpotlightNewsletterCtaShopUrl'),
            fieldSpotlightNewsletterCtaContactLabel: document.getElementById('fieldSpotlightNewsletterCtaContactLabel'),
            fieldSpotlightNewsletterCtaContactUrl: document.getElementById('fieldSpotlightNewsletterCtaContactUrl'),
            fieldSpotlightFooterLogo: document.getElementById('fieldSpotlightFooterLogo'),
            fieldSpotlightFooterQuickAboutUrl: document.getElementById('fieldSpotlightFooterQuickAboutUrl'),
            fieldSpotlightFooterQuickContactUrl: document.getElementById('fieldSpotlightFooterQuickContactUrl'),
            fieldSpotlightFooterQuickCallUrl: document.getElementById('fieldSpotlightFooterQuickCallUrl'),
            fieldSpotlightFooterQuickShopUrl: document.getElementById('fieldSpotlightFooterQuickShopUrl'),
            fieldSpotlightFooterQuickBrandsUrl: document.getElementById('fieldSpotlightFooterQuickBrandsUrl'),
            fieldSpotlightFooterPolicyTermsUrl: document.getElementById('fieldSpotlightFooterPolicyTermsUrl'),
            fieldSpotlightFooterPolicyPrivacyUrl: document.getElementById('fieldSpotlightFooterPolicyPrivacyUrl'),
            fieldSpotlightFooterPolicyReturnsUrl: document.getElementById('fieldSpotlightFooterPolicyReturnsUrl'),
            fieldSpotlightFooterProfileLoginUrl: document.getElementById('fieldSpotlightFooterProfileLoginUrl'),
            fieldSpotlightFooterProfileCartUrl: document.getElementById('fieldSpotlightFooterProfileCartUrl'),
            fieldSpotlightFooterHoursWeekday: document.getElementById('fieldSpotlightFooterHoursWeekday'),
            fieldSpotlightFooterHoursSaturday: document.getElementById('fieldSpotlightFooterHoursSaturday'),
            fieldSpotlightFooterHoursSunday: document.getElementById('fieldSpotlightFooterHoursSunday'),
            fieldSpotlightFooterPhone: document.getElementById('fieldSpotlightFooterPhone'),
            fieldSpotlightFooterEmail: document.getElementById('fieldSpotlightFooterEmail'),
            fieldSpotlightFooterCompanyName: document.getElementById('fieldSpotlightFooterCompanyName'),
            fieldSpotlightFooterCopyrightName: document.getElementById('fieldSpotlightFooterCopyrightName'),
            fieldSpotlightFooterFacebookUrl: document.getElementById('fieldSpotlightFooterFacebookUrl'),
            fieldSpotlightFooterFacebookVisible: document.getElementById('fieldSpotlightFooterFacebookVisible'),
            fieldSpotlightFooterInstagramUrl: document.getElementById('fieldSpotlightFooterInstagramUrl'),
            fieldSpotlightFooterInstagramVisible: document.getElementById('fieldSpotlightFooterInstagramVisible'),
            fieldSpotlightFooterXUrl: document.getElementById('fieldSpotlightFooterXUrl'),
            fieldSpotlightFooterXVisible: document.getElementById('fieldSpotlightFooterXVisible'),
            fieldSpotlightFooterLinkedinUrl: document.getElementById('fieldSpotlightFooterLinkedinUrl'),
            fieldSpotlightFooterLinkedinVisible: document.getElementById('fieldSpotlightFooterLinkedinVisible'),
            fieldSpotlightFooterYoutubeUrl: document.getElementById('fieldSpotlightFooterYoutubeUrl'),
            fieldSpotlightFooterYoutubeVisible: document.getElementById('fieldSpotlightFooterYoutubeVisible'),
            fieldSpotlightBannerAddress: document.getElementById('fieldSpotlightBannerAddress'),
            fieldSpotlightBannerPhone: document.getElementById('fieldSpotlightBannerPhone'),
            editorSpotlightBannerFields: document.getElementById('editorSpotlightBannerFields'),
            fieldSpotlightAboutImage: document.getElementById('fieldSpotlightAboutImage'),
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

    function renderFooterLinks(listEl, links, state) {
        if (!listEl) return;
        const { escapeHtml } = ctx;
        listEl.innerHTML = links.map((link) => {
            const href = escapeHtml(state[link.stateKey] || link.defaultUrl || '#');
            const label = escapeHtml(link.label);
            return `<li><a href="${href}">${label}</a></li>`;
        }).join('');
    }

    function getSpotlightFooterCopyrightCompanyName(state) {
        return state.spotlightFooterCopyrightName
            || state.spotlightFooterCompanyName
            || DEFAULT_FOOTER_COMPANY_NAME;
    }

    function buildSpotlightCopyrightText(state) {
        const { escapeHtml } = ctx;
        const name = escapeHtml(getSpotlightFooterCopyrightCompanyName(state));
        const year = new Date().getFullYear();
        return (
            `<div id="rightCol"> &copy; ${year} ${name} | All Rights Reserved `
            + `<a href="#" ajax-popup="${FOOTER_ADA_POPUP}">ADA Compliant</a></div>`
        );
    }

    function renderFooterSocial(state) {
        if (!refs.previewSpotlightFooterSocial) return;
        const { escapeHtml } = ctx;
        refs.previewSpotlightFooterSocial.innerHTML = SPOTLIGHT_FOOTER_SOCIAL_LINKS
            .filter((social) => state[social.visibleKey] !== false)
            .map((social) => {
                const rawUrl = String(state[social.urlKey] || '').trim();
                const url = escapeHtml(rawUrl || '#');
                return (
                    `<a href="${url}" class="showroom-spotlight-footer-social-link" aria-label="${escapeHtml(social.label)}" target="_blank" rel="noopener noreferrer"><i class="${social.iconClass}" aria-hidden="true"></i></a>`
                );
            })
            .join('');
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
        set(refs.fieldSpotlightNewsletterCtaHeading, state.spotlightNewsletterCtaHeading);
        set(refs.fieldSpotlightNewsletterCtaCopy, state.spotlightNewsletterCtaCopy);
        set(refs.fieldSpotlightNewsletterCtaShopLabel, state.spotlightNewsletterCtaShopLabel);
        set(refs.fieldSpotlightNewsletterCtaShopUrl, state.spotlightNewsletterCtaShopUrl);
        set(refs.fieldSpotlightNewsletterCtaContactLabel, state.spotlightNewsletterCtaContactLabel);
        set(refs.fieldSpotlightNewsletterCtaContactUrl, state.spotlightNewsletterCtaContactUrl);
        set(refs.fieldSpotlightFooterQuickAboutUrl, state.spotlightFooterQuickAboutUrl);
        set(refs.fieldSpotlightFooterQuickContactUrl, state.spotlightFooterQuickContactUrl);
        set(refs.fieldSpotlightFooterQuickCallUrl, state.spotlightFooterQuickCallUrl);
        set(refs.fieldSpotlightFooterQuickShopUrl, state.spotlightFooterQuickShopUrl);
        set(refs.fieldSpotlightFooterQuickBrandsUrl, state.spotlightFooterQuickBrandsUrl);
        set(refs.fieldSpotlightFooterPolicyTermsUrl, state.spotlightFooterPolicyTermsUrl);
        set(refs.fieldSpotlightFooterPolicyPrivacyUrl, state.spotlightFooterPolicyPrivacyUrl);
        set(refs.fieldSpotlightFooterPolicyReturnsUrl, state.spotlightFooterPolicyReturnsUrl);
        set(refs.fieldSpotlightFooterProfileLoginUrl, state.spotlightFooterProfileLoginUrl);
        set(refs.fieldSpotlightFooterProfileCartUrl, state.spotlightFooterProfileCartUrl);
        set(refs.fieldSpotlightFooterHoursWeekday, state.spotlightFooterHoursWeekday);
        set(refs.fieldSpotlightFooterHoursSaturday, state.spotlightFooterHoursSaturday);
        set(refs.fieldSpotlightFooterHoursSunday, state.spotlightFooterHoursSunday);
        set(refs.fieldSpotlightFooterPhone, state.spotlightFooterPhone);
        set(refs.fieldSpotlightFooterEmail, state.spotlightFooterEmail);
        set(refs.fieldSpotlightFooterCompanyName, state.spotlightFooterCompanyName);
        set(refs.fieldSpotlightFooterCopyrightName, state.spotlightFooterCopyrightName);
        set(refs.fieldSpotlightFooterFacebookUrl, state.spotlightFooterFacebookUrl);
        set(refs.fieldSpotlightFooterInstagramUrl, state.spotlightFooterInstagramUrl);
        set(refs.fieldSpotlightFooterXUrl, state.spotlightFooterXUrl);
        set(refs.fieldSpotlightFooterLinkedinUrl, state.spotlightFooterLinkedinUrl);
        set(refs.fieldSpotlightFooterYoutubeUrl, state.spotlightFooterYoutubeUrl);
        if (refs.fieldSpotlightFooterFacebookVisible) refs.fieldSpotlightFooterFacebookVisible.checked = state.spotlightFooterFacebookVisible !== false;
        if (refs.fieldSpotlightFooterInstagramVisible) refs.fieldSpotlightFooterInstagramVisible.checked = state.spotlightFooterInstagramVisible !== false;
        if (refs.fieldSpotlightFooterXVisible) refs.fieldSpotlightFooterXVisible.checked = state.spotlightFooterXVisible !== false;
        if (refs.fieldSpotlightFooterLinkedinVisible) refs.fieldSpotlightFooterLinkedinVisible.checked = state.spotlightFooterLinkedinVisible !== false;
        if (refs.fieldSpotlightFooterYoutubeVisible) refs.fieldSpotlightFooterYoutubeVisible.checked = state.spotlightFooterYoutubeVisible !== false;
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
        state.spotlightNewsletterCtaHeading = val(refs.fieldSpotlightNewsletterCtaHeading) || DEFAULT_NEWSLETTER_CTA_HEADING;
        state.spotlightNewsletterCtaCopy = val(refs.fieldSpotlightNewsletterCtaCopy) || DEFAULT_NEWSLETTER_CTA_COPY;
        state.spotlightNewsletterCtaShopLabel = val(refs.fieldSpotlightNewsletterCtaShopLabel) || DEFAULT_NEWSLETTER_CTA_SHOP_LABEL;
        state.spotlightNewsletterCtaShopUrl = val(refs.fieldSpotlightNewsletterCtaShopUrl) || DEFAULT_NEWSLETTER_CTA_SHOP_URL;
        state.spotlightNewsletterCtaContactLabel = val(refs.fieldSpotlightNewsletterCtaContactLabel) || DEFAULT_NEWSLETTER_CTA_CONTACT_LABEL;
        state.spotlightNewsletterCtaContactUrl = val(refs.fieldSpotlightNewsletterCtaContactUrl) || DEFAULT_NEWSLETTER_CTA_CONTACT_URL;
        state.spotlightFooterQuickAboutUrl = val(refs.fieldSpotlightFooterQuickAboutUrl) || SPOTLIGHT_FOOTER_QUICK_LINKS[0].defaultUrl;
        state.spotlightFooterQuickContactUrl = val(refs.fieldSpotlightFooterQuickContactUrl) || SPOTLIGHT_FOOTER_QUICK_LINKS[1].defaultUrl;
        state.spotlightFooterQuickCallUrl = val(refs.fieldSpotlightFooterQuickCallUrl) || SPOTLIGHT_FOOTER_QUICK_LINKS[2].defaultUrl;
        state.spotlightFooterQuickShopUrl = val(refs.fieldSpotlightFooterQuickShopUrl) || SPOTLIGHT_FOOTER_QUICK_LINKS[3].defaultUrl;
        state.spotlightFooterQuickBrandsUrl = val(refs.fieldSpotlightFooterQuickBrandsUrl) || SPOTLIGHT_FOOTER_QUICK_LINKS[4].defaultUrl;
        state.spotlightFooterPolicyTermsUrl = val(refs.fieldSpotlightFooterPolicyTermsUrl) || SPOTLIGHT_FOOTER_POLICY_LINKS[0].defaultUrl;
        state.spotlightFooterPolicyPrivacyUrl = val(refs.fieldSpotlightFooterPolicyPrivacyUrl) || SPOTLIGHT_FOOTER_POLICY_LINKS[1].defaultUrl;
        state.spotlightFooterPolicyReturnsUrl = val(refs.fieldSpotlightFooterPolicyReturnsUrl) || SPOTLIGHT_FOOTER_POLICY_LINKS[2].defaultUrl;
        state.spotlightFooterProfileLoginUrl = val(refs.fieldSpotlightFooterProfileLoginUrl) || SPOTLIGHT_FOOTER_PROFILE_LINKS[0].defaultUrl;
        state.spotlightFooterProfileCartUrl = val(refs.fieldSpotlightFooterProfileCartUrl) || SPOTLIGHT_FOOTER_PROFILE_LINKS[1].defaultUrl;
        state.spotlightFooterHoursWeekday = val(refs.fieldSpotlightFooterHoursWeekday) || DEFAULT_FOOTER_HOURS_WEEKDAY;
        state.spotlightFooterHoursSaturday = val(refs.fieldSpotlightFooterHoursSaturday) || DEFAULT_FOOTER_HOURS_SATURDAY;
        state.spotlightFooterHoursSunday = val(refs.fieldSpotlightFooterHoursSunday) || DEFAULT_FOOTER_HOURS_SUNDAY;
        state.spotlightFooterPhone = val(refs.fieldSpotlightFooterPhone) || DEFAULT_FOOTER_PHONE;
        state.spotlightFooterEmail = val(refs.fieldSpotlightFooterEmail) || DEFAULT_FOOTER_EMAIL;
        state.spotlightFooterCompanyName = val(refs.fieldSpotlightFooterCompanyName) || DEFAULT_FOOTER_COMPANY_NAME;
        state.spotlightFooterCopyrightName = val(refs.fieldSpotlightFooterCopyrightName);
        state.spotlightFooterFacebookUrl = val(refs.fieldSpotlightFooterFacebookUrl);
        state.spotlightFooterInstagramUrl = val(refs.fieldSpotlightFooterInstagramUrl);
        state.spotlightFooterXUrl = val(refs.fieldSpotlightFooterXUrl);
        state.spotlightFooterLinkedinUrl = val(refs.fieldSpotlightFooterLinkedinUrl);
        state.spotlightFooterYoutubeUrl = val(refs.fieldSpotlightFooterYoutubeUrl);
        if (refs.fieldSpotlightFooterFacebookVisible) state.spotlightFooterFacebookVisible = refs.fieldSpotlightFooterFacebookVisible.checked;
        if (refs.fieldSpotlightFooterInstagramVisible) state.spotlightFooterInstagramVisible = refs.fieldSpotlightFooterInstagramVisible.checked;
        if (refs.fieldSpotlightFooterXVisible) state.spotlightFooterXVisible = refs.fieldSpotlightFooterXVisible.checked;
        if (refs.fieldSpotlightFooterLinkedinVisible) state.spotlightFooterLinkedinVisible = refs.fieldSpotlightFooterLinkedinVisible.checked;
        if (refs.fieldSpotlightFooterYoutubeVisible) state.spotlightFooterYoutubeVisible = refs.fieldSpotlightFooterYoutubeVisible.checked;
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
        if (refs.previewSpotlightNewsletterCtaHeading) {
            refs.previewSpotlightNewsletterCtaHeading.textContent = state.spotlightNewsletterCtaHeading || DEFAULT_NEWSLETTER_CTA_HEADING;
        }
        if (refs.previewSpotlightNewsletterCtaCopy) {
            refs.previewSpotlightNewsletterCtaCopy.textContent = state.spotlightNewsletterCtaCopy || DEFAULT_NEWSLETTER_CTA_COPY;
        }
        if (refs.previewSpotlightNewsletterCtaShop) {
            refs.previewSpotlightNewsletterCtaShop.textContent = state.spotlightNewsletterCtaShopLabel || DEFAULT_NEWSLETTER_CTA_SHOP_LABEL;
            refs.previewSpotlightNewsletterCtaShop.href = state.spotlightNewsletterCtaShopUrl || DEFAULT_NEWSLETTER_CTA_SHOP_URL;
        }
        if (refs.previewSpotlightNewsletterCtaContact) {
            refs.previewSpotlightNewsletterCtaContact.textContent = state.spotlightNewsletterCtaContactLabel || DEFAULT_NEWSLETTER_CTA_CONTACT_LABEL;
            refs.previewSpotlightNewsletterCtaContact.href = state.spotlightNewsletterCtaContactUrl || DEFAULT_NEWSLETTER_CTA_CONTACT_URL;
        }

        applyImage(refs.previewSpotlightFooterLogo, refs.previewSpotlightFooterLogoWrap, state.spotlightFooterLogoImage);
        applyImage(refs.previewSpotlightFooterMap, refs.previewSpotlightFooterMapWrap, DEFAULT_FOOTER_MAP_REFERENCE);
        renderFooterLinks(refs.previewSpotlightFooterQuickLinks, SPOTLIGHT_FOOTER_QUICK_LINKS, state);
        renderFooterLinks(refs.previewSpotlightFooterPolicyLinks, SPOTLIGHT_FOOTER_POLICY_LINKS, state);
        renderFooterLinks(refs.previewSpotlightFooterProfileLinks, SPOTLIGHT_FOOTER_PROFILE_LINKS, state);
        if (refs.previewSpotlightFooterHoursWeekday) {
            refs.previewSpotlightFooterHoursWeekday.textContent = state.spotlightFooterHoursWeekday || DEFAULT_FOOTER_HOURS_WEEKDAY;
        }
        if (refs.previewSpotlightFooterHoursSaturday) {
            refs.previewSpotlightFooterHoursSaturday.textContent = state.spotlightFooterHoursSaturday || DEFAULT_FOOTER_HOURS_SATURDAY;
        }
        if (refs.previewSpotlightFooterHoursSunday) {
            refs.previewSpotlightFooterHoursSunday.textContent = state.spotlightFooterHoursSunday || DEFAULT_FOOTER_HOURS_SUNDAY;
        }
        if (refs.previewSpotlightFooterPhone) {
            const phone = state.spotlightFooterPhone || DEFAULT_FOOTER_PHONE;
            refs.previewSpotlightFooterPhone.textContent = `Phone Number: ${phone}`;
            refs.previewSpotlightFooterPhone.href = `tel:${String(phone).replace(/\D/g, '')}`;
        }
        if (refs.previewSpotlightFooterEmail) {
            refs.previewSpotlightFooterEmail.textContent = state.spotlightFooterEmail || DEFAULT_FOOTER_EMAIL;
            refs.previewSpotlightFooterEmail.href = `mailto:${state.spotlightFooterEmail || DEFAULT_FOOTER_EMAIL}`;
        }
        if (refs.previewSpotlightFooterCopyright) {
            refs.previewSpotlightFooterCopyright.innerHTML = buildSpotlightCopyrightText(state);
        }
        renderFooterSocial(state);

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

        document.querySelectorAll('[data-spotlight-social-toggle]').forEach((input) => {
            input.addEventListener('change', () => {
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

    function isSpotlightClientImage(src, defaultPath) {
        const trimmed = String(src || '').trim();
        if (!trimmed) return false;
        if (trimmed.startsWith('data:')) return true;
        return trimmed !== String(defaultPath || '').trim();
    }

    function buildHandoffSpec() {
        const state = ctx.getState();
        const copyrightName = getSpotlightFooterCopyrightCompanyName(state);
        const year = new Date().getFullYear();
        const { normalizeHex, normalizeHexColor } = ctx;
        const bannerLinks = (state.headerBannerLinks || []).map((link) => ({
            label: link.label,
            url: link.url,
        }));
        const mainNavItems = (state.mainNavItems || []).map((item) => ({
            id: item.id,
            label: item.label,
            url: item.url || '',
            subcategories: (item.subcategories || []).map((sub) => ({
                id: sub.id,
                label: sub.label,
                url: sub.url,
                visible: sub.visible !== false,
            })),
        }));

        return {
            template: 'Showroom — Spotlight',
            design: 'spotlight',
            contentColumnWidth: '1479 px',
            header: {
                layout: 'spotlight',
                logoFilename: 'header-logo.png',
                logoDimensions: 'max 220 × 68 px',
                contentColumnWidth: '1479 px',
                topBar: {
                    backgroundColor: normalizeHex(state.headerBannerBackgroundColor || DEFAULT_HEADER_BANNER_BG),
                    textColor: normalizeHexColor(state.headerBannerTextColor, DEFAULT_HEADER_BANNER_TEXT),
                    address: state.spotlightBannerAddress || DEFAULT_BANNER_ADDRESS,
                    phone: state.spotlightBannerPhone || DEFAULT_BANNER_PHONE,
                    links: bannerLinks,
                },
                toolbar: {
                    searchBarHardcoded: true,
                    searchPlaceholder: 'what can we find for you?',
                    iconsHardcoded: true,
                },
                mainNav: {
                    editable: true,
                    hasDropdowns: true,
                    items: mainNavItems,
                },
            },
            hero: {
                layout: 'carousel',
                slideCount: (state.spotlightHeroSlides || []).length,
                slides: (state.spotlightHeroSlides || []).map((slide, index) => ({
                    index: index + 1,
                    imageFilename: `spotlight-hero-slide-${index + 1}.jpg`,
                })),
            },
            onSale: {
                heading: state.spotlightOnSaleHeading || DEFAULT_ON_SALE_HEADING,
                imageFilename: 'spotlight-on-sale.png',
            },
            shopByRoom: {
                heading: state.spotlightShopByRoomHeading || DEFAULT_SHOP_BY_ROOM_HEADING,
                tiles: (state.spotlightShopByRoomTiles || []).map((tile, index) => ({
                    index: index + 1,
                    label: tile.label,
                    url: tile.url,
                    imageFilename: `spotlight-shop-by-room-${index + 1}.jpg`,
                })),
            },
            aboutUs: {
                heading: state.spotlightAboutHeading || DEFAULT_ABOUT_HEADING,
                copy: state.spotlightAboutCopy || DEFAULT_ABOUT_COPY,
                imageFilename: 'spotlight-about.jpg',
            },
            categories: {
                heading: state.spotlightCategoryHeading || DEFAULT_CATEGORY_HEADING,
                tiles: (state.spotlightCategoryTiles || []).map((tile, index) => ({
                    index: index + 1,
                    label: tile.label,
                    url: tile.url,
                    imageFilename: `spotlight-category-${index + 1}.jpg`,
                })),
            },
            brands: {
                heading: state.spotlightBrandsHeading || DEFAULT_BRANDS_HEADING,
                imageFilename: 'spotlight-brands.png',
            },
            newsletter: {
                heading: state.spotlightNewsletterHeading || DEFAULT_NEWSLETTER_HEADING,
                copy: state.spotlightNewsletterCopy || DEFAULT_NEWSLETTER_COPY,
                buttonLabel: state.spotlightNewsletterButtonLabel || DEFAULT_NEWSLETTER_BUTTON,
                ctaHeading: state.spotlightNewsletterCtaHeading || DEFAULT_NEWSLETTER_CTA_HEADING,
                ctaCopy: state.spotlightNewsletterCtaCopy || DEFAULT_NEWSLETTER_CTA_COPY,
                ctaShopLabel: state.spotlightNewsletterCtaShopLabel || DEFAULT_NEWSLETTER_CTA_SHOP_LABEL,
                ctaShopUrl: state.spotlightNewsletterCtaShopUrl || DEFAULT_NEWSLETTER_CTA_SHOP_URL,
                ctaContactLabel: state.spotlightNewsletterCtaContactLabel || DEFAULT_NEWSLETTER_CTA_CONTACT_LABEL,
                ctaContactUrl: state.spotlightNewsletterCtaContactUrl || DEFAULT_NEWSLETTER_CTA_CONTACT_URL,
            },
            footer: {
                layout: 'five-column',
                backgroundColor: '#254155',
                copyrightBarBackgroundColor: '#1a3347',
                logoFilename: 'spotlight-footer-logo.png',
                mapNote: 'Live Google Maps embed added from business address at handoff',
                quickLinks: SPOTLIGHT_FOOTER_QUICK_LINKS.map((link) => ({
                    label: link.label,
                    url: state[link.stateKey] || link.defaultUrl,
                })),
                policies: SPOTLIGHT_FOOTER_POLICY_LINKS.map((link) => ({
                    label: link.label,
                    url: state[link.stateKey] || link.defaultUrl,
                })),
                profileLinks: SPOTLIGHT_FOOTER_PROFILE_LINKS.map((link) => ({
                    label: link.label,
                    url: state[link.stateKey] || link.defaultUrl,
                })),
                companyInfo: {
                    hoursWeekday: state.spotlightFooterHoursWeekday || DEFAULT_FOOTER_HOURS_WEEKDAY,
                    hoursSaturday: state.spotlightFooterHoursSaturday || DEFAULT_FOOTER_HOURS_SATURDAY,
                    hoursSunday: state.spotlightFooterHoursSunday || DEFAULT_FOOTER_HOURS_SUNDAY,
                    phone: state.spotlightFooterPhone || DEFAULT_FOOTER_PHONE,
                    email: state.spotlightFooterEmail || DEFAULT_FOOTER_EMAIL,
                },
                companyName: state.spotlightFooterCompanyName || DEFAULT_FOOTER_COMPANY_NAME,
                copyrightName,
                copyrightSpec: `© ${year} ${copyrightName} | All Rights Reserved · ADA Compliant (${FOOTER_ADA_POPUP})`,
                copyrightMarkup: buildSpotlightCopyrightText(state),
                copyrightPasteMarkup: (
                    `<div id="rightCol"> &copy; ${year} ${copyrightName} | All Rights Reserved `
                    + `<a ajax-popup="${FOOTER_ADA_POPUP}">ADA Compliant</a></div>`
                ),
                adaCompliancePopup: FOOTER_ADA_POPUP,
                social: Object.fromEntries(
                    SPOTLIGHT_FOOTER_SOCIAL_LINKS.map((social) => [
                        social.id,
                        {
                            url: state[social.urlKey] || '',
                            visible: state[social.visibleKey] !== false,
                        },
                    ]),
                ),
            },
        };
    }

    function buildHandoffAssetsList() {
        const state = ctx.getState();
        const assets = [];

        const pushIfClient = (filename, label, dimensions, src, defaultPath) => {
            if (!isSpotlightClientImage(src, defaultPath)) return;
            assets.push({ filename, label, dimensions, dataUrl: src });
        };

        pushIfClient(
            'header-logo.png',
            'Header logo',
            'max 220 × 68 px',
            state.headerLogoImage,
            DEFAULT_HEADER_LOGO,
        );

        (state.spotlightHeroSlides || []).forEach((slide, index) => {
            pushIfClient(
                `spotlight-hero-slide-${index + 1}.jpg`,
                `Hero slide ${index + 1}`,
                'Hero carousel slide',
                slide.image,
                HERO_SLIDE_DEFAULTS[index] || '',
            );
        });

        pushIfClient(
            'spotlight-on-sale.png',
            "What's On Sale image",
            'Section banner image',
            state.spotlightOnSaleImage,
            DEFAULT_ON_SALE_IMAGE,
        );

        pushIfClient(
            'spotlight-about.jpg',
            'About Us image',
            'About section photo',
            state.spotlightAboutImage,
            DEFAULT_ABOUT_IMAGE,
        );

        pushIfClient(
            'spotlight-brands.png',
            'Our Brands image',
            'Brands section image',
            state.spotlightBrandsImage,
            DEFAULT_BRANDS_IMAGE,
        );

        (state.spotlightShopByRoomTiles || []).forEach((tile, index) => {
            const defaultTile = SHOP_BY_ROOM_DEFAULTS[index];
            pushIfClient(
                `spotlight-shop-by-room-${index + 1}.jpg`,
                `Shop by Room — ${tile.label || `tile ${index + 1}`}`,
                'Room tile',
                tile.image,
                defaultTile?.defaultImage || '',
            );
        });

        (state.spotlightCategoryTiles || []).forEach((tile, index) => {
            const defaultTile = CATEGORY_DEFAULTS[index];
            pushIfClient(
                `spotlight-category-${index + 1}.jpg`,
                `Category — ${tile.label || `tile ${index + 1}`}`,
                'Category tile',
                tile.image,
                defaultTile?.defaultImage || '',
            );
        });

        pushIfClient(
            'spotlight-footer-logo.png',
            'Footer logo',
            'max 220 × 68 px',
            state.spotlightFooterLogoImage,
            DEFAULT_FOOTER_LOGO,
        );

        return assets;
    }

    async function buildHandoffAssets(resolveImageDataUrlForExport) {
        const assets = buildHandoffAssetsList();
        return Promise.all(assets.map(async (asset) => ({
            ...asset,
            dataUrl: await resolveImageDataUrlForExport(asset.dataUrl),
        })));
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
        buildHandoffSpec,
        buildHandoffAssets,
    };
})();
