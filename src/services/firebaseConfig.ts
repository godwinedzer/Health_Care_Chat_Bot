// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8sEdP7ZpByxTDDDQbOYq2UpRudnPyo-o",
  authDomain: "health-chat-bot-b4009.firebaseapp.com",
  projectId: "health-chat-bot-b4009",
  storageBucket: "health-chat-bot-b4009.firebasestorage.app",
  messagingSenderId: "253268230343",
  appId: "1:253268230343:web:dee0b058239f633ca8bee2",
  measurementId: "G-VP6096WPNP"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;