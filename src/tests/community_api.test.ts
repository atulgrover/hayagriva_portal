import assert from "node:assert";
import { communityThreads, communityReplies } from "../lib/db/schema";
import { queryAzureLightRag } from "../lib/services/lightrag";

// Helper function that matches the validation logic in the route
export function validateThreadPayload(payload: any) {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Invalid payload" };
  }
  if (!payload.title || typeof payload.title !== "string" || payload.title.trim().length < 5) {
    return { valid: false, error: "Title must be at least 5 characters" };
  }
  if (!payload.body || typeof payload.body !== "string" || payload.body.trim().length < 10) {
    return { valid: false, error: "Body must be at least 10 characters" };
  }
  return { valid: true };
}

// 1. Test validation rules
const invalidShortTitle = validateThreadPayload({ title: "Hi", body: "Valid long enough description" });
assert.strictEqual(invalidShortTitle.valid, false, "Should reject short title");

const invalidShortBody = validateThreadPayload({ title: "Valid Title Here", body: "Short" });
assert.strictEqual(invalidShortBody.valid, false, "Should reject short body");

const validPayload = validateThreadPayload({
  title: "Section 12 CIRP timeline applicability",
  body: "Does the 330-day timeline include lockdown days?",
});
assert.strictEqual(validPayload.valid, true, "Should accept valid title and body");

console.log("✓ Validation logic tests passed");

// 2. Test schema column mappings
assert.ok(communityThreads.id, "communityThreads.id must exist");
assert.ok(communityThreads.category, "communityThreads.category must exist");
assert.ok(communityReplies.threadId, "communityReplies.threadId must exist");
assert.ok(communityReplies.isAiGenerated, "communityReplies.isAiGenerated must exist");

console.log("✓ Schema table mappings verified");
