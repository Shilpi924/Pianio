import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUserProfileStore } from '../store/useUserProfileStore';

export function useCloudSync() {
  const { profiles } = useUserProfileStore();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const fetchProfiles = async () => {
          try {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.profiles && Object.keys(data.profiles).length > 0) {
                useUserProfileStore.setState((state) => ({
                  profiles: { ...state.profiles, ...data.profiles },
                  hasCompletedOnboarding: true
                }));
              }
            }
          } catch (e) {
            console.error('Failed to fetch cloud profiles', e);
          }
        };
        fetchProfiles();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const syncToCloud = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, { profiles }, { merge: true });
        } catch (e) {
          console.error('Failed to sync to cloud', e);
        }
      };
      
      const timeoutId = setTimeout(syncToCloud, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [profiles, user]);
}
