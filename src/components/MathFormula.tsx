import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch (e) {
      console.warn("KaTeX render error:", e);
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div 
        className={`my-3 overflow-x-auto py-2 text-center text-indigo-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span 
      className={`inline-block px-1 text-indigo-200 font-mono text-[0.95em] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
