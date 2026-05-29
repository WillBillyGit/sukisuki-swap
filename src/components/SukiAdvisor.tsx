import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Send, Sparkles, User, RefreshCw, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SukiAdvisorProps {
  walletAddress: string;
  sourceChain: string;
  targetChain: string;
  tokenSelectedSymbolName: string;
}

export default function SukiAdvisor({
  walletAddress,
  sourceChain,
  targetChain,
  tokenSelectedSymbolName
}: SukiAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "crust",
      text: "Shelly greetings! I'm Clawdy, your smart Crust Fund advisor! Ask me anything about cross-chain gas pinching, swapping, or let Clawdy forecast your crypto tide today! 🦞🌊🫧",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quick prompt templates
  const SUGGESTIONS = [
    { text: "🔮 Forecast today's crypto tide!", short: "Sea Tide Forecast" },
    { text: "🧠 Explain how to pinch bridging gas fees!", short: "Pinch Gas Fees" },
    { text: "🌸 What is SUKI Token?", short: "SUKI Token" },
    { text: "⚡ Best reef route to bridge to Base?", short: "Base Reef Route" }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/crust-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: {
            walletAddress,
            chains: `${sourceChain} to ${targetChain}`,
            tokenSelected: tokenSelectedSymbolName
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        const sukiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "crust",
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, sukiMsg]);
      } else {
        throw new Error(data.error || "Failed communication");
      }
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "crust",
        text: "Uh oh! Clawdy's telepathic sonar connection had an error! ~w~ Please make sure GEMINI_API_KEY is defined in AI Studio Secrets! ✨🦞",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-pink-100 rounded-3xl p-5 shadow-xl shadow-pink-150/20 flex flex-col h-[460px] relative overflow-hidden">
      {/* Decorative top pink bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-300"></div>

      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-pink-50 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-slate-800 text-sm">Clawdy's AI Crust-Fund Advisor</h3>
            <p className="font-mono text-[9px] text-emerald-500 font-extrabold flex items-center gap-1 leading-none mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              GEMINI 3.5 FLASH ENGINE ACTIVE
            </p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 scrollbar-thin scrollbar-thumb-pink-100 mb-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-sm ${
                msg.sender === "user"
                  ? "bg-slate-100 text-slate-600 border border-slate-200"
                  : "bg-pink-100 text-pink-600 border border-pink-200"
              }`}
            >
              {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : "🦞"}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col max-w-[80%] ${msg.sender === "user" ? "items-end" : ""}`}>
              <div
                className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-sans leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-150/10 rounded-tr-none"
                    : "bg-pink-50/70 text-slate-700 border border-pink-100/30 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 font-mono">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-xs shadow-sm">
              🦞
            </div>
            <div className="bg-rose-50/30 border border-rose-50 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
              Clawdy is consulting the deep sea reefs...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Accelerator Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug.text}
            onClick={() => sendMessage(sug.text)}
            disabled={isLoading}
            className="px-2.5 py-1.5 rounded-xl border border-pink-100/50 hover:border-pink-300 hover:bg-pink-50/40 text-[10px] font-sans font-semibold text-slate-600 transition cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3 h-3 text-pink-400" />
            {sug.short}
          </button>
        ))}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Clawdy (e.g. Is Base gas cheap?)..."
          disabled={isLoading}
          className="flex-1 bg-slate-50 border border-slate-250 focus:border-pink-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-0 text-slate-700"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className={`px-3.5 rounded-xl text-white shadow-md flex items-center justify-center transition cursor-pointer ${
            isLoading || !inputText.trim()
              ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600 shadow-pink-100"
          }`}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
