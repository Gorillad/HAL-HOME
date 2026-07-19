/**
 * Classic (gallery) handoff asset cache-bust version.
 * Single source of truth for ?vN on CSS, JS, and images.
 *
 * Default is 0 for a fresh client homepage that has not been customized yet.
 * Used by Classic (gallery) and McQueen (classic) Showroom support handoffs.
 * Editors bump the version when replacing CSS, JS, or images so Export handoff
 * writes ?vN into Meta Data + HTML and live browsers load the new files.
 */
(function (global) {
    /** Starting version for new Classic drafts (clients who have not begun yet). */
    var CODE_FLOOR = 0;

    function normalize(value) {
        var n = parseInt(value, 10);
        if (isNaN(n) || n < 0) return CODE_FLOOR;
        return Math.max(CODE_FLOOR, n);
    }

    function query(value) {
        return '?v' + normalize(value);
    }

    function withQuery(url, value) {
        var base = String(url || '').split('?')[0];
        if (!base) return query(value);
        return base + query(value);
    }

    function label(value) {
        return 'v' + normalize(value);
    }

    global.ShowroomClassicAssetVersion = {
        CODE_FLOOR: CODE_FLOOR,
        DEFAULT: CODE_FLOOR,
        normalize: normalize,
        query: query,
        withQuery: withQuery,
        label: label,
    };
}(typeof window !== 'undefined' ? window : this));
