import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import {
  AssessmentSession,
  AssessmentType,
  AssessmentGroup,
  AssessmentOrgGroup
} from 'src/app/common/interfaces/assessment.interface';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { switchMap, map, shareReplay, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AssessmentChartSeries } from '../../assessment-chart';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assessment-finish',
  templateUrl: './assessment-finish.component.html',
  styleUrls: ['./assessment-finish.component.sass']
})
export class AssessmentFinishComponent implements OnInit {
  session$: Observable<AssessmentSession>;
  sessionRequest$: Observable<HttpResponse<AssessmentSession>>;

  types$: Observable<AssessmentType[]>;

  groups$: Observable<AssessmentGroup[]>;

  orgGroups$: Observable<AssessmentOrgGroup[]>;

  chart: AssessmentChartSeries;

  isLineChart = true;

  isSubmittedForReview = false;

  isFinishing: Subscription;

  constructor(
    public asmService: AssessmentService,
    public navService: ModuleNavService,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const type$ = this.navService.assessmentType$;

    const org$ = this.navService.organization$;

    this.sessionRequest$ = combineLatest(type$, org$).pipe(
      switchMap(([type, orgId]) => this.asmService.getSession(type, orgId)),
      shareReplay(1)
    );

    this.session$ = this.sessionRequest$.pipe(map(response => response.body));

    this.groups$ = type$.pipe(
      switchMap(type => this.asmService.getGroups(type))
    );

    this.orgGroups$ = combineLatest(type$, org$).pipe(
      switchMap(([type, orgId]) => this.asmService.getOrgGroups(type, orgId)),
      shareReplay(1)
    );

    combineLatest(this.groups$, this.orgGroups$, this.session$)
      .pipe(take(1))
      .subscribe(([groups, orgGroups, session]) => {
        const series = groups.map((group, idx) => {
          const val = Number((orgGroups[group.id] || { score: 0 }).score);

          return {
            value: val,
            name: idx + 1,
            label: group.shortName,
            formattedValue:
              !orgGroups[group.id] || orgGroups[group.id].score === null
                ? 'N/A'
                : String(val)
          };
        });

        const value = Math.round(session.score * 10) / 10;
        series.push({
          value,
          name: series.length + 1,
          label: 'Average',
          formattedValue: String(value)
        });

        this.chart = [
          {
            name: 'Assessment',
            series
          }
        ];
      });
  }

  finish(session: AssessmentSession) {
    this.isFinishing = this.asmService
      .finishSession(session)
      .subscribe(response => {
        if (response.is_approved) {
          this.router.navigate(
            ['dashboard', this.navService.lastOrganization.current],
            { state: { section: 'assessments', type: session.type_id } }
          );

          this.toastr.success('Assessment has been recorded');
        } else {
          this.isSubmittedForReview = true;
          this.toastr.success('Assessment has been submitted for review');
        }
      });
  }
}
