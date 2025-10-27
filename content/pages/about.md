# Architecture overview

The LaunchPad Sites template mirrors the production layout for each tenant you onboard:

```
/
├── content/          # JSON + Markdown edited via Decap CMS
├── assets/           # Shared imagery and brand tokens
├── src/
│   ├── index.html    # Home page served from Azure Static Web Apps
│   ├── pages/        # Additional routed pages
│   ├── css/          # Theme-aware styles
│   └── js/           # Runtime content loader + CMS helpers
├── admin/            # Decap CMS configuration
└── .github/workflows # Azure SWA deployment pipeline
```

## Why per-user repos?

- **Isolation.** Bugs or experiments in one tenant never impact the rest of your customers.
- **Upstream updates.** Use the GitHub API to raise pull requests from this template into downstream repos.
- **Billing clarity.** Azure Static Web Apps pricing is easy to attribute when every customer lives in their own subscription.

## Automation in 15 seconds

Provisioning is handled by an Azure Function that stitches together the GitHub and Azure APIs:

1. Receive a signup event from Stripe, LemonSqueezy, or your portal.
2. Use a GitHub App to create a repo from this template and invite the customer.
3. Create an Azure Static Web App with the repo connected and store the deployment token as a repo secret.
4. Optionally generate Blob Storage containers for media uploads.

## Optional backend services

- **Azure Functions** for server-side form handling, scheduled jobs, or light personalization.
- **Azure Storage** as the Decap CMS media backend.
- **Supabase, Firebase, or Cosmos DB** if you graduate to richer data models or authentication.

## Deploying updates at scale

When you improve the template, script a GitHub workflow that raises pull requests to every downstream repo. Because all content lives in `content/`, you can merge structural changes without overwriting tenant-specific copy.
