import { GoogleGenAI, Type } from "@google/genai";
import { EmotionAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeExpression = async (base64Image: string): Promise<EmotionAnalysis> => {
  try {
    // Remove header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const prompt = `
      You are a friendly AI teacher for elementary school students.
      Look at the face in this image and identify the emotion.
      Target Audience: Korean elementary school students (use polite, simple, and fun Korean).
      
      Task:
      1. Identify the primary emotion (Happy, Sad, Angry, Surprised, Neutral, Fear, Disgust).
      2. Choose a matching emoji.
      3. Write a warm, encouraging message explaining the emotion.
      4. List 1-2 simple visual reasons (e.g., "The corners of the mouth are up", "Eyebrows are frowned").

      Output JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emotion: { type: Type.STRING },
            koreanLabel: { type: Type.STRING, description: "Simple Korean emotion name like '행복해요', '슬퍼요'" },
            emoji: { type: Type.STRING },
            description: { type: Type.STRING, description: "A friendly sentence for a child" },
            reasoning: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Simple visual cues in Korean" 
            },
            confidence: { type: Type.NUMBER }
          },
          required: ["emotion", "koreanLabel", "emoji", "description", "reasoning"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    return JSON.parse(jsonText) as EmotionAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};