import { Component, OnInit } from '@angular/core';
import { ModuleService } from 'src/app/common/services/module.service';
import { Observable, of, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-master-dashboard',
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.sass']
})
export class MasterDashboardComponent implements OnInit {

  view = 'grid';

  organizations$: Observable<any>;

  sortOrder$ = new BehaviorSubject<string>('Alphabetical');

  listSortOrder$ = new BehaviorSubject<string>('name');

  sortAsc$ = new BehaviorSubject<boolean>(true);

  constructor(private moduleService: ModuleService) { }

  ngOnInit() {
    this.organizations$ = combineLatest([this.moduleService.getOrganizations(), this.sortOrder$, this.listSortOrder$, this.sortAsc$]).
      pipe(map(([items, sortOrder, listSortOrder, sortAsc]) => {
        return items.map(item => { item.progress = item.progress || 0; return item; }).sort((a, b) => {
          const direction = ('grid' === this.view ? sortAsc : listSortOrder.direction === 'asc') ? 1 : -1;

          const field = 'grid' === this.view ? (sortOrder === 'Alphabetical' ? 'name' : 'progress') : listSortOrder.active;

          return a[field] < b[field] ? -1 * direction : direction;
        });
      }));
  }

  setSort(sortLabel: string) {
    this.sortOrder$.next(sortLabel);
  }

  setListSort(sortLabel: string) {
    this.listSortOrder$.next(sortLabel);
  }

  toggleSortOrder() {
    this.sortAsc$.next(!this.sortAsc$.getValue());
  }
}