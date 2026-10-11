import React, { useState } from 'react';
import { RESEARCH_QUESTIONS } from '../data/researchPaperData';
import { Compass, Sparkles, BookOpen, Check, Copy, Sliders, Target, FileText } from 'lucide-react';
import { MathFormula } from './MathFormula';

export const ResearchScopeFormulator: React.FC = () => {
  const [selectedRq, setSelectedRq] = useState<typeof RESEARCH_QUESTIONS[0]>(RESEARCH_QUESTIONS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom RQ Generator States
  const [customDomain, setCustomDomain] = useState<string>("dexterous_manipulation");
  const [customEmbodiment, setCustomEmbodiment] = useState<string>("bimanual_humanoid");
  const [customIndependentVar, setCustomIndependentVar] = useState<string>("action_chunking");
  const [customSafetyConstraint, setCustomSafetyConstraint] = useState<string>("cbf_quadratic_program");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Dynamic custom hypothesis generator
  const generateCustomHypothesis = () => {
    const domainNames: Record<string, string> = {
      dexterous_manipulation: "non-prehensile dexterous manipulation and in-hand tool reorientation",
      robot_navigation: "open-vocabulary topological navigation in non-stationary cluttered environments",
      human_robot_interaction: "fluid bidirectional speech-action multimodal collaboration under cognitive load",
      safety_and_ethics: "formal forward-invariance runtime safety under out-of-distribution adversarial prompting"
    };

    const embodimentNames: Record<string, string> = {
      bimanual_humanoid: "a 32-DoF bipedal humanoid with 16-DoF anthropomorphic hands",
      franka_arm: "a 7-DoF Franka Emika Panda equipped with 6-axis wrist force-torque telemetry",
      mobile_aloha: "a low-cost bimanual mobile manipulator with differential drive base",
      quadruped: "a dynamic quadruped robot executing rough-terrain locomotion"
    };

    const varDescriptions: Record<string, string> = {
      action_chunking: "temporal ensembling over 16-step continuous action chunks (ACT)",
      discrete_binning: "256-uniform discrete action tokenization via causal autoregressive cross-entropy",
      flow_matching: "conditional vector field generation via continuous flow matching ODE integration",
      hierarchical_decoupling: "asynchronous 2Hz System 2 semantic reasoning projected onto a 50Hz reactive System 1 policy"
    };

    return {
      title: `Optimal Sensorimotor Synthesis for ${domainNames[customDomain]} on ${embodimentNames[customEmbodiment]}`,
      question: `How does deploying ${varDescriptions[customIndependentVar]} impact trajectory smoothness, contact stability, and semantic completion rates on ${embodimentNames[customEmbodiment]} when evaluated against dynamic environmental disturbances?`,
      hypothesis: `Deploying ${varDescriptions[customIndependentVar]} coupled with ${customSafetyConstraint.toUpperCase()} will achieve a >25% reduction in trajectory jerk and zero physical boundary intrusions, maintaining asymptotic stability without degrading semantic goal adherence.`,
      metrics: ["Normalized Trajectory Smoothness (Jerk Metric)", "Real-World Task Success Rate (%)", "Control Latency Phase Lag (ms)", "Safety Barrier Minimum Margin h_min"]
    };
  };

  const customResult = generateCustomHypothesis();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" /> Scope Definition & Hypothesis Framework
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-100">
          Formulate Scope & Research Questions (RQs)
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-1">
          Explore the five foundational research questions formulated for this monograph across Navigation, Dexterous Manipulation, HRI, System Latency, and Formal Safety Verification.
        </p>
      </div>

      {/* 5 Formulated RQs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: RQ selector cards (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Formulated Research Questions
          </h3>
          {RESEARCH_QUESTIONS.map((rq) => {
            const isSelected = selectedRq.id === rq.id;
            return (
              <button
                key={rq.id}
                onClick={() => setSelectedRq(rq)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/50"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-indigo-400 font-semibold">{rq.id}</span>
                  <span className="text-slate-500">{rq.area.split('&')[0]}</span>
                </div>
                <div className="text-xs font-medium text-slate-200 line-clamp-2">
                  {rq.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed RQ Analysis & Methodology Card (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-4 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  {selectedRq.id} &middot; {selectedRq.area}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-1">
                  {selectedRq.title}
                </h3>
              </div>
              <button
                onClick={() => handleCopy(selectedRq.question, selectedRq.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                title="Copy question text"
              >
                {copiedId === selectedRq.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === selectedRq.id ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Formal Research Question Statement */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase mb-1">Formal Question Formulation</div>
              <p className="text-sm font-serif italic text-slate-200 leading-relaxed">
                "{selectedRq.question}"
              </p>
            </div>

            {/* Theoretical Hypothesis */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Theoretical Scientific Hypothesis
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {selectedRq.hypothesis}
              </p>
            </div>

            {/* Empirical Methodology */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Empirical Evaluation Methodology & Testbed
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {selectedRq.methodology}
              </p>
            </div>

            {/* Metrics */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Quantitative Evaluation Metrics
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRq.metrics.map((m, idx) => (
                  <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-indigo-950/50 border border-indigo-800/80 text-indigo-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Custom Hypothesis Formulator Builder */}
      <div className="pt-6 border-t border-slate-800">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">
              Custom Research Question & Hypothesis Synthesis Generator
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Customize research variables to formulate tailored hypotheses, evaluation methodologies, and quantitative metrics for your own robotics publication.
          </p>

          {/* Builder Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">ROBOTICS DOMAIN</label>
              <select
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="dexterous_manipulation">Dexterous Manipulation</option>
                <option value="robot_navigation">Semantic Navigation</option>
                <option value="human_robot_interaction">Human-Robot Interaction</option>
                <option value="safety_and_ethics">Safety & Formal CBFs</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">PHYSICAL EMBODIMENT</label>
              <select
                value={customEmbodiment}
                onChange={(e) => setCustomEmbodiment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="bimanual_humanoid">Humanoid (Figure/Unitree)</option>
                <option value="franka_arm">7-DoF Franka Emika Panda</option>
                <option value="mobile_aloha">Bimanual Mobile ALOHA</option>
                <option value="quadruped">Quadruped Locomotion</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">INDEPENDENT VARIABLE</label>
              <select
                value={customIndependentVar}
                onChange={(e) => setCustomIndependentVar(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="action_chunking">Action Chunking (ACT)</option>
                <option value="flow_matching">Flow Matching Head</option>
                <option value="discrete_binning">256-Bin Discretization</option>
                <option value="hierarchical_decoupling">System 1 / System 2 Hierarchy</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">SAFETY ENVELOPE</label>
              <select
                value={customSafetyConstraint}
                onChange={(e) => setCustomSafetyConstraint(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="cbf_quadratic_program">CBF-QP Safety Filter</option>
                <option value="hamilton_jacobi">Hamilton-Jacobi Reachability</option>
                <option value="impedance_clipping">Torque Limit Saturation</option>
              </select>
            </div>
          </div>

          {/* Generated Result Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-mono">
              <span>SYNTHESIZED RESEARCH PROPOSAL CARD</span>
              <button
                onClick={() => handleCopy(`${customResult.question}\n\nHypothesis: ${customResult.hypothesis}`, "custom")}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                {copiedId === "custom" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === "custom" ? "Copied" : "Copy Formulated RQ"}</span>
              </button>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-200">{customResult.title}</div>
              <p className="text-xs text-indigo-200/90 font-serif italic mt-1">
                "{customResult.question}"
              </p>
            </div>

            <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <strong className="text-slate-200">Formal Hypothesis: </strong>
              {customResult.hypothesis}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {customResult.metrics.map((met, i) => (
                <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {met}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
