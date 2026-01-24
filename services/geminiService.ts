import { GoogleGenAI, Modality } from "@google/genai";

// Use the recommended model names and initialization patterns from the @google/genai guidelines.
const getAI = () => {
    if (!process.env.API_KEY) {
        console.error("API_KEY is missing");
        throw new Error("API Key missing");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// 1. General Chat with Search Grounding
export const chatWithGemini = async (message: string, history: { role: string; text: string }[]) => {
  const ai = getAI();
  const contents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
      const response = await ai.models.generateContent({
          // Use 'gemini-3-flash-preview' for basic text tasks
          model: 'gemini-3-flash-preview',
          contents: contents.map(c => ({ role: c.role, parts: c.parts })),
          config: {
              tools: [{ googleSearch: {} }],
              systemInstruction: "You are the AI assistant for Federgreen Capital. You are professional, concise, and knowledgeable about finance, investment, and the company's services. Always maintain a polite and executive tone.",
          }
      });
      
      // Access .text property directly (do not call as method)
      return {
          text: response.text,
          groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
  } catch (error) {
      console.error("Chat Error", error);
      return { text: "I apologize, but I am unable to connect to the server at the moment.", groundingChunks: [] };
  }
};

// 2. Thinking Mode for Investment Analysis
export const analyzeInvestmentStrategy = async (strategyDescription: string) => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            // Use 'gemini-3-pro-preview' for complex reasoning tasks
            model: 'gemini-3-pro-preview',
            contents: `Analyze the following investment strategy and provide a risk assessment and potential ROI projection: ${strategyDescription}`,
            config: {
                // Ensure thinkingBudget is smaller than maxOutputTokens
                thinkingConfig: { thinkingBudget: 1024 },
                maxOutputTokens: 4096,
            }
        });
        // Access .text property directly
        return response.text;
    } catch (error) {
        console.error("Analysis Error", error);
        return "Unable to perform deep analysis at this time.";
    }
};

// 3. TTS for Articles
export const generateSpeech = async (text: string): Promise<string | null> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            // Use the recommended TTS model
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
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("TTS Error", error);
        return null;
    }
};

// 4. Fast AI for quick summaries
export const quickSummarize = async (text: string) => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            // Use 'gemini-3-flash-preview' as the default for summarization
            model: 'gemini-3-flash-preview',
            contents: `Summarize this in one sentence: ${text}`,
        });
        // Access .text property directly
        return response.text;
    } catch (error) {
        return "";
    }
};

// 5. Business Intelligence Analysis (TAM/SAM/SOM, Moat, etc.)
export const analyzeBusinessModel = async (businessType: string, location: string, analysisType: 'market_size' | 'moat' | 'competitors') => {
    const ai = getAI();
    let prompt = "";
    
    if (analysisType === 'market_size') {
        prompt = `For a ${businessType} in ${location}, estimate the TAM (Total Addressable Market), SAM (Serviceable Available Market), and SOM (Serviceable Obtainable Market). Provide numbers in USD and a brief logic for each. Return as JSON: { "tam": "val", "tam_logic": "...", "sam": "val", "sam_logic": "...", "som": "val", "som_logic": "..." }`;
    } else if (analysisType === 'moat') {
        prompt = `Analyze the potential economic moats for a ${businessType} in ${location}. Focus on Network Effects, Switching Costs, Intangible Assets, and Cost Advantage. Return as JSON with a score (1-10) and description for each.`;
    } else {
        prompt = `Identify 5 potential competitors for a ${businessType} in ${location}. Return as JSON list.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        // Access .text property directly
        return response.text; // Expecting JSON string
    } catch (error) {
        console.error("Business Analysis Error", error);
        return null;
    }
};

// 6. Location Intelligence (Simulating Market Data APIs via AI)
export const getLocationIntelligence = async (location: string) => {
    const ai = getAI();
    const prompt = `Generate a comprehensive location report for ${location}. 
    Include estimated data for:
    1. Climate (Avg Temp, Rainfall)
    2. Demographics (Population, Median Income)
    3. Risk Factors (Flood, Fire, Earthquake - Low/Med/High)
    4. Economic Trends (Growth Rate, Key Industries)
    Return valid JSON: 
    {
      "climate": { "temp": "X°F", "rain": "X in", "desc": "..." },
      "demographics": { "pop": "X", "income": "$X", "trend": "..." },
      "risks": { "flood": "Low", "fire": "Med", "quake": "Low", "desc": "..." },
      "economy": { "growth": "X%", "industries": ["A", "B"], "desc": "..." }
    }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        // Access .text property directly
        return response.text;
    } catch (error) {
        console.error("Location Intelligence Error", error);
        return null;
    }
};

// 7. Business Plan Drafter
export const generatePlanDraft = async (section: string, inputs: Record<string, string>) => {
    const ai = getAI();
    const prompt = `Act as a senior strategy consultant at a top-tier firm. 
    Draft the "${section}" section of a business plan based on the following raw inputs provided by the user: 
    ${JSON.stringify(inputs, null, 2)}
    
    Requirements:
    - Tone: Professional, persuasive, investment-ready, and confident.
    - Format: Markdown (use headings, bullet points where appropriate).
    - Length: Approximately 200-300 words.
    - Focus: Clarity, strategic value, and financial viability.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        // Access .text property directly
        return response.text;
    } catch (error) {
        console.error("Plan Gen Error", error);
        return "Unable to generate draft at this time. Please try again.";
    }
};

// 8. Suggest Risks
export const suggestBusinessRisks = async (companyDescription: string) => {
    const ai = getAI();
    const prompt = `Based on the following company description, identify 5 key business risks (internal or external).
    Company Description: ${companyDescription}
    
    Return a JSON array of objects:
    [
      { "name": "Risk Name", "prob": 50, "impact": 50 },
      ...
    ]
    prob and impact should be integers 0-100.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        // Access .text property directly
        return response.text;
    } catch (error) {
        console.error("Risk Suggestion Error", error);
        return "[]";
    }
};