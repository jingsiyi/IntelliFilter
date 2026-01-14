
import { GoogleGenAI, Type } from "@google/genai";
import { ContentItem, UserPreferences, AIRankingResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeContent = async (
  items: ContentItem[],
  prefs: UserPreferences
): Promise<AIRankingResult[]> => {
  if (!API_KEY) {
    console.warn("API Key is missing - skipping real analysis");
    return items.map(i => ({ itemId: i.id, score: 50, reason: "API key not configured." }));
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";

  const systemPrompt = `You are an elite Digital Content Curator and Information Architect. 
  Your mission is to process a stream of content from various platforms (Bilibili, TechNews, Reddit, etc.) and filter it for a highly sophisticated user.

  USER PROFILE:
  - Deep Interests: ${prefs.interests.join(", ")}
  - Avoid/Filter: ${prefs.dislikes.join(", ")}
  - Specific Instructions: ${prefs.customPrompt}

  SCORING RULES:
  - 90-100: Perfect match, essential reading/viewing for the user's specific interests.
  - 70-89: High quality, relevant to core interests.
  - 50-69: Marginally interesting, might be worth a quick look.
  - <50: Irrelevant or content the user wants to avoid.

  RESPONSE FORMAT:
  Strict JSON array. No conversational text.
  Objects MUST have: "itemId" (string), "score" (integer), and "reason" (string, max 12 words).`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: `Evaluate these ${items.length} items from various sources: ${JSON.stringify(items.map(i => ({ id: i.id, title: i.title, desc: i.description, cat: i.category, src: i.source })))}` }
          ]
        }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              itemId: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ["itemId", "score", "reason"]
          }
        }
      }
    });

    const results: AIRankingResult[] = JSON.parse(response.text || "[]");
    return results;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback logic for demo purposes if API fails
    return items.map(i => ({
      itemId: i.id,
      score: Math.floor(Math.random() * 100),
      reason: "Analysis error (fallback score generated)."
    }));
  }
};
