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

### Form RSVP con Web3Forms

Il sito usa **Web3Forms** - un servizio gratuito e illimitato per inviare email.

**Il form è GIÀ CONFIGURATO** e funziona out-of-the-box! Le conferme arriveranno all'email che hai configurato.

#### Come funziona:
1. Gli ospiti compilano il form sul sito
2. Le conferme arrivano direttamente via email
3. **ZERO limiti** - gratuito per sempre

#### Cambiare l'email destinataria:
Se vuoi cambiare l'email dove ricevere le conferme:

1. Vai su [web3forms.com](https://web3forms.com)
2. Inserisci la NUOVA email dove vuoi ricevere le conferme
3. Inserisci: `piericfil.github.io/sito-MATRIMONIO` come dominio
4. Copia la nuova **Access Key** che ti viene data
5. Apri `index.html` e cerca `access_key` (circa riga 137)
6. Sostituisci il valore con la nuova chiave

#### Vedere le conferme:
- Le email arrivano direttamente nella tua casella di posta
- Ogni conferma include tutti i dettagli: nomi, telefono, allergie, messaggio
- Puoi crearle una cartella dedicata per organizzarle

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
- Raccoglie: nomi ospiti, telefono, partecipazione, allergie, messaggio
- Gratuito e illimitato via Web3Forms
- Le email arrivano direttamente nella tua casella di posta

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
1. Controlla la connessione internet - Web3Forms richiede connessione attiva
2. Verifica che l'Access Key in `index.html` (riga ~137) sia corretta
3. Prova a inviare un test - dovresti ricevere un'email entro 1-2 minuti
4. Controlla lo spam se non vedi l'email
5. Se ancora non funziona, vai su [web3forms.com](https://web3forms.com) e genera una nuova Access Key

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
