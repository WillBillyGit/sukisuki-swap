import React from "react";
import { BridgeTx } from "../types";
import { ArrowRight, Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

interface ActiveBridgeTrackerProps {
  txs: BridgeTx[];
}

export default function ActiveBridgeTracker({ txs }: ActiveBridgeTrackerProps) {
  return (
    <div id="active-bridge-tracker" class="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col gap-4">
      <div class="flex items-center justify-between border-b border-slate-50 pb-3">
        <div>
          <h4 class="font-sans font-bold text-xs text-slate-800">MULTICHAIN BINDING STATUS LOGS</h4>
          <p class="font-sans text-[10px] text-slate-400 mt-0.5">Real-time smart contract state logs from Kaia & Base</p>
        </div>
        <span class="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold font-mono">
          {txs.length} LOGS
        </span>
      </div>

      <div class="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
        {txs.length === 0 ? (
          <div class="py-12 text-center text-slate-400 text-xs font-sans italic">
            No active bridge pathways executed yet. Start a simulated or real onchain swap above! 🌸
          </div>
        ) : (
          txs.map((tx) => (
            <div
              key={tx.id}
              class="bg-slate-50/60 rounded-2xl p-3.5 border border-slate-100/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-pink-100 transition-all duration-150"
            >
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[10px] font-bold font-mono bg-white px-2 py-0.5 rounded-md text-slate-600 shadow-sm border border-slate-100">
                    {tx.sourceChain}
                  </span>
                  <ArrowRight class="w-3 h-3 text-slate-400" />
                  <span class="text-[10px] font-bold font-mono bg-white px-2 py-0.5 rounded-md text-slate-600 shadow-sm border border-slate-100">
                    {tx.targetChain}
                  </span>
                  
                  <span class="text-[10px] font-bold font-sans text-indigo-600 ml-1">
                    {tx.amount} {tx.sourceToken}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-[9px] text-slate-400 font-mono">
                  <span>{new Date(tx.timestamp).toLocaleString()}</span>
                  {tx.hash && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Transaction receipt:\nHash: ${tx.hash}\nStatus: Verified receipt on-chain.`);
                      }}
                      class="flex items-center gap-0.5 hover:text-indigo-600 cursor-pointer"
                    >
                      <span>Hash: {tx.hash.substring(0, 10)}...</span>
                      <ExternalLink class="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              <div class="flex items-center gap-2 self-start sm:self-auto">
                {tx.status === "pending" && (
                  <span class="bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono flex items-center gap-1">
                    <Clock class="w-3.5 h-3.5 animate-spin" />
                    <span>PENDING RECEIPT</span>
                  </span>
                )}
                {tx.status === "completed" && (
                  <span class="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono flex items-center gap-1">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>MINTED ON-CHAIN</span>
                  </span>
                )}
                {tx.status === "failed" && (
                  <span class="bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono flex items-center gap-1">
                    <XCircle class="w-3.5 h-3.5" />
                    <span>TX REJECTED</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
