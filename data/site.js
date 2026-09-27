/**
 * Everything on the page comes from this file.
 *
 * Rules of thumb:
 * - The FIRST link of a product is its main destination (the whole card opens it).
 *   Any extra links show up as small chips underneath.
 * - `status` drives the coloured pill. Known values: "Live", "In development",
 *   "Shipping soon", "Research", "On hold", "Closed". Anything else renders neutral grey.
 * - Keep `summary` to one line. `description` is the two-sentence version.
 * - In `profile.headline`, wrap words in *asterisks* to accent them: the first
 *   accent is gold (day), the second blue (night).
 * - Image and video paths are relative to the site root, e.g. "assets/img/x.webp".
 */
window.SiteConfig = {
  profile: {
    name: "Dejan Dakic",
    handle: "@DakicDejan",
    handleUrl: "https://x.com/DakicDejan",
    initials: "DD",
    avatarUrl: "assets/profile.jpg",
    // Mirrors the X bio: "Placing elite private bankers by day, AI app builder by night."
    headline: "Placing elite private bankers *by day*. Building AI apps *by night*.",
    intro:
      "I run StratA Talent, executive search for private banking and wealth management. After hours I ship AI products. The newest is Lanes: every side of a conflict, read in its own language and set side by side.",
    // Optional pill above the name. Delete the key to hide it.
    announcement: {
      label: "New",
      text: "Lanes.news is live. See how it works in 55 seconds",
      url: "#lanes",
    },
    // The first is the filled button. `icon`: "x", "linkedin", "github" or "play".
    // An action with icon "play" scrolls to the explainer and starts it.
    actions: [
      { label: "Follow @DakicDejan", url: "https://x.com/DakicDejan", icon: "x" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/dejandakic/", icon: "linkedin" },
      { label: "Watch the explainer", url: "#lanes", icon: "play" },
    ],
  },

  /** The flagship: gets the big section with the explainer video. Delete the key to hide it. */
  featured: {
    id: "lanes",
    eyebrow: "Latest launch",
    title: "Lanes.news",
    logo: "assets/img/lanes-mark.svg",
    status: "Live",
    tagline: "Every side of the story, in its own lane.",
    description:
      "News is written from somewhere. Lanes reads each conflict through the press of both sides, in their own languages, and through countries that are not a party. It shows where the wording splits and keeps the hard core every lane supports, with a citation back to each article.",
    promise: "Free · No ads · No sign-up",
    stats: [
      { value: "8", label: "conflicts" },
      { value: "109", label: "outlets" },
      { value: "10", label: "languages" },
      { value: "30", label: "countries" },
    ],
    links: [
      { label: "Open lanes.news", url: "https://lanes.news" },
      { label: "How it works", url: "https://lanes.news/about" },
      { label: "Today's articles", url: "https://lanes.news/daily" },
    ],
    topics: {
      label: "Conflicts tracked",
      items: [
        { label: "Russia – Ukraine", url: "https://lanes.news/bridge/russia-ukraine" },
        { label: "Israel – Palestine", url: "https://lanes.news/bridge/israel-palestine" },
        { label: "US – China", url: "https://lanes.news/bridge/usa-china" },
        { label: "US – Iran", url: "https://lanes.news/bridge/usa-iran" },
        { label: "China – Taiwan", url: "https://lanes.news/bridge/china-taiwan" },
        { label: "India – Pakistan", url: "https://lanes.news/bridge/india-pakistan" },
        { label: "UK – Argentina", url: "https://lanes.news/bridge/uk-argentina" },
        { label: "Afghanistan – Pakistan", url: "https://lanes.news/bridge/afghanistan-pakistan" },
      ],
    },
    /**
     * The explainer. Phones get the 4:5 cut, wider screens 16:9; each in AV1 where the
     * browser plays it, H.264 otherwise. `at` is where a chapter starts, in seconds.
     */
    video: {
      label: "How a Lanes report is made",
      note: "55 seconds, no narration. Every scene is described in the chapters.",
      duration: 55.3,
      // Shown in place of the video if the files cannot be played.
      fallback: { label: "Watch it on lanes.news", url: "https://lanes.news/about" },
      posters: {
        wide: "assets/video/lanes-explainer-v1-16x9.webp",
        tall: "assets/video/lanes-explainer-v1-4x5.webp",
      },
      sources: {
        wide: [
          { src: "assets/video/lanes-explainer-v1-16x9-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.10"' },
          { src: "assets/video/lanes-explainer-v1-16x9-h264.mp4", type: 'video/mp4; codecs="avc1.640028"' },
        ],
        tall: [
          { src: "assets/video/lanes-explainer-v1-4x5-av1.mp4", type: 'video/mp4; codecs="av01.0.08M.10"' },
          { src: "assets/video/lanes-explainer-v1-4x5-h264.mp4", type: 'video/mp4; codecs="avc1.640028"' },
        ],
      },
      chapters: [
        {
          at: 0,
          label: "The problem",
          title: "One wave of strikes. Three different stories.",
          text: "Russian state media call the target a Defence Ministry internet hub, the Ukrainian press a sushi chain's warehouse, an Indian paper a maternity clinic. Lanes puts them side by side.",
          thumb: "assets/video/chapter-01.webp",
        },
        {
          at: 6.9,
          label: "Read",
          title: "Both sides. And neither.",
          text: "Each party's press is read in its own language, plus press from countries that are not a party: 109 outlets, 10 languages, 30 countries.",
          thumb: "assets/video/chapter-02.webp",
        },
        {
          at: 15.3,
          label: "Match",
          title: "Same event, every side.",
          text: "Articles are grouped by event before anything is compared, so like is compared with like. Kyiv and Kiev count as one word.",
          thumb: "assets/video/chapter-03.webp",
        },
        {
          at: 21.9,
          label: "Sort",
          title: "Every claim, sorted.",
          text: "Claude pulls out each factual claim and files it as corroborated, framed, disputed or single-source. Where the lanes agree on an event but not on the words, each wording is quoted.",
          thumb: "assets/video/chapter-04.webp",
        },
        {
          at: 35.9,
          label: "Check",
          title: "News that grades itself.",
          text: "Five outlets repeating one report is not five confirmations. Every citation is checked by rule, and each report carries a confidence grade.",
          thumb: "assets/video/chapter-05.webp",
        },
        {
          at: 42.9,
          label: "The map",
          title: "Eight conflicts. Three lanes each.",
          text: "Arcs on the globe are coloured from GDELT world-news data, from cooperative to open conflict. Lanes does the reading in the open and shows its working.",
          thumb: "assets/video/chapter-06.webp",
        },
      ],
    },
  },

  /** Also live: products anyone can open right now. `accent` tints the card on hover. */
  live: [
    {
      title: "BountyRaiders",
      status: "Live",
      summary: "The ARC Raiders bounty board: post a target, hunt, get paid on proof.",
      description:
        "Post a real-money bounty on any ARC Raiders player, or claim one from the most-wanted list. Bounties sit in escrow, mods review the kill proof in Discord, and payouts go out to PayPal.",
      tags: ["Next.js", "Stripe", "Discord", "Gaming"],
      image: "assets/img/bountyraiders.webp",
      accent: "#f0a050",
      links: [
        { label: "bountyraiders.com", url: "https://www.bountyraiders.com" },
        { label: "Discord", url: "https://discord.gg/ZcSSNWQfNS" },
      ],
    },
    {
      title: "useToolCraft",
      status: "Live",
      summary: "AI tool finder for solopreneurs: shortlists that survive production.",
      description:
        "Describe a workflow and get a vetted shortlist from 210+ operator-scored tools in about 30 seconds, matched to your budget and skill level, with Stack Builder cost estimates and setup guides.",
      tags: ["AI", "SaaS", "Discovery"],
      image: "assets/img/usetoolcraft.webp",
      accent: "#a78bfa",
      links: [
        { label: "usetoolcraft.com", url: "https://www.usetoolcraft.com" },
        { label: "2026 AI tools guide", url: "https://www.usetoolcraft.com/how-to-find-ai-tools" },
      ],
    },
    {
      title: "BetWithBat",
      status: "Live",
      summary: "AI-assisted football picks with a public, verified track record.",
      description:
        "Multi-bookmaker odds consensus, lineup and injury checks, and AI edge detection across Europe's top leagues, back for the 2026/27 club season. Every result stays on the record. 18+, analysis only.",
      tags: ["AI", "Football", "SaaS", "18+"],
      image: "assets/img/betwithbat.webp",
      accent: "#2bde96",
      links: [
        { label: "betwithbat.com", url: "https://betwithbat.com" },
        { label: "Track record", url: "https://betwithbat.com/performance" },
        { label: "Instagram", url: "https://www.instagram.com/betwithbat/" },
      ],
    },
  ],

  /**
   * In the lab: not public yet. No links here on purpose. Progress goes out on X,
   * and the page says that once instead of putting the same button on every row.
   */
  next: [
    {
      title: "AI Recruitment Assistant",
      status: "In development",
      summary: "Private AI tooling for StratA search, screening, and recruiter workflows.",
    },
    {
      title: "Pre-Post Flow Paper Trader",
      status: "Research",
      summary:
        "Python bot that maps large Polymarket flow to post themes and paper-trades it. Research only, no live money.",
    },
    {
      title: "Animated Drawings Family",
      status: "On hold",
      summary:
        "Family-friendly animated drawings app in Expo, parked while the live products take priority.",
    },
  ],
  nextNote: {
    label: "Progress notes go out on X",
    url: "https://x.com/DakicDejan",
  },

  /** The day job. Not a side project, so it gets its own daylight block. */
  work: {
    eyebrow: "By day",
    title: "StratA Talent",
    role: "Founder & Managing Director",
    summary:
      "Independent, Dubai-based executive search firm placing senior private banking, investment banking, and wealth management talent across the GCC and the Swiss hubs.",
    places: ["Dubai", "Abu Dhabi", "Geneva", "Zurich", "Lugano"],
    links: [
      { label: "stratatalent.com", url: "https://stratatalent.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/dejandakic/" },
    ],
  },

  /** Shipped, then retired. One line each, no links. Empty the list to hide the section. */
  archive: [
    {
      title: "GlitzGlow",
      status: "Closed",
      summary: "UAE e-commerce brand for semi-cured gel nails. Wound down in 2026.",
    },
  ],

  /** The closing call to action above the footer. */
  closing: {
    title: "Follow the build",
    text: "Launches and progress notes go out on X first. For search mandates and banking conversations, LinkedIn is the better door.",
  },

  socialLinks: [
    { label: "X", url: "https://x.com/DakicDejan", icon: "x" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/dejandakic/", icon: "linkedin" },
    { label: "GitHub", url: "https://github.com/kidemaestro", icon: "github" },
  ],
  metaLinks: [{ label: "Source for this page", url: "https://github.com/kidemaestro/linktree" }],
  lastUpdated: "2026-09-27",
};
