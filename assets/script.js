(function renderSite() {
  const config = window.SiteConfig;

  if (!config) {
    document.getElementById("app").innerHTML =
      '<p class="error">Site data could not be loaded.</p>';
    return;
  }

  const STATUS_CLASS = {
    Live: "status-live",
    Published: "status-live",
    Research: "status-research",
    "In development": "status-progress",
    "Shipping soon": "status-progress",
    "Day-to-day": "status-neutral",
    "On hold": "status-muted",
    Polishing: "status-progress",
  };

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

  const createLink = (link, className = "text-link", options = {}) => {
    const anchor = document.createElement("a");
    anchor.className = className;
    anchor.href = link.url;
    anchor.textContent = link.label;
    anchor.rel = "noopener noreferrer";

    if (!link.url.startsWith("mailto:") && !link.url.startsWith("#")) {
      anchor.target = "_blank";
      if (!className.includes("button")) {
        const icon = createElement("span", "text-link__icon", "↗");
        icon.setAttribute("aria-hidden", "true");
        anchor.append(icon);
      }
      anchor.setAttribute(
        "aria-label",
        options.ariaLabel || `${link.label} (opens in a new tab)`,
      );
    }

    return anchor;
  };

  const formatUpdatedDate = (value) => {
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderProfile = () => {
    const { profile } = config;

    document.getElementById("profile-avatar").textContent = profile.initials;
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-tagline").textContent = profile.tagline;

    const handleContainer = document.getElementById("profile-handle");
    handleContainer.replaceChildren(
      createLink(
        {
          label: profile.handle,
          url: profile.handleUrl || profile.primaryCta.url,
        },
        "profile-handle-link",
        { ariaLabel: `${profile.handle} on X (opens in a new tab)` },
      ),
    );

    const actions = document.getElementById("hero-actions");
    actions.replaceChildren(
      createLink(profile.primaryCta, "button button-primary", {
        ariaLabel: `${profile.primaryCta.label} (opens in a new tab)`,
      }),
      createLink(profile.secondaryCta, "button button-secondary", {
        ariaLabel: `${profile.secondaryCta.label} (opens in a new tab)`,
      }),
    );

    const publishedCount = config.sections.published.length;
    const ongoingCount = config.sections.ongoing.length;
    const stats = document.getElementById("hero-stats");
    stats.replaceChildren(
      createElement("li", "hero-stat", ""),
      createElement("li", "hero-stat", ""),
    );
    stats.children[0].innerHTML = `<strong>${publishedCount}</strong> live project${
      publishedCount === 1 ? "" : "s"
    }`;
    stats.children[1].innerHTML = `<strong>${ongoingCount}</strong> in progress`;

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
    const titleRow = createElement("div", "project-card-title-row");
    const title = createElement("h3", "", project.title);
    const status = createElement(
      "span",
      `status-pill ${STATUS_CLASS[project.status] || "status-neutral"}`,
      project.status,
    );
    const description = createElement("p", "project-description", project.description);
    const tags = createElement("div", "tag-list");
    const links = createElement("div", "project-links");

    titleRow.append(title, status);
    header.append(titleRow);

    for (const tag of project.tags || []) {
      tags.append(createElement("span", "tag", tag));
    }

    for (const [index, link] of (project.links || []).entries()) {
      const className =
        index === 0 ? "text-link text-link--primary" : "text-link";
      links.append(createLink(link, className));
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
      `Last updated ${formatUpdatedDate(config.lastUpdated)}`;
  };

  renderProfile();
  renderProjectSection("published-projects", config.sections.published);
  renderProjectSection("ongoing-projects", config.sections.ongoing);
  renderFooter();
})();
