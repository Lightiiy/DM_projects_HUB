import { Injectable } from '@angular/core';
import { VisualNode } from '../../../models/graph-components.interface';
import { Coordinates2D } from '../../../models/coordinates.interface';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {

  isPointInPolygon(node: VisualNode, polygon: Coordinates2D[]): boolean {
    let isInside = false;
  
    const minX = Math.min(...polygon.map(p => p.x));
    const maxX = Math.max(...polygon.map(p => p.x));
    const minY = Math.min(...polygon.map(p => p.y));
    const maxY = Math.max(...polygon.map(p => p.y));

    if (node.x < minX || node.x > maxX || node.y < minY || node.y > maxY) return false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect = ((yi > node.y) !== (yj > node.y)) && (node.x < (xj - xi) * (node.y - yi) / (yj - yi) + xi);
      if (intersect) isInside = !isInside;
    
    }
    return isInside;
  }
}
