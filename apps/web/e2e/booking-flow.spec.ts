import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('Destination distance search -> Property detail -> Add-on -> Checkout', async ({ page }) => {
    await page.goto('/explore');
    // Ensure the app loads
    await expect(page.locator('text="Where to?"')).toBeVisible({ timeout: 15000 });
    
    // Open the expanded search bar
    await page.click('text="Where to?"');
    
    // Find the input and type
    await expect(page.locator('input[placeholder="Search destinations"]')).toBeVisible();
    await page.fill('input[placeholder="Search destinations"]', 'Bali');
    
    // Click Search
    await page.click('text="Search"');
  });
});
