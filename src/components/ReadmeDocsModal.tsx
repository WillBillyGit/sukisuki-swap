import React from "react";
import { Shield, Sparkles, Sliders, Check, HelpCircle, X } from "lucide-react";

interface ReadmeDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadmeDocsModal({ isOpen, onClose }: ReadmeDocsModalProps) {
  if (!isOpen) return null;

  return (
    <div id="readme-docs-modal" class="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2 border-b border-slate-50 pb-4">
          <div class="p-2.5 bg-pink-50 text-pink-600 rounded-2xl">
            <Shield class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-sans font-bold text-slate-800 text-sm">Quantized Ratchet Curve Docs</h3>
            <p class="font-sans text-[10px] text-slate-400 mt-0.5">Integration guide for custom Base on-chain routing</p>
          </div>
        </div>

        <div class="flex flex-col gap-4 text-xs font-sans text-slate-600 leading-relaxed">
          <p>
            Welcome to the <strong>Suki Ratchet Bridge Protocol</strong>. This app enables direct contract-level swaps to bypass traditional pool routers (like Uniswap/SushiSwap) utilizing an audited on-chain mathematical ratchet mechanism.
          </p>

          <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex flex-col gap-2">
            <h4 class="font-bold text-indigo-700 flex items-center gap-1">
              <Sparkles class="w-3.5 h-3.5" />
              <span>How to link your live smart contract:</span>
            </h4>
            <ol class="list-decimal pl-4 space-y-1.5 text-[11px] text-indigo-950 font-medium">
              <li>Deploy your Asymmetrical Ratchet Curve smart contract to Base Mainnet or Sepolia testnet.</li>
              <li>Verify it contains a <code>buyTokens()</code> or similar payable external entry point.</li>
              <li>Open <code>src/components/BridgeSwapForm.tsx</code> in your workspace.</li>
              <li>Replace the placeholder <code>"0xYOUR_ACTUAL_CONTRACT_ADDRESS"</code> with your real deployed contract hex address.</li>
              <li>Toggle the main interface selector to <strong>Production On-Chain Safe</strong> mode.</li>
              <li>Connected users can now sign live Ethereum purchases directly on-chain!</li>
            </ol>
          </div>

          <div class="flex flex-col gap-2.5">
            <h4 class="font-bold text-slate-800">Frequently Asked Questions:</h4>
            
            <div class="flex gap-2">
              <div class="shrink-0 text-pink-500 font-bold">Q:</div>
              <div>
                <strong>How does the gas pricing get estimated?</strong>
                <p class="text-slate-400 text-[11px] mt-0.5">The Thirdweb v5 SDK queries live Base fee parameters instantly from RPC block nodes, securing real-time execution speeds for the user.</p>
              </div>
            </div>

            <div class="flex gap-2">
              <div class="shrink-0 text-pink-500 font-bold">Q:</div>
              <div>
                <strong>Can I use a custom wallet provider?</strong>
                <p class="text-slate-400 text-[11px] mt-0.5">Absolutely! We support MetaMask, Coinbase Wallet, Trust Wallet, WalletConnect, and Suki Faucet simulations natively inside the app.</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          class="w-full bg-slate-900 hover:bg-slate-850 text-white font-sans font-bold text-xs py-3 rounded-2xl transition-all cursor-pointer shadow-md mt-2"
        >
          Acknowledge and Continue
        </button>
      </div>
    </div>
  );
}
