// 1. Import the tools we need from Playwright
const { test, expect } = require('@playwright/test');

// 2. Define the test
test('My First API Test - GET Request', async ({ request }) => {
  
  // 3. Send a request to the Internet
  const response = await request.get('https://reqres.in/api/users/2');

  // 4. Log the status so we can see it in the terminal
  console.log('Server Status Code:', response.status());

  // 5. Check if the status is 200 (Success)
  expect(response.status()).toBe(200);

});
