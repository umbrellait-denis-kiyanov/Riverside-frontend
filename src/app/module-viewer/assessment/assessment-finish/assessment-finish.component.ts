import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { AssessmentSession, AssessmentType, AssessmentGroup, AssessmentOrgGroup } from 'src/app/common/interfaces/assessment.interface';
import { Observable, zip } from 'rxjs';
import { mergeMap, take, shareReplay, filter } from 'rxjs/operators';

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

  colorScheme = {
    domain: ['#58ad3f', '#999']
  };

  labels = {};

  xTicks = [];
  yTicks = [];

  chart: any;
  barCustomColors = [];

  xAxisTickFormatting: (idx: number) => string;

  isLineChart = true;

  constructor(public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  ngOnInit() {
    const type$ = this.navService.assesmentType.onChange.pipe(
        filter(t => !!t),
        take(1),
        shareReplay(1),
        mergeMap(typeID => this.asmService.getType(typeID))
      );
    const org$ = this.navService.organization$.pipe(take(1), shareReplay(1));

    this.session$ = zip(type$, org$).pipe(
      take(1),
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

    zip(this.groups$, this.orgGroups$, this.session$).subscribe(([groups, orgGroups, session]) => {
      const series = groups.map((group, idx) => {
        const value = Number(orgGroups[group.id].score);

        const maxLen = 20;
        this.labels[idx + 1] = group.shortName.length <= maxLen ? group.shortName : group.shortName.substr(0, maxLen - 2) + '...';
        this.barCustomColors.push({name: (idx + 1).toString(), value: value < 0 ? '#ff6666' : '#a9da9a'});

        return {value, name: (idx + 1)};
      });

      series.push({value: Math.round(session.score * 10) / 10, name: (series.length + 1)});
      this.barCustomColors.push({name: (series.length).toString(), value: session.score < 0 ? '#cc0000' : '#58ad3f'});
      this.labels[series.length] = 'Average';

      this.xTicks = Array.from(Array(series.length + 2).keys()).map(k => k - 1);

      this.yTicks = Array.from(Array(11).keys()).map(k => (k * 10) - 50);

      this.chart = [{
          name: 'Assessment',
          series
        },
        {name: '0', series: [{value: 0, name: -10}, {value: 0, name: series.length + 10}]}
      ];
    });

    this.xAxisTickFormatting = (idx: number) => this.labels[idx] || '';
  }
}
