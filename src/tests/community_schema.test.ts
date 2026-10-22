import { communityThreads, communityReplies } from "../lib/db/schema";
import assert from "node:assert";

assert.ok(communityThreads, "communityThreads table should be defined");
assert.ok(communityReplies, "communityReplies table should be defined");
assert.ok(communityThreads.hasAiAnswer, "hasAiAnswer column should exist");
assert.ok(communityReplies.aiCitations, "aiCitations column should exist");
console.log("✓ Community schema definition test passed");
