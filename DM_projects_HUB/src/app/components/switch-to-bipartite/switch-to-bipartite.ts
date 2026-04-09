import { Component, effect, EventEmitter, input, Output, signal } from '@angular/core';
import { Graph, VisualNode } from '../../models/graph-components.interface';
import { Coordinates2D } from '../../models/coordinates.interface';

@Component({
  selector: 'dm-switch-to-bipartite',
  imports: [],
  templateUrl: './switch-to-bipartite.html',
  styleUrl: './switch-to-bipartite.scss',
})
export class SwitchToBipartite {

  graph = input.required<Graph>();
  @Output() graphUpdated = new EventEmitter<Graph>();

  private nodePositionSnapshot: Map<string, Coordinates2D> = new Map();
  public isBipartiteMode = signal(false);


toggleLayout(event: any) {
    const active = event.target.checked;
    this.isBipartiteMode.set(active);

    if (!this.graph) return;

    let updatedNodes: VisualNode[];

    if (active) {
      this.nodePositionSnapshot.clear();
      this.graph().nodes.forEach(n => {
        this.nodePositionSnapshot.set(n.id, { x: n.x, y: n.y });
      });

      updatedNodes = this.transformToBipartite(this.graph().nodes);
    } else {
      updatedNodes = this.graph().nodes.map(node => {
        const original = this.nodePositionSnapshot.get(node.id);
        return original ? { ...node, x: original.x, y: original.y } : node;
      });
    }

    this.graphUpdated.emit({ 
      ...this.graph(), 
      nodes: updatedNodes 
    });
  }
private transformToBipartite(nodes: VisualNode[]): VisualNode[] {
    const nodesA = nodes.filter(n => (n.partition ?? 'A') === 'A');
    const nodesB = nodes.filter(n => n.partition === 'B');

    return nodes.map(node => {
      const isA = (node.partition ?? 'A') === 'A';
      const subset = isA ? nodesA : nodesB;
      const index = subset.findIndex(n => n.id === node.id);

      return {
        ...node,
        x: isA ? 150 : 650,
        y: (500 / (subset.length + 1)) * (index + 1)
      };
    });
  }
}

