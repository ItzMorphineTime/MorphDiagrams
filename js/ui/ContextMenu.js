export class ContextMenu {
    constructor(canvas) {
        this.canvas = canvas;
        this.menu = null;
        this.visible = false;
        this.targetObject = null;

        this.createMenu();
        this.setupEventListeners();
    }

    createMenu() {
        this.menu = document.createElement('div');
        this.menu.className = 'context-menu';
        this.menu.style.display = 'none';
        document.body.appendChild(this.menu);
    }

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

    hide() {
        if (this.visible) {
            this.menu.style.display = 'none';
            this.visible = false;
            this.targetObject = null;
        }
    }

    destroy() {
        if (this.menu && this.menu.parentNode) {
            this.menu.parentNode.removeChild(this.menu);
        }
    }
}
