import admin from "firebase-admin";
import firebaseConfig from "./firebase-applet-config.json";

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
  const adminDb = admin.firestore();
  adminDb.settings({
    databaseId: firebaseConfig.firestoreDatabaseId,
    ignoreUndefinedProperties: true
  });
}
const adminDb = admin.firestore();

async function main() {
  console.log("Seeding blog 1...");
  await adminDb.collection('blogs').add({
    title: "Understanding Tick Fever Season in Kolkata",
    excerpt: "Tick-borne diseases are on the rise this monsoon in Kolkata. Here is what pet owners need to know about prevention.",
    category: "News",
    content: "# Understanding Tick Fever Season in Kolkata\n\nWith the arrival of the monsoon season in Kolkata, veterinary clinics have reported a sharp increase in cases of tick fever among dogs. The warm and humid climate provides a perfect breeding ground for ticks.\n\n### What to look out for?\n1. Lethargy and weakness\n2. Loss of appetite\n3. High fever\n4. Unusually pale gums\n\n### Preventive Measures\n**Dr. Lily** strongly recommends checking your pet's coat daily, applying veterinary-approved tick solutions, and keeping the environment clean. Early detection is key!",
    language: "EN",
    image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent("Understanding Tick Fever Season in Kolkata pet care realistic high quality photo")}?width=800&height=400&nologo=true`,
    is_featured: true,
    published_at: new Date().toISOString()
  });

  console.log("Seeding blog 2...");
  await adminDb.collection('blogs').add({
    title: "Summer Heat Wave: Protecting Street Dogs and Pets",
    excerpt: "With temperatures soaring above 40°C in Kolkata, extreme heat is a crisis for animals. Learn how to help.",
    category: "News",
    content: "# Summer Heat Wave: Protecting Street Dogs and Pets\n\nKolkata is experiencing unprecedented heatwaves this summer, posing severe risks of heatstroke for both pets and street animals.\n\n### Protecting Your Pets\nAvoid walking dogs during peak afternoon hours. Ensure fresh, cool water is always available and keep them in well-ventilated or air-conditioned rooms.\n\n### How to Help Street Dogs\n1. Place mud bowls with fresh water outside your home.\n2. Allow them to rest in the shade of your building's stilt parking or porch.\n3. Watch for signs of heavy panting or drooling, which indicate distress.\n\nLet's keep our community safe together.",
    language: "EN",
    image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent("Summer Heat Wave: Protecting Street Dogs and Pets realistic photo")}?width=800&height=400&nologo=true`,
    is_featured: false,
    published_at: new Date(Date.now() - 86400000).toISOString()
  });
  console.log("Seeding complete!");
}

main().catch(console.error);
