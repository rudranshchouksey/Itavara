import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('Destination distance search -> Property detail -> Add-on -> Checkout', async ({ page }) => {
    // 1. Home page search
    await page.goto('/');
    
    // Fill search input
    await page.fill('input[placeholder="Where are you going?"]', 'Bali');
    await page.click('button:has-text("Search")');
    
    // Validate search results page
    await expect(page).toHaveURL(/.*\/search\?q=Bali/);
    
    // 2. Click on the first property card
    // Wait for properties to load
    const firstProperty = page.locator('.listing-card').first();
    await expect(firstProperty).toBeVisible();
    await firstProperty.click();
    
    // 3. Property detail view
    await expect(page).toHaveURL(/.*\/listings\/.*/);
    await expect(page.locator('h1')).toBeVisible(); // Property Title
    
    // 4. Select Dates
    // Assuming date picker logic
    await page.click('button:has-text("Check-in")');
    await page.click('.day-available >> nth=0'); // Click a start date
    await page.click('.day-available >> nth=3'); // Click an end date
    
    // 5. Add-on selection (cabs/attire/guide)
    await page.click('button:has-text("Add-ons")');
    const guideCheckbox = page.locator('input[name="localGuide"]');
    if (await guideCheckbox.isVisible()) {
        await guideCheckbox.check();
    }
    
    // 6. Checkout flow
    await page.click('button:has-text("Reserve")');
    
    // Validate checkout page
    await expect(page).toHaveURL(/.*\/checkout/);
    await expect(page.locator('text=Confirm and pay')).toBeVisible();
  });
});
