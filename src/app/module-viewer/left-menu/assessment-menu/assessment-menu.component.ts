import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { AssessmentType, AssessmentGroup, AssessmentOrgGroup } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { mergeMap, switchMap } from 'rxjs/operators';
import { Organization } from 'src/app/common/interfaces/module.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.sass']
})
export class AssessmentMenuComponent implements OnInit {

  constructor(private router: Router,
              public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  types$: Observable<AssessmentType[]>;

  groups$: Observable<AssessmentGroup[]>;

  orgGroups$: Observable<AssessmentOrgGroup[]>;

  activeType$: BehaviorSubject<AssessmentType>;

  activeGroup$: BehaviorSubject<AssessmentGroup>;

  ngOnInit() {
    this.types$ = this.asmService.getTypes();

    this.activeType$ = this.navService.assesmentType.onChange;
    this.activeType$.next(this.navService.assesmentType.current);

    this.groups$ = combineLatest(this.activeType$, this.navService.organization$).pipe(
      mergeMap(([type, orgId]) => {
        return this.asmService.getGroups(type, orgId);
      })
    );

    this.orgGroups$ = combineLatest(this.activeType$, this.navService.organization$, this.asmService.groupsUpdated$).pipe(
      mergeMap(([type, orgId]) => {
        return this.asmService.getOrgGroups(type, orgId);
      })
    );

    this.asmService.groupsUpdated$.next(true);

    this.activeGroup$ = this.navService.assessmentGroup$;
  }

  setType(type: AssessmentType) {
    this.navService.assesmentType.current = type;
  }

  setGroup(group: AssessmentGroup) {
    this.navService.assessmentGroup$.next(group);
  }

  setOrganization(organization: Organization) {
    this.navService.lastOrganization.current = organization.id;
    const moduleId = this.navService.module.current.id;
    const stepId = this.navService.getStepId();

    this.router.navigate(['org', organization.id, 'assessment']);
  }
}
