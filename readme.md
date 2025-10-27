# LaunchPad Sites — multi-tenant static web app template

LaunchPad Sites turns this repository into a reusable starter that you can clone for every customer. Each tenant gets their own GitHub repository, Decap CMS admin area, and Azure Static Web App instance. Provisioning can be fully automated, so you deliver client-ready microsites in seconds.

## Why this template?

- **Per-user isolation.** Every customer works inside a dedicated repo. Core files can be locked with the provided read-only script, while content lives in JSON/Markdown so it is safe to edit.
- **Decap CMS out of the box.** `/admin` exposes a Git-backed CMS for editing `content/site.json` and the Markdown pages under `content/pages/`.
- **Azure-native deployment.** The included GitHub Action publishes to Azure Static Web Apps with zero build tooling.
- **Automation friendly.** Pair this repo with an Azure Function to create repos, wire secrets, and invite collaborators programmatically.

## Repository layout

```
/
├── src/
│   ├── index.html           # Home page shell
│   ├── pages/               # Additional routed pages (about, contact)
│   ├── css/styles.css       # Theme-aware styling
│   └── js/app.js            # Runtime loader for JSON + Markdown content
├── content/
│   ├── site.json            # Global configuration, navigation, theme, hero copy
│   └── pages/*.md           # Markdown content rendered into each page
├── assets/images/           # Shared imagery
├── admin/config.yml         # Decap CMS collections and GitHub backend
├── tools/
│   ├── dev-server.mjs       # Zero-dependency local web server
│   └── make-readonly.sh     # Helper to lock core template files
└── .github/workflows/       # Azure Static Web Apps deployment pipeline
```

## Quick start

```bash
npm install
npm start
```

The dev server serves files from `src/` at [http://localhost:8000](http://localhost:8000) and exposes the repository root so `/content`, `/assets`, and `/admin` are available during development. Update `content/site.json` or any Markdown file and refresh to see your changes.

## Multi-tenant architecture

The accompanying business model looks like this:

1. Customer signs up on your portal.
2. An Azure Function (or other automation) clones this template into a new GitHub repo via your GitHub App.
3. The function creates an Azure Static Web App instance linked to that repo and stores the deployment token as a secret.
4. GitHub Actions (see `.github/workflows/deploy.yml`) deploy the site automatically.
5. Customer logs in to `/admin` (Decap CMS) to edit content; changes become commits that trigger new deployments.

Provisioning end-to-end takes ~15 seconds once your automation is in place.

## Azure Static Web App deployment

1. Create an Azure Static Web App in your tenant and note the deployment token.
2. Add the token as the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in the repo.
3. Adjust `.github/workflows/deploy.yml` with your SWA name and environment if needed. The workflow copies `content/`, `assets/`, and `admin/` into `src/` before uploading so they are available at runtime.
4. Push to `main` or raise a PR — the workflow installs dependencies (for Playwright tests) and publishes the staged `src/` directory to Azure.

## Decap CMS configuration

- Update `admin/config.yml` with your GitHub organisation/repo and OAuth proxy details.
- Configure the GitHub App redirect URI to point at your OAuth proxy or Decap authentication endpoint.
- Media uploads default to `assets/images/uploads`. Point Decap at Azure Blob Storage if you need shared media hosting.

## Content editing model

- Global site settings, hero copy, navigation, features, contact copy, and footer links live in `content/site.json`.
- Markdown files in `content/pages/` feed the home, about, and contact pages. Add more Markdown files plus matching HTML shells in `src/pages/` to grow the site.
- `src/js/app.js` fetches `content/site.json`, applies theme tokens as CSS variables, hydrates the hero/features/contact sections, and renders Markdown using `marked`.

## Marking core files read-only

Lock down the baseline template before handing the repo to clients or agencies:

```bash
./tools/make-readonly.sh          # lock src/, content/, admin/, workflow files
./tools/make-readonly.sh --revert # restore write permissions
```

Combine this script with GitHub branch protections for additional safeguards.

## Suggested roadmap

- Wire an Azure Function to your signup flow so repos and SWA instances are created automatically.
- Offer paid tiers (Starter, Growth, Pro) aligned with your infrastructure costs, as outlined in `content/pages/home.md`.
- Monetise add-ons such as analytics, uptime monitoring, or white-label branding.

Happy launching!
