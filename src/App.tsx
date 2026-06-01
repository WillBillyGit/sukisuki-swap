import React, { useState, useEffect, useMemo } from "react";
import { Chain, Token, BridgeTx } from "./types";
import { SUPPORTED_CHAINS } from "./data";
import SukiCharacter from "./components/SukiCharacter";
import BridgeSwapForm from "./components/BridgeSwapForm";
import WalletModal from "./components/WalletModal";
import InteractiveChart from "./components/InteractiveChart";
import ActiveBridgeTracker from "./components/ActiveBridgeTracker";
import FaqAccordion from "./components/FaqAccordion";
import ReadmeDocsModal from "./components/ReadmeDocsModal";
import { Shield, Sparkles, Sliders, Wallet, Check, Network, AlertCircle, HelpCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createThirdwebClient } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

export default function App() {
  // Toggle between "sandbox" simulator mode and "onchain" live Thirdweb production mode
  const [swapMode, setSwapMode] = useState<"sandbox" | "onchain">("sandbox");

  // Connection configurations
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [providerName, setProviderName] = useState<string>("Suki Safe Wallet");

  // Selected source/target chain and token configurations
  const [chains, setChains] = useState<Chain[]>(SUPPORTED_CHAINS);
  const [selectedSourceChain, setSelectedSourceChain] = useState<Chain>(SUPPORTED_CHAINS[0]); // Base
  const [selectedTargetChain, setSelectedTargetChain] = useState<Chain>(SUPPORTED_CHAINS[1]); // Kaia
  const [selectedSourceTokenSymbol, setSelectedSourceTokenSymbol] = useState<string>("ETH");
  const [selectedTargetTokenSymbol, setSelectedTargetTokenSymbol] = useState<string>("SUKI");

  const [payAmount, setPayAmount] = useState<string>("0.125");

  // UI state for reactive dialogues
  const [sukiReaction, setSukiReaction] = useState<string>(
    "Awaiting your command, master! Use our custom Asymmetrical Ratchet Curve contract to bypass pool fees entirely! 🌸🐾"
  );

  // Settings configs
  const [thirdwebClientId, setThirdwebClientId] = useState<string>(() => {
    return localStorage.getItem("suki_thirdweb_client_id") || "d2ebf97dd1b46297647525a6dda30e88";
  });

  // Modal open controllers
  const [showSettings, setShowSettings] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Transaction History log state
  const [txHistory, setTxHistory] = useState<BridgeTx[]>([
    {
      id: "init-tx-1",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      sourceChain: "Base Mainnet",
      targetChain: "Kaia Mainnet",
      sourceToken: "ETH",
      targetToken: "SUKI",
      amount: "0.25",
      status: "completed",
      hash: "0x4fb8108a8f10664fd372d8bc983fc56cc22908f27ead90d7c5a6ba108053a47d",
    },
    {
      id: "init-tx-2",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      sourceChain: "Kaia Mainnet",
      targetChain: "Base Mainnet",
      sourceToken: "KAIA",
      targetToken: "SUKI",
      amount: "50",
      status: "completed",
      hash: "0xbc56cc207ead9f8bc9833a47d4fb8108a8f10664fd372d82908f27ead9d7c5ab",
    }
  ]);

  // Synchronize state transparently if user connects via standard thirdweb connectors
  const activeAccount = useActiveAccount();
  useEffect(() => {
    if (activeAccount) {
      setWalletAddress(activeAccount.address);
      setProviderName("MetaMask / Web3");
      setSukiReaction("Injected MetaMask/Web3 account synced! Production safe mode initialized for Base Mainnet. 🛡️⚡🐱");
    } else {
      if (providerName === "MetaMask / Web3" || providerName === "MetaMask" || providerName === "Coinbase Wallet") {
        setWalletAddress("");
        setProviderName("Not Connected");
      }
    }
  }, [activeAccount, providerName]);

  const handleInputValueChange = (val: string) => {
    setPayAmount(val);
    const floatVal = parseFloat(val);
    if (!isNaN(floatVal) && floatVal > 0) {
      if (floatVal > 5) {
        setSukiReaction("Wow! That is a whale-size contract interaction! The ratchet curve values might escalate rapidly! 🐳✨");
      } else {
        setSukiReaction(`Ready to exchange ${val} ${selectedSourceTokenSymbol} on our asymmetrical contract curve! 🌸`);
      }
    }
  };

  const handleSwapExecute = (hash: string) => {
    // Refresh visual simulated balances in sandbox mode
    if (swapMode === "sandbox") {
      const floatVal = parseFloat(payAmount) || 0;
      setChains((prevChains) => {
        return prevChains.map((c) => {
          if (c.id === selectedSourceChain.id) {
            return {
              ...c,
              tokens: c.tokens.map((t) => {
                if (t.symbol === selectedSourceTokenSymbol) {
                  const bal = Math.max(0, parseFloat(t.balance) - floatVal);
                  return { ...t, balance: bal.toFixed(4) };
                }
                return t;
              }),
            };
          }
          if (c.id === selectedTargetChain.id) {
            return {
              ...c,
              tokens: c.tokens.map((t) => {
                if (t.symbol === selectedTargetTokenSymbol) {
                  const bal = parseFloat(t.balance) + floatVal * 100;
                  return { ...t, balance: bal.toFixed(4) };
                }
                return t;
              }),
            };
          }
          return c;
        });
      });
    }
  };

  const handleWalletConnect = (address: string, provider: string) => {
    setWalletAddress(address);
    setProviderName(provider);
    setSukiReaction(`Success! Tied ${provider} address: ${address.substring(0, 6)}...${address.slice(-4)}. Lock curve unlocked! 🌸🐾`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col antialiased">
      {/* HEADER BAR */}
      <header className="bg-white border-b border-pink-50 py-3.5 px-6 flex justify-between items-center sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-lg shadow-sm">
            🐱
          </div>
          <div>
            <h1 className="font-display font-medium text-slate-855 text-sm tracking-tight flex items-center gap-1.5 leading-none">
              <span>SUKI RAT-BRIDGE PROTOCOL</span>
              <span className="text-[9px] bg-pink-50 border border-pink-100 text-pink-600 font-extrabold px-1.5 py-0.5 rounded-full uppercase leading-none scale-90">
                v2.0
              </span>
            </h1>
            <p className="font-sans text-[10px] text-slate-400 mt-1">
              Asymmetrical Ratchet Bonding Curve for Kaia & Base Mainnets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Docs trigger */}
          <button
            onClick={() => setShowDocsModal(true)}
            className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all cursor-pointer border border-slate-100"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CONTRACT GUIDE</span>
          </button>

          {/* Connection trigger */}
          {walletAddress ? (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-2 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-sm max-w-[170px] sm:max-w-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="truncate">{walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowWalletModal(true)}
              className="flex items-center gap-1.5 text-[11px] font-sans font-bold bg-pink-550 hover:bg-pink-600 text-white px-3.5 py-2 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>CONNECT WALLET</span>
            </button>
          )}

          {/* Settings panel trigger */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-100"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* SETTINGS DRAWER */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-b border-pink-100/60 overflow-hidden shadow-inner"
          >
            <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
              <div className="flex flex-col gap-2">
                <label className="font-sans font-bold text-[10px] text-slate-400 uppercase tracking-wider block">
                  THIRDWEB CLIENT ID (CLIENT-SIDE CONFIG)
                </label>
                <input
                  type="text"
                  placeholder="Insert Thirdweb Client ID..."
                  value={thirdwebClientId}
                  onChange={(e) => {
                    setThirdwebClientId(e.target.value);
                    localStorage.setItem("suki_thirdweb_client_id", e.target.value);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-xs w-full text-slate-800 focus:border-pink-500 outline-none"
                />
                <p className="text-[10px] text-slate-400 font-mono">
                  Loaded from `.dev.env.json` or custom inputs. Local config stored inside localStorage.
                </p>
              </div>

              <div className="flex flex-col justify-center bg-pink-50/30 border border-pink-100/60 rounded-2xl p-4 gap-2">
                <div className="font-sans font-bold text-pink-650 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Development Sandbox Environment</span>
                </div>
                <p className="text-[10px] text-slate-450 leading-relaxed font-medium font-sans">
                  Use this environment to check the look-and-feel of the "Suki Asymmetrical Faucet" or connect real mainnet accounts using the client variables.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BRIEF DOCS ALERT BORDER */}
      <div className="bg-indigo-600 text-indigo-100 text-[11px] py-2 px-6 flex justify-between items-center font-bold tracking-wide shadow-sm flex-col sm:flex-row gap-1 border-b border-indigo-700">
        <span className="flex items-center gap-1.5 justify-center text-center sm:text-left">
          <Shield className="w-3.5 h-3.5 text-pink-100 animate-pulse" />
          <span>PRODUCTION ON-CHAIN LOCK INTEGRATED. MINTS ETH DIRECTLY TO THE ASYMMETRICAL RATCHET CONTRACT ON BASE MAINNET!</span>
        </span>
        <button
          onClick={() => setShowDocsModal(true)}
          className="underline text-[10px] hover:text-white cursor-pointer"
        >
          READ SETUP INSTRUCTIONS
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* CHARACTER SPEAK SPACE */}
        <SukiCharacter reaction={sukiReaction} isSandbox={swapMode === "sandbox"} />

        {/* PORTALS TRIGGER TABS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Swap mode toggle tabs */}
            <div className="bg-white border border-pink-100 rounded-2xl p-1 flex shadow-sm gap-1">
              <button
                onClick={() => {
                  setSwapMode("sandbox");
                  setSukiReaction("Sandbox portals activated! Feel free to simulated trade and check how the values respond! 🌸");
                }}
                className={`flex-1 py-3 text-xs font-bold font-sans rounded-xl transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  swapMode === "sandbox"
                    ? "bg-indigo-650 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                }`}
              >
                <span>🌸 Sandbox Faucet Protocol</span>
                <span className="text-[9px] bg-pink-100 text-pink-600 font-extrabold px-1.5 py-0.5 rounded-full uppercase scale-90">
                  Demo
                </span>
              </button>
              <button
                onClick={() => {
                  setSwapMode("onchain");
                  setSukiReaction("Production Secure Portal loaded. Verify your Base custom smart contract parameters below to proceed on-chain! 🛡️🐾⚡");
                }}
                className={`flex-1 py-3 text-xs font-bold font-sans rounded-xl transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  swapMode === "onchain"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                }`}
              >
                <span>🛡️ Production On-Chain Safe</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-600 font-extrabold px-1.5 py-0.5 rounded-full uppercase scale-90 animate-pulse">
                  Onchain
                </span>
              </button>
            </div>

            {/* Custom Bonding Curve Form */}
            <BridgeSwapForm
              chains={chains}
              selectedSourceChain={selectedSourceChain}
              setSelectedSourceChain={setSelectedSourceChain}
              selectedTargetChain={selectedTargetChain}
              setSelectedTargetChain={setSelectedTargetChain}
              selectedSourceTokenSymbol={selectedSourceTokenSymbol}
              setSelectedSourceTokenSymbol={setSelectedSourceTokenSymbol}
              selectedTargetTokenSymbol={selectedTargetTokenSymbol}
              setSelectedTargetTokenSymbol={setSelectedTargetTokenSymbol}
              payAmount={payAmount}
              setPayAmount={setPayAmount}
              onInputValueChange={handleInputValueChange}
              onSwapExecute={handleSwapExecute}
              walletAddress={walletAddress}
              onConnectWallet={() => setShowWalletModal(true)}
              swapMode={swapMode}
              onAddLog={(log) => setTxHistory(prev => [log, ...prev])}
              onSukiReactionChange={setSukiReaction}
            />

            {/* Status logs and dashboard charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActiveBridgeTracker txs={txHistory} />
              <FaqAccordion />
            </div>

          </div>

          {/* SIDEBAR VIEW: Curve chart display and FAQ */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <InteractiveChart />
            
            {/* Network parameters widget */}
            <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm flex flex-col gap-3">
              <h5 className="font-sans font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                NETWORK PATHWAYS SUMMARY
              </h5>
              <div className="flex flex-col gap-2 text-xs font-sans font-medium text-slate-700">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-slate-450 text-[11px]">Primary Base RPC:</span>
                  <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md">Base Mainnet (8453)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-slate-450 text-[11px]">Primary Kaia RPC:</span>
                  <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md">Kaia Mainnet (8217)</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-450 text-[11px]">Router Routing:</span>
                  <span className="font-mono text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Custom Direct Contract Bypassed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
      
      <ReadmeDocsModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />
    </div>
  );
}
