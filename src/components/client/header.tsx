// admin-panel/src/components/client/header.tsx
'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { HeaderControls } from '@/components/navigation/HeaderControls';

export function ClientHeader() {
  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="flex items-center space-x-3 w-80 md:w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search licenses, agents, logs, invoices..."
            className="w-full bg-secondary/50 border border-input rounded-md pl-9 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-card border border-border text-muted-foreground px-1.5 py-0.5 rounded font-mono font-medium pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Standardized Right Controls */}
      <HeaderControls mode="client" />
    </header>
  );
}
