// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Authentication buttons functionality
document.querySelector('.login-btn').addEventListener('click', () => {
    // Redirect to login page
    window.location.href = '/login.html';
});

document.querySelector('.signup-btn').addEventListener('click', () => {
    // Redirect to registration page
    window.location.href = '/register.html';
});

// CTA button functionality
document.querySelector('.cta-button').addEventListener('click', () => {
    // Redirect to registration page
    window.location.href = '/register.html';
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        navbar.style.background = 'white';
    }
});

// Feature cards animation
const featureCards = document.querySelectorAll('.feature-card');
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
});

// Integration items animation
const integrationItems = document.querySelectorAll('.integration-item');
integrationItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.5s ease-out';
    observer.observe(item);
}); 