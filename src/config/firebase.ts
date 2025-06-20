// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsK2AqdJgI8Qs8Tq5oz2AwYTIItpcmg7s",
  authDomain: "affirmation-dcb89.firebaseapp.com",
  projectId: "affirmation-dcb89",
  storageBucket: "affirmation-dcb89.firebasestorage.app",
  messagingSenderId: "943424358644",
  appId: "1:943424358644:web:a287f1c9a5e27614b536a1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;
