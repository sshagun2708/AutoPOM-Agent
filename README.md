# AutoPOM-Agent
**AutoPOM Agent** streamlines test engineering by instantly converting web URLs and uploaded test cases into structured, optimized Playwright Page Object Model (POM) files. It bridges the gap between manual requirements and scalable automation, drastically reducing development time while ensuring robust, reliable test suites for any application.

## Installation
To get started with AutoPOM-Agent, follow these steps:
1. **Clone the repository:**
   `git clone https://github.com/sshagun2708/AutoPOM-Agent.git`
2. **Navigate to the project folder:**
   `cd AutoPOM-Agent`
3. **Install dependencies:**
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:
   `npm install`
4. **Install Playwright:**
   `npx playwright install`
5. **Start the AutoPOM Agent:**
   Run this command in your terminal to start the server:
   `npx tsx server.ts`
6. **Access the Interface:**
   Once the terminal shows "Server running on http://localhost:3000 then copy and run this link in your web browser to start generating your POM files.

## Environment Setup
This project requires API keys to function. To set them up securely:
1. **Create your .env file:**
   Make a copy of the provided example file:
   `cp .env.example .env` (or manually rename `.env.example` to `.env`)
2. **Configure your keys:**
   Open the new `.env` file in your code editor and add your actual API keys. 
   *Note: Never commit your `.env` file to GitHub, as it contains sensitive credentials.*
