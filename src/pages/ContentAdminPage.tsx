import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CloudUpload } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Lesson } from '../types';
import { contentDatabaseService } from '../services/contentDatabaseService';

export default function ContentAdminPage() {
  const { setCurrentView } = useAppStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [lesson, setLesson] = useState<Lesson>({
    id: '',
    title: 'New Cloud Lesson',
    tempo: 80,
    difficulty: 'beginner',
    category: 'Pop',
    source: 'user-uploaded',
    notes: [],
  });

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedLesson = JSON.parse(e.target?.result as string);
        setLesson(importedLesson);
        alert('Lesson imported successfully! You can now publish it.');
      } catch (_error) {
        alert('Error importing lesson. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handlePublish = async () => {
    if (lesson.notes.length === 0) {
      alert('Cannot publish a lesson without notes!');
      return;
    }

    try {
      setIsPublishing(true);
      const lessonWithId = {
        ...lesson,
        id: lesson.id || lesson.title.toLowerCase().replace(/\s+/g, '-'),
        isPublished: true
      };
      
      await contentDatabaseService.saveLesson(lessonWithId);
      alert('Lesson published successfully to the cloud database!');
    } catch (error) {
      console.error(error);
      alert('Failed to publish lesson to cloud.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </motion.button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            Content Admin Dashboard
          </h1>
        </div>

        <div className="card space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <h2 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Publish a Song</h2>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
              Import a JSON file of a completed lesson and publish it directly to the Cloud Firestore database for all users to see.
            </p>
            <div className="flex gap-4">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="admin-import"
              />
              <button
                onClick={() => document.getElementById('admin-import')?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-lg shadow font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload JSON
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tempo (BPM)</label>
                <input
                  type="number"
                  value={lesson.tempo}
                  onChange={(e) => setLesson({ ...lesson, tempo: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                <select
                  value={lesson.difficulty}
                  onChange={(e) => setLesson({ ...lesson, difficulty: e.target.value as any })}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input
                type="text"
                value={lesson.category}
                onChange={(e) => setLesson({ ...lesson, category: e.target.value })}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes Count</label>
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 font-mono">
                {lesson.notes.length} notes loaded
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                isPublishing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'
              }`}
            >
              <CloudUpload className="w-5 h-5" />
              {isPublishing ? 'Publishing...' : 'Publish to Cloud'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
