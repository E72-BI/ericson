/* ========================================
   DOM ELEMENTS
   ======================================== */

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const resultNumbers = document.querySelectorAll('.result-number');
const priceSlider = document.getElementById('priceSlider');
const priceValue = document.getElementById('priceValue');
const teamSlider = document.getElementById('teamSlider');
const teamValue = document.getElementById('teamValue');

/* ========================================
   NAVIGATION
   ======================================== */

// Hamburger Menu Toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-container')) {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
});

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.6s ease forwards';
            
            // Trigger counter animation for result numbers
            if (entry.target.classList.contains('result-card')) {
                const numbers = entry.target.querySelectorAll('.result-number');
                numbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    if (target && !num.dataset.animated) {
                        animateNumber(num, target);
                        num.dataset.animated = 'true';
                    }
                });
            }
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll(
    '.about-card, .tool-card, .scenario-card, .timeline-content, .layer, .result-card'
).forEach(el => observer.observe(el));

/* ========================================
   COUNTER ANIMATION
   ======================================== */

function animateNumber(element, target) {
    const duration = 2000;
    const start = Date.now();
    const startValue = 0;

    function update() {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(startValue + (target - startValue) * easeOutQuad(progress));
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

/* ========================================
   SLIDER INTERACTIONS
   ======================================== */

if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        priceValue.textContent = (value > 0 ? '+' : '') + value + '%';
        
        // Update color based on value
        if (value > 0) {
            priceValue.style.color = '#10b981';
        } else if (value < 0) {
            priceValue.style.color = '#ff6b45';
        } else {
            priceValue.style.color = 'var(--primary)';
        }
    });
}

if (teamSlider) {
    teamSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        teamValue.textContent = (value > 0 ? '+' : '') + value + '%';
        
        // Update color based on value
        if (value > 0) {
            teamValue.style.color = '#10b981';
        } else if (value < 0) {
            teamValue.style.color = '#ff6b45';
        } else {
            teamValue.style.color = 'var(--primary)';
        }
    });
}

/* ========================================
   INTERACTIVE LAYERS
   ======================================== */

const layers = document.querySelectorAll('.layer');
layers.forEach(layer => {
    layer.addEventListener('click', () => {
        layers.forEach(l => l.style.opacity = '0.6');
        layer.style.opacity = '1';
        
        // Add subtle animation
        layer.style.animation = 'none';
        setTimeout(() => {
            layer.style.animation = 'slideIn 0.3s ease';
        }, 10);
    });
});

// Reset layers on page load
window.addEventListener('load', () => {
    layers.forEach(l => l.style.opacity = '1');
});

/* ========================================
   STICKY HEADER EFFECTS
   ======================================== */

const header = document.querySelector('.header');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Add shadow to header on scroll
    if (scrollY > 0) {
        header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScrollY = scrollY;
});

/* ========================================
   CHART BAR ANIMATION
   ======================================== */

const chartBars = document.querySelectorAll('.chart-bar');
const heroSection = document.querySelector('.hero');

if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chartBars.forEach((bar, index) => {
                    const height = bar.style.height;
                    setTimeout(() => {
                        bar.style.animation = `grow 0.8s ease-out`;
                        bar.style.setProperty('--height', height);
                    }, index * 100);
                });
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    heroObserver.observe(heroSection);
}

/* ========================================
   SMOOTH SCROLL FOR MOBILE
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========================================
   PERFORMANCE OPTIMIZATION
   ======================================== */

// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/* ========================================
   LAZY LOADING IMAGE SUPPORT
   ======================================== */

if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ========================================
   ACCESSIBILITY IMPROVEMENTS
   ======================================== */

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
});

/* ========================================
   PAGE LOAD INITIALIZATION
   ======================================== */

window.addEventListener('load', () => {
    // Initialize animations
    document.body.style.opacity = '1';
    
    // Preload critical images
    const logo = document.querySelector('.logo-icon');
    if (logo && logo.src) {
        const img = new Image();
        img.src = logo.src;
    }
});

/* ========================================
   FORM INTERACTIONS (for future CTA buttons)
   ======================================== */

// Handle CTA buttons
const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Add ripple effect
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 400px;
            height: 400px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ========================================
   SERVICE WORKER (Optional PWA Support)
   ======================================== */

if ('serviceWorker' in navigator) {
    // Uncomment to enable PWA
    // navigator.serviceWorker.register('sw.js').catch(() => {});
}

/* ========================================
   CONSOLE MESSAGE
   ======================================== */

console.log('%cE72 Backoffice Analítico', 'font-size: 24px; color: #0f3a7d; font-weight: bold;');
console.log('%cTransformando Operação em Decisão Estratégica', 'font-size: 14px; color: #666; font-style: italic;');
