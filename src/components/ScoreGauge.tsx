import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { getVerdictTheme, type AnalysisResult } from '../utils/analyzer';

interface ScoreGaugeProps {
  score: number;
  verdict: AnalysisResult['verdict'];
  summary: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, verdict, summary }) => {
  const theme = getVerdictTheme(verdict);

  // SVG Gauge calculations (circumference for radius 70)
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  // We make it a 270 degree arc (from 135 deg to 405 deg)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  const getVerdictIcon = () => {
    switch (verdict) {
      case 'Reliable':
        return <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'Mostly Credible':
        return <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />;
      case 'Questionable':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'High Risk':
        return <AlertOctagon className="w-5 h-5 text-orange-400 shrink-0" />;
      case 'Fabricated / Misinformation':
      default:
        return <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
      {/* Subtle top indicator glow */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ backgroundColor: theme.colorHex }}
      />

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Radial Gauge */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-225" viewBox="0 0 160 160">
            {/* Background Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
              className="text-slate-800/80"
            />
            {/* Animated Value Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={theme.colorHex}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold font-mono tracking-tight tabular-nums text-white">
              {score}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
              / 100
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-1">
              Credibility Score
            </span>
          </div>
        </div>

        {/* Verdict Explanation & Summary */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} text-xs font-semibold uppercase tracking-wide`}>
              {getVerdictIcon()}
              <span>{theme.label}</span>
            </div>
            <span className="text-xs text-slate-400">
              Evaluated with TruthLens Verification Engine
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {summary}
          </p>

          <div className="pt-2 border-t border-slate-800/60 flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colorHex }} />
              <span>{theme.shortDescription}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
