import React from "react";
import { X, Check } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, provider: string) => void;
}

const PROVIDERS = [
  { name: "Suki Safe Wallet", icon: "🌸", desc: "Local simulation mode with faucet assets" },
  { name: "MetaMask", icon: "🦊", desc: "Injected Web3 browser extension" },
  { name: "Coinbase Wallet", icon: "🛡️", desc: "Coinbase non-custodial wallet" },
];

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  if (!isOpen) return null;

  const handleProviderSelect = async (prov: typeof PROVIDERS[0]) => {
    if (prov.name === "Suki Safe Wallet") {
      // Generate a random, look-alike EVM address for testing/demo purposes
      const randomAddress = "0x" + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      onConnect(randomAddress, prov.name);
      onClose();
      return;
    }

    // Try establishing connection via real injected Web3 provider (window.ethereum)
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const anyWindow = window as any;
        let selectedProvider = anyWindow.ethereum;

        if (prov.name === "Coinbase Wallet" && anyWindow.ethereum.providers) {
          selectedProvider = anyWindow.ethereum.providers.find((p: any) => p.isCoinbaseWallet) || anyWindow.ethereum;
        } else if (prov.name === "MetaMask" && anyWindow.ethereum.providers) {
          selectedProvider = anyWindow.ethereum.providers.find((p: any) => p.isMetaMask) || anyWindow.ethereum;
        }

        const accounts = await selectedProvider.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          onConnect(accounts[0], prov.name);
          onClose();
        }
      } catch (err: any) {
        console.error("Wallet connection error:", err);
        alert(`Failed to connect with ${prov.name}: ` + (err.message || err));
      }
    } else {
      // Graceful fallback and instructions to download Web3 wallet
      alert(`No Web3 browser wallet detected! To connect your real ${prov.name} address, please install the official browser extension or use on-chain sandbox modes.`);
    }
  };

  return (
    <div id="wallet-connect-modal" class="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-150 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          class="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-50 rounded-full cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>

        <div>
          <h3 class="font-sans font-bold text-slate-800 text-sm">Connect Web3 Protocol</h3>
          <p class="font-sans text-[10px] text-slate-400 mt-0.5">Select your preferred pathway for signature</p>
        </div>

        <div class="flex flex-col gap-2.5">
          {PROVIDERS.map((prov) => (
            <button
              key={prov.name}
              onClick={() => handleProviderSelect(prov)}
              class="w-full text-left p-3.5 rounded-2xl border border-slate-100/80 hover:border-pink-250 hover:bg-slate-50/50 transition-all duration-155 flex items-center gap-3.5 group cursor-pointer"
            >
              <div class="w-10 h-10 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-center text-xl group-hover:bg-white group-hover:scale-105 transition-all">
                {prov.icon}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-sans font-bold text-xs text-slate-800 flex items-center gap-1">
                  <span>{prov.name}</span>
                  {prov.name === "Suki Safe Wallet" && (
                    <span class="text-[8px] bg-pink-100 text-pink-600 font-extrabold px-1 rounded-full uppercase scale-90">Simulated</span>
                  )}
                </div>
                <p class="font-sans text-[10px] text-slate-400 truncate mt-0.5">{prov.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
