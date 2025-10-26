const DATA_PATH = 'resume.json';
const RESUME_PATH = 'assets/Chris__Resume.pdf';
const TAGLINE = 'Software Engineer | Building creative and impactful technology.';
let resumeData = null;

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const particles = [];
const particleCount = 70;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getParticleRGB = () =>
  getComputedStyle(document.body).getPropertyValue('--particle-color-rgb').trim() || '0, 191, 166';
let particleRGB = getParticleRGB();

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset(true);
  }

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

    if (this.y < -50) {
      this.reset();
    }
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
  for (let i = 0; i < particleCount; i += 1) {
    particles.push(new Particle());
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animate);
  };

  animate();
}

// Smooth scroll for anchor links and scroll indicator
const scrollTriggers = document.querySelectorAll('a[href^="#"], [data-scroll]');
scrollTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    const targetSelector = trigger.getAttribute('href')?.startsWith('#')
      ? trigger.getAttribute('href')
      : trigger.dataset.scroll;
    if (!targetSelector) return;
    const target = document.querySelector(targetSelector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Theme toggle
const THEME_KEY = 'cb-theme';
const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Storage unavailable', error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Unable to persist theme preference', error);
    }
  },
};
const themeToggle = document.getElementById('theme-toggle');
let themeTransitionTimer;
const applyTheme = (theme) => {
  document.body.classList.toggle('light-theme', theme === 'light');
  particleRGB = getParticleRGB();
};

const enableThemeTransition = () => {
  document.body.classList.add('theme-transition');
  clearTimeout(themeTransitionTimer);
  themeTransitionTimer = window.setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 500);
};

const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: light)');
const storedTheme = storage.get(THEME_KEY);
applyTheme(storedTheme || (colorSchemeQuery.matches ? 'light' : 'dark'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    enableThemeTransition();
    applyTheme(nextTheme);
    storage.set(THEME_KEY, nextTheme);
  });
}

const handleColorSchemeChange = (event) => {
  if (!storage.get(THEME_KEY)) {
    applyTheme(event.matches ? 'light' : 'dark');
  }
};

if (colorSchemeQuery.addEventListener) {
  colorSchemeQuery.addEventListener('change', handleColorSchemeChange);
} else if (colorSchemeQuery.addListener) {
  colorSchemeQuery.addListener(handleColorSchemeChange);
}

// Fade-in observer reused after data renders
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

const registerAnimations = () => {
  document.querySelectorAll('[data-animate]').forEach((el) => {
    if (!el.classList.contains('visible')) {
      fadeObserver.observe(el);
    }
  });
};

// Render helpers -----------------------------------------------------------

const renderHero = (data) => {
  const heroName = document.getElementById('hero-name');
  const heroTagline = document.getElementById('hero-tagline');
  const heroSummary = document.getElementById('hero-summary');
  const heroLinks = document.getElementById('hero-links');
  const footerName = document.getElementById('hero-footer-name');

  heroTagline.textContent = TAGLINE;
  heroName.textContent = `Hi, I'm ${data.name}.`;

  const primaryLocation = data.education?.[0]?.location || 'New York, NY';
  const projectCount = data.projects?.length || 0;
  const experienceCount = data.experience?.length || 0;
  const experienceCopy = experienceCount
    ? `${experienceCount} engineering experiences`
    : 'multi-disciplinary experiences';
  const projectCopy = projectCount ? `${projectCount} experiments` : 'countless experiments';
  heroSummary.textContent = `Based in ${primaryLocation}, I merge artistic curiosity with rigorous systems thinking across ${experienceCopy} and ${projectCopy}.`;

  heroLinks.innerHTML = '';
  const contactLinks = [
    { label: 'GitHub', href: data.contact?.github },
    { label: 'LinkedIn', href: data.contact?.linkedin },
    { label: 'Email', href: data.contact?.email ? `mailto:${data.contact.email}` : null },
  ].filter((link) => Boolean(link.href));

  contactLinks.forEach((link) => {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.target = link.href.startsWith('http') ? '_blank' : '_self';
    anchor.rel = link.href.startsWith('http') ? 'noopener' : '';
    anchor.textContent = link.label;
    heroLinks.appendChild(anchor);
  });

  if (footerName) {
    footerName.textContent = data.name;
  }
};

const renderProjects = (projects = [], contact = {}) => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';

  projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.dataset.animate = 'fade';

    const title = document.createElement('h3');
    title.textContent = project.name;

    const metaText = [project.location, project.tech?.join(' • ')].filter(Boolean).join(' • ');
    if (metaText) {
      const meta = document.createElement('p');
      meta.className = 'project-meta';
      meta.textContent = metaText;
      card.appendChild(meta);
    }

    const techStack = project.tech || [];
    const descItems = project.description || [];

    if (techStack.length) {
      const techList = document.createElement('ul');
      techList.className = 'project-card__stack';
      techStack.forEach((tech) => {
        const li = document.createElement('li');
        li.textContent = tech;
        techList.appendChild(li);
      });
      card.appendChild(techList);
    }

    if (descItems.length) {
      const descList = document.createElement('ul');
      descList.className = 'project-card__details';
      descItems.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        descList.appendChild(li);
      });
      card.appendChild(descList);
    }

    const actions = document.createElement('div');
    actions.className = 'project-card__actions';
    const githubButton = document.createElement('a');
    githubButton.className = 'btn btn--ghost';
    githubButton.textContent = 'View on GitHub';
    const repoLink = project.repo || project.link || contact.github || '#';
    githubButton.href = repoLink;
    githubButton.target = '_blank';
    githubButton.rel = 'noopener';
    actions.appendChild(githubButton);

    card.prepend(title);
    card.append(actions);
    grid.appendChild(card);
  });
};

const renderExperience = (experience = []) => {
  const list = document.getElementById('experience-list');
  if (!list) return;
  list.innerHTML = '';

  experience.forEach((role) => {
    const card = document.createElement('article');
    card.className = 'experience-card';
    card.dataset.animate = 'fade';

    const heading = document.createElement('h3');
    const headingText = [role.title, role.company].filter(Boolean).join(' · ');
    heading.textContent = headingText || role.title || role.company || 'Experience';

    const metaParts = [role.location, role.date].filter(Boolean).join(' • ');
    if (metaParts) {
      const meta = document.createElement('p');
      meta.textContent = metaParts;
      card.appendChild(meta);
    }

    const bullets = document.createElement('ul');
    (role.responsibilities || []).forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      bullets.appendChild(li);
    });

    card.prepend(heading);
    card.appendChild(bullets);
    list.appendChild(card);
  });
};

const renderEducation = (education = []) => {
  const container = document.getElementById('education-cards');
  if (!container) return;
  container.innerHTML = '';

  education.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'education-card';
    card.dataset.animate = 'fade';

    const title = document.createElement('h3');
    title.textContent = entry.school;

    card.appendChild(title);

    if (entry.degree || entry.minor) {
      const degree = document.createElement('p');
      const degreeText = [entry.degree, entry.minor ? `Minor in ${entry.minor}` : null]
        .filter(Boolean)
        .join(' · ');
      degree.textContent = degreeText;
      card.appendChild(degree);
    }

    const metaParts = [
      entry.location,
      entry.expectedGraduation ? `Grad ${entry.expectedGraduation}` : null,
      entry.gpa ? `GPA ${entry.gpa}` : null,
    ]
      .filter(Boolean)
      .join(' • ');
    if (metaParts) {
      const meta = document.createElement('p');
      meta.textContent = metaParts;
      card.appendChild(meta);
    }

    const coursework = document.createElement('details');
    coursework.className = 'coursework';
    const summary = document.createElement('summary');
    summary.textContent = 'Highlighted coursework';
    coursework.appendChild(summary);

    const list = document.createElement('ul');
    list.className = 'coursework-list';
    (entry.coursework || []).forEach((course) => {
      const li = document.createElement('li');
      li.textContent = course;
      list.appendChild(li);
    });
    coursework.appendChild(list);

    card.appendChild(coursework);
    container.appendChild(card);
  });
};

const renderSkills = (skills = {}) => {
  const groups = document.getElementById('skills-groups');
  if (!groups) return;
  groups.innerHTML = '';

  const mapping = [
    { key: 'languages', label: 'Languages' },
    { key: 'developerTools', label: 'Developer Tools' },
    { key: 'spokenLanguages', label: 'Spoken Languages' },
  ];

  mapping.forEach(({ key, label }) => {
    if (!Array.isArray(skills[key]) || skills[key].length === 0) return;
    const group = document.createElement('div');
    group.className = 'skill-group';
    group.dataset.animate = 'fade';

    const heading = document.createElement('h3');
    heading.textContent = label;

    const tags = document.createElement('div');
    tags.className = 'skill-tags';

    skills[key].forEach((skill) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = skill;
      tags.appendChild(tag);
    });

    group.append(heading, tags);
    groups.appendChild(group);
  });
};

// Fetch + render resume.json driven content -------------------------------

/**
 * Updating resume.json automatically updates every section.
 * Add/remove entries from projects, experience, education, or skills arrays
 * and the UI will reflect the new content on the next page load.
 */
const hydrateSite = async () => {
  try {
    const response = await fetch(DATA_PATH);
    const data = await response.json();
    resumeData = data;
    window.cbData = data; // expose for debugging

    renderHero(data);
    renderProjects(data.projects, data.contact);
    renderExperience(data.experience);
    renderEducation(data.education);
    renderSkills(data.skills);

    registerAnimations();
  } catch (error) {
    console.error('Unable to load resume.json', error);
  }
};

hydrateSite();

// Footer year + resume link fallback
const yearTarget = document.getElementById('current-year');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const resumeButtons = document.querySelectorAll('#resume a.btn');
resumeButtons.forEach((btn) => {
  if (!btn.getAttribute('href')) {
    btn.setAttribute('href', RESUME_PATH);
  }
});
