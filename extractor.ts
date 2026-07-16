import { chromium } from 'playwright';
import * as fs from 'node:fs';

async function extractDOMSchema(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'commit', timeout: 60000 });

  const schema = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, input, select, textarea, a'));
    
    return elements.map((el) => {
      const element = el as HTMLElement;
      return {
        tag: element.tagName.toLowerCase(),
        type: element.getAttribute('type') || null,
        id: element.id || null,
        data_testid: element.getAttribute('data-testid') || element.getAttribute('data-cy') || null,
        aria_label: element.getAttribute('aria-label') || null,
        placeholder: element.getAttribute('placeholder') || null,
      };
    }).filter(el => el.id || el.data_testid || el.aria_label); 
  });

  await browser.close();
  
  fs.writeFileSync('dom-schema.json', JSON.stringify({ url, elements: schema }, null, 2));
  console.log('Schema saved to dom-schema.json');
}

extractDOMSchema('https://www.saucedemo.com/').catch(console.error);