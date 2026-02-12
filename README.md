# Catarina & Lorenzo - Sito Matrimonio

Sito web bilingue per il matrimonio del **26 Settembre 2026**.

**Sito Live**: [piericfil.github.io/sito-MATRIMONIO](https://piericfil.github.io/sito-MATRIMONIO/)

---

## Caratteristiche

- **5 pagine**: Home, Località, Programma, Storia, Lista Nozze
- **Bilingue**: Italiano / Portoghese
- **Modalità Admin**: Modifica contenuti senza codice
- **Form RSVP**: Conferma presenza con Web3Forms
- **Responsive**: Mobile, tablet, desktop

---

## Modalità Admin

Permette di modificare testi, immagini, stili e contenuti direttamente dal browser.

### Attivazione
- Clicca **"Admin Mode"** nella navbar
- Oppure premi `Ctrl + Alt + A`
- Clicca **?** per vedere la guida completa

### Funzionalità
- Modifica testi con editor ricco
- Cambia stili (font, colori, dimensioni)
- Carica e gestisci immagini
- Gestisci carousel e timeline
- Salvataggio automatico in localStorage

---

## Quick Start

### Visualizzazione Locale
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```
Apri `http://localhost:8000`

### Deploy
**GitHub Pages**: Settings > Pages > Source: main branch

**Netlify**: Connetti repository, deploy automatico

---

## Configurazione

### Email RSVP
1. Vai su [web3forms.com](https://web3forms.com)
2. Inserisci la tua email
3. Copia Access Key
4. Sostituisci in `index.html` (cerca `access_key`)

### Data Matrimonio
Modifica in `script.js` riga 5:
```javascript
const weddingDate = new Date('September 26, 2026 15:00:00').getTime();
```

---

## Struttura File

```
sito-MATRIMONIO/
├── index.html          # Homepage
├── localita.html       # Località e mappe
├── programma.html      # Timeline giornata
├── storia.html         # Storia coppia
├── lista-nozze.html    # Lista nozze
├── style.css           # Stili
├── script.js           # Funzionalità
├── admin-advanced.js   # Sistema admin
└── CLAUDE.md           # Documentazione tecnica
```

---

## Privacy e Trattamento Dati

### Dati Raccolti
Il form RSVP raccoglie:
- Nome e cognome
- Numero di telefono (opzionale)
- Allergie alimentari
- Preferenze di partecipazione

### Finalità
I dati sono utilizzati **esclusivamente** per:
- Organizzazione del matrimonio
- Gestione posti a sedere
- Preparazione menu (allergie)
- Comunicazioni relative all'evento

### Base Giuridica
Il trattamento si basa sul **consenso esplicito** dell'utente che compila volontariamente il form RSVP.

### Conservazione
- I dati sono inviati via Web3Forms all'email degli sposi
- Non vengono conservati su server esterni
- Saranno eliminati dopo il matrimonio

### Diritti dell'Interessato
Ai sensi del GDPR (Reg. UE 2016/679), puoi richiedere:
- Accesso ai tuoi dati
- Rettifica o cancellazione
- Limitazione del trattamento

Per esercitare i tuoi diritti, contatta gli sposi direttamente.

### Titolare del Trattamento
Catarina & Lorenzo (contatto tramite form o email RSVP)

### Cookie e Tracciamento
- **localStorage**: Solo per preferenze lingua e modifiche admin
- **Nessun cookie di tracciamento**
- **Nessuna analytics** o strumenti di profilazione

---

## Note Legali

### Immagini
Le immagini placeholder provengono da [Unsplash](https://unsplash.com) (licenza gratuita). Sostituire con foto personali prima della pubblicazione.

### Servizi Terzi
- **Web3Forms**: [Privacy Policy](https://web3forms.com/privacy)
- **Google Fonts**: [Privacy Policy](https://policies.google.com/privacy)
- **Google Maps**: [Terms of Service](https://cloud.google.com/maps-platform/terms)

### Responsabilità
Il sito è fornito "così com'è". Gli sviluppatori non sono responsabili per eventuali malfunzionamenti o perdita di dati.

---

## Supporto

- **Documentazione tecnica**: [CLAUDE.md](CLAUDE.md)
- **Problemi**: Controlla la console del browser (F12)

---

## Licenza

Progetto personale. Tutti i diritti riservati.

---

**Ultimo aggiornamento**: Novembre 2024
**Versione**: 3.0
