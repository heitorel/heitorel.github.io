const CONTENT_PATH = "assets/data/site-content.json";
const routes = new Set(["home", "sobre", "experiencias", "contato", "portfolio"]);

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(id, value) {
  const node = byId(id);
  if (node && value !== undefined && value !== null) {
    node.textContent = value;
  }
}

function setAttr(id, name, value) {
  const node = byId(id);
  if (node && value !== undefined && value !== null) {
    node.setAttribute(name, value);
  }
}

function setLink(id, href) {
  const node = byId(id);
  if (node && href) {
    node.href = href;
  }
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Nao foi possivel carregar ${path}`);
  }
  return response.json();
}

function renderStack(containerId, tools, toolMeta) {
  const container = byId(containerId);
  if (!container) {
    return;
  }

  container.innerHTML = (tools || [])
    .map((tool) => {
      const meta = toolMeta?.[tool] || {
        icon: "",
        url: "#home",
        color: "var(--accent)"
      };
      const iconUrl = meta.icon ? `https://cdn.simpleicons.org/${meta.icon}` : "";

      return `
        <a
          class="tool-link"
          href="${escapeHtml(meta.url)}"
          target="_blank"
          rel="noreferrer"
          title="${escapeHtml(tool)}"
          aria-label="${escapeHtml(tool)}"
          style="--tool-color: ${escapeHtml(meta.color)}; --icon-url: url('${escapeHtml(iconUrl)}')"
        >
          <span class="tool-icon" aria-hidden="true"></span>
        </a>
      `;
    })
    .join("");
}

function renderExperience(experience) {
  const container = byId("experience-list");
  if (!container) {
    return;
  }

  container.innerHTML = (experience || [])
    .map((item) => {
      const bullets = (item.bullets || [])
        .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
        .join("");
      const technologies = (item.technologies || [])
        .slice(0, 12)
        .map((tech) => `<span>${escapeHtml(tech)}</span>`)
        .join("");

      return `
        <article class="experience-item">
          <h2>${escapeHtml(item.company)}</h2>
          <h3>${escapeHtml(item.role)}</h3>
          <span class="meta">${escapeHtml(item.period)}${item.location ? ` · ${escapeHtml(item.location)}` : ""}</span>
          <p>${escapeHtml(item.description)}</p>
          <ul>${bullets}</ul>
          <div class="tech-row">${technologies}</div>
        </article>
      `;
    })
    .join("");
}

function getRouteFromHash() {
  const hash = window.location.hash.replace("#", "").trim();
  return routes.has(hash) ? hash : "home";
}

function closeMenu() {
  const nav = byId("site-nav");
  const toggle = byId("menu-toggle");

  nav?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  toggle?.setAttribute("aria-expanded", "false");
}

function setRoute(route) {
  const nextRoute = routes.has(route) ? route : "home";

  document.querySelectorAll("[data-page]").forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === nextRoute);
  });

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === nextRoute);
  });

  closeMenu();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function setupRouting() {
  window.addEventListener("hashchange", () => setRoute(getRouteFromHash()));

  document.addEventListener("click", (event) => {
    const routeLink = event.target.closest("[data-route]");
    if (!routeLink) {
      return;
    }

    const route = routeLink.dataset.route;
    if (routes.has(route) && window.location.hash === `#${route}`) {
      event.preventDefault();
      setRoute(route);
    }
  });

  setRoute(getRouteFromHash());
}

function setupTheme() {
  const root = document.documentElement;
  const button = byId("theme-toggle");
  const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("theme");
  const initialTheme = storedTheme || (preferredDark ? "dark" : "dark");

  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
    button?.setAttribute("aria-pressed", String(isDark));
  }

  applyTheme(initialTheme);
  button?.addEventListener("click", () => {
    applyTheme(root.classList.contains("dark") ? "light" : "dark");
  });
}

function setupMenu() {
  const nav = byId("site-nav");
  const toggle = byId("menu-toggle");

  toggle?.addEventListener("click", () => {
    const isOpen = !nav?.classList.contains("is-open");
    nav?.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

function setupContactForm(profile, contactPage) {
  const form = byId("contact-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = byId("contact-name")?.value.trim();
    const sender = byId("contact-email-input")?.value.trim();
    const message = byId("contact-message")?.value.trim();
    const body = [
      `${contactPage.fields.name}: ${name}`,
      `${contactPage.fields.email}: ${sender}`,
      "",
      message
    ].join("\n");

    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(contactPage.emailSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}

function applyContent(content) {
  const { metadata, profile, navigation, home, about, experiencesPage, contactPage, portfolioPage, footer, stack, experience } = content;

  document.title = metadata.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);

  setAttr("brand-link", "aria-label", navigation.brandAria);
  setAttr("site-nav", "aria-label", navigation.menuAria);
  setAttr("theme-toggle", "aria-label", navigation.themeToggle);
  setText("menu-toggle-label", navigation.menuToggle);
  setText("brand-name", profile.brandName);
  setText("nav-about", navigation.about);
  setText("nav-experiences", navigation.experiences);
  setText("nav-contact", navigation.contact);

  setAttr("profile-photo", "alt", home.portraitAlt);
  setText("home-title", home.greeting);
  setText("home-role", profile.role);
  setText("home-experiences-label", home.cards.experiences);
  setText("home-github-label", home.cards.github);
  setText("home-portfolio-label", home.cards.portfolio);
  setText("stack-title", home.stackTitle);

  setText("about-title", about.title);
  setText("about-description", about.description);
  setText("about-summary", about.careerSummary);
  setText("about-stack-note", about.stackNote);

  setAttr("profile-column", "aria-label", experiencesPage.profileAria);
  setAttr("contact-links-list", "aria-label", experiencesPage.linksAria);
  setText("profile-name", profile.name);
  setText("profile-role", profile.role);
  setText("profile-city", profile.location);
  setText("experience-title", experiencesPage.title);
  setText("aside-github-label", experiencesPage.links.github);
  setText("aside-linkedin-label", experiencesPage.links.linkedin);
  setText("aside-whatsapp-label", experiencesPage.links.whatsapp);
  setText("aside-resume-label", experiencesPage.links.resume);
  setAttr("aside-resume", "href", experiencesPage.resumePath);

  setText("contact-title", contactPage.title);
  setText("contact-intro", contactPage.intro);
  setText("contact-name-label", contactPage.fields.name);
  setText("contact-email-label", contactPage.fields.email);
  setText("contact-message-label", contactPage.fields.message);
  setText("contact-submit", contactPage.submit);

  setText("portfolio-title", portfolioPage.title);
  setText("portfolio-description", portfolioPage.description);
  setText("portfolio-github", portfolioPage.githubButton);

  setAttr("footer-github", "aria-label", footer.githubAria);
  setAttr("footer-linkedin", "aria-label", footer.linkedinAria);

  setLink("home-github", profile.github);
  setLink("portfolio-github", profile.github);
  setLink("footer-github", profile.github);
  setLink("aside-github", profile.github);
  setLink("footer-linkedin", profile.linkedin);
  setLink("aside-linkedin", profile.linkedin);
  setLink("aside-whatsapp", profile.whatsapp);
  setLink("profile-email", `mailto:${profile.email}`);
  setText("profile-email", profile.email);
  setLink("direct-email", `mailto:${profile.email}`);
  setText("direct-email", profile.email);

  renderStack("home-stack", stack.core, stack.tools);
  renderStack("about-stack", stack.core, stack.tools);
  renderExperience(experience);
  setupContactForm(profile, contactPage);
}

async function bootstrap() {
  setupTheme();
  setupMenu();

  try {
    const content = await loadJson(CONTENT_PATH);
    applyContent(content);
  } catch (error) {
    console.error(error);
  }

  setupRouting();
}

bootstrap();
