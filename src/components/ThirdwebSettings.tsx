import React, { useState } from "react";
import { Key, Shield, Wifi, WifiOff, X, Save, Wallet } from "lucide-react";
import { motion } from "motion/react";

interface ThirdwebSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  thirdwebClientId: string;
  setThirdwebClientId: (id: string) => void;
  thirdwebProjectId: string;
  setThirdwebProjectId: (id: string) => void;
}

export default function ThirdwebSettings({
  isOpen,
  onClose,
  thirdwebClientId,
  setThirdwebClientId,
  thirdwebProjectId,
  setThirdwebProjectId
}: ThirdwebSettingsProps) {
  const [inputText, setInputText] = useState(thirdwebClientId);
  const [projectIdInput, setProjectIdInput] = useState(thirdwebProjectId);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setThirdwebClientId(inputText);
    localStorage.setItem("suki_thirdweb_client_id", inputText);
    setThirdwebProjectId(projectIdInput);
    localStorage.setItem("suki_thirdweb_project_id", projectIdInput);
    setSuccessMsg("Credentials loaded successfully! 🥰🌸");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full border border-pink-100 shadow-2xl relative"
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
            <p className="font-mono text-[9px] text-slate-400">Kawaii Swap Ecosystem Credentials</p>
          </div>
        </div>

        {/* Content body */}
        <form onSubmit={handleSave} className="space-y-4">
          <p className="font-sans text-xs text-slate-500 leading-relaxed">
            Suki Swap automatically pulls your ecosystem configuration from your <strong>Kawaii Swap Custom Credentials</strong>. Fill in your client identifier below to bind real contracts.
          </p>

          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase">
              Thirdweb Client ID
            </label>
            <input
              type="password"
              placeholder="Enter your Thirdweb Client ID"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-0 text-slate-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-extrabold text-slate-400 uppercase">
              Thirdweb Project ID
            </label>
            <input
              type="text"
              placeholder="Enter your Thirdweb Project ID"
              value={projectIdInput}
              onChange={(e) => setProjectIdInput(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-0 text-slate-700"
            />
          </div>

          {/* Connection Status indicator */}
          <div className="p-3.5 border border-pink-50 rounded-2xl bg-pink-50/20 flex gap-2.5 text-xs text-slate-600">
            {inputText ? (
              <Wifi className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <div className="space-y-0.5">
              <span className="font-bold text-slate-700 block">
                {inputText ? "Client Configured (Active)" : "Ecosystem Fallback Connection"}
              </span>
              <span className="text-[10px] text-slate-400 block leading-normal">
                {inputText
                  ? "Wallet operations and smart contract calls will lock natively into your Custom Client SDK client!"
                  : "Currently executing with Suki's Secure Community API keys. Seamlessly and fully operational!"}
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
              Store Credentials
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
