import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Code, FileCode, Play, X, Sliders, ChevronDown } from 'lucide-react';

export default function LeftPanel({
  code,
  setCode,
  file,
  setFile,
  language,
  setLanguage,
  mode,
  setMode,
  explanationLanguage,
  setExplanationLanguage,
  onSubmit,
  isLoading,
  isInputFocused,
  setIsInputFocused
}) {
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [lineCount, setLineCount] = useState(1);

  const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++'];
  const modes = ['Beginner', 'Professional', 'Security', 'Optimization', 'Interview Prep'];
  const explanationLanguages = ['English', 'Hindi', 'Telugu', 'Tamil'];

  // Sync line numbers dynamically based on code text linebreaks
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines || 1);
  }, [code]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel-futuristic p-6 rounded-2xl flex flex-col gap-6 flex-grow shadow-2xl transition-all duration-500 border ${
        isInputFocused 
          ? 'border-accentCyan/30 shadow-neonCyan' 
          : 'border-white/[0.04]'
      }`}
    >
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-accentCyan" />
          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">Analysis Configuration</h2>
        </div>
      </div>

      {/* Futuristic Glass Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Language selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Language</label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#111827]/40 border border-white/[0.06] hover:border-white/10 text-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-medium focus:outline-none focus:border-accentCyan/50 appearance-none transition-colors"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Focus Mode selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Focus Mode</label>
          <div className="relative">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#111827]/40 border border-white/[0.06] hover:border-white/10 text-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-medium focus:outline-none focus:border-accentCyan/50 appearance-none transition-colors"
            >
              {modes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Translation selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Output Language</label>
          <div className="relative">
            <select
              value={explanationLanguage}
              onChange={(e) => setExplanationLanguage(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#111827]/40 border border-white/[0.06] hover:border-white/10 text-slate-200 rounded-xl pl-3.5 pr-8 py-2.5 text-xs font-medium focus:outline-none focus:border-accentCyan/50 appearance-none transition-colors"
            >
              {explanationLanguages.map((el) => (
                <option key={el} value={el}>{el}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Editor & File Upload Split panel */}
      <div className="flex flex-col gap-3 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Source Workspace</span>
          {file && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 bg-accentCyan/10 border border-accentCyan/20 text-accentCyan px-3 py-1 rounded-xl text-xs font-mono"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button onClick={clearFile} className="hover:text-white p-0.5 rounded-full hover:bg-white/10">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Drag & Drop Visual Code Editor Card Container */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-xl border flex flex-col flex-grow min-h-[380px] transition-all duration-300 ${
            isDragActive 
              ? 'border-accentCyan bg-accentCyan/5 shadow-neonCyan' 
              : 'border-white/[0.05] bg-darkBg/60'
          }`}
        >
          {!file ? (
            <div className="flex flex-grow h-full overflow-hidden">
              {/* VSCode style Line Numbers */}
              <div className="select-none text-right pr-3 pl-4 py-4 text-slate-600 font-mono text-xs border-r border-white/[0.03] bg-[#0c0f1b] leading-relaxed min-w-[40px]">
                {Array.from({ length: lineCount }).map((_, idx) => (
                  <div key={idx} className="h-[21px]">{idx + 1}</div>
                ))}
              </div>

              {/* Text Input area */}
              <div className="relative flex-grow flex">
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="// Paste or drop code here to analyze health..."
                  disabled={isLoading}
                  className="w-full h-full min-h-[350px] bg-transparent resize-none p-4 text-slate-300 font-mono text-xs focus:outline-none leading-relaxed selection:bg-accentCyan/20"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3.5 p-8 m-auto text-center">
              <div className="bg-accentCyan/10 p-5 rounded-full border border-accentCyan/25 text-accentCyan">
                <FileCode className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <p className="text-slate-200 font-display font-semibold text-sm">{file.name}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={clearFile}
                className="mt-2 text-xs bg-white/[0.04] border border-white/10 px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
          )}

          {/* Upload icon trigger badge */}
          {!file && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#111827] border border-white/[0.06] hover:border-accentCyan/40 hover:bg-[#1a2333] text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-accentCyan" />
                Upload File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Magnetic Review trigger button */}
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full btn-glow-cinematic bg-gradient-to-r from-accentCyan via-accentIndigo to-accentViolet text-white rounded-xl py-4 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-futuristic disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
            Compiling Analysis...
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-white" />
            Analyze & Review Code
          </>
        )}
      </button>
    </motion.div>
  );
}
