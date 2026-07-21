import { test, expect } from '@playwright/test';
import { GeneratedPage } from '../pages/GeneratedPage';

test('should successfully login to OrangeHRM', async ({ page }) => {
  const loginPage = new GeneratedPage(page);
  await loginPage.navigate();
  await loginPage.login('Admin', 'admin123');
  await expect(page).toHaveURL(/.*dashboard/);
});