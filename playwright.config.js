// @ts-check
const { defineConfig } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  
  /* Run tests in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only (helps if the API server flickers) */
  retries: process.env.CI ? 2 : 0,

  /* Reporter to use. 'list' shows progress in terminal, 'html' creates the report file */
  reporter: [['list'], ['html']],

  use: {
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    
    /* We don't need 'baseURL' here because we use two different domains (ReqRes & JSONPlaceholder) */
  },

  /* We removed the 'projects' array because API tests don't need specific browsers */
});