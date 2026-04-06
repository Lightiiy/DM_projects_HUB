import { Injectable } from '@angular/core';

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
}
