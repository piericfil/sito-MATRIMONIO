// Lingua corrente
let currentLang = 'it';

// Data del matrimonio
const weddingDate = new Date('September 26, 2026 15:00:00').getTime();

// Countdown
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    if (distance < 0) {
        document.querySelector('.countdown').innerHTML = '<p>È il nostro giorno speciale! 🎉</p>';
    }
}

// Aggiorna il countdown ogni secondo
setInterval(updateCountdown, 1000);
updateCountdown();

// Navbar scroll
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 300) {
        navbar.classList.add('visible');
    } else {
        navbar.classList.remove('visible');
    }

    lastScrollTop = scrollTop;
});

// Smooth scroll per i link di navigazione
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Funzione cambio lingua
function changeLanguage(lang) {
    currentLang = lang;

    // Aggiorna i bottoni attivi
    document.getElementById('lang-it').classList.toggle('active', lang === 'it');
    document.getElementById('lang-pt').classList.toggle('active', lang === 'pt');

    // Aggiorna tutti gli elementi con traduzione
    document.querySelectorAll('[data-it][data-pt]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
}

// Form RSVP
const rsvpForm = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');

rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Raccogli i dati del form
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        ospiti: document.getElementById('ospiti').value,
        cerimonia: document.querySelector('input[name="cerimonia"]').checked,
        ricevimento: document.querySelector('input[name="ricevimento"]').checked,
        intolleranze: document.getElementById('intolleranze').value,
        messaggio: document.getElementById('messaggio').value
    };

    // Crea il messaggio email
    const emailBody = `
Nome: ${formData.nome}
Email: ${formData.email}
Telefono: ${formData.telefono}
Numero di ospiti: ${formData.ospiti}

Parteciperà a:
- Cerimonia: ${formData.cerimonia ? 'Sì' : 'No'}
- Ricevimento: ${formData.ricevimento ? 'Sì' : 'No'}

Allergie/Intolleranze: ${formData.intolleranze || 'Nessuna'}

Messaggio: ${formData.messaggio || 'Nessun messaggio'}
    `.trim();

    // Usando FormSubmit (servizio gratuito)
    try {
        const response = await fetch('https://formsubmit.co/ajax/cata.lorenzo.wedding@email.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: formData.nome,
                email: formData.email,
                message: emailBody,
                _subject: `RSVP Matrimonio - ${formData.nome}`,
                _template: 'table'
            })
        });

        if (response.ok) {
            formMessage.className = 'form-message success';
            formMessage.textContent = currentLang === 'it'
                ? 'Grazie! La tua conferma è stata inviata con successo. Ci vediamo il 26 settembre! 💕'
                : 'Obrigado! A tua confirmação foi enviada com sucesso. Vemo-nos a 26 de setembro! 💕';
            rsvpForm.reset();

            // Nascondi il messaggio dopo 5 secondi
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        } else {
            throw new Error('Errore nell\'invio');
        }
    } catch (error) {
        // Fallback: apri client email
        const subject = encodeURIComponent(`RSVP Matrimonio - ${formData.nome}`);
        const body = encodeURIComponent(emailBody);
        const mailtoLink = `mailto:cata.lorenzo.wedding@email.com?subject=${subject}&body=${body}`;

        // Mostra messaggio
        formMessage.className = 'form-message success';
        formMessage.innerHTML = currentLang === 'it'
            ? `Stiamo aprendo il tuo client email. Se non si apre automaticamente, <a href="${mailtoLink}" style="color: white; text-decoration: underline;">clicca qui</a>.`
            : `Estamos a abrir o teu cliente de email. Se não abrir automaticamente, <a href="${mailtoLink}" style="color: white; text-decoration: underline;">clica aqui</a>.`;

        // Apri mailto
        window.location.href = mailtoLink;
    }
});

// Animazioni al scroll (fade in)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Applica animazioni a elementi selezionati
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.storia-chapter, .evento-card, .timeline-item, .gallery-item, .logistica-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Easter egg: animazione petali che cadono (opzionale)
function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: linear-gradient(45deg, #E8A87C, #D97642);
        border-radius: 50% 0;
        top: -10px;
        left: ${Math.random() * 100}vw;
        animation: fall ${5 + Math.random() * 5}s linear;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.7;
    `;

    document.body.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 10000);
}

// Aggiungi stile per l'animazione dei petali
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Attiva petali sulla homepage (ogni 3 secondi)
let petalInterval;
function togglePetals(enable) {
    if (enable) {
        petalInterval = setInterval(createPetal, 3000);
    } else {
        clearInterval(petalInterval);
    }
}

// Attiva petali solo quando si è sulla hero section
const heroSection = document.querySelector('.hero');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        togglePetals(entry.isIntersecting);
    });
}, { threshold: 0.5 });

heroObserver.observe(heroSection);

// Funzione per aggiungere immagini alla galleria (da usare in futuro)
function addImageToGallery(imagePath, caption) {
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
        <img src="${imagePath}" alt="${caption}" style="width: 100%; height: 100%; object-fit: cover;">
    `;
    galleryGrid.appendChild(galleryItem);
}

// Console message
console.log('💕 Cata & Lorenzo - 26 Settembre 2026 💕');
console.log('Sito creato con amore per celebrare il nostro giorno speciale');
