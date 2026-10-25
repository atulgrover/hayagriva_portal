// src/app/dashboard/studio/page.tsx
'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  Plus, 
  Search, 
  X, 
  ChevronRight, 
  DownloadCloud, 
  Layers, 
  Code2, 
  Database, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { courtArchetypes, CourtArchetype } from '@/components/agents/archetypes';
import { cn } from '@/lib/utils';

interface ActiveChamberAgent {
  id: string;
  name: string;
  description: string;
  archetype: string;
  version: string;
  vaults: string[];
  slashTrigger: string;
  downloads: number;
  updatedAt: string;
  status: 'ACTIVE' | 'DRAFT';
}

const mockActiveAgents: ActiveChamberAgent[] = [
  {
    id: 'agt_001',
    name: 'Section 43 Avoidance Auditor',
    description: 'Audits multi-bank ledgers, identifies contra-sweeps, and flags preferential transactions within look-back windows.',
    archetype: 'avoidance_auditor',
    version: '1.0.0',
    vaults: ['bare_ibc.vault', 'cirp_regs.vault'],
    slashTrigger: '/avoidance-inquest',
    downloads: 14,
    updatedAt: '2 hours ago',
    status: 'ACTIVE',
  },
  {
    id: 'agt_002',
    name: 'Commercial Injunction Drafter',
    description: 'Generates urgent interlocutory relief petitions under Order 39 Rules 1 & 2 read with Section 151 CPC.',
    archetype: 'commercial_pleading',
    version: '1.1.0',
    vaults: ['commercial_courts.vault', 'cpc_1908.vault'],
    slashTrigger: '/cpc-order39',
    downloads: 8,
    updatedAt: 'Yesterday',
    status: 'ACTIVE',
  },
];

function StudioContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<CourtArchetype | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedArchetype(null);
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

  // Filter Active Agents
  const filteredActiveAgents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return mockActiveAgents;
    return mockActiveAgents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.slashTrigger.toLowerCase().includes(q) ||
        a.archetype.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter Starter Archetypes
  const filteredArchetypes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return courtArchetypes;
    return courtArchetypes.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.domain.toLowerCase().includes(q) ||
        a.badge.toLowerCase().includes(q) ||
        a.slashTrigger.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              WORKSPACE &amp; STUDIO
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Chamber Sovereign Agents
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Agent Studio &amp; Foundry
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit, configure, and create bespoke legal agents for your chamber. Build from starter archetypes or launch a custom canvas with verified statutory grounding.
          </p>
        </div>

        {/* Global Action CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/studio/builder?archetype=custom_chamber"
            className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Agent</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-card border border-border p-3 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search custom agents, archetypes, statutes, or slash commands..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-md border border-input bg-secondary/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
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
      </div>

      {/* SECTION 1: Active Chamber Agents (Simple Table) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Bot className="w-4 h-4 text-foreground" />
              <span>Active Chamber Agents</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                ({filteredActiveAgents.length} Configured)
              </span>
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Agents currently deployed and authorized within your chamber fleet.
            </p>
          </div>
          <Link 
            href="/dashboard/studio/builder?archetype=custom_chamber" 
            className="text-xs text-foreground hover:underline font-semibold"
          >
            + New Agent Blank Canvas
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-2.5 px-4">Agent Name &amp; Mandate</th>
                  <th className="py-2.5 px-3 w-36">Slash Trigger</th>
                  <th className="py-2.5 px-3 w-48">Statutory Vaults</th>
                  <th className="py-2.5 px-3 w-24 text-center">Status</th>
                  <th className="py-2.5 px-4 w-40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredActiveAgents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No active chamber agents match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredActiveAgents.map((agt) => (
                    <tr key={agt.id} className="hover:bg-secondary/40 transition-colors group">
                      {/* Name & Description */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground text-xs flex items-center gap-2">
                          <Bot className="w-3.5 h-3.5 text-foreground shrink-0" />
                          <span>{agt.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-secondary text-muted-foreground">
                            v{agt.version}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {agt.description}
                        </p>
                      </td>

                      {/* Slash Trigger */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold bg-secondary text-foreground border border-border">
                          {agt.slashTrigger}
                        </span>
                      </td>

                      {/* Vaults */}
                      <td className="py-3 px-3">
                        <div className="flex gap-1 flex-wrap">
                          {agt.vaults.map((v) => (
                            <span 
                              key={v} 
                              className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded text-foreground border border-border"
                            >
                              {v.replace('.vault', '')}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                          {agt.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/studio/builder?edit=${agt.id}`}
                            className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs transition-colors border border-border"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => alert(`Downloading ${agt.name} (.haya cartridge)`)}
                            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            title="Download .haya package"
                          >
                            <DownloadCloud className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: Starter Archetypes (Simple Table - NO CARDS) */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-foreground" />
            <span>Chamber Starter Archetypes (Audit &amp; Create)</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              ({filteredArchetypes.length} Available)
            </span>
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Select a verified archetype template to pre-load statutory prompts, bare act vaults, and Monaco slash triggers into the builder. Click any row for details.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-2.5 px-4">Archetype Template &amp; Mandate</th>
                  <th className="py-2.5 px-3 w-40">Statutory Domain</th>
                  <th className="py-2.5 px-3 w-36">Trigger</th>
                  <th className="py-2.5 px-3 w-40">Default Vaults</th>
                  <th className="py-2.5 px-4 w-36 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredArchetypes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No starter archetypes match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredArchetypes.map((archetype) => (
                    <tr
                      key={archetype.key}
                      onClick={() => setSelectedArchetype(archetype)}
                      className="hover:bg-secondary/40 cursor-pointer transition-colors group"
                    >
                      {/* Title & Description */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground text-xs group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-foreground shrink-0" />
                          <span>{archetype.title}</span>
                          <span className={cn(
                            "text-[9px] font-semibold px-1.5 py-0.2 rounded border",
                            archetype.badgeColor
                          )}>
                            {archetype.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {archetype.description}
                        </p>
                      </td>

                      {/* Domain */}
                      <td className="py-3 px-3 text-muted-foreground font-mono text-[11px]">
                        {archetype.domain}
                      </td>

                      {/* Slash Trigger */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold bg-secondary text-foreground border border-border">
                          {archetype.slashTrigger}
                        </span>
                      </td>

                      {/* Default Vaults */}
                      <td className="py-3 px-3">
                        <div className="flex gap-1 flex-wrap">
                          {archetype.defaultVaults.map((v) => (
                            <span 
                              key={v} 
                              className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded text-foreground border border-border"
                            >
                              {v.replace('.vault', '')}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/dashboard/studio/builder?archetype=${archetype.key}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-xs transition-colors shadow-xs"
                        >
                          <span>Use Template</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-border bg-muted/20 text-[11px] text-muted-foreground flex justify-between items-center">
            <span>Showing {filteredArchetypes.length} of {courtArchetypes.length} starter archetypes</span>
            <span className="text-[10px]">Click any row to open specification drawer</span>
          </div>
        </div>
      </div>

      {/* Information Drawer (Slide-Over from Right for Archetype Details) */}
      {selectedArchetype && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedArchetype(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Content */}
          <aside className="relative z-10 w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-bold font-mono px-2 py-0.5 rounded border",
                    selectedArchetype.badgeColor
                  )}>
                    {selectedArchetype.badge}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                    {selectedArchetype.domain}
                  </span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug">
                  {selectedArchetype.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArchetype(null)}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto text-xs">
              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Statutory Archetype Overview
                </h3>
                <p className="text-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border">
                  {selectedArchetype.description}
                </p>
              </div>

              {/* In-Harness Slash Trigger */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span>In-Harness Slash Trigger</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedArchetype.slashTrigger, 'trigger')}
                    className="text-[11px] text-foreground hover:underline font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'trigger' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'trigger' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 text-slate-100 p-2.5 rounded-md font-mono text-[11px] border border-border flex items-center justify-between">
                  <span>{selectedArchetype.slashTrigger}</span>
                </div>
              </div>

              {/* Bound Default Vaults */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bound Statutory Vaults</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedArchetype.defaultVaults.map((vault) => (
                    <span 
                      key={vault} 
                      className="px-2.5 py-1 rounded bg-secondary border border-border font-mono text-[11px] text-foreground"
                    >
                      {vault}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subagents & Critique Engine */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Critic Engine &amp; Subagents</span>
                </h3>
                <div className="bg-secondary/40 p-2.5 rounded-md border border-border flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Dual-Loop Critique Agent:</span>
                  <span className="font-mono font-semibold text-foreground">
                    {selectedArchetype.criticAgent || 'None (Single-Agent)'}
                  </span>
                </div>
              </div>

              {/* System Prompt Instructions */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>System Prompt Mandate</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedArchetype.systemPrompt, 'prompt')}
                    className="text-[11px] text-foreground hover:underline font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'prompt' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'prompt' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 text-slate-200 p-3 rounded-md font-mono text-[11px] border border-border/80 overflow-x-auto max-h-40 leading-relaxed select-all">
                  <pre className="whitespace-pre-wrap">{selectedArchetype.systemPrompt}</pre>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedArchetype(null)}
                className="px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Close
              </button>

              <Link
                href={`/dashboard/studio/builder?archetype=${selectedArchetype.key}`}
                className="flex-1 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center"
              >
                <span>Open in Agent Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground animate-pulse">Loading Studio...</div>}>
      <StudioContent />
    </Suspense>
  );
}
