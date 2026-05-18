// Initialize Icons
lucide.createIcons();

// --- LENIS SMOOTH SCROLL ---
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


// --- CUSTOM CURSOR & MAGNETIC EFFECT ---
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
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.4,
            ease: "power2.out"
        });
    });
});

// --- 3D TILT EFFECT FOR PROJECT CARDS ---
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        
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

// --- INITIAL LOAD SEQUENCE & TEXT SPLIT ---
gsap.registerPlugin(ScrollTrigger);

// Manually split hero text to wrap characters
const charWraps = document.querySelectorAll('.char-wrap');
charWraps.forEach(wrap => {
    const text = wrap.innerText;
    wrap.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char === ' ' ? '\u00A0' : char; 
        wrap.appendChild(span);
    });
});

// Loader Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    tl.to('.loader-text', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        delay: 0.5
    })
    .to('#loader', {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut"
    })
    // Hero Animations
    .to('.hero-name-highlight', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.2")
    .to('.char-wrap span', {
        y: 0,
        opacity: 1,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.5)",
    }, "-=0.6")
    .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.5")
    .to('.hero-btn-container', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.5");
});

// --- ADVANCED SCROLL REVEALS ---

gsap.utils.toArray('.gsap-reveal:not(.left-slide, .scale-up, .stagger-fade)').forEach(el => {
    gsap.fromTo(el, 
        { y: 50, opacity: 0, autoAlpha: 0 },
        { 
            y: 0, opacity: 1, autoAlpha: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        }
    );
});

gsap.utils.toArray('.gsap-reveal.left-slide').forEach(el => {
    gsap.fromTo(el, 
        { x: -50, opacity: 0, autoAlpha: 0 },
        { 
            x: 0, opacity: 1, autoAlpha: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        }
    );
});

gsap.utils.toArray('.gsap-reveal.scale-up').forEach(el => {
    gsap.fromTo(el, 
        { scale: 0.9, opacity: 0, autoAlpha: 0 },
        { 
            scale: 1, opacity: 1, autoAlpha: 1, duration: 1, ease: "back.out(1.2)",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        }
    );
});

gsap.utils.toArray('.gsap-reveal.stagger-fade').forEach(container => {
    gsap.set(container, { autoAlpha: 1 }); // Reveal the container itself
    gsap.fromTo(container.children, 
        { y: 20, opacity: 0, autoAlpha: 0 },
        { 
            y: 0, opacity: 1, autoAlpha: 1, duration: 0.8, stagger: 0.05, ease: "power2.out",
            scrollTrigger: { trigger: container, start: "top 85%", toggleActions: "play none none reverse" }
        }
    );
});

// --- THREE.JS BACKGROUND SCENE ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500; 
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 350;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material (Black for light theme)
let particlesMaterial = new THREE.PointsMaterial({
    size: 1.5,
    color: 0x000000,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

let lineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.15
});

const maxConnections = 800;
const lineGeometry = new THREE.BufferGeometry();
const linePositions = new Float32Array(maxConnections * 3 * 2);
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
lineGeometry.setDrawRange(0, 0);

const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(linesMesh);

// Mouse Interaction
let mouseX = 0; let mouseY = 0;
let targetX = 0; let targetY = 0;
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

// Animation Loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y = elapsedTime * 0.03;
    particlesMesh.rotation.x = elapsedTime * 0.015;
    linesMesh.rotation.y = elapsedTime * 0.03;
    linesMesh.rotation.x = elapsedTime * 0.015;
    
    targetX = mouseX * 0.08;
    targetY = mouseY * 0.08;
    
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (-targetY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    let vertexpos = 0;
    let numConnected = 0;
    const positions = particlesMesh.geometry.attributes.position.array;
    const minDistance = 35; 

    for (let i = 0; i < particlesCount; i++) {
        for (let j = i + 1; j < particlesCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < minDistance * minDistance) {
                if(numConnected < maxConnections) {
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
