import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import fs from "fs";

const configPath = "./firebase-applet-config.json";
if (!fs.existsSync(configPath)) {
  console.error("No config found.");
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app, config.firestoreDatabaseId);

const admins = [
  { email: "drtbsmemorialvetclinic@gmail.com", pass: "admin123" },
  { email: "senvetcare@gmail.com", pass: "1Youneverknow#" },
  { email: "contact@senvetcare.com", pass: "1Youneverknow#" }
];

async function seed() {
  for (const admin of admins) {
    let uid = "";
    try {
      const userCred = await createUserWithEmailAndPassword(auth, admin.email, admin.pass);
      uid = userCred.user.uid;
      console.log(`Created admin auth: ${admin.email}`);
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        console.log(`Admin already exists auth: ${admin.email}`);
        try {
            const userCred = await signInWithEmailAndPassword(auth, admin.email, admin.pass);
            uid = userCred.user.uid;
        } catch (e) {
            console.error("Failed to sign in existing admin:", e);
        }
      } else {
        console.error(`Failed to create ${admin.email}:`, err.message);
      }
    }
    
    if (uid) {
        try {
          await setDoc(doc(db, "users", uid), {
            email: admin.email,
            role: "admin",
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
          });
          console.log(`Saved admin firestore: ${admin.email}`);
        } catch(e) {
             console.error("Failed to save to firestore:", e);
        }
    }
  }
  
  // Also create initial app settings
  try {
     await setDoc(doc(db, "settings", "config"), {
        notificationsEnabled: true,
        webAccessEnabled: true
     });
     console.log("Created initial app settings.");
  } catch (err: any) {
    console.error("Failed to set config:", err.message);
  }
  
  process.exit(0);
}

seed();
