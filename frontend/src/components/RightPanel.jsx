import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  FileText, Sparkles, AlertCircle, CheckCircle2, 
  Lightbulb, ExternalLink, MessageSquare, Code2, 
  BookOpen, HelpCircle, Copy, Check, Download, ChevronRight 
} from 'lucide-react';
import ChatAssistant from './ChatAssistant.jsx';

export default function RightPanel({ 
  reviewResult, 
  isLoading, 
  error, 
  codeContext, 
  isInputFocused, 
  setIsInputFocused 
}) {
  const [activeTab, setActiveTab] = useState('review');
  const [copied, setCopied] = useState(false);
  const [expandedIssue, setExpandedIssue] = useState(null);

  const tabs = [
    { id: 'review', label: 'Summary', icon: FileText },
    { id: 'code', label: 'Optimized', icon: Code2 },
    { id: 'lines', label: 'Breakdown', icon: Lightbulb },
    { id: 'resources', label: 'Links', icon: BookOpen },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare }
  ];

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePDFReport = () => {
    if (!reviewResult) return;

    const printWindow = window.open('', '_blank');
    const issuesHtml = (reviewResult.issues || []).map(issue => `
      <div style="margin-bottom: 12px; padding: 12px; border-left: 4px solid ${
        issue.severity === 'high' ? '#ef4444' : issue.severity === 'medium' ? '#f59e0b' : '#3b82f6'
      }; background: #f8fafc; border-radius: 4px;">
        <strong>Line ${issue.line || 'General'}:</strong> [${issue.severity.toUpperCase()}] ${issue.message}
      </div>
    `).join('');

    const suggestionsHtml = (reviewResult.suggestions || []).map(s => `<li>${s}</li>`).join('');
    const linesHtml = (reviewResult.lineByLine || []).map(line => `
      <div style="margin-bottom: 8px;">
        <strong>Line ${line.line}:</strong> ${line.explanation}
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>SmartReview AI Audit Report - Score: ${reviewResult.score}</title>
          <style>
            body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 50px; line-height: 1.6; }
            h1 { color: #6366f1; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 2rem; }
            h2 { color: #0f172a; margin-top: 35px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
            .score-badge { display: inline-block; padding: 8px 18px; background: #e0e7ff; color: #4338ca; border-radius: 20px; font-weight: bold; font-size: 1.1rem; }
            pre { background: #0b0f19; color: #f8fafc; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
            ul { padding-left: 20px; }
            li { margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <h1>SmartReview AI Audit Report</h1>
          <div style="margin-top: 15px; margin-bottom: 25px;">
            <span class="score-badge">Quality Score: ${reviewResult.score}/100</span>
          </div>
          
          <h2>Found Issues & Vulnerabilities</h2>
          ${issuesHtml || '<p>No critical issues detected.</p>'}
          
          <h2>Actionable Recommendations</h2>
          <ul>${suggestionsHtml || '<li>No optimizations recommended.</li>'}</ul>

          <h2>Line Analysis</h2>
          ${linesHtml || '<p>N/A</p>'}

          <h2>Refactored Code Reference</h2>
          <pre>${reviewResult.optimizedCode ? reviewResult.optimizedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'N/A'}</pre>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Welcome / Empty State View
  if (!isLoading && !error && !reviewResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-futuristic p-8 rounded-2xl flex flex-col items-center justify-center text-center flex-grow shadow-2xl min-h-[500px]"
      >
        <div className="bg-gradient-to-tr from-accentCyan/10 to-accentViolet/10 p-5 rounded-full border border-accentCyan/20 text-accentCyan mb-5 animate-pulse shadow-neonCyan">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-display font-bold text-white tracking-wide">Await Audit Execution</h3>
        <p className="text-slate-400 text-xs max-w-sm mt-2 leading-relaxed">
          SmartReview AI is idle. Choose configurations on the left panel, paste source code, and run analysis to populate audit report results.
        </p>
      </motion.div>
    );
  }

  // Cinematic Shimmer Skeleton Loader
  if (isLoading) {
    return (
      <div className="glass-panel-futuristic p-6 rounded-2xl flex flex-col gap-6 flex-grow shadow-2xl min-h-[500px]">
        <div className="flex items-center gap-4 border-b border-white/[0.04] pb-4">
          <div className="w-4 h-4 rounded bg-white/5 shimmer-skeleton" />
          <div className="w-32 h-4 rounded bg-white/5 shimmer-skeleton" />
        </div>
        {/* Shimmer grids */}
        <div className="flex items-center gap-5 bg-slate-900/20 border border-white/[0.03] p-4 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-white/5 shimmer-skeleton flex-shrink-0" />
          <div className="flex-grow space-y-2">
            <div className="w-2/3 h-4 rounded bg-white/5 shimmer-skeleton" />
            <div className="w-1/2 h-3 rounded bg-white/5 shimmer-skeleton" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="w-full h-12 rounded-xl bg-white/5 shimmer-skeleton" />
          <div className="w-full h-12 rounded-xl bg-white/5 shimmer-skeleton" />
          <div className="w-full h-12 rounded-xl bg-white/5 shimmer-skeleton" />
        </div>
      </div>
    );
  }

  // Error View
  if (error) {
    return (
      <div className="glass-panel-futuristic p-8 rounded-2xl flex flex-col items-center justify-center text-center flex-grow shadow-2xl min-h-[500px] border-red-500/10">
        <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 text-red-400 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h4 className="text-slate-200 font-display font-bold text-base">Analysis Interrupted</h4>
        <p className="text-red-400/90 text-xs max-w-sm mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs px-4 py-2 rounded-xl text-slate-300 transition-colors"
        >
          Reset Engine
        </button>
      </div>
    );
  }

  // Score config
  const score = reviewResult.score || 0;
  const scoreColor = score >= 80 ? 'text-accentCyan' : score >= 50 ? 'text-amber-400' : 'text-red-400';
  const strokeColor = score >= 80 ? '#06b6d4' : score >= 50 ? '#fbbf24' : '#f87171';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel-futuristic rounded-2xl flex flex-col flex-grow shadow-2xl overflow-hidden border border-white/[0.04]"
    >
      {/* Tabs list with active slide indicators */}
      <div className="flex border-b border-white/[0.04] bg-[#0B0F19]/40 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-4 text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accentCyan' : 'text-slate-500'}`} />
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-accentCyan to-accentIndigo"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6 flex-grow flex flex-col overflow-y-auto max-h-[620px]">
        {activeTab === 'review' && (
          <div className="flex flex-col gap-6">
            
            {/* Header circular progress */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#111827]/40 border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accentCyan/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                  <motion.circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    stroke={strokeColor} 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray="213.5"
                    initial={{ strokeDashoffset: 213.5 }}
                    animate={{ strokeDashoffset: 213.5 - (213.5 * score) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-xl font-display font-extrabold ${scoreColor}`}>{score}</span>
                  <span className="text-[8px] text-slate-500 font-mono font-bold uppercase tracking-wider">Health</span>
                </div>
              </div>

              <div className="flex-grow text-center sm:text-left">
                <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                  Audit Summary Rating: <span className={scoreColor}>{score}/100</span>
                </h4>
                <p className="text-slate-400 text-xs mt-1.5 max-w-md leading-relaxed">
                  {score >= 80 
                    ? 'Superb architecture. Code is highly optimized, containing excellent safety checks and structural components.'
                    : score >= 50
                    ? 'Code has passed general requirements, but contains warnings that impact optimization, speed, or styling.'
                    : 'Low score returned. Review recommended refactoring suggestions to address key vulnerabilities.'}
                </p>
                
                <button
                  onClick={generatePDFReport}
                  className="mt-3.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-300 px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-accentCyan" />
                  PDF Audit Report
                </button>
              </div>
            </div>

            {/* Expandable Issues Cards */}
            <div className="flex flex-col gap-3">
              <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-accentCyan" />
                Vulnerabilities & Issues ({(reviewResult.issues || []).length})
              </h5>
              
              <div className="flex flex-col gap-2.5">
                {(!reviewResult.issues || reviewResult.issues.length === 0) ? (
                  <div className="bg-[#111827]/20 border border-white/[0.03] rounded-xl p-4 flex items-center gap-2.5 text-slate-400 text-xs leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-accentCyan" />
                    Workspace conforms to all basic syntactical and logical standards.
                  </div>
                ) : (
                  reviewResult.issues.map((issue, idx) => {
                    const isExpanded = expandedIssue === idx;
                    return (
                      <div 
                        key={idx}
                        onClick={() => setExpandedIssue(isExpanded ? null : idx)}
                        className={`border rounded-xl p-4 text-xs cursor-pointer transition-all duration-300 ${
                          issue.severity === 'high'
                            ? 'bg-red-950/10 border-red-500/20 text-red-200/90'
                            : issue.severity === 'medium'
                            ? 'bg-amber-950/10 border-amber-500/20 text-amber-200/90'
                            : 'bg-blue-950/10 border-blue-500/20 text-blue-200/90'
                        } hover:border-white/20`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-black/40 uppercase tracking-wider font-bold">
                              {issue.severity}
                            </span>
                            <span className="font-semibold font-mono">Line {issue.line || 'General'}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mt-3 text-slate-300 leading-relaxed font-mono"
                            >
                              {issue.message}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Suggestions with Shimmer borders */}
            <div className="flex flex-col gap-3">
              <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-accentViolet" />
                Refactoring Recommendations
              </h5>
              
              <ul className="grid grid-cols-1 gap-3">
                {(!reviewResult.suggestions || reviewResult.suggestions.length === 0) ? (
                  <li className="text-slate-500 text-xs font-mono">No recommended action items.</li>
                ) : (
                  reviewResult.suggestions.map((suggestion, idx) => (
                    <li 
                      key={idx}
                      className="bg-[#111827]/40 border border-white/[0.04] p-4 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-3"
                    >
                      <span className="text-accentCyan font-mono font-bold">0{idx + 1}.</span>
                      <span className="font-mono">{suggestion}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

          </div>
        )}

        {/* Tab 2: Optimized Reference */}
        {activeTab === 'code' && (
          <div className="flex flex-col gap-4 flex-grow">
            <div className="flex justify-between items-center bg-[#0B0F19] px-4 py-3 border border-white/[0.04] border-b-0 rounded-t-2xl">
              <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Refactored Reference</span>
              <button
                onClick={() => handleCopyCode(reviewResult.optimizedCode)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-accentCyan" />
                    <span className="text-accentCyan font-mono text-[10px]">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px]">COPY CODE</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="rounded-b-2xl overflow-hidden text-xs border border-white/[0.04] flex-grow font-mono">
              <SyntaxHighlighter 
                language="javascript" 
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1.25rem',
                  background: '#0B0F19',
                  minHeight: '300px',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: '1.6'
                }}
              >
                {reviewResult.optimizedCode || '// Code optimizer reference not provided'}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {/* Tab 3: Line Explanation */}
        {activeTab === 'lines' && (
          <div className="flex flex-col gap-3">
            <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Step-by-Step Logic Breakdown</h5>
            {(!reviewResult.lineByLine || reviewResult.lineByLine.length === 0) ? (
              <p className="text-slate-500 text-xs font-mono">No line explanations found.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {reviewResult.lineByLine.map((line, idx) => (
                  <div key={idx} className="bg-[#111827]/40 border border-white/[0.04] p-4 rounded-xl flex gap-4">
                    <div className="bg-accentCyan/10 text-accentCyan border border-accentCyan/20 font-mono text-xs w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                      {line.line}
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed self-center font-mono">
                      {line.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Links */}
        {activeTab === 'resources' && (
          <div className="flex flex-col gap-3">
            <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Audit References</h5>
            {(!reviewResult.resources || reviewResult.resources.length === 0) ? (
              <p className="text-slate-500 text-xs font-mono">No references attached.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviewResult.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#111827]/40 hover:bg-accentCyan/[0.02] border border-white/[0.04] hover:border-accentCyan/30 p-4 rounded-xl flex justify-between items-center transition-all duration-300"
                  >
                    <div>
                      <h6 className="text-xs font-semibold text-slate-200 group-hover:text-accentCyan transition-colors font-mono">
                        {res.title}
                      </h6>
                      <p className="text-[9px] text-slate-500 truncate max-w-[180px] mt-1 font-mono">{res.url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-accentCyan transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: AI Chat */}
        {activeTab === 'chat' && (
          <ChatAssistant code={codeContext} isInputFocused={isInputFocused} setIsInputFocused={setIsInputFocused} />
        )}
      </div>
    </motion.div>
  );
}
