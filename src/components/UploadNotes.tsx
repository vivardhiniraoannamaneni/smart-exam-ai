import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, RotateCw, AlertCircle, Copy } from "lucide-react";
import { useApp } from "../AppContext";

export const UploadNotes: React.FC = () => {
  const {
    currentNotes,
    setCurrentNotes,
    currentTopic,
    setCurrentTopic,
    triggerGenerateMindMap,
    triggerGenerateKeyPoints,
    triggerGenerateFormulas,
    triggerGenerateOneNight,
    isLoading
  } = useApp();

  const [isDragging, setIsDragging] = useState(false);
  const [successVal, setSuccessVal] = useState<string | null>(null);
  const [pasteNotes, setPasteNotes] = useState(currentNotes);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAllAI = async () => {
    setSuccessVal("Analyzing study notes using server-side Gemini API...");
    try {
      // Parallelize AI compilation
      await Promise.all([
        triggerGenerateMindMap(),
        triggerGenerateKeyPoints(),
        triggerGenerateFormulas(),
        triggerGenerateOneNight()
      ]);
      setSuccessVal("Exam preparation materials successfully compiled!");
      setTimeout(() => setSuccessVal(null), 4000);
    } catch {
      setSuccessVal("Materials processed using fallback engine.");
      setTimeout(() => setSuccessVal(null), 3000);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPasteNotes(val);
    setCurrentNotes(val);
  };

  const loadFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setCurrentNotes(text);
        setPasteNotes(text);
        
        // Simple heuristic to name topic from file name
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        const formattedTopic = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setCurrentTopic(formattedTopic);

        setSuccessVal(`Loaded note file: "${file.name}"`);
        setTimeout(() => setSuccessVal(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      loadFileContent(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      loadFileContent(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 p-6 flex flex-col gap-5 justify-between w-full h-full relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="text-cyan-400" size={20} />
            Study Notes Repository
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provide text files, syllabus outlines, or type raw guidelines
          </p>
        </div>
        <span className="text-[10px] bg-cyan-950/60 font-semibold border border-cyan-500/20 px-2 py-1 rounded text-cyan-400 uppercase tracking-widest font-mono">
          Topic: {currentTopic ? "Active" : "Pending"}
        </span>
      </div>

      {/* Drag & Drop Frame */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-cyan-400 bg-cyan-950/20"
            : "border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.md,.pdf,.json"
          aria-label="Upload File"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 text-cyan-400 rounded-full bg-cyan-950/50 flex items-center justify-center border border-cyan-500/10">
            <Upload size={18} />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            Drag & drop study note file or <span className="text-cyan-400 underline decoration-cyan-400/30">browse files</span>
          </span>
          <span className="text-[10px] text-slate-400">
            Supports Standard Text (.txt, .md, syllabus extracts)
          </span>
        </div>
      </div>

      {/* Raw Notes Text Area */}
      <div className="flex flex-col gap-2">
        <label htmlFor="course-outline-textarea" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Syllabus Outline & Notes
        </label>
        <textarea
          id="course-outline-textarea"
          value={pasteNotes}
          onChange={handleTextareaChange}
          placeholder="Paste or type notes here..."
          className="w-full h-32 text-xs p-3.5 rounded-xl bg-slate-950/70 text-slate-300 border border-slate-800 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 font-mono resize-none"
        />
      </div>

      {/* Sync Status / Info */}
      {successVal && (
        <div className="flex items-start gap-2 bg-slate-950 border border-cyan-500/20 hover:border-cyan-400/30 p-3 rounded-xl transition-all">
          <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
          <span className="text-xs font-medium text-slate-300">{successVal}</span>
        </div>
      )}

      {/* Call to action button to re-trigger compilation of all notes assets */}
      <button
        onClick={processAllAI}
        disabled={isLoading.mindMap || isLoading.keyPoints || isLoading.formulas}
        className="w-full bg-cyan-500 hover:bg-cyan-600 font-semibold text-slate-950 text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        id="sync-materials-btn"
      >
        <RotateCw size={14} className={isLoading.mindMap ? "animate-spin" : ""} />
        {isLoading.mindMap || isLoading.keyPoints || isLoading.formulas
          ? "Syncing materials with Gemini..."
          : "Sync & Extract Study Assets"}
      </button>
    </div>
  );
};
