// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config (replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyAG2qC9-Addcoz1S8QnH6CObpqZnFVE4sY",
  authDomain: "attendance-management-b58f5.firebaseapp.com",
  projectId: "attendance-management-b58f5",
  storageBucket: "attendance-management-b58f5.appspot.com",
  messagingSenderId: "1064034709705",
  appId: "1:1064034709705:web:YOUR_APP_ID_HERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and database
export const auth = getAuth(app);
export const db = getFirestore(app);
