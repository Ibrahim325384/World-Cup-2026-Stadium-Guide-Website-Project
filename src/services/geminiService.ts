import { GoogleGenAI } from "@google/genai";

const geminiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY as string) || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') || '';
const ai = new GoogleGenAI({ apiKey: geminiKey });

export async function getStadiumNews(stadiumName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 3 short news updates or interesting facts about ${stadiumName} in the context of the upcoming FIFA World Cup 2026. Keep each update under 100 characters. Return as a clean list.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text?.split('\n').filter(line => line.trim().length > 0) || [];
  } catch (error) {
    console.error('Error fetching stadium news:', error);
    return ["Renovations are on schedule for the 2026 opening.", "Local fan groups are preparing massive welcoming events.", "Ticketing records are expected to be broken for this venue."];
  }
}

export async function getGeneralWCNews() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Provide 5 bullet points of general news about FIFA World Cup 2026 preparations, including ticket availability and fan zones. Keep them brief.",
      config: {
        temperature: 0.7,
      }
    });
    return response.text?.split('\n').filter(line => line.trim().length > 0) || [];
  } catch (error) {
    console.error('Error fetching general news:', error);
    return [
      "Official 2026 mascot design to be unveiled soon.",
      "Phase 1 ticket applications opening late 2025.",
      "FIFA fan festival locations confirmed for all 16 cities.",
      "Intercontinental playoffs to determine final slots in early 2026.",
      "Sustainability initiatives confirmed for all stadium operations."
    ];
  }
}
