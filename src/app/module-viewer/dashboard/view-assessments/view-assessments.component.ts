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

  activeType$: Observable<AssessmentType>;

  orgObserver$: Observable<number>;

  sessions$: Observable<AssessmentSession[]>;

  activeGroup$: BehaviorSubject<AssessmentGroup>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  ngOnInit() {
    this.types$ = this.asmService.getTypes();

    this.activeType$ = this.navService.assessmentType$;

    this.orgObserver$ = this.navService.organization$.pipe(distinctUntilChanged());

    this.sessions$ = zip(this.activeType$, this.orgObserver$).pipe(
      mergeMap(([type, org]) => this.asmService.getCompletedSessions(type, org))
    );


    // this.activeType$.subscribe(console.log);

  }

  setType(type: AssessmentType) {
    this.navService.assesmentType.current = type.id;
  }

}
