// admin-panel/src/components/agents/ArchetypeCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Scale, 
  Receipt, 
  UserX, 
  Sparkles, 
  ArrowRight,
  Database,
  Bot
} from 'lucide-react';
import { CourtArchetype } from './archetypes';

const iconMap: Record<string, React.ElementType> = {
  ShieldAlert,
  Scale,
  ReceiptCheck: Receipt,
  UserX,
  Sparkles,
};

interface ArchetypeCardProps {
  archetype: CourtArchetype;
}

export function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  const IconComponent = iconMap[archetype.icon] || Bot;

  return (
    <div className="p-5 rounded-xl border border-border bg-card hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between space-y-4 group relative shadow-xs hover:shadow-md">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${archetype.badgeColor}`}>
            {archetype.badge}
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            {archetype.domain}
          </span>
        </div>

        {/* Title and Icon */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-foreground group-hover:text-slate-900 dark:group-hover:text-white transition-colors shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {archetype.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
              {archetype.description}
            </p>
          </div>
        </div>

        {/* Vault Pills */}
        <div className="pt-2 flex flex-wrap gap-1.5">
          {archetype.defaultVaults.map((v) => (
            <span key={v} className="text-[10px] font-mono bg-secondary/80 text-foreground px-1.5 py-0.5 rounded border border-border flex items-center gap-1">
              <Database className="w-2.5 h-2.5 text-muted-foreground" />
              {v.replace('.vault', '')}
            </span>
          ))}
          {archetype.subagentsEnabled && (
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
              +Subagent Critique
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[11px] font-mono text-muted-foreground">{archetype.slashTrigger}</span>
        <Link
          href={`/dashboard/agents/builder?archetype=${archetype.key}`}
          className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Use Template</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
