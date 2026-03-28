// ============================================================
// GLASS Honors Program Page — glass.js
// ============================================================

// ── Particle Canvas (identical to script.js) ──────────────

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const particles = [];
const particleCount = 70;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getParticleRGB = () =>
  getComputedStyle(document.body).getPropertyValue('--particle-color-rgb').trim() || '232, 168, 56';
let particleRGB = getParticleRGB();

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 100;
    this.size = Math.random() * 1.2 + 0.2;
    this.speedY = Math.random() * -0.25 - 0.05;
    this.speedX = Math.random() * 0.3 - 0.15;
    this.alpha = Math.random() * 0.6 + 0.25;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -50) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particleRGB}, ${this.alpha})`;
    ctx.shadowColor = `rgba(${particleRGB}, 0.7)`;
    ctx.shadowBlur = 8;
    ctx.fill();
  }
}

if (!prefersReducedMotion) {
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };
  animate();
}

// ── Scroll-based header ───────────────────────────────────

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

// ── Intersection Observer for fade-in ─────────────────────

const registerAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
};

// ── Render: Hero ──────────────────────────────────────────

const renderGlassHero = (data) => {
  const { program } = data;

  const institutionEl = document.getElementById('glass-institution');
  if (institutionEl) institutionEl.textContent = `${program.institution} · ${program.cohort}`;

  const missionEl = document.getElementById('glass-mission');
  if (missionEl) missionEl.textContent = `"${program.mission}"`;

  const frameworksEl = document.getElementById('glass-frameworks');
  if (frameworksEl) {
    frameworksEl.innerHTML = program.frameworks.map(f =>
      `<span class="glass-framework-badge">${f}</span>`
    ).join('');
  }
};

// ── Render: About ─────────────────────────────────────────

const renderGlassAbout = (data) => {
  const { program } = data;

  const descEl = document.getElementById('glass-description');
  if (descEl) descEl.textContent = program.description;

  const statsEl = document.getElementById('glass-stats');
  if (statsEl) {
    statsEl.innerHTML = program.stats.map(stat => `
      <div class="glass-stat">
        <span class="glass-stat__value">${stat.value}</span>
        <span class="glass-stat__label">${stat.label}</span>
      </div>
    `).join('');
  }
};

// ── Render: Timeline ─────────────────────────────────────

const renderGlassTimeline = (journey, activeFilter = 'all') => {
  const timelineEl = document.getElementById('glass-timeline');
  if (!timelineEl) return;

  const filtered = activeFilter === 'all'
    ? journey
    : journey.filter(e => e.category === activeFilter);

  if (filtered.length === 0) {
    timelineEl.innerHTML = `<p style="color:var(--text-muted); padding: 2rem 0;">No entries for this category.</p>`;
    return;
  }

  timelineEl.innerHTML = filtered.map(entry => {
    const isMilestone = entry.type === 'milestone';
    const isUpcoming = entry.upcoming === true;

    const projectHTML = entry.project ? `
      <div class="glass-entry-project">
        <span class="glass-project-name">↳ ${entry.project.name}</span>
        <div class="glass-project-tech">
          ${entry.project.tech.map(t => `<span class="glass-project-tech-tag">${t}</span>`).join('')}
        </div>
        ${entry.project.repo ? `<a class="glass-project-link" href="${entry.project.repo}" target="_blank" rel="noopener noreferrer">GitHub →</a>` : ''}
      </div>
    ` : '';

    const sdgsHTML = entry.sdgs && entry.sdgs.length > 0 ? `
      <div class="glass-entry-sdgs">
        ${entry.sdgs.map(n => `<span class="glass-sdg-chip">SDG ${n}</span>`).join('')}
      </div>
    ` : '';

    const upcomingBadge = isUpcoming ? `<span class="glass-sdg-chip" style="color:var(--accent-secondary); border-color:rgba(201,81,47,0.25);">Upcoming</span>` : '';

    return `
      <article class="glass-timeline-entry${isMilestone ? ' glass-timeline-entry--milestone' : ''}${isUpcoming ? ' glass-timeline-entry--upcoming' : ''}">
        <div class="glass-timeline-dot"></div>
        <div class="glass-entry-year">
          <span class="glass-entry-year-label">${entry.year}</span>
          ${entry.month ? `<span class="glass-entry-year-month">${entry.month}</span>` : ''}
        </div>
        <div class="glass-entry-body">
          <span class="glass-entry-category glass-entry-category--${entry.category}">${entry.categoryLabel}</span>
          <h3 class="glass-entry-title">${entry.title}</h3>
          <span class="glass-entry-location">📍 ${entry.location}</span>
          <p class="glass-entry-description">${entry.description}</p>
          ${projectHTML}
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${sdgsHTML}${upcomingBadge}
          </div>
        </div>
      </article>
    `;
  }).join('');
};

// ── Render: Filter Tabs ───────────────────────────────────

const renderGlassFilters = (journey) => {
  const filtersEl = document.getElementById('glass-filters');
  if (!filtersEl) return;

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'milestone', label: 'Milestones' },
    { key: 'global', label: 'Global' },
    { key: 'professional', label: 'Professional' },
    { key: 'service', label: 'Service' },
    { key: 'academic', label: 'Academic' },
    { key: 'capstone', label: 'Capstone' },
  ].filter(cat => cat.key === 'all' || journey.some(e => e.category === cat.key));

  filtersEl.innerHTML = categories.map(cat => `
    <button
      class="glass-filter-tab${cat.key === 'all' ? ' active' : ''}"
      data-filter="${cat.key}"
      role="tab"
      aria-selected="${cat.key === 'all'}"
    >${cat.label}</button>
  `).join('');

  filtersEl.querySelectorAll('.glass-filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      filtersEl.querySelectorAll('.glass-filter-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderGlassTimeline(journey, tab.dataset.filter);
    });
  });
};

// ── Render: SDG Impact ────────────────────────────────────

const renderGlassSdgs = (sdgs, journey) => {
  const sdgEl = document.getElementById('glass-sdgs');
  if (!sdgEl) return;

  sdgEl.innerHTML = sdgs.map(sdg => {
    const count = journey.filter(e => e.sdgs && e.sdgs.includes(sdg.number) && !e.upcoming).length;
    return `
      <div class="glass-sdg-card" style="--sdg-color: ${sdg.color}">
        <span class="glass-sdg-number">${sdg.number}</span>
        <span class="glass-sdg-name">${sdg.name}</span>
        <p class="glass-sdg-desc">${sdg.description}</p>
        <span class="glass-sdg-count">${count} experience${count !== 1 ? 's' : ''}</span>
      </div>
    `;
  }).join('');
};

// ── Footer year ───────────────────────────────────────────

const yearEl = document.getElementById('glass-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Hydrate ───────────────────────────────────────────────

const hydrateGlass = async () => {
  try {
    const res = await fetch('glass-data.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    renderGlassHero(data);
    renderGlassAbout(data);
    renderGlassFilters(data.journey);
    renderGlassTimeline(data.journey, 'all');
    renderGlassSdgs(data.sdgs, data.journey);
    registerAnimations();
  } catch (err) {
    console.error('[GLASS] Failed to load glass-data.json:', err);
  }
};

hydrateGlass();
