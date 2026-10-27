'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, Sparkles, Filter, RefreshCw, Scale, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThreadCard, CommunityThreadItem } from './ThreadCard';
import { ThreadDrawer } from './ThreadDrawer';
import { DailyLimitModal } from './DailyLimitModal';

const CATEGORIES = [
  { id: 'all', label: 'All Practice Topics' },
  { id: 'insolvency-ibc', label: 'IBC & CIRP' },
  { id: 'commercial-pleading', label: 'Commercial Pleading' },
  { id: 'bare-acts', label: 'Bare Acts & Precedents' },
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
  const [authorName, setAuthorName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Daily Limit Modal State
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);

  const fetchThreads = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'my-threads') {
        params.set('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }

      const res = await fetch(`/api/community/threads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        let loaded = data.threads || [];
        if (selectedCategory === 'my-threads') {
          try {
            const savedIds = JSON.parse(localStorage.getItem('rb_my_threads') || '[]');
            loaded = loaded.filter((t: CommunityThreadItem) => savedIds.includes(t.id));
          } catch {}
        }
        setThreads(loaded);
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
          turnstileToken: 'test-token',
        }),
      });

      if (res.status === 429) {
        setIsModalOpen(false);
        setIsLimitModalOpen(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit legal inquiry');
      }

      const data = await res.json();
      if (typeof data.remaining === 'number') {
        setRemainingQuota(data.remaining);
      }

      // Save to local 'My Inquiries'
      try {
        const savedIds = JSON.parse(localStorage.getItem('rb_my_threads') || '[]');
        if (data.thread?.id) {
          savedIds.push(data.thread.id);
          localStorage.setItem('rb_my_threads', JSON.stringify(savedIds));
        }
      } catch {}

      // Reset Form and Open newly created thread
      setNewTitle('');
      setNewContent('');
      setIsModalOpen(false);
      await fetchThreads();

      if (data.thread) {
        setSelectedThread(data.thread);
        setIsDrawerOpen(true);
      }
    } catch (err: any) {
      setCreateError(err.message || 'Failed to submit inquiry');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Hero */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white shadow-xl border border-sky-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-medium border border-sky-400/30">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Sovereign Legal Intelligence • 3 Free Daily Inquiries</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
              Insolvency & Commercial Law Forum
            </h1>
            <p className="text-xs sm:text-sm text-sky-200/80 leading-relaxed">
              Explore public tribunal precedents, analyze Section 29A disqualification criteria, and receive automated statutory Bare Act citations powered by our Azure knowledge graph.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold text-xs sm:text-sm h-10 px-4 shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Ask Statutory Question</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Category Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            onClick={() => setSelectedCategory('my-threads')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === 'my-threads'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
            }`}
          >
            My Inquiries
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search Bare Acts, Sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Main Grid: Discussion Thread Cards */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-zinc-500 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-sky-600" />
          <p>Loading statutory discussions...</p>
        </div>
      ) : threads.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 space-y-3">
          <Scale className="w-8 h-8 mx-auto text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            No inquiries found in this category
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Be the first practitioner to ask a question and trigger our Azure Sovereign AI knowledge graph analysis.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs mt-2"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Ask First Question</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Slide-over Thread Details Drawer */}
      <ThreadDrawer
        thread={selectedThread}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onReplyAdded={fetchThreads}
      />

      {/* Daily Quota Reached Modal */}
      <DailyLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
      />

      {/* New Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 text-zinc-900 dark:text-zinc-100 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold">Ask Sovereign Legal Matter</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Matter Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scope of Section 29A(c) Disqualification on Regularized NPAs"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Practice Area
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="insolvency-ibc">IBC & CIRP</option>
                    <option value="commercial-pleading">Commercial Pleading</option>
                    <option value="bare-acts">Bare Acts & Precedents</option>
                    <option value="general">General Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Section 29A, CIRP, NCLT"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Factual Context & Specific Legal Query
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail the corporate debtor circumstance, dates of default, relevant tribunal bench, and specific statutory relief sought..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-hidden focus:ring-1 focus:ring-sky-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>Azure LightRAG Asynchronous Synthesis:</span>
                </div>
                <p>
                  Upon submission, your query will enter our Azure queuing engine. Within ~30 seconds, an automated analysis citing relevant Bare Act sections and Supreme Court / NCLAT precedents will be attached.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs h-9 px-4 font-medium"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Submitting to Azure...</span>
                    </>
                  ) : (
                    <span>Submit Legal Inquiry</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
