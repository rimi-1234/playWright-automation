# 🎭 Playwright API Automation Testing Suite

This repository contains a professional automated testing suite for REST APIs using **Playwright Test**. The project covers CRUD operations, authentication flows, pagination, and negative testing using **JSONPlaceholder** and **ReqRes** APIs.

---

## 📂 Project Structure
```text
playwright-api-testing/
├── tests/
│   ├── reqres_list.spec.js     # User Management, Auth & Pagination
│   └── jsonplaceholder.spec.js # Post management & CRUD operations
├── .env                        # Environment variables (API Keys)
├── .gitignore                  # Excludes sensitive data from Git
├── playwright.config.js        # Global Playwright configuration
└── package.json                # Project scripts and dependencies
🛠️ Getting Started
Prerequisites
Node.js: v18.x or higher

npm: v7.x or higher

Installation
Clone the repository:

Bash

git clone <your-repository-url>
cd "D:\playWright automation"
Install dependencies:

Bash

npm install
Setup Environment Variables: Create a .env file in the root directory and add your API Key:

Code snippet

API_KEY=your_secret_key_here
🏃 Execution Instructions
Run All Tests
Bash

npx playwright test
Run Specific Test Files
Bash

# Run only ReqRes tests
npx playwright test tests/reqres_list.spec.js

# Run only JSONPlaceholder tests
npx playwright test tests/jsonplaceholder.spec.js
Debugging & Reports
UI Mode (Interactive): npx playwright test --ui

View HTML Report: npx playwright show-report

📝 Testing Approach (Assignment Scope)
The suite follows a layered verification strategy to ensure high API reliability:

1. CRUD Operations
Create (POST): Validates that resources are created with a 201 Created status and return the correct payload.

Read (GET): Validates response schemas, status codes (200 OK), and specific data points (IDs, emails).

Update (PUT/PATCH): Ensures data can be modified correctly.

Delete (DELETE): Verifies successful resource removal.

2. Advanced Scenarios
Authentication: Simulates login and registration flows to obtain Bearer tokens.

API Chaining: Demonstrates extracting a token from a login response and passing it into the headers of subsequent requests.

Pagination: Implements a dynamic loop to iterate through results across 10 pages to verify data consistency.

3. Negative & Edge Case Testing
404 Handling: Verifies correct identification of non-existent resources.

400 Handling: Ensures rejection of bad requests (e.g., missing login credentials).

Security Headers: Implements User-Agent headers to bypass 403 Forbidden bot filters.

⚙️ Configuration Details
The playwright.config.js is optimized for performance:

Global Headers: Sets Content-Type and User-Agent once to keep test files clean.

Parallel Execution: Enabled to reduce total test execution time.

Retries: Configured to handle intermittent network "flakiness."

Traceability: Captures traces on failure to assist in debugging network logs.

👤 Submission Details
Automation Tool: Playwright

Assignment: Practical Test Automation Assignment