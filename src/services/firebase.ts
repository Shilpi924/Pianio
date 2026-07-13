import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import type { UserProfile } from "../types/userProfile";

const firebaseConfig = {
  apiKey: "AIzaSyDesSx5Fpn2PUnCTAUyMGUGD8Myt2-o1-8",
  authDomain: "pianio-ca9ff.firebaseapp.com",
  projectId: "pianio-ca9ff",
  storageBucket: "pianio-ca9ff.firebasestorage.app",
  messagingSenderId: "582601487615",
  appId: "1:582601487615:web:7d65154771a722cfba48ca",
  measurementId: "G-MY6HLCP088"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
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
  try {
    const docRef = doc(db, "users", userId, "profiles", profile.id);
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    console.error("Error saving profile to cloud", error);
  }
};

// Helper to get a profile from Firestore
export const getProfileFromCloud = async (userId: string, profileId: string) => {
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
