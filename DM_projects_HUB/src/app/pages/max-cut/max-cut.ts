import { Component, computed, inject, signal } from '@angular/core';
import { GraphCanvas } from '../../components/graph-canvas/graph-canvas';
import { MaxCutService } from './services/max-cut-service';
import { FileInput } from '../../components/file-input/file-input';

@Component({
  selector: 'dm-max-cut',
  imports: [GraphCanvas, FileInput],
  templateUrl: './max-cut.html',
  styleUrl: './max-cut.scss',
})
export class MaxCut {

  maxCutService = inject(MaxCutService);

    graph: Graph = {
    nodes: [
      { id: 'a1', x: 100, y: 100 },
      { id: 'a2', x: 300, y: 100 },
      { id: 'a3', x: 200, y: 300 },
    ],
    edges: [
      { sourceId: 'a1', targetId: 'a2', weight: 10 },
      { sourceId: 'a2', targetId: 'a3', weight: 20 },
      { sourceId: 'a3', targetId: 'a1', weight: 30 },
    ],
  };

  graphSignal = signal<Graph>(this.graph);

  cutWeightSignal = computed<number>(() => {
    console.log("thoust be computing");
    const currentGraph = this.graphSignal();

    return this.maxCutService.calculateWeight(currentGraph.nodes, currentGraph.edges);
  })


  handleNewCut(nodesInsideLasso: VisualNode[]) {
    const currentGraph = this.graphSignal();
    
    const updatedNodes = currentGraph.nodes.map(node => ({
      ...node, 
      partition: (nodesInsideLasso.some(selected => selected.id === node.id)) ? 'B' : 'A' as 'B' | 'A'
    }));

    this.graphSignal.set({
      ...currentGraph,
      nodes: updatedNodes
    })

    console.log(nodesInsideLasso);
  }
}
