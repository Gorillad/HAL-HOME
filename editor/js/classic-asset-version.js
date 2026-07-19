/**
 * Classic (gallery) handoff asset cache-bust version.
 * Single source of truth for ?vN on CSS, JS, and images.
 *
 * Bump CODE_FLOOR when shipping template CSS/JS/layout changes in the repo.
 * Editors can raise the version higher per client (logo/image swaps) without
 * a code change — Export handoff then writes ?vN into Meta Data + HTML.
 */
(function (global) {
    /** Minimum version shipped with this codebase (raise when template assets change). */
    var CODE_FLOOR = 9;

    function normalize(value) {
        var n = parseInt(value, 10);
        if (isNaN(n) || n < 1) return CODE_FLOOR;
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
