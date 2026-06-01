import React, { useState } from "react";
import { Token, Chain, BridgeTx } from "../types";
import { Shield, Sparkles, AlertCircle, CheckCircle2, ChevronDown, ArrowRightLeft, Loader2, ArrowUpRight } from "lucide-react";
import { getContract, prepareContractCall, createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";

// Helper function to safely parse Ether to Wei as a BigInt, avoiding third-party dependency issues
function customParseEther(val: string): bigint {
  const cleanVal = (val || "").trim();
  if (!cleanVal || isNaN(parseFloat(cleanVal))) return 0n;
  try {
    const parts = cleanVal.split(".");
    const whole = parts[0] || "0";
    let fraction = parts[1] || "";
    fraction = fraction.slice(0, 18).padEnd(18, "0");
    return BigInt(whole) * 1000000000000000000n + BigInt(fraction);
  } catch {
    return BigInt(Math.floor(parseFloat(cleanVal) * 1e18));
  }
}

interface BridgeSwapFormProps {
  chains: Chain[];
  selectedSourceChain: Chain;
  setSelectedSourceChain: (chain: Chain) => void;
  selectedTargetChain: Chain;
  setSelectedTargetChain: (chain: Chain) => void;
  selectedSourceTokenSymbol: string;
  setSelectedSourceTokenSymbol: (sym: string) => void;
  selectedTargetTokenSymbol: string;
  setSelectedTargetTokenSymbol: (sym: string) => void;
  payAmount: string;
  setPayAmount: (val: string) => void;
  onInputValueChange: (val: string) => void;
  onSwapExecute: (hash: string) => void;
  walletAddress: string;
  onConnectWallet: () => void;
  swapMode: "sandbox" | "onchain";
  onAddLog: (log: BridgeTx) => void;
  onSukiReactionChange: (react: string) => void;
}

export default function BridgeSwapForm({
  chains,
  selectedSourceChain,
  setSelectedSourceChain,
  selectedTargetChain,
  setSelectedTargetChain,
  selectedSourceTokenSymbol,
  setSelectedSourceTokenSymbol,
  selectedTargetTokenSymbol,
  setSelectedTargetTokenSymbol,
  payAmount,
  setPayAmount,
  onInputValueChange,
  onSwapExecute,
  walletAddress,
  onConnectWallet,
  swapMode,
  onAddLog,
  onSukiReactionChange
}: BridgeSwapFormProps) {
  const [isSimulatingSwap, setIsSimulatingSwap] = useState(false);
  const [customContractAddress, setCustomContractAddress] = useState("0xYOUR_ACTUAL_CONTRACT_ADDRESS");
  const [callableMethod, setCallableMethod] = useState("buyTokens"); // or "mint"

  // Initialize thirdweb client
  const client = createThirdwebClient({
    clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "d2ebf97dd1b46297647525a6dda30e88"
  });

  // Load custom contract instance using Thirdweb v5 SDk getContract (points to Base Mainnet by default)
  const contract = getContract({
    client,
    chain: base,
    // Deployed Asymmetrical Ratchet Curve Contract Address
    address: customContractAddress.startsWith("0xYOUR") 
      ? "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" // fallback pool token or weth for safe sandbox checks
      : customContractAddress,
  });

  // Thirdweb hook to trigger wallet transactions
  const { mutateAsync: sendTransaction, isPending: txIsPending, error: txError } = useSendTransaction();
  const [txReceiptHash, setTxReceiptHash] = useState<string | null>(null);

  const activeAccount = useActiveAccount();

  // Execute Swap/Mint process
  const handleExecuteAction = async () => {
    if (!payAmount || parseFloat(payAmount) <= 0) {
      alert("Please specify a valid output amount of ETH to exchange.");
      return;
    }

    if (swapMode === "onchain") {
      // Direct On-Chain Contract execution using Thirdweb Client
      if (!activeAccount) {
        alert("Please connect your external browser wallet (MetaMask, Coinbase, etc.) to proceed with the transaction.");
        return;
      }

      onSukiReactionChange("Awaiting your approval in MetaMask... Confirm the direct contract transaction! 🛡️⚡");

      try {
        // Parse the pay amount into custom BigInt Wei
        const parsedValue = customParseEther(payAmount);

        // Build the prepared contract call targeting our mint/buy payable functions
        const transaction = prepareContractCall({
          contract,
          method: `function ${callableMethod}() payable`,
          value: parsedValue,
        });

        // Trigger the signature request
        const txResult = await sendTransaction(transaction);
        const hash = txResult.transactionHash;

        setTxReceiptHash(hash);
        onSwapExecute(hash);

        // Add history log
        onAddLog({
          id: Math.random().toString(),
          timestamp: new Date().toISOString(),
          sourceChain: selectedSourceChain.name,
          targetChain: selectedTargetChain.name,
          sourceToken: selectedSourceTokenSymbol,
          targetToken: selectedTargetTokenSymbol,
          amount: payAmount,
          status: "completed",
          hash: hash,
        });

        onSukiReactionChange(`Yay! Injected Ratchet Transaction successfully minted! Hash: ${hash.substring(0, 8)}... 🌸🐾🌊`);
      } catch (err: any) {
        console.error("Direct contract transaction failed:", err);
        onSukiReactionChange(`Oh no! On-chain transaction failed: ${err.message || err}. Double check your Base network settings!`);
      }
    } else {
      // Sandbox Simulator Faucet swaps
      setIsSimulatingSwap(true);
      onSukiReactionChange("Securing bridge pathways... Spinning up faucet mint counters! 🌸");

      setTimeout(() => {
        setIsSimulatingSwap(false);
        const simulatedHash = "0x" + Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join("");

        onSwapExecute(simulatedHash);

        // Add transaction log
        onAddLog({
          id: Math.random().toString(),
          timestamp: new Date().toISOString(),
          sourceChain: selectedSourceChain.name,
          targetChain: selectedTargetChain.name,
          sourceToken: selectedSourceTokenSymbol,
          targetToken: selectedTargetTokenSymbol,
          amount: payAmount,
          status: "completed",
          hash: simulatedHash,
        });

        onSukiReactionChange(`Simulation complete! Successfully swapped ${payAmount} ${selectedSourceTokenSymbol} to ${selectedTargetTokenSymbol}! 🐾✨`);
      }, 1800);
    }
  };

  return (
    <div id="bridge-swap-form-container" class="bg-white rounded-3xl p-6 border border-pink-100 shadow-xl flex flex-col gap-6 relative overflow-hidden">
      {/* Visual top border */}
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-rose-300 to-indigo-500"></div>

      {/* Header section with swap modes */}
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-50">
        <div>
          <h3 class="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-pink-500" />
            <span>{swapMode === "onchain" ? "Production On-Chain Safe" : "Sandbox Faucet Protocol"}</span>
          </h3>
          <p class="font-sans text-[10px] text-slate-400 mt-1 max-w-sm">
            {swapMode === "onchain" 
              ? "Routing direct payable ETH transactions to your customized Asymmetrical Ratchet Curve smart contract."
              : "Simulate non-custodial bridges directly with zero-gas and infinite simulated faucet balances."}
          </p>
        </div>

        <div class="bg-slate-50 text-slate-600 px-3 py-1 rounded-xl text-[9px] font-bold font-mono border border-slate-100 uppercase">
          {swapMode === "onchain" ? "BASE MAINNET" : "DEMO FAUCET MODE"}
        </div>
      </div>

      {/* On-Chain Custom Contract configuration addresses */}
      {swapMode === "onchain" && (
        <div class="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/60 flex flex-col gap-3">
          <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Asymmetrical Ratchet Contract Registry</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="font-sans text-[10px] font-bold text-slate-400 uppercase">CONTRACT HEX ADDRESS</label>
              <input
                type="text"
                placeholder="0xYOUR_ACTUAL_CONTRACT_ADDRESS"
                value={customContractAddress}
                onChange={(e) => setCustomContractAddress(e.target.value)}
                class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 transition-all placeholder:text-slate-300"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="font-sans text-[10px] font-bold text-slate-400 uppercase">MINTABLE/BUY METHOD</label>
              <input
                type="text"
                placeholder="buyTokens"
                value={callableMethod}
                onChange={(e) => setCallableMethod(e.target.value)}
                class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-150 transition-all"
              />
            </div>
          </div>

          {customContractAddress.startsWith("0xYOUR") && (
            <div class="flex gap-1.5 text-[9px] text-amber-600 font-sans mt-0.5 font-semibold items-center bg-amber-50 rounded-lg p-2 border border-amber-100">
              <AlertCircle class="w-3.5 h-3.5 shrink-0" />
              <span>Note: Active with commented placeholder. Directly updates to real lock smart contract above.</span>
            </div>
          )}
        </div>
      )}

      {/* Token Inputs */}
      <div class="flex flex-col gap-4">
        {/* Input Card (Source) */}
        <div class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2.5">
          <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
            <span>SENDER SOURCE AMOUNT</span>
            <span>BALANCE: {selectedSourceChain.tokens.find(t => t.symbol === selectedSourceTokenSymbol)?.balance || "0"}</span>
          </div>
          <div class="flex items-center gap-3">
            <input
              type="text"
              placeholder="0.0"
              value={payAmount}
              onChange={(e) => onInputValueChange(e.target.value)}
              disabled={isSimulatingSwap || txIsPending}
              class="bg-transparent text-slate-800 focus:outline-none font-mono text-xl w-full placeholder:text-slate-300 border-none outline-none ring-0 focus:ring-0 p-0"
            />
            {/* Source Chain Selector */}
            <div class="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50/50">
              <span class="text-xs font-bold text-slate-800">{selectedSourceTokenSymbol}</span>
              <span class="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded-md font-bold">{selectedSourceChain.name.split(" ")[0]}</span>
            </div>
          </div>
        </div>

        {/* Transfer SVG design element */}
        <div class="flex justify-center -my-3 z-10">
          <button 
            type="button" 
            onClick={() => {
              // swap chains
              const src = selectedSourceChain;
              setSelectedSourceChain(selectedTargetChain);
              setSelectedTargetChain(src);
              // swap tokens
              const tok = selectedSourceTokenSymbol;
              setSelectedSourceTokenSymbol(selectedTargetTokenSymbol);
              setSelectedTargetTokenSymbol(tok);
            }}
            class="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md hover:border-pink-300 text-slate-500 hover:text-pink-500 flex items-center justify-center transition-all duration-150 transform hover:scale-110 cursor-pointer"
          >
            <ArrowRightLeft class="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Output Card (Target) */}
        <div class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col gap-2.5">
          <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
            <span>RECEIVING ASYNC BONDING AMOUNT</span>
            <span>EST. BALANCE: {selectedTargetChain.tokens.find(t => t.symbol === selectedTargetTokenSymbol)?.balance || "0"}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-mono text-xl text-slate-800 font-semibold">
              {payAmount ? (parseFloat(payAmount) * 100).toFixed(2) : "0.00"}
            </span>

            {/* Target Chain Selector */}
            <div class="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50/50">
              <span class="text-xs font-bold text-slate-800">{selectedTargetTokenSymbol}</span>
              <span class="text-[10px] bg-slate-100 text-slate-200 font-mono px-1.5 py-0.5 rounded-md font-bold text-slate-500">{selectedTargetChain.name.split(" ")[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Button flow */}
      {swapMode === "onchain" && !walletAddress ? (
        <button
          onClick={onConnectWallet}
          class="w-full bg-gradient-to-r from-pink-550 to-indigo-650 hover:opacity-95 text-white font-sans font-bold text-xs py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>🌸 CONNECT WEB3 WALLET TO BEGIN</span>
        </button>
      ) : (
        <button
          onClick={handleExecuteAction}
          disabled={isSimulatingSwap || txIsPending || !payAmount || parseFloat(payAmount) <= 0}
          class="w-full bg-slate-900 hover:bg-slate-850 disabled:bg-slate-200 disabled:text-slate-400 text-white font-sans font-bold text-xs py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 hover:shadow-indigo-150/20 disabled:transform-none disabled:shadow-none"
        >
          {(isSimulatingSwap || txIsPending) ? (
            <>
              <Loader2 class="w-4 h-4 animate-spin" />
              <span>{txIsPending ? "AWAITING WALLET SIGNATURE..." : "MINTING DIRECT VIA BINDING CURVE..."}</span>
            </>
          ) : (
            <>
              <span>{swapMode === "onchain" ? "EXECUTE DIRECT RATCHET TX" : "SIMULATE FAUCET CONTRACT ACTION"}</span>
              <ArrowUpRight class="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}

      {/* On-Chain Success Alert Card */}
      {txReceiptHash && (
        <div class="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100/60 flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <div class="flex items-center gap-1.5 font-bold text-xs text-emerald-700">
            <CheckCircle2 class="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Success: Transaction Minted Directly!</span>
          </div>
          <p class="font-sans text-[11px] leading-relaxed text-emerald-600/90 font-medium">
            Your on-chain bonding curve purchase has been settled on Base. You bypassed generic Uniswap AMM liquidity pool routers to mint tokens asynchronously!
          </p>
          <div class="flex items-center gap-2 mt-1 text-[10px] font-mono">
            <span class="font-bold text-emerald-700">TX RECEIPT:</span>
            <span class="bg-white px-2 py-0.5 rounded-md border border-emerald-100 text-emerald-900 select-all">{txReceiptHash}</span>
          </div>
        </div>
      )}

      {/* On-Chain Error Alert Card */}
      {txError && (
        <div class="bg-rose-50 text-rose-800 p-4 rounded-2xl border border-rose-100/60 flex flex-col gap-2">
          <div class="flex items-center gap-1.5 font-bold text-xs text-rose-700">
            <AlertCircle class="w-4.5 h-4.5 text-rose-600 shrink-0" />
            <span>On-Chain Error Logged</span>
          </div>
          <p class="font-sans text-[11px] leading-relaxed text-rose-600/90 font-mono">
            {txError.message || txError.toString()}
          </p>
        </div>
      )}
    </div>
  );
}
