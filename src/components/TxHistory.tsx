import React from "react";
import { BridgeTx } from "../types";
import { ArrowRight, CheckCircle2, XCircle, Clock, ExternalLink, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface TxHistoryProps {
  txs: BridgeTx[];
}

export default function TxHistory({ txs }: TxHistoryProps) {
  const getStatusStyle = (status: BridgeTx["status"]) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
          dot: "bg-emerald-500",
          text: "Completed"
        };
      case "failed":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-100",
          dot: "bg-rose-500",
          text: "Failed"
        };
      case "processing":
      case "pending":
      default:
        return {
          bg: "bg-indigo-50 text-indigo-700 border-indigo-100 animate-pulse",
          dot: "bg-indigo-500",
          text: "Routing Express..."
        };
    }
  };

  // Helper to generate progress percentages
  const getProgressPercentage = (tx: BridgeTx) => {
    if (tx.status === "completed") return 100;
    if (tx.status === "failed") return 0;
    const progress = (tx.secondsElapsed / tx.estimatedArrivalSeconds) * 100;
    return Math.min(99, Math.round(progress));
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-pink-100 rounded-3xl p-5 shadow-xl shadow-pink-100/20 relative overflow-hidden flex flex-col h-[350px]">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-500"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4.5 pb-2.5 border-b border-pink-50">
        <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-pink-500" />
          Active Swaps & Bridges History
        </h3>
        <span className="font-mono text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded-lg border border-indigo-100">
          {txs.length} total txns
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-pink-100 pr-1">
        {txs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
            <HelpCircle className="w-8 h-8 text-slate-300 mb-2 animate-bounce duration-5000" />
            <p className="font-sans text-xs font-semibold text-slate-500">No active transactions</p>
            <p className="font-sans text-[10px] text-slate-400 max-w-[200px] mt-1">
              Select tokens, select chains, and hit Swap to beam assets!
            </p>
          </div>
        ) : (
          txs.map((tx) => {
            const style = getStatusStyle(tx.status);
            const percent = getProgressPercentage(tx);

            return (
              <div
                key={tx.id}
                className="p-4 rounded-2xl border border-pink-50 bg-white shadow-sm flex flex-col gap-3 hover:shadow-md transition"
              >
                {/* Metadatas */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800">
                      {tx.amount.toLocaleString()} {tx.tokenSymbol}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-lg">
                      <span className="capitalize">{tx.sourceChain}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="capitalize">{tx.targetChain}</span>
                    </div>
                  </div>

                  {/* Status chip */}
                  <div
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 ${style.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                    {style.text}
                  </div>
                </div>

                {/* Progress bar for pending / processing trades */}
                {(tx.status === "pending" || tx.status === "processing") && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Bridging in Progress...</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        className="bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 h-full rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Tx hash and links */}
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-slate-50 pt-2 text-slate-400">
                  <span>Tx: {tx.hash}</span>
                  <a
                    href="https://etherscan.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-0.5 text-pink-500 hover:text-pink-600 font-bold"
                  >
                    View Explorer
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
