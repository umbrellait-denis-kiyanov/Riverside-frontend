import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { AssessmentSession, AssessmentType, AssessmentGroup, AssessmentOrgGroup } from 'src/app/common/interfaces/assessment.interface';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessment-finish',
  templateUrl: './assessment-finish.component.html',
  styleUrls: ['./assessment-finish.component.sass']
})
export class AssessmentFinishComponent implements OnInit {

  session$: Observable<AssessmentSession>;

  types$: Observable<AssessmentType[]>;

  groups$: Observable<AssessmentGroup[]>;

  orgGroups$: Observable<AssessmentOrgGroup[]>;

  chart: any;

  isLineChart = true;

  constructor(public asmService: AssessmentService,
              public navService: ModuleNavService,
              public router: Router) { }

  ngOnInit() {
    const type$ = this.navService.assessmentType.onChange.pipe(
        filter(t => !!t),
        switchMap(typeID => this.asmService.getType(typeID))
      );

    const org$ = this.navService.organization$;

    this.session$ = combineLatest(type$, org$).pipe(
      switchMap(([type, orgId]) => this.asmService.getSession(type, orgId))
    );

    this.groups$ = type$.pipe(
      switchMap((type) => this.asmService.getGroups(type))
    );

    this.orgGroups$ = combineLatest(type$, org$).pipe(
      switchMap(([type, orgId]) => this.asmService.getOrgGroups(type, orgId))
    );

    combineLatest(this.groups$, this.orgGroups$, this.session$).subscribe(([groups, orgGroups, session]) => {
      const series = groups.map((group, idx) => {
        return {value: Number((orgGroups[group.id] || {score: 0}).score), name: (idx + 1), label: group.shortName};
      });

      series.push({value: Math.round(session.score * 10) / 10, name: (series.length + 1), label: 'Average'});

      this.chart = [{
          name: 'Assessment',
          series
        }
      ];
    });
  }

  finish(session: AssessmentSession) {
    this.asmService.finishSession(session).subscribe(_ => {
      this.router.navigate(['dashboard', this.navService.lastOrganization.current],
          { state: { section: 'assessments', type: session.type_id } });
      }
    );
  }
}
