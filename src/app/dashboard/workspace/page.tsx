// admin-panel/src/app/dashboard/workspace/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  User, 
  KeyRound, 
  Laptop, 
  Save, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Lock, 
  RefreshCw, 
  PowerOff, 
  ArrowRightLeft, 
  DownloadCloud, 
  Cpu, 
  HardDrive,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { License, Activation } from '@/lib/db/schema';
import { DeactivateModal } from '@/components/client/deactivate-modal';
import { TransferSeatModal } from '@/components/client/transfer-seat-modal';
import { cn } from '@/lib/utils';

interface BinaryRelease {
  id: string;
  os: string;
  arch: string;
  label: string;
  version: string;
  fileSize: string;
  fileName: string;
  sha256: string;
  recommended?: boolean;
}

const releases: BinaryRelease[] = [
  {
    id: 'mac-arm',
    os: 'macOS',
    arch: 'Apple Silicon (M1/M2/M3/M4)',
    label: 'macOS ARM64 DMG',
    version: '1.2.0',
    fileSize: '142 MB',
    fileName: 'Hayagriva-1.2.0-arm64.dmg',
    sha256: '9f2a4b88e10c73d4e8b31a529f0e4c1973b88e210a47bc3921ea029471b63ef1',
    recommended: true,
  },
  {
    id: 'mac-x64',
    os: 'macOS',
    arch: 'Intel Core x64',
    label: 'macOS x64 DMG',
    version: '1.2.0',
    fileSize: '148 MB',
    fileName: 'Hayagriva-1.2.0-x64.dmg',
    sha256: 'a14b7e8902c3ef41890e713840b2f5619ca4210e7b89d412ef88019a31bc2014',
  },
  {
    id: 'win-x64',
    os: 'Windows',
    arch: 'Windows 10 / 11 64-bit',
    label: 'Windows x64 Installer',
    version: '1.2.0',
    fileSize: '156 MB',
    fileName: 'Hayagriva-Setup-1.2.0.exe',
    sha256: '3c8e91024b12389d40a18e2098bc1410ef78921a41b2039ec149810ea47bc910',
  },
  {
    id: 'linux-x64',
    os: 'Linux',
    arch: 'Ubuntu / Debian / RHEL AppImage',
    label: 'Linux x64 AppImage',
    version: '1.2.0',
    fileSize: '139 MB',
    fileName: 'Hayagriva-1.2.0.AppImage',
    sha256: '7b8192a01948bc10398ea71490b213840e7912bc4019ea81029348bc19e41029',
  },
];

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const isNew = searchParams?.get('new') === 'true';

  // Profile State
  const [profileUser, setProfileUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // License & Hardware State
  const [license, setLicense] = useState<License | null>(null);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [maxDevices, setMaxDevices] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Modal State
  const [selectedDevice, setSelectedDevice] = useState<Activation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferTargetDevice, setTransferTargetDevice] = useState<Activation | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, licRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/licenses')
      ]);

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfileUser(pData.user);
        setName(pData.user.name || '');
        setOrg(pData.user.org || '');
      }

      if (licRes.ok) {
        const lData = await licRes.json();
        setLicense(lData.license);
        setActivations(lData.activations || []);
        setActiveCount(lData.activeDevicesCount || 0);
        setMaxDevices(lData.maxDevices || 1);
      }
    } catch (err) {
      console.error('Failed to load workspace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, org }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCopyKey = () => {
    if (license?.licenseKey) {
      navigator.clipboard.writeText(license.licenseKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleDeactivate = async (activationId: string) => {
    const res = await fetch('/api/user/licenses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activationId }),
    });

    if (res.ok) {
      setFeedbackMessage({ type: 'success', text: 'Hardware device deactivated. Chamber seat is now available.' });
      setTimeout(() => setFeedbackMessage(null), 4000);
      fetchData();
    }
  };

  const handleConfirmTransfer = async (data: { deviceName: string; hardwareFingerprint?: string; osInfo?: string }) => {
    const res = await fetch('/api/user/licenses/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        licenseKey: license?.licenseKey,
        ...data,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Seat transfer failed');
    }

    setFeedbackMessage({
      type: 'success',
      text: `Seat transferred to ${json.activation?.deviceName || data.deviceName}!`,
    });
    setTimeout(() => setFeedbackMessage(null), 4000);
    fetchData();
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-secondary text-foreground border border-border">
              USER WORKSPACE
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Unified Hub
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Profile, License &amp; Hardware
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your legal chambers identity, software license entitlements, and active desktop workstations in one place.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md border border-border flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading ? "animate-spin" : "")} />
          <span>Refresh</span>
        </button>
      </div>

      {feedbackMessage && (
        <div className={cn(
          "p-3 rounded-lg text-xs flex items-center gap-2 border",
          feedbackMessage.type === 'success'
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
            : "bg-destructive/10 border-destructive/20 text-destructive"
        )}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Grid: 2 Columns on desktop (Profile on left, License on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Firm & Practitioner Profile */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span>Chamber &amp; Practitioner Profile</span>
            </h2>
            {saveSuccess && (
              <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            {/* Immutable Email */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <span>Registered Email</span>
                <span className="text-[9px] bg-secondary text-muted-foreground border border-border px-1 rounded flex items-center gap-0.5 font-mono">
                  <Lock className="w-2.5 h-2.5" /> IMMUTABLE
                </span>
              </label>
              <input
                type="email"
                disabled
                value={profileUser?.email || 'advocate@chambers.in'}
                className="w-full bg-secondary/80 border border-input rounded-md px-3 py-1.5 text-muted-foreground font-mono cursor-not-allowed select-none opacity-80"
              />
            </div>

            {/* Practitioner Full Name */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Practitioner Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Senior Advocate / Legal Counsel"
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Legal Chambers / Organization */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Legal Chambers / Organization</label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="e.g. Rao &amp; Partners Insolvency Advocates"
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-3.5 py-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-sm flex items-center gap-1.5 disabled:opacity-50 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProfile ? 'Saving...' : 'Update Details'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Active License Entitlement */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-muted-foreground" />
                <span>Active License &amp; Entitlements</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-secondary text-foreground border border-border">
                {license?.planTier || 'ENTERPRISE'}
              </span>
            </div>

            <div className="mt-3.5 space-y-3.5 text-xs">
              {/* Masked License Key */}
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Chamber License Key</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary/80 border border-input rounded-md px-3 py-1.5 font-mono text-foreground tracking-wider select-all truncate">
                    {license?.licenseKey 
                      ? (showKey ? license.licenseKey : `${license.licenseKey.slice(0, 9)}••••-••••-••••`)
                      : 'HAYA-ENT-8F92-K4X9-98QA'}
                  </div>
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-2 rounded-md bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground transition-colors"
                    title={showKey ? 'Hide License Key' : 'Reveal License Key'}
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleCopyKey}
                    className="p-2 rounded-md bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-colors"
                    title="Copy License Key"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Seat Capacity Gauge */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Workstation Seats Allocated</span>
                  <span className="font-bold text-foreground font-mono">
                    {activeCount} of {maxDevices} Seats Active
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div 
                    className="h-full bg-foreground transition-all rounded-full"
                    style={{ width: `${Math.min(100, (activeCount / (maxDevices || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Expiry info */}
              <div className="p-2.5 rounded-lg bg-secondary/40 border border-border text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Valid through: <strong className="text-foreground">Dec 31, 2026</strong></span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Air-gapped Offline Active
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-muted-foreground">
            Need more seats for chamber associates? Contact administrator or support.
          </div>
        </div>
      </div>

      {/* Section 3: Registered Hardware & Devices Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden space-y-0">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <span>Registered Workstations &amp; Hardware</span>
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Workstations bound to this chamber license. Deactivate or transfer seats when switching advocate laptops.
            </p>
          </div>

          <button
            onClick={() => {
              setTransferTargetDevice(null);
              setIsTransferModalOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-md flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>Transfer Active Seat</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-4">Hardware Device</th>
                <th className="py-2.5 px-3">Operating System</th>
                <th className="py-2.5 px-3 font-mono">Chamber IP</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground text-xs">
                    No active workstations registered yet. Download the desktop harness below to bind this seat.
                  </td>
                </tr>
              ) : (
                activations.map((device) => (
                  <tr key={device.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <Laptop className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{device.deviceName}</span>
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {device.hardwareFingerprint || 'fp_m3p_9981a_b2c4'}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {device.osInfo || 'macOS 15 (Apple Silicon)'}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                      {device.ipAddress || '192.168.1.45 (Local)'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={cn(
                        "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1",
                        device.isActive
                          ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                          : "bg-secondary text-muted-foreground border border-border"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", device.isActive ? "bg-emerald-500" : "bg-muted-foreground")} />
                        {device.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {device.isActive && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedDevice(device);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                            title="Deactivate device seat"
                          >
                            <PowerOff className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Desktop Harness Download Links */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <DownloadCloud className="w-4 h-4 text-muted-foreground" />
            <span>Install Garuda Desktop Harness</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download the native sovereign application for your advocate laptops. Fully offline with zero cloud telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {releases.map((rel) => (
            <div
              key={rel.id}
              className={cn(
                "p-4 rounded-xl border bg-card flex flex-col justify-between space-y-3 transition-all",
                rel.recommended
                  ? "border-slate-400 dark:border-slate-600 shadow-xs"
                  : "border-border hover:border-slate-400 dark:hover:border-slate-600"
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{rel.os}</span>
                  {rel.recommended && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-secondary text-foreground border border-border">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{rel.arch}</div>
                <div className="font-mono text-[10px] text-muted-foreground mt-2">{rel.fileName} ({rel.fileSize})</div>
              </div>

              <button
                onClick={() => alert(`Starting download for ${rel.fileName}`)}
                className={cn(
                  "w-full py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
                  rel.recommended
                    ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-xs"
                    : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                )}
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Download Installer</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <DeactivateModal
        isOpen={isModalOpen}
        device={selectedDevice}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDevice(null);
        }}
        onConfirm={handleDeactivate}
      />

      <TransferSeatModal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setTransferTargetDevice(null);
        }}
        targetDevice={transferTargetDevice}
        onConfirmTransfer={handleConfirmTransfer}
        currentActiveDevice={activations.find((a) => a.isActive)}
      />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading workspace...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
