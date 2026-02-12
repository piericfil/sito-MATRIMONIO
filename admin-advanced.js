// ==========================================
// PROFESSIONAL ADMIN SYSTEM v2.0
// Production-ready admin system for wedding website
// Author: Professional Development Team
// ==========================================

// ===== DEBUG SYSTEM =====
class AdminDebug {
    static enabled = true;
    static colors = {
        admin: '#2E5C8A',
        menu: '#E86A3E',
        modal: '#FFB84D',
        save: '#4A7C59',
        load: '#7CB9E8',
        style: '#FF8C42',
        error: '#DC3545'
    };

    static log(category, message, data = null) {
        if (!this.enabled) return;
        const color = this.colors[category] || '#666';
        const icon = this.getIcon(category);

        console.log(
            `%c${icon} [${category.toUpperCase()}]%c ${message}`,
            `color: ${color}; font-weight: bold;`,
            'color: inherit;'
        );

        if (data) console.log(data);
    }

    static error(message, error = null) {
        console.error(`🚨 [ERROR] ${message}`);
        if (error) console.error(error);
    }

    static time(label) {
        if (!this.enabled) return;
        console.time(`⏱️ ${label}`);
    }

    static timeEnd(label) {
        if (!this.enabled) return;
        console.timeEnd(`⏱️ ${label}`);
    }

    static getIcon(category) {
        const icons = {
            admin: '🔧',
            menu: '📋',
            modal: '🪟',
            save: '💾',
            load: '📂',
            style: '🎨',
            error: '🚨'
        };
        return icons[category] || '📌';
    }

    static enable() {
        this.enabled = true;
        console.log('✅ Debug mode ENABLED');
    }

    static disable() {
        this.enabled = false;
        console.log('❌ Debug mode DISABLED');
    }
}

// ===== Z-INDEX MANAGER =====
const ZIndexManager = {
    current: 10000,

    get() {
        this.current += 10;
        AdminDebug.log('modal', `Z-index assigned: ${this.current}`);
        return this.current;
    },

    reset() {
        this.current = 10000;
        AdminDebug.log('modal', 'Z-index reset to 10000');
    },

    getCurrent() {
        return this.current;
    }
};

// ===== STORAGE MANAGER =====
const StorageManager = {
    prefix: 'wedding_',

    save(key, value) {
        try {
            const fullKey = this.prefix + key;
            localStorage.setItem(fullKey, JSON.stringify(value));
            AdminDebug.log('save', `Saved: ${key}`, value);
            return true;
        } catch (error) {
            AdminDebug.error(`Failed to save ${key}`, error);
            return false;
        }
    },

    load(key) {
        try {
            const fullKey = this.prefix + key;
            const value = localStorage.getItem(fullKey);
            if (value) {
                AdminDebug.log('load', `Loaded: ${key}`);
                return JSON.parse(value);
            }
            return null;
        } catch (error) {
            AdminDebug.error(`Failed to load ${key}`, error);
            return null;
        }
    },

    saveText(elementId, textIt, textPt) {
        return this.save(`text_${elementId}`, { it: textIt, pt: textPt });
    },

    loadText(elementId) {
        return this.load(`text_${elementId}`);
    },

    saveStyles(elementId, styles) {
        return this.save(`style_${elementId}`, styles);
    },

    loadStyles(elementId) {
        return this.load(`style_${elementId}`);
    },

    saveImage(imageId, url) {
        return this.save(`image_${imageId}`, url);
    },

    loadImage(imageId) {
        return this.load(`image_${imageId}`);
    },

    remove(key) {
        const fullKey = this.prefix + key;
        localStorage.removeItem(fullKey);
        AdminDebug.log('save', `Removed: ${key}`);
    },

    export() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix)) {
                data[key] = localStorage.getItem(key);
            }
        }
        AdminDebug.log('save', 'Exported all data', data);
        return data;
    },

    import(data) {
        try {
            for (const [key, value] of Object.entries(data)) {
                localStorage.setItem(key, value);
            }
            AdminDebug.log('load', 'Imported data successfully');
            return true;
        } catch (error) {
            AdminDebug.error('Import failed', error);
            return false;
        }
    },

    clear() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        AdminDebug.log('save', `Cleared ${keysToRemove.length} items`);
    }
};

// ===== MODAL MANAGER =====
class ModalManager {
    static openModals = new Map();
    static backdrop = null;

    static open(id, content, options = {}) {
        AdminDebug.log('modal', `Opening modal: ${id}`);

        // Close previous modal if single mode
        if (options.closePrevious !== false) {
            this.closeAll();
        }

        // Create backdrop if needed
        if (!this.backdrop && options.backdrop !== false) {
            this.createBackdrop();
        }

        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.id = `admin-modal-${id}`;
        modal.style.zIndex = ZIndexManager.get();
        modal.innerHTML = content;

        document.body.appendChild(modal);

        // Click outside to close (click on modal background, not content)
        modal.addEventListener('click', (e) => {
            // If clicked element is the modal itself (not a child of modal-content), close
            if (e.target === modal) {
                this.close(id);
                AdminDebug.log('modal', `Modal closed via click-outside: ${id}`);
            }
        });

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        // Track modal
        this.openModals.set(id, modal);

        AdminDebug.log('modal', `Modal opened: ${id} (z-index: ${modal.style.zIndex})`);

        return modal;
    }

    static close(id) {
        const modal = this.openModals.get(id);
        if (!modal) return;

        AdminDebug.log('modal', `Closing modal: ${id}`);

        modal.classList.remove('show');

        setTimeout(() => {
            modal.remove();
            this.openModals.delete(id);

            // Remove backdrop if no modals
            if (this.openModals.size === 0 && this.backdrop) {
                this.removeBackdrop();
            }
        }, 300);
    }

    static closeAll() {
        AdminDebug.log('modal', 'Closing all modals');

        this.openModals.forEach((modal, id) => {
            this.close(id);
        });
    }

    static createBackdrop() {
        if (this.backdrop) return;

        this.backdrop = document.createElement('div');
        this.backdrop.className = 'admin-modal-backdrop';
        this.backdrop.style.zIndex = ZIndexManager.get() - 5;

        document.body.appendChild(this.backdrop);

        requestAnimationFrame(() => {
            this.backdrop.classList.add('show');
        });

        AdminDebug.log('modal', 'Backdrop created');
    }

    static removeBackdrop() {
        if (!this.backdrop) return;

        this.backdrop.classList.remove('show');

        setTimeout(() => {
            if (this.backdrop) {
                this.backdrop.remove();
                this.backdrop = null;
            }
        }, 300);

        AdminDebug.log('modal', 'Backdrop removed');
    }
}

// ===== GLOBAL STATE =====
let isAdminMode = false;
let selectedElement = null;
let menuJustOpened = false;
let stylePanel = null;

// ===== ADMIN MODE TOGGLE =====
function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    document.body.classList.toggle('admin-mode', isAdminMode);

    // Update admin mode button state
    const adminBtn = document.getElementById('admin-mode-btn');
    if (adminBtn) {
        adminBtn.classList.toggle('active', isAdminMode);
    }

    AdminDebug.log('admin', `Admin mode: ${isAdminMode ? 'ACTIVE' : 'INACTIVE'}`);

    if (isAdminMode) {
        showAdminNotification('✏️ Admin Mode ATTIVO - Click destro su elementi per editarli');
    } else {
        showAdminNotification('💾 Admin Mode DISATTIVATO - Modifiche salvate!');
        if (stylePanel) {
            stylePanel.remove();
            stylePanel = null;
        }
        ModalManager.closeAll();
    }
}

// Keyboard shortcut: Ctrl+Alt+A
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        toggleAdminMode();
    }
});

// Admin Mode Button click handler
document.addEventListener('DOMContentLoaded', () => {
    const adminModeBtn = document.getElementById('admin-mode-btn');
    const adminHelpBtn = document.getElementById('admin-help-btn');
    const adminHelpPopup = document.getElementById('admin-help-popup');
    const adminHelpClose = document.querySelector('.admin-help-close');

    // Admin mode button click
    if (adminModeBtn) {
        adminModeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAdminMode();
        });
    }

    // Help button click - show popup
    if (adminHelpBtn && adminHelpPopup) {
        adminHelpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            adminHelpPopup.classList.remove('hidden');
        });
    }

    // Close popup button
    if (adminHelpClose && adminHelpPopup) {
        adminHelpClose.addEventListener('click', () => {
            adminHelpPopup.classList.add('hidden');
        });
    }

    // Close popup on background click
    if (adminHelpPopup) {
        adminHelpPopup.addEventListener('click', (e) => {
            if (e.target === adminHelpPopup) {
                adminHelpPopup.classList.add('hidden');
            }
        });
    }

    // Close popup on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && adminHelpPopup && !adminHelpPopup.classList.contains('hidden')) {
            adminHelpPopup.classList.add('hidden');
        }
    });
});

// ===== NOTIFICATIONS =====
function showAdminNotification(message, duration = 4000) {
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    notification.style.zIndex = ZIndexManager.get();

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);

    AdminDebug.log('admin', `Notification: ${message}`);
}

// ===== CONTEXT MENU (RIGHT CLICK) =====
document.addEventListener('contextmenu', (e) => {
    if (!isAdminMode) return;

    const target = e.target;
    const editableText = target.closest('.editable-text, .editable-paragraph');
    const editableImage = target.closest('.editable-image');
    const styleEditable = target.closest('[data-style-editable]');
    const editableCarousel = target.closest('[data-carousel-editable]');
    const editableTimeline = target.closest('[data-timeline-editable]');

    AdminDebug.log('menu', 'Right click detected', {
        editableText: !!editableText,
        editableImage: !!editableImage,
        styleEditable: !!styleEditable,
        editableCarousel: !!editableCarousel,
        editableTimeline: !!editableTimeline
    });

    if (editableText || editableImage || styleEditable || editableCarousel || editableTimeline) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // EXTRA: Stop all other listeners

        selectedElement = editableText || editableImage || styleEditable || editableCarousel || editableTimeline;

        // CRITICAL: Prevent any click events in the next 150ms
        // This stops the right-click from generating a click that would close the menu
        const preventClick = (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            AdminDebug.log('menu', 'Click event prevented during menu creation');
        };

        document.addEventListener('click', preventClick, true);
        document.addEventListener('mouseup', preventClick, true);

        setTimeout(() => {
            document.removeEventListener('click', preventClick, true);
            document.removeEventListener('mouseup', preventClick, true);
            AdminDebug.log('menu', 'Click prevention removed - menu creation complete');
        }, 150);

        showContextMenu(e.clientX, e.clientY, {
            hasText: !!editableText,
            hasImage: !!editableImage,
            hasStyle: !!styleEditable,
            hasCarousel: !!editableCarousel,
            hasTimeline: !!editableTimeline
        });
    }
});

function showContextMenu(x, y, options) {
    AdminDebug.log('menu', 'Creating context menu', options);

    // Remove existing menu and backdrop
    const existingMenu = document.querySelector('.admin-context-menu');
    const existingBackdrop = document.querySelector('.context-menu-backdrop');
    if (existingMenu) existingMenu.remove();
    if (existingBackdrop) existingBackdrop.remove();

    // Create transparent backdrop to capture clicks
    const backdrop = document.createElement('div');
    backdrop.className = 'context-menu-backdrop';
    backdrop.style.zIndex = ZIndexManager.get();

    // Create menu
    const menu = document.createElement('div');
    menu.className = 'admin-context-menu';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.zIndex = ZIndexManager.get();

    let menuItems = '';

    if (options.hasCarousel) {
        menuItems += `<div class="context-menu-item" data-action="manage-carousel">🎠 Gestisci Carousel</div>`;
    }

    if (options.hasTimeline) {
        menuItems += `<div class="context-menu-item" data-action="manage-timeline">📅 Gestisci Timeline</div>`;
    }

    if (options.hasText) {
        menuItems += `<div class="context-menu-item" data-action="edit-text">✏️ Modifica Testo</div>`;
    }

    if (options.hasImage) {
        menuItems += `<div class="context-menu-item" data-action="edit-image">🖼️ Cambia Immagine</div>`;
    }

    if (options.hasStyle || options.hasText) {
        menuItems += `<div class="context-menu-item" data-action="edit-styles">🎨 Modifica Stili</div>`;
    }

    if (!menuItems) {
        AdminDebug.log('menu', 'No menu items to show');
        return;
    }

    menu.innerHTML = menuItems;

    // Add backdrop first
    document.body.appendChild(backdrop);
    // Then add menu on top
    document.body.appendChild(menu);

    // Animate in
    requestAnimationFrame(() => {
        menu.classList.add('show');
    });

    AdminDebug.log('menu', 'Context menu shown with backdrop');

    // Click handler for menu items
    menu.addEventListener('click', (e) => {
        e.stopPropagation();
        handleContextMenuClick(e);
    });

    // CRITICAL FIX: Delay backdrop click listeners to avoid immediate closure
    // The right-click event can generate a click event that would close the menu instantly
    let backdropReady = false;
    setTimeout(() => {
        backdropReady = true;
        AdminDebug.log('menu', 'Backdrop click listeners now active');
    }, 100);

    // Close menu when clicking on backdrop (not menu)
    backdrop.addEventListener('click', (e) => {
        if (!backdropReady) {
            AdminDebug.log('menu', 'Backdrop click ignored - not ready yet');
            return;
        }
        AdminDebug.log('menu', 'Backdrop clicked - closing menu');
        menu.remove();
        backdrop.remove();
    });

    // Also close on right-click anywhere
    backdrop.addEventListener('contextmenu', (e) => {
        if (!backdropReady) {
            AdminDebug.log('menu', 'Backdrop right-click ignored - not ready yet');
            e.preventDefault();
            return;
        }
        e.preventDefault();
        AdminDebug.log('menu', 'Right-click on backdrop - closing menu');
        menu.remove();
        backdrop.remove();
    });
}

function handleContextMenuClick(e) {
    const item = e.target.closest('[data-action]');
    if (!item) return;

    const action = item.getAttribute('data-action');
    AdminDebug.log('menu', `Menu action: ${action}`);

    // Close menu and backdrop
    const menu = document.querySelector('.admin-context-menu');
    const backdrop = document.querySelector('.context-menu-backdrop');
    if (menu) menu.remove();
    if (backdrop) backdrop.remove();

    // Execute action
    switch(action) {
        case 'manage-carousel':
            manageCarousel(selectedElement);
            break;
        case 'manage-timeline':
            manageTimeline(selectedElement);
            break;
        case 'edit-text':
            editText(selectedElement);
            break;
        case 'edit-image':
            editImage(selectedElement);
            break;
        case 'edit-styles':
            editStyles(selectedElement);
            break;
    }
}

// ===== TEXT EDITOR =====
function editText(element) {
    if (!element) return;

    AdminDebug.log('modal', 'Opening text editor');

    const textId = element.getAttribute('data-text-id') || `text_${Date.now()}`;
    if (!element.getAttribute('data-text-id')) {
        element.setAttribute('data-text-id', textId);
    }

    const currentIT = element.getAttribute('data-it') || element.textContent;
    const currentPT = element.getAttribute('data-pt') || element.textContent;
    const isBilingual = element.hasAttribute('data-it') && element.hasAttribute('data-pt');

    const modalContent = `
        <div class="admin-modal-content admin-text-editor-modal">
            <div class="modal-header">
                <h3>✏️ Modifica Testo</h3>
                <button class="btn-close-modal" data-action="close-text-modal">×</button>
            </div>
            <div class="modal-body">
                ${isBilingual ? `
                    <div class="editor-bilingual">
                        <div class="form-group">
                            <label>🇮🇹 Italiano:</label>
                            <textarea id="text-it" rows="4" class="text-editor-input">${currentIT}</textarea>
                        </div>
                        <div class="form-group">
                            <label>🇵🇹 Português:</label>
                            <textarea id="text-pt" rows="4" class="text-editor-input">${currentPT}</textarea>
                        </div>
                    </div>
                ` : `
                    <div class="editor-preview">
                        <label>Testo:</label>
                        <textarea id="text-content" rows="5" class="text-editor-input">${currentIT}</textarea>
                    </div>
                `}
                <div class="editor-preview-live">
                    <label>📋 Anteprima:</label>
                    <div class="preview-box" id="text-preview">${currentIT}</div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary-action" data-action="save-text" data-text-id="${textId}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M13 1H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM8 13L3 8l1.41-1.41L8 10.17l6.59-6.59L16 5l-8 8z"/>
                    </svg>
                    Salva Modifiche
                </button>
                <button class="btn-secondary-action" data-action="reset-text-element" data-text-id="${textId}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M8 3V1L5 4l3 3V5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5H1c0 3.9 3.1 7 7 7s7-3.1 7-7-3.1-7-7-7z"/>
                    </svg>
                    Reset Elemento
                </button>
                <button class="btn-danger-action" data-action="reset-page-text">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M14 3h-1V1H3v2H2C.9 3 0 3.9 0 5v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 1h6v2H5V1zM2 13V5h12v8H2z"/>
                        <path d="M6 7h4v4H6z" fill="currentColor"/>
                    </svg>
                    Reset Pagina
                </button>
                <button class="btn-cancel-action" data-action="close-text-modal">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Annulla
                </button>
            </div>
        </div>
    `;

    const modal = ModalManager.open('text-editor', modalContent);

    // Live preview
    const updatePreview = () => {
        const preview = document.getElementById('text-preview');
        if (isBilingual) {
            const textIt = document.getElementById('text-it').value;
            preview.textContent = textIt;
        } else {
            const textContent = document.getElementById('text-content').value;
            preview.textContent = textContent;
        }
    };

    if (isBilingual) {
        document.getElementById('text-it').addEventListener('input', updatePreview);
        document.getElementById('text-pt').addEventListener('input', updatePreview);
    } else {
        document.getElementById('text-content').addEventListener('input', updatePreview);
    }

    // Event handlers
    modal.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');

        if (action === 'save-text') {
            const textId = button.getAttribute('data-text-id');

            if (isBilingual) {
                const newIT = document.getElementById('text-it').value;
                const newPT = document.getElementById('text-pt').value;

                element.setAttribute('data-it', newIT);
                element.setAttribute('data-pt', newPT);

                const currentLang = document.documentElement.lang || 'it';
                element.textContent = currentLang === 'it' ? newIT : newPT;

                StorageManager.saveText(textId, newIT, newPT);
            } else {
                const newText = document.getElementById('text-content').value;
                element.textContent = newText;
                StorageManager.save(`text_${textId}`, newText);
            }

            showAdminNotification('💾 Testo salvato con successo!');
            ModalManager.close('text-editor');

            AdminDebug.log('save', `Text saved: ${textId}`);
        } else if (action === 'save-checkpoint-text') {
            const textId = button.getAttribute('data-text-id');

            if (isBilingual) {
                const newIT = document.getElementById('text-it').value;
                const newPT = document.getElementById('text-pt').value;

                element.setAttribute('data-it', newIT);
                element.setAttribute('data-pt', newPT);

                const currentLang = document.documentElement.lang || 'it';
                element.textContent = currentLang === 'it' ? newIT : newPT;

                // Save as checkpoint (default state for reset)
                StorageManager.saveText(textId, newIT, newPT);
                StorageManager.save(`checkpoint_text_${textId}`, JSON.stringify({ textIT: newIT, textPT: newPT }));
            } else {
                const newText = document.getElementById('text-content').value;
                element.textContent = newText;
                StorageManager.save(`text_${textId}`, newText);
                StorageManager.save(`checkpoint_text_${textId}`, newText);
            }

            showAdminNotification('⭐ Checkpoint salvato! Questo è ora il nuovo stato default.');
            ModalManager.close('text-editor');

            AdminDebug.log('save', `Checkpoint saved: ${textId}`);
        } else if (action === 'reset-text-element') {
            const textId = button.getAttribute('data-text-id');

            if (confirm('Reset questo testo allo stato del checkpoint?')) {
                // Try to load checkpoint, otherwise use original HTML
                const checkpoint = StorageManager.load(`checkpoint_text_${textId}`);

                if (checkpoint) {
                    if (isBilingual) {
                        const checkpointData = JSON.parse(checkpoint);
                        element.setAttribute('data-it', checkpointData.textIT);
                        element.setAttribute('data-pt', checkpointData.textPT);

                        const currentLang = document.documentElement.lang || 'it';
                        element.textContent = currentLang === 'it' ? checkpointData.textIT : checkpointData.textPT;

                        // Update modal inputs
                        document.getElementById('text-it').value = checkpointData.textIT;
                        document.getElementById('text-pt').value = checkpointData.textPT;
                    } else {
                        element.textContent = checkpoint;
                        document.getElementById('text-content').value = checkpoint;
                    }
                    showAdminNotification('🔄 Testo resettato al checkpoint!');
                } else {
                    // No checkpoint, remove custom text
                    StorageManager.remove(`text_${textId}`);
                    showAdminNotification('🔄 Testo resettato (nessun checkpoint salvato)!');
                    location.reload();
                }

                AdminDebug.log('admin', `Text element reset: ${textId}`);
            }
        } else if (action === 'reset-page-text') {
            ModalManager.close('text-editor');
            resetEntirePage();
        } else if (action === 'close-text-modal') {
            ModalManager.close('text-editor');
        }
    });
}

// ===== STYLE EDITOR =====
function editStyles(element) {
    if (!element) return;

    AdminDebug.log('style', 'Opening style editor');

    // Close existing panel
    if (stylePanel) stylePanel.remove();

    // Check if this is a countdown-number - if so, select ALL countdown numbers
    let targetElements = [element];
    let isCountdownNumber = false;

    if (element.classList.contains('countdown-number')) {
        isCountdownNumber = true;
        // Find the countdown container
        const countdown = element.closest('.countdown');
        if (countdown) {
            // Select ALL countdown-number elements in this countdown
            targetElements = Array.from(countdown.querySelectorAll('.countdown-number'));
            AdminDebug.log('style', `Countdown number detected - applying to ${targetElements.length} numbers`);
        }
    }

    const computedStyle = getComputedStyle(element);

    stylePanel = document.createElement('div');
    stylePanel.className = 'admin-style-panel';
    stylePanel.style.zIndex = ZIndexManager.get();
    stylePanel.innerHTML = `
        <div class="style-panel-header draggable-header">
            <span class="panel-title">🎨 Editor Stili${isCountdownNumber ? ' (Tutti i Numeri)' : ''}</span>
            <button class="btn-close-panel" data-action="close-style-panel" title="Chiudi">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
        <div class="style-panel-body">
            ${isCountdownNumber ? '<p style="background: var(--cream); padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 0.9rem; color: var(--azul-navy);">📊 Stai modificando <strong>tutti i numeri</strong> del countdown</p>' : ''}
            <!-- Font Size -->
            <div class="style-control">
                <label>📏 Dimensione Testo:</label>
                <input type="range" id="fontSize" min="8" max="80" value="${parseInt(computedStyle.fontSize) || 16}" step="1">
                <span id="fontSizeValue">${parseInt(computedStyle.fontSize) || 16}px</span>
            </div>

            <!-- Font Family -->
            <div class="style-control">
                <label>🔤 Font:</label>
                <select id="fontFamily" class="font-preview-select">
                    <option value="inherit">Default (Eredita dal genitore)</option>

                    <optgroup label="🎭 Font Eleganti Serif">
                        <option value="'Cormorant Garamond', serif" style="font-family: 'Cormorant Garamond', serif;">Cormorant Garamond - Elegante classico</option>
                        <option value="'Playfair Display', serif" style="font-family: 'Playfair Display', serif;">Playfair Display - Lusso moderno</option>
                        <option value="'Cinzel', serif" style="font-family: 'Cinzel', serif;">Cinzel - Formale romano</option>
                        <option value="'Libre Baskerville', serif" style="font-family: 'Libre Baskerville', serif;">Libre Baskerville - Raffinato</option>
                        <option value="'Lora', serif" style="font-family: 'Lora', serif;">Lora - Calligrafico leggibile</option>
                        <option value="'Crimson Text', serif" style="font-family: 'Crimson Text', serif;">Crimson Text - Letterario elegante</option>
                        <option value="Georgia, serif" style="font-family: Georgia, serif;">Georgia - Classico web-safe</option>
                        <option value="'Times New Roman', serif" style="font-family: 'Times New Roman', serif;">Times New Roman - Tradizionale</option>
                    </optgroup>

                    <optgroup label="✨ Font Sans-Serif Moderni">
                        <option value="'Montserrat', sans-serif" style="font-family: 'Montserrat', sans-serif;">Montserrat - Geometrico pulito</option>
                        <option value="'Raleway', sans-serif" style="font-family: 'Raleway', sans-serif;">Raleway - Leggero elegante</option>
                        <option value="'Poppins', sans-serif" style="font-family: 'Poppins', sans-serif;">Poppins - Amichevole moderno</option>
                        <option value="'Josefin Sans', sans-serif" style="font-family: 'Josefin Sans', sans-serif;">Josefin Sans - Vintage geometrico</option>
                        <option value="'Quicksand', sans-serif" style="font-family: 'Quicksand', sans-serif;">Quicksand - Rotondo morbido</option>
                        <option value="Arial, sans-serif" style="font-family: Arial, sans-serif;">Arial - Universale</option>
                    </optgroup>

                    <optgroup label="💌 Font Calligrafici">
                        <option value="'Great Vibes', cursive" style="font-family: 'Great Vibes', cursive;">Great Vibes - Script elegante</option>
                        <option value="'Dancing Script', cursive" style="font-family: 'Dancing Script', cursive;">Dancing Script - Scrittura fluida</option>
                        <option value="'Parisienne', cursive" style="font-family: 'Parisienne', cursive;">Parisienne - Romantico parigino</option>
                        <option value="'Allura', cursive" style="font-family: 'Allura', cursive;">Allura - Calligrafia formale</option>
                    </optgroup>

                    <optgroup label="🌿 Font Decorativi">
                        <option value="'Italiana', serif" style="font-family: 'Italiana', serif;">Italiana - Alto contrasto</option>
                        <option value="'Poiret One', cursive" style="font-family: 'Poiret One', cursive;">Poiret One - Art Deco</option>
                        <option value="'Julius Sans One', sans-serif" style="font-family: 'Julius Sans One', sans-serif;">Julius Sans One - Maiuscolo elegante</option>
                    </optgroup>
                </select>
                <small style="color: #666; display: block; margin-top: 6px;">👁️ Ogni font mostra la propria anteprima</small>
            </div>

            <!-- Font Weight -->
            <div class="style-control">
                <label>💪 Peso Font:</label>
                <select id="fontWeight">
                    <option value="300">Leggero (300)</option>
                    <option value="400">Normale (400)</option>
                    <option value="500">Medio (500)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="700">Bold (700)</option>
                </select>
            </div>

            <!-- Color -->
            <div class="style-control">
                <label>🎨 Colore Testo:</label>
                <input type="color" id="textColor" value="${rgbToHex(computedStyle.color)}">
                <span id="colorValue">${rgbToHex(computedStyle.color)}</span>
            </div>

            <!-- Text Align -->
            <div class="style-control">
                <label>📍 Allineamento:</label>
                <div class="btn-group">
                    <button class="btn-style" data-style-action="align-left">⬅️</button>
                    <button class="btn-style" data-style-action="align-center">⬛</button>
                    <button class="btn-style" data-style-action="align-right">➡️</button>
                </div>
            </div>

            <!-- Margins -->
            <div class="style-control">
                <label>⬆️ Margine Sopra:</label>
                <input type="range" id="marginTop" min="-50" max="200" value="${parseInt(computedStyle.marginTop) || 0}" step="5">
                <span id="marginTopValue">${parseInt(computedStyle.marginTop) || 0}px</span>
            </div>

            <div class="style-control">
                <label>⬇️ Margine Sotto:</label>
                <input type="range" id="marginBottom" min="-50" max="200" value="${parseInt(computedStyle.marginBottom) || 0}" step="5">
                <span id="marginBottomValue">${parseInt(computedStyle.marginBottom) || 0}px</span>
            </div>

            <!-- Padding -->
            <div class="style-control">
                <label>📦 Padding:</label>
                <input type="range" id="padding" min="0" max="100" value="${parseInt(computedStyle.padding) || 0}" step="5">
                <span id="paddingValue">${parseInt(computedStyle.padding) || 0}px</span>
            </div>

            <!-- Line Height -->
            <div class="style-control">
                <label>📏 Altezza Riga:</label>
                <input type="range" id="lineHeight" min="1" max="3" value="${parseFloat(computedStyle.lineHeight) / parseFloat(computedStyle.fontSize) || 1.5}" step="0.1">
                <span id="lineHeightValue">${(parseFloat(computedStyle.lineHeight) / parseFloat(computedStyle.fontSize) || 1.5).toFixed(1)}</span>
            </div>

            <div class="style-actions">
                <button class="btn-primary-action" data-action="save-styles">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M13 1H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM8 13L3 8l1.41-1.41L8 10.17l6.59-6.59L16 5l-8 8z"/>
                    </svg>
                    Salva Stili
                </button>
                <button class="btn-secondary-action" data-action="reset-styles">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M8 3V1L5 4l3 3V5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5H1c0 3.9 3.1 7 7 7s7-3.1 7-7-3.1-7-7-7z"/>
                    </svg>
                    Reset Elemento
                </button>
                <button class="btn-danger-action" data-action="reset-page">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M14 3h-1V1H3v2H2C.9 3 0 3.9 0 5v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 1h6v2H5V1zM2 13V5h12v8H2z"/>
                        <path d="M6 7h4v4H6z" fill="currentColor"/>
                    </svg>
                    Reset Pagina Intera
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(stylePanel);

    requestAnimationFrame(() => {
        stylePanel.classList.add('show');
    });

    // Click outside to close - setTimeout to avoid immediate closure from the right-click that opened it
    setTimeout(() => {
        const closeOnOutsideClick = (e) => {
            // If clicked outside the style panel, close it
            if (stylePanel && !stylePanel.contains(e.target)) {
                stylePanel.remove();
                stylePanel = null;
                document.removeEventListener('click', closeOnOutsideClick);
                AdminDebug.log('style', 'Style panel closed via click-outside');
            }
        };

        document.addEventListener('click', closeOnOutsideClick);

        // Store the listener so we can remove it when panel is closed via button
        stylePanel.clickOutsideListener = closeOnOutsideClick;
    }, 100);

    // Make panel draggable
    makePanelDraggable(stylePanel);

    setupStyleListeners(targetElements);
}

// ===== MAKE PANEL DRAGGABLE =====
function makePanelDraggable(panel) {
    const header = panel.querySelector('.draggable-header');
    if (!header) return;

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Add drag handle indicator
    header.style.cursor = 'move';
    header.setAttribute('title', 'Trascina per spostare');

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        // Don't drag if clicking on close button or input elements
        if (e.target.closest('.btn-close-panel') ||
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'SELECT' ||
            e.target.tagName === 'BUTTON') return;

        // Get current position
        const rect = panel.getBoundingClientRect();

        // If panel is still centered (first drag), position it properly
        if (panel.style.left === '') {
            panel.style.left = rect.left + 'px';
            panel.style.top = rect.top + 'px';
            panel.style.transform = 'none';
        }

        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;
        isDragging = true;

        panel.style.transition = 'none';
        panel.style.cursor = 'grabbing';
        header.style.cursor = 'grabbing';

        AdminDebug.log('style', 'Panel drag started', { initialX, initialY });
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();

        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        // Get panel dimensions
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Keep panel within viewport with padding
        const padding = 20;
        const minX = padding;
        const minY = padding;
        const maxX = viewportWidth - panelWidth - padding;
        const maxY = viewportHeight - panelHeight - padding;

        currentX = Math.max(minX, Math.min(currentX, maxX));
        currentY = Math.max(minY, Math.min(currentY, maxY));

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, panel);

        AdminDebug.log('style', 'Dragging panel', { x: currentX, y: currentY });
    }

    function dragEnd() {
        if (isDragging) {
            isDragging = false;
            panel.style.transition = '';
            panel.style.cursor = '';
            header.style.cursor = 'move';
            AdminDebug.log('style', 'Panel drag ended', { finalX: xOffset, finalY: yOffset });
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.left = xPos + 'px';
        el.style.top = yPos + 'px';
        el.style.transform = 'none';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
    }
}

function setupStyleListeners(targetElements) {
    // Ensure targetElements is always an array
    if (!Array.isArray(targetElements)) {
        targetElements = [targetElements];
    }

    // Font Size
    const fontSize = document.getElementById('fontSize');
    fontSize.addEventListener('input', (e) => {
        targetElements.forEach(element => {
            element.style.fontSize = e.target.value + 'px';
        });
        document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
    });

    // Font Family
    const fontFamily = document.getElementById('fontFamily');
    fontFamily.value = getComputedStyle(targetElements[0]).fontFamily;
    fontFamily.addEventListener('change', (e) => {
        targetElements.forEach(element => {
            element.style.fontFamily = e.target.value;
        });
    });

    // Font Weight
    const fontWeight = document.getElementById('fontWeight');
    fontWeight.value = getComputedStyle(targetElements[0]).fontWeight;
    fontWeight.addEventListener('change', (e) => {
        targetElements.forEach(element => {
            element.style.fontWeight = e.target.value;
        });
    });

    // Text Color
    const textColor = document.getElementById('textColor');
    textColor.addEventListener('input', (e) => {
        targetElements.forEach(element => {
            element.style.color = e.target.value;
        });
        document.getElementById('colorValue').textContent = e.target.value;
    });

    // Margins
    const marginTop = document.getElementById('marginTop');
    marginTop.addEventListener('input', (e) => {
        targetElements.forEach(element => {
            element.style.marginTop = e.target.value + 'px';
        });
        document.getElementById('marginTopValue').textContent = e.target.value + 'px';
    });

    const marginBottom = document.getElementById('marginBottom');
    marginBottom.addEventListener('input', (e) => {
        targetElements.forEach(element => {
            element.style.marginBottom = e.target.value + 'px';
        });
        document.getElementById('marginBottomValue').textContent = e.target.value + 'px';
    });

    // Padding
    const padding = document.getElementById('padding');
    padding.addEventListener('input', (e) => {
        targetElements.forEach(element => {
            element.style.padding = e.target.value + 'px';
        });
        document.getElementById('paddingValue').textContent = e.target.value + 'px';
    });

    // Line Height
    const lineHeight = document.getElementById('lineHeight');
    lineHeight.addEventListener('input', (e) => {
        targetElements.forEach(element => {
            element.style.lineHeight = e.target.value;
        });
        document.getElementById('lineHeightValue').textContent = parseFloat(e.target.value).toFixed(1);
    });

    // Alignment buttons
    const btnGroup = stylePanel.querySelector('.btn-group');
    btnGroup.addEventListener('click', (e) => {
        const button = e.target.closest('[data-style-action]');
        if (!button) return;

        const action = button.getAttribute('data-style-action');
        targetElements.forEach(element => {
            switch(action) {
                case 'align-left':
                    element.style.textAlign = 'left';
                    break;
                case 'align-center':
                    element.style.textAlign = 'center';
                    break;
                case 'align-right':
                    element.style.textAlign = 'right';
                    break;
            }
        });
    });

    // Save and Reset buttons
    const styleActions = stylePanel.querySelector('.style-actions');
    styleActions.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');
        switch(action) {
            case 'save-styles':
                saveStyles(targetElements);
                break;
            case 'reset-styles':
                resetStyles(targetElements);
                break;
            case 'reset-page':
                resetEntirePage();
                break;
        }
    });

    // Close button
    const closeBtn = stylePanel.querySelector('[data-action="close-style-panel"]');
    closeBtn.addEventListener('click', () => {
        if (stylePanel) {
            // Remove click-outside listener if exists
            if (stylePanel.clickOutsideListener) {
                document.removeEventListener('click', stylePanel.clickOutsideListener);
            }
            stylePanel.remove();
            stylePanel = null;
        }
    });
}

function saveStyles(targetElements) {
    if (!targetElements) return;

    // Ensure it's an array
    if (!Array.isArray(targetElements)) {
        targetElements = [targetElements];
    }

    targetElements.forEach(element => {
        const elementId = element.getAttribute('data-text-id') ||
                          element.getAttribute('data-image-id') ||
                          element.id ||
                          `element_${Date.now()}`;

        const styles = {
            fontSize: element.style.fontSize,
            fontFamily: element.style.fontFamily,
            fontWeight: element.style.fontWeight,
            color: element.style.color,
            textAlign: element.style.textAlign,
            marginTop: element.style.marginTop,
            marginBottom: element.style.marginBottom,
            padding: element.style.padding,
            lineHeight: element.style.lineHeight
        };

        StorageManager.saveStyles(elementId, styles);
    });

    const message = targetElements.length > 1
        ? `💾 Stili salvati per ${targetElements.length} elementi!`
        : '💾 Stili salvati con successo!';

    showAdminNotification(message);

    if (stylePanel) {
        stylePanel.remove();
        stylePanel = null;
    }
}


function resetStyles(targetElements) {
    if (!targetElements) return;

    // Ensure it's an array
    if (!Array.isArray(targetElements)) {
        targetElements = [targetElements];
    }

    const confirmMessage = targetElements.length > 1
        ? `Resettare gli stili di ${targetElements.length} elementi?`
        : 'Resettare gli stili di questo elemento?';

    if (!confirm(confirmMessage)) return;

    targetElements.forEach(element => {
        const elementId = element.getAttribute('data-text-id') ||
                          element.getAttribute('data-image-id') ||
                          element.id;

        // Clear all styles
        element.style.cssText = '';

        if (elementId) {
            StorageManager.remove(`style_${elementId}`);
        }
    });

    showAdminNotification('🔄 Stili resettati!');

    if (stylePanel) {
        stylePanel.remove();
        stylePanel = null;
    }

    AdminDebug.log('admin', `Styles reset: ${elementId}`);
}

function resetEntirePage() {
    AdminDebug.log('admin', 'Reset entire page requested');

    // Create professional confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'admin-modal-backdrop';
    confirmModal.style.zIndex = ZIndexManager.get();
    confirmModal.innerHTML = `
        <div class="admin-modal-content admin-confirm-modal">
            <div class="modal-header">
                <h3>⚠️ Conferma Reset Pagina</h3>
            </div>
            <div class="modal-body">
                <p style="font-size: 1.1rem; margin-bottom: 20px; color: var(--dark);">
                    Sei sicuro di voler <strong>resettare TUTTI gli stili e le modifiche</strong> di questa pagina?
                </p>
                <p style="font-size: 0.95rem; color: #666; margin-bottom: 25px;">
                    ⚠️ Questa azione cancellerà:
                </p>
                <ul style="list-style: none; padding: 0; margin: 0 0 25px 20px; color: #666;">
                    <li style="margin: 8px 0;">❌ Tutti gli stili personalizzati</li>
                    <li style="margin: 8px 0;">❌ Tutti i testi modificati</li>
                    <li style="margin: 8px 0;">❌ Tutte le immagini cambiate</li>
                </ul>
                <p style="font-size: 0.9rem; color: #e74c3c; font-weight: 500;">
                    ⚠️ Questa azione NON può essere annullata!
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel-action" data-action="cancel-reset">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Annulla
                </button>
                <button class="btn-danger-action" data-action="confirm-reset">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M14 3h-1V1H3v2H2C.9 3 0 3.9 0 5v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 1h6v2H5V1zM2 13V5h12v8H2z"/>
                        <path d="M6 7h4v4H6z" fill="currentColor"/>
                    </svg>
                    Sì, Reset Pagina Intera
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(confirmModal);

    // Animate in
    requestAnimationFrame(() => {
        confirmModal.classList.add('show');
    });

    // Handle buttons
    confirmModal.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');

        if (action === 'confirm-reset') {
            AdminDebug.log('admin', 'Page reset confirmed - executing...');
            executePageReset();
            confirmModal.remove();
            if (stylePanel) {
                stylePanel.remove();
                stylePanel = null;
            }
        } else if (action === 'cancel-reset') {
            AdminDebug.log('admin', 'Page reset cancelled');
            confirmModal.remove();
        }
    });
}

function executePageReset() {
    AdminDebug.log('admin', 'Executing page reset...');

    // Get current page path
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Reset all inline styles on page
    const allEditables = document.querySelectorAll('.editable-text, .editable-paragraph, .editable-image, [data-style-editable]');
    allEditables.forEach(el => {
        el.style.cssText = '';
    });

    // Clear localStorage for this page
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('wedding_admin_')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    AdminDebug.log('admin', `Page reset complete - removed ${keysToRemove.length} items from storage`);
    showAdminNotification(`🔄 Pagina resettata! ${keysToRemove.length} modifiche cancellate.`);

    // Reload page to apply reset
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Utility: RGB to HEX
function rgbToHex(rgb) {
    if (!rgb || rgb === 'inherit') return '#000000';
    const result = rgb.match(/\d+/g);
    if (!result) return '#000000';
    return "#" + ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1);
}

// ===== IMAGE EDITOR =====
function editImage(element) {
    if (!element) return;

    AdminDebug.log('modal', 'Opening image editor');

    const imageId = element.getAttribute('data-image-id') || `image_${Date.now()}`;
    if (!element.getAttribute('data-image-id')) {
        element.setAttribute('data-image-id', imageId);
    }

    // Get current image element if exists
    const currentImg = element.querySelector('img');
    const currentObjectFit = currentImg ? (currentImg.style.objectFit || 'cover') : 'cover';
    const currentObjectPosition = currentImg ? (currentImg.style.objectPosition || 'center') : 'center';

    const modalContent = `
        <div class="admin-modal-content admin-modal-wide-content">
            <div class="modal-header">
                <h3>🖼️ Modifica Immagine</h3>
                <button class="btn-close-modal" data-action="close-image-modal">×</button>
            </div>
            <div class="modal-body">
                <div class="image-upload-section">
                    <label class="upload-label">
                        <input type="file" id="image-file-input" accept="image/*" style="display: none;">
                        <div class="upload-button">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <p style="margin: 12px 0 0 0; font-weight: 600;">Carica Immagine</p>
                            <small style="color: #666;">Click per scegliere dal computer/cellulare</small>
                        </div>
                    </label>
                </div>

                <div class="image-preview-section" id="image-preview-box" style="display: none;">
                    <img id="preview-image" src="" alt="Preview" style="max-width: 100%; max-height: 350px; border-radius: 12px;">
                </div>

                <div id="image-controls" style="display: none;">
                    <div class="form-group">
                        <label>📐 Come si Adatta l'Immagine:</label>
                        <select id="object-fit-select" class="input-full">
                            <option value="cover" ${currentObjectFit === 'cover' ? 'selected' : ''}>Coprire (riempie tutto, taglia i bordi)</option>
                            <option value="contain" ${currentObjectFit === 'contain' ? 'selected' : ''}>Contenere (mostra tutta, può avere spazi)</option>
                            <option value="fill" ${currentObjectFit === 'fill' ? 'selected' : ''}>Riempire (distorce se necessario)</option>
                            <option value="none" ${currentObjectFit === 'none' ? 'selected' : ''}>Nessun adattamento (dimensione originale)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>🎯 Posizione Immagine:</label>
                        <div class="position-grid">
                            <button class="btn-position" data-position="top left">↖</button>
                            <button class="btn-position" data-position="top center">↑</button>
                            <button class="btn-position" data-position="top right">↗</button>
                            <button class="btn-position" data-position="center left">←</button>
                            <button class="btn-position active" data-position="center">•</button>
                            <button class="btn-position" data-position="center right">→</button>
                            <button class="btn-position" data-position="bottom left">↙</button>
                            <button class="btn-position" data-position="bottom center">↓</button>
                            <button class="btn-position" data-position="bottom right">↘</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary-action" data-action="save-image" data-image-id="${imageId}">
                    💾 Salva Immagine
                </button>
                <button class="btn-danger-action" data-action="remove-image" data-image-id="${imageId}">
                    🗑️ Rimuovi Immagine
                </button>
                <button class="btn-cancel-action" data-action="close-image-modal">Annulla</button>
            </div>
        </div>
    `;

    const modal = ModalManager.open('image-editor', modalContent);

    let uploadedImageData = null;

    // File input handler
    const fileInput = document.getElementById('image-file-input');
    const previewSection = document.getElementById('image-preview-box');
    const previewImage = document.getElementById('preview-image');
    const controlsSection = document.getElementById('image-controls');
    const objectFitSelect = document.getElementById('object-fit-select');

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Per favore seleziona un file immagine valido');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('L\'immagine è troppo grande. Massimo 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImageData = event.target.result;
            previewImage.src = uploadedImageData;
            previewSection.style.display = 'block';
            controlsSection.style.display = 'block';
            updatePreviewStyle();
            AdminDebug.log('image', `File uploaded: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        };
        reader.readAsDataURL(file);
    });

    // Object fit change handler
    objectFitSelect.addEventListener('change', updatePreviewStyle);

    // Position buttons handler
    const positionButtons = modal.querySelectorAll('.btn-position');
    positionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            positionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updatePreviewStyle();
        });
    });

    function updatePreviewStyle() {
        const objectFit = objectFitSelect.value;
        const activePosition = modal.querySelector('.btn-position.active');
        const objectPosition = activePosition ? activePosition.getAttribute('data-position') : 'center';

        previewImage.style.objectFit = objectFit;
        previewImage.style.objectPosition = objectPosition;
    }

    // Event handlers
    modal.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const imageId = button.getAttribute('data-image-id');

        if (action === 'save-image') {
            if (!uploadedImageData) {
                alert('Carica un\'immagine prima di salvare');
                return;
            }

            const objectFit = objectFitSelect.value;
            const activePosition = modal.querySelector('.btn-position.active');
            const objectPosition = activePosition ? activePosition.getAttribute('data-position') : 'center';

            element.innerHTML = `<img src="${uploadedImageData}" alt="Foto ${imageId}" style="width: 100%; height: 100%; object-fit: ${objectFit}; object-position: ${objectPosition};" loading="lazy">`;

            StorageManager.saveImage(imageId, uploadedImageData);
            StorageManager.save(`image_settings_${imageId}`, { objectFit, objectPosition });

            showAdminNotification('🖼️ Immagine caricata e salvata!');
            ModalManager.close('image-editor');

            AdminDebug.log('save', `Image saved: ${imageId} (fit: ${objectFit}, position: ${objectPosition})`);
        } else if (action === 'remove-image') {
            if (!confirm('Rimuovere questa immagine?')) return;

            element.innerHTML = `
                <div class="placeholder-image">
                    <p>📸 Immagine Rimossa</p>
                </div>
            `;

            StorageManager.remove(`image_${imageId}`);
            StorageManager.remove(`image_settings_${imageId}`);
            showAdminNotification('🗑️ Immagine rimossa!');
            ModalManager.close('image-editor');

            AdminDebug.log('save', `Image removed: ${imageId}`);
        } else if (action === 'close-image-modal') {
            ModalManager.close('image-editor');
        }
    });

    // Load current image if exists
    if (currentImg && currentImg.src) {
        uploadedImageData = currentImg.src;
        previewImage.src = uploadedImageData;
        previewSection.style.display = 'block';
        controlsSection.style.display = 'block';

        // Set active position button
        const currentPosition = currentObjectPosition || 'center';
        positionButtons.forEach(btn => {
            if (btn.getAttribute('data-position') === currentPosition) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        updatePreviewStyle();
    }
}

// ===== GALLERY MANAGER =====
function openGalleryManager() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) {
        showAdminNotification('❌ Galleria non trovata in questa pagina');
        return;
    }

    AdminDebug.log('modal', 'Opening gallery manager');

    const modalContent = `
        <div class="admin-modal-content admin-modal-wide">
            <h3>🖼️ Gestione Galleria Foto</h3>
            <p style="color: #666; margin-bottom: 20px;">Massimo 12 foto. Click per modificare, usa i bottoni per aggiungere/rimuovere.</p>

            <div id="gallery-manager-grid"></div>

            <div class="gallery-actions">
                <button class="btn-admin" data-action="add-photo">➕ Aggiungi Foto</button>
                <button class="btn-cancel" data-action="close-gallery">Chiudi</button>
            </div>
        </div>
    `;

    const modal = ModalManager.open('gallery-manager', modalContent);

    modal.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const imageId = button.getAttribute('data-image-id');

        switch(action) {
            case 'add-photo':
                addGalleryPhoto();
                renderGalleryManager();
                break;
            case 'change-photo':
                editImage(document.querySelector(`[data-image-id="${imageId}"]`));
                break;
            case 'remove-photo':
                removeGalleryPhoto(imageId);
                renderGalleryManager();
                break;
            case 'close-gallery':
                ModalManager.close('gallery-manager');
                break;
        }
    });

    renderGalleryManager();
}

function renderGalleryManager() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const items = galleryGrid.querySelectorAll('.gallery-item');
    const managerGrid = document.getElementById('gallery-manager-grid');

    if (!managerGrid) return;

    managerGrid.innerHTML = '';
    managerGrid.className = 'gallery-manager-grid';

    items.forEach((item, index) => {
        const img = item.querySelector('img');
        const imageId = item.getAttribute('data-image-id') || `gallery-${index + 1}`;

        if (!item.getAttribute('data-image-id')) {
            item.setAttribute('data-image-id', imageId);
            item.classList.add('editable-image');
        }

        const card = document.createElement('div');
        card.className = 'gallery-manager-item';
        card.innerHTML = `
            <div class="manager-item-preview">
                ${img ? `<img src="${img.src}" alt="Foto ${index + 1}">` : `<div class="placeholder-mini">📸</div>`}
            </div>
            <div class="manager-item-actions">
                <button class="btn-mini" data-action="change-photo" data-image-id="${imageId}">🖼️ Cambia</button>
                <button class="btn-mini btn-danger" data-action="remove-photo" data-image-id="${imageId}">🗑️ Rimuovi</button>
            </div>
            <div class="manager-item-index">Foto ${index + 1}</div>
        `;

        managerGrid.appendChild(card);
    });

    // Update add button
    const addButton = document.querySelector('[data-action="add-photo"]');
    if (addButton) {
        if (items.length >= 12) {
            addButton.disabled = true;
            addButton.textContent = '🚫 Massimo 12 foto';
        } else {
            addButton.disabled = false;
            addButton.textContent = '➕ Aggiungi Foto';
        }
    }
}

function addGalleryPhoto() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const currentCount = galleryGrid.querySelectorAll('.gallery-item').length;

    if (currentCount >= 12) {
        showAdminNotification('❌ Massimo 12 foto raggiunto');
        return;
    }

    const newId = `gallery-${currentCount + 1}`;
    const newItem = document.createElement('div');
    newItem.className = 'gallery-item editable-image';
    newItem.setAttribute('data-image-id', newId);
    newItem.innerHTML = `
        <div class="placeholder-image">
            <p data-it="📸 Foto ${currentCount + 1}" data-pt="📸 Foto ${currentCount + 1}">📸 Foto ${currentCount + 1}</p>
        </div>
    `;

    galleryGrid.appendChild(newItem);
    showAdminNotification(`✅ Foto ${currentCount + 1} aggiunta!`);

    AdminDebug.log('save', `Gallery photo added: ${newId}`);
}

function removeGalleryPhoto(imageId) {
    if (!confirm('Rimuovere questa foto?')) return;

    const item = document.querySelector(`[data-image-id="${imageId}"]`);
    if (item) {
        item.remove();
        StorageManager.remove(`image_${imageId}`);
        showAdminNotification('🗑️ Foto rimossa!');

        AdminDebug.log('save', `Gallery photo removed: ${imageId}`);
    }
}

// ===== CAROUSEL MANAGER =====
function manageCarousel(carouselElement) {
    if (!carouselElement) return;

    // CRITICAL FIX: Find the actual carousel container with data-carousel-id
    // The passed element might be an image or other element inside the carousel
    let actualCarousel = carouselElement.closest('[data-carousel-id]');
    if (!actualCarousel) {
        // Try to find carousel-editable parent
        actualCarousel = carouselElement.closest('[data-carousel-editable]');
    }
    if (!actualCarousel) {
        // Fallback to the element itself
        actualCarousel = carouselElement;
    }

    const carouselId = actualCarousel.getAttribute('data-carousel-id') || 'carousel';
    AdminDebug.log('modal', `Opening carousel manager: ${carouselId}`);

    // Get current slides
    const track = actualCarousel.querySelector('.carousel-track');
    const slides = track ? Array.from(track.querySelectorAll('.carousel-slide img')) : [];

    const maxSlides = 8; // Max 8 foto
    const currentTiming = StorageManager.load(`carousel_${carouselId}_timing`) || 6; // Default 6 secondi

    // Determine carousel name based on ID
    let carouselName = 'Carousel';
    if (carouselId === 'hero') {
        carouselName = 'Home';
    } else if (carouselId === 'location') {
        carouselName = 'Località';
    }

    const modalContent = `
        <div class="admin-modal-content admin-modal-wide-content">
            <div class="modal-header">
                <h3>🎠 Gestisci Carousel ${carouselName}</h3>
                <button class="btn-close-modal" data-action="close-carousel-modal">×</button>
            </div>
            <div class="modal-body">
                <div class="carousel-manager-section">
                    <h4>⏱️ Tempo di Transizione</h4>
                    <div class="timing-control">
                        <input type="range" id="carousel-timing" min="3" max="10" value="${currentTiming}" step="0.5">
                        <span id="timing-value">${currentTiming} secondi</span>
                    </div>
                </div>

                <div class="carousel-manager-section">
                    <h4>📸 Foto Carousel (${slides.length}/${maxSlides})</h4>
                    <p style="color: #666; margin-bottom: 15px;">Clicca su una foto per modificarla, o aggiungi nuove foto</p>
                    <div id="carousel-photos-list" class="carousel-photos-grid"></div>
                </div>

                ${slides.length < maxSlides ? `
                    <div class="carousel-add-section" style="margin-top: 20px; padding: 20px; border: 2px dashed var(--gold); border-radius: 15px; text-align: center;">
                        <h4 style="margin-bottom: 15px; color: var(--azul-primary);">➕ Aggiungi Nuova Foto</h4>

                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <label class="btn-primary-action" style="cursor: pointer;">
                                <input type="file" id="carousel-file-upload" accept="image/*" style="display: none;">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                                    <path d="M7 9V4H9v5h4v2H9v4H7v-4H3V9h4z"/>
                                </svg>
                                📁 Carica da File
                            </label>

                            <button class="btn-secondary-action" data-action="add-carousel-url">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                                    <path d="M8 0v16M0 8h16" stroke="currentColor" stroke-width="2"/>
                                </svg>
                                🔗 Inserisci URL
                            </button>
                        </div>

                        <p style="margin-top: 10px; font-size: 0.85rem; color: #888;">
                            Formati supportati: JPG, PNG, WebP, GIF
                        </p>
                    </div>
                ` : '<p style="color: var(--terracotta); text-align: center; margin-top: 20px;">⚠️ Massimo 8 foto raggiunto</p>'}
            </div>
            <div class="modal-footer">
                <button class="btn-primary-action" data-action="save-carousel-settings">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M13 1H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM8 13L3 8l1.41-1.41L8 10.17l6.59-6.59L16 5l-8 8z"/>
                    </svg>
                    Salva Modifiche
                </button>
                <button class="btn-secondary-action" data-action="reset-carousel-settings">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M8 3V1L5 4l3 3V5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5H1c0 3.9 3.1 7 7 7s7-3.1 7-7-3.1-7-7-7z"/>
                    </svg>
                    Reset Carousel
                </button>
                <button class="btn-cancel-action" data-action="close-carousel-modal">Annulla</button>
            </div>
        </div>
    `;

    const modal = ModalManager.open('carousel-manager', modalContent);

    // Store actualCarousel reference for use in event handlers
    modal.carouselElement = actualCarousel;
    modal.carouselId = carouselId;
    modal.maxSlides = maxSlides;

    // Render initial photos list
    renderCarouselPhotos(actualCarousel, carouselId, maxSlides);

    // Update timing display
    const timingInput = document.getElementById('carousel-timing');
    const timingValue = document.getElementById('timing-value');
    timingInput.addEventListener('input', (e) => {
        timingValue.textContent = `${e.target.value} secondi`;
    });

    // File upload handler
    const fileInput = document.getElementById('carousel-file-upload');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleCarouselFileUpload(file, actualCarousel, carouselId, maxSlides);
            }
        });
    }

    // Event handlers
    modal.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');

        switch(action) {
            case 'add-carousel-url':
                addCarouselPhotoByUrl(actualCarousel, carouselId, maxSlides);
                break;
            case 'save-carousel-settings':
                saveCarouselSettings(actualCarousel, carouselId);
                break;
            case 'reset-carousel-settings':
                resetCarouselSettings(actualCarousel, carouselId);
                break;
            case 'close-carousel-modal':
                ModalManager.close('carousel-manager');
                break;
        }
    });

    // Delegate for photo actions
    modal.addEventListener('click', (e) => {
        if (e.target.closest('[data-photo-action="edit"]')) {
            const index = e.target.closest('[data-photo-action="edit"]').dataset.photoIndex;
            editCarouselPhoto(actualCarousel, carouselId, parseInt(index));
        } else if (e.target.closest('[data-photo-action="remove"]')) {
            const index = e.target.closest('[data-photo-action="remove"]').dataset.photoIndex;
            removeCarouselPhoto(actualCarousel, carouselId, parseInt(index), maxSlides);
        }
    });
}

// Handle file upload for carousel
function handleCarouselFileUpload(file, carouselElement, carouselId, maxSlides) {
    if (!file.type.startsWith('image/')) {
        showAdminNotification('❌ Per favore seleziona un file immagine!', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        addPhotoToCarousel(dataUrl, carouselElement, carouselId, maxSlides);
    };
    reader.onerror = () => {
        showAdminNotification('❌ Errore nel caricamento del file!', 'error');
    };
    reader.readAsDataURL(file);
}

// Add photo to carousel (from any source)
function addPhotoToCarousel(url, carouselElement, carouselId, maxSlides) {
    const track = carouselElement.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');

    if (slides.length >= maxSlides) {
        showAdminNotification(`⚠️ Massimo ${maxSlides} foto raggiunto!`, 'warning');
        return;
    }

    const newSlide = document.createElement('div');
    newSlide.className = 'carousel-slide';
    newSlide.innerHTML = `<img class="editable-image" src="${url}" alt="Foto ${slides.length + 1}" loading="lazy" data-image-id="${carouselId}-${slides.length + 1}">`;

    track.appendChild(newSlide);

    // Save to storage
    const photos = Array.from(track.querySelectorAll('.carousel-slide img')).map(img => img.src);
    StorageManager.save(`carousel_${carouselId}_photos`, photos);

    showAdminNotification('✅ Foto aggiunta al carousel!');
    renderCarouselPhotos(carouselElement, carouselId, maxSlides);

    // Reset file input
    const fileInput = document.getElementById('carousel-file-upload');
    if (fileInput) fileInput.value = '';

    AdminDebug.log('save', `Carousel photo added: ${carouselId}`);
}

// Add photo by URL (prompt method)
function addCarouselPhotoByUrl(carouselElement, carouselId, maxSlides) {
    const track = carouselElement.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');

    if (slides.length >= maxSlides) {
        showAdminNotification(`⚠️ Massimo ${maxSlides} foto raggiunto!`, 'warning');
        return;
    }

    const url = prompt('Inserisci URL della foto:\n\nEsempio: https://images.unsplash.com/photo-xxx?w=1920&q=80');
    if (!url) return;

    // Validate URL
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
        showAdminNotification('❌ URL non valido!', 'error');
        return;
    }

    addPhotoToCarousel(url, carouselElement, carouselId, maxSlides);
}

function renderCarouselPhotos(carouselElement, carouselId, maxSlides) {
    const track = carouselElement.querySelector('.carousel-track');
    const slides = track ? Array.from(track.querySelectorAll('.carousel-slide img')) : [];
    const photosList = document.getElementById('carousel-photos-list');

    if (!photosList) return;

    photosList.innerHTML = '';

    slides.forEach((img, index) => {
        const photoCard = document.createElement('div');
        photoCard.className = 'carousel-photo-card';
        photoCard.innerHTML = `
            <div class="photo-preview" style="background-image: url('${img.src}')"></div>
            <div class="photo-info">
                <span class="photo-number">#${index + 1}</span>
                <div class="photo-actions">
                    <button class="btn-mini" data-photo-action="edit" data-photo-index="${index}" title="Modifica URL">✏️</button>
                    <button class="btn-mini btn-danger" data-photo-action="remove" data-photo-index="${index}" title="Rimuovi">🗑️</button>
                </div>
            </div>
        `;
        photosList.appendChild(photoCard);
    });

    if (slides.length === 0) {
        photosList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Nessuna foto nel carousel. Aggiungi la prima!</p>';
    }
}

// Old addCarouselPhoto removed - replaced by addPhotoToCarousel() and addCarouselPhotoByUrl()

function editCarouselPhoto(carouselElement, carouselId, index) {
    const track = carouselElement.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide img'));

    if (!slides[index]) return;

    const currentUrl = slides[index].src;
    const newUrl = prompt('Modifica URL della foto:', currentUrl);

    if (!newUrl || newUrl === currentUrl) return;

    slides[index].src = newUrl;

    // Save to storage
    const photos = slides.map(img => img.src);
    StorageManager.save(`carousel_${carouselId}_photos`, photos);

    showAdminNotification('✅ Foto modificata!');
    renderCarouselPhotos(carouselElement, carouselId, 8);

    AdminDebug.log('save', `Carousel photo edited: ${carouselId} #${index}`);
}

function removeCarouselPhoto(carouselElement, carouselId, index, maxSlides = 8) {
    if (!confirm('Rimuovere questa foto dal carousel?')) return;

    const track = carouselElement.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));

    if (!slides[index]) return;

    slides[index].remove();

    // Save to storage
    const remainingPhotos = Array.from(track.querySelectorAll('.carousel-slide img')).map(img => img.src);
    StorageManager.save(`carousel_${carouselId}_photos`, remainingPhotos);

    showAdminNotification('🗑️ Foto rimossa!');
    renderCarouselPhotos(carouselElement, carouselId, maxSlides);

    AdminDebug.log('save', `Carousel photo removed: ${carouselId} #${index}`);
}

function saveCarouselSettings(carouselElement, carouselId) {
    const timing = parseFloat(document.getElementById('carousel-timing').value);

    // Save timing
    StorageManager.save(`carousel_${carouselId}_timing`, timing);

    // Save current photos
    const track = carouselElement.querySelector('.carousel-track');
    const photos = Array.from(track.querySelectorAll('.carousel-slide img')).map(img => img.src);
    StorageManager.save(`carousel_${carouselId}_photos`, photos);

    showAdminNotification('💾 Impostazioni carousel salvate!');
    ModalManager.close('carousel-manager');

    // Apply timing to actual carousel (requires updating script.js interval)
    if (typeof updateCarouselTiming === 'function') {
        updateCarouselTiming(carouselId, timing * 1000); // Convert to milliseconds
    }

    AdminDebug.log('save', `Carousel settings saved: ${carouselId}, timing: ${timing}s`);
}

function resetCarouselSettings(carouselElement, carouselId) {
    if (!confirm('Resettare tutte le impostazioni del carousel (foto e timing)?')) return;

    // Remove from storage
    StorageManager.remove(`carousel_${carouselId}_photos`);
    StorageManager.remove(`carousel_${carouselId}_timing`);

    showAdminNotification('🔄 Carousel resettato!');
    ModalManager.close('carousel-manager');

    setTimeout(() => {
        location.reload();
    }, 1000);

    AdminDebug.log('admin', `Carousel reset: ${carouselId}`);
}

// Wrapper function for Timeline Manager
function manageTimeline(element) {
    openTimelineManager();
}

// ===== TIMELINE MANAGER =====
function openTimelineManager() {
    const timeline = document.querySelector('.timeline-zigzag');
    if (!timeline) {
        showAdminNotification('❌ Timeline non trovata in questa pagina');
        return;
    }

    AdminDebug.log('modal', 'Opening timeline manager');

    const modalContent = `
        <div class="admin-modal-content admin-modal-wide-content">
            <div class="modal-header">
                <h3>📅 Gestisci Programma Matrimonio</h3>
                <button class="btn-close-modal" data-action="close-timeline">×</button>
            </div>
            <div class="modal-body">
                <p style="color: #666; margin-bottom: 20px;">📝 Modifica orari, titoli e descrizioni degli eventi. Click ✏️ per modificare, 🗑️ per eliminare.</p>
                <div id="timeline-manager-list" class="timeline-manager-grid"></div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary-action" data-action="add-timeline-event">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="margin-right: 6px;">
                        <path d="M8 0v16M0 8h16" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Aggiungi Evento
                </button>
                <button class="btn-cancel-action" data-action="close-timeline">Chiudi</button>
            </div>
        </div>
    `;

    const modal = ModalManager.open('timeline-manager', modalContent);

    modal.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const itemId = button.getAttribute('data-timeline-id');

        switch(action) {
            case 'add-timeline-event':
                addTimelineEvent();
                break;
            case 'edit-timeline-event':
                editTimelineEvent(itemId);
                break;
            case 'remove-timeline-event':
                removeTimelineEvent(itemId);
                break;
            case 'swap-position':
                swapTimelinePosition(itemId);
                break;
            case 'close-timeline':
                ModalManager.close('timeline-manager');
                break;
        }
    });

    renderTimelineManager();
}

function renderTimelineManager() {
    const timeline = document.querySelector('.timeline-zigzag');
    const items = timeline.querySelectorAll('.timeline-zigzag-item');
    const managerList = document.getElementById('timeline-manager-list');

    if (!managerList) return;

    managerList.innerHTML = '';

    items.forEach((item, index) => {
        const timeEl = item.querySelector('.timeline-time');
        const titleEl = item.querySelector('h3');
        const descEl = item.querySelector('p');
        const position = item.classList.contains('left') ? 'Sinistra' : 'Destra';

        const itemId = item.getAttribute('data-timeline-id') || `event-${index + 1}`;
        if (!item.getAttribute('data-timeline-id')) {
            item.setAttribute('data-timeline-id', itemId);
        }

        const card = document.createElement('div');
        card.className = 'timeline-event-card';
        card.innerHTML = `
            <div class="event-header">
                <span class="event-number">#${index + 1}</span>
                <span class="event-time">⏰ ${timeEl ? timeEl.textContent : 'Orario'}</span>
                <span class="event-position">📍 ${position}</span>
            </div>
            <div class="event-content">
                <h4>${titleEl ? titleEl.textContent : 'Titolo'}</h4>
                <p>${descEl ? descEl.textContent.substring(0, 80) + '...' : 'Descrizione'}</p>
            </div>
            <div class="event-actions">
                <button class="btn-mini" data-action="edit-timeline-event" data-timeline-id="${itemId}" title="Modifica">✏️</button>
                <button class="btn-mini" data-action="swap-position" data-timeline-id="${itemId}" title="Scambia posizione (sinistra ↔ destra)">🔄</button>
                <button class="btn-mini btn-danger" data-action="remove-timeline-event" data-timeline-id="${itemId}" title="Elimina">🗑️</button>
            </div>
        `;

        managerList.appendChild(card);
    });

    if (items.length === 0) {
        managerList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Nessun evento. Aggiungi il primo!</p>';
    }
}

function editTimelineEvent(itemId) {
    const item = document.querySelector(`[data-timeline-id="${itemId}"]`);
    if (!item) return;

    const timeEl = item.querySelector('.timeline-time');
    const titleEl = item.querySelector('h3');
    const descEl = item.querySelector('p');

    const currentTime = timeEl ? timeEl.textContent : '';
    const currentTimeAlign = timeEl ? (timeEl.style.textAlign || getComputedStyle(timeEl).textAlign || 'right') : 'right';
    const currentTitleIt = titleEl ? titleEl.getAttribute('data-it') || titleEl.textContent : '';
    const currentTitlePt = titleEl ? titleEl.getAttribute('data-pt') || titleEl.textContent : '';
    const currentDescIt = descEl ? descEl.getAttribute('data-it') || descEl.textContent : '';
    const currentDescPt = descEl ? descEl.getAttribute('data-pt') || descEl.textContent : '';

    const editModal = `
        <div class="admin-modal-content">
            <div class="modal-header">
                <h3>✏️ Modifica Evento</h3>
                <button class="btn-close-modal" data-action="close-edit-event">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>⏰ Orario:</label>
                    <input type="text" id="edit-event-time" value="${currentTime}" placeholder="es: 15:00" class="input-full">
                </div>
                <div class="form-group">
                    <label>📍 Posizione Orario:</label>
                    <div class="btn-group" style="display: flex; gap: 10px; margin-top: 8px;">
                        <button type="button" class="btn-style ${currentTimeAlign === 'left' ? 'active' : ''}" data-time-align="left" style="flex: 1;">⬅️ Sinistra</button>
                        <button type="button" class="btn-style ${currentTimeAlign === 'center' ? 'active' : ''}" data-time-align="center" style="flex: 1;">⬛ Centro</button>
                        <button type="button" class="btn-style ${currentTimeAlign === 'right' ? 'active' : ''}" data-time-align="right" style="flex: 1;">➡️ Destra</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>🇮🇹 Titolo (Italiano):</label>
                    <input type="text" id="edit-event-title-it" value="${currentTitleIt}" class="input-full">
                </div>
                <div class="form-group">
                    <label>🇵🇹 Titolo (Português):</label>
                    <input type="text" id="edit-event-title-pt" value="${currentTitlePt}" class="input-full">
                </div>
                <div class="form-group">
                    <label>🇮🇹 Descrizione (Italiano):</label>
                    <textarea id="edit-event-desc-it" rows="3" class="input-full">${currentDescIt}</textarea>
                </div>
                <div class="form-group">
                    <label>🇵🇹 Descrizione (Português):</label>
                    <textarea id="edit-event-desc-pt" rows="3" class="input-full">${currentDescPt}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary-action" data-action="save-event-changes" data-timeline-id="${itemId}">
                    Salva Modifiche
                </button>
                <button class="btn-cancel-action" data-action="close-edit-event">Annulla</button>
            </div>
        </div>
    `;

    ModalManager.close('timeline-manager');
    const modal = ModalManager.open('edit-timeline-event', editModal);

    // Handle time alignment button clicks
    let selectedTimeAlign = currentTimeAlign;
    const alignButtons = modal.querySelectorAll('[data-time-align]');
    alignButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active from all
            alignButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            selectedTimeAlign = btn.getAttribute('data-time-align');
        });
    });

    modal.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        if (btn.dataset.action === 'save-event-changes') {
            const newTime = document.getElementById('edit-event-time').value;
            const newTitleIt = document.getElementById('edit-event-title-it').value;
            const newTitlePt = document.getElementById('edit-event-title-pt').value;
            const newDescIt = document.getElementById('edit-event-desc-it').value;
            const newDescPt = document.getElementById('edit-event-desc-pt').value;

            if (timeEl) {
                timeEl.textContent = newTime;
                timeEl.style.textAlign = selectedTimeAlign;
            }
            if (titleEl) {
                titleEl.textContent = newTitleIt;
                titleEl.setAttribute('data-it', newTitleIt);
                titleEl.setAttribute('data-pt', newTitlePt);
            }
            if (descEl) {
                descEl.textContent = newDescIt;
                descEl.setAttribute('data-it', newDescIt);
                descEl.setAttribute('data-pt', newDescPt);
            }

            // Save time alignment preference
            StorageManager.save(`timeline_time_align_${itemId}`, selectedTimeAlign);

            showAdminNotification('✅ Evento modificato!');
            ModalManager.close('edit-timeline-event');
            openTimelineManager();

            AdminDebug.log('save', `Timeline event edited: ${itemId} (time-align: ${selectedTimeAlign})`);
        } else if (btn.dataset.action === 'close-edit-event') {
            ModalManager.close('edit-timeline-event');
            openTimelineManager();
        }
    });
}

function swapTimelinePosition(itemId) {
    const item = document.querySelector(`[data-timeline-id="${itemId}"]`);
    if (!item) return;

    if (item.classList.contains('left')) {
        item.classList.remove('left');
        item.classList.add('right');
        showAdminNotification('↔️ Spostato a destra!');
    } else {
        item.classList.remove('right');
        item.classList.add('left');
        showAdminNotification('↔️ Spostato a sinistra!');
    }

    renderTimelineManager();
    AdminDebug.log('style', `Timeline position swapped: ${itemId}`);
}

function removeTimelineEvent(itemId) {
    if (!confirm('Eliminare questo evento dal programma?')) return;

    const item = document.querySelector(`[data-timeline-id="${itemId}"]`);
    if (!item) return;

    item.remove();
    showAdminNotification('🗑️ Evento eliminato!');
    renderTimelineManager();

    AdminDebug.log('admin', `Timeline event removed: ${itemId}`);
}

function addTimelineEvent() {
    const addModal = `
        <div class="admin-modal-content">
            <div class="modal-header">
                <h3>➕ Nuovo Evento</h3>
                <button class="btn-close-modal" data-action="close-add-event">×</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>⏰ Orario:</label>
                    <input type="text" id="new-event-time" placeholder="es: 15:00" class="input-full">
                </div>
                <div class="form-group">
                    <label>📍 Posizione Orario:</label>
                    <div class="btn-group" style="display: flex; gap: 10px; margin-top: 8px;">
                        <button type="button" class="btn-style" data-time-align="left" style="flex: 1;">⬅️ Sinistra</button>
                        <button type="button" class="btn-style" data-time-align="center" style="flex: 1;">⬛ Centro</button>
                        <button type="button" class="btn-style active" data-time-align="right" style="flex: 1;">➡️ Destra</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>🇮🇹 Titolo (Italiano):</label>
                    <input type="text" id="new-event-title-it" placeholder="es: Cerimonia" class="input-full">
                </div>
                <div class="form-group">
                    <label>🇵🇹 Titolo (Português):</label>
                    <input type="text" id="new-event-title-pt" placeholder="es: Cerimónia" class="input-full">
                </div>
                <div class="form-group">
                    <label>🇮🇹 Descrizione (Italiano):</label>
                    <textarea id="new-event-desc-it" rows="3" placeholder="Descrizione evento..." class="input-full"></textarea>
                </div>
                <div class="form-group">
                    <label>🇵🇹 Descrição (Português):</label>
                    <textarea id="new-event-desc-pt" rows="3" placeholder="Descrição do evento..." class="input-full"></textarea>
                </div>
                <div class="form-group">
                    <label>📍 Posizione Card:</label>
                    <select id="new-event-position" class="input-full">
                        <option value="left">⬅️ Sinistra</option>
                        <option value="right">➡️ Destra</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary-action" data-action="create-new-event">
                    Crea Evento
                </button>
                <button class="btn-cancel-action" data-action="close-add-event">Annulla</button>
            </div>
        </div>
    `;

    ModalManager.close('timeline-manager');
    const modal = ModalManager.open('add-timeline-event', addModal);

    // Handle time alignment button clicks
    let selectedTimeAlign = 'right'; // default
    const alignButtons = modal.querySelectorAll('[data-time-align]');
    alignButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active from all
            alignButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            selectedTimeAlign = btn.getAttribute('data-time-align');
        });
    });

    modal.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        if (btn.dataset.action === 'create-new-event') {
            const time = document.getElementById('new-event-time').value;
            const titleIt = document.getElementById('new-event-title-it').value;
            const titlePt = document.getElementById('new-event-title-pt').value;
            const descIt = document.getElementById('new-event-desc-it').value;
            const descPt = document.getElementById('new-event-desc-pt').value;
            const position = document.getElementById('new-event-position').value;

            if (!time || !titleIt || !titlePt) {
                alert('Compila almeno orario e titoli!');
                return;
            }

            const timeline = document.querySelector('.timeline-zigzag');
            const newEventId = `event-${Date.now()}`;

            const newItem = document.createElement('div');
            newItem.className = `timeline-zigzag-item ${position}`;
            newItem.setAttribute('data-timeline-id', newEventId);

            newItem.innerHTML = `
                <div class="timeline-zigzag-content">
                    <div class="timeline-time editable-paragraph" data-style-editable style="text-align: ${selectedTimeAlign};">${time}</div>
                    <h3 class="editable-text" data-style-editable data-it="${titleIt}" data-pt="${titlePt}">${titleIt}</h3>
                    <p class="editable-paragraph" data-style-editable data-it="${descIt}" data-pt="${descPt}">${descIt}</p>
                </div>
                <div class="timeline-zigzag-image">
                    <img class="editable-image" data-image-id="timeline-${Date.now()}" src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80" alt="Evento" loading="lazy">
                </div>
            `;

            timeline.appendChild(newItem);

            // Save time alignment preference
            StorageManager.save(`timeline_time_align_${newEventId}`, selectedTimeAlign);

            showAdminNotification('✅ Evento aggiunto!');
            ModalManager.close('add-timeline-event');
            openTimelineManager();

            AdminDebug.log('save', `Timeline event added: ${newEventId} (time-align: ${selectedTimeAlign})`);
        } else if (btn.dataset.action === 'close-add-event') {
            ModalManager.close('add-timeline-event');
            openTimelineManager();
        }
    });
}

function addTimelineEvent() {
    const modalContent = `
        <div class="admin-modal-content">
            <h3>➕ Nuovo Evento</h3>
            <div class="admin-form-group">
                <label>🕐 Orario:</label>
                <input type="text" id="event-time" placeholder="es: 15:00">
            </div>
            <div class="admin-form-group">
                <label>🇮🇹 Titolo (Italiano):</label>
                <input type="text" id="event-title-it" placeholder="es: Cerimonia">
            </div>
            <div class="admin-form-group">
                <label>🇵🇹 Titolo (Português):</label>
                <input type="text" id="event-title-pt" placeholder="ex: Cerimónia">
            </div>
            <div class="admin-form-group">
                <label>🇮🇹 Descrizione (Italiano):</label>
                <textarea id="event-desc-it" rows="3" placeholder="Descrizione evento"></textarea>
            </div>
            <div class="admin-form-group">
                <label>🇵🇹 Descrizione (Português):</label>
                <textarea id="event-desc-pt" rows="3" placeholder="Descrição do evento"></textarea>
            </div>
            <div class="admin-modal-buttons">
                <button class="btn-save" data-action="save-new-timeline">💾 Aggiungi</button>
                <button class="btn-cancel" data-action="close-timeline-edit">❌ Annulla</button>
            </div>
        </div>
    `;

    const modal = ModalManager.open('timeline-edit', modalContent, { closePrevious: false });

    modal.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');

        if (action === 'save-new-timeline') {
            const time = document.getElementById('event-time').value;
            const titleIT = document.getElementById('event-title-it').value;
            const titlePT = document.getElementById('event-title-pt').value;
            const descIT = document.getElementById('event-desc-it').value;
            const descPT = document.getElementById('event-desc-pt').value;

            if (!time || !titleIT) {
                alert('Inserisci almeno orario e titolo italiano');
                return;
            }

            const timeline = document.querySelector('.timeline');
            const newId = `timeline-${Date.now()}`;

            const newItem = document.createElement('div');
            newItem.className = 'timeline-item';
            newItem.setAttribute('data-timeline-id', newId);
            newItem.innerHTML = `
                <div class="timeline-time">${time}</div>
                <div class="timeline-content">
                    <h3 data-it="${titleIT}" data-pt="${titlePT || titleIT}">${titleIT}</h3>
                    <p data-it="${descIT}" data-pt="${descPT || descIT}">${descIT}</p>
                </div>
            `;

            timeline.appendChild(newItem);

            const eventData = { time, titleIT, titlePT, descIT, descPT };
            StorageManager.save(`timeline_${newId}`, eventData);

            showAdminNotification('✅ Evento aggiunto!');
            ModalManager.close('timeline-edit');
            renderTimelineManager();

            AdminDebug.log('save', `Timeline event added: ${newId}`);
        } else if (action === 'close-timeline-edit') {
            ModalManager.close('timeline-edit');
        }
    });
}

function editTimelineEvent(itemId) {
    const item = document.querySelector(`[data-timeline-id="${itemId}"]`);
    if (!item) return;

    const timeEl = item.querySelector('.timeline-time');
    const titleEl = item.querySelector('h3');
    const descEl = item.querySelector('p');

    const modalContent = `
        <div class="admin-modal-content">
            <h3>✏️ Modifica Evento</h3>
            <div class="admin-form-group">
                <label>🕐 Orario:</label>
                <input type="text" id="event-time" value="${timeEl.textContent}">
            </div>
            <div class="admin-form-group">
                <label>🇮🇹 Titolo (Italiano):</label>
                <input type="text" id="event-title-it" value="${titleEl.getAttribute('data-it') || titleEl.textContent}">
            </div>
            <div class="admin-form-group">
                <label>🇵🇹 Titolo (Português):</label>
                <input type="text" id="event-title-pt" value="${titleEl.getAttribute('data-pt') || titleEl.textContent}">
            </div>
            <div class="admin-form-group">
                <label>🇮🇹 Descrizione (Italiano):</label>
                <textarea id="event-desc-it" rows="3">${descEl.getAttribute('data-it') || descEl.textContent}</textarea>
            </div>
            <div class="admin-form-group">
                <label>🇵🇹 Descrizione (Português):</label>
                <textarea id="event-desc-pt" rows="3">${descEl.getAttribute('data-pt') || descEl.textContent}</textarea>
            </div>
            <div class="admin-modal-buttons">
                <button class="btn-save" data-action="save-edited-timeline" data-timeline-id="${itemId}">💾 Salva</button>
                <button class="btn-cancel" data-action="close-timeline-edit">❌ Annulla</button>
            </div>
        </div>
    `;

    const modal = ModalManager.open('timeline-edit', modalContent, { closePrevious: false });

    modal.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const timelineId = button.getAttribute('data-timeline-id');

        if (action === 'save-edited-timeline') {
            const time = document.getElementById('event-time').value;
            const titleIT = document.getElementById('event-title-it').value;
            const titlePT = document.getElementById('event-title-pt').value;
            const descIT = document.getElementById('event-desc-it').value;
            const descPT = document.getElementById('event-desc-pt').value;

            timeEl.textContent = time;
            titleEl.setAttribute('data-it', titleIT);
            titleEl.setAttribute('data-pt', titlePT);
            titleEl.textContent = titleIT;
            descEl.setAttribute('data-it', descIT);
            descEl.setAttribute('data-pt', descPT);
            descEl.textContent = descIT;

            const eventData = { time, titleIT, titlePT, descIT, descPT };
            StorageManager.save(`timeline_${timelineId}`, eventData);

            showAdminNotification('💾 Evento aggiornato!');
            ModalManager.close('timeline-edit');
            renderTimelineManager();

            AdminDebug.log('save', `Timeline event updated: ${timelineId}`);
        } else if (action === 'close-timeline-edit') {
            ModalManager.close('timeline-edit');
        }
    });
}

function removeTimelineEvent(itemId) {
    if (!confirm('Rimuovere questo evento?')) return;

    const item = document.querySelector(`[data-timeline-id="${itemId}"]`);
    if (item) {
        item.remove();
        StorageManager.remove(`timeline_${itemId}`);
        renderTimelineManager();
        showAdminNotification('🗑️ Evento rimosso!');

        AdminDebug.log('save', `Timeline event removed: ${itemId}`);
    }
}

// ===== ADMIN PANEL (BACKUP/IMPORT) =====
function showAdminPanel() {
    const modalContent = `
        <div class="admin-modal-content">
            <h3>⚙️ Pannello Admin</h3>
            <div style="margin: 20px 0;">
                <button class="btn-admin" data-action="export-data" style="width: 100%; margin-bottom: 10px;">📥 Esporta Modifiche (JSON)</button>
                <button class="btn-admin" data-action="import-data" style="width: 100%; margin-bottom: 10px;">📤 Importa Modifiche (JSON)</button>
                <button class="btn-admin btn-danger" data-action="reset-all" style="width: 100%;">🔄 Reset Tutto</button>
            </div>
            <p style="color: #666; font-size: 0.85rem; margin-top: 20px;">
                💡 Esporta per backup o trasferire su altro browser.
            </p>
            <div class="admin-modal-buttons">
                <button class="btn-cancel" data-action="close-admin-panel">Chiudi</button>
            </div>
        </div>
    `;

    const modal = ModalManager.open('admin-panel', modalContent);

    modal.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.getAttribute('data-action');

        switch(action) {
            case 'export-data':
                exportData();
                break;
            case 'import-data':
                importData();
                break;
            case 'reset-all':
                resetAll();
                break;
            case 'close-admin-panel':
                ModalManager.close('admin-panel');
                break;
        }
    });
}

function exportData() {
    const data = StorageManager.export();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-edits-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    showAdminNotification('📥 Backup scaricato!');
    AdminDebug.log('save', 'Data exported');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (StorageManager.import(data)) {
                    showAdminNotification('✅ Import completato! Ricarico la pagina...');
                    setTimeout(() => location.reload(), 1500);
                } else {
                    alert('Errore durante l\'import!');
                }
            } catch (err) {
                alert('Errore nel file JSON!');
                AdminDebug.error('Import failed', err);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetAll() {
    if (!confirm('⚠️ ATTENZIONE! Cancellerà TUTTE le modifiche. Sicuro?')) return;
    if (!confirm('Sicuro SICURO? Non si può annullare!')) return;

    StorageManager.clear();
    showAdminNotification('🔄 Reset completato! Ricarico la pagina...');
    setTimeout(() => location.reload(), 1500);

    AdminDebug.log('save', 'All data reset');
}

// ===== LOAD ALL SAVED DATA ON PAGE LOAD =====
function loadAllSavedData() {
    AdminDebug.time('Load All Data');

    // Load texts
    document.querySelectorAll('[data-text-id]').forEach(element => {
        const textId = element.getAttribute('data-text-id');
        const savedText = StorageManager.loadText(textId);

        if (savedText) {
            if (savedText.it && savedText.pt) {
                element.setAttribute('data-it', savedText.it);
                element.setAttribute('data-pt', savedText.pt);

                const currentLang = document.documentElement.lang || 'it';
                element.textContent = currentLang === 'it' ? savedText.it : savedText.pt;
            } else if (typeof savedText === 'string') {
                element.textContent = savedText;
            }

            AdminDebug.log('load', `Text loaded: ${textId}`);
        }
    });

    // Load images
    document.querySelectorAll('[data-image-id]').forEach(element => {
        const imageId = element.getAttribute('data-image-id');
        const savedUrl = StorageManager.loadImage(imageId);

        if (savedUrl) {
            element.innerHTML = `<img src="${savedUrl}" alt="Foto ${imageId}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">`;
            AdminDebug.log('load', `Image loaded: ${imageId}`);
        }
    });

    // Load styles
    document.querySelectorAll('[data-text-id], [data-image-id]').forEach(element => {
        const elementId = element.getAttribute('data-text-id') || element.getAttribute('data-image-id');
        const savedStyles = StorageManager.loadStyles(elementId);

        if (savedStyles) {
            Object.assign(element.style, savedStyles);
            AdminDebug.log('load', `Styles loaded: ${elementId}`);
        }
    });

    // Load timeline events
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(StorageManager.prefix + 'timeline_')) {
                const itemId = key.replace(StorageManager.prefix + 'timeline_', '');
                const item = document.querySelector(`[data-timeline-id="${itemId}"]`);

                if (!item) {
                    const eventData = StorageManager.load(`timeline_${itemId}`);
                    if (eventData) {
                        const newItem = document.createElement('div');
                        newItem.className = 'timeline-item';
                        newItem.setAttribute('data-timeline-id', itemId);
                        newItem.innerHTML = `
                            <div class="timeline-time">${eventData.time}</div>
                            <div class="timeline-content">
                                <h3 data-it="${eventData.titleIT}" data-pt="${eventData.titlePT}">${eventData.titleIT}</h3>
                                <p data-it="${eventData.descIT}" data-pt="${eventData.descPT}">${eventData.descIT}</p>
                            </div>
                        `;
                        timeline.appendChild(newItem);
                        AdminDebug.log('load', `Timeline event loaded: ${itemId}`);
                    }
                }
            }
        }
    }

    AdminDebug.timeEnd('Load All Data');
    AdminDebug.log('load', '✅ All saved data loaded successfully');
}

// ===== INITIALIZE ON DOM READY =====
window.addEventListener('DOMContentLoaded', () => {
    loadAllSavedData();

    console.log('');
    console.log('%c🎉 PROFESSIONAL ADMIN SYSTEM v2.0 LOADED', 'color: #2E5C8A; font-size: 16px; font-weight: bold;');
    console.log('%c📋 Commands:', 'color: #E86A3E; font-weight: bold;');
    console.log('  - Ctrl+Alt+A: Toggle Admin Mode');
    console.log('  - Right Click: Context Menu (when in admin mode)');
    console.log('  - AdminDebug.disable(): Disable debug logs');
    console.log('  - AdminDebug.enable(): Enable debug logs');
    console.log('');
});
