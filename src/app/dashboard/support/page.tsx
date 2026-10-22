// admin-panel/src/app/dashboard/support/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle, Plus, RefreshCw, Clock, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { SupportTicket } from '@/lib/db/schema';
import { CreateTicketModal } from '@/components/client/create-ticket-modal';
import { cn } from '@/lib/utils';

export default function ClientSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/support');
      if (res.ok) {
        const json = await res.json();
        setTickets(json.tickets);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Support Tickets</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            File chamber inquiries, statutory requests, and track open resolution tickets.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="p-2 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Refresh tickets"
          >
            <RefreshCw className={cn("w-4 h-4", loading ? "animate-spin" : "")} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-md shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Support Ticket</span>
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {tickets.length > 0 ? (
          tickets.map((t) => {
            const priorityColor = {
              URGENT: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
              HIGH: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
              MEDIUM: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
              LOW: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700',
            }[t.priority] || 'bg-secondary text-foreground';

            const statusColor = {
              OPEN: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
              IN_PROGRESS: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
              RESOLVED: 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-800',
            }[t.status] || 'bg-secondary text-foreground';

            return (
              <div
                key={t.id}
                className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{t.id}</span>
                      <h3 className="text-sm font-bold text-foreground">{t.subject}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border font-mono", priorityColor)}>
                      {t.priority}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border font-mono inline-flex items-center gap-1.5", statusColor)}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        t.status === 'OPEN' ? "bg-emerald-500" : t.status === 'IN_PROGRESS' ? "bg-amber-500" : "bg-slate-400"
                      )} />
                      {t.status}
                    </span>
                  </div>
                </div>

                <div className="bg-secondary/40 p-3 rounded-lg text-xs text-foreground/90 border border-border/50 leading-relaxed">
                  {t.description}
                </div>

                {/* Official Operations / Engineering Response */}
                {t.adminResponse && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hayagriva Support Team Response
                      </span>
                      {t.respondedAt && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {new Date(t.respondedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{t.adminResponse}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1 text-muted-foreground font-mono">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    Filed: {t.createdAt ? new Date(t.createdAt).toLocaleString() : 'Recent'}
                  </span>
                  <span className="text-[11px]">
                    {t.status === 'RESOLVED' ? 'Status: Resolved & Dispatched' : 'Chamber Response Time: ~2 hrs'}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-xs text-muted-foreground space-y-2">
            <p>You have no active support tickets.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-md text-xs font-semibold"
            >
              Submit a Ticket
            </button>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(ticket) => setTickets((prev) => [ticket, ...prev])}
      />
    </div>
  );
}
