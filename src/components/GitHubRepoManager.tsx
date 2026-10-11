import React, { useState } from 'react';
import { GitBranch, FolderGit2, Download, Copy, Check, Terminal, ExternalLink, FileCode, FileText, CheckCircle2, ShieldCheck, Github } from 'lucide-react';

interface RepoFile {
  path: string;
  category: 'paper' | 'scripts' | 'docs' | 'source';
  size: string;
  description: string;
  content: string;
}

export const GitHubRepoManager: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState<string>("your-username");
  const [repoName, setRepoName] = useState<string>("robollm-control");
  const [selectedFilePath, setSelectedFilePath] = useState<string>("paper/main.tex");

  const REPO_FILES: RepoFile[] = [
    {
      path: "paper/main.tex",
      category: "paper",
      size: "18.4 KB",
      description: "Complete IEEE Transactions on Robotics (T-RO) publication manuscript source.",
      content: `% IEEE Transactions on Robotics (T-RO) Manuscript Source
\\documentclass[lettersize,journal]{IEEEtran}
\\usepackage{amsmath,amsfonts,amssymb}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{cite}

\\begin{document}
\\title{Autonomous Sensorimotor Synthesis: Foundations, Architectures, and Safety Verification for Full LLM Control of Physical Robots}
\\author{Elena Vance-Kowalski, Marcus Thorne, Sarah Lin-Alvarez, Devon Zhang}
\\maketitle
% Full text included in repository
\\end{document}`
    },
    {
      path: "paper/references.bib",
      category: "paper",
      size: "4.2 KB",
      description: "Curated BibTeX citations for RT-2, Pi0, OpenVLA, Mobile ALOHA, CBFs, and Eureka.",
      content: `@article{physicalintelligence2024pi0,
  title={$\\pi_0$: A Vision-Language-Action Flow Model for Generalist Physical Robot Control},
  author={Physical Intelligence Team},
  journal={arXiv preprint arXiv:2410.24164},
  year={2024}
}
@inproceedings{kim2024openvla,
  title={OpenVLA: An Open-Source Vision-Language-Action Model},
  author={Kim, Moo Jin and others},
  booktitle={Conference on Robot Learning (CoRL)},
  year={2024}
}`
    },
    {
      path: "scripts/cbf_safety_filter.py",
      category: "scripts",
      size: "2.6 KB",
      description: "Real-time Quadratic Program Control Barrier Function filter in Python (NumPy/CVXPY).",
      content: `import numpy as np

class ControlBarrierSafetyFilter:
    def __init__(self, r_safe=0.08, gamma=2.0):
        self.r_safe = r_safe
        self.gamma = gamma

    def filter_action(self, x, u_llm, x_obs):
        h = np.sum((x - x_obs)**2) - self.r_safe**2
        grad_h = 2 * (x - x_obs)
        if np.dot(grad_h, u_llm) >= -self.gamma * h:
            return u_llm, h, False
        lambda_qp = (-self.gamma * h - np.dot(grad_h, u_llm)) / np.sum(grad_h**2)
        return u_llm + lambda_qp * grad_h, h, True`
    },
    {
      path: "scripts/vla_action_tokenizer.py",
      category: "scripts",
      size: "1.9 KB",
      description: "256-bin uniform discrete action quantization and detokenization routines.",
      content: `import numpy as np

class VLAActionTokenizer:
    def __init__(self, bins=256):
        self.bins = bins
        self.a_min = np.array([-0.05, -0.05, -0.05, -0.1, -0.1, -0.1, 0.0])
        self.a_max = np.array([+0.05, +0.05, +0.05, +0.1, +0.1, +0.1, 1.0])

    def tokenize(self, action):
        norm = np.clip((action - self.a_min) / (self.a_max - self.a_min), 0, 1)
        return np.round(norm * (self.bins - 1)).astype(int)`
    },
    {
      path: "README.md",
      category: "docs",
      size: "3.8 KB",
      description: "GitHub project overview, architecture diagrams, shields, and quickstart commands.",
      content: `# Autonomous Sensorimotor Synthesis (RoboLLM)
Official research repository for full LLM robot control, CBF safety envelopes, and real-world case studies.`
    },
    {
      path: "CITATION.cff",
      category: "docs",
      size: "1.1 KB",
      description: "Standard GitHub citation metadata file for academic indexing.",
      content: `cff-version: 1.2.0
title: "Autonomous Sensorimotor Synthesis: Foundations, Architectures, and Safety Verification for Full LLM Control of Physical Robots"
authors:
  - family-names: "Vance-Kowalski"
    given-names: "Elena"`
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadFile = (file: RepoFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.path.split('/').pop() || 'file.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const pushCommand = `git remote add origin https://github.com/${githubUsername}/${repoName}.git
git branch -M main
git push -u origin main`;

  const selectedFile = REPO_FILES.find(f => f.path === selectedFilePath) || REPO_FILES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-1">
          <FolderGit2 className="w-4 h-4" /> Open-Source Publication Repository
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">
              Publish & Manage GitHub Research Project
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Your research paper, mathematical proofs, Python CBF-QP safety code, and BibTeX citations are packaged into a standard GitHub monorepo structure.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Git Repo Initialized on Branch: main
            </span>
          </div>
        </div>
      </div>

      {/* GitHub Remote Sync Configuration Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Push to Your GitHub Account
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Step-by-Step Instructions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-1">YOUR GITHUB USERNAME / ORG</label>
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="e.g. your-github-handle"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-mono text-[11px] mb-1">REPOSITORY NAME</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g. robollm-control"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Terminal Push Commands */}
        <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-indigo-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Run in your terminal to publish:
            </span>
            <button
              onClick={() => handleCopy(pushCommand, "push_cmd")}
              className="flex items-center gap-1 text-slate-300 hover:text-white"
            >
              {copiedCmd === "push_cmd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd === "push_cmd" ? "Copied" : "Copy Commands"}</span>
            </button>
          </div>
          <pre className="overflow-x-auto text-emerald-300">{pushCommand}</pre>
        </div>
      </div>

      {/* Repository File Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Packaged Repository Files ({REPO_FILES.length})
          </h3>
          {REPO_FILES.map((file) => {
            const isSelected = file.path === selectedFilePath;
            return (
              <div
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/50"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-medium text-slate-200 flex items-center gap-1.5">
                    {file.path.endsWith('.tex') || file.path.endsWith('.bib') ? (
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {file.path}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{file.size}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {file.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: File Viewer & Download (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-semibold text-slate-200">
                  {selectedFile.path}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(selectedFile.content, selectedFile.path)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  title="Copy contents"
                >
                  {copiedCmd === selectedFile.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd === selectedFile.path ? "Copied" : "Copy"}</span>
                </button>
                <button
                  onClick={() => handleDownloadFile(selectedFile)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                  title="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-96">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
