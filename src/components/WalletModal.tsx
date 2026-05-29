import React from "react";
import { X, ShieldCheck, Star } from "lucide-react";
import { motion } from "motion/react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, providerName: string) => void;
}

const PROVIDERS = [
  { name: "MetaMask", icon: "🦊", color: "hover:bg-amber-50 hover:border-amber-200" },
  { name: "Coinbase Wallet", icon: "🔵", color: "hover:bg-blue-50 hover:border-blue-200" },
  { name: "WalletConnect", icon: "🌈", color: "hover:bg-sky-50 hover:border-sky-200" },
  { name: "Suki Safe Wallet", icon: "🌸", color: "hover:bg-pink-50 hover:border-pink-200", badge: "Extra Cute!" }
];

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  if (!isOpen) return null;

  const handleProviderSelect = (prov: typeof PROVIDERS[0]) => {
    // Generate a random, look-alike EVM address
    const randomAddress = "0x" + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    onConnect(randomAddress, prov.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full border border-pink-100 shadow-2xl relative"
      >
        {/* Top bar styling */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-indigo-500 rounded-t-3xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mt-3 mb-6">
          <div className="w-11 h-11 bg-pink-100 text-pink-500 rounded-2xl mx-auto flex items-center justify-center text-lg shadow-sm">
            🌸
          </div>
          <h3 className="font-sans font-bold text-slate-800 text-base mt-3">Connect Wallet</h3>
          <p className="font-sans text-xs text-slate-400 mt-1">Select a portal to beam into Suki's swap networks</p>
        </div>

        {/* Providers list */}
        <div className="space-y-2.5">
          {PROVIDERS.map((prov) => (
            <button
              key={prov.name}
              onClick={() => handleProviderSelect(prov)}
              className={`w-full py-3 px-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-700 font-bold transition cursor-pointer ${prov.color}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{prov.icon}</span>
                <span>{prov.name}</span>
              </div>
              {prov.badge && (
                <span className="bg-pink-100 text-pink-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-pink-500" />
                  {prov.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Info protection label */}
        <div className="flex gap-2 items-center justify-center mt-5 text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Securely and end-to-end encrypted integration
        </div>
      </motion.div>
    </div>
  );
}
