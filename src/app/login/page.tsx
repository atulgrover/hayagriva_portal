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
  CheckCircle2,
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
          LEFT PANEL: Concept A - Sovereign Legal Capabilities (58% desktop width)
         ───────────────────────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-7 hidden lg:flex flex-col justify-between p-8 xl:p-14 bg-card border-r border-border relative overflow-hidden select-none">
        {/* Top Branding */}
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center font-black text-base shadow-xs">
              ॐ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  HAYAGRIVA
                </span>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 uppercase font-mono font-semibold">
                  Sovereign Fleet
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                Decentralized Legal AI Control Plane
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              Sovereign AI Built for Indian Legal Chambers & Insolvency Resolution.
            </h1>
            <p className="text-xs xl:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Air-gapped execution, local models, and domain-specialized legal intelligence. Keep confidential case notes in your chamber with zero cloud leakage.
            </p>
          </div>
        </div>

        {/* Middle: 4 Distinct Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-8 relative z-10">
          {/* Card 1: Air-Gap Privacy */}
          <div className="p-4 rounded-xl border border-border bg-background space-y-2 hover:border-slate-400 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase px-1.5 py-0.5 rounded border border-border bg-secondary/50">
                01
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Privacy
              </span>
            </div>
            <h2 className="text-xs font-bold text-foreground">Air-Gapped Sovereign Privacy</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Local LLMs run entirely inside your chamber. Client case files and debtor records never train public models or leave your local network.
            </p>
          </div>

          {/* Card 2: 64k-Node Knowledge Graph */}
          <div className="p-4 rounded-xl border border-border bg-background space-y-2 hover:border-slate-400 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase px-1.5 py-0.5 rounded border border-border bg-secondary/50">
                02
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Knowledge Graph
              </span>
            </div>
            <h2 className="text-xs font-bold text-foreground">64k-Node Statutory Graph</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Pre-indexed Bare Acts, IBC 2016 regulations, and precedent orders with automated statutory citation verification on Azure.
            </p>
          </div>

          {/* Card 3: Garuda Agent Cartridge Fleet */}
          <div className="p-4 rounded-xl border border-border bg-background space-y-2 hover:border-slate-400 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase px-1.5 py-0.5 rounded border border-border bg-secondary/50">
                03
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Agents
              </span>
            </div>
            <h2 className="text-xs font-bold text-foreground">Garuda Legal Agent Fleet</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Downloadable autonomous agents for Section 43/45/66 avoidance audits, CIRP claim adjudication, and commercial dispute drafting.
            </p>
          </div>

          {/* Card 4: Community & LightRAG Bot */}
          <div className="p-4 rounded-xl border border-border bg-background space-y-2 hover:border-slate-400 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase px-1.5 py-0.5 rounded border border-border bg-secondary/50">
                04
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Community
              </span>
            </div>
            <h2 className="text-xs font-bold text-foreground">Community & LightRAG Bot</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Collaborate directly with peer advocates and consult the sovereign legal knowledge graph right inside your portal dashboard.
            </p>
          </div>
        </div>

        {/* Bottom: Trust & Hardware-Bound Licensing Seal */}
        <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground relative z-10">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">
              Hardware-Bound Cryptographic Licensing
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <span className="px-1.5 py-0.5 rounded bg-secondary border border-border">macOS</span>
            <span className="px-1.5 py-0.5 rounded bg-secondary border border-border">Windows</span>
            <span className="px-1.5 py-0.5 rounded bg-secondary border border-border">Linux</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          RIGHT PANEL: Unified Tabbed Authentication Form (42% desktop width)
         ───────────────────────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-background relative">
        {/* Top Bar with Theme Toggle */}
        <div className="flex items-center justify-between w-full pb-4">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center font-black text-xs">
              ॐ
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
          {/* Header */}
          <div className="text-left space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {activeTab === 'login' ? 'Welcome back to Hayagriva' : 'Create Practitioner Account'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {activeTab === 'login'
                ? 'Sign in to access your chamber agents, licenses, and community board.'
                : 'Get instant access to the sovereign portal and auto-provision 1 free license.'}
            </p>
          </div>

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
              Register License
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

          {/* Bottom Security Note */}
          <div className="pt-4 border-t border-border/60 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Air-gapped deployment • Zero telemetry on case notes</span>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="text-center text-[10px] text-muted-foreground/60 pt-4">
          © {new Date().getFullYear()} Hayagriva Sovereign AI Suite. All rights reserved.
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
