import React from "react";
import { Github, BookOpen, ShieldAlert, Cpu, ExternalLink, Globe, FileText, CheckCircle } from "lucide-react";

interface Web3FooterProps {
  onOpenReadme: () => void;
}

export default function Web3Footer({ onOpenReadme }: Web3FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/70 backdrop-blur-md border-t border-pink-100/50 mt-16 py-10 px-6 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Brand column */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦞</span>
            <span className="font-sans font-black text-slate-800 text-sm">Crust Fund Swap</span>
            <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
              V3 Protocol
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-medium">
            Multi-chain asymmetric ratchet liquidity hub securing continuously climbing floor rates of decentralized assets. Protected and audited under the watchful claws of Clawdy the Baby Lobster.
          </p>
          <div className="flex items-center gap-2 mt-1.5 p-2 bg-emerald-50 rounded-xl border border-emerald-100/60 w-fit">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-mono text-emerald-700 font-bold">
              Domain verified authenticity: crustfundfi.org
            </span>
          </div>
        </div>

        {/* Links Column 1: Developer Hub */}
        <div className="md:col-span-3 flex flex-col gap-2.5">
          <h4 className="text-[10px] uppercase font-mono text-pink-600 font-extrabold tracking-wider">
            Developer Hub
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={onOpenReadme}
                className="text-slate-500 hover:text-pink-600 font-semibold cursor-pointer transition flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Protocol README</span>
              </button>
            </li>
            <li>
              <a
                href="https://github.com/crustfundfi/crustfund-swap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-pink-600 font-semibold transition flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </li>
            <li>
              <span className="text-slate-400 font-bold flex items-center gap-1.5 select-none text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>ARBCv3 Engines: Active</span>
              </span>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Audited Contracts */}
        <div className="md:col-span-2 flex flex-col gap-2.5">
          <h4 className="text-[10px] uppercase font-mono text-indigo-600 font-extrabold tracking-wider">
            Verified Audited Contracts
          </h4>
          <ul className="space-y-2 text-xs font-mono font-bold">
            <li>
              <a
                href="https://kairos.kaiascan.io/address/0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-indigo-600 transition flex items-center justify-between"
              >
                <span>🟢 Kaia Contract</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://basescan.org/address/0xdf501E7C19B3D1cFbA53C375c9c630cE554a3447"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-indigo-600 transition flex items-center justify-between"
              >
                <span>🔵 Base Contract</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 3: Authenticity Metadata Files */}
        <div className="md:col-span-2 flex flex-col gap-2.5">
          <h4 className="text-[10px] uppercase font-mono text-teal-600 font-extrabold tracking-wider">
            Decentralized Anchors
          </h4>
          <ul className="space-y-2 text-xs font-mono font-semibold">
            <li>
              <a
                href="/robots.txt"
                target="_blank"
                className="text-slate-500 hover:text-teal-600 transition flex items-center gap-1.5"
              >
                <FileText className="w-3 h-3" />
                <span>robots.txt</span>
              </a>
            </li>
            <li>
              <a
                href="/humans.txt"
                target="_blank"
                className="text-slate-500 hover:text-teal-600 transition flex items-center gap-1.5"
              >
                <FileText className="w-3 h-3" />
                <span>humans.txt</span>
              </a>
            </li>
            <li>
              <a
                href="/.robot"
                target="_blank"
                className="text-slate-500 hover:text-teal-600 transition flex items-center gap-1.5"
              >
                <Globe className="w-3 h-3" />
                <span>.robot manifest</span>
              </a>
            </li>
            <li>
              <a
                href="/.human"
                target="_blank"
                className="text-slate-500 hover:text-teal-600 transition flex items-center gap-1.5"
              >
                <Globe className="w-3 h-3" />
                <span>.human manifest</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copy-right divider */}
      <div className="max-w-7xl mx-auto border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-medium text-slate-400">
        <p>
          &copy; {currentYear} Crust Fund Swap Protocol. Built securely under Kaia & Base networks. All rights reserved.
        </p>
        <p className="flex items-center gap-1 font-bold">
          Made with 💖 by Clawdy the Baby Lobster 🦞 and Suki DeFi Wizards
        </p>
      </div>
    </footer>
  );
}
