// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCha_5Z4QZA41TvvCjc1E8J9ClD52eS7NE",
  authDomain: "verifymykyc-78426.firebaseapp.com",
  projectId: "verifymykyc-78426",
  storageBucket: "verifymykyc-78426.firebasestorage.app",
  messagingSenderId: "1010588187987",
  appId: "1:1010588187987:web:30e78230ab2144857835a6",
  measurementId: "G-SVW7326TYH"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const analytics = getAnalytics(app);
