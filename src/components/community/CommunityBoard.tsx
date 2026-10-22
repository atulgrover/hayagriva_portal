'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, Sparkles, Filter, RefreshCw, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThreadCard, CommunityThreadItem } from './ThreadCard';
import { ThreadDrawer } from './ThreadDrawer';
import { TiptapEditor } from './TiptapEditor';

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'insolvency-ibc', label: 'IBC & CIRP' },
  { id: 'commercial-pleading', label: 'Commercial Pleading' },
  { id: 'desktop-harness', label: 'Desktop Harness' },
  { id: 'bare-acts', label: 'Bare Acts & Statutes' },
  { id: 'general', label: 'General Legal' },
];

export function CommunityBoard() {
  const [threads, setThreads] = useState<CommunityThreadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<CommunityThreadItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // New Discussion Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('insolvency-ibc');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('IBC, Section 12');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchThreads = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }

      const res = await fetch(`/api/community/threads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setThreads(data.threads || []);
      }
    } catch (err) {
      console.error('Failed to load community threads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchThreads();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const handleOpenThread = (thread: CommunityThreadItem) => {
    setSelectedThread(thread);
    setIsDrawerOpen(true);
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setCreateError('Please provide both a title and description.');
      return;
    }
    setCreateError('');
    setIsCreating(true);

    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/community/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          body: newContent,
          category: newCategory,
          tags: tagsArray,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create discussion');
      }

      const data = await res.json();
      setIsModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewTags('');

      // Refresh and open the newly created thread in the drawer
      await fetchThreads();
      if (data.thread) {
        handleOpenThread(data.thread);
      }
    } catch (err: any) {
      setCreateError(err.message || 'Error creating discussion');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-card via-card to-amber-500/5 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-500" />
                Practitioner Community Board
              </span>
              <Badge variant="gold" className="text-[10px] uppercase font-semibold">
                Sovereign Fleet
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Exchange legal strategies, statutory precedents, and resolve queries instantly with the integrated{' '}
              <strong className="text-foreground">Azure LightRAG knowledge graph</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchThreads}
              className="text-xs gap-1 h-9"
              title="Refresh discussions"
            >
              <RefreshCw className={isLoading ? 'w-3.5 h-3.5 animate-spin' : 'w-3.5 h-3.5'} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="gold"
              size="sm"
              className="text-xs gap-1.5 h-9 font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Start Discussion</span>
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, sections, keywords..."
              className="w-full bg-secondary/50 border border-input rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Feed */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-36 rounded-lg border border-border bg-card p-4 animate-pulse space-y-3"
            >
              <div className="h-4 bg-secondary rounded w-1/4" />
              <div className="h-5 bg-secondary rounded w-3/4" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
          <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center mx-auto text-muted-foreground">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No discussions found</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? `No topics match "${searchQuery}". Try a different keyword.`
              : 'Be the first practitioner to start a discussion in this category.'}
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs gap-1 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Topic</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              isSelected={selectedThread?.id === thread.id && isDrawerOpen}
              onSelect={handleOpenThread}
            />
          ))}
        </div>
      )}

      {/* Slide-Over Conversation Drawer */}
      <ThreadDrawer
        thread={selectedThread}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onThreadUpdated={fetchThreads}
      />

      {/* Modal: Start New Discussion */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Start a Community Discussion
                </h3>
                <p className="text-xs text-muted-foreground">
                  The Azure LightRAG bot will automatically review and provide initial Bare Act analysis.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 text-xs rounded bg-destructive/10 border border-destructive/30 text-destructive font-medium">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateThread} className="space-y-4">
              {/* Category & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Legal Domain / Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="insolvency-ibc">Insolvency & Bankruptcy (IBC)</option>
                    <option value="commercial-pleading">Commercial Dispute Pleading</option>
                    <option value="desktop-harness">Desktop Harness Configuration</option>
                    <option value="bare-acts">Bare Acts & Statutory Vaults</option>
                    <option value="general">General Practitioner Exchange</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. Section 12, CIRP, NCLAT"
                    className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Discussion Topic / Query</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. CIRP limitation period exclusion under Section 12 during litigation"
                  className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none font-medium"
                  required
                />
              </div>

              {/* Tiptap Rich Content */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Details & Legal Context</label>
                <TiptapEditor
                  content={newContent}
                  onChange={setNewContent}
                  placeholder="Provide facts, relevant statutory sections, or specific questions for the sovereign AI bot and advocate community..."
                  minHeight="140px"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCreating}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={isCreating}
                  className="text-xs font-semibold gap-1.5 px-4"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isCreating ? 'Publishing Topic...' : 'Publish & Consult AI'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
