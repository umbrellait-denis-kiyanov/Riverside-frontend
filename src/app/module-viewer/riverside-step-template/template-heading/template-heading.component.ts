import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { TemplateContentData } from '../templates/template-data.class';
import { interval, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'template-heading',
  templateUrl: './template-heading.component.html',
  styleUrls: ['./template-heading.component.sass']
})
export class TemplateHeadingComponent implements OnInit {

  @Input() content: TemplateContentData;

  time = 0;
  accumulatedTime = 0;
  timeStart: number;
  timerInterval: any;

  isTimerOn = false;

  timeInterval$: Observable<void>;

  sub: Subscription;

  contentData: any;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.contentData = this.content.data.template_params_json;

    this.timeInterval$ = interval(500).pipe(
      map(() => {
        this.time = this.accumulatedTime + Math.floor((Date.now() - this.timeStart) / 1000);
      })
    );

    let restartTimer = false;
    this.renderer.listen('document', 'visibilitychange', changeEvt => {
      if (document.hidden) {
        restartTimer = this.isTimerOn;
      }

      if (restartTimer) {
        this.toggleTimer();
      }
    });

    this.toggleTimer();
  }

  toggleTimer() {
    this.isTimerOn = !this.isTimerOn;

    if (!this.isTimerOn) {
      this.accumulatedTime = this.time;
      this.sub.unsubscribe();
    } else {
      this.timeStart = Date.now();
      this.sub = this.timeInterval$.subscribe();
    }
  }
}