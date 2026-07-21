import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Only look in the root 'tests' folder
  reporter: [['html', { open: 'never' }], ['list']], // Generates report
  testDir: './tests', 
  timeout: 30000,
  use: {
    headless: false,
    baseURL: 'https://www.saucedemo.com/',
    browserName: 'chromium',
  },
  reporter: 'list',
});