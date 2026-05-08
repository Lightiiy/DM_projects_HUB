import { Directive, ElementRef, EventEmitter, HostListener, inject, OnInit, Output, Renderer2 } from '@angular/core';
import { BehaviorSubject, count, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Directive({
  selector: '[fileDragDirective]',
  standalone: true
})
export class FileDragDirective implements OnInit {
  private counterSubject = new BehaviorSubject<number>(0);
  
  private overlay!: HTMLElement;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Output() fileDropped = new EventEmitter<File>()

  @Output() dragActive = this.counterSubject.asObservable().pipe(
    map(count => count > 0),
    distinctUntilChanged(),
    debounceTime(50)
  )

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    this.preventAndStopEvent(event);
    this.counterSubject.next(this.counterSubject.value + 1);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.preventAndStopEvent(event);
    this.counterSubject.next(this.counterSubject.value - 1);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    this.preventAndStopEvent(event);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    this.preventAndStopEvent(event);
    this.counterSubject.next(0);

    const files = event.dataTransfer?.files;
    if (files?.length)
    {
      this.fileDropped.emit(files[0]);
    }
  }

  ngOnInit(): void {
    this.createOverlay();

    this.counterSubject.subscribe(isVisible => {
      this.renderer.setStyle(this.overlay, 'display', isVisible ? 'flex' : 'none');
    })
  }

  private createOverlay() {
    this.overlay = this.renderer.createElement('div');

    Object.entries(this.stylesOfDragAndDrop).forEach(([prop, val]) => {
      this.renderer.setStyle(this.overlay, prop, val);
    })

    const text = this.renderer.createText('Drop File to Import');
    this.renderer.appendChild(this.overlay, text);

    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.appendChild(this.el.nativeElement, this.overlay);
  }

  private preventAndStopEvent(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }


  private stylesOfDragAndDrop = {
    'display': 'none',
      'position': 'absolute',
      'top': '0', 'left': '0',
      'width': '100%', 'height': '100%',
      'background': 'rgba(255, 255, 255, 0.2)',
      'backdrop-filter': 'blur(8px)',
      'z-index': '1000',
      'justify-content': 'center',
      'align-items': 'center',
      'pointer-events': 'none',
      'border': '2px dashed #666',
      'border-radius': 'inherit'
  }
}
