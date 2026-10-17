import assert from "node:assert";
import { curatedGarudaAgents } from "../lib/taxonomy/curated-garuda-agents";

const tradeAgents = curatedGarudaAgents.filter(a => a.domain === "trade-vocational");
assert(tradeAgents.length >= 4, `Must contain at least 4 Trade & Vocational agents, found: ${tradeAgents.length}`);

const tradeIds = tradeAgents.map(a => a.id);
assert(tradeIds.includes("garuda_agt_trade_invoice_01"), "Missing GST Invoice agent");
assert(tradeIds.includes("garuda_agt_trade_estimate_02"), "Missing Quotation Estimator agent");
assert(tradeIds.includes("garuda_agt_trade_contract_03"), "Missing Work-Order Contract agent");
assert(tradeIds.includes("garuda_agt_trade_nsqf_tutor_04"), "Missing NSQF Trade Tutor agent");

console.log(`PASS: Trade & Vocational Guild agents verified in Garuda catalog (${tradeAgents.length} agents)`);
