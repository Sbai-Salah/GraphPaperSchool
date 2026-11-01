// Shared setup for every page. Fill in firebaseConfig (README, step 2).
// These values are meant to be public. Your data is protected by firestore.rules, not by hiding them.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail,
  updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, addDoc, collection, getDocs, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "PASTE_YOUR_API_KEY",
//   authDomain: "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "PASTE_YOUR_PROJECT_ID",
//   appId: "PASTE_YOUR_APP_ID"
// };

const firebaseConfig = {
  apiKey: "AIzaSyC1RPRiByaB5Vf_JWI-pc64v5tzNC_uOmo",
  authDomain: "handwrittencr.firebaseapp.com",
  projectId: "handwrittencr",
  appId: "1:363345638523:web:9fdc8fadea27bc4631dede",
  storageBucket: "handwrittencr.firebasestorage.app",
  messagingSenderId: "363345638523",
  measurementId: "G-2DFGSVRS2Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail,
  updateProfile, signOut, doc, getDoc, setDoc, addDoc, collection, getDocs, query, orderBy,
  serverTimestamp
};

const clip = (text, max) => (typeof text === "string" ? text.trim().slice(0, max) : "");

// Creates the student's small profile card once. Salah reads these in the Firebase console.
export async function ensureStudent(user, extra = {}) {
  const ref = doc(db, "students", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  await setDoc(ref, {
    displayName: clip(user.displayName || "", 60),
    email: user.email,
    level: extra.level || "",
    goal: clip(extra.goal || "", 200),
    createdAt: serverTimestamp()
  });
}

// Plain-language errors. Login never says which half (email or password) was wrong.
export function friendlyError(err) {
  switch (err && err.code) {
    case "auth/email-already-in-use": return "That email already has an account. Try logging in instead.";
    case "auth/invalid-email": return "That email address doesn't look right.";
    case "auth/weak-password": return "Pick a longer password (at least 8 characters).";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "The email or password is wrong. Check both and try again.";
    case "auth/too-many-requests": return "Too many tries. Wait a few minutes, then try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request": return "The Google window was closed before finishing. Try again.";
    case "auth/popup-blocked": return "Your browser blocked the Google window. Allow pop-ups for this site and try again.";
    case "auth/network-request-failed":
    case "unavailable": return "Can't reach the server. Check your internet connection and try again.";
    case "permission-denied": return "You need to confirm your email first. Open the link we sent you, then reload this page.";
    default: return "Something went wrong. Reload the page and try again.";
  }
}
