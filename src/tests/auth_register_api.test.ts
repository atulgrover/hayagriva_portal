// admin-panel/src/tests/auth_register_api.test.ts
import assert from 'assert';
import { POST as registerPost } from '../app/api/auth/register/route';
import { POST as loginPost } from '../app/api/auth/login/route';

async function testAuthRegisterAndLicenseProvisioning() {
  console.log('=== Task 3: Testing User Registration & 1-License Provisioning ===\n');

  const testEmail = `advocate_${Date.now()}@testchambers.in`;
  const testPassword = 'SecurePassword2026!';

  // 1. Missing fields should fail
  console.log('[Test 3.1] Testing validation failure for short password...');
  const reqShortPass = new Request('http://localhost:3300/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Adv. Test User',
      email: testEmail,
      password: '123',
      confirmPassword: '123',
    })
  });
  const resShortPass = await registerPost(reqShortPass);
  assert.strictEqual(resShortPass.status, 400);
  console.log('✔ Short password rejected with 400.');

  // 2. Register new practitioner
  console.log(`[Test 3.2] Registering new practitioner: ${testEmail}...`);
  const reqValid = new Request('http://localhost:3300/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Adv. Amit Sharma',
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
      firmName: 'Sharma & Associates',
    })
  });
  const resValid = await registerPost(reqValid);
  assert.strictEqual(resValid.status, 200, 'Registration should return 200 OK');
  const bodyValid = await resValid.json();
  assert.strictEqual(bodyValid.success, true);
  assert.strictEqual(bodyValid.user.email, testEmail);
  assert.strictEqual(bodyValid.user.role, 'ADVOCATE');
  
  // Verify 1 real license provisioned
  assert(bodyValid.license, 'Must return provisioned license');
  assert(bodyValid.license.licenseKey.startsWith('HAYA-STR-'), 'License must start with HAYA-STR-');
  assert.strictEqual(bodyValid.license.maxDevices, 1, 'New user license must have maxDevices = 1');
  assert.strictEqual(bodyValid.license.status, 'ACTIVE');
  console.log('✔ New user registered with 1 active workstation license:', bodyValid.license.licenseKey);

  // 3. Duplicate email registration should fail with 409
  console.log('[Test 3.3] Testing duplicate email registration prevention...');
  const reqDup = new Request('http://localhost:3300/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Another User',
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    })
  });
  const resDup = await registerPost(reqDup);
  assert.strictEqual(resDup.status, 409, 'Duplicate email must return 409 Conflict');
  console.log('✔ Duplicate email prevented with 409 Conflict.');

  // 4. Log in as the newly registered user via /api/auth/login
  console.log('[Test 3.4] Testing login with newly registered credentials...');
  const reqLogin = new Request('http://localhost:3300/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    })
  });
  const resLogin = await loginPost(reqLogin);
  assert.strictEqual(resLogin.status, 200, 'Login must succeed with 200 OK');
  const bodyLogin = await resLogin.json();
  assert.strictEqual(bodyLogin.ok, true);
  assert.strictEqual(bodyLogin.user.email, testEmail);
  assert.strictEqual(bodyLogin.user.role, 'ADVOCATE');
  assert(bodyLogin.license, 'User must have their 1 provisioned license returned on login');
  assert.strictEqual(bodyLogin.license.maxDevices, 1);
  console.log('✔ Successfully logged in newly registered user and verified 1 license attached.');

  console.log('\n✔ ALL TESTS PASSED FOR REGISTRATION & LICENSE PROVISIONING.');
}

testAuthRegisterAndLicenseProvisioning().catch(err => {
  console.error('❌ Registration Test failed:', err);
  process.exit(1);
});
