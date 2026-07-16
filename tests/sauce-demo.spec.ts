import { test, expect } from '@playwright/test';
import { GeneratedPage } from './GeneratedPage.js';

test('login using generated POM', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  
  const loginPage = new GeneratedPage(page);
  
  // Now you can use your generated locators
  // e.g., await loginPage.username.fill('standard_user');
  
  console.log('Successfully instantiated the generated POM!');
});