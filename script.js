// ════════════════════════════════════════════════════════════════
// Chris Brasil — Portfolio Script
// Single-page: resume.json + glass-data.json hydration
// ════════════════════════════════════════════════════════════════

let resumeData = null;
let glassData = null;

// ── Navigation ──────────────────────────────────────────────────

const nav = document.getElementById('site-nav');
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('[data-mobile-link]');

// Scroll state
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger toggle
let menuOpen = false;
hamburger?.addEventListener('click', () => {
  menuOpen = !menuOpen;
  hamburger.classList.toggle('active', menuOpen);
  mobileMenu?.classList.toggle('active', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ESC to close
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) {
    hamburger?.click();
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Scroll Animations ───────────────────────────────────────────

const animObserver = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.15 }
);

const registerAnimations = () => {
  document.querySelectorAll('[data-animate]').forEach(el => {
    if (!el.classList.contains('visible')) animObserver.observe(el);
  });
};

// ── Render: Hero & About ────────────────────────────────────────

const renderHero = (data) => {
  const tagline = document.getElementById('hero-tagline');
  if (tagline) {
    const loc = data.education?.[0]?.location || 'New York City';
    tagline.textContent = `Based in ${loc}, I'm a software engineer building thoughtful products and exploring new technology through personal projects.`;
  }

  const aboutText = document.getElementById('about-text');
  if (aboutText) {
    aboutText.textContent = `I'm a software engineering student at NYU Tandon School of Engineering graduating in May 2026, with ${data.experience?.length || 3} internship experiences across machine learning, clinical AI, and computer vision. As a GLASS Honors Scholar, I've worked on global projects in Abu Dhabi, Vietnam, and Brazil — connecting engineering to the UN Sustainable Development Goals. I'm passionate about building thoughtful software and exploring new technology through personal projects.`;
  }

  const aboutLinks = document.getElementById('about-links');
  if (aboutLinks) {
    aboutLinks.innerHTML = '';
    const links = [
      { label: 'GitHub', href: data.contact?.github },
      { label: 'LinkedIn', href: data.contact?.linkedin },
      { label: 'Email', href: data.contact?.email ? `mailto:${data.contact.email}` : null },
    ].filter(l => l.href);

    links.forEach(l => {
      const a = document.createElement('a');
      a.href = l.href;
      a.textContent = l.label;
      a.target = l.href.startsWith('http') ? '_blank' : '_self';
      a.rel = l.href.startsWith('http') ? 'noopener' : '';
      aboutLinks.appendChild(a);
    });
  }

  // Contact section links
  const contactEmail = document.getElementById('contact-email');
  const contactLinkedin = document.getElementById('contact-linkedin');
  const contactGithub = document.getElementById('contact-github');
  if (contactEmail && data.contact?.email) contactEmail.href = `mailto:${data.contact.email}`;
  if (contactLinkedin && data.contact?.linkedin) contactLinkedin.href = data.contact.linkedin;
  if (contactGithub && data.contact?.github) contactGithub.href = data.contact.github;

  // Hero social buttons
  const heroLinkedin = document.getElementById('hero-linkedin');
  const heroGithub = document.getElementById('hero-github');
  const heroEmail = document.getElementById('hero-email');
  if (heroLinkedin && data.contact?.linkedin) heroLinkedin.href = data.contact.linkedin;
  if (heroGithub && data.contact?.github) heroGithub.href = data.contact.github;
  if (heroEmail && data.contact?.email) heroEmail.href = `mailto:${data.contact.email}`;
};

// ── Typing animation ────────────────────────────────────────────

const startTyping = () => {
  const el = document.getElementById('hero-typed');
  if (!el) return;

  const strings = [
    'A Software Engineer',
    'A Full Stack Developer',
    'A Global Scholar',
    'A Problem Solver',
    'An NYU Engineer',
    'A Builder',
  ];

  let sIdx = 0, cIdx = 0, deleting = false;

  const tick = () => {
    const current = strings[sIdx];
    if (deleting) {
      cIdx--;
      el.textContent = current.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        sIdx = (sIdx + 1) % strings.length;
        setTimeout(tick, 450);
        return;
      }
      setTimeout(tick, 38);
    } else {
      cIdx++;
      el.textContent = current.slice(0, cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 75);
    }
  };

  setTimeout(tick, 600);
};

// ── Render: Experience ──────────────────────────────────────────

const renderExperience = (records = []) => {
  const container = document.getElementById('experience-list');
  if (!container) return;
  container.setAttribute('data-stagger', '');
  container.innerHTML = '';

  const sorted = [...records].sort((a, b) => parseInt(a.id) - parseInt(b.id));

  sorted.forEach((role, i) => {
    const card = document.createElement('article');
    card.className = 'exp-card';
    card.dataset.animate = 'fade';
    card.style.setProperty('--i', i);

    const initials = (role.company || '').split(' ').map(w => w[0]).join('').slice(0, 3);

    card.innerHTML = `
      <div class="exp-card__header">
        <div class="exp-card__logo">
          ${role.logo
            ? `<img src="${role.logo}" alt="${role.logoAlt || role.company}" loading="lazy" />`
            : `<span style="font-size:1.1rem;font-weight:700;color:var(--text-light);letter-spacing:0.1em">${initials}</span>`
          }
        </div>
        <div class="exp-card__header-text">
          <h3 class="exp-card__company">${role.company || ''}</h3>
          <span class="exp-card__role">${role.title || ''}</span>
          ${role.teamFocus ? `<span class="exp-card__team">${role.teamFocus}</span>` : ''}
        </div>
        <div class="exp-card__meta">
          <span class="exp-card__date">${role.date || ''}</span>
          <span class="exp-card__location">${role.location || ''}</span>
        </div>
      </div>
      <div class="exp-card__body">
        <p class="exp-card__desc">${role.description || ''}</p>
        ${role.highlights?.length ? `
          <ul class="exp-card__highlights">
            ${role.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : ''}
        ${role.tags?.length ? `
          <div class="exp-card__tags">
            ${role.tags.map(t => `<span class="exp-tag">${t}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
    container.appendChild(card);
  });
};

// ── Render: Projects ────────────────────────────────────────────

const renderProjects = (projects = [], contact = {}) => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.setAttribute('data-stagger', '');
  grid.innerHTML = '';

  projects.forEach((project, i) => {
    const card = document.createElement('article');
    card.className = 'proj-card';
    card.dataset.animate = 'fade';
    card.style.setProperty('--i', i);

    const repo = project.repo || contact.github || '#';

    card.innerHTML = `
      ${project.location ? `<span class="proj-card__location">${project.location}</span>` : ''}
      <h3 class="proj-card__name">${project.name}</h3>
      ${project.tech?.length ? `
        <div class="proj-card__stack">
          ${project.tech.map(t => `<span>${t}</span>`).join('')}
        </div>
      ` : ''}
      ${project.description?.length ? `
        <ul class="proj-card__details">
          ${project.description.map(d => `<li>${d}</li>`).join('')}
        </ul>
      ` : ''}
      ${repo !== '#' ? `<a class="proj-card__link" href="${repo}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
    `;
    grid.appendChild(card);
  });
};

// ── Render: GLASS ───────────────────────────────────────────────

const renderGlass = (data) => {
  const { program, journey, sdgs } = data;

  // Intro
  const intro = document.getElementById('glass-intro');
  if (intro) {
    intro.innerHTML = `
      <p class="glass__intro-institution">${program.institution} · ${program.cohort}</p>
      <blockquote class="glass__intro-mission">"${program.mission}"</blockquote>
      <p class="glass__intro-description">${program.description}</p>
    `;
  }

  // Stats
  const statsEl = document.getElementById('glass-stats');
  if (statsEl) {
    statsEl.innerHTML = program.stats.map(s => `
      <div class="glass-stat" data-animate="fade">
        <span class="glass-stat__value">${s.value}</span>
        <span class="glass-stat__label">${s.label}</span>
      </div>
    `).join('');
  }

  // Abstract
  const abstractEl = document.getElementById('glass-abstract');
  if (abstractEl && program.abstract) {
    abstractEl.innerHTML = `
      <p class="glass__abstract-label">Research Abstract</p>
      <div class="glass__abstract-text" data-animate="fade">${program.abstract.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
    `;
  }

  // Journey
  const journeyEl = document.getElementById('glass-journey');
  if (journeyEl) {
    journeyEl.innerHTML = `
      <h3 class="glass__journey-title">The Journey</h3>
      ${journey.map(entry => {
        const projectHTML = entry.project ? `
          <div class="glass-entry__project">
            <span class="glass-entry__project-name">${entry.project.name}</span>
            <div class="glass-entry__project-tech">
              ${entry.project.tech.map(t => `<span>${t}</span>`).join('')}
            </div>
            ${entry.project.repo ? `<a class="glass-entry__project-link" href="${entry.project.repo}" target="_blank" rel="noopener">View on GitHub →</a>` : ''}
          </div>
        ` : '';

        const sdgChips = entry.sdgs?.length ? `
          <div class="glass-entry__sdgs">
            ${entry.sdgs.map(n => `<span class="glass-sdg-chip">SDG ${n}</span>`).join('')}
            ${entry.upcoming ? `<span class="glass-sdg-chip" style="color:var(--accent-warm);border-color:rgba(212,118,74,0.2)">Upcoming</span>` : ''}
          </div>
        ` : '';

        const imageHTML = entry.image ? `
          <div class="glass-entry__image">
            <img src="${entry.image}" alt="${entry.imageAlt || entry.title}" loading="lazy" />
          </div>
        ` : '';

        return `
          <article class="glass-entry${entry.upcoming ? ' glass-entry--upcoming' : ''}" data-animate="fade">
            <div class="glass-entry__year">
              ${entry.year}
              ${entry.month ? `<span class="glass-entry__month">${entry.month}</span>` : ''}
            </div>
            <div class="glass-entry__body">
              <div class="glass-entry__content">
                <div class="glass-entry__text">
                  <span class="glass-entry__category glass-entry__category--${entry.category}">${entry.categoryLabel}</span>
                  <h4 class="glass-entry__title">${entry.title}</h4>
                  <span class="glass-entry__location">${entry.location}</span>
                  <p class="glass-entry__desc">${entry.description}</p>
                  ${projectHTML}
                  ${sdgChips}
                </div>
                ${imageHTML}
              </div>
            </div>
          </article>
        `;
      }).join('')}
    `;
  }

  // SDGs
  const sdgsEl = document.getElementById('glass-sdgs');
  if (sdgsEl) {
    sdgsEl.innerHTML = `
      <h3 class="glass__sdgs-title">Impact Areas</h3>
      <div class="glass__sdgs-grid">
        ${sdgs.map(sdg => {
          const count = journey.filter(e => e.sdgs?.includes(sdg.number) && !e.upcoming).length;
          return `
            <div class="glass-sdg-card" style="--sdg-color:${sdg.color}" data-animate="fade">
              <span class="glass-sdg-card__number">${sdg.number}</span>
              <div class="glass-sdg-card__content">
                <p class="glass-sdg-card__name">${sdg.name}</p>
                <p class="glass-sdg-card__desc">${sdg.description}</p>
                <p class="glass-sdg-card__count">${count} experience${count !== 1 ? 's' : ''}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Paper
  const paperEl = document.getElementById('glass-paper');
  if (paperEl && program.paperPath) {
    paperEl.innerHTML = `
      <p class="glass__paper-label">Capstone Research Paper</p>
      <div class="glass__paper-teaser" data-animate="fade">
        <div class="glass__paper-teaser-text">
          <h3 class="glass__paper-title">Final Paper</h3>
          <p class="glass__paper-teaser-desc">Read the full capstone paper exploring how AI can be engineered to advance global educational equity.</p>
        </div>
        <div class="glass__paper-teaser-actions">
          <button class="glass__paper-toggle" aria-expanded="false">Read Paper</button>
          <a class="glass__paper-download" href="${program.paperPath}" target="_blank" rel="noopener">Download PDF →</a>
        </div>
      </div>
      <div class="glass__paper-viewer" hidden>
        <iframe class="glass__paper-frame" title="GLASS Capstone Research Paper"></iframe>
      </div>
    `;

    const btn = paperEl.querySelector('.glass__paper-toggle');
    const viewer = paperEl.querySelector('.glass__paper-viewer');
    const frame = paperEl.querySelector('.glass__paper-frame');
    let loaded = false;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (!isOpen && !loaded) {
        frame.src = program.paperPath;
        loaded = true;
      }
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.textContent = isOpen ? 'Read Paper' : 'Close Paper';
      viewer.hidden = isOpen;
    });
  }
};

// ── Render: Education ───────────────────────────────────────────

const renderEducation = (education = []) => {
  const container = document.getElementById('education-content');
  if (!container) return;
  container.innerHTML = '';

  education.forEach(entry => {
    const card = document.createElement('article');
    card.className = 'edu-card';
    card.dataset.animate = 'fade';

    const orgs = (entry.organizations?.length
      ? entry.organizations
      : (resumeData?.leadership || []).map(l => l.organization)
    ).filter(Boolean);

    const gpaVal = (entry.gpa || '—').split('/')[0].trim();

    card.innerHTML = `
      <div class="edu-card__main">
        <div class="edu-card__top">
          <div class="edu-card__logo">
            ${entry.logo
              ? `<img src="${entry.logo}" alt="${entry.logoAlt || entry.school}" loading="lazy" />`
              : `<span style="font-weight:700;color:var(--text-light)">${(entry.school||'').split(' ').map(w=>w[0]).join('').slice(0,3)}</span>`
            }
          </div>
          <div class="edu-card__info">
            <h3>${entry.school}</h3>
            <p>${entry.minor ? `${entry.degree}, Minor in ${entry.minor}` : entry.degree || ''}</p>
          </div>
        </div>
        <div class="edu-card__meta">
          <div class="edu-card__meta-item">
            <span class="edu-card__meta-label">Expected</span>
            <span class="edu-card__meta-value">${entry.expectedGraduation || ''}</span>
          </div>
          <div class="edu-card__meta-item">
            <span class="edu-card__meta-label">GPA</span>
            <span class="edu-card__meta-value">${gpaVal}</span>
          </div>
          <div class="edu-card__meta-item">
            <span class="edu-card__meta-label">Location</span>
            <span class="edu-card__meta-value">${entry.location || ''}</span>
          </div>
        </div>
        <div>
          <p class="edu-card__coursework-label">Coursework</p>
          <div class="edu-card__chips">
            ${(entry.coursework || []).map(c => `<span class="edu-chip">${c}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="edu-card__sidebar">
        <p class="edu-card__sidebar-title">Organizations</p>
        ${orgs.map(o => `<div class="edu-org-item">${o}</div>`).join('')}
      </div>
    `;
    container.appendChild(card);
  });
};

// ── Render: Skills ──────────────────────────────────────────────

const renderSkills = (skills = {}) => {
  const container = document.getElementById('skills-groups');
  if (!container) return;
  container.setAttribute('data-stagger', '');
  container.innerHTML = '';

  const mapping = [
    { key: 'languages', label: 'Languages' },
    { key: 'developerTools', label: 'Developer Tools' },
    { key: 'spokenLanguages', label: 'Spoken Languages' },
  ];

  mapping.forEach(({ key, label }, i) => {
    if (!Array.isArray(skills[key]) || !skills[key].length) return;
    const group = document.createElement('div');
    group.className = 'skill-group';
    group.dataset.animate = 'fade';
    group.style.setProperty('--i', i);

    group.innerHTML = `
      <h3 class="skill-group__title">${label}</h3>
      <div class="skill-group__tags">
        ${skills[key].map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    `;
    container.appendChild(group);
  });
};

// ── Hydrate ─────────────────────────────────────────────────────

const hydrate = async () => {
  try {
    const [resumeRes, glassRes] = await Promise.all([
      fetch('resume.json'),
      fetch('glass-data.json')
    ]);
    resumeData = await resumeRes.json();
    glassData = await glassRes.json();

    renderHero(resumeData);
    renderExperience(resumeData.experience);
    renderProjects(resumeData.projects, resumeData.contact);
    renderGlass(glassData);
    renderEducation(resumeData.education);
    renderSkills(resumeData.skills);

    registerAnimations();
  } catch (err) {
    console.error('Failed to load data:', err);
  }
};

hydrate();
startTyping();

// ── Projects map interactions ───────────────────────────────────

const mapLocationEl = document.getElementById('map-location');
const mapTitleEl    = document.getElementById('map-title');
const drawer        = document.getElementById('project-drawer');
const drawerClose   = document.getElementById('drawer-close');

document.querySelectorAll('.map-marker').forEach(marker => {
  // Hover: update bottom-left label
  marker.addEventListener('mouseenter', () => {
    if (mapLocationEl) mapLocationEl.textContent = marker.dataset.location;
    if (mapTitleEl)    mapTitleEl.textContent    = marker.dataset.project;
  });
  marker.addEventListener('mouseleave', () => {
    if (mapLocationEl) mapLocationEl.textContent = 'My Projects';
    if (mapTitleEl)    mapTitleEl.textContent    = 'Worldwide.';
  });

  // Click: toggle detail drawer
  marker.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    const isSame = drawer.dataset.active === marker.dataset.project;

    if (isOpen && isSame) {
      drawer.classList.remove('open');
      drawer.dataset.active = '';
      return;
    }

    const { project, location, tech, desc, repo } = marker.dataset;

    document.getElementById('drawer-location').textContent = location;
    document.getElementById('drawer-name').textContent     = project;
    document.getElementById('drawer-link').href            = repo;

    document.getElementById('drawer-tech').innerHTML =
      tech.split('|').map(t => `<span>${t}</span>`).join('');

    document.getElementById('drawer-desc').innerHTML =
      desc.split('|').map(d => `<li>${d}</li>`).join('');

    drawer.dataset.active = project;
    drawer.classList.add('open');
  });
});

if (drawerClose) {
  drawerClose.addEventListener('click', () => drawer.classList.remove('open'));
}

// Footer year
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
