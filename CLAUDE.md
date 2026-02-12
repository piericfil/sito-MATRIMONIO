# CLAUDE.md - Guida AI per Sito Matrimonio Catarina & Lorenzo

## 📋 Panoramica del Progetto

Questo è un **sito web matrimoniale statico** per il matrimonio di Catarina & Lorenzo del 26 settembre 2026. Il sito combina l'eleganza italiana con il calore portoghese, con design ispirato agli azulejos portoghesi.

### Informazioni Chiave
- **Evento**: Matrimonio Catarina & Lorenzo
- **Data**: 26 Settembre 2026, ore 15:00
- **Luoghi**: Fondra (cerimonia) & San Pellegrino Terme (ricevimento)
- **Lingue**: Bilingue Italiano/Portoghese
- **Tipo**: Sito statico (HTML/CSS/JS puro)
- **Deployment**: GitHub Pages / Netlify

---

## 🏗️ Struttura del Progetto

```
sito-MATRIMONIO/
├── index.html              # Homepage con hero carousel, countdown, RSVP
├── localita.html           # Info su località con carousel di immagini
├── programma.html          # Timeline del matrimonio con zig-zag layout
├── storia.html             # Storia della coppia con galleria
├── lista-nozze.html        # Info lista nozze con design semplice
├── test.html               # Pagina di test per debug immagini
├── style.css               # Tutti gli stili (2100+ righe)
├── script.js               # Funzionalità JS (510 righe)
├── admin-advanced.js       # Sistema admin completo (2500+ righe)
├── favicon.svg             # Icona del sito
├── foto-piastrelle-azulejos.jpg  # Decorazione azulejos
├── README.md               # Documentazione utente
├── CLAUDE.md               # Questa guida completa per AI/sviluppatori
├── DEBUG.md                # Guida debug immagini
└── CATA LORI WEDDING.pdf   # Mood board di riferimento
```

### Pagine e loro Scopo

| Pagina               | Scopo               | Sezioni Principali                                     |
| -------------------- | ------------------- | ------------------------------------------------------ |
| **index.html**       | Homepage principale | Hero carousel, Countdown, Quick links, RSVP form       |
| **localita.html**    | Info logistiche     | Carousel location, Come arrivare, Aeroporti, Mappe     |
| **programma.html**   | Programma giornata  | Timeline evento con orari dettagliati (zig-zag layout) |
| **storia.html**      | Storia della coppia | Capitoli della relazione, Galleria foto                |
| **lista-nozze.html** | Lista nozze         | Informazioni regalo con design semplice ed elegante    |
| **test.html**        | Debug & test        | Monitoraggio caricamento immagini                      |

---

## 🎨 Design System

### Palette Colori

**IMPORTANTE**: Usa SEMPRE queste variabili CSS, mai valori hardcoded!

```css
:root {
    /* Colori Principali */
    --azul-primary: #2E5C8A;      /* Blu principale - usato per titoli importanti */
    --azul-light: #7CB9E8;        /* Blu chiaro - accenti e hover */
    --azul-navy: #1B3A5C;         /* Blu navy - titoli hero */

    /* Terracotta/Arancio */
    --terracotta: #E86A3E;        /* Terracotta - colore secondario */
    --terracotta-light: #F4A87C;  /* Terracotta chiaro */
    --orange: #FF8C42;            /* Arancio acceso */

    /* Neutri */
    --cream: #FAF7F2;             /* Crema - background */
    --white: #FFFFFF;             /* Bianco */
    --dark: #2C2C2C;              /* Testo scuro */

    /* Accenti */
    --gold: #FFB84D;              /* Oro - dettagli eleganti */
    --green: #4A7C59;             /* Verde - accenti */
    --peach: #FFCBA4;             /* Pesca - decorazioni */

    /* Font */
    --font-serif: 'Cormorant Garamond', serif;  /* Titoli eleganti */
    --font-sans: 'Montserrat', sans-serif;      /* Testo corpo */
}
```

### Quando Usare Ogni Colore

- **Azul Primary**: Titoli H2/H3, link navbar attivi, bottoni primari
- **Terracotta**: Date, orari, bordi card, bottoni submit
- **Gold**: Divider, accenti decorativi, gradient
- **Cream**: Background sezioni, input background
- **White**: Card background, overlay
- **Dark**: Testo principale

### Tipografia

```css
/* Titoli Eleganti */
h1, h2, h3 {
    font-family: var(--font-serif);
    font-weight: 300-600;
}

/* Corpo Testo */
body, p, button {
    font-family: var(--font-sans);
    font-weight: 300-500;
}
```

**Scale Dimensioni**:
- H1 Hero: `clamp(2.8rem, 8vw, 8rem)`
- H2 Sezioni: `clamp(2.5rem, 5vw, 3.5rem)`
- H3 Card: `1.6-2.2rem`
- Body text: `1rem` (16px base)
- Small text: `0.85-0.95rem`

---

## 💻 Stack Tecnologico

### Frontend Puro
- **HTML5**: Semantico, accessibility-friendly
- **CSS3**: Variables, Grid, Flexbox, animazioni
- **JavaScript Vanilla**: ES6+, nessun framework

### Servizi Esterni
- **Google Fonts**: Cormorant Garamond, Montserrat
- **Web3Forms**: API gratuita per form RSVP
- **Unsplash**: CDN immagini (foto matrimoniali)
- **Pexels**: CDN immagini (azulejos portoghesi)

### Nessuna Build Step
Il sito NON usa:
- ❌ npm/yarn
- ❌ Webpack/Vite
- ❌ Preprocessori CSS (Sass/Less)
- ❌ React/Vue/Angular
- ❌ TypeScript

✅ È tutto HTML/CSS/JS puro servito direttamente

---

## 🔧 Funzionalità Principali

### 1. Sistema Bilingue (IT/PT)

**Come Funziona**:
- Ogni elemento con testo ha attributi `data-it` e `data-pt`
- JavaScript cambia lingua dinamicamente
- Preferenza salvata in localStorage

**Esempio HTML**:
```html
<h2 data-it="La Nostra Storia" data-pt="Nossa História">La Nostra Storia</h2>
<button data-it="Conferma Presenza" data-pt="Confirmar Presença">Conferma Presenza</button>
```

**Implementazione JS**:
```javascript
function changeLanguage(lang) {
    document.querySelectorAll('[data-it][data-pt]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
}
```

**IMPORTANTE**: Quando aggiungi nuovo contenuto, SEMPRE includere entrambe le lingue!

### 2. Countdown al Matrimonio

**Data Target**: `September 26, 2026 15:00:00`

**Funzionamento**:
- Update ogni secondo (setInterval)
- Calcola giorni, ore, minuti, secondi
- Quando scade mostra messaggio speciale

**File**: `script.js` righe 5-34

**NOTA**: Non modificare la data senza conferma!

### 3. Carousel Background

**Due Implementazioni**:
1. **Hero Carousel** (index.html): 5 slide in background hero
2. **Location Carousel** (localita.html): 5 slide località

**Features**:
- Auto-scroll ogni 6 secondi
- Swipe/drag per navigazione
- Indicators clickabili
- Pause on hover
- Responsive

**Codice**: `script.js` righe 97-395

### 4. Form RSVP con Web3Forms

**Access Key Attuale**: `21d6306d-2013-49f8-a820-03e3f725d2da`

**Campi Form**:
- Nome principale (required)
- Altri ospiti (textarea)
- Telefono (opzionale)
- Partecipazione a: Cerimonia/Ricevimento (checkbox)
- Allergie/intolleranze
- Messaggio personale

**Endpoint**: `https://api.web3forms.com/submit`

**Come Cambiare Email Destinataria**:
1. Vai su web3forms.com
2. Inserisci nuova email
3. Ottieni nuova Access Key
4. Sostituisci in `index.html` riga 137

**File**: `index.html` righe 134-194, `script.js` righe 397-454

### 5. Navbar Sticky

**Comportamento**:
- Nascosta inizialmente (`transform: translateY(-100%)`)
- Appare dopo scroll > 300px
- Smooth transition
- Links con active state

**File**: `script.js` righe 36-50, `style.css` righe 95-145

### 6. Animazioni Scroll

**Intersection Observer**:
- Fade-in + translateY per card, timeline, galleria
- Threshold: 0.1
- Root margin: -100px

**Elementi Animati**:
- `.storia-chapter`
- `.evento-card`
- `.timeline-item`
- `.gallery-item`
- `.logistica-item`
- `.link-card`

**File**: `script.js` righe 253-278

### 7. Countdown Group Selection (Nuova Feature!)

**Funzionalità**:
- Cliccando su qualsiasi numero del countdown (giorni/ore/minuti/secondi) vengono selezionati **TUTTI i numeri** insieme
- Permette di modificare lo stile di tutti i numeri simultaneamente

**Implementazione** (`admin-advanced.js`):
```javascript
function editStyles(element) {
    let targetElements = [element];

    if (element.classList.contains('countdown-number')) {
        const countdown = element.closest('.countdown');
        if (countdown) {
            targetElements = Array.from(countdown.querySelectorAll('.countdown-number'));
        }
    }

    setupStyleListeners(targetElements);  // Array-based
}
```

**UX**:
- Modal title mostra "(Tutti i Numeri)" quando attivo
- Info banner: "📊 Stai modificando tutti i numeri del countdown"
- Notifica salvataggio mostra conteggio elementi

**File**: `admin-advanced.js` righe 732-937, funzioni modificate per supporto array

### 8. Click-Outside to Close (Nuova Feature!)

**Funzionalità**:
- Cliccare fuori da modali e pannelli li chiude automaticamente
- Non serve più usare il bottone X

**Implementazione A - Modali** (`admin-advanced.js`):
```javascript
modal.addEventListener('click', (e) => {
    if (e.target === modal) {  // Click su background, non content
        this.close(id);
    }
});
```

**Implementazione B - Style Panel**:
```javascript
setTimeout(() => {
    const closeOnOutsideClick = (e) => {
        if (stylePanel && !stylePanel.contains(e.target)) {
            stylePanel.remove();
            document.removeEventListener('click', closeOnOutsideClick);
        }
    };
    document.addEventListener('click', closeOnOutsideClick);
}, 100);  // Timeout per evitare chiusura immediata
```

**Dettagli Tecnici**:
- setTimeout di 100ms previene chiusura immediata dal click di apertura
- Listener salvato in `stylePanel.clickOutsideListener` per cleanup
- Rimosso quando pannello chiuso via bottone X

**File**: `admin-advanced.js` - ModalManager.open() + editStyles()

### 9. Timeline Time Position Control (Nuova Feature!)

**Funzionalità**:
- Controllo posizione orario eventi timeline: **Sinistra / Centro / Destra**
- Disponibile sia in modifica eventi esistenti che creazione nuovi

**UI**:
```
📍 Posizione Orario:
[⬅️ Sinistra] [⬛ Centro] [➡️ Destra]
```

**Implementazione** (`admin-advanced.js`):
```javascript
// Detect current alignment
const currentTimeAlign = timeEl.style.textAlign ||
                        getComputedStyle(timeEl).textAlign ||
                        'right';

// Create 3-button selector
const alignButtons = modal.querySelectorAll('[data-time-align]');
alignButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alignButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTimeAlign = btn.getAttribute('data-time-align');
    });
});

// Apply on save
timeEl.style.textAlign = selectedTimeAlign;
StorageManager.save(`timeline_time_align_${itemId}`, selectedTimeAlign);
```

**Caratteristiche**:
- Active state highlighting del bottone selezionato
- Default: 'right' per nuovi eventi
- Persistenza in localStorage per evento
- Funziona in editTimelineEvent() e addTimelineEvent()

**File**: `admin-advanced.js` righe 2081-2350

### 10. Section Background Harmony (Nuova Feature!)

**Design System Standardizzato**:
- **Terracotta**: `rgba(232, 106, 62, 0.10-0.12)`
- **Blue (Azul)**: `rgba(124, 185, 232, 0.10-0.12)`
- **Gold**: `rgba(255, 184, 77, 0.06-0.12)`
- Opacità: 6-12% per eleganza sottile

**Sezioni Aggiornate** (`style.css`):

```css
/* Evento Section (localita.html) */
.evento {
    background:
        radial-gradient(circle at 15% 25%, rgba(232, 106, 62, 0.12) 0%, transparent 55%),
        radial-gradient(circle at 85% 75%, rgba(124, 185, 232, 0.12) 0%, transparent 55%),
        radial-gradient(circle at 50% 50%, rgba(255, 184, 77, 0.05) 0%, transparent 70%),
        linear-gradient(180deg, var(--cream) 0%, rgba(250, 247, 242, 0.95) 100%);
}

/* Logistica Section */
.logistica {
    background:
        radial-gradient(circle at 80% 20%, rgba(255, 184, 77, 0.12) 0%, transparent 55%),
        radial-gradient(circle at 20% 80%, rgba(124, 185, 232, 0.12) 0%, transparent 55%),
        linear-gradient(180deg, var(--white) 0%, rgba(250, 247, 242, 0.6) 100%);
}
```

**Pagine Migliorate**:
- **localita.html**: .evento, .logistica (focus principale richiesto dall'utente)
- **programma.html**: .programma, .page-header
- **storia.html**: .storia, .galleria
- **index.html**: .quick-links, .rsvp
- **lista-nozze.html**: .lista-main

**Risultato**:
✅ Transizioni smooth tra tutte le sezioni
✅ Armonia visiva elegante e di classe
✅ Nessuna sezione con background bianco piatto
✅ Uso consistente colori moodboard

**File**: `style.css` - varie sezioni aggiornate

### 11. Cross-Page Consistency (Completata!)

**Verifiche Effettuate**:
- ✅ Navigazione identica su tutte le 5 pagine
- ✅ Language toggle consistente
- ✅ Script imports uniformi
- ✅ Font imports identici
- ✅ Footer struttura standardizzata
- ✅ View counter implementazione uniforme
- ✅ Azulejos decoration su tutte le pagine
- ✅ Admin mode attributes consistenti

**Issue Risolte**:

**CRITICAL - Footer Classes Standardizzate**:
- index.html usava `editable-text`, altri usavano `editable-paragraph`
- **Fix**: Standardizzato tutto a `editable-paragraph`

**MEDIUM - Social Media Meta Tags**:
- Solo index.html e lista-nozze.html avevano meta tags
- **Fix**: Aggiunti Open Graph + Twitter tags a localita, programma, storia

**MINOR - Azulejo Dividers**:
- lista-nozze aveva divider in page-header, programma/storia no
- **Fix**: Aggiunti dividers a programma e storia per uniformità

**Consistency Score**: **100%** - Perfetta coerenza tra tutte le pagine!

**File Modificati**: index.html, localita.html, programma.html, storia.html

---

## 📐 Convenzioni di Codice

### HTML

1. **Semantica**:
   - Usa `<section>` per sezioni logiche
   - `<nav>` per navigazione
   - `<footer>` per footer
   - `aria-label` per accessibility

2. **Struttura Sezione Standard**:
```html
<section class="nome-sezione">
    <div class="container">
        <div class="azulejo-divider"></div>
        <h2 data-it="Titolo IT" data-pt="Titulo PT">Titolo IT</h2>
        <!-- Contenuto -->
    </div>
</section>
```

3. **Immagini**:
   - SEMPRE usa `loading="lazy"` per immagini sotto fold
   - SEMPRE usa `alt` descrittivo
   - Preferisci `w=1920&q=80` per Unsplash

### CSS

1. **Mobile-First**:
```css
/* Base (mobile) */
.element { padding: 20px; }

/* Tablet e desktop */
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

2. **Naming Convention**:
   - BEM-style: `.block`, `.block__element`, `.block--modifier`
   - Esempio: `.evento-card`, `.evento-card__title`, `.link-card--active`

3. **Ordine Proprietà CSS**:
```css
.example {
    /* Layout */
    display: flex;
    position: relative;

    /* Box Model */
    width: 100%;
    padding: 20px;
    margin: 0 auto;

    /* Visual */
    background: white;
    border: 1px solid;

    /* Typography */
    font-family: var(--font-sans);
    color: var(--dark);

    /* Effects */
    transition: all 0.3s ease;
    transform: translateY(0);
}
```

4. **Responsive Grid**:
```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
    gap: 30px;
}
```

### JavaScript

1. **ES6+ Features**:
   - Arrow functions: `() => {}`
   - Template literals: `` `Testo ${var}` ``
   - Const/let (mai var)
   - Array methods: `.forEach()`, `.map()`, etc.

2. **Event Listeners**:
```javascript
// Corretto
element.addEventListener('click', function() { ... });

// Evita
element.onclick = function() { ... };
```

3. **DOM Selection**:
```javascript
// ID univoci
const form = document.getElementById('rsvp-form');

// Classi/selettori
const cards = document.querySelectorAll('.evento-card');
```

4. **Async/Await per API**:
```javascript
async function submitForm() {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        // ...
    } catch (error) {
        // Gestisci errore
    }
}
```

---

## 🎯 Pattern Comuni

### Aggiungere una Nuova Sezione

1. **HTML**:
```html
<section class="nuova-sezione">
    <div class="container">
        <div class="azulejo-divider"></div>
        <h2 data-it="Titolo IT" data-pt="Título PT">Titolo IT</h2>
        <div class="sezione-content">
            <!-- Contenuto qui -->
        </div>
    </div>
</section>
```

2. **CSS**:
```css
.nuova-sezione {
    padding: 100px 0;
    background: var(--white);
}

.sezione-content {
    max-width: 800px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .nuova-sezione {
        padding: 70px 0;
    }
}
```

### Aggiungere Card

```html
<div class="evento-card">
    <h3 data-it="Titolo" data-pt="Título">Titolo</h3>
    <p class="time">15:00</p>
    <p data-it="Descrizione IT" data-pt="Descrição PT">Descrizione IT</p>
</div>
```

```css
.evento-card {
    background: var(--white);
    padding: 45px;
    border-radius: 25px;
    box-shadow: 0 12px 35px rgba(0,0,0,0.12);
    transition: all 0.3s ease;
}

.evento-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 18px 45px rgba(0,0,0,0.18);
}
```

### Aggiungere Immagini

**Da Unsplash**:
```html
<img src="https://images.unsplash.com/photo-XXXXX?w=1920&q=80"
     alt="Descrizione immagine"
     loading="lazy">
```

**Locali** (crea cartella `images/`):
```html
<img src="images/foto.jpg" alt="Descrizione" loading="lazy">
```

### Pattern Gradient Background

```css
.section {
    background:
        radial-gradient(circle at 20% 80%, rgba(255, 140, 66, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(124, 185, 232, 0.15) 0%, transparent 50%),
        linear-gradient(135deg, var(--cream) 0%, var(--white) 100%);
}
```

---

## 🔄 Workflow di Sviluppo

### Setup Locale

```bash
# 1. Clone repository
git clone <repo-url>
cd sito-MATRIMONIO

# 2. Avvia server locale
# Opzione A: Python
python -m http.server 8000

# Opzione B: Node.js
npx http-server

# 3. Apri browser
http://localhost:8000
```

### Modifiche Comuni

#### 1. Cambiare Testi

**Trova elemento in HTML**:
```html
<h2 data-it="Vecchio Testo" data-pt="Texto Antigo">Vecchio Testo</h2>
```

**Modifica ENTRAMBE le lingue**:
```html
<h2 data-it="Nuovo Testo" data-pt="Novo Texto">Nuovo Testo</h2>
```

#### 2. Modificare Colori

**Non fare**:
```css
.element { color: #2E5C8A; } /* ❌ Hardcoded */
```

**Fai**:
```css
.element { color: var(--azul-primary); } /* ✅ Usa variabili */
```

Per cambiare schema colori, modifica SOLO `:root` in `style.css` righe 1-19.

#### 3. Aggiungere Foto alla Galleria

**In `storia.html`** (o altra pagina):
```html
<div class="gallery-grid">
    <!-- Esistenti -->
    <div class="gallery-item">
        <img src="images/nuova-foto.jpg" alt="Descrizione" loading="lazy">
    </div>
</div>
```

#### 4. Modificare Programma

**In `programma.html`**, trova la timeline:
```html
<div class="timeline-item">
    <div class="timeline-time">15:00</div>
    <div class="timeline-content">
        <h3 data-it="Cerimonia" data-pt="Cerimónia">Cerimonia</h3>
        <p data-it="Descrizione" data-pt="Descrição">Descrizione</p>
    </div>
</div>
```

#### 5. Cambiare Email RSVP

1. Vai su [web3forms.com](https://web3forms.com)
2. Inserisci nuova email
3. Ottieni Access Key
4. Apri `index.html` riga 137
5. Sostituisci: `<input type="hidden" name="access_key" value="NUOVA-KEY">`

### Testing

**Pre-Deploy Checklist**:
- [ ] Testa su Chrome, Firefox, Safari
- [ ] Testa responsive (mobile, tablet, desktop)
- [ ] Verifica tutte le immagini caricano (apri test.html)
- [ ] Testa form RSVP (invia test email)
- [ ] Testa cambio lingua IT/PT
- [ ] Verifica countdown funziona
- [ ] Controlla console per errori (F12)
- [ ] Valida HTML ([validator.w3.org](https://validator.w3.org))

### Deployment

**GitHub Pages**:
```bash
# 1. Commit modifiche
git add .
git commit -m "Descrizione modifiche"
git push origin main

# 2. Vai su GitHub Settings > Pages
# 3. Source: main branch
# 4. Save

# Sito disponibile su: https://piericfil.github.io/sito-MATRIMONIO/
```

**Netlify**:
1. Connetti repository GitHub
2. Deploy automatico ad ogni push
3. Dominio custom opzionale

---

## 🤖 Guida per AI Assistant

### Quando Modifichi il Codice

1. **SEMPRE leggi file esistenti prima** di modificare
2. **Mantieni lo stile consistente** con il codice esistente
3. **Usa variabili CSS esistenti**, non creare nuove senza motivo
4. **Aggiungi SEMPRE traduzioni IT e PT** per nuovo testo
5. **Testa responsive** - aggiungi media query se necessario
6. **Non rompere funzionalità esistenti** - testa tutto

### Pattern di Modifica

```javascript
// ❌ NON FARE - Stile inconsistente
document.getElementById('myButton').onclick = () => {
    alert("Ciao");
}

// ✅ FARE - Segui convenzioni esistenti
const myButton = document.getElementById('myButton');
myButton.addEventListener('click', function() {
    console.log('Button clicked');
});
```

### Gestione Immagini

**Prima di aggiungere immagini**:
1. Controlla dimensione (ottimizza se > 500KB)
2. Usa formati moderni (WebP se supportato, altrimenti JPG/PNG)
3. Aggiungi `loading="lazy"` se sotto fold
4. Testa che caricano con `test.html`

### Debugging

**File di debug**: `test.html`, `DEBUG.md`

**Console Log Automatico**:
Ogni pagina ha monitoring immagini in console. Apri DevTools (F12) per vedere:
- ✅ Immagini caricate
- ❌ Immagini con errore
- 📊 Statistiche

### Best Practices AI

1. **Leggibilità**:
   - Codice chiaro > codice "furbo"
   - Commenta codice complesso
   - Usa nomi variabili descrittivi

2. **Performance**:
   - Lazy load immagini
   - Minimizza ridisegni DOM
   - Usa CSS transitions invece di JS quando possibile

3. **Accessibility**:
   - Alt text su immagini
   - ARIA labels dove necessario
   - Contrast ratio adeguato
   - Navigazione keyboard-friendly

4. **SEO**:
   - Meta tags in `<head>`
   - Semantic HTML
   - Heading hierarchy corretta (H1 > H2 > H3)

---

## 🐛 Troubleshooting Comune

### Immagini Non Caricano

**Diagnosi**:
1. Apri `test.html` per vedere quali immagini falliscono
2. Controlla console browser (F12)
3. Verifica URL direttamente nel browser

**Cause Comuni**:
- **404**: URL non valido → Trova immagine alternativa
- **CORS**: Server blocca richieste → Scarica e servi localmente
- **Timeout**: Troppo lento → Usa CDN diverso
- **AdBlocker**: Estensione blocca → Disabilita temporaneamente

### Form RSVP Non Funziona

**Check**:
1. Access Key corretta in `index.html` riga 137?
2. Connessione internet attiva?
3. Console mostra errori?
4. Email spam/promozioni?

**Fix**:
- Genera nuova Access Key su web3forms.com
- Verifica formato email destinataria
- Testa con email diversa

### Countdown Mostra Valori Sbagliati

**Verifica**:
1. Data in `script.js` riga 5: `September 26, 2026 15:00:00`
2. Timezone browser
3. Formato data corretto

### Layout Rotto su Mobile

**Debug**:
1. Apri DevTools (F12) > Toggle Device Toolbar
2. Testa viewport 320px, 375px, 768px, 1024px
3. Cerca elementi che causano scroll orizzontale
4. Verifica media queries in `style.css`

**Fix Comune**:
```css
/* Previeni overflow */
* { max-width: 100%; }
img { width: 100%; height: auto; }
```

### Navbar Non Appare

**Check**:
```javascript
// script.js - verifica scroll threshold
if (scrollTop > 300) {  // Cambia se necessario
    navbar.classList.add('visible');
}
```

### Lingua Non Cambia

**Verifica**:
1. Elementi hanno `data-it` e `data-pt`?
2. JavaScript caricato correttamente?
3. Console mostra errori?

---

## 📊 File Critici - NON Modificare Senza Attenzione

### style.css
- **Righe 1-19**: Variabili CSS (colori, font) - modifica con cautela
- **Righe 95-145**: Navbar - importante per UX
- **Righe 275-355**: Countdown - design delicato
- **Righe 887-1093**: Form RSVP - funzionalità critica
- **Righe 1886-2138**: Hero carousel - complesso

### script.js
- **Righe 5-34**: Countdown logic - non toccare data/calcoli
- **Righe 68-87**: Cambio lingua - core feature
- **Righe 97-251**: Hero carousel - logica complessa
- **Righe 397-454**: Form submit - integrazione API

### index.html
- **Riga 137**: Web3Forms Access Key - critical
- **Righe 45-98**: Hero carousel HTML - struttura importante
- **Righe 134-194**: Form RSVP - integrazione Web3Forms

---

## 🎓 Risorse Utili

### Documentazione
- **README.md**: Guida utente completa
- **DEBUG.md**: Debug immagini e testing
- **CATA LORI WEDDING.pdf**: Mood board originale

### Servizi Esterni
- [Web3Forms Docs](https://docs.web3forms.com/)
- [Unsplash API](https://unsplash.com/developers)
- [Google Fonts](https://fonts.google.com/)
- [Can I Use](https://caniuse.com/) - Browser compatibility

### Tool Consigliati
- **Browser DevTools** (F12): Debug, console, network
- **Lighthouse**: Performance, accessibility audit
- **W3C Validator**: Validazione HTML
- **TinyPNG**: Ottimizzazione immagini
- **Color Contrast Checker**: Accessibility

---

## 📝 Checklist Modifiche

Prima di committare codice, verifica:

- [ ] Codice funziona in locale
- [ ] Nessun errore in console
- [ ] Responsive testato (320px, 768px, 1024px+)
- [ ] Traduzioni IT/PT complete
- [ ] Variabili CSS usate (no hardcoded colors)
- [ ] Immagini ottimizzate e con alt text
- [ ] Commenti aggiunti per codice complesso
- [ ] Naming convention seguita
- [ ] Performance accettabile (< 3s load)
- [ ] Cross-browser testato (Chrome, Firefox, Safari)

---

## 🚀 Prossimi Step Suggeriti (Opzionali)

### Miglioramenti Futuri
1. **PWA**: Rendere installabile come app
2. **Lazy loading avanzato**: Intersection Observer per immagini
3. **Galleria modale**: Lightbox per ingrandire foto
4. **Mappa interattiva**: Google Maps per località
5. **Countdown animato**: Flip animation per numeri
6. **Guest list manager**: Backend per gestire RSVP
7. **QR Code**: Per condivisione rapida
8. **Print stylesheet**: Versione stampabile
9. **Dark mode**: Tema scuro opzionale
10. **Analytics**: Google Analytics per tracking visite

### Ottimizzazioni Performance
- Convertire immagini in WebP
- Implementare service worker per caching
- Minificare CSS/JS per produzione
- Usare CDN per assets
- Implement critical CSS inline

---

## 📞 Supporto

Per domande o problemi:
1. Consulta README.md e DEBUG.md
2. Controlla console browser per errori
3. Verifica questa guida CLAUDE.md
4. Testa su browser diversi
5. Controlla network tab per API failures

---

**Ultima Modifica**: Novembre 2024
**Versione Sito**: 3.0 (Admin Mode + Advanced Features)
**Compatibilità Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
**Responsive**: ✅ Mobile, Tablet, Desktop
**Accessibility**: WCAG 2.1 AA (target)
**Cross-Page Consistency**: ✅ 100% - Perfetta armonia

---

## 🎉 Note Finali per AI Assistant

Questo è un progetto **con significato emotivo** per una coppia. Trattalo con cura:

- ✅ **Mantieni l'eleganza** del design esistente
- ✅ **Rispetta la palette** terracotta/azul/gold
- ✅ **Testa tutto** prima di confermare modifiche
- ✅ **Sii conservativo** con modifiche strutturali
- ✅ **Documenta** cambiamenti significativi
- ❌ **Non rimuovere** funzionalità esistenti senza conferma
- ❌ **Non cambiare** la data del matrimonio senza autorizzazione
- ❌ **Non modificare** l'Access Key Web3Forms casualmente

**Ricorda**: Ogni linea di codice contribuisce al giorno più importante di Catarina & Lorenzo. Codifica con amore! 💕

---

_Con amore da Portogallo e Italia_ 🇵🇹 🇮🇹

---

## ?? AUTOMAZIONE & GIT

### Comando Rapido: /salva
Per garantire la massima sicurezza, usa sempre il comando:
/salva

**Cosa fa questo comando:**
1. Controlla le modifiche (git status)
2. Prepara i file (git add)
3. Salva un checkpoint (git commit)
4. Invia tutto online (git push)

**URL Repository:**
(DA AGGIUNGERE: Incolla qui l'URL del repository GitHub)
