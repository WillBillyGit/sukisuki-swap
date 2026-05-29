export interface Token {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  decimals: number;
  priceUsd: number;
  balance: number;
}

export interface Chain {
  id: string;
  name: string;
  icon: string;
  color: string;
  rpcUrl?: string;
  explorerUrl: string;
  isSupported: boolean;
  tokens: Token[];
}

export interface BridgeTx {
  id: string;
  sourceChain: string;
  targetChain: string;
  tokenSymbol: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  timestamp: string;
  hash: string;
  estimatedArrivalSeconds: number;
  secondsElapsed: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "suki" | "crust";
  text: string;
  timestamp: string;
}
