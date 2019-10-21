import { Component, OnInit, Input, Renderer2, OnDestroy, OnChanges } from '@angular/core';
import { TemplateContentData } from '../templates/template-data.class';
import { interval, Observable, Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ResourceFromStorage } from 'src/app/common/services/module-nav.service';

@Component({
  selector: 'template-heading',
  templateUrl: './template-heading.component.html',
  styleUrls: ['./template-heading.component.sass']
})
export class TemplateHeadingComponent implements OnInit, OnChanges, OnDestroy {

  @Input() content: TemplateContentData;

  @Input() disabled: boolean;

  savedTimer = new ResourceFromStorage<object>('module_timerss');

  time = 0;
  timeStart: number;
  timerInterval: any;

  isTimerOn = false;

  timeInterval$: Observable<any>;
  uuid$ = new BehaviorSubject<string>(null);

  sub: Subscription;

  contentData: any;

  uuid: string;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    if (!this.savedTimer.current) {
      this.savedTimer.current = {};
    }

    this.timeInterval$ = interval(500).pipe(
      tap((x) => {
        this.time = (this.savedTimer.current[this.uuid] || 0) + ((Date.now() - this.timeStart) / 1000);

        if (!(x % 10)) {
          this.saveTimer(this.uuid);
        }
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

    if (!this.disabled) {
      this.toggleTimer();
    }
  }

  ngOnChanges(changes) {
    if (this.uuid) {
      this.saveTimer(this.uuid);
    }

    this.timeStart = Date.now();
    this.contentData = this.content.data.template_params_json;

    const cd = this.content.data;
    this.uuid = cd.org_id + '-' + cd.module_id + '-' + cd.step_id;

    this.time = this.savedTimer.current[this.uuid] || 0;
  }

  toggleTimer() {
    this.isTimerOn = !this.isTimerOn;

    if (!this.isTimerOn) {
      this.saveTimer(this.uuid);

      this.sub.unsubscribe();
    } else {
      this.timeStart = Date.now();
      this.sub = this.timeInterval$.subscribe();
    }
  }

  ngOnDestroy() {
    this.saveTimer(this.uuid);

    this.toggleTimer();
    this.sub.unsubscribe();
  }

  saveTimer(uuid) {
    this.timeStart = Date.now();
    this.savedTimer.current = Object.assign(JSON.parse(JSON.stringify(this.savedTimer.current)), {[this.uuid]: Math.floor(this.time)});
  }
}
