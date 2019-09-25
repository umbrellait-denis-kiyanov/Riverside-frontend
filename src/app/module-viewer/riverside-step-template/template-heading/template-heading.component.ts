import { Component, OnInit, Input, Renderer2, OnDestroy } from '@angular/core';
import { TemplateContentData } from '../templates/template-data.class';
import { interval, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResourceFromStorage } from 'src/app/common/services/module-nav.service';

@Component({
  selector: 'template-heading',
  templateUrl: './template-heading.component.html',
  styleUrls: ['./template-heading.component.sass']
})
export class TemplateHeadingComponent implements OnInit, OnDestroy {

  @Input() content: TemplateContentData;

  savedTimer = new ResourceFromStorage<object>('module_viewer_timers');

  time = 0;
  accumulatedTime = 0;
  timeStart: number;
  timerInterval: any;

  isTimerOn = false;

  timeInterval$: Observable<void>;

  sub: Subscription;

  contentData: any;

  uuid: string;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.contentData = this.content.data.template_params_json;

    const inputs = Object.values(this.content.data.inputs).map(i => i.id);
    this.uuid = inputs.slice(0, 2).concat(inputs.slice(-2, inputs.length)).join('-') + '-' + this.contentData.title;

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

    this.accumulatedTime = (this.savedTimer.current ? this.savedTimer.current[this.uuid] : 0) || 0;
    this.time = this.accumulatedTime;

    this.toggleTimer();
  }

  toggleTimer() {
    this.isTimerOn = !this.isTimerOn;

    if (!this.isTimerOn) {
      this.accumulatedTime = this.time;

      this.savedTimer.current = Object.assign(this.savedTimer.current || {}, {[this.uuid]: this.accumulatedTime});

      this.sub.unsubscribe();
    } else {
      this.timeStart = Date.now();
      this.sub = this.timeInterval$.subscribe();
    }
  }

  ngOnDestroy() {
    this.toggleTimer();
  }
}