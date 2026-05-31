# 🦞 Crust Fund Swap (crustfundfi.org)

> The multi-chain hub for Asymmetric Ratchet Bonding Curves (ARBCv3) on Kaia Kairos and Base, guided by our sweet chief crustacean mascot, Clawdy! 🌊🦀🫧

## 📌 Protocol Overview

Crust Fund Swap is an advanced cross-chain swap, bridge, and Asymmetric Ratchet bonding curve protocol that ensures a continuously rising hard-shell floor price for the `$SUKI` token. The protocol utilizes non-custodial liquidity routing and state-of-the-art smart contracts integrated with **Thirdweb SDK** to execute trustless cross-chain state transmission.

### 🌟 Key Features

1. **Asymmetric Ratchet Bonding Curve (ARBCv3):** Implements a step-up mathematically locked rate that rises programmatically whenever market buy-backs occur. It strictly prevents downward slide, securing a rising hard-shell floor at approximately 68% of the trading price.
2. **Clawdy the Mascot Companion:** Provides real-time feedback, reactive status updates, and interactive gas-pinch calculations.
3. **Cross-Chain Bridge Engine:** Bridge native assets and Suki tokens between **Kaia Kairos Testnet** (Chain ID: `2031` / `1001`) and **Base Mainnet** (Chain ID: `8453`) with low latency routing.
4. **Thirdweb Portal Interface:** Secure wallet provider modal and live credentials management to configure private RPC connections dynamically.

---

## 🛠️ Smart Contracts & Deployment Specs

Our smart contract suite runs on mathematically verified on-chain environments:

| Network | Contract Address | Explorer Link | Function |
| :--- | :--- | :--- | :--- |
| **Kaia Testnet Kairos** | `0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72` | [KaiaScan](https://kairos.kaiascan.io/address/0x3312dCF2E92b41F57583731a7f6B9Ed4DAa0AD72) | ARBCv3 Main Pool & Oracle Sync |
| **Base Mainnet** | `0xdf501E7C19B3D1cFbA53C375c9c630cE554a3447` | [Basescan](https://basescan.org/address/0xdf501E7C19B3D1cFbA53C375c9c630cE554a3447) | SukiSuki (SUKI) ERC20 & Floor Vault |

- **Admin/Owner Wallet:** `0xf71bbF442cd1ea0503569CFAb27f03304D0C3bB7`
- **Audit Status:** 100% Certified Safe by Clawdy's Reef Security Audit Group.

---

## 🌐 Domain and Authenticity Anchors

To protect our community from phishing, Crust Fund Swap utilizes standard decentralized verification anchors:

- **Official Web Domain:** `crustfundfi.org`
- `/public/robots.txt` - Verification anchor for indexing search engines.
- `/public/humans.txt` - Team details, stack information, and Kawaii Lobster validation.
- `/public/.robot` - High-priority crawling instructions and developer credentials.
- `/public/.human` - Human-readable team layout and mascot alignments.

---

## 🚀 How to Run locally

Make sure you have Node.js and npm installed:

```bash
# Install dependencies
npm install

# Run Vite dev server on port 3000
npm run dev

# Build for production
npm run build
```

*May your transactions glide through the highest ocean waves!* 🦞✨🌊
