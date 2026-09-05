/**
 * Everything on the page comes from this file.
 *
 * Rules of thumb:
 * - The FIRST link of a project is its main destination (the whole card opens it).
 *   Any extra links show up as small chips underneath.
 * - `status` drives the coloured pill. Known values: "Live", "Instagram only",
 *   "In development", "Research", "On hold". Anything else renders neutral grey.
 * - Keep `summary` to one line. `description` is the two-sentence version.
 */
window.SiteConfig = {
  profile: {
    name: "Dejan Dakic",
    handle: "@DakicDejan",
    handleUrl: "https://x.com/DakicDejan",
    initials: "DD",
    avatarUrl: "assets/profile.jpg",
    role: "Executive search by day · AI and web products by night",
    tagline:
      "I build and ship small AI and web products on the side. The day job is StratA Talent — boutique executive search for private banking and wealth management.",
    // Optional one-line announcement under the buttons. Leave empty to hide it.
    // Don't repeat a project status here — the cards already carry those.
    note: "",
    actions: [
      { label: "Follow on X", url: "https://x.com/DakicDejan" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/dejandakic/" },
    ],
  },

  /** Products anyone can open right now. */
  live: [
    {
      title: "BountyRaiders",
      status: "Live",
      summary: "ARC Raiders bounty board — post a target, hunt, get paid on proof.",
      description:
        "Community bounty system for ARC Raiders: post real-money contracts on griefers and campers, claim from the most-wanted list, submit kill proof, and get mod-reviewed payouts through Discord.",
      tags: ["Next.js", "Stripe", "Discord", "Gaming"],
      links: [
        { label: "bountyraiders.com", url: "https://www.bountyraiders.com" },
        { label: "Discord", url: "https://discord.gg/XFH6Psv9" },
      ],
    },
    {
      title: "useToolCraft",
      status: "Live",
      summary: "AI tool finder for solopreneurs — shortlists that survive production.",
      description:
        "Describe a workflow and get a vetted shortlist from 210+ operator-scored tools, with budget and skill matching, Stack Builder cost estimates, and step-by-step setup guidance in about 30 seconds.",
      tags: ["AI", "SaaS", "Discovery"],
      links: [
        { label: "usetoolcraft.com", url: "https://www.usetoolcraft.com" },
        {
          label: "2026 AI tools guide",
          url: "https://www.usetoolcraft.com/how-to-find-ai-tools",
        },
      ],
    },
    {
      title: "BetWithBat",
      status: "Live",
      summary: "AI-assisted football picks with a public, verified track record.",
      description:
        "Multi-bookmaker odds consensus, injury and lineup intel, and AI edge detection across Europe's top leagues. Picks publish about 60 minutes before kickoff and every result stays on the record.",
      tags: ["AI", "Football", "SaaS"],
      links: [
        { label: "betwithbat.com", url: "https://betwithbat.com" },
        { label: "Track record", url: "https://betwithbat.com/performance" },
      ],
    },
    {
      title: "GlitzGlow",
      status: "Instagram only",
      summary: "Semi-cured gel nails brand — catalog and orders run through Instagram.",
      description:
        "UAE beauty brand for semi-cured gel nails. The storefront domain is offline while the shop is refreshed, so the catalog and orders are handled over Instagram DMs.",
      tags: ["E-commerce", "Beauty", "UAE"],
      links: [{ label: "@glitzglowuae", url: "https://www.instagram.com/glitzglowuae/" }],
    },
  ],

  /**
   * Not public yet. No links here on purpose — progress goes out on X, and the
   * page says that once instead of putting the same button on every row.
   */
  next: [
    {
      title: "AI Recruitment Assistant",
      status: "In development",
      summary:
        "Private AI tooling for StratA search, screening, and recruiter workflows.",
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

  /** The day job. Not a side project, so it gets its own block. */
  work: {
    title: "StratA Talent",
    role: "Founder & Managing Director",
    summary:
      "Independent Dubai-based executive search firm placing senior private banking, investment banking, and wealth management talent across the GCC and Swiss hubs.",
    link: { label: "stratatalent.com", url: "https://stratatalent.com" },
  },

  socialLinks: [
    { label: "X", url: "https://x.com/DakicDejan" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/dejandakic/" },
    { label: "GitHub", url: "https://github.com/kidemaestro" },
  ],
  metaLinks: [
    { label: "Source for this page", url: "https://github.com/kidemaestro/linktree" },
  ],
  lastUpdated: "2026-09-05",
};
