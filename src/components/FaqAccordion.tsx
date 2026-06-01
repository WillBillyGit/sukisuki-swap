import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "What is an Asymmetrical Ratchet Curve?",
    a: "An Asymmetrical Ratchet Curve is an on-chain automated market maker design that locks token prices inside a directional 'ratchet' mechanism. Token purchases cause predictable bonding exponential curve price updates directly within the smart contract, rendering traditional router routers and external LP setups unnecessary."
  },
  {
    q: "Why is the contract deployed directly on Base Mainnet?",
    a: "Base Mainnet offers sub-cent transaction execution speeds with full Ethereum security. Our bonding/minting contract resides exactly at the placeholder address inside BridgeSwapForm, allowing gasless slippage protections and instant mint confirmations."
  },
  {
    q: "How does the Slippage Beta multiplier affect transactions?",
    a: "Slippage Beta determines the exponential price response factor during token purchase transactions. A higher Slippage Beta creates higher price escalation per token minted, securing initial bonding curve participants against generic frontrunners."
  },
  {
    q: "How do I update the contract address in the app?",
    a: "To mount your live production contract, open BridgeSwapForm.tsx and look for '0xYOUR_ACTUAL_CONTRACT_ADDRESS'. Change this placeholder address to your freshly deployed contract starting line, select 'Production On-Chain Safe' mode, and start accepting live Base ETH mints directly in the frontend!"
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div id="faq-accordions" class="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col gap-4">
      <div class="flex items-center gap-2 border-b border-slate-50 pb-3">
        <div class="p-2 bg-pink-50 text-pink-500 rounded-xl">
          <HelpCircle class="w-4 h-4" />
        </div>
        <div>
          <h4 class="font-sans font-bold text-xs text-slate-800">ASYNCHRONOUS PROTOCOL KNOWLEDGE BASE</h4>
          <p class="font-sans text-[10px] text-slate-400 mt-0.5">Deep educational deepdive on non-generic routing contracts</p>
        </div>
      </div>

      <div class="flex flex-col gap-2.5">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            class="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              class="w-full text-left px-4 py-3.5 flex justify-between items-center bg-white cursor-pointer hover:bg-slate-50/40 transition-colors"
            >
              <span class="font-sans font-bold text-xs text-slate-800 pr-4">{faq.q}</span>
              {openIndex === i ? (
                <ChevronUp class="w-4 h-4 text-pink-500 shrink-0" />
              ) : (
                <ChevronDown class="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>
            {openIndex === i && (
              <div class="px-4 py-3 border-t border-slate-100 text-xs text-slate-500 leading-relaxed font-sans bg-slate-50/10">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
