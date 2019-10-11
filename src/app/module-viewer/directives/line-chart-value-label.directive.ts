import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appLineChartValueLabels]'
})
export class LineChartValueLabelDirective {

  @Input() results: any;

  constructor(private el: ElementRef) {
    const waitForData = setInterval(_ => {
      if (this.el.nativeElement.querySelector('g.line-series path')) {
        clearInterval(waitForData);

        setTimeout(_ => this.updateLabels(), 200);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    setTimeout(_ => this.updateLabels(), 500);
  }

  private updateLabels() {
    this.el.nativeElement.querySelectorAll('.datapoint-value').forEach(el => el.remove());
    const series = this.el.nativeElement.querySelectorAll('g.line-series path');
    series.forEach((el, idx) => {
      if (!this.results[idx].name) {
        return;
      }
      const points = el.getAttribute('d').substr(1).split('L');
      points.forEach((point, pIdx) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        g.appendChild(text);
        g.setAttribute('transform', 'translate(' + point + ')');
        g.setAttribute('class', 'datapoint-value');

        text.innerHTML = this.results[idx].series[pIdx].value.toString();
        text.setAttribute('stroke-width', '1');
        text.setAttribute('text-anchor', 'start');
        text.setAttribute('x', '5');
        text.setAttribute('y', '5');
        text.setAttribute('style', 'font-size: 12px; fill: #999;');

        el.parentNode.appendChild(g);
      });
    });
  }

}
