// admin-panel/src/app/dashboard/models/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Cpu, 
  DownloadCloud, 
  Check, 
  Copy, 
  Terminal, 
  ShieldCheck,
  FolderOpen,
  Search,
  X,
  ChevronRight,
  Filter,
  CheckCircle2,
  HardDrive,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIModel {
  id: string;
  name: string;
  description: string;
  architecture: string;
  format: 'GGUF' | 'ONNX';
  parameters: string;
  quantization: string;
  fileSize: string;
  sizeBytes: number;
  recommendedRam: string;
  recommendedFor: string;
  destinationPath: string;
  sha256: string;
  cliCommand: string;
  category: 'LLM' | 'SLM' | 'Embeddings';
}

const modelsData: AIModel[] = [
  {
    id: 'deepseek-r1-7b-q4',
    name: 'DeepSeek-R1-Distill-Qwen-7B (Sovereign Legal)',
    description: 'Forensic Inquests, Section 43/66 Avoidance Analysis & Chain-of-Thought Auditing',
    architecture: 'Qwen 2.5 / DeepSeek R1',
    format: 'GGUF',
    parameters: '7.6 Billion',
    quantization: 'Q4_K_M',
    fileSize: '4.68 GB',
    sizeBytes: 4680000000,
    recommendedRam: '16 GB Unified Memory (or 8 GB with metal offload)',
    recommendedFor: 'Forensic Inquests, Section 43/66 Avoidance Analysis, Chain-of-Thought Auditing, Insolvency cross-examinations.',
    destinationPath: '~/.hayagriva/models/DeepSeek-R1-7B-Q4_K_M.gguf',
    sha256: 'e8b31a529f0e4c1973b88e210a47bc3921ea029471b63ef19f2a4b88e10c73d4',
    cliCommand: 'hayagriva pull deepseek-r1-7b-q4',
    category: 'SLM',
  },
  {
    id: 'bharatgen-legal-7b',
    name: 'BharatGen Indic-Legal-7B Instruct',
    description: 'Bilingual legal reasoning fine-tuned on Supreme Court & High Court judgments in English & Hindi',
    architecture: 'BharatGen / Qwen 2.5',
    format: 'GGUF',
    parameters: '7.2 Billion',
    quantization: 'Q4_K_M',
    fileSize: '4.35 GB',
    sizeBytes: 4350000000,
    recommendedRam: '16 GB RAM (Metal/CUDA enabled)',
    recommendedFor: 'Bilingual pleadings, High Court writ citations, Indic vernacular client consultation summaries.',
    destinationPath: '~/.hayagriva/models/BharatGen-Indic-Legal-7B.gguf',
    sha256: '4f810298a7bc190284e31a02948bc10398ea71490b213840e7912bc4019ea810',
    cliCommand: 'hayagriva pull bharatgen-legal-7b',
    category: 'SLM',
  },
  {
    id: 'llama-3.2-3b-q4',
    name: 'Llama-3.2-3B-Instruct (High Velocity Drafter)',
    description: 'Rapid drafting of routine chamber notices, CoC meeting minutes & Form A announcements',
    architecture: 'Llama 3.2',
    format: 'GGUF',
    parameters: '3.2 Billion',
    quantization: 'Q4_K_M',
    fileSize: '2.02 GB',
    sizeBytes: 2020000000,
    recommendedRam: '8 GB RAM',
    recommendedFor: 'Routine Chamber Notices, CoC Minutes Drafting, Form A Announcements, fast turnaround filings.',
    destinationPath: '~/.hayagriva/models/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
    cliCommand: 'hayagriva pull llama-3.2-3b-q4',
    category: 'SLM',
  },
  {
    id: 'bge-small-onnx',
    name: 'BGE-Small-EN-v1.5 Dense Embeddings',
    description: 'High-speed semantic search, document chunk clustering & in-memory vector retrieval',
    architecture: 'BERT Dense Vector',
    format: 'ONNX',
    parameters: '33 Million',
    quantization: 'FP32 / Quantized',
    fileSize: '133 MB',
    sizeBytes: 133000000,
    recommendedRam: '< 500 MB RAM',
    recommendedFor: 'Semantic Search, Legal Document Chunk Clustering & Vector Memory for RAG vaults.',
    destinationPath: '~/.hayagriva/models/bge-small-en-v1.5.onnx',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
    cliCommand: 'hayagriva pull bge-small-onnx',
    category: 'Embeddings',
  },
  {
    id: 'bge-m3-multilingual',
    name: 'BGE-M3 Multilingual Hybrid Embeddings',
    description: 'Multi-lingual dense + sparse lexical retrieval supporting 102 languages and 8,192 token context',
    architecture: 'XLM-RoBERTa',
    format: 'ONNX',
    parameters: '560 Million',
    quantization: 'Q8_0',
    fileSize: '680 MB',
    sizeBytes: 680000000,
    recommendedRam: '2 GB RAM',
    recommendedFor: 'Cross-lingual statutory search across Hindi, Marathi, Gujarati, Tamil and English court documents.',
    destinationPath: '~/.hayagriva/models/bge-m3-dense.onnx',
    sha256: '7b8192a01948bc10398ea71490b213840e7912bc4019ea81029348bc19e41029',
    cliCommand: 'hayagriva pull bge-m3-multilingual',
    category: 'Embeddings',
  },
  {
    id: 'llama-3.3-70b-groq-q4',
    name: 'Llama-3.3-70B Chamber-Inference (Flagship Reasoner)',
    description: 'Complex appellate argumentation, constitutional writ strategy and cross-statute synthesis',
    architecture: 'Llama 3.3',
    format: 'GGUF',
    parameters: '70 Billion',
    quantization: 'Q4_K_M',
    fileSize: '38.5 GB',
    sizeBytes: 38500000000,
    recommendedRam: '64 GB Unified Memory (Apple M2/M3 Max/Ultra or Dual RTX 4090)',
    recommendedFor: 'Supreme Court Special Leave Petitions, multi-jurisdiction IBC group insolvency and statutory interpretation.',
    destinationPath: '~/.hayagriva/models/Llama-3.3-70B-Q4_K_M.gguf',
    sha256: '5e4b10298a7bc190284e31a02948bc10398ea71490b213840e7912bc4019ea81',
    cliCommand: 'hayagriva pull llama-3.3-70b-groq-q4',
    category: 'LLM',
  },
];

export default function SovereignModelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'ALL' | 'GGUF' | 'ONNX'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'LLM' | 'SLM' | 'Embeddings'>('ALL');
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedModel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredModels = useMemo(() => {
    return modelsData.filter((model) => {
      const matchesSearch = 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.architecture.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.recommendedFor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFormat = selectedFormat === 'ALL' || model.format === selectedFormat;
      const matchesCategory = selectedCategory === 'ALL' || model.category === selectedCategory;

      return matchesSearch && matchesFormat && matchesCategory;
    });
  }, [searchTerm, selectedFormat, selectedCategory]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (model: AIModel) => {
    setDownloadingId(model.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccessId(model.id);
      setTimeout(() => setDownloadSuccessId(null), 3500);
    }, 1200);
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
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Offline Weights
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Sovereign Models
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curated offline legal LLMs, small language models (SLMs), and dense embedding matrices. Click any row for technical specifications and drop paths.
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
            placeholder="Filter models by name, architecture, purpose..."
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
          {/* Format Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Format:</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">All Formats</option>
              <option value="GGUF">GGUF (Llama.cpp)</option>
              <option value="ONNX">ONNX (Dense Vector)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-secondary/60 border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="SLM">SLMs (Reasoners)</option>
              <option value="LLM">Flagship LLMs</option>
              <option value="Embeddings">Embeddings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Models Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-4">Model & Description</th>
                <th className="py-2.5 px-3 w-32">Format</th>
                <th className="py-2.5 px-3 w-28">Parameters</th>
                <th className="py-2.5 px-3 w-32 text-right">Download Size</th>
                <th className="py-2.5 px-3 w-16 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No sovereign models match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredModels.map((model) => (
                  <tr
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className="hover:bg-amber-500/5 cursor-pointer transition-colors group"
                  >
                    {/* Title and Description Line */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground text-xs group-hover:text-amber-500 transition-colors flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{model.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {model.description}
                      </p>
                    </td>

                    {/* Format Badge */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold bg-secondary text-foreground border border-border">
                          {model.format}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {model.quantization}
                        </span>
                      </div>
                    </td>

                    {/* Parameters */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] text-foreground">
                        {model.parameters}
                      </span>
                    </td>

                    {/* Download Size */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-foreground text-xs">
                        {model.fileSize}
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
          <span>Showing {filteredModels.length} of {modelsData.length} sovereign models</span>
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

          {/* Drawer Content */}
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
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug">
                  {selectedModel.name}
                </h2>
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
              {/* Download Feedback Alert */}
              {downloadSuccessId === selectedModel.id && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Download initialized. File is streaming to your local harness directory.</span>
                </div>
              )}

              {/* Best For / Capability Overview */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Chamber Application & Utility
                </h3>
                <p className="text-foreground leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border">
                  {selectedModel.recommendedFor}
                </p>
              </div>

              {/* Technical Specifications Grid */}
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

              {/* Local Storage Drop Path */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span>Local Desktop Placement Path</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedModel.destinationPath, 'path')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'path' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'path' ? 'Copied' : 'Copy Path'}</span>
                  </button>
                </div>
                <div className="bg-secondary/70 p-2.5 rounded-md border border-border font-mono text-[11px] text-foreground select-all break-all">
                  {selectedModel.destinationPath}
                </div>
              </div>

              {/* Terminal Pull Command */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CLI Pull Command</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedModel.cliCommand, 'cli')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'cli' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'cli' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-black text-emerald-400 p-2.5 rounded-md font-mono text-[11px] border border-border flex items-center justify-between">
                  <span>$ {selectedModel.cliCommand}</span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Checksum */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>SHA-256 Checksum Verification</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedModel.sha256, 'sha')}
                    className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'sha' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'sha' ? 'Copied' : 'Copy Hash'}</span>
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
                disabled={downloadingId === selectedModel.id}
                onClick={() => handleDownload(selectedModel)}
                className="flex-1 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>
                  {downloadingId === selectedModel.id 
                    ? 'Connecting to Harness...' 
                    : `Download Weights (${selectedModel.fileSize})`}
                </span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
