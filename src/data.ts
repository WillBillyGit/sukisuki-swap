import { Chain } from "./types";

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: "8453",
    name: "Base Mainnet",
    logoUrl: "⚡",
    explorerUrl: "https://basescan.org",
    tokens: [
      { symbol: "ETH", name: "Ethereum", decimals: 18, balance: "100" },
      { symbol: "USDC", name: "USD Coin", decimals: 6, balance: "1000" },
      { symbol: "SUKI", name: "Suki Token", decimals: 18, balance: "0" }
    ]
  },
  {
    id: "8217",
    name: "Kaia Mainnet",
    logoUrl: "🌸",
    explorerUrl: "https://kaiascan.io",
    tokens: [
      { symbol: "KAIA", name: "Kaia", decimals: 18, balance: "250" },
      { symbol: "USDT", name: "Tether", decimals: 6, balance: "500" },
      { symbol: "SUKI", name: "Suki Token", decimals: 18, balance: "0" }
    ]
  },
  {
    id: "1001",
    name: "Kaia Kairos",
    logoUrl: "🐾",
    explorerUrl: "https://kairos.kaiascan.io",
    tokens: [
      { symbol: "KAIA", name: "Kaia Kairos", decimals: 18, balance: "1000" },
      { symbol: "SUKI", name: "Suki Token", decimals: 18, balance: "50" }
    ]
  },
  {
    id: "1",
    name: "Ethereum Mainnet",
    logoUrl: "⧫",
    explorerUrl: "https://etherscan.io",
    tokens: [
      { symbol: "ETH", name: "Ethereum", decimals: 18, balance: "0.5" },
      { symbol: "USDC", name: "USD Coin", decimals: 6, balance: "100" }
    ]
  }
];
