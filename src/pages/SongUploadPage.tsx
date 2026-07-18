import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, XCircle, ArrowLeft, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SongImportService } from '../services/songImportService';
import type { Lesson } from '../types';

export default function SongUploadPage() {
  const { setCurrentView, setCurrentLesson } = useAppStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedLesson, setParsedLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploadedFile(file);
    setError(null);
    setIsProcessing(true);
    setParsedLesson(null);

    const lower = file.name.toLowerCase();
    const supported = lower.endsWith('.xml') || lower.endsWith('.musicxml') || lower.endsWith('.mid') || lower.endsWith('.midi');
    if (!supported) {
      setError('Please upload a .xml, .musicxml, .mid, or .midi file');
      setIsProcessing(false);
      return;
    }

    try {
      const content = lower.endsWith('.mid') || lower.endsWith('.midi') ? '' : await file.text();

      if (!SongImportService.validate(content, file.name)) {
        setError('Invalid song file format');
        setIsProcessing(false);
        return;
      }

      const lesson = await SongImportService.parseFile(file);
      
      if (!lesson) {
        setError('Failed to parse the song file. Please check the file format.');
        setIsProcessing(false);
        return;
      }

      setParsedLesson(lesson);
    } catch (err) {
      setError('Error reading file: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaySong = () => {
    if (parsedLesson) {
      setCurrentLesson(parsedLesson);
      setCurrentView('lesson');
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setParsedLesson(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
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

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Upload Your Song
          </h1>

          <div className="w-24" />
        </div>

        {/* Upload Area */}
        {!parsedLesson && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
          >
            <div
              className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Drop your song file here
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                or click to browse
              </p>
              <input
                type="file"
                accept=".xml,.musicxml"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-600 transition-colors font-semibold"
              >
                Select File
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Supports .xml, .musicxml, .mid, and .midi files
              </p>
            </div>

            {isProcessing && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Processing file...</p>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center gap-3"
              >
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Parsed Result */}
        {parsedLesson && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Success Message */}
            <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-500">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
                    Song Uploaded Successfully!
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    {uploadedFile?.name} has been parsed
                  </p>
                </div>
              </div>
            </div>

            {/* Song Details */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {parsedLesson.title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {parsedLesson.notes.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Notes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {parsedLesson.tempo}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">BPM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 capitalize">
                    {parsedLesson.difficulty}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Difficulty</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {parsedLesson.category}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Category</div>
                </div>
              </div>

              {/* Note Preview */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  First 10 Notes:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {parsedLesson.notes.slice(0, 10).map((note, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {note.note}
                    </span>
                  ))}
                  {parsedLesson.notes.length > 10 && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                      +{parsedLesson.notes.length - 10} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlaySong}
                  className="flex-1 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-bold text-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-6 h-6" />
                  Play Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  Upload Another
                </motion.button>
              </div>
            </div>

            {/* Info Box */}
            <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    About User-Uploaded Songs
                  </h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• Songs you upload are stored locally in your browser</li>
                    <li>• You are responsible for ensuring you have the right to use the sheet music</li>
                    <li>• Finger numbers and hand assignments are set to defaults - you can edit them later</li>
                    <li>• For best results, use MusicXML files when you want the most accurate note timing</li>
                    <li>• MIDI files also work well when you mainly need melody and rhythm</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
