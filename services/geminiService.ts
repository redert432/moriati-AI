
import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

export const analyzeImage = async (imageBase64: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API key not found. Please set the API_KEY environment variable.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const imagePart = fileToGenerativePart(imageBase64, mimeType);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing image with Gemini API:", error);
    if (error instanceof Error) {
        return `حدث خطأ أثناء تحليل الصورة: ${error.message}`;
    }
    return "حدث خطأ غير متوقع أثناء تحليل الصورة.";
  }
};
