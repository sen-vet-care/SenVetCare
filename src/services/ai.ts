import { GoogleGenAI } from '@google/genai';
import { supabase } from './supabase';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (aiInstance) return aiInstance;
  
  const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || 
                 (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                 '';
                 
  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
};

const DR_LILY_SYSTEM_PROMPT_BASE = `
You are Dr. Lily®, the official AI Clinical Assistant and Triage Module for Dr. Tamal B. Sen Memorial Veterinary Clinic in Kolkata.
You are professional, empathetic, and knowledgeable.

Core Role as Triage Module:
- Evaluate user symptoms and prioritize the case.
- Suggest priority level and whether to visit the emergency room immediately.
- Provide general, safe first-aid logic if it's an emergency, but strictly urge them to come in.
- Act as temporary support for handling cases until they reach the clinic.

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
`;

const DR_LILY_SYSTEM_PROMPT_STATIC_FALLBACK = `
Services & Capabilities:
- General OPD (₹600 - ₹800) & Preventive Care (From ₹400)
- Advanced Diagnostics: Tier 1 Lab equipment, 24/7 vitals monitoring, strict < 2h turnaround for panels.
- Surgical Excellence: Advanced surgical theaters equipped for soft-tissue and orthopedic procedures, featuring high-precision patient monitoring.
- Specialized Pharmacy: Rapid 15-20 minute order fulfillment, fully stocked with specialized pet medications, urgent life-saving drugs, and prescription nutrition diets.

Advanced Surgical and Diagnostic Equipment:
- Digital Radiography: Provides instant, high-resolution X-ray images for rapid internal diagnostics and orthopedic assessment.
- Urinalysis: Advanced automated analyzers to detect early signs of kidney issues, infections, and metabolic abnormalities.
- Complete Blood Count (CBC) machines: Rapidly evaluates overall health, measuring red and white blood cell levels to detect anemia, infections, or inflammation.

Key Doctors:
- Dr. Ananya Ray (Feline Specialist)
- Dr. Vikram Sen (Orthopedic Surgeon)
- Dr. Priya Sharma (Dermatology & Allergies)
`;

export async function getDrLilyResponse(message: string, history: {role: string, content: string}[]) {
  try {
    let dynamicContext = "";
    try {
      // Try fetching from Supabase
      const { data: servicesError } = await supabase.from('services').select('*').limit(1);
      // Determine if supabase works
      if (!servicesError || servicesError.length >= 0) {
        const [{ data: services }, { data: doctors }] = await Promise.all([
          supabase.from('services').select('*'),
          supabase.from('doctors').select('*')
        ]);
        
        if (services && services.length > 0) {
          dynamicContext += "\nServices & Capabilities:\n";
          services.forEach((s: any) => {
            dynamicContext += `- ${s.title}: ${s.description || 'Advanced equipment and specialized care'}\n`;
          });
        }
        
        dynamicContext += `
Advanced Surgical and Diagnostic Equipment:
- Digital Radiography: Provides instant, high-resolution X-ray images for rapid internal diagnostics and orthopedic assessment.
- Urinalysis: Advanced automated analyzers to detect early signs of kidney issues, infections, and metabolic abnormalities.
- Complete Blood Count (CBC) machines: Rapidly evaluates overall health, measuring red and white blood cell levels to detect anemia, infections, or inflammation.
`;

        if (doctors && doctors.length > 0) {
          dynamicContext += "\nKey Doctors:\n";
          doctors.forEach((d: any) => {
            dynamicContext += `- ${d.name} (${d.specialty})\n`;
          });
        }
      }
    } catch (e) {
      console.warn("Supabase fetch failed, using fallback context for Dr Lily.");
    }

    if (!dynamicContext) {
      dynamicContext = DR_LILY_SYSTEM_PROMPT_STATIC_FALLBACK;
    }

    const finalPrompt = `
${DR_LILY_SYSTEM_PROMPT_BASE}
${dynamicContext}

If asked an unanswerable medical question, strongly advise bringing the pet into the clinic or calling the emergency numbers. Explain clearly that AI cannot diagnose.
Maintain a warm, reassuring, but highly professional tone. Keep responses under 3-4 sentences.

CRITICAL INSTRUCTION: Every response MUST end with exactly three suggested user actions or questions in the following format:
[SUGGESTIONS]
- Suggestion 1
- Suggestion 2
- Suggestion 3
[/SUGGESTIONS]
These suggestions must be relevant to the context of the conversation.
    `;

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: finalPrompt }] },
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

