import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Terminal, Code2, AlertTriangle, CheckCircle, 
  Lightbulb, HelpCircle, Loader2, Search, Compass, Cpu, 
  BookOpen, ChevronRight, Layers, LogOut, Moon 
} from 'lucide-react';
import LeftPanel from '../components/LeftPanel.jsx';
import RightPanel from '../components/RightPanel.jsx';
import { reviewCode } from '../services/api.js';

export default function Dashboard() {
  const [code, setCode] = useState(`// Paste or write your code here
function calculateFactorial(n) {
  if (n < 0) return -1;
  if (n == 0) return 1;
  return n * calculateFactorial(n - 1);
}`);
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('JavaScript');
  const [mode, setMode] = useState('Professional');
  const [explanationLanguage, setExplanationLanguage] = useState('English');
  
  const [reviewResult, setReviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Focus Dim state
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Command Palette State (Ctrl+K)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');

  // Notification toast state
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Keyboard shortcut listener (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReviewSubmit = async () => {
    if (!file && (!code || code.trim() === '')) {
      triggerToast('Please write some code or upload a file.', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    triggerToast('Initiating AI Code Review...', 'info');

    try {
      const response = await reviewCode(file, code, language, mode, explanationLanguage);
      if (response.success && response.data) {
        setReviewResult(response.data);
        triggerToast('AI analysis completed successfully!', 'success');
      } else {
        throw new Error(response.error || 'Invalid response from server.');
      }
    } catch (err) {
      console.error(err);
      const serverError = err.response?.data?.error;
      const errorMessage = typeof serverError === 'object' && serverError !== null
        ? (serverError.message || JSON.stringify(serverError))
        : (serverError || err.message || 'Server error. Please try again.');
      setError(errorMessage);
      triggerToast('AI Review failed. Check error details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const commandPaletteOptions = [
    { label: 'Set language to Python', action: () => { setLanguage('Python'); triggerToast('Language set to Python', 'success'); } },
    { label: 'Set language to JavaScript', action: () => { setLanguage('JavaScript'); triggerToast('Language set to JavaScript', 'success'); } },
    { label: 'Set mode to Security Focus', action: () => { setMode('Security'); triggerToast('Focus mode: Security', 'success'); } },
    { label: 'Set mode to Optimization Focus', action: () => { setMode('Optimization'); triggerToast('Focus mode: Optimization', 'success'); } },
    { label: 'Clear current code text', action: () => { setCode(''); setFile(null); triggerToast('Workspace cleared', 'info'); } }
  ];

  const filteredCommands = commandPaletteOptions.filter(cmd => 
    cmd.label.toLowerCase().includes(commandQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden bg-darkBg text-slate-100 font-sans">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accentIndigo/10 blur-[140px] pointer-events-none animate-blob-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-accentViolet/5 blur-[160px] pointer-events-none animate-blob-2" />
      <div className="absolute top-[30%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-accentCyan/5 blur-[120px] pointer-events-none animate-blob-1" />

      {/* Glass Sticky Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.04] bg-darkBg/65 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-accentCyan to-accentIndigo p-2.5 rounded-xl shadow-futuristic">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-accentCyan bg-clip-text text-transparent">
              SmartReview AI
            </h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Futuristic Code Auditor</p>
          </div>
        </div>

        {/* Mid Navigation items */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] hover:border-white/15 px-4 py-2 rounded-xl text-xs text-slate-400 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search commands...</span>
            <kbd className="bg-white/[0.06] px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-500">Ctrl K</kbd>
          </button>
        </div>

        {/* Engine Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-accentCyan/10 border border-accentCyan/20 px-3.5 py-1.5 rounded-full text-xs text-accentCyan">
            <span className="w-1.5 h-1.5 rounded-full bg-accentCyan animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">LLaMA-3.3 ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Grid Content Layout */}
      <main className="max-w-[1550px] mx-auto px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Side: Inputs */}
        <section className={`lg:col-span-6 xl:col-span-5 flex flex-col transition-all duration-500 ${
          isInputFocused ? 'focus-dim-active' : 'focus-dim-active'
        }`}>
          <LeftPanel
            code={code}
            setCode={setCode}
            file={file}
            setFile={setFile}
            language={language}
            setLanguage={setLanguage}
            mode={mode}
            setMode={setMode}
            explanationLanguage={explanationLanguage}
            setExplanationLanguage={setExplanationLanguage}
            onSubmit={handleReviewSubmit}
            isLoading={isLoading}
            isInputFocused={isInputFocused}
            setIsInputFocused={setIsInputFocused}
          />
        </section>

        {/* Right Side: Results */}
        <section className={`lg:col-span-6 xl:col-span-7 flex flex-col transition-all duration-500 ${
          isInputFocused ? 'opacity-40 filter blur-[1px]' : 'opacity-100'
        }`}>
          <RightPanel
            reviewResult={reviewResult}
            isLoading={isLoading}
            error={error}
            codeContext={code}
            isInputFocused={isInputFocused}
            setIsInputFocused={setIsInputFocused}
          />
        </section>
      </main>

      {/* Floating Bottom Dock Navigation */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center z-40 pointer-events-none">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="dock-nav px-5 py-3 rounded-2xl flex items-center gap-5 pointer-events-auto"
        >
          <button 
            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Overview"
          >
            <Compass className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Command Palette"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={handleReviewSubmit}
            className="bg-gradient-to-r from-accentCyan to-accentIndigo text-white p-2.5 rounded-xl shadow-futuristic hover:scale-105 transition-all duration-300 cursor-pointer pointer-events-auto"
            title="Analyze"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl glass-panel-futuristic rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search className="w-5 h-5 text-slate-500" />
                <input
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  placeholder="Type a command or select options..."
                  className="w-full bg-transparent text-sm text-slate-200 focus:outline-none placeholder-slate-500"
                  autoFocus
                />
              </div>

              <div className="p-2 max-h-[300px] overflow-y-auto">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider px-3 py-1 font-bold">Commands</p>
                {filteredCommands.length === 0 ? (
                  <p className="text-xs text-slate-400 p-3">No matching commands found.</p>
                ) : (
                  filteredCommands.map((cmd, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        cmd.action();
                        setIsCommandPaletteOpen(false);
                        setCommandQuery('');
                      }}
                      className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <span>{cmd.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-xl shadow-lg shadow-black/40 ${
              toast.type === 'error'
                ? 'bg-red-950/80 border-red-500/30 text-red-200'
                : toast.type === 'info'
                ? 'bg-blue-950/80 border-blue-500/30 text-blue-200'
                : 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200'
            }`}
          >
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
            {toast.type === 'info' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-accentCyan" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
