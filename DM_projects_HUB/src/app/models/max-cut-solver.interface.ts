import { VisualEdge, VisualNode } from "./graph-components.interface";

export interface MaxCutSolver {
  name: string;
  solve(nodes: VisualNode[], edges: VisualEdge[]): { 
    partitions: Map<string, 'A' | 'B'>, 
    finalWeight: number 
  };
}