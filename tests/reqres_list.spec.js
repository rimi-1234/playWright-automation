const { test, expect } = require('@playwright/test');

const API_KEY = process.env.API_KEY;


test('GET Single User - Existing', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/2', {
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    expect(response.status()).toBe(200);
    expect(data.data.id).toBe(2);
    console.log('User:', data.data.first_name, data.data.last_name);
});

test('GET Single User - Not Found', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/23', {
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    expect(response.status()).toBe(404);
});


test('POST Register Successful', async ({ request }) => {
    const response = await request.post('https://reqres.in/api/register', {
        data: { email: 'eve.holt@reqres.in', password: 'pistol' },
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('token');
    console.log('Token:', data.token);
});


test('POST Register Unsuccessful', async ({ request }) => {
    const response = await request.post('https://reqres.in/api/register', {
        data: { email: 'sydney@fife' }, // missing password
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    expect(response.status()).toBe(400);
    expect(data.error).toBe('Missing password');
});


test('POST Login Successful', async ({ request }) => {
    const response = await request.post('https://reqres.in/api/login', {
        data: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    expect(response.status()).toBe(200);
    expect(data).toHaveProperty('token');
});


test('POST Login Unsuccessful', async ({ request }) => {
    const response = await request.post('https://reqres.in/api/login', {
        data: { email: 'peter@klaven' }, // missing password
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    expect(response.status()).toBe(400);
    expect(data.error).toBe('Missing password');
});


test('PUT Update User', async ({ request }) => {
    const response = await request.put('https://reqres.in/api/users/2', {
        data: { name: 'Jane', job: 'Manager' },
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    expect(response.status()).toBe(200);
    expect(data.name).toBe('Jane');
    expect(data.job).toBe('Manager');
    console.log('Updated User:', data);
});


async function logFirstNUsers(data, pageNumber, n = 2) {
    console.log(`\n=== Page ${pageNumber} - Logging First ${n} Users ===`);
    if (data.data.length === 0) {
        console.warn(`Page ${pageNumber} has no users.`);
        return;
    }

    for (let i = 0; i < Math.min(n, data.data.length); i++) {
        const user = data.data[i];
        console.log(`--- User ${i + 1} ---`);
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.first_name} ${user.last_name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Avatar: ${user.avatar}`);
    }
    console.log('===============================================');
}

// Test pages 1 and 2
[1, 2].forEach((pageNumber) => {
    test(`GET List Users - Page ${pageNumber} First 2 Users`, async ({ request }) => {
        const response = await request.get(`https://reqres.in/api/users?page=${pageNumber}`, {
            headers: { Authorization: `Bearer ${API_KEY}` },
        });

        expect(response.status()).toBe(200);

        const data = await response.json();

        expect(data.page).toBe(pageNumber);
        expect(Array.isArray(data.data)).toBe(true);

        await logFirstNUsers(data, pageNumber, 2);
    });
});
async function testListUsersPage(request, pageNumber) {
    const response = await request.get(`https://reqres.in/api/users?page=${pageNumber}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();

    // Basic validation
    expect(data.page).toBe(pageNumber);
    expect(Array.isArray(data.data)).toBe(true);

    if (data.data.length > 0) {
        const firstUser = data.data[0];
        console.log(`=== Page ${pageNumber} - First User Details ===`);
        console.log(`ID: ${firstUser.id}`);
        console.log(`Name: ${firstUser.first_name} ${firstUser.last_name}`);
        console.log(`Email: ${firstUser.email}`);
        console.log(`Avatar: ${firstUser.avatar}`);
        console.log('===========================================');
    } else {
        console.warn(`Page ${pageNumber} has no users.`);
    }
}

// Existing page 2 test (can remain as is)
// ...

// Add tests for pages 1, 3-10 (9 more pages)
for (let page = 1; page <= 10; page++) {
    // Skip page 2 if you want to avoid duplicate with existing test
    if (page === 2) continue;

    test(`GET List Users - Page ${page}`, async ({ request }) => {
        await testListUsersPage(request, page);
    });
}


test('GET List Users Page 1 - Validate 1st and 2nd User with API Key', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users?page=1', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
            'Authorization': `Bearer ${API_KEY}` // ✅ Include API key
        }
    });

    expect(response.status()).toBe(200);
    const json = await response.json();
    const users = json.data;

    // --- VALIDATE 1ST USER (ID: 1) ---
    const user1 = users[0];
    console.log('👤 User 1:', user1.first_name, user1.last_name);
    expect(user1.id).toBe(1);
    expect(user1.first_name).toBe('George');
    expect(user1.email).toBe('george.bluth@reqres.in');

    // --- VALIDATE 2ND USER (ID: 2) ---
    const user2 = users[1];
    console.log('👤 User 2:', user2.first_name, user2.last_name);
    expect(user2.id).toBe(2);
    expect(user2.first_name).toBe('Janet');
    expect(user2.email).toBe('janet.weaver@reqres.in');
});
// ---------------------------
// Negative Test 1: GET user with invalid ID (string)
// ---------------------------
const REQRES_BASE = 'https://reqres.in/api';

// ---------------------------
// Negative Test 1: GET single user with invalid ID format
// ---------------------------
test('GET Single User - Invalid ID format', async ({ request }) => {
    const response = await request.get(`${REQRES_BASE}/users/invalid-id`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
    });

    expect(response.status()).toBe(404);

    const data = await response.json().catch(() => ({})); // Reqres may return empty body
    console.log('Attempted to fetch user with invalid ID "invalid-id"');
    console.log('Response Status:', response.status());
    console.log('Response Body:', data);
    console.log('✅ Negative test passed: 404 returned for invalid ID format');
});

// ---------------------------
// Negative Test 2: POST login with empty credentials
// ---------------------------
test('POST Login - Empty email and password', async ({ request }) => {
    const response = await request.post(`${REQRES_BASE}/login`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
        data: { email: '', password: '' }
    });

    const data = await response.json();
    expect(response.status()).toBe(400);
    expect(data.error).toBe('Missing email or username');

    console.log('Attempted to login with empty email and password');
    console.log('Response Status:', response.status());
    console.log('Response Body:', data);
    console.log('✅ Negative test passed: 400 returned with proper error message');
});
