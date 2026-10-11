import React, { useState } from 'react';
import { ARCHITECTURE_TAXONOMY } from '../data/researchPaperData';
import { Network, Layers, Sparkles, Check, X, ArrowRight, Code2, Zap, Sliders } from 'lucide-react';
import { MathFormula } from './MathFormula';

export const ArchitectureTaxonomyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("autoregressive-vla");

  const currentArch = ARCHITECTURE_TAXONOMY.find(a => a.id === activeTab) || ARCHITECTURE_TAXONOMY[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-1">
          <Network className="w-4 h-4" /> Deep Technical Taxonomy
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-100">
          LLM Architectures & Adaptation Strategies for Physical Robotics
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Detailed analysis of how Causal Autoregressive models (GPT lineages), Bidirectional Encoders (BERT lineages), Continuous Flow Matching (Pi0), and Code-as-Policies are adapted for real-time robotic actuation.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {ARCHITECTURE_TAXONOMY.map((arch) => {
          const isActive = arch.id === activeTab;
          return (
            <button
              key={arch.id}
              onClick={() => setActiveTab(arch.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? "bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/50"
                  : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
              }`}
            >
              <div className="text-[11px] font-mono text-slate-400 truncate">
                {arch.id.replace('-', ' ').toUpperCase()}
              </div>
              <div className={`text-xs font-semibold mt-1 truncate ${isActive ? "text-indigo-300" : "text-slate-200"}`}>
                {arch.name.split('(')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Architecture Deep-Dive Dossier */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {currentArch.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
              <span>Representative Systems:</span>
              {currentArch.examples.map((ex, i) => (
                <span key={i} className="text-indigo-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {ex}
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-300">
            Target Domain: {currentArch.idealUseCases.split(',')[0]}
          </div>
        </div>

        {/* Core Mechanism Description */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Operational Mechanism & Mathematical Formulation
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            {currentArch.mechanism}
          </p>
        </div>

        {/* Strengths & Weaknesses Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 uppercase tracking-wider font-mono">
              <Check className="w-4 h-4 text-emerald-400" /> Architectural Advantages & Strengths
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentArch.strengths.map((st, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&check;</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 uppercase tracking-wider font-mono">
              <X className="w-4 h-4 text-rose-400" /> Critical Limitations & Physical Failure Modes
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentArch.weaknesses.map((wk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">&times;</span>
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Adaptation Pipeline */}
        <div className="pt-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Adaptation & Fine-Tuning Pipeline Blueprint
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-indigo-400 font-mono text-[11px] mb-1">STAGE 1: EMBEDDING INTERFACE</div>
              <p className="text-slate-300">
                {currentArch.id === "autoregressive-vla"
                  ? "Expand vocabulary with 256 discrete tokens per 7-DoF dimension (<act_x_000> to <act_x_255>)."
                  : currentArch.id === "flow-matching-diffusion"
                  ? "Attach continuous flow MLP/U-Net prediction head conditioned on pooled VLM sequence tokens."
                  : currentArch.id === "bidirectional-encoders"
                  ? "Extract bidirectional attention feature maps and project into 3D voxel affordance field."
                  : "Prompt formatting with Python type stubs, kinematic collision APIs, and TrajOpt constraints."}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-indigo-400 font-mono text-[11px] mb-1">STAGE 2: CO-FINE-TUNING (PEFT)</div>
              <p className="text-slate-300">
                Apply LoRA (rank r=32, alpha=64) on query/key projections while freezing 80% of language weights to preserve web commonsense reasoning.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-indigo-400 font-mono text-[11px] mb-1">STAGE 3: CONTROL DEPLOYMENT</div>
              <p className="text-slate-300">
                Deploy with TensorRT-LLM 4-bit INT4/FP8 quantization on edge GPU (NVIDIA Jetson AGX Orin or RTX 4090) with asynchronous 500Hz impedance safety layer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
