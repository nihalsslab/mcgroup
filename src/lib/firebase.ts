
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXsxHPmCY_4lNbFz7ysvVl-71m612zzcY",
  authDomain: "mcgroup-45a08.firebaseapp.com",
  projectId: "mcgroup-45a08",
  storageBucket: "mcgroup-45a08.firebasestorage.app",
  messagingSenderId: "271733798606",
  appId: "1:271733798606:web:746d105509b90a1b87029f",
  measurementId: "G-X84K6XJ0Q0"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, analytics };
