# 💕 Cata & Lorenzo - Sito Matrimonio

Sito web personalizzato per il matrimonio del 26 settembre 2026, che unisce l'eleganza italiana con il calore portoghese.

## ✨ Caratteristiche

- **Design elegante** ispirato agli azulejos portoghesi
- **Palette colori** terracotta, blu e oro dal mood board
- **Countdown** in tempo reale al matrimonio
- **Bilingue** Italiano/Portoghese
- **Responsive** per mobile e desktop
- **Form RSVP** con invio email
- **Sezioni complete**: Storia, Evento, Logistica, Programma, Galleria, Lista Regali
- **Animazioni smooth** e pattern decorativi

## 🚀 Come Usare

### Visualizzare in locale

1. Apri il file `index.html` direttamente nel browser
2. Oppure usa un server locale:
   ```bash
   # Con Python 3
   python -m http.server 8000

   # Con Node.js (se hai npx installato)
   npx http-server
   ```
3. Vai su `http://localhost:8000`

### Deploy GRATUITO su GitHub Pages

1. **Crea una repository** su GitHub (già fatto!)

2. **Push del codice** (già fatto!)

3. **Attiva GitHub Pages:**
   - Vai su Settings > Pages nella tua repository
   - Sotto "Source", seleziona il branch `main` (o quello con il codice)
   - Clicca "Save"
   - Il sito sarà disponibile su: `https://piericfil.github.io/sito-MATRIMONIO/`

### Deploy su Netlify (alternativa gratuita)

1. Vai su [netlify.com](https://netlify.com)
2. Clicca "Add new site" > "Import an existing project"
3. Connetti il tuo account GitHub
4. Seleziona la repository `sito-MATRIMONIO`
5. Clicca "Deploy site"
6. Il sito sarà live in pochi secondi con un URL tipo `nome-random.netlify.app`
7. Puoi cambiare il dominio nelle impostazioni

## 📝 Personalizzazione

### Modificare l'email per RSVP

Nel file `script.js`, cambia:
```javascript
// Linea ~90
'https://formsubmit.co/ajax/cata.lorenzo.wedding@email.com'
```

E alla linea ~120:
```javascript
const mailtoLink = `mailto:cata.lorenzo.wedding@email.com?subject=${subject}&body=${body}`;
```

**Importante**: Sostituisci `cata.lorenzo.wedding@email.com` con la tua email reale!

### Aggiungere foto alla galleria

1. **Crea una cartella `images`** nella root del progetto
2. **Aggiungi le tue foto** nella cartella
3. **Modifica `index.html`** nella sezione galleria (cerca `<!-- Galleria -->`):

Sostituisci i placeholder con:
```html
<div class="gallery-item">
    <img src="images/foto1.jpg" alt="Descrizione" style="width: 100%; height: 100%; object-fit: cover;">
</div>
```

### Modificare i colori

Nel file `style.css`, cambia le variabili all'inizio:
```css
:root {
    --azul-primary: #2E5C8A;      /* Blu principale */
    --terracotta: #D97642;         /* Terracotta */
    --gold: #F4A460;               /* Oro */
    /* ecc... */
}
```

### Modificare i testi

Tutti i testi sono nel file `index.html` con gli attributi:
- `data-it="..."` per italiano
- `data-pt="..."` per portoghese

Esempio:
```html
<h2 data-it="La Nostra Storia" data-pt="Nossa História">La Nostra Storia</h2>
```

### Aggiornare informazioni evento

Modifica la sezione "L'Evento" in `index.html` con i dettagli esatti del luogo del ricevimento quando li avrai.

## 🎨 Struttura File

```
sito-MATRIMONIO/
├── index.html          # Pagina principale
├── style.css           # Stili e design
├── script.js           # Funzionalità (countdown, form, lingua)
├── README.md           # Questo file
└── CATA LORI WEDDING.pdf  # Mood board di riferimento
```

## 📱 Funzionalità

### Countdown
Mostra giorni, ore, minuti e secondi fino al 26 settembre 2026 ore 15:00.

### Cambio Lingua
Bottoni IT/PT in alto a destra per cambiare tra italiano e portoghese.

### Form RSVP
- Raccoglie: nome, email, telefono, numero ospiti, preferenze
- Invia email automaticamente (via FormSubmit)
- Fallback: apre client email se il servizio non funziona

### Navigazione
- Menu che appare scrollando
- Smooth scroll alle sezioni
- Responsive per mobile

### Effetti Speciali
- Pattern azulejos decorativi
- Animazioni fade-in al scroll
- Petali che cadono sulla homepage
- Hover effects su card e immagini

## 🔧 Troubleshooting

### Il form RSVP non funziona
1. Verifica che l'email in `script.js` sia corretta
2. Se usi FormSubmit per la prima volta, devi confermare l'email (riceverai un'email di attivazione)
3. Se non funziona, il form aprirà automaticamente il client email

### Le immagini non si vedono
1. Controlla che il percorso sia corretto (es. `images/foto.jpg`)
2. Verifica che i nomi file non abbiano spazi o caratteri speciali
3. Usa formati comuni: JPG, PNG, WEBP

### Il sito non si vede su mobile
1. Il sito è responsive, ma testa su dispositivi reali
2. Verifica che tutti i file CSS e JS siano caricati
3. Controlla la console del browser per errori (F12)

## 💡 Suggerimenti

1. **Testa su più browser**: Chrome, Firefox, Safari
2. **Ottimizza le immagini**: usa strumenti come TinyPNG per ridurre la dimensione
3. **Backup regolari**: fai commit su GitHub frequentemente
4. **Condividi il link**: una volta deployato, condividi l'URL con gli invitati
5. **Monitora le RSVP**: controlla regolarmente l'email per le conferme

## 🌟 Credits

Progettato con amore per Cata & Lorenzo
- Design ispirato agli azulejos portoghesi
- Colori dal mood board originale
- Font: Cormorant Garamond & Montserrat (Google Fonts)

## 📞 Supporto

Per modifiche o domande sul sito, consulta la documentazione o contatta il creatore.

---

**Buon matrimonio! 🎉💕**

*Porto + Italia = Amore*
