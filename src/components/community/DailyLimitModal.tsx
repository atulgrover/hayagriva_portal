'use client';

import React from 'react';
import { ShieldAlert, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DailyLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  resetAt?: string | Date;
}

export function DailyLimitModal({ isOpen, onClose, resetAt }: DailyLimitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 text-zinc-900 dark:text-zinc-100 animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">
              Daily Guest Limit Reached (3/3)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Free Sovereign AI Consultations
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          To maintain high-quality knowledge graph reasoning and protect our Azure computing clusters, anonymous guest inquiries are capped at <strong>3 free questions per day</strong>.
        </p>

        {/* Benefits Box */}
        <div className="mt-4 p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 text-xs text-sky-900 dark:text-sky-200 space-y-1.5">
          <div className="font-semibold text-xs flex items-center gap-1.5 text-sky-800 dark:text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Sign in to unlock:</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>Unlimited statutory Bare Act & CIRP inquiries</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>Direct Co-Counsel Chamber integration & dossier filing</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <Link href="/login" className="w-full sm:flex-1">
            <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 font-medium text-xs h-9">
              <span>Sign in to Chamber</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto text-xs h-9 text-zinc-600 dark:text-zinc-300"
          >
            Browse Answers
          </Button>
        </div>
      </div>
    </div>
  );
}
