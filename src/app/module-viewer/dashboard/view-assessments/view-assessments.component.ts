import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest, zip } from 'rxjs';
import { AssessmentType, AssessmentGroup, AssessmentOrgGroup, AssessmentSession } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { mergeMap, filter, take, tap, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Organization } from 'src/app/common/interfaces/module.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-assessments',
  templateUrl: './view-assessments.component.html',
  styleUrls: ['./view-assessments.component.sass']
})
export class ViewAssessmentsComponent implements OnInit {

  types$: Observable<AssessmentType[]>;

  groups$: Observable<AssessmentGroup[]>;

  orgGroups$: Observable<AssessmentOrgGroup[]>;

  activeType$ = new BehaviorSubject<AssessmentType>(null);

  orgObserver$: Observable<number>;

  sessions$: Observable<AssessmentSession[]>;

  activeGroup$: BehaviorSubject<AssessmentGroup>;

  chart: any;

  activeEntries: any;

  colors: string[];

  activatedSeries: number;

  constructor(public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  ngOnInit() {
    this.types$ = this.asmService.getTypes();

    this.navService.assessmentType$.pipe(take(1)).subscribe(type => this.activeType$.next(type));

    this.orgObserver$ = this.navService.organization$.pipe(distinctUntilChanged());

    this.sessions$ = combineLatest(this.activeType$.pipe(filter(t => !!t)), this.orgObserver$).pipe(
      mergeMap(([type, org]) => this.asmService.getCompletedSessions(type, org))
    );

    const colors = ['red', 'green', '#a7b61a', '#f3e562', '#00b862', '#ff9800', '#afdf0a', '#ff4514', 'blue', '#ff5722', '#58ad3f'];

    zip(this.sessions$, this.activeType$.pipe(filter(t => !!t))).subscribe(([sessions, type]) => {
      this.chart = sessions.map((session, sIdx) => {
        const series = Object.values(session.groups).map((group, idx) => {
          return {
            value: Number(group.score),
            formattedValue: Number(group.score),
            name: (idx + 1),
            label: type.groups.find(g => g.id == group.group_id).shortName};
        });

        const score = Math.round(session.score * 10) / 10;
        series.push({value: score, formattedValue: score, name: (series.length + 1), label: 'Average'});

        return {
          name: session.formattedDate,
          series
        };
      });

      this.colors = colors.slice(-1 * this.chart.length);
    });
  }

  setType(type: AssessmentType) {
    this.activeType$.next(type);
  }

  setActiveSeries(event) {
    this.activatedSeries = event;
  }

  activate(index: number) {
    this.activatedSeries = index;
    this.activeEntries = [{name: this.chart[index + 1].name}];
  }

  deactivate(index: number) {
    if (index === this.activatedSeries) {
      this.activatedSeries = null;
      this.activeEntries = [];
    }
  }

}
