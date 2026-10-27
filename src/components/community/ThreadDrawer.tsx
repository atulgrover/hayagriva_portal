'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, MessageSquare, Loader2, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiReplyCard, LegalCitation } from './AiReplyCard';
import { CommunityThreadItem } from './ThreadCard';

interface CommunityReplyItem {
  id: string;
  thread_id: string;
  author_id: string;
  author_name: string;
  author_role: string;
  author_avatar?: string | null;
  body: string;
  is_ai_generated: boolean;
  ai_citations?: LegalCitation[] | null;
  upvotes: number;
  created_at: string;
}


function formatIndianTime(dateStr: string) {
  try {
    const normalized = typeof dateStr === "string" && !dateStr.endsWith("Z") && !dateStr.includes("+") ? dateStr + "Z" : dateStr;
    return new Date(normalized).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

interface ThreadDrawerProps {
  thread: CommunityThreadItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReplyAdded?: () => void;
}

export function ThreadDrawer({ thread, isOpen, onClose, onReplyAdded }: ThreadDrawerProps) {
  const [replies, setReplies] = useState<CommunityReplyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchReplies = async () => {
    if (!thread) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/community/threads/${thread.id}`);
      if (res.ok) {
        const data = await res.json();
        setReplies(data.replies || []);
      }
    } catch (err) {
      console.error('Failed to load thread details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && thread) {
      fetchReplies();
      // Poll every 8s if AI is processing
      if (!thread.has_ai_answer) {
        const interval = setInterval(fetchReplies, 8000);
        return () => clearInterval(interval);
      }
    }
  }, [isOpen, thread?.id, thread?.has_ai_answer]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !replyText.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/community/threads/${thread.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: replyText.trim(),
          authorName: authorName.trim() || 'Practitioner',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit reply');
      }

      setReplyText('');
      await fetchReplies();
      if (onReplyAdded) onReplyAdded();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !thread) return null;

  const aiReply = replies.find((r) => r.is_ai_generated);
  const humanReplies = replies.filter((r) => !r.is_ai_generated);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {thread.category.toUpperCase()}
              </span>
              <h2 className="mt-1 text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                {thread.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Original Question Card */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800 font-medium text-zinc-500 text-[11px]">
                <span>Asked by {thread.author_name}</span>
                <span>•</span>
                <span>{new Date(thread.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              {thread.body}
            </div>

            {/* AI Verified Answer Card */}
            {aiReply ? (
              <AiReplyCard
                body={aiReply.body}
                citations={aiReply.ai_citations || []}
                createdAt={aiReply.created_at}
              />
            ) : thread.ai_status === 'QUEUED' || thread.ai_status === 'PENDING' ? (
              <div className="p-4 rounded-xl bg-sky-50/40 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 text-center space-y-2">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-sky-600" />
                <p className="text-xs font-semibold text-sky-900 dark:text-sky-200">
                  Azure Knowledge Graph is synthesizing analysis...
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Checking statutory Bare Acts, CIRP Regulations, and NCLT tribunal precedents.
                </p>
              </div>
            ) : null}

            {/* Human Practitioner Discussion Section */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>Practitioner Perspectives ({humanReplies.length})</span>
              </h3>

              {isLoading && replies.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1" />
                  Loading replies...
                </div>
              ) : humanReplies.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-400 italic">
                  No community comments yet. Share your statutory perspective below.
                </div>
              ) : (
                <div className="space-y-3">
                  {humanReplies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3.5 rounded-lg bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {reply.author_name}
                        </span>
                        <span className="font-mono text-[10px]">
                          {formatIndianTime(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {reply.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reply Input Footer */}
          <form onSubmit={handleSubmitReply} className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 space-y-2">
            {error && <p className="text-xs text-rose-500">{error}</p>}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-1/3 px-3 py-1.5 rounded-lg text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-[11px] text-zinc-400 italic truncate">
                Tip: Include <strong className="text-sky-600">@ai</strong> to trigger an AI follow-up
              </span>
            </div>
            <div className="flex gap-2">
              <textarea
                rows={2}
                placeholder="Share legal precedent or query the AI with @ai..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 p-2 rounded-lg text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500 resize-none"
              />
              <Button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs px-3 self-end h-9"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
