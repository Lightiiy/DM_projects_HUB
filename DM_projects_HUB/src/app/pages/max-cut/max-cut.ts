import { Component } from '@angular/core';
import { GraphCanvas } from '../../components/graph-canvas/graph-canvas';

@Component({
  selector: 'dm-max-cut',
  imports: [GraphCanvas],
  templateUrl: './max-cut.html',
  styleUrl: './max-cut.scss',
})
export class MaxCut {
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
}
