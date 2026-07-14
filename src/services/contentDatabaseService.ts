import { collection, getDocs, doc, setDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Lesson } from '../types';

export const contentDatabaseService = {
  /**
   * Fetch all published lessons from Firestore
   */
  async getLessons(): Promise<Lesson[]> {
    try {
      const q = query(
        collection(db, 'lessons'),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const lessons: Lesson[] = [];
      
      querySnapshot.forEach((doc) => {
        lessons.push({ id: doc.id, ...doc.data() } as Lesson);
      });
      
      return lessons;
    } catch (error) {
      console.error('Error fetching lessons from cloud database:', error);
      return [];
    }
  },

  /**
   * Save or update a lesson in Firestore (Admin Only)
   */
  async saveLesson(lesson: Partial<Lesson> & { id: string, isPublished: boolean }): Promise<void> {
    try {
      const lessonRef = doc(db, 'lessons', lesson.id);
      
      const lessonData = {
        ...lesson,
        updatedAt: new Date().toISOString(),
        createdAt: lesson.createdAt || new Date().toISOString()
      };
      
      await setDoc(lessonRef, lessonData, { merge: true });
      console.log(`Lesson ${lesson.id} saved to cloud database.`);
    } catch (error) {
      console.error('Error saving lesson to cloud database:', error);
      throw error;
    }
  }
};
