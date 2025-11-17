// ===== SISTEMA ADMIN INLINE PER EDITING =====
// Premi Ctrl+Shift+E per attivare modalità admin

let isAdminMode = false;
const STORAGE_PREFIX = 'wedding_';

// Attiva/Disattiva Admin Mode
function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    document.body.classList.toggle('admin-mode', isAdminMode);

    if (isAdminMode) {
        showAdminNotification('✏️ Modalità Admin ATTIVA - Clicca su elementi evidenziati per modificarli');
    } else {
        showAdminNotification('💾 Modalità Admin DISATTIVATA - Modifiche salvate!');
    }
}

// Notifica admin
function showAdminNotification(message) {
    // Rimuovi notifica esistente
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Ascolta combinazione Ctrl+Shift+E
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        toggleAdminMode();
    }
});

// ===== GESTIONE TESTI EDITABILI =====
document.addEventListener('click', (e) => {
    if (!isAdminMode) return;

    const editableText = e.target.closest('.editable-text, .editable-paragraph');
    if (editableText) {
        e.preventDefault();
        editText(editableText);
    }
});

function editText(element) {
    const textId = element.getAttribute('data-text-id');
    const span = element.querySelector('span[data-it][data-pt]') || element;

    const currentIT = span.getAttribute('data-it') || span.textContent;
    const currentPT = span.getAttribute('data-pt') || span.textContent;

    // Crea modal
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <h3>✏️ Modifica Testo</h3>
            <div class="admin-form-group">
                <label>🇮🇹 Italiano:</label>
                <textarea id="edit-it" rows="4">${currentIT}</textarea>
            </div>
            <div class="admin-form-group">
                <label>🇵🇹 Português:</label>
                <textarea id="edit-pt" rows="4">${currentPT}</textarea>
            </div>
            <div class="admin-modal-buttons">
                <button onclick="saveTextEdit('${textId}')" class="btn-save">💾 Salva</button>
                <button onclick="closeModal()" class="btn-cancel">❌ Annulla</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
    document.getElementById('edit-it').focus();
}

window.saveTextEdit = function(textId) {
    const textIT = document.getElementById('edit-it').value;
    const textPT = document.getElementById('edit-pt').value;

    // Salva in localStorage
    localStorage.setItem(STORAGE_PREFIX + 'text_' + textId + '_it', textIT);
    localStorage.setItem(STORAGE_PREFIX + 'text_' + textId + '_pt', textPT);

    // Aggiorna DOM
    const element = document.querySelector(`[data-text-id="${textId}"]`);
    if (element) {
        const span = element.querySelector('span[data-it][data-pt]') || element;
        span.setAttribute('data-it', textIT);
        span.setAttribute('data-pt', textPT);

        // Applica la lingua corrente
        if (currentLang === 'it') {
            span.textContent = textIT;
        } else {
            span.textContent = textPT;
        }
    }

    closeModal();
    showAdminNotification('✅ Testo salvato con successo!');
};

window.closeModal = function() {
    const modal = document.querySelector('.admin-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
};

// ===== GESTIONE IMMAGINI EDITABILI =====
document.addEventListener('click', (e) => {
    if (!isAdminMode) return;

    const editableImage = e.target.closest('.editable-image');
    if (editableImage) {
        e.preventDefault();
        editImage(editableImage);
    }
});

function editImage(element) {
    const imageId = element.getAttribute('data-image-id');
    const currentImg = element.querySelector('img');
    const currentSrc = currentImg ? currentImg.src : '';

    // Crea modal
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <h3>📸 Modifica Immagine</h3>
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 20px;">
                Inserisci l'URL completo dell'immagine (es: https://esempio.com/foto.jpg)<br>
                Oppure carica su <a href="https://imgur.com/upload" target="_blank">Imgur</a> e copia il link.
            </p>
            <div class="admin-form-group">
                <label>🔗 URL Immagine:</label>
                <input type="url" id="edit-image-url" value="${currentSrc}" placeholder="https://...">
            </div>
            ${currentSrc ? `
            <div class="admin-form-group">
                <label>🖼️ Anteprima:</label>
                <img src="${currentSrc}" style="max-width: 100%; max-height: 200px; border-radius: 10px; margin-top: 10px;">
            </div>
            ` : ''}
            <div class="admin-modal-buttons">
                <button onclick="saveImageEdit('${imageId}')" class="btn-save">💾 Salva</button>
                <button onclick="removeImage('${imageId}')" class="btn-remove">🗑️ Rimuovi</button>
                <button onclick="closeModal()" class="btn-cancel">❌ Annulla</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
    document.getElementById('edit-image-url').focus();
}

window.saveImageEdit = function(imageId) {
    const imageUrl = document.getElementById('edit-image-url').value.trim();

    if (!imageUrl) {
        alert('Inserisci un URL valido!');
        return;
    }

    // Salva in localStorage
    localStorage.setItem(STORAGE_PREFIX + 'image_' + imageId, imageUrl);

    // Aggiorna DOM
    const element = document.querySelector(`[data-image-id="${imageId}"]`);
    if (element) {
        element.innerHTML = `<img src="${imageUrl}" alt="Foto ${imageId}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">`;
    }

    closeModal();
    showAdminNotification('✅ Immagine salvata con successo!');
};

window.removeImage = function(imageId) {
    if (!confirm('Vuoi davvero rimuovere questa immagine?')) return;

    // Rimuovi da localStorage
    localStorage.removeItem(STORAGE_PREFIX + 'image_' + imageId);

    // Ripristina placeholder
    const element = document.querySelector(`[data-image-id="${imageId}"]`);
    if (element) {
        element.innerHTML = `
            <div class="placeholder-image">
                <p>📸 Foto ${imageId}</p>
            </div>
        `;
    }

    closeModal();
    showAdminNotification('🗑️ Immagine rimossa!');
};

// ===== CARICA MODIFICHE SALVATE AL PAGE LOAD =====
document.addEventListener('DOMContentLoaded', loadSavedEdits);

function loadSavedEdits() {
    // Carica testi salvati
    document.querySelectorAll('[data-text-id]').forEach(element => {
        const textId = element.getAttribute('data-text-id');
        const savedIT = localStorage.getItem(STORAGE_PREFIX + 'text_' + textId + '_it');
        const savedPT = localStorage.getItem(STORAGE_PREFIX + 'text_' + textId + '_pt');

        if (savedIT || savedPT) {
            const span = element.querySelector('span[data-it][data-pt]') || element;
            if (savedIT) span.setAttribute('data-it', savedIT);
            if (savedPT) span.setAttribute('data-pt', savedPT);

            // Applica la lingua corrente
            if (currentLang === 'it' && savedIT) {
                span.textContent = savedIT;
            } else if (currentLang === 'pt' && savedPT) {
                span.textContent = savedPT;
            }
        }
    });

    // Carica immagini salvate
    document.querySelectorAll('[data-image-id]').forEach(element => {
        const imageId = element.getAttribute('data-image-id');
        const savedUrl = localStorage.getItem(STORAGE_PREFIX + 'image_' + imageId);

        if (savedUrl) {
            element.innerHTML = `<img src="${savedUrl}" alt="Foto ${imageId}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">`;
        }
    });
}

// ===== PANNELLO ADMIN (opzionale - tasto A in admin mode) =====
document.addEventListener('keydown', (e) => {
    if (isAdminMode && e.key === 'a' && !e.ctrlKey) {
        e.preventDefault();
        showAdminPanel();
    }
});

function showAdminPanel() {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <h3>⚙️ Pannello Admin</h3>
            <div style="margin: 20px 0;">
                <button onclick="exportData()" class="btn-admin">📥 Esporta Modifiche (JSON)</button>
                <button onclick="importData()" class="btn-admin">📤 Importa Modifiche (JSON)</button>
                <button onclick="resetAll()" class="btn-admin btn-danger">🔄 Reset Tutto</button>
            </div>
            <p style="color: #666; font-size: 0.85rem; margin-top: 20px;">
                💡 Esporta le modifiche per fare backup o trasferirle su altro browser.
            </p>
            <div class="admin-modal-buttons">
                <button onclick="closeModal()" class="btn-cancel">Chiudi</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

window.exportData = function() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(STORAGE_PREFIX)) {
            data[key] = localStorage.getItem(key);
        }
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-edits-backup.json';
    a.click();

    showAdminNotification('📥 Backup scaricato!');
};

window.importData = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                for (const [key, value] of Object.entries(data)) {
                    localStorage.setItem(key, value);
                }
                location.reload();
            } catch (err) {
                alert('Errore nel file JSON!');
            }
        };
        reader.readAsText(file);
    };
    input.click();
};

window.resetAll = function() {
    if (!confirm('⚠️ ATTENZIONE! Questo cancellerà TUTTE le modifiche. Sei sicuro?')) return;
    if (!confirm('Sicuro SICURO? Non si può annullare!')) return;

    // Rimuovi tutti i dati con prefix
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    location.reload();
};

console.log('🔧 Sistema Admin caricato! Premi Ctrl+Shift+E per attivare.');
console.log('💡 In modalità admin, premi "A" per aprire il pannello admin.');
