import assert from 'assert';
// @ts-ignore
import { generateAirgapPack, verifyAndDecryptAirgapPack } from '../lib/security/airgapPacker';
// @ts-ignore
import { POST as postAirgapExportRoute } from '../app/api/v1/admin/airgap/export/route';

async function runAirgapPackerTests() {
  console.log('=== Task 5: Cryptographic Air-Gap Pack (.hpack) Tests ===\n');

  const secret = 'hayagriva_offline_token_hmac_secret_key_2026';
  const targetLicense = 'HAYA-ENT-8F92-K4X9-98QA';
  const targetFp = 'a3f89e21bc047de193021fa4b732e91048a6df29c48e01934ba7109283f619a0';
  const items = [
    {
      id: 'ibc_vault',
      name: 'Insolvency & Bankruptcy Statutory Vault',
      itemType: 'legal-vault',
      domain: 'legal-dispute',
      subdomain: 'corporate-insolvency',
      manifest: {
        files: [{ name: 'sec7.md', content: 'Section 7 CIRP initiation by financial creditor.' }],
      },
    },
  ];

  // Test 1: Generate & Decrypt on authorized target device
  console.log('[Step 1] Generating and decrypting .hpack on matching device...');
  const packBuffer = generateAirgapPack({
    licenseKey: targetLicense,
    hardwareFingerprint: targetFp,
    items,
    secret,
  });

  assert.ok(Buffer.isBuffer(packBuffer));
  assert.ok(packBuffer.length > 50, 'Pack buffer must have content');

  const unpacked = verifyAndDecryptAirgapPack(packBuffer, {
    licenseKey: targetLicense,
    hardwareFingerprint: targetFp,
    secret,
  });

  assert.strictEqual(unpacked.success, true);
  assert.strictEqual(unpacked.items.length, 1);
  assert.strictEqual(unpacked.items[0].id, 'ibc_vault');
  assert.strictEqual(unpacked.items[0].manifest.files[0].content, 'Section 7 CIRP initiation by financial creditor.');
  console.log('✔ Successfully unpacked .hpack on authorized hardware device.');

  // Test 2: Rejection on mismatched hardware fingerprint
  console.log('[Step 2] Verifying rejection on foreign hardware fingerprint...');
  assert.throws(
    () => {
      verifyAndDecryptAirgapPack(packBuffer, {
        licenseKey: targetLicense,
        hardwareFingerprint: 'foreign_unauthorized_laptop_fingerprint',
        secret,
      });
    },
    /mismatch|authenticate|invalid/i,
    'Should throw decryption or fingerprint verification failure'
  );
  console.log('✔ Properly rejected mismatched hardware fingerprint.');

  // Test 3: HTTP Export Route Handler
  console.log('[Step 3] Testing POST /api/v1/admin/airgap/export route handler...');
  const exportReq = new Request('http://localhost:3300/api/v1/admin/airgap/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      licenseKey: targetLicense,
      hardwareFingerprint: targetFp,
      itemIds: ['garuda_agt_agri_crop_14'],
    }),
  });

  const exportRes = await postAirgapExportRoute(exportReq);
  assert.strictEqual(exportRes.status, 200);
  const contentType = exportRes.headers.get('content-type');
  assert.ok(contentType?.includes('application/octet-stream') || contentType?.includes('application/x-hayagriva-pack'));
  const exportedArrayBuffer = await exportRes.arrayBuffer();
  const exportedBuffer = Buffer.from(exportedArrayBuffer);

  const exportedUnpacked = verifyAndDecryptAirgapPack(exportedBuffer, {
    licenseKey: targetLicense,
    hardwareFingerprint: targetFp,
    secret,
  });
  assert.strictEqual(exportedUnpacked.success, true);
  assert.ok(exportedUnpacked.items.length >= 1);
  console.log('✔ POST /api/v1/admin/airgap/export returned valid encrypted .hpack bundle.');

  console.log('\n=== All Airgap Packer Tests Passed! ===\n');
}

runAirgapPackerTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
