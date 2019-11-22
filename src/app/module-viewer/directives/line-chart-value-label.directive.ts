import { Directive, ElementRef, Input, HostListener, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appLineChartValueLabels]'
})
export class LineChartValueLabelDirective implements OnDestroy {

  @Input() results: any;

  private changeSize = new BehaviorSubject(null);

  private windowSizeWatch: Subscription;

  constructor(private el: ElementRef) {
    this.el.nativeElement.removeAttribute('displayed');
    const waitForData = setInterval(_ => {
      if (this.el.nativeElement.querySelectorAll('g.line-series path').length === this.results.length) {
        clearInterval(waitForData);

        setTimeout(() => this.updateLabels(), 200);
      }
    });

    this.windowSizeWatch = this.changeSize.pipe(debounceTime(100))
      .subscribe((value) => {
        if (!value) {
          return;
        }
        this.el.nativeElement.removeAttribute('displayed');
        setTimeout(() => this.updateLabels(), 200);
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.changeSize.next(event);
  }

  ngOnDestroy() {
    this.windowSizeWatch.unsubscribe();
  }

  private updateLabels() {
    const map = [];
    const chartEl = this.el.nativeElement;
    chartEl.querySelectorAll('.datapoint-value').forEach(el => el.remove());
    const series = chartEl.querySelectorAll('g.line-series path');
    series.forEach((el, idx) => {
      if (!this.results[idx].name) {
        return;
      }

      const points = el.getAttribute('d').substr(1).split('L');
      const color = el.getAttribute('stroke');
      points.forEach((point, pIdx) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        g.appendChild(text);
        g.setAttribute('transform', 'translate(' + point.slice(0, -1) + ')');
        g.setAttribute('class', 'datapoint-value');

        const isLast = pIdx === points.length - 1;

        // hide nearby points to avoid cluttering the chart with overlapping numbers
        const [x, y] = point.split(',').map(Number);
        if (!isLast && map.find(p => Math.abs(x - p[0]) < 30 && Math.abs(y - p[1]) < 30)) {
          g.setAttribute('style', 'display: none');
        }

        const dp = this.results[idx].series[pIdx];
        text.innerHTML = (dp.formattedValue || dp.value).toString();
        text.setAttribute('stroke-width', '1');
        text.setAttribute('text-anchor', 'start');
        text.setAttribute('x', '-10');
        text.setAttribute('y', isLast ? '5' : (dp.value > 0 ? '-10' : '10'));
        text.setAttribute('style', 'font-size: 14px; fill: ' + (isLast ? '#fff' : '#444') + ';');

        el.parentNode.appendChild(g);

        if (isLast) {
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttributeNS(null, 'cx', '0');
          circle.setAttributeNS(null, 'cy', '0');
          circle.setAttributeNS(null, 'r', '20');
          circle.setAttributeNS(null, 'style', 'fill: ' + color + ';');
          g.insertBefore(circle, text);
        }

        map.push([x, y]);
      });

      const avgPoint = points.pop();
      el.setAttribute('d', 'M' + points.join('L'));
    });

    setTimeout(_ => chartEl.setAttribute('displayed', 'true'), 100);
  }

}
