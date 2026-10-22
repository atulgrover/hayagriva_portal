'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Check, 
  Copy, 
  Zap, 
  Bot, 
  Database, 
  Cpu, 
  Command, 
  Package, 
  CheckCircle2, 
  Lock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { HubItem } from '@/lib/db/schema';
import { getItemCategoryConfig, formatItemVersion } from './card-utils';

interface ItemCardProps {
  item: HubItem;
  onSelect?: (item: HubItem) => void;
  onClick?: () => void;
}

export function ItemCard({ item, onSelect, onClick }: ItemCardProps) {
  const [copied, setCopied] = useState(false);

  const categoryConfig = getItemCategoryConfig(item.itemType);
  const isPrivate = item.visibility === 'PRIVATE_CHAMBER';

  const getCategoryIcon = () => {
    switch (categoryConfig.iconName) {
      case 'Zap':
        return <Zap className="w-4 h-4 text-foreground" />;
      case 'Bot':
        return <Bot className="w-4 h-4 text-foreground" />;
      case 'Database':
        return <Database className="w-4 h-4 text-foreground" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-foreground" />;
      case 'Command':
        return <Command className="w-4 h-4 text-foreground" />;
      default:
        return <Package className="w-4 h-4 text-foreground" />;
    }
  };

  const handleCopyImport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const copyText = item.importId || item.id;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tags = Array.isArray(item.tags) ? item.tags : [];

  return (
    <div
      onClick={() => (onClick ? onClick() : onSelect?.(item))}
      className="group bg-card hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border border-border hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md relative overflow-hidden"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/80 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-xs">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                getCategoryIcon()
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-foreground group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-1">
                  {item.name}
                </h3>
                {item.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                <span>by <span className="text-foreground/90 font-medium">{item.authorName || 'MintplexLabs'}</span></span>
                <span>•</span>
                <span className="font-mono text-muted-foreground">{formatItemVersion((item.manifest as any)?.version)}</span>
              </div>
            </div>
          </div>

          {/* Visibility / Category Badge */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {isPrivate ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                <Lock className="w-2.5 h-2.5" /> Chamber Private
              </span>
            ) : (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${categoryConfig.colorClass}`}>
                {categoryConfig.label}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {item.description || 'No description provided for this sovereign resource.'}
        </p>

        {/* Domain & Subdomain Taxonomy Badge */}
        {(item.domain || item.subdomain) && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 truncate max-w-[220px]">
              {item.domain} › {item.subdomain}
            </span>
            {item.archetype && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border">
                {item.archetype}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag: any, idx: number) => (
              <span
                key={idx}
                className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-secondary/80 text-muted-foreground border border-border/50"
              >
                #{String(tag)}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-muted-foreground">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Strip */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-[11px] text-muted-foreground mt-auto">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3 text-muted-foreground/70" />
            <span className="font-medium">{item.downloads?.toLocaleString() || 0}</span>
          </span>
          <button
            onClick={handleCopyImport}
            className="hover:text-foreground flex items-center gap-1 transition-colors group/btn py-0.5"
            title="Copy Sovereign Import ID"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied ID</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-muted-foreground/70 group-hover/btn:text-foreground" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1 text-primary group-hover:translate-x-0.5 transition-transform text-xs font-medium">
          <span>Inspect</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
