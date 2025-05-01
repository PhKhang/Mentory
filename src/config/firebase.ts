import admin from "firebase-admin";
import { initializeApp, ServiceAccount } from "firebase-admin/app";
import serviceAccount from './serviceAccountKey.json';
import { initializeApp as initializeFirebaseApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getAuth as getAuthAdmin } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  // storageBucket: "YOUR PROJECT.appspot.com",
  // messagingSenderId: "MESSAGING ID",
  appId: process.env.APP_ID,
};

const app = initializeFirebaseApp(firebaseConfig);
const fire = initializeApp({credential: admin.credential.cert(serviceAccount as ServiceAccount)});
const auth = getAuth(app);
const authAdmin = getAuthAdmin(fire);
const dbAdmin = getFirestore(fire);

export { auth, authAdmin, dbAdmin };
