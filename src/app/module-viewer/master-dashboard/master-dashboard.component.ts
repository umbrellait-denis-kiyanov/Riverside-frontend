import { Component, OnInit } from '@angular/core';
import { ModuleService } from 'src/app/common/services/module.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-master-dashboard',
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.sass']
})
export class MasterDashboardComponent implements OnInit {

  organizations$: Observable<any>;

  sortLabel = 'Sort By';

  sortOrder = '';

  constructor(private moduleService: ModuleService,
              private userService: UserService
  ) { }

  ngOnInit() {
    this.organizations$ = this.moduleService.getOrganizations();
  }

  setSort(sortLabel: string) {
    this.sortLabel = sortLabel;

    this.sortOrder = 'Alphabetical' === sortLabel ? 'name' : 'progress';

    this.organizations$ = this.moduleService.getOrganizations().pipe(map(items => items.sort((a, b) => {
      if (this.sortOrder == 'name') {
        return a.name < b.name ? -1 : 1;
      } else {
        return (a.progress || 0) < (b.progress || 0) ? 1 : -1;
      }
    })));
  }
}