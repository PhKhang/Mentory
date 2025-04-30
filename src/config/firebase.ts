import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

const fire = initializeApp(firebaseConfig);
const auth = getAuth(fire);

export { auth };
