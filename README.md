# Balsam Hill Automation Assessment
## Project Description
This project is an end-to-end automation test suite using Playwright with TypeScript. It validates critical user workflows on the Balsam Hill e-commerce website, focusing on:
- Searching for products (e.g., Christmas Tree)
- Selecting and viewing product details
- Adding products to the shopping cart
- Verifying cart contents and prices

## Technology Stack & Dependencies
- **Node.js** (version 18 or higher recommended)
- **Playwright Test Framework** v1.54.1
- **TypeScript** for type-safe scripting
- **Allure Playwright** for test reporting
- Additional type definitions (`@types/node`)

Key dependencies are declared in `package.json` and managed via npm.

## Project Structure
<img width="284" height="607" alt="image" src="https://github.com/user-attachments/assets/37098b37-3508-45ad-b880-e355c44bf6d7" />

## Install Dependencies
- npm install

## Running The Test on both Firefox and Chrome
- npm test

<img width="1283" height="704" alt="image" src="https://github.com/user-attachments/assets/0930ad2b-0ea9-44dc-9297-c977be0f74d6" />

## Running the test on Chromium
- npx playwright test --project=chromium

## Running the test on Firefox
- npx playwright test --project=firefox

## View Detailed Test Report
- Open npx playwright show-report after npm test execution

## Test Data
- The test data file products.json contains product details such as:
<img width="494" height="258" alt="image" src="https://github.com/user-attachments/assets/b7e668cb-7e94-48a1-985f-31634828fe5c" />
Tests use this data to perform product searches and selection.

## Framework Design
- Page Object Model (POM): Each page class encapsulates selectors and methods for interacting with page elements.

- Test Spec Files: Tests use the page objects and product data to automate end-user scenarios.

- Configuration: Playwright config handles global setup such as timeouts, base URLs, and test reporters.

- TypeScript: Provides type safety and better developer experience.

## Expected Outputs
- Tests should complete with all passing status (green) in the console.

- On failures, screenshots and logs are saved for easier debugging.

- Allure reports provide detailed execution trace and can be shared with stakeholders.

