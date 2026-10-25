'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Shield,
  Scale,
  Bot,
  MessageSquare,
  Lock,
  Mail,
  User,
  Building,
  Award,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  // Tab state: 'login' | 'register'
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: 'Advocate / Litigator',
    firmName: '',
    barCouncilEnrollment: '',
    termsAccepted: true,
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register' || tabParam === 'login') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanEmail = loginEmail.trim();
    if (!cleanEmail || !loginPassword) {
      setLoginError('Please enter your email and password.');
      return;
    }

    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || data.message || 'Invalid email or password.');
      }

      if (data.user?.role === 'SUPER_ADMIN' || data.user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please check your credentials.');
      setLoginLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!registerData.name || registerData.name.length < 2) {
      setRegisterError('Please provide your full professional name.');
      return;
    }
    if (!registerData.email || !registerData.email.includes('@')) {
      setRegisterError('Please provide a valid work or chamber email.');
      return;
    }
    if (!registerData.password || registerData.password.length < 8) {
      setRegisterError('Password must be at least 8 characters long.');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }
    if (!registerData.termsAccepted) {
      setRegisterError('Please accept the Terms of Service to proceed.');
      return;
    }

    setRegisterLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      // Automatically authenticated via cookie; redirect to dashboard
      router.push('/dashboard/workspace?new_registration=true');
    } catch (err: any) {
      setRegisterError(err.message || 'An error occurred during registration.');
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground">
      {/* ─────────────────────────────────────────────────────────────────────────────
          LEFT PANEL: Heroic Emblem & Sovereign Motto (58% desktop width)
         ───────────────────────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-7 hidden lg:flex flex-col items-center justify-center p-8 xl:p-14 bg-card border-r border-border relative overflow-hidden select-none">
        {/* Center: Large Multi-Armed Hayagriva Icon + Sacred Shloka */}
        <div className="flex flex-col items-center justify-center text-center px-4 py-8 relative z-10 space-y-6 max-w-xl">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 xl:w-80 xl:h-80 flex items-center justify-center">
            <img
              src="/branding/hayagriva_multi_arm_white.png"
              alt="Lord Hayagriva"
              className="w-full h-full object-contain filter drop-shadow-md hidden dark:block transition-transform hover:scale-[1.02] duration-300"
            />
            <img
              src="/branding/hayagriva_multi_arm.png"
              alt="Lord Hayagriva"
              className="w-full h-full object-contain filter drop-shadow-md block dark:hidden transition-transform hover:scale-[1.02] duration-300"
            />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <p className="font-serif text-base sm:text-lg xl:text-xl font-medium text-foreground tracking-wide leading-relaxed">
              ज्ञानानन्दमयं देवं निर्मलस्फटिकाकृतिम् ।<br />
              आधारं सर्वविद्यानां हयग्रीवमुपास्महे ॥
            </p>
            <p className="font-serif text-xs sm:text-sm font-normal text-muted-foreground italic leading-relaxed">
              &ldquo;We bow to Lord Hayagriva, whose form shines clear as pure crystal, the sacred source of all intellect, wisdom, and learning.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          RIGHT PANEL: Unified Tabbed Authentication Form (42% desktop width)
         ───────────────────────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-background relative min-h-screen">
        {/* Top Bar with Theme Toggle */}
        <div className="flex items-center justify-between w-full pb-4">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center p-0.5 shadow-xs overflow-hidden">
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
            <span className="font-bold text-sm tracking-tight text-foreground">
              HAYAGRIVA PORTAL
            </span>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Center Auth Card Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          {/* Unified Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-secondary/60 rounded-lg border border-border text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={cn(
                'py-2 rounded-md transition-all font-semibold text-center',
                activeTab === 'login'
                  ? 'bg-card text-foreground shadow-sm border border-border/40'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegisterError(null);
              }}
              className={cn(
                'py-2 rounded-md transition-all font-semibold text-center',
                activeTab === 'register'
                  ? 'bg-card text-foreground shadow-sm border border-border/40'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Register
            </button>
          </div>

          {/* ──────────────────────────────────
              TAB 1: SIGN IN FORM
             ────────────────────────────────── */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-150">
              {loginError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@chamber.in"
                    className="w-full bg-secondary/40 border border-input rounded-lg pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-secondary/40 border border-input rounded-lg pl-9 pr-10 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="p-1.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={loginLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-md shadow-xs gap-2 mt-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* ──────────────────────────────────
              TAB 2: REGISTER FORM
             ────────────────────────────────── */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in duration-150">
              {registerError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              {/* Full Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Full Name *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="Adv. Amit Sharma"
                      className="w-full bg-secondary/40 border border-input rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Professional Role *</label>
                  <select
                    value={registerData.designation}
                    onChange={(e) => setRegisterData({ ...registerData, designation: e.target.value })}
                    className="w-full bg-secondary/40 border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="Advocate / Litigator">Advocate / Litigator</option>
                    <option value="Insolvency Resolution Professional (IRP/RP)">Insolvency Professional (IRP/RP)</option>
                    <option value="Chamber Associate / Junior Counsel">Chamber Associate</option>
                    <option value="Corporate Legal Counsel">Corporate Legal Counsel</option>
                  </select>
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Chamber / Work Email *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="amit@sharmachambers.in"
                    className="w-full bg-secondary/40 border border-input rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Password (8+ chars) *</label>
                  <input
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-secondary/40 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-secondary/40 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={registerData.termsAccepted}
                  onChange={(e) => setRegisterData({ ...registerData, termsAccepted: e.target.checked })}
                  className="rounded border-input text-foreground focus:ring-primary w-3.5 h-3.5"
                />
                <label htmlFor="terms" className="text-[11px] text-muted-foreground leading-tight">
                  I agree to the Sovereign Chamber Terms & Air-Gap Data Integrity Agreement.
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={registerLoading}
                className="w-full text-xs font-semibold rounded-md shadow-xs gap-2 mt-2"
              >
                {registerLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Provisioning License...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Provision Sovereign License</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs text-muted-foreground">Loading sovereign portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
