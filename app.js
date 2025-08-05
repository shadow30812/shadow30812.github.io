// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add smooth scrolling behavior to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle project button interactions
    const projectButtons = document.querySelectorAll('.project-btn');
    
    projectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only handle buttons that aren't links
            if (this.tagName === 'BUTTON') {
                e.preventDefault();
                
                // Change button text and style
                if (this.textContent === 'View Details') {
                    this.textContent = 'Viewed';
                    this.style.backgroundColor = 'var(--color-success)';
                    this.style.borderColor = 'var(--color-success)';
                    this.style.color = 'var(--color-btn-primary-text)';
                } else if (this.textContent === 'Viewed') {
                    this.textContent = 'View Details';
                    this.style.backgroundColor = '';
                    this.style.borderColor = '';
                    this.style.color = '';
                }
            }
        });
        
        // Handle hover effects for all project buttons
        button.addEventListener('mouseenter', function() {
            if (this.textContent !== 'Viewed') {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = 'var(--shadow-md)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (this.textContent !== 'Viewed') {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });
    
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn   = this.querySelector('button[type="submit"]');
        const defaultText = submitBtn.textContent;

        // ----- Stage 1: “Sending…”
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled    = true;
        submitBtn.style.opacity = '0.7';

        // send the form (replace fetch with your real endpoint if needed)
        const data = new FormData(this);
        let ok = false;
        try {
        const res = await fetch(this.action, {
            method : 'POST',
            body   : data,
            headers: { 'Accept': 'application/json' }
        });
        ok = res.ok;
        } catch (_) {
        ok = false;
        }

        // fallback: if the service is slow, still continue after ~2 s
        await new Promise(r => setTimeout(r, 2000));

        // ----- Stage 2: “Message Sent!”
        submitBtn.textContent = ok ? 'Message Sent!' : 'Error — Try again';
        submitBtn.classList.toggle('btn--success', ok);
        submitBtn.style.opacity = '1';

        // Keep the success state visible for 5 s
        setTimeout(() => {
        submitBtn.textContent = defaultText;
        submitBtn.disabled    = false;
        submitBtn.style.opacity = '';
        submitBtn.classList.remove('btn--success');
        // Optional: clear form only on success
        if (ok) this.reset();
        }, 2000);
    });
    }

    const srAlert = document.getElementById('sr-status');
    if (srAlert) srAlert.textContent = 'Your message was sent successfully';
    
    // Add active navigation state based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current nav link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    // Add scroll event listener for active navigation
    window.addEventListener('scroll', updateActiveNav);
    
    // Initial call to set active nav on page load
    updateActiveNav();
    
    // Add scroll-to-top functionality
    let scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--color-primary);
        color: var(--color-btn-primary-text);
        border: none;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all var(--duration-normal) var(--ease-standard);
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect to scroll to top button
    scrollToTopButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'var(--color-primary-hover)';
        this.style.transform = 'scale(1.1)';
    });
    
    scrollToTopButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'var(--color-primary)';
        this.style.transform = 'scale(1)';
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .skill-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 'h' to go to home/intro
        if (e.key === 'h' || e.key === 'H') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                document.querySelector('#intro').scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Press 'p' to go to projects
        if (e.key === 'p' || e.key === 'P') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Press 's' to go to skills
        if (e.key === 's' || e.key === 'S') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                document.querySelector('#skills').scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Press 'c' to go to contact
        if (e.key === 'c' || e.key === 'C') {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Add mobile menu toggle (if needed for smaller screens)
    function handleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navContainer = document.querySelector('.nav-container');
        
        if (window.innerWidth <= 480) {
            // For very small screens, we might want to adjust navigation
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // Close mobile menu after clicking (if implemented)
                });
            });
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', handleMobileMenu);
    handleMobileMenu(); // Initial call
    
    // Add loading animation
    window.addEventListener('load', function() {
        const introSection = document.querySelector('.intro-section');
        if (introSection) {
            introSection.style.opacity = '0';
            introSection.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                introSection.style.transition = 'opacity 1s ease, transform 1s ease';
                introSection.style.opacity = '1';
                introSection.style.transform = 'translateY(0)';
            }, 100);
        }
    });
});

// Add CSS for active navigation state
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--color-primary) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .scroll-to-top:focus {
        outline: 2px solid var(--color-btn-primary-text);
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);