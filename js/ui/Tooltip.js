/**
 * @module ui/Tooltip
 * @description Lightweight tooltip layer for elements with a `data-tip` attribute. A single floating
 * element is positioned next to the hovered (or keyboard-focused) control, so tooltips are never clipped
 * by scrolling containers such as the tool palette.
 *
 * Attributes:
 * - `data-tip`       title text; a trailing "(Ctrl+Z)" is shown as a shortcut chip automatically
 * - `data-tip-key`   explicit shortcut chip
 * - `data-tip-desc`  optional second line with a longer description
 * - `data-tip-side`  `top` | `bottom` | `left` | `right`; may also be set on an ancestor (e.g. the palette)
 *
 * @example
 * installTooltips();
 * // <button data-tip="Connector" data-tip-key="L" data-tip-desc="Drag from a port to a compatible port">
 */

import { escapeHtml } from '../utils/Dom.js';

/**
 * Installs the global tooltip behaviour. Safe to call once per page.
 * @param {Object} [options]
 * @param {number} [options.delay=350] Hover delay in milliseconds.
 * @returns {{destroy: function(): void}}
 */
export function installTooltips(options = {}) {
    const delay = options.delay ?? 350;
    const el = document.createElement('div');
    el.className = 'tooltip';
    el.setAttribute('role', 'tooltip');
    el.style.display = 'none';
    document.body.appendChild(el);

    let timer = null;
    let current = null;

    const parse = (target) => {
        let title = target.dataset.tip || '';
        let key = target.dataset.tipKey || '';
        if (!key) {
            const m = /^(.*?)\s*\(([^()]+)\)\s*$/.exec(title);
            if (m && /[A-Za-z0-9+]/.test(m[2]) && m[2].length <= 16) {
                title = m[1];
                key = m[2];
            }
        }
        return { title, key, desc: target.dataset.tipDesc || '' };
    };

    const position = (target) => {
        const side = target.dataset.tipSide || (target.closest('[data-tip-side]') || {}).dataset?.tipSide || 'bottom';
        const r = target.getBoundingClientRect();
        const gap = 8;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        let left;
        let top;
        switch (side) {
            case 'right': left = r.right + gap; top = r.top + r.height / 2 - h / 2; break;
            case 'left': left = r.left - gap - w; top = r.top + r.height / 2 - h / 2; break;
            case 'top': left = r.left + r.width / 2 - w / 2; top = r.top - gap - h; break;
            default: left = r.left + r.width / 2 - w / 2; top = r.bottom + gap;
        }
        left = Math.max(6, Math.min(left, window.innerWidth - w - 6));
        top = Math.max(6, Math.min(top, window.innerHeight - h - 6));
        el.style.left = `${Math.round(left)}px`;
        el.style.top = `${Math.round(top)}px`;
        el.dataset.side = side;
    };

    const show = (target) => {
        const { title, key, desc } = parse(target);
        if (!title) return;
        el.innerHTML = `<span class="tooltip-title">${escapeHtml(title)}</span>` +
            (key ? `<kbd class="tooltip-key">${escapeHtml(key)}</kbd>` : '') +
            (desc ? `<span class="tooltip-desc">${escapeHtml(desc)}</span>` : '');
        el.style.display = 'block';
        position(target);
        el.classList.add('visible');
    };

    const hide = () => {
        clearTimeout(timer);
        timer = null;
        current = null;
        el.classList.remove('visible');
        el.style.display = 'none';
    };

    const schedule = (target) => {
        if (target === current) return;
        hide();
        if (!target || target.disabled) return;
        current = target;
        timer = setTimeout(() => { if (current === target) show(target); }, delay);
    };

    const onOver = (e) => schedule(e.target.closest ? e.target.closest('[data-tip]') : null);
    const onOut = (e) => {
        const target = e.target.closest ? e.target.closest('[data-tip]') : null;
        if (target && target === current && !(e.relatedTarget && target.contains(e.relatedTarget))) hide();
    };
    const onFocusIn = (e) => {
        const target = e.target.closest ? e.target.closest('[data-tip]') : null;
        if (target && target.matches(':focus-visible')) schedule(target);
    };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', hide);
    document.addEventListener('mousedown', hide, true);
    document.addEventListener('keydown', hide, true);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('blur', hide);
    window.addEventListener('resize', hide);

    return {
        destroy() {
            hide();
            document.removeEventListener('mouseover', onOver);
            document.removeEventListener('mouseout', onOut);
            document.removeEventListener('focusin', onFocusIn);
            document.removeEventListener('focusout', hide);
            document.removeEventListener('mousedown', hide, true);
            document.removeEventListener('keydown', hide, true);
            window.removeEventListener('scroll', hide, true);
            window.removeEventListener('blur', hide);
            window.removeEventListener('resize', hide);
            el.remove();
        }
    };
}
