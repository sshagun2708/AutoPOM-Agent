# AutoPOM-Agent Architecture

## Overview
AutoPOM-Agent is a specialized tool designed to bridge the gap between manual test requirements and scalable automation. It automates the generation of structured, optimized Playwright Page Object Model (POM) files by processing user inputs such as web URLs and test case documentation.

## Project Construction Journey

### 1. Planning & Requirement Analysis
*   **Goal:** Reduce manual effort in creating boilerplate code for UI automation.
*   **Design Choice:** Focused on the **Page Object Model (POM)** pattern to ensure test maintainability and reusability.

### 2. Core Architecture
The system operates through a modular pipeline:
*   **Input Layer:** Accepts target URLs and descriptive test case files.
*   **Extraction Layer (`extractor.ts`):** Parses the input and identifies key UI elements and actions.
*   **Generation Layer (`autopom-agent.ts`):** Applies logic to transform raw data into a structured TypeScript class compliant with Playwright standards.
*   **Schema Enforcement (`dom-schema.json`):** Ensures that the generated POM follows a predefined architectural standard (PascalCase for classes, camelCase for locators).

### 3. Implementation Workflow
1.  **Environment Configuration:** Utilized `dotenv` for secure credential management.
2.  **Logic Development:** Built a custom agent to interpret DOM structures and map them to Playwright locators (`getByRole`, `getByLabel`, etc.).
3.  **Test Integration:** Created `tests/` directory to validate that generated POMs function correctly within a real Playwright execution environment.

## Technology Stack
*   **Language:** TypeScript (for type safety and maintainability).
*   **Automation Framework:** Playwright.
*   **Logic Engine:** Custom agent scripts optimized for DOM traversal and code synthesis.

## Best Practices Implemented
*   **Modular Design:** Separated locators and logic to facilitate easy updates.
*   **Security:** Implemented `.gitignore` to prevent sensitive API keys from being exposed in the public repository.
