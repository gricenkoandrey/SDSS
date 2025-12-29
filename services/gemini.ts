import { GoogleGenAI, Type } from "@google/genai";
import { NutritionalData } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<NutritionalData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Ты профессиональный диетолог. Проанализируй это изображение еды.
    1. Определи название блюда.
    2. Рассчитай примерную калорийность всего блюда на изображении.
    3. Оцени содержание белков, жиров и углеводов (в граммах).
    4. Перечисли основные ингредиенты.
    5. Напиши краткое заключение о пользе или вреде этого блюда (1-2 предложения).
    
    Отвечай только на русском языке.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
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
            dishName: { type: Type.STRING, description: "Название блюда на русском" },
            calories: { type: Type.NUMBER, description: "Общая калорийность (ккал)" },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER, description: "Белки (гр)" },
                fat: { type: Type.NUMBER, description: "Жиры (гр)" },
                carbs: { type: Type.NUMBER, description: "Углеводы (гр)" }
              },
              required: ["protein", "fat", "carbs"]
            },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Список ингредиентов"
            },
            summary: { type: Type.STRING, description: "Краткое описание пользы/вреда" }
          },
          required: ["dishName", "calories", "macros", "ingredients", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    return JSON.parse(text) as NutritionalData;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
