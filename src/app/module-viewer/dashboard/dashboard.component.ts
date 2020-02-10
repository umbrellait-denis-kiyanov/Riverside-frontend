import { Component, OnInit, OnDestroy } from '@angular/core';
import { Module, Organization, ModuleCategory } from 'src/app/common/interfaces/module.interface';
import { ModuleScores } from 'src/app/common/interfaces/assessment.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { AssessmentService } from 'src/app/common/services/assessment.service';
import { HttpResponse } from '@angular/common/http';
import { CanModifyPipe } from 'src/app/common/pipes/canModify.pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private moduleService: ModuleService,
    private asmService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private canModifyPipe: CanModifyPipe
  ) { }

  modulesRequest$: Observable<HttpResponse<ModuleCategory[]>>;
  modules$: Observable<ModuleCategory[]>;
  categoryColumns: Module[][][];
  listModules$: Observable<Module[]>;
  assessmentScores$: Observable<ModuleScores>;

  organizations$: Observable<Organization[]>;

  organization: Organization;

  view = 'list';

  listSortOrder$ = new BehaviorSubject<Sort>({ active: 'due_date', direction: 'asc' });

  organizationSubscription: Subscription;

  canActivate = false;

  ngOnInit() {
    this.organizations$ = this.moduleService.getOrganizations();

    const id = this.route.snapshot.params.orgId;
    this.organizationSubscription = this.organizations$.subscribe(organizations =>
      this.setOrganization(id ? organizations.find(org => org.id.toString() === id) : organizations[0]));

    if (window.history.state && window.history.state.section) {
      this.view = window.history.state.section;
    }
  }

  ngOnDestroy() {
    this.organizationSubscription.unsubscribe();
  }

  setOrganization(organization: Organization) {
    this.organization = organization;

    if (Number(this.route.snapshot.params.orgId) !== Number(organization.id)) {
      this.router.navigate(['dashboard', organization.id]);
    }

    this.modulesRequest$ = this.moduleService.getCategories(this.organization.id).pipe(shareReplay(1));

    this.assessmentScores$ = this.asmService.getModuleScores(organization.id).pipe(shareReplay(1));

    this.modules$ = this.modulesRequest$.pipe(
      tap(response => this.canActivate = this.canModifyPipe.transform(response)),
      map(response => response.body),
      tap(categories => {
        this.categoryColumns = categories.map(category => {
          if (category.modules.length >= 12) {
            const chunkSize = Math.ceil(category.modules.length / 2);
            return [category.modules.slice(0, chunkSize), category.modules.slice(chunkSize)];
          } else {
            return [category.modules];
          }
        });
      })
    );

    this.listModules$ = combineLatest([this.modulesRequest$, this.listSortOrder$, this.assessmentScores$]).
      pipe(map(([response, listSortOrder, assessmentScores]) => {

        const items = response.body
          .map(category => category.modules)
          .reduce((a, b) => a.concat(b), [])
          .map((module, idx) => { module.idx = idx + 1; return module; })
          ;

        return items
          .sort((a, b) => {
            const direction = listSortOrder.direction === 'asc' ? 1 : -1;
            let field = listSortOrder.active;
            if ('progress_status' === field) {
              field = 'progress';
            }

            let aValue;
            let bValue;
            if (field.substring(0, 10) === 'assessment') {
              const type = field.substring(11);
              aValue = assessmentScores[a.id] ? assessmentScores[a.id][type] : null;
              bValue = assessmentScores[b.id] ? assessmentScores[b.id][type] : null;
            } else {
              aValue = 'idx' === field ? a[field] : (a.status ? a.status[field] : null);
              bValue = 'idx' === field ? b[field] : (b.status ? b.status[field] : null);
            }

            // @todo - duplication with master-dashboard code
            let defLowValue = isNaN(parseInt(aValue, 10)) && isNaN(parseInt(bValue, 10)) || ('due_date' === field) ? 'ZZZ' : 9999;
            let defHiValue = '' as string | number;

            if ('assessment' === field.substring(0, 10)) {
              defLowValue = 9999 * direction;
              defHiValue = 9999 * direction;
            }

            const defValue = -1 === direction ? defHiValue : defLowValue;

            return ((aValue || defValue) < (bValue || defValue)) ? -1 * direction : direction;
          });
      }));
  }

  setListSort(sortLabel: Sort) {
    this.listSortOrder$.next(sortLabel);
  }

  saveNotes(module: Module) {
    this.moduleService.saveNotes(module, this.organization.id, module.status.notes).subscribe(newStatus => {
      module.status = newStatus;
    });
  }

  saveAssignedTo(module: Module) {
    this.moduleService.saveAssignedTo(module, this.organization.id, module.status.assigned_to).subscribe(newStatus => {
      module.status = newStatus;
    });
  }
}
