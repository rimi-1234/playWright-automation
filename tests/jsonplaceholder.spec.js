const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder API Tests', () => {

  // READ Operations

  test('GET /posts returns a list of posts', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('title');
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

  test('GET /comments returns a list of comments', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/comments`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('email');
  });

  test('GET /comments?postId=1 returns comments for postId=1', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/comments?postId=1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.every(comment => comment.postId === 1)).toBe(true);
  });

  test('GET /todos returns a list of todos', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/todos`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('completed');
  });

  test('GET /todos?completed=true returns only completed todos', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/todos?completed=true`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.every(todo => todo.completed === true)).toBe(true);
  });

  test('GET /users returns all users', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('username');
  });

  test('GET /users/1 returns correct user', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users/1`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body).toHaveProperty('email');
    expect(body.address).toHaveProperty('city');
  });


  // CREATE Operations
 
  test('POST /posts creates a new post', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/posts`, {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      data: { title: 'Automation Assignment', body: 'Testing with Playwright', userId: 1 }
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.id).toBe(101);
    expect(body.title).toBe('Automation Assignment');
    expect(body.body).toBe('Testing with Playwright');
    expect(body.userId).toBe(1);
  });

  test('POST /comments creates a new comment', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/comments`, {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      data: { name: 'Test Comment', email: 'test@example.com', body: 'This is a comment', postId: 1 }
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.name).toBe('Test Comment');
  });


  // UPDATE Operations

  test('PATCH /posts/1 partially updates a post', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/posts/1`, {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      data: { title: 'Partially Updated Title' }
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.title).toBe('Partially Updated Title');
  });

  test('PUT /posts/1 fully updates a post', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/posts/1`, {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      data: { title: 'Fully Updated Title', body: 'Updated body content', userId: 1 }
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.title).toBe('Fully Updated Title');
    expect(body.body).toBe('Updated body content');
  });

  // ---------------------------
  // DELETE Operations
  // ---------------------------
  test('DELETE /posts/1 deletes a post', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/posts/1`);
    expect(response.status()).toBe(200);
  });

  // ---------------------------
  // Negative / Edge Cases
  // ---------------------------
  test('GET /posts/invalid-id returns 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/999999`);
    expect(response.status()).toBe(404);
  });

  test('POST /posts with missing fields handles default', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/posts`, {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      data: { title: 'Missing body' }
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('Missing body');
    expect(body.body).toBeUndefined();
  });

});
