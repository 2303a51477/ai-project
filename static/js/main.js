/* ============================================
   QUANTUMPIX - Main JavaScript File
   Professional Photography Booking Platform
   ============================================ */

// ============================================
// Global Variables
// ============================================
let currentUser = null;
let loadingOverlay = null;

// ============================================
// Document Ready
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('QuantumPix Application Loaded');
    
    // Initialize all components
    initLoadingOverlay();
    initToastNotifications();
    initFormValidation();
    initAnimations();
    initCameraEffects();
    initParticleEffects();
    initSmoothScroll();
    initNavbarEffects();
    
    // Check for flash messages
    checkFlashMessages();
});

// ============================================
// Loading Overlay
// ============================================
function initLoadingOverlay() {
    // Create loading overlay if not exists
    if (!document.querySelector('.loading-overlay')) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="camera-loader"></div>
            <div class="loading-text mt-3">Loading...</div>
        `;
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        `;
        document.body.appendChild(loadingOverlay);
    }
}

function showLoading(message = 'Loading...') {
    if (loadingOverlay) {
        const textElement = loadingOverlay.querySelector('.loading-text');
        if (textElement) textElement.textContent = message;
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// ============================================
// Toast Notifications
// ============================================
function initToastNotifications() {
    // Create toast container
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast-custom toast-${type}`;
    
    let icon = '';
    switch(type) {
        case 'success':
            icon = '✅';
            break;
        case 'error':
            icon = '❌';
            break;
        case 'warning':
            icon = '⚠️';
            break;
        default:
            icon = 'ℹ️';
    }
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <span style="font-size: 1.2rem; margin-right: 10px;">${icon}</span>
            <span>${message}</span>
            <button class="btn-close ms-auto" style="background: none; border: none; font-size: 1.2rem;">&times;</button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add close button functionality
    const closeBtn = toast.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.5s reverse';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function checkFlashMessages() {
    // Check for flash messages from server
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        const type = msg.dataset.type || 'info';
        const message = msg.textContent;
        showToast(message, type);
        msg.remove();
    });
}

// ============================================
// Form Validation
// ============================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showError(input, 'This field is required');
        } else {
            clearError(input);
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                showError(input, 'Please enter a valid email address');
            }
        }
        
        // Password validation
        if (input.type === 'password' && input.value && input.value.length < 6) {
            isValid = false;
            showError(input, 'Password must be at least 6 characters');
        }
    });
    
    return isValid;
}

function showError(input, message) {
    input.classList.add('is-invalid');
    
    let errorDiv = input.parentElement.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearError(input) {
    input.classList.remove('is-invalid');
    const errorDiv = input.parentElement.querySelector('.invalid-feedback');
    if (errorDiv) errorDiv.remove();
}

// ============================================
// Animations
// ============================================
function initAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
        const animation = element.dataset.animate;
        const delay = element.dataset.delay || 0;
        element.style.animation = `${animation} 0.6s ease ${delay}s forwards`;
        element.style.opacity = '0';
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Camera Effects
// ============================================
function initCameraEffects() {
    // Add floating camera icons to background
    const cameraContainer = document.createElement('div');
    cameraContainer.className = 'camera-bg';
    cameraContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    
    const cameras = ['📷', '🎥', '📸', '🎬', '📹', '🔭'];
    
    for (let i = 0; i < 30; i++) {
        const camera = document.createElement('div');
        camera.innerHTML = cameras[Math.floor(Math.random() * cameras.length)];
        camera.style.cssText = `
            position: absolute;
            font-size: ${20 + Math.random() * 40}px;
            opacity: 0.05;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${10 + Math.random() * 20}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        cameraContainer.appendChild(camera);
    }
    
    // Only add if body doesn't have it
    if (!document.querySelector('.camera-bg')) {
        document.body.insertBefore(cameraContainer, document.body.firstChild);
    }
}

// ============================================
// Particle Effects
// ============================================
function initParticleEffects() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${2 + Math.random() * 4}px;
            height: ${2 + Math.random() * 4}px;
            background: white;
            border-radius: 50%;
            opacity: ${0.1 + Math.random() * 0.3};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }
    
    if (!document.querySelector('.particle-container')) {
        document.body.appendChild(particleContainer);
    }
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// Navbar Effects
// ============================================
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255,255,255,0.98)';
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(255,255,255,0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        });
    }
}

// ============================================
// Image Lazy Loading
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// Booking Form Enhancements
// ============================================
function enhanceBookingForm() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
    });
    
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('change', function() {
            const min = parseInt(this.min) || 0;
            const max = parseInt(this.max) || Infinity;
            let value = parseInt(this.value);
            if (value < min) this.value = min;
            if (value > max) this.value = max;
        });
    });
}

// ============================================
// AJAX Helper Functions
// ============================================
async function fetchAPI(url, options = {}) {
    showLoading();
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        const data = await response.json();
        hideLoading();
        return data;
    } catch (error) {
        hideLoading();
        showToast(error.message, 'error');
        throw error;
    }
}

// ============================================
// Price Calculator
// ============================================
function calculatePrice(cameraPrice, photographerPrice, days) {
    return (cameraPrice + photographerPrice) * days;
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(price);
}

// ============================================
// Copy to Clipboard
// ============================================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// ============================================
// Confetti Effect
// ============================================
function showConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#28a745'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${5 + Math.random() * 10}px;
            height: ${5 + Math.random() * 10}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            z-index: 10000;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Add confetti animation to styles
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Export Functions (if using modules)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showLoading,
        hideLoading,
        showToast,
        showConfetti,
        calculatePrice,
        formatPrice,
        copyToClipboard
    };
}

// ============================================
// Initialize everything when DOM is ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    enhanceBookingForm();
    initLazyLoading();
    
    // Add loading animation to all links
    document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href && !this.href.startsWith('javascript:')) {
                showLoading('Redirecting...');
            }
        });
    });
    
    // Add submit loading to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            showLoading('Processing...');
        });
    });
});