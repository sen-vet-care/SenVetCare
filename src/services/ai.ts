import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (aiInstance) return aiInstance;
  
  const apiKey = process.env.GEMINI_API_KEY || '';
                 
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

The clinic has these diagnostic services (Exclusively recommend these if tests are needed): 
- Digital Radiography
- Urinalysis
- Complete Blood Count (CBC)
- Biochemistry Panel
- Abdominal Ultrasound (USG)
- ECG
- Culture & Sensitivity
- Cytology
- SNAP Tests (Parvo, Distemper, Heartworm, etc.)

Clinic Doctors (Exclusively recommend these doctors from the clinic):
- Dr. Halder
- Dr. Karim
- Dr. Shivangi
- Dr. Bala
- Dr. Roy
- Dr. Shome

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
    "consultationId": "LILY-RPT-YYYYMMDD-XXXX",
    "summary": "Plain language recap of everything the owner described, written warmly as if confirming understanding.",
    "differentialDiagnoses": [
       { 
         "condition": "Condition Name", 
         "probability": 67, 
         "reasoning": "Specific explanation of WHY based on inputs. Mention symptoms provided." 
       }
    ],
    "recommendedTests": ["Test Name 1", "Test Name 2"],
    "clinicDiagnosticServices": [
       { "service": "Service Name", "inHouse": true, "description": "Short benefit of this test" }
    ],
    "generalTreatment": "General line of treatment overview (clinical approach, not specific meds)",
    "homeManagementAdvice": ["Advice 1", "Advice 2"],
    "warningSigns": ["Sign 1", "Sign 2"],
    "followUp": "Suggested timeline (e.g., 48 hours)",
    "recommendedDoctors": [
       { "name": "Dr. Name", "reason": "Why this doctor is relevant to this case" }
    ]
  }
}
`;

export async function getTriageNextStep(petData: any, history: {role: string, content: string}[]) {
  const systemContext = `
PET PROFILE:
Name: ${petData.petName}
Species: ${petData.species}
Breed: ${petData.breed}
Sex: ${petData.sex}
Age: ${petData.age} ${petData.ageUnit}
DOB: ${petData.dob}
Weight: ${petData.weight}
Vaccinations: ${petData.vaccinations.join(', ') || 'Unknown'}
Initial Issue: ${petData.problemDescription}
`;

  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  try {
    const ai = getAI();
    
    // In the new API, we can provide systemInstruction directly in the config.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
    console.error("Gemini AI API Error, attempting fallbacks:", error);
    
    if (process.env.OPENROUTER_API_KEY) {
      try {
        return await getTriageNextStepOpenRouter(systemContext, history);
      } catch (openRouterError) {
        console.error("OpenRouter AI Error:", openRouterError);
      }
    }
    
    if (process.env.MISTRAL_API_KEY) {
      try {
        return await getTriageNextStepMistral(systemContext, history);
      } catch (mistralError) {
        console.error("Mistral AI Error:", mistralError);
      }
    }
    
    if (process.env.NVIDIA_API_KEY) {
      try {
        return await getTriageNextStepNvidia(systemContext, history);
      } catch (nvidiaError) {
        console.error("Nvidia AI Error:", nvidiaError);
      }
    }
    
    throw new Error("All AI API providers failed.");
  }
}

async function getTriageNextStepOpenRouter(systemContext: string, history: {role: string, content: string}[]) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set. Please add it to your environment secrets.");
  }

  const messages = [
    { role: 'system', content: DR_LILY_SYSTEM_PROMPT + '\n' + systemContext }
  ];

  for (const msg of history) {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

async function getTriageNextStepMistral(systemContext: string, history: {role: string, content: string}[]) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY is not set.");

  const messages = [{ role: 'system', content: DR_LILY_SYSTEM_PROMPT + '\n' + systemContext }];
  for (const msg of history) {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    });
  }

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Mistral API error: ${response.status} ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

async function getTriageNextStepNvidia(systemContext: string, history: {role: string, content: string}[]) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error("NVIDIA_API_KEY is not set.");

  const messages = [{ role: 'system', content: DR_LILY_SYSTEM_PROMPT + '\n' + systemContext }];
  for (const msg of history) {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    });
  }

  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta/llama-3.1-70b-instruct",
      messages: messages,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Nvidia API error: ${response.status} ${response.statusText} - ${errText}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content || "{}";
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(content);
}




