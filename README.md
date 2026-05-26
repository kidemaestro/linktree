# Static Linktree Portfolio

**Live site:** https://kidemaestro.github.io/linktree/

A small, dependency-free project hub for your X bio. It is designed to run forever on GitHub Pages without a build step.

If you rename the GitHub repo or use a custom domain, update the canonical and Open Graph URLs in `index.html` so social cards keep working.

## Update Your Content

Edit `data/site.js` to change:

- Profile name, handle, initials, tagline, and CTA links
- Published projects that people can try now
- Upcoming projects grouped by stage (`shipping`, `building`, `research`, `company`, `backlog`)
- Social links and the `lastUpdated` date

Each project supports:

- `title`
- `summary` (one-line hook shown on the card)
- `status`
- `description`
- `tags`
- `links`
- `group` (for upcoming projects only)

## Preview Locally

From the project folder, run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

You can also run the no-dependency validation script:

```powershell
node scripts/test-static-site.mjs
```

## Deploy On GitHub Pages

1. Create a new GitHub repository named `linktree`.
2. Push this project to the repository.
3. In GitHub, open the repository settings.
4. Go to **Pages**.
5. Set **Source** to **Deploy from a branch**.
6. Select the `main` branch and the `/root` folder.
7. Save.

Your page will be available at:

```text
https://<github-username>.github.io/linktree/
```

Use that URL in your X bio.

## Suggested Git Commands

```powershell
git branch -M main
git add .
git commit -m "Create static project hub"
git remote add origin https://github.com/<github-username>/linktree.git
git push -u origin main
```

Replace `<github-username>` with your GitHub username before running the remote command.