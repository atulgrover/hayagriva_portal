'use client';

import React from 'react';
import { MessageSquare, Clock, Loader2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface CommunityThreadItem {
  id: string;
  title: string;
  body: string;
  author_id: string;
  author_name: string;
  author_role: string;
  author_avatar?: string | null;
  category: string;
  origin_domain?: string;
  tags?: string[] | null;
  is_pinned?: boolean;
  is_locked?: boolean;
  has_ai_answer?: boolean;
  ai_status?: string;
  reply_count: number;
  views_count: number;
  created_at: string;
  updated_at?: string;
}

interface ThreadCardProps {
  thread: CommunityThreadItem;
  isSelected?: boolean;
  onSelect: (thread: CommunityThreadItem) => void;
}

const CATEGORY_LABELS: Record<string, { label: string; badgeClass: string }> = {
  'insolvency-ibc': { label: 'IBC & CIRP', badgeClass: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20' },
  'commercial-pleading': { label: 'Commercial Pleading', badgeClass: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20' },
  'bare-acts': { label: 'Bare Acts & Precedents', badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' },
  'general': { label: 'General Legal', badgeClass: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20' },
};

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function formatDate(dateStr: string) {
  const normalized = typeof dateStr === "string" && !dateStr.endsWith("Z") && !dateStr.includes("+") ? dateStr + "Z" : dateStr;
  try {
    const d = new Date(normalized);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function ThreadCard({ thread, isSelected, onSelect }: ThreadCardProps) {
  const categoryConfig = CATEGORY_LABELS[thread.category] || {
    label: thread.category.replace('-', ' ').toUpperCase(),
    badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  };

  const preview = stripHtml(thread.body);
  const initials = (thread.author_name || 'Practitioner')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card
      onClick={() => onSelect(thread)}
      className={cn(
        'group cursor-pointer p-4 transition-all duration-200 border-zinc-200 dark:border-zinc-800 hover:border-sky-500/50 hover:bg-sky-50/20 dark:hover:bg-zinc-900/50 shadow-xs',
        isSelected && 'border-sky-600 ring-1 ring-sky-600 bg-sky-50/30 dark:bg-zinc-900/40 shadow-sm'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Category and Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn('text-[10px] px-2 py-0.5 rounded-md font-medium border', categoryConfig.badgeClass)}>
            {categoryConfig.label}
          </span>
          {thread.is_pinned && (
            <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
              📌 Pinned
            </span>
          )}
          {Array.isArray(thread.tags) &&
            thread.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 font-mono"
              >
                #{tag}
              </span>
            ))}
        </div>

        {/* Right: AI Status Pill */}
        {thread.has_ai_answer ? (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>AI Verified</span>
          </div>
        ) : thread.ai_status === 'QUEUED' || thread.ai_status === 'PENDING' ? (
          <div className="flex items-center gap-1.5 text-[11px] text-sky-700 dark:text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full shrink-0">
            <Loader2 className="w-3 h-3 animate-spin text-sky-500" />
            <span>Consulting AI...</span>
          </div>
        ) : null}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
        {thread.title}
      </h3>

      {/* Snippet */}
      {preview && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {preview}
        </p>
      )}

      {/* Footer: Author Info & Metrics */}
      <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
            {initials}
          </div>
          <span className="truncate font-medium text-zinc-800 dark:text-zinc-200 text-[11px]">
            {thread.author_name}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            • {formatDate(thread.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="flex items-center gap-1 text-zinc-500">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{thread.reply_count}</span>
          </span>
        </div>
      </div>
    </Card>
  );
}
