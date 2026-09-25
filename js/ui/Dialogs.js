/**
 * @module ui/Dialogs
 * @description Small UI helpers: toast notifications (optionally with an action button) and a
 * promise-based confirm dialog that replaces `window.confirm`.
 */

let toastContainer = null;

function container() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

/**
 * Shows a transient toast.
 * @param {string} text
 * @param {Object} [options]
 * @param {("info"|"success"|"error")} [options.type='info']
 * @param {number} [options.timeout=4000] Milliseconds before auto-dismiss (0 = sticky).
 * @param {{label:string, onClick:function(): void}} [options.action] Optional action button.
 * @returns {function(): void} Dismiss function.
 */
export function showToast(text, options = {}) {
    const { type = 'info', timeout = 4000, action } = options;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const span = document.createElement('span');
    span.textContent = text;
    el.appendChild(span);
    let timer = null;
    const dismiss = () => {
        clearTimeout(timer);
        el.classList.add('hide');
        setTimeout(() => el.remove(), 200);
    };
    if (action) {
        const btn = document.createElement('button');
        btn.className = 'toast-action';
        btn.textContent = action.label;
        btn.addEventListener('click', () => { action.onClick(); dismiss(); });
        el.appendChild(btn);
    }
    const close = document.createElement('button');
    close.className = 'toast-close';
    close.setAttribute('aria-label', 'Dismiss');
    close.textContent = '×';
    close.addEventListener('click', dismiss);
    el.appendChild(close);
    container().appendChild(el);
    if (timeout > 0) timer = setTimeout(dismiss, timeout);
    return dismiss;
}

/**
 * Promise-based confirm dialog using the app's modal styling.
 * @param {string} message
 * @param {Object} [options]
 * @param {string} [options.title='Confirm']
 * @param {string} [options.okLabel='OK']
 * @param {string} [options.cancelLabel='Cancel']
 * @param {boolean} [options.danger=false] Style the OK button as destructive.
 * @returns {Promise<boolean>}
 */
export function confirmDialog(message, options = {}) {
    const { title = 'Confirm', okLabel = 'OK', cancelLabel = 'Cancel', danger = false } = options;
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'modal dialog';
        overlay.style.display = 'block';
        overlay.innerHTML = `
            <div class="modal-content small" role="dialog" aria-modal="true">
                <h2></h2>
                <p class="dialog-message"></p>
                <div class="dialog-actions">
                    <button class="action-btn ghost" data-act="cancel"></button>
                    <button class="action-btn ${danger ? 'danger' : 'primary'}" data-act="ok"></button>
                </div>
            </div>`;
        overlay.querySelector('h2').textContent = title;
        overlay.querySelector('.dialog-message').textContent = message;
        const okBtn = overlay.querySelector('[data-act="ok"]');
        const cancelBtn = overlay.querySelector('[data-act="cancel"]');
        okBtn.textContent = okLabel;
        cancelBtn.textContent = cancelLabel;
        const finish = (value) => {
            document.removeEventListener('keydown', onKey, true);
            overlay.remove();
            resolve(value);
        };
        const onKey = (e) => {
            if (e.key === 'Escape') { e.stopPropagation(); finish(false); }
            if (e.key === 'Enter') { e.stopPropagation(); finish(true); }
        };
        okBtn.addEventListener('click', () => finish(true));
        cancelBtn.addEventListener('click', () => finish(false));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) finish(false); });
        document.addEventListener('keydown', onKey, true);
        document.body.appendChild(overlay);
        okBtn.focus();
    });
}
