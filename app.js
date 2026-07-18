lucide.createIcons();

/* ===== LENIS SMOOTH SCROLL ===== */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ===== CUSTOM CURSOR & MAGNETIC EFFECT ===== */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const magneticElements = document.querySelectorAll('.magnetic');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 400, fill: "forwards", easing: "ease" });
});

magneticElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });

    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    });

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: "power2.out"
        });
    });
});

/* ===== 3D TILT EFFECT ===== */
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1200,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "elastic.out(1.2, 0.4)"
        });
    });
});

/* ===== LOADER PROGRESS ===== */
const progressFill = document.getElementById('progress-fill');
const progressPct = document.getElementById('progress-pct');
const statusLine = document.getElementById('status-line');

const statuses = [
    'importing torch, numpy, sklearn...',
    'loading portfolio modules...',
    'compiling experience datasets...',
    'training project models...',
    'Ready.'
];

let progress = 0;
const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 2;
    if (progress > 100) progress = 100;

    const bars = Math.floor(progress / 8);
    progressFill.textContent = '='.repeat(bars);
    progressPct.textContent = progress + '%';

    const statusIdx = Math.min(Math.floor(progress / 25), statuses.length - 1);
    statusLine.textContent = '> ' + statuses[statusIdx];

    if (progress >= 100) clearInterval(progressInterval);
}, 120);

/* ===== INITIAL LOAD SEQUENCE ===== */
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.loader-line', {
        opacity: 0,
        y: -8,
        duration: 0.3,
        stagger: 0.05
    })
    .to('#loader', {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut"
    })
    .fromTo('.hero-line', {
        y: 20,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out"
    }, "-=0.3")
    .fromTo('.circuit-corner', {
        opacity: 0,
        scale: 0.5
    }, {
        opacity: 0.3,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(2)"
    }, "-=0.4");
});

/* ===== TYPING ANIMATION ===== */
const typedTextEl = document.getElementById('typed-text');
const tagline = 'AI & Data Science Engineer \u2022 Innovator';
let charIndex = 0;
let isTyping = false;

function startTyping() {
    if (isTyping) return;
    isTyping = true;
    charIndex = 0;
    typedTextEl.textContent = '';

    function typeChar() {
        if (charIndex < tagline.length) {
            typedTextEl.textContent += tagline[charIndex];
            charIndex++;
            setTimeout(typeChar, 35 + Math.random() * 30);
        } else {
            isTyping = false;
        }
    }

    setTimeout(typeChar, 600);
}

/* ===== SCROLL-TRIGGERED TYPING ===== */
ScrollTrigger.create({
    trigger: '#hero',
    start: 'top 60%',
    onEnter: startTyping,
    once: true
});

/* ===== SCROLL REVEALS ===== */
gsap.utils.toArray('.gsap-reveal').forEach(el => {
    const isLeft = el.classList.contains('left-slide');
    const isScale = el.classList.contains('scale-up');
    const isStagger = el.classList.contains('stagger-fade');

    let vars = { y: 40, opacity: 0, autoAlpha: 0 };
    if (isLeft) vars = { x: -40, opacity: 0, autoAlpha: 0 };
    if (isScale) vars = { scale: 0.9, opacity: 0, autoAlpha: 0 };

    let toVars = {
        y: 0, x: 0, scale: 1, opacity: 1, autoAlpha: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse"
        }
    };

    if (isScale) toVars.ease = "back.out(1.2)";

    gsap.fromTo(el, vars, toVars);
});

/* ===== SKILL GROUP STAGGER ===== */
gsap.utils.toArray('.skill-group').forEach((group, i) => {
    gsap.fromTo(group.querySelectorAll('.skill-chip'),
        { y: 12, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "power2.out",
            scrollTrigger: {
                trigger: group,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        }
    );

    gsap.fromTo(group.querySelector('.trace-horizontal'),
        { scaleX: 0, opacity: 0 },
        {
            scaleX: 1, opacity: 0.3, duration: 0.6, ease: "power2.out",
            transformOrigin: "left center",
            scrollTrigger: {
                trigger: group,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

/* ===== GIT COMMIT STAGGER ===== */
gsap.utils.toArray('.git-commit').forEach((commit, i) => {
    gsap.fromTo(commit,
        { x: -20, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 0.7, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: {
                trigger: commit,
                start: "top 88%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

/* ===== NAV TOGGLE (MOBILE) ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

/* ===== THREE.JS BACKGROUND ===== */
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 300;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 300;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 1.8,
    color: 0x3776AB,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xFFD43B,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
});

const maxConnections = 600;
const lineGeometry = new THREE.BufferGeometry();
const linePositions = new Float32Array(maxConnections * 3 * 2);
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
lineGeometry.setDrawRange(0, 0);

const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(linesMesh);

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y = elapsedTime * 0.025;
    particlesMesh.rotation.x = elapsedTime * 0.01;
    linesMesh.rotation.y = elapsedTime * 0.025;
    linesMesh.rotation.x = elapsedTime * 0.01;

    targetX = mouseX * 0.06;
    targetY = mouseY * 0.06;

    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (-targetY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    let vertexpos = 0;
    let numConnected = 0;
    const positions = particlesMesh.geometry.attributes.position.array;
    const minDistance = 40;

    for (let i = 0; i < particlesCount; i++) {
        for (let j = i + 1; j < particlesCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < minDistance * minDistance) {
                if (numConnected < maxConnections) {
                    linePositions[vertexpos++] = positions[i * 3];
                    linePositions[vertexpos++] = positions[i * 3 + 1];
                    linePositions[vertexpos++] = positions[i * 3 + 2];

                    linePositions[vertexpos++] = positions[j * 3];
                    linePositions[vertexpos++] = positions[j * 3 + 1];
                    linePositions[vertexpos++] = positions[j * 3 + 2];

                    numConnected++;
                }
            }
        }
    }

    linesMesh.geometry.setDrawRange(0, numConnected * 2);
    linesMesh.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}
animate();
