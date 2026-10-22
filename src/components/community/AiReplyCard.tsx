'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Scale, Bookmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface LegalCitation {
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
    <Card className="relative overflow-hidden border border-slate-300 dark:border-slate-800 bg-card shadow-sm">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white" />

      <div className="p-4 sm:p-5">
        {/* Header: Medallion, Title, Status & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-8 h-8 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs font-serif">
                  ॐ
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground tracking-tight">
                  Hayagriva Sovereign Bot
                </span>
                <Badge variant="outline" className="text-[10px] py-0 px-2 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Verified Analysis
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Azure Knowledge Graph • 64k Entity Legal Engine
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            title="Copy Analysis"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                <span className="text-[11px] text-emerald-400">Copied</span>
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
          <div className="mt-3.5 pt-3 border-t border-border flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 mr-1">
              <Scale className="w-3 h-3" />
              Statutory Citations:
            </span>
            {citations.map((cite, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded"
              >
                <Bookmark className="w-2.5 h-2.5 text-slate-500" />
                {cite.section ? `§ ${cite.section}` : cite.title || cite.act}
              </span>
            ))}
          </div>
        )}

        {/* AI Answer Content */}
        <div className="mt-3.5 text-xs text-foreground/90 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
          {body}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-4 pt-2.5 border-t border-border/40 text-[10px] text-muted-foreground/70 flex items-center justify-between">
          <span>Derived from Sovereign Bare Acts & Case Precedents</span>
          <span className="font-mono">Central India Azure Node</span>
        </div>
      </div>
    </Card>
  );
}
