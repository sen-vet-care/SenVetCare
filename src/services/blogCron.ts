import { GoogleGenAI } from "@google/genai";
import admin from "firebase-admin";
import firebaseConfig from "../../firebase-applet-config.json";

if (!admin.apps.length) {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
    });
  } else {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
  const adminDb = admin.firestore();
  adminDb.settings({
    databaseId: firebaseConfig.firestoreDatabaseId,
    ignoreUndefinedProperties: true
  });
}
const adminDb = admin.firestore();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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

    try {
      const docRef = await adminDb.collection('blogs').add({
        title,
        excerpt,
        category,
        content,
        image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent(title + " pet care realistic high quality photo")}?width=800&height=400&nologo=true`,
        language: "EN",
        is_featured: false,
        published_at: new Date().toISOString()
      });
      console.log("Successfully generated and stored blog:", title);
      return { id: docRef.id };
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'blogs');
    }

  } catch (error) {
    console.error("Failed to generate blog:", error);
    throw error;
  }
}
