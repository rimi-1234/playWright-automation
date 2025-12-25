// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 60000,           // Global timeout for each test
  testDir: './tests',       // Playwright will look for files in the /tests folder
  fullyParallel: true,      // Runs tests side-by-side for speed
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Added 1 retry for local stability
  reporter: [['list'], ['html']],

  use: {
    // ✅ Primary Base URL
    baseURL: 'https://reqres.in', 
    
    // ✅ Global Headers to prevent 403 Forbidden errors
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    
    // Captures a video/screenshot trace only if the test fails
    trace: 'on-first-retry', 
  },
});