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
  "data/site.js",
  "README.md",
  ".gitignore",
];

for (const filePath of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, filePath)), `${filePath} should exist`);
}

const html = read("index.html");
assert.match(html, /<main id="app"/, "HTML should expose the app mount point");
assert.match(html, /data\/site\.js/, "HTML should load editable site data");
assert.match(html, /assets\/script\.js/, "HTML should load the renderer");
assert.match(html, /assets\/styles\.css/, "HTML should load the stylesheet");
assert.match(html, /og:title/, "HTML should include share metadata");
assert.match(html, /id="overview-grid"/, "HTML should include at-a-glance overview");
assert.match(html, /id="upcoming-groups"/, "HTML should include grouped upcoming projects");
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

const styles = read("assets/styles.css");
assert.match(styles, /@media\s*\(max-width:\s*720px\)/, "CSS should include mobile rules");
assert.match(styles, /\.project-card/, "CSS should style project cards");
assert.match(styles, /\.overview-grid/, "CSS should style overview panel");

const dataContext = { window: {} };
vm.runInNewContext(read("data/site.js"), dataContext);
const site = dataContext.window.SiteConfig;
assert.ok(site.profile.name, "profile name should be editable");
assert.ok(site.profile.handle, "profile handle should be editable");
assert.ok(site.profile.primaryCta.url, "primary CTA should have a URL");
assert.ok(site.sections.published.length >= 2, "published projects should include examples");
assert.ok(site.sections.upcoming.length >= 2, "upcoming projects should include examples");
assert.ok(site.socialLinks.length >= 2, "social links should include examples");

for (const project of [...site.sections.published, ...site.sections.upcoming]) {
  assert.ok(project.title, "project should have a title");
  assert.ok(project.summary, `${project.title} should have a summary`);
  assert.ok(project.description, `${project.title} should have a description`);
  assert.ok(project.status, `${project.title} should have a status");
  assert.ok(Array.isArray(project.links), `${project.title} links should be an array");
}

const script = read("assets/script.js");
assert.match(script, /renderUpcomingSection/, "renderer should build grouped upcoming sections");
assert.match(script, /published-projects/, "renderer should target published projects");
assert.match(script, /upcoming-groups/, "renderer should target upcoming groups");

const readme = read("README.md");
assert.match(readme, /GitHub Pages/, "README should document GitHub Pages deployment");
assert.match(readme, /data\/site\.js/, "README should explain where to edit content");

console.log("Static site checks passed.");
