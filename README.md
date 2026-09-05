# Static Linktree Portfolio

**Live site:** https://kidemaestro.github.io/linktree/

A small, dependency-free project hub for an X bio. No build step, no framework —
GitHub Pages serves the files as they are.

The page is one column, in the order a visitor cares about:

| Section         | What goes there                                              |
| --------------- | ------------------------------------------------------------ |
| **Hero**        | Who you are, one line, and the two links you most want tapped |
| **Live now**    | Products anyone can open today — the whole card is tappable   |
| **In progress** | Not public yet: title, status, one line each                  |
| **Day job**     | The thing that pays the bills, kept out of the roadmap        |
| **Find me**     | Social links and the page source                              |

## Update Your Content

Everything on the page comes from **`data/site.js`**. Nothing else needs editing.

```js
window.SiteConfig = {
  profile: { name, handle, handleUrl, initials, avatarUrl, role, tagline, note, actions },
  live: [ /* products people can open now */ ],
  next: [ /* not public yet */ ],
  nextNote: { label, url },
  work: { title, role, summary, link },
  socialLinks: [ { label, url } ],
  metaLinks: [ { label, url } ],
  lastUpdated: "YYYY-MM-DD",
};
```

### `live[]` — a product card

```js
{
  title: "BountyRaiders",
  status: "Live",
  summary: "One line. This is the hook people actually read.",
  description: "Two sentences of detail for anyone still reading.",
  tags: ["Next.js", "Stripe"],
  links: [
    { label: "bountyraiders.com", url: "https://www.bountyraiders.com" },
    { label: "Discord", url: "https://discord.gg/..." },
  ],
}
```

**The first link is the card's main destination** — the whole card opens it, so put
the product URL first and use the domain as its label. Any further links render as
small chips next to it.

### `next[]` — an in-progress row

Keep these to `title`, `status`, and a one-line `summary`. They are deliberately
plain rows, not cards: nothing is public yet, so there is nothing to click.
`nextNote` renders once at the bottom of the section — that is where the "follow
along on X" link lives, instead of repeating the same button on every row.

### Statuses

`status` picks the coloured pill. Known values:

| Status            | Pill              |
| ----------------- | ----------------- |
| `Live`            | green, pulsing dot |
| `Instagram only`  | amber — reachable, but not the usual way |
| `In development`  | blue              |
| `Shipping soon`   | blue              |
| `Research`        | violet            |
| `On hold`         | grey              |

Anything else renders neutral grey. To add a status, add it to `STATUS_TONE` in
`assets/script.js` and give it a `.pill--<tone>` rule in `assets/styles.css`.

### Other notes

- `profile.actions` — the first is the filled button, the rest are outlined.
- `profile.note` — optional announcement line under the buttons. Leave it `""` to
  hide it. Don't restate a project's status there; the cards already show it.
- `work` — omit the key entirely and the Day job section hides itself.
- The `<noscript>` block in `index.html` holds a few permanent profile links for
  visitors with JavaScript off. It deliberately does **not** mirror the project
  lists, so there is nothing to keep in sync.
- Prefer public product/community links over private GitHub repos, and bump
  `lastUpdated` when you change anything.

## Preview Locally

From the project folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

Validate the site with the no-dependency check script:

```powershell
node scripts/test-static-site.mjs
```

It verifies that every id the renderer writes to exists in `index.html`, that every
link has a label and a real URL, that each live product has a destination, and that
every status used has a matching pill.

## Deploy On GitHub Pages

1. Push this project to a GitHub repository named `linktree`.
2. In the repository settings, open **Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select the `main` branch and the `/root` folder, then save.

Your page will be available at:

```text
https://<github-username>.github.io/linktree/
```

Use that URL in your X bio. If you rename the repo or move to a custom domain,
update the canonical and Open Graph URLs in `index.html` so social cards keep
working.
