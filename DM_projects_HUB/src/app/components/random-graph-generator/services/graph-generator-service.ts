import { Injectable } from '@angular/core';
import { Graph, VisualEdge, VisualNode } from '../../../models/graph-components.interface';

@Injectable({
  providedIn: 'root',
})
export class GraphGeneratorService {
  generateErdosRenyi(nodeCount: number, density: number, maxWeight: number): Graph {
    const nodes: VisualNode[] = [];
    const edges: VisualEdge[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: `n${i}`,
        x: Math.random() * 600 + 50,
        y: Math.random() * 400 + 50,
        partition: 'A'
      });
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < density) {
          edges.push({
            sourceId: nodes[i].id,
            targetId: nodes[j].id,
            weight: Math.floor(Math.random() * maxWeight) + 1
          });
        }
      }
    }

    return { nodes, edges };
  }
}

