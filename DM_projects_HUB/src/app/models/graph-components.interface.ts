interface VisualNode {
  id: string;
  x: number;
  y: number;
}

interface VisualEdge {
  sourceId: string;
  targetId: string;
  weight: number;
}

interface Graph {
  nodes: VisualNode[];
  edges: VisualEdge[];
}
