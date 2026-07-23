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

  const UPCOMING_GROUPS = [
    {
      key: "shipping",
      title: "Shipping next",
      hint: "Launch-ready or very close to public.",
    },
    {
      key: "building",
      title: "Active development",
      hint: "Building in private — follow on X for progress.",
    },
    {
      key: "research",
      title: "Research",
      hint: "Data-driven experiments and prototypes.",
    },
    {
      key: "company",
      title: "Day job",
      hint: "What I run full time alongside side projects.",
    },
    {
      key: "backlog",
      title: "On hold",
      hint: "Paused for now — may return later.",
    },
  ];

  const PAGE_NAV = [
    { href: "#live-section", label: "Live" },
    { href: "#next-section", label: "Next" },
    { href: "#connect", label: "Connect" },
  ];

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
      if (!className.includes("button") && !options.hideIcon) {
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

  const primaryLink = (project) =>
    (project.links || []).find((link) =>
      /open site|website|try now|instagram|performance|source/i.test(link.label),
    ) || project.links?.[0];

  const linkMetaLabel = (url, fallbackLabel) => {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      return host;
    } catch {
      return fallbackLabel || url;
    }
  };

  const createOverviewItem = (project, options = {}) => {
    const item = createElement("li", "overview-list__item");
    const link = primaryLink(project);

    if (!link || options.titleOnly) {
      item.textContent = project.title;
      return item;
    }

    if (options.titleOnlyWhenNoPublicLink && /updates on x/i.test(link.label)) {
      item.textContent = project.title;
      return item;
    }

    const anchor = document.createElement("a");
    anchor.className = "overview-link";
    anchor.href = link.url;
    anchor.rel = "noopener noreferrer";
    anchor.target = "_blank";
    anchor.setAttribute(
      "aria-label",
      `Open ${project.title} — ${linkMetaLabel(link.url, link.label)} (opens in a new tab)`,
    );

    anchor.append(
      createElement("span", "overview-link__title", project.title),
      createElement(
        "span",
        "overview-link__meta",
        options.metaLabel || linkMetaLabel(link.url, link.label),
      ),
    );
    item.append(anchor);
    return item;
  };

  const createSocialOverviewItem = (link) => {
    const item = createElement("li", "overview-list__item");
    const anchor = document.createElement("a");
    anchor.className = "overview-link";
    anchor.href = link.url;
    anchor.rel = "noopener noreferrer";
    anchor.target = "_blank";
    anchor.setAttribute(
      "aria-label",
      `${link.label} (opens in a new tab)`,
    );
    anchor.append(
      createElement("span", "overview-link__title", link.label),
      createElement("span", "overview-link__meta", linkMetaLabel(link.url, link.label)),
    );
    item.append(anchor);
    return item;
  };

  const renderAvatar = (profile) => {
    const avatar = document.getElementById("profile-avatar");
    avatar.replaceChildren();

    if (!profile.avatarUrl) {
      avatar.textContent = profile.initials;
      avatar.classList.remove("avatar--photo");
      return;
    }

    const image = document.createElement("img");
    image.className = "avatar__image";
    image.src = profile.avatarUrl;
    image.alt = profile.name;
    image.width = 80;
    image.height = 80;
    image.decoding = "async";
    image.loading = "eager";
    image.addEventListener("error", () => {
      avatar.classList.remove("avatar--photo");
      avatar.textContent = profile.initials;
    });

    avatar.classList.add("avatar--photo");
    avatar.append(image);
  };

  const renderProfile = () => {
    const { profile } = config;

    renderAvatar(profile);
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-role").textContent = profile.role || "";
    document.getElementById("profile-tagline").textContent = profile.tagline;

    document.getElementById("profile-handle").replaceChildren(
      createLink(
        {
          label: profile.handle,
          url: profile.handleUrl || profile.primaryCta.url,
        },
        "profile-handle-link",
        { ariaLabel: `${profile.handle} on X (opens in a new tab)`, hideIcon: true },
      ),
    );

    document.getElementById("hero-actions").replaceChildren(
      createLink(profile.primaryCta, "button button-primary", {
        ariaLabel: `${profile.primaryCta.label} (opens in a new tab)`,
      }),
      createLink(profile.secondaryCta, "button button-secondary", {
        ariaLabel: `${profile.secondaryCta.label} (opens in a new tab)`,
      }),
    );

    const liveCount = config.sections.published.length;
    const upcomingCount = config.sections.upcoming.length;
    const shippingCount = config.sections.upcoming.filter(
      (project) => project.group === "shipping",
    ).length;

    const stats = document.getElementById("hero-stats");
    stats.replaceChildren(
      createElement("li", "hero-stat hero-stat--live", ""),
      createElement("li", "hero-stat hero-stat--next", ""),
      createElement("li", "hero-stat hero-stat--total", ""),
    );
    stats.children[0].innerHTML = `<strong>${liveCount}</strong> live`;
    stats.children[1].innerHTML = `<strong>${shippingCount || upcomingCount}</strong> upcoming`;
    stats.children[2].innerHTML = `<strong>${liveCount + upcomingCount}</strong> total tracked`;

    document.getElementById("page-nav").replaceChildren(
      ...PAGE_NAV.map((item) => {
        const link = createElement("a", "page-nav__link", item.label);
        link.href = item.href;
        return link;
      }),
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

  const renderOverview = () => {
    const grid = document.getElementById("overview-grid");
    const liveColumn = createElement("div", "overview-column");
    const nextColumn = createElement("div", "overview-column");
    const connectColumn = createElement("div", "overview-column");

    liveColumn.append(
      createElement("h3", "overview-title", "Try now"),
      createElement("p", "overview-hint", "Open a live product in one click."),
    );
    const liveList = createElement("ul", "overview-list");
    for (const project of config.sections.published) {
      liveList.append(createOverviewItem(project));
    }
    liveColumn.append(liveList);

    nextColumn.append(
      createElement("h3", "overview-title", "Coming up"),
      createElement("p", "overview-hint", "What I am shipping or building next."),
    );
    const nextList = createElement("ul", "overview-list");
    for (const project of config.sections.upcoming.filter((entry) =>
      ["building", "research"].includes(entry.group),
    )) {
      nextList.append(
        createOverviewItem(project, {
          titleOnlyWhenNoPublicLink: true,
          metaLabel:
            project.links?.[0]?.label === "Source"
              ? "GitHub"
              : linkMetaLabel(project.links?.[0]?.url || "", project.links?.[0]?.label),
        }),
      );
    }
    nextColumn.append(nextList);

    connectColumn.append(
      createElement("h3", "overview-title", "Follow along"),
      createElement("p", "overview-hint", "Best place for build updates."),
    );
    const connectList = createElement("ul", "overview-list");
    for (const link of config.socialLinks) {
      connectList.append(createSocialOverviewItem(link));
    }
    connectColumn.append(connectList);

    grid.replaceChildren(liveColumn, nextColumn, connectColumn);
  };

  const renderProjectCard = (project, index = 0) => {
    const card = createElement("article", "project-card");
    card.dataset.stage = project.group || "live";
    card.style.setProperty("--card-delay", `${Math.min(index, 6) * 45}ms`);

    const header = createElement("div", "project-card-header");
    const titleRow = createElement("div", "project-card-title-row");
    const title = createElement("h3", "project-card__title", project.title);
    const status = createElement(
      "span",
      `status-pill ${STATUS_CLASS[project.status] || "status-neutral"}`,
      project.status,
    );
    const summary = createElement("p", "project-summary", project.summary || "");
    const description = createElement("p", "project-description", project.description);
    const tags = createElement("div", "tag-list");
    const links = createElement("div", "project-links");

    titleRow.append(title, status);
    header.append(titleRow, summary);

    for (const tag of project.tags || []) {
      tags.append(createElement("span", "tag", tag));
    }

    for (const [linkIndex, link] of (project.links || []).entries()) {
      const className =
        linkIndex === 0 ? "text-link text-link--primary" : "text-link";
      links.append(createLink(link, className));
    }

    card.append(header, description, tags, links);
    return card;
  };

  const renderLiveSection = () => {
    const container = document.getElementById("published-projects");
    container.replaceChildren(
      ...config.sections.published.map((project, index) =>
        renderProjectCard(project, index),
      ),
    );
  };

  const renderUpcomingSection = () => {
    const container = document.getElementById("upcoming-groups");
    const groups = [];

    for (const group of UPCOMING_GROUPS) {
      const projects = config.sections.upcoming.filter(
        (project) => project.group === group.key,
      );
      if (projects.length === 0) {
        continue;
      }

      const wrapper = createElement("section", "project-group");
      wrapper.setAttribute("aria-labelledby", `group-${group.key}`);

      const groupHeader = createElement("div", "project-group-header");
      groupHeader.append(
        createElement("h3", "project-group-title", group.title),
        createElement("p", "project-group-hint", group.hint),
      );
      groupHeader.querySelector(".project-group-title").id = `group-${group.key}`;

      const grid = createElement("div", "project-grid");
      grid.replaceChildren(
        ...projects.map((project, index) => renderProjectCard(project, index)),
      );

      wrapper.append(groupHeader, grid);
      groups.push(wrapper);
    }

    container.replaceChildren(...groups);
  };

  const renderFooter = () => {
    document.getElementById("social-links").replaceChildren(
      ...config.socialLinks.map((link) => createLink(link, "social-link")),
    );

    document.getElementById("meta-links").replaceChildren(
      ...(config.metaLinks || []).map((link) => createLink(link, "meta-link")),
    );

    document.getElementById("last-updated").textContent =
      `Last updated ${formatUpdatedDate(config.lastUpdated)}`;
  };

  renderProfile();
  renderOverview();
  renderLiveSection();
  renderUpcomingSection();
  renderFooter();
})();
