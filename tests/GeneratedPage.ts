Below is a **clean, modular Playwright Page Object Model (POM)** written in **TypeScript** for the SauceDemo site.  
The implementation follows the requested conventions:

| Convention | Example |
|------------|---------|
| **Class names** | `LoginPage` (PascalCase) |
| **Locators** | `usernameInput`, `passwordInput` (camelCase) |
| **Private readonly locators** | `private readonly usernameInput: Locator;` |

> **Test‑Case ID** – `uploads/ef1431a11ae3432620234a5a4f73d60a`  
> (Included in the JSDoc for reference.)

---

## File Structure


src/
├─ pages/
│  ├─ LoginPage.ts
│  └─ InventoryPage.ts   // (optional – for post‑login navigation)
├─ tests/
│  └─ login.spec.ts
└─ utils/
   └─ basePage.ts


> All files below are ready to drop into a Playwright project (e.g. created by `npx playwright init`).

---

## 1️⃣ `src/pages/basePage.ts`

A tiny base class that gives every page the `page` object and a `url` getter.

ts
// src/pages/basePage.ts
import { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** URL of the current page – override in subclasses */
  protected abstract get url(): string;

  /** Navigate to the page’s URL */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }
}


---

## 2️⃣ `src/pages/LoginPage.ts`

The core POM for the SauceDemo login screen.

ts
// src/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

/**
 * Page Object for the SauceDemo login page.
 *
 * @testCaseId uploads/ef1431a11ae3432620234a5a4f73d60a
 */
export class LoginPage extends BasePage {
  // ---------- Locators ----------
  private readonly usernameInput: Locator = this.page.locator('#user-name');
  private readonly passwordInput: Locator = this.page.locator('#password');
  private readonly loginButton: Locator   = this.page.locator('#login-button');
  private readonly errorMessage: Locator  = this.page.locator('[data-test="error"]');

  // ---------- Page metadata ----------
  protected override get url(): string {
    return 'https://www.saucedemo.com/';
  }

  // ---------- Actions ----------
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /** Performs a complete login flow */
  async login(username: string, password: string): Promise<void> {
    await Promise.all([
      this.fillUsername(username),
      this.fillPassword(password),
      this.clickLogin()
    ]);
  }

  // ---------- Assertions ----------
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() ?? '';
  }
}


---

## 3️⃣ `src/pages/InventoryPage.ts`  *(optional but useful post‑login)*

A minimal POM for the inventory page that the user sees after a successful login.

ts
// src/pages/InventoryPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class InventoryPage extends BasePage {
  private readonly inventoryItem: Locator = this.page.locator('.inventory_item');
  private readonly menuButton: Locator  = this.page.locator('#react-burger-menu-btn');
  private readonly logoutLink: Locator   = this.page.locator('#logout_sidebar_link');

  protected override get url(): string {
    return 'https://www.saucedemo.com/inventory.html';
  }

  /** Clicks the logout link */
  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  /** Returns number of inventory items displayed */
  async countItems(): Promise<number> {
    return await this.inventoryItem.count();
  }
}


---

## 4️⃣ Example test – `src/tests/login.spec.ts`

A short, self‑contained Playwright test that demonstrates how the POMs are used.

ts
// src/tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('SauceDemo – Login flow', () => {
  test('valid credentials navigate to inventory', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    // Verify we are on the inventory page
    await expect(page).toHaveURL(inventory.url);
    await expect(await inventory.countItems()).toBeGreaterThan(0);
  });

  test('invalid credentials display error', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('wrong_user', 'wrong_pass');

    await expect(login.isErrorVisible()).toBeTruthy();
    await expect(login.getErrorMessage()).toContain('Username and password do not match any user in this service');
  });
});


---

## How to Run

bash
# 1️⃣ Install dependencies
npm install

# 2️⃣ Run the tests
npx playwright test


---

### Why this design?

| Benefit | Explanation |
|---------|-------------|
| **Modularity** | Each page lives in its own file. New pages can be added without touching existing code. |
| **Encapsulation** | Locators are `private readonly`, exposing only high‑level actions. |
| **Readability** | Method names mirror user intent (`login`, `logout`, `countItems`). |
| **Reusability** | BasePage gives a single place to manage navigation logic. |

Feel free to extend the POMs (e.g., add product detail page, cart page) or tweak the locators if the website changes. Happy testing!