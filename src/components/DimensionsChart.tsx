import React from 'react';
import { Check, Shield, FileText, Scale, Search } from 'lucide-react';
import type { AnalysisResult } from '../utils/analyzer';

interface DimensionsChartProps {
  dimensions: AnalysisResult['dimensions'];
}

export const DimensionsChart: React.FC<DimensionsChartProps> = ({ dimensions }) => {
  const items = [
    {
      key: 'factuality',
      label: 'Factual Accuracy',
      score: dimensions.factuality,
      icon: <Check className="w-4 h-4 text-emerald-400" />,
      desc: 'Absence of verifiable factual falsities or manipulated claims.',
    },
    {
      key: 'sourceRigor',
      label: 'Source Rigor & Attribution',
      score: dimensions.sourceRigor,
      icon: <FileText className="w-4 h-4 text-teal-400" />,
      desc: 'Named primary sources, citations, and official transcripts.',
    },
    {
      key: 'neutrality',
      label: 'Neutrality & Tone',
      score: dimensions.neutrality,
      icon: <Scale className="w-4 h-4 text-blue-400" />,
      desc: 'Freedom from loaded rhetoric, fear appeals, and demonizing adjectives.',
    },
    {
      key: 'logicalConsistency',
      label: 'Logical Consistency',
      score: dimensions.logicalConsistency,
      icon: <Shield className="w-4 h-4 text-amber-400" />,
      desc: 'Valid deductive structure; absence of fallacies or non-sequiturs.',
    },
    {
      key: 'verifiability',
      label: 'Cross-Verifiability',
      score: dimensions.verifiability,
      icon: <Search className="w-4 h-4 text-violet-400" />,
      desc: 'Ease of independently verifying claims against open registries.',
    },
  ];

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-teal-500';
    if (val >= 40) return 'bg-amber-500';
    if (val >= 25) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Credibility Dimension Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual evaluation axes on a 0–100 percentile scale
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 tabular-nums">
          5 Core Vectors
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-slate-800 border border-slate-700/60">
                  {item.icon}
                </span>
                <span className="font-medium text-slate-200">{item.label}</span>
              </div>
              <span className="font-mono font-bold tabular-nums text-slate-300">
                {item.score}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getScoreColor(
                  item.score
                )}`}
                style={{ width: `${item.score}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
