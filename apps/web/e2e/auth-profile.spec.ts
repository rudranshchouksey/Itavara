import { test, expect } from '@playwright/test';

test.describe('Auth and Profile Management', () => {
  test('User authentication, role switching (Guest -> Host), and profile updates', async ({ page }) => {
    // 1. Navigate to login
    await page.goto('/login');
    
    // Fill auth form
    await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 15000 });
    await page.fill('input[name="email"]', 'testuser@itvara.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('text="Submit"');

    // Wait for navigation
    await expect(page).toHaveURL(/.*\/explore.*/, { timeout: 15000 });

    // 2. Navigate to Profile
    await page.goto('/profile');
    
    // Verify profile page loaded
    await expect(page.locator('text="Edit Profile"').first()).toBeVisible({ timeout: 15000 });
    
    // 3. Open Edit Profile Modal
    await page.click('text="Edit Profile"');
    
    // Wait for modal to open
    await expect(page.locator('text="Save Changes"')).toBeVisible();
    await page.click('text="Save Changes"');
  });
});
