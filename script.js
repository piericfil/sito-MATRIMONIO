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

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;

    if (distance < 0 && daysEl) {
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

    // Salva preferenza
    localStorage.setItem('language', lang);
}

// Carica lingua salvata
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        changeLanguage(savedLang);
    }
});

// ===== HERO CAROUSEL BACKGROUND =====
const heroCarouselTrack = document.getElementById('carouselTrack');
const heroCarouselIndicators = document.getElementById('heroCarouselIndicators');

if (heroCarouselTrack) {
    const slides = Array.from(heroCarouselTrack.children);
    const slideCount = slides.length;
    let currentIndex = 0;
    let autoScrollInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    // Crea indicators
    if (heroCarouselIndicators) {
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('hero-carousel-indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            heroCarouselIndicators.appendChild(indicator);
        });
    }

    // Funzione per andare a uno slide specifico
    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex < 0) currentIndex = slideCount - 1;
        if (currentIndex >= slideCount) currentIndex = 0;

        const offset = -currentIndex * 100;
        heroCarouselTrack.style.transform = `translateX(${offset}%)`;

        // Aggiorna indicators
        if (heroCarouselIndicators) {
            const indicators = heroCarouselIndicators.querySelectorAll('.hero-carousel-indicator');
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentIndex);
            });
        }

        // Reset auto-scroll
        resetAutoScroll();
    }

    // Funzione per muovere il carousel
    function moveCarousel(direction) {
        goToSlide(currentIndex + direction);
    }

    // Auto-scroll ogni 6 secondi
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            moveCarousel(1);
        }, 6000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    function resetAutoScroll() {
        stopAutoScroll();
        startAutoScroll();
    }

    // Touch/Swipe gestures per mobile
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoScroll();
        });

        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            resetAutoScroll();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                moveCarousel(1);
            } else {
                // Swipe right - prev
                moveCarousel(-1);
            }
        }
    }

    // Mouse drag per desktop
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    if (heroSection) {
        heroSection.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            heroSection.style.cursor = 'grabbing';
            stopAutoScroll();
        });

        heroSection.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.pageX;
        });

        heroSection.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            heroSection.style.cursor = 'default';

            const diff = startX - currentX;
            const dragThreshold = 50;

            if (Math.abs(diff) > dragThreshold) {
                if (diff > 0) {
                    moveCarousel(1);
                } else {
                    moveCarousel(-1);
                }
            }
            resetAutoScroll();
        });

        heroSection.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                heroSection.style.cursor = 'default';
                resetAutoScroll();
            }
        });

        // Pause on hover
        heroSection.addEventListener('mouseenter', stopAutoScroll);
        heroSection.addEventListener('mouseleave', () => {
            if (!isDragging) startAutoScroll();
        });
    }

    // Avvia auto-scroll
    startAutoScroll();

    // Funzione globale per i bottoni
    window.moveHeroCarousel = function(direction) {
        moveCarousel(direction);
    };
}

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
    const animatedElements = document.querySelectorAll('.storia-chapter, .evento-card, .timeline-item, .gallery-item, .logistica-item, .link-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Console message
console.log('💕 Cata & Lorenzo - 26 Settembre 2026 💕');
console.log('Sito creato con amore per celebrare il nostro giorno speciale');
