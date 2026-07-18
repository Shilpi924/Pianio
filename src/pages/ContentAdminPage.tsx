import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  CloudUpload,
  EyeOff,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Lesson } from '../types';
import { contentDatabaseService } from '../services/contentDatabaseService';

function normalizeRightsStatus(value?: Lesson['importMetadata'] extends infer M ? M extends { rightsStatus?: infer R } ? R : never : never) {
  return value ?? 'needs-clearance';
}

export default function ContentAdminPage() {
  const { goBack } = useAppStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [rightsReviewed, setRightsReviewed] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [lesson, setLesson] = useState<Lesson>({
    id: '',
    title: 'New Cloud Lesson',
    tempo: 80,
    difficulty: 'beginner',
    category: 'Pop',
    source: 'user-uploaded',
    notes: [],
    importMetadata: {
      rightsStatus: 'needs-clearance',
      rightsNote: 'Review rights before publishing.',
      savedToLibrary: false,
    },
  });

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedLesson = JSON.parse(e.target?.result as string) as Lesson & { isPublished?: boolean };
        setLesson({
          ...importedLesson,
          importMetadata: {
            sourceType: importedLesson.importMetadata?.sourceType,
            tempoConfidence: importedLesson.importMetadata?.tempoConfidence,
            savedToLibrary: importedLesson.importMetadata?.savedToLibrary ?? false,
            rightsStatus: importedLesson.importMetadata?.rightsStatus ?? 'needs-clearance',
            rightsNote: importedLesson.importMetadata?.rightsNote ?? 'Review rights before publishing.',
          },
        });
        setRightsReviewed((importedLesson.importMetadata?.rightsStatus ?? 'needs-clearance') !== 'needs-clearance');
        setIsPublished(Boolean(importedLesson.isPublished));
        alert('Lesson imported successfully! You can now review and publish it.');
      } catch {
        alert('Error importing lesson. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const saveLesson = async (nextPublished: boolean) => {
    if (lesson.notes.length === 0) {
      alert('Cannot save a lesson without notes!');
      return;
    }

    if (nextPublished && !rightsReviewed) {
      alert('Please mark the rights as reviewed before publishing.');
      return;
    }

    const lessonId = lesson.id || lesson.title.toLowerCase().replace(/\s+/g, '-');
    const nextLesson: Lesson & { isPublished: boolean; createdAt?: string } = {
      ...lesson,
      id: lessonId,
      isPublished: nextPublished,
      importMetadata: {
        ...lesson.importMetadata,
        savedToLibrary: true,
        rightsStatus: nextPublished
          ? (lesson.importMetadata?.rightsStatus === 'needs-clearance' ? 'licensed' : lesson.importMetadata?.rightsStatus ?? 'licensed')
          : lesson.importMetadata?.rightsStatus ?? 'needs-clearance',
        rightsNote: nextPublished
          ? lesson.importMetadata?.rightsNote || 'Reviewed and approved for publishing.'
          : lesson.importMetadata?.rightsNote || 'Saved as draft for review.',
      },
      createdAt: new Date().toISOString(),
    };

    try {
      if (nextPublished) {
        setIsPublishing(true);
      } else {
        setIsSavingDraft(true);
      }

      await contentDatabaseService.saveLesson(nextLesson);
      setIsPublished(nextPublished);
      alert(nextPublished ? 'Lesson published successfully to the cloud database!' : 'Draft saved successfully.');
    } catch (error) {
      console.error(error);
      alert(nextPublished ? 'Failed to publish lesson to cloud.' : 'Failed to save draft.');
    } finally {
      setIsPublishing(false);
      setIsSavingDraft(false);
    }
  };

  const handleUnpublish = async () => {
    const lessonId = lesson.id || lesson.title.toLowerCase().replace(/\s+/g, '-');
    const unpublishedLesson: Lesson & { isPublished: boolean; createdAt?: string } = {
      ...lesson,
      id: lessonId,
      isPublished: false,
      importMetadata: {
        ...lesson.importMetadata,
        savedToLibrary: true,
        rightsStatus: lesson.importMetadata?.rightsStatus ?? 'needs-clearance',
        rightsNote: lesson.importMetadata?.rightsNote || 'Unpublished from the public library.',
      },
      createdAt: new Date().toISOString(),
    };

    try {
      setIsPublishing(true);
      await contentDatabaseService.saveLesson(unpublishedLesson);
      setIsPublished(false);
      alert('Lesson unpublished from the public library.');
    } catch (error) {
      console.error(error);
      alert('Failed to unpublish lesson.');
    } finally {
      setIsPublishing(false);
    }
  };

  const rightsStatus = normalizeRightsStatus(lesson.importMetadata?.rightsStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-8 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back</span>
          </motion.button>

          <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400">
            Content Admin Dashboard
          </h1>
        </div>

        <div className="card space-y-6">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/30">
            <h2 className="mb-2 font-semibold text-indigo-900 dark:text-indigo-100">Review, draft, publish</h2>
            <p className="mb-4 text-sm text-indigo-700 dark:text-indigo-300">
              Import a JSON lesson, verify rights, save a draft, or publish only when it is cleared.
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
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-indigo-600 shadow dark:bg-gray-800 dark:text-indigo-400"
              >
                <Upload className="h-4 w-4" />
                Upload JSON
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                <BadgeCheck className="h-4 w-4 text-indigo-500" />
                Review
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                Rights reviewed: {rightsReviewed ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                Rights status
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {rightsStatus}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                <CloudUpload className="h-4 w-4 text-emerald-500" />
                Public state
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {isPublished ? 'Published' : 'Draft'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2 dark:bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tempo (BPM)</label>
                <input
                  type="number"
                  value={lesson.tempo}
                  onChange={(e) => setLesson({ ...lesson, tempo: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty</label>
                <select
                  value={lesson.difficulty}
                  onChange={(e) => setLesson({ ...lesson, difficulty: e.target.value as Lesson['difficulty'] })}
                  className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2 dark:bg-gray-700"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <input
                type="text"
                value={lesson.category}
                onChange={(e) => setLesson({ ...lesson, category: e.target.value })}
                className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes Count</label>
              <div className="rounded-lg bg-gray-100 px-4 py-2 font-mono text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {lesson.notes.length} notes loaded
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <input
                  type="checkbox"
                  checked={rightsReviewed}
                  onChange={(e) => setRightsReviewed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  <span className="block font-semibold text-slate-900 dark:text-white">Rights reviewed</span>
                  <span className="block text-sm text-slate-500 dark:text-slate-300">
                    I confirm this song can be published based on the rights attached to it.
                  </span>
                </span>
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPublished(false)}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-bold ${
                      !isPublished
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                        : 'bg-white text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublished(true)}
                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-bold ${
                      isPublished ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-100">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="h-4 w-4" />
              Rights note
            </div>
            <p className="mt-2">
              {lesson.importMetadata?.rightsNote ?? 'This file was parsed locally. Confirm you have the rights to share or publish it before making it public.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 md:grid md:grid-cols-3">
            <button
              onClick={() => saveLesson(false)}
              disabled={isSavingDraft}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-3 font-bold text-slate-800 shadow-lg transition-all hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              <EyeOff className="h-5 w-5" />
              {isSavingDraft ? 'Saving...' : 'Save draft'}
            </button>
            <button
              onClick={() => saveLesson(true)}
              disabled={isPublishing}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white shadow-lg transition-all ${
                isPublishing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'
              }`}
            >
              <CloudUpload className="h-5 w-5" />
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
            <button
              onClick={handleUnpublish}
              disabled={isPublishing}
              className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 font-bold text-white shadow-lg transition-all hover:bg-rose-600 disabled:opacity-50"
            >
              <ShieldCheck className="h-5 w-5" />
              Unpublish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
