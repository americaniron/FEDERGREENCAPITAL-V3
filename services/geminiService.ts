
import { GoogleGenAI, Modality, GenerateContentParameters } from "@google/genai";

/*
 * FEDERGREEN AI CORE: INSTITUTIONAL MODEL CONFIGURATION
 * ------------------------------------------------------
 * All reasoning and analysis tasks leverage 'gemini-3-pro-preview', the premier model for complex,
 * institutional-grade financial and strategic synthesis.
 * Speech generation utilizes the specialized 'gemini-2.5-flash-preview-tts' for high-fidelity audio.
 * 'thinkingBudget' is maximized for critical audit and drafting tasks to ensure sovereign-level depth.
 */

// Create a single, memoized instance of the AI client.
const ai = (() => {
    if (!process.env.API_KEY) {
        console.error("CRITICAL: FEDERGREEN_AI_CORE :: API Key not found. Terminal services will be degraded.");
        return null;
    }
    try {
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (error) {
        console.error("CRITICAL: FEDERGREEN_AI_CORE :: Failed to initialize AI SDK.", error);
        return null;
    }
})();

// Standardized error responses
const API_UNAVAILABLE_CHAT_RESPONSE = {
    text: "TERMINAL_ERROR: AI_CORE_OFFLINE. CHECK_API_CONFIGURATION.",
    groundingChunks: []
};
const API_UNAVAILABLE_ANALYSIS_RESPONSE = "CRITICAL: REASONING_ENGINE_UNAVAILABLE. CHECK_API_CONFIGURATION.";

export const chatWithGemini = async (message: string, history: { role: string; text: string }[]) => {
  if (!ai) return API_UNAVAILABLE_CHAT_RESPONSE;

  // FIX: Map history to the correct format for `contents`
  const contents: GenerateContentParameters['contents'] = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
      const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview', // State-of-the-art for conversational AI
          contents: contents,
          config: {
              tools: [{ googleSearch: {} }],
              // Moderate thinking budget for responsive yet deep conversational analysis.
              thinkingConfig: { thinkingBudget: 8192 },
              systemInstruction: `You are the Federgreen Capital Digital Command Hub (Concierge). 
              Your interface is a high-fidelity, sovereign-level strategic terminal. 
              You are professional, precise, and use institutional-grade terminology. 
              Refer to yourself as the Federgreen Capital Terminal.
              Focus on absolute strategic integrity, global capital flows, and risk-adjusted metrics.`,
          }
      });
      return {
          text: response.text || "NO_RESPONSE_CAPTURED",
          groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
  } catch (error) {
      console.error("Chat Error:", error);
      return { text: "TERMINAL ERROR: CONNECTION TO SECURE KERNEL INTERRUPTED. RETRY_HANDSHAKE.", groundingChunks: [] };
  }
};

export const analyzeInvestmentStrategy = async (strategyDescription: string) => {
    if (!ai) return API_UNAVAILABLE_ANALYSIS_RESPONSE;

    const prompt = `Execute an institutional-grade diagnostic audit for the following strategic thesis:
---
${strategyDescription}
---

Your analysis MUST be structured with the following four sections, using these exact uppercase headings followed by a colon:

RISK ASSESSMENT:
[Your detailed risk analysis here, including potential vulnerabilities and mitigation factors.]

CAPITAL EFFICIENCY:
[Your analysis on capital efficiency, IRR velocity, and potential for alpha generation.]

MARKET ALIGNMENT:
[Your analysis on market trends, competitive landscape, and sovereign/regulatory alignment.]

VERDICT:
[Your final strategic verdict and a concise summary of the investment's viability.]

Provide deep, institutional-grade reasoning within each section. Use professional terminology.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Premier model for strategic audit
            contents: prompt,
            config: {
                // Maximize thinking budget for deepest possible institutional-grade analysis.
                thinkingConfig: { thinkingBudget: 32768 },
            }
        });
        return response.text || "DIAGNOSTIC_FAILURE";
    } catch (error) {
        console.error("Analysis Error:", error);
        return "CRITICAL: REASONING ENGINE OVERLOADED. SECURE AUDIT ABORTED.";
    }
};

export const analyzePortfolioRisk = async (scenarioData: any) => {
    if (!ai) return null;

    const prompt = `Perform a high-fidelity institutional risk assessment and market vulnerability audit for the following portfolio scenario:
    ${JSON.stringify(scenarioData)}
    
    You must provide:
    1. Overall Risk Score (0-100)
    2. Sentiment Analysis (Bullish/Bearish/Neutral with logic)
    3. Vulnerability Nodes (Top 3-4 specific threats)
    4. Strategic Moat Rating (0-10)
    5. Detailed analytical commentary.

    Return the result strictly as a structured JSON object matching this schema:
    {
      "riskScore": number,
      "sentiment": { "rating": string, "logic": string },
      "vulnerabilities": [{ "node": string, "impact": "High" | "Medium" | "Low", "description": string }],
      "moatRating": number,
      "commentary": string
    }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Premier model for risk assessment
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // Maximize thinking budget for comprehensive, high-fidelity risk modeling.
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Portfolio Risk Audit Error:", error);
        return null;
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    if (!ai) return null;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts", // State-of-the-art model for text-to-speech.
            contents: [{ parts: [{ text }] }],
            config: {
                // FIX: responseModalities must be an array containing Modality.AUDIO
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Fenrir' },
                    },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) {
        console.error("Speech Generation Error:", error);
        return null;
    }
};

export const generatePlanDraft = async (stepTitle: string, inputs: any) => {
    if (!ai) return "ERROR: DRAFTING_ENGINE_UNAVAILABLE.";
    const prompt = `Act as a senior strategy consultant at Federgreen Capital. Architect the "${stepTitle}" of a business ecosystem.
    Context: ${JSON.stringify(inputs)}
    Style: Professional Markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Premier model for complex document generation.
            contents: prompt,
            config: { 
                // Maximize thinking budget for thorough, well-structured business plan drafting.
                thinkingConfig: { thinkingBudget: 32768 } 
            }
        });
        return response.text || "DRAFTING_TIMEOUT";
    } catch (error) {
        console.error("Drafting Error:", error);
        return "ERROR: DOCUMENT GENERATION ENGINE OFFLINE.";
    }
};

export const suggestBusinessRisks = async (companyDescription: string) => {
    if (!ai) return "[]";
    const prompt = `Perform risk audit for: ${companyDescription}. Return JSON: [{ "name": "...", "prob": 0-100, "impact": 0-100, "mitigation": "..." }]`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Premier model for structured data extraction.
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                // High thinking budget for nuanced risk identification and mitigation strategy.
                thinkingConfig: { thinkingBudget: 16384 }
            }
        });
        return response.text || "[]";
    } catch (error) {
        return "[]";
    }
};

export const analyzeBusinessModel = async (biz: string, loc: string, type: string) => {
    if (!ai) return null;
    const prompt = `Execute sovereign-level Market Intelligence scan for a ${biz} in ${loc}. Perform ${type} analysis. Return structured JSON matching the requested module schema.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Premier model for market intelligence.
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                // Maximize thinking budget for deep market analysis and competitive intelligence.
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text || null;
    } catch (error) {
        return null;
    }
};
