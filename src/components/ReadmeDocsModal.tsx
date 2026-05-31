import React from "react";
import { motion } from "motion/react";
import { X, ShieldCheck, Cpu, Terminal, BookOpen, AlertCircle, ExternalLink, Github, FileText } from "lucide-react";

interface ReadmeDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadmeDocsModal({ isOpen, onClose }: ReadmeDocsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
      />

      {/* Sheet panel */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative bg-white/95 backdrop-blur-xl border border-pink-100 rounded-3xl shadow-2xl shadow-indigo-100/45 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col z-10"
      >
        {/* Decorative Top header gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-pink-400 to-indigo-500 shrink-0"></div>

        {/* Modal Header */}
        <div className="p-5 border-b border-rose-50 flex items-center justify-between bg-gradient-to-b from-rose-50/20 to-transparent shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-spin-slow">📖</span>
            <div>
              <h3 className="font-sans font-black text-rose-800 text-base leading-none">
                README.md Protocol Documentation
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold">
                CRUST FUND SWAP • DEVCENTER v1.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Doc content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-600 font-sans text-sm leading-relaxed custom-scrollbar bg-slate-50/40">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4.5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute right-2 -bottom-2 text-6xl opacity-15">🦞</div>
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-250 animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest font-black text-teal-100">
                Audit Verified Passed
              </span>
            </div>
            <h4 className="font-black text-lg tracking-tight mb-1">crustfundfi.org Protocol Specs</h4>
            <p className="text-[11px] leading-relaxed text-emerald-55 font-medium">
              A high-precision multi-chain swap, bridge, and asymmetric ratchet bonding curve protocol running on **Base** and **KaiaKairos Testnet** smart contracts.
            </p>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="bg-white border border-rose-100/55 p-3 rounded-xl shadow-xs">
              <div className="flex items-center gap-1.5 text-pink-600 mb-1">
                <Cpu className="w-4 h-4" />
                <span className="font-sans font-bold text-xs uppercase tracking-wider">Asymmetric Ratchet (ARBCv3)</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Uses smart oracle triggers to automatically set a hard price floor at 68% of trading price. The ratchet only rises and strictly locks against sell downward slippage.
              </p>
            </div>
            <div className="bg-white border border-rose-100/55 p-3 rounded-xl shadow-xs">
              <div className="flex items-center gap-1.5 text-indigo-600 mb-1">
                <Terminal className="w-4 h-4" />
                <span className="font-sans font-bold text-xs uppercase tracking-wider">Thirdweb Integration</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Uses the standard custom parameters (`ClientID`, `ProjectID`, `PrivateKey`) to form secure direct RPC call pipelines to remote node providers.
              </p>
            </div>
          </div>

          {/* Protocol README content */}
          <div className="space-y-4 pt-1">
            <div className="border-l-4 border-pink-400 pl-3.5">
              <h5 className="font-bold text-slate-800 text-xs uppercase font-mono text-pink-600">
                1. Domain Association Verification
              </h5>
              <p className="text-xs text-slate-500 mt-1">
                The canonical domain <strong className="text-slate-700">crustfundfi.org</strong> is completely official and securely integrated with deployed smart contracts. Phishing or fake clones are checked daily by Clawdy the Mascot.
              </p>
            </div>

            <div className="border-l-4 border-indigo-400 pl-3.5">
              <h5 className="font-bold text-slate-800 text-xs uppercase font-mono text-indigo-600">
                2. Live Verified Smart Contracts
              </h5>
              <div className="space-y-2 mt-2 font-mono text-[11px] font-bold">
                <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200/50 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1">🟢 Kaia Kairos Testnet</span>
                    <a
                      href="https://kairos.kaiascan.io/address/0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline flex items-center gap-0.5"
                    >
                      KaiaScan <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-slate-500 select-all font-mono font-black text-[10px] break-all">
                    0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72
                  </span>
                </div>

                <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200/50 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1">🔵 Base Mainnet</span>
                    <a
                      href="https://basescan.org/address/0xdf501E7C19B3D1cFbA53C375c9c630cE554a3447"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline flex items-center gap-0.5"
                    >
                      Basescan <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-slate-500 select-all font-mono font-black text-[10px] break-all">
                    0xdf501E7C19B3D1cFbA53C375c9c630cE554a3447
                  </span>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-teal-400 pl-3.5">
              <h5 className="font-bold text-slate-800 text-xs uppercase font-mono text-teal-600">
                3. Decentralized Authenticity Anchors
              </h5>
              <p className="text-xs text-slate-500 mt-1">
                Our protocol keeps clear robot-indexing specifications and human identification assets mapped to the site directory:
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] font-mono">
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="bg-white hover:bg-slate-50 border border-slate-150 p-1.5 rounded flex items-center justify-between text-slate-600 font-bold"
                >
                  <span>🤖 robots.txt</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <a
                  href="/humans.txt"
                  target="_blank"
                  className="bg-white hover:bg-slate-50 border border-slate-150 p-1.5 rounded flex items-center justify-between text-slate-600 font-bold"
                >
                  <span>🧑 humans.txt</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <a
                  href="/.robot"
                  target="_blank"
                  className="bg-white hover:bg-slate-50 border border-slate-150 p-1.5 rounded flex items-center justify-between text-slate-600 font-bold"
                >
                  <span>🛰️ .robot anchor</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
                <a
                  href="/.human"
                  target="_blank"
                  className="bg-white hover:bg-slate-50 border border-slate-150 p-1.5 rounded flex items-center justify-between text-slate-600 font-bold"
                >
                  <span>🌾 .human anchor</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Development Setup Guidelines */}
          <div className="bg-slate-100 border border-slate-200/40 p-4 rounded-xl mt-4">
            <div className="flex items-center gap-1.5 text-slate-700 font-mono font-bold text-xs mb-2">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span>LOCAL DEVELOPMENT SETUP</span>
            </div>
            <pre className="text-[10px] font-mono bg-slate-950 text-slate-300 p-3 rounded-lg overflow-x-auto space-y-1">
              <div># 1. Install packages and set up dependencies</div>
              <div className="text-emerald-400">npm install</div>
              <div># 2. Run local vite sandbox mode</div>
              <div className="text-emerald-400">npm run dev</div>
              <div># 3. Compile static static file package files</div>
              <div className="text-emerald-400">npm run build</div>
            </pre>
          </div>

          {/* Technical footer note */}
          <p className="text-[10.5px] text-slate-400 text-center font-bold">
            Released under the Open Source MIT License • Built with React, Vite, and Tailwind CSS.
          </p>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-100 border-t border-rose-50 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-slate-500" />
            <a
              href="https://github.com/crustfundfi/crustfund-swap"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] font-black hover:underline text-indigo-600 flex items-center gap-0.5"
            >
              github.com/crustfundfi/crustfund-swap <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-900 text-white cursor-pointer hover:bg-slate-800 text-[11px] font-sans font-bold px-5 py-1.5 rounded-xl transition duration-200"
          >
            Acknowledge Specs
          </button>
        </div>
      </motion.div>
    </div>
  );
}
