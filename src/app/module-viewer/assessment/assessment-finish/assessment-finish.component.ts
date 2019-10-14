import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { AssessmentSession, AssessmentType, AssessmentGroup, AssessmentOrgGroup } from 'src/app/common/interfaces/assessment.interface';
import { Observable, zip, combineLatest } from 'rxjs';
import { mergeMap, take, shareReplay, filter } from 'rxjs/operators';
import { Router, NavigationExtras } from '@angular/router';

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
    const type$ = this.navService.assesmentType.onChange.pipe(
        filter(t => !!t),
        take(1),
        shareReplay(1),
        mergeMap(typeID => this.asmService.getType(typeID))
      );

    const org$ = this.navService.organization$.pipe(take(1), shareReplay(1));

    this.session$ = combineLatest(type$, org$).pipe(
      mergeMap(([type, orgId]) => this.asmService.getSession(type, orgId))
    );

    this.groups$ = type$.pipe(
      take(1),
      mergeMap((type) => {
        return this.asmService.getGroups(type);
      })
    );

    this.orgGroups$ = zip(type$, org$).pipe(
      take(1),
      mergeMap(([type, orgId]) => {
        return this.asmService.getOrgGroups(type, orgId);
      })
    );

    combineLatest(this.groups$, this.orgGroups$, this.session$).subscribe(([groups, orgGroups, session]) => {
      const series = groups.map((group, idx) => {
        return {value: Number(orgGroups[group.id].score), name: (idx + 1), label: group.shortName};
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
          { state: { section: 'assessments', type: session.type } });
      }
    );
  }
}
