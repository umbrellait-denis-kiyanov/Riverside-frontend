import { Component, OnInit, OnDestroy } from '@angular/core';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { Observable, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { AssessmentType, AssessmentGroup, AssessmentOrgGroup, AssessmentSession, PendingSessions } from 'src/app/common/interfaces/assessment.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { filter, take, distinctUntilChanged, switchMap, map, shareReplay, takeWhile } from 'rxjs/operators';
import { Organization } from 'src/app/common/interfaces/module.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.sass']
})
export class AssessmentMenuComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              private route: ActivatedRoute,
              public asmService: AssessmentService,
              public navService: ModuleNavService) { }

  types$: Observable<AssessmentType[]>;

  groups$: Observable<AssessmentGroup[]>;

  orgGroups$: Observable<AssessmentOrgGroup[]>;

  activeType$: Observable<AssessmentType>;

  session$: Observable<AssessmentSession>;
  sessionRequest$: Observable<HttpResponse<AssessmentSession>>;

  orgObserver$: Observable<number>;

  activeGroup$: BehaviorSubject<AssessmentGroup>;

  pendingSessions$: Observable<PendingSessions>;

  groupCompleted$ = new BehaviorSubject<boolean>(false);

  finishError$ = new BehaviorSubject<boolean>(false);

  nextGroupWatch: Subscription;
  activateTypeWatch: Subscription;

  ngOnInit() {
    this.types$ = this.asmService.getTypes();

    this.activeType$ = this.navService.assessmentType$;

    this.orgObserver$ = this.navService.organization$.pipe(distinctUntilChanged());

    this.groups$ = this.activeType$.pipe(
      switchMap((type) => {
        return this.asmService.getGroups(type);
      })
    );

    this.activateTypeWatch = this.activeType$.subscribe(_ => this.setFirstUncompletedGroup());

    this.orgGroups$ = combineLatest(this.activeType$, this.orgObserver$, this.asmService.groupsUpdated$).pipe(
      switchMap(([type, orgId]) => {
        return this.asmService.getOrgGroups(type, orgId);
      }),
      shareReplay(1)
    );

    this.sessionRequest$ = combineLatest(this.activeType$, this.orgObserver$, this.asmService.groupsUpdated$).pipe(
      switchMap(([type, orgId]) => {
        return this.asmService.getSession(type, orgId);
      }),
      shareReplay(1)
    );

    this.session$ = this.sessionRequest$.pipe(map(response => response.body));

    this.setFirstUncompletedGroup();

    this.activeGroup$ = this.navService.assessmentGroup$;

    this.pendingSessions$ = this.asmService.getSessionsPendingApproval();

    // move to next group if current is done
    this.nextGroupWatch = this.asmService.moveToNextGroup$.pipe(
      filter(r => r),
      switchMap(_ => combineLatest(this.activeGroup$, this.activeType$, this.orgGroups$).pipe(take(1)))
    )
      .subscribe(([active, type, orgGroups]) => {
        const next = type.groups.find(g => (Number(g.position) > Number(active.position)) && (!orgGroups[g.id] || !orgGroups[g.id].isDone));

        if (next) {
          this.setGroup(next);
        } else if (Object.values(orgGroups).length) {
          this.finish(true);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  ngOnDestroy() {
    this.activateTypeWatch.unsubscribe();
    this.nextGroupWatch.unsubscribe();
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
    this.navService.assessmentType.current = type.id;
  }

  setGroup(group: AssessmentGroup) {
    const current = this.navService.assessmentGroup$.value;
    this.router.navigate(['org', this.navService.lastOrganization.current, 'assessment']);
    if (!current || (group.id !== current.id)) {
      this.navService.assessmentGroup$.next(group);
    }
  }

  finish(waitUntilReady = false) {
    const takeFunc = waitUntilReady ? takeWhile(_ => waitUntilReady) : take(1);
    combineLatest(this.groups$, this.orgGroups$).pipe(takeFunc).subscribe(([groups, orgGroups]) => {
      if (Object.values(orgGroups).filter(g => (g as AssessmentOrgGroup).isDone).length === groups.length) {
        this.navService.assessmentGroup$.next(null);

        this.router.navigate(['finish'], { relativeTo: this.route });
        this.finishError$.next(false);
        waitUntilReady = false;
      } else if (!waitUntilReady) {
        this.setFirstUncompletedGroup();
        this.finishError$.next(true);
        setTimeout(_ => this.finishError$.next(false), 5000);
      }
    });
  }

  setOrganization(organization: Organization) {
    this.navService.lastOrganization.current = organization.id;

    this.router.navigate(['org', organization.id, 'assessment']);
  }

  viewPastAssessments() {
    this.router.navigate(['dashboard', this.navService.lastOrganization.current], { state: { section: 'assessments' } });
  }
}
