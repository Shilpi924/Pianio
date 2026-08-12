import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import type { UserProfile } from "../types/userProfile";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Verify the user object exists before returning
    if (!result.user) {
      throw new Error("Authentication failed: No user returned");
    }
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Helper to save a profile to Firestore
export const saveProfileToCloud = async (userId: string, profile: UserProfile) => {
  if (!userId || !profile?.id) {
    console.error("Invalid parameters: userId and profile.id are required");
    return;
  }
  try {
    const docRef = doc(db, "users", userId, "profiles", profile.id);
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    console.error("Error saving profile to cloud", error);
    throw error;
  }
};

// Helper to get a profile from Firestore
export const getProfileFromCloud = async (userId: string, profileId: string) => {
  if (!userId || !profileId) {
    console.error("Invalid parameters: userId and profileId are required");
    return null;
  }
  try {
    const docRef = doc(db, "users", userId, "profiles", profileId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting profile from cloud", error);
    return null;
  }
};
