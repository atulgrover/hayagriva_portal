// admin-panel/src/components/navigation/HeaderControls.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Bell, LogOut } from 'lucide-react';
import { safeParseJsonCookie, getCookieValue } from '@/lib/auth/cookies';

interface HeaderControlsProps {
  mode?: 'admin' | 'client';
}

interface CurrentUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  plan?: string;
  org?: string;
}

export function HeaderControls({ mode = 'admin' }: HeaderControlsProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState<CurrentUser | null>(null);

  React.useEffect(() => {
    setMounted(true);

    // 1. Instant zero-flicker parse from cookie
    try {
      const val = getCookieValue(document.cookie, 'hayagriva_user');
      if (val) {
        const parsed = safeParseJsonCookie<CurrentUser>(val);
        if (parsed?.name || parsed?.email) {
          setUser(parsed);
        }
      }
    } catch {
      // Safe fallback
    }

    // 2. Fetch fresh user profile from API
    fetch('/api/user/profile')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.user) {
          setUser(prev => ({ ...prev, ...data.user }));
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    document.cookie = 'hayagriva_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'hayagriva_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'hayagriva_license_key=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'hayagriva_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AG';
    const clean = name
      .replace(/^(Adv\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
      .replace(/\([^)]*\)/g, '')
      .trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return (parts[0]?.substring(0, 2) || 'AG').toUpperCase();
  };

  // Compute standardized display values
  const displayName = user?.name || (mode === 'admin' ? 'Atul Grover' : 'Practitioner');
  const displayEmail = user?.email || (mode === 'admin' ? 'atulgroverr@gmail.com' : 'practitioner@hayagriva.app');
  
  // Standardize badge to reflect Super Admin or Role
  const displayBadge = user?.role === 'SUPER_ADMIN' || mode === 'admin'
    ? 'SUPER_ADMIN'
    : (user?.plan || user?.role || 'ENTERPRISE');

  const initials = getInitials(displayName);

  // Profile link destination: Super Admin always routes to /admin/profile; client users route to /dashboard/profile
  const profileHref = user?.role === 'SUPER_ADMIN' || mode === 'admin'
    ? '/admin/profile'
    : '/dashboard/profile';

  return (
    <div className="flex items-center space-x-3">
      {/* Theme Switcher Button */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 dark:text-slate-200" />
          )}
        </button>
      )}

      {/* Notifications Bell */}
      <button
        className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground relative transition-colors"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 ring-2 ring-card" />
      </button>

      {/* Divider */}
      <div className="h-4 w-[1px] bg-border mx-1" />

      {/* Standardized Sovereign User Profile Pill */}
      <Link
        href={profileHref}
        className="flex items-center space-x-2.5 pl-1 py-1 pr-2 rounded-lg hover:bg-secondary/70 transition-colors group cursor-pointer"
        title="Manage Profile & Settings"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-amber-500/20 group-hover:ring-amber-500/40 transition-all shrink-0">
          {initials}
        </div>
        <div className="text-left hidden md:block">
          <div className="text-xs font-semibold text-foreground group-hover:text-amber-500 flex items-center gap-1.5 transition-colors">
            <span>{displayName}</span>
            <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded font-mono font-semibold uppercase tracking-wider">
              {displayBadge}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono">{displayEmail}</p>
        </div>
      </Link>

      {/* Sign Out Button */}
      <button
        onClick={handleLogout}
        className="p-2 ml-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        title="Sign Out"
        aria-label="Sign Out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
