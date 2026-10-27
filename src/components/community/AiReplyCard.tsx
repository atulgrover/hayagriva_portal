'use client';

import React, { useState } from 'react';
import { Copy, Check, Scale, Bookmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface LegalCitation {
  act: string;
  section?: string;
  title?: string;
}

interface AiReplyCardProps {
  body: string;
  citations?: LegalCitation[];
  createdAt: string;
}

export function AiReplyCard({ body, citations = [], createdAt }: AiReplyCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="relative overflow-hidden border border-sky-500/30 dark:border-sky-500/20 bg-sky-50/20 dark:bg-sky-950/10 shadow-sm">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 via-blue-600 to-amber-500" />

      <div className="p-4 sm:p-5">
        {/* Header: Medallion, Title, Status & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full border border-sky-400/40 bg-sky-900/10 dark:bg-sky-900/30 flex items-center justify-center font-bold text-xs text-sky-600 dark:text-sky-300">
                RB
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Resolution Bazaar Sovereign AI
                </span>
                <Badge variant="outline" className="text-[10px] py-0 px-2 flex items-center gap-1.5 font-medium border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Verified Analysis
                </Badge>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Azure Knowledge Graph • 64,116 Entity Statutory Engine
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            title="Copy Analysis"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                <span className="text-[11px] text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </Button>
        </div>

        {/* Legal Citations Bar */}
        {citations && citations.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1 mr-1">
              <Scale className="w-3 h-3 text-sky-600" />
              Statutory Citations:
            </span>
            {citations.map((cite, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] font-mono bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded shadow-xs"
              >
                <Bookmark className="w-2.5 h-2.5 text-sky-500" />
                {cite.section ? `§ ${cite.section}` : cite.title || cite.act}
              </span>
            ))}
          </div>
        )}

        {/* AI Answer Content */}
        <div className="mt-3.5 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
          {body}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-4 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[10px] text-zinc-400 flex items-center justify-between">
          <span>Derived from Sovereign Bare Acts & Tribunal Precedents</span>
          <span className="font-mono">Central India Azure Node</span>
        </div>
      </div>
    </Card>
  );
}
