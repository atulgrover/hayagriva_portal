// admin-panel/src/app/admin/agents/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bot, 
  DownloadCloud, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  X, 
  ChevronRight, 
  Copy, 
  Check, 
  Terminal, 
  Code2, 
  Database, 
  UploadCloud, 
  Layers, 
  Plus, 
  Lock, 
  Activity,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomAgentAdmin {
  id: string;
  name: string;
  slug: string;
  version: string;
  author: string;
  firm: string;
  chamberId: string;
  archetype: 'avoidance_forensic_auditor' | 'commercial_injunction_drafter' | 'ibc_claim_verifier' | 'sec29a_eligibility_inquest' | 'custom_coworker';
  archetypeLabel: string;
  status: 'Official' | 'Community' | 'Under Review';
  modelTarget: string;
  boundVaults: string[];
  downloadsCount: number;
  adoptionPercentage: number;
  riskTier: 'READ_ONLY' | 'WRITE_LOCAL';
  airGapSovereign: boolean;
  createdAt: string;
  manifest: {
    name: string;
    version: string;
    description: string;
    triggers: string[];
    allowSubagents: boolean;
    systemPromptSnippet: string;
    rulesList: string[];
  };
}

const initialAgents: CustomAgentAdmin[] = [
  {
    id: 'agent-1',
    name: 'Section 43/66 Avoidance Inquest Auditor',
    slug: 'avoidance-inquest-auditor',
    version: '1.4.0',
    author: 'Adv. Atul Grover',
    firm: 'Grover & Associates Chamber',
    chamberId: 'CHAMBER-DL-089',
    archetype: 'avoidance_forensic_auditor',
    archetypeLabel: 'Avoidance Forensic Auditor',
    status: 'Official',
    modelTarget: 'DeepSeek-R1-7B (Local Q4_K_M)',
    boundVaults: ['ibc_2016', 'cpc_1908'],
    downloadsCount: 1240,
    adoptionPercentage: 82,
    riskTier: 'WRITE_LOCAL',
    airGapSovereign: true,
    createdAt: '2026-09-12',
    manifest: {
      name: 'Section 43/66 Avoidance Inquest Auditor',
      version: '1.4.0',
      description: 'Air-gapped forensic cash flow reconciliation and preferential/fraudulent transaction inquest under Sections 43, 45, 50, and 66 of IBC 2016.',
      triggers: ['/avoidance-audit', '/lookback-reconcile', '/contra-sweep'],
      allowSubagents: true,
      rulesList: [
        'IBC_SEC43_LOOKBACK: Enforce statutory 2-year lookback for related parties, 1-year for others',
        'FORENSIC_DOUBLE_ENTRY: Disallow single-entry unverified journal entries',
        'AIR_GAP_ZERO_NET: Strictly prohibit external HTTP telemetry outside localhost'
      ],
      systemPromptSnippet: `You are the Senior Avoidance Forensic Auditor for the Resolution Professional in CIRP proceedings under the Insolvency and Bankruptcy Code, 2016.
Your primary role is to audit multi-bank ledgers, cash flows, and contra-sweeps across statutory look-back periods to identify preferential, undervalued, extortionate, and fraudulent transactions. Produce court-ready avoiding inquest affidavits formatted for NCLT Principal Bench.`,
    }
  },
  {
    id: 'agent-2',
    name: 'Order 39 Urgent Injunction Drafter',
    slug: 'order39-injunction-drafter',
    version: '2.1.0',
    author: 'K. S. Narayanan, Senior Counsel',
    firm: 'Commercial Bar Chambers, Delhi',
    chamberId: 'CHAMBER-DHC-014',
    archetype: 'commercial_injunction_drafter',
    archetypeLabel: 'Commercial Injunction Drafter',
    status: 'Official',
    modelTarget: 'Llama-3.2-3B (High Velocity)',
    boundVaults: ['cpc_1908', 'commercial_courts_2015', 'specific_relief_1963'],
    downloadsCount: 980,
    adoptionPercentage: 65,
    riskTier: 'WRITE_LOCAL',
    airGapSovereign: true,
    createdAt: '2026-09-18',
    manifest: {
      name: 'Order 39 Urgent Injunction Drafter',
      version: '2.1.0',
      description: 'Commercial Courts Act Order 39 interim stay motions with 3-prong test (prima facie case, balance of convenience, irreparable injury) and Rule 3 compliance undertaking.',
      triggers: ['/cpc-order39', '/cca-interim-relief', '/stay-motion'],
      allowSubagents: false,
      rulesList: [
        'CPC_O39_PRONG: Mandatory articulation of the 3-Prong equitable injunction test',
        'ORDER39_RULE3_UNDERTAKING: Formulate explicit undertaking to deliver copies within 24 hours',
        'STATEMENT_OF_TRUTH: Append Section 63 BSA / 65B EA electronic evidence affirmation'
      ],
      systemPromptSnippet: `You are an elite Commercial Litigation Associate drafting Urgent Interim Injunction Applications under CPC Order 39 Rules 1 & 2 read with Section 151 and Commercial Courts Act, 2015. Structure filings strictly with Facts, 3-Prong Test, Rule 3 Undertaking, and Interim Prayers.`,
    }
  },
  {
    id: 'agent-3',
    name: 'IBC Form C Financial Creditor Claim Verifier',
    slug: 'ibc-form-c-claim-verifier',
    version: '1.2.0',
    author: 'Priya Sharma, IP',
    firm: 'Resolution Partners LLP',
    chamberId: 'CHAMBER-MUM-042',
    archetype: 'ibc_claim_verifier',
    archetypeLabel: 'IBC Creditor Claim Auditor',
    status: 'Official',
    modelTarget: 'Llama-3.2-3B (High Velocity)',
    boundVaults: ['ibc_2016', 'contract_act_1872'],
    downloadsCount: 840,
    adoptionPercentage: 58,
    riskTier: 'READ_ONLY',
    airGapSovereign: true,
    createdAt: '2026-09-22',
    manifest: {
      name: 'IBC Form C Financial Creditor Claim Verifier',
      version: '1.2.0',
      description: 'Automated claim admission ledger, compound interest recalculation, and formal disallowance memo generation.',
      triggers: ['/claim-verify', '/interest-recalc', '/disallowance-memo'],
      allowSubagents: true,
      rulesList: [
        'CIRP_REG_13: Calculate admitted vs disallowed claim within 7 days of receipt',
        'PENAL_INTEREST_CAP: Recalculate and strip uncontracted penal compounding',
        'VOTING_SHARE_FORMULA: Update CoC voting share dynamically upon admission changes'
      ],
      systemPromptSnippet: `You are the IBC Claims Adjudication Specialist. Audit incoming Form C creditor filings against sanction letters, promissory notes, and NeSL record of default. Strip uncontracted penal compounding and verify charge registration under Section 77 Companies Act.`,
    }
  },
  {
    id: 'agent-4',
    name: 'Section 29A 10-Gate Statutory Eligibility Inquest',
    slug: 'sec29a-eligibility-inquest',
    version: '1.0.4',
    author: 'Forensic Legal Bureau',
    firm: 'National Chamber Network',
    chamberId: 'CHAMBER-IN-101',
    archetype: 'sec29a_eligibility_inquest',
    archetypeLabel: 'Section 29A Eligibility Inquest',
    status: 'Community',
    modelTarget: 'DeepSeek-R1-7B (Local Q4_K_M)',
    boundVaults: ['ibc_2016', 'companies_act_2013'],
    downloadsCount: 520,
    adoptionPercentage: 35,
    riskTier: 'READ_ONLY',
    airGapSovereign: true,
    createdAt: '2026-09-28',
    manifest: {
      name: 'Section 29A 10-Gate Statutory Eligibility Inquest',
      version: '1.0.4',
      description: 'Audits resolution applicants across the 10 statutory disqualification gates of Section 29A (clauses a-j), including NPA account tracking, connected persons, and willful defaulter listings.',
      triggers: ['/sec29a-cert', '/npa-lookback', '/willful-defaulter'],
      allowSubagents: true,
      rulesList: [
        'SEC29A_10_GATES: Audit every mandatory gate (a) through (j) sequentially',
        'CONNECTED_PERSONS: Recalculate group holding companies and directorship cross-holdings',
        'RBI_DEFAULTER_SYNC: Cross-reference RBI Wilful Defaulter circular databases'
      ],
      systemPromptSnippet: `You are the Section 29A Inquest Specialist for CIRP Resolution Plans. Rigorously test the Resolution Applicant against clauses (a) through (j) of Section 29A IBC. Generate an exhaustive Section 29A Eligibility Due Diligence Report with definitive certification findings.`,
    }
  },
  {
    id: 'agent-5',
    name: 'Custom Sovereign Chamber Coworker',
    slug: 'custom-chamber-coworker',
    version: '1.0.0',
    author: 'Devendra Mehta, Advocate',
    firm: 'Mehta Tax & Insolvency Chambers',
    chamberId: 'CHAMBER-AHM-019',
    archetype: 'custom_coworker',
    archetypeLabel: 'Custom Sovereign Coworker',
    status: 'Under Review',
    modelTarget: 'Custom Local GGUF',
    boundVaults: ['income_tax_1961', 'gst_act_2017'],
    downloadsCount: 65,
    adoptionPercentage: 4,
    riskTier: 'WRITE_LOCAL',
    airGapSovereign: true,
    createdAt: '2026-10-04',
    manifest: {
      name: 'Custom Sovereign Chamber Coworker',
      version: '1.0.0',
      description: 'Chamber-customized workflow for GST show-cause notices and Section 148 income tax reassessment objections.',
      triggers: ['/gst-scn-reply', '/it-sec148'],
      allowSubagents: false,
      rulesList: [
        'GST_SEC73_TIMELINES: Verify limitation periods under Sections 73 and 74 CGST Act',
        'JURISDICTION_DEFENSE: Test sanction approval under Section 151 Income Tax Act'
      ],
      systemPromptSnippet: `You are a specialist Tax & Insolvency associate drafting responses to GST Show Cause Notices under Section 73/74 and Income Tax Reassessment Objections under Section 148/148A.`,
    }
  }
];

export default function AdminAgentsRegistryPage() {
  const [agents, setAgents] = useState<CustomAgentAdmin[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Official' | 'Community' | 'Under Review'>('ALL');
  const [archetypeFilter, setArchetypeFilter] = useState<string>('ALL');
  const [selectedAgent, setSelectedAgent] = useState<CustomAgentAdmin | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New Upload Form State
  const [uploadName, setUploadName] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadFirm, setUploadFirm] = useState('');
  const [uploadArchetype, setUploadArchetype] = useState<any>('avoidance_forensic_auditor');
  const [uploadVaults, setUploadVaults] = useState('ibc_2016');

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedAgent(null);
        setIsUploadOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleStatusChange = (agentId: string, newStatus: 'Official' | 'Community' | 'Under Review') => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: newStatus } : a));
    if (selectedAgent && selectedAgent.id === agentId) {
      setSelectedAgent(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName) return;
    const newAgent: CustomAgentAdmin = {
      id: `agent-${Date.now()}`,
      name: uploadName,
      slug: uploadName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      version: '1.0.0',
      author: uploadAuthor || 'Chamber Administrator',
      firm: uploadFirm || 'Air-gapped Legal Chamber',
      chamberId: 'CHAMBER-LOCAL-001',
      archetype: uploadArchetype,
      archetypeLabel: uploadArchetype.replace(/_/g, ' '),
      status: 'Under Review',
      modelTarget: 'DeepSeek-R1-7B (Local Q4_K_M)',
      boundVaults: uploadVaults.split(',').map(s => s.trim()),
      downloadsCount: 0,
      adoptionPercentage: 0,
      riskTier: 'WRITE_LOCAL',
      airGapSovereign: true,
      createdAt: new Date().toISOString().split('T')[0],
      manifest: {
        name: uploadName,
        version: '1.0.0',
        description: 'Chamber registered .haya sovereign agent cartridge.',
        triggers: [`/${uploadName.toLowerCase().slice(0, 10)}`],
        allowSubagents: true,
        rulesList: ['AIR_GAP_ZERO_NET: Verified local execution'],
        systemPromptSnippet: `You are the ${uploadName} legal agent coworker.`,
      }
    };
    setAgents([newAgent, ...agents]);
    setIsUploadOpen(false);
    setUploadName('');
    setUploadAuthor('');
    setUploadFirm('');
  };

  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.firm.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchesArchetype = archetypeFilter === 'ALL' || a.archetype === archetypeFilter;

      return matchesSearch && matchesStatus && matchesArchetype;
    });
  }, [agents, searchTerm, statusFilter, archetypeFilter]);

  const totalDeliveries = useMemo(() => {
    return agents.reduce((acc, a) => acc + a.downloadsCount, 0);
  }, [agents]);

  const officialCount = useMemo(() => {
    return agents.filter(a => a.status === 'Official').length;
  }, [agents]);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              AGENT FOUNDRY
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Chamber Accreditation
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Agent Cartridges Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Govern, audit, and accredit sovereign agent cartridges provisioned to desktop clients.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs transition-colors shadow-sm shadow-amber-500/20 self-start md:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload .haya Cartridge</span>
        </button>
      </div>

      {/* Compact Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-card border border-border p-3.5 rounded-lg text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">Total Cartridges</span>
          <span className="text-base font-bold text-foreground font-mono">{agents.length} Cartridges</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">Official Accreditations</span>
          <span className="text-base font-bold text-emerald-500 font-mono">{officialCount} Verified</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">Total Deliveries</span>
          <span className="text-base font-bold text-foreground font-mono">{totalDeliveries.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-medium block">Sandbox Assurance</span>
          <span className="text-base font-bold text-amber-500 font-mono">Air-Gap Verified</span>
        </div>
      </div>

      {/* Single-Line Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-lg shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by agent name, author, firm, slug..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md border border-input bg-secondary/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Official">Official</option>
              <option value="Community">Community</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          {/* Archetype Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Archetype:</span>
            <select
              value={archetypeFilter}
              onChange={(e) => setArchetypeFilter(e.target.value)}
              className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-[140px] truncate"
            >
              <option value="ALL">All Archetypes</option>
              <option value="avoidance_forensic_auditor">Avoidance Auditor</option>
              <option value="commercial_injunction_drafter">Injunction Drafter</option>
              <option value="ibc_claim_verifier">Claim Verifier</option>
              <option value="sec29a_eligibility_inquest">Section 29A Inquest</option>
              <option value="custom_coworker">Custom Coworker</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cartridges Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-4">Cartridge &amp; Mandate</th>
                <th className="py-2.5 px-3 w-48">Author &amp; Firm</th>
                <th className="py-2.5 px-3 w-40">Archetype</th>
                <th className="py-2.5 px-3 w-36">Bound Vaults</th>
                <th className="py-2.5 px-3 w-28 text-right">Deliveries</th>
                <th className="py-2.5 px-3 w-28 text-center">Status</th>
                <th className="py-2.5 px-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No cartridges match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className="hover:bg-amber-500/5 cursor-pointer transition-colors group"
                  >
                    {/* Cartridge & Description */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground text-xs group-hover:text-amber-500 transition-colors flex items-center gap-2">
                        <Bot className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{agent.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-secondary text-muted-foreground">
                          v{agent.version}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {agent.manifest.description}
                      </p>
                    </td>

                    {/* Author & Chamber */}
                    <td className="py-3 px-3">
                      <span className="font-medium text-foreground block truncate">{agent.author}</span>
                      <span className="text-[11px] text-muted-foreground truncate block">{agent.firm}</span>
                    </td>

                    {/* Archetype */}
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-medium text-muted-foreground block truncate">
                        {agent.archetypeLabel}
                      </span>
                    </td>

                    {/* Bound Vaults */}
                    <td className="py-3 px-3">
                      <div className="flex gap-1 flex-wrap">
                        {agent.boundVaults.map((v) => (
                          <span 
                            key={v}
                            className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-secondary text-foreground border border-border"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Deliveries */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-medium text-foreground block">
                        {agent.downloadsCount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        {agent.adoptionPercentage}% adoption
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full inline-block",
                        agent.status === 'Official'
                          ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                          : agent.status === 'Community'
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                            : "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                      )}>
                        {agent.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-center">
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all inline-block" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-border bg-muted/20 text-[11px] text-muted-foreground flex justify-between items-center">
          <span>Showing {filteredAgents.length} of {agents.length} agent cartridges</span>
          <span className="text-[10px]">Click any row to open accreditation drawer</span>
        </div>
      </div>

      {/* Information Drawer (Slide-Over from Right for Cartridge Audit) */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedAgent(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer */}
          <aside className="relative z-10 w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    selectedAgent.status === 'Official'
                      ? "bg-emerald-500/15 text-emerald-500"
                      : selectedAgent.status === 'Community'
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-amber-500/15 text-amber-500"
                  )}>
                    {selectedAgent.status}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                    v{selectedAgent.version}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Air-Gap Sovereign
                  </span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug">
                  {selectedAgent.name}
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  By {selectedAgent.author} • {selectedAgent.firm} ({selectedAgent.chamberId})
                </p>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto text-xs">
              {/* Scope & Description */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Cartridge Mandate &amp; Description
                </h3>
                <p className="text-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border">
                  {selectedAgent.manifest.description}
                </p>
              </div>

              {/* Status Accreditation Control */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Accreditation Status</span>
                </h3>
                <div className="flex items-center gap-2">
                  {(['Official', 'Community', 'Under Review'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedAgent.id, st)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-semibold border transition-all",
                        selectedAgent.status === st
                          ? "bg-amber-500 text-black border-amber-500 shadow-sm"
                          : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slash Triggers */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-500" />
                    <span>In-Harness Slash Triggers</span>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.manifest.triggers.map((trig) => (
                    <button
                      key={trig}
                      onClick={() => copyToClipboard(trig, trig)}
                      className="px-2.5 py-1 rounded bg-black text-amber-400 font-mono text-[11px] border border-border flex items-center gap-1 hover:border-amber-500/50 transition-colors"
                      title="Click to copy trigger"
                    >
                      <span>{trig}</span>
                      {copiedKey === trig ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bound Grounding Vaults */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-500" />
                  <span>Bound Statutory Vaults</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.boundVaults.map((vault) => (
                    <span 
                      key={vault}
                      className="px-2.5 py-1 rounded bg-secondary border border-border font-mono text-[11px] text-foreground"
                    >
                      {vault}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rules List */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Statutory Rules Enforced ({selectedAgent.manifest.rulesList.length})</span>
                </h3>
                <div className="space-y-1 bg-secondary/30 p-2.5 rounded-lg border border-border font-mono text-[11px]">
                  {selectedAgent.manifest.rulesList.map((r, i) => (
                    <div key={i} className="text-muted-foreground flex items-start gap-1.5 py-0.5">
                      <span className="text-amber-500 font-bold shrink-0">•</span>
                      <span className="text-foreground">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Prompt Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>System Prompt Snippet</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedAgent.manifest.systemPromptSnippet, 'prompt')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'prompt' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'prompt' ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 text-slate-200 p-3 rounded-md font-mono text-[11px] border border-border/80 overflow-x-auto max-h-40 leading-relaxed select-all">
                  <pre className="whitespace-pre-wrap">{selectedAgent.manifest.systemPromptSnippet}</pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => alert(`Exporting ${selectedAgent.slug}.haya cartridge bundle`)}
                className="flex-1 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Download .haya Cartridge</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Upload .haya Slide-Over Drawer */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsUploadOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          <aside className="relative z-10 w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-amber-500" />
                <span>Upload .haya Cartridge Package</span>
              </h2>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex-1 p-5 space-y-4 overflow-y-auto text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Cartridge Package File (.haya)</label>
                <div className="border border-dashed border-border rounded-lg p-6 text-center hover:border-amber-500/50 transition-colors bg-secondary/30 cursor-pointer">
                  <UploadCloud className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-foreground">Click to select or drag .haya package</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Signed SHA-256 cartridge file</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Agent Name</label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Insolvency Lookback Auditor"
                  className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Author Name</label>
                  <input
                    type="text"
                    value={uploadAuthor}
                    onChange={(e) => setUploadAuthor(e.target.value)}
                    placeholder="Adv. Atul Grover"
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Chambers / Firm</label>
                  <input
                    type="text"
                    value={uploadFirm}
                    onChange={(e) => setUploadFirm(e.target.value)}
                    placeholder="Grover &amp; Associates"
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Archetype</label>
                <select
                  value={uploadArchetype}
                  onChange={(e) => setUploadArchetype(e.target.value as any)}
                  className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="avoidance_forensic_auditor">Avoidance Forensic Auditor</option>
                  <option value="commercial_injunction_drafter">Commercial Injunction Drafter</option>
                  <option value="ibc_claim_verifier">IBC Creditor Claim Auditor</option>
                  <option value="sec29a_eligibility_inquest">Section 29A Eligibility Inquest</option>
                  <option value="custom_coworker">Custom Sovereign Coworker</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Bound Statutory Vaults (comma-separated)</label>
                <input
                  type="text"
                  value={uploadVaults}
                  onChange={(e) => setUploadVaults(e.target.value)}
                  placeholder="ibc_2016, cpc_1908"
                  className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-sm"
                >
                  Upload &amp; Accredit
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
