/**
 * The Sovereign Legal Computing Triad
 * Authoritative system map for Garuda, Hayagriva, and Narsimha.
 */
export const SOVEREIGN_TRIAD = {
  GARUDA: {
    name: "GARUDA",
    title: "Sovereign Cloud Portal & Fleet Manager",
    port: 3300,
    role: "Distribution, Licensing, Remote Dispatch Queue & Air-Gap Export",
    archetype: "The Divine Mount & Messenger (Fleet Distribution & Sync)"
  },
  HAYAGRIVA: {
    name: "HAYAGRIVA",
    title: "Sovereign Practitioner Workstation",
    port: 3000,
    apiPort: 3001,
    role: "Confidential Matter VDR, Docketing, Offline Analysis & Zero Cloud Leakage",
    archetype: "Supreme Intellect & Preserver of Sacred Case Knowledge"
  },
  NARSIMHA: {
    name: "NARSIMHA",
    title: "Sovereign Statutory Inquest & Disqualification Engine",
    port: 8000,
    role: "11.2M+ Multi-Bureau Warehouse, FastMCP over SSE, LangGraph State Machines",
    archetype: "The Piercer of Corporate Veils & Enforcer of Statutory Justice"
  }
} as const;

export type SovereignTriadNode = keyof typeof SOVEREIGN_TRIAD;
