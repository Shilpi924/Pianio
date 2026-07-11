import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Save, Play, Download, Upload } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Lesson, Note } from '../types';
import PianoKeyboard from '../components/PianoKeyboard';

export default function LessonCreatorPage() {
  const { setCurrentView } = useAppStore();
  
  const [lesson, setLesson] = useState<Lesson>({
    id: '',
    title: 'New Lesson',
    tempo: 80,
    difficulty: 'beginner',
    category: 'Custom',
    source: 'user-uploaded',
    notes: [],
  });

  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleAddNote = (note: string) => {
    const newNote: Note = {
      note,
      duration: 1,
      finger: 1,
      hand: 'right',
    };
    setLesson((prev) => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }));
    setSelectedNoteIndex(lesson.notes.length);
  };

  const handleUpdateNote = (index: number, updates: Partial<Note>) => {
    setLesson((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) => (i === index ? { ...note, ...updates } : note)),
    }));
  };

  const handleDeleteNote = (index: number) => {
    setLesson((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
    setSelectedNoteIndex(null);
  };

  const handleSave = () => {
    const lessonWithId = {
      ...lesson,
      id: lesson.id || lesson.title.toLowerCase().replace(/\s+/g, '-'),
    };
    
    // Save to localStorage for now
    const savedLessons = JSON.parse(localStorage.getItem('customLessons') || '[]');
    savedLessons.push(lessonWithId);
    localStorage.setItem('customLessons', JSON.stringify(savedLessons));
    
    alert('Lesson saved successfully!');
  };

  const handleExport = () => {
    const lessonWithId = {
      ...lesson,
      id: lesson.id || lesson.title.toLowerCase().replace(/\s+/g, '-'),
    };
    
    const dataStr = JSON.stringify(lessonWithId, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${lessonWithId.title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedLesson = JSON.parse(e.target?.result as string);
        setLesson(importedLesson);
        alert('Lesson imported successfully!');
      } catch (_error) {
        alert('Error importing lesson. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const selectedNote = selectedNoteIndex !== null ? lesson.notes[selectedNoteIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </motion.button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Lesson Creator
          </h1>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('import-input')?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span className="font-semibold">Import</span>
            </motion.button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Lesson Details & Notes */}
          <div className="space-y-6">
            {/* Lesson Details */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Lesson Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tempo (BPM)
                  </label>
                  <input
                    type="number"
                    value={lesson.tempo}
                    onChange={(e) => setLesson({ ...lesson, tempo: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={lesson.difficulty}
                    onChange={(e) => setLesson({ ...lesson, difficulty: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={lesson.category}
                    onChange={(e) => setLesson({ ...lesson, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Notes List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Notes ({lesson.notes.length})
                </h2>
                <button
                  onClick={() => setLesson({ ...lesson, notes: [] })}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lesson.notes.map((note, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedNoteIndex(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedNoteIndex === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold">{note.note}</span>
                        <span className="text-sm opacity-75">
                          {note.hand} • Finger {note.finger}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(index);
                        }}
                        className="p-1 hover:bg-red-500 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {lesson.notes.length === 0 && (
                <p className="text-center text-gray-600 dark:text-gray-300 py-8">
                  Click on the piano to add notes
                </p>
              )}
            </div>

            {/* Note Editor */}
            {selectedNote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Edit Note
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Note
                    </label>
                    <input
                      type="text"
                      value={selectedNote.note}
                      onChange={(e) => handleUpdateNote(selectedNoteIndex!, { note: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (beats)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedNote.duration}
                      onChange={(e) => handleUpdateNote(selectedNoteIndex!, { duration: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Finger (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={selectedNote.finger}
                      onChange={(e) => handleUpdateNote(selectedNoteIndex!, { finger: parseInt(e.target.value) as any })}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hand
                    </label>
                    <select
                      value={selectedNote.hand}
                      onChange={(e) => handleUpdateNote(selectedNoteIndex!, { hand: e.target.value as any })}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPreviewing(!isPreviewing)}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Preview
              </motion.button>
            </div>
          </div>

          {/* Right Column - Piano */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Piano
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Click keys to add notes to your lesson
              </p>
              <PianoKeyboard
                onNoteOn={handleAddNote}
                highlightedNotes={selectedNote ? [selectedNote.note] : []}
              />
            </div>

            {isPreviewing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Preview
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Title:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{lesson.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Tempo:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{lesson.tempo} BPM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Difficulty:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{lesson.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Category:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{lesson.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Notes:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{lesson.notes.length}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
