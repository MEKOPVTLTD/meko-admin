import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "meko-5251d.firebaseapp.com",
  projectId: "meko-5251d",
  storageBucket: "meko-5251d.appspot.com",
  messagingSenderId: "85332297142",
  appId: "1:85332297142:web:752b9f3f3c01f270b42d17",
  measurementId: "G-7JB2X7HKQN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

export const USERS_COLLECTION = "Users";
