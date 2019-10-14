import { Component, OnInit } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { AssessmentType, AssessmentGroup, AssessmentOrgGroup } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { mergeMap, filter, take, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Organization } from 'src/app/common/interfaces/module.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.sass']
})
export class AssessmentMenuComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  types$: Observable<AssessmentType[]>;

  groups$: Observable<AssessmentGroup[]>;

  orgGroups$: Observable<AssessmentOrgGroup[]>;

  activeType$: Observable<AssessmentType>;

  orgObserver$: Observable<number>;

  activeGroup$: BehaviorSubject<AssessmentGroup>;

  groupCompleted$ = new BehaviorSubject<boolean>(false);

  finishError$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.types$ = this.asmService.getTypes();

    this.activeType$ = this.navService.assessmentType$;

    this.orgObserver$ = this.navService.organization$.pipe(distinctUntilChanged());

    this.groups$ = this.activeType$.pipe(
      mergeMap((type) => {
        return this.asmService.getGroups(type);
      })
    );

    this.activeType$.subscribe(_ => this.setFirstUncompletedGroup());

    this.orgGroups$ = combineLatest(this.activeType$, this.orgObserver$, this.asmService.groupsUpdated$).pipe(
      mergeMap(([type, orgId]) => {
        return this.asmService.getOrgGroups(type, orgId);
      })
    );

    this.setFirstUncompletedGroup();

    this.activeGroup$ = this.navService.assessmentGroup$;

    // move to next group if current is done
    this.orgGroups$.subscribe(groups => {
      if (this.activeGroup$.value && groups[this.activeGroup$.value.id]) {
        this.groupCompleted$.next(groups[this.activeGroup$.value.id].isDone);
      }
    });

    this.activeGroup$.subscribe(_ => this.groupCompleted$.next(false));

    this.groupCompleted$.pipe(
      filter(r => r),
      switchMap(_ => combineLatest(this.activeGroup$, this.activeType$, this.orgGroups$).pipe(take(1))))
        .subscribe(([active, type, orgGroups]) => {
          const next = type.groups.find(g => (Number(g.position) > Number(active.position)) && (!orgGroups[g.id] || !orgGroups[g.id].isDone));

          if (next) {
            this.setGroup(next);
          } else if (Object.values(orgGroups).length) {
            this.finish();
          }
        });
  }

  private setFirstUncompletedGroup() {
    if (this.groups$ && this.orgGroups$) {
      combineLatest(this.groups$, this.orgGroups$).pipe(take(1)).subscribe(([groups, orgGroups]) => {
        const unfinished = groups.find(g => (!orgGroups[g.id] || !orgGroups[g.id].isDone));
        if (!unfinished && (groups.length === Object.values(orgGroups).length)) {
          this.finish();
        } else {
          this.router.navigate(['org', this.navService.lastOrganization.current, 'assessment']);
          this.setGroup(unfinished || groups[0]);
        }
      });
    }
  }

  setType(type: AssessmentType) {
    this.navService.assesmentType.current = type.id;
  }

  setGroup(group: AssessmentGroup) {
    const current = this.navService.assessmentGroup$.value;
    this.router.navigate(['org', this.navService.lastOrganization.current, 'assessment']);
    if (!current || (group.id !== current.id)) {
      this.navService.assessmentGroup$.next(group);
    }
  }

  finish() {
    combineLatest(this.groups$, this.orgGroups$).pipe(take(1)).subscribe(([groups, orgGroups]) => {
      if (Object.values(orgGroups).filter(g => g.isDone).length === groups.length) {
        this.navService.assessmentGroup$.next(null);

        this.router.navigate(['finish'], { relativeTo: this.route });

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

  viewPastAssessments() {
    this.router.navigate(['dashboard', this.navService.lastOrganization.current], { state: { section: 'assessments' } });
  }
}
