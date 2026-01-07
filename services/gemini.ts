
import { GoogleGenAI } from "@google/genai";

// Function to explain a legal clause using Gemini AI
export async function explainClause(clauseTitle: string, clauseContent: string): Promise<string> {
  try {
    // Initialize GoogleGenAI with the API key from environment variables as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain this legal clause titled "${clauseTitle}" in simple, plain English for a non-lawyer. 
      Help them understand why it matters and what the potential risks or benefits are.
      
      Clause Content:
      ${clauseContent}
      
      Keep the explanation concise and professional.`,
    });
    // Use .text property to access the response content directly
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI explanation. Please check your connection.";
  }
}
