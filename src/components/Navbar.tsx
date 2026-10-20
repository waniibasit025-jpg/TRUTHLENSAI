import React from 'react';
import { Shield, Sparkles, MessageSquare, User, LogIn } from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'history' | 'claims' | 'profile';
  setActiveTab: (tab: 'analyzer' | 'history' | 'claims' | 'profile') => void;
  onOpenSecurity: () => void;
  onOpenMethodology: () => void;
  onOpenChat: () => void;
  onOpenAuth: () => void;
  user: { email: string; name: string } | null;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSecurity,
  onOpenMethodology,
  onOpenChat,
  onOpenAuth,
  user,
  isAuthenticated,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('analyzer');
            }}
            className="text-lg font-bold tracking-tight text-white hover:text-teal-300 transition-colors"
          >
            TruthLens <span className="text-teal-400">AI</span>
          </a>
        </div>

        {/* Zone 2: 4–5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setActiveTab('analyzer')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'analyzer' ? 'text-teal-400 font-semibold border-b-2 border-teal-400 pb-0.5' : ''
            }`}
          >
            News Analyzer
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('claims')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'claims' ? 'text-teal-400 font-semibold border-b-2 border-teal-400 pb-0.5' : ''
            }`}
          >
            Claim Inspector
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'history' ? 'text-teal-400 font-semibold border-b-2 border-teal-400 pb-0.5' : ''
            }`}
          >
            Audit History
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'profile' ? 'text-teal-400 font-semibold border-b-2 border-teal-400 pb-0.5' : ''
            }`}
          >
            Profile
          </button>

          <button
            type="button"
            onClick={onOpenChat}
            className="hover:text-teal-300 transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 text-teal-400 font-semibold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Chat</span>
          </button>

          <button
            type="button"
            onClick={onOpenMethodology}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Methodology
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenChat}
            className="md:hidden p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20"
            title="Open AI Fact-Check Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {isAuthenticated && user ? (
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-xs font-medium ${
                activeTab === 'profile'
                  ? 'bg-teal-500/15 border-teal-500 text-teal-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700/80'
              }`}
              title="Open User Profile & Credentials"
            >
              <User className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px] max-w-[140px] truncate text-slate-300">
                {user.email}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                Secured
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
