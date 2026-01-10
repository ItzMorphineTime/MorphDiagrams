/**
 * @module ui/ContextMenu
 * @description Context menu handler for canvas right-click interactions. Provides context-sensitive menu items based on the clicked object or canvas area.
 *
 * @remarks
 * - Menu items are dynamically generated based on the target object type.
 * - Supports both object-specific menus (for shapes/connectors) and canvas menus (for empty areas).
 * - Menu positioning automatically adjusts to prevent going off-screen.
 * - Menu items can be disabled based on context (e.g., paste disabled when clipboard is empty).
 *
 * @example
 * const contextMenu = new ContextMenu(canvas);
 * contextMenu.show(event.clientX, event.clientY, clickedObject, {
 *   onCopy: () => app.copy(),
 *   onDelete: () => app.deleteSelected()
 * });
 *
 * @see module:main
 */

/**
 * Context menu handler for canvas interactions.
 *
 * @class
 */
export class ContextMenu {
    /**
     * Creates a new ContextMenu instance.
     *
     * @param {HTMLCanvasElement} canvas Canvas element to attach the context menu to.
     *
     * @example
     * const contextMenu = new ContextMenu(document.getElementById('canvas'));
     */
    constructor(canvas) {
        /** @type {HTMLCanvasElement} Canvas element. */
        this.canvas = canvas;
        /** @type {HTMLElement|null} Menu DOM element. */
        this.menu = null;
        /** @type {boolean} Whether the menu is currently visible. */
        this.visible = false;
        /** @type {Object|null} Currently targeted object (if any). */
        this.targetObject = null;

        this.createMenu();
        this.setupEventListeners();
    }

    /**
     * Creates the menu DOM element and appends it to the document body.
     *
     * @private
     */
    createMenu() {
        this.menu = document.createElement('div');
        this.menu.className = 'context-menu';
        this.menu.style.display = 'none';
        document.body.appendChild(this.menu);
    }

    /**
     * Sets up event listeners for hiding the menu on outside clicks or canvas right-clicks.
     *
     * @private
     */
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target)) {
                this.hide();
            }
        });

        document.addEventListener('contextmenu', (e) => {
            if (e.target !== this.canvas) {
                this.hide();
            }
        });
    }

    /**
     * Shows the context menu at the specified screen coordinates.
     *
     * Menu items are dynamically generated based on the object type. Menu position
     * is automatically adjusted to prevent going off-screen.
     *
     * @param {number} x Screen X-coordinate for menu position.
     * @param {number} y Screen Y-coordinate for menu position.
     * @param {Object|null} object Target object (shape or connector) or null for canvas menu.
     * @param {Object} [options={}] Menu action callbacks.
     * @param {Function} [options.onCopy] Copy action callback.
     * @param {Function} [options.onCut] Cut action callback.
     * @param {Function} [options.onPaste] Paste action callback.
     * @param {Function} [options.onDuplicate] Duplicate action callback.
     * @param {Function} [options.onDelete] Delete action callback.
     * @param {Function} [options.onBringToFront] Bring to front action callback.
     * @param {Function} [options.onBringForward] Bring forward action callback.
     * @param {Function} [options.onSendBackward] Send backward action callback.
     * @param {Function} [options.onSendToBack] Send to back action callback.
     * @param {Function} [options.onToggleLock] Toggle lock action callback.
     * @param {Function} [options.onSelectAll] Select all action callback.
     * @param {Function} [options.onAddImage] Add image action callback.
     * @param {Function} [options.onInsertIcon] Insert icon action callback.
     * @param {Function} [options.onInsertTemplate] Insert template action callback.
     * @param {Function} [options.onChangeConnectorStyle] Change connector style action callback.
     * @param {Function} [options.onToggleArrows] Toggle arrows action callback.
     * @param {boolean} [options.hasClipboard=false] Whether clipboard has content (for enabling paste).
     *
     * @example
     * contextMenu.show(100, 200, selectedObject, {
     *   onCopy: () => app.copy(),
     *   onDelete: () => app.deleteSelected(),
     *   hasClipboard: app.clipboard.length > 0
     * });
     */
    show(x, y, object, options = {}) {
        this.targetObject = object;
        this.menu.innerHTML = '';

        const menuItems = this.getMenuItems(object, options);

        menuItems.forEach(item => {
            if (item.separator) {
                const sep = document.createElement('div');
                sep.className = 'context-menu-separator';
                this.menu.appendChild(sep);
            } else {
                const menuItem = document.createElement('div');
                menuItem.className = 'context-menu-item';
                if (item.disabled) {
                    menuItem.classList.add('disabled');
                }

                menuItem.innerHTML = `
                    ${item.icon || ''}
                    <span>${item.label}</span>
                    ${item.shortcut ? `<span class="shortcut">${item.shortcut}</span>` : ''}
                `;

                if (!item.disabled && item.action) {
                    menuItem.addEventListener('click', () => {
                        item.action(this.targetObject);
                        this.hide();
                    });
                }

                this.menu.appendChild(menuItem);
            }
        });

        // Position menu
        this.menu.style.left = x + 'px';
        this.menu.style.top = y + 'px';
        this.menu.style.display = 'block';

        // Adjust if menu goes off screen
        const rect = this.menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            this.menu.style.left = (x - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            this.menu.style.top = (y - rect.height) + 'px';
        }

        this.visible = true;
    }

    /**
     * Generates menu items based on the target object type and available options.
     *
     * Returns different menu items for object-specific menus vs canvas menus.
     *
     * @param {Object|null} object Target object or null for canvas menu.
     * @param {Object} options Menu action callbacks and configuration.
     * @returns {Array<Object>} Array of menu item objects with label, shortcut, action, disabled, separator properties.
     * @private
     */
    getMenuItems(object, options) {
        const items = [];

        if (object) {
            // Object-specific menu
            items.push({
                label: 'Copy',
                shortcut: 'Ctrl+C',
                action: options.onCopy
            });

            items.push({
                label: 'Cut',
                shortcut: 'Ctrl+X',
                action: options.onCut
            });

            items.push({
                label: 'Duplicate',
                shortcut: 'Ctrl+D',
                action: options.onDuplicate
            });

            items.push({ separator: true });

            if (object.type !== 'connector') {
                items.push({
                    label: 'Bring to Front',
                    shortcut: 'Shift+]',
                    action: options.onBringToFront
                });

                items.push({
                    label: 'Bring Forward',
                    shortcut: ']',
                    action: options.onBringForward
                });

                items.push({
                    label: 'Send Backward',
                    shortcut: '[',
                    action: options.onSendBackward
                });

                items.push({
                    label: 'Send to Back',
                    shortcut: 'Shift+[',
                    action: options.onSendToBack
                });

                items.push({ separator: true });

                items.push({
                    label: object.locked ? 'Unlock' : 'Lock',
                    action: options.onToggleLock
                });
            }

            if (object.type === 'connector') {
                items.push({
                    label: 'Change Style',
                    action: options.onChangeConnectorStyle
                });

                items.push({
                    label: 'Toggle Arrows',
                    action: options.onToggleArrows
                });

                items.push({ separator: true });
            }

            items.push({
                label: 'Delete',
                shortcut: 'Del',
                action: options.onDelete
            });

        } else {
            // Canvas menu
            items.push({
                label: 'Paste',
                shortcut: 'Ctrl+V',
                disabled: !options.hasClipboard,
                action: options.onPaste
            });

            items.push({ separator: true });

            items.push({
                label: 'Select All',
                shortcut: 'Ctrl+A',
                action: options.onSelectAll
            });

            items.push({ separator: true });

            items.push({
                label: 'Add Image',
                action: options.onAddImage
            });

            items.push({
                label: 'Insert Icon',
                action: options.onInsertIcon
            });

            items.push({
                label: 'Insert Template',
                action: options.onInsertTemplate
            });
        }

        return items;
    }

    /**
     * Hides the context menu and clears the target object.
     *
     * @example
     * contextMenu.hide();
     */
    hide() {
        if (this.visible) {
            this.menu.style.display = 'none';
            this.visible = false;
            this.targetObject = null;
        }
    }

    /**
     * Destroys the context menu by removing it from the DOM.
     *
     * Should be called when the context menu is no longer needed.
     *
     * @example
     * contextMenu.destroy();
     */
    destroy() {
        if (this.menu && this.menu.parentNode) {
            this.menu.parentNode.removeChild(this.menu);
        }
    }
}
