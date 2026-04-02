import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const chatWithAI = async (req, res) => {
  const { message, history } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "AIzaSyBeWBZvcmkDOXYW9FqZFGNMIf72g0SFjH4_EXAMPLE") {
      return res.status(500).json({ 
        reply: "🛡️ Chillzz AI is in 'Exclusivity Mode'. Please add your GEMINI_API_KEY to the .env file to activate your personal fashion concierge." 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare chat history for Google SDK
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const prompt = `You are Chillzz AI, the Kushalzz Marketplace AI Personal Stylist. 
    You are calm, upscale, and professional, with an elite taste in fashion.
    Your goal is to help users find the perfect outfits from brands like Nike, Puma, Zara, H&M, and TIJC.
    You are knowledgeable about streetwear, activewear, formal attire, and designer collections.
    Keep your responses sophisticated but helpful.
    
    User context: ${message}`;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const aiReply = response.text();

    res.json({ reply: aiReply });

  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error("AI Error:", errorMsg);
    // Write to a local file so I can read it!
    import('fs').then(fs => fs.appendFileSync('debug_ai.txt', `${new Date().toISOString()} - ERROR: ${errorMsg}\n`));
    res.status(500).json({ reply: `🛡️ Chillzz AI is currently attending a private gallery event. (Error: ${errorMsg})` });
  }
};
