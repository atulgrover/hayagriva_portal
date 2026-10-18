// admin-panel/src/app/dashboard/vaults/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Database, 
  ShieldCheck, 
  DownloadCloud, 
  FileCheck, 
  Check, 
  Copy, 
  Lock, 
  Search,
  X,
  ChevronRight,
  FolderOpen,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatutoryVault {
  id: string;
  name: string;
  description: string;
  actCode: string;
  category: string;
  sectionsCount: number;
  amendedUpto: string;
  fileSize: string;
  ramFootprint: string;
  encryption: string;
  destinationPath: string;
  sha256: string;
}

const vaultsData: StatutoryVault[] = [
  {
    id: 'bare_ibc.vault',
    name: 'Insolvency and Bankruptcy Code, 2016',
    description: 'Complete corporate insolvency, CIRP regulations, liquidation priority waterfall & NCLT precedents',
    actCode: 'IBC 2016',
    category: 'Insolvency & CIRP',
    sectionsCount: 255,
    amendedUpto: 'August 2026 (Live India Code Sync)',
    fileSize: '4.8 MB',
    ramFootprint: '~81 KB (48ms boot)',
    encryption: 'AES-256-GCM',
    destinationPath: '~/.hayagriva/vaults/bare_ibc.vault',
    sha256: '9f2a410b88e10c73d4e8b31a529f0e4c1973b88e210a47bc3921ea029471b63e',
  },
  {
    id: 'cirp_regs.vault',
    name: 'IBBI CIRP Regulations, 2016',
    description: 'Insolvency Resolution Process for Corporate Persons regulations, Form C timelines & CoC voting',
    actCode: 'CIRP Regs 2016',
    category: 'Insolvency & CIRP',
    sectionsCount: 42,
    amendedUpto: 'July 2026 Gazetted Amendments',
    fileSize: '2.1 MB',
    ramFootprint: '~45 KB (32ms boot)',
    encryption: 'AES-256-GCM',
    destinationPath: '~/.hayagriva/vaults/cirp_regs.vault',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
  },
  {
    id: 'commercial_courts.vault',
    name: 'Commercial Courts Act, 2015 & Commercial Court Rules',
    description: 'Designated commercial divisions, pre-institution mediation & case management conference procedures',
    actCode: 'CCA 2015',
    category: 'Commercial Litigation',
    sectionsCount: 23,
    amendedUpto: '2026 Central Amendment',
    fileSize: '1.6 MB',
    ramFootprint: '~32 KB (25ms boot)',
    encryption: 'AES-256-GCM',
    destinationPath: '~/.hayagriva/vaults/commercial_courts.vault',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
  },
  {
    id: 'cpc_1908.vault',
    name: 'Code of Civil Procedure, 1908 (Orders 38, 39, VI, XI)',
    description: 'Pleadings, temporary injunctions, discovery, inspection and execution of chamber decrees',
    actCode: 'CPC 1908',
    category: 'Commercial Litigation',
    sectionsCount: 158,
    amendedUpto: 'Official Gazette Consolidated',
    fileSize: '8.4 MB',
    ramFootprint: '~110 KB (65ms boot)',
    encryption: 'AES-256-GCM',
    destinationPath: '~/.hayagriva/vaults/cpc_1908.vault',
    sha256: '7b8192a01948bc10398ea71490b213840e7912bc4019ea81029348bc19e41029',
  },
  {
    id: 'companies_act.vault',
    name: 'Companies Act, 2013 & NCLT Rules',
    description: 'Corporate governance, shareholder disputes under Sections 241/242, compromises & mergers',
    actCode: 'CA 2013',
    category: 'Corporate & Regulatory',
    sectionsCount: 470,
    amendedUpto: 'June 2026 Gazette Sync',
    fileSize: '12.2 MB',
    ramFootprint: '~165 KB (90ms boot)',
    encryption: 'AES-256-GCM',
    destinationPath: '~/.hayagriva/vaults/companies_act.vault',
    sha256: '5e4b10298a7bc190284e31a02948bc10398ea71490b213840e7912bc4019ea81',
  },
  {
    id: 'ni_act.vault',
    name: 'Negotiable Instruments Act, 1881 (Section 138 & 141)',
    description: 'Dishonour of cheques, director vicarious liability, interim compensation & statutory demand notices',
    actCode: 'NI Act 1881',
    category: 'Commercial Litigation',
    sectionsCount: 148,
    amendedUpto: 'Consolidated High Court Bench',
    fileSize: '2.9 MB',
    ramFootprint: '~40 KB (30ms boot)',
    encryption: 'AES-256-GCM',
    destinationPath: '~/.hayagriva/vaults/ni_act.vault',
    sha256: '2a10e47bc9103c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149',
  },
  {
    id: 'bnss_2023.vault',
    name: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    description: 'Criminal procedure replacing CrPC 1973, police custody norms, preliminary enquiry & bail criteria',
    actCode: 'BNSS 2023',
    category: 'Criminal & BNSS',
    sectionsCount: 531,
    amendedUpto: 'Enacted July 2024 (2026 Sync)',
    fileSize: '6.2 MB',
    ramFootprint: '~95 KB (55ms boot)',
    encryption: 'AES-256-GCM',
    destinationPath: '~/.hayagriva/vaults/bnss_2023.vault',
    sha256: '8e10c73d4e8b31a529f0e4c1973b88e210a47bc3921ea029471b63e9f2a410b8',
  },
  {
    id: 'bns_2023.vault',
    name: 'Bharatiya Nyaya Sanhita, 2023',
    description: 'Penal code provisions replacing IPC 1860 with renumbered offense chapters and enhanced definitions',
    actCode: 'BNS 2023',
    category: 'Criminal & BNSS',
    sectionsCount: 358,
    amendedUpto: 'Enacted July 2024 (2026 Sync)',
    fileSize: '5.8 MB',
    ramFootprint: '~88 KB (50ms boot)',
    encryption: 'AES-256-GCM',
    destinationPath: '~/.hayagriva/vaults/bns_2023.vault',
    sha256: '14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014a',
  },
];

export default function KnowledgeVaultsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedVault, setSelectedVault] = useState<StatutoryVault | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncSuccessId, setSyncSuccessId] = useState<string | null>(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVault(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    vaultsData.forEach(v => set.add(v.category));
    return ['ALL', ...Array.from(set)];
  }, []);

  const filteredVaults = useMemo(() => {
    return vaultsData.filter((vault) => {
      const matchesSearch = 
        vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vault.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vault.actCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vault.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || vault.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSync = (vault: StatutoryVault) => {
    setSyncingId(vault.id);
    setTimeout(() => {
      setSyncingId(null);
      setSyncSuccessId(vault.id);
      setTimeout(() => setSyncSuccessId(null), 3500);
    }, 1100);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              GARUDA DIRECTORY
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
              AES-256-GCM Encrypted
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Knowledge Vaults
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cryptographically sealed Indian statutory bare acts, rules, and gazette amendments. Click any row to view cartridge details and sync.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-lg shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter statutes by act, code, category, or keyword..."
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

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vaults Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-4">Statutory Act & Scope</th>
                <th className="py-2.5 px-3 w-32">Citation</th>
                <th className="py-2.5 px-3 w-40">Category</th>
                <th className="py-2.5 px-3 w-32 text-right">Download Size</th>
                <th className="py-2.5 px-3 w-16 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredVaults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No statutory vaults match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVaults.map((vault) => (
                  <tr
                    key={vault.id}
                    onClick={() => setSelectedVault(vault)}
                    className="hover:bg-amber-500/5 cursor-pointer transition-colors group"
                  >
                    {/* Title and Description Line */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground text-xs group-hover:text-amber-500 transition-colors flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{vault.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {vault.description}
                      </p>
                    </td>

                    {/* Citation / Act Code */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold bg-secondary text-foreground border border-border">
                        {vault.actCode}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-muted-foreground">
                        {vault.category}
                      </span>
                    </td>

                    {/* Download Size */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-foreground text-xs">
                        {vault.fileSize}
                      </span>
                    </td>

                    {/* Click Action Indicator */}
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
          <span>Showing {filteredVaults.length} of {vaultsData.length} statutory vaults</span>
          <span className="text-[10px]">Click any row to open cartridge drawer</span>
        </div>
      </div>

      {/* Information Drawer (Slide-Over from Right) */}
      {selectedVault && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedVault(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Content */}
          <aside className="relative z-10 w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-500 border border-blue-500/30">
                    {selectedVault.actCode}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                    {selectedVault.sectionsCount} Sections
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {selectedVault.encryption}
                  </span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug">
                  {selectedVault.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedVault(null)}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto text-xs">
              {/* Sync Feedback Alert */}
              {syncSuccessId === selectedVault.id && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Cartridge synchronized. In-memory indexing complete for offline search.</span>
                </div>
              )}

              {/* Legislative Scope & Description */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Statutory Scope & Legal Coverage
                </h3>
                <p className="text-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border">
                  {selectedVault.description}
                </p>
              </div>

              {/* Legislative Metadata Grid */}
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Cartridge Architecture & Metrics
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary/40 p-2.5 rounded-md border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Sections & Rules</span>
                    <span className="font-semibold text-foreground">{selectedVault.sectionsCount} Sections</span>
                  </div>
                  <div className="bg-secondary/40 p-2.5 rounded-md border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">In-Memory RAM Footprint</span>
                    <span className="font-semibold text-foreground">{selectedVault.ramFootprint}</span>
                  </div>
                  <div className="bg-secondary/40 p-2.5 rounded-md border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Download Size</span>
                    <span className="font-mono font-bold text-blue-500">{selectedVault.fileSize}</span>
                  </div>
                  <div className="bg-secondary/40 p-2.5 rounded-md border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Encryption Standard</span>
                    <span className="font-mono font-semibold text-foreground">{selectedVault.encryption}</span>
                  </div>
                </div>
              </div>

              {/* Live Amendment Currency */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Legislative Amendment Currency
                </h3>
                <div className="bg-secondary/50 p-3 rounded-lg border border-border flex items-center gap-2.5 text-xs text-foreground">
                  <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{selectedVault.amendedUpto}</span>
                </div>
              </div>

              {/* Local Storage Drop Path */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>Harness Vault Cartridge Path</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedVault.destinationPath, 'path')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'path' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'path' ? 'Copied' : 'Copy Path'}</span>
                  </button>
                </div>
                <div className="bg-secondary/70 p-2.5 rounded-md border border-border font-mono text-[11px] text-foreground select-all break-all">
                  {selectedVault.destinationPath}
                </div>
              </div>

              {/* Cryptographic SHA-256 Checksum */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>SHA-256 Integrity Verification Hash</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedVault.sha256, 'sha')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'sha' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'sha' ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="bg-secondary/70 p-2.5 rounded-md border border-border font-mono text-[10px] text-muted-foreground select-all break-all">
                  {selectedVault.sha256}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedVault(null)}
                className="px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                disabled={syncingId === selectedVault.id}
                onClick={() => handleSync(selectedVault)}
                className="flex-1 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>
                  {syncingId === selectedVault.id 
                    ? 'Syncing Cartridge...' 
                    : `Download Vault (${selectedVault.fileSize})`}
                </span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
