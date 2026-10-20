import React from 'react';
import { Flame, Compass, AlertTriangle, Lightbulb } from 'lucide-react';
import type { AnalysisResult } from '../utils/analyzer';

interface EmotionalAnalysisCardProps {
  emotional: AnalysisResult['emotionalManipulation'];
  bias: AnalysisResult['biasRating'];
  fallacies: string[];
  recommendations: string[];
}

export const EmotionalAnalysisCard: React.FC<EmotionalAnalysisCardProps> = ({
  emotional,
  bias,
  fallacies,
  recommendations,
}) => {
  // Determine color for emotional manipulation
  const getEmotionColor = (score: number) => {
    if (score > 65) return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
    if (score > 35) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
  };

  // Convert bias spectrum to position percentage on a 0-100 spectrum
  const getBiasPosition = (spectrum: string): number => {
    switch (spectrum) {
      case 'Extreme Left':
        return 10;
      case 'Lean Left':
        return 30;
      case 'Center / Balanced':
        return 50;
      case 'Lean Right':
        return 70;
      case 'Extreme Right':
        return 90;
      case 'Partisan Sensationalism':
      default:
        return 50;
    }
  };

  const biasPosition = getBiasPosition(bias.spectrum);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Emotional Manipulation Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Flame className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-white">
                Emotional Manipulation Index
              </h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getEmotionColor(
                emotional.score
              )}`}
            >
              {emotional.level} ({emotional.score}%)
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {emotional.explanation}
          </p>

          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Manipulation Tactics Detected
            </div>
            <div className="flex flex-wrap gap-1.5">
              {emotional.tacticsDetected.map((tactic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700/80"
                >
                  {tactic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Logical Fallacies */}
        {fallacies && fallacies.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Fallacies Identified</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {fallacies.map((fal, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20"
                >
                  {fal}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bias Spectrum & Fact-Check Recommendations */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 backdrop-blur-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Compass className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-white">
                Framing & Bias Spectrum
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 border border-slate-700 text-teal-300">
              {bias.spectrum}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {bias.explanation}
          </p>

          {/* Visual Bias Scale */}
          <div className="space-y-1.5 mb-5">
            <div className="flex justify-between text-[10px] text-slate-400 uppercase font-mono">
              <span>Left Lean</span>
              <span className="text-teal-400 font-bold">Center / Balanced</span>
              <span>Right Lean</span>
            </div>
            <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-teal-400 to-rose-500 opacity-60" />
            </div>
            {/* Position Pin */}
            <div className="relative h-4">
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-700"
                style={{ left: `${biasPosition}%` }}
              >
                <div className="w-3 h-3 bg-white rounded-full border-2 border-slate-950 shadow-md" />
                <span className="text-[10px] font-mono text-white whitespace-nowrap mt-0.5">
                  Detected Bias
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 mb-2">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Fact-Check Verification Guidance</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {recommendations.slice(0, 2).map((rec, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-teal-400 font-bold">·</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
