// DNA Helix Animation
const canvas = document.getElementById('dna-canvas');
const ctx = canvas.getContext('2d');
let animationId;
let time = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawDNAHelix() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width * 0.85;
    const amplitude = 80;
    const wavelength = 150;
    const spacing = 20;

    for (let y = -100; y < canvas.height + 100; y += spacing) {
        const offset = (time + y * 0.02);
        const x1 = centerX + Math.sin(offset) * amplitude;
        const x2 = centerX - Math.sin(offset) * amplitude;

        // Draw connecting lines
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 + Math.abs(Math.sin(offset)) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw nodes
        const size1 = 3 + Math.abs(Math.sin(offset)) * 2;
        const size2 = 3 + Math.abs(Math.cos(offset)) * 2;

        ctx.beginPath();
        ctx.arc(x1, y, size1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${0.3 + Math.abs(Math.sin(offset)) * 0.3})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y, size2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${0.3 + Math.abs(Math.cos(offset)) * 0.3})`;
        ctx.fill();
    }

    time += 0.02;
    animationId = requestAnimationFrame(drawDNAHelix);
}

// Mouse Follower Cursor
const mouseFollower = document.createElement('div');
mouseFollower.className = 'mouse-follower';
document.body.appendChild(mouseFollower);

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateMouseFollower() {
    followerX += (mouseX - followerX) * 0.2;
    followerY += (mouseY - followerY) * 0.2;
    
    mouseFollower.style.left = followerX + 'px';
    mouseFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(updateMouseFollower);
}

updateMouseFollower();

// Floating Name Animation
const nameElement = document.querySelector('.hero h1');
if (nameElement) {
    let floatTime = 0;
    setInterval(() => {
        floatTime += 0.05;
        const floatY = Math.sin(floatTime) * 10;
        nameElement.style.transform = `translateY(${floatY}px)`;
    }, 50);
}

// Navigation scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Smooth scroll for navigation links (only for same-page anchors)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
            } else {
                alert('Oops! There was a problem sending your message. Please try again or contact me directly at marvelprouma@icloud.com');
            }
        } catch (error) {
            alert('Oops! There was a problem sending your message. Please try again or contact me directly at marvelprouma@icloud.com');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close mobile menu when clicking a link
if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Initialize
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawDNAHelix();

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveNavLink();

// Filter blog posts
const filterBtns = document.querySelectorAll('.filter-btn');
const blogCards = document.querySelectorAll('.blog-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            blogCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 10);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('visible');
                }
            });
        });
    });
}
