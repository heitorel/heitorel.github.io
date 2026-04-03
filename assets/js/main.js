async function loadResume() {
  const response = await fetch("assets/data/resume.json");
  if (!response.ok) {
    throw new Error("Nao foi possivel carregar assets/data/resume.json");
  }

  return response.json();
}

function byId(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const node = byId(id);
  if (node) {
    node.textContent = value || "";
  }
}

function setLink(id, href, text) {
  const node = byId(id);
  if (!node) {
    return;
  }

  if (!href) {
    node.removeAttribute("href");
    node.setAttribute("aria-disabled", "true");
    return;
  }

  node.href = href;
  if (text) {
    node.textContent = text;
  }
}

function slugify(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getUniqueSkills(groups) {
  return [...new Set(Object.values(groups || {}).flat().filter(Boolean))];
}

function extractYears(experience) {
  return (experience || [])
    .flatMap((item) => (item.period || "").match(/\d{4}/g) || [])
    .map((year) => Number(year))
    .filter(Boolean);
}

function getExperienceYears(experience) {
  const years = extractYears(experience);
  if (!years.length) {
    return null;
  }

  const firstYear = Math.min(...years);
  const now = new Date().getFullYear();
  return Math.max(now - firstYear, 1);
}

function buildFocusLine(cv) {
  const backend = (cv.skills?.Backend || []).slice(0, 3);
  const infra = (cv.skills?.DevOps || []).slice(0, 2);
  return [...backend, ...infra].join(", ") || "Java, Kotlin, Spring e integracao";
}

function renderQuickFacts(cv) {
  const container = byId("quick-facts");
  if (!container) {
    return;
  }

  const facts = [
    ["Base", cv.location],
    ["Email", cv.email],
    ["Telefone", cv.phone],
    ["Frentes", `${cv.experience?.length || 0} experiencias`],
  ].filter(([, value]) => value);

  container.innerHTML = facts
    .map(
      ([label, value]) =>
        `<div class="fact"><span>${label}</span><strong>${value}</strong></div>`
    )
    .join("");
}

function renderWorkingPrinciples(cv) {
  const container = byId("working-principles");
  if (!container) {
    return;
  }

  const backend = (cv.skills?.Backend || []).slice(0, 3).join(", ");
  const methodologies = (cv.skills?.Metodologias || []).slice(0, 3).join(", ");

  const items = [
    backend
      ? `Backend orientado a servicos com ${backend} para fluxos que exigem confiabilidade.`
      : "Backend orientado a servicos para fluxos que exigem confiabilidade.",
    "Integracao entre APIs, mensageria e dados para reduzir friccao entre sistemas.",
    methodologies
      ? `Entrega pragmatica com base em ${methodologies} e foco em manutencao sustentavel.`
      : "Entrega pragmatica com foco em manutencao sustentavel.",
  ];

  container.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderMetrics(cv) {
  const container = byId("metrics");
  if (!container) {
    return;
  }

  const uniqueSkills = getUniqueSkills(cv.skills);
  const experienceYears = getExperienceYears(cv.experience);
  const companies = new Set((cv.experience || []).map((item) => item.company)).size;
  const metrics = [
    {
      value: experienceYears ? `${experienceYears}+` : `${cv.experience?.length || 0}`,
      label: "anos em trajetoria",
    },
    {
      value: `${uniqueSkills.length}`,
      label: "tecnologias no repertorio",
    },
    {
      value: `${companies}`,
      label: "contextos profissionais",
    },
    {
      value: `${cv.languages?.length || 0}`,
      label: "idiomas",
    },
  ];

  container.innerHTML = metrics
    .map(
      (metric) =>
        `<div class="metric"><strong>${metric.value}</strong><span>${metric.label}</span></div>`
    )
    .join("");
}

function renderSkills(groups) {
  const container = byId("skills-groups");
  if (!container) {
    return;
  }

  const entries = Object.entries(groups || {});
  container.innerHTML = entries
    .map(([group, items]) => {
      const tags = (items || [])
        .map((item) => `<span class="skill-tag">${item}</span>`)
        .join("");

      return `
        <article class="skill-card">
          <div class="skill-card-header">
            <h3>${group}</h3>
            <span class="skill-count">${items.length} itens</span>
          </div>
          <div class="skill-tags">${tags}</div>
        </article>
      `;
    })
    .join("");
}

function renderExperience(experience) {
  const container = byId("experience");
  if (!container) {
    return;
  }

  container.innerHTML = (experience || [])
    .map((item) => {
      const bullets = (item.bullets || [])
        .map((bullet) => `<li>${bullet}</li>`)
        .join("");

      return `
        <article class="timeline-item" id="exp-${slugify(item.company)}">
          <h3>${item.role} <span>${item.company}</span></h3>
          <div class="timeline-meta">
            <span>${item.period || ""}</span>
            ${item.location ? `<span>${item.location}</span>` : ""}
          </div>
          <ul class="timeline-points">${bullets}</ul>
        </article>
      `;
    })
    .join("");
}

function renderEducation(education) {
  const container = byId("education");
  if (!container) {
    return;
  }

  container.innerHTML = (education || [])
    .map(
      (item) => `
        <div class="stack-item">
          <strong>${item.degree}</strong>
          <span>${item.institution}</span>
          <span>${item.period}${item.location ? ` - ${item.location}` : ""}</span>
        </div>
      `
    )
    .join("");
}

function renderLanguages(languages) {
  const container = byId("languages");
  if (!container) {
    return;
  }

  container.innerHTML = (languages || [])
    .map(
      (item) => `
        <div class="language-item">
          <strong>${item.name}</strong>
          <span>${item.level}</span>
        </div>
      `
    )
    .join("");
}

function applyResume(cv) {
  setText("brand-name", cv.name);
  setText("hero-role", cv.role);
  setText("hero-tagline", cv.tagline);
  setText("hero-location", cv.location);
  setText("hero-focus", buildFocusLine(cv));
  setText("hero-phone", cv.phone);
  setText("card-name", cv.name);
  setText("card-role", cv.role);
  setText("about-text", cv.about);
  setText("contact-phone", cv.phone);
  setText("footer-name", cv.name);
  setText("footer-year", `| ${new Date().getFullYear()}`);

  setLink("email-link", cv.email ? `mailto:${cv.email}` : "");
  setLink("email-link2", cv.email ? `mailto:${cv.email}` : "");
  setLink("contact-email", cv.email ? `mailto:${cv.email}` : "", cv.email);
  setLink("whatsapp-link", cv.whatsapp);
  setLink("whatsapp-link2", cv.whatsapp);
  setLink("github-link", cv.github);
  setLink("linkedin-link", cv.linkedin);

  renderQuickFacts(cv);
  renderWorkingPrinciples(cv);
  renderMetrics(cv);
  renderSkills(cv.skills);
  renderExperience(cv.experience);
  renderEducation(cv.education);
  renderLanguages(cv.languages);
}

function setupTheme() {
  const root = document.documentElement;
  const button = byId("theme-toggle");
  if (!button) {
    return;
  }

  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme || (preferredDark ? "dark" : "light");

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
    button.setAttribute("aria-pressed", String(isDark));
  };

  applyTheme(initialTheme);

  button.addEventListener("click", () => {
    applyTheme(root.classList.contains("dark") ? "light" : "dark");
  });
}

function setupNavigation() {
  const nav = byId("site-nav");
  const toggle = byId("menu-toggle");
  const links = Array.from(document.querySelectorAll(".site-nav a"));
  if (!nav || !toggle) {
    return;
  }

  const closeMenu = () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const shouldOpen = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", shouldOpen);
    document.body.classList.toggle("nav-open", shouldOpen);
    toggle.setAttribute("aria-expanded", String(shouldOpen));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if (!sections.length || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        links.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isActive);
        });
      });
    },
    {
      rootMargin: "-30% 0px -45% 0px",
      threshold: 0.05,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

async function bootstrap() {
  setupTheme();
  setupNavigation();

  try {
    const cv = await loadResume();
    applyResume(cv);
  } catch (error) {
    console.error(error);
    setText(
      "about-text",
      "Nao foi possivel carregar os dados do portfolio neste momento."
    );
  }
}

bootstrap();
