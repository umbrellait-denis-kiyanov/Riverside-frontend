import {
  Directive,
  Input,
  Output,
  ElementRef,
  HostListener,
  EventEmitter,
  Renderer2,
  OnInit,
  AfterViewInit
} from "@angular/core";

@Directive({
  selector: "[e3-scroll-spy]"
})
export class E3ScrollSpyDirective implements AfterViewInit {
  @Input() public spiedClassNames = [];
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection: string;
  private sections = [];

  constructor(private _el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (!this._el.nativeElement.childElementCount) {
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const section = this.sections.find(s => entry.target.id === s.id);
          if (section) {
            section.isVisible = entry.isIntersecting === true;
          }
        }
        const currentSection = this.sections.find(s => s.isVisible);

        if (currentSection && currentSection.id !== this.currentSection) {
          this.currentSection = currentSection.id;
          this.sectionChange.emit(this.currentSection);
        }
      },
      { threshold: [0.5] }
    );
    Array.from(this._el.nativeElement.children).forEach((element: Element) => {
      observer.observe(element);
      this.sections.push({
        id: element.id,
        isVisible: false
      });
    });
  }
}
