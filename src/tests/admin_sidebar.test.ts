// admin-panel/src/tests/admin_sidebar.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== Testing Admin Sidebar 4-Cluster Taxonomy & Synchronized URLs ===");

const sidebarFile = path.join(process.cwd(), "src/components/admin/sidebar.tsx");
assert(fs.existsSync(sidebarFile), "Admin sidebar file must exist");

const content = fs.readFileSync(sidebarFile, "utf8");

const requiredHrefs = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/discussions",
  "/admin/studio",
  "/admin/billing",
  "/admin/harness",
  "/admin/vaults",
  "/admin/models",
  "/admin/agents",
  "/admin/support",
  "/admin/telemetry",
  "/admin/logs",
];

for (const href of requiredHrefs) {
  assert(
    content.includes("'" + href + "'") || content.includes('"' + href + '"'),
    "Admin sidebar must contain route: " + href
  );
  console.log("✔ Found admin route: " + href);
}

const requiredHeaders = [
  "Control Center",
  "Workspace & Studio",
  "AI Assets",
  "Operations",
];

for (const header of requiredHeaders) {
  assert(
    content.toLowerCase().includes(header.toLowerCase()),
    "Admin sidebar must contain section header: " + header
  );
  console.log("✔ Found admin header: " + header);
}

console.log("✅ Admin Sidebar 4-Cluster Taxonomy verified successfully!");
