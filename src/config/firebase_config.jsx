import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQ08i9b2kHgrPdvnd9WpBEQEQ3DEI_L6c",
  authDomain: "contract-portal-connectia.firebaseapp.com",
  projectId: "contract-portal-connectia",
  storageBucket: "contract-portal-connectia.appspot.com",
  messagingSenderId: "245700196616",
  appId: "1:245700196616:web:b6134290b966fd868954bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);