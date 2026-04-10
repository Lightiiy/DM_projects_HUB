import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { input } from '@angular/core';
import { DrawingService } from './services/drawing-service';
import { Coordinates2D } from '../../models/coordinates.interface';
import { Graph, VisualNode } from '../../models/graph-components.interface';

@Component({
  selector: 'dm-graph-canvas',
  imports: [],
  templateUrl: './graph-canvas.html',
  styleUrl: './graph-canvas.scss',
})
export class GraphCanvas {
  graph = input.required<Graph>();

  @Output() cutCompleted = new EventEmitter<VisualNode[]>();
  @Output() cutStarted = new EventEmitter<void>();

  private graphCanvas!: HTMLCanvasElement;
  private graphContext!: CanvasRenderingContext2D;

  private drawingCanvas!: HTMLCanvasElement;
  private drawingContext!: CanvasRenderingContext2D;

  drawingService = inject(DrawingService);

  private isDrawing = false;
  private lassoPoints: Coordinates2D[] = [];

  @ViewChild('graphCanvas') set graphHandle(ref: ElementRef<HTMLCanvasElement>) {
    if (ref) {
      this.graphCanvas = ref.nativeElement;
      this.graphContext = this.graphCanvas.getContext('2d')!;
      this.trySync();
    }
  }

  @ViewChild('drawingCanvas') set drawingHandle(ref: ElementRef<HTMLCanvasElement>) {
    if (ref) {
      this.drawingCanvas = ref.nativeElement;
      this.drawingContext = this.drawingCanvas.getContext('2d')!;
      this.trySync();
    }
  }

  constructor() {
    effect(() => {
      const data = this.graph();
      if (this.graphCanvas && data) {
        this.drawGraph();
        this.lassoPoints = [];
        this.isDrawing = false;
        this.drawingContext.clearRect(0,0, this.drawingCanvas.width, this.drawingCanvas.height);
      }
    });
  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.lassoPoints = [];

    this.drawingContext.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);

    const pointer = this.getMousePosition(event);
    this.lassoPoints.push(pointer);

    this.drawingContext.beginPath();
    this.drawingContext.moveTo(pointer.x, pointer.y);
    this.drawingContext.strokeStyle = '#e7a880';
    this.drawingContext.lineWidth = 2;
    this.drawingContext.setLineDash([5, 5]);
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return;

    const pointer = this.getMousePosition(event);
    this.lassoPoints.push(pointer);

    this.drawingContext.lineTo(pointer.x, pointer.y);
    this.drawingContext.stroke();
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    if (this.lassoPoints.length > 2) {
      this.drawingContext.lineTo(this.lassoPoints[0].x, this.lassoPoints[0].y);
      this.drawingContext.stroke();
      this.drawingContext.closePath();
    }

    const nodesInside = this.graph().nodes.filter((node) =>
      this.drawingService.isPointInPolygon(node, this.lassoPoints),
    );

    if (nodesInside.length === 0) {
      return;
    }

    this.cutCompleted.emit(nodesInside);
  }

  private drawGraph() {
    const data = this.graph();

    this.graphCanvas.width = this.graphCanvas.offsetWidth;
    this.graphCanvas.height = this.graphCanvas.offsetHeight;

    this.graphContext.clearRect(0, 0, this.graphCanvas.width, this.graphCanvas.height);

    this.graphContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.graphContext.lineWidth = 2;

    data.edges.forEach((edge) => {
      const src = data.nodes.find((n) => n.id === edge.sourceId);
      const dest = data.nodes.find((n) => n.id === edge.targetId);

      if (src && dest) {

        const isCutEdge = (src.partition ?? 'A') !== (dest.partition ?? 'A');

        this.graphContext.beginPath();
        if(isCutEdge) {
          this.graphContext.strokeStyle = '#fcd2a0'; 
          this.graphContext.lineWidth = 3;           
          this.graphContext.setLineDash([]);        
        } else {
          this.graphContext.strokeStyle = '#444444';
          this.graphContext.lineWidth = 1;           
          this.graphContext.setLineDash([5, 5]);    
        }

        this.graphContext.moveTo(src.x, src.y);
        this.graphContext.lineTo(dest.x, dest.y);
        this.graphContext.stroke();

        this.graphContext.setLineDash([]);

        const midX = (src.x + dest.x) / 2;
        const midY = (src.y + dest.y) / 2;

        this.graphContext.fillStyle = isCutEdge ? '#e7a880' : '#CCCCCC';
        this.graphContext.font = '12px Montserrat';
        this.graphContext.fillText(edge.weight.toString(), midX - 10, midY - 10);
      }
    });

    data.nodes.forEach((node) => {
      this.graphContext.shadowBlur = 10;
      this.graphContext.shadowColor = 'rgba(176,33,9,0.5)';

      if (node.partition === 'B') {
        this.graphContext.fillStyle = '#fcd2a0';
        this.graphContext.strokeStyle = '#00838f';
      } else {
        this.graphContext.fillStyle = '#b02109';
        this.graphContext.strokeStyle = '#7f1706';
      }

      this.graphContext.beginPath();
      this.graphContext.arc(node.x, node.y, 20, 0, Math.PI * 2);
      this.graphContext.fill();

      this.graphContext.shadowBlur = 0;

      this.graphContext.fillStyle = 'white';
      this.graphContext.font = 'bold 14px Monserrat';
      this.graphContext.textAlign = 'center';
      this.graphContext.fillText(node.id, node.x, node.y + 5);
    });
  }

  private trySync() {
    if (this.graphCanvas && this.drawingCanvas) {
      const width = this.graphCanvas.offsetWidth;
      const height = this.graphCanvas.offsetHeight;

      [this.graphCanvas, this.drawingCanvas].forEach((c) => {
        c.width = width;
        c.height = height;
      });

      this.drawGraph();
    }
  }

  private getMousePosition(event: MouseEvent) {
    const rect = this.drawingCanvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
