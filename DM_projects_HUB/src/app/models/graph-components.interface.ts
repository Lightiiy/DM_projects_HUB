export interface VisualNode {
  id: string;
  x: number;
  y: number;
  partition?: 'A' | 'B';
}

export interface VisualEdge {
  sourceId: string;
  targetId: string;
  weight: number;
}

export interface Graph {
  nodes: VisualNode[];
  edges: VisualEdge[];
}
