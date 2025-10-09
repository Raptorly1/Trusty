import { test, expect } from '@playwright/test';

// Update this URL if your dev server runs on a different port
const BASE_URL = 'http://localhost:5173/';

test.describe('Navigation', () => {
  test('User can navigate to NextGen Feedback page from homepage', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    // Wait for a unique heading on the homepage to ensure hydration
    await expect(page.getByRole('heading', { name: /why trust matters online/i })).toBeVisible({ timeout: 10000 });
    // Try a partial text match for the button
    const nextGenBtn = page.getByRole('button', { name: /next-gen feedback/i });
    try {
      await expect(nextGenBtn).toBeVisible({ timeout: 10000 });
      await nextGenBtn.click();
    } catch (e) {
      await page.screenshot({ path: 'playwright-debug-homepage.png', fullPage: true });
      // Log the HTML for debugging
      const content = await page.content();
      require('fs').writeFileSync('playwright-debug-homepage.html', content);
      throw e;
    }
    // Check for a unique heading on the NextGen Feedback page
    await expect(page.getByRole('heading', { name: /welcome to nextgen feedback/i })).toBeVisible();
    // Optionally, check for onboarding or editor elements
  });
});
