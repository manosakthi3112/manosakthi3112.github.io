/* =====================================================
   MODERN PORTFOLIO - APP.JS
   Interactive Functionality & Animations
   ===================================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollProgress();
    initNavigation();
    initTypingEffect();
    initCounters();
    initRevealAnimations();
    initProjectFilters();
    initContactForm();
});

/* =====================================================
   PARTICLE BACKGROUND
   ===================================================== */
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* =====================================================
   SCROLL PROGRESS INDICATOR
   ===================================================== */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

/* =====================================================
   NAVIGATION
   ===================================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    });
}

/* =====================================================
   TYPING EFFECT
   ===================================================== */
function initTypingEffect() {
    const typedElement = document.getElementById('typed-name');
    if (!typedElement) return;

    const name = 'Manosakthi Thiyagarajan';
    let index = 0;
    let isDeleting = false;
    let pauseEnd = false;

    function type() {
        if (!isDeleting && index <= name.length) {
            typedElement.textContent = name.substring(0, index);
            index++;

            if (index > name.length) {
                pauseEnd = true;
                setTimeout(() => {
                    pauseEnd = false;
                    isDeleting = true;
                    type();
                }, 2000);
                return;
            }
        } else if (isDeleting && index >= 0) {
            typedElement.textContent = name.substring(0, index);
            index--;

            if (index < 0) {
                isDeleting = false;
                index = 0;
                setTimeout(type, 300);
                return;
            }
        }

        if (!pauseEnd) {
            const speed = isDeleting ? 30 : 50;
            setTimeout(type, speed);
        }
    }

    // Start typing immediately
    setTimeout(type, 300);
}

/* =====================================================
   ANIMATED COUNTERS - Slot Machine Style
   ===================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startSlotMachineAnimation(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    function startSlotMachineAnimation(element) {
        const target = parseInt(element.dataset.count);

        function runAnimation() {
            let currentNumber = 0;
            const spinSpeed = 80; // ms per number change

            // Spin through 0 to target-1
            const spinInterval = setInterval(() => {
                element.textContent = currentNumber;
                element.style.transform = 'scale(1.1)';

                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, spinSpeed / 2);

                currentNumber++;

                // When we reach target, stop and show final number
                if (currentNumber >= target) {
                    clearInterval(spinInterval);
                    element.textContent = target;
                    element.style.transform = 'scale(1.2)';
                    element.style.textShadow = '0 0 20px rgba(0, 212, 255, 0.8)';

                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                        element.style.textShadow = 'none';
                    }, 300);

                    // Wait 10 seconds then restart
                    setTimeout(() => {
                        runAnimation();
                    }, 10000);
                }
            }, spinSpeed);
        }

        // Start first animation
        runAnimation();
    }
}

/* =====================================================
   REVEAL ANIMATIONS ON SCROLL
   ===================================================== */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Fast stagger animation
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 50);
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/* =====================================================
   PROJECT FILTERS
   ===================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach((card, index) => {
                const category = card.dataset.category;

                // Reset animation
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* =====================================================
   CONTACT FORM
   ===================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success state
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

        // Reset form
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });
}

/* =====================================================
   3D TILT EFFECT FOR CARDS
   ===================================================== */
function init3DTilt() {
    const cards = document.querySelectorAll('.project-card, .achievement-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Initialize 3D tilt after a short delay
setTimeout(init3DTilt, 1000);

/* =====================================================
   SMOOTH PARALLAX EFFECT
   ===================================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        const speed = 0.05 * (index + 1);
        shape.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed}px)`;
    });
});

/* =====================================================
   CURSOR GLOW EFFECT (Optional Enhancement)
   ===================================================== */
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    if (e.clientY > rect.bottom) return;

    hero.style.setProperty('--mouse-x', `${e.clientX}px`);
    hero.style.setProperty('--mouse-y', `${e.clientY}px`);
});

/* =====================================================
   PRELOADER (Optional)
   ===================================================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    const heroElements = document.querySelectorAll('.hero .animate-fade-in, .hero .animate-fade-in-delay, .hero .animate-fade-in-delay-2, .hero .animate-fade-in-delay-3');
    heroElements.forEach(el => {
        el.style.opacity = '';
    });
});

/* =====================================================
   KEYBOARD NAVIGATION SUPPORT
   ===================================================== */
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navMenu?.classList.contains('active')) {
            navToggle?.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

console.log('🚀 Portfolio loaded successfully!');
