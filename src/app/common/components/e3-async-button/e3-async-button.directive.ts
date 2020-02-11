import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  OnChanges,
  SimpleChanges,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[e3-async-button]'
})
export class E3AsyncButtonDirective implements OnInit, OnChanges {
  @Input() running: boolean;
  loadingIcon: HTMLElement;
  overlay: HTMLElement;
  delay = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.running) {
      if (changes.running.currentValue) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  show() {
    this.create();
    this.renderer.setProperty(this.el.nativeElement, 'disabled', 'disabled');
    this.renderer.addClass(this.el.nativeElement, 'running');
    this.renderer.addClass(this.el.nativeElement, 'disabled');
    this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
  }

  hide() {
    this.renderer.removeClass(this.el.nativeElement, 'running');
    this.renderer.removeClass(this.el.nativeElement, 'disabled');
    this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
    this.el.nativeElement.disabled = false;
    window.setTimeout(() => {
      this.loadingIcon &&
        this.renderer.removeChild(this.el.nativeElement, this.loadingIcon);
      // this.renderer.removeChild(this.el.nativeElement, this.overlay);
      this.loadingIcon = null;
      this.overlay = null;
    }, Number(this.delay));
  }

  create() {
    // this.createOverlay();
    this.createLoadIcon();
    this.renderer.appendChild(this.el.nativeElement, this.loadingIcon);
    // this.renderer.appendChild(this.el.nativeElement, this.overlay);
  }

  createLoadIcon() {
    this.loadingIcon = this.renderer.createElement('span');
    this.renderer.addClass(this.loadingIcon, 'fa');
    this.renderer.addClass(this.loadingIcon, 'fa-spinner');
    this.renderer.addClass(this.loadingIcon, 'fa-pulse');
    this.renderer.setStyle(this.loadingIcon, 'margin-left', '5px');
  }
}
