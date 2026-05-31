import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart } from "lucide-react";

interface SukiCharacterProps {
  reaction: string;
  avatarUrl?: string;
  onSukiClick?: () => void;
}

export default function SukiCharacter({ reaction, onSukiClick }: SukiCharacterProps) {
  const [clickCount, setClickCount] = useState(0);
  const [isSqueaking, setIsSqueaking] = useState(false);
  const [floatingItems, setFloatingItems] = useState<{ id: number; x: number; y: number; type: string }[]>([]);

  // The generated mascot image
  const sukiImagePath = "/assets/images/cute_lobster_mascot_1780015611645.png";

  const handleSukiClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setClickCount((prev) => prev + 1);
    setIsSqueaking(true);
    setTimeout(() => setIsSqueaking(false), 800);

    // Create a floating feedback item (a heart or star at relative click location)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const items = ["🦞", "✨", "🫧", "🌊", "🐚", "💖"];
    const randomItem = items[Math.floor(Math.random() * items.length)];

    const newItem = {
      id: Date.now(),
      x,
      y,
      type: randomItem
    };

    setFloatingItems((prev) => [...prev, newItem]);
    setTimeout(() => {
      setFloatingItems((prev) => prev.filter((item) => item.id !== newItem.id));
    }, 1500);

    if (onSukiClick) {
      onSukiClick();
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none justify-center h-full min-h-[350px]">
      {/* Dynamic Suki Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={reaction}
          initial={{ opacity: 0, y: 15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 bg-white border border-pink-100 px-5 py-3 rounded-2xl shadow-xl shadow-pink-100/40 text-center max-w-[280px]"
        >
          {/* Triangular Tail */}
          <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-pink-100 rotate-45"></div>
          <p className="font-sans text-sm text-slate-700 font-medium leading-relaxed">
            {reaction}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Main Interactive Mascot Container */}
      <motion.div
        id="suki-mascot-element"
        onClick={handleSukiClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isSqueaking ? { y: [0, -25, 5, -5, 0] } : { y: [0, -8, 0] }}
        transition={
          isSqueaking
            ? { duration: 0.7, ease: "easeInOut" }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative cursor-pointer w-64 h-64 md:w-72 md:h-72 mt-8 flex items-center justify-center bg-gradient-to-b from-pink-50/50 to-purple-50/50 rounded-full border border-pink-100/50 p-6 shadow-indigo-100/20 shadow-inner"
      >
        {/* Glow Ring effect */}
        <div className="absolute inset-0 rounded-full bg-radial-gradient from-pink-200/20 via-transparent to-transparent animate-pulse duration-3000"></div>

        {/* Mascot Photo */}
        <img
          src={sukiImagePath}
          alt="Clawdy Mascot"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.15)] z-2"
        />

        {/* Cute celestial pet feedback text */}
        <AnimatePresence>
          {isSqueaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1.2, y: -40 }}
              exit={{ opacity: 0, y: -80 }}
              className="absolute font-sans font-extrabold text-pink-500 text-lg select-none z-3 pointer-events-none drop-shadow-md text-center"
            >
              {clickCount % 3 === 0 ? "♥ Pinch! ♥ 🦞" : clickCount % 3 === 1 ? "✨ Shell-tacular! ✨" : "♥ Click Clack! ♥ 🦀"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating feedback particles */}
        {floatingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, x: item.x - 120, y: item.y - 120, scale: 0.8 }}
            animate={{ opacity: 0, y: item.y - 220, scale: 1.5, rotate: [0, 45, -45, 0] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute z-10 text-2xl pointer-events-none"
          >
            {item.type}
          </motion.div>
        ))}

        {/* Floating token items in orbit around Suki */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Orbital token bubbles */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-pink-50 flex items-center justify-center text-lg pointer-events-auto hover:scale-110 transition">
            🌸
          </div>
          <div className="absolute top-1/4 -right-3 w-10 h-10 rounded-full bg-white shadow-md border border-blue-50 flex items-center justify-center text-lg pointer-events-auto hover:scale-110 transition">
            🪙
          </div>
          <div className="absolute bottom-1/4 -left-3 w-10 h-10 rounded-full bg-white shadow-md border border-violet-50 flex items-center justify-center text-lg pointer-events-auto hover:scale-110 transition">
            💵
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-amber-50 flex items-center justify-center text-lg pointer-events-auto hover:scale-110 transition">
            🌀
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Mascot Label */}
      <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 rounded-full shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin duration-4000" />
        <span className="font-mono text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-600 bg-clip-text text-transparent">
          CLAW-SOME ENGINE ACTIVE
        </span>
        <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
      </div>
    </div>
  );
}
