import { Component, OnInit } from '@angular/core';
import { Module } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(private moduleService: ModuleService,
              private userService: UserService
            ) { }

  modules$: Observable<any>;

  statusChangeProgress = {};

  me: User;

  minDate: Date;

  ngOnInit() {
    this.me = this.userService.me;

    this.modules$ = this.moduleService.getCategories(this.me.org.id).pipe(map(categories => {
      return categories.map(category => {
        category.modules.map(this.prepareStatus);

        if (category.modules.length >= 12) {
          const chunkSize = Math.ceil(category.modules.length / 2);
          category.modules = [category.modules.slice(0, chunkSize), category.modules.slice(chunkSize)];
        } else {
          category.modules = [category.modules];
        }

        return category;
      })
    }));

    this.minDate = new Date();
  }

  toggleModuleStatus(module: Module) {
    const status = module.status ? !module.status.is_activated : true;

    this.statusChangeProgress[module.id] = true;
    this.moduleService.setStatus(module, status, this.me.org.id).subscribe(newStatus => {
      module.status = newStatus;
      this.prepareStatus(module);
    },
    err => {},
    () => {
      this.statusChangeProgress[module.id] = false;
    });
  }

  saveDueDate(module: Module) {
    this.moduleService.setDueDate(module, module.status.due_date_edit, this.me.org.id).subscribe(newStatus => {
      module.status = newStatus;
      this.prepareStatus(module);
    },
    err => {},
    () => {
      this.statusChangeProgress[module.id] = false;
    });
  }

  prepareStatus(module: Module) {
    if (module.status) {
      module.status.due_date_edit = module.status.due_date;
    }
  }
}
