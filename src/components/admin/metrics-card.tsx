// admin-panel/src/components/admin/metrics-card.tsx
'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlightColor?: 'amber' | 'emerald' | 'blue' | 'purple';
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlightColor = 'amber'
}: MetricsCardProps) {
  const colorMap = {
    amber: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700',
    emerald: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700',
    blue: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700',
    purple: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700',
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm relative overflow-hidden transition-all hover:border-slate-400 dark:hover:border-slate-600">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        </div>
        <div className={cn("p-2.5 rounded-lg border", colorMap[highlightColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground text-[11px] truncate max-w-[180px]">{subtitle}</span>
        {trend && (
          <span className={cn(
            "flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded",
            trend.isPositive ? "text-emerald-500 bg-emerald-500/10" : "text-destructive bg-destructive/10"
          )}>
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
