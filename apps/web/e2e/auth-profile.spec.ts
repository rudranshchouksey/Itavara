import { test, expect } from '@playwright/test';

test.describe('Auth and Profile Management', () => {
  test('User authentication, role switching (Guest -> Host), and profile updates', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/');

    // 2. Click Login
    // Note: Assuming a 'Login' button exists or a placeholder route
    await page.goto('/login');
    
    // 3. Fill auth form
    await page.fill('input[name="email"]', 'testuser@itvara.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for navigation back to home or dashboard
    await expect(page).toHaveURL('/');

    // 4. Navigate to Profile
    await page.goto('/profile');
    
    // 5. Update Profile Name
    await page.fill('input[name="displayName"]', 'Automated Test User');
    await page.click('button:has-text("Save")');
    
    // Validate success message
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();

    // 6. Role Switch (Guest -> Host)
    // Assuming a toggle or button to switch roles
    await page.click('button:has-text("Switch to Hosting")');
    
    // Validate host dashboard or indicator
    await expect(page).toHaveURL(/.*\/host/);
    await expect(page.locator('text=Host Dashboard')).toBeVisible();
  });
});
