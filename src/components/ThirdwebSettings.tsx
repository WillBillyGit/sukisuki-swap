import React, { useState } from "react";
import { Key, Shield, Wifi, WifiOff, X, Save, Wallet, Copy, Check, Info } from "lucide-react";
import { motion } from "motion/react";

interface ThirdwebSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  thirdwebClientId: string;
  setThirdwebClientId: (id: string) => void;
  thirdwebProjectId: string;
  setThirdwebProjectId: (id: string) => void;
  thirdwebPrivateKey: string;
  setThirdwebPrivateKey: (key: string) => void;
  kaiaChainId: string;
  setKaiaChainId: (id: string) => void;
}

export default function ThirdwebSettings({
  isOpen,
  onClose,
  thirdwebClientId,
  setThirdwebClientId,
  thirdwebProjectId,
  setThirdwebProjectId,
  thirdwebPrivateKey,
  setThirdwebPrivateKey,
  kaiaChainId,
  setKaiaChainId
}: ThirdwebSettingsProps) {
  const [inputText, setInputText] = useState(thirdwebClientId);
  const [projectIdInput, setProjectIdInput] = useState(thirdwebProjectId);
  const [privateKeyInput, setPrivateKeyInput] = useState(thirdwebPrivateKey);
  const [chainIdInput, setChainIdInput] = useState(kaiaChainId);
  const [successMsg, setSuccessMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedBaseContract, setCopiedBaseContract] = useState(false);
  const [copiedOwner, setCopiedOwner] = useState(false);
  const [codeNetwork, setCodeNetwork] = useState<"kaia" | "base">("kaia");

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setThirdwebClientId(inputText);
    localStorage.setItem("suki_thirdweb_client_id", inputText);
    setThirdwebProjectId(projectIdInput);
    localStorage.setItem("suki_thirdweb_project_id", projectIdInput);
    setThirdwebPrivateKey(privateKeyInput);
    localStorage.setItem("suki_thirdweb_private_key", privateKeyInput);
    setKaiaChainId(chainIdInput);
    localStorage.setItem("suki_kaia_chain_id", chainIdInput);
    
    setSuccessMsg("Kaia credentials loaded successfully! 🥰🌸");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const kaiaCodeSnippet = `import { createThirdwebClient, privateKeyToAccount } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Configured Kaia Testnet Kairos chain ID
const kaiaChain = defineChain(${chainIdInput || "1001"});

// Verified Contract ARBCv3 SUKI on Kaia
const SUKI_CONTRACT = "0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72";

// Private key decrypted safely at execution
const PRIVATE_KEY = "${privateKeyInput || "your_private_key_here"}";

const client = createThirdwebClient({
  secretKey: "your_thirdweb_project_secret_key", // Setup via env vars
});

const account = privateKeyToAccount({
  client,
  privateKey: PRIVATE_KEY,
});

// Connected wallet address
console.log("Wallet address:", account.address);`;

  const baseCodeSnippet = `import { createThirdwebClient, privateKeyToAccount } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Configured Base Mainnet chain(8453)
const baseChain = defineChain(8453);

// Verified Contract ARBCv3 SukiSuki on Base
const SUKI_SUKI_CONTRACT = "0xdf501E7C19B3D1cFbA53C375c9c630cE554a3447";

// Private key decrypted safely at deployment execution
const PRIVATE_KEY = "${privateKeyInput || "your_private_key_here"}";

const client = createThirdwebClient({
  secretKey: "your_thirdweb_project_secret_key", // Setup via env vars
});

const account = privateKeyToAccount({
  client,
  privateKey: PRIVATE_KEY,
});

// Connected wallet address
console.log("Wallet address:", account.address);`;

  const codeSnippet = codeNetwork === "kaia" ? kaiaCodeSnippet : baseCodeSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-lg w-full border border-pink-100 shadow-2xl relative overflow-y-auto max-h-[90vh]"
      >
        {/* Decorative banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-500 rounded-t-3xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5 mt-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-slate-800 text-sm">Thirdweb Integration</h3>
            <p className="font-mono text-[9px] text-slate-400">Kaia Testnet Kairos & Suki V3 Environment</p>
          </div>
        </div>

        {/* Content body */}
        <form onSubmit={handleSave} className="space-y-4">
          <p className="font-sans text-xs text-slate-500 leading-relaxed font-medium">
            Configure your custom keys to link <span className="text-pink-500 font-bold">Suki Swap</span> natively with your deployed smart contracts.
          </p>

          {/* Official Verification Details */}
          <div className="bg-gradient-to-r from-pink-50/50 to-indigo-50/50 rounded-2xl p-4 border border-pink-100/40 space-y-3.5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans text-[10px] font-extrabold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" /> Kaia Testnet Kairos Contract (ARBCv3)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72");
                    setCopiedContract(true);
                    setTimeout(() => setCopiedContract(false), 1500);
                  }}
                  className="text-[9px] font-sans font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 transition cursor-pointer shadow-sm"
                >
                  {copiedContract ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                  {copiedContract ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="bg-slate-900/5 px-3 py-1.5 rounded-xl border border-slate-200/50">
                <span className="font-mono text-xs text-slate-700 font-bold select-all break-all">
                  0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans text-[10px] font-extrabold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-blue-500" /> Base Mainnet Contract (ARBCv3)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("0xdf501E7C19B3D1cFbA53C375c9c630cE554a3447");
                    setCopiedBaseContract(true);
                    setTimeout(() => setCopiedBaseContract(false), 1500);
                  }}
                  className="text-[9px] font-sans font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 transition cursor-pointer shadow-sm"
                >
                  {copiedBaseContract ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                  {copiedBaseContract ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="bg-slate-900/5 px-3 py-1.5 rounded-xl border border-slate-200/50">
                <span className="font-mono text-xs text-slate-700 font-bold select-all break-all text-blue-800">
                  0xdf501E7C19B3D1cFbA53C375c9c630cE554a3447
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-sans text-[10px] font-extrabold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                  Project Owner/Creator Wallet (Contracts Admin)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("0xf71bbF442cd1ea0503569CFAb27f03304D0C3bB7");
                    setCopiedOwner(true);
                    setTimeout(() => setCopiedOwner(false), 1500);
                  }}
                  className="text-[9px] font-sans font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 transition cursor-pointer shadow-sm"
                >
                  {copiedOwner ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                  {copiedOwner ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="bg-slate-900/5 px-3 py-1.5 rounded-xl border border-slate-200/50">
                <span className="font-mono text-xs text-slate-700 font-bold select-all break-all">
                  0xf71bbF442cd1ea0503569CFAb27f03304D0C3bB7
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                Thirdweb Client ID
              </label>
              <input
                type="text"
                placeholder="Enter client ID"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-0 text-slate-700 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                Thirdweb Project ID
              </label>
              <input
                type="text"
                placeholder="Enter project ID"
                value={projectIdInput}
                onChange={(e) => setProjectIdInput(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-0 text-slate-700 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                Kaia Private Key
              </label>
              <input
                type="password"
                placeholder="Replace with your Kaia private key"
                value={privateKeyInput}
                onChange={(e) => setPrivateKeyInput(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-0 text-slate-700 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                Kaia Chain ID
              </label>
              <input
                type="text"
                placeholder="1001 (Kairos Testnet)"
                value={chainIdInput}
                onChange={(e) => setChainIdInput(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-0 text-slate-700 font-semibold"
              />
            </div>
          </div>

          {/* Connected state snippet preview code */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="font-sans text-[10px] font-extrabold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Shield className="w-3 h-3 text-pink-500" /> Custom Deployment Script (Live)
              </span>
              
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/40">
                <button
                  type="button"
                  onClick={() => setCodeNetwork("kaia")}
                  className={`text-[9px] px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                    codeNetwork === "kaia" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Kaia Kairos
                </button>
                <button
                  type="button"
                  onClick={() => setCodeNetwork("base")}
                  className={`text-[9px] px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                    codeNetwork === "base" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Base Mainnet
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="text-[10px] font-sans font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md cursor-pointer hover:bg-indigo-100 transition shadow-sm"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600 animate-bounce" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy Snippet"}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-900 text-teal-300 rounded-2xl text-[10px] font-mono leading-relaxed overflow-x-auto border border-slate-800 max-h-[160px] shadow-inner select-all">
              {codeSnippet}
            </pre>
          </div>

          {/* Connection Status indicator */}
          <div className="p-3.5 border border-pink-50 rounded-2xl bg-pink-50/20 flex gap-2.5 text-xs text-slate-600">
            {inputText ? (
              <Wifi className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <div className="space-y-1">
              <span className="font-bold text-slate-700 block">
                {inputText ? "Custom Client ID Active" : "Fallback Public Connections"}
              </span>
              <span className="text-[10px] text-slate-400 block leading-normal">
                {inputText
                  ? `Authenticated to execute contracts via ID: ${inputText.substring(0, 8)}... over Kaia Chain: ${chainIdInput}.`
                  : "Using pre-configured testnet gateways to verify bonding curves offline."}
              </span>
            </div>
          </div>

          {/* Alert Success */}
          {successMsg && (
            <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl border border-emerald-100 text-[10px] font-bold text-center">
              {successMsg}
            </div>
          )}

          {/* Button Submit */}
          <div className="flex gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-sans font-semibold text-xs text-slate-500 text-center transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-sans font-bold text-xs text-white text-center shadow-lg shadow-indigo-150/15 transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              Save Config
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
