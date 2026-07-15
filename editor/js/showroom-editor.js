(function () {
    const TEMPLATE_DESIGNS = {
        classic: 'McQueen',
        gallery: 'Classic',
        spotlight: 'Spotlight',
    };

    function getTemplateDesign() {
        const param = new URLSearchParams(window.location.search).get('design');
        return Object.prototype.hasOwnProperty.call(TEMPLATE_DESIGNS, param) ? param : 'classic';
    }

    const templateDesign = getTemplateDesign();
    const STORAGE_KEY = `logicxo-editor-showroom-${templateDesign}`;
    const BASELINE_STORAGE_KEY = `logicxo-editor-baseline-${templateDesign}`;
    let baselineState = null;
    const DEFAULT_COPY_BG = '#5a3d2b';
    const DEFAULT_HERO_CTA_BG = '#44301f';
    const DEFAULT_HERO_CTA_TEXT = '#ffffff';
    const DEFAULT_SHOP_ALL_URL = '/catalog';
    const DEFAULT_ABOUT_PRIMARY_URL = '/about';
    const DEFAULT_ABOUT_SECONDARY_URL = '/catalog';
    const DEFAULT_ABOUT_HEADER = 'A Fixture In The Community Since 1980';
    const DEFAULT_ABOUT_PARAGRAPH = 'At Aldervaan Lighting, the bond with the community is as enduring as the glow of their finest fixtures. The team, an extended family in itself, takes immense pride in serving the community, fostering relationships that go beyond business. As a family-run venture, we infuse personal care and attention into every interaction.';
    const DEFAULT_ABOUT_PRIMARY_LABEL = 'More About Us';
    const DEFAULT_ABOUT_SECONDARY_LABEL = 'Shop Catalog';
    const DEFAULT_ABOUT_BTN_BG = '#2b2b2b';
    const DEFAULT_ABOUT_BTN_TEXT = '#ffffff';
    const DEFAULT_FEATURE_BTN_BG = '#2b2b2b';
    const DEFAULT_FEATURE_BTN_TEXT = '#ffffff';
    const DEFAULT_FEATURE_LEFT_HEADER = 'Design With Confidence';
    const DEFAULT_FEATURE_LEFT_PARAGRAPH = 'Work with our lighting specialists to plan every room, layer, and finish with fixtures chosen for your home.';
    const DEFAULT_FEATURE_LEFT_BUTTON_LABEL = 'Explore Services';
    const DEFAULT_FEATURE_LEFT_BUTTON_URL = '/services';
    const DEFAULT_FEATURE_RIGHT_HEADER = 'See It In Person';
    const DEFAULT_FEATURE_RIGHT_PARAGRAPH = 'Visit the showroom to experience collections at scale and speak with our team in a welcoming, hands-on setting.';
    const DEFAULT_FEATURE_RIGHT_BUTTON_LABEL = 'Plan Your Visit';
    const DEFAULT_FEATURE_RIGHT_BUTTON_URL = '/showroom';
    const FEATURE_IMAGE_MAX_BYTES = 6 * 1024 * 1024;
    const YOUMAYLIKE_IMAGE_MAX_BYTES = 6 * 1024 * 1024;
    const YOUMAYLIKE_SLIDE_STEP = 512;
    const DEFAULT_CATALOG_URL = '/catalog';
    const GET_INSPIRED_CARD_COUNT = 8;
    const GET_INSPIRED_DEFAULT_ITEM_NUMBERS = ['1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008'];
    const DEFAULT_FOOTER_EMAIL = 'hello@aldervaanlighting.com';
    const DEFAULT_FOOTER_COMPANY = TEMPLATE_DESIGNS[templateDesign] || 'Showroom';
    const DEFAULT_FOOTER_ADDRESS = '123 Lighting Way\nSuite 400, Anytown, USA';
    const DEFAULT_FOOTER_PHONE = '(800) 555-1234';
    const DEFAULT_CLASSIC_FOOTER_ABOUT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    const DEFAULT_CLASSIC_FOOTER_HOURS_MON_FRI = 'Monday - Friday: 9:00 AM - 5:00 PM';
    const DEFAULT_CLASSIC_FOOTER_HOURS_SATURDAY = 'Saturday: Closed';
    const DEFAULT_CLASSIC_FOOTER_HOURS_SUNDAY = 'Sunday: Closed';
    const DEFAULT_CLASSIC_FOOTER_BG = '#ffffff';
    const DEFAULT_CLASSIC_FOOTER_TEXT = '#2b2b2b';
    const DEFAULT_CLASSIC_FOOTER_COPYRIGHT_TEXT = '#5c5c5c';
    const DEFAULT_CLASSIC_FOOTER_COPYRIGHT_BG = '#f5f5f5';
    const CLASSIC_FOOTER_SHOP_LINKS = [
        { id: 'catalog', label: 'Catalog', defaultUrl: '/catalog' },
        { id: 'chandeliers', label: 'Chandeliers', defaultUrl: '/catalog/chandeliers' },
        { id: 'pendants', label: 'Pendants', defaultUrl: '/catalog/pendants' },
        { id: 'bathroom-fixtures', label: 'Bathroom Fixtures', defaultUrl: '/catalog/bathroom-fixtures' },
        { id: 'exterior', label: 'Exterior', defaultUrl: '/catalog/exterior' },
        { id: 'fans', label: 'Fans', defaultUrl: '/catalog/fans' },
        { id: 'foyer', label: 'Foyer', defaultUrl: '/catalog/foyer' },
        { id: 'wall-lights', label: 'Wall Lights', defaultUrl: '/catalog/wall-lights' },
    ];
    const CLASSIC_FOOTER_ABOUT_LINKS = [
        { id: 'about-us', label: 'About Us', defaultUrl: '/about' },
        { id: 'privacy', label: 'Privacy', defaultUrl: '/privacy' },
        { id: 'contact-us', label: 'Contact Us', defaultUrl: '/contact' },
    ];
    const CLASSIC_FOOTER_ACCOUNT_LINKS = [
        { id: 'my-account', label: 'My Account', defaultUrl: '/account' },
        { id: 'wish-list', label: 'Wish List', defaultUrl: '/wishlist' },
    ];
    const FOOTER_ADA_POPUP = 'ada-compliance::ADA Compliance::600px';
    const DEFAULT_FOOTER_QUICK_LINKS = [
        { label: 'About Us', urlKey: 'footerAboutUsUrl', defaultUrl: '/about' },
        { label: 'Contact Us', urlKey: 'footerContactUsUrl', defaultUrl: '/contact' },
        { label: 'Log In', urlKey: 'footerLoginUrl', defaultUrl: '/login' },
        { label: 'Wish List', urlKey: 'footerWishListUrl', defaultUrl: '/wishlist' },
    ];
    const DEFAULT_FOOTER_POLICY_LINKS = [
        { label: 'Terms and Conditions', urlKey: 'footerTermsUrl', defaultUrl: '/terms' },
        { label: 'Returns', urlKey: 'footerReturnsUrl', defaultUrl: '/returns' },
        { label: 'Privacy', urlKey: 'footerPrivacyUrl', defaultUrl: '/privacy' },
        { label: 'Shipping', urlKey: 'footerShippingUrl', defaultUrl: '/shipping' },
    ];
    const DEFAULT_HEADER_BANNER_BG = '#000000';
    const DEFAULT_HEADER_BANNER_TEXT = '#ffffff';
    const DEFAULT_GALLERY_HEADER_BAR_BG = '#525962';
    const DEFAULT_GALLERY_HEADER_BAR_TEXT = '#ffffff';
    const DEFAULT_GALLERY_HEADER_CENTER_COPY = 'For pricing and orders call 123-456-7891';
    const DEFAULT_GALLERY_HEADER_WISHLIST = 'Wishlist';
    const DEFAULT_GALLERY_HEADER_SIGN_IN = 'Please sign in';
    const GALLERY_SEARCH_PLACEHOLDER = 'Search...';
    const HEADER_SEARCH_PLACEHOLDER = 'Enter Keyword or Item#';
    const DEFAULT_GALLERY_MAIN_NAV_LINKS = [
        { label: 'Shop', defaultUrl: '/catalog' },
        { label: 'About Us', defaultUrl: '/about' },
        { label: 'Account', defaultUrl: '/account' },
    ];
    const GALLERY_IMAGE_DIR = 'gallery/';
    const CLASSIC_IMAGE_DIR = 'classic/';
    /** Per-template header logo height slider limits (px) — adjust min/max when tuning. */
    const HEADER_LOGO_SIZE_LIMITS = {
        classic: { min: 40, max: 80, default: 56 },
        gallery: { min: 60, max: 150, default: 100 },
        spotlight: { min: 40, max: 80, default: 56 },
    };
    const DEFAULT_CLASSIC_HEADER_LOGO = `${CLASSIC_IMAGE_DIR}header/logo-classic.png`;
    const DEFAULT_SHOWROOM_HEADER_LOGO_DARK = `${CLASSIC_IMAGE_DIR}header/classic-white.png`;
    const DEFAULT_CLASSIC_PRODUCT_IMAGE = `${CLASSIC_IMAGE_DIR}gemma.jpg`;
    const DEFAULT_CLASSIC_LIFESTYLE_IMAGE = `${CLASSIC_IMAGE_DIR}Gemma_FR33738VBZ_H_Models-min.jpg`;
    const DEFAULT_CLASSIC_ABOUT_EMPLOYEE_IMAGE = `${CLASSIC_IMAGE_DIR}lady-showroom.jpg`;
    const DEFAULT_CLASSIC_FEATURE_LEFT_IMAGE = `${CLASSIC_IMAGE_DIR}kitchEnclavePhoto-min.jpg`;
    const DEFAULT_CLASSIC_FEATURE_RIGHT_IMAGE = `${CLASSIC_IMAGE_DIR}exteriorLightingPhoto-min.jpg`;
    const DEFAULT_GALLERY_HEADER_LOGO = `${GALLERY_IMAGE_DIR}xologic-logo.png`;
    const DEFAULT_SPOTLIGHT_HEADER_LOGO = 'Spotlight/xologic-logo.png';
    const DEFAULT_GALLERY_HERO_PRIMARY = `${GALLERY_IMAGE_DIR}quorum1.jpg`;
    const DEFAULT_GALLERY_HERO_SECONDARY_TOP = `${GALLERY_IMAGE_DIR}chandelier4.jpg`;
    const DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM = `${GALLERY_IMAGE_DIR}pendants3.jpg`;
    const DEFAULT_GALLERY_HERO_HEADLINE_1 = 'STEP UP';
    const DEFAULT_GALLERY_HERO_HEADLINE_2 = 'YOUR';
    const DEFAULT_GALLERY_HERO_HEADLINE_3 = 'LIGHTING';
    const DEFAULT_GALLERY_HERO_COPY = 'Refresh your home with bold silhouettes,\nwarm finishes, and lighting that makes\nevery room feel complete.';
    const DEFAULT_GALLERY_HERO_BUTTON_LABEL = 'Shop Now';
    const DEFAULT_GALLERY_HERO_BUTTON_URL = '/catalog';
    const DEFAULT_GALLERY_HERO_BUTTON_BG = '#2b2b2b';
    const DEFAULT_GALLERY_HERO_BUTTON_TEXT = '#ffffff';
    const DEFAULT_GALLERY_HERO_SECONDARY_TOP_HEADING = 'Chandelier';
    const DEFAULT_GALLERY_HERO_SECONDARY_TOP_URL = '/catalog/chandeliers';
    const DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_HEADING = 'Pendants';
    const DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_URL = '/catalog/pendants';
    const GALLERY_CATALOG_TILE_DEFAULTS = [
        {
            id: 'bathroom-fixtures',
            label: 'BATHROOM FIXTURES',
            defaultUrl: '/catalog/bathroom-fixtures',
            defaultImage: `${GALLERY_IMAGE_DIR}bathroom1.jpg`,
        },
        {
            id: 'exterior',
            label: 'EXTERIOR',
            defaultUrl: '/catalog/exterior',
            defaultImage: `${GALLERY_IMAGE_DIR}exterior1.jpg`,
        },
        {
            id: 'fans',
            label: 'FANS',
            defaultUrl: '/catalog/fans',
            defaultImage: `${GALLERY_IMAGE_DIR}fans1.jpg`,
        },
        {
            id: 'foyer-hall-lanterns',
            label: 'FOYER HALL LANTERNS',
            defaultUrl: '/catalog/foyer-hall-lanterns',
            defaultImage: `${GALLERY_IMAGE_DIR}hall-lantern3.jpg`,
        },
    ];
    const SHOWROOM_CONTENT_COLUMN_WIDTH = '1429 px';
    const DEFAULT_HEADER_BANNER_LINKS = [
        { label: 'Home', defaultUrl: '/' },
        { label: 'About Us', defaultUrl: '/about-us' },
        { label: 'Contact', defaultUrl: '/contact-us' },
    ];
    const HEADER_TOOLBAR_ICONS = [
        {
            id: 'location',
            label: 'Location',
            iconClass: 'fa-solid fa-location-dot',
            url: '#',
        },
        {
            id: 'wishlist',
            label: 'Wish List',
            iconClass: 'fa-regular fa-heart',
            url: '#',
        },
        {
            id: 'account',
            label: 'Account',
            iconClass: 'fa-regular fa-user',
            url: '#',
        },
        {
            id: 'cart',
            label: 'Shopping Cart',
            iconClass: 'fa-solid fa-cart-shopping',
            url: '#',
        },
    ];
    const DEFAULT_MAIN_NAV_TEMPLATE = [
        {
            id: 'ceiling-lights',
            label: 'Ceiling Lights',
            subcategories: [
                { id: 'ceiling-lights-chandeliers', label: 'Chandeliers', url: '/lighting-fixtures/chandeliers' },
                { id: 'ceiling-lights-candle-chandeliers', label: 'Candle Chandeliers', url: '/lighting-fixtures/candle-chandeliers' },
                { id: 'ceiling-lights-chandelier-accessories', label: 'Chandelier Accessories', url: '/lighting-fixtures/chandeliers/chandelier-accessories' },
                { id: 'ceiling-lights-down-chandeliers', label: 'Down Chandeliers', url: '/lighting-fixtures/chandeliers/down-chandeliers' },
                { id: 'ceiling-lights-other-chandeliers', label: 'Other Chandeliers', url: '/lighting-fixtures/chandeliers/other-chandeliers' },
                { id: 'ceiling-lights-ring-chandeliers', label: 'Ring Chandeliers', url: '/lighting-fixtures/chandeliers/ring-chandeliers' },
                { id: 'ceiling-lights-up-chandeliers', label: 'Up Chandeliers', url: '/lighting-fixtures/chandeliers/up-chandeliers' },
            ],
        },
        {
            id: 'wall-fixtures',
            label: 'Wall Fixtures',
            subcategories: [
                { id: 'wall-fixtures-sconces', label: 'Sconces', url: '/lighting-fixtures/sconces' },
                { id: 'wall-fixtures-wall-sconces', label: 'Wall Sconces', url: '/lighting-fixtures/sconces/wall-sconces' },
                { id: 'wall-fixtures-sconce-accessories', label: 'Sconce Accessories', url: '/lighting-fixtures/sconces/sconce-accessories' },
                { id: 'wall-fixtures-outdoor-wall-lights', label: 'Outdoor Wall Lights', url: '/lighting-fixtures/sconces/outdoor-wall-lights' },
                { id: 'wall-fixtures-picture-display-lights', label: 'Picture Display Lights', url: '/lighting-fixtures/sconces/picture-display-lights' },
                { id: 'wall-fixtures-other-wall-lights', label: 'Other Wall Lights', url: '/lighting-fixtures/sconces/other-wall-lights' },
            ],
        },
        {
            id: 'fans',
            label: 'Fans',
            url: '/lighting-fixtures/fans',
            subcategories: [
                { id: 'fans-ceiling-fans', label: 'Ceiling Fans', url: '/lighting-fixtures/fans/ceiling-fans' },
                { id: 'fans-ceiling-fans-with-light', label: 'Ceiling Fans with Light', url: '/lighting-fixtures/fans/ceiling-fans-with-light' },
                { id: 'fans-wall-fans', label: 'Wall Fans', url: '/lighting-fixtures/fans/wall-fans' },
                { id: 'fans-outdoor-fans', label: 'Outdoor Fans', url: '/lighting-fixtures/fans/outdoor-fans' },
                { id: 'fans-portable-fans', label: 'Portable Fans', url: '/lighting-fixtures/fans/portable-fans' },
                { id: 'fans-other-fans', label: 'Other Fans', url: '/lighting-fixtures/fans/other-fans' },
                { id: 'fans-huggers', label: 'Huggers', url: '/lighting-fixtures/fans/huggers' },
                { id: 'fans-fandeliers', label: 'Fandeliers', url: '/lighting-fixtures/fans/fandeliers' },
                { id: 'fans-belt-fans', label: 'Belt Fans', url: '/lighting-fixtures/fans/belt-fans' },
                { id: 'fans-dual-motor-fans', label: 'Dual Motor Fans', url: '/lighting-fixtures/fans/dual-motor-fans' },
                { id: 'fans-fan-motor-without-blades', label: 'Fan Motor Without Blades', url: '/lighting-fixtures/fans/fan-motor-without-blades' },
            ],
        },
        {
            id: 'bathroom',
            label: 'Bathroom',
            url: '/lighting-fixtures/bathroom-fixtures',
            subcategories: [
                { id: 'bathroom-bathroom-fixtures', label: 'Bathroom Fixtures', url: '/lighting-fixtures/bathroom-fixtures' },
                { id: 'bathroom-bath-fans', label: 'Bath Fans', url: '/lighting-fixtures/bathroom-fixtures/bath-fans' },
                { id: 'bathroom-bathroom-sconces', label: 'Bathroom Sconces', url: '/lighting-fixtures/bathroom-fixtures/bathroom-sconces' },
                { id: 'bathroom-other-bathroom-fixtures', label: 'Other Bathroom Fixtures', url: '/lighting-fixtures/bathroom-fixtures/other-bathroom-fixtures' },
                { id: 'bathroom-vanity-lights', label: 'Vanity Lights', url: '/lighting-fixtures/bathroom-fixtures/vanity-lights' },
            ],
        },
        {
            id: 'outdoor',
            label: 'Outdoor',
            url: '/lighting-fixtures/exterior',
            subcategories: [
                { id: 'outdoor-exterior', label: 'Exterior', url: '/lighting-fixtures/exterior' },
                { id: 'outdoor-exterior-chandeliers', label: 'Exterior Chandeliers', url: '/lighting-fixtures/exterior/exterior-chandeliers' },
                { id: 'outdoor-exterior-fans', label: 'Exterior Fans', url: '/lighting-fixtures/exterior/exterior-fans' },
                { id: 'outdoor-exterior-pendants', label: 'Exterior Pendants', url: '/lighting-fixtures/exterior/exterior-pendants' },
                { id: 'outdoor-exterior-flush-mounts', label: 'Exterior Flush Mounts', url: '/lighting-fixtures/exterior/exterior-flush-mounts' },
                { id: 'outdoor-exterior-foyer-hall-lanterns', label: 'Exterior Foyer / Hall Lanterns', url: '/lighting-fixtures/exterior/exterior-foyer-hall-lanterns' },
                { id: 'outdoor-exterior-semi-flush-mts', label: 'Exterior Semi-Flush Mounts', url: '/lighting-fixtures/exterior/exterior-semi-flush-mts' },
                { id: 'outdoor-exterior-accessories', label: 'Exterior Accessories', url: '/lighting-fixtures/exterior/exterior-accessories' },
                { id: 'outdoor-other-exterior', label: 'Other Exterior', url: '/lighting-fixtures/exterior/other-exterior' },
                { id: 'outdoor-marine-lights', label: 'Marine Lights', url: '/lighting-fixtures/exterior/marine-lights' },
                { id: 'outdoor-posts', label: 'Posts', url: '/lighting-fixtures/exterior/posts' },
                { id: 'outdoor-post-mount-lights', label: 'Post Mount Lights', url: '/lighting-fixtures/exterior/post-mount-lights' },
                { id: 'outdoor-portable-lanterns', label: 'Portable Lanterns', url: '/lighting-fixtures/exterior/portable-lanterns' },
                { id: 'outdoor-post-adaptors', label: 'Post Adaptors', url: '/lighting-fixtures/exterior/post-adaptors' },
                { id: 'outdoor-pier-mount-lights', label: 'Pier Mount Lights', url: '/lighting-fixtures/exterior/pier-mount-lights' },
                { id: 'outdoor-pier-mounts', label: 'Pier Mounts', url: '/lighting-fixtures/exterior/pier-mounts' },
                { id: 'outdoor-hanging-lanterns', label: 'Hanging Lanterns', url: '/lighting-fixtures/exterior/hanging-lanterns' },
                { id: 'outdoor-deck-lights', label: 'Deck Lights', url: '/lighting-fixtures/exterior/deck-lights' },
                { id: 'outdoor-wall-lanterns', label: 'Wall Lanterns', url: '/lighting-fixtures/exterior/wall-lanterns' },
                { id: 'outdoor-wall-lights', label: 'Wall Lights', url: '/lighting-fixtures/exterior/wall-lights' },
                { id: 'outdoor-solar-lights', label: 'Solar Lights', url: '/lighting-fixtures/exterior/solar-lights' },
                { id: 'outdoor-bollards', label: 'Bollards', url: '/lighting-fixtures/exterior/bollards' },
                { id: 'outdoor-door-bells', label: 'Door Bells', url: '/lighting-fixtures/exterior/door-bells' },
                { id: 'outdoor-wind-chimes', label: 'Wind Chimes', url: '/lighting-fixtures/exterior/wind-chimes' },
                { id: 'outdoor-mail-boxes', label: 'Mail Boxes', url: '/lighting-fixtures/exterior/mail-boxes' },
                { id: 'outdoor-address-numbers', label: 'Address Numbers', url: '/lighting-fixtures/exterior/address-numbers' },
            ],
        },
        {
            id: 'directional-lights',
            label: 'Directional Lights',
            url: '/lighting-fixtures/directional-lights',
            subcategories: [
                { id: 'directional-lights-directional-flush-mounts', label: 'Directional Flush Mounts', url: '/lighting-fixtures/directional-lights/directional-flush-mounts' },
                { id: 'directional-lights-directional-island-lights', label: 'Directional Island Lights', url: '/lighting-fixtures/directional-lights/directional-island-lights' },
                { id: 'directional-lights-directional-light-sconces', label: 'Directional Light Sconces', url: '/lighting-fixtures/directional-lights/directional-light-sconces' },
                { id: 'directional-lights-directional-recessed-lights', label: 'Directional Recessed Lights', url: '/lighting-fixtures/directional-lights/directional-recessed-lights' },
                { id: 'directional-lights-directional-semi-flush-mts', label: 'Directional Semi-Flush Mounts', url: '/lighting-fixtures/directional-lights/directional-semi-flush-mts' },
                { id: 'directional-lights-directional-spot-lights', label: 'Directional Spot Lights', url: '/lighting-fixtures/directional-lights/directional-spot-lights' },
                { id: 'directional-lights-directional-wall-lights', label: 'Directional Wall Lights', url: '/lighting-fixtures/directional-lights/directional-wall-lights' },
                { id: 'directional-lights-directional-light-accessories', label: 'Directional Light Accessories', url: '/lighting-fixtures/directional-lights/directional-light-accessories' },
                { id: 'directional-lights-other-directional-lights', label: 'Other Directional Lights', url: '/lighting-fixtures/directional-lights/other-directional-lights' },
                { id: 'directional-lights-outdoor-directional-lights', label: 'Outdoor Directional Lights', url: '/lighting-fixtures/directional-lights/outdoor-directional-lights' },
                { id: 'directional-lights-mono-points', label: 'Mono Points', url: '/lighting-fixtures/directional-lights/mono-points' },
            ],
        },
        {
            id: 'other-categories',
            label: 'Other Categories',
            subcategories: [
                { id: 'other-categories-marine-lights', label: 'Marine Lights', url: '/lighting-fixtures/exterior/marine-lights' },
                { id: 'other-categories-puck-lights', label: 'Puck Lights', url: '/lighting-fixtures/recessed-ltg' },
                { id: 'other-categories-security-lights', label: 'Security Lights', url: '/lighting-fixtures?itemNumVal=Security%20Lights&limitRange=0' },
                { id: 'other-categories-replacement-glass', label: 'Replacement Glass', url: '/lighting-fixtures/glass/replacement-glass' },
                { id: 'other-categories-mirrors', label: 'Mirrors', url: '/lighting-fixtures/decor-home-accents/mirrors' },
                { id: 'other-categories-other-decor-home-accents', label: 'Other Decor / Home Accents', url: '/lighting-fixtures/decor-home-accents/other-decor-home-accents' },
                { id: 'other-categories-door-bells', label: 'Door Bells', url: '/lighting-fixtures/exterior/door-bells' },
                { id: 'other-categories-wind-chimes', label: 'Wind Chimes', url: '/lighting-fixtures/exterior/wind-chimes' },
            ],
        },
        { id: 'shop-by-brand', label: 'Shop by Brand', url: '/brands', subcategories: [] },
    ];
    const FOOTER_SOCIAL_LINKS = [
        {
            id: 'facebook',
            label: 'Facebook',
            urlKey: 'footerFacebookUrl',
            visibleKey: 'footerFacebookVisible',
            iconClass: 'fa-brands fa-facebook-f',
        },
        {
            id: 'instagram',
            label: 'Instagram',
            urlKey: 'footerInstagramUrl',
            visibleKey: 'footerInstagramVisible',
            iconClass: 'fa-brands fa-instagram',
        },
        {
            id: 'x',
            label: 'X',
            urlKey: 'footerXUrl',
            visibleKey: 'footerXVisible',
            iconClass: 'fa-brands fa-x-twitter',
        },
        {
            id: 'youtube',
            label: 'YouTube',
            urlKey: 'footerYoutubeUrl',
            visibleKey: 'footerYoutubeVisible',
            iconClass: 'fa-brands fa-youtube',
        },
        {
            id: 'linkedin',
            label: 'LinkedIn',
            urlKey: 'footerLinkedinUrl',
            visibleKey: 'footerLinkedinVisible',
            iconClass: 'fa-brands fa-linkedin-in',
        },
    ];
    const YOUMAYLIKE_IMAGE_DIR = `${CLASSIC_IMAGE_DIR}you-may-like/`;
    const GET_INSPIRED_IMAGE_DIR = `${CLASSIC_IMAGE_DIR}get-inspired/`;
    const DEFAULT_YOUMAYLIKE_SLOT_DEFAULTS = [
        {
            itemNumber: '1001',
            image: `${YOUMAYLIKE_IMAGE_DIR}Hinkley500750opt.jpg`,
        },
        {
            itemNumber: '1002',
            image: `${YOUMAYLIKE_IMAGE_DIR}modernforms500750opt.jpg`,
        },
        {
            itemNumber: '1003',
            image: `${YOUMAYLIKE_IMAGE_DIR}Eurofase500750opt.jpg`,
        },
    ];
    const DEFAULT_CLASSIC_GET_INSPIRED_LIFESTYLE = `${GET_INSPIRED_IMAGE_DIR}Everett_4398BN_Models.jpg`;
    const YOUMAYLIKE_TEMPLATE_CATALOG = {
        '1001': { title: 'Gemma Chandelier', price: '$2,450' },
        '1002': { title: 'Arc Floor Lamp', price: '$895' },
        '1003': { title: 'Meridian Pendant', price: '$625' },
    };
    const SKETCH_IMAGE_DIR = `${CLASSIC_IMAGE_DIR}sketch-section/`;
    const FEATURED_CATEGORY_IMAGE_DIR = `${CLASSIC_IMAGE_DIR}featured-categories/`;
    const SKETCH_CARDS = [
        {
            id: 'visit',
            imageFile: 'building.png',
            defaultHeader: 'Visit Our Showroom',
            defaultParagraph: 'Step into a world where your perfect lighting solution awaits.',
        },
        {
            id: 'consultation',
            imageFile: 'computer.png',
            defaultHeader: 'Schedule Your Consultation',
            defaultParagraph: 'Personalized attention, expert advice, and unparalleled support.',
        },
        {
            id: 'shipping',
            imageFile: 'truck.png',
            defaultHeader: 'Complimentary Shipping',
            defaultParagraph: 'Experience our free shipping policy on premium lighting selections.',
        },
        {
            id: 'experts',
            imageFile: 'male-female.png',
            defaultHeader: 'Your Local Lighting Experts',
            defaultParagraph: 'Our dedication to illuminating your spaces is second-to-none.',
        },
    ];

    const FEATURED_CATEGORIES = [
        { id: 'chandeliers', label: 'Chandeliers', imageFile: 'chandeliers.jpg' },
        { id: 'fans', label: 'Fans', imageFile: 'fans.jpg' },
        { id: 'flush-mounts', label: 'Flush mounts', imageFile: 'flush-mounts.jpg' },
        { id: 'furniture', label: 'Furniture', imageFile: 'furniture.jpg' },
        { id: 'exterior', label: 'Exterior', imageFile: 'exterior.jpg' },
        { id: 'directional-lights', label: 'Directional lights', imageFile: 'directional-lights.jpg' },
        { id: 'sconce', label: 'Sconce', imageFile: 'sconces.jpg' },
        { id: 'pendants', label: 'Pendants', imageFile: 'pendants.jpg' },
    ];

    const fields = {
        title: document.getElementById('fieldTitle'),
        copyBackgroundColor: document.getElementById('fieldCopyBg'),
        copyBackgroundColorValue: document.getElementById('fieldCopyBgValue'),
        copyTextColor: document.getElementById('fieldCopyText'),
        copyTextColorValue: document.getElementById('fieldCopyTextValue'),
        description: document.getElementById('fieldDescription'),
        cta: document.getElementById('fieldCta'),
        heroCtaHide: document.getElementById('fieldHeroCtaHide'),
        heroCtaBackgroundColor: document.getElementById('fieldHeroCtaBg'),
        heroCtaBackgroundColorValue: document.getElementById('fieldHeroCtaBgValue'),
        heroCtaTextColor: document.getElementById('fieldHeroCtaText'),
        heroCtaTextColorValue: document.getElementById('fieldHeroCtaTextValue'),
        productImage: document.getElementById('fieldProductImage'),
        lifestyleImage: document.getElementById('fieldLifestyleImage'),
        shopAllUrl: document.getElementById('fieldShopAllUrl'),
        aboutEmployeeImage: document.getElementById('fieldAboutEmployeeImage'),
        aboutHeader: document.getElementById('fieldAboutHeader'),
        aboutParagraph: document.getElementById('fieldAboutParagraph'),
        aboutPrimaryLabel: document.getElementById('fieldAboutPrimaryLabel'),
        aboutPrimaryUrl: document.getElementById('fieldAboutPrimaryUrl'),
        aboutSecondaryLabel: document.getElementById('fieldAboutSecondaryLabel'),
        aboutSecondaryUrl: document.getElementById('fieldAboutSecondaryUrl'),
        aboutButtonBackgroundColor: document.getElementById('fieldAboutButtonBg'),
        aboutButtonBackgroundColorValue: document.getElementById('fieldAboutButtonBgValue'),
        aboutButtonTextColor: document.getElementById('fieldAboutButtonText'),
        aboutButtonTextColorValue: document.getElementById('fieldAboutButtonTextValue'),
        featureLeftImage: document.getElementById('fieldFeatureLeftImage'),
        featureLeftHeader: document.getElementById('fieldFeatureLeftHeader'),
        featureLeftParagraph: document.getElementById('fieldFeatureLeftParagraph'),
        featureLeftButtonLabel: document.getElementById('fieldFeatureLeftButtonLabel'),
        featureLeftButtonUrl: document.getElementById('fieldFeatureLeftButtonUrl'),
        featureLeftButtonHide: document.getElementById('fieldFeatureLeftButtonHide'),
        featureRightImage: document.getElementById('fieldFeatureRightImage'),
        featureRightHeader: document.getElementById('fieldFeatureRightHeader'),
        featureRightParagraph: document.getElementById('fieldFeatureRightParagraph'),
        featureRightButtonLabel: document.getElementById('fieldFeatureRightButtonLabel'),
        featureRightButtonUrl: document.getElementById('fieldFeatureRightButtonUrl'),
        featureRightButtonHide: document.getElementById('fieldFeatureRightButtonHide'),
        featureButtonBackgroundColor: document.getElementById('fieldFeatureButtonBg'),
        featureButtonBackgroundColorValue: document.getElementById('fieldFeatureButtonBgValue'),
        featureButtonTextColor: document.getElementById('fieldFeatureButtonText'),
        featureButtonTextColorValue: document.getElementById('fieldFeatureButtonTextValue'),
        sketchSectionVisible: document.getElementById('fieldSketchSectionVisible'),
        headerLogo: document.getElementById('fieldHeaderLogo'),
        galleryHeaderLogo: document.getElementById('fieldGalleryHeaderLogo'),
        galleryHeaderBarBackgroundColor: document.getElementById('fieldGalleryHeaderBarBg'),
        galleryHeaderBarBackgroundColorValue: document.getElementById('fieldGalleryHeaderBarBgValue'),
        galleryHeaderBarTextColor: document.getElementById('fieldGalleryHeaderBarText'),
        galleryHeaderBarTextColorValue: document.getElementById('fieldGalleryHeaderBarTextValue'),
        galleryHeaderCenterCopy: document.getElementById('fieldGalleryHeaderCenterCopy'),
        galleryHeaderWishlistLabel: document.getElementById('fieldGalleryHeaderWishlist'),
        galleryHeaderSignInLabel: document.getElementById('fieldGalleryHeaderSignIn'),
        galleryHeroPrimary: document.getElementById('fieldGalleryHeroPrimary'),
        galleryHeroSecondaryTop: document.getElementById('fieldGalleryHeroSecondaryTop'),
        galleryHeroSecondaryTopHeading: document.getElementById('fieldGalleryHeroSecondaryTopHeading'),
        galleryHeroSecondaryTopUrl: document.getElementById('fieldGalleryHeroSecondaryTopUrl'),
        galleryHeroSecondaryBottom: document.getElementById('fieldGalleryHeroSecondaryBottom'),
        galleryHeroSecondaryBottomHeading: document.getElementById('fieldGalleryHeroSecondaryBottomHeading'),
        galleryHeroSecondaryBottomUrl: document.getElementById('fieldGalleryHeroSecondaryBottomUrl'),
        galleryHeroHeadlineLine1: document.getElementById('fieldGalleryHeroHeadline1'),
        galleryHeroHeadlineLine2: document.getElementById('fieldGalleryHeroHeadline2'),
        galleryHeroHeadlineLine3: document.getElementById('fieldGalleryHeroHeadline3'),
        galleryHeroCopy: document.getElementById('fieldGalleryHeroCopy'),
        galleryHeroButtonLabel: document.getElementById('fieldGalleryHeroButtonLabel'),
        galleryHeroButtonUrl: document.getElementById('fieldGalleryHeroButtonUrl'),
        galleryHeroButtonBackgroundColor: document.getElementById('fieldGalleryHeroButtonBg'),
        galleryHeroButtonBackgroundColorValue: document.getElementById('fieldGalleryHeroButtonBgValue'),
        galleryHeroButtonTextColor: document.getElementById('fieldGalleryHeroButtonText'),
        galleryHeroButtonTextColorValue: document.getElementById('fieldGalleryHeroButtonTextValue'),
        footerLogo: document.getElementById('fieldFooterLogo'),
        footerLogoUseHeader: document.getElementById('fieldFooterLogoUseHeader'),
        footerEmail: document.getElementById('fieldFooterEmail'),
        footerFacebookUrl: document.getElementById('fieldFooterFacebook'),
        footerFacebookVisible: document.getElementById('fieldFooterFacebookVisible'),
        footerInstagramUrl: document.getElementById('fieldFooterInstagram'),
        footerInstagramVisible: document.getElementById('fieldFooterInstagramVisible'),
        footerXUrl: document.getElementById('fieldFooterX'),
        footerXVisible: document.getElementById('fieldFooterXVisible'),
        footerYoutubeUrl: document.getElementById('fieldFooterYoutube'),
        footerYoutubeVisible: document.getElementById('fieldFooterYoutubeVisible'),
        footerLinkedinUrl: document.getElementById('fieldFooterLinkedin'),
        footerLinkedinVisible: document.getElementById('fieldFooterLinkedinVisible'),
        footerCompanyName: document.getElementById('fieldFooterCompanyName'),
        footerAddress: document.getElementById('fieldFooterAddress'),
        footerPhone: document.getElementById('fieldFooterPhone'),
        footerCopyrightName: document.getElementById('fieldFooterCopyrightName'),
        classicFooterCompanyName: document.getElementById('fieldClassicFooterCompanyName'),
        classicFooterAboutCopy: document.getElementById('fieldClassicFooterAboutCopy'),
        classicFooterAddress: document.getElementById('fieldClassicFooterAddress'),
        classicFooterHoursMonFri: document.getElementById('fieldClassicFooterHoursMonFri'),
        classicFooterHoursSaturday: document.getElementById('fieldClassicFooterHoursSaturday'),
        classicFooterHoursSunday: document.getElementById('fieldClassicFooterHoursSunday'),
        classicFooterCopyrightName: document.getElementById('fieldClassicFooterCopyrightName'),
        classicFooterBackgroundColor: document.getElementById('fieldClassicFooterBg'),
        classicFooterBackgroundColorValue: document.getElementById('fieldClassicFooterBgValue'),
        classicFooterTextColor: document.getElementById('fieldClassicFooterText'),
        classicFooterTextColorValue: document.getElementById('fieldClassicFooterTextValue'),
        classicFooterCopyrightTextColor: document.getElementById('fieldClassicFooterCopyrightText'),
        classicFooterCopyrightTextColorValue: document.getElementById('fieldClassicFooterCopyrightTextValue'),
        classicFooterCopyrightBackgroundColor: document.getElementById('fieldClassicFooterCopyrightBg'),
        classicFooterCopyrightBackgroundColorValue: document.getElementById('fieldClassicFooterCopyrightBgValue'),
        headerBannerBackgroundColor: document.getElementById('fieldHeaderBannerBg'),
        headerBannerBackgroundColorValue: document.getElementById('fieldHeaderBannerBgValue'),
        headerBannerTextColor: document.getElementById('fieldHeaderBannerText'),
        headerBannerTextColorValue: document.getElementById('fieldHeaderBannerTextValue'),
    };

    const preview = {
        title: document.getElementById('previewTitle'),
        description: document.getElementById('previewDescription'),
        cta: document.getElementById('previewCta'),
        copy: document.getElementById('previewCopy'),
        productImage: document.getElementById('previewProductImage'),
        lifestyleImage: document.getElementById('previewLifestyleImage'),
        productPlaceholder: document.getElementById('previewProductPlaceholder'),
        lifestylePlaceholder: document.getElementById('previewLifestylePlaceholder'),
        shopAll: document.getElementById('previewShopAll'),
        categoriesGrid: document.getElementById('previewCategoriesGrid'),
        aboutPhoto: document.getElementById('previewAboutPhoto'),
        aboutPhotoPlaceholder: document.getElementById('previewAboutPhotoPlaceholder'),
        aboutHeader: document.getElementById('previewAboutHeader'),
        aboutParagraph: document.getElementById('previewAboutParagraph'),
        aboutPrimary: document.getElementById('previewAboutPrimary'),
        aboutSecondary: document.getElementById('previewAboutSecondary'),
        featureLeftImage: document.getElementById('previewFeatureLeftImage'),
        featureLeftPlaceholder: document.getElementById('previewFeatureLeftPlaceholder'),
        featureLeftHeader: document.getElementById('previewFeatureLeftHeader'),
        featureLeftParagraph: document.getElementById('previewFeatureLeftParagraph'),
        featureLeftButton: document.getElementById('previewFeatureLeftButton'),
        featureRightImage: document.getElementById('previewFeatureRightImage'),
        featureRightPlaceholder: document.getElementById('previewFeatureRightPlaceholder'),
        featureRightHeader: document.getElementById('previewFeatureRightHeader'),
        featureRightParagraph: document.getElementById('previewFeatureRightParagraph'),
        featureRightButton: document.getElementById('previewFeatureRightButton'),
    };

    const categoryCheckboxList = document.getElementById('categoryCheckboxList');

    const uploadPreviews = {
        product: document.getElementById('uploadPreviewProduct'),
        lifestyle: document.getElementById('uploadPreviewLifestyle'),
        about: document.getElementById('uploadPreviewAbout'),
        featureLeft: document.getElementById('uploadPreviewFeatureLeft'),
        featureRight: document.getElementById('uploadPreviewFeatureRight'),
    };

    const exportBtn = document.getElementById('exportPdfBtn');
    const clientReviewBtn = document.getElementById('shareReviewBtn');
    const reviewExportProgress = document.getElementById('reviewExportProgress');
    const reviewExportProgressLabel = document.getElementById('reviewExportProgressLabel');
    const reviewExportProgressPercent = document.getElementById('reviewExportProgressPercent');
    const reviewExportProgressBar = document.getElementById('reviewExportProgressBar');
    const reviewExportProgressFill = document.getElementById('reviewExportProgressFill');
    const resetBtn = document.getElementById('resetDraftBtn');
    const statusEl = document.getElementById('editorStatus');
    const evolvedToast = document.getElementById('evolvedToast');
    const EXPORT_BTN_LABEL = 'Export handoff';
    const CLIENT_REVIEW_BTN_LABEL = 'Share for review';
    const CLIENT_REVIEW_BTN_SUCCESS_LABEL = 'Level up 🍄';
    const EXPORT_BTN_SUCCESS_LABEL = 'Evolved 🕺';
    let evolvedToastHideTimer = null;
    let evolvedToastRemoveTimer = null;
    let exportInProgress = false;
    let captureBusy = false;
    const previewRoot = document.getElementById('showroomPreview');
    const heroRoot = document.getElementById('showroomHeroSection');
    const galleryHeroLayoutRoot = document.getElementById('showroomGalleryHeroLayout');
    const showroomHeroClassic = document.getElementById('showroomHeroClassic');
    const showroomHeroGallery = document.getElementById('showroomHeroGallery');
    const previewGalleryHeroPrimary = document.getElementById('previewGalleryHeroPrimary');
    const previewGalleryHeroPrimaryImage = document.getElementById('previewGalleryHeroPrimaryImage');
    const previewGalleryHeroSecondaryTop = document.getElementById('previewGalleryHeroSecondaryTop');
    const previewGalleryHeroSecondaryTopImage = document.getElementById('previewGalleryHeroSecondaryTopImage');
    const previewGalleryHeroSecondaryTopHeading = document.getElementById('previewGalleryHeroSecondaryTopHeading');
    const previewGalleryHeroSecondaryTopLink = document.getElementById('previewGalleryHeroSecondaryTopLink');
    const previewGalleryHeroSecondaryBottom = document.getElementById('previewGalleryHeroSecondaryBottom');
    const previewGalleryHeroSecondaryBottomImage = document.getElementById('previewGalleryHeroSecondaryBottomImage');
    const previewGalleryHeroSecondaryBottomHeading = document.getElementById('previewGalleryHeroSecondaryBottomHeading');
    const previewGalleryHeroSecondaryBottomLink = document.getElementById('previewGalleryHeroSecondaryBottomLink');
    const previewGalleryHeroHeadlineLine1 = document.getElementById('previewGalleryHeroHeadlineLine1');
    const previewGalleryHeroHeadlineLine2 = document.getElementById('previewGalleryHeroHeadlineLine2');
    const previewGalleryHeroHeadlineLine3 = document.getElementById('previewGalleryHeroHeadlineLine3');
    const previewGalleryHeroCopy = document.getElementById('previewGalleryHeroCopy');
    const previewGalleryHeroCta = document.getElementById('previewGalleryHeroCta');
    const uploadPreviewGalleryHeroPrimary = document.getElementById('uploadPreviewGalleryHeroPrimary');
    const uploadPreviewGalleryHeroSecondaryTop = document.getElementById('uploadPreviewGalleryHeroSecondaryTop');
    const uploadPreviewGalleryHeroSecondaryBottom = document.getElementById('uploadPreviewGalleryHeroSecondaryBottom');
    const editorHeroClassic = document.getElementById('editorHeroClassic');
    const editorHeroGallery = document.getElementById('editorHeroGallery');
    const editorGalleryCatalog = document.getElementById('editorGalleryCatalog');
    const headerRoot = document.getElementById('showroomHeaderSection');
    const previewHeaderLogo = document.getElementById('previewHeaderLogo');
    const previewHeaderLogoWrap = document.getElementById('previewHeaderLogoWrap');
    const previewHeaderBanner = document.getElementById('previewHeaderBanner');
    const previewHeaderBannerLinks = document.getElementById('previewHeaderBannerLinks');
    const previewHeaderIcons = document.getElementById('previewHeaderIcons');
    const previewMainNav = document.getElementById('previewMainNav');
    const showroomHeaderClassic = document.getElementById('showroomHeaderClassic');
    const showroomHeaderGallery = document.getElementById('showroomHeaderGallery');
    const previewGalleryTopBar = document.getElementById('previewGalleryTopBar');
    const previewGalleryTopBarCopy = document.getElementById('previewGalleryTopBarCopy');
    const previewGalleryTopBarUtils = document.getElementById('previewGalleryTopBarUtils');
    const previewGalleryLogo = document.getElementById('previewGalleryLogo');
    const previewGalleryLogoWrap = document.getElementById('previewGalleryLogoWrap');
    const uploadPreviewGalleryHeaderLogo = document.getElementById('uploadPreviewGalleryHeaderLogo');
    const editorHeaderClassic = document.getElementById('editorHeaderClassic');
    const editorHeaderGallery = document.getElementById('editorHeaderGallery');
    const mainNavEditor = document.getElementById('mainNavEditor');
    const galleryMainNavEditor = document.getElementById('galleryMainNavEditor');
    const galleryCatalogTilesEditor = document.getElementById('galleryCatalogTilesEditor');
    const previewGalleryCatalogGrid = document.getElementById('previewGalleryCatalogGrid');
    const galleryCatalogRoot = document.getElementById('showroomGalleryCatalogSection');
    const editorClassicSections = document.getElementById('editorClassicSections');
    const showroomClassicSections = document.getElementById('showroomClassicSections');
    const editorNavGalleryCatalog = document.getElementById('editorNavGalleryCatalog');
    const addGalleryMainNavLinkBtn = document.getElementById('addGalleryMainNavLinkBtn');
    const previewGalleryMainNavLinks = document.getElementById('previewGalleryMainNavLinks');
    const headerJumpNav = document.getElementById('headerJumpNav');
    const headerBannerLinksEditor = document.getElementById('headerBannerLinksEditor');
    const addHeaderBannerLinkBtn = document.getElementById('addHeaderBannerLinkBtn');
    const categoriesRoot = document.getElementById('showroomCategoriesSection');
    const aboutRoot = document.getElementById('showroomAboutSection');
    const featureTilesRoot = document.getElementById('showroomFeatureTilesSection');
    const sketchRoot = document.getElementById('showroomSketchSection');
    const youMayLikeRoot = document.getElementById('showroomYouMayLikeSection');
    const youMayLikeEditor = document.getElementById('youMayLikeEditor');
    const addYouMayLikeBtn = document.getElementById('addYouMayLikeBtn');
    const youMayLikePrev = document.getElementById('youMayLikePrev');
    const youMayLikeNext = document.getElementById('youMayLikeNext');
    const getInspiredRoot = document.getElementById('showroomGetInspiredSection');
    const getInspiredEditor = document.getElementById('getInspiredEditor');
    const fieldsGetInspiredLifestyle = document.getElementById('fieldGetInspiredLifestyle');
    const uploadPreviewGetInspiredLifestyle = document.getElementById('uploadPreviewGetInspiredLifestyle');
    const previewGetInspiredLifestyleImage = document.getElementById('previewGetInspiredLifestyleImage');
    const previewGetInspiredLifestylePlaceholder = document.getElementById('previewGetInspiredLifestylePlaceholder');
    const footerRoot = document.getElementById('showroomFooterSection');
    const showroomHeaderSpotlight = document.getElementById('showroomHeaderSpotlight');
    const showroomHeroSpotlight = document.getElementById('showroomHeroSpotlight');
    const spotlightOnSaleRoot = document.getElementById('showroomSpotlightOnSaleSection');
    const spotlightShopByRoomRoot = document.getElementById('showroomSpotlightShopByRoomSection');
    const spotlightAboutRoot = document.getElementById('showroomSpotlightAboutSection');
    const spotlightCategoryRoot = document.getElementById('showroomSpotlightCategorySection');
    const spotlightBrandsRoot = document.getElementById('showroomSpotlightBrandsSection');
    const spotlightNewsletterRoot = document.getElementById('showroomSpotlightNewsletterSection');
    const spotlightFooterRoot = document.getElementById('showroomSpotlightFooterSection');
    const classicFooterRoot = document.getElementById('showroomFooterClassicSection');
    const classicCopyrightRoot = document.getElementById('showroomCopyrightClassicSection');
    const editorFooterClassic = document.getElementById('editorFooterClassic');
    const editorCopyrightClassic = document.getElementById('editorCopyrightClassic');
    const editorNavFooterClassic = document.getElementById('editorNavFooterClassic');
    const classicFooterShopLinksEditor = document.getElementById('classicFooterShopLinksEditor');
    const addClassicFooterShopLinkBtn = document.getElementById('addClassicFooterShopLinkBtn');
    const classicFooterAboutLinksEditor = document.getElementById('classicFooterAboutLinksEditor');
    const classicFooterAccountLinksEditor = document.getElementById('classicFooterAccountLinksEditor');
    const previewClassicFooterCompany = document.getElementById('previewClassicFooterCompany');
    const previewClassicFooterAbout = document.getElementById('previewClassicFooterAbout');
    const previewClassicFooterShopLinks = document.getElementById('previewClassicFooterShopLinks');
    const previewClassicFooterAboutLinks = document.getElementById('previewClassicFooterAboutLinks');
    const previewClassicFooterAccountLinks = document.getElementById('previewClassicFooterAccountLinks');
    const previewClassicFooterAddress = document.getElementById('previewClassicFooterAddress');
    const previewClassicFooterHours = document.getElementById('previewClassicFooterHours');
    const previewClassicCopyright = document.getElementById('previewClassicCopyright');
    const previewFooterLogo = document.getElementById('previewFooterLogo');
    const previewFooterLogoWrap = document.getElementById('previewFooterLogoWrap');
    const previewFooterEmail = document.getElementById('previewFooterEmail');
    const previewFooterSocial = document.getElementById('previewFooterSocial');
    const footerQuickLinksEditor = document.getElementById('footerQuickLinksEditor');
    const footerPolicyLinksEditor = document.getElementById('footerPolicyLinksEditor');
    const addFooterQuickLinkBtn = document.getElementById('addFooterQuickLinkBtn');
    const addFooterPolicyLinkBtn = document.getElementById('addFooterPolicyLinkBtn');
    const previewFooterQuickLinks = document.getElementById('previewFooterQuickLinks');
    const previewFooterQuickLinksHeading = document.getElementById('previewFooterQuickLinksHeading');
    const previewFooterPolicyLinks = document.getElementById('previewFooterPolicyLinks');
    const previewFooterPoliciesHeading = document.getElementById('previewFooterPoliciesHeading');
    const previewFooterCompanyName = document.getElementById('previewFooterCompanyName');
    const previewFooterAddress = document.getElementById('previewFooterAddress');
    const previewFooterPhone = document.getElementById('previewFooterPhone');
    const previewFooterCopyright = document.getElementById('previewFooterCopyright');
    const uploadPreviewHeaderLogo = document.getElementById('uploadPreviewHeaderLogo');
    const uploadPreviewFooterLogo = document.getElementById('uploadPreviewFooterLogo');
    const previewScaler = document.getElementById('previewScaler');
    const previewWrap = document.querySelector('.editor-preview-wrap');
    const editorPanel = document.getElementById('editorPanel');
    const editorSectionNav = document.getElementById('editorSectionNav');
    let refreshEditorSectionNavSpy = null;
    const TEMPLATE_FRAME_WIDTH = 1572;

    let state = {
        title: '',
        copyBackgroundColor: DEFAULT_COPY_BG,
        copyTextColor: DEFAULT_HEADER_BANNER_TEXT,
        description: '',
        cta: '',
        heroCtaBackgroundColor: DEFAULT_HERO_CTA_BG,
        heroCtaTextColor: DEFAULT_HERO_CTA_TEXT,
        heroCtaVisible: true,
        productImage: templateDesign === 'gallery' ? '' : DEFAULT_CLASSIC_PRODUCT_IMAGE,
        lifestyleImage: templateDesign === 'gallery' ? '' : DEFAULT_CLASSIC_LIFESTYLE_IMAGE,
        shopAllUrl: DEFAULT_SHOP_ALL_URL,
        featuredCategories: defaultFeaturedCategories(),
        aboutHeader: DEFAULT_ABOUT_HEADER,
        aboutParagraph: DEFAULT_ABOUT_PARAGRAPH,
        aboutPrimaryLabel: DEFAULT_ABOUT_PRIMARY_LABEL,
        aboutPrimaryUrl: DEFAULT_ABOUT_PRIMARY_URL,
        aboutSecondaryLabel: DEFAULT_ABOUT_SECONDARY_LABEL,
        aboutSecondaryUrl: DEFAULT_ABOUT_SECONDARY_URL,
        aboutButtonBackgroundColor: DEFAULT_ABOUT_BTN_BG,
        aboutButtonTextColor: DEFAULT_ABOUT_BTN_TEXT,
        aboutEmployeeImage: templateDesign === 'gallery' ? '' : DEFAULT_CLASSIC_ABOUT_EMPLOYEE_IMAGE,
        featureLeftHeader: DEFAULT_FEATURE_LEFT_HEADER,
        featureLeftParagraph: DEFAULT_FEATURE_LEFT_PARAGRAPH,
        featureLeftButtonLabel: DEFAULT_FEATURE_LEFT_BUTTON_LABEL,
        featureLeftButtonUrl: DEFAULT_FEATURE_LEFT_BUTTON_URL,
        featureLeftButtonVisible: true,
        featureLeftImage: templateDesign === 'gallery' ? '' : DEFAULT_CLASSIC_FEATURE_LEFT_IMAGE,
        featureRightHeader: DEFAULT_FEATURE_RIGHT_HEADER,
        featureRightParagraph: DEFAULT_FEATURE_RIGHT_PARAGRAPH,
        featureRightButtonLabel: DEFAULT_FEATURE_RIGHT_BUTTON_LABEL,
        featureRightButtonUrl: DEFAULT_FEATURE_RIGHT_BUTTON_URL,
        featureRightButtonVisible: true,
        featureRightImage: templateDesign === 'gallery' ? '' : DEFAULT_CLASSIC_FEATURE_RIGHT_IMAGE,
        featureButtonBackgroundColor: DEFAULT_FEATURE_BTN_BG,
        featureButtonTextColor: DEFAULT_FEATURE_BTN_TEXT,
        sketchSectionVisible: true,
        youMayLikeItems: defaultYouMayLikeItems(),
        getInspiredLifestyleImage: templateDesign === 'gallery' ? '' : DEFAULT_CLASSIC_GET_INSPIRED_LIFESTYLE,
        getInspiredItems: defaultGetInspiredItems(),
        headerBannerBackgroundColor: templateDesign === 'spotlight' ? '#254155' : DEFAULT_HEADER_BANNER_BG,
        headerBannerTextColor: DEFAULT_HEADER_BANNER_TEXT,
        headerBannerLinks: defaultHeaderBannerLinks(),
        mainNavItems: defaultMainNavItems(),
        headerLogoImage: templateDesign === 'gallery'
            ? DEFAULT_GALLERY_HEADER_LOGO
            : templateDesign === 'spotlight'
                ? 'Spotlight/xologic-logo.png'
                : DEFAULT_CLASSIC_HEADER_LOGO,
        headerLogoSize: HEADER_LOGO_SIZE_LIMITS[templateDesign]?.default
            ?? HEADER_LOGO_SIZE_LIMITS.classic.default,
        galleryHeaderBarBackgroundColor: DEFAULT_GALLERY_HEADER_BAR_BG,
        galleryHeaderBarTextColor: DEFAULT_GALLERY_HEADER_BAR_TEXT,
        galleryHeaderCenterCopy: DEFAULT_GALLERY_HEADER_CENTER_COPY,
        galleryHeaderWishlistLabel: DEFAULT_GALLERY_HEADER_WISHLIST,
        galleryHeaderSignInLabel: DEFAULT_GALLERY_HEADER_SIGN_IN,
        galleryMainNavLinks: defaultGalleryMainNavLinks(),
        galleryHeroPrimaryImage: DEFAULT_GALLERY_HERO_PRIMARY,
        galleryHeroSecondaryTopImage: DEFAULT_GALLERY_HERO_SECONDARY_TOP,
        galleryHeroSecondaryTopHeading: DEFAULT_GALLERY_HERO_SECONDARY_TOP_HEADING,
        galleryHeroSecondaryTopUrl: DEFAULT_GALLERY_HERO_SECONDARY_TOP_URL,
        galleryHeroSecondaryBottomImage: DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM,
        galleryHeroSecondaryBottomHeading: DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_HEADING,
        galleryHeroSecondaryBottomUrl: DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_URL,
        galleryHeroHeadlineLine1: DEFAULT_GALLERY_HERO_HEADLINE_1,
        galleryHeroHeadlineLine2: DEFAULT_GALLERY_HERO_HEADLINE_2,
        galleryHeroHeadlineLine3: DEFAULT_GALLERY_HERO_HEADLINE_3,
        galleryHeroCopy: DEFAULT_GALLERY_HERO_COPY,
        galleryHeroButtonLabel: DEFAULT_GALLERY_HERO_BUTTON_LABEL,
        galleryHeroButtonUrl: DEFAULT_GALLERY_HERO_BUTTON_URL,
        galleryHeroButtonBackgroundColor: DEFAULT_GALLERY_HERO_BUTTON_BG,
        galleryHeroButtonTextColor: DEFAULT_GALLERY_HERO_BUTTON_TEXT,
        galleryCatalogTiles: defaultGalleryCatalogTiles(),
        classicFooterCompanyName: DEFAULT_FOOTER_COMPANY,
        classicFooterAboutCopy: DEFAULT_CLASSIC_FOOTER_ABOUT,
        classicFooterShopLinks: defaultClassicFooterShopLinks(),
        classicFooterAboutLinks: defaultClassicFooterAboutLinks(),
        classicFooterAccountLinks: defaultClassicFooterAccountLinks(),
        classicFooterAddress: DEFAULT_FOOTER_ADDRESS,
        classicFooterHoursMonFri: DEFAULT_CLASSIC_FOOTER_HOURS_MON_FRI,
        classicFooterHoursSaturday: DEFAULT_CLASSIC_FOOTER_HOURS_SATURDAY,
        classicFooterHoursSunday: DEFAULT_CLASSIC_FOOTER_HOURS_SUNDAY,
        classicFooterCopyrightName: '',
        classicFooterBackgroundColor: DEFAULT_CLASSIC_FOOTER_BG,
        classicFooterTextColor: DEFAULT_CLASSIC_FOOTER_TEXT,
        classicFooterCopyrightTextColor: DEFAULT_CLASSIC_FOOTER_COPYRIGHT_TEXT,
        classicFooterCopyrightBackgroundColor: DEFAULT_CLASSIC_FOOTER_COPYRIGHT_BG,
        footerLogoImage: '',
        footerLogoUseHeader: true,
        footerEmail: DEFAULT_FOOTER_EMAIL,
        footerFacebookUrl: '',
        footerFacebookVisible: true,
        footerInstagramUrl: '',
        footerInstagramVisible: true,
        footerXUrl: '',
        footerXVisible: true,
        footerYoutubeUrl: '',
        footerYoutubeVisible: true,
        footerLinkedinUrl: '',
        footerLinkedinVisible: true,
        footerQuickLinks: defaultFooterQuickLinks(),
        footerPolicyLinks: defaultFooterPolicyLinks(),
        footerCompanyName: DEFAULT_FOOTER_COMPANY,
        footerAddress: DEFAULT_FOOTER_ADDRESS,
        footerPhone: DEFAULT_FOOTER_PHONE,
        footerCopyrightName: '',
        reviewedSections: [],
        previewTheme: 'light',
        handoffExported: false,
        reviewExported: false,
    };

    function createGetInspiredItem(data = {}, index = 0) {
        return {
            id: data.id || `gi-${index + 1}`,
            itemNumber: String(
                data.itemNumber ?? GET_INSPIRED_DEFAULT_ITEM_NUMBERS[index] ?? '',
            ).trim(),
        };
    }

    function defaultGetInspiredItems() {
        return Array.from({ length: GET_INSPIRED_CARD_COUNT }, (_, index) => createGetInspiredItem({}, index));
    }

    function normalizeGetInspiredItems(saved) {
        if (!Array.isArray(saved) || saved.length === 0) {
            return defaultGetInspiredItems();
        }
        return Array.from({ length: GET_INSPIRED_CARD_COUNT }, (_, index) => {
            const item = saved[index] || {};
            if (item.itemNumber) {
                return createGetInspiredItem(item, index);
            }
            return createGetInspiredItem({
                id: item.id,
                itemNumber: GET_INSPIRED_DEFAULT_ITEM_NUMBERS[index] || '',
            }, index);
        });
    }

    function createYouMayLikeItem(data = {}) {
        return {
            id: data.id || `ymml-${Math.random().toString(36).slice(2, 10)}`,
            itemNumber: String(data.itemNumber || '').trim(),
            image: data.image || '',
        };
    }

    function defaultYouMayLikeItems() {
        return DEFAULT_YOUMAYLIKE_SLOT_DEFAULTS.map((slot, index) => createYouMayLikeItem({
            id: `ymml-${index + 1}`,
            itemNumber: slot.itemNumber,
            image: slot.image,
        }));
    }

    function applyYouMayLikeImageDefaults(items) {
        return items.map((item, index) => {
            const slot = DEFAULT_YOUMAYLIKE_SLOT_DEFAULTS[index];
            const next = createYouMayLikeItem(item);
            if (!savedClassicImageRef(next.image) && slot?.image) {
                next.image = slot.image;
            }
            if (!next.itemNumber && slot?.itemNumber) {
                next.itemNumber = slot.itemNumber;
            }
            return next;
        });
    }

    function normalizeYouMayLikeItems(saved) {
        if (!Array.isArray(saved) || saved.length === 0) {
            return defaultYouMayLikeItems();
        }
        return applyYouMayLikeImageDefaults(saved.map((item, index) => {
            const slot = DEFAULT_YOUMAYLIKE_SLOT_DEFAULTS[index];
            if (item.itemNumber) {
                return createYouMayLikeItem(item);
            }
            return createYouMayLikeItem({
                id: item.id,
                itemNumber: slot?.itemNumber || '',
                image: item.image,
            });
        }));
    }

    function resolveYouMayLikePreviewItem(item) {
        const number = String(item?.itemNumber || '').trim();
        const catalog = number ? YOUMAYLIKE_TEMPLATE_CATALOG[number] : null;

        return {
            itemNumber: number,
            title: catalog?.title || (number ? `Item ${number}` : 'Catalog product'),
            price: catalog?.price || 'Price from catalog',
            url: number ? `/catalog/${number}` : DEFAULT_CATALOG_URL,
            imageSrc: savedClassicImageRef(item?.image) || '',
        };
    }

    function resolveGetInspiredPreviewItem(item, index) {
        const catalog = resolveYouMayLikePreviewItem(item);

        return {
            ...catalog,
            imageSrc: `${GET_INSPIRED_IMAGE_DIR}${index + 1}.png`,
        };
    }

    function defaultFeaturedCategories() {
        return Object.fromEntries(FEATURED_CATEGORIES.map((category) => [category.id, true]));
    }

    function mergeFeaturedCategories(saved) {
        const merged = defaultFeaturedCategories();
        if (saved && typeof saved === 'object') {
            FEATURED_CATEGORIES.forEach((category) => {
                if (typeof saved[category.id] === 'boolean') {
                    merged[category.id] = saved[category.id];
                }
            });
        }
        return merged;
    }

    function normalizeHex(color) {
        if (!color) return DEFAULT_COPY_BG;
        const value = color.trim().toLowerCase();
        return /^#[0-9a-f]{6}$/.test(value) ? value : DEFAULT_COPY_BG;
    }

    function normalizeHexColor(color, fallback) {
        if (!color) return fallback;
        const value = color.trim().toLowerCase();
        return /^#[0-9a-f]{6}$/.test(value) ? value : fallback;
    }

    function hexWithAlpha(hex, alpha) {
        const value = normalizeHexColor(hex, '#ffffff').slice(1);
        const r = parseInt(value.slice(0, 2), 16);
        const g = parseInt(value.slice(2, 4), 16);
        const b = parseInt(value.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function softCascadeFromHeaderText(previousHeaderText, nextHeaderText) {
        const prev = normalizeHexColor(previousHeaderText, '');
        const next = normalizeHexColor(nextHeaderText, DEFAULT_HEADER_BANNER_TEXT);
        if (!prev || prev === next) return;

        function maybeCascade(stateKey, fieldKey) {
            if (normalizeHexColor(state[stateKey], '') !== prev) return;
            state[stateKey] = next;
            if (fields[fieldKey]) {
                fields[fieldKey].value = next;
                if (fields[`${fieldKey}Value`]) {
                    fields[`${fieldKey}Value`].textContent = next;
                }
            }
        }

        maybeCascade('copyTextColor', 'copyTextColor');
        maybeCascade('heroCtaTextColor', 'heroCtaTextColor');
        maybeCascade('galleryHeroButtonTextColor', 'galleryHeroButtonTextColor');
        maybeCascade('aboutButtonTextColor', 'aboutButtonTextColor');
        maybeCascade('featureButtonTextColor', 'featureButtonTextColor');
    }

    function darkenHex(hex, factor = 0.72) {
        const normalized = normalizeHex(hex);
        const num = parseInt(normalized.slice(1), 16);
        const r = Math.max(0, Math.floor(((num >> 16) & 255) * factor));
        const g = Math.max(0, Math.floor(((num >> 8) & 255) * factor));
        const b = Math.max(0, Math.floor((num & 255) * factor));
        return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
    }

    function setStatus(msg) {
        if (statusEl) statusEl.textContent = msg;
    }

    function showEvolvedToast() {
        if (!evolvedToast) return;

        if (evolvedToastHideTimer) clearTimeout(evolvedToastHideTimer);
        if (evolvedToastRemoveTimer) clearTimeout(evolvedToastRemoveTimer);

        evolvedToast.hidden = false;
        requestAnimationFrame(() => {
            evolvedToast.classList.add('is-visible');
        });

        evolvedToastHideTimer = setTimeout(() => {
            evolvedToast.classList.remove('is-visible');
            evolvedToastRemoveTimer = setTimeout(() => {
                evolvedToast.hidden = true;
                evolvedToastHideTimer = null;
                evolvedToastRemoveTimer = null;
            }, 350);
        }, 2800);
    }

    function getExportButton() {
        return document.getElementById('exportPdfBtn');
    }

    function renderExportButtonAsEvolved() {
        const btn = getExportButton();
        if (!btn) return;
        btn.disabled = false;
        btn.classList.remove('is-exporting');
        btn.classList.add('is-evolved');
        btn.removeAttribute('aria-busy');
        btn.textContent = EXPORT_BTN_SUCCESS_LABEL;
        btn.setAttribute('aria-label', 'Handoff exported successfully');
    }

    function renderClientReviewButtonAsLevelUp() {
        if (!clientReviewBtn) return;
        clientReviewBtn.disabled = false;
        clientReviewBtn.classList.remove('is-exporting');
        clientReviewBtn.classList.add('is-evolved');
        clientReviewBtn.removeAttribute('aria-busy');
        clientReviewBtn.textContent = CLIENT_REVIEW_BTN_SUCCESS_LABEL;
        clientReviewBtn.setAttribute('aria-label', 'Client review package exported successfully');
    }

    function setClientReviewSuccess() {
        renderClientReviewButtonAsLevelUp();
        state.reviewExported = true;
        saveState({ silent: true });
    }

    function resetClientReviewButton() {
        if (!clientReviewBtn) return;
        clientReviewBtn.disabled = false;
        clientReviewBtn.classList.remove('is-exporting', 'is-evolved');
        clientReviewBtn.removeAttribute('aria-busy');
        clientReviewBtn.textContent = CLIENT_REVIEW_BTN_LABEL;
        clientReviewBtn.removeAttribute('aria-label');
    }

    function applyClientReviewButtonState() {
        if (captureBusy) return;
        if (state.reviewExported) {
            renderClientReviewButtonAsLevelUp();
            return;
        }
        resetClientReviewButton();
    }

    function setExportSuccess() {
        renderExportButtonAsEvolved();
        state.handoffExported = true;
        saveState({ silent: true });
    }

    function resetExportButton() {
        setExportLoading(false);
    }

    function applyExportButtonState() {
        if (exportInProgress) return;
        if (state.handoffExported) {
            renderExportButtonAsEvolved();
            return;
        }
        resetExportButton();
    }

    function setExportLoading(isLoading) {
        const btn = getExportButton();
        if (!btn) return;
        captureBusy = isLoading;
        if (isLoading) {
            btn.disabled = true;
            btn.classList.remove('is-evolved');
            btn.classList.add('is-exporting');
            btn.setAttribute('aria-busy', 'true');
            btn.innerHTML = '<span class="export-spinner" aria-hidden="true"></span><span class="export-btn-text">Building handoff…</span>';
            if (clientReviewBtn) clientReviewBtn.disabled = true;
            setStatus('Building PDF, images, and assets…');
            return;
        }
        btn.disabled = false;
        btn.classList.remove('is-exporting', 'is-evolved');
        btn.removeAttribute('aria-busy');
        btn.textContent = EXPORT_BTN_LABEL;
        btn.removeAttribute('aria-label');
        if (clientReviewBtn) clientReviewBtn.disabled = false;
    }

    function setCaptureButtonsDisabled(isDisabled) {
        if (clientReviewBtn) clientReviewBtn.disabled = isDisabled;
        const exportButton = getExportButton();
        if (exportButton && (isDisabled || !exportInProgress)) {
            exportButton.disabled = isDisabled;
        }
    }

    function setReviewExportProgress(percent, label) {
        if (!reviewExportProgress || !reviewExportProgressFill) return;
        const clamped = Math.max(0, Math.min(100, Math.round(percent)));
        reviewExportProgress.hidden = false;
        reviewExportProgressFill.style.width = `${clamped}%`;
        if (reviewExportProgressBar) {
            reviewExportProgressBar.setAttribute('aria-valuenow', String(clamped));
        }
        if (reviewExportProgressPercent) {
            reviewExportProgressPercent.textContent = `${clamped}%`;
        }
        if (label && reviewExportProgressLabel) {
            reviewExportProgressLabel.textContent = label;
        }
    }

    function resetReviewExportProgress() {
        if (!reviewExportProgress || !reviewExportProgressFill) return;
        reviewExportProgress.hidden = true;
        reviewExportProgressFill.style.width = '0%';
        if (reviewExportProgressBar) {
            reviewExportProgressBar.setAttribute('aria-valuenow', '0');
        }
        if (reviewExportProgressPercent) {
            reviewExportProgressPercent.textContent = '0%';
        }
        if (reviewExportProgressLabel) {
            reviewExportProgressLabel.textContent = 'Preparing review package…';
        }
    }

    function handleCaptureProgress(progress, exportKind) {
        if (!progress) return;
        if (exportKind === 'review') {
            if (progress.phase === 'complete') {
                setReviewExportProgress(100, 'Review package ready — download starting…');
                setStatus('Client review ZIP downloaded');
                return;
            }
            if (progress.phase === 'packaging') {
                setReviewExportProgress(94, 'Packaging review ZIP…');
                setStatus('Packaging client review ZIP…');
                return;
            }
            if (progress.phase === 'pdf') {
                setReviewExportProgress(90, 'Building review PDF…');
                setStatus('Building client review PDF…');
                return;
            }
            if (progress.phase === 'start') {
                const total = progress.total || 1;
                setReviewExportProgress(5, `Getting ready — ${total} section${total === 1 ? '' : 's'} to capture…`);
                setStatus('Preparing homepage screenshots for client review…');
                return;
            }
            if (progress.phase === 'capture-start') {
                const label = progress.label || 'section';
                const current = progress.current || 1;
                const total = progress.total || 1;
                const percent = 6 + Math.round(((current - 1) / total) * 84);
                setReviewExportProgress(
                    percent,
                    `Capturing ${label} (${current} of ${total})…`,
                );
                setStatus(`Capturing ${label} (${current}/${total})…`);
                return;
            }
            const label = progress.label || 'section';
            const current = progress.current || 0;
            const total = progress.total || 1;
            const percent = 8 + Math.round((current / total) * 84);
            setReviewExportProgress(
                percent,
                `Capturing ${label} (${current} of ${total})…`,
            );
            setStatus(`Capturing ${label} (${current}/${total})…`);
            return;
        }
        if (progress.phase === 'packaging') {
            setStatus('Building PDF and handoff ZIP…');
            return;
        }
        const label = progress.label || 'section';
        setStatus(`Capturing ${label} (${progress.current}/${progress.total})…`);
    }

    function setClientReviewLoading(isLoading) {
        if (!clientReviewBtn) return;
        captureBusy = isLoading;
        if (isLoading) {
            clientReviewBtn.disabled = true;
            clientReviewBtn.classList.remove('is-evolved');
            clientReviewBtn.classList.add('is-exporting');
            clientReviewBtn.setAttribute('aria-busy', 'true');
            clientReviewBtn.innerHTML = '<span class="export-spinner" aria-hidden="true"></span><span class="export-btn-text">Building review…</span>';
            setCaptureButtonsDisabled(true);
            setReviewExportProgress(2, 'Preparing homepage for capture…');
            setStatus('Preparing homepage screenshots for client review…');
            return;
        }
        clientReviewBtn.classList.remove('is-exporting');
        clientReviewBtn.removeAttribute('aria-busy');
        if (state.reviewExported) {
            renderClientReviewButtonAsLevelUp();
        } else {
            clientReviewBtn.classList.remove('is-evolved');
            clientReviewBtn.textContent = CLIENT_REVIEW_BTN_LABEL;
            clientReviewBtn.removeAttribute('aria-label');
        }
        setCaptureButtonsDisabled(false);
        resetReviewExportProgress();
    }

    function getReviewHeaderElement() {
        if (templateDesign === 'spotlight') return showroomHeaderSpotlight;
        if (templateDesign === 'gallery') return showroomHeaderGallery;
        return showroomHeaderClassic || headerRoot;
    }

    function buildNavCatalogForReview() {
        if (templateDesign === 'gallery') {
            const links = (state.galleryMainNavLinks || []).filter((link) => link.label || link.url);
            if (!links.length) return [];
            return [{
                id: 'gallery-main-nav',
                label: 'Main navigation',
                url: '',
                subcategories: links.map((link) => ({
                    id: link.id,
                    label: link.label || 'Link',
                    url: link.url || '',
                })),
            }];
        }

        return (state.mainNavItems || [])
            .map((item) => ({
                id: item.id,
                label: item.label || 'Category',
                url: item.url || '',
                subcategories: (item.subcategories || [])
                    .filter((sub) => sub.visible !== false)
                    .map((sub) => ({
                        id: sub.id,
                        label: sub.label || 'Link',
                        url: sub.url || '',
                    })),
            }))
            .filter((item) => item.label);
    }

    function buildClientReviewSections() {
        const sections = [];
        const pushSection = (id, label, el, extra) => {
            if (el) sections.push({ id, label, el, ...(extra || {}) });
        };

        if (templateDesign === 'spotlight') {
            pushSection('header', 'Header', showroomHeaderSpotlight);
            pushSection('hero', 'Hero', showroomHeroSpotlight);
            pushSection('on-sale', 'On Sale', spotlightOnSaleRoot);
            pushSection('shop-by-room', 'Shop by Room', spotlightShopByRoomRoot);
            pushSection('about-us', 'About Us', spotlightAboutRoot);
            pushSection('categories', 'Categories', spotlightCategoryRoot);
            pushSection('brands', 'Brands', spotlightBrandsRoot);
            pushSection('newsletter', 'Newsletter', spotlightNewsletterRoot);
            pushSection('footer', 'Footer', spotlightFooterRoot);
            return sections;
        }

        if (templateDesign === 'gallery') {
            pushSection('header', 'Header', showroomHeaderGallery || headerRoot);
            pushSection('hero', 'Hero', galleryHeroLayoutRoot);
            pushSection('catalog-highlights', 'Catalog Highlights', galleryCatalogRoot);
            pushSection('footer', 'Footer', classicFooterRoot);
            pushSection('copyright', 'Copyright', classicCopyrightRoot);
            return sections;
        }

        pushSection('header', 'Header', getReviewHeaderElement());
        pushSection('hero', 'Hero', heroRoot);
        pushSection('featured-categories', 'Featured Categories', categoriesRoot);
        pushSection('about-us', 'About Us', aboutRoot);
        pushSection('feature-cards', 'Feature Cards', featureTilesRoot);
        if (state.sketchSectionVisible) {
            pushSection('sketch-section', 'Sketch Section', sketchRoot);
        }
        pushSection('you-may-like', 'You May Like', youMayLikeRoot);
        pushSection('get-inspired', 'Get Inspired', getInspiredRoot);
        pushSection('footer', 'Footer', footerRoot);
        return sections;
    }

    function slugifyExportBasename(text) {
        return String(text || 'showroom')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 48) || 'showroom';
    }

    function getHandoffCompanyName() {
        const fromCompanyInfo = fields.footerCompanyName
            ? fields.footerCompanyName.value.trim()
            : String(state.footerCompanyName || '').trim();
        if (fromCompanyInfo) return fromCompanyInfo;

        if (templateDesign === 'gallery') {
            const fromClassicFooter = fields.classicFooterCompanyName
                ? fields.classicFooterCompanyName.value.trim()
                : String(state.classicFooterCompanyName || '').trim();
            if (fromClassicFooter) return fromClassicFooter;
        }
        if (templateDesign === 'spotlight') {
            const fromSpotlightFooter = String(state.spotlightFooterCompanyName || '').trim();
            if (fromSpotlightFooter) return fromSpotlightFooter;
        }
        return DEFAULT_FOOTER_COMPANY;
    }

    function buildExportFilenames(companyName, kind) {
        const slug = slugifyExportBasename(companyName);
        if (kind === 'review') {
            return {
                pdfFilename: `${slug}-homepage-review.pdf`,
                zipFilename: `${slug}-client-review.zip`,
            };
        }
        return {
            pdfFilename: `${slug}-homepage-handoff.pdf`,
            zipFilename: `${slug}-homepage-handoff.zip`,
        };
    }

    async function preparePreviewForCapture() {
        if (templateDesign === 'gallery') {
            ensureGalleryImageDefaults();
            readClassicFooterLinksFromEditor();
            readForm();
        } else if (templateDesign === 'spotlight') {
            readSpotlightExportForm();
        } else {
            readYouMayLikeFieldsFromEditor();
            readGetInspiredFieldsFromEditor();
            readMainNavFromEditor();
            readForm();
        }
        syncPreview();

        const prevTransform = previewRoot.style.transform;
        const prevScrollTop = previewWrap ? previewWrap.scrollTop : 0;
        const prevScrollLeft = previewWrap ? previewWrap.scrollLeft : 0;
        previewRoot.style.transform = 'none';
        previewRoot.classList.add('is-pdf-export-capture');
        if (previewScaler) previewScaler.style.height = '';
        if (previewWrap) {
            previewWrap.scrollTop = 0;
            previewWrap.scrollLeft = 0;
        }
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        return function restorePreviewAfterCapture() {
            previewRoot.style.transform = prevTransform;
            previewRoot.classList.remove('is-pdf-export-capture');
            if (previewWrap) {
                previewWrap.scrollTop = prevScrollTop;
                previewWrap.scrollLeft = prevScrollLeft;
            }
            fitPreviewScale();
        };
    }

    function clampPreviewScroll() {
        if (!previewWrap) return;
        const maxScroll = Math.max(0, previewWrap.scrollHeight - previewWrap.clientHeight);
        if (previewWrap.scrollTop > maxScroll) {
            previewWrap.scrollTop = maxScroll;
        }
    }

    let previewFitRaf = null;
    let previewResizeObserver = null;

    function scheduleFitPreviewScale() {
        if (previewFitRaf) cancelAnimationFrame(previewFitRaf);
        previewFitRaf = requestAnimationFrame(() => {
            previewFitRaf = requestAnimationFrame(fitPreviewScale);
        });
    }

    function fitPreviewScale() {
        if (!previewWrap || !previewRoot || !previewScaler) return;

        const available = Math.max(0, previewWrap.clientWidth - 48);
        if (available <= 0) return;

        const scale = Math.min(1, available / TEMPLATE_FRAME_WIDTH);
        previewRoot.style.transform = scale < 1 ? `scale(${scale})` : '';
        previewScaler.style.height = `${previewRoot.offsetHeight * scale}px`;
        requestAnimationFrame(clampPreviewScroll);
    }

    function bindPreviewResizeObserver() {
        if (!previewRoot || typeof ResizeObserver === 'undefined') return;

        if (previewResizeObserver) previewResizeObserver.disconnect();

        previewResizeObserver = new ResizeObserver(() => {
            scheduleFitPreviewScale();
        });
        previewResizeObserver.observe(previewRoot);
    }

    function scrollEditorPanelTo(selector) {
        if (!editorPanel || !selector) return null;

        const target = document.querySelector(selector);
        if (!target) return null;

        const offset = target.getBoundingClientRect().top
            - editorPanel.getBoundingClientRect().top
            + editorPanel.scrollTop
            - 8;
        editorPanel.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
        return target;
    }

    function flashJumpTarget(target) {
        if (!target) return;

        target.classList.remove('is-jump-highlight');
        void target.offsetWidth;
        target.classList.add('is-jump-highlight');
        window.setTimeout(() => target.classList.remove('is-jump-highlight'), 1400);
    }

    const PREVIEW_SECTION_JUMP_TARGETS = [
        {
            previewId: 'showroomGalleryCatalogSection',
            editorSectionId: 'editor-section-gallery-catalog',
            template: 'gallery',
        },
        { previewId: 'showroomHeaderSection', editorSectionId: 'editor-section-header' },
        { previewId: 'showroomHeroSection', editorSectionId: 'editor-section-hero' },
        {
            previewId: 'showroomCategoriesSection',
            editorSectionId: 'editor-section-featured-categories',
            template: 'classic',
        },
        { previewId: 'showroomAboutSection', editorSectionId: 'editor-section-about-us', template: 'classic' },
        {
            previewId: 'showroomFeatureTilesSection',
            editorSectionId: 'editor-section-feature-cards',
            template: 'classic',
        },
        {
            previewId: 'showroomSketchSection',
            editorSectionId: 'editor-section-sketch-section',
            template: 'classic',
        },
        {
            previewId: 'showroomYouMayLikeSection',
            editorSectionId: 'editor-section-you-may-like',
            template: 'classic',
        },
        {
            previewId: 'showroomGetInspiredSection',
            editorSectionId: 'editor-section-get-inspired',
            template: 'classic',
        },
        { previewId: 'showroomFooterSection', editorSectionId: 'editor-section-footer', template: 'classic' },
        {
            previewId: 'showroomFooterClassicSection',
            editorSectionId: 'editor-section-footer-classic',
            template: 'gallery',
        },
        {
            previewId: 'showroomCopyrightClassicSection',
            editorSectionId: 'editor-section-copyright-classic',
            template: 'gallery',
        },
        {
            previewId: 'showroomSpotlightOnSaleSection',
            editorSectionId: 'editor-section-spotlight-on-sale',
            template: 'spotlight',
        },
        {
            previewId: 'showroomSpotlightShopByRoomSection',
            editorSectionId: 'editor-section-spotlight-shop-by-room',
            template: 'spotlight',
        },
        {
            previewId: 'showroomSpotlightAboutSection',
            editorSectionId: 'editor-section-spotlight-about',
            template: 'spotlight',
        },
        {
            previewId: 'showroomSpotlightCategorySection',
            editorSectionId: 'editor-section-spotlight-category',
            template: 'spotlight',
        },
        {
            previewId: 'showroomSpotlightBrandsSection',
            editorSectionId: 'editor-section-spotlight-brands',
            template: 'spotlight',
        },
        {
            previewId: 'showroomSpotlightNewsletterSection',
            editorSectionId: 'editor-section-spotlight-newsletter',
            template: 'spotlight',
        },
        {
            previewId: 'showroomSpotlightFooterSection',
            editorSectionId: 'editor-section-spotlight-footer',
            template: 'spotlight',
        },
    ];

    function isPreviewJumpTargetActive(mapping) {
        if (mapping.template === 'gallery' && templateDesign !== 'gallery') return false;
        if (mapping.template === 'classic' && templateDesign !== 'classic') return false;
        if (mapping.template === 'spotlight' && templateDesign !== 'spotlight') return false;

        const el = document.getElementById(mapping.previewId);
        if (!el || el.hidden) return false;

        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function markPreviewJumpTargets() {
        PREVIEW_SECTION_JUMP_TARGETS.forEach((mapping) => {
            const el = document.getElementById(mapping.previewId);
            if (!el) return;
            el.classList.toggle('editor-preview-jump-target', isPreviewJumpTargetActive(mapping));
        });
    }

    function resolvePreviewEditorSection(clickTarget) {
        if (!clickTarget || !previewRoot) return null;

        for (const mapping of PREVIEW_SECTION_JUMP_TARGETS) {
            if (!isPreviewJumpTargetActive(mapping)) continue;

            const section = document.getElementById(mapping.previewId);
            if (section && section.contains(clickTarget)) {
                return mapping.editorSectionId;
            }
        }

        return null;
    }

    function shouldIgnorePreviewJumpClick(target) {
        if (!target) return true;
        if (target.closest('.showroom-you-may-like-nav')) return true;
        if (target.closest('button, input, textarea, select')) return true;
        if (previewRoot?.classList.contains('is-pdf-export-capture')) return true;
        return false;
    }

    function jumpToEditorSection(sectionId) {
        if (!sectionId || !editorPanel) return false;

        const heading = document.getElementById(sectionId);
        const block = editorPanel.querySelector(`.editor-panel-block[data-section-id="${sectionId}"]`);
        if (!heading && !block) return false;

        if (heading && heading.tagName === 'DETAILS' && !heading.open) {
            heading.open = true;
        }

        scrollEditorPanelTo(`#${sectionId}`);
        setActiveEditorSection(sectionId);
        flashJumpTarget(block || heading);
        return true;
    }

    function jumpToEditorTarget(selector) {
        if (!selector || !editorPanel) return false;

        const target = document.querySelector(selector);
        if (!target) return false;

        const highlightTarget = target.closest('.editor-gallery-catalog-tile-group')
            || target.closest('.editor-field')
            || target.closest('.editor-fieldset')
            || target;
        const block = target.closest('.editor-panel-block');
        const sectionId = block?.dataset?.sectionId
            || target.closest('.editor-panel-section')?.id;

        scrollEditorPanelTo(selector);
        if (sectionId) setActiveEditorSection(sectionId);
        flashJumpTarget(highlightTarget);
        return true;
    }

    function resolvePreviewImageEditorJump(clickTarget) {
        if (!clickTarget) return null;
        const jumpEl = clickTarget.closest('[data-editor-jump-target]');
        if (!jumpEl) return null;
        const selector = jumpEl.getAttribute('data-editor-jump-target');
        return selector || null;
    }

    function markPreviewImageJumpTargets() {
        if (!previewRoot) return;
        previewRoot.querySelectorAll('[data-editor-jump-target]').forEach((el) => {
            el.classList.add('editor-preview-image-jump-target');
        });
    }

    function bindPreviewSectionJump() {
        if (!previewRoot) return;

        previewRoot.addEventListener('click', (event) => {
            if (shouldIgnorePreviewJumpClick(event.target)) return;

            const imageJumpSelector = resolvePreviewImageEditorJump(event.target);
            if (imageJumpSelector && jumpToEditorTarget(imageJumpSelector)) {
                event.preventDefault();
                return;
            }

            const sectionId = resolvePreviewEditorSection(event.target);
            if (!sectionId) return;

            event.preventDefault();
            jumpToEditorSection(sectionId);
        });
    }

    function structureEditorPanel() {
        if (!editorPanel) return;

        const firstSection = editorPanel.querySelector('.editor-panel-section');
        if (!firstSection) return;

        const intro = document.createElement('div');
        intro.className = 'editor-panel-intro';
        let node = editorPanel.firstElementChild;
        while (node && node !== firstSection) {
            const next = node.nextElementSibling;
            intro.appendChild(node);
            node = next;
        }
        editorPanel.insertBefore(intro, firstSection);

        const sectionHeadings = [...editorPanel.querySelectorAll('.editor-panel-section')];
        sectionHeadings.forEach((heading) => {
            const block = document.createElement('div');
            block.className = 'editor-panel-block';
            block.dataset.sectionId = heading.id;
            editorPanel.insertBefore(block, heading);
            block.appendChild(heading);

            let next = block.nextElementSibling;
            while (next && !next.classList.contains('editor-panel-section')) {
                const toMove = next;
                next = next.nextElementSibling;
                block.appendChild(toMove);
            }
        });
    }

    function setActiveEditorSection(sectionId) {
        if (!editorSectionNav || !editorPanel) return;

        editorPanel.querySelectorAll('.editor-panel-block').forEach((block) => {
            block.classList.toggle('is-active', block.dataset.sectionId === sectionId);
        });
        editorSectionNav.querySelectorAll('.editor-section-nav-link').forEach((link) => {
            if (link.hidden || link.offsetParent === null) return;
            link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`);
        });
    }

    function bindSectionScrollSpy() {
        if (!editorSectionNav || !editorPanel) return;

        const updateActiveSection = () => {
            const blocks = [...editorPanel.querySelectorAll('.editor-panel-block')].filter((block) => !block.hidden);
            if (!blocks.length) return;

            const scrollTop = editorPanel.scrollTop;
            const offset = 48;
            let activeBlock = blocks[0];

            blocks.forEach((block) => {
                if (block.offsetTop - offset <= scrollTop) {
                    activeBlock = block;
                }
            });

            setActiveEditorSection(activeBlock.dataset.sectionId);
        };

        editorPanel.addEventListener('scroll', updateActiveSection, { passive: true });
        refreshEditorSectionNavSpy = updateActiveSection;
        updateActiveSection();
    }

    function bindSectionNav() {
        if (!editorSectionNav || !editorPanel) return;

        editorSectionNav.querySelectorAll('.editor-section-nav-link').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const selector = link.getAttribute('href');
                const sectionId = selector ? selector.slice(1) : '';
                jumpToEditorSection(sectionId);
            });
        });
    }

    function renderHeaderJumpNav() {
        if (!headerJumpNav) return;

        const selectedValue = headerJumpNav.value;

        if (templateDesign === 'gallery') {
            headerJumpNav.innerHTML = (
                `<option value="">Choose a header area…</option>
                <option value="#editor-gallery-top-bar">Top bar</option>
                <option value="#editor-gallery-utils">Top bar links</option>
                <option value="#editor-gallery-logo">Company logo</option>
                <option value="#editor-gallery-main-nav">Main navigation</option>`
            );
        } else {
            const navOptions = state.mainNavItems.map((category) => (
                `<option value="#editor-main-nav-${category.id}">${escapeHtml(category.label || 'Category')}</option>`
            )).join('');

            headerJumpNav.innerHTML = (
                `<option value="">Choose a header area…</option>
                <option value="#editor-header-banner">Top banner</option>
                <option value="#editor-header-logo">Company logo</option>
                <optgroup label="Main navigation">${navOptions}</optgroup>`
            );
        }

        if (selectedValue && headerJumpNav.querySelector(`option[value="${selectedValue}"]`)) {
            headerJumpNav.value = selectedValue;
        }
    }

    function bindHeaderJumpNav() {
        if (!headerJumpNav) return;

        headerJumpNav.addEventListener('change', () => {
            const selector = headerJumpNav.value;
            if (!selector) return;

            const target = scrollEditorPanelTo(selector);
            flashJumpTarget(target);
            headerJumpNav.value = '';
        });
    }

    function bindPreviewScroll() {
        if (!previewWrap) return;
        previewWrap.addEventListener('scroll', clampPreviewScroll, { passive: true });
    }

    function flushSessionToStorage() {
        if (templateDesign === 'gallery') {
            readClassicFooterLinksFromEditor();
        } else if (templateDesign === 'spotlight') {
            readSpotlightExportForm();
        } else {
            readYouMayLikeFieldsFromEditor();
            readGetInspiredFieldsFromEditor();
            readMainNavFromEditor();
        }
        readForm();
        saveState({ silent: true });
    }

    function restoreStateFromBaseline() {
        if (!baselineState) return false;

        const baseline = JSON.parse(JSON.stringify(baselineState));
        Object.keys(state).forEach((key) => {
            delete state[key];
        });
        Object.assign(state, baseline, {
            reviewedSections: [],
            handoffExported: false,
            reviewExported: false,
            previewTheme: baseline.previewTheme === 'dark' ? 'dark' : 'light',
        });
        return true;
    }

    function resetToDefaults() {
        if (!confirm('Reset all fields to the original template defaults? Your saved draft will be overwritten.')) {
            return;
        }

        if (!restoreStateFromBaseline()) {
            setStatus('Could not reset — defaults not available');
            return;
        }

        populateForm(state);
        resetExportButton();
        resetClientReviewButton();

        if (templateDesign === 'gallery') {
            finishGalleryEditorInit();
        } else if (templateDesign === 'spotlight') {
            finishSpotlightEditorInit();
        } else {
            finishClassicEditorInit();
        }

        saveState({ silent: true });
        setStatus('Reset to defaults');
    }

    function initResetBtn() {
        if (!resetBtn) return;
        resetBtn.style.display = '';
        resetBtn.addEventListener('click', resetToDefaults);
    }

    function saveState(options = {}) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            if (window.EditorProgressDock) {
                EditorProgressDock.update();
            }
            if (!options.silent) {
                setStatus('Draft saved');
            }
        } catch {
            setStatus('Could not save draft (storage full?)');
        }
    }

    function loadBaselineState() {
        try {
            const raw = localStorage.getItem(BASELINE_STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch { /* ignore */ }
        return null;
    }

    function persistBaselineState(baseline) {
        baselineState = baseline;
        try {
            localStorage.setItem(BASELINE_STORAGE_KEY, JSON.stringify(baseline));
        } catch { /* ignore */ }
    }

    async function loadTemplateDefaultsPayload() {
        try {
            const res = await fetch('../data/template-defaults.json');
            if (res.ok) {
                const data = await res.json();
                return data.showroom || {};
            }
        } catch { /* ignore */ }
        return {};
    }

    async function captureBaselineFromFactoryDefaults() {
        const defaultsPayload = await loadTemplateDefaultsPayload();
        populateForm(defaultsPayload);
        if (templateDesign === 'gallery') {
            ensureGalleryImageDefaults();
        } else if (templateDesign === 'classic') {
            ensureClassicImageDefaults();
        }
        persistBaselineState(JSON.parse(JSON.stringify(state)));
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return normalizeLegacyCompanyDefaults(JSON.parse(raw));
        } catch { /* ignore */ }
        return null;
    }

    function normalizeLegacyCompanyDefaults(data) {
        if (!data || typeof data !== 'object') return data;
        if (data.footerCompanyName === 'Aldervaan Lighting') {
            data.footerCompanyName = DEFAULT_FOOTER_COMPANY;
        }
        if (data.classicFooterCompanyName === 'Aldervaan Lighting') {
            data.classicFooterCompanyName = DEFAULT_FOOTER_COMPANY;
        }
        return data;
    }

    function ensureGalleryImageDefaults() {
        if (templateDesign !== 'gallery') return;

        if (!savedGalleryImageRef(state.headerLogoImage)) {
            state.headerLogoImage = DEFAULT_GALLERY_HEADER_LOGO;
        }

        state.galleryHeroPrimaryImage = resolveGalleryHeroImage(
            state.galleryHeroPrimaryImage,
            DEFAULT_GALLERY_HERO_PRIMARY,
        );
        state.galleryHeroSecondaryTopImage = resolveGalleryHeroImage(
            state.galleryHeroSecondaryTopImage,
            DEFAULT_GALLERY_HERO_SECONDARY_TOP,
        );
        state.galleryHeroSecondaryBottomImage = resolveGalleryHeroImage(
            state.galleryHeroSecondaryBottomImage,
            DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM,
        );

        if (!Array.isArray(state.galleryCatalogTiles) || state.galleryCatalogTiles.length === 0) {
            state.galleryCatalogTiles = defaultGalleryCatalogTiles();
        } else {
            state.galleryCatalogTiles = GALLERY_CATALOG_TILE_DEFAULTS.map((defaults) => {
                const saved = state.galleryCatalogTiles.find((tile) => tile.id === defaults.id) || {};
                return {
                    id: defaults.id,
                    label: String(saved.label || defaults.label).trim() || defaults.label,
                    url: String(saved.url || defaults.defaultUrl).trim() || defaults.defaultUrl,
                    image: savedGalleryImageRef(saved.image) || defaults.defaultImage || '',
                };
            });
        }
    }

    function migrateLoadedGalleryState(saved) {
        if (templateDesign !== 'gallery' || !saved || typeof saved !== 'object') {
            return saved;
        }

        return {
            ...saved,
            headerLogoImage: savedGalleryImageRef(saved.headerLogoImage) || DEFAULT_GALLERY_HEADER_LOGO,
            galleryHeroPrimaryImage: resolveGalleryHeroImage(
                saved.galleryHeroPrimaryImage,
                DEFAULT_GALLERY_HERO_PRIMARY,
            ),
            galleryHeroSecondaryTopImage: resolveGalleryHeroImage(
                saved.galleryHeroSecondaryTopImage,
                DEFAULT_GALLERY_HERO_SECONDARY_TOP,
            ),
            galleryHeroSecondaryBottomImage: resolveGalleryHeroImage(
                saved.galleryHeroSecondaryBottomImage,
                DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM,
            ),
            galleryCatalogTiles: migrateGalleryCatalogTiles(saved),
        };
    }

    function syncGalleryPreview() {
        syncGalleryHeaderPreview();
        syncGalleryHeroPreview();
        syncGalleryCatalogPreview();
        syncClassicFooterPreview();
        syncClassicCopyrightPreview();
    }

    function resolveEditorAssetPath(path) {
        const trimmed = String(path || '').trim();
        if (!trimmed || trimmed.startsWith('data:') || /^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }
        if (trimmed.startsWith('spotlight/')) {
            return `Spotlight/${trimmed.slice('spotlight/'.length)}`;
        }
        return trimmed;
    }

    function applyImage(targetImg, placeholderWrap, dataUrl) {
        const resolved = resolveEditorAssetPath(dataUrl);
        if (resolved) {
            targetImg.src = resolved;
            targetImg.hidden = false;
            if (placeholderWrap) placeholderWrap.classList.remove('is-empty');
        } else {
            targetImg.removeAttribute('src');
            targetImg.hidden = true;
            if (placeholderWrap) placeholderWrap.classList.add('is-empty');
        }
    }

    function syncGalleryHeroUploadPreviews() {
        const previews = [
            [uploadPreviewGalleryHeroPrimary, state.galleryHeroPrimaryImage],
            [uploadPreviewGalleryHeroSecondaryTop, state.galleryHeroSecondaryTopImage],
            [uploadPreviewGalleryHeroSecondaryBottom, state.galleryHeroSecondaryBottomImage],
        ];
        previews.forEach(([el, src]) => setUploadPreviewImage(el, src));
    }

    function resolveGalleryHeroHeadlineLine(value, fallback) {
        if (typeof value === 'string') return value.trim();
        return fallback;
    }

    function syncGalleryHeroHeadlinePreview() {
        const headlineLines = [
            [previewGalleryHeroHeadlineLine1, resolveGalleryHeroHeadlineLine(
                state.galleryHeroHeadlineLine1,
                DEFAULT_GALLERY_HERO_HEADLINE_1,
            )],
            [previewGalleryHeroHeadlineLine2, resolveGalleryHeroHeadlineLine(state.galleryHeroHeadlineLine2, '')],
            [previewGalleryHeroHeadlineLine3, resolveGalleryHeroHeadlineLine(state.galleryHeroHeadlineLine3, '')],
        ];

        headlineLines.forEach(([element, text]) => {
            if (!element) return;
            element.textContent = text;
            element.hidden = !text;
        });

        const headlineWrap = previewGalleryHeroHeadlineLine1?.parentElement;
        if (headlineWrap) {
            headlineWrap.hidden = headlineLines.every(([, text]) => !text);
        }
    }

    function syncGalleryHeroOverlayPreview() {
        syncGalleryHeroHeadlinePreview();

        const copy = state.galleryHeroCopy || DEFAULT_GALLERY_HERO_COPY;
        const buttonLabel = state.galleryHeroButtonLabel || DEFAULT_GALLERY_HERO_BUTTON_LABEL;
        const buttonUrl = state.galleryHeroButtonUrl || DEFAULT_GALLERY_HERO_BUTTON_URL;
        const buttonBg = normalizeHexColor(
            state.galleryHeroButtonBackgroundColor,
            DEFAULT_GALLERY_HERO_BUTTON_BG,
        );
        const buttonText = normalizeHexColor(
            state.galleryHeroButtonTextColor,
            DEFAULT_GALLERY_HERO_BUTTON_TEXT,
        );

        state.galleryHeroButtonBackgroundColor = buttonBg;
        state.galleryHeroButtonTextColor = buttonText;

        if (previewGalleryHeroCopy) previewGalleryHeroCopy.textContent = copy;
        if (previewGalleryHeroCta) {
            previewGalleryHeroCta.textContent = buttonLabel;
            previewGalleryHeroCta.href = buttonUrl || '#';
            if (isGalleryDarkPreview()) {
                previewGalleryHeroCta.style.backgroundColor = '';
                previewGalleryHeroCta.style.color = '';
            } else {
                previewGalleryHeroCta.style.backgroundColor = buttonBg;
                previewGalleryHeroCta.style.color = buttonText;
            }
        }

        if (fields.galleryHeroButtonBackgroundColor) {
            fields.galleryHeroButtonBackgroundColor.value = buttonBg;
            if (fields.galleryHeroButtonBackgroundColorValue) {
                fields.galleryHeroButtonBackgroundColorValue.textContent = buttonBg;
            }
        }
        if (fields.galleryHeroButtonTextColor) {
            fields.galleryHeroButtonTextColor.value = buttonText;
            if (fields.galleryHeroButtonTextColorValue) {
                fields.galleryHeroButtonTextColorValue.textContent = buttonText;
            }
        }

        const secondaryTopHeading = state.galleryHeroSecondaryTopHeading || DEFAULT_GALLERY_HERO_SECONDARY_TOP_HEADING;
        const secondaryTopUrl = state.galleryHeroSecondaryTopUrl || DEFAULT_GALLERY_HERO_SECONDARY_TOP_URL;
        if (previewGalleryHeroSecondaryTopHeading) {
            previewGalleryHeroSecondaryTopHeading.textContent = secondaryTopHeading;
        }
        if (previewGalleryHeroSecondaryTopLink) {
            previewGalleryHeroSecondaryTopLink.href = secondaryTopUrl || '#';
        }

        const secondaryBottomHeading = state.galleryHeroSecondaryBottomHeading
            || DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_HEADING;
        const secondaryBottomUrl = state.galleryHeroSecondaryBottomUrl || DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_URL;
        if (previewGalleryHeroSecondaryBottomHeading) {
            previewGalleryHeroSecondaryBottomHeading.textContent = secondaryBottomHeading;
        }
        if (previewGalleryHeroSecondaryBottomLink) {
            previewGalleryHeroSecondaryBottomLink.href = secondaryBottomUrl || '#';
        }
    }

    function syncGalleryHeroPreview() {
        applyImage(
            previewGalleryHeroPrimaryImage,
            previewGalleryHeroPrimary,
            state.galleryHeroPrimaryImage,
        );
        applyImage(
            previewGalleryHeroSecondaryTopImage,
            previewGalleryHeroSecondaryTop,
            state.galleryHeroSecondaryTopImage,
        );
        applyImage(
            previewGalleryHeroSecondaryBottomImage,
            previewGalleryHeroSecondaryBottom,
            state.galleryHeroSecondaryBottomImage,
        );
        syncGalleryHeroOverlayPreview();
        syncGalleryHeroUploadPreviews();
    }

    function savedGalleryImageRef(src) {
        const trimmed = String(src || '').trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('data:')) return trimmed;
        if (trimmed.startsWith('assets/gallery/')) {
            return `gallery/${trimmed.slice('assets/gallery/'.length)}`;
        }
        if (trimmed.startsWith('gallery/')) return trimmed;
        return '';
    }

    function isGalleryClientImage(src, defaultPath) {
        const trimmed = String(src || '').trim();
        if (!trimmed) return false;
        if (trimmed.startsWith('data:')) return true;
        const ref = savedGalleryImageRef(trimmed);
        return Boolean(ref && ref !== String(defaultPath || '').trim());
    }

    function savedClassicImageRef(src) {
        const trimmed = String(src || '').trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('data:')) return trimmed;
        if (trimmed.startsWith('assets/')) {
            return `${CLASSIC_IMAGE_DIR}${trimmed.slice('assets/'.length)}`;
        }
        if (trimmed.startsWith('classic/')) return trimmed;
        return '';
    }

    function resolveClassicImage(saved, fallback) {
        return savedClassicImageRef(saved) || fallback;
    }

    function migrateClassicHeroImages(productImage, lifestyleImage) {
        const product = savedClassicImageRef(productImage);
        const lifestyle = savedClassicImageRef(lifestyleImage);
        const swappedProductDefault = `${CLASSIC_IMAGE_DIR}Gemma_FR33738VBZ_H_Models-min.jpg`;
        const swappedLifestyleDefault = `${CLASSIC_IMAGE_DIR}gemma.jpg`;

        if (product === swappedProductDefault && lifestyle === swappedLifestyleDefault) {
            return {
                productImage: swappedLifestyleDefault,
                lifestyleImage: swappedProductDefault,
            };
        }

        return { productImage, lifestyleImage };
    }

    function ensureClassicImageDefaults() {
        if (templateDesign === 'gallery' || templateDesign === 'spotlight') return;

        if (!savedClassicImageRef(state.headerLogoImage)) {
            state.headerLogoImage = DEFAULT_CLASSIC_HEADER_LOGO;
        }

        state.productImage = resolveClassicImage(state.productImage, DEFAULT_CLASSIC_PRODUCT_IMAGE);
        state.lifestyleImage = resolveClassicImage(state.lifestyleImage, DEFAULT_CLASSIC_LIFESTYLE_IMAGE);
        state.aboutEmployeeImage = resolveClassicImage(
            state.aboutEmployeeImage,
            DEFAULT_CLASSIC_ABOUT_EMPLOYEE_IMAGE,
        );
        state.featureLeftImage = resolveClassicImage(
            state.featureLeftImage,
            DEFAULT_CLASSIC_FEATURE_LEFT_IMAGE,
        );
        state.featureRightImage = resolveClassicImage(
            state.featureRightImage,
            DEFAULT_CLASSIC_FEATURE_RIGHT_IMAGE,
        );
        state.getInspiredLifestyleImage = resolveClassicImage(
            state.getInspiredLifestyleImage,
            DEFAULT_CLASSIC_GET_INSPIRED_LIFESTYLE,
        );
        state.youMayLikeItems = applyYouMayLikeImageDefaults(
            normalizeYouMayLikeItems(state.youMayLikeItems),
        );
    }

    function migrateLoadedClassicState(saved) {
        if (templateDesign === 'gallery' || templateDesign === 'spotlight' || !saved || typeof saved !== 'object') {
            return saved;
        }

        const heroImages = migrateClassicHeroImages(saved.productImage, saved.lifestyleImage);

        return {
            ...saved,
            headerLogoImage: savedClassicImageRef(saved.headerLogoImage) || DEFAULT_CLASSIC_HEADER_LOGO,
            productImage: resolveClassicImage(heroImages.productImage, DEFAULT_CLASSIC_PRODUCT_IMAGE),
            lifestyleImage: resolveClassicImage(heroImages.lifestyleImage, DEFAULT_CLASSIC_LIFESTYLE_IMAGE),
            aboutEmployeeImage: resolveClassicImage(
                saved.aboutEmployeeImage,
                DEFAULT_CLASSIC_ABOUT_EMPLOYEE_IMAGE,
            ),
            featureLeftImage: resolveClassicImage(
                saved.featureLeftImage,
                DEFAULT_CLASSIC_FEATURE_LEFT_IMAGE,
            ),
            featureRightImage: resolveClassicImage(
                saved.featureRightImage,
                DEFAULT_CLASSIC_FEATURE_RIGHT_IMAGE,
            ),
            getInspiredLifestyleImage: resolveClassicImage(
                saved.getInspiredLifestyleImage,
                DEFAULT_CLASSIC_GET_INSPIRED_LIFESTYLE,
            ),
            youMayLikeItems: normalizeYouMayLikeItems(saved.youMayLikeItems),
            previewTheme: saved.previewTheme === 'dark' ? 'dark' : 'light',
        };
    }

    function applyPreviewTheme() {
        const theme = state.previewTheme === 'dark' ? 'dark' : 'light';
        state.previewTheme = theme;

        if (previewRoot) {
            previewRoot.setAttribute('data-preview-theme', theme);
        }

        const themeBar = document.getElementById('editorPreviewTheme');
        if (themeBar) {
            themeBar.querySelectorAll('input[name="previewTheme"]').forEach((radio) => {
                radio.checked = radio.value === theme;
            });
        }

        if (templateDesign === 'spotlight' && window.SpotlightEditor) {
            SpotlightEditor.syncPreview();
        } else if (templateDesign === 'gallery') {
            syncGalleryPreview();
        } else if (templateDesign === 'classic') {
            syncPreview();
        }
    }

    function isGalleryDarkPreview() {
        return state.previewTheme === 'dark' && templateDesign === 'gallery';
    }

    function bindPreviewTheme() {
        const themeBar = document.getElementById('editorPreviewTheme');
        if (!themeBar || themeBar.dataset.bound === 'true') return;
        themeBar.dataset.bound = 'true';

        themeBar.addEventListener('change', (event) => {
            const input = event.target;
            if (!input.matches('input[name="previewTheme"]')) return;
            state.previewTheme = input.value === 'dark' ? 'dark' : 'light';
            applyPreviewTheme();
            saveState({ silent: true });
        });
    }

    function resolveGalleryHeroImage(saved, fallback) {
        return savedGalleryImageRef(saved) || fallback;
    }

    function populateGalleryHeroFields(data) {
        state.galleryHeroPrimaryImage = resolveGalleryHeroImage(
            data.galleryHeroPrimaryImage,
            DEFAULT_GALLERY_HERO_PRIMARY,
        );
        state.galleryHeroSecondaryTopImage = resolveGalleryHeroImage(
            data.galleryHeroSecondaryTopImage,
            DEFAULT_GALLERY_HERO_SECONDARY_TOP,
        );
        state.galleryHeroSecondaryTopHeading = data.galleryHeroSecondaryTopHeading
            || DEFAULT_GALLERY_HERO_SECONDARY_TOP_HEADING;
        state.galleryHeroSecondaryTopUrl = data.galleryHeroSecondaryTopUrl
            || DEFAULT_GALLERY_HERO_SECONDARY_TOP_URL;
        state.galleryHeroSecondaryBottomImage = resolveGalleryHeroImage(
            data.galleryHeroSecondaryBottomImage,
            DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM,
        );
        state.galleryHeroSecondaryBottomHeading = data.galleryHeroSecondaryBottomHeading
            || DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_HEADING;
        state.galleryHeroSecondaryBottomUrl = data.galleryHeroSecondaryBottomUrl
            || DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_URL;
        state.galleryHeroHeadlineLine1 = resolveGalleryHeroHeadlineLine(
            data.galleryHeroHeadlineLine1,
            DEFAULT_GALLERY_HERO_HEADLINE_1,
        );
        state.galleryHeroHeadlineLine2 = resolveGalleryHeroHeadlineLine(data.galleryHeroHeadlineLine2, '');
        state.galleryHeroHeadlineLine3 = resolveGalleryHeroHeadlineLine(data.galleryHeroHeadlineLine3, '');
        state.galleryHeroCopy = data.galleryHeroCopy || DEFAULT_GALLERY_HERO_COPY;
        state.galleryHeroButtonLabel = data.galleryHeroButtonLabel || DEFAULT_GALLERY_HERO_BUTTON_LABEL;
        state.galleryHeroButtonUrl = data.galleryHeroButtonUrl || DEFAULT_GALLERY_HERO_BUTTON_URL;
        state.galleryHeroButtonBackgroundColor = normalizeHexColor(
            data.galleryHeroButtonBackgroundColor,
            DEFAULT_GALLERY_HERO_BUTTON_BG,
        );
        state.galleryHeroButtonTextColor = normalizeHexColor(
            data.galleryHeroButtonTextColor,
            DEFAULT_GALLERY_HERO_BUTTON_TEXT,
        );

        if (fields.galleryHeroHeadlineLine1) {
            fields.galleryHeroHeadlineLine1.value = state.galleryHeroHeadlineLine1;
        }
        if (fields.galleryHeroHeadlineLine2) {
            fields.galleryHeroHeadlineLine2.value = state.galleryHeroHeadlineLine2;
        }
        if (fields.galleryHeroHeadlineLine3) {
            fields.galleryHeroHeadlineLine3.value = state.galleryHeroHeadlineLine3;
        }
        if (fields.galleryHeroCopy) fields.galleryHeroCopy.value = state.galleryHeroCopy;
        if (fields.galleryHeroButtonLabel) {
            fields.galleryHeroButtonLabel.value = state.galleryHeroButtonLabel;
        }
        if (fields.galleryHeroButtonUrl) fields.galleryHeroButtonUrl.value = state.galleryHeroButtonUrl;
        if (fields.galleryHeroSecondaryTopHeading) {
            fields.galleryHeroSecondaryTopHeading.value = state.galleryHeroSecondaryTopHeading;
        }
        if (fields.galleryHeroSecondaryTopUrl) {
            fields.galleryHeroSecondaryTopUrl.value = state.galleryHeroSecondaryTopUrl;
        }
        if (fields.galleryHeroSecondaryBottomHeading) {
            fields.galleryHeroSecondaryBottomHeading.value = state.galleryHeroSecondaryBottomHeading;
        }
        if (fields.galleryHeroSecondaryBottomUrl) {
            fields.galleryHeroSecondaryBottomUrl.value = state.galleryHeroSecondaryBottomUrl;
        }
    }

    function buildGalleryHeroExportSpec() {
        return {
            layout: 'split-lifestyle',
            height: '500 px',
            width: '1479 px',
            alignment: 'Centered · Classic hero',
            columns: 'Large image left · two stacked images right',
            imageFit: 'cover',
            imageDirectory: `editor/${GALLERY_IMAGE_DIR}`,
            primary: {
                label: 'Large lifestyle image (left)',
                filename: 'gallery-hero-primary.jpg',
                overlay: {
                    alignment: 'left',
                    headlineFont: "'Josefin Sans', sans-serif",
                    headlineStyle: 'thin tall sans-serif uppercase',
                    headlineWeight: 200,
                    headline: [
                        resolveGalleryHeroHeadlineLine(
                            state.galleryHeroHeadlineLine1,
                            DEFAULT_GALLERY_HERO_HEADLINE_1,
                        ),
                        resolveGalleryHeroHeadlineLine(state.galleryHeroHeadlineLine2, ''),
                        resolveGalleryHeroHeadlineLine(state.galleryHeroHeadlineLine3, ''),
                    ],
                    copy: state.galleryHeroCopy || DEFAULT_GALLERY_HERO_COPY,
                    button: {
                        label: state.galleryHeroButtonLabel || DEFAULT_GALLERY_HERO_BUTTON_LABEL,
                        url: state.galleryHeroButtonUrl || DEFAULT_GALLERY_HERO_BUTTON_URL,
                        backgroundColor: state.galleryHeroButtonBackgroundColor || DEFAULT_GALLERY_HERO_BUTTON_BG,
                        textColor: state.galleryHeroButtonTextColor || DEFAULT_GALLERY_HERO_BUTTON_TEXT,
                        shape: 'square',
                    },
                },
            },
            secondaryTop: {
                label: 'Lifestyle image (top right)',
                filename: 'gallery-hero-secondary-top.jpg',
                overlay: {
                    alignment: 'left · vertically centered',
                    headlineFont: "'Josefin Sans', sans-serif",
                    headlineStyle: 'thin tall sans-serif uppercase',
                    headlineWeight: 200,
                    heading: state.galleryHeroSecondaryTopHeading || DEFAULT_GALLERY_HERO_SECONDARY_TOP_HEADING,
                    url: state.galleryHeroSecondaryTopUrl || DEFAULT_GALLERY_HERO_SECONDARY_TOP_URL,
                },
            },
            secondaryBottom: {
                label: 'Lifestyle image (bottom right)',
                filename: 'gallery-hero-secondary-bottom.jpg',
                overlay: {
                    alignment: 'left · vertically centered',
                    headlineFont: "'Josefin Sans', sans-serif",
                    headlineStyle: 'thin tall sans-serif uppercase',
                    headlineWeight: 200,
                    heading: state.galleryHeroSecondaryBottomHeading || DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_HEADING,
                    url: state.galleryHeroSecondaryBottomUrl || DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_URL,
                },
            },
        };
    }

    function syncPreview() {
        if (templateDesign === 'spotlight' && window.SpotlightEditor) {
            SpotlightEditor.syncPreview();
            markPreviewJumpTargets();
            markPreviewImageJumpTargets();
            return;
        }

        if (templateDesign === 'gallery') {
            syncGalleryPreview();
        } else {
            preview.title.textContent = state.title || 'Collection title';
            preview.description.textContent = state.description || 'Add a short description for this collection.';
            preview.cta.textContent = state.cta || 'Explore collection';

            const copyBg = normalizeHex(state.copyBackgroundColor);
            const copyText = normalizeHexColor(state.copyTextColor, DEFAULT_HEADER_BANNER_TEXT);
            const isCrystalPreview = state.previewTheme === 'dark' && templateDesign === 'classic';
            if (isCrystalPreview) {
                preview.copy.style.background = '';
                preview.copy.style.backgroundColor = '';
                preview.copy.style.color = '';
                preview.cta.style.background = '';
                preview.cta.style.backgroundColor = '';
                preview.cta.style.color = '';
            } else {
                preview.copy.style.backgroundColor = copyBg;
                preview.copy.style.color = copyText;
                preview.cta.style.backgroundColor = normalizeHexColor(
                    state.heroCtaBackgroundColor,
                    darkenHex(copyBg),
                );
                preview.cta.style.color = normalizeHexColor(state.heroCtaTextColor, DEFAULT_HERO_CTA_TEXT);
            }
            const showHeroCta = state.heroCtaVisible !== false;
            preview.cta.classList.toggle('is-hidden', !showHeroCta);
            preview.cta.hidden = !showHeroCta;
            preview.cta.style.display = showHeroCta ? '' : 'none';

            const heroCtaColorField = document.getElementById('heroCtaColorField');
            if (heroCtaColorField) {
                heroCtaColorField.hidden = !state.heroCtaVisible;
            }

            applyImage(preview.productImage, preview.productPlaceholder, state.productImage);
            applyImage(preview.lifestyleImage, preview.lifestylePlaceholder, state.lifestyleImage);

            if (uploadPreviews.product) {
                uploadPreviews.product.innerHTML = state.productImage
                    ? `<img src="${state.productImage}" alt="">`
                    : '';
                uploadPreviews.product.classList.toggle('is-empty', !state.productImage);
            }
            if (uploadPreviews.lifestyle) {
                uploadPreviews.lifestyle.innerHTML = state.lifestyleImage
                    ? `<img src="${state.lifestyleImage}" alt="">`
                    : '';
                uploadPreviews.lifestyle.classList.toggle('is-empty', !state.lifestyleImage);
            }
        }

        syncCategoriesPreview();
        syncAboutPreview();
        syncFeatureTilesPreview();
        syncSketchPreview();
        syncYouMayLikePreview();
        syncGetInspiredPreview();
        if (templateDesign === 'gallery') {
            syncClassicFooterPreview();
            syncClassicCopyrightPreview();
        } else {
            syncFooterPreview();
            syncHeaderPreview();
        }

        scheduleFitPreviewScale();
    }

    function defaultHeaderBannerLinks() {
        const linkDefaults = templateDesign === 'spotlight' && window.SpotlightEditor?.SPOTLIGHT_HEADER_BANNER_LINKS
            ? window.SpotlightEditor.SPOTLIGHT_HEADER_BANNER_LINKS
            : DEFAULT_HEADER_BANNER_LINKS;
        return linkDefaults.map((link, index) => createFooterLinkItem({
            label: link.label,
            url: link.defaultUrl,
        }, index, 'hbl'));
    }

    function migrateHeaderBannerLinks(data) {
        if (Array.isArray(data.headerBannerLinks) && data.headerBannerLinks.length > 0) {
            return data.headerBannerLinks.map((item, index) => createFooterLinkItem(item, index, 'hbl'));
        }

        if (Array.isArray(data.headerBannerLinks)) {
            return [];
        }

        return defaultHeaderBannerLinks();
    }

    function renderHeaderBannerLinksEditor() {
        renderFooterLinksEditor(headerBannerLinksEditor, state.headerBannerLinks, 'Banner link');
    }

    function readHeaderBannerLinksFromEditor() {
        if (!headerBannerLinksEditor) return;
        headerBannerLinksEditor.querySelectorAll('[data-field]').forEach((input) => {
            const item = state.headerBannerLinks.find((link) => link.id === input.dataset.itemId);
            if (!item) return;
            item[input.dataset.field] = input.value.trim();
        });
    }

    function saveHeaderBannerLinksDraft() {
        readHeaderBannerLinksFromEditor();
        syncHeaderPreview();
        saveState();
    }

    function addHeaderBannerLink() {
        readHeaderBannerLinksFromEditor();
        state.headerBannerLinks.push(createFooterLinkItem({
            label: 'New link',
            url: '/',
        }, state.headerBannerLinks.length, 'hbl'));
        renderHeaderBannerLinksEditor();
        syncHeaderPreview();
        saveState();
        setStatus('Banner link added');
    }

    function removeHeaderBannerLink(id) {
        readHeaderBannerLinksFromEditor();
        state.headerBannerLinks = state.headerBannerLinks.filter((item) => item.id !== id);
        renderHeaderBannerLinksEditor();
        syncHeaderPreview();
        saveState();
        setStatus('Banner link removed');
    }

    function setUploadPreviewImage(container, src) {
        if (!container) return;
        container.innerHTML = '';
        if (!src) {
            container.classList.add('is-empty');
            return;
        }
        container.classList.remove('is-empty');
        const img = document.createElement('img');
        img.src = resolveEditorAssetPath(src);
        img.alt = '';
        container.appendChild(img);
    }

    function defaultGalleryCatalogTiles() {
        return GALLERY_CATALOG_TILE_DEFAULTS.map((tile) => ({
            id: tile.id,
            label: tile.label,
            url: tile.defaultUrl,
            image: tile.defaultImage || '',
        }));
    }

    function migrateGalleryCatalogTiles(data) {
        if (!Array.isArray(data.galleryCatalogTiles) || data.galleryCatalogTiles.length === 0) {
            return defaultGalleryCatalogTiles();
        }

        return GALLERY_CATALOG_TILE_DEFAULTS.map((defaults) => {
            const saved = data.galleryCatalogTiles.find((tile) => tile.id === defaults.id) || {};
            return {
                id: defaults.id,
                label: String(saved.label || defaults.label).trim() || defaults.label,
                url: String(saved.url || defaults.defaultUrl).trim() || defaults.defaultUrl,
                image: savedGalleryImageRef(saved.image) || defaults.defaultImage || '',
            };
        });
    }

    let galleryCatalogDraftSaveTimer = null;

    function readGalleryCatalogTilesFromEditor() {
        if (!galleryCatalogTilesEditor) return;

        galleryCatalogTilesEditor.querySelectorAll('[data-tile-field]').forEach((input) => {
            const tile = state.galleryCatalogTiles.find((item) => item.id === input.dataset.tileId);
            if (!tile) return;
            tile[input.dataset.tileField] = input.value.trim();
        });
    }

    function saveGalleryCatalogTilesDraft(options = {}) {
        readGalleryCatalogTilesFromEditor();
        syncGalleryCatalogPreview({ incremental: true });
        clearTimeout(galleryCatalogDraftSaveTimer);
        galleryCatalogDraftSaveTimer = window.setTimeout(() => {
            saveState({ silent: true });
        }, options.immediate ? 0 : 350);
    }

    function flushGalleryCatalogTilesDraft() {
        clearTimeout(galleryCatalogDraftSaveTimer);
        readGalleryCatalogTilesFromEditor();
        syncGalleryCatalogPreview();
        saveState({ silent: true });
    }

    function renderGalleryCatalogTilesEditor() {
        if (!galleryCatalogTilesEditor) return;

        galleryCatalogTilesEditor.innerHTML = state.galleryCatalogTiles.map((tile, index) => {
            const tileName = tile.label || `Tile ${index + 1}`;
            return (
                `<div class="editor-gallery-catalog-tile-group" data-tile-id="${tile.id}">
                    <p class="editor-gallery-catalog-tile-name">${escapeHtml(tileName)}</p>
                    <div class="editor-field">
                        <label for="fieldGalleryCatalogImage-${tile.id}">Lifestyle image</label>
                        <div class="editor-upload">
                            <div class="editor-upload-preview editor-upload-preview--gallery-catalog-tile is-empty" id="uploadPreviewGalleryCatalog-${tile.id}"></div>
                            <input type="file" id="fieldGalleryCatalogImage-${tile.id}" data-tile-id="${tile.id}" accept="image/*">
                        </div>
                    </div>
                    <div class="editor-field editor-field--compact">
                        <label for="fieldGalleryCatalogLabel-${tile.id}">Label</label>
                        <input type="text" id="fieldGalleryCatalogLabel-${tile.id}" value="${escapeHtml(tile.label)}" data-tile-id="${tile.id}" data-tile-field="label" autocomplete="off">
                    </div>
                    <div class="editor-field editor-field--compact">
                        <label for="fieldGalleryCatalogUrl-${tile.id}">Catalog link</label>
                        <input type="text" id="fieldGalleryCatalogUrl-${tile.id}" value="${escapeHtml(tile.url)}" data-tile-id="${tile.id}" data-tile-field="url" autocomplete="off" placeholder="/catalog/...">
                    </div>
                </div>`
            );
        }).join('');

        state.galleryCatalogTiles.forEach((tile) => {
            setUploadPreviewImage(
                document.getElementById(`uploadPreviewGalleryCatalog-${tile.id}`),
                tile.image,
            );
        });
    }

    function syncGalleryCatalogPreview(options = {}) {
        if (!previewGalleryCatalogGrid) return;

        if (!Array.isArray(state.galleryCatalogTiles) || state.galleryCatalogTiles.length === 0) {
            state.galleryCatalogTiles = defaultGalleryCatalogTiles();
        }

        if (options.incremental && previewGalleryCatalogGrid.childElementCount === state.galleryCatalogTiles.length) {
            state.galleryCatalogTiles.forEach((tile) => {
                const link = previewGalleryCatalogGrid.querySelector(`[data-tile-id="${tile.id}"]`);
                if (!link) return;

                link.href = tile.url || '#';
                link.classList.toggle('is-empty', !tile.image);

                let img = link.querySelector('img');
                if (tile.image) {
                    if (!img) {
                        img = document.createElement('img');
                        img.id = `previewGalleryCatalogTile-${tile.id}`;
                        img.alt = '';
                        link.insertBefore(img, link.firstChild);
                    }
                    if (img.src !== tile.image) img.src = tile.image;
                } else if (img) {
                    img.remove();
                }

                const label = link.querySelector('.showroom-gallery-catalog-tile-label');
                if (label) label.textContent = (tile.label || '').toUpperCase();
            });
            return;
        }

        previewGalleryCatalogGrid.innerHTML = '';

        state.galleryCatalogTiles.forEach((tile) => {
            const link = document.createElement('a');
            link.href = tile.url || '#';
            link.dataset.tileId = tile.id;
            link.className = `showroom-gallery-catalog-tile${tile.image ? '' : ' is-empty'}`;

            if (tile.image) {
                const img = document.createElement('img');
                img.id = `previewGalleryCatalogTile-${tile.id}`;
                img.src = tile.image;
                img.alt = '';
                link.appendChild(img);
            }

            const label = document.createElement('span');
            label.className = 'showroom-gallery-catalog-tile-label';
            label.textContent = (tile.label || '').toUpperCase();
            link.appendChild(label);

            previewGalleryCatalogGrid.appendChild(link);
        });
    }

    function populateGalleryCatalogFields(data) {
        state.galleryCatalogTiles = migrateGalleryCatalogTiles(data);
        renderGalleryCatalogTilesEditor();
    }

    function bindGalleryCatalogEditorEvents() {
        if (!galleryCatalogTilesEditor) return;

        galleryCatalogTilesEditor.addEventListener('input', (event) => {
            if (!event.target.matches('[data-tile-field]')) return;

            if (event.target.dataset.tileField === 'label') {
                const tileName = galleryCatalogTilesEditor.querySelector(
                    `.editor-gallery-catalog-tile-group[data-tile-id="${event.target.dataset.tileId}"] .editor-gallery-catalog-tile-name`,
                );
                if (tileName) {
                    tileName.textContent = event.target.value.trim() || 'Tile';
                }
            }

            saveGalleryCatalogTilesDraft();
        });

        galleryCatalogTilesEditor.addEventListener('focusout', (event) => {
            if (event.target.matches('[data-tile-field]')) {
                flushGalleryCatalogTilesDraft();
            }
        });

        galleryCatalogTilesEditor.addEventListener('change', (event) => {
            const input = event.target;
            if (!input.matches('input[type="file"][data-tile-id]')) return;

            const tileId = input.dataset.tileId;
            onGalleryCatalogTileImageUpload(input, tileId);
        });
    }

    async function onGalleryCatalogTileImageUpload(input, tileId) {
        const file = input.files && input.files[0];
        if (!file) return;

        const tile = state.galleryCatalogTiles.find((item) => item.id === tileId);
        if (!tile) {
            setStatus('Could not find catalog tile.');
            input.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            setStatus('Please choose an image file.');
            input.value = '';
            return;
        }

        if (file.size > FEATURE_IMAGE_MAX_BYTES) {
            setStatus(`Image must be under ${Math.round(FEATURE_IMAGE_MAX_BYTES / (1024 * 1024))} MB.`);
            input.value = '';
            return;
        }

        try {
            readGalleryCatalogTilesFromEditor();
            tile.image = await readFileAsDataUrl(file);
            setUploadPreviewImage(
                document.getElementById(`uploadPreviewGalleryCatalog-${tileId}`),
                tile.image,
            );
            syncGalleryCatalogPreview();
            saveState();
            setStatus('Catalog tile image updated');
        } catch {
            setStatus('Could not read image.');
        } finally {
            input.value = '';
        }
    }

    function buildGalleryCatalogExportSpec() {
        return {
            layout: 'four-tile-row',
            alignment: 'Centered · matches Gallery hero width',
            labelStyle: 'White · uppercase · centered on image',
            linksToCatalog: true,
            imageDirectory: `editor/${GALLERY_IMAGE_DIR}`,
            tiles: state.galleryCatalogTiles.map((tile, index) => ({
                index: index + 1,
                id: tile.id,
                label: tile.label,
                url: tile.url,
                imageFilename: `gallery-catalog-tile-${index + 1}.jpg`,
            })),
        };
    }

    function defaultGalleryMainNavLinks() {
        return DEFAULT_GALLERY_MAIN_NAV_LINKS.map((link, index) => createFooterLinkItem({
            label: link.label,
            url: link.defaultUrl,
        }, index, 'gmn'));
    }

    function migrateGalleryMainNavLinks(data) {
        if (Array.isArray(data.galleryMainNavLinks) && data.galleryMainNavLinks.length > 0) {
            return data.galleryMainNavLinks.map((item, index) => createFooterLinkItem(item, index, 'gmn'));
        }

        if (Array.isArray(data.galleryMainNavLinks)) {
            return [];
        }

        return defaultGalleryMainNavLinks();
    }

    function renderGalleryMainNavEditor() {
        renderFooterLinksEditor(galleryMainNavEditor, state.galleryMainNavLinks, 'Nav link');
    }

    function readGalleryMainNavFromEditor() {
        if (!galleryMainNavEditor) return;
        galleryMainNavEditor.querySelectorAll('[data-field]').forEach((input) => {
            const item = state.galleryMainNavLinks.find((link) => link.id === input.dataset.itemId);
            if (!item) return;
            item[input.dataset.field] = input.value.trim();
        });
    }

    function saveGalleryMainNavDraft() {
        readGalleryMainNavFromEditor();
        syncHeaderPreview();
        saveState();
    }

    function addGalleryMainNavLink() {
        readGalleryMainNavFromEditor();
        state.galleryMainNavLinks.push(createFooterLinkItem({
            label: 'New link',
            url: '/',
        }, state.galleryMainNavLinks.length, 'gmn'));
        renderGalleryMainNavEditor();
        syncHeaderPreview();
        saveState();
        setStatus('Nav link added');
    }

    function removeGalleryMainNavLink(id) {
        readGalleryMainNavFromEditor();
        state.galleryMainNavLinks = state.galleryMainNavLinks.filter((item) => item.id !== id);
        renderGalleryMainNavEditor();
        syncHeaderPreview();
        saveState();
        setStatus('Nav link removed');
    }

    function bindGalleryMainNavEditorEvents() {
        if (galleryMainNavEditor) {
            galleryMainNavEditor.addEventListener('input', (event) => {
                if (event.target.matches('[data-field]')) {
                    saveGalleryMainNavDraft();
                }
            });

            galleryMainNavEditor.addEventListener('click', (event) => {
                const button = event.target.closest('[data-action="remove-footer-link"]');
                if (!button) return;
                const wrap = button.closest('[data-item-id]');
                if (wrap) removeGalleryMainNavLink(wrap.dataset.itemId);
            });
        }

        if (addGalleryMainNavLinkBtn) {
            addGalleryMainNavLinkBtn.addEventListener('click', addGalleryMainNavLink);
        }
    }

    function mainNavSubcategoriesPending() {
        return state.mainNavItems.some((item) => {
            const subs = Array.isArray(item.subcategories) ? item.subcategories : [];
            const hasCategoryLink = Boolean(String(item.url || '').trim());
            if (subs.length === 0) {
                return !hasCategoryLink;
            }
            return !subs.some((sub) => sub.visible !== false);
        });
    }

    function createMainNavSubcategory(data = {}, index = 0, prefix = 'mns') {
        return {
            id: data.id || `${prefix}-${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
            label: String(data.label || '').trim() || 'Subcategory',
            url: String(data.url || '').trim() || '/',
            visible: data.visible !== false,
        };
    }

    function createMainNavItem(data = {}) {
        const id = data.id || `mn-${Math.random().toString(36).slice(2, 8)}`;
        const subcategories = Array.isArray(data.subcategories)
            ? data.subcategories.map((sub, index) => createMainNavSubcategory(sub, index, `${id}-sub`))
            : [];

        return {
            id,
            label: String(data.label || '').trim() || 'Category',
            url: String(data.url || '').trim(),
            subcategories,
        };
    }

    function defaultMainNavItems() {
        if (templateDesign === 'spotlight' && window.SpotlightEditor?.defaultMainNavItems) {
            return window.SpotlightEditor.defaultMainNavItems();
        }
        return DEFAULT_MAIN_NAV_TEMPLATE.map((item) => createMainNavItem({
            id: item.id,
            label: item.label,
            url: item.url || '',
            subcategories: (item.subcategories || []).map((sub) => ({
                ...sub,
                visible: true,
            })),
        }));
    }

    function migrateMainNavItems(data) {
        if (templateDesign === 'spotlight' && window.SpotlightEditor?.migrateMainNavItems) {
            return window.SpotlightEditor.migrateMainNavItems(data);
        }
        const defaults = defaultMainNavItems();
        if (!Array.isArray(data.mainNavItems)) {
            return defaults;
        }

        return defaults.map((defaultItem) => {
            const savedItem = data.mainNavItems.find((item) => item.id === defaultItem.id);
            if (!savedItem) {
                return defaultItem;
            }

            const savedSubs = Array.isArray(savedItem.subcategories) ? savedItem.subcategories : [];
            let subcategories;

            if (defaultItem.subcategories.length) {
                subcategories = defaultItem.subcategories.map((defaultSub) => {
                    const savedSub = savedSubs.find((sub) => sub.id === defaultSub.id)
                        || savedSubs.find((sub) => sub.label === defaultSub.label);
                    if (!savedSub) {
                        return defaultSub;
                    }
                    return createMainNavSubcategory({
                        ...defaultSub,
                        ...savedSub,
                        id: defaultSub.id,
                    }, 0, defaultItem.id);
                });

                savedSubs.forEach((savedSub, index) => {
                    if (!subcategories.some((sub) => sub.id === savedSub.id)) {
                        subcategories.push(createMainNavSubcategory(savedSub, index, defaultItem.id));
                    }
                });
            } else {
                subcategories = savedSubs.map((sub, index) => createMainNavSubcategory(sub, index, defaultItem.id));
            }

            return createMainNavItem({
                id: defaultItem.id,
                label: savedItem.label || defaultItem.label,
                url: savedItem.url || defaultItem.url || '',
                subcategories,
            });
        });
    }

    function getMainNavCategory(navId) {
        return state.mainNavItems.find((item) => item.id === navId);
    }

    function getMainNavSubcategory(navId, subId) {
        const category = getMainNavCategory(navId);
        if (!category) return null;
        return category.subcategories.find((sub) => sub.id === subId) || null;
    }

    function renderMainNavSubEditor(navId, sub) {
        return (
            `<div class="editor-main-nav-sub-item" data-sub-id="${sub.id}" data-nav-id="${navId}">
                <div class="editor-main-nav-sub-item-head">
                    <label class="editor-toggle editor-toggle--compact">
                        <input type="checkbox" data-sub-field="visible" data-sub-id="${sub.id}" data-nav-id="${navId}"${sub.visible !== false ? ' checked' : ''}>
                        Show in dropdown
                    </label>
                    <button type="button" class="editor-footer-link-remove" data-action="remove-main-nav-sub">Remove</button>
                </div>
                <div class="editor-field editor-field--compact">
                    <label>Subcategory name</label>
                    <input type="text" value="${escapeHtml(sub.label)}" data-sub-field="label" data-sub-id="${sub.id}" data-nav-id="${navId}" autocomplete="off">
                </div>
                <div class="editor-field editor-field--compact">
                    <label>URL</label>
                    <input type="text" value="${escapeHtml(sub.url)}" data-sub-field="url" data-sub-id="${sub.id}" data-nav-id="${navId}" placeholder="/lighting-fixtures/..." autocomplete="off">
                </div>
            </div>`
        );
    }

    function renderMainNavEditor() {
        if (!mainNavEditor) return;

        mainNavEditor.innerHTML = state.mainNavItems.map((category, categoryIndex) => (
            `<fieldset class="editor-fieldset editor-main-nav-category editor-header-jump-target" id="editor-main-nav-${category.id}" data-nav-id="${category.id}">
                <legend>${escapeHtml(category.label || `Category ${categoryIndex + 1}`)}</legend>
                <div class="editor-field editor-field--compact">
                    <label>Category name</label>
                    <input type="text" value="${escapeHtml(category.label)}" data-nav-field="label" data-nav-id="${category.id}" autocomplete="off">
                </div>
                <div class="editor-field editor-field--compact">
                    <label>Category link</label>
                    <input type="text" value="${escapeHtml(category.url || '')}" data-nav-field="url" data-nav-id="${category.id}" placeholder="/lighting-fixtures/fans" autocomplete="off">
                </div>
                ${category.subcategories.length
                    ? '<p class="editor-field-hint editor-field-hint--fieldset">Edit subcategory names and URLs. Uncheck any you want hidden from the dropdown.</p>'
                    : '<p class="editor-field-hint editor-field-hint--fieldset">No subcategories yet — add links for this dropdown when ready.</p>'}
                <div class="editor-main-nav-subs" data-nav-id="${category.id}">
                    ${category.subcategories.map((sub) => renderMainNavSubEditor(category.id, sub)).join('')}
                </div>
                <button type="button" class="btn btn-secondary editor-add-item-btn editor-main-nav-add-sub" data-nav-id="${category.id}">Add subcategory</button>
            </fieldset>`
        )).join('');

        renderHeaderJumpNav();
    }

    function readMainNavFromEditor() {
        if (!mainNavEditor) return;

        state.mainNavItems.forEach((category) => {
            const labelInput = mainNavEditor.querySelector(`[data-nav-field="label"][data-nav-id="${category.id}"]`);
            if (labelInput) {
                category.label = labelInput.value.trim() || category.label;
            }

            const urlInput = mainNavEditor.querySelector(`[data-nav-field="url"][data-nav-id="${category.id}"]`);
            if (urlInput) {
                category.url = urlInput.value.trim();
            }

            category.subcategories.forEach((sub) => {
                mainNavEditor.querySelectorAll(`[data-sub-field][data-nav-id="${category.id}"][data-sub-id="${sub.id}"]`).forEach((input) => {
                    const field = input.dataset.subField;
                    if (field === 'visible') {
                        sub.visible = input.checked;
                    } else if (field) {
                        sub[field] = input.value.trim();
                    }
                });
            });
        });
    }

    function saveMainNavDraft(reRenderEditor = false) {
        readMainNavFromEditor();
        if (reRenderEditor) {
            renderMainNavEditor();
        }
        syncHeaderPreview();
        saveState();
    }

    function addMainNavSubcategory(navId) {
        readMainNavFromEditor();
        const category = getMainNavCategory(navId);
        if (!category) return;

        category.subcategories.push(createMainNavSubcategory({
            label: 'New subcategory',
            url: '/',
        }, category.subcategories.length, navId));

        renderMainNavEditor();
        syncHeaderPreview();
        saveState();
        setStatus('Subcategory added');
    }

    function removeMainNavSubcategory(navId, subId) {
        readMainNavFromEditor();
        const category = getMainNavCategory(navId);
        if (!category) return;

        category.subcategories = category.subcategories.filter((sub) => sub.id !== subId);
        renderMainNavEditor();
        syncHeaderPreview();
        saveState();
        setStatus('Subcategory removed');
    }

    function bindMainNavEditorEvents() {
        if (!mainNavEditor) return;

        mainNavEditor.addEventListener('input', (event) => {
            if (event.target.matches('[data-nav-field="label"]')) {
                const fieldset = event.target.closest('.editor-main-nav-category');
                const legend = fieldset?.querySelector('legend');
                const label = event.target.value.trim() || 'Category';
                if (legend) {
                    legend.textContent = label;
                }
                const navId = event.target.dataset.navId;
                if (navId && headerJumpNav) {
                    const option = headerJumpNav.querySelector(`option[value="#editor-main-nav-${navId}"]`);
                    if (option) {
                        option.textContent = label;
                    }
                }
            }
            if (event.target.matches('[data-nav-field], [data-sub-field]:not([data-sub-field="visible"])')) {
                saveMainNavDraft(false);
            }
        });

        mainNavEditor.addEventListener('change', (event) => {
            if (event.target.matches('[data-sub-field="visible"]')) {
                saveMainNavDraft(false);
            }
        });

        mainNavEditor.addEventListener('click', (event) => {
            const addButton = event.target.closest('.editor-main-nav-add-sub');
            if (addButton?.dataset.navId) {
                addMainNavSubcategory(addButton.dataset.navId);
                return;
            }

            const removeButton = event.target.closest('[data-action="remove-main-nav-sub"]');
            if (!removeButton) return;

            const wrap = removeButton.closest('[data-nav-id][data-sub-id]');
            if (wrap) {
                removeMainNavSubcategory(wrap.dataset.navId, wrap.dataset.subId);
            }
        });
    }

    function bindHeaderBannerEditorEvents() {
        if (headerBannerLinksEditor) {
            headerBannerLinksEditor.addEventListener('input', (event) => {
                if (event.target.matches('[data-field]')) {
                    saveHeaderBannerLinksDraft();
                }
            });

            headerBannerLinksEditor.addEventListener('click', (event) => {
                const button = event.target.closest('[data-action="remove-footer-link"]');
                if (!button) return;
                const wrap = button.closest('[data-item-id]');
                if (wrap) removeHeaderBannerLink(wrap.dataset.itemId);
            });
        }

        if (addHeaderBannerLinkBtn) {
            addHeaderBannerLinkBtn.addEventListener('click', addHeaderBannerLink);
        }

        if (fields.headerBannerBackgroundColor) {
            fields.headerBannerBackgroundColor.addEventListener('input', readForm);
        }
        if (fields.headerBannerTextColor) {
            fields.headerBannerTextColor.addEventListener('input', readForm);
        }
    }

    function getHeaderLogoSizeLimits() {
        return HEADER_LOGO_SIZE_LIMITS[templateDesign] || HEADER_LOGO_SIZE_LIMITS.classic;
    }

    function clampHeaderLogoSize(size) {
        const { min, max, default: fallback } = getHeaderLogoSizeLimits();
        const n = Number(size);
        if (Number.isNaN(n)) return fallback;
        return Math.min(max, Math.max(min, Math.round(n)));
    }

    function getResolvedHeaderLogoSize() {
        return clampHeaderLogoSize(state.headerLogoSize);
    }

    function syncHeaderLogoSizeControls(size) {
        const fitted = clampHeaderLogoSize(size);
        document.querySelectorAll('.editor-header-logo-size').forEach((input) => {
            const limits = getHeaderLogoSizeLimits();
            input.min = String(limits.min);
            input.max = String(limits.max);
            if (input.value !== String(fitted)) {
                input.value = String(fitted);
            }
        });
        document.querySelectorAll('.editor-header-logo-size-val').forEach((el) => {
            el.textContent = `${fitted}px`;
        });
        document.querySelectorAll('.editor-header-logo-size-min').forEach((el) => {
            el.textContent = `${getHeaderLogoSizeLimits().min}px`;
        });
        document.querySelectorAll('.editor-header-logo-size-max').forEach((el) => {
            el.textContent = `${getHeaderLogoSizeLimits().max}px`;
        });
    }

    function applyHeaderLogoSizeToUploadPreviews(size) {
        const px = `${size}px`;
        document.querySelectorAll(
            '.editor-upload-preview--header-logo img, .editor-upload-preview--gallery-header-logo img',
        ).forEach((img) => {
            img.style.setProperty('height', px, 'important');
            img.style.setProperty('max-height', px, 'important');
            img.style.setProperty('width', 'auto', 'important');
            img.style.setProperty('max-width', 'none', 'important');
        });
    }

    function applyHeaderLogoSizeToPreviewLogos(size) {
        const px = `${size}px`;
        ['#previewHeaderLogo', '#previewGalleryLogo', '#previewSpotlightHeaderLogo'].forEach((selector) => {
            const img = document.querySelector(selector);
            if (!img || img.hidden) return;
            img.style.setProperty('height', px, 'important');
            img.style.setProperty('max-height', px, 'important');
            img.style.setProperty('width', 'auto', 'important');
            img.style.setProperty('max-width', 'none', 'important');
        });
    }

    function applyHeaderLogoSize() {
        const size = getResolvedHeaderLogoSize();
        state.headerLogoSize = size;
        if (previewRoot) {
            previewRoot.style.setProperty('--showroom-header-logo-h', `${size}px`);
        }
        syncHeaderLogoSizeControls(size);
        applyHeaderLogoSizeToUploadPreviews(size);
        applyHeaderLogoSizeToPreviewLogos(size);
    }

    function bindHeaderLogoSizeControls() {
        document.querySelectorAll('.editor-header-logo-size').forEach((input) => {
            if (input.dataset.bound === 'true') return;
            input.dataset.bound = 'true';
            input.addEventListener('input', () => {
                state.headerLogoSize = clampHeaderLogoSize(input.value);
                applyHeaderLogoSize();
                saveState({ silent: true });
            });
        });
    }

    function isBundledDefaultHeaderLogo(src, defaultLight) {
        const trimmed = String(src || '').trim();
        return !trimmed || trimmed === defaultLight;
    }

    function getEffectiveHeaderLogo() {
        if (state.previewTheme !== 'dark') {
            return state.headerLogoImage;
        }
        const src = state.headerLogoImage;
        if (templateDesign === 'classic'
            && isBundledDefaultHeaderLogo(src, DEFAULT_CLASSIC_HEADER_LOGO)) {
            return DEFAULT_SHOWROOM_HEADER_LOGO_DARK;
        }
        if (templateDesign === 'gallery'
            && isBundledDefaultHeaderLogo(src, DEFAULT_GALLERY_HEADER_LOGO)) {
            return DEFAULT_SHOWROOM_HEADER_LOGO_DARK;
        }
        if (templateDesign === 'spotlight') {
            const spotlightDefault = window.SpotlightEditor?.DEFAULT_HEADER_LOGO
                || DEFAULT_SPOTLIGHT_HEADER_LOGO;
            if (isBundledDefaultHeaderLogo(src, spotlightDefault)) {
                return DEFAULT_SHOWROOM_HEADER_LOGO_DARK;
            }
        }
        return state.headerLogoImage;
    }

    function getEffectiveFooterLogo() {
        return state.footerLogoUseHeader !== false
            ? getEffectiveHeaderLogo()
            : state.footerLogoImage;
    }

    function syncFooterLogoEditor() {
        const useHeader = state.footerLogoUseHeader !== false;
        const footerLogoField = document.getElementById('footerLogoField');
        const footerLogoHeaderNote = document.getElementById('footerLogoHeaderNote');
        if (footerLogoField) footerLogoField.hidden = useHeader;
        if (footerLogoHeaderNote) footerLogoHeaderNote.hidden = !useHeader;
    }

    function syncLogoUploadPreviews() {
        setUploadPreviewImage(uploadPreviewHeaderLogo, state.headerLogoImage);
        setUploadPreviewImage(uploadPreviewGalleryHeaderLogo, state.headerLogoImage);
        const footerUploadLogo = state.footerLogoUseHeader !== false
            ? state.headerLogoImage
            : state.footerLogoImage;
        setUploadPreviewImage(uploadPreviewFooterLogo, footerUploadLogo);
    }

    function syncGalleryHeaderPreview() {
        applyImage(previewGalleryLogo, previewGalleryLogoWrap, getEffectiveHeaderLogo());
        applyHeaderLogoSize();
        syncLogoUploadPreviews();

        const barBg = normalizeHex(state.galleryHeaderBarBackgroundColor || DEFAULT_GALLERY_HEADER_BAR_BG);
        const barText = normalizeHexColor(
            state.galleryHeaderBarTextColor,
            DEFAULT_GALLERY_HEADER_BAR_TEXT,
        );
        if (previewGalleryTopBar) {
            if (isGalleryDarkPreview()) {
                previewGalleryTopBar.style.backgroundColor = '';
                previewGalleryTopBar.style.color = '';
            } else {
                previewGalleryTopBar.style.backgroundColor = barBg;
                previewGalleryTopBar.style.color = barText;
            }
        }

        if (previewGalleryTopBarCopy) {
            previewGalleryTopBarCopy.textContent = state.galleryHeaderCenterCopy
                || DEFAULT_GALLERY_HEADER_CENTER_COPY;
            if (!isGalleryDarkPreview()) {
                previewGalleryTopBarCopy.style.color = barText;
            } else {
                previewGalleryTopBarCopy.style.color = '';
            }
        }

        if (previewGalleryTopBarUtils) {
            const wishlist = escapeHtml(state.galleryHeaderWishlistLabel || DEFAULT_GALLERY_HEADER_WISHLIST);
            const signIn = escapeHtml(state.galleryHeaderSignInLabel || DEFAULT_GALLERY_HEADER_SIGN_IN);
            previewGalleryTopBarUtils.innerHTML = (
                `<a href="/wishlist">${wishlist}</a>`
                + '<span class="showroom-gallery-top-bar-sep" aria-hidden="true">|</span>'
                + `<a href="/sign-in">${signIn}</a>`
            );
            if (!isGalleryDarkPreview()) {
                previewGalleryTopBarUtils.querySelectorAll('a').forEach((link) => {
                    link.style.color = barText;
                });
                previewGalleryTopBarUtils.querySelectorAll('.showroom-gallery-top-bar-sep').forEach((sep) => {
                    sep.style.color = hexWithAlpha(barText, 0.72);
                });
            }
        }

        if (previewGalleryMainNavLinks) {
            const visibleLinks = (state.galleryMainNavLinks || []).filter((link) => link.label || link.url);
            previewGalleryMainNavLinks.innerHTML = visibleLinks.map((link) => {
                const url = escapeHtml(link.url || '#');
                const label = escapeHtml(link.label || 'Link');
                return `<li><a href="${url}">${label}</a></li>`;
            }).join('');
        }
    }

    function syncHeaderPreview() {
        if (templateDesign === 'spotlight' && window.SpotlightEditor) {
            SpotlightEditor.syncHeaderPreview();
            applyHeaderLogoSize();
            return;
        }

        if (templateDesign === 'gallery') {
            syncGalleryHeaderPreview();
            return;
        }

        applyImage(previewHeaderLogo, previewHeaderLogoWrap, getEffectiveHeaderLogo());
        applyHeaderLogoSize();
        syncLogoUploadPreviews();

        const bannerBg = normalizeHex(state.headerBannerBackgroundColor || DEFAULT_HEADER_BANNER_BG);
        const bannerText = normalizeHexColor(state.headerBannerTextColor, DEFAULT_HEADER_BANNER_TEXT);
        const isCrystalPreview = state.previewTheme === 'dark' && templateDesign === 'classic';
        if (previewHeaderBanner) {
            if (isCrystalPreview) {
                previewHeaderBanner.style.backgroundColor = '';
                previewHeaderBanner.style.background = '';
            } else {
                previewHeaderBanner.style.backgroundColor = bannerBg;
            }
            previewHeaderBanner.style.setProperty(
                '--header-banner-text',
                isCrystalPreview ? '#e8ecf2' : bannerText,
            );
        }

        if (previewHeaderBannerLinks) {
            const visibleBannerLinks = (state.headerBannerLinks || []).filter((link) => link.label || link.url);
            previewHeaderBannerLinks.innerHTML = visibleBannerLinks.map((link, index) => {
                const url = escapeHtml(link.url || '#');
                const label = escapeHtml(link.label || 'Link');
                const separator = index > 0
                    ? '<span class="showroom-header-banner-sep" aria-hidden="true">|</span>'
                    : '';
                return `${separator}<a href="${url}">${label}</a>`;
            }).join('');
        }

        if (previewHeaderIcons) {
            previewHeaderIcons.innerHTML = HEADER_TOOLBAR_ICONS.map((item) => {
                const url = escapeHtml(item.url || '#');
                return (
                    `<a href="${url}" class="showroom-header-icon-btn" aria-label="${escapeHtml(item.label)}" title="${escapeHtml(item.label)}"><i class="${item.iconClass}" aria-hidden="true"></i></a>`
                );
            }).join('');
        }

        if (previewMainNav) {
            previewMainNav.innerHTML = (
                `<ul class="showroom-main-nav-list">${state.mainNavItems.map((item) => {
                    const visibleSubcategories = (item.subcategories || []).filter((sub) => sub.visible !== false);
                    const dropdownMarkup = visibleSubcategories.length
                        ? `<ul class="showroom-main-nav-dropdown">${visibleSubcategories.map((sub) => {
                            const url = escapeHtml(sub.url || '#');
                            const label = escapeHtml(sub.label || 'Link');
                            return `<li><a href="${url}">${label}</a></li>`;
                        }).join('')}</ul>`
                        : `<ul class="showroom-main-nav-dropdown showroom-main-nav-dropdown--empty" aria-hidden="true"><li><span class="showroom-main-nav-dropdown-placeholder">Subcategories coming soon</span></li></ul>`;

                    const categoryUrl = String(item.url || '').trim();
                    const label = escapeHtml(item.label || 'Category');
                    const triggerLabel = categoryUrl
                        ? `<a href="${escapeHtml(categoryUrl)}" class="showroom-main-nav-label-link">${label}</a>`
                        : `<span class="showroom-main-nav-label">${label}</span>`;

                    return (
                        `<li class="showroom-main-nav-item has-dropdown" data-nav-id="${escapeHtml(item.id)}">
                            <div class="showroom-main-nav-trigger" aria-haspopup="true">
                                ${triggerLabel}
                            </div>
                            ${dropdownMarkup}
                        </li>`
                    );
                }).join('')}</ul>`
            );
        }
    }

    function buildHeaderExportSpec() {
        const logoSizePx = getResolvedHeaderLogoSize();
        const logoDimensions = `${logoSizePx} px display height · width auto`;

        if (templateDesign === 'gallery') {
            return {
                layout: 'gallery',
                logoSharedWithFooter: state.footerLogoUseHeader !== false,
                logoSizePx,
                logoDimensions,
                logoFilename: 'header-logo.png',
                contentColumnWidth: SHOWROOM_CONTENT_COLUMN_WIDTH,
                topBar: {
                    backgroundColor: state.galleryHeaderBarBackgroundColor,
                    textColor: state.galleryHeaderBarTextColor || DEFAULT_GALLERY_HEADER_BAR_TEXT,
                    centerCopyBackground: 'transparent',
                    centerCopyColor: state.galleryHeaderBarTextColor || DEFAULT_GALLERY_HEADER_BAR_TEXT,
                    centerCopy: state.galleryHeaderCenterCopy,
                    utilities: {
                        alignment: 'right',
                        separator: '|',
                        wishlist: {
                            label: state.galleryHeaderWishlistLabel,
                            url: '/wishlist',
                        },
                        signIn: {
                            label: state.galleryHeaderSignInLabel,
                            url: '/sign-in',
                        },
                    },
                },
                mainNav: {
                    alignment: 'center',
                    links: state.galleryMainNavLinks.map((link) => ({
                        label: link.label,
                        url: link.url,
                    })),
                    search: {
                        hardcoded: true,
                        placeholder: GALLERY_SEARCH_PLACEHOLDER,
                        iconPosition: 'right',
                        style: 'Square bordered field',
                    },
                },
            };
        }

        return {
            layout: 'classic',
            logoSharedWithFooter: state.footerLogoUseHeader !== false,
            logoSizePx,
            logoDimensions,
            logoFilename: 'header-logo.png',
            contentColumnWidth: SHOWROOM_CONTENT_COLUMN_WIDTH,
            banner: {
                height: '50 px',
                backgroundColor: state.headerBannerBackgroundColor,
                textColor: state.headerBannerTextColor || DEFAULT_HEADER_BANNER_TEXT,
                alignment: 'right',
                separator: '|',
                links: state.headerBannerLinks.map((link) => ({
                    label: link.label,
                    url: link.url,
                })),
            },
            toolbar: {
                layout: 'search left · logo center · icons right',
                searchBarHardcoded: true,
                searchPlaceholder: HEADER_SEARCH_PLACEHOLDER,
                searchStyle: 'Single bottom border underline',
                iconsHardcoded: true,
                icons: HEADER_TOOLBAR_ICONS.map((item) => ({
                    id: item.id,
                    label: item.label,
                    iconClass: item.iconClass,
                    url: item.url,
                })),
            },
            mainNav: {
                editable: true,
                hasDropdowns: true,
                fontSize: '15 px',
                alignment: 'Full content width · first category aligns with search · last category aligns with cart',
                subcategoriesPending: mainNavSubcategoriesPending(),
                items: state.mainNavItems.map((item) => ({
                    id: item.id,
                    label: item.label,
                    url: item.url || '',
                    subcategories: (item.subcategories || []).map((sub) => ({
                        id: sub.id,
                        label: sub.label,
                        url: sub.url,
                        visible: sub.visible !== false,
                    })),
                })),
            },
        };
    }

    function footerTelHref(phone) {
        const digits = String(phone || '').replace(/\D/g, '');
        return digits ? `tel:+${digits}` : '#';
    }

    function getFooterCopyrightCompanyName() {
        return state.footerCopyrightName || state.footerCompanyName || DEFAULT_FOOTER_COMPANY;
    }

    function buildFooterCopyrightPasteMarkup(companyName) {
        const name = String(companyName || DEFAULT_FOOTER_COMPANY).trim();
        const year = new Date().getFullYear();
        return (
            `<div id="rightCol"> &copy; ${year} ${name} | All Rights Reserved `
            + `<a ajax-popup="${FOOTER_ADA_POPUP}">ADA Compliant</a></div>`
        );
    }

    function buildFooterCopyrightHtml(companyName) {
        const name = escapeHtml(companyName || DEFAULT_FOOTER_COMPANY);
        const year = new Date().getFullYear();
        return (
            `<div id="rightCol"> &copy; ${year} ${name} | All Rights Reserved `
            + `<a href="#" ajax-popup="${FOOTER_ADA_POPUP}">ADA Compliant</a></div>`
        );
    }

    function buildFooterCopyrightSpecText(companyName) {
        const name = companyName || DEFAULT_FOOTER_COMPANY;
        const year = new Date().getFullYear();
        return `© ${year} ${name} | All Rights Reserved · ADA Compliant (${FOOTER_ADA_POPUP})`;
    }

    function createFooterLinkItem(data = {}, index = 0, prefix = 'fl') {
        return {
            id: data.id || `${prefix}-${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
            label: String(data.label || '').trim() || 'Link',
            url: String(data.url || '').trim() || '/',
        };
    }

    function defaultFooterQuickLinks() {
        return DEFAULT_FOOTER_QUICK_LINKS.map((link, index) => createFooterLinkItem({
            label: link.label,
            url: link.defaultUrl,
        }, index, 'fql'));
    }

    function defaultFooterPolicyLinks() {
        return DEFAULT_FOOTER_POLICY_LINKS.map((link, index) => createFooterLinkItem({
            label: link.label,
            url: link.defaultUrl,
        }, index, 'fpl'));
    }

    function normalizeFooterLinkList(saved, defaults, legacyDefs, data, prefix) {
        if (Array.isArray(saved) && saved.length > 0) {
            return saved.map((item, index) => createFooterLinkItem(item, index, prefix));
        }

        if (Array.isArray(saved)) {
            return [];
        }

        return legacyDefs.map((link, index) => createFooterLinkItem({
            label: link.label,
            url: data[link.urlKey] || link.defaultUrl,
        }, index, prefix));
    }

    function migrateFooterQuickLinks(data) {
        return normalizeFooterLinkList(
            data.footerQuickLinks,
            defaultFooterQuickLinks(),
            DEFAULT_FOOTER_QUICK_LINKS,
            data,
            'fql',
        );
    }

    function migrateFooterPolicyLinks(data) {
        return normalizeFooterLinkList(
            data.footerPolicyLinks,
            defaultFooterPolicyLinks(),
            DEFAULT_FOOTER_POLICY_LINKS,
            data,
            'fpl',
        );
    }

    function defaultClassicFooterLinkGroup(definitions) {
        return definitions.map((item, index) => createFooterLinkItem({
            id: item.id,
            label: item.label,
            url: item.defaultUrl,
        }, index, item.id));
    }

    function defaultClassicFooterShopLinks() {
        return defaultClassicFooterLinkGroup(CLASSIC_FOOTER_SHOP_LINKS);
    }

    function defaultClassicFooterAboutLinks() {
        return defaultClassicFooterLinkGroup(CLASSIC_FOOTER_ABOUT_LINKS);
    }

    function defaultClassicFooterAccountLinks() {
        return defaultClassicFooterLinkGroup(CLASSIC_FOOTER_ACCOUNT_LINKS);
    }

    function migrateClassicFooterLinkGroup(savedLinks, definitions, defaults, prefix) {
        if (!Array.isArray(savedLinks) || !savedLinks.length) {
            return defaults();
        }

        const byId = new Map(definitions.map((item) => [item.id, item]));
        return savedLinks.map((item, index) => {
            const definition = byId.get(item.id) || definitions[index];
            return createFooterLinkItem({
                id: item.id || definition?.id,
                label: definition?.label || item.label,
                url: item.url || definition?.defaultUrl || '/',
            }, index, prefix);
        });
    }

    function migrateClassicFooterShopLinks(data) {
        const saved = data.classicFooterShopLinks;
        if (!Array.isArray(saved) || !saved.length) {
            return defaultClassicFooterShopLinks();
        }

        const byId = new Map(CLASSIC_FOOTER_SHOP_LINKS.map((item) => [item.id, item]));
        return saved.map((item, index) => {
            const definition = byId.get(item.id);
            return createFooterLinkItem({
                id: item.id,
                label: item.label || definition?.label || 'Link',
                url: item.url || definition?.defaultUrl || '/',
            }, index, 'cfs');
        });
    }

    function migrateClassicFooterLinks(data) {
        return {
            classicFooterShopLinks: migrateClassicFooterShopLinks(data),
            classicFooterAboutLinks: migrateClassicFooterLinkGroup(
                data.classicFooterAboutLinks,
                CLASSIC_FOOTER_ABOUT_LINKS,
                defaultClassicFooterAboutLinks,
                'cfa',
            ),
            classicFooterAccountLinks: migrateClassicFooterLinkGroup(
                data.classicFooterAccountLinks,
                CLASSIC_FOOTER_ACCOUNT_LINKS,
                defaultClassicFooterAccountLinks,
                'cfc',
            ),
        };
    }

    function getClassicFooterCopyrightCompanyName() {
        return state.classicFooterCopyrightName || state.classicFooterCompanyName || DEFAULT_FOOTER_COMPANY;
    }

    function renderClassicFooterLinksEditor(container, links) {
        if (!container) return;

        container.innerHTML = links.map((link) => (
            `<div class="editor-classic-footer-link-item" data-item-id="${link.id}">
                <label for="classicFooterLink-${link.id}">${escapeHtml(link.label)}</label>
                <input type="text" id="classicFooterLink-${link.id}" value="${escapeHtml(link.url)}" data-field="url" data-item-id="${link.id}" placeholder="/catalog" autocomplete="off">
            </div>`
        )).join('');
    }

    function getClassicFooterLinkList(key, id) {
        return state[key].find((item) => item.id === id);
    }

    function readClassicFooterLinksFromEditor() {
        [
            [classicFooterShopLinksEditor, 'classicFooterShopLinks'],
            [classicFooterAboutLinksEditor, 'classicFooterAboutLinks'],
            [classicFooterAccountLinksEditor, 'classicFooterAccountLinks'],
        ].forEach(([editor, key]) => {
            if (!editor) return;
            editor.querySelectorAll('[data-field]').forEach((input) => {
                const item = getClassicFooterLinkList(key, input.dataset.itemId);
                if (!item) return;
                item[input.dataset.field] = input.value.trim();
            });
        });
    }

    function renderClassicFooterLinksEditors() {
        renderFooterLinksEditor(classicFooterShopLinksEditor, state.classicFooterShopLinks, 'Shop link');
        renderClassicFooterLinksEditor(classicFooterAboutLinksEditor, state.classicFooterAboutLinks);
        renderClassicFooterLinksEditor(classicFooterAccountLinksEditor, state.classicFooterAccountLinks);
    }

    function saveClassicFooterLinksDraft() {
        readClassicFooterLinksFromEditor();
        syncClassicFooterPreview();
        saveState();
    }

    function addClassicFooterShopLink() {
        readClassicFooterLinksFromEditor();
        state.classicFooterShopLinks.push(createFooterLinkItem({
            label: 'New link',
            url: '/',
        }, state.classicFooterShopLinks.length, 'cfs'));
        renderClassicFooterLinksEditors();
        syncClassicFooterPreview();
        saveState();
        setStatus('Shop link added');
    }

    function removeClassicFooterShopLink(id) {
        readClassicFooterLinksFromEditor();
        state.classicFooterShopLinks = state.classicFooterShopLinks.filter((item) => item.id !== id);
        renderClassicFooterLinksEditors();
        syncClassicFooterPreview();
        saveState();
        setStatus('Shop link removed');
    }

    function renderClassicFooterLinkList(container, links) {
        if (!container) return;

        container.innerHTML = (links || []).map((link) => {
            const url = escapeHtml(link.url || '#');
            const label = escapeHtml(link.label || 'Link');
            return `<li><a href="${url}">${label}</a></li>`;
        }).join('');
    }

    function applyClassicFooterTheme() {
        const bg = normalizeHex(state.classicFooterBackgroundColor || DEFAULT_CLASSIC_FOOTER_BG);
        const text = normalizeHexColor(state.classicFooterTextColor, DEFAULT_CLASSIC_FOOTER_TEXT);

        state.classicFooterBackgroundColor = bg;
        state.classicFooterTextColor = text;

        if (classicFooterRoot) {
            if (isGalleryDarkPreview()) {
                classicFooterRoot.style.removeProperty('--classic-footer-bg');
                classicFooterRoot.style.removeProperty('--classic-footer-text');
            } else {
                classicFooterRoot.style.setProperty('--classic-footer-bg', bg);
                classicFooterRoot.style.setProperty('--classic-footer-text', text);
            }
        }

        if (fields.classicFooterBackgroundColor) {
            fields.classicFooterBackgroundColor.value = bg;
            if (fields.classicFooterBackgroundColorValue) {
                fields.classicFooterBackgroundColorValue.textContent = bg;
            }
        }
        if (fields.classicFooterTextColor) {
            fields.classicFooterTextColor.value = text;
            if (fields.classicFooterTextColorValue) {
                fields.classicFooterTextColorValue.textContent = text;
            }
        }
    }

    function applyClassicCopyrightTheme() {
        const copyrightText = normalizeHexColor(
            state.classicFooterCopyrightTextColor,
            DEFAULT_CLASSIC_FOOTER_COPYRIGHT_TEXT,
        );
        const copyrightBg = normalizeHex(
            state.classicFooterCopyrightBackgroundColor || DEFAULT_CLASSIC_FOOTER_COPYRIGHT_BG,
        );

        state.classicFooterCopyrightTextColor = copyrightText;
        state.classicFooterCopyrightBackgroundColor = copyrightBg;

        if (classicCopyrightRoot) {
            if (isGalleryDarkPreview()) {
                classicCopyrightRoot.style.removeProperty('--classic-copyright-text');
                classicCopyrightRoot.style.removeProperty('--classic-copyright-bg');
            } else {
                classicCopyrightRoot.style.setProperty('--classic-copyright-text', copyrightText);
                classicCopyrightRoot.style.setProperty('--classic-copyright-bg', copyrightBg);
            }
        }

        if (fields.classicFooterCopyrightTextColor) {
            fields.classicFooterCopyrightTextColor.value = copyrightText;
            if (fields.classicFooterCopyrightTextColorValue) {
                fields.classicFooterCopyrightTextColorValue.textContent = copyrightText;
            }
        }
        if (fields.classicFooterCopyrightBackgroundColor) {
            fields.classicFooterCopyrightBackgroundColor.value = copyrightBg;
            if (fields.classicFooterCopyrightBackgroundColorValue) {
                fields.classicFooterCopyrightBackgroundColorValue.textContent = copyrightBg;
            }
        }
    }

    function syncClassicCopyrightPreview() {
        applyClassicCopyrightTheme();

        if (previewClassicCopyright) {
            previewClassicCopyright.innerHTML = buildFooterCopyrightHtml(
                getClassicFooterCopyrightCompanyName(),
            );
        }
    }

    function syncClassicFooterPreview() {
        applyClassicFooterTheme();

        const companyName = state.classicFooterCompanyName || DEFAULT_FOOTER_COMPANY;
        if (previewClassicFooterCompany) {
            previewClassicFooterCompany.textContent = companyName;
        }
        if (previewClassicFooterAbout) {
            previewClassicFooterAbout.textContent = state.classicFooterAboutCopy || DEFAULT_CLASSIC_FOOTER_ABOUT;
        }

        renderClassicFooterLinkList(previewClassicFooterShopLinks, state.classicFooterShopLinks);
        renderClassicFooterLinkList(previewClassicFooterAboutLinks, state.classicFooterAboutLinks);
        renderClassicFooterLinkList(previewClassicFooterAccountLinks, state.classicFooterAccountLinks);

        if (previewClassicFooterAddress) {
            previewClassicFooterAddress.textContent = state.classicFooterAddress || DEFAULT_FOOTER_ADDRESS;
        }
        if (previewClassicFooterHours) {
            const hours = [
                state.classicFooterHoursMonFri || DEFAULT_CLASSIC_FOOTER_HOURS_MON_FRI,
                state.classicFooterHoursSaturday || DEFAULT_CLASSIC_FOOTER_HOURS_SATURDAY,
                state.classicFooterHoursSunday || DEFAULT_CLASSIC_FOOTER_HOURS_SUNDAY,
            ].filter(Boolean);
            previewClassicFooterHours.innerHTML = hours.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
        }
    }

    function populateClassicCopyrightFields(data) {
        state.classicFooterCopyrightName = data.classicFooterCopyrightName || '';
        state.classicFooterCopyrightTextColor = normalizeHexColor(
            data.classicFooterCopyrightTextColor,
            DEFAULT_CLASSIC_FOOTER_COPYRIGHT_TEXT,
        );
        state.classicFooterCopyrightBackgroundColor = normalizeHex(
            data.classicFooterCopyrightBackgroundColor || DEFAULT_CLASSIC_FOOTER_COPYRIGHT_BG,
        );

        if (fields.classicFooterCopyrightName) {
            fields.classicFooterCopyrightName.value = state.classicFooterCopyrightName;
        }

        syncClassicCopyrightPreview();
    }

    function populateClassicFooterFields(data) {
        const migratedLinks = migrateClassicFooterLinks(data);
        state.classicFooterShopLinks = migratedLinks.classicFooterShopLinks;
        state.classicFooterAboutLinks = migratedLinks.classicFooterAboutLinks;
        state.classicFooterAccountLinks = migratedLinks.classicFooterAccountLinks;
        state.classicFooterCompanyName = data.classicFooterCompanyName || DEFAULT_FOOTER_COMPANY;
        state.classicFooterAboutCopy = data.classicFooterAboutCopy || DEFAULT_CLASSIC_FOOTER_ABOUT;
        state.classicFooterAddress = data.classicFooterAddress || DEFAULT_FOOTER_ADDRESS;
        state.classicFooterHoursMonFri = data.classicFooterHoursMonFri || DEFAULT_CLASSIC_FOOTER_HOURS_MON_FRI;
        state.classicFooterHoursSaturday = data.classicFooterHoursSaturday || DEFAULT_CLASSIC_FOOTER_HOURS_SATURDAY;
        state.classicFooterHoursSunday = data.classicFooterHoursSunday || DEFAULT_CLASSIC_FOOTER_HOURS_SUNDAY;
        state.classicFooterBackgroundColor = normalizeHex(
            data.classicFooterBackgroundColor || DEFAULT_CLASSIC_FOOTER_BG,
        );
        state.classicFooterTextColor = normalizeHexColor(
            data.classicFooterTextColor,
            DEFAULT_CLASSIC_FOOTER_TEXT,
        );

        if (fields.classicFooterCompanyName) fields.classicFooterCompanyName.value = state.classicFooterCompanyName;
        if (fields.classicFooterAboutCopy) fields.classicFooterAboutCopy.value = state.classicFooterAboutCopy;
        if (fields.classicFooterAddress) fields.classicFooterAddress.value = state.classicFooterAddress;
        if (fields.classicFooterHoursMonFri) fields.classicFooterHoursMonFri.value = state.classicFooterHoursMonFri;
        if (fields.classicFooterHoursSaturday) fields.classicFooterHoursSaturday.value = state.classicFooterHoursSaturday;
        if (fields.classicFooterHoursSunday) fields.classicFooterHoursSunday.value = state.classicFooterHoursSunday;
        renderClassicFooterLinksEditors();
        syncClassicFooterPreview();
        populateClassicCopyrightFields(data);
    }

    function buildClassicCopyrightExportSpec() {
        const companyName = getClassicFooterCopyrightCompanyName();

        return {
            companyName,
            backgroundColor: state.classicFooterCopyrightBackgroundColor || DEFAULT_CLASSIC_FOOTER_COPYRIGHT_BG,
            textColor: state.classicFooterCopyrightTextColor || DEFAULT_CLASSIC_FOOTER_COPYRIGHT_TEXT,
            copyrightName: companyName,
            copyrightSpec: buildFooterCopyrightSpecText(companyName),
            copyrightMarkup: buildFooterCopyrightHtml(companyName),
            copyrightPasteMarkup: buildFooterCopyrightPasteMarkup(companyName),
            adaCompliancePopup: FOOTER_ADA_POPUP,
        };
    }

    function buildClassicFooterExportSpec() {
        return {
            layout: 'four-column',
            columns: ['about', 'quick-links', 'contact', 'store-hours'],
            companyName: state.classicFooterCompanyName || DEFAULT_FOOTER_COMPANY,
            aboutCopy: state.classicFooterAboutCopy || DEFAULT_CLASSIC_FOOTER_ABOUT,
            address: state.classicFooterAddress || DEFAULT_FOOTER_ADDRESS,
            storeHours: {
                mondayFriday: state.classicFooterHoursMonFri || DEFAULT_CLASSIC_FOOTER_HOURS_MON_FRI,
                saturday: state.classicFooterHoursSaturday || DEFAULT_CLASSIC_FOOTER_HOURS_SATURDAY,
                sunday: state.classicFooterHoursSunday || DEFAULT_CLASSIC_FOOTER_HOURS_SUNDAY,
            },
            backgroundColor: state.classicFooterBackgroundColor || DEFAULT_CLASSIC_FOOTER_BG,
            textColor: state.classicFooterTextColor || DEFAULT_CLASSIC_FOOTER_TEXT,
            quickLinksHeading: 'QUICK LINKS',
            linkGroups: {
                shop: {
                    heading: 'SHOP',
                    links: state.classicFooterShopLinks.map((link) => ({
                        id: link.id,
                        label: link.label,
                        url: link.url,
                    })),
                },
                aboutUs: {
                    heading: 'ABOUT US',
                    links: state.classicFooterAboutLinks.map((link) => ({
                        id: link.id,
                        label: link.label,
                        url: link.url,
                    })),
                },
                accounts: {
                    heading: 'ACCOUNTS',
                    links: state.classicFooterAccountLinks.map((link) => ({
                        id: link.id,
                        label: link.label,
                        url: link.url,
                    })),
                },
            },
            contactHeading: 'CONTACT US',
            storeHoursHeading: 'STORE HOURS',
        };
    }

    function bindClassicCopyrightEditorEvents() {
        [
            fields.classicFooterCopyrightName,
            fields.classicFooterCopyrightTextColor,
            fields.classicFooterCopyrightBackgroundColor,
        ].forEach((input) => {
            if (!input) return;
            input.addEventListener('input', readForm);
        });
    }

    function bindClassicFooterEditorEvents() {
        [
            fields.classicFooterCompanyName,
            fields.classicFooterAboutCopy,
            fields.classicFooterAddress,
            fields.classicFooterHoursMonFri,
            fields.classicFooterHoursSaturday,
            fields.classicFooterHoursSunday,
            fields.classicFooterBackgroundColor,
            fields.classicFooterTextColor,
        ].forEach((input) => {
            if (!input) return;
            input.addEventListener('input', readForm);
        });

        if (classicFooterShopLinksEditor) {
            classicFooterShopLinksEditor.addEventListener('input', (event) => {
                if (event.target.matches('[data-field]')) {
                    saveClassicFooterLinksDraft();
                }
            });
            classicFooterShopLinksEditor.addEventListener('click', (event) => {
                const button = event.target.closest('[data-action="remove-footer-link"]');
                if (!button) return;
                const wrap = button.closest('[data-item-id]');
                if (wrap) removeClassicFooterShopLink(wrap.dataset.itemId);
            });
        }

        if (addClassicFooterShopLinkBtn) {
            addClassicFooterShopLinkBtn.addEventListener('click', addClassicFooterShopLink);
        }

        [classicFooterAboutLinksEditor, classicFooterAccountLinksEditor].forEach((editor) => {
            if (!editor) return;
            editor.addEventListener('input', (event) => {
                if (event.target.matches('[data-field]')) {
                    saveClassicFooterLinksDraft();
                }
            });
        });
    }

    function renderFooterLinksEditor(container, links, sectionLabel) {
        if (!container) return;

        if (!links.length) {
            container.innerHTML = '<p class="editor-field-hint">No links added yet.</p>';
            return;
        }

        container.innerHTML = links.map((link, index) => (
            `<div class="editor-footer-link-item" data-item-id="${link.id}">
                <div class="editor-footer-link-item-head">
                    <span>${sectionLabel} ${index + 1}</span>
                    <button type="button" class="editor-footer-link-remove" data-action="remove-footer-link">Remove</button>
                </div>
                <div class="editor-field editor-field--compact">
                    <label>Link name</label>
                    <input type="text" value="${escapeHtml(link.label)}" data-field="label" data-item-id="${link.id}" placeholder="About Us" autocomplete="off">
                </div>
                <div class="editor-field editor-field--compact">
                    <label>URL</label>
                    <input type="text" value="${escapeHtml(link.url)}" data-field="url" data-item-id="${link.id}" placeholder="/about" autocomplete="off">
                </div>
            </div>`
        )).join('');
    }

    function getFooterLinkList(key, id) {
        return state[key].find((item) => item.id === id);
    }

    function readFooterLinksFromEditor() {
        [footerQuickLinksEditor, footerPolicyLinksEditor].forEach((editor, editorIndex) => {
            if (!editor) return;
            const key = editorIndex === 0 ? 'footerQuickLinks' : 'footerPolicyLinks';
            editor.querySelectorAll('[data-field]').forEach((input) => {
                const item = getFooterLinkList(key, input.dataset.itemId);
                if (!item) return;
                item[input.dataset.field] = input.value.trim();
            });
        });
    }

    function renderFooterLinksEditors() {
        renderFooterLinksEditor(footerQuickLinksEditor, state.footerQuickLinks, 'Quick link');
        renderFooterLinksEditor(footerPolicyLinksEditor, state.footerPolicyLinks, 'Policy link');
    }

    function saveFooterLinksDraft() {
        readFooterLinksFromEditor();
        syncFooterPreview();
        saveState();
    }

    function addFooterLink(key, sectionLabel) {
        readFooterLinksFromEditor();
        state[key].push(createFooterLinkItem({
            label: 'New link',
            url: '/',
        }, state[key].length, key === 'footerQuickLinks' ? 'fql' : 'fpl'));
        renderFooterLinksEditors();
        syncFooterPreview();
        saveState();
        setStatus(`${sectionLabel} added`);
    }

    function removeFooterLink(key, id, sectionLabel) {
        readFooterLinksFromEditor();
        state[key] = state[key].filter((item) => item.id !== id);
        renderFooterLinksEditors();
        syncFooterPreview();
        saveState();
        setStatus(`${sectionLabel} removed`);
    }

    function renderFooterLinkList(container, headingEl, spacedHeadingEl, links) {
        if (!container) return;

        const visibleLinks = (links || []).filter((link) => link.label || link.url);
        container.innerHTML = visibleLinks.map((link) => {
            const url = escapeHtml(link.url || '#');
            const label = escapeHtml(link.label || 'Link');
            return `<li><a href="${url}">${label}</a></li>`;
        }).join('');

        if (headingEl) {
            headingEl.hidden = visibleLinks.length === 0;
        }
        if (spacedHeadingEl) {
            spacedHeadingEl.classList.toggle('showroom-footer-heading--spaced', visibleLinks.length > 0);
        }
    }

    function bindFooterLinksEditorEvents() {
        [footerQuickLinksEditor, footerPolicyLinksEditor].forEach((editor, editorIndex) => {
            if (!editor) return;
            const key = editorIndex === 0 ? 'footerQuickLinks' : 'footerPolicyLinks';
            const sectionLabel = editorIndex === 0 ? 'Quick link' : 'Policy link';

            editor.addEventListener('input', (event) => {
                if (event.target.matches('[data-field]')) {
                    saveFooterLinksDraft();
                }
            });

            editor.addEventListener('click', (event) => {
                const button = event.target.closest('[data-action="remove-footer-link"]');
                if (!button) return;
                const wrap = button.closest('[data-item-id]');
                if (wrap) removeFooterLink(key, wrap.dataset.itemId, sectionLabel);
            });
        });

        if (addFooterQuickLinkBtn) {
            addFooterQuickLinkBtn.addEventListener('click', () => {
                addFooterLink('footerQuickLinks', 'Quick link');
            });
        }

        if (addFooterPolicyLinkBtn) {
            addFooterPolicyLinkBtn.addEventListener('click', () => {
                addFooterLink('footerPolicyLinks', 'Policy link');
            });
        }
    }

    function syncFooterPreview() {
        applyImage(previewFooterLogo, previewFooterLogoWrap, getEffectiveFooterLogo());
        syncFooterLogoEditor();

        const email = state.footerEmail || DEFAULT_FOOTER_EMAIL;
        if (previewFooterEmail) {
            previewFooterEmail.textContent = email;
            previewFooterEmail.href = `mailto:${email}`;
        }

        if (previewFooterSocial) {
            previewFooterSocial.innerHTML = FOOTER_SOCIAL_LINKS
                .filter((social) => state[social.visibleKey] !== false)
                .map((social) => {
                    const rawUrl = String(state[social.urlKey] || '').trim();
                    const url = escapeHtml(rawUrl || '#');
                    return (
                        `<a href="${url}" class="showroom-footer-social-link" aria-label="${escapeHtml(social.label)}" target="_blank" rel="noopener noreferrer"><i class="${social.iconClass}" aria-hidden="true"></i></a>`
                    );
                })
                .join('');
        }

        renderFooterLinkList(
            previewFooterQuickLinks,
            previewFooterQuickLinksHeading,
            previewFooterPoliciesHeading,
            state.footerQuickLinks,
        );
        renderFooterLinkList(
            previewFooterPolicyLinks,
            previewFooterPoliciesHeading,
            null,
            state.footerPolicyLinks,
        );

        const companyName = state.footerCompanyName || DEFAULT_FOOTER_COMPANY;
        if (previewFooterCompanyName) {
            previewFooterCompanyName.textContent = companyName;
        }
        if (previewFooterAddress) {
            previewFooterAddress.textContent = state.footerAddress || DEFAULT_FOOTER_ADDRESS;
        }
        if (previewFooterPhone) {
            const phone = state.footerPhone || DEFAULT_FOOTER_PHONE;
            previewFooterPhone.textContent = phone;
            previewFooterPhone.href = footerTelHref(phone);
        }
        if (previewFooterCopyright) {
            previewFooterCopyright.innerHTML = buildFooterCopyrightHtml(getFooterCopyrightCompanyName());
        }
    }

    function applyFeatureTile(side) {
        const isLeft = side === 'left';
        const headerEl = isLeft ? preview.featureLeftHeader : preview.featureRightHeader;
        const paragraphEl = isLeft ? preview.featureLeftParagraph : preview.featureRightParagraph;
        const buttonEl = isLeft ? preview.featureLeftButton : preview.featureRightButton;
        const imageEl = isLeft ? preview.featureLeftImage : preview.featureRightImage;
        const placeholderEl = isLeft ? preview.featureLeftPlaceholder : preview.featureRightPlaceholder;
        const uploadPreviewEl = isLeft ? uploadPreviews.featureLeft : uploadPreviews.featureRight;
        const imageKey = isLeft ? 'featureLeftImage' : 'featureRightImage';

        if (headerEl) {
            headerEl.textContent = state[isLeft ? 'featureLeftHeader' : 'featureRightHeader']
                || (isLeft ? DEFAULT_FEATURE_LEFT_HEADER : DEFAULT_FEATURE_RIGHT_HEADER);
        }
        if (paragraphEl) {
            paragraphEl.textContent = state[isLeft ? 'featureLeftParagraph' : 'featureRightParagraph']
                || (isLeft ? DEFAULT_FEATURE_LEFT_PARAGRAPH : DEFAULT_FEATURE_RIGHT_PARAGRAPH);
        }
        if (buttonEl) {
            buttonEl.textContent = state[isLeft ? 'featureLeftButtonLabel' : 'featureRightButtonLabel']
                || (isLeft ? DEFAULT_FEATURE_LEFT_BUTTON_LABEL : DEFAULT_FEATURE_RIGHT_BUTTON_LABEL);
            buttonEl.href = state[isLeft ? 'featureLeftButtonUrl' : 'featureRightButtonUrl']
                || (isLeft ? DEFAULT_FEATURE_LEFT_BUTTON_URL : DEFAULT_FEATURE_RIGHT_BUTTON_URL);
        }

        const btnBg = normalizeHexColor(state.featureButtonBackgroundColor, DEFAULT_FEATURE_BTN_BG);
        const btnText = normalizeHexColor(state.featureButtonTextColor, DEFAULT_FEATURE_BTN_TEXT);
        const isCrystalPreview = state.previewTheme === 'dark' && templateDesign === 'classic';
        if (buttonEl) {
            if (isCrystalPreview) {
                buttonEl.style.backgroundColor = '';
                buttonEl.style.borderColor = '';
                buttonEl.style.color = '';
            } else {
                buttonEl.style.backgroundColor = btnBg;
                buttonEl.style.borderColor = btnBg;
                buttonEl.style.color = btnText;
            }
            const showButton = state[isLeft ? 'featureLeftButtonVisible' : 'featureRightButtonVisible'] !== false;
            buttonEl.classList.toggle('is-hidden', !showButton);
            buttonEl.hidden = !showButton;
            buttonEl.style.display = showButton ? '' : 'none';
        }

        applyImage(imageEl, placeholderEl, state[imageKey]);

        if (uploadPreviewEl) {
            uploadPreviewEl.innerHTML = state[imageKey]
                ? `<img src="${state[imageKey]}" alt="">`
                : '';
            uploadPreviewEl.classList.toggle('is-empty', !state[imageKey]);
        }
    }

    function syncFeatureTilesPreview() {
        applyFeatureTile('left');
        applyFeatureTile('right');

        const featureButtonColorFieldset = document.getElementById('featureButtonColorFieldset');
        if (featureButtonColorFieldset) {
            const showColor = state.featureLeftButtonVisible !== false || state.featureRightButtonVisible !== false;
            featureButtonColorFieldset.hidden = !showColor;
        }
    }

    function syncSketchPreview() {
        if (sketchRoot) {
            sketchRoot.classList.toggle('is-hidden', !state.sketchSectionVisible);
            sketchRoot.hidden = !state.sketchSectionVisible;
        }

        if (!state.sketchSectionVisible) {
            scheduleFitPreviewScale();
            return;
        }

        const grid = document.getElementById('previewSketchGrid');
        if (!grid) return;

        grid.innerHTML = SKETCH_CARDS.map((card) => {
            const header = escapeHtml(card.defaultHeader);
            const paragraph = escapeHtml(card.defaultParagraph);
            const src = `${SKETCH_IMAGE_DIR}${card.imageFile}`;

            return (
                `<article class="showroom-sketch-card">
                    <div class="showroom-sketch-card-image is-empty">
                        <img src="${src}" alt="" loading="lazy" hidden>
                    </div>
                    <h3 class="showroom-sketch-card-title">${header}</h3>
                    <p class="showroom-sketch-card-text">${paragraph}</p>
                </article>`
            );
        }).join('');

        grid.querySelectorAll('.showroom-sketch-card-image img').forEach((img) => {
            const wrap = img.parentElement;
            const showImage = () => {
                img.hidden = false;
                wrap.classList.remove('is-empty');
            };
            const hideImage = () => {
                img.hidden = true;
                wrap.classList.add('is-empty');
            };

            img.addEventListener('load', showImage);
            img.addEventListener('error', hideImage);

            if (img.complete && img.naturalWidth > 0) {
                showImage();
            } else if (img.complete) {
                hideImage();
            }
        });
    }

    function syncYouMayLikePreview() {
        const track = document.getElementById('previewYouMayLikeTrack');
        if (!track) return;

        track.innerHTML = state.youMayLikeItems.map((item) => {
            const resolved = resolveYouMayLikePreviewItem(item);
            const title = escapeHtml(resolved.title);
            const price = escapeHtml(resolved.price);
            const url = escapeHtml(resolved.url);
            const imageHtml = resolved.imageSrc
                ? `<img src="${resolved.imageSrc}" alt="" loading="lazy" hidden>`
                : '';

            return (
                `<a href="${url}" class="showroom-you-may-like-slide">
                    <div class="showroom-you-may-like-image${resolved.imageSrc ? ' is-empty' : ''}">${imageHtml}</div>
                    <h3 class="showroom-you-may-like-item-title">${title}</h3>
                    <p class="showroom-you-may-like-item-price">${price}</p>
                </a>`
            );
        }).join('');

        track.querySelectorAll('.showroom-you-may-like-image img').forEach((img) => {
            const wrap = img.parentElement;
            const showImage = () => {
                img.hidden = false;
                wrap.classList.remove('is-empty');
            };
            const hideImage = () => {
                img.hidden = true;
                wrap.classList.add('is-empty');
            };

            img.addEventListener('load', showImage);
            img.addEventListener('error', hideImage);

            if (img.complete && img.naturalWidth > 0) {
                showImage();
            } else if (img.complete) {
                hideImage();
            }
        });
    }

    function renderYouMayLikeEditor() {
        if (!youMayLikeEditor) return;

        youMayLikeEditor.innerHTML = state.youMayLikeItems.map((item, index) => (
            `<div class="editor-you-may-like-item" data-item-id="${item.id}">
                <div class="editor-you-may-like-item-head">
                    <span>Carousel slot ${index + 1}</span>
                    <button type="button" class="editor-you-may-like-remove" data-action="remove-you-may-like" ${state.youMayLikeItems.length <= 1 ? 'hidden' : ''}>Remove</button>
                </div>
                <div class="editor-field">
                    <label>Lifestyle photo<span class="editor-field-hint">500 × 750 px</span></label>
                    <div class="editor-upload">
                        <div class="editor-upload-preview editor-upload-preview--you-may-like ${item.image ? '' : 'is-empty'}">
                            ${item.image ? `<img src="${item.image}" alt="">` : ''}
                        </div>
                        <input type="file" accept="image/*" data-action="you-may-like-image" data-item-id="${item.id}">
                    </div>
                </div>
                <div class="editor-field editor-field--compact">
                    <label>Catalog item number</label>
                    <input type="text" value="${escapeHtml(item.itemNumber)}" data-field="itemNumber" data-item-id="${item.id}" placeholder="e.g. 1001" autocomplete="off" inputmode="numeric">
                    <span class="editor-field-hint">Title and price load from your You May Like dashboard attribute. Lifestyle photo above is required for this template.</span>
                </div>
            </div>`
        )).join('');
    }

    function getYouMayLikeItem(id) {
        return state.youMayLikeItems.find((item) => item.id === id);
    }

    function readYouMayLikeFieldsFromEditor() {
        if (!youMayLikeEditor) return;

        youMayLikeEditor.querySelectorAll('[data-field]').forEach((input) => {
            const item = getYouMayLikeItem(input.dataset.itemId);
            if (!item) return;
            item.itemNumber = input.value.trim();
        });
    }

    function saveYouMayLikeDraft() {
        readYouMayLikeFieldsFromEditor();
        syncYouMayLikePreview();
        saveState();
    }

    function addYouMayLikeItem() {
        readYouMayLikeFieldsFromEditor();
        state.youMayLikeItems.push(createYouMayLikeItem());
        renderYouMayLikeEditor();
        syncYouMayLikePreview();
        saveState();
        setStatus('Product added');
    }

    function removeYouMayLikeItem(id) {
        if (state.youMayLikeItems.length <= 1) return;
        readYouMayLikeFieldsFromEditor();
        state.youMayLikeItems = state.youMayLikeItems.filter((item) => item.id !== id);
        renderYouMayLikeEditor();
        syncYouMayLikePreview();
        saveState();
        setStatus('Product removed');
    }

    function scrollYouMayLike(direction) {
        const track = document.getElementById('previewYouMayLikeTrack');
        if (!track) return;
        track.scrollBy({ left: direction * YOUMAYLIKE_SLIDE_STEP, behavior: 'smooth' });
    }

    async function loadYouMayLikeAssetsForExport() {
        const assets = [];

        for (const [index, item] of state.youMayLikeItems.entries()) {
            const number = String(item.itemNumber || '').trim();
            assets.push({
                filename: `you-may-like-${index + 1}.png`,
                label: `You May Like — item ${number || index + 1}`,
                dimensions: '500 × 750 px',
                dataUrl: await resolveImageDataUrlForExport(item.image),
            });
        }

        return assets;
    }

    async function onYouMayLikeImageUpload(input, itemId) {
        const file = input.files && input.files[0];
        if (!file) return;

        const item = getYouMayLikeItem(itemId);
        if (!item) return;

        if (!file.type.startsWith('image/')) {
            setStatus('Please choose an image file.');
            input.value = '';
            return;
        }
        if (file.size > YOUMAYLIKE_IMAGE_MAX_BYTES) {
            setStatus('Image must be under 6 MB.');
            input.value = '';
            return;
        }

        try {
            item.image = await readFileAsDataUrl(file);
            renderYouMayLikeEditor();
            syncYouMayLikePreview();
            saveState();
            setStatus('Image updated');
        } catch {
            setStatus('Could not read image.');
        }
    }

    function bindYouMayLikeEditorEvents() {
        if (youMayLikeEditor) {
            youMayLikeEditor.addEventListener('input', (event) => {
                if (event.target.matches('[data-field="itemNumber"]')) {
                    saveYouMayLikeDraft();
                }
            });

            youMayLikeEditor.addEventListener('change', (event) => {
                const input = event.target;
                if (input.matches('[data-action="you-may-like-image"]')) {
                    onYouMayLikeImageUpload(input, input.dataset.itemId);
                }
            });

            youMayLikeEditor.addEventListener('click', (event) => {
                const button = event.target.closest('[data-action="remove-you-may-like"]');
                if (!button) return;
                const wrap = button.closest('[data-item-id]');
                if (wrap) removeYouMayLikeItem(wrap.dataset.itemId);
            });
        }

        if (addYouMayLikeBtn) {
            addYouMayLikeBtn.addEventListener('click', addYouMayLikeItem);
        }

        if (youMayLikePrev) {
            youMayLikePrev.addEventListener('click', () => scrollYouMayLike(-1));
        }

        if (youMayLikeNext) {
            youMayLikeNext.addEventListener('click', () => scrollYouMayLike(1));
        }
    }

    function populateYouMayLikeFields(data) {
        state.youMayLikeItems = normalizeYouMayLikeItems(data.youMayLikeItems);
        renderYouMayLikeEditor();
    }

    function syncGetInspiredPreview() {
        applyImage(
            previewGetInspiredLifestyleImage,
            previewGetInspiredLifestylePlaceholder,
            state.getInspiredLifestyleImage,
        );

        if (uploadPreviewGetInspiredLifestyle) {
            uploadPreviewGetInspiredLifestyle.innerHTML = state.getInspiredLifestyleImage
                ? `<img src="${state.getInspiredLifestyleImage}" alt="">`
                : '';
            uploadPreviewGetInspiredLifestyle.classList.toggle('is-empty', !state.getInspiredLifestyleImage);
        }

        const grid = document.getElementById('previewGetInspiredGrid');
        if (!grid) return;

        grid.innerHTML = state.getInspiredItems.map((item, index) => {
            const resolved = resolveGetInspiredPreviewItem(item, index);
            const title = escapeHtml(resolved.title);
            const price = escapeHtml(resolved.price);
            const imageHtml = resolved.imageSrc
                ? `<img src="${resolved.imageSrc}" alt="" loading="lazy" hidden>`
                : '';

            return (
                `<article class="showroom-get-inspired-card">
                    <div class="showroom-get-inspired-card-image${resolved.imageSrc ? ' is-empty' : ''}">${imageHtml}</div>
                    <h3 class="showroom-get-inspired-card-title">${title}</h3>
                    <p class="showroom-get-inspired-card-price">${price}</p>
                </article>`
            );
        }).join('');

        grid.querySelectorAll('.showroom-get-inspired-card-image img').forEach((img) => {
            const wrap = img.parentElement;
            const showImage = () => {
                img.hidden = false;
                wrap.classList.remove('is-empty');
            };
            const hideImage = () => {
                img.hidden = true;
                wrap.classList.add('is-empty');
            };

            img.addEventListener('load', showImage);
            img.addEventListener('error', hideImage);

            if (img.complete && img.naturalWidth > 0) {
                showImage();
            } else if (img.complete) {
                hideImage();
            }
        });
    }

    function renderGetInspiredEditor() {
        if (!getInspiredEditor) return;

        getInspiredEditor.innerHTML = (
            `<div class="editor-get-inspired-grid-fields">${state.getInspiredItems.map((item, index) => (
                `<div class="editor-get-inspired-item" data-item-id="${item.id}">
                    <div class="editor-get-inspired-item-head">Grid card ${index + 1}${index < 4 ? ' (top row)' : ' (bottom row)'}</div>
                    <div class="editor-field editor-field--compact">
                        <label>Catalog item number</label>
                        <input type="text" value="${escapeHtml(item.itemNumber)}" data-field="itemNumber" data-item-id="${item.id}" placeholder="e.g. 1001" autocomplete="off" inputmode="numeric">
                        <span class="editor-field-hint">Title, price, and image load from your You May Like dashboard attribute on the live site.</span>
                    </div>
                </div>`
            )).join('')}</div>`
        );
    }

    function getGetInspiredItem(id) {
        return state.getInspiredItems.find((item) => item.id === id);
    }

    function readGetInspiredFieldsFromEditor() {
        if (!getInspiredEditor) return;

        getInspiredEditor.querySelectorAll('[data-field]').forEach((input) => {
            const item = getGetInspiredItem(input.dataset.itemId);
            if (!item) return;
            item.itemNumber = input.value.trim();
        });
    }

    function saveGetInspiredDraft() {
        readGetInspiredFieldsFromEditor();
        syncGetInspiredPreview();
        saveState();
    }

    async function onGetInspiredLifestyleUpload(input) {
        const file = input.files && input.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setStatus('Please choose an image file.');
            input.value = '';
            return;
        }
        if (file.size > YOUMAYLIKE_IMAGE_MAX_BYTES) {
            setStatus('Image must be under 6 MB.');
            input.value = '';
            return;
        }

        try {
            state.getInspiredLifestyleImage = await readFileAsDataUrl(file);
            syncGetInspiredPreview();
            saveState();
            setStatus('Image updated');
        } catch {
            setStatus('Could not read image.');
        }
    }

    function bindGetInspiredEditorEvents() {
        if (getInspiredEditor) {
            getInspiredEditor.addEventListener('input', (event) => {
                if (event.target.matches('[data-field="itemNumber"]')) {
                    saveGetInspiredDraft();
                }
            });
        }

        if (fieldsGetInspiredLifestyle) {
            fieldsGetInspiredLifestyle.addEventListener('change', () => {
                onGetInspiredLifestyleUpload(fieldsGetInspiredLifestyle);
            });
        }
    }

    function populateGetInspiredFields(data) {
        state.getInspiredLifestyleImage = templateDesign === 'gallery'
            ? (data.getInspiredLifestyleImage || '')
            : resolveClassicImage(
                data.getInspiredLifestyleImage,
                DEFAULT_CLASSIC_GET_INSPIRED_LIFESTYLE,
            );
        state.getInspiredItems = normalizeGetInspiredItems(data.getInspiredItems);
        renderGetInspiredEditor();
    }

    function syncAboutPreview() {
        if (preview.aboutHeader) {
            preview.aboutHeader.textContent = state.aboutHeader || DEFAULT_ABOUT_HEADER;
        }
        if (preview.aboutParagraph) {
            preview.aboutParagraph.textContent = state.aboutParagraph || DEFAULT_ABOUT_PARAGRAPH;
        }
        if (preview.aboutPrimary) {
            preview.aboutPrimary.textContent = state.aboutPrimaryLabel || DEFAULT_ABOUT_PRIMARY_LABEL;
            preview.aboutPrimary.href = state.aboutPrimaryUrl || DEFAULT_ABOUT_PRIMARY_URL;
        }
        if (preview.aboutSecondary) {
            preview.aboutSecondary.textContent = state.aboutSecondaryLabel || DEFAULT_ABOUT_SECONDARY_LABEL;
            preview.aboutSecondary.href = state.aboutSecondaryUrl || DEFAULT_ABOUT_SECONDARY_URL;
        }

        const btnBg = normalizeHexColor(state.aboutButtonBackgroundColor, DEFAULT_ABOUT_BTN_BG);
        const btnText = normalizeHexColor(state.aboutButtonTextColor, DEFAULT_ABOUT_BTN_TEXT);
        const isCrystalPreview = state.previewTheme === 'dark' && templateDesign === 'classic';
        [preview.aboutPrimary, preview.aboutSecondary].forEach((button) => {
            if (!button) return;
            if (isCrystalPreview) {
                button.style.backgroundColor = '';
                button.style.color = '';
                button.style.borderColor = '';
            } else {
                button.style.backgroundColor = btnBg;
                button.style.color = btnText;
                button.style.borderColor = btnBg;
            }
        });

        applyImage(preview.aboutPhoto, preview.aboutPhotoPlaceholder, state.aboutEmployeeImage);

        if (uploadPreviews.about) {
            uploadPreviews.about.innerHTML = state.aboutEmployeeImage
                ? `<img src="${state.aboutEmployeeImage}" alt="">`
                : '';
            uploadPreviews.about.classList.toggle('is-empty', !state.aboutEmployeeImage);
        }
    }

    function syncCategoryCheckboxes() {
        if (!categoryCheckboxList) return;
        categoryCheckboxList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
            input.checked = Boolean(state.featuredCategories[input.value]);
        });
    }

    function syncCategoriesPreview() {
        if (preview.shopAll) {
            preview.shopAll.href = state.shopAllUrl || DEFAULT_SHOP_ALL_URL;
        }

        if (!preview.categoriesGrid) return;

        const visible = FEATURED_CATEGORIES.filter((category) => state.featuredCategories[category.id]);
        preview.categoriesGrid.innerHTML = visible.map((category) => (
            `<article class="showroom-category-card">
                <div class="showroom-category-card-thumb" aria-hidden="true">
                    <img src="${FEATURED_CATEGORY_IMAGE_DIR}${category.imageFile}" alt="">
                </div>
                <span class="showroom-category-card-label">${escapeHtml(category.label)}</span>
            </article>`
        )).join('');
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function buildCategoryCheckboxes() {
        if (!categoryCheckboxList) return;

        categoryCheckboxList.innerHTML = FEATURED_CATEGORIES.map((category) => (
            `<li>
                <label>
                    <input type="checkbox" name="featuredCategory" value="${category.id}" checked>
                    ${escapeHtml(category.label)}
                </label>
            </li>`
        )).join('');

        categoryCheckboxList.addEventListener('change', (event) => {
            const input = event.target;
            if (input.type !== 'checkbox') return;
            state.featuredCategories[input.value] = input.checked;
            syncCategoriesPreview();
            saveState();
        });
    }

    function readForm() {
        state.title = fields.title.value.trim();
        state.copyBackgroundColor = normalizeHex(fields.copyBackgroundColor.value);
        fields.copyBackgroundColor.value = state.copyBackgroundColor;
        if (fields.copyBackgroundColorValue) {
            fields.copyBackgroundColorValue.textContent = state.copyBackgroundColor;
        }
        if (fields.copyTextColor) {
            state.copyTextColor = normalizeHexColor(
                fields.copyTextColor.value,
                DEFAULT_HEADER_BANNER_TEXT,
            );
            fields.copyTextColor.value = state.copyTextColor;
            if (fields.copyTextColorValue) {
                fields.copyTextColorValue.textContent = state.copyTextColor;
            }
        }
        state.description = fields.description.value.trim();
        state.cta = fields.cta.value.trim();
        if (fields.heroCtaHide) {
            state.heroCtaVisible = !fields.heroCtaHide.checked;
        }
        if (fields.heroCtaBackgroundColor) {
            state.heroCtaBackgroundColor = normalizeHexColor(
                fields.heroCtaBackgroundColor.value,
                DEFAULT_HERO_CTA_BG,
            );
            fields.heroCtaBackgroundColor.value = state.heroCtaBackgroundColor;
            if (fields.heroCtaBackgroundColorValue) {
                fields.heroCtaBackgroundColorValue.textContent = state.heroCtaBackgroundColor;
            }
        }
        if (fields.heroCtaTextColor) {
            state.heroCtaTextColor = normalizeHexColor(
                fields.heroCtaTextColor.value,
                DEFAULT_HERO_CTA_TEXT,
            );
            fields.heroCtaTextColor.value = state.heroCtaTextColor;
            if (fields.heroCtaTextColorValue) {
                fields.heroCtaTextColorValue.textContent = state.heroCtaTextColor;
            }
        }
        if (fields.shopAllUrl) {
            state.shopAllUrl = fields.shopAllUrl.value.trim() || DEFAULT_SHOP_ALL_URL;
            fields.shopAllUrl.value = state.shopAllUrl;
        }
        if (fields.aboutHeader) state.aboutHeader = fields.aboutHeader.value.trim();
        if (fields.aboutParagraph) state.aboutParagraph = fields.aboutParagraph.value.trim();
        if (fields.aboutPrimaryLabel) state.aboutPrimaryLabel = fields.aboutPrimaryLabel.value.trim();
        if (fields.aboutPrimaryUrl) {
            state.aboutPrimaryUrl = fields.aboutPrimaryUrl.value.trim() || DEFAULT_ABOUT_PRIMARY_URL;
            fields.aboutPrimaryUrl.value = state.aboutPrimaryUrl;
        }
        if (fields.aboutSecondaryLabel) state.aboutSecondaryLabel = fields.aboutSecondaryLabel.value.trim();
        if (fields.aboutSecondaryUrl) {
            state.aboutSecondaryUrl = fields.aboutSecondaryUrl.value.trim() || DEFAULT_ABOUT_SECONDARY_URL;
            fields.aboutSecondaryUrl.value = state.aboutSecondaryUrl;
        }
        if (fields.aboutButtonBackgroundColor) {
            state.aboutButtonBackgroundColor = normalizeHexColor(fields.aboutButtonBackgroundColor.value, DEFAULT_ABOUT_BTN_BG);
            fields.aboutButtonBackgroundColor.value = state.aboutButtonBackgroundColor;
            if (fields.aboutButtonBackgroundColorValue) {
                fields.aboutButtonBackgroundColorValue.textContent = state.aboutButtonBackgroundColor;
            }
        }
        if (fields.aboutButtonTextColor) {
            state.aboutButtonTextColor = normalizeHexColor(fields.aboutButtonTextColor.value, DEFAULT_ABOUT_BTN_TEXT);
            fields.aboutButtonTextColor.value = state.aboutButtonTextColor;
            if (fields.aboutButtonTextColorValue) {
                fields.aboutButtonTextColorValue.textContent = state.aboutButtonTextColor;
            }
        }
        if (fields.featureLeftHeader) state.featureLeftHeader = fields.featureLeftHeader.value.trim();
        if (fields.featureLeftParagraph) state.featureLeftParagraph = fields.featureLeftParagraph.value.trim();
        if (fields.featureLeftButtonLabel) state.featureLeftButtonLabel = fields.featureLeftButtonLabel.value.trim();
        if (fields.featureLeftButtonUrl) {
            state.featureLeftButtonUrl = fields.featureLeftButtonUrl.value.trim() || DEFAULT_FEATURE_LEFT_BUTTON_URL;
            fields.featureLeftButtonUrl.value = state.featureLeftButtonUrl;
        }
        if (fields.featureRightHeader) state.featureRightHeader = fields.featureRightHeader.value.trim();
        if (fields.featureRightParagraph) state.featureRightParagraph = fields.featureRightParagraph.value.trim();
        if (fields.featureRightButtonLabel) state.featureRightButtonLabel = fields.featureRightButtonLabel.value.trim();
        if (fields.featureRightButtonUrl) {
            state.featureRightButtonUrl = fields.featureRightButtonUrl.value.trim() || DEFAULT_FEATURE_RIGHT_BUTTON_URL;
            fields.featureRightButtonUrl.value = state.featureRightButtonUrl;
        }
        if (fields.featureLeftButtonHide) {
            state.featureLeftButtonVisible = !fields.featureLeftButtonHide.checked;
        }
        if (fields.featureRightButtonHide) {
            state.featureRightButtonVisible = !fields.featureRightButtonHide.checked;
        }
        if (fields.featureButtonBackgroundColor) {
            state.featureButtonBackgroundColor = normalizeHexColor(fields.featureButtonBackgroundColor.value, DEFAULT_FEATURE_BTN_BG);
            fields.featureButtonBackgroundColor.value = state.featureButtonBackgroundColor;
            if (fields.featureButtonBackgroundColorValue) {
                fields.featureButtonBackgroundColorValue.textContent = state.featureButtonBackgroundColor;
            }
        }
        if (fields.featureButtonTextColor) {
            state.featureButtonTextColor = normalizeHexColor(fields.featureButtonTextColor.value, DEFAULT_FEATURE_BTN_TEXT);
            fields.featureButtonTextColor.value = state.featureButtonTextColor;
            if (fields.featureButtonTextColorValue) {
                fields.featureButtonTextColorValue.textContent = state.featureButtonTextColor;
            }
        }
        if (fields.sketchSectionVisible) {
            state.sketchSectionVisible = fields.sketchSectionVisible.checked;
        }
        if (fields.footerEmail) state.footerEmail = fields.footerEmail.value.trim() || DEFAULT_FOOTER_EMAIL;
        if (fields.footerFacebookUrl) state.footerFacebookUrl = fields.footerFacebookUrl.value.trim();
        if (fields.footerFacebookVisible) state.footerFacebookVisible = fields.footerFacebookVisible.checked;
        if (fields.footerInstagramUrl) state.footerInstagramUrl = fields.footerInstagramUrl.value.trim();
        if (fields.footerInstagramVisible) state.footerInstagramVisible = fields.footerInstagramVisible.checked;
        if (fields.footerXUrl) state.footerXUrl = fields.footerXUrl.value.trim();
        if (fields.footerXVisible) state.footerXVisible = fields.footerXVisible.checked;
        if (fields.footerYoutubeUrl) state.footerYoutubeUrl = fields.footerYoutubeUrl.value.trim();
        if (fields.footerYoutubeVisible) state.footerYoutubeVisible = fields.footerYoutubeVisible.checked;
        if (fields.footerLinkedinUrl) state.footerLinkedinUrl = fields.footerLinkedinUrl.value.trim();
        if (fields.footerLinkedinVisible) state.footerLinkedinVisible = fields.footerLinkedinVisible.checked;
        if (fields.footerLogoUseHeader) {
            state.footerLogoUseHeader = fields.footerLogoUseHeader.checked;
        }
        readFooterLinksFromEditor();
        if (fields.footerCompanyName) state.footerCompanyName = fields.footerCompanyName.value.trim() || DEFAULT_FOOTER_COMPANY;
        if (fields.footerAddress) state.footerAddress = fields.footerAddress.value.trim() || DEFAULT_FOOTER_ADDRESS;
        if (fields.footerPhone) state.footerPhone = fields.footerPhone.value.trim() || DEFAULT_FOOTER_PHONE;
        if (fields.footerCopyrightName) state.footerCopyrightName = fields.footerCopyrightName.value.trim();
        readHeaderBannerLinksFromEditor();
        readMainNavFromEditor();
        readGalleryMainNavFromEditor();
        readGalleryCatalogTilesFromEditor();
        readClassicFooterLinksFromEditor();
        if (fields.classicFooterCompanyName) {
            state.classicFooterCompanyName = fields.classicFooterCompanyName.value.trim() || DEFAULT_FOOTER_COMPANY;
        }
        if (fields.classicFooterAboutCopy) {
            state.classicFooterAboutCopy = fields.classicFooterAboutCopy.value.trim() || DEFAULT_CLASSIC_FOOTER_ABOUT;
        }
        if (fields.classicFooterAddress) {
            state.classicFooterAddress = fields.classicFooterAddress.value.trim() || DEFAULT_FOOTER_ADDRESS;
        }
        if (fields.classicFooterHoursMonFri) {
            state.classicFooterHoursMonFri = fields.classicFooterHoursMonFri.value.trim()
                || DEFAULT_CLASSIC_FOOTER_HOURS_MON_FRI;
        }
        if (fields.classicFooterHoursSaturday) {
            state.classicFooterHoursSaturday = fields.classicFooterHoursSaturday.value.trim()
                || DEFAULT_CLASSIC_FOOTER_HOURS_SATURDAY;
        }
        if (fields.classicFooterHoursSunday) {
            state.classicFooterHoursSunday = fields.classicFooterHoursSunday.value.trim()
                || DEFAULT_CLASSIC_FOOTER_HOURS_SUNDAY;
        }
        if (fields.classicFooterCopyrightName) {
            state.classicFooterCopyrightName = fields.classicFooterCopyrightName.value.trim();
        }
        if (fields.classicFooterBackgroundColor) {
            state.classicFooterBackgroundColor = normalizeHex(
                fields.classicFooterBackgroundColor.value || DEFAULT_CLASSIC_FOOTER_BG,
            );
            fields.classicFooterBackgroundColor.value = state.classicFooterBackgroundColor;
            if (fields.classicFooterBackgroundColorValue) {
                fields.classicFooterBackgroundColorValue.textContent = state.classicFooterBackgroundColor;
            }
        }
        if (fields.classicFooterTextColor) {
            state.classicFooterTextColor = normalizeHexColor(
                fields.classicFooterTextColor.value,
                DEFAULT_CLASSIC_FOOTER_TEXT,
            );
            fields.classicFooterTextColor.value = state.classicFooterTextColor;
            if (fields.classicFooterTextColorValue) {
                fields.classicFooterTextColorValue.textContent = state.classicFooterTextColor;
            }
        }
        if (fields.classicFooterCopyrightTextColor) {
            state.classicFooterCopyrightTextColor = normalizeHexColor(
                fields.classicFooterCopyrightTextColor.value,
                DEFAULT_CLASSIC_FOOTER_COPYRIGHT_TEXT,
            );
            fields.classicFooterCopyrightTextColor.value = state.classicFooterCopyrightTextColor;
            if (fields.classicFooterCopyrightTextColorValue) {
                fields.classicFooterCopyrightTextColorValue.textContent = state.classicFooterCopyrightTextColor;
            }
        }
        if (fields.classicFooterCopyrightBackgroundColor) {
            state.classicFooterCopyrightBackgroundColor = normalizeHex(
                fields.classicFooterCopyrightBackgroundColor.value || DEFAULT_CLASSIC_FOOTER_COPYRIGHT_BG,
            );
            fields.classicFooterCopyrightBackgroundColor.value = state.classicFooterCopyrightBackgroundColor;
            if (fields.classicFooterCopyrightBackgroundColorValue) {
                fields.classicFooterCopyrightBackgroundColorValue.textContent = state.classicFooterCopyrightBackgroundColor;
            }
        }
        if (fields.headerBannerBackgroundColor) {
            state.headerBannerBackgroundColor = normalizeHex(fields.headerBannerBackgroundColor.value || DEFAULT_HEADER_BANNER_BG);
            fields.headerBannerBackgroundColor.value = state.headerBannerBackgroundColor;
            if (fields.headerBannerBackgroundColorValue) {
                fields.headerBannerBackgroundColorValue.textContent = state.headerBannerBackgroundColor;
            }
        }
        if (fields.headerBannerTextColor) {
            const previousHeaderText = state.headerBannerTextColor;
            state.headerBannerTextColor = normalizeHexColor(
                fields.headerBannerTextColor.value,
                DEFAULT_HEADER_BANNER_TEXT,
            );
            fields.headerBannerTextColor.value = state.headerBannerTextColor;
            if (fields.headerBannerTextColorValue) {
                fields.headerBannerTextColorValue.textContent = state.headerBannerTextColor;
            }
            softCascadeFromHeaderText(previousHeaderText, state.headerBannerTextColor);
        }
        if (fields.galleryHeaderBarBackgroundColor) {
            state.galleryHeaderBarBackgroundColor = normalizeHex(
                fields.galleryHeaderBarBackgroundColor.value || DEFAULT_GALLERY_HEADER_BAR_BG,
            );
            fields.galleryHeaderBarBackgroundColor.value = state.galleryHeaderBarBackgroundColor;
            if (fields.galleryHeaderBarBackgroundColorValue) {
                fields.galleryHeaderBarBackgroundColorValue.textContent = state.galleryHeaderBarBackgroundColor;
            }
        }
        if (fields.galleryHeaderBarTextColor) {
            const previousGalleryHeaderText = state.galleryHeaderBarTextColor;
            state.galleryHeaderBarTextColor = normalizeHexColor(
                fields.galleryHeaderBarTextColor.value,
                DEFAULT_GALLERY_HEADER_BAR_TEXT,
            );
            fields.galleryHeaderBarTextColor.value = state.galleryHeaderBarTextColor;
            if (fields.galleryHeaderBarTextColorValue) {
                fields.galleryHeaderBarTextColorValue.textContent = state.galleryHeaderBarTextColor;
            }
            softCascadeFromHeaderText(previousGalleryHeaderText, state.galleryHeaderBarTextColor);
        }
        if (fields.galleryHeaderCenterCopy) {
            state.galleryHeaderCenterCopy = fields.galleryHeaderCenterCopy.value.trim()
                || DEFAULT_GALLERY_HEADER_CENTER_COPY;
            fields.galleryHeaderCenterCopy.value = state.galleryHeaderCenterCopy;
        }
        if (fields.galleryHeaderWishlistLabel) {
            state.galleryHeaderWishlistLabel = fields.galleryHeaderWishlistLabel.value.trim()
                || DEFAULT_GALLERY_HEADER_WISHLIST;
            fields.galleryHeaderWishlistLabel.value = state.galleryHeaderWishlistLabel;
        }
        if (fields.galleryHeaderSignInLabel) {
            state.galleryHeaderSignInLabel = fields.galleryHeaderSignInLabel.value.trim()
                || DEFAULT_GALLERY_HEADER_SIGN_IN;
            fields.galleryHeaderSignInLabel.value = state.galleryHeaderSignInLabel;
        }
        if (fields.galleryHeroHeadlineLine1) {
            state.galleryHeroHeadlineLine1 = fields.galleryHeroHeadlineLine1.value.trim();
            fields.galleryHeroHeadlineLine1.value = state.galleryHeroHeadlineLine1;
        }
        if (fields.galleryHeroHeadlineLine2) {
            state.galleryHeroHeadlineLine2 = fields.galleryHeroHeadlineLine2.value.trim();
            fields.galleryHeroHeadlineLine2.value = state.galleryHeroHeadlineLine2;
        }
        if (fields.galleryHeroHeadlineLine3) {
            state.galleryHeroHeadlineLine3 = fields.galleryHeroHeadlineLine3.value.trim();
            fields.galleryHeroHeadlineLine3.value = state.galleryHeroHeadlineLine3;
        }
        if (fields.galleryHeroCopy) {
            state.galleryHeroCopy = fields.galleryHeroCopy.value.trim() || DEFAULT_GALLERY_HERO_COPY;
            fields.galleryHeroCopy.value = state.galleryHeroCopy;
        }
        if (fields.galleryHeroButtonLabel) {
            state.galleryHeroButtonLabel = fields.galleryHeroButtonLabel.value.trim()
                || DEFAULT_GALLERY_HERO_BUTTON_LABEL;
            fields.galleryHeroButtonLabel.value = state.galleryHeroButtonLabel;
        }
        if (fields.galleryHeroButtonUrl) {
            state.galleryHeroButtonUrl = fields.galleryHeroButtonUrl.value.trim()
                || DEFAULT_GALLERY_HERO_BUTTON_URL;
            fields.galleryHeroButtonUrl.value = state.galleryHeroButtonUrl;
        }
        if (fields.galleryHeroButtonBackgroundColor) {
            state.galleryHeroButtonBackgroundColor = normalizeHexColor(
                fields.galleryHeroButtonBackgroundColor.value,
                DEFAULT_GALLERY_HERO_BUTTON_BG,
            );
            fields.galleryHeroButtonBackgroundColor.value = state.galleryHeroButtonBackgroundColor;
            if (fields.galleryHeroButtonBackgroundColorValue) {
                fields.galleryHeroButtonBackgroundColorValue.textContent = state.galleryHeroButtonBackgroundColor;
            }
        }
        if (fields.galleryHeroButtonTextColor) {
            state.galleryHeroButtonTextColor = normalizeHexColor(
                fields.galleryHeroButtonTextColor.value,
                DEFAULT_GALLERY_HERO_BUTTON_TEXT,
            );
            fields.galleryHeroButtonTextColor.value = state.galleryHeroButtonTextColor;
            if (fields.galleryHeroButtonTextColorValue) {
                fields.galleryHeroButtonTextColorValue.textContent = state.galleryHeroButtonTextColor;
            }
        }
        if (fields.galleryHeroSecondaryTopHeading) {
            state.galleryHeroSecondaryTopHeading = fields.galleryHeroSecondaryTopHeading.value.trim()
                || DEFAULT_GALLERY_HERO_SECONDARY_TOP_HEADING;
            fields.galleryHeroSecondaryTopHeading.value = state.galleryHeroSecondaryTopHeading;
        }
        if (fields.galleryHeroSecondaryTopUrl) {
            state.galleryHeroSecondaryTopUrl = fields.galleryHeroSecondaryTopUrl.value.trim()
                || DEFAULT_GALLERY_HERO_SECONDARY_TOP_URL;
            fields.galleryHeroSecondaryTopUrl.value = state.galleryHeroSecondaryTopUrl;
        }
        if (fields.galleryHeroSecondaryBottomHeading) {
            state.galleryHeroSecondaryBottomHeading = fields.galleryHeroSecondaryBottomHeading.value.trim()
                || DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_HEADING;
            fields.galleryHeroSecondaryBottomHeading.value = state.galleryHeroSecondaryBottomHeading;
        }
        if (fields.galleryHeroSecondaryBottomUrl) {
            state.galleryHeroSecondaryBottomUrl = fields.galleryHeroSecondaryBottomUrl.value.trim()
                || DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM_URL;
            fields.galleryHeroSecondaryBottomUrl.value = state.galleryHeroSecondaryBottomUrl;
        }
        syncPreview();
        saveState();
    }

    function populateGalleryHeaderFields(data) {
        state.galleryHeaderBarBackgroundColor = normalizeHex(
            data.galleryHeaderBarBackgroundColor || DEFAULT_GALLERY_HEADER_BAR_BG,
        );
        state.galleryHeaderBarTextColor = normalizeHexColor(
            data.galleryHeaderBarTextColor,
            DEFAULT_GALLERY_HEADER_BAR_TEXT,
        );
        state.galleryHeaderCenterCopy = data.galleryHeaderCenterCopy || DEFAULT_GALLERY_HEADER_CENTER_COPY;
        state.galleryHeaderWishlistLabel = data.galleryHeaderWishlistLabel || DEFAULT_GALLERY_HEADER_WISHLIST;
        state.galleryHeaderSignInLabel = data.galleryHeaderSignInLabel || DEFAULT_GALLERY_HEADER_SIGN_IN;

        if (fields.galleryHeaderBarBackgroundColor) {
            fields.galleryHeaderBarBackgroundColor.value = state.galleryHeaderBarBackgroundColor;
            if (fields.galleryHeaderBarBackgroundColorValue) {
                fields.galleryHeaderBarBackgroundColorValue.textContent = state.galleryHeaderBarBackgroundColor;
            }
        }
        if (fields.galleryHeaderBarTextColor) {
            fields.galleryHeaderBarTextColor.value = state.galleryHeaderBarTextColor;
            if (fields.galleryHeaderBarTextColorValue) {
                fields.galleryHeaderBarTextColorValue.textContent = state.galleryHeaderBarTextColor;
            }
        }
        if (fields.galleryHeaderCenterCopy) {
            fields.galleryHeaderCenterCopy.value = state.galleryHeaderCenterCopy;
        }
        if (fields.galleryHeaderWishlistLabel) {
            fields.galleryHeaderWishlistLabel.value = state.galleryHeaderWishlistLabel;
        }
        if (fields.galleryHeaderSignInLabel) {
            fields.galleryHeaderSignInLabel.value = state.galleryHeaderSignInLabel;
        }
        state.galleryMainNavLinks = migrateGalleryMainNavLinks(data);
        renderGalleryMainNavEditor();
        populateGalleryHeroFields(data);
        populateGalleryCatalogFields(data);
        populateClassicFooterFields(data);
    }

    function populateHeaderFields(data) {
        if (templateDesign === 'gallery') {
            state.headerLogoImage = savedGalleryImageRef(data.headerLogoImage) || DEFAULT_GALLERY_HEADER_LOGO;
        } else if (templateDesign === 'spotlight') {
            const saved = data.headerLogoImage;
            const fallback = window.SpotlightEditor?.DEFAULT_HEADER_LOGO || 'Spotlight/xologic-logo.png';
            if (saved && (String(saved).startsWith('data:') || String(saved).startsWith('spotlight/') || String(saved).startsWith('Spotlight/'))) {
                state.headerLogoImage = saved;
            } else {
                state.headerLogoImage = fallback;
            }
        } else {
            state.headerLogoImage = savedClassicImageRef(data.headerLogoImage)
                || savedClassicImageRef(data.footerLogoImage)
                || DEFAULT_CLASSIC_HEADER_LOGO;
        }
        const spotlightBannerBg = window.SpotlightEditor?.DEFAULT_HEADER_BANNER_BG || '#254155';
        const spotlightBannerText = window.SpotlightEditor?.DEFAULT_HEADER_BANNER_TEXT || DEFAULT_HEADER_BANNER_TEXT;
        const headerBannerBgFallback = templateDesign === 'spotlight' ? spotlightBannerBg : DEFAULT_HEADER_BANNER_BG;
        const headerBannerTextFallback = templateDesign === 'spotlight' ? spotlightBannerText : DEFAULT_HEADER_BANNER_TEXT;
        state.headerBannerBackgroundColor = normalizeHex(data.headerBannerBackgroundColor || headerBannerBgFallback);
        state.headerBannerTextColor = normalizeHexColor(
            data.headerBannerTextColor,
            headerBannerTextFallback,
        );
        state.headerBannerLinks = migrateHeaderBannerLinks(data);
        state.mainNavItems = migrateMainNavItems(data);
        state.headerLogoSize = clampHeaderLogoSize(data.headerLogoSize);
        populateGalleryHeaderFields(data);

        renderHeaderBannerLinksEditor();
        renderMainNavEditor();
        if (fields.headerBannerBackgroundColor) {
            fields.headerBannerBackgroundColor.value = state.headerBannerBackgroundColor;
            if (fields.headerBannerBackgroundColorValue) {
                fields.headerBannerBackgroundColorValue.textContent = state.headerBannerBackgroundColor;
            }
        }
        if (fields.headerBannerTextColor) {
            fields.headerBannerTextColor.value = state.headerBannerTextColor;
            if (fields.headerBannerTextColorValue) {
                fields.headerBannerTextColorValue.textContent = state.headerBannerTextColor;
            }
        }
    }

    function populateFooterFields(data) {
        state.footerLogoImage = data.footerLogoImage || '';
        state.footerLogoUseHeader = data.footerLogoUseHeader !== false;
        if (fields.footerLogoUseHeader) {
            fields.footerLogoUseHeader.checked = state.footerLogoUseHeader;
        }
        state.footerEmail = data.footerEmail || DEFAULT_FOOTER_EMAIL;
        state.footerFacebookUrl = data.footerFacebookUrl || '';
        state.footerFacebookVisible = data.footerFacebookVisible !== false;
        state.footerInstagramUrl = data.footerInstagramUrl || '';
        state.footerInstagramVisible = data.footerInstagramVisible !== false;
        state.footerXUrl = data.footerXUrl || '';
        state.footerXVisible = data.footerXVisible !== false;
        state.footerYoutubeUrl = data.footerYoutubeUrl || '';
        state.footerYoutubeVisible = data.footerYoutubeVisible !== false;
        state.footerLinkedinUrl = data.footerLinkedinUrl || '';
        state.footerLinkedinVisible = data.footerLinkedinVisible !== false;
        state.footerQuickLinks = migrateFooterQuickLinks(data);
        state.footerPolicyLinks = migrateFooterPolicyLinks(data);
        state.footerCompanyName = data.footerCompanyName || DEFAULT_FOOTER_COMPANY;
        state.footerAddress = data.footerAddress || DEFAULT_FOOTER_ADDRESS;
        state.footerPhone = data.footerPhone || DEFAULT_FOOTER_PHONE;
        state.footerCopyrightName = data.footerCopyrightName || '';

        if (fields.footerEmail) fields.footerEmail.value = state.footerEmail;
        if (fields.footerFacebookUrl) fields.footerFacebookUrl.value = state.footerFacebookUrl;
        if (fields.footerFacebookVisible) fields.footerFacebookVisible.checked = state.footerFacebookVisible;
        if (fields.footerInstagramUrl) fields.footerInstagramUrl.value = state.footerInstagramUrl;
        if (fields.footerInstagramVisible) fields.footerInstagramVisible.checked = state.footerInstagramVisible;
        if (fields.footerXUrl) fields.footerXUrl.value = state.footerXUrl;
        if (fields.footerXVisible) fields.footerXVisible.checked = state.footerXVisible;
        if (fields.footerYoutubeUrl) fields.footerYoutubeUrl.value = state.footerYoutubeUrl;
        if (fields.footerYoutubeVisible) fields.footerYoutubeVisible.checked = state.footerYoutubeVisible;
        if (fields.footerLinkedinUrl) fields.footerLinkedinUrl.value = state.footerLinkedinUrl;
        if (fields.footerLinkedinVisible) fields.footerLinkedinVisible.checked = state.footerLinkedinVisible;
        renderFooterLinksEditors();
        if (fields.footerCompanyName) {
            fields.footerCompanyName.placeholder = DEFAULT_FOOTER_COMPANY;
            fields.footerCompanyName.value = state.footerCompanyName;
        }
        if (fields.footerAddress) fields.footerAddress.value = state.footerAddress;
        if (fields.footerPhone) fields.footerPhone.value = state.footerPhone;
        if (fields.footerCopyrightName) fields.footerCopyrightName.value = state.footerCopyrightName;
    }

    function populateFeatureFields(data) {
        if (fields.featureLeftHeader) fields.featureLeftHeader.value = data.featureLeftHeader || DEFAULT_FEATURE_LEFT_HEADER;
        if (fields.featureLeftParagraph) fields.featureLeftParagraph.value = data.featureLeftParagraph || DEFAULT_FEATURE_LEFT_PARAGRAPH;
        if (fields.featureLeftButtonLabel) fields.featureLeftButtonLabel.value = data.featureLeftButtonLabel || DEFAULT_FEATURE_LEFT_BUTTON_LABEL;
        if (fields.featureLeftButtonUrl) fields.featureLeftButtonUrl.value = data.featureLeftButtonUrl || DEFAULT_FEATURE_LEFT_BUTTON_URL;
        if (fields.featureRightHeader) fields.featureRightHeader.value = data.featureRightHeader || DEFAULT_FEATURE_RIGHT_HEADER;
        if (fields.featureRightParagraph) fields.featureRightParagraph.value = data.featureRightParagraph || DEFAULT_FEATURE_RIGHT_PARAGRAPH;
        if (fields.featureRightButtonLabel) fields.featureRightButtonLabel.value = data.featureRightButtonLabel || DEFAULT_FEATURE_RIGHT_BUTTON_LABEL;
        if (fields.featureRightButtonUrl) fields.featureRightButtonUrl.value = data.featureRightButtonUrl || DEFAULT_FEATURE_RIGHT_BUTTON_URL;

        state.featureButtonBackgroundColor = normalizeHexColor(data.featureButtonBackgroundColor, DEFAULT_FEATURE_BTN_BG);
        state.featureButtonTextColor = normalizeHexColor(data.featureButtonTextColor, DEFAULT_FEATURE_BTN_TEXT);
        if (fields.featureButtonBackgroundColor) {
            fields.featureButtonBackgroundColor.value = state.featureButtonBackgroundColor;
            if (fields.featureButtonBackgroundColorValue) {
                fields.featureButtonBackgroundColorValue.textContent = state.featureButtonBackgroundColor;
            }
        }
        if (fields.featureButtonTextColor) {
            fields.featureButtonTextColor.value = state.featureButtonTextColor;
            if (fields.featureButtonTextColorValue) {
                fields.featureButtonTextColorValue.textContent = state.featureButtonTextColor;
            }
        }

        state.featureLeftButtonVisible = data.featureLeftButtonVisible !== false;
        state.featureRightButtonVisible = data.featureRightButtonVisible !== false;
        if (fields.featureLeftButtonHide) {
            fields.featureLeftButtonHide.checked = !state.featureLeftButtonVisible;
        }
        if (fields.featureRightButtonHide) {
            fields.featureRightButtonHide.checked = !state.featureRightButtonVisible;
        }

        state.featureLeftHeader = fields.featureLeftHeader ? fields.featureLeftHeader.value.trim() : DEFAULT_FEATURE_LEFT_HEADER;
        state.featureLeftParagraph = fields.featureLeftParagraph ? fields.featureLeftParagraph.value.trim() : DEFAULT_FEATURE_LEFT_PARAGRAPH;
        state.featureLeftButtonLabel = fields.featureLeftButtonLabel ? fields.featureLeftButtonLabel.value.trim() : DEFAULT_FEATURE_LEFT_BUTTON_LABEL;
        state.featureLeftButtonUrl = fields.featureLeftButtonUrl ? fields.featureLeftButtonUrl.value.trim() || DEFAULT_FEATURE_LEFT_BUTTON_URL : DEFAULT_FEATURE_LEFT_BUTTON_URL;
        state.featureRightHeader = fields.featureRightHeader ? fields.featureRightHeader.value.trim() : DEFAULT_FEATURE_RIGHT_HEADER;
        state.featureRightParagraph = fields.featureRightParagraph ? fields.featureRightParagraph.value.trim() : DEFAULT_FEATURE_RIGHT_PARAGRAPH;
        state.featureRightButtonLabel = fields.featureRightButtonLabel ? fields.featureRightButtonLabel.value.trim() : DEFAULT_FEATURE_RIGHT_BUTTON_LABEL;
        state.featureRightButtonUrl = fields.featureRightButtonUrl ? fields.featureRightButtonUrl.value.trim() || DEFAULT_FEATURE_RIGHT_BUTTON_URL : DEFAULT_FEATURE_RIGHT_BUTTON_URL;
        if (templateDesign === 'gallery') {
            state.featureLeftImage = data.featureLeftImage || '';
            state.featureRightImage = data.featureRightImage || '';
        } else {
            state.featureLeftImage = resolveClassicImage(
                data.featureLeftImage,
                DEFAULT_CLASSIC_FEATURE_LEFT_IMAGE,
            );
            state.featureRightImage = resolveClassicImage(
                data.featureRightImage,
                DEFAULT_CLASSIC_FEATURE_RIGHT_IMAGE,
            );
        }
    }

    function populateAboutFields(data) {
        if (fields.aboutHeader) fields.aboutHeader.value = data.aboutHeader || DEFAULT_ABOUT_HEADER;
        if (fields.aboutParagraph) fields.aboutParagraph.value = data.aboutParagraph || DEFAULT_ABOUT_PARAGRAPH;
        if (fields.aboutPrimaryLabel) fields.aboutPrimaryLabel.value = data.aboutPrimaryLabel || DEFAULT_ABOUT_PRIMARY_LABEL;
        if (fields.aboutPrimaryUrl) fields.aboutPrimaryUrl.value = data.aboutPrimaryUrl || DEFAULT_ABOUT_PRIMARY_URL;
        if (fields.aboutSecondaryLabel) fields.aboutSecondaryLabel.value = data.aboutSecondaryLabel || DEFAULT_ABOUT_SECONDARY_LABEL;
        if (fields.aboutSecondaryUrl) fields.aboutSecondaryUrl.value = data.aboutSecondaryUrl || DEFAULT_ABOUT_SECONDARY_URL;
        state.aboutButtonBackgroundColor = normalizeHexColor(data.aboutButtonBackgroundColor, DEFAULT_ABOUT_BTN_BG);
        state.aboutButtonTextColor = normalizeHexColor(data.aboutButtonTextColor, DEFAULT_ABOUT_BTN_TEXT);
        if (fields.aboutButtonBackgroundColor) {
            fields.aboutButtonBackgroundColor.value = state.aboutButtonBackgroundColor;
            if (fields.aboutButtonBackgroundColorValue) {
                fields.aboutButtonBackgroundColorValue.textContent = state.aboutButtonBackgroundColor;
            }
        }
        if (fields.aboutButtonTextColor) {
            fields.aboutButtonTextColor.value = state.aboutButtonTextColor;
            if (fields.aboutButtonTextColorValue) {
                fields.aboutButtonTextColorValue.textContent = state.aboutButtonTextColor;
            }
        }

        state.aboutHeader = fields.aboutHeader ? fields.aboutHeader.value.trim() : DEFAULT_ABOUT_HEADER;
        state.aboutParagraph = fields.aboutParagraph ? fields.aboutParagraph.value.trim() : DEFAULT_ABOUT_PARAGRAPH;
        state.aboutPrimaryLabel = fields.aboutPrimaryLabel ? fields.aboutPrimaryLabel.value.trim() : DEFAULT_ABOUT_PRIMARY_LABEL;
        state.aboutPrimaryUrl = fields.aboutPrimaryUrl ? fields.aboutPrimaryUrl.value.trim() || DEFAULT_ABOUT_PRIMARY_URL : DEFAULT_ABOUT_PRIMARY_URL;
        state.aboutSecondaryLabel = fields.aboutSecondaryLabel ? fields.aboutSecondaryLabel.value.trim() : DEFAULT_ABOUT_SECONDARY_LABEL;
        state.aboutSecondaryUrl = fields.aboutSecondaryUrl ? fields.aboutSecondaryUrl.value.trim() || DEFAULT_ABOUT_SECONDARY_URL : DEFAULT_ABOUT_SECONDARY_URL;
        state.aboutEmployeeImage = templateDesign === 'gallery'
            ? (data.aboutEmployeeImage || '')
            : resolveClassicImage(data.aboutEmployeeImage, DEFAULT_CLASSIC_ABOUT_EMPLOYEE_IMAGE);
    }

    function populateForm(data) {
        fields.title.value = data.title || '';
        state.copyBackgroundColor = normalizeHex(data.copyBackgroundColor || DEFAULT_COPY_BG);
        fields.copyBackgroundColor.value = state.copyBackgroundColor;
        if (fields.copyBackgroundColorValue) {
            fields.copyBackgroundColorValue.textContent = state.copyBackgroundColor;
        }
        const headerTextFallback = templateDesign === 'gallery'
            ? normalizeHexColor(data.galleryHeaderBarTextColor, DEFAULT_GALLERY_HEADER_BAR_TEXT)
            : normalizeHexColor(data.headerBannerTextColor, DEFAULT_HEADER_BANNER_TEXT);
        state.copyTextColor = normalizeHexColor(data.copyTextColor, headerTextFallback);
        if (fields.copyTextColor) {
            fields.copyTextColor.value = state.copyTextColor;
            if (fields.copyTextColorValue) {
                fields.copyTextColorValue.textContent = state.copyTextColor;
            }
        }
        fields.description.value = data.description || '';
        fields.cta.value = data.cta || '';
        state.heroCtaBackgroundColor = normalizeHexColor(
            data.heroCtaBackgroundColor,
            darkenHex(state.copyBackgroundColor),
        );
        state.heroCtaTextColor = normalizeHexColor(
            data.heroCtaTextColor,
            headerTextFallback || DEFAULT_HERO_CTA_TEXT,
        );
        state.heroCtaVisible = data.heroCtaVisible !== false;
        if (fields.heroCtaHide) {
            fields.heroCtaHide.checked = !state.heroCtaVisible;
        }
        if (fields.heroCtaBackgroundColor) {
            fields.heroCtaBackgroundColor.value = state.heroCtaBackgroundColor;
            if (fields.heroCtaBackgroundColorValue) {
                fields.heroCtaBackgroundColorValue.textContent = state.heroCtaBackgroundColor;
            }
        }
        if (fields.heroCtaTextColor) {
            fields.heroCtaTextColor.value = state.heroCtaTextColor;
            if (fields.heroCtaTextColorValue) {
                fields.heroCtaTextColorValue.textContent = state.heroCtaTextColor;
            }
        }
        if (fields.shopAllUrl) {
            fields.shopAllUrl.value = data.shopAllUrl || DEFAULT_SHOP_ALL_URL;
        }
        if (templateDesign === 'gallery') {
            state.productImage = data.productImage || '';
            state.lifestyleImage = data.lifestyleImage || '';
        } else if (templateDesign !== 'spotlight') {
            state.productImage = resolveClassicImage(data.productImage, DEFAULT_CLASSIC_PRODUCT_IMAGE);
            state.lifestyleImage = resolveClassicImage(data.lifestyleImage, DEFAULT_CLASSIC_LIFESTYLE_IMAGE);
        }
        state.shopAllUrl = fields.shopAllUrl ? fields.shopAllUrl.value.trim() || DEFAULT_SHOP_ALL_URL : DEFAULT_SHOP_ALL_URL;
        state.featuredCategories = mergeFeaturedCategories(data.featuredCategories);
        state.title = fields.title.value;
        state.description = fields.description.value;
        state.cta = fields.cta.value;
        populateAboutFields(data);
        populateFeatureFields(data);
        state.sketchSectionVisible = data.sketchSectionVisible !== false;
        if (fields.sketchSectionVisible) {
            fields.sketchSectionVisible.checked = state.sketchSectionVisible;
        }
        populateYouMayLikeFields(data);
        populateGetInspiredFields(data);
        populateHeaderFields(data);
        populateFooterFields(data);
        if (templateDesign === 'spotlight' && window.SpotlightEditor) {
            SpotlightEditor.applyDataToState(data);
            SpotlightEditor.populateFormFields();
            renderHeaderBannerLinksEditor();
            renderMainNavEditor();
        }
        syncCategoryCheckboxes();
        syncPreview();
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function onImageUpload(input, key, maxBytes = 4 * 1024 * 1024) {
        const file = input.files && input.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setStatus('Please choose an image file.');
            input.value = '';
            return;
        }
        if (file.size > maxBytes) {
            setStatus(`Image must be under ${Math.round(maxBytes / (1024 * 1024))} MB.`);
            input.value = '';
            return;
        }
        try {
            state[key] = await readFileAsDataUrl(file);
            syncPreview();
            saveState();
            setStatus('Image updated');
        } catch {
            setStatus('Could not read image.');
        }
    }

    ['title', 'description', 'cta'].forEach((key) => {
        fields[key].addEventListener('input', readForm);
    });

    fields.copyBackgroundColor.addEventListener('input', readForm);
    if (fields.copyTextColor) {
        fields.copyTextColor.addEventListener('input', readForm);
    }

    if (fields.heroCtaHide) {
        fields.heroCtaHide.addEventListener('change', readForm);
        fields.heroCtaHide.addEventListener('input', readForm);
    }
    if (fields.heroCtaBackgroundColor) {
        fields.heroCtaBackgroundColor.addEventListener('input', readForm);
    }
    if (fields.heroCtaTextColor) {
        fields.heroCtaTextColor.addEventListener('input', readForm);
    }

    if (fields.aboutButtonBackgroundColor) {
        fields.aboutButtonBackgroundColor.addEventListener('input', readForm);
    }
    if (fields.aboutButtonTextColor) {
        fields.aboutButtonTextColor.addEventListener('input', readForm);
    }
    if (fields.featureButtonBackgroundColor) {
        fields.featureButtonBackgroundColor.addEventListener('input', readForm);
    }
    if (fields.featureButtonTextColor) {
        fields.featureButtonTextColor.addEventListener('input', readForm);
    }
    if (fields.featureLeftButtonHide) {
        fields.featureLeftButtonHide.addEventListener('change', readForm);
        fields.featureLeftButtonHide.addEventListener('input', readForm);
    }
    if (fields.featureRightButtonHide) {
        fields.featureRightButtonHide.addEventListener('change', readForm);
        fields.featureRightButtonHide.addEventListener('input', readForm);
    }
    if (fields.sketchSectionVisible) {
        fields.sketchSectionVisible.addEventListener('change', readForm);
    }

    ['footerFacebookVisible', 'footerInstagramVisible', 'footerXVisible', 'footerYoutubeVisible', 'footerLinkedinVisible'].forEach((key) => {
        if (fields[key]) fields[key].addEventListener('change', readForm);
    });

    if (fields.shopAllUrl) {
        fields.shopAllUrl.addEventListener('input', readForm);
    }

    [
        'aboutHeader',
        'aboutParagraph',
        'aboutPrimaryLabel',
        'aboutPrimaryUrl',
        'aboutSecondaryLabel',
        'aboutSecondaryUrl',
        'featureLeftHeader',
        'featureLeftParagraph',
        'featureLeftButtonLabel',
        'featureLeftButtonUrl',
        'featureRightHeader',
        'featureRightParagraph',
        'featureRightButtonLabel',
        'featureRightButtonUrl',
        'footerEmail',
        'footerFacebookUrl',
        'footerInstagramUrl',
        'footerXUrl',
        'footerYoutubeUrl',
        'footerLinkedinUrl',
        'footerCompanyName',
        'footerAddress',
        'footerPhone',
        'footerCopyrightName',
    ].forEach((key) => {
        if (fields[key]) fields[key].addEventListener('input', readForm);
    });

    if (fields.headerLogo) {
        fields.headerLogo.addEventListener('change', () => {
            onImageUpload(fields.headerLogo, 'headerLogoImage');
        });
    }
    if (fields.galleryHeroPrimary) {
        fields.galleryHeroPrimary.addEventListener('change', () => {
            onImageUpload(fields.galleryHeroPrimary, 'galleryHeroPrimaryImage');
        });
    }
    if (fields.galleryHeroSecondaryTop) {
        fields.galleryHeroSecondaryTop.addEventListener('change', () => {
            onImageUpload(fields.galleryHeroSecondaryTop, 'galleryHeroSecondaryTopImage');
        });
    }
    if (fields.galleryHeroSecondaryBottom) {
        fields.galleryHeroSecondaryBottom.addEventListener('change', () => {
            onImageUpload(fields.galleryHeroSecondaryBottom, 'galleryHeroSecondaryBottomImage');
        });
    }
    [
        'galleryHeroHeadlineLine1',
        'galleryHeroHeadlineLine2',
        'galleryHeroHeadlineLine3',
        'galleryHeroSecondaryTopHeading',
        'galleryHeroSecondaryTopUrl',
        'galleryHeroSecondaryBottomHeading',
        'galleryHeroSecondaryBottomUrl',
        'galleryHeroCopy',
        'galleryHeroButtonLabel',
        'galleryHeroButtonUrl',
        'galleryHeroButtonBackgroundColor',
        'galleryHeroButtonTextColor',
    ].forEach((key) => {
        if (fields[key]) fields[key].addEventListener('input', readForm);
    });

    if (fields.galleryHeaderLogo) {
        fields.galleryHeaderLogo.addEventListener('change', () => {
            onImageUpload(fields.galleryHeaderLogo, 'headerLogoImage');
        });
    }
    if (fields.galleryHeaderBarBackgroundColor) {
        fields.galleryHeaderBarBackgroundColor.addEventListener('input', readForm);
    }
    if (fields.galleryHeaderBarTextColor) {
        fields.galleryHeaderBarTextColor.addEventListener('input', readForm);
    }
    ['galleryHeaderCenterCopy', 'galleryHeaderWishlistLabel', 'galleryHeaderSignInLabel'].forEach((key) => {
        if (fields[key]) fields[key].addEventListener('input', readForm);
    });

    if (fields.footerLogo) {
        fields.footerLogo.addEventListener('change', () => {
            onImageUpload(fields.footerLogo, 'footerLogoImage');
        });
    }

    if (fields.footerLogoUseHeader) {
        fields.footerLogoUseHeader.addEventListener('change', readForm);
        fields.footerLogoUseHeader.addEventListener('input', readForm);
    }

    fields.productImage.addEventListener('change', () => {
        onImageUpload(fields.productImage, 'productImage');
    });

    fields.lifestyleImage.addEventListener('change', () => {
        onImageUpload(fields.lifestyleImage, 'lifestyleImage');
    });

    if (fields.aboutEmployeeImage) {
        fields.aboutEmployeeImage.addEventListener('change', () => {
            onImageUpload(fields.aboutEmployeeImage, 'aboutEmployeeImage');
        });
    }

    if (fields.featureLeftImage) {
        fields.featureLeftImage.addEventListener('change', () => {
            onImageUpload(fields.featureLeftImage, 'featureLeftImage', FEATURE_IMAGE_MAX_BYTES);
        });
    }

    if (fields.featureRightImage) {
        fields.featureRightImage.addEventListener('change', () => {
            onImageUpload(fields.featureRightImage, 'featureRightImage', FEATURE_IMAGE_MAX_BYTES);
        });
    }

    function assetPathCandidates(path) {
        const trimmed = String(path || '').trim();
        if (!trimmed || trimmed.startsWith('data:')) return [trimmed];

        const candidates = [trimmed];
        if (trimmed.startsWith('spotlight/')) {
            candidates.push(`Spotlight/${trimmed.slice('spotlight/'.length)}`);
        } else if (trimmed.startsWith('Spotlight/')) {
            candidates.push(`spotlight/${trimmed.slice('Spotlight/'.length)}`);
        }
        return [...new Set(candidates)];
    }

    async function fetchAssetAsDataUrl(path) {
        for (const candidate of assetPathCandidates(path)) {
            try {
                const res = await fetch(candidate);
                if (!res.ok) continue;
                const blob = await res.blob();
                const dataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                if (dataUrl) return dataUrl;
            } catch {
                // Try the next path variant.
            }
        }
        return '';
    }

    async function resolveImageDataUrlForExport(src) {
        if (!src) return '';
        if (String(src).startsWith('data:')) return src;
        return fetchAssetAsDataUrl(src);
    }

    async function resolveAssetsForExport(assets) {
        return Promise.all(assets.map(async (asset) => ({
            ...asset,
            dataUrl: await resolveImageDataUrlForExport(asset.dataUrl),
        })));
    }

    function buildGalleryHandoffSpec() {
        return {
            template: `Showroom — ${TEMPLATE_DESIGNS.gallery}`,
            design: 'gallery',
            header: buildHeaderExportSpec(),
            hero: buildGalleryHeroExportSpec(),
            catalogHighlights: buildGalleryCatalogExportSpec(),
            footer: buildClassicFooterExportSpec(),
            copyright: buildClassicCopyrightExportSpec(),
        };
    }

    async function buildGalleryHandoffAssetsForExport() {
        ensureGalleryImageDefaults();

        const assets = [
            {
                filename: 'header-logo.png',
                label: 'Header logo',
                dimensions: `${getResolvedHeaderLogoSize()} px display height`,
                dataUrl: state.headerLogoImage || DEFAULT_GALLERY_HEADER_LOGO,
            },
        ];

        if (isGalleryClientImage(state.galleryHeroPrimaryImage, DEFAULT_GALLERY_HERO_PRIMARY)) {
            assets.push({
                filename: 'gallery-hero-primary.jpg',
                label: 'Hero — large lifestyle image (left)',
                dimensions: '1479 × 500 px (primary panel)',
                dataUrl: state.galleryHeroPrimaryImage,
            });
        }

        if (isGalleryClientImage(state.galleryHeroSecondaryTopImage, DEFAULT_GALLERY_HERO_SECONDARY_TOP)) {
            assets.push({
                filename: 'gallery-hero-secondary-top.jpg',
                label: 'Hero — lifestyle image (top right)',
                dimensions: 'Hero stack panel',
                dataUrl: state.galleryHeroSecondaryTopImage,
            });
        }

        if (isGalleryClientImage(state.galleryHeroSecondaryBottomImage, DEFAULT_GALLERY_HERO_SECONDARY_BOTTOM)) {
            assets.push({
                filename: 'gallery-hero-secondary-bottom.jpg',
                label: 'Hero — lifestyle image (bottom right)',
                dimensions: 'Hero stack panel',
                dataUrl: state.galleryHeroSecondaryBottomImage,
            });
        }

        state.galleryCatalogTiles.forEach((tile, index) => {
            const tileDefaults = GALLERY_CATALOG_TILE_DEFAULTS.find((entry) => entry.id === tile.id)
                || GALLERY_CATALOG_TILE_DEFAULTS[index];
            if (!isGalleryClientImage(tile.image, tileDefaults?.defaultImage || '')) return;

            assets.push({
                filename: `gallery-catalog-tile-${index + 1}.jpg`,
                label: `Catalog Highlights — ${tile.label || `tile ${index + 1}`}`,
                dimensions: 'Catalog tile',
                dataUrl: tile.image,
            });
        });

        return resolveAssetsForExport(assets);
    }

    function readSpotlightExportForm() {
        if (!window.SpotlightEditor) return;

        SpotlightEditor.readFormFields();
        readHeaderBannerLinksFromEditor();
        readMainNavFromEditor();

        if (fields.headerBannerBackgroundColor) {
            state.headerBannerBackgroundColor = normalizeHex(
                fields.headerBannerBackgroundColor.value || DEFAULT_HEADER_BANNER_BG,
            );
            fields.headerBannerBackgroundColor.value = state.headerBannerBackgroundColor;
            if (fields.headerBannerBackgroundColorValue) {
                fields.headerBannerBackgroundColorValue.textContent = state.headerBannerBackgroundColor;
            }
        }
        if (fields.headerBannerTextColor) {
            state.headerBannerTextColor = normalizeHexColor(
                fields.headerBannerTextColor.value,
                DEFAULT_HEADER_BANNER_TEXT,
            );
            fields.headerBannerTextColor.value = state.headerBannerTextColor;
            if (fields.headerBannerTextColorValue) {
                fields.headerBannerTextColorValue.textContent = state.headerBannerTextColor;
            }
        }
    }

    function buildSpotlightHandoffSpec() {
        if (window.SpotlightEditor?.buildHandoffSpec) {
            return SpotlightEditor.buildHandoffSpec();
        }
        return { template: `Showroom — ${TEMPLATE_DESIGNS.spotlight}`, design: 'spotlight' };
    }

    async function buildSpotlightHandoffAssetsForExport() {
        if (!window.SpotlightEditor?.buildHandoffAssets) return [];
        return SpotlightEditor.buildHandoffAssets(resolveImageDataUrlForExport);
    }

    async function resolveHandoffLogoDataUrl(handoffAssets) {
        const headerAsset = handoffAssets.find((asset) => asset.filename === 'header-logo.png');
        if (headerAsset?.dataUrl && String(headerAsset.dataUrl).startsWith('data:')) {
            return headerAsset.dataUrl;
        }
        return resolveImageDataUrlForExport(state.headerLogoImage);
    }

    async function buildHandoffAssetsForExport() {
        if (templateDesign === 'gallery') {
            return buildGalleryHandoffAssetsForExport();
        }
        if (templateDesign === 'spotlight') {
            return buildSpotlightHandoffAssetsForExport();
        }

        const assets = [
            {
                filename: 'header-logo.png',
                label: 'Company logo (header)',
                dimensions: `${getResolvedHeaderLogoSize()} px display height`,
                dataUrl: state.headerLogoImage || DEFAULT_CLASSIC_HEADER_LOGO,
            },
            {
                filename: 'about-employee-image.png',
                label: 'About Us employee photo (centered, overlaps panel)',
                dimensions: '417 × 282 px',
                dataUrl: state.aboutEmployeeImage || '',
            },
            {
                filename: 'feature-left-image.png',
                label: 'Feature card photo (left)',
                dimensions: '780 × 1014 px',
                dataUrl: state.featureLeftImage || '',
            },
            {
                filename: 'feature-right-image.png',
                label: 'Feature card photo (right)',
                dimensions: '780 × 1014 px',
                dataUrl: state.featureRightImage || '',
            },
            ...(await loadYouMayLikeAssetsForExport()),
            {
                filename: 'get-inspired-lifestyle.png',
                label: 'Get Inspired lifestyle photo (left)',
                dimensions: '508 × 610 px',
                dataUrl: state.getInspiredLifestyleImage || '',
            },
        ];

        if (state.footerLogoUseHeader === false && state.footerLogoImage) {
            assets.push({
                filename: 'footer-logo.png',
                label: 'Company logo (footer)',
                dimensions: 'max 280 × 94 px',
                dataUrl: state.footerLogoImage,
            });
        }

        return resolveAssetsForExport(assets);
    }

    function buildFeaturedCategoriesExportList() {
        return FEATURED_CATEGORIES.map((category) => ({
            id: category.id,
            label: category.label,
            visible: Boolean(state.featuredCategories[category.id]),
        }));
    }

    if (exportBtn) exportBtn.addEventListener('click', async () => {
        if (captureBusy) return;
        exportInProgress = true;
        setExportLoading(true);
        let exportSucceeded = false;
        let restorePreviewAfterCapture = null;
        try {
            restorePreviewAfterCapture = await preparePreviewForCapture();
            const handoffAssets = await buildHandoffAssetsForExport();
            const handoffLogoDataUrl = await resolveHandoffLogoDataUrl(handoffAssets);
            const exportCompanyName = getHandoffCompanyName();
            const handoffFilenames = buildExportFilenames(exportCompanyName, 'handoff');
            const handoffSpec = templateDesign === 'gallery'
                ? buildGalleryHandoffSpec()
                : templateDesign === 'spotlight'
                    ? buildSpotlightHandoffSpec()
                    : {
                    template: `Showroom — ${TEMPLATE_DESIGNS.classic}`,
                    design: 'classic',
                    title: state.title,
                    description: state.description,
                    cta: state.cta,
                    heroCtaBackgroundColor: state.heroCtaBackgroundColor,
                    heroCtaTextColor: state.heroCtaTextColor,
                    heroCtaVisible: state.heroCtaVisible,
                    copyBackgroundColor: state.copyBackgroundColor,
                    copyTextColor: state.copyTextColor,
                    productImageSize: '563 × 342 px',
                    lifestyleImageSize: '854 × 670 px min',
                    shopAllUrl: state.shopAllUrl,
                    featuredCategoryImageDirectory: `editor/${FEATURED_CATEGORY_IMAGE_DIR}`,
                    featuredCategoryThumbnailSize: '70 × 70 px',
                    featuredCategoryCardSize: '300 × 70 px',
                    featuredCategoryImagesHardcoded: true,
                    featuredCategories: buildFeaturedCategoriesExportList(),
                    header: buildHeaderExportSpec(),
                    heroLayout: 'classic',
                    aboutUs: {
                        header: state.aboutHeader,
                        paragraph: state.aboutParagraph,
                        employeeImageSize: '417 × 282 px',
                        buttonBackgroundColor: state.aboutButtonBackgroundColor,
                        buttonTextColor: state.aboutButtonTextColor,
                        primaryButton: {
                            label: state.aboutPrimaryLabel,
                            url: state.aboutPrimaryUrl,
                        },
                        secondaryButton: {
                            label: state.aboutSecondaryLabel,
                            url: state.aboutSecondaryUrl,
                        },
                    },
                    featureTiles: {
                        imageSize: '780 × 1014 px',
                        buttonBackgroundColor: state.featureButtonBackgroundColor,
                        buttonTextColor: state.featureButtonTextColor,
                        left: {
                            header: state.featureLeftHeader,
                            paragraph: state.featureLeftParagraph,
                            button: {
                                label: state.featureLeftButtonLabel,
                                url: state.featureLeftButtonUrl,
                                visible: state.featureLeftButtonVisible !== false,
                            },
                        },
                        right: {
                            header: state.featureRightHeader,
                            paragraph: state.featureRightParagraph,
                            button: {
                                label: state.featureRightButtonLabel,
                                url: state.featureRightButtonUrl,
                                visible: state.featureRightButtonVisible !== false,
                            },
                        },
                    },
                    youMayLike: {
                        title: 'You May Like',
                        imageSize: '500 × 750 px',
                        catalogResolvedOnLiveSite: true,
                        itemCount: state.youMayLikeItems.length,
                        items: state.youMayLikeItems.map((item, index) => {
                            const resolved = resolveYouMayLikePreviewItem(item);
                            return {
                                index: index + 1,
                                itemNumber: item.itemNumber,
                                imageFilename: `you-may-like-${index + 1}.png`,
                                previewTitle: resolved.title,
                                previewPrice: resolved.price,
                            };
                        }),
                    },
                    getInspired: {
                        title: 'Get Inspired',
                        lifestyleImageSize: '508 × 610 px',
                        cardImageSize: '155 × 155 px',
                        gridLayout: '4 columns × 2 rows',
                        imageDirectory: 'editor/classic/get-inspired/',
                        catalogResolvedOnLiveSite: true,
                        items: state.getInspiredItems.map((item, index) => {
                            const resolved = resolveGetInspiredPreviewItem(item, index);
                            return {
                                index: index + 1,
                                row: index < 4 ? 'top' : 'bottom',
                                itemNumber: item.itemNumber,
                                previewImageFile: `${index + 1}.png`,
                                previewTitle: resolved.title,
                                previewPrice: resolved.price,
                            };
                        }),
                    },
                    footer: {
                        logoUseHeader: state.footerLogoUseHeader !== false,
                        logoFilename: 'footer-logo.png',
                        logoDimensions: 'max 280 × 94 px',
                        email: state.footerEmail,
                        companyName: state.footerCompanyName,
                        address: state.footerAddress,
                        phone: state.footerPhone,
                        copyrightName: getFooterCopyrightCompanyName(),
                        copyrightSpec: buildFooterCopyrightSpecText(getFooterCopyrightCompanyName()),
                        copyrightMarkup: buildFooterCopyrightHtml(getFooterCopyrightCompanyName()),
                        copyrightPasteMarkup: buildFooterCopyrightPasteMarkup(getFooterCopyrightCompanyName()),
                        adaCompliancePopup: FOOTER_ADA_POPUP,
                        social: Object.fromEntries(
                            FOOTER_SOCIAL_LINKS.map((social) => [
                                social.id,
                                {
                                    url: state[social.urlKey],
                                    visible: state[social.visibleKey],
                                },
                            ]),
                        ),
                        quickLinks: state.footerQuickLinks.map((link) => ({
                            label: link.label,
                            url: link.url,
                        })),
                        policies: state.footerPolicyLinks.map((link) => ({
                            label: link.label,
                            url: link.url,
                        })),
                    },
                };

            const spotlightSectionPreviews = templateDesign === 'spotlight'
                ? [
                    { el: spotlightOnSaleRoot, label: 'Preview — On Sale' },
                    { el: spotlightShopByRoomRoot, label: 'Preview — Shop by Room' },
                    { el: spotlightAboutRoot, label: 'Preview — About Us' },
                    { el: spotlightCategoryRoot, label: 'Preview — Categories' },
                    { el: spotlightBrandsRoot, label: 'Preview — Brands' },
                    { el: spotlightNewsletterRoot, label: 'Preview — Newsletter' },
                    { el: spotlightFooterRoot, label: 'Preview — Footer' },
                ]
                : [];

            await window.exportShowroomHandoff({
                headerEl: getReviewHeaderElement(),
                heroEl: templateDesign === 'gallery'
                    ? galleryHeroLayoutRoot
                    : templateDesign === 'spotlight'
                        ? showroomHeroSpotlight
                        : heroRoot,
                galleryCatalogEl: templateDesign === 'gallery' ? galleryCatalogRoot : null,
                categoriesEl: templateDesign === 'gallery' || templateDesign === 'spotlight' ? null : categoriesRoot,
                aboutEl: templateDesign === 'gallery' || templateDesign === 'spotlight' ? null : aboutRoot,
                featureTilesEl: templateDesign === 'gallery' || templateDesign === 'spotlight' ? null : featureTilesRoot,
                youMayLikeEl: templateDesign === 'gallery' || templateDesign === 'spotlight' ? null : youMayLikeRoot,
                getInspiredEl: templateDesign === 'gallery' || templateDesign === 'spotlight' ? null : getInspiredRoot,
                footerEl: templateDesign === 'gallery'
                    ? classicFooterRoot
                    : templateDesign === 'spotlight'
                        ? null
                        : footerRoot,
                copyrightEl: templateDesign === 'gallery' ? classicCopyrightRoot : null,
                spotlightSections: spotlightSectionPreviews,
                previewEl: previewRoot,
                spec: handoffSpec,
                assets: handoffAssets,
                pdfFilename: handoffFilenames.pdfFilename,
                zipFilename: handoffFilenames.zipFilename,
                guideMeta: {
                    companyName: exportCompanyName,
                    templateLabel: TEMPLATE_DESIGNS[templateDesign],
                    design: templateDesign,
                    logoDataUrl: handoffLogoDataUrl,
                },
                onProgress: (progress) => handleCaptureProgress(progress, 'handoff'),
            });
            exportSucceeded = true;
            setStatus('Handoff ZIP downloaded');
        } catch (err) {
            console.error(err);
            const detail = err && err.message ? ` — ${err.message}` : '';
            setStatus(`Export failed${detail}`);
        } finally {
            if (restorePreviewAfterCapture) restorePreviewAfterCapture();
            exportInProgress = false;
            captureBusy = false;
            if (clientReviewBtn) clientReviewBtn.disabled = false;
            if (exportSucceeded) {
                setExportSuccess();
            } else if (state.handoffExported) {
                renderExportButtonAsEvolved();
            } else {
                setExportLoading(false);
            }
        }
    });

    if (clientReviewBtn) clientReviewBtn.addEventListener('click', async () => {
        if (captureBusy || exportInProgress) return;
        setClientReviewLoading(true);
        let restorePreviewAfterCapture = null;
        let reviewExportSucceeded = false;
        try {
            restorePreviewAfterCapture = await preparePreviewForCapture();
            setReviewExportProgress(6, 'Starting section captures…');
            if (typeof window.exportShowroomClientReview !== 'function') {
                throw new Error('Client review export not loaded.');
            }
            const reviewCompanyName = getHandoffCompanyName();
            const reviewFilenames = buildExportFilenames(reviewCompanyName, 'review');
            await window.exportShowroomClientReview({
                sections: buildClientReviewSections(),
                meta: {
                    companyName: reviewCompanyName,
                    templateLabel: TEMPLATE_DESIGNS[templateDesign],
                    design: templateDesign,
                    navCatalog: buildNavCatalogForReview(),
                },
                pdfFilename: reviewFilenames.pdfFilename,
                zipFilename: reviewFilenames.zipFilename,
                onProgress: (progress) => handleCaptureProgress(progress, 'review'),
            });
            handleCaptureProgress({ phase: 'complete' }, 'review');
            reviewExportSucceeded = true;
            setStatus('Client review ZIP downloaded');
        } catch (err) {
            console.error(err);
            const detail = err && err.message ? ` — ${err.message}` : '';
            setStatus(`Review export failed${detail}`);
            if (reviewExportProgressLabel) {
                reviewExportProgressLabel.textContent = `Review export failed${detail}`;
            }
            if (reviewExportProgress) {
                reviewExportProgress.hidden = false;
            }
        } finally {
            if (restorePreviewAfterCapture) restorePreviewAfterCapture();
            captureBusy = false;
            if (reviewExportSucceeded) {
                setClientReviewSuccess();
                resetReviewExportProgress();
                if (window.triggerOneUp) {
                    window.triggerOneUp(clientReviewBtn, null, { placement: 'right' });
                }
                setCaptureButtonsDisabled(false);
            } else if (state.reviewExported) {
                renderClientReviewButtonAsLevelUp();
                resetReviewExportProgress();
                setCaptureButtonsDisabled(false);
            } else {
                setClientReviewLoading(false);
            }
        }
    });

    window.addEventListener('resize', scheduleFitPreviewScale);

    const GALLERY_EDITOR_SECTIONS = new Set([
        'editor-company-info',
        'editor-section-header',
        'editor-section-hero',
        'editor-section-gallery-catalog',
        'editor-section-footer-classic',
        'editor-section-copyright-classic',
    ]);

    const SPOTLIGHT_EDITOR_SECTIONS = new Set([
        'editor-company-info',
        'editor-section-header',
        'editor-section-hero',
        'editor-section-spotlight-on-sale',
        'editor-section-spotlight-shop-by-room',
        'editor-section-spotlight-about',
        'editor-section-spotlight-category',
        'editor-section-spotlight-brands',
        'editor-section-spotlight-newsletter',
        'editor-section-spotlight-footer',
    ]);

    function applyGalleryEditorPanelVisibility(isGallery) {
        if (!editorPanel) return;

        const isSpotlight = templateDesign === 'spotlight';

        editorPanel.querySelectorAll('.editor-panel-block').forEach((block) => {
            const sectionId = block.dataset.sectionId || '';
            if (isGallery) {
                block.hidden = !GALLERY_EDITOR_SECTIONS.has(sectionId);
            } else if (isSpotlight) {
                block.hidden = !SPOTLIGHT_EDITOR_SECTIONS.has(sectionId);
            } else {
                block.hidden = sectionId === 'editor-section-gallery-catalog'
                    || sectionId === 'editor-section-footer-classic'
                    || sectionId === 'editor-section-copyright-classic'
                    || sectionId.startsWith('editor-section-spotlight-');
            }
        });
    }

    function hideMcQueenGalleryEditorUI() {
        const isGallery = templateDesign === 'gallery';
        const isSpotlight = templateDesign === 'spotlight';
        const isMcQueen = templateDesign === 'classic';

        if (editorHeaderClassic) editorHeaderClassic.hidden = isGallery;
        if (editorHeaderGallery) editorHeaderGallery.hidden = !isGallery;
        if (showroomHeaderClassic) showroomHeaderClassic.hidden = isGallery || isSpotlight;
        if (showroomHeaderGallery) showroomHeaderGallery.hidden = !isGallery;
        if (editorHeroClassic) editorHeroClassic.hidden = isGallery || isSpotlight;
        if (editorHeroGallery) editorHeroGallery.hidden = !isGallery;
        if (editorGalleryCatalog) editorGalleryCatalog.hidden = !isGallery;
        if (showroomHeroClassic) showroomHeroClassic.hidden = isGallery || isSpotlight;
        if (showroomHeroGallery) showroomHeroGallery.hidden = !isGallery;
        if (editorClassicSections) editorClassicSections.hidden = isGallery || isSpotlight;
        if (showroomClassicSections) showroomClassicSections.hidden = isGallery || isSpotlight;
        if (editorFooterClassic) editorFooterClassic.hidden = !isGallery;
        if (editorCopyrightClassic) editorCopyrightClassic.hidden = !isGallery;
        if (classicFooterRoot) classicFooterRoot.hidden = !isGallery;
        if (classicCopyrightRoot) classicCopyrightRoot.hidden = !isGallery;
        if (footerRoot) footerRoot.hidden = isGallery || isSpotlight;

        const editorHeroSpotlight = document.getElementById('editorHeroSpotlight');
        const showroomHeaderSpotlight = document.getElementById('showroomHeaderSpotlight');
        const showroomHeroSpotlight = document.getElementById('showroomHeroSpotlight');
        const showroomSpotlightSections = document.getElementById('showroomSpotlightSections');

        if (editorHeroSpotlight) editorHeroSpotlight.hidden = !isSpotlight;
        if (showroomHeaderSpotlight) showroomHeaderSpotlight.hidden = !isSpotlight;
        if (showroomHeroSpotlight) showroomHeroSpotlight.hidden = !isSpotlight;
        if (showroomSpotlightSections) showroomSpotlightSections.hidden = !isSpotlight;

        const editorHeaderSpotlightHint = document.getElementById('editorHeaderSpotlightHint');
        const editorHeaderClassicHint = document.getElementById('editorHeaderClassicHint');
        if (editorHeaderSpotlightHint) editorHeaderSpotlightHint.hidden = !isSpotlight;
        if (editorHeaderClassicHint) editorHeaderClassicHint.hidden = isSpotlight;

        const editorHeaderLogoHint = document.getElementById('editorHeaderLogoHint');
        if (editorHeaderLogoHint) {
            editorHeaderLogoHint.textContent = isSpotlight
                ? 'Left side of the header toolbar. PNG or SVG · max 220 × 68 px.'
                : 'Centered in the header toolbar. PNG or SVG · max 220 × 68 px.';
        }

        const editorSpotlightBannerFields = document.getElementById('editorSpotlightBannerFields');
        const editorSpotlightHeaderLinks = document.getElementById('editorSpotlightHeaderLinks');
        const editorHeaderBannerLinksHint = document.getElementById('editorHeaderBannerLinksHint');
        if (editorSpotlightBannerFields) editorSpotlightBannerFields.hidden = !isSpotlight;
        if (editorSpotlightHeaderLinks) editorSpotlightHeaderLinks.hidden = !isSpotlight;
        if (editorHeaderBannerLinksHint) {
            editorHeaderBannerLinksHint.hidden = isSpotlight;
        }

        document.querySelectorAll('.editor-section-nav-link--spotlight').forEach((link) => {
            link.hidden = !isSpotlight;
        });
        document.querySelectorAll('.editor-section-nav-link--mcqueen').forEach((link) => {
            link.hidden = !isMcQueen;
        });
        document.querySelectorAll('.editor-section-nav-link--gallery').forEach((link) => {
            link.hidden = !isGallery;
        });

        applyGalleryEditorPanelVisibility(isGallery);

        const editorPreviewTheme = document.getElementById('editorPreviewTheme');
        if (editorPreviewTheme) {
            editorPreviewTheme.hidden = !isSpotlight && !isMcQueen && !isGallery;
        }
        if (previewRoot && !isSpotlight && !isMcQueen && !isGallery) {
            previewRoot.setAttribute('data-preview-theme', 'light');
        }

        if (refreshEditorSectionNavSpy) {
            refreshEditorSectionNavSpy();
        }
    }

    function applyTemplateDesignUI() {
        const label = TEMPLATE_DESIGNS[templateDesign];
        const nameEl = document.getElementById('editorTemplateName');
        if (nameEl) nameEl.textContent = label;

        document.title = `Showroom Editor — ${label} — LogicX`;
        document.body.classList.add(`editor-page--${templateDesign}`);
        document.body.dataset.templateDesign = templateDesign;

        hideMcQueenGalleryEditorUI();
        renderHeaderJumpNav();

        if (templateDesign === 'gallery') {
            ensureGalleryImageDefaults();
            if (galleryCatalogTilesEditor && !galleryCatalogTilesEditor.childElementCount) {
                renderGalleryCatalogTilesEditor();
            } else if (galleryCatalogTilesEditor) {
                state.galleryCatalogTiles.forEach((tile) => {
                    setUploadPreviewImage(
                        document.getElementById(`uploadPreviewGalleryCatalog-${tile.id}`),
                        tile.image,
                    );
                });
            }
            if (classicFooterShopLinksEditor && !classicFooterShopLinksEditor.childElementCount) {
                renderClassicFooterLinksEditors();
            }
            syncGalleryPreview();
        } else if (templateDesign === 'spotlight' && window.SpotlightEditor) {
            SpotlightEditor.applyUI();
            SpotlightEditor.syncPreview();
        }

        markPreviewJumpTargets();
        markPreviewImageJumpTargets();
    }

    function finishGalleryEditorInit(options = {}) {
        if (templateDesign !== 'gallery') return;

        ensureGalleryImageDefaults();
        if (galleryCatalogTilesEditor) {
            renderGalleryCatalogTilesEditor();
        }
        renderClassicFooterLinksEditors();
        applyTemplateDesignUI();
        syncGalleryPreview();
        scheduleFitPreviewScale();

        applyPreviewTheme();
    }

    function buildSpotlightEditorContext() {
        return {
            getState: () => state,
            saveState,
            setStatus,
            scheduleFitPreviewScale,
            escapeHtml,
            normalizeHex,
            normalizeHexColor,
            applyImage,
            resolveEditorAssetPath,
            setUploadPreviewImage,
            readFileAsDataUrl,
            renderMainNavEditor,
            renderHeaderBannerEditor: () => {
                if (headerBannerLinksEditor && !headerBannerLinksEditor.childElementCount) {
                    renderHeaderBannerLinksEditor();
                }
            },
            renderHeaderJumpNav,
            syncLogoUploadPreviews,
            getEffectiveHeaderLogo,
            hideMcQueenGalleryUI: hideMcQueenGalleryEditorUI,
            applyPreviewTheme,
            DEFAULT_HEADER_BANNER_BG,
            DEFAULT_HEADER_BANNER_TEXT,
        };
    }

    function finishSpotlightEditorInit(options = {}) {
        if (templateDesign !== 'spotlight' || !window.SpotlightEditor) return;

        if (!mainNavEditor || !mainNavEditor.childElementCount) {
            renderMainNavEditor();
        }
        if (headerBannerLinksEditor && !headerBannerLinksEditor.childElementCount) {
            renderHeaderBannerLinksEditor();
        }

        SpotlightEditor.finishInit(options);
    }

    function finishClassicEditorInit(options = {}) {
        if (templateDesign === 'gallery' || templateDesign === 'spotlight') return;

        ensureClassicImageDefaults();
        if (youMayLikeEditor) {
            renderYouMayLikeEditor();
        }
        applyTemplateDesignUI();
        syncPreview();

        applyPreviewTheme();
    }

    async function init() {
        if (templateDesign === 'spotlight' && window.SpotlightEditor) {
            SpotlightEditor.integrate(buildSpotlightEditorContext());
        }

        buildCategoryCheckboxes();
        structureEditorPanel();
        bindSectionNav();
        bindSectionScrollSpy();
        bindHeaderJumpNav();
        bindPreviewScroll();
        bindPreviewTheme();
        bindPreviewSectionJump();
        bindYouMayLikeEditorEvents();
        bindGetInspiredEditorEvents();
        bindHeaderBannerEditorEvents();
        bindGalleryMainNavEditorEvents();
        bindGalleryCatalogEditorEvents();
        bindMainNavEditorEvents();
        bindFooterLinksEditorEvents();
        bindClassicFooterEditorEvents();
        bindClassicCopyrightEditorEvents();
        bindHeaderLogoSizeControls();
        bindPreviewResizeObserver();
        window.addEventListener('load', scheduleFitPreviewScale);

        applyTemplateDesignUI();

        baselineState = loadBaselineState();
        const baselineWasStored = Boolean(baselineState);
        const saved = loadState();
        const defaultsPayload = await loadTemplateDefaultsPayload();

        if (!baselineState) {
            await captureBaselineFromFactoryDefaults();
        }

        if (saved) {
            let restored = saved;
            if (templateDesign === 'gallery') {
                restored = migrateLoadedGalleryState(saved);
            } else if (templateDesign === 'spotlight' && window.SpotlightEditor) {
                restored = SpotlightEditor.migrateLoaded(saved);
            } else {
                restored = migrateLoadedClassicState(saved);
            }
            populateForm(restored);
            if (Array.isArray(restored.reviewedSections)) {
                state.reviewedSections = restored.reviewedSections;
            }
            if (restored.previewTheme === 'dark') {
                state.previewTheme = 'dark';
            }
            if (restored.handoffExported) {
                state.handoffExported = true;
            }
            if (restored.reviewExported) {
                state.reviewExported = true;
            }
            if (templateDesign === 'gallery') {
                finishGalleryEditorInit();
            } else if (templateDesign === 'spotlight') {
                finishSpotlightEditorInit();
            } else {
                finishClassicEditorInit();
            }
        } else if (baselineWasStored) {
            populateForm(defaultsPayload);
            if (templateDesign === 'gallery') {
                finishGalleryEditorInit();
            } else if (templateDesign === 'spotlight') {
                finishSpotlightEditorInit();
            } else {
                finishClassicEditorInit();
            }
            saveState({ silent: true });
        } else {
            if (templateDesign === 'gallery') {
                finishGalleryEditorInit();
            } else if (templateDesign === 'spotlight') {
                finishSpotlightEditorInit();
            } else {
                finishClassicEditorInit();
            }
            saveState({ silent: true });
        }

        applyExportButtonState();
        applyClientReviewButtonState();
        initResetBtn();

        window.addEventListener('pagehide', flushSessionToStorage);
        window.addEventListener('beforeunload', flushSessionToStorage);

        if (window.EditorProgressDock) {
            EditorProgressDock.init({
                getState: () => state,
                getBaselineState: () => baselineState || state,
                getDesign: () => templateDesign,
                onJump: (sectionId) => jumpToEditorSection(sectionId),
                saveState,
            });
        }
    }

    init();
})();
