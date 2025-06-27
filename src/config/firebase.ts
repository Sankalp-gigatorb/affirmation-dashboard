// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABcbi890HHLgiUultzwBKX_JF4bm58v1o",
  authDomain: "wishara-3fc91.firebaseapp.com",
  projectId: "wishara-3fc91",
  storageBucket: "wishara-3fc91.firebasestorage.app",
  messagingSenderId: "630149572513",
  appId: "1:630149572513:web:88c27fd092b248bf514de0",
  measurementId: "G-K9QMSYR4LN",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;
