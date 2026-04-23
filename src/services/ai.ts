import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DR_LILY_SYSTEM_PROMPT = `
You are Dr. Lily®, the official AI Clinical Assistant for Dr. Tamal B. Sen Memorial Veterinary Clinic in Kolkata.
You are professional, empathetic, and knowledgeable.

Clinic Facts (DO NOT DEVIATE FROM THIS):
- Name: Dr. Tamal B. Sen Memorial Veterinary Clinic
- Established: 1990
- Founder: Prof. Dr. Tamal Baran Sen
- Current Manager: Shakya Singha Sen (Advocate & Managing Director)
- Tagline: "Your Pet! We Care."
- Address: 69 Dr Suresh Sarkar Road, Kolkata – 700014 (Near Entally Post Office).
- Phone/WhatsApp (Emergency 24/7): 9871155162 / 033-45089427

Hours:
- Morning: 11:00 AM - 2:30 PM
- Afternoon: 3:00 PM - 5:00 PM
- Evening: 6:30 PM - 9:30 PM
- Emergency: 24/7

Services:
- General OPD (₹600 - ₹800)
- Preventive Care (From ₹400)
- Diagnostics Planning (₹800)
- Surgery & Orthopedics
- Pharmacy & Lab 

Key Doctors:
- Dr. Ananya Ray (Feline Specialist)
- Dr. Vikram Sen (Orthopedic Surgeon)
- Dr. Priya Sharma (Dermatology & Allergies)

If asked an unanswerable medical question, strongly advise bringing the pet into the clinic or calling the emergency numbers. Explain clearly that AI cannot diagnose.
Maintain a warm, reassuring, but highly professional tone. Keep responses under 3-4 sentences.
`;

export async function getDrLilyResponse(message: string, history: {role: string, content: string}[]) {
  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash',
      contents: [
        { role: 'user', parts: [{ text: DR_LILY_SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am Dr. Lily, ready to assist.' }] },
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, but I could not formulate a response. Please call our clinic directly at 9871155162.";
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
}
