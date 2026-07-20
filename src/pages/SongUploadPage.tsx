import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, XCircle, ArrowLeft, Play, Library, BadgeCheck, ShieldCheck, PencilLine, Share2, Users } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SongImportService } from '../services/songImportService';
import { communityLibraryService } from '../services/communityLibraryService';
import type { Lesson } from '../types';

export default function SongUploadPage() {
  const { setCurrentView, setCurrentLesson, addCustomLesson } = useAppStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedLesson, setParsedLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [shareToCommunity, setShareToCommunity] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

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

      addCustomLesson(lesson);
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

  const handleOpenLibrary = () => {
    setCurrentLesson(null);
    setCurrentView('lesson');
  };

  const fileLabel = uploadedFile?.name ?? 'No file selected';
  const fileTypeLabel = uploadedFile
    ? uploadedFile.name.toLowerCase().endsWith('.mid') || uploadedFile.name.toLowerCase().endsWith('.midi')
      ? 'MIDI'
      : 'MusicXML'
    : 'MusicXML or MIDI';

  const handleReset = () => {
    setUploadedFile(null);
    setParsedLesson(null);
    setError(null);
    setShareToCommunity(false);
    setShareSuccess(false);
  };

  const handleShareToCommunity = async () => {
    if (!parsedLesson || !uploaderName.trim()) {
      setError('Please enter your name to share with the community');
      return;
    }

    setIsSharing(true);
    try {
      await communityLibraryService.uploadToCommunity(
        parsedLesson,
        uploaderName.trim(),
        [parsedLesson.category, parsedLesson.difficulty]
      );
      setShareSuccess(true);
    } catch (error) {
      setError('Failed to share to community: ' + (error as Error).message);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.14),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#fff7ed_100%)] p-6 md:p-8 dark:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.16),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#111827_100%)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </motion.button>

          <div className="hidden md:block" />
        </div>

        <div className="mb-6 overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                Library import
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Upload a song and keep it in your library
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
                Drop in a licensed MusicXML or MIDI file and Pianio will save it as a playable lesson with timing, note data, and a smooth preview.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:min-w-[280px]">
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg">
                <div className="text-[11px] uppercase tracking-[0.25em] text-cyan-300">Default hear mode</div>
                <div className="mt-1 text-xl font-black">90 BPM</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 px-4 py-3 text-white shadow-lg">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">Visual speed</div>
                <div className="mt-1 text-xl font-black">1.5x</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!parsedLesson && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 md:p-6"
          >
            <div
              className={`rounded-[1.5rem] border-2 border-dashed p-10 text-center transition-all md:p-12 ${
                dragActive
                  ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-900/20'
                  : 'border-slate-300 bg-white/60 hover:border-cyan-400 dark:border-slate-700 dark:bg-slate-950/20 dark:hover:border-cyan-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-white shadow-xl">
                <Upload className="h-9 w-9" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-slate-950 dark:text-white">
                Drop your song file here
              </h3>
              <p className="mb-5 text-slate-600 dark:text-slate-300">
                or click to browse
              </p>
              <input
                type="file"
                accept=".xml,.musicxml,.mid,.midi"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Select File
              </label>
              <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/80 p-4 text-left shadow-sm dark:bg-slate-950/70">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Best timing</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">MusicXML keeps note lengths most accurate.</div>
                </div>
                <div className="rounded-2xl bg-white/80 p-4 text-left shadow-sm dark:bg-slate-950/70">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">Fast import</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">MIDI is great for quick playback and practice.</div>
                </div>
                <div className="rounded-2xl bg-white/80 p-4 text-left shadow-sm dark:bg-slate-950/70">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Saved locally</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">Your import stays in your browser library.</div>
                </div>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                Supports .xml, .musicxml, .mid, and .midi files
              </p>
            </div>

            {isProcessing && (
              <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 text-center dark:border-cyan-900/50 dark:bg-cyan-900/20">
                <div className="mx-auto inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
                <p className="mt-2 font-semibold text-cyan-700 dark:text-cyan-200">Processing file...</p>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900/50 dark:bg-red-900/20"
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
            <div className="card overflow-hidden border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 shadow-xl dark:border-emerald-900/60 dark:from-emerald-900/20 dark:via-slate-900 dark:to-cyan-900/20">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-800 dark:text-emerald-200">
                    Song Uploaded Successfully!
                  </h3>
                  <p className="text-emerald-700/90 dark:text-emerald-300">
                    {fileLabel} has been parsed and added to your library
                  </p>
                </div>
              </div>
            </div>

            {/* Song Details */}
            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white dark:bg-white dark:text-slate-950">
                    Imported lesson
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-3xl">
                    {parsedLesson.title}
                  </h3>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                  <div className="font-semibold text-slate-900 dark:text-white">{fileTypeLabel}</div>
                  <div>{fileLabel}</div>
                </div>
              </div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <Library className="h-3.5 w-3.5" />
                  Saved to library
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {parsedLesson.importMetadata?.rightsStatus ?? 'needs-clearance'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                  {parsedLesson.importMetadata?.sourceType ?? 'Imported'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  Tempo confidence: {parsedLesson.importMetadata?.tempoConfidence ?? 'medium'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
                <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-950/60">
                  <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                    {parsedLesson.notes.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Notes</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-950/60">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {parsedLesson.tempo}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">BPM</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-950/60">
                  <div className="text-2xl font-black capitalize text-violet-600 dark:text-violet-400">
                    {parsedLesson.difficulty}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Difficulty</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-950/60">
                  <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                    {parsedLesson.category}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Category</div>
                </div>
              </div>
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-100">
                <div className="flex items-center gap-2 font-bold">
                  <PencilLine className="h-4 w-4" />
                  Rights note
                </div>
                <p className="mt-2">
                  {parsedLesson.importMetadata?.rightsNote ?? 'This file was parsed locally. Confirm you have the rights to share or publish it before making it public.'}
                </p>
              </div>

              <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                <div className="flex items-center gap-2 font-bold text-slate-950 dark:text-white">
                  <BadgeCheck className="h-4 w-4 text-emerald-500" />
                  Import summary
                </div>
                <p className="mt-2">
                  {parsedLesson.sourceName || 'Imported file'} was added to your local song library and is ready to play or edit later.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900/70">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Source type</div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                      {parsedLesson.importMetadata?.sourceType ?? 'Imported'}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900/70">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Tempo confidence</div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                      {parsedLesson.importMetadata?.tempoConfidence ?? 'medium'}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900/70">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Library status</div>
                    <div className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      Saved locally
                    </div>
                  </div>
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
                  className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-lg font-black text-white shadow-xl transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Play className="w-6 h-6" />
                  Play Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Upload Another
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenLibrary}
                  className="flex-1 rounded-2xl border border-violet-200 bg-violet-50 py-4 font-semibold text-violet-700 shadow-sm transition-colors hover:bg-violet-100 dark:border-violet-900/60 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/30"
                >
                  Open Library
                </motion.button>
              </div>

              {/* Community Sharing Section */}
              <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-900/60 dark:bg-purple-900/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900 dark:text-purple-100">Share with Community</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Let other users learn from your song arrangement</p>
                  </div>
                </div>

                {!shareSuccess ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                        Your Name (required for sharing)
                      </label>
                      <input
                        type="text"
                        value={uploaderName}
                        onChange={(e) => setUploaderName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-purple-300 bg-white px-4 py-2 text-purple-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-purple-700 dark:bg-purple-950 dark:text-purple-100"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="share-community"
                        checked={shareToCommunity}
                        onChange={(e) => setShareToCommunity(e.target.checked)}
                        className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="share-community" className="text-sm text-purple-700 dark:text-purple-300">
                        Share this song with the Pianio community (requires approval)
                      </label>
                    </div>

                    {shareToCommunity && (
                      <motion.button
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShareToCommunity}
                        disabled={isSharing || !uploaderName.trim()}
                        className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-bold text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSharing ? (
                          <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sharing...
                          </>
                        ) : (
                          <>
                            <Share2 className="h-5 w-5" />
                            Share to Community
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl bg-emerald-100 p-4 text-center dark:bg-emerald-900/30"
                  >
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                    <p className="font-bold text-emerald-900 dark:text-emerald-100">Shared Successfully!</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">Your song is pending approval and will be available to the community soon.</p>
                  </motion.div>
                )}
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
