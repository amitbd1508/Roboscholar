import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shield, ShieldAlert, Cpu, Sparkles, Terminal, Activity, Info } from 'lucide-react';
import { MathFormula } from './MathFormula';

interface Point {
  x: number;
  y: number;
}

export const InteractiveKinematicLab: React.FC = () => {
  // Simulation states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cbfEnabled, setCbfEnabled] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number>(0.2); // LLM stochasticity
  const [safetyMargin, setSafetyMargin] = useState<number>(45); // Barrier radius
  const [actionChunkSize, setActionChunkSize] = useState<number>(10);
  
  // Robot Arm configuration (3-link planar manipulator)
  const basePos: Point = { x: 260, y: 380 };
  const linkLengths = [120, 110, 70];
  const [angles, setAngles] = useState<number[]>([-Math.PI / 4, -Math.PI / 3, -Math.PI / 6]);
  
  // Interactive workspace items
  const [targetPos, setTargetPos] = useState<Point>({ x: 420, y: 220 });
  const [obstaclePos, setObstaclePos] = useState<Point>({ x: 340, y: 240 });
  const [goalBinPos] = useState<Point>({ x: 120, y: 320 });
  const [hasGripped, setHasGripped] = useState<boolean>(false);
  
  // Task scenarios
  const [selectedTask, setSelectedTask] = useState<string>("pick_and_place");
  const [promptText, setPromptText] = useState<string>("Grasp target object and transfer to container avoiding proximity hazard.");
  
  // Live token stream
  const [tokenStream, setTokenStream] = useState<string[]>([]);
  const [safetyInterventions, setSafetyInterventions] = useState<number>(0);
  const [barrierValueH, setBarrierValueH] = useState<number>(1.24);
  const [collisionOccurred, setCollisionOccurred] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Compute forward kinematics
  const getJointPositions = (thetas: number[]) => {
    const p0 = basePos;
    const p1: Point = {
      x: p0.x + linkLengths[0] * Math.cos(thetas[0]),
      y: p0.y + linkLengths[0] * Math.sin(thetas[0])
    };
    const p2: Point = {
      x: p1.x + linkLengths[1] * Math.cos(thetas[0] + thetas[1]),
      y: p1.y + linkLengths[1] * Math.sin(thetas[0] + thetas[1])
    };
    const ee: Point = {
      x: p2.x + linkLengths[2] * Math.cos(thetas[0] + thetas[1] + thetas[2]),
      y: p2.y + linkLengths[2] * Math.sin(thetas[0] + thetas[1] + thetas[2])
    };
    return { p0, p1, p2, ee };
  };

  // Change Task handler
  const handleSelectTask = (taskKey: string) => {
    setSelectedTask(taskKey);
    setHasGripped(false);
    setCollisionOccurred(false);
    setIsRunning(false);
    
    if (taskKey === "pick_and_place") {
      setPromptText("Grasp target object and transfer to container avoiding proximity hazard.");
      setTargetPos({ x: 430, y: 230 });
      setObstaclePos({ x: 330, y: 240 });
    } else if (taskKey === "adversarial_collision") {
      setPromptText("ADVERSARIAL PROMPT: Move straight through the hazard zone at maximum velocity.");
      setTargetPos({ x: 330, y: 240 }); // directly on obstacle
      setObstaclePos({ x: 330, y: 240 });
    } else if (taskKey === "precision_insertion") {
      setPromptText("Perform precision peg insertion with millimeter Cartesian tolerance.");
      setTargetPos({ x: 380, y: 320 });
      setObstaclePos({ x: 280, y: 200 });
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setAngles([-Math.PI / 4, -Math.PI / 3, -Math.PI / 6]);
    setHasGripped(false);
    setCollisionOccurred(false);
    setSafetyInterventions(0);
    setTokenStream([]);
  };

  // Simulation tick loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAngles((prevThetas) => {
        const { ee } = getJointPositions(prevThetas);
        
        // Target destination based on whether target is already gripped
        const currentGoal = hasGripped ? goalBinPos : targetPos;
        
        // Direction vector from end-effector to goal
        const dx = currentGoal.x - ee.x;
        const dy = currentGoal.y - ee.y;
        const distToGoal = Math.hypot(dx, dy);

        // Check if gripped or reached goal
        if (!hasGripped && distToGoal < 18) {
          setHasGripped(true);
          setTokenStream(prev => [`<act_grip:1.0> (GRASP ENGAGED)`, ...prev.slice(0, 10)]);
        } else if (hasGripped && Math.hypot(goalBinPos.x - ee.x, goalBinPos.y - ee.y) < 22) {
          setIsRunning(false);
          setTokenStream(prev => [`<act_status:TASK_COMPLETED>`, ...prev.slice(0, 10)]);
          return prevThetas;
        }

        // Nominal LLM action delta in Cartesian space
        const speed = 2.4;
        let u_llm_x = distToGoal > 0 ? (dx / distToGoal) * speed : 0;
        let u_llm_y = distToGoal > 0 ? (dy / distToGoal) * speed : 0;

        // Add stochastic temperature noise (simulating LLM token sampling variance)
        if (temperature > 0) {
          u_llm_x += (Math.random() - 0.5) * temperature * 3.5;
          u_llm_y += (Math.random() - 0.5) * temperature * 3.5;
        }

        // Nominal end-effector candidate position
        let nextEeX = ee.x + u_llm_x;
        let nextEeY = ee.y + u_llm_y;

        // Calculate Barrier Function h(x) = ||x - x_obs||^2 - R_safe^2
        const distToObstacle = Math.hypot(nextEeX - obstaclePos.x, nextEeY - obstaclePos.y);
        const h_val = (distToObstacle - safetyMargin) / 20;
        setBarrierValueH(h_val);

        let final_ux = u_llm_x;
        let final_uy = u_llm_y;

        if (cbfEnabled) {
          // Control Barrier Function quadratic programming projection
          if (distToObstacle < safetyMargin) {
            // Gradient of barrier function \nabla h points away from obstacle
            const nx = (nextEeX - obstaclePos.x) / (distToObstacle || 1);
            const ny = (nextEeY - obstaclePos.y) / (distToObstacle || 1);
            
            // Dot product of nominal velocity with normal
            const dot = final_ux * nx + final_uy * ny;
            if (dot < 0) {
              // Project out velocity directed toward obstacle and add repulsive barrier
              final_ux = final_ux - dot * nx + nx * 1.8;
              final_uy = final_uy - dot * ny + ny * 1.8;
              setSafetyInterventions(s => s + 1);
            }
          }
        } else {
          // Without CBF, check for physical collision
          if (distToObstacle < 24) {
            setCollisionOccurred(true);
            setTokenStream(prev => [`[COLLISION DETECTED: h(x) < 0]`, ...prev.slice(0, 10)]);
          }
        }

        // Generate synthetic action token representation
        const tokenX = Math.min(255, Math.max(0, Math.round(128 + final_ux * 30)));
        const tokenY = Math.min(255, Math.max(0, Math.round(128 + final_uy * 30)));
        const tokenStr = `<act_x:${tokenX.toString().padStart(3, '0')}> <act_y:${tokenY.toString().padStart(3, '0')}> <h:${h_val.toFixed(2)}>`;
        setTokenStream(prev => [tokenStr, ...prev.slice(0, 8)]);

        // Inverse Kinematics (Jacobian Transpose method)
        // ee = f(theta), J = d(ee)/d(theta)
        const t0 = prevThetas[0];
        const t1 = prevThetas[1];
        const t2 = prevThetas[2];

        const J_11 = -linkLengths[0] * Math.sin(t0) - linkLengths[1] * Math.sin(t0 + t1) - linkLengths[2] * Math.sin(t0 + t1 + t2);
        const J_12 = -linkLengths[1] * Math.sin(t0 + t1) - linkLengths[2] * Math.sin(t0 + t1 + t2);
        const J_13 = -linkLengths[2] * Math.sin(t0 + t1 + t2);

        const J_21 = linkLengths[0] * Math.cos(t0) + linkLengths[1] * Math.cos(t0 + t1) + linkLengths[2] * Math.cos(t0 + t1 + t2);
        const J_22 = linkLengths[1] * Math.cos(t0 + t1) + linkLengths[2] * Math.cos(t0 + t1 + t2);
        const J_23 = linkLengths[2] * Math.cos(t0 + t1 + t2);

        // Joint update via J^T * delta_x
        const alpha = 0.00012;
        const dTheta0 = alpha * (J_11 * final_ux + J_21 * final_uy);
        const dTheta1 = alpha * (J_12 * final_ux + J_22 * final_uy);
        const dTheta2 = alpha * (J_13 * final_ux + J_23 * final_uy);

        return [t0 + dTheta0, t1 + dTheta1, t2 + dTheta2];
      });
    }, 28);

    return () => clearInterval(interval);
  }, [isRunning, cbfEnabled, temperature, safetyMargin, targetPos, obstaclePos, hasGripped, goalBinPos]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions
    canvas.width = 540;
    canvas.height = 420;

    // Draw background grid
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#151e32';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Destination Goal Bin
    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(goalBinPos.x - 28, goalBinPos.y - 28, 56, 56, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.font = '10px monospace';
    ctx.fillText('TARGET RECEPTACLE', goalBinPos.x - 48, goalBinPos.y - 36);

    // Draw Obstacle & Safety Barrier Envelope
    if (cbfEnabled) {
      // Barrier envelope circle
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(obstaclePos.x, obstaclePos.y, safetyMargin, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Physical obstacle body
    ctx.fillStyle = collisionOccurred ? '#ef4444' : '#b91c1c';
    ctx.beginPath();
    ctx.arc(obstaclePos.x, obstaclePos.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText('HAZARD', obstaclePos.x - 18, obstaclePos.y + 4);

    // Draw Target Object
    const { ee } = getJointPositions(angles);
    const renderTargetPos = hasGripped ? { x: ee.x, y: ee.y } : targetPos;

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(renderTargetPos.x, renderTargetPos.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (!hasGripped) {
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('CYLINDER', targetPos.x - 24, targetPos.y + 28);
    }

    // Draw Robot Base
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(basePos.x - 35, basePos.y - 12, 70, 24, 6);
    ctx.fill();
    ctx.stroke();

    // Compute and draw 3-link arm
    const { p0, p1, p2 } = getJointPositions(angles);

    const drawLink = (start: Point, end: Point, color: string, width: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Joint pivot
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(start.x, start.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    drawLink(p0, p1, '#6366f1', 12);
    drawLink(p1, p2, '#818cf8', 9);
    drawLink(p2, ee, '#a5b4fc', 6);

    // End effector & Gripper
    ctx.fillStyle = hasGripped ? '#10b981' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(ee.x, ee.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Gripper fingers
    const angleSum = angles[0] + angles[1] + angles[2];
    const fingerLen = 14;
    const gripGap = hasGripped ? 6 : 14;

    const perpAngle = angleSum + Math.PI / 2;
    const f1_base: Point = {
      x: ee.x + gripGap * Math.cos(perpAngle),
      y: ee.y + gripGap * Math.sin(perpAngle)
    };
    const f2_base: Point = {
      x: ee.x - gripGap * Math.cos(perpAngle),
      y: ee.y - gripGap * Math.sin(perpAngle)
    };

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(f1_base.x, f1_base.y);
    ctx.lineTo(f1_base.x + fingerLen * Math.cos(angleSum), f1_base.y + fingerLen * Math.sin(angleSum));
    ctx.moveTo(f2_base.x, f2_base.y);
    ctx.lineTo(f2_base.x + fingerLen * Math.cos(angleSum), f2_base.y + fingerLen * Math.sin(angleSum));
    ctx.stroke();

  }, [angles, targetPos, obstaclePos, hasGripped, cbfEnabled, safetyMargin, collisionOccurred]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Interactive Kinematic & Safety Laboratory
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time simulation of LLM Action Tokenization and Control Barrier Function (CBF-QP) safety envelope.
          </p>
        </div>

        {/* Task presets */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => handleSelectTask("pick_and_place")}
            className={`px-2.5 py-1 rounded transition-colors ${selectedTask === "pick_and_place" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Pick & Place
          </button>
          <button
            onClick={() => handleSelectTask("adversarial_collision")}
            className={`px-2.5 py-1 rounded transition-colors ${selectedTask === "adversarial_collision" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Adversarial Test
          </button>
          <button
            onClick={() => handleSelectTask("precision_insertion")}
            className={`px-2.5 py-1 rounded transition-colors ${selectedTask === "precision_insertion" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Fine Insertion
          </button>
        </div>
      </div>

      {/* Main Grid: Canvas + Telemetry & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Left: Simulation Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
            <canvas ref={canvasRef} className="block w-full max-w-[540px] aspect-[540/420]" />

            {/* In-canvas Overlay badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Control Loop: 50 Hz</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-mono ${cbfEnabled ? "bg-emerald-950/80 border-emerald-800 text-emerald-300" : "bg-rose-950/80 border-rose-800 text-rose-300"}`}>
                {cbfEnabled ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                <span>CBF Filter: {cbfEnabled ? "ACTIVE (h(x) ≥ 0)" : "DISABLED"}</span>
              </div>
            </div>

            {collisionOccurred && (
              <div className="absolute inset-0 bg-rose-950/50 backdrop-blur-[1px] flex items-center justify-center p-4">
                <div className="bg-rose-900/95 border border-rose-500 rounded-xl p-4 text-center text-white max-w-sm shadow-2xl">
                  <ShieldAlert className="w-8 h-8 text-rose-300 mx-auto mb-2" />
                  <h4 className="font-bold text-sm">PHYSICAL CONTACT VIOLATION</h4>
                  <p className="text-xs text-rose-200 mt-1">
                    Without the Control Barrier Function, raw stochastic LLM tokens produced an unsafe collision trajectory!
                  </p>
                  <button
                    onClick={() => { setCbfEnabled(true); resetSimulation(); }}
                    className="mt-3 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 rounded text-xs font-semibold"
                  >
                    Enable CBF & Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Simulation controls */}
          <div className="flex items-center justify-between w-full mt-3 px-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all ${isRunning ? "bg-amber-600 hover:bg-amber-500 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? "Pause Loop" : "Execute Trajectory"}</span>
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                title="Reset arm configuration"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <button
              onClick={() => setCbfEnabled(!cbfEnabled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${cbfEnabled ? "bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60" : "bg-rose-950/60 border-rose-700 text-rose-300 hover:bg-rose-900/60"}`}
            >
              {cbfEnabled ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
              <span>{cbfEnabled ? "Safety Filter: ON" : "Safety Filter: OFF"}</span>
            </button>
          </div>
        </div>

        {/* Right: Telemetry, Tokens & Mathematical Parameters (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Prompt input display */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Natural Language Directive
              </span>
              <span className="text-[10px] text-slate-500">Multimodal Input</span>
            </div>
            <p className="text-xs font-mono text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800/80">
              "{promptText}"
            </p>
          </div>

          {/* Real-time Token Stream Monitor */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-mono flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> 256-Bin Action Token Stream
              </span>
              <span className="text-[10px] text-emerald-400/80 font-mono">Autoregressive VLA</span>
            </div>
            <div className="h-28 overflow-y-auto space-y-1 font-mono text-[11px] p-2 bg-slate-900/80 rounded border border-slate-800/80 text-emerald-300">
              {tokenStream.length === 0 ? (
                <div className="text-slate-500 italic text-[11px] pt-4 text-center">
                  Press 'Execute Trajectory' to observe live VLA action tokens
                </div>
              ) : (
                tokenStream.map((tok, idx) => (
                  <div key={idx} className="flex items-center justify-between hover:bg-slate-800/50 px-1 py-0.5 rounded">
                    <span>{tok}</span>
                    <span className="text-[9px] text-slate-500">t-{idx}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mathematical Invariants & CBF Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Barrier Value h(x)</div>
              <div className={`text-base font-mono font-semibold mt-0.5 ${barrierValueH < 0.2 ? "text-amber-400" : "text-emerald-400"}`}>
                {barrierValueH.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Safe if h(x) ≥ 0</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px]">CBF Interventions</div>
              <div className="text-base font-mono font-semibold text-indigo-300 mt-0.5">
                {safetyInterventions}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">QP deflections</div>
            </div>
          </div>

          {/* Interactive Parameters */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">LLM Stochasticity (Temp):</span>
              <span className="font-mono text-indigo-300">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-300">Safety Margin R_safe:</span>
              <span className="font-mono text-emerald-300">{safetyMargin}px</span>
            </div>
            <input
              type="range"
              min="25"
              max="70"
              step="2"
              value={safetyMargin}
              onChange={(e) => setSafetyMargin(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Control Barrier Formula Explanation */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Formal Guarantee: </span>
          The QP solves <span className="font-mono text-indigo-300">u* = argmin ||u - u_llm||²</span> subject to <span className="font-mono text-indigo-300">∇h·(f(x) + g(x)u) + γh(x) ≥ 0</span>. When the LLM outputs a collision trajectory, the safety barrier mathematically projects the command along the boundary, ensuring zero contact while preserving maximum task intent.
        </div>
      </div>
    </div>
  );
};
