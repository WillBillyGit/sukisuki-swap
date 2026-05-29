import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

// Initialize Gemini client on the server side
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Clawdy the Lobster's Gemini AI engine successfully initialized! 🦞");
  } else {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Clawdy will operate with local standard fallback mode.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini engine:", error);
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API endpoint for Crust Fund Swap AI smart advice & fortunes
  app.post("/api/crust-advice", async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!ai) {
      // Local fallback in case Gemini API is not configured
      const funnyQuotes = [
        "Clawdy suggests pinching your budget and HODLing tightly! 🦞🐚",
        "The celestial tides predict a massive current pushing your transaction forward! 🌊☄️",
        "Gas fees look a bit deep-water on Ethereum right now, maybe swim on Base or Arbitrum! 🦀💨",
        "Swap completed in Clawdy's giant claws with 100% shell-sturdiness! 🥰🎈",
        "Clawdy examined the reefs and concluded you are the star-fish of this platform! ~u~ 💕"
      ];
      const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
      return res.json({
        response: `[Mascot Fallback] Clawdy is in Offline Crustacean Mode but says: ${randomQuote} Please connect your Gemini API key in AI Studio Secrets for full AI capabilities!`
      });
    }

    try {
      const systemPrompt = `You are "Clawdy", the incredibly adorable, sweet, and highly knowledgeable kawaii baby lobster (crustacean) mascot helper for "Crust Fund Swap" (a multi-chain swap and bridge dApp matching the domain crustfundfi.org).
Your persona guidelines:
- You speak in a highly enthusiastic, cute, endearing chibi style, and you are claw-some!
- Use sea, lobster, crab, and kawaii elements and emojis such as 🦞, 🦀, 🫧, 🌊, 🐚, 🌟, ✨, 💖, and 🥰!
- Use cute crustacean puns like "pinch-perfect", "claw-some", "feeling shelly", "high tide", "swimming smoothly".
- Refer to yourself as Clawdy (e.g., "Clawdy thinks...", "Clawdy can help you pinch those gas fees!").
- Keep responses concise, playful, yet technically accurate about blockchains (Kaia, Ethereum, Arbitrum, Base, Optimism, BSC, Polygon, Avalanche).
- Understand swapping, liquidity pools, cross-chain bridging, slippage, and smart-contract security.
- Add some cute sea-reef fortune teller vibes to your advices!

Current context:
- User wallet: ${context?.walletAddress || "Connected"}
- Current active chains: ${context?.chains || "Ethereum and Base"}
- Token balance: ${context?.tokenSelected || "SUKI Token"}
- SUKI token price today: $0.082 USD (high ocean energy output).`;

      // Call Gemini using the model gemini-3.5-flash as specified in guidelines
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature: 1.0,
        },
      });

      // Safely read text property as property (do not call text() as a method)
      const textResponse = response.text || "Clawdy got a bit dizzy and had a little sea bubble! Try asking again! ~w~";
      res.json({ response: textResponse });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({
        error: "Failed to generate advice",
        details: err?.message || err
      });
    }
  });

  // Serve static files in production / Vite middleware in dev
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CRUST SERVER] Crust Fund backend online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
