import React, { useState, useEffect } from "react";
import { Chain, Token } from "../types";
import { ArrowDownUp, RefreshCw, Star, Info, Settings2, Zap, Hourglass } from "lucide-react";
import { motion } from "motion/react";

const marineChainsImg = "/marine_chains_1780217348244.png";

interface BridgeSwapFormProps {
  chains: Chain[];
  selectedSourceChain: string;
  setSelectedSourceChain: (id: string) => void;
  selectedTargetChain: string;
  setSelectedTargetChain: (id: string) => void;
  selectedSourceTokenSymbol: string;
  setSelectedSourceTokenSymbol: (symbol: string) => void;
  selectedTargetTokenSymbol: string;
  setSelectedTargetTokenSymbol: (symbol: string) => void;
  payAmount: string;
  setPayAmount: (amount: string) => void;
  onSwapExecute: (
    sourceChainId: string,
    targetChainId: string,
    sourceTokenSymbol: string,
    targetTokenSymbol: string,
    amount: number,
    bridgeRoute: string
  ) => void;
  onInputValueChange: (amount: string) => void;
  walletAddress: string;
  onConnectWallet: () => void;
}

export default function BridgeSwapForm({
  chains,
  selectedSourceChain,
  setSelectedSourceChain,
  selectedTargetChain,
  setSelectedTargetChain,
  selectedSourceTokenSymbol,
  setSelectedSourceTokenSymbol,
  selectedTargetTokenSymbol,
  setSelectedTargetTokenSymbol,
  payAmount,
  setPayAmount,
  onSwapExecute,
  onInputValueChange,
  walletAddress,
  onConnectWallet
}: BridgeSwapFormProps) {
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [bridgeRoute, setBridgeRoute] = useState("crust-express"); // "crust-express" | "rainbow-bridge" | "connext"
  const [isCalculatedPriceUpdating, setIsCalculatedPriceUpdating] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  const sourceChain = chains.find((c) => c.id === selectedSourceChain) || chains[0];
  const targetChain = chains.find((c) => c.id === selectedTargetChain) || chains[1];

  const sourceToken =
    sourceChain.tokens.find((t) => t.symbol === selectedSourceTokenSymbol) || sourceChain.tokens[0];
  const targetToken =
    targetChain.tokens.find((t) => t.symbol === selectedTargetTokenSymbol) || targetChain.tokens[0];

  // Recalculate price when inputs, chains, or tokens update
  useEffect(() => {
    setIsCalculatedPriceUpdating(true);
    const timer = setTimeout(() => setIsCalculatedPriceUpdating(false), 300);
    return () => clearTimeout(timer);
  }, [selectedSourceChain, selectedTargetChain, selectedSourceTokenSymbol, selectedTargetTokenSymbol, payAmount]);

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setPayAmount(val);
      onInputValueChange(val);
    }
  };

  const handleMaxClick = () => {
    setPayAmount(sourceToken.balance.toString());
    onInputValueChange(sourceToken.balance.toString());
  };

  const handleSwitchChains = () => {
    const prevSource = selectedSourceChain;
    const prevTarget = selectedTargetChain;
    setSelectedSourceChain(prevTarget);
    setSelectedTargetChain(prevSource);

    // Swap token symbols as well if helpful
    const prevSourceToken = selectedSourceTokenSymbol;
    const prevTargetToken = selectedTargetTokenSymbol;
    setSelectedSourceTokenSymbol(prevTargetToken);
    setSelectedTargetTokenSymbol(prevSourceToken);
  };

  // Convert amount to numeric
  const numericAmount = parseFloat(payAmount) || 0;
  const payValueUsd = numericAmount * sourceToken.priceUsd;

  const isSellingSuki = sourceToken.symbol === "SUKI";
  const isSukiActive = sourceToken.symbol === "SUKI" || targetToken.symbol === "SUKI";

  // Simple formula to estimate target token amount based on price ratio minus theoretical bridge/gas fee
  const rateRatio = sourceToken.priceUsd / targetToken.priceUsd;
  const rawReceive = numericAmount * rateRatio;
  const feeRate = bridgeRoute === "crust-express" ? 0.0015 : 0.0008; // 0.15% vs 0.08%
  const staticNetworkFeeUsd = bridgeRoute === "crust-express" ? 1.5 : 0.4;
  const feeInTargetTokens = (payValueUsd * feeRate + staticNetworkFeeUsd) / targetToken.priceUsd;

  // Subtract the 15% fee that gets locked in the Crust Fund to push up the price floor
  const crustFundContributionAmount = isSellingSuki ? rawReceive * 0.15 : 0;

  const receiveAmount = Math.max(0, rawReceive - feeInTargetTokens - crustFundContributionAmount);
  const receiveValueUsd = receiveAmount * targetToken.priceUsd;

  const handleBridgeAction = () => {
    if (numericAmount <= 0) return;
    onSwapExecute(
      selectedSourceChain,
      selectedTargetChain,
      selectedSourceTokenSymbol,
      selectedTargetTokenSymbol,
      numericAmount,
      bridgeRoute
    );
  };

  // Show active chain mapping for verification badge
  const sukiChain = (sourceToken.symbol === "SUKI" ? sourceChain : targetChain) || sourceChain;
  const isBaseDeployment = sukiChain.id === "base";
  const activeSukiContractAddress = isBaseDeployment 
    ? "0xdf501E7C19B3D1cFbA53C375c9c630cE554a3447" 
    : "0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72";
  const activeSukiContractLabel = isBaseDeployment ? "Base ARBCv3 SUKI" : "Kaia ARBCv3 KAIROS";
  const activeSukiShortAddress = isBaseDeployment ? "0xdf50...3447" : "0x3312...AD72";

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-pink-100 rounded-3xl p-6 shadow-xl shadow-pink-100/30 flex flex-col relative overflow-hidden">
      {/* Decorative top pink bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-indigo-400"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-pink-400 fill-pink-400 animate-spin duration-6000" />
          <h2 className="font-sans font-bold text-slate-800 text-base">Trade & Bridge Panel</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl transition ${
              showSettings ? "bg-pink-100 text-pink-600" : "hover:bg-slate-50 text-slate-400 hover:text-slate-600"
            }`}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Settings */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4 bg-pink-50/50 border border-pink-100/70 rounded-2xl p-4 overflow-hidden text-xs text-slate-600 flex flex-col gap-3"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-700">Max Slippage Tolerance</span>
            <div className="flex gap-1.5">
              {["0.1", "0.5", "1.0", "Auto"].map((slip) => (
                <button
                  key={slip}
                  onClick={() => setSlippage(slip === "Auto" ? "0.5" : slip)}
                  className={`px-2.5 py-1 rounded-lg border font-mono transition ${
                    slippage === slip || (slip === "Auto" && slippage === "0.5")
                      ? "bg-pink-500 border-pink-500 text-white font-bold"
                      : "bg-white border-pink-100 hover:bg-pink-100/20 text-slate-600"
                  }`}
                >
                  {slip}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-700">Bridge Route Protocol</span>
            <div className="flex border border-pink-100 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setBridgeRoute("crust-express")}
                className={`px-3 py-1.5 flex items-center gap-1 transition ${
                  bridgeRoute === "crust-express"
                    ? "bg-indigo-505 bg-indigo-500 text-white font-bold"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <Zap className="w-3 h-3" />
                Crustacean Express
              </button>
              <button
                onClick={() => setBridgeRoute("rainbow-bridge")}
                className={`px-3 py-1.5 flex items-center gap-1 transition ${
                  bridgeRoute === "rainbow-bridge"
                    ? "bg-fuchsia-500 text-white font-bold"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <Hourglass className="w-3 h-3" />
                Rainbow Bridge
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* From Section */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4.5 mb-2 relative">
        <div className="flex justify-between items-center mb-2.5">
          <span className="font-sans text-xs font-semibold text-slate-400">Pay From</span>
          <div className="flex items-center gap-1.5 bg-slate-100/80 rounded-xl px-2.5 py-1">
            <span className="text-xs">Network:</span>
            <select
              value={selectedSourceChain}
              onChange={(e) => {
                setSelectedSourceChain(e.target.value);
                // Also default the token if changing chain
                const chosenChain = chains.find((c) => c.id === e.target.value);
                if (chosenChain && chosenChain.tokens.length > 0) {
                  setSelectedSourceTokenSymbol(chosenChain.tokens[0].symbol);
                }
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {chains.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center gap-3">
          {/* Select Token */}
          <div className="bg-white border border-pink-50/50 rounded-xl px-2.5 py-1.5 shadow-sm shadow-indigo-150/10 flex items-center gap-1">
            <span className="text-lg">{sourceToken.icon}</span>
            <select
              value={selectedSourceTokenSymbol}
              onChange={(e) => setSelectedSourceTokenSymbol(e.target.value)}
              className="bg-transparent text-sm font-extrabold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {sourceChain.tokens.map((t) => (
                <option key={t.id} value={t.symbol}>
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Amount input */}
          <div className="flex flex-col items-end flex-1">
            <input
              type="text"
              value={payAmount}
              onChange={handlePayAmountChange}
              placeholder="0.0"
              className="w-full text-right bg-transparent border-0 font-sans font-bold text-slate-800 text-xl focus:ring-0 focus:outline-none p-0"
            />
            <span className="font-mono text-[10px] text-slate-400 mt-1">
              ≈ ${payValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100/50 text-[10px] text-slate-400">
          <span>{sourceToken.name}</span>
          <div className="flex items-center gap-1">
            <span>Bal: {sourceToken.balance.toLocaleString()} {sourceToken.symbol}</span>
            <button
              onClick={handleMaxClick}
              className="px-1.5 py-0.5 bg-pink-100 text-pink-600 font-extrabold rounded hover:bg-pink-200 transition text-[9px]"
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      {/* Switch Buttons */}
      <div className="relative h-4 flex items-center justify-center z-5">
        <button
          onClick={handleSwitchChains}
          className="absolute w-8 h-8 rounded-full bg-white border border-pink-100 flex items-center justify-center text-pink-500 hover:text-pink-600 shadow-md hover:scale-110 active:scale-95 transition cursor-pointer"
        >
          <ArrowDownUp className="w-4 h-4" />
        </button>
      </div>

      {/* To Section */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4.5 mt-2 mb-4 relative">
        <div className="flex justify-between items-center mb-2.5">
          <span className="font-sans text-xs font-semibold text-slate-400">Receive On</span>
          <div className="flex items-center gap-1.5 bg-slate-100/80 rounded-xl px-2.5 py-1">
            <span className="text-xs">Network:</span>
            <select
              value={selectedTargetChain}
              onChange={(e) => {
                setSelectedTargetChain(e.target.value);
                const chosenChain = chains.find((c) => c.id === e.target.value);
                if (chosenChain && chosenChain.tokens.length > 0) {
                  setSelectedTargetTokenSymbol(chosenChain.tokens[0].symbol);
                }
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {chains.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center gap-3">
          {/* Select Token */}
          <div className="bg-white border border-pink-50/50 rounded-xl px-2.5 py-1.5 shadow-sm shadow-indigo-150/10 flex items-center gap-1">
            <span className="text-lg">{targetToken.icon}</span>
            <select
              value={selectedTargetTokenSymbol}
              onChange={(e) => setSelectedTargetTokenSymbol(e.target.value)}
              className="bg-transparent text-sm font-extrabold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {targetChain.tokens.map((t) => (
                <option key={t.id} value={t.symbol}>
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Receive amount display */}
          <div className="flex flex-col items-end flex-1">
            <div className="flex items-center gap-1.5">
              {isCalculatedPriceUpdating && (
                <RefreshCw className="w-3.5 h-3.5 text-pink-400 animate-spin" />
              )}
              <span className={`font-sans font-extrabold text-lg transition ${isCalculatedPriceUpdating ? "text-slate-300" : "text-slate-800"}`}>
                {receiveAmount > 0
                  ? receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
                  : "0.0"}
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 mt-1">
              ≈ ${receiveValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </div>

        {/* Balance Display */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100/50 text-[10px] text-slate-400">
          <span>{targetToken.name}</span>
          <span>Bal: {targetToken.balance.toLocaleString()} {targetToken.symbol}</span>
        </div>
      </div>

      {/* Pricing / Estimates Summary */}
      <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 text-xs text-slate-600 space-y-2 mb-5">
        <div className="flex justify-between">
          <span className="text-slate-400 flex items-center gap-1">
            Exchange Rate <Info className="w-3 h-3" />
          </span>
          <span className="font-mono font-medium text-slate-700">
            1 {sourceToken.symbol} = {(sourceToken.priceUsd / targetToken.priceUsd).toLocaleString(undefined, { maximumFractionDigits: 4 })} {targetToken.symbol}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Bridge Express Fee</span>
          <span className="font-mono text-slate-700">
            {(payValueUsd * feeRate).toLocaleString(undefined, { style: "currency", currency: "USD" })} (
            {bridgeRoute === "crust-express" ? "0.15%" : "0.08%"})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Gas & Destination Call</span>
          <span className="font-mono text-slate-700">
            ${staticNetworkFeeUsd.toFixed(2)} USD
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Estimated Duration</span>
          <span className="font-medium text-indigo-600 flex items-center gap-1 font-sans">
            <Zap className="w-3.5 h-3.5 fill-indigo-100" />
            {bridgeRoute === "crust-express" ? "Instant (≈ 5s)" : "Normal (≈ 2-3m)"}
          </span>
        </div>

        {/* Crust Fund Details (Only active when selling SUKI) */}
        {isSellingSuki && (
          <div className="mt-3 pt-3 border-t border-dashed border-pink-100 space-y-2">
            <div className="flex justify-between items-center text-rose-500 font-semibold">
              <span className="flex items-center gap-1">🌸 Crust Fund Contribution</span>
              <span className="font-mono bg-rose-50 px-2 py-0.5 rounded text-[11px]">15%</span>
            </div>
            <div className="flex justify-between items-center text-emerald-600 font-extrabold bg-emerald-50/75 p-2 rounded-xl border border-emerald-100/50">
              <span className="flex items-center gap-1 text-[11px]">🟢 Guaranteed Price Floor</span>
              <span className="font-mono text-xs">${(sourceToken.priceUsd * 0.68).toFixed(4)} USD</span>
            </div>
          </div>
        )}

        {/* Verified SUKI Smart Contract Badge */}
        {isSukiActive && (
          <div className="mt-3 pt-2.5 border-t border-dashed border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-400">
              <Star className="w-3 h-3 text-amber-500 fill-amber-300/20 " /> {activeSukiContractLabel}:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100/80 px-2 py-1 rounded-lg font-mono font-bold text-slate-600 border border-slate-200/50 select-all tracking-wide shrink-0">
              <span className="text-[10px]">{activeSukiShortAddress}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeSukiContractAddress);
                  setCopiedContract(true);
                  setTimeout(() => setCopiedContract(false), 2000);
                }}
                className="text-indigo-600 hover:text-indigo-800 transition cursor-pointer font-sans text-[9px] font-bold"
              >
                {copiedContract ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Marine Chains Reference Banner */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-pink-100/40 bg-gradient-to-br from-pink-50/20 to-indigo-50/20 p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            🌍 Supported Marine Networks
          </span>
          <span className="text-[9px] font-bold text-pink-500 bg-pink-50/85 px-2 py-0.5 rounded-md font-sans">
            Multi-Chain
          </span>
        </div>
        <div className="relative group overflow-hidden rounded-xl border border-slate-100 shadow-sm aspect-[121/64] bg-slate-100">
          <img
            src={marineChainsImg}
            alt="Supported Marine Networks"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-2.5 right-2 flex items-center justify-between text-[10px] text-white font-sans drop-shadow-sm font-bold pointer-events-none">
            <span>Base, Kaia, Arbitrum, Optimism...</span>
            <span className="text-[9px] bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold">
              Chibi Reef 🐚
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      {!walletAddress ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConnectWallet}
          className="w-full py-4 px-6 rounded-2xl font-sans font-bold text-center text-white text-base shadow-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 shadow-indigo-100 transition duration-200 cursor-pointer"
        >
          Connect Wallet 🦞🔌
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={numericAmount <= 0 || numericAmount > sourceToken.balance}
          onClick={handleBridgeAction}
          className={`w-full py-4 px-6 rounded-2xl font-sans font-bold text-center text-white text-base shadow-lg transition duration-200 cursor-pointer ${
            numericAmount <= 0
              ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
              : numericAmount > sourceToken.balance
              ? "bg-rose-400 hover:bg-rose-500 shadow-rose-100"
              : "bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:opacity-95 shadow-pink-200"
          }`}
        >
          {numericAmount <= 0
            ? "Enter Amount to Swap"
            : numericAmount > sourceToken.balance
            ? "Insufficient Balance!"
            : selectedSourceChain === selectedTargetChain
            ? "Swap Inside Network"
            : "Beam Across Chains! 🚀🌈"}
        </motion.button>
      )}
    </div>
  );
}
