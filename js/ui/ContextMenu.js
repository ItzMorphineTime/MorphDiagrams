/**
 * @module ui/ContextMenu
 * @description Right-click menu. The caller supplies the items, so the same component serves shapes,
 * connectors, waypoints and the empty canvas.
 *
 * @example
 * menu.show(e.clientX, e.clientY, [
 *     { label: 'Copy', shortcut: 'Ctrl+C', action: () => app.copy() },
 *     { separator: true },
 *     { label: 'Delete', shortcut: 'Del', danger: true, action: () => app.deleteSelected() }
 * ]);
 */

/**
 * @typedef {Object} MenuItem
 * @property {string} [label]
 * @property {string} [shortcut]
 * @property {string} [icon] Id of an SVG symbol in the page's icon sprite (without `#`).
 * @property {function(): void} [action]
 * @property {boolean} [disabled]
 * @property {boolean} [danger] Render in the danger colour.
 * @property {boolean} [checked] Render a check mark (toggle items).
 * @property {boolean} [separator] Render a separator instead of an item.
 */

export class ContextMenu {
    /**
     * @param {HTMLElement} canvas Element whose native context menu is replaced.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.menu = document.createElement('div');
        this.menu.className = 'context-menu';
        this.menu.style.display = 'none';
        this.menu.setAttribute('role', 'menu');
        document.body.appendChild(this.menu);
        this.visible = false;

        document.addEventListener('mousedown', (e) => {
            if (this.visible && !this.menu.contains(e.target)) this.hide();
        });
        document.addEventListener('keydown', (e) => {
            if (this.visible && e.key === 'Escape') this.hide();
        });
        window.addEventListener('blur', () => this.hide());
        window.addEventListener('resize', () => this.hide());
    }

    /**
     * Shows the menu at a screen position.
     * @param {number} x
     * @param {number} y
     * @param {MenuItem[]} items
     */
    show(x, y, items) {
        this.menu.innerHTML = '';
        let lastWasSeparator = true;
        for (const item of items) {
            if (item.separator) {
                if (lastWasSeparator) continue;
                const sep = document.createElement('div');
                sep.className = 'context-menu-separator';
                this.menu.appendChild(sep);
                lastWasSeparator = true;
                continue;
            }
            lastWasSeparator = false;
            const el = document.createElement('button');
            el.type = 'button';
            el.className = 'context-menu-item' + (item.disabled ? ' disabled' : '') + (item.danger ? ' danger' : '');
            el.setAttribute('role', 'menuitem');
            if (item.disabled) el.disabled = true;

            const icon = document.createElement('span');
            icon.className = 'context-menu-icon';
            if (item.icon) {
                icon.innerHTML = `<svg class="icon"><use href="#${item.icon}"></use></svg>`;
            } else if (item.checked) {
                icon.textContent = '✓';
            }
            el.appendChild(icon);

            const label = document.createElement('span');
            label.className = 'context-menu-label';
            label.textContent = item.label;
            el.appendChild(label);

            if (item.shortcut) {
                const sc = document.createElement('span');
                sc.className = 'shortcut';
                sc.textContent = item.shortcut;
                el.appendChild(sc);
            }

            if (!item.disabled && item.action) {
                el.addEventListener('click', () => {
                    this.hide();
                    item.action();
                });
            }
            this.menu.appendChild(el);
        }
        if (this.menu.lastElementChild && this.menu.lastElementChild.classList.contains('context-menu-separator')) {
            this.menu.lastElementChild.remove();
        }

        this.menu.style.display = 'block';
        this.menu.style.left = '0px';
        this.menu.style.top = '0px';
        const rect = this.menu.getBoundingClientRect();
        const left = Math.min(x, window.innerWidth - rect.width - 8);
        const top = Math.min(y, window.innerHeight - rect.height - 8);
        this.menu.style.left = Math.max(4, left) + 'px';
        this.menu.style.top = Math.max(4, top) + 'px';
        this.visible = true;
    }

    hide() {
        if (!this.visible) return;
        this.menu.style.display = 'none';
        this.visible = false;
    }

    destroy() {
        this.menu.remove();
    }
}
