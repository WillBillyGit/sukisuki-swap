import React, { useState } from "react";
import { X, Search, PlusCircle, Check, Copy, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Token } from "../types";

// Extensively expanded standard tokens to provide a fully populated experience
export const PRE_POPULATED_TOKENS: Record<string, Omit<Token, "balance">[]> = {
  ethereum: [
    { id: "eth", symbol: "ETH", name: "Ether", icon: "🪙", decimals: 18, priceUsd: 3420.5 },
    { id: "suki", symbol: "SUKI", name: "Suki Token", icon: "🌸", decimals: 18, priceUsd: 0.082 },
    { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0 },
    { id: "usdt", symbol: "USDT", name: "Tether USD", icon: "🟢", decimals: 6, priceUsd: 1.0 },
    { id: "wbtc", symbol: "WBTC", name: "Wrapped Bitcoin", icon: "₿", decimals: 8, priceUsd: 67200.0 },
    { id: "link", symbol: "LINK", name: "Chainlink", icon: "⛓️", decimals: 18, priceUsd: 15.4 },
    { id: "uni", symbol: "UNI", name: "Uniswap", icon: "🦄", decimals: 18, priceUsd: 7.82 },
    { id: "shib", symbol: "SHIB", name: "Shiba Inu", icon: "🐕", decimals: 18, priceUsd: 0.000024 },
    { id: "pepe", symbol: "PEPE", name: "PEPE Meme", icon: "🐸", decimals: 18, priceUsd: 0.000012 }
  ],
  base: [
    { id: "eth", symbol: "ETH", name: "Ether", icon: "🪙", decimals: 18, priceUsd: 3418.9 },
    { id: "suki", symbol: "SUKI", name: "Suki Token", icon: "🌸", decimals: 18, priceUsd: 0.082 },
    { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0 },
    { id: "coin", symbol: "COIN", name: "Coinbase Token", icon: "🛡️", decimals: 18, priceUsd: 210.4 },
    { id: "degen", symbol: "DEGEN", name: "Degen Channel Token", icon: "🎩", decimals: 18, priceUsd: 0.012 },
    { id: "mochi", symbol: "MOCHI", name: "Mochi Cat Token", icon: "🐱", decimals: 18, priceUsd: 0.000045 },
    { id: "higher", symbol: "HIGHER", name: "Higher Community", icon: "⬆️", decimals: 18, priceUsd: 0.048 },
    { id: "brett", symbol: "BRETT", name: "Brett Mascot Token", icon: "👾", decimals: 18, priceUsd: 0.112 },
    { id: "toshi", symbol: "TOSHI", name: "Toshi Base Cat", icon: "😼", decimals: 18, priceUsd: 0.00034 },
    { id: "aero", symbol: "AERO", name: "Aerodrome Finance", icon: "✈️", decimals: 18, priceUsd: 1.22 }
  ],
  arbitrum: [
    { id: "eth", symbol: "ETH", name: "Ether", icon: "🪙", decimals: 18, priceUsd: 3420.1 },
    { id: "arb", symbol: "ARB", name: "Arbitrum Token", icon: "💜", decimals: 18, priceUsd: 1.12 },
    { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0 },
    { id: "usdt", symbol: "USDT", name: "Tether USD", icon: "🟢", decimals: 6, priceUsd: 1.0 },
    { id: "suki", symbol: "SUKI", name: "Suki Token", icon: "🌸", decimals: 18, priceUsd: 0.082 },
    { id: "gmx", symbol: "GMX", name: "GMX Decentralized", icon: "🔮", decimals: 18, priceUsd: 38.5 },
    { id: "magic", symbol: "MAGIC", name: "Treasure MAGIC", icon: "✨", decimals: 18, priceUsd: 0.65 }
  ],
  optimism: [
    { id: "eth", symbol: "ETH", name: "Ether", icon: "🪙", decimals: 18, priceUsd: 3420.2 },
    { id: "op", symbol: "OP", name: "Optimism Token", icon: "🔴", decimals: 18, priceUsd: 2.41 },
    { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0 },
    { id: "usdt", symbol: "USDT", name: "Tether USD", icon: "🟢", decimals: 6, priceUsd: 1.0 },
    { id: "velo", symbol: "VELO", name: "Velodrome Finance", icon: "🚲", decimals: 18, priceUsd: 0.124 },
    { id: "snx", symbol: "SNX", name: "Synthetix Network", icon: "🧬", decimals: 18, priceUsd: 2.15 }
  ],
  polygon: [
    { id: "pol", symbol: "POL", name: "Polygon Ecosystem", icon: "🌀", decimals: 18, priceUsd: 0.45 },
    { id: "matic", symbol: "MATIC", name: "Polygon Legacy", icon: "💜", decimals: 18, priceUsd: 0.45 },
    { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0 },
    { id: "usdt", symbol: "USDT", name: "Tether USD", icon: "🟢", decimals: 6, priceUsd: 1.0 },
    { id: "quick", symbol: "QUICK", name: "QuickSwap", icon: "⚡", decimals: 18, priceUsd: 0.065 },
    { id: "sand", symbol: "SAND", name: "The Sandbox", icon: "🏖️", decimals: 18, priceUsd: 0.38 }
  ],
  avax: [
    { id: "avax", symbol: "AVAX", name: "Avalanche Token", icon: "🔺", decimals: 18, priceUsd: 34.5 },
    { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0 },
    { id: "usdt", symbol: "USDT", name: "Tether USD", icon: "🟢", decimals: 6, priceUsd: 1.0 },
    { id: "joe", symbol: "JOE", name: "Trader Joe Token", icon: "🎩", decimals: 18, priceUsd: 0.48 },
    { id: "coq", symbol: "COQ", name: "Coq Inu Meme", icon: "🐓", decimals: 18, priceUsd: 0.0000028 }
  ],
  bsc: [
    { id: "bnb", symbol: "BNB", name: "BNB Chain Coin", icon: "🟡", decimals: 18, priceUsd: 580.4 },
    { id: "cake", symbol: "CAKE", name: "PancakeSwap Token", icon: "🥞", decimals: 18, priceUsd: 2.85 },
    { id: "usdt", symbol: "USDT", name: "Tether USD", icon: "🟢", decimals: 6, priceUsd: 1.0 },
    { id: "busd", symbol: "BUSD", name: "Binance USD", icon: "💵", decimals: 18, priceUsd: 1.0 }
  ],
  kaia: [
    { id: "kaia", symbol: "KAIA", name: "Kaia Token", icon: "🟢", decimals: 18, priceUsd: 0.142 },
    { id: "suki", symbol: "SUKI", name: "Suki Token", icon: "🌸", decimals: 18, priceUsd: 0.082 },
    { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0 },
    { id: "klay", symbol: "KLAY", name: "Klaytn Legacy Coin", icon: "🌍", decimals: 18, priceUsd: 0.142 },
    { id: "chibi", symbol: "CHIBI", name: "Chibi Reef Coin", icon: "🐚", decimals: 18, priceUsd: 0.025 }
  ],
};

interface TokenSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainId: string;
  chainName: string;
  tokens: Token[];
  selectedTokenSymbol: string;
  onSelectToken: (symbol: string) => void;
  onImportCustomToken: (chainId: string, token: Token) => void;
}

export default function TokenSearchModal({
  isOpen,
  onClose,
  chainId,
  chainName,
  tokens,
  selectedTokenSymbol,
  onSelectToken,
  onImportCustomToken
}: TokenSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "import">("search");
  
  // Custom contract importer states
  const [contractAddress, setContractAddress] = useState("");
  const [importSymbol, setImportSymbol] = useState("");
  const [importName, setImportName] = useState("");
  const [importDecimals, setImportDecimals] = useState("18");
  const [importPrice, setImportPrice] = useState("0.10");
  const [importIcon, setImportIcon] = useState("🦄");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [importError, setImportError] = useState("");
  const [importCompleted, setImportCompleted] = useState(false);

  if (!isOpen) return null;

  // POPULAR COMMON TOKENS FOR 1-CLICK SELECT
  const POPULAR_SYMBOLS = ["ETH", "SUKI", "USDC", "USDT", "KAIA", "ARB", "OP"];
  const popularTokens = tokens.filter(t => POPULAR_SYMBOLS.includes(t.symbol));

  // FILTERED TOKENS LIST (Combines active chain tokens & matching items)
  const filteredTokens = tokens.filter(t => {
    const term = searchTerm.toLowerCase();
    return (
      t.symbol.toLowerCase().includes(term) ||
      t.name.toLowerCase().includes(term) ||
      t.id.toLowerCase().includes(term)
    );
  });

  // Handle custom token paste and autofill helpers
  const handleContractChange = (val: string) => {
    setContractAddress(val);
    setImportError("");
    
    // Simulate smart-contract dry-run reading & token compilation upon pasting a valid 40-character EVM address
    if (/^0x[a-fA-F0-9]{40}$/.test(val)) {
      // Pick dynamic sweet meme & utility names based on contract address digits to make it feel super alive!
      const lastDigits = val.substring(34, 40);
      const hashVal = parseInt(lastDigits, 16);
      
      const symbolsList = ["LOBST", "COQ", "REEF", "SHELL", "CRAB", "PLANK", "POSEID", "KRAK", "SUKINU"];
      const namesList = ["Lobster Governance", "Coq de Combat", "Deep Sea Reef Token", "Shell Stablecoin", "Cute Sandbox Crab", "Plankton Ecosystem", "Poseidon Ledger", "Release Kraken", "Suki Shiba Inu"];
      const iconsList = ["🦞", "🐓", "🪸", "🐚", "🦀", "🦠", "🔱", "🐙", "🐕"];
      
      const index = hashVal % symbolsList.length;
      setImportSymbol(symbolsList[index] + "-V3");
      setImportName(namesList[index]);
      setImportIcon(iconsList[index]);
      
      // Coherent price math
      const calculatedPrice = ((hashVal % 450) / 100) + 0.01;
      setImportPrice(calculatedPrice.toFixed(4));
    }
  };

  const executeCustomImport = () => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      setImportError("Please enter a valid 40-character EVM contract address (starting with 0x)");
      return;
    }
    if (!importSymbol.trim() || !importName.trim()) {
      setImportError("Token symbol and name cannot be empty");
      return;
    }

    const decs = parseInt(importDecimals) || 18;
    const price = parseFloat(importPrice) || 0.10;

    // Create custom fully mock-minted Token
    const newToken: Token = {
      id: importSymbol.toLowerCase() + "_" + Date.now().toString().slice(-4),
      symbol: importSymbol.toUpperCase(),
      name: importName,
      icon: importIcon,
      decimals: decs,
      priceUsd: price,
      balance: 1000 // Automatically seed a generous mock-balance so user can actually swap with it instantly!
    };

    onImportCustomToken(chainId, newToken);
    setImportCompleted(true);
    setSSearchTerm("");
    
    // Auto-select and close after success delay
    setTimeout(() => {
      onSelectToken(newToken.symbol);
      setImportCompleted(false);
      setContractAddress("");
      setImportSymbol("");
      setImportName("");
      setActiveTab("search");
      onClose();
    }, 1200);
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 1500);
  };

  function setSSearchTerm(val: string) {
    setSearchTerm(val);
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-55 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full border border-pink-150 shadow-2xl relative flex flex-col max-h-[560px]"
      >
        {/* Dynamic header banner line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-indigo-500 rounded-t-3xl"></div>

        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <span>Select Token</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-650 font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              {chainName}
            </span>
          </h3>
          <p className="font-sans text-[11px] text-slate-400 mt-0.5">Explore multi-chain networks powered by Thirdweb routing</p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 mb-3.5">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 pb-2 text-xs font-bold font-sans transition border-b-2 text-center decoration-inherit cursor-pointer ${
              activeTab === "search"
                ? "border-pink-500 text-pink-500 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            All Tokens
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex-1 pb-2 text-xs font-bold font-sans transition border-b-2 text-center decoration-inherit cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "import"
                ? "border-pink-500 text-pink-500 font-extrabold"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Import Custom Token
          </button>
        </div>

        {/* Tab 1: Search and Select */}
        {activeTab === "search" && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Search inputs */}
            <div className="relative mb-3.5">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSSearchTerm(e.target.value)}
                placeholder="Search by token symbol, name or 0x address..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-pink-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 outline-none transition"
              />
            </div>

            {/* Popular selection shortcuts */}
            {popularTokens.length > 0 && !searchTerm && (
              <div className="mb-3.5">
                <span className="text-[9px] font-mono font-extrabold uppercase text-slate-400 tracking-wider block mb-1.5">
                  ⭐ Frequently Swapped
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularTokens.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectToken(t.symbol);
                        onClose();
                      }}
                      className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1 text-[11px] font-bold transition cursor-pointer ${
                        selectedTokenSymbol === t.symbol
                          ? "bg-pink-500 text-white border-pink-500"
                          : "bg-slate-50 hover:bg-pink-50 hover:border-pink-100 text-slate-700 border-slate-100"
                      }`}
                    >
                      <span className="text-xs">{t.icon}</span>
                      <span>{t.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* List of results */}
            <span className="text-[9px] font-mono font-extrabold uppercase text-slate-400 tracking-wider block mb-1.5">
              📘 Available Tokens ({filteredTokens.length})
            </span>
            <div className="flex-1 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-pink-150">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((tok) => {
                  const isSelected = selectedTokenSymbol === tok.symbol;
                  // Generate an asset address for simulation
                  const randAddr = tok.symbol === "SUKI" 
                    ? "0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72" 
                    : "0xec23" + tok.symbol.padEnd(4, "F") + "02e...9cbd";
                  
                  return (
                    <button
                      key={tok.id}
                      onClick={() => {
                        onSelectToken(tok.symbol);
                        onClose();
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between transition cursor-pointer text-left border ${
                        isSelected 
                          ? "bg-indigo-50/50 border-indigo-150 shadow-sm" 
                          : "bg-white hover:bg-slate-50 border-slate-50/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base shadow-sm">
                          {tok.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-sans font-bold text-slate-800 text-xs">{tok.symbol}</span>
                            <span className="font-mono text-[8px] text-slate-400 font-bold tracking-tight">({tok.name})</span>
                          </div>
                          <span className="font-mono text-[9px] text-slate-400 font-semibold block leading-none mt-0.5">
                            Price: ${tok.priceUsd >= 1 ? tok.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 }) : tok.priceUsd.toFixed(4)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="font-sans font-extrabold text-slate-700 text-xs">
                          {tok.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </span>
                        <span className="font-mono text-[8px] text-slate-400 mt-0.5">
                          ≈ ${(tok.balance * tok.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <span className="text-2xl">🐚</span>
                  <p className="font-sans text-xs text-slate-400 mt-2 font-semibold">No tokens match "{searchTerm}"</p>
                  <button
                    onClick={() => setActiveTab("import")}
                    className="mt-3.5 text-xs text-pink-500 hover:underline font-bold inline-flex items-center gap-1 hover:text-pink-600 cursor-pointer"
                  >
                    Import custom token contract instead <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Import */}
        {activeTab === "import" && (
          <div className="flex-1 overflow-y-auto space-y-3.5 text-xs pr-1">
            <AnimatePresence>
              {importCompleted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-emerald-800 flex flex-col items-center justify-center py-6 h-full"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold mb-3 animate-[pulse_1s_infinite]">
                    ✨
                  </div>
                  <h4 className="font-sans font-bold text-xs tracking-tight text-emerald-800">Custom Token Registered!</h4>
                  <p className="font-mono text-[10px] text-emerald-600 mt-1.5 max-w-[200px] mx-auto leading-relaxed">
                    Successfully loaded token with 1,000 faucet-minted coins for free swapping! 🦀🔌
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3.5">
                  <div className="bg-gradient-to-r from-pink-50/40 to-indigo-50/40 border border-pink-100/50 rounded-2xl p-3.5 text-slate-600 leading-relaxed text-[11px] font-medium">
                    <p className="flex items-center gap-1 text-pink-600 font-extrabold mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Faucet Integrated Sandbox!
                    </p>
                    Paste any 40-character EVM address to import any custom token. Suki's local smart contract simulator will instantly reward your wallet with **1,000 mock tokens** to test bridging trades!
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                      Token Smart Contract Address
                    </label>
                    <input
                      type="text"
                      value={contractAddress}
                      onChange={(e) => handleContractChange(e.target.value)}
                      placeholder="e.g. 0xdf501E7C19B3D1cFbA53C375c9...cE554a3447"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-pink-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none transition font-mono focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-sans font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                        Token Symbol
                      </label>
                      <input
                        type="text"
                        value={importSymbol}
                        onChange={(e) => setImportSymbol(e.target.value)}
                        placeholder="e.g. LOBST"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-pink-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none transition font-sans font-bold uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                        Token Name
                      </label>
                      <input
                        type="text"
                        value={importName}
                        onChange={(e) => setImportName(e.target.value)}
                        placeholder="e.g. Lobster Coin"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-pink-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none transition font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-sans font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                        Icon
                      </label>
                      <select
                        value={importIcon}
                        onChange={(e) => setImportIcon(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-2 py-2 rounded-xl text-xs h-9"
                      >
                        <option value="🦄">🦄 Uni</option>
                        <option value="🪙">🪙 Coin</option>
                        <option value="🦞">🦞 Lob</option>
                        <option value="🪐">🪐 Ring</option>
                        <option value="🎩">🎩 Cap</option>
                        <option value="💎">💎 Gem</option>
                        <option value="🫧">🫧 Bubble</option>
                        <option value="🧬">🧬 Synth</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                        Decimals
                      </label>
                      <input
                        type="number"
                        value={importDecimals}
                        onChange={(e) => setImportDecimals(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-pink-300 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none h-9 text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                        Price (USD)
                      </label>
                      <input
                        type="text"
                        value={importPrice}
                        onChange={(e) => setImportPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-pink-300 rounded-xl px-2 py-2 text-xs text-slate-700 outline-none h-9 text-center font-mono"
                      />
                    </div>
                  </div>

                  {importError && (
                    <p className="text-[10px] text-rose-500 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-100 flex items-center gap-1">
                      ⚠️ {importError}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={executeCustomImport}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Import and Mint 1,000 Faucet Coins! 🔌</span>
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Security protection footer */}
        <div className="flex gap-1.5 justify-center items-center mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-mono select-none">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Powered by Thirdweb smart contracts
        </div>
      </motion.div>
    </div>
  );
}
