import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5u1to-tpjErnrQZvNa8lKd5LU0iqkvT4",
  authDomain: "personal-finance-app-2e1a6.firebaseapp.com",
  projectId: "personal-finance-app-2e1a6",
  storageBucket: "personal-finance-app-2e1a6.firebasestorage.app",
  messagingSenderId: "103610631222",
  appId: "1:103610631222:web:b0ebb8f78f8a8771c34497",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
