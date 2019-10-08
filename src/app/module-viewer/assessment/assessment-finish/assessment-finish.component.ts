import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { AssessmentSession, AssessmentType, AssessmentGroup, AssessmentOrgGroup } from 'src/app/common/interfaces/assessment.interface';
import { Observable, BehaviorSubject, zip } from 'rxjs';
import { mergeMap, take, shareReplay } from 'rxjs/operators';

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

  constructor(public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  ngOnInit() {
    const type$ = this.navService.assesmentType.onChange.pipe(take(1), shareReplay(1));
    const org$ = this.navService.organization$.pipe(take(1), shareReplay(1));

    this.session$ = zip(type$, org$).pipe(
      take(1),
      mergeMap(([type, orgId]) => {
        return this.asmService.getSession(type, orgId);
      })
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


  }
}
