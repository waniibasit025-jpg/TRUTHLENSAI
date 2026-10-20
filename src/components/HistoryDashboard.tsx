import React, { useState } from 'react';
import {
  History,
  Trash2,
  Mail,
  Search,
  ExternalLink,
  Calendar,
  Eye,
  FileDown,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { getVerdictTheme, type AnalysisResult } from '../utils/analyzer';

interface HistoryDashboardProps {
  history: AnalysisResult[];
  onSelect: (item: AnalysisResult) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onExportEmail: (item: AnalysisResult) => void;
  userEmail: string;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
  onExportEmail,
  userEmail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<string>('all');

  const filteredHistory = history.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rawText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (filterVerdict === 'all') return true;
    return item.verdict.toLowerCase().includes(filterVerdict.toLowerCase());
  });

  const exportAllAsJson = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truthlens-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getVerdictIcon = (verdict: AnalysisResult['verdict']) => {
    if (verdict === 'Reliable' || verdict === 'Mostly Credible') {
      return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (verdict === 'Questionable') {
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <History className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">
              Analysis History & Audit Archive
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persisted record of evaluated news articles and social media posts
          </p>
        </div>

        {/* Global archive actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={exportAllAsJson}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-40"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Archive</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search headline keywords or analysis summaries..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/60"
          />
        </div>

        {/* Segmented Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto">
          {['all', 'reliable', 'questionable', 'risk', 'fabricated'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterVerdict(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filterVerdict === f
                  ? 'bg-slate-800 text-teal-300 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'risk' ? 'High Risk' : f}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-400">
            {history.length === 0
              ? 'No analysis reports stored yet.'
              : 'No analyses match your search filter.'}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {history.length === 0
              ? 'Paste an article headline above or pick a sample preset to run your first truth audit.'
              : 'Try clearing your search query or selecting "All" to view all stored records.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const theme = getVerdictTheme(item.verdict);
            const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="group bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition-all hover:bg-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Meta & Title */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {dateStr}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-400">
                      {item.claims.length} claims audited
                    </span>
                    {item.sourceUrl && (
                      <>
                        <span>·</span>
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-teal-400 hover:underline max-w-[180px] truncate"
                        >
                          <span>Source link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Right Score & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Score Pill */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      {getVerdictIcon(item.verdict)}
                      <span className="text-sm font-bold font-mono tabular-nums text-white">
                        {item.credibilityScore}
                        <span className="text-[11px] font-normal text-slate-500">/100</span>
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-0.5 ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
                    >
                      {item.verdict}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      title="Inspect full report"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onExportEmail(item)}
                      title={`Send audit report to ${userEmail}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      title="Delete record"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
