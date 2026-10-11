#!/usr/bin/env python3
"""
256-Bin Discrete Action Tokenizer & Detokenizer for VLA Models (RT-2, OpenVLA style)
Maps continuous 7-DoF robot delta actions to integer vocabulary tokens.
"""

import numpy as np

class VLAActionTokenizer:
    def __init__(self, bins=256, action_dim=7, bounds=None):
        self.bins = bins
        self.action_dim = action_dim
        # Default bounds: delta_xyz [-0.05, 0.05]m, delta_rpy [-0.1, 0.1]rad, gripper [0, 1]
        if bounds is None:
            self.a_min = np.array([-0.05, -0.05, -0.05, -0.10, -0.10, -0.10, 0.0])
            self.a_max = np.array([+0.05, +0.05, +0.05, +0.10, +0.10, +0.10, 1.0])
        else:
            self.a_min = np.array(bounds[0])
            self.a_max = np.array(bounds[1])

    def tokenize(self, action: np.ndarray) -> np.ndarray:
        """Encodes continuous action vector in R^7 into discrete bin indices in [0, B-1]."""
        norm_a = (action - self.a_min) / (self.a_max - self.a_min + 1e-8)
        norm_a = np.clip(norm_a, 0.0, 1.0)
        token_ids = np.round(norm_a * (self.bins - 1)).astype(int)
        return token_ids

    def detokenize(self, token_ids: np.ndarray) -> np.ndarray:
        """Recovers continuous actions from discrete token indices."""
        token_ids = np.clip(token_ids, 0, self.bins - 1)
        norm_a = (token_ids + 0.5) / float(self.bins)
        continuous_action = self.a_min + norm_a * (self.a_max - self.a_min)
        return continuous_action

if __name__ == "__main__":
    print("=== VLA Action Tokenizer & Detokenizer Test ===")
    tokenizer = VLAActionTokenizer(bins=256)
    sample_action = np.array([0.024, -0.015, 0.008, 0.05, -0.02, 0.01, 1.0])
    
    tokens = tokenizer.tokenize(sample_action)
    print("Input continuous action:", sample_action)
    print("Encoded token IDs (256 bins):", tokens)
    
    reconstructed = tokenizer.detokenize(tokens)
    print("Reconstructed continuous action:", reconstructed)
    print("Quantization error RMS (m/rad):", np.sqrt(np.mean((sample_action - reconstructed)**2)))
