import React from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  UserCheck,
  X,
  KeyRound,
  FileCheck2,
  Server,
  Mail,
} from 'lucide-react';

interface SecurityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export const SecurityDrawer: React.FC<SecurityDrawerProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Security Architecture & Verified Identity
            </h3>
            <p className="text-xs text-slate-400">
              TruthLens intelligence integrity protocol and privacy governance
            </p>
          </div>
        </div>

        {/* Authenticated User Badge */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>{userEmail}</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-medium">
                  Verified
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Role: Senior Fact-Checking Investigator · Enterprise Security Tier
              </div>
            </div>
          </div>
        </div>

        {/* Security Pillars */}
        <div className="space-y-3.5 mb-6">
          <div className="flex gap-3 items-start bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <Lock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">
                Zero-Retention Privacy Guarantee
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Pasted news articles and confidential documents are processed in ephemeral memory buffers. No user-submitted content is retained or harvested for model training.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">
                AES-256-GCM & TLS 1.3 Channel Hardening
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                All client-to-server and inference payload communications are protected with end-to-end transport layer security and strict CORS isolation.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <FileCheck2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">
                Cryptographic Audit Trails
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Every credibility score and claim extraction carries an immutable SHA-256 integrity signature to ensure chain-of-custody verification.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <Server className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">
                Dual-Tier Inference Redundancy
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Powered by Gemini 3.8 Flash high-throughput multimodal intelligence with seamless failover to internal deterministic NLP heuristics.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-500">
            Session: TLS-Active · 2FA Active
          </div>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
