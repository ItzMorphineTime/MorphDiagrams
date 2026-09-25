/**
 * @module utils/Dom
 * @description Tiny DOM/browser helpers shared by the editor modules.
 */

/**
 * Escapes text for safe interpolation into innerHTML.
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Generates an id with the given prefix.
 * @param {string} prefix
 * @returns {string}
 */
export function newId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Triggers a file download for a blob.
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Inline SVG icon markup referencing the page's icon sprite.
 * @param {string} id Symbol id without `#`.
 * @returns {string}
 */
export function icon(id) {
    return `<svg class="icon" aria-hidden="true"><use href="#${id}"></use></svg>`;
}

/**
 * Debounces a function.
 * @param {Function} fn
 * @param {number} ms
 * @returns {Function}
 */
export function debounce(fn, ms) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}
