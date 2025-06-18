document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionalities
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        delay: 100,
    });

    initLoadingScreen();
    initTheme();
    initNavigation();
    initCustomCursor();
    initTypewriter();
    initSkillBars();
    initCounters();
    initProjectFilter();
    initContactForm();
    initBackToTopButton();
    updateCopyrightYear();
});

// Utility: Throttle function to limit how often a function can be called.
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// --- Initializer Functions ---

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading');
    window.addEventListener('load', () => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    });
}

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    const handleScroll = () => {
        const navHeight = navbar.offsetHeight;
        // Navbar scroll effect
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - navHeight - 50) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', throttle(handleScroll, 100));

    // Mobile menu toggle
    hamburger.addEventListener('click', e => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scroll and close menu on link click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const navHeight = navbar.offsetHeight;
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                const targetPosition = document.querySelector(targetId).offsetTop - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

function initCustomCursor() {
    if ('ontouchstart' in window) {
        document.body.style.cursor = 'auto';
        return;
    }
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animate = () => {
        cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
        followerX += (mouseX - followerX - 20) * 0.1;
        followerY += (mouseY - followerY - 20) * 0.1;
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
        requestAnimationFrame(animate);
    };
    animate();

    document.querySelectorAll('a, button, [data-aos]').forEach(el => {
        el.addEventListener('mouseenter', () => follower.style.transform = `translate(${followerX}px, ${followerY}px) scale(2.5)`);
        el.addEventListener('mouseleave', () => follower.style.transform = `translate(${followerX}px, ${followerY}px) scale(1)`);
    });
}

function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const roles = ['Desenvolvedor Full Stack', 'Criador de Experiências', 'Engenheiro de Software', 'Apaixonado por Código'];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    const type = () => {
        const currentRole = roles[roleIndex];
        const currentText = isDeleting ? currentRole.substring(0, charIndex - 1) : currentRole.substring(0, charIndex + 1);
        el.textContent = currentText;

        charIndex += isDeleting ? -1 : 1;
        let typeSpeed = isDeleting ? 50 : 120;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    };
    setTimeout(type, 1500);
}

const createObserver = (handler, threshold) => new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            handler(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold });

function initSkillBars() {
    const observer = createObserver(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
    }, 0.8);
    document.querySelectorAll('.skill-progress').forEach(bar => observer.observe(bar));
}

function initCounters() {
    const observer = createObserver(counter => {
        const target = +counter.getAttribute('data-target');
        let current = 0;
        const increment = target / 100;
        const update = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(update, 20);
            } else {
                counter.textContent = target;
            }
        };
        update();
    }, 0.8);
    document.querySelectorAll('.stat-number').forEach(counter => observer.observe(counter));
}

function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.projects-filter .filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;

            projectCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const matches = (filter === 'all' || cardCategory === filter);
                card.classList.toggle('hide', !matches);
            });
        });
    });
}

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        // Placeholder for form submission logic
        showNotification('Mensagem enviada com sucesso!', 'success');
        form.reset();
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    Object.assign(notification.style, {
        position: 'fixed', bottom: '20px', right: '20px', padding: '1rem 2rem',
        borderRadius: '8px', color: '#fff', zIndex: '10001',
        backgroundColor: type === 'success' ? 'var(--color-primary)' : '#f16363',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)', transform: 'translateY(100px)',
        opacity: '0', transition: 'all 0.4s ease'
    });
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 400);
    }, 4000);
}

function initBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    const handleScroll = () => {
        if (window.scrollY > 400) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', throttle(handleScroll, 200));
}

function updateCopyrightYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}