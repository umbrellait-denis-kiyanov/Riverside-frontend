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

  sortAsc$ = new BehaviorSubject<boolean>(true);

  constructor(private moduleService: ModuleService) { }

  ngOnInit() {
    this.organizations$ = combineLatest([this.moduleService.getOrganizations(), this.sortOrder$, this.sortAsc$]).
      pipe(map(([items, sortOrder, sortAsc]) => {
        if (!sortOrder) {
          return items;
        }

        return items.sort((a, b) => {
          const direction = sortAsc ? 1 : -1;
          if (sortOrder === 'Alphabetical') {
            return a.name < b.name ? -1 * direction : direction;
          } else {
            return (a.progress || 0) < (b.progress || 0) ? direction : -1 * direction;
          }
        });
      }));
  }

  setSort(sortLabel: string) {
    this.sortOrder$.next(sortLabel);
  }

  toggleSortOrder() {
    this.sortAsc$.next(!this.sortAsc$.getValue());
  }
}