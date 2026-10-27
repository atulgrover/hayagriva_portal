import assert from "node:assert";
import { checkGuestRateLimit, incrementGuestRateLimit } from "../lib/services/rate-limiter";
import { sharedDb, communityThreads } from "../lib/db/shared-forum";
import { eq } from "drizzle-orm";

async function runTest() {
  console.log("Testing shared forum DB connection & guest rate limiter in Hayagriva Portal...");

  const testIp = `192.168.10.${Math.floor(Math.random() * 250)}`;

  // 1. Initial check - should have 3 remaining
  const initialLimit = await checkGuestRateLimit(testIp);
  assert.strictEqual(initialLimit.allowed, true);
  assert.strictEqual(initialLimit.remaining, 3);
  console.log("✔ Initial rate limit is 3");

  // 2. Increment once
  await incrementGuestRateLimit(testIp);
  const afterOne = await checkGuestRateLimit(testIp);
  assert.strictEqual(afterOne.allowed, true);
  assert.strictEqual(afterOne.remaining, 2);
  console.log("✔ After 1 question, remaining is 2");

  // 3. Verify reading from shared community_threads table
  const threads = await sharedDb.select().from(communityThreads).limit(2);
  assert.ok(Array.isArray(threads), "Threads must be an array");
  console.log(`✔ Successfully queried shared Neon threads table (found ${threads.length} threads)`);

  console.log("ALL PORTAL GUEST DB & RATE LIMIT TESTS PASSED!");
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
