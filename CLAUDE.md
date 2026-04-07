# CLAUDE.md — Chris Brasil Portfolio

## Project Overview
Static single-page personal portfolio for Chris Brasil, a software engineering student at NYU Tandon graduating May 2026. Deployed via GitHub Pages at `https://chrisbrasil10.github.io/portfolio/`.

## Tech Stack
- Pure HTML/CSS/JS — no build system, no framework
- Data-driven: content is loaded from JSON files via `fetch()` in `script.js`
- Fonts: Instrument Serif (display), Manrope (body), DM Mono (labels/mono) — all via Google Fonts
- Deployed: GitHub Pages off `main` branch

## File Structure
```
index.html          — Single page shell; all sections present as empty divs
script.js           — Fetches JSON, renders all dynamic content
styles.css          — All styles; CSS custom properties for theming
resume.json         — Experience, education, skills, contact, projects data
glass-data.json     — GLASS Honors program data (journey, SDGs, abstract, paper)
assets/
  map.svg                  — Pixel-art SVG world map (from ReadMeMap repo)
  glass-paper.pdf          — GLASS capstone research paper
  Chris__Resume.pdf        — Resume PDF
  IMG_1485 2.jpg           — Chris's portrait photo (About section)
  nyu-logo.png             — NYU logo
  octozi-logo.png          — Octozi logo
  whirlpool-logo.png       — Whirlpool logo
  shpe.jpg                 — SHPE conference photo
  amazonimage.png          — NYU × Amazon hackathon photo
  studyawayabudhabi.jpg    — Abu Dhabi study abroad photo
  whirlpoolpicture.jpg     — Whirlpool internship photo
  vinuniversity.png        — VinUniversity certificate photo
  climateweek.jpg          — NYU Climate Week photo
  adrabeachcleanup.jpg     — ADRA beach cleanup photo

glass.html / glass.css / glass.js  — Legacy files, NOT part of current site. Ignore.
```

## How Data Flows
1. `index.html` loads with empty section shells (`#experience-list`, `#glass-journey`, etc.)
2. `script.js` runs `hydrate()` which fetches `resume.json` and `glass-data.json`
3. Each `render*()` function populates its section via `innerHTML`
4. `startTyping()` runs immediately (outside `hydrate()`) so the hero typewriter works even on `file://`
5. `IntersectionObserver` triggers `data-animate="fade"` scroll animations

**Important:** `fetch()` fails on `file://` protocol. Always preview with a local server:
```
python3 -m http.server 8080
```

## Design System

### Color Palette (CSS variables in `:root`)
```css
--bg: #f2ede5          /* warm off-white page background */
--bg-card: #faf8f4     /* card backgrounds */
--bg-glass: #e5ecf5    /* GLASS section background (light blue) */
--accent: #0d3b5c      /* primary navy */
--accent-warm: #b85a37 /* warm orange-brown accent */
--text: #1a1410        /* near-black body text */
--text-secondary: #4a3f35
--text-light: #8a7968
--border: rgba(26,20,16,0.08)
```

### Typography
- Display/headings: `Instrument Serif` (italic style used for flair)
- Body: `Manrope`
- Labels/mono/tags: `DM Mono`

### Section Numbers
01 About, 02 Experience, 03 Projects, 04 GLASS Honors, 05 Education, 06 Skills

## Key Sections & Render Functions

### Experience (`renderExperience`)
- Data from `resume.json > experience[]`
- Renders `.exp-card` articles with logo, company, role, team, date, description, highlights, tags
- Logo images use `object-fit: cover` to fill container edge-to-edge

### Projects (SVG Map)
- Static SVG markers in `index.html` with `data-*` attributes (project, location, tech, desc, repo)
- Pipe `|` delimited for multi-value fields (tech, desc)
- Clicking a marker opens `.project-drawer` (slides up from bottom of map)
- Clicking same marker again closes drawer (tracked via `drawer.dataset.active`)
- Close button also closes drawer
- Health Reflect label uses two `<tspan>` elements to wrap onto two lines

### GLASS Section (`renderGlass`)
- Intro, stats grid, abstract blockquote, journey timeline, SDG cards, paper teaser
- Journey items from `glass-data.json > journey[]` — ordered chronologically
- Paper is hidden behind a "Read Paper" toggle button; clicking reveals an `<iframe>` with the PDF
- Abstract is a `<blockquote>` with serif styling

### Education (`renderEducation`)
- Data from `resume.json > education[]`
- Uses `.edu-card__logo img` with `object-fit: cover` to fill container

## Active Branches
- `main` — production, deployed to GitHub Pages
- `glass-purple-preview` — experimental: GLASS section background changed to `#ece8f5` (light lavender) instead of blue. Not merged. Border tint also updated to purple.
- `experience-timeline` — experimental timeline layout for Experience section. Rejected by user, not merged. Remote branch still exists on GitHub.

## Conventions & Preferences
- Always commit with meaningful messages; never batch unrelated changes
- Never commit `.DS_Store`, `glass.css`, `glass.html`, `glass.js`, or `.Rhistory`
- Use `git add <specific files>` — never `git add .` or `git add -A`
- Prefer editing existing files over creating new ones
- Do not add comments, docstrings, or type annotations to unchanged code
- User previews locally with `python3 -m http.server 8080`
- GitHub Pages can have CDN cache delay of a few hours after push — not a code issue

## Contact Info (in resume.json)
- Email: christopherdbrasil@gmail.com
- LinkedIn: https://www.linkedin.com/in/chris-brasil
- GitHub: https://github.com/ChrisBrasil10
