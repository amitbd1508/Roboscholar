import React, { useState } from 'react';
import { REAL_WORLD_CASE_STUDIES, EMPIRICAL_BENCHMARKS } from '../data/researchPaperData';
import { Building2, Factory, Bot, Activity, ExternalLink, Filter, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

export const CaseStudiesExplorer: React.FC = () => {
  const [filterSector, setFilterSector] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<typeof REAL_WORLD_CASE_STUDIES[0] | null>(REAL_WORLD_CASE_STUDIES[0]);

  const filteredCases = REAL_WORLD_CASE_STUDIES.filter(cs => {
    if (filterSector === "all") return true;
    if (filterSector === "commercial" && cs.status.toLowerCase().includes("commercial")) return true;
    if (filterSector === "humanoid" && (cs.platform.toLowerCase().includes("humanoid") || cs.name.toLowerCase().includes("figure"))) return true;
    if (filterSector === "manipulation" && (cs.platform.toLowerCase().includes("franka") || cs.platform.toLowerCase().includes("bimanual") || cs.platform.toLowerCase().includes("industrial"))) return true;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Factory className="w-4 h-4" /> State-of-the-Art Deployments & Empirical Audits
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100">
            Real-World Applications & Commercial Case Studies
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Systematic audit of commercial deployments and academic breakthroughs translating LLMs and Vision-Language-Action (VLA) foundation models into physical robotic hardware.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterSector("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterSector === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            All Deployments ({REAL_WORLD_CASE_STUDIES.length})
          </button>
          <button
            onClick={() => setFilterSector("commercial")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterSector === "commercial" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Commercial Pilots
          </button>
          <button
            onClick={() => setFilterSector("humanoid")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterSector === "humanoid" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Humanoids
          </button>
          <button
            onClick={() => setFilterSector("manipulation")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterSector === "manipulation" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Bimanual & Arms
          </button>
        </div>
      </div>

      {/* Grid of Case Studies + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredCases.map((cs) => {
            const isSelected = selectedCase?.id === cs.id;
            return (
              <div
                key={cs.id}
                onClick={() => setSelectedCase(cs)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/50"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm">
                      {cs.name}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {cs.organization} &middot; <span className="text-slate-500">{cs.year}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    cs.status.includes("Commercial")
                      ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                      : cs.status.includes("Open-Source")
                      ? "bg-cyan-950/60 border-cyan-800 text-cyan-300"
                      : "bg-indigo-950/60 border-indigo-800 text-indigo-300"
                  }`}>
                    {cs.status.split(" ")[0]}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Loop: <strong className="text-slate-200 font-normal">{cs.controlFrequency}</strong></span>
                  <span className="truncate max-w-[180px] text-slate-500">{cs.platform.split("(")[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Dossier (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCase && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 sticky top-20 shadow-xl">
              {/* Dossier Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between text-xs font-mono text-indigo-400 mb-1">
                  <span>TECHNICAL CASE DOSSIER &middot; ID: {selectedCase.id.toUpperCase()}</span>
                  <span className="text-slate-400">{selectedCase.year}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100">
                  {selectedCase.name}
                </h3>
                <div className="text-sm text-slate-300 mt-1">
                  Lead Organization: <strong className="text-indigo-300">{selectedCase.organization}</strong>
                </div>
              </div>

              {/* Hardware & Policy Specs Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 font-mono text-[11px] mb-1">PHYSICAL EMBODIMENT</div>
                  <div className="text-slate-200 font-medium">{selectedCase.platform}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 font-mono text-[11px] mb-1">CONTROL FREQUENCY</div>
                  <div className="text-emerald-400 font-mono font-semibold">{selectedCase.controlFrequency}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 md:col-span-2">
                  <div className="text-slate-400 font-mono text-[11px] mb-1">CORE ARCHITECTURE & ACTION HEAD</div>
                  <div className="text-slate-200">{selectedCase.architecture}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 md:col-span-2">
                  <div className="text-slate-400 font-mono text-[11px] mb-1">TRAINING DATASET CORPUS</div>
                  <div className="text-slate-300">{selectedCase.trainingData}</div>
                </div>
              </div>

              {/* Key Practical Outcomes */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Empirical Outcomes & Real-World Results
                </h4>
                <ul className="space-y-2 text-xs text-slate-200">
                  {selectedCase.keyOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-emerald-400 font-mono font-bold">&bull;</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Identified Engineering Limitations */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs">
                <div className="flex items-center gap-1.5 text-rose-300 font-semibold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Engineering Limitations & Open Bottlenecks
                </div>
                <p className="text-rose-200/90 text-xs">
                  {selectedCase.limitations}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparative Benchmark Matrix Table */}
      <div className="pt-6 border-t border-slate-800">
        <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          Comparative VLA Benchmark Matrix (Simulated & Physical Hardware)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Empirical evaluation across standard robotic manipulation suites: LIBERO (4 suites avg), BridgeData V2 (unseen WidowX tables), Language Table, and physical loop frequency.
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-200 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Model / Framework</th>
                <th className="p-3.5">Parameters</th>
                <th className="p-3.5">Action Output Space</th>
                <th className="p-3.5 text-center">LIBERO Avg (%)</th>
                <th className="p-3.5 text-center">BridgeData V2 (%)</th>
                <th className="p-3.5 text-center">Language Table (%)</th>
                <th className="p-3.5 text-center">Loop Rate (Hz)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {EMPIRICAL_BENCHMARKS.map((bench, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {bench.model}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{bench.parameterCount}</td>
                  <td className="p-3.5 text-slate-300">{bench.architectureType}</td>
                  <td className="p-3.5 text-center font-mono font-semibold text-emerald-400">{bench.liberoAvg}%</td>
                  <td className="p-3.5 text-center font-mono font-semibold text-indigo-300">{bench.bridgeDataV2}%</td>
                  <td className="p-3.5 text-center font-mono text-slate-200">{bench.languageTable}%</td>
                  <td className="p-3.5 text-center font-mono text-cyan-300 font-semibold">{bench.frequencyHz} Hz</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
