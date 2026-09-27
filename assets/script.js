/**
 * Renders window.SiteConfig (data/site.js) into the skeleton in index.html.
 * No framework, no build step. The only contract is the element ids below.
 */
(function renderSite() {
  "use strict";

  const config = window.SiteConfig;
  const app = document.getElementById("app");
  document.documentElement.classList.add("js");

  if (!config) {
    app.innerHTML =
      '<p class="error">Site data could not be loaded. Check that data/site.js is present.</p>';
    return;
  }

  /** status text -> pill modifier. Unknown statuses fall back to neutral grey. */
  const STATUS_TONE = {
    Live: "live",
    "In development": "building",
    "Shipping soon": "building",
    Research: "research",
    "On hold": "paused",
    Closed: "closed",
  };

  const STROKE =
    'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

  /** Inline icons. Constants only: no data from site.js ever goes through innerHTML. */
  const ICONS = {
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    github:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.9-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z"/></svg>',
    pause:
      '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>',
    soundOff: `<svg ${STROKE}><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>`,
    soundOn: `<svg ${STROKE}><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>`,
    expand: `<svg ${STROKE}><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>`,
    shrink: `<svg ${STROKE}><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>`,
    external: `<svg ${STROKE}><path d="M7 17 17 7M8 7h9v9"/></svg>`,
    arrow: `<svg ${STROKE}><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  };

  const byId = (id) => document.getElementById(id);
  const motionOK = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock = (s) => {
    const whole = Math.round(s);
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null && text !== "") node.textContent = text;
    return node;
  };

  const icon = (name, className = "icon") => {
    const node = el("span", className);
    node.setAttribute("aria-hidden", "true");
    node.innerHTML = ICONS[name] || "";
    return node;
  };

  const isExternal = (url) => /^https?:/i.test(url);

  /**
   * A link. External ones open in a new tab and say so to screen readers; unless the link
   * leads with a brand icon, a trailing ↗ says so visually too.
   */
  const anchor = (link, className, { label, stretch = false, iconName, trailing = !iconName } = {}) => {
    const node = el("a", className);
    node.href = link.url;
    if (iconName && ICONS[iconName]) node.append(icon(iconName));
    node.append(el("span", "link-text", label ?? link.label));
    if (isExternal(link.url)) {
      node.target = "_blank";
      node.rel = "noopener noreferrer";
      if (trailing) node.append(icon("external", "icon icon--external"));
      node.append(el("span", "sr-only", " (opens in a new tab)"));
    }
    if (stretch) node.classList.add("stretch");
    return node;
  };

  const statusPill = (status) =>
    el("span", `pill pill--${STATUS_TONE[status] || "neutral"}`, status);

  /** "Placing *by day*" -> text and <em> nodes. Only asterisks are read; no HTML is parsed. */
  const withAccents = (text) => {
    const nodes = [];
    let last = 0;
    let count = 0;
    for (const match of text.matchAll(/\*([^*]+)\*/g)) {
      if (match.index > last) nodes.push(document.createTextNode(text.slice(last, match.index)));
      count += 1;
      nodes.push(el("em", `accent accent--${count}`, match[1]));
      last = match.index + match[0].length;
    }
    if (last < text.length) nodes.push(document.createTextNode(text.slice(last)));
    return nodes;
  };

  const plain = (text) => (text || "").replace(/\*([^*]+)\*/g, "$1");

  /** Set by renderFeatured; the hero's "Watch" action talks to it. */
  let player = null;

  /* ---------- hero ---------- */

  const renderAvatar = (profile) => {
    const avatar = byId("profile-avatar");
    avatar.replaceChildren();

    if (!profile.avatarUrl) {
      avatar.textContent = profile.initials;
      return;
    }

    const image = document.createElement("img");
    image.className = "avatar__image";
    image.src = profile.avatarUrl;
    image.alt = profile.name;
    image.width = 400;
    image.height = 400;
    image.decoding = "async";
    image.fetchPriority = "high";
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
    byId("profile-name").textContent = profile.name;
    byId("brand-name").textContent = profile.name;
    byId("profile-handle").replaceChildren(
      anchor(
        { label: profile.handle, url: profile.handleUrl || "https://x.com/" },
        "hero__handle-link",
        { trailing: false },
      ),
    );
    byId("profile-headline").replaceChildren(...withAccents(profile.headline || ""));
    byId("profile-intro").textContent = profile.intro || "";

    const announcement = byId("announcement");
    if (profile.announcement) {
      const { label, text, url } = profile.announcement;
      announcement.href = url;
      if (isExternal(url)) {
        announcement.target = "_blank";
        announcement.rel = "noopener noreferrer";
      }
      announcement.replaceChildren(
        el("span", "announcement__label", label),
        el("span", "announcement__text", text),
        icon("arrow", "icon announcement__arrow"),
      );
      announcement.hidden = false;
    }

    byId("profile-actions").replaceChildren(
      ...(profile.actions || []).map((action, index) => {
        let tone = "button";
        if (index === 0) tone = "button button--primary";
        else if (action.icon === "play") tone = "button button--ghost";

        const link = anchor(action, tone, { iconName: action.icon });
        if (action.icon === "play") {
          link.addEventListener("click", (event) => {
            if (!player) return;
            event.preventDefault();
            player.watch();
          });
        }
        return link;
      }),
    );

    const follow = anchor(
      { label: "Follow", url: profile.handleUrl || "https://x.com/" },
      "button button--primary button--small",
      { iconName: "x", trailing: false },
    );
    follow.setAttribute("aria-label", `Follow ${profile.handle} on X (opens in a new tab)`);
    byId("topbar-action").replaceChildren(follow);

    const day = config.work?.title;
    const night = config.featured?.title;
    byId("orbit-day").textContent = day || "";
    byId("orbit-night").textContent = night || "";
    byId("orbit-day").closest(".orbit").hidden = !day;
    byId("orbit-night").closest(".orbit").hidden = !night;
  };

  /* ---------- featured: the explainer player ---------- */

  /**
   * Plays muted and inline once it is on screen (browsers only autoplay muted video), loops,
   * and pauses when scrolled away. A pause the reader chose sticks. With reduced motion or
   * Save-Data it waits for a press. Nothing loads until the player is near the screen.
   * Phones get the 4:5 cut, wider screens 16:9; each in the first format the browser plays.
   */
  const buildPlayer = (video) => {
    const mount = byId("feature-player");
    const tall = window.matchMedia("(max-width: 719px)").matches && video?.sources?.tall?.length;
    const shape = tall ? "tall" : "wide";
    const sources = video?.sources?.[shape] || [];

    if (!sources.length) {
      mount.hidden = true;
      return null;
    }

    const chapters = [...(video.chapters || [])].sort((a, b) => a.at - b.at);
    const seconds = Math.round(video.duration || 0);
    const autoplay = motionOK() && !navigator.connection?.saveData;

    const media = document.createElement("video");
    media.className = "player__video";
    media.muted = true;
    media.defaultMuted = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = "none";
    media.setAttribute("muted", "");
    media.setAttribute("playsinline", "");
    // The frame below carries the name; the captions, transcript and buttons carry the rest.
    media.setAttribute("aria-hidden", "true");

    const source = sources.find((s) => media.canPlayType(s.type)) || sources[sources.length - 1];
    const poster = video.posters?.[shape];
    const total = () =>
      Number.isFinite(media.duration) && media.duration > 0 ? media.duration : video.duration || 1;
    const endOf = (i) => (i + 1 < chapters.length ? chapters[i + 1].at : total());

    const setButton = (button, iconName, label) => {
      button.replaceChildren(icon(iconName));
      button.setAttribute("aria-label", label);
    };
    const controlButton = (iconName, label) => {
      const button = el("button", "player__btn");
      button.type = "button";
      setButton(button, iconName, label);
      return button;
    };

    /* the frame: the video, its controls, and a progress bar split by chapter */

    const frame = el("div", "player__frame");
    frame.setAttribute("role", "group");
    frame.setAttribute("aria-label", `${video.label}: a ${seconds}-second animation without narration`);
    frame.setAttribute("aria-describedby", "player-now");

    const bigPlay = el("button", "player__big-play");
    bigPlay.type = "button";
    bigPlay.append(icon("play"), el("span", null, `Play the ${seconds}-second explainer`));
    bigPlay.hidden = autoplay;

    const fallback = video.fallback
      ? anchor(video.fallback, "player__fallback button button--gold")
      : el("span");
    fallback.hidden = true;

    const soundButton = controlButton("soundOff", "Turn the sound on");
    soundButton.classList.add("player__btn--sound");
    soundButton.setAttribute("aria-pressed", "false");
    const playButton = controlButton("play", "Play the video");
    const screenButton = controlButton("expand", "Watch full screen");
    screenButton.hidden = !(
      document.fullscreenEnabled || typeof media.webkitEnterFullscreen === "function"
    );

    const controls = el("div", "player__controls");
    controls.append(soundButton, playButton, screenButton);

    const progress = el("div", "player__progress");
    progress.setAttribute("aria-hidden", "true");
    const segments = chapters.map((chapter, i) => {
      const segment = el("span", "player__segment");
      segment.style.flexGrow = String(endOf(i) - chapter.at);
      segment.append(el("i"));
      return segment;
    });
    progress.append(...segments);

    frame.append(media, bigPlay, fallback, controls, progress);

    /*
     * The caption for the current chapter. Every chapter's caption is rendered into the same
     * grid cell and only the current one is visible, so the block is always as tall as the
     * longest one and the page below never jumps when the chapter changes.
     */
    const now = el("div", "player__now");
    now.id = "player-now";
    const captions = chapters.map((chapter, index) => {
      const caption = el("p", "player__caption");
      caption.append(
        el("span", "player__caption-meta", `Chapter ${index + 1} of ${chapters.length} · ${chapter.label}`),
        el("span", "player__caption-title", chapter.title),
        el("span", "player__caption-text", chapter.text),
      );
      return caption;
    });
    now.append(...captions);

    /* the chapter list, each a button that plays from there */

    const list = el("ol", "chapters");

    const items = chapters.map((chapter, index) => {
      const item = el("li", "chapters__item");
      const button = el("button", "chapter");
      button.type = "button";
      button.setAttribute(
        "aria-label",
        `Play from ${clock(chapter.at)}, ${chapter.label}: ${chapter.title}`,
      );

      if (chapter.thumb) {
        const thumb = document.createElement("img");
        thumb.className = "chapter__thumb";
        thumb.src = chapter.thumb;
        thumb.alt = "";
        thumb.width = 480;
        thumb.height = 270;
        thumb.loading = "lazy";
        thumb.decoding = "async";
        button.append(thumb);
      }

      const meta = el("span", "chapter__meta");
      meta.append(el("span", "chapter__time", clock(chapter.at)), el("span", "chapter__label", chapter.label));
      const bar = el("span", "chapter__bar");
      bar.append(el("i"));
      button.append(meta, el("span", "chapter__title", chapter.title), bar);
      button.addEventListener("click", () => seek(index));

      item.append(button);
      return { item, button, bar };
    });
    list.append(...items.map(({ item }) => item));

    const head = el("div", "player__head");
    head.append(el("p", "player__label", video.label), el("p", "player__note", video.note));

    /* the same story as text, for anyone who would rather read it */

    const transcript = el("details", "transcript");
    const lines = el("ol", "transcript__list");
    for (const chapter of chapters) {
      const line = el("li");
      line.append(
        el("span", "transcript__time", clock(chapter.at)),
        el("strong", "transcript__title", chapter.title),
        el("span", "transcript__text", chapter.text),
      );
      lines.append(line);
    }
    transcript.append(el("summary", null, "Read the video as text"), lines);

    mount.dataset.shape = shape;
    mount.dataset.state = "idle";
    mount.dataset.sound = "off";
    mount.replaceChildren(head, frame, list, now, transcript);

    /* behaviour */

    let loaded = false;
    let heldByReader = false;
    let inView = false;
    let active = -1;
    let pendingSeek = null;
    let frameRequest = 0;
    let listTouched = 0;

    const load = () => {
      if (loaded) return;
      loaded = true;
      if (poster) media.poster = poster;
      media.src = source.src;
    };

    const start = () => {
      load();
      const attempt = media.play();
      if (attempt && typeof attempt.then === "function") {
        attempt.then(
          () => {
            bigPlay.hidden = true;
          },
          (error) => {
            // Only a refusal counts; a play() cut short by a pause is not.
            if (error?.name === "NotAllowedError") bigPlay.hidden = false;
          },
        );
      }
    };

    const playByReader = ({ sound = false } = {}) => {
      heldByReader = false;
      if (sound) media.muted = false;
      start();
    };

    const pauseByReader = () => {
      heldByReader = true;
      media.pause();
    };

    const toggle = () => (media.paused ? playByReader() : pauseByReader());

    const indexAt = (t) => {
      let index = 0;
      chapters.forEach((chapter, i) => {
        if (t >= chapter.at) index = i;
      });
      return index;
    };

    const setActive = (index) => {
      if (!chapters.length) return;
      active = index;
      items.forEach(({ button }, i) => {
        if (i === index) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
      });
      captions.forEach((caption, i) => caption.classList.toggle("is-current", i === index));

      // On phones the list scrolls sideways: keep the current chapter in it, never moving the page.
      const scrollable = list.scrollWidth > list.clientWidth + 4;
      if (scrollable && Date.now() - listTouched > 4000) {
        const target = items[index].item;
        const left = target.offsetLeft - (list.clientWidth - target.offsetWidth) / 2;
        list.scrollTo({ left: Math.max(0, left), behavior: motionOK() ? "smooth" : "auto" });
      }
    };

    const sync = () => {
      const t = media.currentTime || 0;
      const index = indexAt(t);
      chapters.forEach((chapter, i) => {
        let fill = 0;
        if (i < index) fill = 1;
        else if (i === index) fill = Math.min(1, Math.max(0, (t - chapter.at) / (endOf(i) - chapter.at || 1)));
        items[i].bar.style.setProperty("--fill", fill.toFixed(4));
        segments[i].style.setProperty("--fill", fill.toFixed(4));
      });
      if (index !== active) setActive(index);
    };

    const tick = () => {
      sync();
      frameRequest = media.paused ? 0 : requestAnimationFrame(tick);
    };

    const seek = (index) => {
      const at = chapters[index].at + 0.05;
      load();
      if (media.readyState >= 1) {
        media.currentTime = at;
        sync();
      } else {
        pendingSeek = at;
        setActive(index);
      }
      playByReader();

      // On phones the list sits under the video: bring the video back if it has scrolled off.
      const rect = frame.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        frame.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "center" });
      }
    };

    media.addEventListener("play", () => {
      mount.dataset.state = "playing";
      setButton(playButton, "pause", "Pause the video");
      bigPlay.hidden = true;
      if (!frameRequest) frameRequest = requestAnimationFrame(tick);
    });

    media.addEventListener("pause", () => {
      mount.dataset.state = "paused";
      setButton(playButton, "play", "Play the video");
      cancelAnimationFrame(frameRequest);
      frameRequest = 0;
      sync();
    });

    media.addEventListener("timeupdate", () => {
      if (!frameRequest) sync();
    });
    media.addEventListener("seeked", sync);

    media.addEventListener("loadedmetadata", () => {
      if (pendingSeek != null) {
        media.currentTime = pendingSeek;
        pendingSeek = null;
      }
    });

    media.addEventListener("volumechange", () => {
      const muted = media.muted;
      setButton(soundButton, muted ? "soundOff" : "soundOn", muted ? "Turn the sound on" : "Turn the sound off");
      soundButton.setAttribute("aria-pressed", String(!muted));
      mount.dataset.sound = muted ? "off" : "on";
    });

    media.addEventListener("error", () => {
      mount.dataset.state = "error";
      bigPlay.hidden = true;
      controls.hidden = true;
      fallback.hidden = false;
    });

    media.addEventListener("click", toggle);
    playButton.addEventListener("click", toggle);
    bigPlay.addEventListener("click", () => playByReader({ sound: true }));

    soundButton.addEventListener("click", () => {
      media.muted = !media.muted;
      if (!media.muted && media.paused) playByReader();
    });

    screenButton.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (document.fullscreenEnabled && frame.requestFullscreen) {
        frame.requestFullscreen().catch(() => {});
      } else if (typeof media.webkitEnterFullscreen === "function") {
        // iPhone: only the video element itself can go full screen, with the system controls.
        playByReader();
        try {
          media.webkitEnterFullscreen();
        } catch {
          /* not ready yet; the next press will work */
        }
      }
    });

    document.addEventListener("fullscreenchange", () => {
      const on = document.fullscreenElement === frame;
      setButton(screenButton, on ? "shrink" : "expand", on ? "Leave full screen" : "Watch full screen");
    });

    for (const type of ["pointerdown", "wheel", "touchstart"]) {
      list.addEventListener(type, () => {
        listTouched = Date.now();
      }, { passive: true });
    }

    if ("IntersectionObserver" in window) {
      const near = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          load();
          near.disconnect();
        }
      }, { rootMargin: "800px 0px" });
      near.observe(frame);

      new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          inView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
          if (inView) {
            if (autoplay && !heldByReader && media.paused) start();
          } else if (!entry.isIntersecting && !media.paused) {
            media.pause();
          }
        },
        { threshold: [0, 0.35] },
      ).observe(frame);
    } else {
      load();
      bigPlay.hidden = false;
    }

    // A tab opened in the background (a link from X) cannot start muted video until it is shown.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && inView && autoplay && !heldByReader && media.paused) start();
    });

    setActive(0);

    return {
      /** "Watch the explainer": from the top, with sound, because the reader asked for it. */
      watch() {
        load();
        if (media.readyState >= 1) media.currentTime = 0;
        else pendingSeek = 0;
        playByReader({ sound: true });
        frame.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "center" });
      },
    };
  };

  const renderFeatured = () => {
    const section = byId("lanes");
    const feature = config.featured;

    if (!feature) {
      section.hidden = true;
      return;
    }

    byId("feature-eyebrow").textContent = feature.eyebrow || "";
    const logo = byId("feature-logo");
    if (feature.logo) logo.src = feature.logo;
    else logo.hidden = true;
    byId("feature-title").textContent = feature.title;
    byId("feature-status").replaceChildren(...(feature.status ? [statusPill(feature.status)] : []));
    byId("feature-tagline").textContent = feature.tagline || "";
    byId("feature-description").textContent = feature.description || "";

    byId("feature-stats").replaceChildren(
      ...(feature.stats || []).map((stat) => {
        const group = el("div", "stat");
        group.append(el("dt", "stat__label", stat.label), el("dd", "stat__value", stat.value));
        return group;
      }),
    );
    byId("feature-promise").textContent = feature.promise || "";
    byId("feature-links").replaceChildren(
      ...(feature.links || []).map((link, index) =>
        anchor(link, index === 0 ? "button button--gold" : "button"),
      ),
    );

    const topics = feature.topics?.items || [];
    byId("feature-topics-label").textContent = feature.topics?.label || "";
    byId("feature-topics").replaceChildren(
      ...topics.map((topic) => {
        const item = el("li");
        item.append(anchor(topic, "topic"));
        return item;
      }),
    );
    byId("feature-topics").parentElement.hidden = !topics.length;

    player = buildPlayer(feature.video);
  };

  /* ---------- by night: products and the lab ---------- */

  /**
   * Product card. The whole card is one big tap target for the first link
   * (`.stretch` covers the card via ::after); extra links sit above it as chips.
   */
  const productCard = (project, index) => {
    const item = el("li", "product reveal");
    item.style.setProperty("--delay", `${Math.min(index, 5) * 90}ms`);
    if (project.accent) item.style.setProperty("--accent", project.accent);

    const [primary, ...extras] = project.links || [];

    if (project.image) {
      const media = el("div", "product__media");
      const image = document.createElement("img");
      image.src = project.image;
      image.alt = "";
      image.width = 960;
      image.height = 600;
      image.loading = "lazy";
      image.decoding = "async";
      media.append(image);
      item.append(media);
    }

    const body = el("div", "product__body");
    const head = el("div", "product__head");
    const title = el("h3", "product__title");

    if (primary) {
      title.append(
        anchor(primary, "product__link", { label: project.title, stretch: true, trailing: false }),
      );
    } else {
      title.textContent = project.title;
    }

    head.append(title, statusPill(project.status));
    body.append(head, el("p", "product__summary", project.summary || ""));

    if (project.description) {
      body.append(el("p", "product__description", project.description));
    }

    if (project.tags?.length) {
      const tags = el("ul", "tags");
      for (const tag of project.tags) tags.append(el("li", "tag", tag));
      body.append(tags);
    }

    const foot = el("div", "product__foot");
    if (primary) {
      const host = el("span", "product__host");
      host.append(el("span", null, primary.label), icon("external", "icon icon--external"));
      foot.append(host);
    }
    for (const extra of extras) foot.append(anchor(extra, "chip"));
    if (foot.childElementCount) body.append(foot);

    item.append(body);
    return item;
  };

  const renderLive = () => {
    const live = config.live || [];
    byId("live-count").textContent = String(live.length);
    byId("live-list").replaceChildren(...live.map(productCard));
    byId("live").hidden = !live.length;
  };

  /** In-the-lab row: title, status, one line. Deliberately not a big card. */
  const labRow = (project) => {
    const item = el("li", "lab__item");
    const head = el("div", "lab__head");
    head.append(el("h3", "lab__title", project.title), statusPill(project.status));
    item.append(head, el("p", "lab__summary", project.summary || ""));

    if (project.links?.length) {
      const links = el("div", "lab__links");
      for (const link of project.links) links.append(anchor(link, "chip"));
      item.append(links);
    }

    return item;
  };

  const renderNext = () => {
    const section = byId("lab");
    const items = config.next || [];

    if (!items.length) {
      section.hidden = true;
      return;
    }

    byId("next-count").textContent = String(items.length);
    byId("next-list").replaceChildren(...items.map(labRow));

    const note = byId("next-note");
    if (config.nextNote) {
      note.replaceChildren(anchor(config.nextNote, "chip chip--note", { iconName: "x" }));
    } else {
      note.replaceChildren();
    }
  };

  /* ---------- by day ---------- */

  const renderWork = () => {
    const section = byId("work");
    const { work } = config;

    if (!work) {
      section.hidden = true;
      return;
    }

    byId("work-eyebrow").textContent = work.eyebrow || "By day";
    byId("work-title").textContent = work.title;
    byId("work-role").textContent = work.role || "";
    byId("work-summary").textContent = work.summary || "";
    byId("work-places").replaceChildren(...(work.places || []).map((place) => el("li", null, place)));

    const links = work.links || (work.link ? [work.link] : []);
    byId("work-links").replaceChildren(
      ...links.map((link, index) =>
        anchor(link, index === 0 ? "button button--navy" : "button button--outline-dark"),
      ),
    );
  };

  /* ---------- archive and footer ---------- */

  const renderArchive = () => {
    const section = byId("archive");
    const items = config.archive || [];

    if (!items.length) {
      section.hidden = true;
      return;
    }

    byId("archive-list").replaceChildren(
      ...items.map((project) => {
        const item = el("li", "archive__item");
        const head = el("div", "archive__head");
        head.append(el("h3", "archive__title", project.title), statusPill(project.status));
        item.append(head, el("p", "archive__summary", project.summary || ""));
        return item;
      }),
    );
  };

  const renderFooter = () => {
    const closing = config.closing || {};
    byId("closing-title").textContent = closing.title || "Find me";
    byId("closing-text").textContent = closing.text || "";

    byId("social-links").replaceChildren(
      ...(config.socialLinks || []).map((link) =>
        anchor(link, "social", { iconName: link.icon, trailing: false }),
      ),
    );

    byId("meta-links").replaceChildren(
      ...(config.metaLinks || []).map((link) => anchor(link, "chip chip--quiet")),
    );

    const updated = new Date(`${config.lastUpdated}T00:00:00`);
    byId("last-updated").textContent = Number.isNaN(updated.getTime())
      ? `Last updated ${config.lastUpdated}`
      : `Last updated ${updated.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`;
  };

  /** Person markup for search engines, built from the same data as the page. */
  const renderStructuredData = () => {
    const { profile, work } = config;
    const home = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      url: home,
      image: new URL(profile.avatarUrl || "", home).href,
      description: plain(profile.headline),
      sameAs: (config.socialLinks || []).map((link) => link.url),
    };

    if (work) {
      person.jobTitle = work.role;
      person.worksFor = { "@type": "Organization", name: work.title };
      const site = (work.links || [work.link])[0];
      if (site?.url) person.worksFor.url = site.url;
    }

    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(person);
    document.head.append(tag);
  };

  /* ---------- page behaviour ---------- */

  /** Sections rise into place as they scroll in. Skipped entirely under reduced motion. */
  const setupReveal = () => {
    const targets = document.querySelectorAll(
      ".section__head, .feature__head, .feature__facts, .player, .feature__topics, .lab, .day__card, .archive, .closing, .reveal",
    );
    if (!motionOK() || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );

    for (const target of targets) {
      target.classList.add("reveal");
      observer.observe(target);
    }
    document.documentElement.classList.add("reveal-ready");
  };

  /** Top bar: solid once the page scrolls, and the link of the section in view is marked. */
  const setupTopbar = () => {
    const bar = byId("topbar");
    const update = () => bar.classList.toggle("is-scrolled", window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });

    const links = [...document.querySelectorAll(".topnav a")];
    for (const link of links) {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target || target.hidden) link.hidden = true;
    }

    if (!("IntersectionObserver" in window)) return;
    const byTarget = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // The hero and sections without a link (the archive) clear the mark.
          for (const link of links) link.removeAttribute("aria-current");
          byTarget.get(entry.target.id)?.setAttribute("aria-current", "true");
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const section of document.querySelectorAll("#top, main > section")) {
      observer.observe(section);
    }
  };

  renderHero();
  renderFeatured();
  renderLive();
  renderNext();
  renderWork();
  renderArchive();
  renderFooter();
  renderStructuredData();
  setupReveal();
  setupTopbar();

  app.dataset.rendered = "true";
})();
