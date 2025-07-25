// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-progress');

// Mobile Navigation Toggle
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate skill bars when skills section comes into view
            if (entry.target.classList.contains('skills')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe sections for animations
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    observer.observe(section);
});

// Animate skill bars
function animateSkillBars() {
    skillBars.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, index * 100);
    });
}

// Initialize EmailJS
(function() {
    emailjs.init("pBBgQidkHzbNwRkiz");
})();

// Email obfuscation to prevent spam
function initEmailProtection() {
    const emailDisplay = document.getElementById('email-display');
    if (emailDisplay) {
        // Obfuscated email (split and reversed to avoid bot detection)
        const emailParts = ['.com', 'gmail', '@', '96', 'dfmr'];
        const email = emailParts.reverse().join('');
        
        emailDisplay.style.cursor = 'pointer';
        emailDisplay.style.color = 'var(--primary-color)';
        emailDisplay.style.textDecoration = 'underline';
        
        emailDisplay.addEventListener('click', function() {
            this.textContent = email;
            this.style.cursor = 'default';
            this.style.textDecoration = 'none';
            this.style.color = 'var(--text-primary)';
            
            // Make it clickable as mailto link
            this.innerHTML = `<a href="mailto:${email}" style="color: var(--text-primary); text-decoration: none;">${email}</a>`;
        });
    }
}

// Contact form handling with EmailJS
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Prepare form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Send email using EmailJS
    const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message
    };
    
    emailjs.send('service_wqzpfel', 'template_p9nvrpd', templateParams)
        .then((response) => {
            console.log('Email sent successfully:', response.status, response.text);
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        })
        .catch((error) => {
            console.error('Email sending failed:', error);
            showNotification('Failed to send message. Please try again or contact me directly.', 'error');
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

// Typing animation for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        typeWriter(heroSubtitle, text, 80);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        const rate = scrolled * -0.5;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic navbar highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Project card hover effects
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) rotateY(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateY(0)';
    });
});

// Add CSS for animations and notifications
const additionalStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--background-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow-medium);
        z-index: 10000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-message {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: var(--transition);
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
    
    .notification-success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification-error {
        border-left: 4px solid var(--error-color);
    }
    
    .navbar.scrolled {
        background: rgba(15, 23, 42, 0.98);
        box-shadow: var(--shadow-light);
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
            max-width: none;
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Smooth reveal animations for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.project-card, .skill-category, .timeline-item');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-in');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Hero games showcase functionality
function initHeroGamesShowcase() {
    const gameCards = document.querySelectorAll('.game-card');
    const showcase = document.querySelector('.hero-games-showcase');
    
    // Add interactive hover effects
    gameCards.forEach(card => {
        const gameType = card.getAttribute('data-game');
        
        card.addEventListener('click', () => {
            // Navigate to projects section and highlight the specific project
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the corresponding project card after scrolling
                setTimeout(() => {
                    const projectCards = document.querySelectorAll('.project-card');
                    projectCards.forEach(projectCard => {
                        projectCard.classList.remove('highlighted');
                    });
                    
                    // Find and highlight the matching project
                    const matchingProject = document.querySelector(`[data-project="${gameType}"]`);
                    if (matchingProject) {
                        matchingProject.classList.add('highlighted');
                        setTimeout(() => {
                            matchingProject.classList.remove('highlighted');
                        }, 3000);
                    }
                }, 1000);
            }
        });
    });
    
    // Add pause on hover for the entire showcase
    showcase.addEventListener('mouseenter', () => {
        showcase.style.animationPlayState = 'paused';
        gameCards.forEach(card => {
            card.style.animationPlayState = 'paused';
        });
    });
    
    showcase.addEventListener('mouseleave', () => {
        showcase.style.animationPlayState = 'running';
        gameCards.forEach(card => {
            card.style.animationPlayState = 'running';
        });
    });
}

// Initialize reveals on page load
document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    updateActiveNavLink();
    initEmailProtection();
    initHeroGamesShowcase();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
    revealOnScroll();
}, 10)); 