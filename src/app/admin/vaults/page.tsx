// admin-panel/src/app/admin/vaults/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Database, 
  ShieldCheck, 
  RefreshCw, 
  DownloadCloud, 
  Lock, 
  Cpu, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles,
  Search,
  Globe,
  X,
  ChevronRight,
  FolderOpen,
  CheckCircle2,
  FileCode,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminVault {
  id: string;
  name: string;
  actCode: string;
  category: string;
  sectionsCount: number;
  amendedUpto: string;
  fileSize: string;
  ramFootprint: string;
  encryption: string;
  sha256: string;
  syncSource: string;
  syncStatus: 'SYNCED' | 'SYNCING' | 'STALE';
  lastSynced: string;
  destinationPath?: string;
  description?: string;
}

const initialVaults: AdminVault[] = [
  {
    id: 'bare_ibc.vault',
    name: 'Insolvency and Bankruptcy Code, 2016',
    actCode: 'IBC 2016',
    category: 'Insolvency & CIRP',
    sectionsCount: 255,
    amendedUpto: 'August 2026',
    fileSize: '4.8 MB',
    ramFootprint: '~81 KB (48ms boot)',
    encryption: 'AES-256-GCM',
    sha256: '9f2a410b88e10c73d4e8b31a529f0e4c1973b88e210a47bc3921ea029471b63e',
    syncSource: 'indiacode.gov.in / Act 31 of 2016',
    syncStatus: 'SYNCED',
    lastSynced: '2 hours ago',
    destinationPath: '~/.hayagriva/vaults/bare_ibc.vault',
    description: 'Complete corporate insolvency, CIRP regulations, liquidation priority waterfall & NCLT precedents compiled from India Code DSpace API.',
  },
  {
    id: 'cirp_regs.vault',
    name: 'IBBI (Insolvency Resolution Process) Regulations, 2016',
    actCode: 'CIRP Regs 2016',
    category: 'Insolvency & CIRP',
    sectionsCount: 42,
    amendedUpto: 'July 2026',
    fileSize: '2.1 MB',
    ramFootprint: '~45 KB',
    encryption: 'AES-256-GCM',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
    syncSource: 'ibbi.gov.in / Gazette Notifications',
    syncStatus: 'SYNCED',
    lastSynced: '1 day ago',
    destinationPath: '~/.hayagriva/vaults/cirp_regs.vault',
    description: 'Insolvency Resolution Process for Corporate Persons regulations, Form C timelines, and Committee of Creditors voting protocols.',
  },
  {
    id: 'commercial_courts.vault',
    name: 'Commercial Courts Act, 2015 & Rules',
    actCode: 'CCA 2015',
    category: 'Commercial Litigation',
    sectionsCount: 23,
    amendedUpto: '2026 Amendment',
    fileSize: '1.6 MB',
    ramFootprint: '~32 KB',
    encryption: 'AES-256-GCM',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
    syncSource: 'indiacode.gov.in / Act 4 of 2016',
    syncStatus: 'SYNCED',
    lastSynced: '3 days ago',
    destinationPath: '~/.hayagriva/vaults/commercial_courts.vault',
    description: 'Specified value determination, mandatory Pre-Institution Mediation (PIMS) timelines, and commercial division jurisdiction rules.',
  },
  {
    id: 'cpc_1908.vault',
    name: 'Code of Civil Procedure, 1908',
    actCode: 'CPC 1908',
    category: 'Commercial Litigation',
    sectionsCount: 158,
    amendedUpto: 'Gazette Consolidated',
    fileSize: '8.4 MB',
    ramFootprint: '~110 KB',
    encryption: 'AES-256-GCM',
    sha256: '7b8192a01948bc10398ea71490b213840e7912bc4019ea81029348bc19e41029',
    syncSource: 'indiacode.gov.in / Act 5 of 1908',
    syncStatus: 'SYNCED',
    lastSynced: '5 days ago',
    destinationPath: '~/.hayagriva/vaults/cpc_1908.vault',
    description: 'Consolidated Sections 1-158 and Orders 1-51 with statutory amendment footnotes, writ pleadings, and execution petitions.',
  },
  {
    id: 'companies_act.vault',
    name: 'Companies Act, 2013 & NCLT Rules',
    actCode: 'CA 2013',
    category: 'Corporate & Regulatory',
    sectionsCount: 470,
    amendedUpto: 'June 2026',
    fileSize: '12.2 MB',
    ramFootprint: '~165 KB',
    encryption: 'AES-256-GCM',
    sha256: '5e4b10298a7bc190284e31a02948bc10398ea71490b213840e7912bc4019ea81',
    syncSource: 'indiacode.gov.in / Act 18 of 2013',
    syncStatus: 'SYNCED',
    lastSynced: '1 week ago',
    destinationPath: '~/.hayagriva/vaults/companies_act.vault',
    description: 'Corporate governance, oppression & mismanagement petitions, scheme of arrangements, and official liquidator compliance provisions.',
  },
  {
    id: 'ni_act.vault',
    name: 'Negotiable Instruments Act, 1881',
    actCode: 'NI Act 1881',
    category: 'Commercial Litigation',
    sectionsCount: 148,
    amendedUpto: 'Consolidated',
    fileSize: '2.9 MB',
    ramFootprint: '~40 KB',
    encryption: 'AES-256-GCM',
    sha256: '2a10e47bc9103c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149',
    syncSource: 'indiacode.gov.in / Act 26 of 1881',
    syncStatus: 'SYNCED',
    lastSynced: '1 week ago',
    destinationPath: '~/.hayagriva/vaults/ni_act.vault',
    description: 'Section 138 cheque dishonour jurisprudence, statutory notices, interim compensation calculations, and appellate deposit rules.',
  },
];

export default function AdminVaultsPage() {
  const [vaults, setVaults] = useState<AdminVault[]>(initialVaults);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedVault, setSelectedVault] = useState<AdminVault | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    vaults.forEach((v) => set.add(v.category));
    return ['ALL', ...Array.from(set)];
  }, [vaults]);

  const filteredVaults = useMemo(() => {
    return vaults.filter((vault) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        vault.name.toLowerCase().includes(q) ||
        vault.actCode.toLowerCase().includes(q) ||
        vault.id.toLowerCase().includes(q) ||
        vault.category.toLowerCase().includes(q) ||
        (vault.description && vault.description.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'ALL' || vault.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [vaults, searchTerm, selectedCategory]);

  const handleSyncVault = (vaultId: string) => {
    setSyncingId(vaultId);
    setTimeout(() => {
      setSyncingId(null);
      setVaults((prev) =>
        prev.map((v) =>
          v.id === vaultId
            ? { ...v, syncStatus: 'SYNCED', lastSynced: 'Just now' }
            : v
        )
      );
      if (selectedVault && selectedVault.id === vaultId) {
        setSelectedVault((prev) =>
          prev ? { ...prev, syncStatus: 'SYNCED', lastSynced: 'Just now' } : null
        );
      }
    }, 1200);
  };

  const copyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Statutory Bare Act Vaults Governance</h1>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
              India Code Mirror Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor, sync, and govern encrypted bare act cartridges compiled from the Ministry of Law & Justice India Code DSpace REST endpoints. Click any row to view full cartridge details in the side drawer.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSyncingId('ALL');
              setTimeout(() => {
                setSyncingId(null);
                setVaults((prev) =>
                  prev.map((v) => ({ ...v, syncStatus: 'SYNCED', lastSynced: 'Just now' }))
                );
              }, 1800);
            }}
            disabled={Boolean(syncingId)}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingId === 'ALL' ? 'animate-spin' : ''}`} />
            <span>Re-Sync All India Code Vaults</span>
          </button>
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
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Practice Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vaults Master Table */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" />
            Active Statutory Vault Cartridges ({filteredVaults.length})
          </h3>
          <span className="text-[11px] text-muted-foreground">Click any row to inspect cartridge details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Vault File & Statute</th>
                <th className="pb-3 font-semibold">Act Code</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Sections</th>
                <th className="pb-3 font-semibold">Encryption</th>
                <th className="pb-3 font-semibold">SHA-256 Checksum</th>
                <th className="pb-3 font-semibold">India Code Mirror</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredVaults.map((vault) => {
                const isSelected = selectedVault?.id === vault.id;
                return (
                  <tr 
                    key={vault.id} 
                    onClick={() => setSelectedVault(vault)}
                    className={cn(
                      "hover:bg-secondary/40 transition-colors cursor-pointer",
                      isSelected && "bg-secondary/50 ring-1 ring-amber-500/40"
                    )}
                  >
                    <td className="py-3 font-medium text-foreground">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="font-semibold hover:text-amber-500 transition-colors">{vault.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground block">{vault.id} ({vault.fileSize})</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-foreground font-bold whitespace-nowrap">{vault.actCode}</td>
                    <td className="py-3">
                      <span className="text-[10px] bg-secondary/80 border border-border px-2 py-0.5 rounded text-muted-foreground whitespace-nowrap">
                        {vault.category}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-muted-foreground">{vault.sectionsCount}</td>
                    <td className="py-3 whitespace-nowrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-emerald-400 font-semibold flex items-center gap-1 w-max">
                        <Lock className="w-2.5 h-2.5" />
                        {vault.encryption}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[10px] text-muted-foreground max-w-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{vault.sha256}</span>
                        <button
                          onClick={() => copyHash(vault.id, vault.sha256)}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground shrink-0"
                          title="Copy SHA-256"
                        >
                          {copiedId === vault.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-[10px] text-muted-foreground block font-mono">{vault.syncSource}</span>
                      <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                        ● Synced ({vault.lastSynced})
                      </span>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSyncVault(vault.id)}
                          disabled={syncingId === vault.id}
                          className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${syncingId === vault.id ? 'animate-spin text-amber-500' : ''}`} />
                          <span>Re-Sync</span>
                        </button>
                        <button
                          onClick={() => setSelectedVault(vault)}
                          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title="Inspect Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Drawer (Slide-Over from Right) */}
      {selectedVault && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedVault(null)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    {selectedVault.actCode}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                    {selectedVault.category}
                  </span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug">
                  {selectedVault.name}
                </h2>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  {selectedVault.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedVault(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Overview & Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Statutory Scope
                </span>
                <p className="text-xs text-foreground/90 leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border">
                  {selectedVault.description || 'Complete official legislative codification with amended gazette footnotes and cross-statutory citations.'}
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/30 rounded-lg border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Total Sections</span>
                  <span className="text-sm font-bold text-foreground font-mono">
                    {selectedVault.sectionsCount} Sections
                  </span>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Amended Upto</span>
                  <span className="text-xs font-semibold text-foreground">
                    {selectedVault.amendedUpto}
                  </span>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground block">File Size</span>
                  <span className="text-sm font-bold text-foreground font-mono">
                    {selectedVault.fileSize}
                  </span>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground block">In-RAM Footprint</span>
                  <span className="text-xs font-semibold text-emerald-500 font-mono">
                    {selectedVault.ramFootprint}
                  </span>
                </div>
              </div>

              {/* Encryption & Security */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Sovereign Encryption Standard
                </span>
                <div className="bg-secondary/40 border border-border rounded-lg p-3 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cipher:</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {selectedVault.encryption}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Air-Gap Status:</span>
                    <span className="text-foreground">Zero Cloud Egress</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Install Target:</span>
                    <span className="text-foreground truncate max-w-[200px]" title={selectedVault.destinationPath}>
                      {selectedVault.destinationPath || `~/.hayagriva/vaults/${selectedVault.id}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* SHA-256 Checksum */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Cryptographic Integrity (SHA-256)
                </span>
                <div className="bg-secondary/40 border border-border rounded-lg p-3 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground break-all select-all">
                    {selectedVault.sha256}
                  </span>
                  <button
                    onClick={() => copyHash('drawer-sha', selectedVault.sha256)}
                    className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                    title="Copy Checksum"
                  >
                    {copiedId === 'drawer-sha' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Legislative Mirror Sync Details */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Legislative Mirror Source
                </span>
                <div className="bg-secondary/40 border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Mirror Origin:</span>
                    <span className="font-mono text-[11px] text-amber-500">{selectedVault.syncSource}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Gazette Sync:</span>
                    <span className="text-foreground font-semibold">{selectedVault.lastSynced}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sync Verification:</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Mirror
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border bg-card/50 flex items-center justify-between gap-3">
              <button
                onClick={() => handleSyncVault(selectedVault.id)}
                disabled={syncingId === selectedVault.id}
                className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm shadow-amber-500/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === selectedVault.id ? 'animate-spin' : ''}`} />
                <span>Re-Sync from India Code</span>
              </button>

              <button
                onClick={() => alert(`Downloading cartridge: ${selectedVault.id}`)}
                className="py-2 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-border"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Export .vault</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
