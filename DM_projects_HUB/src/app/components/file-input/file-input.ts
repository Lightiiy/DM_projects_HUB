import { Component, EventEmitter, Output, signal } from '@angular/core';
import { partition } from 'rxjs';
import { Graph, VisualEdge, VisualNode } from '../../models/graph-components.interface';

@Component({
  selector: 'dm-file-input',
  imports: [],
  templateUrl: './file-input.html',
  styleUrl: './file-input.scss',
})
export class FileInput {
  @Output() fileLoaded = new EventEmitter<Graph>();

  isFileDragged = signal(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.readFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isFileDragged.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.readFile(file);
    }
  }

  onFileDraggedOver(event: DragEvent){
    event.preventDefault();
    this.isFileDragged.set(true);
  }

  private readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const graph = this.parseCustomGraph(content);
      this.fileLoaded.emit(graph);
    };
    reader.readAsText(file);
  }

  private parseCustomGraph(content: string): Graph {
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const nodes: VisualNode[] = [];
    const edges: VisualEdge[] = [];
    let currentSection: 'V' | 'E' | null = null;

    for (const line of lines) {
      if (line === 'V') {
        currentSection = 'V';
        continue;
      }
      if (line === 'E') {
        currentSection = 'E';
        continue;
      }

      if (currentSection === 'V') {
        const id = line.replace(/[()]/g, '');
        nodes.push({
          id,

          x: Math.random() * 500 + 50,
          y: Math.random() * 300 + 50,
          partition: 'A',
        });
      } else if (currentSection === 'E') {
        const parts = line.split('-');
        if (parts.length === 3) {
          edges.push({
            sourceId: parts[0].replace(/[()]/g, ''),
            targetId: parts[1].replace(/[()]/g, ''),
            weight: parseInt(parts[2], 10),
          });
        }
      }
    }

    return { nodes, edges };
  }
}
