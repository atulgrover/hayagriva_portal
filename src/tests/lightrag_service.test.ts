import { parseLegalCitations, queryAzureLightRag } from "../lib/services/lightrag";
import assert from "node:assert";

// 1. Test citation extraction
const sampleText = "Under Section 12 of the Insolvency and Bankruptcy Code, 2016 (IBC), the CIRP must complete in 180 days. Regulation 35A of the CIRP Regulations requires avoidance audits.";
const citations = parseLegalCitations(sampleText);

assert.ok(citations.length > 0, "Should detect legal citations");
assert.ok(
  citations.some((c) => c.section === "12" || c.act.includes("IBC")),
  "Should detect Section 12 or IBC citation"
);
assert.ok(
  citations.some((c) => c.section === "35A" || c.act.toLowerCase().includes("regulation")),
  "Should detect Regulation 35A"
);
console.log("✓ Citation parser test passed with citations:", citations);

// 2. Verify queryAzureLightRag function interface exists
assert.strictEqual(typeof queryAzureLightRag, "function", "queryAzureLightRag must be a function");
console.log("✓ Azure LightRAG connector interface test passed");
