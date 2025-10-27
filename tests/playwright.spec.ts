import { test, expect } from '@playwright/test';

test('renders hero headline and navigation', async ({ page }) => {
  await page.goto('/');
  const heroTitle = page.locator('[data-hero-title]');
  await expect(heroTitle).toContainText('Provision a production-ready static site per customer');
  await expect(page.locator('[data-nav-list] li')).toHaveCount(4);
});