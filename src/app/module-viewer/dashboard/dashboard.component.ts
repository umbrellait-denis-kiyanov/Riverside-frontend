import { Component, OnInit, OnDestroy } from '@angular/core';
import { Module, Organization } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, shareReplay, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private moduleService: ModuleService,
              private route: ActivatedRoute,
              private router: Router
            ) { }

  modulesRequest$: Observable<any>;
  modules$: Observable<any>;
  listModules$: Observable<any>;

  organizations$: Observable<Organization[]>;

  organization: Organization;

  view = 'list';

  listSortOrder$ = new BehaviorSubject<Sort>({active: 'idx', direction: 'asc'});

  organizationSubscription: Subscription;

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

    this.modules$ = this.modulesRequest$.pipe(map(response => {
      return response.body.map(category => {
        if (category.modules.length >= 12) {
          const chunkSize = Math.ceil(category.modules.length / 2);
          category.columns = [category.modules.slice(0, chunkSize), category.modules.slice(chunkSize)];
        } else {
          category.columns = [category.modules];
        }

        return category;
      });
    }));

    this.listModules$ = combineLatest([this.modulesRequest$, this.listSortOrder$]).
      pipe(map(([response, listSortOrder]) => {

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

            const aValue = 'idx' === field ? a[field] : (a.status ? a.status[field] : null);
            const bValue = 'idx' === field ? b[field] : (b.status ? b.status[field] : null);

            // keep rows with empty column values at the bottom of the table
            if ((aValue === null && bValue)) {
              return 1;
            }

            if ((bValue === null && aValue)) {
              return -1;
            }

            let defLowValue = isNaN(parseInt(aValue, 10)) && isNaN(parseInt(bValue, 10)) || ('due_date' === field) ? 'ZZZ' : 9999;
            let defHiValue = '' as any;

            if ('assessment' === field) {
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
