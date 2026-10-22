'use client';

import React from 'react';
import { MessageSquare, Sparkles, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const CATEGORY_LABELS: Record<string, { label: string; variant: 'gold' | 'default' | 'secondary' | 'emerald' }> = {
  'insolvency-ibc': { label: 'IBC & CIRP', variant: 'gold' },
  'commercial-pleading': { label: 'Commercial Pleading', variant: 'default' },
  'desktop-harness': { label: 'Desktop Harness', variant: 'secondary' },
  'bare-acts': { label: 'Bare Acts & Statutes', variant: 'emerald' },
  'general': { label: 'General Legal', variant: 'secondary' },
};

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
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
    variant: 'secondary',
  };

  const preview = stripHtml(thread.body);
  const initials = (thread.author_name || 'Advocate')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card
      onClick={() => onSelect(thread)}
      className={cn(
        'group cursor-pointer p-4 transition-all duration-200 border-border/80 hover:border-amber-500/40 hover:bg-secondary/20 hover:shadow-md',
        isSelected && 'border-amber-500 bg-secondary/30 ring-1 ring-amber-500/50 shadow-sm'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Category and Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={categoryConfig.variant} className="text-[10px] px-2 py-0.2">
            {categoryConfig.label}
          </Badge>
          {thread.is_pinned && (
            <Badge variant="outline" className="text-[10px] bg-secondary/80 border-border text-foreground">
              📌 Pinned
            </Badge>
          )}
          {Array.isArray(thread.tags) &&
            thread.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded border border-border/50"
              >
                #{tag}
              </span>
            ))}
        </div>

        {/* Right: AI Status Pill */}
        {thread.has_ai_answer ? (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full shrink-0">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>AI Verified</span>
          </div>
        ) : thread.ai_status === 'PENDING' ? (
          <div className="flex items-center gap-1 text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0">
            <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
            <span>Consulting AI...</span>
          </div>
        ) : null}
      </div>

      {/* Title */}
      <h3 className="mt-2 text-sm font-semibold text-foreground group-hover:text-amber-400 transition-colors line-clamp-2">
        {thread.title}
      </h3>

      {/* Snippet */}
      {preview && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {preview}
        </p>
      )}

      {/* Footer: Author Info & Metrics */}
      <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="w-5 h-5 text-[10px]">
            {thread.author_avatar ? (
              <AvatarImage src={thread.author_avatar} alt={thread.author_name} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="truncate font-medium text-foreground text-[11px]">
            {thread.author_name}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            • {formatDate(thread.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{thread.reply_count}</span>
          </span>
        </div>
      </div>
    </Card>
  );
}
