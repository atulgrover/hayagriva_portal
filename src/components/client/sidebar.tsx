// admin-panel/src/components/client/sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CreditCard, 
  HelpCircle,
  Laptop,
  Database,
  Cpu,
  Bot,
  Sparkles,
  MessageSquare,
  LayoutDashboard,
  User,
  DownloadCloud
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Core Workspace',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Workspace', href: '/dashboard/workspace', icon: Laptop },
    ]
  },
  {
    title: 'Workspace & Studio',
    items: [
      { name: 'Discussions', href: '/dashboard/discussions', icon: MessageSquare, badge: 'Live' },
      { name: 'Studio', href: '/dashboard/studio', icon: Bot, badge: 'Studio' },
      { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    ]
  },
  {
    title: 'AI Assets',
    items: [
      { name: 'Harness', href: '/dashboard/harness', icon: DownloadCloud },
      { name: 'Vaults', href: '/dashboard/vaults', icon: Database },
      { name: 'Models', href: '/dashboard/models', icon: Cpu },
      { name: 'Agents', href: '/dashboard/agents', icon: Sparkles, badge: 'Registry' },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
    ]
  }
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen select-none sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="h-[71px] px-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center p-0.5 shadow-xs overflow-hidden">
            <img
              src="/branding/unicorn_emblem_white.png"
              alt="Hayagriva"
              className="w-full h-full object-contain filter drop-shadow-sm hidden dark:block"
            />
            <img
              src="/branding/unicorn_emblem.png"
              alt="Hayagriva"
              className="w-full h-full object-contain filter drop-shadow-sm block dark:hidden"
            />
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              <span>HAYAGRIVA</span>
              <span className="text-[9px] bg-secondary text-foreground font-mono px-1.5 py-0.2 rounded font-bold border border-border">
                PORTAL
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Practitioner Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
              {section.title}
            </div>
            {section.items.map((item) => {
              const itemBase = item.href.split('?')[0];
              const queryPart = item.href.includes('?') ? item.href.split('?')[1] : null;
              let isActive = false;
              if (queryPart && typeof window !== 'undefined') {
                isActive = pathname === itemBase && window.location.search.includes(queryPart);
              } else {
                isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && !item.href.includes('?') && pathname.startsWith(item.href)) ||
                  (item.href === '/dashboard/workspace' && (pathname === '/dashboard/licenses' || pathname === '/dashboard/profile')) ||
                  (item.href === '/dashboard/discussions' && pathname.startsWith('/dashboard/community')) ||
                  (item.href === '/dashboard/agents' && pathname.startsWith('/dashboard/community-agents'));
              }
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all group",
                    isActive
                      ? "bg-secondary text-foreground border border-border/60 font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                    <span className="whitespace-nowrap truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={cn(
                      "px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold border",
                      isActive 
                        ? "bg-background text-foreground border-border" 
                        : "bg-secondary text-muted-foreground border-border/60"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

    </aside>
  );
}
