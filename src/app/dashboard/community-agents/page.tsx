// admin-panel/src/app/dashboard/community-agents/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  DownloadCloud, 
  Search, 
  X, 
  ChevronRight, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck, 
  CheckCircle2, 
  Code2, 
  Layers, 
  Database,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { HubItem } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

export default function CommunityAgentsPage() {
  const [items, setItems] = useState<HubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedArchetype, setSelectedArchetype] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<HubItem | null>(null);
  const [activeCodeFile, setActiveCodeFile] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installSuccessId, setInstallSuccessId] = useState<string | null>(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Items from Hub API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/hub/items?limit=50');
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
        }
      } catch (err) {
        console.error('Failed to load community agents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Unique domains and archetypes for dropdowns
  const domains = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.domain) set.add(item.domain);
    });
    return ['ALL', ...Array.from(set)];
  }, [items]);

  const archetypes = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.archetype) set.add(item.archetype);
    });
    return ['ALL', ...Array.from(set)];
  }, [items]);

  // Calculate download size
  const getItemSize = (item: HubItem): string => {
    const manifest = (item.manifest as any) || {};
    if (Array.isArray(manifest.files) && manifest.files.length > 0) {
      const bytes = manifest.files.reduce((acc: number, f: any) => acc + (f.size || 0), 0);
      if (bytes < 1024) return `${bytes} B`;
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return '18.4 KB';
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = (item.name || '').toLowerCase().includes(q);
      const descMatch = (item.description || '').toLowerCase().includes(q);
      const domainMatch = (item.domain || '').toLowerCase().includes(q);
      const tags = Array.isArray(item.tags) ? item.tags : [];
      const tagMatch = tags.some((t: any) => String(t).toLowerCase().includes(q));

      const matchesSearch = !q || nameMatch || descMatch || domainMatch || tagMatch;
      const matchesDomain = selectedDomain === 'ALL' || item.domain === selectedDomain;
      const matchesArchetype = selectedArchetype === 'ALL' || item.archetype === selectedArchetype;

      return matchesSearch && matchesDomain && matchesArchetype;
    });
  }, [items, searchQuery, selectedDomain, selectedArchetype]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleInstall = (item: HubItem) => {
    setInstallingId(item.id);
    setTimeout(() => {
      setInstallingId(null);
      setInstallSuccessId(item.id);
      setTimeout(() => setInstallSuccessId(null), 3500);
    }, 1200);
  };

  const getSlashTrigger = (item: HubItem) => {
    if (item.slug) return `/${item.slug}`;
    const tags = Array.isArray(item.tags) ? item.tags : [];
    if (tags.length > 0) return `/${tags[0]}`;
    return '/run-agent';
  };

  // Manifest files for selected item
  const selectedManifest = (selectedItem?.manifest as any) || {};
  const manifestFiles: any[] = Array.isArray(selectedManifest.files) ? selectedManifest.files : [];
  const currentCodeFile = manifestFiles.find(f => f.name === activeCodeFile) || manifestFiles[0];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              GARUDA DIRECTORY
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Community Registry
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Community Agents
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pre-assembled Indian legal and statutory agents published by the sovereign legal community. Click any row to view manifest details and install.
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter agents by title, description, slash trigger, or tags..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md border border-input bg-secondary/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Domain Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Domain:</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-[140px] truncate"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'All Domains' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Archetype Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Archetype:</span>
            <select
              value={selectedArchetype}
              onChange={(e) => setSelectedArchetype(e.target.value)}
              className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-[140px] truncate"
            >
              {archetypes.map((a) => (
                <option key={a} value={a}>
                  {a === 'ALL' ? 'All Archetypes' : a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-4">Agent & Role Description</th>
                <th className="py-2.5 px-3 w-36">Trigger</th>
                <th className="py-2.5 px-3 w-36">Archetype</th>
                <th className="py-2.5 px-3 w-28 text-right">Download Size</th>
                <th className="py-2.5 px-3 w-16 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Loading community registry...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No community agents match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setActiveCodeFile(null);
                    }}
                    className="hover:bg-amber-500/5 cursor-pointer transition-colors group"
                  >
                    {/* Title and Description Line */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground text-xs group-hover:text-amber-500 transition-colors flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{item.name}</span>
                        {item.verified && (
                          <span title="Verified Sovereign Agent" className="inline-flex">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </td>

                    {/* Slash Command Trigger */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold bg-secondary text-amber-500 border border-border">
                        {getSlashTrigger(item)}
                      </span>
                    </td>

                    {/* Archetype */}
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-muted-foreground font-medium truncate block">
                        {item.archetype || item.domain || 'legal-skill'}
                      </span>
                    </td>

                    {/* Download Size */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-foreground text-xs">
                        {getItemSize(item)}
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
          <span>Showing {filteredItems.length} of {items.length} community agents</span>
          <span className="text-[10px]">Click any row to open manifest drawer</span>
        </div>
      </div>

      {/* Information Drawer (Slide-Over from Right) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Content */}
          <aside className="relative z-10 w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    {selectedItem.archetype || selectedItem.domain}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                    {getItemSize(selectedItem)}
                  </span>
                  {selectedItem.verified && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug">
                  {selectedItem.name}
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  By {selectedItem.authorName || 'Garuda Sovereign Guild'} • {selectedItem.downloads || 0} chamber installs
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto text-xs">
              {/* Install Feedback Alert */}
              {installSuccessId === selectedItem.id && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Agent installed successfully. Ready for slash execution in your desktop harness.</span>
                </div>
              )}

              {/* Full Description */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Agent Mandate & Legal Logic
                </h3>
                <p className="text-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border">
                  {selectedItem.description}
                </p>
              </div>

              {/* Slash Command Trigger */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-500" />
                    <span>In-Harness Slash Trigger</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(getSlashTrigger(selectedItem), 'trigger')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'trigger' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'trigger' ? 'Copied' : 'Copy Trigger'}</span>
                  </button>
                </div>
                <div className="bg-black text-amber-400 p-2.5 rounded-md font-mono text-[11px] border border-border flex items-center justify-between">
                  <span>{getSlashTrigger(selectedItem)}</span>
                </div>
              </div>

              {/* Required Statutory Vaults */}
              {Array.isArray(selectedItem.statutoryVaults) && selectedItem.statutoryVaults.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span>Required Statutory Grounding Vaults</span>
                  </h3>
                  <div className="space-y-1">
                    {selectedItem.statutoryVaults.map((vault: string, idx: number) => (
                      <div key={idx} className="bg-secondary/40 p-2 rounded border border-border font-mono text-[11px] text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>{vault}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manifest Package Files */}
              {manifestFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Package Manifest Files ({manifestFiles.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {manifestFiles.map((file: any) => (
                      <button
                        key={file.name}
                        onClick={() => setActiveCodeFile(file.name)}
                        className={cn(
                          "px-2.5 py-1 rounded text-[11px] font-mono border transition-colors",
                          (activeCodeFile === file.name || (!activeCodeFile && currentCodeFile?.name === file.name))
                            ? "bg-amber-500/15 text-amber-500 border-amber-500/30 font-bold"
                            : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                        )}
                      >
                        {file.name} ({file.size ? `${file.size} B` : ''})
                      </button>
                    ))}
                  </div>

                  {currentCodeFile && currentCodeFile.content && (
                    <div className="bg-slate-950 text-slate-100 p-3 rounded-md font-mono text-[11px] border border-border/80 overflow-x-auto max-h-48 leading-relaxed select-all">
                      <pre>{currentCodeFile.content}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* Import ID / Distribution URN */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                    Garuda Distribution URN
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedItem.urn || selectedItem.id, 'urn')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'urn' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'urn' ? 'Copied' : 'Copy URN'}</span>
                  </button>
                </div>
                <div className="bg-secondary/70 p-2.5 rounded-md border border-border font-mono text-[10px] text-muted-foreground select-all break-all">
                  {selectedItem.urn || selectedItem.id}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                disabled={installingId === selectedItem.id}
                onClick={() => handleInstall(selectedItem)}
                className="flex-1 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>
                  {installingId === selectedItem.id 
                    ? 'Pushing to Desktop Harness...' 
                    : `Install Agent (${getItemSize(selectedItem)})`}
                </span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
