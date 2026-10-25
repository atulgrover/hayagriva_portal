'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Compass, 
  LayoutDashboard, 
  ShieldCheck, 
  Sun, 
  Moon, 
  LogOut, 
  RefreshCw, 
  PlusCircle, 
  Lock, 
  Sparkles,
  Building2,
  HardDrive,
  MessageSquare
} from 'lucide-react';

import { safeParseJsonCookie, getCookieValue } from '@/lib/auth/cookies';

interface UnifiedNavbarProps {
  onOpenPublish?: () => void;
  onTriggerSync?: () => void;
}

export function UnifiedNavbar({ onOpenPublish, onTriggerSync }: UnifiedNavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Parse user cookie
    const val = getCookieValue(document.cookie, 'hayagriva_user');
    if (val) {
      const parsed = safeParseJsonCookie(val);
      setUser(parsed);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'hayagriva_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'hayagriva_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'hayagriva_license_key=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <header className="h-[58px] border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Left: Brand & Main Navigation Tabs */}
      <div className="flex items-center space-x-6">
        <Link href="/hub" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center p-0.5 shadow-xs overflow-hidden group-hover:scale-105 transition-transform">
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
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold tracking-tight text-foreground flex items-center gap-1.5">
              HAYAGRIVA
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary text-foreground font-semibold border border-border uppercase tracking-wider">
                SOVEREIGN HUB
              </span>
            </span>
            <span className="text-[9px] text-muted-foreground tracking-tight">Legal AI Community & Chamber Fleet</span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Link
            href="/dashboard/agents?tab=bazaar"
            className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 ${
              (pathname.includes('/agents') || pathname.startsWith('/hub'))
                ? 'bg-secondary text-foreground shadow-xs font-semibold border border-border/60'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Garuda Agents</span>
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 ${
              pathname === '/dashboard'
                ? 'bg-secondary text-foreground shadow-xs font-semibold border border-border/60'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Workstations</span>
          </Link>

          <Link
            href="/dashboard/discussions"
            className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 ${
              pathname.startsWith('/dashboard/discussions') || pathname.startsWith('/dashboard/community')
                ? 'bg-secondary text-foreground shadow-xs font-semibold border border-border/60'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Community & AI</span>
          </Link>

          {isSuperAdmin && (
            <Link
              href="/admin/dashboard"
              className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/admin')
                  ? 'bg-secondary text-foreground shadow-xs font-semibold border border-border/60'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Chamber Badge */}
        {user ? (
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary/50 border border-border text-[11px]">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground max-w-[140px] truncate">
              {user.org || user.name}
            </span>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-secondary text-foreground font-bold border border-border uppercase tracking-wider">
              {user.plan || 'ENTERPRISE'}
            </span>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs text-foreground hover:underline font-semibold px-2 py-1 tracking-tight"
          >
            Sign In with License
          </Link>
        )}

        {/* Sync Trigger Button */}
        {onTriggerSync && (
          <button
            onClick={onTriggerSync}
            className="px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 border border-border rounded-md text-xs font-medium text-foreground transition-all flex items-center gap-1.5 shadow-xs"
            title="Synchronize Public & Private tools with AnythingLLM"
          >
            <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Sync Fleet</span>
          </button>
        )}

        {/* Publish Asset Button */}
        {onOpenPublish && (
          <button
            onClick={onOpenPublish}
            className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm shadow-primary/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        )}

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-foreground" />
            )}
          </button>
        )}

        {/* Logout */}
        {user && (
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
