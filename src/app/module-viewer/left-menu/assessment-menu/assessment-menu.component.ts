import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest, zip } from 'rxjs';
import { AssessmentType, AssessmentGroup, AssessmentOrgGroup } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { mergeMap, filter, take, tap, distinctUntilChanged } from 'rxjs/operators';
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
  activeTypeObserver$: Observable<AssessmentType>;

  orgObserver$: Observable<number>;

  activeGroup$: BehaviorSubject<AssessmentGroup>;

  groupCompleted$ = new BehaviorSubject<boolean>(false);

  finishError$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.types$ = this.asmService.getTypes();

    this.activeType$ = this.navService.assesmentType.onChange;
    this.activeType$.next(this.navService.assesmentType.current);
    this.activeTypeObserver$ = this.navService.assesmentType.onChange.pipe(distinctUntilChanged((prev, curr) => prev.id === curr.id));

    this.orgObserver$ = this.navService.organization$.pipe(distinctUntilChanged());

    this.groups$ = combineLatest(this.activeTypeObserver$, this.orgObserver$).pipe(
      mergeMap(([type, orgId]) => {
        return this.asmService.getGroups(type);
      })
    );

    this.activeTypeObserver$.subscribe(_ => this.setFirstUncompletedGroup());

    this.orgGroups$ = combineLatest(this.activeTypeObserver$, this.navService.organization$, this.asmService.groupsUpdated$).pipe(
      mergeMap(([type, orgId]) => {
        return this.asmService.getOrgGroups(type, orgId);
      })
    );

    this.activeGroup$ = this.navService.assessmentGroup$;

    this.setFirstUncompletedGroup();

    // move to next group if current is done
    this.orgGroups$.subscribe(groups => {
      if (groups[this.activeGroup$.value.id]) {
        this.groupCompleted$.next(groups[this.activeGroup$.value.id].isDone);
      }
    });

    this.activeGroup$.subscribe(_ => this.groupCompleted$.next(false));

    zip(this.asmService.groupsUpdated$, this.groupCompleted$.pipe(filter(r => r))).subscribe(([update, isCompleted]) => {
      zip(this.activeGroup$, this.groups$, this.orgGroups$).pipe(take(1)).subscribe(([active, groups, orgGroups]) => {
        const next = groups.find(g => (Number(g.position) > Number(active.position)) && (!orgGroups[g.id] || !orgGroups[g.id].isDone));

        if (next) {
          this.setGroup(next);
        }
      });
    });
  }

  private setFirstUncompletedGroup() {
    zip(this.groups$, this.orgGroups$).pipe(take(1)).subscribe(([groups, orgGroups]) => {
      if (groups) {
        this.setGroup(groups.find(g => (!orgGroups[g.id] || !orgGroups[g.id].isDone)) || groups[0]);
      }
    });
  }

  setType(type: AssessmentType) {
    this.navService.assesmentType.current = type;
  }

  setGroup(group: AssessmentGroup) {
    const current = this.navService.assessmentGroup$.value;
    if (!current || (group.id !== current.id)) {
      console.log('next group');
      this.navService.assessmentGroup$.next(group);
    }
  }

  finish(group: AssessmentGroup) {
    combineLatest(this.groups$, this.orgGroups$).pipe(take(1)).subscribe(([groups, orgGroups]) => {
      if (Object.values(orgGroups).filter(g => g.isDone).length === groups.length) {
        this.navService.assessmentGroup$.next(null);
      } else {
        this.setFirstUncompletedGroup();
        this.finishError$.next(true);
        setTimeout(_ => this.finishError$.next(false), 5000);
      }
    });
  }

  setOrganization(organization: Organization) {
    this.navService.lastOrganization.current = organization.id;
    const moduleId = this.navService.module.current.id;
    const stepId = this.navService.getStepId();

    this.router.navigate(['org', organization.id, 'assessment']);
  }
}
