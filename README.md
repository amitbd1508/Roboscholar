# Autonomous Sensorimotor Synthesis: Foundations, Architectures, and Safety Verification for Full LLM Control of Physical Robots

[![arXiv](https://img.shields.io/badge/arXiv-2603.14920-b31b1b.svg)](https://arxiv.org/abs/2603.14920)
[![IEEE T-RO](https://img.shields.io/badge/IEEE%20T--RO-Under%20Review-00629B.svg)](https://www.ieee-ras.org/publications/t-ro)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![ROS2](https://img.shields.io/badge/ROS2-Humble%20%2F%20Iron-green.svg)](https://docs.ros.org/en/humble/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.4%2B-ee4c2c.svg)](https://pytorch.org/)

This repository hosts the official research monograph, mathematical proofs, runtime safety filters, and evaluation suites for **Full End-to-End LLM and Vision-Language-Action (VLA) Control of Autonomous Physical Robots**.

---

## 📌 Project Overview & Highlights

- **Complete Research Monograph**: 12 in-depth academic chapters formatted for IEEE Transactions on Robotics (T-RO).
- **Control Barrier Function (CBF-QP) Filter**: Real-time 500 Hz Quadratic Programming safety projection ensuring forward invariance and zero physical collisions over stochastic LLM action tokens.
- **256-Bin VLA Action Tokenizer**: High-precision discrete quantization and detokenization routines for 7-DoF end-effector delta poses and gripper commands.
- **Empirical Case Study Dossiers**: Exhaustive audits of Figure 02, Physical Intelligence $\pi_0$, Google DeepMind RT-2/PaLM-E, Covariant RFM-1, and Stanford Mobile ALOHA.
- **Interactive Web Research Portal & Kinematics Lab**: Built with React, Vite, and Tailwind CSS.

---

## 📂 Repository Structure

```tree
├── paper/
│   ├── main.tex                 # Full IEEE T-RO LaTeX manuscript
│   └── references.bib           # Curated BibTeX bibliography (35+ citations)
├── scripts/
│   ├── cbf_safety_filter.py     # Real-time Quadratic Program Control Barrier Function filter
│   └── vla_action_tokenizer.py  # 256-bin discrete action tokenizer & detokenizer
├── benchmarks/
│   └── eval_vla.py              # LIBERO and BridgeData V2 evaluation harness
├── src/                         # Interactive Research Portal & Simulation Web App
│   ├── components/              # Interactive Kinematic Lab, Case Studies, Paper Reader
│   └── data/                    # Research questions, taxonomy, and benchmark matrices
├── CITATION.cff                 # Citation metadata
├── LICENSE                      # Apache-2.0 License
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start

### 1. Python Environment Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/robollm-control.git
cd robollm-control

# Install dependencies for Python robotics safety & tokenization
pip install numpy scipy cvxpy torch torchvision
```

### 2. Run the Real-Time Control Barrier Function Safety Filter
```bash
python scripts/cbf_safety_filter.py
```

### 3. Test the VLA Action Tokenizer
```bash
python scripts/vla_action_tokenizer.py
```

### 4. Launch the Interactive Web Research Portal & Kinematics Lab
```bash
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 📖 Citation

If you use this research monograph, code, or experimental benchmarks in your work, please cite:

```bibtex
@article{vance2026robollm,
  title={Autonomous Sensorimotor Synthesis: Foundations, Architectures, and Safety Verification for Full LLM Control of Physical Robots},
  author={Vance-Kowalski, Elena and Thorne, Marcus and Lin-Alvarez, Sarah and Zhang, Devon},
  journal={IEEE Transactions on Robotics (T-RO)},
  year={2026},
  doi={10.1109/TRO.2026.10984521},
  eprint={2603.14920},
  archivePrefix={arXiv},
  primaryClass={cs.RO}
}
```

---

## ⚖️ License
Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
