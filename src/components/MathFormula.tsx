import React, { useState } from 'react';
import katex from 'katex';
import { Copy, Check, FunctionSquare } from 'lucide-react';

interface MathFormulaProps {
  formula: string;
  className?: string;
  label?: string;
  showCopy?: boolean;
}

/**
 * Renders mathematical formulations in display mode using KaTeX.
 * Features responsive horizontal scrolling for wide matrices and equations across all screen sizes.
 */
export const MathFormula: React.FC<MathFormulaProps> = ({
  formula,
  className = '',
  label,
  showCopy = true
}) => {
  const [copied, setCopied] = useState(false);

  // Render LaTeX using KaTeX displayMode
  const renderedHtml = React.useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode: true,
        throwOnError: false,
        strict: false,
        trust: true,
        output: 'htmlAndMathml'
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return `<code class="text-rose-400 font-mono text-xs">${formula}</code>`;
    }
  }, [formula]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group/math rounded-2xl bg-slate-950/90 border border-slate-800/80 p-4 sm:p-5 shadow-inner overflow-hidden ${className}`}>
      {/* Optional Top Label & Copy Action */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
          <FunctionSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>{label || 'MATHEMATICAL FORMULATION'}</span>
        </div>

        {showCopy && (
          <button
            onClick={handleCopy}
            type="button"
            title="Copy LaTeX source"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/5 transition text-[10px] font-mono"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>LaTeX</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Rendered KaTeX Container with Responsive Overflow */}
      <div 
        className="overflow-x-auto overflow-y-hidden py-2 px-1 text-slate-100 flex items-center justify-center min-h-[3rem] no-scrollbar sm:scrollbar-thin sm:scrollbar-thumb-slate-800"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </div>
  );
};

interface InlineMathProps {
  math: string;
  className?: string;
}

export const InlineMath: React.FC<InlineMathProps> = ({ math, className = '' }) => {
  const renderedHtml = React.useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
        strict: false
      });
    } catch {
      return `<code class="text-cyan-300 font-mono text-xs">${math}</code>`;
    }
  }, [math]);

  return (
    <span 
      className={`inline-block px-1 align-baseline text-cyan-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

/**
 * Helper to render paragraphs with embedded $math$ snippets
 */
export const FormattedAcademicText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = ''
}) => {
  const parts = React.useMemo(() => {
    // Regex splits by $...$
    const segments = text.split(/(\$[^$]+\$)/g);
    return segments.map((seg, idx) => {
      if (seg.startsWith('$') && seg.endsWith('$') && seg.length > 2) {
        const mathContent = seg.slice(1, -1);
        return <InlineMath key={idx} math={mathContent} />;
      }
      return <span key={idx}>{seg}</span>;
    });
  }, [text]);

  return <span className={className}>{parts}</span>;
};
