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

const requiredFiles = [
  "index.html",
  "assets/styles.css",
  "assets/script.js",
  "assets/profile.jpg",
  "data/site.js",
  "README.md",
  ".gitignore",
];

for (const filePath of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, filePath)), `${filePath} should exist`);
}

/* ---------- index.html ---------- */

const html = read("index.html");
assert.match(html, /<div id="app"/, "HTML should expose the app mount point");
assert.match(html, /data\/site\.js/, "HTML should load editable site data");
assert.match(html, /assets\/script\.js/, "HTML should load the renderer");
assert.match(html, /assets\/styles\.css/, "HTML should load the stylesheet");
assert.match(html, /og:title/, "HTML should include share metadata");
assert.match(html, /<noscript>/, "HTML should keep a fallback for JS-off visitors");
assert.match(
  html,
  /property="og:image"\s+content="https:\/\/kidemaestro\.github\.io\/linktree\/assets\/social-card\.svg"/,
  "og:image should use an absolute GitHub Pages URL",
);
assert.match(
  html,
  /rel="canonical"\s+href="https:\/\/kidemaestro\.github\.io\/linktree\/"/,
  "canonical URL should match the public GitHub Pages site",
);

// Every id the renderer writes into must exist in the markup.
const script = read("assets/script.js");
const usedIds = [...script.matchAll(/getElementById\("([^"]+)"\)/g)].map((m) => m[1]);
assert.ok(usedIds.length > 5, "renderer should target the page by id");
for (const id of new Set(usedIds)) {
  assert.match(html, new RegExp(`id="${id}"`), `index.html should contain id="${id}"`);
}

/* ---------- styles ---------- */

const styles = read("assets/styles.css");
assert.match(styles, /@media\s*\(max-width:\s*720px\)/, "CSS should include mobile rules");
assert.match(styles, /prefers-reduced-motion/, "CSS should respect reduced motion");
assert.match(styles, /\.card\b/, "CSS should style live product cards");
assert.match(styles, /\.queue__item/, "CSS should style in-progress rows");
assert.match(styles, /\.stretch::after/, "CSS should implement the full-card tap target");

/* ---------- site data ---------- */

const dataContext = { window: {} };
vm.runInNewContext(read("data/site.js"), dataContext);
const site = dataContext.window.SiteConfig;

const { profile } = site;
assert.ok(profile.name, "profile name should be editable");
assert.ok(profile.handle, "profile handle should be editable");
assert.ok(profile.initials, "profile initials should be editable for avatar fallback");
assert.ok(profile.avatarUrl, "profile avatarUrl should point at the bundled photo");
assert.ok(profile.tagline, "profile should have a tagline");
assert.ok(profile.actions?.length >= 1, "profile should have at least one CTA");

assert.ok(site.live.length >= 1, "there should be at least one live product");
assert.ok(Array.isArray(site.next), "next should be a list");
assert.ok(site.socialLinks.length >= 2, "social links should include examples");
assert.ok(site.work?.title, "the day job block should have a title");
assert.ok(site.work.link?.url, "the day job block should link somewhere");

const allLinks = [
  ...profile.actions,
  ...site.socialLinks,
  ...(site.metaLinks || []),
  site.work.link,
  ...(site.nextNote ? [site.nextNote] : []),
  ...site.live.flatMap((project) => project.links || []),
  ...site.next.flatMap((project) => project.links || []),
];

for (const link of allLinks) {
  assert.ok(link.label, `link ${link.url} should have a label`);
  assert.match(link.url, /^(https?:\/\/|mailto:|#)/, `${link.label} should be a real URL`);
}

// Live products are the page's whole point: each needs a destination.
for (const project of site.live) {
  assert.ok(project.title, "live product should have a title");
  assert.ok(project.summary, `${project.title} should have a one-line summary`);
  assert.ok(project.description, `${project.title} should have a description`);
  assert.ok(project.status, `${project.title} should have a status`);
  assert.ok(project.links?.length, `${project.title} should link to something`);
}

// In-progress items stay lightweight: title, status, one line.
for (const project of site.next) {
  assert.ok(project.title, "in-progress item should have a title");
  assert.ok(project.status, `${project.title} should have a status`);
  assert.ok(project.summary, `${project.title} should have a summary`);
  assert.ok(
    !project.description,
    `${project.title} should stay a one-liner — move long copy to the live list`,
  );
}

// Every status must map to a pill tone in the renderer, or it renders grey.
const tones = script.slice(
  script.indexOf("STATUS_TONE = {"),
  script.indexOf("};", script.indexOf("STATUS_TONE = {")),
);
for (const project of [...site.live, ...site.next]) {
  assert.ok(
    tones.includes(`"${project.status}"`) || tones.includes(`${project.status}:`),
    `status "${project.status}" should have a tone in STATUS_TONE`,
  );
}

assert.match(
  site.lastUpdated,
  /^\d{4}-\d{2}-\d{2}$/,
  "lastUpdated should be an ISO date",
);

/* ---------- docs ---------- */

const readme = read("README.md");
assert.match(readme, /GitHub Pages/, "README should document GitHub Pages deployment");
assert.match(readme, /data\/site\.js/, "README should explain where to edit content");

console.log(
  `Static site checks passed — ${site.live.length} live, ${site.next.length} in progress.`,
);
