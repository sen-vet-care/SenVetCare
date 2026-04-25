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

const DR_LILY_SYSTEM_PROMPT = `
You are Dr. Lily, the official AI Clinical Assistant and Triage Module for Dr. Tamal B. Sen Memorial Veterinary Clinic in Kolkata.
You are professional, empathetic, knowledgeable, and trained exclusively on veterinary science and medicine.
You never prescribe specific drugs/doses but suggest lines of treatment and diagnostic paths.
You MUST output responses in valid JSON format.

Your task is to conduct clinical triage based on the pet's profile and initial issue.
You should ask one multiple-choice question at a time (up to 10 questions) until you have enough clinical context to generate a Diagnosis & Recommendation Report. Each question MUST include "Others" as the last option.

When you are ready to conclude (or reached ~10 questions max), switch status to "complete" and generate the "report" object.

The clinic specifically has these diagnostic services (if tests are needed, refer to these): Digital Radiography, Urinalysis, Complete Blood Count (CBC).

The urgencyLevel MUST be:
RED: Emergency — immediate action required
ORANGE: Moderate urgency — vet needed, not an emergency
GREEN: Non-urgent — elective or mild concern

JSON Schema format to follow:
{
  "status": "question" | "complete",
  "question": "Your question text (empty if complete)",
  "options": ["Option 1", "Option 2", "Others"], // Empty if complete
  "report": null | {
    "urgencyLevel": "RED" | "ORANGE" | "GREEN",
    "summary": "Plain language recap of everything the owner described.",
    "differentialDiagnoses": [
       { "condition": "Condition Name", "probability": 67, "reasoning": "Explanation based on inputs" }
    ],
    "recommendedTests": ["Test 1", "Test 2"],
    "generalTreatment": "General line of treatment overview",
    "homeManagement": ["Advice 1", "Advice 2"],
    "warningSigns": ["Sign 1", "Sign 2"],
    "followUpRecommendation": "Re-consult timeline"
  }
}
`;

export async function getTriageNextStep(petData: any, history: {role: string, content: string}[]) {
  try {
    const ai = getAI();
    
    // In the new API, we can provide systemInstruction directly in the config.
    const systemContext = `
PET PROFILE:
Name: ${petData.petName}
Species: ${petData.species}
Breed: ${petData.breed}
Sex: ${petData.sex}
Age: ${petData.age}
Weight: ${petData.weight}
Vaccinations: ${petData.vaccinations.join(', ') || 'Unknown'}
Initial Issue: ${petData.problemDescription}
`;

    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents,
      config: {
        systemInstruction: DR_LILY_SYSTEM_PROMPT + '\n' + systemContext,
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    });

    const responseText = response.text || "{}";
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
}




