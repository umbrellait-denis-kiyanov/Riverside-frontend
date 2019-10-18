import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appChartLabelTooltips]'
})
export class ChartLabelTooltipsDirective {

  constructor(private el: ElementRef) {
  }

  @Input() appChartLabelTooltips: string[];

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.querySelectorAll('[ngx-charts-x-axis-ticks] g.tick title:not(:empty)')
      .forEach((title, idx) => title.innerHTML = this.appChartLabelTooltips[idx + 1]);
  }
}
