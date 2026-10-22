import assert from "node:assert";

async function runE2ETests() {
  const baseUrl = "http://localhost:3300";
  console.log("=== Running Community & Azure LightRAG E2E Test Suite ===\n");

  // 1. Test GET /api/community/threads
  console.log("[Test 1] Testing GET /api/community/threads...");
  const listRes = await fetch(`${baseUrl}/api/community/threads`);
  assert.strictEqual(listRes.status, 200, "GET /api/community/threads must return 200");
  const listData = await listRes.json();
  assert.ok(Array.isArray(listData.threads), "threads must be an array");
  console.log(`✔ GET /api/community/threads returned 200 with ${listData.threads.length} existing threads.`);

  // 2. Test POST /api/community/threads
  console.log("\n[Test 2] Testing POST /api/community/threads (Thread creation)...");
  const createRes = await fetch(`${baseUrl}/api/community/threads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Section 14 Moratorium applicability to personal guarantors under IBC",
      body: "<p>Does the moratorium under Section 14 of the Insolvency and Bankruptcy Code apply to personal guarantors of corporate debtors?</p>",
      category: "insolvency-ibc",
      tags: ["Section 14", "Guarantors", "IBC"],
    }),
  });

  assert.strictEqual(createRes.status, 201, "POST /api/community/threads must return 201");
  const createData = await createRes.json();
  assert.ok(createData.thread?.id, "Created thread must have an id");
  const threadId = createData.thread.id;
  console.log(`✔ Thread created successfully: ID = ${threadId}, Title = "${createData.thread.title}"`);

  // 3. Test GET /api/community/threads/[id]
  console.log(`\n[Test 3] Testing GET /api/community/threads/${threadId}...`);
  const getRes = await fetch(`${baseUrl}/api/community/threads/${threadId}`);
  assert.strictEqual(getRes.status, 200, "GET thread detail must return 200");
  const getData = await getRes.json();
  assert.strictEqual(getData.thread.id, threadId, "Returned thread id must match");
  console.log(`✔ Thread detail loaded. Views = ${getData.thread.views_count}, AI Status = ${getData.thread.ai_status}`);

  // 4. Test POST /api/community/threads/[id]/replies
  console.log(`\n[Test 4] Testing POST reply to thread ${threadId}...`);
  const replyRes = await fetch(`${baseUrl}/api/community/threads/${threadId}/replies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: "<p>The Hon'ble Supreme Court in SBI v. V. Ramakrishnan held that Section 14 moratorium does not extend to personal guarantors.</p>",
    }),
  });

  assert.strictEqual(replyRes.status, 201, "POST reply must return 201");
  const replyData = await replyRes.json();
  assert.ok(replyData.reply?.id, "Reply must have an id");
  console.log(`✔ Human advocate reply submitted: ID = ${replyData.reply.id}`);

  // 5. Test verifying updated thread replies list
  console.log(`\n[Test 5] Verifying replies list after human contribution...`);
  const updatedRes = await fetch(`${baseUrl}/api/community/threads/${threadId}`);
  const updatedData = await updatedRes.json();
  assert.ok(updatedData.replies.length >= 1, "Replies count must be at least 1");
  console.log(`✔ Verified thread now contains ${updatedData.replies.length} replies.`);

  console.log("\n✅ All Community End-to-End Tests passed successfully!");
}

runE2ETests().catch((err) => {
  console.error("\n❌ E2E Test Failed:", err);
  process.exit(1);
});
