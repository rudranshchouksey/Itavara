import { test, expect } from '@playwright/test';

test.describe('Social Feed to Instant Booking', () => {
  test('Mini-blog reading -> Clickable itinerary card -> Instant booking drawer', async ({ page }) => {
    // 1. Navigate to the social feed
    await page.goto('/feed');
    
    // Wait for feed to load
    await expect(page.locator('.feed-container')).toBeVisible({ timeout: 10000 });
    
    // 2. Interact with a mini-blog
    const firstPost = page.locator('.mini-blog-post').first();
    await expect(firstPost).toBeVisible();
    
    // Scroll to it or read more if necessary
    await firstPost.scrollIntoViewIfNeeded();
    
    // 3. Click the embedded itinerary card
    const itineraryCard = firstPost.locator('.itinerary-card');
    if (await itineraryCard.isVisible()) {
        await itineraryCard.click();
        
        // 4. Validate instant booking drawer slides open
        const bookingDrawer = page.locator('.booking-drawer');
        await expect(bookingDrawer).toBeVisible();
        await expect(bookingDrawer).toHaveClass(/drawer-open/);
        
        // Ensure booking CTA is present in the drawer
        await expect(bookingDrawer.locator('button:has-text("Instant Book")')).toBeVisible();
    }
  });
});
