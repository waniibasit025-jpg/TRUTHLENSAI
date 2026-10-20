import React, { useState } from 'react';
import { AlertCircle, ExternalLink, CheckCircle, HelpCircle, Flame, Copy, Check } from 'lucide-react';
import { segmentTextWithClaims, type DetectedClaim } from '../utils/analyzer';

interface ClaimsHighlighterProps {
  rawText: string;
  claims: DetectedClaim[];
}

export const ClaimsHighlighter: React.FC<ClaimsHighlighterProps> = ({ rawText, claims }) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(
    claims && claims.length > 0 ? claims[0].id : null
  );
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  const segments = segmentTextWithClaims(rawText, claims);
  const activeClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  const handleCopyQuery = (query: string) => {
    navigator.clipboard.writeText(query);
    setCopiedQuery(query);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const getClaimBadge = (verdict: DetectedClaim['verdict']) => {
    switch (verdict) {
      case 'Verified Factual':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          highlightClass: 'bg-emerald-500/20 border-b-2 border-emerald-500 text-emerald-200 cursor-pointer hover:bg-emerald-500/30 transition-colors',
        };
      case 'Dubious / Unsubstantiated':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          highlightClass: 'bg-amber-500/20 border-b-2 border-amber-500 text-amber-200 cursor-pointer hover:bg-amber-500/30 transition-colors',
        };
      case 'Misleading':
        return {
          bg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
          dot: 'bg-orange-400',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          highlightClass: 'bg-orange-500/20 border-b-2 border-orange-500 text-orange-200 cursor-pointer hover:bg-orange-500/30 transition-colors',
        };
      case 'Manipulative Tone':
        return {
          bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
          icon: <Flame className="w-3.5 h-3.5" />,
          highlightClass: 'bg-purple-500/20 border-b-2 border-purple-500 text-purple-200 cursor-pointer hover:bg-purple-500/30 transition-colors',
        };
      case 'False / Fabricated':
      default:
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          highlightClass: 'bg-rose-500/25 border-b-2 border-rose-500 text-rose-200 cursor-pointer hover:bg-rose-500/35 transition-colors',
        };
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Interactive Claim & Rhetoric Highlighter
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on highlighted passages below to inspect factual verification audits
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 tabular-nums">
          {claims.length} Claims Identified
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Highlighted Text Canvas */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800/80 rounded-lg p-5 font-sans text-sm leading-relaxed text-slate-300 max-h-[380px] overflow-y-auto">
          {segments.map((seg, idx) => {
            if (!seg.isClaim || !seg.claim) {
              return <span key={idx}>{seg.text}</span>;
            }

            const badge = getClaimBadge(seg.claim.verdict);
            const isSelected = selectedClaimId === seg.claim.id;

            return (
              <mark
                key={idx}
                onClick={() => setSelectedClaimId(seg.claim!.id)}
                className={`px-1 py-0.5 rounded mx-0.5 font-medium ${badge.highlightClass} ${
                  isSelected ? 'ring-2 ring-white/50 ring-offset-1 ring-offset-slate-950' : ''
                }`}
                title={`Claim: ${seg.claim.verdict} (Click to inspect)`}
              >
                {seg.text}
              </mark>
            );
          })}
        </div>

        {/* Claim Inspector Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-800/50 border border-slate-700/60 rounded-lg p-5">
          {activeClaim ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${
                    getClaimBadge(activeClaim.verdict).bg
                  }`}
                >
                  {getClaimBadge(activeClaim.verdict).icon}
                  <span>{activeClaim.verdict}</span>
                </div>

                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold ${
                    activeClaim.severity === 'high'
                      ? 'bg-rose-500/20 text-rose-300'
                      : activeClaim.severity === 'medium'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Severity: {activeClaim.severity}
                </span>
              </div>

              {/* Exact Quote */}
              <div className="bg-slate-900/90 p-3 rounded border border-slate-800 text-xs italic text-slate-200">
                "{activeClaim.text}"
              </div>

              {/* Forensic Explanation */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Forensic Assessment
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeClaim.explanation}
                </p>
              </div>

              {/* Cross-Reference Fact-Check Action */}
              {activeClaim.factCheckQuery && (
                <div className="pt-3 border-t border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Suggested Fact-Check Query:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyQuery(activeClaim.factCheckQuery!)}
                      className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-mono"
                    >
                      {copiedQuery === activeClaim.factCheckQuery ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy query</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={activeClaim.factCheckQuery}
                      className="flex-1 bg-slate-900 border border-slate-700 text-xs font-mono px-2.5 py-1.5 rounded text-slate-300 select-all"
                    />
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        activeClaim.factCheckQuery
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition-colors"
                      title="Search Google in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 text-slate-500">
              <HelpCircle className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">No specific claim selected. Select any highlighted excerpt to inspect.</p>
            </div>
          )}

          {/* Quick claim selector switcher */}
          {claims.length > 1 && (
            <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 mr-1">Switch claim:</span>
              {claims.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClaimId(c.id)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                    selectedClaimId === c.id
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  #{i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
