# 🔍 Guida Debug - Test Caricamento Immagini

## Come Vedere la Console del Browser

### Chrome / Edge / Brave
1. Premi `F12` oppure `Ctrl+Shift+I` (Windows/Linux) o `Cmd+Option+I` (Mac)
2. Clicca sulla tab **Console**
3. Vedrai tutti i messaggi di log, errori e avvisi

### Firefox
1. Premi `F12` oppure `Ctrl+Shift+K` (Windows/Linux) o `Cmd+Option+K` (Mac)
2. Clicca sulla tab **Console**

### Safari
1. Vai su Safari → Preferenze → Avanzate
2. Abilita "Mostra menu Sviluppo nella barra dei menu"
3. Premi `Cmd+Option+C` per aprire la console

## 📋 Strumenti di Test Disponibili

### 1. Pagina di Test Completa: `test.html`

Apri nel browser: `http://localhost/test.html` (o il tuo server)

**Cosa fa:**
- Testa **TUTTE** le immagini del sito (27 immagini totali)
- Mostra statistiche in tempo reale
- Visualizza quali immagini si caricano e quali danno errore
- Mostra preview delle immagini che funzionano
- Include una console log integrata
- Mostra il tempo di caricamento e timeout dopo 10 secondi

**Funzionalità:**
- ✅ **Verde** = Immagine caricata correttamente
- ❌ **Rosso** = Errore di caricamento
- ⏱️ **Arancione** = Timeout (troppo lento)

### 2. Console Log Automatica

Ogni pagina del sito (index.html, localita.html, storia.html, programma.html) ha un monitor automatico delle immagini.

**Come vedere:**
1. Apri una pagina del sito
2. Apri la console del browser (F12)
3. Vedrai automaticamente:
   - Numero totale di immagini
   - Quali si caricano con successo (✅)
   - Quali danno errore (❌)
   - Statistiche finali dopo 3 secondi

## 🐛 Possibili Cause di Errori

### 1. CORS (Cross-Origin Resource Sharing)
**Sintomo:** Immagine non si carica, errore CORS nella console

**Soluzione:**
- Alcune API di immagini bloccano richieste da certi domini
- Prova ad aprire l'URL dell'immagine direttamente nel browser
- Se si apre, il problema è CORS
- Soluzione: usa un proxy o scarica l'immagine e servila localmente

### 2. URL Non Valido
**Sintomo:** 404 Not Found

**Soluzione:**
- L'immagine è stata rimossa o l'URL è cambiato
- Controlla l'URL nella pagina test.html
- Cerca un'immagine alternativa

### 3. Timeout / Connessione Lenta
**Sintomo:** Timeout dopo 10 secondi

**Soluzione:**
- Server delle immagini troppo lento
- Connessione internet lenta
- Prova a ricaricare la pagina
- Considera di scaricare le immagini e servirle localmente

### 4. Blocco AdBlocker
**Sintomo:** Alcune immagini non si caricano ma l'URL è valido

**Soluzione:**
- Disabilita temporaneamente l'adblocker
- Alcuni adblocker bloccano CDN di immagini

## 📊 Elenco Completo Immagini

### Index.html (6 immagini)
1. Hero Carousel (5 foto da Unsplash)
2. Azulejos footer (1 foto da Pexels)

### Localita.html (6 immagini)
1. Location Carousel (5 foto da Unsplash)
2. Azulejos footer (1 foto da Pexels)

### Storia.html (7 immagini)
1. Gallery (6 foto: 4 Unsplash + 2 Wikipedia Commons)
2. Azulejos footer (1 foto da Pexels)

### Programma.html (7 immagini)
1. Timeline (6 foto da Unsplash)
2. Azulejos footer (1 foto da Pexels)

**TOTALE: 26 immagini**

## 🔧 Come Usare il Test

### Test Rapido
```bash
# 1. Apri test.html nel browser
# 2. Guarda le statistiche in alto
# 3. Scorri per vedere quali immagini danno errore
```

### Test Dettagliato con Console
```bash
# 1. Apri index.html
# 2. Apri la console (F12)
# 3. Leggi i messaggi automatici
# 4. Cerca gli errori in rosso ❌
```

### Risoluzione Problemi
```bash
# Per ogni immagine con errore:
# 1. Copia l'URL dalla console o da test.html
# 2. Aprilo direttamente nel browser
# 3. Se non si apre → URL non valido (cambialo)
# 4. Se si apre → problema CORS o timeout (considera alternativa)
```

## 💡 Suggerimenti

1. **Usa test.html** come prima cosa per avere una panoramica completa
2. **Controlla la console** di ogni pagina per dettagli specifici
3. **Testa su browser diversi** (a volte il problema è specifico del browser)
4. **Disabilita estensioni** temporaneamente per escludere interferenze
5. **Controlla la connessione internet** se vedi molti timeout

## 🚀 Prossimi Passi

Se trovi immagini con errori:
1. Annota quali URL danno problemi (dalla pagina test.html)
2. Cerca immagini alternative sugli stessi servizi
3. Aggiorna gli URL nei file HTML
4. Ricarica test.html per verificare
