# Dejan Dakic: by day, by night

**Live site:** https://kidemaestro.github.io/linktree/

The page behind the link in the X bio ([@DakicDejan](https://x.com/DakicDejan)): placing elite
private bankers by day, building AI apps by night. No build step, no framework, no dependencies.
GitHub Pages serves the files as they are.

The page is one column of sections, in the order a visitor cares about:

| Section           | What goes there                                                          |
| ----------------- | ------------------------------------------------------------------------ |
| **Hero**          | Photo, name, the day/night headline from the X bio, and the main buttons |
| **Latest launch** | The flagship (Lanes.news) with its 55-second explainer video             |
| **Also live**     | Products anyone can open today, each with a cover picture                |
| **In the lab**    | Not public yet: title, status, one line each                             |
| **By day**        | StratA Talent, the day job, on a daylight card                           |
| **Archive**       | Shipped, then retired (GlitzGlow)                                        |
| **Follow**        | Social links, the page source, and the last-updated date                 |

## Update your content

Everything on the page comes from **`data/site.js`**. For copy and links, nothing else needs editing.

```js
window.SiteConfig = {
  profile: { name, handle, handleUrl, initials, avatarUrl, headline, intro, announcement, actions },
  featured: { eyebrow, title, logo, status, tagline, description, promise, stats, links, topics, video },
  live: [ /* products people can open now */ ],
  next: [ /* not public yet */ ],
  nextNote: { label, url },
  work: { eyebrow, title, role, summary, places, links },
  archive: [ /* retired projects */ ],
  closing: { title, text },
  socialLinks: [ { label, url, icon } ],
  metaLinks: [ { label, url } ],
  lastUpdated: "YYYY-MM-DD",
};
```

### `profile`

- `headline`: wrap words in `*asterisks*` to accent them. The first accent is gold (day), the second
  blue (night): `"Placing elite private bankers *by day*. Building AI apps *by night*."`
- `announcement`: the pill above the name (`{ label, text, url }`). Delete the key to hide it.
- `actions`: the first is the filled button. `icon` can be `"x"`, `"linkedin"`, `"github"` or
  `"play"`; a `"play"` action scrolls to the explainer and starts it with sound.

### `live[]`: a product card

```js
{
  title: "BountyRaiders",
  status: "Live",
  summary: "One line. This is the hook people actually read.",
  description: "Two sentences of detail for anyone still reading.",
  tags: ["Next.js", "Stripe"],
  image: "assets/img/bountyraiders.webp", // 16:10 cover, about 960 x 600
  accent: "#f0a050",                       // tints the card on hover
  links: [
    { label: "bountyraiders.com", url: "https://www.bountyraiders.com" },
    { label: "Discord", url: "https://discord.gg/..." },
  ],
}
```

**The first link is the card's main destination.** The whole card opens it, so put the product URL
first and use the domain as its label. Any further links render as chips on the card.

### `featured`: the flagship and its video

`featured` gets the big panel: title, tagline, stats, buttons, the conflicts Lanes tracks, and the
explainer. Delete the key and the section hides itself. The video block:

- `sources.wide` (16:9) and `sources.tall` (4:5, used on screens under 720px), each a list of
  `{ src, type }` in order of preference. The page plays the first one the browser supports:
  AV1 first (smaller), H.264 as the fallback that plays everywhere.
- `posters`: the still shown before playback, one per shape.
- `chapters`: `{ at, label, title, text, thumb }`, with `at` in seconds. They become the clickable
  chapter list, the caption under the video, and the "Read the video as text" transcript.
- `fallback`: a link shown in place of the video if the files cannot be played.

How it behaves: nothing downloads until the player is near the screen; it plays muted and inline
once on screen (browsers only autoplay muted video), loops, and pauses when scrolled away. A pause
the reader chose sticks. With reduced motion or Save-Data on, it waits for a press instead of
autoplaying. The Pause button covers WCAG 2.2.2 for moving content.

### `next[]`, `work`, `archive`

- `next[]`: keep these to `title`, `status` and a one-line `summary`. They are deliberately plain
  rows: nothing is public yet, so there is nothing to click. `nextNote` renders once under the list;
  that is where the "follow along on X" link lives.
- `work`: `places` are the chips on the daylight card; the first of `links` is the filled button.
  Omit the key entirely and the section hides itself.
- `archive[]`: `title`, `status` and `summary`, no links (the check script enforces that). Empty the
  list to hide the section.

### Statuses

`status` picks the coloured pill. Known values:

| Status           | Pill                |
| ---------------- | ------------------- |
| `Live`           | green, pulsing dot  |
| `In development` | blue                |
| `Shipping soon`  | blue                |
| `Research`       | violet              |
| `On hold`        | grey                |
| `Closed`         | grey, for the archive |

Anything else renders neutral grey. To add a status, add it to `STATUS_TONE` in `assets/script.js`
and give it a `.pill--<tone>` rule in `assets/styles.css`.

### Other notes

- The `<noscript>` block in `index.html` holds a few permanent links for visitors with JavaScript
  off. It deliberately does **not** mirror the project lists, so there is nothing to keep in sync.
- The share metadata (`og:*`, `twitter:*`) and the page title live in `index.html`, because link
  previews are built by crawlers that do not run JavaScript. Update them when the headline changes.
- Prefer public product and community links over private GitHub repos, and bump `lastUpdated`
  when you change anything.

## Pictures, video and fonts

| Path                          | What it is                                                           |
| ----------------------------- | -------------------------------------------------------------------- |
| `assets/profile.jpg`          | The X profile photo                                                  |
| `assets/img/*.webp`           | Product covers (16:10). BountyRaiders is cropped from its brand art  |
| `assets/img/lanes-mark.svg`   | The Lanes logo                                                       |
| `assets/video/`               | The Lanes explainer (from the Lanes repo), its posters and chapter stills |
| `assets/social-card.jpg`      | The 1200 x 630 link preview for X, LinkedIn and chat apps            |
| `assets/favicon.svg`          | The day/night mark; `favicon-32.png` and `apple-touch-icon.png` are renders of it |
| `assets/fonts/`               | Fraunces, Inter and JetBrains Mono, self-hosted (SIL OFL, licences alongside) |

**Covers, share card and icons** are HTML in `scripts/art/`, rendered to images by one script. Edit
the template, then:

```bash
npx -y -p playwright node scripts/render-art.mjs
```

The share card must stay a bitmap: X does not render SVG previews.

**Chapter stills** are single frames from the 16:9 cut, for example:

```bash
ffmpeg -ss 12.5 -i assets/video/lanes-explainer-v1-16x9-h264.mp4 -frames:v 1 \
  -vf scale=480:-2 -c:v libwebp -quality 72 assets/video/chapter-02.webp
```

**A new cut of the video** gets new file names (`-v2-`), so browsers never mix old and new files.
Update the paths, `duration` and the chapter times in `data/site.js`.

**Fonts** are subset to Latin and limited to the weights the page uses (164 KB for all four files).

## Preview locally

From the project folder, with any static server that supports byte ranges (video seeking needs
them, and Python's `http.server` does not):

```bash
npx http-server -c-1
```

Then open `http://localhost:8080`.

Validate the site with the no-dependency check script:

```bash
node scripts/test-static-site.mjs
```

It verifies that every id the renderer writes to exists in `index.html`, that every in-page link
lands on an element, that every link has a label and a real URL, that each live product has a
destination, that every file `data/site.js` and the stylesheet point at exists and stays within
its size budget, that the video chapters are in order, that the share image is a 1200 x 630 bitmap,
and that every status used has a matching pill.

## Deploy on GitHub Pages

1. Push this project to a GitHub repository named `linktree`.
2. In the repository settings, open **Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select the `main` branch and the `/root` folder, then save.

Your page will be available at:

```text
https://<github-username>.github.io/linktree/
```

Use that URL in your X bio. If you rename the repo or move to a custom domain, update the canonical,
`og:url`, `og:image` and `twitter:image` URLs in `index.html` so previews keep working. The video
files total about 30 MB, well inside GitHub Pages' limits (1 GB per site, 100 MB per file).
