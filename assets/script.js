(function renderSite() {
  const config = window.SiteConfig;

  if (!config) {
    document.getElementById("app").innerHTML =
      '<p class="error">Site data could not be loaded.</p>';
    return;
  }

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  };

  const createLink = (link, className = "text-link") => {
    const anchor = document.createElement("a");
    anchor.className = className;
    anchor.href = link.url;
    anchor.textContent = link.label;
    anchor.rel = "noopener noreferrer";

    if (!link.url.startsWith("mailto:") && !link.url.startsWith("#")) {
      anchor.target = "_blank";
    }

    return anchor;
  };

  const renderProfile = () => {
    const { profile } = config;

    document.getElementById("profile-avatar").textContent = profile.initials;
    document.getElementById("profile-handle").textContent = profile.handle;
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-tagline").textContent = profile.tagline;

    const actions = document.getElementById("hero-actions");
    actions.replaceChildren(
      createLink(profile.primaryCta, "button button-primary"),
      createLink(profile.secondaryCta, "button button-secondary"),
    );

    const changelog = document.getElementById("profile-changelog");
    if (profile.changelog) {
      changelog.textContent = profile.changelog;
      changelog.hidden = false;
    } else {
      changelog.textContent = "";
      changelog.hidden = true;
    }
  };

  const renderProjectCard = (project) => {
    const card = createElement("article", "project-card");
    const header = createElement("div", "project-card-header");
    const title = createElement("h3", "", project.title);
    const status = createElement("span", "status-pill", project.status);
    const description = createElement("p", "project-description", project.description);
    const tags = createElement("div", "tag-list");
    const links = createElement("div", "project-links");

    header.append(title, status);

    for (const tag of project.tags || []) {
      tags.append(createElement("span", "tag", tag));
    }

    for (const link of project.links || []) {
      links.append(createLink(link));
    }

    card.append(header, description, tags, links);
    return card;
  };

  const renderProjectSection = (containerId, projects) => {
    const container = document.getElementById(containerId);
    const cards = projects.map(renderProjectCard);
    container.replaceChildren(...cards);
  };

  const renderFooter = () => {
    const socialLinks = document.getElementById("social-links");
    socialLinks.replaceChildren(
      ...config.socialLinks.map((link) => createLink(link, "social-link")),
    );

    document.getElementById("last-updated").textContent =
      `Last updated ${config.lastUpdated}`;
  };

  renderProfile();
  renderProjectSection("published-projects", config.sections.published);
  renderProjectSection("ongoing-projects", config.sections.ongoing);
  renderFooter();
})();
