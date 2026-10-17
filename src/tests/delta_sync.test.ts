import assert from 'assert';
// @ts-ignore
import { calculateFileDiff } from '../lib/services/deltaSync';
// @ts-ignore
import { POST as postDiffRoute } from '../app/api/v1/hub/sync/diff/route';

async function runDeltaSyncTests() {
  console.log('=== Task 3: Differential / Delta Content Sync Tests ===\n');

  // Test 1: Unit calculation
  console.log('[Step 1] Testing calculateFileDiff logic...');
  const serverFiles = [
    { name: 'manifest.json', path: 'manifest.json', content: '{"v":2}', sha256: 'hash_new_v2' },
    { name: 'clause.txt', path: 'clauses/clause.txt', content: 'Unchanged clause', sha256: 'hash_same' },
    { name: 'new_rule.txt', path: 'rules/new_rule.txt', content: 'Brand new rule', sha256: 'hash_brand_new' },
  ];

  const clientHashes = {
    'manifest.json': 'hash_old_v1',
    'clauses/clause.txt': 'hash_same',
    'obsolete.txt': 'hash_obsolete',
  };

  const diff = calculateFileDiff(serverFiles, clientHashes);
  assert.strictEqual(diff.hasUpdates, true);
  assert.strictEqual(diff.updatedFiles.length, 2, 'Should have 2 updated/added files');
  assert.ok(diff.updatedFiles.find((f: any) => f.path === 'manifest.json'));
  assert.ok(diff.updatedFiles.find((f: any) => f.path === 'rules/new_rule.txt'));
  assert.strictEqual(diff.deletedFiles.length, 1);
  assert.strictEqual(diff.deletedFiles[0], 'obsolete.txt');
  console.log('✔ calculateFileDiff accurately produced delta updates and deletions.');

  // Test 2: HTTP Route Handler
  console.log('[Step 2] Testing POST /api/v1/hub/sync/diff route handler...');
  const activeFp = 'a3f89e21bc047de193021fa4b732e91048a6df29c48e01934ba7109283f619a0';
  const req = new Request('http://localhost:3300/api/v1/hub/sync/diff', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hayagriva-License': 'HAYA-ENT-8F92-K4X9-98QA',
      'X-Hayagriva-Fingerprint': activeFp,
    },
    body: JSON.stringify({
      itemId: 'garuda_agt_agri_crop_14',
      clientHashes: {
        'dummy.json': 'old_hash',
      },
    }),
  });

  const res = await postDiffRoute(req);
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.success, true);
  assert.strictEqual(typeof data.hasUpdates, 'boolean');
  assert.ok(Array.isArray(data.updatedFiles));
  console.log('✔ POST /api/v1/hub/sync/diff returned differential package successfully.');

  console.log('\n=== All Delta Sync Tests Passed! ===\n');
}

runDeltaSyncTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
