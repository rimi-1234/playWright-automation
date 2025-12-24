const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder - Read Operations', () => {

  test('GET /posts returns a list of posts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('id');
  });

  test('GET /posts/1 returns correct post details', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.title).toContain('sunt aut facere');
  });

  test('GET /posts/2 matches exact title', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/2`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(2);
    expect(body.title).toBe('qui est esse');
  });


});

  test('POST /posts creates a new post', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/posts`, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      data: {
        title: 'Automation Assignment',
        body: 'Testing with Playwright',
        userId: 1,
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    

    expect(body.id).toBe(101); 
    expect(body.title).toBe('Automation Assignment');
    expect(body.body).toBe('Testing with Playwright');
    expect(body.userId).toBe(1);
  });
test('DELETE /posts/1 deletes a post', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/posts/1`);
  expect(response.status()).toBe(200);
});
  test('GET /posts/invalid-id handles 404 Not Found', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/999999`);
    expect(response.status()).toBe(404);
  });
test('PATCH /posts/1 partially updates a post', async ({ request }) => {
  const response = await request.patch(`${BASE_URL}/posts/1`, {
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    data: {
      title: 'Partially Updated Title',
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.title).toBe('Partially Updated Title');
});
