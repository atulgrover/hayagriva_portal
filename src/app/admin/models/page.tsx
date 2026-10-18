// admin-panel/src/app/admin/models/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Cpu, 
  DownloadCloud, 
  HardDrive, 
  Plus, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck, 
  FolderOpen, 
  Search, 
  X, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Calendar,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManagedModel {
  id: string;
  name: string;
  architecture: string;
  format: 'GGUF' | 'ONNX';
  parameters: string;
  quantization: string;
  fileSize: string;
  recommendedRam: string;
  recommendedFor: string;
  destinationPath: string;
  sha256: string;
  downloadsCount: number;
  status: 'Active' | 'Beta' | 'Deprecated';
  releasedAt: string;
}

const initialModels: ManagedModel[] = [
  {
    id: 'deepseek-r1-7b-q4',
    name: 'DeepSeek-R1-Distill-Qwen-7B (Sovereign Legal)',
    architecture: 'Qwen 2.5 / DeepSeek R1',
    format: 'GGUF',
    parameters: '7.6 Billion',
    quantization: 'Q4_K_M',
    fileSize: '4.68 GB',
    recommendedRam: '16 GB Unified Memory (or 8 GB with metal offload)',
    recommendedFor: 'Forensic Inquests, Section 43/66 Avoidance Analysis, Chain-of-Thought Auditing',
    destinationPath: '~/.hayagriva/models/DeepSeek-R1-7B-Q4_K_M.gguf',
    sha256: 'e8b31a529f0e4c1973b88e210a47bc3921ea029471b63ef19f2a4b88e10c73d4',
    downloadsCount: 1482,
    status: 'Active',
    releasedAt: '2026-09-15',
  },
  {
    id: 'llama-3.2-3b-q4',
    name: 'Llama-3.2-3B-Instruct (High Velocity Drafter)',
    architecture: 'Llama 3.2',
    format: 'GGUF',
    parameters: '3.2 Billion',
    quantization: 'Q4_K_M',
    fileSize: '2.02 GB',
    recommendedRam: '8 GB RAM',
    recommendedFor: 'Routine Chamber Notices, CoC Minutes Drafting, Form A Announcements',
    destinationPath: '~/.hayagriva/models/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
    downloadsCount: 2894,
    status: 'Active',
    releasedAt: '2026-09-20',
  },
  {
    id: 'bge-small-onnx',
    name: 'BGE-Small-EN-v1.5 Dense Embeddings',
    architecture: 'BERT Dense Vector',
    format: 'ONNX',
    parameters: '33 Million',
    quantization: 'FP32 / Quantized',
    fileSize: '133 MB',
    recommendedRam: '< 500 MB RAM',
    recommendedFor: 'Semantic Search, Legal Document Chunk Clustering & Vector Memory',
    destinationPath: '~/.hayagriva/models/bge-small-en-v1.5.onnx',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
    downloadsCount: 3740,
    status: 'Active',
    releasedAt: '2026-09-10',
  },
];

export default function AdminModelsRegistryPage() {
  const [models, setModels] = useState<ManagedModel[]>(initialModels);
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'GGUF' | 'ONNX'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Beta' | 'Deprecated'>('ALL');
  const [selectedModel, setSelectedModel] = useState<ManagedModel | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New Model Form State
  const [newName, setNewName] = useState('');
  const [newArch, setNewArch] = useState('');
  const [newFormat, setNewFormat] = useState<'GGUF' | 'ONNX'>('GGUF');
  const [newQuant, setNewQuant] = useState('Q4_K_M');
  const [newParams, setNewParams] = useState('7 Billion');
  const [newSize, setNewSize] = useState('4.2 GB');
  const [newRam, setNewRam] = useState('16 GB RAM');
  const [newPurpose, setNewPurpose] = useState('');
  const [newSha, setNewSha] = useState('');

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedModel(null);
        setIsRegisterOpen(false);
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newEntry: ManagedModel = {
      id: `model-${Date.now()}`,
      name: newName,
      architecture: newArch || 'Transformer 2.5',
      format: newFormat,
      parameters: newParams || '7 Billion',
      quantization: newQuant,
      fileSize: newSize || '2.0 GB',
      recommendedRam: newRam || '8 GB RAM',
      recommendedFor: newPurpose || 'General Courtroom & Chamber Drafting',
      destinationPath: `~/.hayagriva/models/${newName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${newFormat.toLowerCase()}`,
      sha256: newSha || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      downloadsCount: 0,
      status: 'Active',
      releasedAt: new Date().toISOString().split('T')[0],
    };
    setModels([newEntry, ...models]);
    setIsRegisterOpen(false);
    setNewName('');
    setNewArch('');
    setNewPurpose('');
    setNewSha('');
  };

  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        !q || 
        m.name.toLowerCase().includes(q) ||
        m.architecture.toLowerCase().includes(q) ||
        m.recommendedFor.toLowerCase().includes(q);

      const matchesFormat = formatFilter === 'ALL' || m.format === formatFilter;
      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

      return matchesSearch && matchesFormat && matchesStatus;
    });
  }, [models, searchTerm, formatFilter, statusFilter]);

  const totalDeliveries = useMemo(() => {
    return models.reduce((acc, m) => acc + m.downloadsCount, 0);
  }, [models]);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              DISTRIBUTION &amp; ASSETS
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              GGUF &amp; ONNX Weights
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            AI Models Registry
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Govern pre-quantized in-chamber LLM weights and vector embedding artifacts provisioned to the desktop client.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs transition-colors shadow-sm shadow-amber-500/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Model</span>
        </button>
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
            placeholder="Search by model name, architecture, quantization..."
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
          {/* Format */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Format:</span>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value as any)}
              className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">All Formats</option>
              <option value="GGUF">GGUF Engines</option>
              <option value="ONNX">ONNX Vectors</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Beta">Beta</option>
              <option value="Deprecated">Deprecated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Models Table (No bulky cards) */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-4">Model &amp; Capability</th>
                <th className="py-2.5 px-3 w-32">Format</th>
                <th className="py-2.5 px-3 w-28">Parameters</th>
                <th className="py-2.5 px-3 w-28 text-right">Size</th>
                <th className="py-2.5 px-3 w-28 text-right">Deliveries</th>
                <th className="py-2.5 px-3 w-24 text-center">Status</th>
                <th className="py-2.5 px-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No models match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredModels.map((model) => (
                  <tr
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className="hover:bg-amber-500/5 cursor-pointer transition-colors group"
                  >
                    {/* Model & Architecture */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground text-xs group-hover:text-amber-500 transition-colors flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{model.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {model.architecture} • {model.recommendedFor}
                      </p>
                    </td>

                    {/* Format & Quant */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold bg-secondary text-foreground border border-border">
                        {model.format} • {model.quantization}
                      </span>
                    </td>

                    {/* Parameters */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-foreground">{model.parameters}</span>
                    </td>

                    {/* Size */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-foreground">{model.fileSize}</span>
                    </td>

                    {/* Deliveries */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-medium text-emerald-500">
                        {model.downloadsCount.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full inline-block",
                        model.status === 'Active'
                          ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                          : model.status === 'Beta'
                            ? "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                            : "bg-secondary text-muted-foreground"
                      )}>
                        {model.status}
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
          <span>Showing {filteredModels.length} of {models.length} models</span>
          <span className="text-[10px]">Click any row to open specification drawer</span>
        </div>
      </div>

      {/* Information Drawer (Slide-Over from Right) */}
      {selectedModel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedModel(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer */}
          <aside className="relative z-10 w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    {selectedModel.format} • {selectedModel.quantization}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                    {selectedModel.parameters}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    selectedModel.status === 'Active'
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-amber-500/15 text-amber-500"
                  )}>
                    {selectedModel.status}
                  </span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug">
                  {selectedModel.name}
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Released: {selectedModel.releasedAt} • {selectedModel.downloadsCount.toLocaleString()} chamber deliveries
                </p>
              </div>
              <button
                onClick={() => setSelectedModel(null)}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto text-xs">
              {/* Application Mandate */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Recommended Purpose &amp; Capability
                </h3>
                <p className="text-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border">
                  {selectedModel.recommendedFor}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary/40 p-2.5 rounded-md border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Architecture</span>
                    <span className="font-semibold text-foreground">{selectedModel.architecture}</span>
                  </div>
                  <div className="bg-secondary/40 p-2.5 rounded-md border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Quantization Type</span>
                    <span className="font-mono font-semibold text-foreground">{selectedModel.quantization}</span>
                  </div>
                  <div className="bg-secondary/40 p-2.5 rounded-md border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Download Size</span>
                    <span className="font-mono font-bold text-amber-500">{selectedModel.fileSize}</span>
                  </div>
                  <div className="bg-secondary/40 p-2.5 rounded-md border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Recommended RAM</span>
                    <span className="font-medium text-foreground">{selectedModel.recommendedRam}</span>
                  </div>
                </div>
              </div>

              {/* Destination Drop Path */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span>Harness Destination Path</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedModel.destinationPath, 'path')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'path' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'path' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-secondary/70 p-2.5 rounded-md border border-border font-mono text-[11px] text-foreground select-all break-all">
                  {selectedModel.destinationPath}
                </div>
              </div>

              {/* SHA-256 Checksum */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>SHA-256 Integrity Verification</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedModel.sha256, 'sha')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'sha' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'sha' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-secondary/70 p-2.5 rounded-md border border-border font-mono text-[10px] text-muted-foreground select-all break-all">
                  {selectedModel.sha256}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedModel(null)}
                className="px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => alert(`Starting download for ${selectedModel.name} (${selectedModel.fileSize})`)}
                className="flex-1 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Download Model Weights</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Register New Model Slide-Over Drawer */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsRegisterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          <aside className="relative z-10 w-full max-w-xl bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                <span>Register New Model Weight</span>
              </h2>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="flex-1 p-5 space-y-4 overflow-y-auto text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Model Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Qwen2.5-Coder-7B-Legal"
                  className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="GGUF">GGUF (Llama.cpp)</option>
                    <option value="ONNX">ONNX (Embedding)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Quantization</label>
                  <input
                    type="text"
                    value={newQuant}
                    onChange={(e) => setNewQuant(e.target.value)}
                    placeholder="Q4_K_M"
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Architecture</label>
                  <input
                    type="text"
                    value={newArch}
                    onChange={(e) => setNewArch(e.target.value)}
                    placeholder="Qwen 2.5 / DeepSeek"
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Parameters</label>
                  <input
                    type="text"
                    value={newParams}
                    onChange={(e) => setNewParams(e.target.value)}
                    placeholder="7.2 Billion"
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">File Size</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="4.35 GB"
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Recommended RAM</label>
                  <input
                    type="text"
                    value={newRam}
                    onChange={(e) => setNewRam(e.target.value)}
                    placeholder="16 GB RAM"
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Recommended Purpose</label>
                <textarea
                  rows={3}
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="Explain legal purpose, court applications, and reasoning tasks..."
                  className="w-full bg-secondary/50 border border-input rounded-md p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">SHA-256 Checksum</label>
                <input
                  type="text"
                  value={newSha}
                  onChange={(e) => setNewSha(e.target.value)}
                  placeholder="64-character SHA-256 hex string"
                  className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-sm"
                >
                  Save Model Weight
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
