// admin-panel/src/tests/sidebar_navigation.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Testing Client Sidebar 4-Cluster Taxonomy & Synchronized URLs ===");

const sidebarPath = path.join(process.cwd(), "src/components/client/sidebar.tsx");
assert(fs.existsSync(sidebarPath), "Sidebar file must exist");

const content = fs.readFileSync(sidebarPath, "utf-8");

const requiredHrefs = [
  "/dashboard",
  "/dashboard/workspace",
  "/dashboard/discussions",
  "/dashboard/studio",
  "/dashboard/billing",
  "/dashboard/harness",
  "/dashboard/vaults",
  "/dashboard/models",
  "/dashboard/agents",
  "/dashboard/support",
];

for (const href of requiredHrefs) {
  assert(
    content.includes("'" + href + "'") || content.includes('"' + href + '"'),
    "Sidebar must contain navigation link to " + href
  );
  console.log("✔ Found route: " + href);
}

const requiredGroups = [
  "Core Workspace",
  "Workspace & Studio",
  "AI Assets",
  "Operations",
];

for (const group of requiredGroups) {
  assert(
    content.toLowerCase().includes(group.toLowerCase()),
    "Sidebar must contain section header: " + group
  );
  console.log("✔ Found group header: " + group);
}

console.log("✅ Client Sidebar 4-Cluster Taxonomy verified successfully!");
