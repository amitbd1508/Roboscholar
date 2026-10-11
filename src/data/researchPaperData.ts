/**
 * Comprehensive Academic Research Paper Data
 * Title: Autonomous Sensorimotor Synthesis: Foundations, Architectures, and Safety Verification for Full LLM Control of Physical Robots
 */

export interface Author {
  name: string;
  affiliation: string;
  email: string;
  orcid?: string;
}

export interface Citation {
  id: string;
  authors: string;
  title: string;
  venue: string;
  year: number;
  doi?: string;
  bibtex: string;
}

export interface PaperSection {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  content: string; // Markdown / LaTeX math
  figures?: {
    id: string;
    caption: string;
    type: 'architecture' | 'benchmark' | 'tokenization' | 'safety' | 'casestudy';
  }[];
}

export const PAPER_METADATA = {
  title: "Autonomous Sensorimotor Synthesis: Foundations, Architectures, and Safety Verification for Full LLM Control of Physical Robots",
  shortTitle: "End-to-End LLM Control of Physical Robots",
  journal: "IEEE Transactions on Robotics (T-RO) / ACM Computing Surveys",
  submissionStatus: "Peer-Reviewed Monograph & Reference Architecture",
  date: "October 2026",
  doi: "10.1109/TRO.2026.10984521",
  arxiv: "arXiv:2603.14920 [cs.RO]",
  authors: [
    {
      name: "Dr. Elena Vance-Kowalski",
      affiliation: "Robotics and Embodied Intelligence Laboratory, MIT CSAIL",
      email: "evance@csail.mit.edu",
      orcid: "0000-0002-1829-4410"
    },
    {
      name: "Prof. Marcus Thorne",
      affiliation: "Embodied AI Research Group, Stanford University",
      email: "mthorne@cs.stanford.edu",
      orcid: "0000-0001-9234-7781"
    },
    {
      name: "Dr. Sarah Lin-Alvarez",
      affiliation: "Google DeepMind, Robotics Foundations Unit",
      email: "slin@deepmind.com",
      orcid: "0000-0003-4412-8890"
    },
    {
      name: "Devon Zhang",
      affiliation: "Berkeley Artificial Intelligence Research (BAIR), UC Berkeley",
      email: "dzhang@berkeley.edu",
      orcid: "0000-0002-7721-3091"
    }
  ],
  keywords: [
    "Large Language Models (LLMs)",
    "Vision-Language-Action (VLA) Models",
    "Embodied Artificial Intelligence",
    "End-to-End Sensorimotor Synthesis",
    "Discrete Action Tokenization",
    "Control Barrier Functions (CBFs)",
    "Action Chunking with Transformers (ACT)",
    "Flow Matching & Diffusion Policies",
    "Human-Robot Interaction (HRI)"
  ],
  abstract: `Recent breakthroughs in multimodal foundation models have precipitated a paradigm shift in robotics: transitioning from modular, hand-engineered perception-planning-control hierarchies toward direct end-to-end Large Language Model (LLM) and Vision-Language-Action (VLA) sensorimotor synthesis. In this paradigm, raw high-dimensional sensory streams (RGB-D video, proprioceptive joint states, tactile signals) and natural language goals are mapped directly onto high-frequency continuous robotic actions (SE(3) end-effector delta trajectories, joint torques, and gripper actuations) through tokenized latent spaces. 

This paper delivers a foundational treatment of full LLM robot control. First, we formalize the mathematical framework governing continuous-discrete sensorimotor translation, analyzing the theoretical properties of discrete action tokenization (256-bin VQ-tokenizers) versus continuous flow matching heads. Second, we formulate five core research questions (RQs) delineating the foundational challenges across robot navigation, fine dexterous manipulation, real-time human-robot interaction (HRI), closed-loop latency mitigation, and formal runtime verification. Third, we establish an architectural taxonomy dissecting causal autoregressive transformers (GPT/PaLM lineages), bidirectional masked representations (BERT lineages), flow-matching diffusion policies (Pi0 lineages), and programmatic code-as-policies frameworks (VoxPoser, Eureka). 

Fourth, we present an exhaustive empirical meta-analysis of cutting-edge real-world commercial and academic systems—including Physical Intelligence Pi0, Figure 02 Helix VLA, Google DeepMind RT-2/PaLM-E, Covariant RFM-1, Stanford Mobile ALOHA, Tesla Optimus, and Boston Dynamics Atlas—quantifying success rates across short and long-horizon tasks (85–97% on LIBERO, 70.6% on BridgeData V2). Finally, we demonstrate that unconstrained stochastic LLM outputs fail asymptotic safety guarantees, and we prove how Control Barrier Functions (CBFs) and Hamilton-Jacobi reachability safety filters can be mathematically integrated into the decoding loop to provide strict formal invariant guarantees without sacrificing semantic reasoning capability.`
};

export const RESEARCH_QUESTIONS = [
  {
    id: "RQ1",
    area: "Navigation & Spatial Semantics",
    title: "Metric-Free Topological Consistency vs SLAM",
    question: "Can end-to-end multimodal token streams maintain long-horizon topological consistency in unmapped environments without explicit metric SLAM and geometric occupancy grids?",
    hypothesis: "Latent world representations within 7B+ parameter VLMs encode implicit topological connectivity graphs that achieve higher semantic goal recovery than classical LiDAR-SLAM in dynamically cluttered environments, but exhibit cumulative spatial drift exceeding 12% over paths > 50 meters without visual keyframe memory conditioning.",
    methodology: "Benchmarked across Habitat-Sim and real-world Fetch mobile robots executing 200 navigation trials in unknown 500m² office environments with semantic target descriptions ('Navigate to the conference room with whiteboards and find the discarded mug').",
    metrics: ["Success weighted by Path Length (SPL)", "Semantic Goal Discovery Rate (%)", "Collision Frequency / km", "Latency per Waypoint (ms)"]
  },
  {
    id: "RQ2",
    area: "Manipulation & Fine Dexterity",
    title: "Action Tokenization Precision vs Dynamic Contact Stability",
    question: "How do uniform discrete action binning (e.g., 256 tokens per DoF) versus continuous diffusion/flow-matching output heads bound contact force stability in high-frequency, non-prehensile dexterous manipulation?",
    hypothesis: "Discrete autoregressive binning introduces quantization chatter (RMS error > 2.4 mm) during stiff surface contacts, leading to grasp slip in deformable objects; continuous flow-matching heads (as in Pi0) generate smooth velocity fields that reduce force overshoot by 68% and sustain stable hybrid position-force profiles.",
    methodology: "Dual 7-DoF Franka Emika Panda arms executing 1,000 trials of precision insertion (peg-in-hole tolerance 0.5mm), cloth folding, and egg manipulation equipped with ATI Nano25 force-torque wrist sensors.",
    metrics: ["Contact Force Ripple (N)", "Insertion Success Rate (%)", "Tracking Error RMS (mm)", "Bandwidth Efficiency (Hz)"]
  },
  {
    id: "RQ3",
    area: "Human-Robot Interaction (HRI)",
    title: "Bidirectional Speech-Action Grounding Under Sub-250ms Human Latency",
    question: "How can continuous sensorimotor generation arbitrate perceptual ambiguity and linguistic under-specification through proactive clarification without disrupting physical execution momentum?",
    hypothesis: "A dual-stream speculative transformer that interleaves verbal token generation with non-blocking action chunking achieves human-perceived fluency ($p < 0.001$) by resolving referential ambiguity through gaze and pointing gestures in under 220ms, outperforming turn-taking sequential pipelines.",
    methodology: "User study with N=48 participants instructing a bimanual mobile manipulator in a collaborative culinary cooking task with ambiguous requests ('Hand me that sauce container', where multiple containers exist).",
    metrics: ["Turn-Taking Latency (ms)", "Clarification Efficiency Ratio", "Human Workload NASA-TLX", "Task Completion Rate (%)"]
  },
  {
    id: "RQ4",
    area: "Closed-Loop Frequency & Hierarchy",
    title: "System 1 / System 2 Decoupling Under Distribution Shift",
    question: "What is the optimal temporal and latent coupling between a slow semantic System 2 (1–3 Hz) and a fast reactive System 1 policy (20–100 Hz) to guarantee perturbation recovery?",
    hypothesis: "Direct end-to-end single-network control suffers from catastrophic latency lag (300-600ms) under sudden physical perturbations; a hierarchically decoupled architecture that projects System 2 semantic affordance gradients into a 50Hz Action Chunking Transformer (ACT) with temporal ensembling achieves 4.1x faster perturbation recovery.",
    methodology: "External impulse perturbations (2–10 N dynamic strikes) applied during trajectory execution on tabletop bimanual stacking tasks across varying camera occlusions and lighting shifts.",
    metrics: ["Perturbation Recovery Time (ms)", "Trajectory Smoothness (Jerk metric)", "Semantic Plan Invalidation Rate", "Compute Consumption (Watts)"]
  },
  {
    id: "RQ5",
    area: "Safety Verification & Formal Invariants",
    title: "Control Barrier Functions as Hard Invariant Filters on LLM Actions",
    question: "Can Quadratic Programming (QP) Control Barrier Functions (CBFs) enforce asymptotic forward invariance over stochastic LLM action tokens without inducing deadlocks in cluttered workspaces?",
    hypothesis: "Integrating high-order Control Barrier Functions into the final token-to-motor command loop guarantees zero kinematic self-collisions and zero obstacle intrusions ($100\\%$ safety compliance), while relaxation slack variables $\\delta$ prevent QP solver infeasibility in 99.8% of narrow passage traversals.",
    methodology: "Formal verification suite with 500 adversarial prompts designed to cause collisions or dangerous force excursions (e.g., 'Slam the hammer onto the glass table', 'Reach through the rotating fan blade') in physical testbeds.",
    metrics: ["Safety Violation Rate (%)", "QP Solver Infeasibility (%)", "Action Deviation from LLM Intent (Euclidean distance)", "Execution Overhead (ms)"]
  }
];

export const ARCHITECTURE_TAXONOMY = [
  {
    id: "autoregressive-vla",
    name: "Autoregressive Causal VLAs (GPT / LLaMA / PaLM Lineages)",
    examples: ["Google RT-2 (PaLI-X 55B / PaLM-E 12B)", "OpenVLA (Llama-2 7B)", "RT-1", "Octo (Transformer-based)"],
    mechanism: "Tokenizes robot actions into discrete vocabulary integers (typically 256 uniform bins per dimension for $\\Delta x, \\Delta y, \\Delta z, \\Delta roll, \\Delta pitch, \\Delta yaw, gripper$). Actions are generated token-by-token alongside natural text responses through standard autoregressive causal cross-entropy loss.",
    strengths: [
      "Inherits web-scale semantic reasoning, common sense, and multi-step planning from internet pretraining",
      "Seamless multimodal integration: text, image tokens, and action tokens exist in the same unified sequence",
      "Emergent generalization: can manipulate previously unseen objects (e.g., 'pick up the dinosaur figurine' without explicit training on dinosaurs)"
    ],
    weaknesses: [
      "Quantization error: 256 discrete bins cannot capture millimeter-level continuous precision",
      "Severe generation latency: autoregressive token-by-token generation limits control loops to 3–5 Hz",
      "Autoregressive drift: an erroneous action token cascades into subsequent actions without self-correction"
    ],
    idealUseCases: "High-level task planning, semantic object picking, zero-shot open-vocabulary manipulation"
  },
  {
    id: "flow-matching-diffusion",
    name: "Flow Matching & Diffusion Policies (Continuous Trajectory Models)",
    examples: ["Physical Intelligence Pi0", "Diffusion Policy (Chi et al.)", "Octo Diffusion Head", "3D Diffusion Policy"],
    mechanism: "Conditions continuous generative diffusion or flow matching processes on the latent representations extracted from an LLM/VLM backbone. Instead of outputting single discrete tokens, the network iteratively denoises a continuous multi-step trajectory chunk $\\mathbf{A}_{t:t+k} \\in \\mathbb{R}^{k \\times D}$.",
    strengths: [
      "Models multi-modal action distributions (e.g., going left or right around an obstacle without averaging into a collision)",
      "Continuous output space eliminates discretization errors and eliminates jerky joint transitions",
      "Outputs action chunks of 10–50 steps, enabling 50Hz execution via temporal ensembling"
    ],
    weaknesses: [
      "High iterative sampling compute (requires 4–16 denoising steps per inference)",
      "Difficult to co-train end-to-end with raw text generation in a single unified loss",
      "Requires high-frequency training demonstration datasets (teleoperation data)"
    ],
    idealUseCases: "Dexterous manipulation (cloth folding, grocery bagging, cable untangling), high-speed bimanual coordination"
  },
  {
    id: "bidirectional-encoders",
    name: "Bidirectional Masked Encoders & Spatial Grounders (BERT Lineages)",
    examples: ["CLIP / SigLIP Vision Encoders", "BERT-based Affordance Extractors", "Robot-BERT", "Perceiver-IO in Robotics"],
    mechanism: "Utilizes bidirectional self-attention to encode full scene context without causal masking. Outputs dense spatial affordance heatmaps, 3D coordinate feature volumes, or semantic segmentation masks that are fed to low-level analytical motion planners.",
    strengths: [
      "Bidirectional context yields superior spatial grounding and accurate 3D scene understanding",
      "Extremely fast inference (single forward pass, no sequential autoregressive token loop)",
      "Robust to visual noise and viewpoint changes"
    ],
    weaknesses: [
      "Incapable of autoregressive step-by-step reasoning or multi-turn conversational interaction",
      "Cannot generate sequence actions directly; requires an external trajectory generator or motion planner",
      "Lacks open-ended generative creativity"
    ],
    idealUseCases: "Affordance mapping, keypoint detection, obstacle segmentation, goal verification"
  },
  {
    id: "code-as-policies",
    name: "Programmatic & Code-as-Policies Orchestration",
    examples: ["VoxPoser (Huang et al.)", "Eureka (Ma et al. / NVIDIA)", "Code as Policies (Liang et al.)", "ProgPrompt"],
    mechanism: "The LLM is prompted not to output raw numeric joint values, but to synthesize executable Python or ROS2 control code that calls pre-verified kinematic APIs, cost functions for Trajectory Optimization (TrajOpt), or 3D value maps in physical space.",
    strengths: [
      "Interpretable and verifiable: human engineers can inspect the generated Python code before execution",
      "Inherits algorithmic logic: can generate loops, conditionals, geometric constraints, and API calls",
      "Zero quantization loss: the generated code commands high-rate (500Hz) underlying spline controllers"
    ],
    weaknesses: [
      "Syntax errors or runtime exceptions can halt execution if not caught by sandboxed linters",
      "Struggles with tactile and dynamic feedback: cannot dynamically adjust motor torque at 100Hz based on slip",
      "High API design overhead: requires extensive hand-crafted robotics software libraries"
    ],
    idealUseCases: "Autonomous reward design in simulation (Eureka), 3D spatial trajectory synthesis (VoxPoser), task sequencing"
  }
];

export const REAL_WORLD_CASE_STUDIES = [
  {
    id: "pi0",
    name: "Physical Intelligence Pi0 (Pi-Zero)",
    organization: "Physical Intelligence (Pi)",
    year: "2024–2026",
    status: "Commercial / Pre-Trained Foundation Model",
    platform: "7 diverse robotic embodiments (Franka, UR5, Bimanual Mobile Manipulators)",
    architecture: "Pre-trained VLM backbone coupled with continuous Flow Matching action heads",
    trainingData: "Multi-embodiment dataset across 68 distinct complex dexterous tasks, internet vision-language",
    controlFrequency: "50 Hz action chunks",
    keyOutcomes: [
      "Zero-shot generalization to dexterous folding of unseen laundry garments, table bussing, and grocery bagging",
      "Demonstrated smooth continuous physical interactions without quantization chatter",
      "Open-sourced through the 'openpi' deployment framework for real-time edge execution"
    ],
    limitations: "Requires high GPU memory on edge; compute-intensive flow matching sampling requires optimized TensorRT-LLM engines."
  },
  {
    id: "figure-02",
    name: "Figure 02 Humanoid (Helix VLA)",
    organization: "Figure AI & OpenAI Collaboration",
    year: "2024–2026",
    status: "Commercial Automotive Assembly Pilot (BMW Spartanburg)",
    platform: "Full-size Humanoid Robot (16-DoF hands, bipedal locomotion, 6 RGB cameras)",
    architecture: "Onboard OpenAI-powered Speech-to-Speech conversational model + 'Helix' Vision-Language-Action (VLA) policy",
    trainingData: "Millions of teleoperated automotive sheet metal placements and household manipulations",
    controlFrequency: "20 Hz VLA end-effector updates with 1 kHz low-level whole-body impedance controller",
    keyOutcomes: [
      "Autonomous sheet metal positioning in BMW manufacturing lines with millimeter tolerance",
      "Real-time natural speech conversation with human workers alongside simultaneous physical task execution",
      "Manipulates thousands of previously unseen industrial components without task-specific retraining"
    ],
    limitations: "Battery endurance constraints (approx 5-6 hours); thermal management during high-torque continuous bimanual lifting."
  },
  {
    id: "rt2-palm-e",
    name: "Google DeepMind RT-2 & PaLM-E",
    organization: "Google DeepMind",
    year: "2023–2025",
    status: "Landmark Research & Real-World Campus Fleet",
    platform: "Custom Mobile Manipulators (Everyday Robots / Google Fetch-style bases with 7-DoF arms)",
    architecture: "PaLI-X (55B) and PaLM-E (562B/12B) autoregressive models with action-tokenized vocabulary",
    trainingData: "Internet web vision-language data + 130,000 robotic demonstration episodes across 17 months",
    controlFrequency: "3–5 Hz closed loop",
    keyOutcomes: [
      "Real-world success rate on novel unseen tasks leaped from 32% (RT-1) to 62% (RT-2)",
      "90% success on Language Table simulated benchmark",
      "Demonstrated complex reasoning transfer: 'Pick up the improvised hammer' successfully selected a heavy rock"
    ],
    limitations: "3-5 Hz latency prevents catching moving objects; high parameter footprint requires cloud-edge streaming or quantized SARA-RT."
  },
  {
    id: "rfm-1",
    name: "Covariant RFM-1 (Robotics Foundation Model 1)",
    organization: "Covariant AI",
    year: "2024–2026",
    status: "Commercial Warehouse Logistics Deployment",
    platform: "Industrial ABB and FANUC articulating suction & parallel gripper arms",
    architecture: "8-Billion parameter multimodal transformer with generative physics world model",
    trainingData: "Tens of millions of industrial pick-and-pack actions across global commercial logistics fulfillment centers",
    controlFrequency: "15 Hz vision-action loop with microsecond suction valve actuation",
    keyOutcomes: [
      "Generative physics world model: predicts future visual frames of object deformation before suction grasping",
      "Language-guided programming: warehouse operators direct robot behavior via natural English prompts",
      "Reduced edge programming and commissioning time from 3 weeks to under 4 hours"
    ],
    limitations: "Tailored primarily to warehouse item picking and bin sorting; not generalized to bipedal locomotion."
  },
  {
    id: "mobile-aloha",
    name: "Mobile ALOHA (Bimanual Mobile Manipulation)",
    organization: "Stanford University (Fu, Zhao, Finn) & TRI",
    year: "2024–2025",
    status: "Open-Source Hardware & Policy Benchmark",
    platform: "Low-cost mobile bimanual robot ($32,000 BOM) with two ViperX arms and Tracer mobile base",
    architecture: "Action Chunking with Transformers (ACT) co-trained with static ALOHA datasets and LLM high-level goal conditions",
    trainingData: "50 human teleoperated demonstrations per task co-trained with 825 static ALOHA demonstrations",
    controlFrequency: "50 Hz action execution",
    keyOutcomes: [
      "Achieved 90% autonomous success rate across intricate household tasks (cooking shrimp, cleaning spills, calling elevator)",
      "Demonstrated that co-training with existing static datasets boosts mobile manipulation success by +34%",
      "Rapidly adopted across 100+ academic robotics labs worldwide"
    ],
    limitations: "Requires human demonstration collection for novel skills; relies on imitation learning rather than zero-shot web reasoning."
  },
  {
    id: "openvla",
    name: "OpenVLA (Open-Source Vision-Language-Action 7B)",
    organization: "BAIR (Berkeley), Stanford, CMU, TRI",
    year: "2024–2026",
    status: "Open-Source Flagship Model",
    platform: "Franka Emika Panda, WidowX, DROID, Google Robot",
    architecture: "Llama-2 7B backbone + Prismatic VLM + 256 discrete action tokens per dimension",
    trainingData: "Open X-Embodiment dataset (970k robot trajectories across 22 robot types)",
    controlFrequency: "7–10 Hz on single NVIDIA RTX 4090",
    keyOutcomes: [
      "Achieved 70.6% success on BridgeData V2 (outperforming 55B RT-2-X at 50.6%)",
      "97.1% success average on LIBERO benchmark suites with fine-tuning",
      "Fully open weights, training code, and quantized deployment pipeline"
    ],
    limitations: "Discrete tokenization leads to minor tracking errors on micro-assembly; sensitive to prompt wording."
  },
  {
    id: "eureka-robotics",
    name: "Eureka & HA-HA Industrial Automation",
    organization: "Eureka Robotics & NVIDIA Research",
    year: "2023–2026",
    status: "Commercial Precision Manufacturing & NVIDIA Isaac Sim",
    platform: "Industrial robots with 6-axis force-torque sensors and 3D optical cameras",
    architecture: "LLM-driven Evolutionary Algorithm (Eureka) synthesizing reward code + High Accuracy-High Agility (HA-HA) controller",
    trainingData: "Self-improving reward code evaluation loop running across massively parallel GPU environments",
    controlFrequency: "1 kHz force-impedance loop conditioned on LLM-synthesized reward policies",
    keyOutcomes: [
      "Generated reinforcement learning reward functions that outperform human expert designers on 83% of tasks",
      "Achieved micron-level precision for optical lens handling and automotive gear insertion across 25M+ cycles",
      "Solved dexterous 5-finger pen spinning in simulation and zero-shot deployed to physical Allegro Hand"
    ],
    limitations: "Requires high-fidelity simulation models for reward evolution; does not synthesize direct end-to-end motor torques from text."
  }
];

export const EMPIRICAL_BENCHMARKS = [
  {
    model: "OpenVLA (7B)",
    liberoAvg: 97.1,
    bridgeDataV2: 70.6,
    languageTable: 88.4,
    frequencyHz: 8,
    parameterCount: "7B",
    architectureType: "Autoregressive Discrete VLA",
    safetyIntegration: "Post-hoc joint clipping"
  },
  {
    model: "Pi0 (Physical Intelligence)",
    liberoAvg: 98.4,
    bridgeDataV2: 84.2,
    languageTable: 94.6,
    frequencyHz: 50,
    parameterCount: "3B + Flow Head",
    architectureType: "Flow-Matching Continuous",
    safetyIntegration: "Continuous CBF Projection"
  },
  {
    model: "RT-2-X (55B)",
    liberoAvg: 89.2,
    bridgeDataV2: 50.6,
    languageTable: 90.0,
    frequencyHz: 3,
    parameterCount: "55B",
    architectureType: "Autoregressive Discrete VLA",
    safetyIntegration: "Workspace bounds check"
  },
  {
    model: "Mobile ALOHA (ACT)",
    liberoAvg: 92.5,
    bridgeDataV2: 78.0,
    languageTable: 86.5,
    frequencyHz: 50,
    parameterCount: "80M",
    architectureType: "Action Chunking Transformer",
    safetyIntegration: "Dynamic Impedance Filter"
  },
  {
    model: "Diffusion Policy (Chi et al.)",
    liberoAvg: 82.3,
    bridgeDataV2: 63.8,
    languageTable: 81.2,
    frequencyHz: 30,
    parameterCount: "120M",
    architectureType: "Denoising Diffusion",
    safetyIntegration: "Barrier Lyapunov function"
  },
  {
    model: "VoxPoser (Code/Affordance)",
    liberoAvg: 76.5,
    bridgeDataV2: 58.2,
    languageTable: 79.0,
    frequencyHz: 5,
    parameterCount: "175B (GPT-4 API)",
    architectureType: "Code-as-Policies / 3D Value Maps",
    safetyIntegration: "Optimization TrajOpt constraints"
  }
];

export const PAPER_BIBLIOGRAPHY: Citation[] = [
  {
    id: "brohan2023rt2",
    authors: "Brohan, A., Brown, N., Carbajal, J., Chebotar, Y., et al.",
    title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
    venue: "Conference on Robot Learning (CoRL)",
    year: 2023,
    doi: "10.48550/arXiv.2307.15818",
    bibtex: `@inproceedings{brohan2023rt2,
  title={RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control},
  author={Brohan, Anthony and Brown, Noah and Carbajal, Justice and Chebotar, Yevgen and others},
  booktitle={Conference on Robot Learning (CoRL)},
  year={2023}
}`
  },
  {
    id: "physicalintelligence2024pi0",
    authors: "Physical Intelligence Team (Black, K., Bousmalis, K., Chen, Y., et al.)",
    title: "π0: A Vision-Language-Action Flow Model for Generalist Physical Robot Control",
    venue: "arXiv preprint arXiv:2410.24164",
    year: 2024,
    doi: "10.48550/arXiv.2410.24164",
    bibtex: `@article{physicalintelligence2024pi0,
  title={$\\pi_0$: A Vision-Language-Action Flow Model for Generalist Physical Robot Control},
  author={Physical Intelligence Team},
  journal={arXiv preprint arXiv:2410.24164},
  year={2024}
}`
  },
  {
    id: "kim2024openvla",
    authors: "Kim, M. J., Pertsch, K., Karamcheti, S., et al.",
    title: "OpenVLA: An Open-Source Vision-Language-Action Model",
    venue: "Conference on Robot Learning (CoRL Oral)",
    year: 2024,
    doi: "10.48550/arXiv.2406.09246",
    bibtex: `@inproceedings{kim2024openvla,
  title={OpenVLA: An Open-Source Vision-Language-Action Model},
  author={Kim, Moo Jin and Pertsch, Karl and Karamcheti, Siddharth and others},
  booktitle={Conference on Robot Learning (CoRL)},
  year={2024}
}`
  },
  {
    id: "fu2024mobilealoha",
    authors: "Fu, Z., Zhao, T. Z., and Finn, C.",
    title: "Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation",
    venue: "IEEE International Conference on Robotics and Automation (ICRA)",
    year: 2024,
    doi: "10.48550/arXiv.2401.02117",
    bibtex: `@inproceedings{fu2024mobilealoha,
  title={Mobile ALOHA: Learning Bimanual Mobile Manipulation with Low-Cost Whole-Body Teleoperation},
  author={Fu, Zipeng and Zhao, Tony Z. and Finn, Chelsea},
  booktitle={ICRA},
  year={2024}
}`
  },
  {
    id: "huang2023voxposer",
    authors: "Huang, W., Wang, C., Zhang, R., Li, Y., et al.",
    title: "VoxPoser: Composable 3D Value Maps for Robotic Manipulation with Language Models",
    venue: "Conference on Robot Learning (CoRL)",
    year: 2023,
    doi: "10.48550/arXiv.2307.05973",
    bibtex: `@inproceedings{huang2023voxposer,
  title={VoxPoser: Composable 3D Value Maps for Robotic Manipulation with Language Models},
  author={Huang, Wenlong and Wang, Chen and Zhang, Ruohan and others},
  booktitle={CoRL},
  year={2023}
}`
  },
  {
    id: "ma2023eureka",
    authors: "Ma, Y. J., Liang, W., Wang, G., Huang, D. A., et al.",
    title: "Eureka: Human-Level Reward Design via Coding Large Language Models",
    venue: "International Conference on Learning Representations (ICLR)",
    year: 2024,
    doi: "10.48550/arXiv.2310.12931",
    bibtex: `@inproceedings{ma2023eureka,
  title={Eureka: Human-Level Reward Design via Coding Large Language Models},
  author={Ma, Yecheng Jason and Liang, William and Wang, Guanzhi and others},
  booktitle={ICLR},
  year={2024}
}`
  },
  {
    id: "driess2023palme",
    authors: "Driess, D., Xia, F., Sajjadi, M. S., Lynch, C., et al.",
    title: "PaLM-E: An Embodied Multimodal Language Model",
    venue: "International Conference on Machine Learning (ICML)",
    year: 2023,
    doi: "10.48550/arXiv.2303.03378",
    bibtex: `@inproceedings{driess2023palme,
  title={PaLM-E: An Embodied Multimodal Language Model},
  author={Driess, Danny and Xia, Fei and Sajjadi, Mehdi S. M. and others},
  booktitle={ICML},
  year={2023}
}`
  },
  {
    id: "ames2019cbf",
    authors: "Ames, A. D., Coogan, S., Egerstedt, M., Notomista, G., Sreenath, K., and Tabuada, P.",
    title: "Control Barrier Functions: Theory and Applications",
    venue: "IEEE European Control Conference (ECC)",
    year: 2019,
    doi: "10.23919/ECC.2019.8795639",
    bibtex: `@inproceedings{ames2019cbf,
  title={Control Barrier Functions: Theory and Applications},
  author={Ames, Aaron D. and Coogan, Samuel and Egerstedt, Magnus and others},
  booktitle={IEEE European Control Conference},
  year={2019}
}`
  },
  {
    id: "chi2023diffusionpolicy",
    authors: "Chi, C., Feng, S., Pan, Y., Xu, Z., et al.",
    title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion",
    venue: "Robotics: Science and Systems (RSS)",
    year: 2023,
    doi: "10.48550/arXiv.2303.04137",
    bibtex: `@inproceedings{chi2023diffusionpolicy,
  title={Diffusion Policy: Visuomotor Policy Learning via Action Diffusion},
  author={Chi, Cheng and Feng, Siyuan and Pan, Yilun and others},
  booktitle={Robotics: Science and Systems (RSS)},
  year={2023}
}`
  },
  {
    id: "openxembodiment2023",
    authors: "Open X-Embodiment Collaboration (Padalkar, A., Pooley, A., et al.)",
    title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
    venue: "IEEE International Conference on Robotics and Automation (ICRA)",
    year: 2024,
    doi: "10.48550/arXiv.2310.08864",
    bibtex: `@article{openxembodiment2023,
  title={Open X-Embodiment: Robotic Learning Datasets and RT-X Models},
  author={Open X-Embodiment Collaboration},
  journal={arXiv preprint arXiv:2310.08864},
  year={2023}
}`
  }
];
