Below is a **single‑file** Playwright Page Object Model (POM) that follows all the requested conventions:

* **PascalCase** for the class name (`LoginPage`)  
* **camelCase** for every locator and method name  
* All locators are declared with `private readonly`  
* The POM exposes only the API needed by tests (navigation, actions, assertions)  

ts
// LoginPage.ts
import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for https://www.saucedemo.com/
 *
 * The page is the login screen – it contains:
 * - Username input
 * - Password input
 * - Login button
 * - Optional error message
 *
 * All locators are declared as `private readonly` and are never exposed
 * outside the class.  The class provides high‑level actions that tests
 * can use without caring about the underlying DOM structure.
 */
export class LoginPage {
  // ---- Private locators ----------------------------------------------------
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  // ---- Constructor ----------------------------------------------------------
  constructor(private readonly page: Page) {
    // Initialize the locators
    this.usernameInput = this.page.locator('#user-name');
    this.passwordInput  = this.page.locator('#password');
    this.loginButton    = this.page.locator('#login-button');
    // The error message is inside a div with class '.error-message-container'
    this.errorMessage   = this.page.locator('.error-message-container');
  }

  // ---- Public navigation ----------------------------------------------------
  /**
   * Opens the SauceDemo login page.
   */
  async goTo(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  // ---- Public actions -------------------------------------------------------
  /**
   * Enters the username into the username field.
   * @param username - The username to type.
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Enters the password into the password field.
   * @param password - The password to type.
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the login button.
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Performs a full login flow.
   * @param username - Username to log in with.
   * @param password - Password to log in with.
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // ---- Public assertions / getters -----------------------------------------
  /**
   * Returns the error message text if an error is displayed.
   * Returns an empty string if the element is not visible.
   */
  async getErrorText(): Promise<string> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent() ?? '';
    }
    return '';
  }

  /**
   * Checks if the login button is enabled.
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }
}


---

### How to use this POM in a test

ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

test('valid login redirects to inventory page', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goTo();
  await loginPage.login('standard_user', 'secret_sauce');

  // After login you can assert the URL or any element on the inventory page.
  await expect(page).toHaveURL(/inventory.html$/);
});

test('invalid login shows error message', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goTo();
  await loginPage.login('invalid_user', 'wrong_password');

  const error = await loginPage.getErrorText();
  expect(error).toContain('Epic sadface: Username and password do not match any user in this service');
});


Feel free to extend the class (e.g., add methods for clearing fields, retrieving the page title, etc.) without exposing the underlying locators. This keeps the test code clean, readable, and maintainable.