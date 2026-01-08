import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyDH-zCB2hneygPHbpo7MUWZCZ6LGHFYM48",
  authDomain: "fir-app-de564.firebaseapp.com",
  projectId: "fir-app-de564",
  storageBucket: "fir-app-de564.firebasestorage.app",
  messagingSenderId: "709273445405",
  appId: "1:709273445405:web:41f1d8b43875342b2552f4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

// export const app = initializeApp(firebaseConfig);
