import React from 'react';
import { BookOpen, X, Check, Target, Compass, Sparkles } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              TruthLens AI Verification Methodology
            </h3>
            <p className="text-xs text-slate-400">
              Scientific NLP and journalistic evaluation standard
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-teal-400" />
              <span>1. Credibility Score Computation (0–100)</span>
            </h4>
            <p className="text-slate-400">
              TruthLens evaluates incoming texts across five core journalistic pillars: Factual Accuracy (30%), Source Rigor & Attribution (25%), Rhetorical Neutrality (20%), Logical Consistency (15%), and Independent Cross-Verifiability (10%).
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>2. Claim Extraction & Forensic Segmentation</span>
            </h4>
            <p className="text-slate-400">
              The AI isolates factual assertions from subjective opinion. Specific claims (e.g., biological cures, numerical percentages, covert operations) are matched against scientific consensus and historical registries, tagging unsubstantiated or false assertions with actionable cross-reference queries.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-rose-400" />
              <span>3. Emotional Manipulation & Sensationalism Index</span>
            </h4>
            <p className="text-slate-400">
              Measures lexical urgency, alarmist punctuation, persecution tropes (e.g., "They don't want you to know"), and inflammatory adjectives that weaponize cognitive outrage over rational inquiry.
            </p>
          </div>

          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center gap-2 text-teal-300">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              All evaluations are deterministic, objective, and cross-referenced with accredited open sources.
            </span>
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
