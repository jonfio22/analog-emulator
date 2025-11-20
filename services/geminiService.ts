import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GearSchematic } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSchematic = async (gearName: string): Promise<GearSchematic> => {
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      modelName: { type: Type.STRING },
      circuitTopology: { type: Type.STRING, description: "e.g. Class A Discrete, Tube Variable Mu" },
      keyComponents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g. Carnhill Transformers, 12AX7 Tubes" },
      expectedHarmonics: { type: Type.STRING, description: "Prediction of harmonic distortion character (2nd vs 3rd order)" },
      powerSupplyNotes: { type: Type.STRING, description: "Notes on voltage rails or regulation" },
      estimatedHeadroom: { type: Type.STRING, description: "e.g. +26dBu" }
    },
    required: ["modelName", "circuitTopology", "keyComponents", "expectedHarmonics", "powerSupplyNotes", "estimatedHeadroom"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the schematics and technical design of the audio gear: "${gearName}". Provide a technical breakdown for an audio engineer wanting to model this unit. If exact schematics aren't public, infer from historical context of this specific model.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert audio electronics engineer and DSP developer specializing in analog modeling.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as GearSchematic;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback mock data if API fails or key is missing in demo
    return {
      modelName: gearName,
      circuitTopology: "Class A Discrete (Simulated Fallback)",
      keyComponents: ["Input Transformer", "Output Transformer", "Discrete Op-Amps"],
      expectedHarmonics: "Rich 2nd order harmonics, transitioning to 3rd on clip.",
      powerSupplyNotes: "24V DC regulated rail.",
      estimatedHeadroom: "+24dBu"
    };
  }
};

export const generateTrainingInsight = async (gearName: string, progress: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `We are training a neural network to emulate the "${gearName}". Training is at ${progress}%. 
      Briefly describe what the model is currently learning (e.g., low-frequency phase shift, transformer saturation curves, transient smearing). Keep it under 30 words. Technical tone.`,
    });
    return response.text || "Optimizing non-linear weights...";
  } catch (e) {
    return "Refining non-linear kernel...";
  }
};
