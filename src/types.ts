export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  logoUrl?: string;
  address?: string;
}

export interface Chain {
  id: string;
  name: string;
  logoUrl?: string;
  tokens: Token[];
  explorerUrl?: string;
}

export interface BridgeTx {
  id: string;
  timestamp: string;
  sourceChain: string;
  targetChain: string;
  sourceToken: string;
  targetToken: string;
  amount: string;
  status: "pending" | "completed" | "failed";
  hash?: string;
}
