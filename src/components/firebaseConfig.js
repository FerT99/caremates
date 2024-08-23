// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4vBKInMDRI72Ec0YMV8NNzPIgkypOnbM",
  authDomain: "caremates-app.firebaseapp.com",
  projectId: "caremates-app",
  storageBucket: "caremates-app.appspot.com",
  messagingSenderId: "913764806409",
  appId: "1:913764806409:web:a8257dbee4be5d90b9edd8",
  measurementId: "G-S4VJHRRNMT"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };
