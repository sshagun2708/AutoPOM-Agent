import * as fs from 'node:fs';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generatePOM() {
  const schemaRaw = fs.readFileSync('dom-schema.json', 'utf-8');
  const schema = JSON.parse(schemaRaw);

  let code = `import { Locator, Page } from '@playwright/test';\n\n`;
  code += `export class GeneratedPage {\n`;
  
  // Define Locators
  schema.elements.forEach((el: any) => {
    const name = el.id || el.data_testid || 'element';
    code += `  private readonly ${name.replace(/-/g, '')}: Locator;\n`;
  });

  // Constructor
  code += `\n  constructor(private readonly page: Page) {\n`;
  schema.elements.forEach((el: any) => {
    const name = el.id || el.data_testid || 'element';
    const selector = el.data_testid ? `[data-testid="${el.data_testid}"]` : `#${el.id}`;
    code += `    this.${name.replace(/-/g, '')} = page.locator('${selector}');\n`;
  });
  code += `  }\n\n`;

  // Auto-generate Action Methods
  schema.elements.forEach((el: any) => {
    const name = el.id || el.data_testid || 'element';
    const cleanName = name.replace(/-/g, '');
    
    if (el.tag === 'input') {
      code += `  async fill${capitalize(cleanName)}(value: string) {\n`;
      code += `    await this.${cleanName}.fill(value);\n`;
      code += `  }\n\n`;
    } else if (el.tag === 'button') {
      code += `  async click${capitalize(cleanName)}() {\n`;
      code += `    await this.${cleanName}.click();\n`;
      code += `  }\n\n`;
    }
  });

  code += `}\n`;

  fs.writeFileSync('./tests/GeneratedPage.ts', code);
  console.log('Success! Page Object Model with actions generated in ./tests/GeneratedPage.ts');
}

generatePOM();