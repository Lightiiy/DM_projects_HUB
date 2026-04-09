import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { MaxCutService } from '../../pages/max-cut/services/max-cut-service';
import { Graph } from '../../models/graph-components.interface';
import { SolverMethod } from '../../models/solving-method.type';

@Component({
  selector: 'dm-solver-controls',
  imports: [],
  templateUrl: './solver-controls.html',
  styleUrl: './solver-controls.scss',
})
export class SolverControls {
  private solverService = inject(MaxCutService);

  @Output() solveApplied = new EventEmitter<Graph>();

  graph = input.required<Graph>();

  runSolver(method: SolverMethod){
    const currentGraph = this.graph();
    let result: Map<string, 'A' | 'B'>;

    switch(method) {
      case 'Greedy':
        result = this.solverService.solveGreedy(currentGraph);
        break;
        case 'Kernighan-Lin':
          console.log('thouse not implemented that yet');
          break;
          default:
            const _exhaustiveCheck: never = method;
            throw new Error(`Unhandled solver method: ${_exhaustiveCheck}`);
          }

    const updatedGraph: Graph = {
      ...currentGraph,
      nodes: currentGraph.nodes.map(node => ({
        ...node,
        partition: result.get(node.id) ?? 'A'
      }))
    };


    this.solveApplied.emit(updatedGraph);
  }

}
