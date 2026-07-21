import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function runAgent(turl: string, testRequirements: string) {
    try {
        const urlObj = new URL(turl);
        let domainParts = urlObj.hostname.split('.');
        let rawTitle = domainParts.length > 2 ? domainParts[domainParts.length - 2] : domainParts[0];
        const projectTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

        const folderName = `AIGenerated_${projectTitle}_Automation_Framework`;
        const targetProjectDir = path.join('C:', folderName);

        const isExisting = fs.existsSync(targetProjectDir);

        if (isExisting) {
            console.log(`📂 Architect Notice: Folder "${folderName}" is already created on C: drive.`);
            console.log(`🔄 Reusing existing standalone framework directory...`);
        } else {
            console.log(`📂 Architect: Creating new standalone framework directory at ${targetProjectDir}...`);
            const dirs = [
                targetProjectDir,
                path.join(targetProjectDir, 'pages'),
                path.join(targetProjectDir, 'tests'),
                path.join(targetProjectDir, 'config'),
                path.join(targetProjectDir, 'reports')
            ];
            dirs.forEach(dir => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            // Initialize a standalone package.json so it's a completely independent module workspace
            const packageJsonContent = {
                name: folderName.toLowerCase(),
                version: "1.0.0",
                type: "module",
                scripts: {
                    test: "playwright test"
                },
                devDependencies: {
                    "@playwright/test": "^1.40.0"
                }
            };
            fs.writeFileSync(path.join(targetProjectDir, 'package.json'), JSON.stringify(packageJsonContent, null, 2), 'utf8');
            
            console.log("📦 Installing local dependencies inside standalone framework (this may take a moment)...");
            execSync('npm install', { cwd: targetProjectDir, stdio: 'inherit' });
        }

        console.log("🏗️ Architect: Requesting framework components from Gemini...");
        
        const prompt = `You are an expert framework architect building a clean, agnostic automation framework. 
You MUST output a valid raw JSON object with EXACTLY three keys: 'pageObject', 'testCase', and 'config'. Do not use markdown backticks like \`\`\`json.
- 'pageObject': A professional TypeScript Playwright Page Object Model class containing clean locators and action methods for the target application. Name the class '${projectTitle}Page'.
- 'testCase': A Playwright test file (.spec.ts) that imports '${projectTitle}Page' from '../pages/${projectTitle}Page', instantiates it, and executes the user test steps.
- 'config': A basic Playwright config file content ('playwright.config.ts') configured to look in the 'tests' directory and output reports into 'reports'.

Target URL: ${turl}
Test Requirements / Actions: ${testRequirements}

Return ONLY JSON format:
{
  "pageObject": "export class ${projectTitle}Page { ... }",
  "testCase": "import { test, expect } from '@playwright/test'; import { ${projectTitle}Page } from '../pages/${projectTitle}Page'; ...",
  "config": "import { defineConfig } from '@playwright/test'; export default defineConfig({ ... });"
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
        });

        const rawContent = response.text || '{}';
        const cleanedContent = rawContent.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanedContent);

        if (!parsedData.pageObject || !parsedData.testCase || !parsedData.config) {
            throw new Error("AI response did not contain valid structural framework JSON fields.");
        }

        const pagePath = path.join(targetProjectDir, 'pages', `${projectTitle}Page.ts`);
        const testPath = path.join(targetProjectDir, 'tests', `${projectTitle}Page.spec.ts`);
        const configPath = path.join(targetProjectDir, 'playwright.config.ts');

        fs.writeFileSync(pagePath, parsedData.pageObject, 'utf8');
        fs.writeFileSync(testPath, parsedData.testCase, 'utf8');
        fs.writeFileSync(configPath, parsedData.config, 'utf8');
        
        console.log(`✅ Framework Files Synchronized Successfully under C:\\${folderName}`);

        console.log("🚀 Executing Automated Suite from standalone folder...");
        try {
            execSync('npx playwright test --reporter=html', { cwd: targetProjectDir, stdio: 'inherit' });
        } catch (e) {
            console.log("⚠️ Test execution completed.");
        }

    } catch (error) {
        console.error("❌ Critical Error in runAgent:", error);
        throw error;
    }
}