
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase Web SDK Config
const firebaseConfig = {
  apiKey: "AIzaSyDx3nHG2ERQZJkJLn5aTQ6W7B17AajnDtw",
  authDomain: "project-pig-1a8d7.firebaseapp.com",
  projectId: "project-pig-1a8d7",
  storageBucket: "project-pig-1a8d7.firebasestorage.app",
  messagingSenderId: "867306907812",
  appId: "1:867306907812:web:7d9e6dbb99aa3d27a19e31",
  measurementId: "G-JJR1ES0J8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
