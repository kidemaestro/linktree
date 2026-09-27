/**
 * No-dependency sanity checks for the static site.
 * Run with: node scripts/test-static-site.mjs
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const read = (filePath) => fs.readFileSync(path.join(root, filePath), "utf8");
const exists = (filePath) => fs.existsSync(path.join(root, filePath));
const size = (filePath) => fs.statSync(path.join(root, filePath)).size;
const KB = 1024;
const MB = 1024 * KB;

const requiredFiles = [
  "index.html",
  "assets/styles.css",
  "assets/script.js",
  "assets/profile.jpg",
  "assets/favicon.svg",
  "assets/favicon-32.png",
  "assets/apple-touch-icon.png",
  "assets/social-card.jpg",
  "data/site.js",
  "scripts/render-art.mjs",
  "README.md",
  ".gitignore",
];

for (const filePath of requiredFiles) {
  assert.ok(exists(filePath), `${filePath} should exist`);
}

/* ---------- index.html ---------- */

const html = read("index.html");
const PAGE = "https://kidemaestro.github.io/linktree/";

assert.match(html, /<div id="app"/, "HTML should expose the app mount point");
assert.match(html, /data\/site\.js/, "HTML should load editable site data");
assert.match(html, /assets\/script\.js/, "HTML should load the renderer");
assert.match(html, /assets\/styles\.css/, "HTML should load the stylesheet");
assert.match(html, /og:title/, "HTML should include share metadata");
assert.match(html, /<noscript>[\s\S]*<a href=/, "HTML should keep a fallback for JS-off visitors");
assert.match(
  html,
  /<noscript><style>[^<]*\.app[^<]*display:\s*none/,
  "with JS off, the empty skeleton should be hidden behind the fallback",
);
assert.match(
  html,
  /rel="canonical"\s+href="https:\/\/kidemaestro\.github\.io\/linktree\/"/,
  "canonical URL should match the public GitHub Pages site",
);

// X and most chat apps do not render SVG previews: the share image must be a bitmap.
for (const key of ['property="og:image"', 'name="twitter:image"']) {
  const match = html.match(new RegExp(`${key}\\s+content="([^"]+)"`));
  assert.ok(match, `HTML should set ${key}`);
  assert.ok(match[1].startsWith(PAGE), `${key} should be an absolute GitHub Pages URL`);
  assert.match(match[1], /\.(jpe?g|png|webp)$/, `${key} should be a JPEG/PNG/WebP, not SVG`);
  assert.ok(exists(match[1].slice(PAGE.length)), `${key} should point at a file in the repo`);
}

/** Width and height of a baseline or progressive JPEG, read from its SOF marker. */
function jpegSize(filePath) {
  const bytes = fs.readFileSync(path.join(root, filePath));
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

assert.deepEqual(
  jpegSize("assets/social-card.jpg"),
  { width: 1200, height: 630 },
  "the social card should be 1200 x 630, the size X and Open Graph expect",
);
assert.ok(size("assets/social-card.jpg") < 1 * MB, "the social card should stay under 1 MB");

// Every id the renderer writes into must exist in the markup.
const script = read("assets/script.js");
const usedIds = [...script.matchAll(/(?:getElementById|byId)\("([^"]+)"\)/g)].map((m) => m[1]);
assert.ok(usedIds.length > 10, "renderer should target the page by id");
for (const id of new Set(usedIds)) {
  assert.match(html, new RegExp(`id="${id}"`), `index.html should contain id="${id}"`);
}

// In-page links (nav, announcement, hero actions) must land on something.
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
  assert.match(html, new RegExp(`id="${id}"`), `#${id} is linked but no element has that id`);
}

/* ---------- styles and fonts ---------- */

const styles = read("assets/styles.css");
assert.match(styles, /@media\s*\(max-width:\s*\d+px\)/, "CSS should include small-screen rules");
assert.match(styles, /prefers-reduced-motion/, "CSS should respect reduced motion");
assert.match(styles, /\[hidden\]\s*\{\s*display:\s*none\s*!important/, "hidden must beat display rules");
assert.match(styles, /\.product\b/, "CSS should style product cards");
assert.match(styles, /\.lab__item/, "CSS should style in-the-lab rows");
assert.match(styles, /\.stretch::after/, "CSS should implement the full-card tap target");
assert.match(styles, /\.player__frame/, "CSS should style the explainer player");

for (const [, url] of styles.matchAll(/url\("(fonts\/[^"]+)"\)/g)) {
  const file = `assets/${url}`;
  assert.ok(exists(file), `${file} (from styles.css) should exist`);
  assert.ok(size(file) < 120 * KB, `${file} should stay a subset font (under 120 KB)`);
}

for (const [, href] of html.matchAll(/<link rel="preload" href="([^"]+)"/g)) {
  assert.ok(exists(href), `preloaded ${href} should exist`);
}

/* ---------- site data ---------- */

const dataContext = { window: {} };
vm.runInNewContext(read("data/site.js"), dataContext);
const site = dataContext.window.SiteConfig;

const links = [];
const localFiles = [];
const addLinks = (list = []) => links.push(...list.filter(Boolean));

const { profile } = site;
assert.ok(profile.name, "profile name should be editable");
assert.ok(profile.handle, "profile handle should be editable");
assert.ok(profile.initials, "profile initials should be editable for avatar fallback");
assert.ok(profile.avatarUrl, "profile avatarUrl should point at the bundled photo");
assert.ok(profile.headline, "profile should have a headline");
assert.ok(profile.intro, "profile should have an intro line");
assert.ok(profile.actions?.length >= 1, "profile should have at least one CTA");
assert.equal(
  (profile.headline.match(/\*/g) || []).length % 2,
  0,
  "every *accent* in profile.headline needs a closing asterisk",
);
localFiles.push(profile.avatarUrl);
addLinks(profile.actions);
if (profile.announcement) addLinks([{ label: profile.announcement.text, url: profile.announcement.url }]);

// The flagship section and its explainer.
const { featured } = site;
if (featured) {
  assert.ok(featured.title, "featured should have a title");
  assert.ok(featured.tagline, "featured should have a tagline");
  assert.ok(featured.links?.length, "featured should link somewhere");
  addLinks(featured.links);
  addLinks(featured.topics?.items);
  if (featured.logo) localFiles.push(featured.logo);

  const { video } = featured;
  if (video) {
    assert.ok(video.label, "the video needs a label (it becomes its accessible name)");
    assert.ok(video.sources?.wide?.length, "the video needs at least one 16:9 source");
    for (const shape of Object.keys(video.sources)) {
      for (const source of video.sources[shape]) {
        assert.match(source.type, /^video\/mp4; codecs="/, `${source.src} needs a type with codecs`);
        assert.ok(size(source.src) < 20 * MB, `${source.src} should stay under 20 MB`);
        localFiles.push(source.src);
      }
      assert.ok(video.posters?.[shape], `the ${shape} cut needs a poster`);
    }
    localFiles.push(...Object.values(video.posters || {}));
    if (video.fallback) addLinks([video.fallback]);

    const chapters = video.chapters || [];
    assert.ok(chapters.length >= 2, "the explainer should be split into chapters");
    assert.equal(chapters[0].at, 0, "the first chapter should start at 0");
    chapters.forEach((chapter, index) => {
      assert.ok(chapter.label && chapter.title && chapter.text, `chapter ${index + 1} needs label, title and text`);
      assert.ok(chapter.at < video.duration, `chapter ${index + 1} starts after the video ends`);
      if (index) assert.ok(chapter.at > chapters[index - 1].at, "chapters should be in time order");
      if (chapter.thumb) localFiles.push(chapter.thumb);
    });
  }
}

assert.ok(site.live.length >= 1, "there should be at least one live product");
assert.ok(Array.isArray(site.next), "next should be a list");
assert.ok(site.socialLinks.length >= 2, "social links should include examples");
assert.ok(site.work?.title, "the day job block should have a title");
assert.ok((site.work.links || [site.work.link]).filter(Boolean).length, "the day job block should link somewhere");

addLinks(site.socialLinks);
addLinks(site.metaLinks);
addLinks(site.work.links || [site.work.link]);
if (site.nextNote) addLinks([site.nextNote]);
addLinks(site.live.flatMap((project) => project.links || []));
addLinks(site.next.flatMap((project) => project.links || []));

for (const link of links) {
  assert.ok(link.label, `link ${link.url} should have a label`);
  assert.match(link.url, /^(https?:\/\/|mailto:|#)/, `${link.label} should be a real URL`);
  if (link.url.startsWith("#")) {
    assert.match(html, new RegExp(`id="${link.url.slice(1)}"`), `${link.label} points at a missing #id`);
  }
}

// Live products are the page's whole point: each needs a destination and a picture.
for (const project of site.live) {
  assert.ok(project.title, "live product should have a title");
  assert.ok(project.summary, `${project.title} should have a one-line summary`);
  assert.ok(project.description, `${project.title} should have a description`);
  assert.ok(project.status, `${project.title} should have a status`);
  assert.ok(project.links?.length, `${project.title} should link to something`);
  if (project.image) localFiles.push(project.image);
  if (project.accent) assert.match(project.accent, /^#[0-9a-f]{6}$/i, `${project.title} accent should be a hex colour`);
}

// In-the-lab items stay lightweight: title, status, one line.
for (const project of site.next) {
  assert.ok(project.title, "in-progress item should have a title");
  assert.ok(project.status, `${project.title} should have a status`);
  assert.ok(project.summary, `${project.title} should have a summary`);
  assert.ok(
    !project.description,
    `${project.title} should stay a one-liner. Move long copy to the live list`,
  );
}

for (const project of site.archive || []) {
  assert.ok(project.title && project.status && project.summary, "archive items need title, status and summary");
  assert.ok(!project.links, `${project.title} is archived: keep dead links off the page`);
}

// Every status must map to a pill tone in the renderer, or it renders grey.
const tones = script.slice(
  script.indexOf("STATUS_TONE = {"),
  script.indexOf("};", script.indexOf("STATUS_TONE = {")),
);
const statuses = [featured?.status, ...site.live, ...site.next, ...(site.archive || [])]
  .map((item) => (typeof item === "string" ? item : item?.status))
  .filter(Boolean);
for (const status of statuses) {
  assert.ok(
    tones.includes(`"${status}"`) || tones.includes(`${status}:`),
    `status "${status}" should have a tone in STATUS_TONE`,
  );
}

// Everything the page loads from the repo must be there, and pictures must stay light.
for (const file of new Set(localFiles)) {
  assert.ok(!/^https?:/.test(file), `${file} should be bundled in the repo, not hotlinked`);
  assert.ok(exists(file), `${file} (from data/site.js) should exist`);
  if (/\.(webp|jpe?g|png|svg)$/.test(file)) {
    assert.ok(size(file) < 400 * KB, `${file} should stay under 400 KB`);
  }
}

assert.match(site.lastUpdated, /^\d{4}-\d{2}-\d{2}$/, "lastUpdated should be an ISO date");

/* ---------- docs ---------- */

const readme = read("README.md");
assert.match(readme, /GitHub Pages/, "README should document GitHub Pages deployment");
assert.match(readme, /data\/site\.js/, "README should explain where to edit content");

console.log(
  `Static site checks passed: ${site.live.length} live, ${site.next.length} in the lab, ` +
    `${featured?.video?.chapters?.length || 0} video chapters, ${new Set(localFiles).size} local files.`,
);
