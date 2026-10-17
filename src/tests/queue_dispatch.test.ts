import assert from 'assert';
// @ts-ignore
import { POST as postQueueDispatchRoute } from '../app/api/v1/hub/queue-dispatch/route';
// @ts-ignore
import { GET as getSyncRoute } from '../app/api/v1/hub/sync/route';

async function runQueueDispatchTests() {
  console.log('=== Task 1: Queue Dispatch API & Sync Integration Tests ===\n');

  // Test 1: Reject missing license or item
  console.log('[Step 1] Reject invalid requests...');
  const badReq = new Request('http://localhost:3300/api/v1/hub/queue-dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const badRes = await postQueueDispatchRoute(badReq);
  assert.strictEqual(badRes.status, 400, 'Should reject missing fields with 400');
  console.log('✔ Invalid request rejected.');

  // Test 2: Successfully queue item
  console.log('[Step 2] Queue an item for workstation sync...');
  const queueReq = new Request('http://localhost:3300/api/v1/hub/queue-dispatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      licenseKey: 'HAYA-ENT-8F92-K4X9-98QA',
      hubItemId: 'varaha_agt_agri_crop_14',
    }),
  });
  const queueRes = await postQueueDispatchRoute(queueReq);
  const queueData = await queueRes.json();
  assert.strictEqual(queueRes.status, 200, 'Should return 200 OK');
  assert.strictEqual(queueData.success, true);
  assert.strictEqual(queueData.status, 'QUEUED');
  assert.ok(queueData.dispatchId);
  console.log('✔ Queue dispatch succeeded with ID:', queueData.dispatchId);

  // Test 3: Verify GET /api/v1/hub/sync returns dispatches
  console.log('[Step 3] Verifying GET /api/v1/hub/sync includes dispatches...');
  const syncReq = new Request('http://localhost:3300/api/v1/hub/sync', {
    method: 'GET',
    headers: {
      'X-Hayagriva-License': 'HAYA-ENT-8F92-K4X9-98QA',
      'X-Hayagriva-Fingerprint': 'a3f89e21bc047de193021fa4b732e91048a6df29c48e01934ba7109283f619a0',
    },
  });
  const syncRes = await getSyncRoute(syncReq);
  const syncData = await syncRes.json();
  assert.strictEqual(syncRes.status, 200);
  assert.strictEqual(syncData.success, true);
  assert.ok(Array.isArray(syncData.dispatches), 'syncData should have dispatches array');
  const found = syncData.dispatches.find((d: any) => d.hubItemId === 'varaha_agt_agri_crop_14');
  assert.ok(found, 'Should find queued item in sync dispatches');
  console.log('✔ Workstation sync successfully returned queued dispatch!');

  console.log('\n=== All Queue Dispatch Tests Passed! ===\n');
}

runQueueDispatchTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
