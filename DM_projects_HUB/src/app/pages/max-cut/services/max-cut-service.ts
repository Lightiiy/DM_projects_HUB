import { Injectable } from '@angular/core';
import { Graph, VisualEdge, VisualNode } from '../../../models/graph-components.interface';

@Injectable({
  providedIn: 'root',
})
export class MaxCutService {
  calculateWeight(nodes: VisualNode[], edges: VisualEdge[])
  {
    console.log('thouse began calculating cut weightage');
    const partitionMap = new Map(nodes.map(n => [n.id, n.partition]));

    let totalWeight = 0;

    const cutEdges = edges.filter( edge => {
      const sourcePartition = partitionMap.get(edge.sourceId);
      const targetPartition = partitionMap.get(edge.targetId);

      const isEdgeCrossingCut = sourcePartition !== undefined && targetPartition !== undefined && sourcePartition !== targetPartition;

      if(isEdgeCrossingCut) {
        totalWeight += edge.weight;
      }

      return isEdgeCrossingCut;
    });
      console.log(totalWeight);
      return totalWeight;
  }

  solveGreedy(graph: Graph): Map<string, 'A' | 'B'> {
    const partitions = new Map<string, 'A' | 'B'>();
    graph.nodes.forEach(n => partitions.set(n.id, n.partition ?? 'A'));

    let improved = true;
    while(improved) {
      improved = false;

      for (const node of graph.nodes) {
        const currentScore = this.calculateNodeContribution(node.id, partitions.get(node.id)!, graph.edges, partitions);
        const flippedScore = this.calculateNodeContribution(node.id, partitions.get(node.id) === 'A' ? 'B' : 'A', graph.edges, partitions);
      
        if (flippedScore > currentScore) {
          partitions.set(node.id, partitions.get(node.id) === 'A' ? 'B' : 'A');
          improved = true;
        }
      }
    }
    console.log(partitions);
    return partitions;
  }

  private calculateNodeContribution(nodeId: string, part: 'A' | 'B', edges: VisualEdge[], partitions: Map<string, 'A' | 'B'>): number {
    return edges.filter(e => e.sourceId === nodeId || e.targetId === nodeId).reduce((sum, e) => {
      const otherId = e.sourceId === nodeId ? e.targetId : e.sourceId;
      return partitions.get(otherId) !== part ? sum + e.weight : sum;
    }, 0)
  }
}
