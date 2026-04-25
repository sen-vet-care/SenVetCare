import { GoogleGenAI } from "@google/genai";
import { supabase } from "./supabase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDailyBlog() {
  console.log("Generating daily blog with Dr. Lily AI...");
  
  const prompt = `
You are Dr. Lily®, the official AI Clinical Assistant for Dr. Tamal B. Sen Memorial Veterinary Clinic in Kolkata.
Draft a short, engaging, and professional blog post about recent pet or veterinary news or tips relevant to pet owners in Kolkata (e.g., tick fever season, heat stroke prevention, nutrition).
Include relevant SEO keywords like "veterinary clinic Kolkata", "pet care Entally", "best vet doctor".
Format the output as a JSON object with:
- title (string)
- excerpt (string, max 120 chars)
- category (string, e.g., "News", "Preventive Care", "Diseases")
- content (string, Markdown formatted text. Include credits to any generic sources or say "Credited to standard veterinary guidelines").
Do not include any other markdown or wrappers, just valid JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);

    // Default fallbacks
    const title = parsed.title || "Daily Pet Care Insights from Dr. Lily";
    const excerpt = parsed.excerpt || "Stay updated with the latest pet care guidelines.";
    const category = parsed.category || "General News";
    const content = parsed.content || "Daily updates loading...";

    // Insert into Supabase
    // If table doesn't exist, this might fail unless we assume it's created or we mock it.
    // Assuming there's a 'blogs' table or we just log it if we can't run it right now.
    // Actually the user asks to "autopopulate... and will be stored in supabase free tier".
    const { data, error } = await supabase.from('blogs').insert([{
      title,
      excerpt,
      category,
      content,
      language: "EN",
      is_featured: false,
      published_at: new Date().toISOString()
    }]);

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    console.log("Successfully generated and stored blog:", title);
    return data;
  } catch (error) {
    console.error("Failed to generate blog:", error);
    throw error;
  }
}
