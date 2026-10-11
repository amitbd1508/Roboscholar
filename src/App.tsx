/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Factory, 
  Network, 
  Compass, 
  FolderGit2, 
  Bot, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';

import { PaperReader } from './components/PaperReader';
import { InteractiveKinematicLab } from './components/InteractiveKinematicLab';
import { CaseStudiesExplorer } from './components/CaseStudiesExplorer';
import { ArchitectureTaxonomyView } from './components/ArchitectureTaxonomyView';
import { ResearchScopeFormulator } from './components/ResearchScopeFormulator';
import { GitHubRepoManager } from './components/GitHubRepoManager';
import { PaperCoPilot } from './components/PaperCoPilot';
import { PAPER_METADATA } from './data/researchPaperData';

type NavigationTab = 
  | 'paper'
  | 'kinematics'
  | 'casestudies'
  | 'taxonomy'
  | 'scope'
  | 'github'
  | 'copilot';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('paper');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Academic Navigation Bar */}
      <header className="no-print sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Paper Kicker */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm shadow-inner">
              Ψ₀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100 tracking-tight">
                  RoboLLM
                </span>
                <span className="text-slate-500 text-xs" aria-hidden="true">·</span>
                <span className="text-xs text-indigo-400 font-mono">
                  Autonomous Sensorimotor Synthesis
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                IEEE Transactions on Robotics (T-RO) Reference Monograph & Lab Suite
              </div>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('github')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub Repository</span>
            </button>
            <button
              onClick={() => setActiveTab('copilot')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold transition-colors shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Research Co-Pilot</span>
              <span className="sm:hidden">Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Primary Segmented Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 overflow-x-auto">
          <nav className="flex space-x-1 py-1.5" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('paper')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'paper'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full Research Paper</span>
            </button>

            <button
              onClick={() => setActiveTab('kinematics')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'kinematics'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive Kinematics & CBF Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('casestudies')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'casestudies'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Factory className="w-3.5 h-3.5 text-cyan-400" />
              <span>Case Studies & Deployments</span>
            </button>

            <button
              onClick={() => setActiveTab('taxonomy')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'taxonomy'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-amber-400" />
              <span>Architectures & Adaptation</span>
            </button>

            <button
              onClick={() => setActiveTab('scope')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'scope'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-violet-400" />
              <span>Scope & RQs Formulator</span>
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'github'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5 text-pink-400" />
              <span>GitHub Project Suite</span>
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === 'copilot'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Research Co-Pilot</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'paper' && <PaperReader />}
        {activeTab === 'kinematics' && <InteractiveKinematicLab />}
        {activeTab === 'casestudies' && <CaseStudiesExplorer />}
        {activeTab === 'taxonomy' && <ArchitectureTaxonomyView />}
        {activeTab === 'scope' && <ResearchScopeFormulator />}
        {activeTab === 'github' && <GitHubRepoManager />}
        {activeTab === 'copilot' && <PaperCoPilot />}
      </main>

      {/* Academic Footer */}
      <footer className="no-print mt-auto border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">RoboLLM Research Consortium</span>
            <span>·</span>
            <span>MIT CSAIL / Stanford / Google DeepMind / UC Berkeley BAIR</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>DOI: {PAPER_METADATA.doi}</span>
            <span>·</span>
            <span>{PAPER_METADATA.arxiv}</span>
            <span>·</span>
            <span>Open Source (Apache-2.0)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
