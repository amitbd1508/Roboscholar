#!/usr/bin/env python3
"""
Real-Time Control Barrier Function (CBF-QP) Safety Filter for Robot Control
Ensures forward-invariance over stochastic LLM / VLA action tokens.
"""

import numpy as np

class ControlBarrierSafetyFilter:
    def __init__(self, r_safe=0.08, gamma=2.0, u_bounds=(-0.5, 0.5)):
        """
        r_safe: Minimum clearance radius around obstacles (meters)
        gamma: Extended class-K barrier coefficient
        u_bounds: Maximum actuator velocity (m/s)
        """
        self.r_safe = r_safe
        self.gamma = gamma
        self.u_min, self.u_max = u_bounds

    def compute_barrier(self, x, x_obs):
        """h(x) = ||x - x_obs||^2 - r_safe^2"""
        dist_sq = np.sum((x - x_obs) ** 2)
        return dist_sq - (self.r_safe ** 2)

    def filter_action(self, x, u_llm, x_obs):
        """
        Projects nominal LLM action u_llm onto safe set:
        min 0.5 ||u - u_llm||^2
        s.t. ∇h^T * u + gamma * h(x) >= 0
        """
        h_val = self.compute_barrier(x, x_obs)
        grad_h = 2 * (x - x_obs) # ∇h

        # Barrier constraint: grad_h^T * u >= -gamma * h(x)
        b_cbf = -self.gamma * h_val
        current_flow = np.dot(grad_h, u_llm)

        if current_flow >= b_cbf:
            # Nominal action satisfies barrier condition
            u_safe = np.clip(u_llm, self.u_min, self.u_max)
            active = False
        else:
            # Quadratic program analytical projection
            grad_norm_sq = np.sum(grad_h ** 2)
            if grad_norm_sq < 1e-8:
                u_safe = u_llm
                active = False
            else:
                lambda_qp = (b_cbf - current_flow) / grad_norm_sq
                u_safe = u_llm + lambda_qp * grad_h
                u_safe = np.clip(u_safe, self.u_min, self.u_max)
                active = True

        return u_safe, h_val, active

if __name__ == "__main__":
    print("=== Control Barrier Function (CBF-QP) Test ===")
    cbf = ControlBarrierSafetyFilter(r_safe=0.10)
    
    # Robot at (0.15, 0), obstacle at (0.0, 0)
    x = np.array([0.15, 0.0])
    x_obs = np.array([0.0, 0.0])
    
    # Stochastic LLM commands collision path towards obstacle
    u_llm = np.array([-0.3, 0.0])
    
    u_safe, h, intervened = cbf.filter_action(x, u_llm, x_obs)
    print(f"Current State x: {x}")
    print(f"Obstacle Pos x_obs: {x_obs}")
    print(f"Barrier Value h(x): {h:.4f}")
    print(f"Nominal LLM Command: {u_llm}")
    print(f"Safety Filter Intervened: {intervened}")
    print(f"Safe Projected Command u*: {u_safe}")
