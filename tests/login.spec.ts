import { test, expect } from '@playwright/test';
import { LoginPage } from './GeneratedPage'; 

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Use the 'navigate' method as defined in your LoginPage class
  await loginPage.navigate(); 
  
  // Perform login
  await loginPage.login('standard_user', 'secret_sauce');

  // Verify successful navigation to inventory page
  await expect(page).toHaveURL(/.*inventory.html/);
});