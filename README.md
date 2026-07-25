# Manosakthi Thiyagarajan — Neural Workbench

> A **3D parallax storytelling portfolio** built around the metaphor of an AI lab workbench. Three design languages working together: **skeuomorphism** (physical lab devices), **claymorphism** (soft, puffy panels & pills), and **multi-layer parallax** (depth that responds to scroll + cursor).

Vanilla HTML / CSS / JS — no build step. Deploys to GitHub Pages as-is.

[![Live Site](https://img.shields.io/badge/LIVE-manosakthi3112.github.io-d2553a?style=for-the-badge)](https://manosakthi3112.github.io)
[![License](https://img.shields.io/badge/LICENSE-MIT-4a433a?style=for-the-badge)](#)

---

## The Concept

The portfolio is a physical AI lab the visitor looks *into*. Scroll and cursor movement drive a virtual camera through layered depth, and every piece of content lives on a tangible lab object:

| Section | Lab object | Technique |
|---|---|---|
| Hero | CRT monitor + oscilloscope + floating clay stat pills | Skeuomorphic + claymorphic |
| About | Specimen clipboard + clay stat cards | Skeuomorphic + clay |
| Skills | Instrument rack (4 modules, knobs, LEDs, meters) | Skeuomorphic + clay pills |
| Education | Stamped diploma plaque with seal | Skeuomorphic |
| Projects | Motherboard **chip cartridges** (12) | Skeuomorphic + 3D tilt |
| Experience | Worklog conveyor with numbered nodes | Skeuomorphic |
| Awards / Certs | Trophy case — medals + certificate seals | Skeuomorphic |
| Contact | Patch panel switchboard + clay signal form | Skeuomorphic + clay |

## Two themes

A **skeuomorphic physical toggle switch** in the nav swaps between:

- **Warm Light Clay** (default) — cream / peach / lavender, true clay surfaces.
- **Dark Premium** — deep navy with neon cyan / violet / amber glow.

Choice persists via `localStorage` and respects `prefers-color-scheme` on first visit.

---

## Features

- **Claymorphism system** — soft outer + inset shadows, puffy rounded pills & cards, top highlight.
- **Skeuomorphic components** — CRT bezel, analog gauge (loader), metal rails, knobs, LEDs, medal discs, patch-panel jacks, tactile switch.
- **3D parallax** — every section has depth tiers (`data-parallax-speed`) that move on **scroll** (GSAP scrub) **and** on **cursor** (rAF-throttled).
- **3D card tilt** — monitor, instruments, cartridges, conveyor cards tilt in 3D toward the cursor.
- **Magnetic buttons** — links & pills attract toward the cursor.
- **Custom cursor** — dot + ring with hover-grow (desktop / fine-pointer only).
- **Loader** — analog "bench power" gauge fills as modules load.
- **Project filter** — filter the 12 cartridges by category (CV / NLP / Security / Time-Series / 3D).
- **Hero typing** — rotating taglines with type/erase loop.
- **Contact form** — front-end validation, opens prefilled mail client.
- **Accessibility** — `prefers-reduced-motion` disables all parallax/animation; content reveals instantly; touch devices skip cursor & magnetic effects.
- **Fully responsive** — desktop → tablet → mobile breakpoints.

---

## Tech Stack

| Layer | Tools |
|---|---|
| Core | HTML5, CSS3 (custom properties), Vanilla JavaScript |
| Animation | GSAP 3.12 + ScrollTrigger |
| Smooth Scroll | Lenis 1.0.29 |
| Icons | Lucide |
| Fonts | Bricolage Grotesque, Space Grotesk, Inter, JetBrains Mono |

No Three.js / WebGL — depth is achieved with CSS `perspective` + layered transforms, keeping it fast and reliable on GitHub Pages.

---

## Project Structure

```
portfolio/
├── index.html       # Semantic markup, all sections, parallax layers
├── styles.css       # Two palettes, skeuomorphic + claymorphic systems, responsive
├── app.js           # Parallax engine, reveals, tilt, loader, theme, typing, filter
├── content.md       # Raw profile content (resume data)
├── Resume.pdf       # Downloadable résumé
└── README.md        # You are here
```

---

## Getting Started

```bash
# Serve locally with any static server
npx serve .
# or
python -m http.server 8000
# or just open index.html in a browser
```

No build step — everything is vanilla.

---

## Customization

- **Content** — edit `index.html` (bio, projects, experience, awards, certs, contact).
- **Theme colors** — edit the CSS custom properties under `:root` (light) and `html[data-theme="dark"]` (dark) in `styles.css`.
- **Parallax depth** — tweak the `data-parallax-speed` values on any element (higher = moves more).
- **Taglines** — edit the `taglines` array in `app.js`.

---

## Sections

1. **Hero** — CRT monitor boot screen + floating clay stats
2. **About** — specimen clipboard + stat cards (GPA, hackathons, projects, certs)
3. **Skills** — 4 instrument modules (Languages, AI/ML, Tools, Specializations)
4. **Education** — diploma plaque (B.Tech AI & DS, 8.8 GPA)
5. **Projects** — 12 chip cartridges with category filter
6. **Experience** — 3 internships on the conveyor rail
7. **Awards & Certs** — trophy case (9 awards, 8 certifications)
8. **Contact** — patch panel + signal form

---

## License

MIT — free to use, modify, and distribute.
