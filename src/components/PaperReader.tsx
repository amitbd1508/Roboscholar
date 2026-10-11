import React, { useState, useMemo } from 'react';
import { PAPER_METADATA, PAPER_BIBLIOGRAPHY } from '../data/researchPaperData';
import { FULL_PAPER_SECTIONS } from '../data/fullPaperText';
import { MathFormula } from './MathFormula';
import { generatePaperPdf } from '../utils/pdfGenerator';
import { BookOpen, Columns, AlignLeft, Printer, Download, Copy, Check, Search, ExternalLink, Bookmark, Hash, FileDown, CheckCircle2, Loader2 } from 'lucide-react';

export const PaperReader: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<'single' | 'two-column'>('two-column');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');
  const [copiedBib, setCopiedBib] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccess, setPdfSuccess] = useState<boolean>(false);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        generatePaperPdf();
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 4000);
      } catch (err) {
        console.error("PDF generation error:", err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyBibtex = () => {
    const bibtex = `@article{vance2026robollm,
  title={Autonomous Sensorimotor Synthesis: Foundations, Architectures, and Safety Verification for Full LLM Control of Physical Robots},
  author={Vance-Kowalski, Elena and Thorne, Marcus and Lin-Alvarez, Sarah and Zhang, Devon},
  journal={IEEE Transactions on Robotics (T-RO)},
  year={2026},
  doi={10.1109/TRO.2026.10984521},
  eprint={2603.14920},
  archivePrefix={arXiv},
  primaryClass={cs.RO}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedBib(true);
    setTimeout(() => setCopiedBib(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${PAPER_METADATA.title}\n\n`;
    md += `**Authors:** ${PAPER_METADATA.authors.map(a => `${a.name} (${a.affiliation})`).join(', ')}\n\n`;
    md += `**Journal:** ${PAPER_METADATA.journal} | **DOI:** ${PAPER_METADATA.doi}\n\n`;
    md += `## Abstract\n\n${PAPER_METADATA.abstract}\n\n`;

    FULL_PAPER_SECTIONS.forEach(sec => {
      md += `## ${sec.number}. ${sec.title}\n\n${sec.leadParagraph}\n\n`;
      sec.subsections.forEach(sub => {
        md += `### ${sub.number} ${sub.title}\n\n`;
        // Strip basic HTML tags for markdown export
        const cleanText = sub.contentHtml.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        md += `${cleanText}\n\n`;
      });
    });

    md += `## References\n\n`;
    PAPER_BIBLIOGRAPHY.forEach((b, idx) => {
      md += `[${idx + 1}] ${b.authors} (${b.year}). "${b.title}". *${b.venue}*.\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Autonomous_Sensorimotor_Synthesis_Paper.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return FULL_PAPER_SECTIONS;
    const q = searchQuery.toLowerCase();
    return FULL_PAPER_SECTIONS.filter(sec => 
      sec.title.toLowerCase().includes(q) || 
      sec.leadParagraph.toLowerCase().includes(q) ||
      sec.subsections.some(sub => sub.title.toLowerCase().includes(q) || sub.contentHtml.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Sticky Reader Toolbar (No-print) */}
      <div className="no-print sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-3 px-4 -mx-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Left: Search input */}
        <div className="relative min-w-[220px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search paper sections, theorems, equations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Center: Layout & Font controls */}
        <div className="flex items-center gap-2">
          {/* Layout Mode */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setLayoutMode('two-column')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${layoutMode === 'two-column' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Classic Two-Column Academic Journal View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Two-Column</span>
            </button>
            <button
              onClick={() => setLayoutMode('single')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${layoutMode === 'single' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Single-Column Monograph View"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Single Column</span>
            </button>
          </div>

          {/* Typography Mode */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setFontFamily('serif')}
              className={`px-2.5 py-1 rounded font-serif transition-colors ${fontFamily === 'serif' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Classical Academic Serif"
            >
              Serif
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`px-2.5 py-1 rounded font-sans transition-colors ${fontFamily === 'sans' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Modern Clean Sans"
            >
              Sans
            </button>
          </div>
        </div>

        {/* Right: Export & Citation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
            title="Download formatted IEEE PDF directly"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : pdfSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingPdf ? 'Generating PDF...' : pdfSuccess ? 'Downloaded!' : 'Download PDF'}</span>
          </button>
          <button
            onClick={handleCopyBibtex}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
            title="Copy BibTeX Citation"
          >
            {copiedBib ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBib ? 'Copied' : 'BibTeX'}</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
            title="Download full paper as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Markdown</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors"
            title="Print / Save PDF format via browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Layout</span>
          </button>
        </div>
      </div>

      {/* PDF Ready Announcement Banner (No-print) */}
      <div className="no-print p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-indigo-950/60 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex-shrink-0">
            <FileDown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-100">
                Official PDF Publication Ready for Download
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700 text-emerald-300">
                Letter Format &middot; IEEE T-RO
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Includes all 12 chapters, POMDP equations, Control Barrier Function proofs, benchmark matrix, case studies, and complete references.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
          >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Download PDF Now'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            Print Dialog
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar TOC + Paper Article Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table of Contents Sticky Sidebar (3 cols, hidden on mobile / print) */}
        <div className="no-print hidden lg:block lg:col-span-3 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-2 pr-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-indigo-400" /> Table of Contents
          </div>
          <nav className="space-y-1">
            {FULL_PAPER_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveSectionId(sec.id)}
                className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  activeSectionId === sec.id
                    ? 'bg-indigo-950/60 text-indigo-300 font-semibold border-l-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[10px] text-slate-500 flex-shrink-0">{sec.number}.</span>
                  <span className="truncate">{sec.title.split(':')[0]}</span>
                </div>
              </a>
            ))}
            <a
              href="#paper-references"
              className="block px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            >
              <span className="font-mono text-[10px] text-slate-500">13.</span> References
            </a>
          </nav>
        </div>

        {/* Paper Manuscript Body (9 cols) */}
        <article className="lg:col-span-9 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl academic-paper-container">
          {/* Publication Header */}
          <header className="border-b border-slate-800 pb-8 mb-8 text-center">
            <div className="text-xs font-mono text-indigo-400 tracking-wider uppercase mb-2">
              {PAPER_METADATA.journal} &middot; {PAPER_METADATA.submissionStatus}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
              {PAPER_METADATA.title}
            </h1>

            {/* Authors & Affiliations */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              {PAPER_METADATA.authors.map((author, idx) => (
                <div key={idx} className="text-center">
                  <div className="font-semibold text-slate-200">{author.name}</div>
                  <div className="text-slate-400 text-[11px]">{author.affiliation}</div>
                  <div className="text-indigo-400 font-mono text-[10px]">{author.email}</div>
                </div>
              ))}
            </div>

            {/* DOI & arXiv metadata */}
            <div className="mt-4 flex flex-wrap justify-center items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>DOI: {PAPER_METADATA.doi}</span>
              <span>&middot;</span>
              <span>{PAPER_METADATA.arxiv}</span>
              <span>&middot;</span>
              <span>Published: {PAPER_METADATA.date}</span>
            </div>

            {/* Abstract Box */}
            <div className="mt-8 text-left bg-slate-950/80 border border-slate-800 rounded-xl p-5 md:p-6 shadow-inner">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-2">
                Abstract
              </h3>
              <p className={`text-xs md:text-sm text-slate-300 leading-relaxed ${fontFamily === 'serif' ? 'font-academic' : 'font-academic-sans'}`}>
                {PAPER_METADATA.abstract}
              </p>

              {/* Keywords */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px]">
                <strong className="text-slate-400 font-mono">Keywords: </strong>
                {PAPER_METADATA.keywords.map((kw, i) => (
                  <span key={i} className="text-slate-300">
                    {kw}{i < PAPER_METADATA.keywords.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Paper Sections */}
          <div className="space-y-10">
            {filteredSections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-24">
                <div className="border-b border-slate-800 pb-2 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-baseline gap-2">
                    <span className="text-indigo-400 font-mono text-base md:text-xl">{sec.number}.</span>
                    <span>{sec.title.split(': ')[1] || sec.title}</span>
                  </h2>
                  <p className="text-xs md:text-sm text-indigo-200/80 font-serif italic mt-1">
                    {sec.leadParagraph}
                  </p>
                </div>

                {/* Subsections with Two-Column layout support */}
                <div className={layoutMode === 'two-column' ? 'academic-two-col' : 'space-y-6'}>
                  {sec.subsections.map((sub) => (
                    <div key={sub.id} className="academic-break-inside-avoid mb-6">
                      <h3 className="text-sm md:text-base font-semibold text-slate-200 mb-2 flex items-baseline gap-1.5">
                        <span className="font-mono text-xs text-indigo-400">{sub.number}</span>
                        <span>{sub.title}</span>
                      </h3>
                      <div
                        className={`text-xs md:text-sm text-slate-300 leading-relaxed ${
                          fontFamily === 'serif' ? 'font-academic' : 'font-academic-sans'
                        }`}
                        dangerouslySetInnerHTML={{ __html: sub.contentHtml }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* References Section */}
            <section id="paper-references" className="pt-8 border-t border-slate-800 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-indigo-400" /> References & Comprehensive Bibliography
              </h2>
              <div className="space-y-3 font-mono text-xs text-slate-300">
                {PAPER_BIBLIOGRAPHY.map((cit, idx) => (
                  <div key={cit.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700">
                    <span className="text-indigo-400 font-bold mr-2">[{idx + 1}]</span>
                    <span className="text-slate-200">{cit.authors} ({cit.year}).</span>
                    <span className="italic text-slate-100 ml-1">"{cit.title}"</span>.
                    <span className="text-slate-400 ml-1">{cit.venue}</span>.
                    {cit.doi && (
                      <span className="text-indigo-400 ml-2">doi:{cit.doi}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};
