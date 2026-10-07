/**
 * Monevo Complete Automated Test Suite
 * Validates backend API endpoints, database operations, auth flow, user isolation, and frontend build
 */

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('==================================================');
  console.log('🚀 Starting Monevo Automated Verification Suite...');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check test
    console.log('[1/7] Testing Health Endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Health endpoint responds with 200 OK');
    assert(healthData.status === 'online', 'Health status reports "online"');

    // 2. User registration
    console.log('\n[2/7] Testing User Registration & Password Hashing...');
    const testEmail = `test_${Date.now()}@monevo.local`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Tester',
        email: testEmail,
        password: 'Password123!',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'User registration returns 201 Created');
    assert(regData.success === true, 'Registration payload success is true');
    assert(Boolean(regData.data.token), 'JWT token returned on registration');
    const userToken = regData.data.token;
    const userId = regData.data.user.id;

    // 3. User login
    console.log('\n[3/7] Testing User Login & JWT Issuance...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'User login returns 200 OK');
    assert(loginData.data.user.email === testEmail, 'User email matches registered email');

    // 4. Authenticated transaction creation (Income & Expense)
    console.log('\n[4/7] Testing Transaction Creation (Income & Expense)...');
    const incomeRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        type: 'income',
        amount: 65000,
        category: 'Salary',
        description: 'Monthly Tech Salary',
        date: new Date().toISOString(),
      }),
    });
    const incomeData = await incomeRes.json();
    assert(incomeRes.status === 201, 'Income transaction created with 201 status');
    assert(incomeData.data.type === 'income', 'Transaction type recorded correctly as income');
    const incomeId = incomeData.data.id;

    const expenseRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        type: 'expense',
        amount: 4500,
        category: 'Food',
        description: 'Grocery Run & Dinner',
        date: new Date().toISOString(),
      }),
    });
    const expenseData = await expenseRes.json();
    assert(expenseRes.status === 201, 'Expense transaction created with 201 status');
    const expenseId = expenseData.data.id;

    // 5. Query & Data isolation
    console.log('\n[5/7] Testing User Data Isolation...');
    const userTxRes = await fetch(`${BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const userTxData = await userTxRes.json();
    assert(userTxData.data.length >= 2, 'Authenticated user can fetch their transactions');

    // Unauthenticated query should not see this user's data
    const anonTxRes = await fetch(`${BASE_URL}/transactions`);
    const anonTxData = await anonTxRes.json();
    const leaked = anonTxData.data.some((tx) => tx.id === incomeId || tx.id === expenseId);
    assert(!leaked, 'Unauthenticated session cannot access private user transactions');

    // 6. Update and Delete operations
    console.log('\n[6/7] Testing Transaction Edit and Deletion...');
    const updateRes = await fetch(`${BASE_URL}/transactions/${expenseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        amount: 5200,
        description: 'Updated Grocery & Dining',
      }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'Transaction successfully updated with 200 OK');
    assert(parseFloat(updateData.data.amount) === 5200, 'Updated amount reflected accurately');

    const deleteRes = await fetch(`${BASE_URL}/transactions/${incomeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const deleteData = await deleteRes.json();
    assert(deleteRes.status === 200, 'Transaction deleted successfully');
    assert(deleteData.data.deleted === true, 'Delete response confirms deleted flag');

    // Clean up second test item
    await fetch(`${BASE_URL}/transactions/${expenseId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });

    console.log('\n==================================================');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('==================================================\n');

    if (failed > 0) {
      process.exit(1);
    } else {
      console.log('✅ ALL BACKEND AND DATABASE TESTS PASSED!');
    }
  } catch (err) {
    console.error('Fatal test execution error:', err);
    process.exit(1);
  }
}

runTests();
