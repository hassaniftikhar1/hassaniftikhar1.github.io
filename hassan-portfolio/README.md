# Hassan Iftikhar — AI × LCA × Circular Economy Portfolio

A complete, interactive academic and professional portfolio ready for **GitHub Pages**. Built entirely with HTML, CSS and vanilla JavaScript. No backend, paid hosting, API key, npm setup, or build pipeline is required.

## Design direction

**Headline:** “Where AI meets circular impact.”

The site presents Hassan's established work in life cycle assessment, materials engineering and circular systems while clearly labelling AI-enabled projects that are still conceptual. It uses a deep midnight palette, lime/sage highlights, teal gradient typography and an abstract node network instead of personal photography.

## What's inside

- Animated hero with a cursor-responsive particle network, orbit parallax and rotating research interests
- Desktop cursor glow and ring, gentle magnetic CTAs and cursor-sensitive project cards
- Responsive navigation, dark/light theme, scroll indicator and subtle section entrances
- About and portrait placeholder (no photo supplied yet)
- Education and professional experience timeline with accessible tabs
- **15 projects** with research descriptions, categories, live search, category filters and detail pop-ups
- **Interactive BioDenim climate comparison** with separate system boundaries (fabric vs full product, PT assembly)
- **8 recognition cards** plus the Global Cleaner Production Conference 2026 poster
- Technical skills, leadership, LinkedIn and email contact
- Respect for `prefers-reduced-motion`; cursor-only features automatically disable on touch devices

### Profile content and claims

Content was curated from Hassan's existing CVs and research/project discussion. The AMIR master's is **in progress**, Grenoble INP is described as **Master 1**, the Saint-Gobain award is a **team achievement**, and Terralynq's AI functionality is a **concept**, not a deployed service. BioDenim numbers are **scenario-specific LCA model outputs**, not product certification. There are **no fictional papers, DOIs, photos, demo sites, employers or work samples**.

Review all public-facing statements and project figures before publishing, particularly if any research results have not yet been cleared for public release.

## Publish for free on GitHub Pages

1. Create a **public repository** on your GitHub account with the exact name `YOUR-USERNAME.github.io` (substitute your real username, preserving punctuation).
2. Upload the **contents of this folder** to the repository root; you should see `index.html`, `.nojekyll`, `assets/` and this `README.md` at top level.
3. Commit the files to the `main` branch.
4. Open **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, `main`, and `/(root)`, then Save.
5. Your public URL becomes `https://YOUR-USERNAME.github.io/` after publication completes.

Or create a normal repository such as `portfolio`, using `https://YOUR-USERNAME.github.io/portfolio/`. All website references are relative, so both options work.

Official guide: https://docs.github.com/en/pages/quickstart

### Local preview

Double-click `index.html` in a modern browser, or (more reliably) run:

```bash
cd hassan-portfolio
python3 -m http.server 8000
```

Visit `http://localhost:8000`.

### File map

| File | Purpose |
|---|---|
| `index.html` | Main page, profile, awards, education, experience, skills and contact |
| `assets/css/style.css` | All visual styling and responsive layouts |
| `assets/js/data.js` | **Editable project collection (15 projects)** |
| `assets/js/main.js` | Project search, filtering, dialogs, themes, tabs and LCA chart |
| `assets/js/experience.js` | Cursor-responsive network, tilt, magnetic buttons and animated phrases |
| `assets/images/` | Your photos and future project image assets |
| `.nojekyll` | Prevents GitHub Pages/Jekyll from interfering with static files |

### Adding your photos later

In `assets/images/`, add a headshot named `profile.jpg`. In `index.html`, search for `portrait-placeholder` and replace its entire containing element with:

```html
<img class="profile-photo" src="assets/images/profile.jpg" alt="Portrait of Hassan Iftikhar" loading="lazy">
```

Then add to the end of `assets/css/style.css`:

```css
.profile-photo { width:100%; height:405px; object-fit:cover; border-radius:8px; display:block; }
```

For project images, replace the CSS-only art inside project cards via `assets/js/main.js` with your own image assets and add descriptive alt text. Until supplied, all project cards intentionally use abstract, code-generated gradients.

### Updating your social links

The publicly shown contact address is `engr.hassaniftikhar@gmail.com`. LinkedIn points to `linkedin.com/in/hassaniftikhar1`. The GitHub username/profile link has **not** been guessed; add it once you supply the exact handle. No home address, phone number, birth date or government identifiers are published.

### Important

This website is static. Its contact links open mail and LinkedIn; there is no data-collecting form or third-party analytics. Local browser theme preference may be saved on the visitor's device. The AI visuals are interactive design, **not** a claimed AI model running on the website.
