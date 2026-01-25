
import { GoogleGenAI, Modality } from "@google/genai";

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

  const contents = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
      const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: contents,
          config: {
              tools: [{ googleSearch: {} }],
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
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Execute institutional-grade diagnostic audit for the following strategic thesis: ${strategyDescription}. 
            Provide deep-reasoning on risk-mitigation, sovereign alignment, and IRR velocity.`,
            config: {
                thinkingConfig: { thinkingBudget: 4000 },
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
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 2000 }
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
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
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
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 2000 } }
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
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
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
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return response.text || null;
    } catch (error) {
        return null;
    }
};
