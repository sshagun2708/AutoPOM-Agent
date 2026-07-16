import 'dotenv/config';
import { OpenAI } from 'openai';
import * as fs from 'node:fs';
import { execSync } from 'child_process';

// Initialize Groq client
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function runAgent(turl: string, testRequirements: string) {
  console.log("🤖 AutoPOM Agent: Starting extraction...");

  try {
    // 1. Run the extractor
    execSync('npx tsx extractor.ts', { stdio: 'inherit' });

    if (!fs.existsSync('dom-schema.json')) {
      throw new Error("dom-schema.json was not found after extraction.");
    }
    const domSchema = fs.readFileSync('dom-schema.json', 'utf-8');

    // 2. Generate the POM using the Groq-compatible OpenAI SDK
    console.log("🧠 AutoPOM Agent: Generating optimized POM via Groq...");
    
    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b", // Updated to a currently supported model
      messages: [
        { 
          role: "system", 
          content: "You are a Senior Test Automation Engineer. Generate a clean, modular Playwright Page Object Model (POM) in TypeScript. Use PascalCase for Class names and camelCase for locators. Use private readonly for locators." 
        },
        { 
          role: "user", 
          content: `DOM Schema: ${domSchema}\n\nTest Requirements: ${testRequirements}` 
        }
      ]
    });

    const generatedCode = completion.choices[0].message.content;

    // 3. Save the generated code
    if (generatedCode) {
      const cleanCode = generatedCode.replace(/```typescript|```/g, '').trim();
      
      if (!fs.existsSync('./tests')) {
        fs.mkdirSync('./tests');
      }
      
      fs.writeFileSync('./tests/GeneratedPage.ts', cleanCode);
      console.log("✅ Success: GeneratedPage.ts has been updated in the /tests folder.");
    }
  } catch (err) {
    console.error("❌ Agent Error:", err);
    process.exit(1);
  }
}

// Execution trigger
const requirements = "Login to the portal, enter standard_user credentials, and click login.";
runAgent("https://www.saucedemo.com/", requirements);