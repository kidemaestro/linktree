/**
 * Renders the HTML art in scripts/art/ to the images the page uses:
 *
 *   scripts/art/cover-betwithbat.html  -> assets/img/betwithbat.webp
 *   scripts/art/cover-usetoolcraft.html -> assets/img/usetoolcraft.webp
 *   scripts/art/social-card.html       -> assets/social-card.jpg (the X / Open Graph preview)
 *   assets/favicon.svg                 -> assets/apple-touch-icon.png, assets/favicon-32.png
 *
 * Only needed when you change one of those templates. The site itself has no build step.
 * Needs Playwright with Chromium, from the project or a global install:
 *
 *   npx -y -p playwright node scripts/render-art.mjs
 *   # or, with a global install: NODE_PATH="$(npm root -g)" node scripts/render-art.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";
import path from "node:path";

const root = process.cwd();
const require = createRequire(import.meta.url);

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    try {
      const globalRoot = execSync("npm root -g", { encoding: "utf8" }).trim();
      return require(path.join(globalRoot, "playwright"));
    } catch {
      console.error("Playwright is not installed. Run: npx -y -p playwright node scripts/render-art.mjs");
      process.exit(1);
    }
  }
}

const JOBS = [
  { page: "scripts/art/cover-betwithbat.html", out: "assets/img/betwithbat.webp", type: "webp", quality: 0.82 },
  { page: "scripts/art/cover-usetoolcraft.html", out: "assets/img/usetoolcraft.webp", type: "webp", quality: 0.82 },
  { page: "scripts/art/social-card.html", out: "assets/social-card.jpg", type: "jpeg", quality: 0.9 },
];

const ICONS = [
  { size: 180, out: "assets/apple-touch-icon.png" },
  { size: 32, out: "assets/favicon-32.png" },
];

const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

/** Chrome refuses fonts over file://, so the templates are served from a throwaway local server. */
function serve() {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

/** Screenshots are PNG; Chromium's own canvas encoder turns them into WebP or JPEG. */
async function encode(page, png, type, quality) {
  const dataUrl = await page.evaluate(
    async ({ src, mime, q }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      return canvas.toDataURL(mime, q);
    },
    { src: `data:image/png;base64,${png.toString("base64")}`, mime: `image/${type}`, q: quality },
  );
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

const { chromium } = loadPlaywright();
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();

try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  for (const job of JOBS) {
    await page.goto(`${base}/${job.page}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const png = await page.locator("#art").screenshot();
    const bytes = await encode(page, png, job.type, job.quality);
    fs.writeFileSync(path.join(root, job.out), bytes);
    console.log(`${job.out}  ${(bytes.length / 1024).toFixed(0)} KB`);
  }

  for (const icon of ICONS) {
    await page.setViewportSize({ width: icon.size, height: icon.size });
    await page.setContent(
      `<style>html,body{margin:0;background:transparent}</style><img src="${base}/assets/favicon.svg" width="${icon.size}" height="${icon.size}" style="display:block">`,
    );
    await page.evaluate(() => document.images[0].decode());
    const png = await page.screenshot({ omitBackground: true });
    fs.writeFileSync(path.join(root, icon.out), png);
    console.log(`${icon.out}  ${(png.length / 1024).toFixed(1)} KB`);
  }
} finally {
  await browser.close();
  server.close();
}
