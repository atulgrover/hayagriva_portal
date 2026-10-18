// admin-panel/src/app/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Sparkles, AlertCircle, ArrowRight, Lock, User, Mail, Building, Award, CheckCircle2, Moon, Sun, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function RegisterPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: 'Advocate / Litigator',
    firmName: '',
    barCouncilEnrollment: '',
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || formData.name.length < 2) {
      setError('Please provide your full professional name.');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please provide a valid work or chamber email.');
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Please accept the Terms of Service to proceed.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      // Automatically logged in via cookie, redirect to licenses dashboard with welcome state
      router.push('/dashboard/licenses?new_registration=true');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-500/20">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Main Card Modal Container (Matches Login Modal) */}
      <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl p-8 sm:p-10 space-y-6">
        {/* Header Branding (Inside the Modal, Centered & Big) */}
        <div className="text-center pt-1 pb-2">
          <div className="flex justify-center">
            <img
              src="/branding/hayagriva_logo_white.png"
              alt="Lord Hayagriva Sovereign Intelligence"
              className="h-24 sm:h-28 w-auto object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-200 hidden dark:block"
            />
            <img
              src="/branding/hayagriva_logo_transparent.png"
              alt="Lord Hayagriva Sovereign Intelligence"
              className="h-24 sm:h-28 w-auto object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-200 block dark:hidden"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2.5 text-destructive text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Adv. Amit Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            {/* Professional Role Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-muted-foreground" /> Professional Role *
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              >
                <option value="Advocate / Litigator">Advocate / Litigator</option>
                <option value="Insolvency Professional (IP / IRP / RP)">Insolvency Professional (IP / IRP / RP)</option>
                <option value="Law Firm Partner / Associate">Law Firm Partner / Associate</option>
                <option value="Chartered Accountant / Forensic Auditor">Chartered Accountant / Forensic Auditor</option>
                <option value="Corporate In-House Counsel">Corporate In-House Counsel</option>
              </select>
            </div>
          </div>

          {/* Work / Chamber Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Work / Chamber Email *
              </span>
              <span className="text-[10px] text-muted-foreground">Used for license delivery</span>
            </label>
            <input
              type="email"
              required
              placeholder="practitioner@lawchambers.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Confirm Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>
          </div>

          {/* Chamber / Law Firm Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-muted-foreground" /> Law Firm / Chamber Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Sharma & Associates Legal Chambers"
              value={formData.firmName}
              onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
              className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          {/* Bar Council / IBBI Enrollment */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-muted-foreground" /> Bar Council / IBBI Enrollment No. (Optional)
              </span>
              <span className="text-[10px] text-muted-foreground">For Verified Chamber Badge</span>
            </label>
            <input
              type="text"
              placeholder="D/1482/2018 or IBBI/IPA-001/..."
              value={formData.barCouncilEnrollment}
              onChange={(e) => setFormData({ ...formData, barCouncilEnrollment: e.target.value })}
              className="w-full bg-secondary/50 border border-input rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          {/* Terms and Privacy Checkbox */}
          <div className="pt-1 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
              className="mt-0.5 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="termsAccepted" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              I agree to the <span className="text-foreground underline">Terms of Service</span> and acknowledge the <span className="text-foreground underline">Privacy Architecture</span>.
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2.5 rounded-lg shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating Account & Provisioning License...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Sign In Here →
          </Link>
        </div>
      </div>
    </div>
  );
}
