// admin-panel/src/app/admin/harness/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  DownloadCloud, 
  Laptop, 
  ShieldCheck, 
  Check, 
  Copy, 
  Plus, 
  Edit3, 
  RefreshCw, 
  UploadCloud,
  FileCode,
  Tag,
  AlertCircle,
  Search,
  X,
  ChevronRight,
  ExternalLink,
  Apple,
  Monitor,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReleaseBinary {
  id: string;
  platform: string;
  arch: string;
  fileName: string;
  fileSize: string;
  sha256: string;
  downloadUrl: string;
  downloadCount: number;
  status: 'LIVE' | 'STAGED';
}

const initialBinaries: ReleaseBinary[] = [
  {
    id: 'bin_mac_arm',
    platform: 'macOS',
    arch: 'Apple Silicon (M1/M2/M3/M4)',
    fileName: 'Hayagriva-1.2.0-arm64.dmg',
    fileSize: '142 MB',
    sha256: '9f2a4b88e10c73d4e8b31a529f0e4c1973b88e210a47bc3921ea029471b63ef1',
    downloadUrl: 'https://releases.hayagriva.legal/v1.2.0/Hayagriva-1.2.0-arm64.dmg',
    downloadCount: 42,
    status: 'LIVE',
  },
  {
    id: 'bin_mac_x64',
    platform: 'macOS',
    arch: 'Intel Core x64',
    fileName: 'Hayagriva-1.2.0-x64.dmg',
    fileSize: '148 MB',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
    downloadUrl: 'https://releases.hayagriva.legal/v1.2.0/Hayagriva-1.2.0-x64.dmg',
    downloadCount: 16,
    status: 'LIVE',
  },
  {
    id: 'bin_win_x64',
    platform: 'Windows',
    arch: 'Windows 10 / 11 64-bit',
    fileName: 'Hayagriva-Setup-1.2.0.exe',
    fileSize: '156 MB',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
    downloadUrl: 'https://releases.hayagriva.legal/v1.2.0/Hayagriva-Setup-1.2.0.exe',
    downloadCount: 28,
    status: 'LIVE',
  },
  {
    id: 'bin_linux_x64',
    platform: 'Linux',
    arch: 'Ubuntu / Debian / RHEL AppImage',
    fileName: 'Hayagriva-1.2.0.AppImage',
    fileSize: '139 MB',
    sha256: '7b8192a01948bc10398ea71490b213840e7912bc4019ea81029348bc19e41029',
    downloadUrl: 'https://releases.hayagriva.legal/v1.2.0/Hayagriva-1.2.0.AppImage',
    downloadCount: 9,
    status: 'LIVE',
  },
];

export default function AdminHarnessPage() {
  const [binaries, setBinaries] = useState<ReleaseBinary[]>(initialBinaries);
  const [searchQuery, setSearchQuery] = useState('');
  const [osFilter, setOsFilter] = useState('ALL');
  const [selectedBinary, setSelectedBinary] = useState<ReleaseBinary | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBinary(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getOsIcon = (platform: string) => {
    const p = platform.toUpperCase();
    if (p.includes('MAC')) {
      return <Apple className="w-4 h-4 text-amber-500 shrink-0" />;
    }
    if (p.includes('WIN')) {
      return <Monitor className="w-4 h-4 text-blue-500 shrink-0" />;
    }
    if (p.includes('LINUX')) {
      return <Globe className="w-4 h-4 text-purple-500 shrink-0" />;
    }
    return <Laptop className="w-4 h-4 text-muted-foreground shrink-0" />;
  };

  const filteredBinaries = useMemo(() => {
    return binaries.filter((bin) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        bin.fileName.toLowerCase().includes(q) ||
        bin.platform.toLowerCase().includes(q) ||
        bin.arch.toLowerCase().includes(q) ||
        bin.sha256.toLowerCase().includes(q);

      const matchesOs = osFilter === 'ALL' || bin.platform.toLowerCase() === osFilter.toLowerCase();
      return matchesSearch && matchesOs;
    });
  }, [binaries, searchQuery, osFilter]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Desktop Harness Release Manager</h1>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
              v1.2.0 Production
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Oversee desktop IDE binary distributions, SHA-256 checksums, and update notification channels for practitioners. Click any row to view release details in the side drawer.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Opening release staging modal...')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish New Release</span>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename, architecture, or checksum..."
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

        {/* OS Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Operating System:</span>
          <select
            value={osFilter}
            onChange={(e) => setOsFilter(e.target.value)}
            className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="ALL">All Platforms</option>
            <option value="macOS">macOS</option>
            <option value="Windows">Windows</option>
            <option value="Linux">Linux</option>
          </select>
        </div>
      </div>

      {/* Multi-Platform Binary Master Table */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <DownloadCloud className="w-4 h-4 text-amber-500" />
            Binary Assets & Checksums ({filteredBinaries.length})
          </h3>
          <span className="text-[11px] text-muted-foreground">Click any row to inspect release details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Platform & OS</th>
                <th className="pb-3 font-semibold">File Name</th>
                <th className="pb-3 font-semibold">Size</th>
                <th className="pb-3 font-semibold">SHA-256 Checksum</th>
                <th className="pb-3 font-semibold">Installs</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredBinaries.map((bin) => {
                const isSelected = selectedBinary?.id === bin.id;
                return (
                  <tr 
                    key={bin.id} 
                    onClick={() => setSelectedBinary(bin)}
                    className={cn(
                      "hover:bg-secondary/40 transition-colors cursor-pointer",
                      isSelected && "bg-secondary/50 ring-1 ring-amber-500/40"
                    )}
                  >
                    <td className="py-3 font-medium text-foreground whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {getOsIcon(bin.platform)}
                        <div>
                          <span className="block font-semibold hover:text-amber-500 transition-colors">{bin.platform}</span>
                          <span className="text-[10px] text-muted-foreground">{bin.arch}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-foreground">{bin.fileName}</td>
                    <td className="py-3 text-muted-foreground font-mono">{bin.fileSize}</td>
                    <td className="py-3 font-mono text-[10px] text-muted-foreground max-w-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{bin.sha256}</span>
                        <button
                          onClick={() => copyHash(bin.id, bin.sha256)}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground shrink-0"
                          title="Copy SHA-256"
                        >
                          {copiedId === bin.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-foreground font-semibold">{bin.downloadCount}</td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                        {bin.status}
                      </span>
                    </td>
                    <td className="py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`Edit binary settings for ${bin.fileName}`)}
                          className="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors"
                        >
                          Edit URL
                        </button>
                        <button
                          onClick={() => setSelectedBinary(bin)}
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
      {selectedBinary && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedBinary(null)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    RELEASE v1.2.0
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                    {selectedBinary.status}
                  </span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug flex items-center gap-2">
                  {getOsIcon(selectedBinary.platform)}
                  {selectedBinary.platform} ({selectedBinary.arch})
                </h2>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  {selectedBinary.fileName}
                </p>
              </div>
              <button
                onClick={() => setSelectedBinary(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-secondary/30 rounded-lg border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Binary File Size</span>
                  <span className="text-sm font-bold text-foreground font-mono">
                    {selectedBinary.fileSize}
                  </span>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Verified Installs</span>
                  <span className="text-sm font-bold text-foreground font-mono">
                    {selectedBinary.downloadCount} Total
                  </span>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Target Architecture</span>
                  <span className="text-xs font-semibold text-foreground">
                    {selectedBinary.arch}
                  </span>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Release Channel</span>
                  <span className="text-xs font-semibold text-amber-500 font-mono">
                    Stable (Main)
                  </span>
                </div>
              </div>

              {/* SHA-256 Checksum */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Cryptographic Integrity (SHA-256)
                </span>
                <div className="bg-secondary/40 border border-border rounded-lg p-3 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground break-all select-all">
                    {selectedBinary.sha256}
                  </span>
                  <button
                    onClick={() => copyHash('drawer-bin-sha', selectedBinary.sha256)}
                    className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                    title="Copy Checksum"
                  >
                    {copiedId === 'drawer-bin-sha' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Download URL & Distribution */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Edge CDN Artifact Endpoint
                </span>
                <div className="bg-secondary/40 border border-border rounded-lg p-3 space-y-2 font-mono text-[11px]">
                  <div className="break-all select-all text-muted-foreground">
                    {selectedBinary.downloadUrl}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/60">
                    <span className="text-muted-foreground text-[10px]">Code Signing:</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1 text-[10px]">
                      <ShieldCheck className="w-3 h-3" />
                      Apple Notarized / Windows Authenticode
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border bg-card/50 flex items-center justify-between gap-3">
              <button
                onClick={() => alert(`Editing distribution link for ${selectedBinary.fileName}`)}
                className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm shadow-amber-500/20"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Binary Settings</span>
              </button>

              <button
                onClick={() => setSelectedBinary(null)}
                className="py-2 px-4 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs transition-colors border border-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
