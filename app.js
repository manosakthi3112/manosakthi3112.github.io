/* =========================================================
   NEURAL WORKBENCH — interactions
   Manosakthi Thiyagarajan Portfolio
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   ICONS
   --------------------------------------------------------- */
lucide.createIcons();

/* ---------------------------------------------------------
   REDUCED MOTION + CAPABILITY FLAGS
   --------------------------------------------------------- */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------------------------------------------------------
   LENIS SMOOTH SCROLL
   --------------------------------------------------------- */
let lenis = null;
if (typeof Lenis !== 'undefined' && !prefersReduced) {
    lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
    });
    function rafLenis(time) {
        lenis.raf(time);
        requestAnimationFrame(rafLenis);
    }
    requestAnimationFrame(rafLenis);
}

/* ---------------------------------------------------------
   GSAP REGISTRATION
   --------------------------------------------------------- */
gsap.registerPlugin(ScrollTrigger);

/* Sync ScrollTrigger with Lenis */
if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}

/* =========================================================
   THEME TOGGLE (skeuomorphic switch)
   ========================================================= */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    try { localStorage.setItem('nw-theme', theme); } catch (e) {}
}

(function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('nw-theme'); } catch (e) {}
    if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
})();

themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
});

/* =========================================================
   CUSTOM CURSOR — crosshair reticle
   Dot follows pointer instantly; reticle eases behind it.
   ========================================================= */
const cursorDot = document.querySelector('.cursor-dot');
const cursorReticle = document.querySelector('.cursor-reticle');

if (finePointer && cursorDot && cursorReticle) {
    document.body.classList.add('cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let reticleX = mouseX, reticleY = mouseY;
    let needsFrame = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        /* dot tracks the pointer 1:1 each event */
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        if (!needsFrame) {
            needsFrame = true;
            requestAnimationFrame(stepCursor);
        }
    }, { passive: true });

    function stepCursor() {
        /* ease the reticle toward the pointer */
        reticleX += (mouseX - reticleX) * 0.22;
        reticleY += (mouseY - reticleY) * 0.22;
        cursorReticle.style.transform = `translate(${reticleX}px, ${reticleY}px)`;
        needsFrame = false;
        /* keep easing until it settles, to avoid a snapped stop */
        if (Math.abs(mouseX - reticleX) > 0.5 || Math.abs(mouseY - reticleY) > 0.5) {
            needsFrame = true;
            requestAnimationFrame(stepCursor);
        }
    }

    /* hide custom cursor when the window loses focus / leaves */
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorReticle.style.opacity = '0';
    });
    window.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '';
        cursorReticle.style.opacity = '';
    });
}

/* =========================================================
   MAGNETIC ELEMENTS + CURSOR HOVER STATE
   ========================================================= */
const magnetic = document.querySelectorAll('.magnetic');
magnetic.forEach((el) => {
    if (!finePointer) return;
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    });
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
    });
});

/* =========================================================
   3D TILT CARDS
   ========================================================= */
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
    if (!finePointer || prefersReduced) return;
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const px = (e.clientX - rect.left - cx) / cx;
        const py = (e.clientY - rect.top - cy) / cy;
        gsap.to(card, {
            rotateY: px * 8,
            rotateX: -py * 8,
            transformPerspective: 1000,
            duration: 0.5,
            ease: 'power2.out',
        });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.4)',
        });
    });
});

/* =========================================================
   LOADER (powering up the bench)
   ========================================================= */
const loader = document.getElementById('loader');
const gaugeNeedle = document.getElementById('gauge-needle');
const loaderPct = document.getElementById('loader-pct');
const loaderStatus = document.getElementById('loader-status');

const loadSteps = [
    'Calibrating instruments…',
    'Loading neural modules…',
    'Wiring the patch panel…',
    'Charging cartridges…',
    'Workbench ready.',
];

function runLoader() {
    if (!loader) return Promise.resolve();
    return new Promise((resolve) => {
        let progress = 0;
        const tick = setInterval(() => {
            progress += Math.random() * 10 + 4;
            if (progress > 100) progress = 100;
            const pct = Math.round(progress);
            if (loaderPct) loaderPct.textContent = pct + '%';
            if (loaderStatus) loaderStatus.textContent = loadSteps[Math.min(Math.floor(progress / 20), loadSteps.length - 1)];
            if (gaugeNeedle) {
                const angle = -90 + (pct / 100) * 180;
                gaugeNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
            }
            if (progress >= 100) {
                clearInterval(tick);
                setTimeout(resolve, 350);
            }
        }, 110);
    });
}

function hideLoader() {
    if (!loader) return;
    gsap.to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
            loader.style.visibility = 'hidden';
            loader.classList.add('done');
        },
    });
}

/* =========================================================
   HERO INTRO + TYPING
   ========================================================= */
const typedEl = document.getElementById('typed-text');
const taglines = [
    'AI · Computer Vision · Robotics',
    'Building intelligent systems that ship.',
    '9 hackathon finals · 12 projects · 8.8 GPA',
];
let taglineIdx = 0;

function typeText(element, text, speed = 45) {
    return new Promise((resolve) => {
        element.textContent = '';
        let i = 0;
        (function step() {
            if (i <= text.length) {
                element.textContent = text.slice(0, i);
                i++;
                setTimeout(step, speed + Math.random() * 35);
            } else {
                resolve();
            }
        })();
    });
}

function eraseText(element, speed = 22) {
    return new Promise((resolve) => {
        let text = element.textContent;
        (function step() {
            if (text.length > 0) {
                text = text.slice(0, -1);
                element.textContent = text;
                setTimeout(step, speed);
            } else {
                resolve();
            }
        })();
    });
}

async function typingLoop() {
    if (!typedEl || prefersReduced) {
        if (typedEl) typedEl.textContent = taglines[0];
        return;
    }
    /* eslint-disable no-constant-condition */
    while (true) {
        await typeText(typedEl, taglines[taglineIdx]);
        await wait(2200);
        await eraseText(typedEl);
        await wait(250);
        taglineIdx = (taglineIdx + 1) % taglines.length;
    }
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.eyebrow', { y: 20, opacity: 0, duration: 0.6 })
      .from('.hero-title-line', { y: 40, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.3')
      .from('.hero-role', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.hero-tagline', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
      .from('.hero-cta .btn', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.2')
      .from('.crt-monitor', { y: 60, opacity: 0, scale: 0.94, duration: 0.9, ease: 'back.out(1.4)' }, '-=0.8')
      .from('.float-stat', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(2)' }, '-=0.4')
      .add(() => typingLoop(), '-=0.2');
}

/* =========================================================
   SCROLL REVEALS
   ========================================================= */
function setupReveals() {
    gsap.utils.toArray('.gsap-reveal').forEach((el) => {
        gsap.fromTo(
            el,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    });

    /* Section heads slide in */
    gsap.utils.toArray('.section-head').forEach((el) => {
        gsap.fromTo(
            el,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    });

    /* Skill pills stagger */
    gsap.utils.toArray('.instrument').forEach((inst) => {
        const pills = inst.querySelectorAll('.skill-pill');
        gsap.fromTo(
            pills,
            { y: 14, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.04,
                ease: 'back.out(1.5)',
                scrollTrigger: { trigger: inst, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
        );
    });

    /* Project cartridges stagger */
    gsap.utils.toArray('.cartridge').forEach((card, i) => {
        gsap.fromTo(
            card,
            { y: 40, opacity: 0, rotateX: -8 },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.7,
                delay: (i % 3) * 0.08,
                ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
            }
        );
    });

    /* Conveyor items */
    gsap.utils.toArray('.conv-item').forEach((item) => {
        gsap.fromTo(
            item,
            { x: -30, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse' },
            }
        );
    });

    /* Medals & certs */
    gsap.utils.toArray('.medal, .cert').forEach((el) => {
        gsap.fromTo(
            el,
            { x: -20, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' },
            }
        );
    });
}

/* =========================================================
   SCROLL PARALLAX (scrubbed, performance-friendly)
   ========================================================= */
function setupScrollParallax() {
    if (prefersReduced) return;
    gsap.utils.toArray('[data-parallax-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0;
        if (speed === 0) return;
        /* ambient glows drift regardless of viewport */
        if (el.closest('.ambient')) {
            gsap.to(el, {
                yPercent: speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                },
            });
            return;
        }
        gsap.fromTo(
            el,
            { yPercent: -speed * 60 },
            {
                yPercent: speed * 60,
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            }
        );
    });
}

/* =========================================================
   CURSOR PARALLAX (mouse-reactive depth) — throttled
   - one shared mousemove listener
   - one rAF pass per move that actually changes the pointer
   - skips layers currently off-screen (IntersectionObserver)
   - uses gsap.quickTo (pre-built setters) so GSAP keeps owning the
     transform alongside the scroll yPercent tween — no clobbering,
     no per-frame object allocation.
   ========================================================= */
function setupCursorParallax() {
    if (!finePointer || prefersReduced) return;

    /* Build per-layer quickTo setters once. quickTo returns a fast reusable
       function — far cheaper than calling gsap.set() every frame. */
    const setters = [];
    gsap.utils.toArray('[data-parallax-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0;
        if (speed === 0) return;
        const depth = Math.abs(speed) * 22;   /* max pixel offset */
        setters.push({
            el,
            setX: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }),
            setY: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' }),
            depth,
            visible: true,
        });
    });
    if (!setters.length) return;

    /* Mark visibility so we skip off-screen layers entirely. */
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const rec = setters.find((s) => s.el === entry.target);
                if (rec) rec.visible = entry.isIntersecting;
            });
        },
        { rootMargin: '200px 0px' }
    );
    setters.forEach((s) => io.observe(s.el));

    let mx = 0, my = 0;          /* normalized -1..1 */
    let pending = false;

    window.addEventListener(
        'mousemove',
        (e) => {
            mx = (e.clientX / window.innerWidth - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * 2;
            if (!pending) {
                pending = true;
                requestAnimationFrame(stepParallax);
            }
        },
        { passive: true }
    );

    function stepParallax() {
        for (let i = 0; i < setters.length; i++) {
            const s = setters[i];
            if (!s.visible) continue;
            s.setX(-mx * s.depth);
            s.setY(-my * s.depth * 0.6);
        }
        pending = false;
    }
}

/* =========================================================
   NAV: hide on scroll-down, show on scroll-up + active link
   ========================================================= */
function setupNav() {
    const nav = document.getElementById('nav');
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.getElementById('navToggle');
    let lastY = window.scrollY;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > lastY && y > 200) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastY = y;
    }, { passive: true });

    /* active link via ScrollTrigger */
    gsap.utils.toArray('section[id]').forEach((section) => {
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!link) return;
        ScrollTrigger.create({
            trigger: section,
            start: 'top 40%',
            end: 'bottom 40%',
            onToggle: (self) => {
                if (self.isActive) {
                    document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
                    link.classList.add('active');
                }
            },
        });
    });

    /* mobile toggle */
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/* =========================================================
   PROJECT FILTER
   ========================================================= */
function setupProjectFilter() {
    const chips = document.querySelectorAll('.cat-chip');
    const cards = document.querySelectorAll('.cartridge');
    if (!chips.length) return;

    /* default active = All */
    const allChip = document.querySelector('.cat-chip-all');
    if (allChip) allChip.classList.add('active');

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            const cat = chip.dataset.cat;
            cards.forEach((card) => {
                const match = cat === 'all' || card.dataset.cat === cat;
                if (match) {
                    card.classList.remove('hidden');
                    gsap.fromTo(card, { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
                } else {
                    card.classList.add('hidden');
                }
            });
            ScrollTrigger.refresh();
        });
    });
}

/* =========================================================
   CONTACT FORM (front-end only)
   ========================================================= */
function setupContactForm() {
    const form = document.getElementById('signalForm');
    const status = document.getElementById('sfStatus');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!name || !email || !message) {
            status.textContent = '⚠ All fields required to transmit.';
            status.className = 'sf-status err';
            return;
        }
        if (!emailOk) {
            status.textContent = '⚠ Invalid email signal.';
            status.className = 'sf-status err';
            return;
        }
        status.textContent = '✓ Signal locked. Opening mail client…';
        status.className = 'sf-status ok';
        /* open prefilled mail client as a functional fallback */
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        const subject = encodeURIComponent(`Portfolio contact — ${name}`);
        setTimeout(() => {
            window.location.href = `mailto:manot6114@gmail.com?subject=${subject}&body=${body}`;
        }, 600);
    });
}

/* =========================================================
   HERO SCOPE NEEDLE (decorative wiggle)
   ========================================================= */
function setupHeroScope() {
    const needle = document.getElementById('hero-scope-needle');
    if (!needle || prefersReduced) return;
    gsap.to(needle, {
        rotation: 12,
        duration: 1.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        transformOrigin: 'left center',
    });
}

/* =========================================================
   INIT
   ========================================================= */
window.addEventListener('load', async () => {
    await runLoader();
    hideLoader();

    if (!prefersReduced) {
        heroIntro();
    } else {
        /* make content visible immediately */
        gsap.set(['.eyebrow', '.hero-title-line', '.hero-role', '.hero-tagline', '.hero-cta .btn', '.crt-monitor', '.float-stat'], { opacity: 1, y: 0, scale: 1 });
        if (typedEl) typedEl.textContent = taglines[0];
    }

    setupReveals();
    setupScrollParallax();
    setupCursorParallax();
    setupNav();
    setupProjectFilter();
    setupContactForm();
    setupHeroScope();

    /* refresh after assets settle */
    ScrollTrigger.refresh();
});

/* Recompute on resize (debounced) */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});
