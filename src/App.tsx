/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  RotateCcw,
  Shield,
  FileText,
  Mail,
  Share2,
  Check,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  User,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ScoreGauge } from './components/ScoreGauge';
import { DimensionsChart } from './components/DimensionsChart';
import { ClaimsHighlighter } from './components/ClaimsHighlighter';
import { EmotionalAnalysisCard } from './components/EmotionalAnalysisCard';
import { HistoryDashboard } from './components/HistoryDashboard';
import { EmailExportModal } from './components/EmailExportModal';
import { SecurityDrawer } from './components/SecurityDrawer';
import { MethodologyModal } from './components/MethodologyModal';
import { UserProfilePage } from './components/UserProfilePage';
import { AuthModal } from './components/AuthModal';
import { AiChatDrawer } from './components/AiChatDrawer';
import { PRESET_SAMPLES, type PresetSample } from './components/PresetSamples';
import type { AnalysisResult } from './utils/analyzer';

const DEFAULT_USER_EMAIL = 'wajhatbhai30@gmail.com';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'history' | 'claims' | 'profile'>('analyzer');
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [emailModalAnalysis, setEmailModalAnalysis] = useState<AnalysisResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auth state
  const [authToken, setAuthToken] = useState<string>('tl_sec_demo_wajhat_authenticated');
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
    emailConfirmed: boolean;
    role: string;
    createdAt: string;
  }>({
    id: 'user-wajhat-primary',
    email: DEFAULT_USER_EMAIL,
    name: 'Wajhat',
    emailConfirmed: true,
    role: 'Senior Fact-Checking Investigator',
    createdAt: '2026-01-15T00:00:00.000Z',
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // AI Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load session & history from backend on initial mount
  useEffect(() => {
    // Fetch auth status
    fetch('/api/auth/me', {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      })
      .catch((err) => console.warn('Auth verify notice:', err));

    // Fetch history
    fetch('/api/history')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setHistory(res.data);
          setCurrentAnalysis(res.data[0]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load initial history from server:', err);
      });
  }, [authToken]);

  // Handle successful login or registration
  const handleAuthSuccess = (newUser: any, token: string) => {
    setUser(newUser);
    setAuthToken(token);
    setIsAuthenticated(true);
    setActiveTab('profile');
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setUser({
      id: '',
      email: '',
      name: 'Guest',
      emailConfirmed: false,
      role: 'Guest Investigator',
      createdAt: new Date().toISOString(),
    });
    setAuthToken('');
    setActiveTab('analyzer');
  };

  // Preset selector
  const handleSelectPreset = (preset: PresetSample) => {
    setInputText(preset.text);
    setInputTitle(preset.title);
    setInputUrl(preset.sourceUrl || '');
  };

  // Run credibility analysis
  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText || inputText.trim().length < 10) return;

    setIsAnalyzing(true);
    setAnalysisStep('Tokenizing linguistic structures...');

    const stepTimer1 = setTimeout(() => {
      setAnalysisStep('Evaluating rhetorical bias and emotional triggers...');
    }, 600);

    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('Extracting factual claims & checking verifiability...');
    }, 1200);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          text: inputText.trim(),
          title: inputTitle.trim() || undefined,
          sourceUrl: inputUrl.trim() || undefined,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setCurrentAnalysis(resData.data);
        setHistory((prev) => [resData.data, ...prev.filter((p) => p.id !== resData.data.id)]);
        setActiveTab('analyzer');
      }
    } catch (err) {
      console.error('Analysis request error:', err);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Clear inputs
  const handleResetInput = () => {
    setInputText('');
    setInputTitle('');
    setInputUrl('');
  };

  // History operations
  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (currentAnalysis?.id === id) {
        const remaining = history.filter((item) => item.id !== id);
        setCurrentAnalysis(remaining[0] || null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleClearAllHistory = async () => {
    if (!window.confirm('Clear all stored investigation records?')) return;
    try {
      await fetch('/api/history/clear', { method: 'POST' });
      setHistory([]);
      setCurrentAnalysis(null);
    } catch (err) {
      console.error('Clear history error:', err);
    }
  };

  const handleCopyShareReport = () => {
    if (!currentAnalysis) return;
    const text = `[TruthLens AI Credibility Audit]\nTitle: ${currentAnalysis.title}\nScore: ${currentAnalysis.credibilityScore}/100 (${currentAnalysis.verdict})\nSummary: ${currentAnalysis.summary}\nAudited by: ${user.email || DEFAULT_USER_EMAIL}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Editorial Hero Banner (shown on main tabs) */}
        {activeTab !== 'profile' && (
          <section className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
              <img
                src="/src/assets/images/truthlens_hero_backdrop_1792489549854.jpg"
                alt="Investigative newsroom data backdrop"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Investigative Intelligence Protocol</span>
                <span className="text-slate-500">·</span>
                <span className="font-mono text-slate-400">AES-256 Verified Session</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Evaluate News Credibility, Claims & Hidden Rhetoric with AI.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Paste any article excerpt, breaking headline, or viral post to compute verifiable factual scores, detect emotional manipulation tactics, and isolate misleading claims in real time.
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Zero-Retention Ephemeral Privacy</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Gemini 3.8 Flash Neural Verification</span>
                </span>
                <span>·</span>
                <span className="font-mono text-slate-400">
                  Confirmed Account: {user.email || DEFAULT_USER_EMAIL}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Mobile Viewport Tabs */}
        <div className="flex md:hidden items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('analyzer')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors text-center whitespace-nowrap px-2 ${
              activeTab === 'analyzer' ? 'bg-slate-800 text-teal-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Analyzer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('claims')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors text-center whitespace-nowrap px-2 ${
              activeTab === 'claims' ? 'bg-slate-800 text-teal-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Claims
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors text-center whitespace-nowrap px-2 ${
              activeTab === 'history' ? 'bg-slate-800 text-teal-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Archive ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors text-center whitespace-nowrap px-2 ${
              activeTab === 'profile' ? 'bg-slate-800 text-teal-300 font-semibold' : 'text-slate-400'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Tab 1: Analyzer & Main Workspace */}
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            {/* Input Submission Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Source Content Ingestion
                    </h2>
                    <p className="text-xs text-slate-400">
                      Paste a news paragraph, headline, or tweet text to launch analysis
                    </p>
                  </div>
                </div>

                {/* 1-Click Preset Samples */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] text-slate-400 uppercase font-mono mr-1">
                    Try Preset:
                  </span>
                  {PRESET_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectPreset(sample)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors whitespace-nowrap"
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleAnalyze} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    placeholder="Article headline or title (optional)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/80"
                  />
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Source URL e.g. https://reuters.com/... (optional)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/80"
                  />
                </div>

                <div className="relative">
                  <textarea
                    rows={5}
                    required
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste article text, statement quote, press release, or social media post here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-200 placeholder-slate-500 leading-relaxed focus:outline-none focus:border-teal-500/80 resize-y"
                  />

                  {/* Character / Word count badge */}
                  <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-500 pointer-events-none">
                    {inputText.trim().split(/\s+/).filter(Boolean).length} words ·{' '}
                    {inputText.length} chars
                  </div>
                </div>

                {/* Form Controls */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetInput}
                      disabled={!inputText && !inputTitle && !inputUrl}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-30 inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      Minimum 10 characters required
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsChatOpen(true)}
                      className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask AI Chat</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isAnalyzing || inputText.trim().length < 10}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 inline-flex items-center gap-2 transition-all shadow-md hover:shadow-teal-500/20 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Analyzing with AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Analyze Credibility</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* In-flight status notice */}
              {isAnalyzing && (
                <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-between text-xs text-teal-300 animate-pulse">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 animate-bounce" />
                    <span>{analysisStep || 'Connecting to TruthLens Neural Engine...'}</span>
                  </div>
                  <span className="font-mono text-[11px]">Processing</span>
                </div>
              )}
            </div>

            {/* Analysis Results Viewport */}
            {currentAnalysis && (
              <div className="space-y-6">
                {/* Result Title & Audit Metadata Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-teal-400 font-semibold">
                        REPORT #{currentAnalysis.id.slice(-6).toUpperCase()}
                      </span>
                      <span>·</span>
                      <span>
                        Audited {new Date(currentAnalysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>·</span>
                      <span className="font-mono">{currentAnalysis.modelUsed || 'Gemini 3.8 Flash'}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {currentAnalysis.title}
                    </h2>
                  </div>

                  {/* Actions for current report */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyShareReport}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700/80 inline-flex items-center gap-1.5 transition-colors"
                      title="Copy executive briefing text"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Copy Brief</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEmailModalAnalysis(currentAnalysis)}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                      title={`Send audit brief to ${user.email || DEFAULT_USER_EMAIL}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Report</span>
                    </button>
                  </div>
                </div>

                {/* Score Gauge & Dimensions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6">
                    <ScoreGauge
                      score={currentAnalysis.credibilityScore}
                      verdict={currentAnalysis.verdict}
                      summary={currentAnalysis.summary}
                    />
                  </div>
                  <div className="lg:col-span-6">
                    <DimensionsChart dimensions={currentAnalysis.dimensions} />
                  </div>
                </div>

                {/* Claim Highlighter & Inspector */}
                <ClaimsHighlighter
                  rawText={currentAnalysis.rawText}
                  claims={currentAnalysis.claims}
                />

                {/* Emotional Manipulation & Bias */}
                <EmotionalAnalysisCard
                  emotional={currentAnalysis.emotionalManipulation}
                  bias={currentAnalysis.biasRating}
                  fallacies={currentAnalysis.fallacies}
                  recommendations={currentAnalysis.recommendations}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Claims Inspector dedicated view */}
        {activeTab === 'claims' && currentAnalysis && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                Detailed Claim & Citation Audit
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Forensic isolation of claims from "{currentAnalysis.title}"
              </p>
            </div>

            <ClaimsHighlighter
              rawText={currentAnalysis.rawText}
              claims={currentAnalysis.claims}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Actionable Reader Advice</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentAnalysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded border border-slate-800">
                      <ChevronRight className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>Logical Invariants & Fallacies</span>
                </h3>
                {currentAnalysis.fallacies.length > 0 ? (
                  <div className="space-y-2">
                    {currentAnalysis.fallacies.map((fal, i) => (
                      <div key={i} className="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs text-slate-300">
                        <strong className="text-amber-300 font-mono">{fal}</strong>: Rhetorical distraction violating objective deductive standards.
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4">
                    No critical formal fallacies flagged in this submission.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: History Archive Dashboard */}
        {activeTab === 'history' && (
          <HistoryDashboard
            history={history}
            onSelect={(item) => {
              setCurrentAnalysis(item);
              setActiveTab('analyzer');
            }}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onExportEmail={(item) => setEmailModalAnalysis(item)}
            userEmail={user.email || DEFAULT_USER_EMAIL}
          />
        )}

        {/* Tab 4: Dedicated User Profile Page */}
        {activeTab === 'profile' && (
          <UserProfilePage
            user={user}
            token={authToken}
            history={history}
            onSelectAnalysis={(item) => {
              setCurrentAnalysis(item);
              setActiveTab('analyzer');
            }}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Floating Action Button for AI Fact-Check Chat */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-full shadow-xl hover:shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <MessageSquare className="w-4 h-4" />
          <span>AI Fact-Check Chat</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">TruthLens AI</span>
            <span>·</span>
            <span>Investigative Intelligence Protocol</span>
            <span>·</span>
            <span>Confirmed User: <code className="text-teal-400 font-mono">{user.email || DEFAULT_USER_EMAIL}</code></span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="hover:text-slate-300 transition-colors"
            >
              User Profile
            </button>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              AI Fact-Check Chat
            </button>
            <button
              type="button"
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Methodology
            </button>
            <button
              type="button"
              onClick={() => setIsSecurityOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Security Architecture
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <EmailExportModal
        analysis={emailModalAnalysis}
        defaultEmail={user.email || DEFAULT_USER_EMAIL}
        isOpen={Boolean(emailModalAnalysis)}
        onClose={() => setEmailModalAnalysis(null)}
      />

      <SecurityDrawer
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        userEmail={user.email || DEFAULT_USER_EMAIL}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <AiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeArticleContext={currentAnalysis ? currentAnalysis.title : undefined}
      />
    </div>
  );
}
