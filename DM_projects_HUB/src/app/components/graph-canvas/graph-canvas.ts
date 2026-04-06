import {
  afterNextRender,
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { input } from '@angular/core';

@Component({
  selector: 'dm-graph-canvas',
  imports: [],
  templateUrl: './graph-canvas.html',
  styleUrl: './graph-canvas.scss',
})
export class GraphCanvas implements AfterViewInit {
  graph = input.required<Graph>();
  @ViewChild('graphCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.drawGraph();
  }

  private drawGraph() {
    const canvas = this.canvas.nativeElement;
    if (!canvas) return;
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    console.log('Canvas Size:', canvas.width, canvas.height);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.strokeStyle = '#ffffff';
    canvasContext.lineWidth = 2;
    this.graph().edges.forEach((edge) => {
      const src = this.graph().nodes.find((n) => n.id === edge.sourceId);
      const dest = this.graph().nodes.find((n) => n.id === edge.targetId);
      if (src && dest) {
        canvasContext.beginPath();
        canvasContext.moveTo(src.x, src.y);
        canvasContext.lineTo(dest.x, dest.y);
        canvasContext.stroke();
      }
    });

    // 2. Draw Nodes
    this.graph().nodes.forEach((node) => {
      canvasContext.fillStyle = '#b02109'; // PWr Red
      canvasContext.beginPath();
      canvasContext.arc(node.x, node.y, 20, 0, Math.PI * 2);
      canvasContext.fill();

      canvasContext.fillStyle = 'white';
      canvasContext.font = '14px Montserrat';
      canvasContext.textAlign = 'center';
      canvasContext.fillText(node.id, node.x, node.y + 5);
    });
  }
}
