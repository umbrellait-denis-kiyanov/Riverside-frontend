import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Module, Organization } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(private moduleService: ModuleService,
              private route: ActivatedRoute,
              private router: Router
            ) { }

  modulesRequest$: Observable<any>;
  modules$: Observable<any>;
  listModules$: Observable<any>;

  organizations$: Observable<Organization[]>;

  minDate: NgbDateStruct;

  organization: Organization;

  view = 'list';

  listSortOrder$ = new BehaviorSubject<Sort>({active: 'idx', direction: 'asc'});

  ngOnInit() {
    this.organizations$ = this.moduleService.getOrganizations();

    const id = this.route.snapshot.params.orgId;
    this.organizations$.subscribe(organizations =>
        this.setOrganization(id ? organizations.find(org => org.id.toString() === id) : organizations[0]));

    const today = new Date();
    this.minDate = {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()};
  }

  saveDueDate(module: Module) {
    this.moduleService.setDueDate(module, module.status.due_date_edit, this.organization.id).subscribe(newStatus => {
      module.status = newStatus;
      this.prepareStatus(module);
    });
  }

  prepareStatus(module: Module) {
    if (module.status) {
      module.status.due_date_edit = module.status.due_date;
      module.status.is_late = module.status.due_date < new Date().toJSON().substr(0, 10);

      module.underConstruction = module.name !== 'Buyer Personas';

      // randomize progress - remove this ASAP
      // if (module.status.due_date && !module.status.progress) {
      //   module.status.progress = Math.floor(Math.random() * 100);
      //   if (module.status.progress > 70) {
      //     module.status.progress = 100;
      //   }
      // }
    }

    return module;
  }

  setOrganization(organization: Organization) {
    this.organization = organization;

    this.router.navigate(['dashboard', organization.id]);

    this.modulesRequest$ = this.moduleService.getCategories(this.organization.id).pipe(shareReplay(1));
    this.modules$ = this.modulesRequest$.pipe(map(response => {
      return response.body.map(category => {
        category.modules.map(this.prepareStatus);

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
          .map(this.prepareStatus)
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
      this.prepareStatus(module);
    });
  }
}
