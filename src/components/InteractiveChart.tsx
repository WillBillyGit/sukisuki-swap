import React, { useState } from "react";
import { Star, TrendingUp, Sparkles, Filter } from "lucide-react";

interface ChartDataPoint {
  time: string;
  price: number;
}

const DATA_24H: ChartDataPoint[] = [
  { time: "00:00", price: 0.078 },
  { time: "04:00", price: 0.081 },
  { time: "08:00", price: 0.079 },
  { time: "12:00", price: 0.084 },
  { time: "16:00", price: 0.082 },
  { time: "20:00", price: 0.086 },
  { time: "24:00", price: 0.083 },
];

const DATA_7D: ChartDataPoint[] = [
  { time: "Mon", price: 0.071 },
  { time: "Tue", price: 0.074 },
  { time: "Wed", price: 0.079 },
  { time: "Thu", price: 0.076 },
  { time: "Fri", price: 0.082 },
  { time: "Sat", price: 0.085 },
  { time: "Sun", price: 0.083 },
];

const DATA_30D: ChartDataPoint[] = [
  { time: "Day 1", price: 0.062 },
  { time: "Day 5", price: 0.065 },
  { time: "Day 10", price: 0.070 },
  { time: "Day 15", price: 0.074 },
  { time: "Day 20", price: 0.078 },
  { time: "Day 25", price: 0.082 },
  { time: "Day 30", price: 0.083 },
];

export default function InteractiveChart() {
  const [activeTab, setActiveTab] = useState<"24H" | "7D" | "30D">("24H");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeData =
    activeTab === "24H" ? DATA_24H : activeTab === "7D" ? DATA_7D : DATA_30D;

  // Dynamically compute historical ratchet floor points
  let runningFloor = 0;
  const floorData = activeData.map((d, index) => {
    const rawFloor = d.price * 0.68;
    if (index === 0) {
      runningFloor = rawFloor;
    } else {
      runningFloor = Math.max(runningFloor, rawFloor);
    }
    return { time: d.time, price: runningFloor };
  });

  const allPrices = [...activeData.map((d) => d.price), ...floorData.map((d) => d.price)];
  const minPrice = Math.min(...allPrices) * 0.95;
  const maxPrice = Math.max(...allPrices) * 1.05;
  const priceRange = maxPrice - minPrice;

  // Chart SVG bounds
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  // Map trading data to SVG points
  const points = activeData.map((d, index) => {
    const x = paddingX + (index * (width - 2 * paddingX)) / (activeData.length - 1);
    const y = height - paddingY - ((d.price - minPrice) * (height - 2 * paddingY)) / priceRange;
    return { x, y, price: d.price, time: d.time };
  });

  // Map floor data to SVG points
  const floorSvgPoints = floorData.map((d, index) => {
    const x = paddingX + (index * (width - 2 * paddingX)) / (floorData.length - 1);
    const y = height - paddingY - ((d.price - minPrice) * (height - 2 * paddingY)) / priceRange;
    return { x, y, price: d.price, time: d.time };
  });

  // Create SVG path string for trading price (Line 1)
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Curve points smoothly
      const xc = (points[i - 1].x + points[i].x) / 2;
      const yc = (points[i - 1].y + points[i].y) / 2;
      pathD += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${xc} ${yc}`;
      if (i === points.length - 1) {
        pathD += ` T ${points[i].x} ${points[i].y}`;
      }
    }
  }

  // Create SVG path string for floor price (Line 2 - stays flat or ratchets up)
  let floorPathD = "";
  if (floorSvgPoints.length > 0) {
    floorPathD = `M ${floorSvgPoints[0].x} ${floorSvgPoints[0].y}`;
    for (let i = 1; i < floorSvgPoints.length; i++) {
      floorPathD += ` L ${floorSvgPoints[i].x} ${floorSvgPoints[i].y}`;
    }
  }

  // Create Area under the trading line SVG path string
  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${
          height - paddingY
        } Z`
      : "";

  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : null;
  const hoveredFloorPoint = hoverIndex !== null ? floorSvgPoints[hoverIndex] : null;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-pink-100 rounded-3xl p-5 shadow-xl shadow-pink-100/25 relative overflow-hidden flex flex-col h-[320px]">
      {/* Decorative left purple border */}
      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-indigo-500 via-pink-400 to-rose-300"></div>

      {/* Header and stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-pink-500 text-lg">🌸</span>
            <span className="font-sans font-extrabold text-sm text-slate-800">SUKI/USDC Value Feed</span>
            <span className="ml-1.5 flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold">
              <TrendingUp className="w-2.5 h-2.5" />
              +5.42%
            </span>
            <span className="ml-1 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-bold">
              Asymmetric Ratchet v3
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] uppercase font-mono text-blue-500 font-bold">Trading:</span>
              <span className="font-sans text-xl font-bold text-slate-800">
                {hoveredPoint ? `$${hoveredPoint.price.toFixed(3)}` : "$0.082"}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] uppercase font-mono text-emerald-600 font-bold">Floor Price:</span>
              <span className="font-sans text-base font-extrabold text-emerald-600">
                {hoveredFloorPoint ? `$${hoveredFloorPoint.price.toFixed(4)}` : `$${(0.082 * 0.68).toFixed(4)}`}
              </span>
            </div>
            <span className="text-slate-400 text-[10px] font-mono">
              {hoveredPoint ? `at ${hoveredPoint.time}` : "ocean average"}
            </span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center border border-pink-100 rounded-xl overflow-hidden bg-white/50 p-0.5 shadow-sm">
          {(["24H", "7D", "30D"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setHoverIndex(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition cursor-pointer ${
                activeTab === tab
                  ? "bg-pink-500 text-white shadow-sm"
                  : "hover:bg-pink-50 text-slate-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Legend Block */}
      <div className="flex gap-4 mb-3 text-[10px] font-sans font-bold text-slate-500 border-b border-rose-50 pb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Trading Price (Blue Wave)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Hard Shell Floor (Solid Green Ratchet)</span>
        </div>
      </div>

      {/* Live Chart Canvas Area */}
      <div className="flex-1 min-h-[160px] relative w-full flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Soft blue area gradient representing trading wave */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
            </linearGradient>

            {/* Glowing line gradient (Royal Blue to Indigo) */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={(paddingY + height - paddingY) / 2}
            x2={width - paddingX}
            y2={(paddingY + height - paddingY) / 2}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Render Area path */}
          {areaD && <path d={areaD} fill="url(#chartGradient)" />}

          {/* Render Floor Line path (Solid Green Hard Floor) */}
          {floorPathD && (
            <path
              d={floorPathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Render Trading Line path (Blue Line) */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Invisible interactive vertical segments */}
          {points.map((pt, idx) => {
            const segmentWidth = (width - 2 * paddingX) / points.length;
            return (
              <rect
                key={idx}
                x={pt.x - segmentWidth / 2}
                y={0}
                width={segmentWidth}
                height={height}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            );
          })}

          {/* Active tooltip marker */}
          {hoveredPoint && (
            <>
              {/* Highlight dash vertical line */}
              <line
                x1={hoveredPoint.x}
                y1={paddingY}
                x2={hoveredPoint.x}
                y2={height - paddingY}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Trading Point core glow circle (Blue) */}
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="shadow-md"
              />
            </>
          )}

          {/* Floor Point core glow circle (Green) */}
          {hoveredFloorPoint && (
            <circle
              cx={hoveredFloorPoint.x}
              cy={hoveredFloorPoint.y}
              r="6"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="shadow-md"
            />
          )}

          {/* X Axis Labels */}
          {points.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={height - 2}
              textAnchor="middle"
              className="text-[9px] font-mono fill-slate-400 font-semibold"
            >
              {pt.time}
            </text>
          ))}
        </svg>

        {/* Small background star sparkles */}
        <div className="absolute top-4 left-6 shrink-0 text-amber-200 opacity-60">
          <Star className="w-3.5 h-3.5 fill-amber-150 animate-bounce duration-5000" />
        </div>
        <div className="absolute bottom-6 right-6 shrink-0 text-pink-300 opacity-50">
          <Sparkles className="w-3 h-3 animate-ping" />
        </div>
      </div>
    </div>
  );
}
