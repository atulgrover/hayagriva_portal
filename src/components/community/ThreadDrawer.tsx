'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Send, RotateCw, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommunityThreadItem } from './ThreadCard';
import { AiReplyCard } from './AiReplyCard';
import { TiptapEditor } from './TiptapEditor';

interface ReplyItem {
  id: string;
  thread_id: string;
  author_id: string;
  author_name: string;
  author_role: string;
  author_avatar?: string | null;
  body: string;
  is_ai_generated: boolean;
  ai_citations?: any;
  upvotes: number;
  created_at: string;
}

interface ThreadDrawerProps {
  thread: CommunityThreadItem | null;
  isOpen: boolean;
  onClose: () => void;
  onThreadUpdated?: () => void;
}

export function ThreadDrawer({ thread, isOpen, onClose, onThreadUpdated }: ThreadDrawerProps) {
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetryingAi, setIsRetryingAi] = useState(false);
  const [activeThread, setActiveThread] = useState<CommunityThreadItem | null>(thread);

  useEffect(() => {
    setActiveThread(thread);
    if (thread?.id) {
      fetchThreadDetails(thread.id);
    }
  }, [thread?.id]);

  const fetchThreadDetails = async (threadId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/community/threads/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setActiveThread(data.thread);
        setReplies(data.replies || []);
      }
    } catch (err) {
      console.error('Failed to load thread details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!activeThread?.id || !replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/community/threads/${activeThread.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyText }),
      });

      if (res.ok) {
        setReplyText('');
        fetchThreadDetails(activeThread.id);
        if (onThreadUpdated) onThreadUpdated();
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryAi = async () => {
    if (!activeThread?.id || isRetryingAi) return;
    setIsRetryingAi(true);
    try {
      const res = await fetch(`/api/community/threads/${activeThread.id}/ai-retry`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchThreadDetails(activeThread.id);
        if (onThreadUpdated) onThreadUpdated();
      }
    } catch (err) {
      console.error('Failed to retry AI:', err);
    } finally {
      setIsRetryingAi(false);
    }
  };

  if (!activeThread) return null;

  const aiReply = replies.find((r) => r.is_ai_generated);
  const humanReplies = replies.filter((r) => !r.is_ai_generated);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex flex-col h-full w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 overflow-hidden bg-background"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-border bg-card shrink-0 pr-12">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="gold" className="text-[10px] uppercase font-semibold">
              {activeThread.category.replace('-', ' ')}
            </Badge>
            {activeThread.is_pinned && (
              <Badge variant="secondary" className="text-[10px]">
                Pinned
              </Badge>
            )}
          </div>
          <SheetTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
            {activeThread.title}
          </SheetTitle>
          <SheetDescription className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Posted by <strong className="text-foreground">{activeThread.author_name}</strong></span>
            <span>•</span>
            <span>{new Date(activeThread.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </SheetDescription>
        </div>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 1. Original Inquiry / Post */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-2">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6 text-[10px]">
                  {activeThread.author_avatar ? (
                    <AvatarImage src={activeThread.author_avatar} />
                  ) : null}
                  <AvatarFallback>{activeThread.author_name[0] || 'A'}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground text-xs">{activeThread.author_name}</span>
                <Badge variant="outline" className="text-[9px] py-0 px-1.5 uppercase font-mono">
                  {activeThread.author_role}
                </Badge>
              </div>
              <span className="text-[10px] font-mono">OP</span>
            </div>

            <div
              className="prose dark:prose-invert prose-sm max-w-none text-xs text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: activeThread.body }}
            />
          </div>

          {/* 2. Pinned Sovereign AI Analysis */}
          {aiReply ? (
            <AiReplyCard
              body={aiReply.body}
              citations={aiReply.ai_citations}
              createdAt={aiReply.created_at}
            />
          ) : activeThread.ai_status === 'PENDING' ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex items-center gap-3 animate-pulse">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <p className="text-xs font-semibold text-amber-400">
                  Hayagriva Sovereign Bot is analyzing Bare Acts...
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Consulting Central India Azure legal knowledge graph.
                </p>
              </div>
            </div>
          ) : activeThread.ai_status === 'FAILED' ? (
            <div className="rounded-lg border border-border bg-secondary/30 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs text-muted-foreground">
                  AI analysis could not complete automatically.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryAi}
                disabled={isRetryingAi}
                className="text-xs h-7 gap-1"
              >
                <RotateCw className={isRetryingAi ? 'w-3 h-3 animate-spin' : 'w-3 h-3'} />
                {isRetryingAi ? 'Consulting...' : 'Ask AI Bot'}
              </Button>
            </div>
          ) : null}

          {/* 3. Community Human Replies Stream */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground px-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Community Discussion ({humanReplies.length})</span>
            </div>

            {humanReplies.length === 0 ? (
              <div className="rounded-md border border-dashed border-border/70 p-6 text-center text-xs text-muted-foreground">
                No replies from other advocates yet. Be the first to contribute insight!
              </div>
            ) : (
              humanReplies.map((reply) => (
                <div key={reply.id} className="rounded-lg border border-border bg-card p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5 text-[9px]">
                        <AvatarFallback>{reply.author_name[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-foreground text-xs">
                        {reply.author_name}
                      </span>
                      <Badge variant="outline" className="text-[9px] py-0 px-1 text-muted-foreground uppercase">
                        {reply.author_role}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(reply.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className="prose dark:prose-invert prose-sm max-w-none text-xs text-foreground/90 leading-relaxed pl-7"
                    dangerouslySetInnerHTML={{ __html: reply.body }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Drawer Footer: Reply Composer */}
        <div className="p-4 border-t border-border bg-card/95 backdrop-blur shrink-0 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <User className="w-3 h-3 text-primary" />
              <span>Post a Reply</span>
            </span>
            <span className="text-amber-400/90 text-[10px] font-mono">
              💡 Tip: Tag <code className="bg-amber-500/10 px-1 py-0.5 rounded text-amber-300">@ai</code> to ask the Sovereign Bot
            </span>
          </div>

          <TiptapEditor
            content={replyText}
            onChange={setReplyText}
            placeholder="Write your analysis, statutory question, or tag @ai for automated citations..."
            minHeight="100px"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              onClick={handleSendReply}
              disabled={isSubmitting || !replyText.trim()}
              size="sm"
              variant="gold"
              className="gap-1.5 px-4 text-xs font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
