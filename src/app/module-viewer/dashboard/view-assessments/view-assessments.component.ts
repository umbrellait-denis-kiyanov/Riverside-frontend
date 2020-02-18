import { Component, OnInit, OnDestroy } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  AssessmentType,
  AssessmentGroup,
  AssessmentOrgGroup,
  AssessmentSession
} from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import {
  switchMap,
  filter,
  take,
  distinctUntilChanged,
  withLatestFrom,
  shareReplay
} from 'rxjs/operators';
import {
  AssessmentChartSeries,
  AssessmentChartActiveEntries
} from '../../assessment-chart';

@Component({
  selector: 'app-view-assessments',
  templateUrl: './view-assessments.component.html',
  styleUrls: ['./view-assessments.component.sass']
})
export class ViewAssessmentsComponent implements OnInit, OnDestroy {
  types$: Observable<AssessmentType[]>;

  groups$: Observable<AssessmentGroup[]>;

  orgGroups$: Observable<AssessmentOrgGroup[]>;

  activeType$ = new BehaviorSubject<AssessmentType>(null);

  orgObserver$: Observable<number>;

  sessions$: Observable<AssessmentSession[]>;

  activeGroup$: BehaviorSubject<AssessmentGroup>;

  chart: AssessmentChartSeries;

  activeEntries: AssessmentChartActiveEntries;

  colors: string[];

  activatedSeries: number;

  chartSubscription: Subscription;

  constructor(
    public asmService: AssessmentService,
    public navService: ModuleNavService
  ) {}

  ngOnInit() {
    this.types$ = this.asmService.getTypes();

    if (window.history.state && window.history.state.type) {
      this.asmService
        .getType(window.history.state.type)
        .pipe(take(1))
        .subscribe(type => this.setType(type));
    } else {
      this.navService.assessmentType$
        .pipe(take(1))
        .subscribe(type => this.activeType$.next(type));
    }

    this.orgObserver$ = this.navService.organization$.pipe(
      distinctUntilChanged()
    );

    this.sessions$ = combineLatest(
      this.activeType$.pipe(
        distinctUntilChanged(),
        filter(t => !!t)
      ),
      this.orgObserver$
    ).pipe(
      switchMap(([type, org]) =>
        this.asmService.getCompletedSessions(type, org)
      ),
      shareReplay(1)
    );

    const colors = [
      'red',
      'green',
      '#f3e562',
      '#ff9800',
      '#ff4514',
      '#afdf0a',
      '#00b862',
      'orange',
      'blue',
      '#ff5722',
      '#58ad3f'
    ];

    this.chartSubscription = this.sessions$
      .pipe(withLatestFrom(this.activeType$))
      .subscribe(([sessions, type]) => {
        if (!type) {
          return;
        }

        this.chart = sessions.map((session, sIdx) => {
          const series = Object.values(session.groups)
            .sort((a, b) => (Number(a.position) > Number(b.position) ? 1 : -1))
            .map((group, idx) => {
              return {
                value: Number(group.score),
                formattedValue:
                  group.score === null ? 'N/A' : String(group.score),
                name: idx + 1,
                label: (
                  type.groups.find(
                    g => Number(g.id) === Number(group.group_id)
                  ) || { shortName: '' }
                ).shortName
              };
            });

          const score = Math.round(session.score * 10) / 10;
          series.push({
            value: score,
            formattedValue: String(score),
            name: series.length + 1,
            label: 'Average'
          });

          return {
            name: session.formattedDate,
            series
          };
        });

        this.colors = colors.slice(-1 * this.chart.length);
      });
  }

  ngOnDestroy(): void {
    this.chartSubscription.unsubscribe();
  }

  setType(type: AssessmentType) {
    if (this.activeType$.value && this.activeType$.value.id === type.id) {
      return;
    }

    this.chart = null;
    setTimeout(_ => this.activeType$.next(type));
  }

  setActiveSeries(event) {
    this.activatedSeries = event;
  }

  activate(index: number) {
    this.activatedSeries = index;
    this.activeEntries = [{ name: this.chart[index + 1].name }];
  }

  deactivate(index: number) {
    if (index === this.activatedSeries) {
      this.activatedSeries = null;
      this.activeEntries = [];
    }
  }
}
