/**
 * @module utils/Color
 * @description Small colour helpers shared by the canvas renderer and the SVG exporter.
 */

/**
 * Parses a `#rgb` / `#rrggbb` hex colour into components.
 * @param {string} hex
 * @returns {{r:number,g:number,b:number}|null}
 */
export function parseHex(hex) {
    if (typeof hex !== 'string') return null;
    let h = hex.trim().replace(/^#/, '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16)
    };
}

/**
 * Relative luminance (0..1) of a hex colour. Non-hex input (rgba(), names) is treated as mid-grey.
 * @param {string} color
 * @returns {number}
 */
export function luminance(color) {
    const rgb = parseHex(color);
    if (!rgb) return 0.5;
    const lin = v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
}

/**
 * Returns black or white, whichever is more legible on top of `background`.
 * @param {string} background
 * @returns {string}
 */
export function contrastColor(background) {
    return luminance(background) > 0.45 ? '#111111' : '#ffffff';
}

/** Distinct fallback palette used for connection types that have no explicit colour. */
export const FALLBACK_PALETTE = [
    '#E91E63', '#3F51B5', '#009688', '#FF9800', '#795548',
    '#607D8B', '#8BC34A', '#00BCD4', '#9C27B0', '#CDDC39'
];

/**
 * Deterministically picks a palette colour for an arbitrary string key.
 * @param {string} key
 * @returns {string}
 */
export function paletteColorFor(key) {
    let hash = 0;
    for (const ch of String(key)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}
