import { chromium } from 'playwright';
import * as fs from 'node:fs';

async function extractDOMSchema(url: string) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    console.log(`Navigating to: ${url}`);
    
    // Use 'domcontentloaded' or 'networkidle'
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

    // Broaden selection: include all common interactive tags
    const schema = await page.evaluate(() => {
      const selectors = 'button, input, select, textarea, a';
      const elements = Array.from(document.querySelectorAll(selectors));
      
      return elements.map((el) => {
        const element = el as HTMLElement;
        return {
          tag: element.tagName.toLowerCase(),
          type: element.getAttribute('type') || null,
          id: element.id || null,
          data_testid: element.getAttribute('data-testid') || element.getAttribute('data-cy') || null,
          name: element.getAttribute('name') || null, // ADDED: name is often used in forms
          aria_label: element.getAttribute('aria-label') || null,
          placeholder: element.getAttribute('placeholder') || null,
          text: element.innerText?.substring(0, 20) || null // ADDED: text content helps identify elements
        };
      }).filter(el => el.id || el.data_testid || el.name || el.aria_label); 
    });

    console.log(`Found ${schema.length} elements.`);
    
    if (schema.length === 0) {
      // Print page content to debug if empty
      const content = await page.content();
      console.log("Page Content Snippet:", content.substring(0, 500));
      throw new Error("No elements captured.");
    }

    fs.writeFileSync('dom-schema.json', JSON.stringify({ url, elements: schema }, null, 2));
  } catch (error) {
    console.error("Extractor Failed:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

const targetUrl = process.argv[2] || 'https://www.saucedemo.com/';
extractDOMSchema(targetUrl);