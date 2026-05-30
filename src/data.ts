import { Chain } from "./types";

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "🪙",
    color: "bg-indigo-500",
    explorerUrl: "https://etherscan.io/tx",
    isSupported: true,
    tokens: [
      { id: "eth", symbol: "ETH", name: "Ether", icon: "🪙", decimals: 18, priceUsd: 3420.5, balance: 1.24 },
      { id: "suki", symbol: "SUKI", name: "Suki Token", icon: "🌸", decimals: 18, priceUsd: 0.082, balance: 4500 },
      { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0, balance: 350.5 },
      { id: "usdt", symbol: "USDT", name: "Tether USD", icon: "🟢", decimals: 6, priceUsd: 1.0, balance: 120.0 }
    ]
  },
  {
    id: "base",
    name: "Base",
    icon: "🔵",
    color: "bg-blue-600",
    explorerUrl: "https://basescan.org/tx",
    isSupported: true,
    tokens: [
      { id: "eth", symbol: "ETH", name: "Ether", icon: "🪙", decimals: 18, priceUsd: 3418.9, balance: 0.45 },
      { id: "suki", symbol: "SUKI", name: "Suki Token", icon: "🌸", decimals: 18, priceUsd: 0.082, balance: 12800 },
      { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0, balance: 1540.2 },
      { id: "coin", symbol: "COIN", name: "Coinbase Token", icon: "🛡️", decimals: 18, priceUsd: 210.4, balance: 3.5 }
    ]
  },
  {
    id: "arbitrum",
    name: "Arbitrum One",
    icon: "⛓️",
    color: "bg-sky-500",
    explorerUrl: "https://arbiscan.io/tx",
    isSupported: true,
    tokens: [
      { id: "eth", symbol: "ETH", name: "Ether", icon: "🪙", decimals: 18, priceUsd: 3420.1, balance: 0.89 },
      { id: "arb", symbol: "ARB", name: "Arbitrum Token", icon: "💜", decimals: 18, priceUsd: 1.12, balance: 240.0 },
      { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0, balance: 50.0 },
      { id: "suki", symbol: "SUKI", name: "Suki Token", icon: "🌸", decimals: 18, priceUsd: 0.082, balance: 300 }
    ]
  },
  {
    id: "optimism",
    name: "Optimism",
    icon: "🔴",
    color: "bg-red-500",
    explorerUrl: "https://optimistic.etherscan.io/tx",
    isSupported: true,
    tokens: [
      { id: "eth", symbol: "ETH", name: "Ether", icon: "🪙", decimals: 18, priceUsd: 3420.2, balance: 0.12 },
      { id: "op", symbol: "OP", name: "Optimism Token", icon: "🔴", decimals: 18, priceUsd: 2.41, balance: 85.0 },
      { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0, balance: 10.0 }
    ]
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "💜",
    color: "bg-purple-600",
    explorerUrl: "https://polygonscan.com/tx",
    isSupported: true,
    tokens: [
      { id: "pol", symbol: "POL", name: "Polygon Ecosystem Token", icon: "🌀", decimals: 18, priceUsd: 0.45, balance: 154.5 },
      { id: "matic", symbol: "MATIC", name: "MATIC", icon: "💜", decimals: 18, priceUsd: 0.45, balance: 350.0 },
      { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0, balance: 41.2 }
    ]
  },
  {
    id: "avax",
    name: "Avalanche",
    icon: "🔺",
    color: "bg-rose-600",
    explorerUrl: "https://snowtrace.io/tx",
    isSupported: true,
    tokens: [
      { id: "avax", symbol: "AVAX", name: "Avalanche Token", icon: "🔺", decimals: 18, priceUsd: 34.5, balance: 14.2 },
      { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0, balance: 180.0 }
    ]
  },
  {
    id: "bsc",
    name: "BNB Chain",
    icon: "🟡",
    color: "bg-yellow-500",
    explorerUrl: "https://bscscan.com/tx",
    isSupported: true,
    tokens: [
      { id: "bnb", symbol: "BNB", name: "BNB", icon: "🟡", decimals: 18, priceUsd: 580.4, balance: 1.15 },
      { id: "cake", symbol: "CAKE", name: "PancakeSwap Token", icon: "🥞", decimals: 18, priceUsd: 2.85, balance: 12.0 }
    ]
  },
  {
    id: "kaia",
    name: "Kaia Testnet Kairos",
    icon: "🟢",
    color: "bg-emerald-600",
    explorerUrl: "https://kairos.kaiascan.io/tx",
    isSupported: true,
    tokens: [
      { id: "kaia", symbol: "KAIA", name: "Kaia Token", icon: "🟢", decimals: 18, priceUsd: 0.142, balance: 520.0 },
      { id: "suki", symbol: "SUKI", name: "Suki Token", icon: "🌸", decimals: 18, priceUsd: 0.082, balance: 25000 },
      { id: "usdc", symbol: "USDC", name: "USD Coin", icon: "💵", decimals: 6, priceUsd: 1.0, balance: 140.0 }
    ]
  }
];

export const SUKI_CHART_DATA = [
  { time: "00:00", price: 0.078 },
  { time: "04:00", price: 0.081 },
  { time: "08:00", price: 0.079 },
  { time: "12:00", price: 0.083 },
  { time: "16:00", price: 0.082 },
  { time: "20:00", price: 0.085 },
  { time: "24:00", price: 0.082 }
];
