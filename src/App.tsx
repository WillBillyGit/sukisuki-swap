import React, { useState, useEffect } from "react";
import { Chain, Token, BridgeTx } from "./types";
import { SUPPORTED_CHAINS } from "./data";
import SukiCharacter from "./components/SukiCharacter";
import BridgeSwapForm from "./components/BridgeSwapForm";
import SukiAdvisor from "./components/SukiAdvisor";
import InteractiveChart from "./components/InteractiveChart";
import TxHistory from "./components/TxHistory";
import ThirdwebSettings from "./components/ThirdwebSettings";
import WalletModal from "./components/WalletModal";
import Web3Footer from "./components/Web3Footer";
import ReadmeDocsModal from "./components/ReadmeDocsModal";
import { Shield, Sparkles, Sliders, Wallet, Check, Network, AlertCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // State for loaded chains and custom balances
  const [chains, setChains] = useState<Chain[]>(SUPPORTED_CHAINS);

  // Connection configurations
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [providerName, setProviderName] = useState<string>("Crust Safe Wallet");
  const [thirdwebClientId, setThirdwebClientId] = useState<string>(() => {
    return localStorage.getItem("suki_thirdweb_client_id") || "d2ebf97dd1b46297647525a6dda30e88";
  });
  const [thirdwebProjectId, setThirdwebProjectId] = useState<string>(() => {
    return localStorage.getItem("suki_thirdweb_project_id") || "prj_cmpp8wtng0sknb60ls28kd2w2";
  });
  const [thirdwebPrivateKey, setThirdwebPrivateKey] = useState<string>(() => {
    return localStorage.getItem("suki_thirdweb_private_key") || "";
  });
  const [kaiaChainId, setKaiaChainId] = useState<string>(() => {
    return localStorage.getItem("suki_kaia_chain_id") || "2031";
  });

  // Modal open controllers
  const [showSettings, setShowSettings] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showReadme, setShowReadme] = useState(false);

  // Form selections
  const [selectedSourceChain, setSelectedSourceChain] = useState("kaia");
  const [selectedTargetChain, setSelectedTargetChain] = useState("base");
  const [selectedSourceTokenSymbol, setSelectedSourceTokenSymbol] = useState("KAIA");
  const [selectedTargetTokenSymbol, setSelectedTargetTokenSymbol] = useState("SUKI");
  const [payAmount, setPayAmount] = useState("");

  // Clawdy mascot speech reactions
  const [sukiReaction, setSukiReaction] = useState(
    "Pinch perfect! I'm Clawdy, your friendly Crust Fund lobster buddy. Ready to securely swap or beam some cross-chain tokens! 🦞🌊🫧"
  );

  // Ongoing bridge Transactions
  const [activeBridges, setActiveBridges] = useState<BridgeTx[]>([]);

  // Ticks countdown for pending txns
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBridges((prevBridges) => {
        let balancesNeedsUpdate = false;
        const updated = prevBridges.map((tx) => {
          if (tx.status !== "pending") return tx;

          const nextElapsed = tx.secondsElapsed + 1;
          const isDone = nextElapsed >= tx.estimatedArrivalSeconds;

          if (isDone) {
            balancesNeedsUpdate = true;
            return {
              ...tx,
              secondsElapsed: nextElapsed,
              status: "completed" as const
            };
          }

          return {
            ...tx,
            secondsElapsed: nextElapsed
          };
        });

        if (balancesNeedsUpdate) {
          // Identify completed transactions and move balances
          const completedTx = updated.find(
            (tx, idx) => tx.status === "completed" && prevBridges[idx].status === "pending"
          );

          if (completedTx) {
            triggerBalanceShift(
              completedTx.sourceChain,
              completedTx.targetChain,
              completedTx.tokenSymbol,
              completedTx.amount,
              completedTx.tokenSymbol // For simplicity, targeted same symbol or converted
            );
            setSukiReaction(
              `Hooray! The cross-chain beam succeeded! Check your brand-new target balances! 🥰🎈`
            );
          }
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [chains]);

  // Performs actual balance shifts upon completed bridges
  const triggerBalanceShift = (
    srcChainId: string,
    tgtChainId: string,
    srcSymbol: string,
    amount: number,
    tgtSymbol: string
  ) => {
    setChains((prevChains) => {
      return prevChains.map((c) => {
        if (c.id === srcChainId) {
          // Subtract source balance
          const tokens = c.tokens.map((t) => {
            if (t.symbol === srcSymbol) {
              return { ...t, balance: Math.max(0, t.balance - amount) };
            }
            return t;
          });
          return { ...c, tokens };
        }
        if (c.id === tgtChainId) {
          // Estimate target balance increment based on relative rates
          const srcTokenObj = prevChains
            .find((cn) => cn.id === srcChainId)
            ?.tokens.find((tk) => tk.symbol === srcSymbol);
          const tgtTokenObj = c.tokens.find((tk) => tk.symbol === tgtSymbol);

          const rateRatio = srcTokenObj && tgtTokenObj ? srcTokenObj.priceUsd / tgtTokenObj.priceUsd : 1;
          const receiveVal = amount * rateRatio;

          const tokens = c.tokens.map((t) => {
            if (t.symbol === tgtSymbol) {
              return { ...t, balance: t.balance + receiveVal };
            }
            return t;
          });
          return { ...c, tokens };
        }
        return c;
      });
    });
  };

  // Triggers action when user presses "Bridge/Swap"
  const handleSwapExecute = (
    srcChainId: string,
    tgtChainId: string,
    srcTokenSymbol: string,
    tgtTokenSymbol: string,
    amount: number,
    route: string
  ) => {
    if (!walletAddress) {
      setSukiReaction("Uh oh! Clawdy needs an active wallet connection before launching transactions! 🥺🦞");
      setShowWalletModal(true);
      return;
    }

    // Verify balance
    const srcChain = chains.find((c) => c.id === srcChainId);
    const token = srcChain?.tokens.find((t) => t.symbol === srcTokenSymbol);
    if (!token || amount > token.balance) {
      setSukiReaction("Wait! You don't have enough tokens in your crust-wallet to complete this bridge! 🥺🦞");
      return;
    }

    // Generate simulated block transaction
    const duration = route === "crust-express" ? 5 : 12; // 5s or 12s
    const randomHash = "0x" + Math.random().toString(16).substring(2, 10) + "..." + Math.random().toString(16).substring(2, 6);

    const newTx: BridgeTx = {
      id: Date.now().toString(),
      sourceChain: srcChainId,
      targetChain: tgtChainId,
      tokenSymbol: srcTokenSymbol,
      amount: amount,
      status: "pending",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      hash: randomHash,
      estimatedArrivalSeconds: duration,
      secondsElapsed: 0
    };

    setActiveBridges((prev) => [newTx, ...prev]);
    setPayAmount(""); // Clear input form after trigger
    setSukiReaction(`Clawdy is pinching gas costs and beaming your tokens across the oceanic ${route === "crust-express" ? "Crustacean Express" : route} route! 🦞🌊🫧 Hold tight!`);
  };

  const handleConnectWallet = (address: string, providerName: string) => {
    setWalletAddress(address);
    setProviderName(providerName);
    setSukiReaction(`Crust portal opened! Connected securely with ${providerName}! Clawdy is waving happy claws! 🦞✨💖`);
  };

  const handleInputValueChange = (valStr: string) => {
    const val = parseFloat(valStr) || 0;
    if (val === 0) {
      setSukiReaction("Enter an amount to bridge! Clawdy loves big crustacean volume! 🦞🐚");
      return;
    }

    // Check balances
    const srcChain = chains.find((c) => c.id === selectedSourceChain);
    const token = srcChain?.tokens.find((t) => t.symbol === selectedSourceTokenSymbol);

    if (token) {
      if (val > token.balance) {
        setSukiReaction("Eeeek! That amount is larger than your crust-wallet balance! 🥺🦞");
      } else if (val > 1000) {
        setSukiReaction("Wow! Serious Crust Fund volume! Clawdy's claws are pulsing with bright ocean energy! 😎⚡🌊");
      } else {
        setSukiReaction("Clawdy is calculating the lowest fee rate matching your slippage tolerance! 🦞🫧");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans relative overflow-x-hidden selection:bg-pink-200">
      {/* Visual ambient soft floating circles in background */}
      <div className="absolute top-24 -left-36 w-96 h-96 rounded-full bg-pink-100/40 blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-1/2 -right-36 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none z-0"></div>

      {/* Header bar */}
      <header className="sticky top-0 w-full bg-white/70 backdrop-blur-md border-b border-pink-100/50 z-40 px-6 py-4.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-pulse">🦞</span>
            <div>
              <h1 className="font-display font-extrabold text-lg text-slate-800 leading-none flex items-center gap-1.5">
                Crust Fund Swap
              </h1>
              <p className="font-mono text-[9px] font-bold text-slate-400 mt-0.5 tracking-wide uppercase">
                crustfundfi.org Hub
              </p>
            </div>
          </div>

          {/* Right Navigation controls */}
          <div className="flex items-center gap-3.5">
            {/* Custom credentials configurator toggler */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 border border-slate-100 bg-white shadow-sm rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 text-xs text-slate-600 font-semibold"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">SDK Credentials</span>
            </button>

            {/* Wallet core toggler */}
            {walletAddress ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-indigo-50 border border-pink-100 rounded-xl px-3 py-1 px-3.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-xs text-slate-700 font-bold">
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(34, 40)}
                </span>
                <span className="text-[10px] text-pink-550 uppercase font-black bg-pink-100 px-1.5 py-0.5 rounded leading-none hidden sm:inline">
                  {providerName}
                </span>
                <button
                  onClick={() => {
                    setWalletAddress("");
                    setSukiReaction("Crust portal closed. Wallet disconnected successfully! 🦞⚓");
                  }}
                  className="font-sans font-bold text-[10px] text-indigo-550 hover:text-rose-600 ml-1 hover:underline transition cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 hover:scale-103 py-2 px-4 shadow-lg shadow-indigo-100 rounded-xl text-white font-sans font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-6 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: Interactive Mascot and AI Advisor */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Crust unique cute companion */}
            <SukiCharacter
              reaction={sukiReaction}
              onSukiClick={() => {
                const clickQuotes = [
                  "Pinch pinch! Rest assured, your ocean bridge runs on hyper-secure pathways! 🦞🫧",
                  "Mascot telemetry: 100% lobster happiness and cute vibes! Premium swap active! 🦀🌟",
                  "I love helping you explore Kaia, Arbitrum, Base, and Ethereum ocean depths! 🌊💖",
                  "Did you know lobsters hold claws to stay together? We hold your transactions safe! 🥰⚓",
                  "Click clack! That tickled! Keep squeezing those swap gains! 🦞✨"
                ];
                setSukiReaction(clickQuotes[Math.floor(Math.random() * clickQuotes.length)]);
              }}
            />

            {/* AI Advisor Panel */}
            <SukiAdvisor
              walletAddress={walletAddress || "Not Connected"}
              sourceChain={selectedSourceChain}
              targetChain={selectedTargetChain}
              tokenSelectedSymbolName={`${selectedSourceTokenSymbol} on ${selectedSourceChain}`}
            />
          </div>

          {/* RIGHT VIEW: Trade Panel, Price Chart, and Tx History */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Swap & Bridge Input Frame */}
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
            />

            {/* SVG Interactive Line Chart & Active Tracker Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
              <InteractiveChart />
              <TxHistory txs={activeBridges} />
            </div>
          </div>
        </div>
      </main>

      {/* Web3 Verified Footer */}
      <Web3Footer onOpenReadme={() => setShowReadme(true)} />

      {/* MODALS CONTROLLERS */}
      <AnimatePresence>
        {showSettings && (
          <ThirdwebSettings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            thirdwebClientId={thirdwebClientId}
            setThirdwebClientId={(id) => {
              setThirdwebClientId(id);
              if (id) {
                setSukiReaction("Yay! Thirdweb custom credentials loaded successfully! Real bindings active! 🛡️🌸");
              } else {
                setSukiReaction("Active connection successfully reset. Fallback deep-sea engines online!");
              }
            }}
            thirdwebProjectId={thirdwebProjectId}
            setThirdwebProjectId={setThirdwebProjectId}
            thirdwebPrivateKey={thirdwebPrivateKey}
            setThirdwebPrivateKey={setThirdwebPrivateKey}
            kaiaChainId={kaiaChainId}
            setKaiaChainId={setKaiaChainId}
          />
        )}

        {showWalletModal && (
          <WalletModal
            isOpen={showWalletModal}
            onClose={() => setShowWalletModal(false)}
            onConnect={handleConnectWallet}
          />
        )}

        {/* Readme Documentation Modal */}
        {showReadme && (
          <ReadmeDocsModal
            isOpen={showReadme}
            onClose={() => setShowReadme(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
