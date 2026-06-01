import React from "react";
import { Sparkles, Heart } from "lucide-react";
import { motion } from "motion/react";

interface SukiCharacterProps {
  reaction: string;
  isSandbox: boolean;
}

export default function SukiCharacter({ reaction, isSandbox }: SukiCharacterProps) {
  return (
    <div id="suki-character-frame" class="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
      {/* Background soft glow decoration */}
      <div class="absolute -top-16 -left-16 w-36 h-36 bg-pink-100 rounded-full blur-2xl opacity-60"></div>
      <div class="absolute -bottom-16 -right-16 w-36 h-36 bg-violet-100 rounded-full blur-2xl opacity-60"></div>

      {/* Suki Avatar Illustration with micro-animations */}
      <div class="relative shrink-0 select-none">
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, 1.5, -1.5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          class="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-300 via-rose-200 to-indigo-300 p-1 shadow-md flex items-center justify-center relative cursor-pointer"
        >
          {/* Cute anime cat emoji avatar */}
          <div class="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl relative overflow-hidden">
            🌸🐱🌸
          </div>
          <div class="absolute -bottom-1 -right-1 bg-pink-550 text-white rounded-full p-1 border-2 border-white shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
        </motion.div>
      </div>

      {/* Comic bubble style conversation dialog */}
      <div class="flex-1 relative">
        <div class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 relative min-h-[4.5rem] flex items-center">
          {/* Talking bubble arrow */}
          <div class="absolute left-1/2 -top-2 md:-left-2 md:top-1/2 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 w-4 h-4 bg-slate-50 border-t border-l border-slate-100 rotate-45 md:-rotate-45"></div>
          
          <div class="relative z-10 w-full text-center md:text-left">
            <div class="flex items-center gap-1.5 justify-center md:justify-start text-xs font-bold text-pink-600 mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>SUKI RAT-BRIDGE COMMANDER</span>
              <span class="text-[9px] bg-indigo-100 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded ml-1.5">
                {isSandbox ? "SANDBOX MODE" : "BASE SECURE"}
              </span>
            </div>
            <p class="font-sans text-xs font-medium text-slate-700 leading-relaxed italic">
              "{reaction || "Ready to execute the quantum curve, captain! Connect base to mint real tokens.🐾"}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
