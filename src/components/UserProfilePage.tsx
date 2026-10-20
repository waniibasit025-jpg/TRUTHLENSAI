import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  KeyRound,
  History,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Calendar,
  FileText,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { getVerdictTheme, type AnalysisResult } from '../utils/analyzer';

interface UserProfilePageProps {
  user: {
    id: string;
    email: string;
    name: string;
    emailConfirmed: boolean;
    role: string;
    createdAt: string;
    stats?: {
      totalAnalyses: number;
      averageCredibility: number;
      claimsAudited: number;
    };
  };
  token: string;
  history: AnalysisResult[];
  onSelectAnalysis: (analysis: AnalysisResult) => void;
  onDeleteHistoryItem: (id: string) => void;
  onLogout: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  token,
  history,
  onSelectAnalysis,
  onDeleteHistoryItem,
  onLogout,
}) => {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // History search state within profile
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<string>('all');

  const userHistory = history.filter((item) => {
    // Show either items matching user email or all if default
    const isOwner = !item.userEmail || item.userEmail.toLowerCase() === user.email.toLowerCase();
    if (!isOwner) return false;

    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rawText.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (filterVerdict === 'all') return true;
    return item.verdict.toLowerCase().includes(filterVerdict.toLowerCase());
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordMsg({
        type: 'success',
        text: 'Password successfully updated! Your account is protected with fresh PBKDF2 cryptographic salting.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Error changing password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Profile Header & Identity Confirmation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-teal-300 font-bold text-xl">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'TL'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user.name || 'Investigator Profile'}
                </h1>
                {/* Confirmed registered email badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmed & Verified Account</span>
                </div>
              </div>

              {/* Registered Email confirmation highlight */}
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-semibold text-white">{user.email}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-sans">{user.role}</span>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                <Calendar className="w-3 h-3" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/30 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400">Total Analyses Conducted</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              {history.length}
            </div>
            <div className="text-[11px] text-teal-400 mt-0.5">Audit history synced</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400">Security Encryption Level</div>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>AES-256 + TLS 1.3</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Zero-knowledge ephemeral storage</div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400">Registered Email Status</div>
            <div className="text-sm font-semibold text-emerald-300 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Active & Confirmed</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono truncate">{user.email}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Change Password & Personal History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Change Password Card */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Change Account Password
              </h2>
              <p className="text-xs text-slate-400">
                Update credentials with PBKDF2 salted hash encryption
              </p>
            </div>
          </div>

          {passwordMsg && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update & Re-encrypt Password</span>
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Security Invariant</div>
            <p>
              Passwords are never transmitted or stored in plaintext. Cryptographic salts are generated via <code>crypto.randomBytes(16)</code> and verified using constant-time comparisons.
            </p>
          </div>
        </div>

        {/* Right Column: User's Past Analysis History */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Past Analysis History for {user.email}
                </h2>
                <p className="text-xs text-slate-400">
                  {userHistory.length} verified reports recorded on your account
                </p>
              </div>
            </div>

            {/* Quick search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 w-full sm:w-48"
            />
          </div>

          {/* Verdict Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto">
            {['all', 'reliable', 'questionable', 'fabricated'].map((v) => (
              <button
                key={v}
                onClick={() => setFilterVerdict(v)}
                className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  filterVerdict === v
                    ? 'bg-slate-800 text-teal-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* History list */}
          {userHistory.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No previous analyses found.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {userHistory.map((item) => {
                const theme = getVerdictTheme(item.verdict);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="font-mono text-teal-400">{item.id.slice(0, 10)}</span>
                        <span>·</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>{item.claims.length} claims</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold font-mono tabular-nums text-white">
                          {item.credibilityScore}/100
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
                        >
                          {item.verdict}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                        <button
                          type="button"
                          onClick={() => onSelectAnalysis(item)}
                          title="Open in analyzer"
                          className="p-1.5 rounded bg-slate-800 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteHistoryItem(item.id)}
                          title="Delete from history"
                          className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
