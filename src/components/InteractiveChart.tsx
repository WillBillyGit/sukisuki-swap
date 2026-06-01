import React, { useState } from "react";
import { Sliders, HelpCircle, Activity } from "lucide-react";

export default function InteractiveChart() {
  const [supply, setSupply] = useState(500000);
  const [curveBeta, setCurveBeta] = useState(0.00001); // ratchet factor

  // Generate bonding curve path coordinates
  const generatePoints = () => {
    const points = [];
    const step = 100000;
    for (let x = 0; x <= 1000000; x += step) {
      // price rises exponentially as a ratchet function of supply
      const price = 0.005 + Math.pow(x, 1.6) * curveBeta * 0.00000001;
      points.push({ x, price });
    }
    return points;
  };

  const points = generatePoints();
  const currentPrice = 0.005 + Math.pow(supply, 1.6) * curveBeta * 0.00000001;

  // Render variables for SVG scaling
  const width = 450;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };

  const maxValX = 1000000;
  const maxValY = Math.max(...points.map((p) => p.price)) * 1.15;

  const getSvgX = (xVal: number) => {
    return padding.left + (xVal / maxValX) * (width - padding.left - padding.right);
  };

  const getSvgY = (yVal: number) => {
    return height - padding.bottom - (yVal / maxValY) * (height - padding.top - padding.bottom);
  };

  // Build SVG Path
  const currentSvgPoints = points.map((p) => `${getSvgX(p.x)},${getSvgY(p.price)}`).join(" ");

  return (
    <div id="interactive-ratchet-chart" class="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col gap-5">
      <div class="flex items-center justify-between border-b border-slate-50 pb-4">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Activity class="w-4 h-4" />
          </div>
          <div>
            <h4 class="font-sans font-bold text-xs text-slate-800">ASYNCHRONOUS RATCHET BONDING CURVE</h4>
            <p class="font-sans text-[10px] text-slate-400 mt-0.5">Automated on-chain price curves bypass AMM routers</p>
          </div>
        </div>
        <HelpCircle class="w-4 h-4 text-slate-300 cursor-help" />
      </div>

      {/* Bonding Curve Plot SVG */}
      <div class="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 relative">
        <svg viewBox={`0 0 ${width} ${height}`} class="w-full h-auto">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={getSvgY((maxValY / 1.15) * ratio)}
              x2={width - padding.right}
              y2={getSvgY((maxValY / 1.15) * ratio)}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
            />
          ))}

          {/* Polyline Bonding Curve */}
          <polyline
            fill="none"
            stroke="url(#curve-grad)"
            strokeWidth="3.5"
            points={currentSvgPoints}
            strokeLinecap="round"
          />

          {/* Fill under the curve */}
          <path
            d={`M ${getSvgX(0)} ${getSvgY(0)} 
                ${points.map((p) => `L ${getSvgX(p.x)} ${getSvgY(p.price)}`).join(" ")} 
                L ${getSvgX(maxValX)} ${getSvgY(0)} Z`}
            fill="url(#area-grad)"
            opacity="0.1"
          />

          {/* Cursor Point */}
          <g>
            <circle
              cx={getSvgX(supply)}
              cy={getSvgY(currentPrice)}
              r="7"
              fill="#e11d48"
              stroke="#ffffff"
              strokeWidth="2.5"
              class="animate-pulse shadow"
            />
            <line
              x1={getSvgX(supply)}
              y1={getSvgY(0)}
              x2={getSvgX(supply)}
              y2={getSvgY(currentPrice)}
              stroke="#e11d48"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </g>

          {/* Define Color Gradients */}
          <defs>
            <linearGradient id="curve-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>

          {/* Axis labels */}
          <text x={padding.left - 8} y={getSvgY(0) + 4} textAnchor="end" class="fill-slate-400 text-[8px] font-mono">0.00</text>
          <text x={padding.left - 8} y={getSvgY(maxValY / 2) + 4} textAnchor="end" class="fill-slate-400 text-[8px] font-mono">
            {(maxValY / 2).toFixed(4)}
          </text>
          <text x={padding.left - 8} y={getSvgY(maxValY / 1.15) + 4} textAnchor="end" class="fill-slate-400 text-[8px] font-mono">
            {(maxValY / 1.15).toFixed(4)}
          </text>

          <text x={getSvgX(0)} y={height - 24} textAnchor="middle" class="fill-slate-400 text-[8px] font-mono">0</text>
          <text x={getSvgX(500000)} y={height - 24} textAnchor="middle" class="fill-slate-400 text-[8px] font-mono">500K</text>
          <text x={getSvgX(1000000)} y={height - 24} textAnchor="middle" class="fill-slate-400 text-[8px] font-mono">1M</text>
          
          <text x={width / 2} y={height - 8} textAnchor="middle" class="fill-slate-500 text-[9px] font-sans font-bold">Circulating Supply (SUKI)</text>
        </svg>
      </div>

      {/* Sliders to simulate changes */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-sans text-[10px] font-bold text-slate-500 flex justify-between">
            <span>SIMULATED OUTSTANDING SUPPLY</span>
            <span class="text-indigo-650 font-mono text-[11px]">{(supply / 1000).toFixed(0)}K SUKI</span>
          </label>
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={supply}
            onChange={(e) => setSupply(Number(e.target.value))}
            class="w-full accent-indigo-600 cursor-ew-resize bg-slate-100 rounded-lg appearance-none h-1.5"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-sans text-[10px] font-bold text-slate-500 flex justify-between">
            <span>RATCHET SLIPPAGE MULTIPLIER (BETA)</span>
            <span class="text-indigo-655 font-mono text-[11px]">{(curveBeta * 100000).toFixed(0)}x</span>
          </label>
          <input
            type="range"
            min="0.000005"
            max="0.00002"
            step="0.000001"
            value={curveBeta}
            onChange={(e) => setCurveBeta(Number(e.target.value))}
            class="w-full accent-indigo-600 cursor-ew-resize bg-slate-100 rounded-lg appearance-none h-1.5"
          />
        </div>
      </div>

      {/* Info Stats */}
      <div class="grid grid-cols-3 gap-3 text-center border-t border-slate-50 pt-4">
        <div class="flex flex-col gap-1">
          <span class="font-sans text-[9px] text-slate-400 font-bold uppercase">Token Price (ETH)</span>
          <span class="font-mono text-xs font-bold text-slate-800">{currentPrice.toFixed(6)} ETH</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-sans text-[9px] text-slate-400 font-bold uppercase">Liquidity Depth</span>
          <span class="font-mono text-xs font-bold text-pink-600">On-Chain Locked</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-sans text-[9px] text-slate-400 font-bold uppercase">Market Capitalization</span>
          <span class="font-mono text-xs font-bold text-slate-800">{(currentPrice * supply).toFixed(2)} ETH</span>
        </div>
      </div>
    </div>
  );
}
