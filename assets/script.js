/**
 * Renders window.SiteConfig (data/site.js) into the skeleton in index.html.
 * No framework, no build step — the only contract is the element ids below.
 */
(function renderSite() {
  const config = window.SiteConfig;
  const app = document.getElementById("app");

  if (!config) {
    app.innerHTML =
      '<p class="error">Site data could not be loaded. Check that data/site.js is present.</p>';
    return;
  }

  /** status text -> pill modifier. Unknown statuses fall back to neutral grey. */
  const STATUS_TONE = {
    Live: "live",
    "Instagram only": "alt",
    "In development": "building",
    "Shipping soon": "building",
    Research: "research",
    "On hold": "paused",
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const isExternal = (url) => /^https?:/i.test(url);

  const anchor = (link, className, { label, stretch = false } = {}) => {
    const node = el("a", className, label ?? link.label);
    node.href = link.url;
    if (isExternal(link.url)) {
      node.target = "_blank";
      node.rel = "noopener noreferrer";
    }
    if (stretch) node.classList.add("stretch");
    return node;
  };

  const statusPill = (status) =>
    el("span", `pill pill--${STATUS_TONE[status] || "neutral"}`, status);

  /**
   * Live product card. The whole card is one big tap target for the first link
   * (`.stretch` covers the card via ::after); extra links sit above it.
   */
  const liveCard = (project, index) => {
    const item = el("li", "card");
    item.style.setProperty("--delay", `${Math.min(index, 8) * 60}ms`);

    const [primary, ...extras] = project.links || [];
    const head = el("div", "card__head");
    const title = el("h3", "card__title");

    if (primary) {
      title.append(
        anchor(primary, "card__link", { label: project.title, stretch: true }),
      );
    } else {
      title.textContent = project.title;
    }

    head.append(title, statusPill(project.status));
    item.append(head, el("p", "card__summary", project.summary || ""));

    if (project.description) {
      item.append(el("p", "card__description", project.description));
    }

    if (project.tags?.length) {
      const tags = el("ul", "tags");
      for (const tag of project.tags) tags.append(el("li", "tag", tag));
      item.append(tags);
    }

    const foot = el("div", "card__foot");
    if (primary) {
      foot.append(el("span", "card__host", primary.label));
    }
    for (const extra of extras) {
      foot.append(anchor(extra, "chip"));
    }
    if (foot.childElementCount) item.append(foot);

    return item;
  };

  /** In-progress row: title, status, one line. Deliberately not a big card. */
  const queueRow = (project) => {
    const item = el("li", "queue__item");
    const head = el("div", "queue__head");
    head.append(el("h3", "queue__title", project.title), statusPill(project.status));
    item.append(head, el("p", "queue__summary", project.summary || ""));

    if (project.links?.length) {
      const links = el("div", "card__foot");
      for (const link of project.links) links.append(anchor(link, "chip"));
      item.append(links);
    }

    return item;
  };

  const renderAvatar = (profile) => {
    const avatar = document.getElementById("profile-avatar");
    avatar.replaceChildren();

    if (!profile.avatarUrl) {
      avatar.textContent = profile.initials;
      return;
    }

    const image = document.createElement("img");
    image.className = "avatar__image";
    image.src = profile.avatarUrl;
    image.alt = "";
    image.width = 96;
    image.height = 96;
    image.decoding = "async";
    image.addEventListener("error", () => {
      avatar.classList.remove("avatar--photo");
      avatar.textContent = profile.initials;
    });

    avatar.classList.add("avatar--photo");
    avatar.append(image);
  };

  const renderHero = () => {
    const { profile } = config;

    renderAvatar(profile);
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-role").textContent = profile.role || "";
    document.getElementById("profile-tagline").textContent = profile.tagline || "";

    document
      .getElementById("profile-handle")
      .replaceChildren(
        anchor(
          { label: profile.handle, url: profile.handleUrl || "https://x.com/" },
          "hero__handle-link",
        ),
      );

    document.getElementById("profile-actions").replaceChildren(
      ...(profile.actions || []).map((action, index) =>
        anchor(action, index === 0 ? "button button--primary" : "button"),
      ),
    );

    const note = document.getElementById("profile-note");
    note.textContent = profile.note || "";
    note.hidden = !profile.note;
  };

  const renderLive = () => {
    document.getElementById("live-count").textContent = String(config.live.length);
    document
      .getElementById("live-list")
      .replaceChildren(...config.live.map(liveCard));
  };

  const renderNext = () => {
    const section = document.getElementById("next");
    const items = config.next || [];

    if (!items.length) {
      section.hidden = true;
      return;
    }

    document.getElementById("next-count").textContent = String(items.length);
    document.getElementById("next-list").replaceChildren(...items.map(queueRow));

    const note = document.getElementById("next-note");
    if (config.nextNote) {
      note.replaceChildren(anchor(config.nextNote, "chip chip--note"));
    } else {
      note.replaceChildren();
    }
  };

  const renderWork = () => {
    const section = document.getElementById("work");
    const { work } = config;

    if (!work) {
      section.hidden = true;
      return;
    }

    const card = document.getElementById("work-card");
    card.replaceChildren(el("h3", "card__title", work.title));

    if (work.role) card.append(el("p", "work__role", work.role));
    card.append(el("p", "card__description", work.summary || ""));

    if (work.link) {
      const foot = el("div", "card__foot");
      foot.append(anchor(work.link, "chip"));
      card.append(foot);
    }
  };

  const renderFooter = () => {
    document
      .getElementById("social-links")
      .replaceChildren(...config.socialLinks.map((link) => anchor(link, "chip")));

    document
      .getElementById("meta-links")
      .replaceChildren(
        ...(config.metaLinks || []).map((link) => anchor(link, "chip chip--quiet")),
      );

    const updated = new Date(`${config.lastUpdated}T00:00:00`);
    document.getElementById("last-updated").textContent = Number.isNaN(
      updated.getTime(),
    )
      ? `Last updated ${config.lastUpdated}`
      : `Last updated ${updated.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`;
  };

  renderHero();
  renderLive();
  renderNext();
  renderWork();
  renderFooter();

  app.dataset.rendered = "true";
})();
