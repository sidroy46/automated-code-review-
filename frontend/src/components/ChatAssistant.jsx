import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { chatWithAI } from '../services/api.js';
import { motion } from 'framer-motion';

export default function ChatAssistant({ code, isInputFocused, setIsInputFocused }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'System ready. Ask questions about optimization, converting code, complexity review, or logic bugs.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.content !== '')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await chatWithAI(code, userMessage, history);
      if (res.success && res.response) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.response }]);
      } else {
        throw new Error(res.error || 'Failed to fetch assistant reply.');
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Core engine error. Please check backend environment configurations.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[480px] border border-white/[0.04] rounded-2xl bg-darkBg/60 relative overflow-hidden">
      
      {/* Messages Thread panel */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 flex flex-col scrollbar-thin">
        {messages.map((msg, idx) => {
          const isAI = msg.role === 'assistant';
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex items-start gap-3 max-w-[85%] ${
                isAI ? 'self-start' : 'self-end flex-row-reverse'
              }`}
            >
              <div
                className={`p-2 rounded-xl border flex-shrink-0 ${
                  isAI 
                    ? 'bg-accentCyan/10 border-accentCyan/20 text-accentCyan shadow-neonCyan' 
                    : 'bg-accentViolet/10 border-accentViolet/20 text-accentViolet shadow-neonViolet'
                }`}
              >
                {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>
              
              <div
                className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap font-mono ${
                  isAI 
                    ? 'bg-[#111827]/60 border border-white/[0.03] text-slate-300' 
                    : 'bg-gradient-to-r from-accentCyan to-accentIndigo text-white font-semibold'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          );
        })}
        
        {/* Cinematic Bouncing Bouncing Dots Loader */}
        {loading && (
          <div className="flex items-start gap-3 self-start">
            <div className="p-2 rounded-xl border bg-accentCyan/10 border-accentCyan/20 text-accentCyan shadow-neonCyan">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#111827]/60 border border-white/[0.03] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-accentCyan rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-accentCyan rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-accentCyan rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input controls form container */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/[0.04] bg-[#0c0f1b]/80 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder="Ask AI details (e.g. Optimize this logic)..."
          disabled={loading}
          className="flex-grow bg-[#111827]/40 border border-white/[0.08] hover:border-white/20 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-accentCyan/50 transition-colors font-mono"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-accentCyan to-accentIndigo text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-neonCyan cursor-pointer flex items-center justify-center flex-shrink-0 disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
