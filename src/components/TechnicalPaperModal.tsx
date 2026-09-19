import React, { useState } from 'react';
import { ResearchPaper } from '../types';
import { MathFormula, FormattedAcademicText } from './MathFormula';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Share2, 
  BookOpen, 
  Layers, 
  ExternalLink,
  Printer
} from 'lucide-react';

interface TechnicalPaperModalProps {
  paper: ResearchPaper | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'cyan' | 'purple') => void;
}

export const TechnicalPaperModal: React.FC<TechnicalPaperModalProps> = ({
  paper,
  isOpen,
  onClose,
  onShowToast
}) => {
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [copiedIeee, setCopiedIeee] = useState(false);

  if (!isOpen || !paper) return null;

  const handleCopyBibtex = () => {
    navigator.clipboard?.writeText(paper.bibtex);
    setCopiedBibtex(true);
    onShowToast?.('BibTeX Copied', 'Citation copied to clipboard in standard LaTeX format.', 'cyan');
    setTimeout(() => setCopiedBibtex(false), 2500);
  };

  const handleCopyIeee = () => {
    navigator.clipboard?.writeText(paper.ieeeCitation);
    setCopiedIeee(true);
    onShowToast?.('IEEE Citation Copied', 'Standard academic citation copied.', 'cyan');
    setTimeout(() => setCopiedIeee(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-white/20 rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Academic Journal Top Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 shrink-0">
              <FileText className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {paper.reportId}
                </span>
                <span className="text-[10px] font-mono text-slate-400">&bull;</span>
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  DOI: {paper.doi}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono truncate">
                {paper.venue}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyBibtex}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition flex items-center gap-1.5"
              title="Copy LaTeX BibTeX entry"
            >
              {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">BibTeX</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Document Body (Formatted like an authentic IEEE / arXiv technical report) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-slate-900 text-slate-200">
          {/* Header & Metadata */}
          <div className="space-y-4 text-center max-w-3xl mx-auto border-b border-white/10 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <span>{paper.category}</span>
              <span>&bull;</span>
              <span>Peer-Reviewed Lab Report</span>
              <span>&bull;</span>
              <span>{paper.date}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif-academic font-bold text-white tracking-tight leading-snug">
              {paper.title}
            </h1>

            <div className="text-xs text-cyan-200 font-medium flex flex-wrap items-center justify-center gap-2">
              {paper.authors.map((author, i) => (
                <span key={author} className="inline-flex items-center gap-1">
                  {author.toLowerCase().includes('aarti') ? (
                    <span className="inline-flex items-center gap-1.5 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      <a
                        href="https://ai-aarti.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:text-white underline decoration-cyan-400/50 hover:decoration-cyan-300 transition inline-flex items-center gap-1 font-bold"
                        title="View Portfolio: https://ai-aarti.com"
                      >
                        <span>{author}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-cyan-400 inline" />
                      </a>
                      <span className="text-slate-500">|</span>
                      <a
                        href="https://publications.ai-aarti.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-300 hover:text-white underline decoration-purple-400/50 hover:decoration-purple-300 transition text-[11px] font-mono"
                        title="View Publications: https://publications.ai-aarti.com"
                      >
                        <span>Publications</span>
                      </a>
                    </span>
                  ) : (
                    <strong>{author}</strong>
                  )}
                  {i < paper.authors.length - 1 && <span className="text-slate-500 mr-1">,</span>}
                </span>
              ))}
            </div>

            <p className="text-xs text-slate-400 italic">
              {paper.affiliation}
            </p>
          </div>

          {/* Abstract Section */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Abstract
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-serif-academic leading-relaxed text-justify">
              <FormattedAcademicText text={paper.abstract} />
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-slate-400 font-semibold mr-1">Keywords:</span>
              {paper.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Key Theoretical Formulations & Equations */}
          {paper.keyTheorems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan-400">§ 1.</span>
                <span>Theoretical Formulations & Mathematical Models</span>
              </h2>

              <div className="space-y-4">
                {paper.keyTheorems.map((theorem, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[10px] font-mono font-bold">
                        {theorem.type}
                      </span>
                      <h3 className="font-serif-academic font-bold text-sm text-white">
                        {theorem.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 font-serif-academic leading-relaxed">
                      <FormattedAcademicText text={theorem.content} />
                    </p>

                    {theorem.latexFormula && (
                      <MathFormula 
                        formula={theorem.latexFormula} 
                        label={theorem.title}
                        className="my-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empirical Validation & Laboratory Benchmarks */}
          {paper.empiricalData.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-cyan-400">§ 2.</span>
                <span>Experimental Data & Empirical Benchmark Results</span>
              </h2>

              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-white/10 text-[11px]">
                    <tr>
                      <th className="p-3.5 font-semibold">Evaluation Metric</th>
                      <th className="p-3.5 font-semibold">Standard Baseline</th>
                      <th className="p-3.5 font-semibold text-cyan-300">PCSS Lab Proposed</th>
                      <th className="p-3.5 font-semibold text-emerald-400">Delta / Gain</th>
                      <th className="p-3.5 font-semibold">Significance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {paper.empiricalData.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-900/40 transition">
                        <td className="p-3.5 font-sans font-medium text-white">{d.metric}</td>
                        <td className="p-3.5 text-slate-400">{d.baseline}</td>
                        <td className="p-3.5 text-cyan-300 font-bold">{d.proposedMethod}</td>
                        <td className="p-3.5 text-emerald-400 font-bold">{d.delta}</td>
                        <td className="p-3.5 text-[11px] text-slate-400 italic">{d.significance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Conclusions & Impact */}
          <div className="space-y-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="text-cyan-400">§ 3.</span>
              <span>Concluding Summary & Field Deployment</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-serif-academic leading-relaxed">
              {paper.conclusions}
            </p>
          </div>

          {/* BibTeX & Citation Reference Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Cite this technical report
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyIeee}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-mono transition flex items-center gap-1"
                >
                  {copiedIeee ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>IEEE</span>
                </button>
                <button
                  onClick={handleCopyBibtex}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-800/40 text-[11px] font-mono transition flex items-center gap-1"
                >
                  {copiedBibtex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>LaTeX BibTeX</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-serif-academic text-slate-300 leading-relaxed">
              {paper.ieeeCitation}
            </div>

            <pre className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono-academic text-cyan-300/90 overflow-x-auto leading-relaxed">
              {paper.bibtex}
            </pre>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>PCSS II Autonomous Systems & Field Robotics Laboratory Open Repository</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">CC BY 4.0 Open Research</span>
        </div>
      </div>
    </div>
  );
};
