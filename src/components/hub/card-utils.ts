export interface CategoryConfig {
  label: string;
  colorClass: string;
  iconName: string;
}

export function getItemCategoryConfig(type: string): CategoryConfig {
  switch (type) {
    case "agent-skill":
      return {
        label: "Agent Skill",
        colorClass: "text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        iconName: "Zap",
      };
    case "custom-agent":
    case "agent":
      return {
        label: "Autonomous Agent",
        colorClass: "text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        iconName: "Bot",
      };
    case "legal-vault":
    case "bare-act-vault":
      return {
        label: "Statutory Vault",
        colorClass: "text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        iconName: "Database",
      };
    case "ai-model":
    case "slm-model":
      return {
        label: "AI Model",
        colorClass: "text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        iconName: "Cpu",
      };
    case "slash-command":
      return {
        label: "Slash Command",
        colorClass: "text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        iconName: "Command",
      };
    default:
      return {
        label: "Sovereign Tool",
        colorClass: "text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        iconName: "Package",
      };
  }
}

export function formatItemVersion(version?: string): string {
  if (!version) return "v1.0.0";
  return version.startsWith("v") ? version : `v${version}`;
}
