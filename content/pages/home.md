# Multi-tenant static web apps without the overhead

LaunchPad Sites gives every customer an isolated repo, automated Azure Static Web App, and CMS-driven editing experience. Duplicate this repo as a GitHub template and your onboarding workflow can provision a ready-to-brand site in seconds.

- **Opinionated content model.** JSON + Markdown drives page copy, so your clients stay inside a safe editing sandbox.
- **Read-only core.** Mark foundational files immutable with `./tools/make-readonly.sh` before handing the repo to customers.
- **Bring-your-own email.** Connect the contact form to Azure Functions, Resend, SendGrid, or any HTTPS endpoint.

## Platform highlights

1. **Per-user repositories.** Fork or template this repo to guarantee isolation for every paying customer.
2. **Decap CMS admin panel.** The `/admin` route provides a friendly UI that commits straight to Git.
3. **Azure Static Web Apps.** Each repo connects to a dedicated SWA instance for previews, production, and custom domains.
4. **Automation hooks.** Pair Azure Functions with the GitHub API to spin up repos, secrets, and users on demand.

## Provisioning flow

1. Customer purchases a plan on your marketing site.
2. Azure Function fires, creating a repo from this template via the GitHub API.
3. Function creates an Azure Static Web App and links the new repo + workflow secret.
4. GitHub Action deploys the initial site. Customer receives their `/admin` invite.

## Editing experience

Decap CMS reads directly from `content/site.json` and the Markdown files in `content/pages/`. You can change the collections in `admin/config.yml` to match your preferred content model. Every save is a commit, so standard PR reviews and audit history remain intact.

## Cost controls

- Stay on the free Azure Static Web App tier until traffic scales.
- Reuse one Azure Storage account with per-tenant containers for media uploads.
- Allow clients to self-manage billing by connecting Azure Cost Management to each subscription.

## Pricing

| Tier | Monthly price | Your estimated cost | Gross margin | What’s included |
|------|---------------|---------------------|--------------|-----------------|
| Starter | £9 | £1.50 | 83% | 1-page site, contact form, SSL |
| Growth | £19 | £2.00 | 89% | Up to 5 pages, custom domain, analytics |
| Pro | £39 | £3.00 | 92% | Blog, Decap CMS upgrades, backup automation |

> 💡 Charge a one-time setup fee (£99–£199) for white-glove onboarding and content migration.

## Next steps

- Configure the GitHub backend values in `admin/config.yml`.
- Create an Azure Function that provisions repos + SWA resources.
- Share the template with clients or agencies and keep iterating on the content model.
