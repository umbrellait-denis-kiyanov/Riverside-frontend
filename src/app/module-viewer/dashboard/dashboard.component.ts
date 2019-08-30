import { Component, OnInit } from '@angular/core';
import { Module } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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

  me: User;

  minDate: NgbDateStruct;

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

    const today = new Date();
    this.minDate = {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()};
  }

  toggleModuleStatus(module: Module) {
    const status = module.status ? !module.status.is_activated : true;

    this.moduleService.setStatus(module, status, this.me.org.id).subscribe(newStatus => {
      module.status = newStatus;
      this.prepareStatus(module);
    });
  }

  saveDueDate(module: Module) {
    this.moduleService.setDueDate(module, module.status.due_date_edit, this.me.org.id).subscribe(newStatus => {
      module.status = newStatus;
      this.prepareStatus(module);
    });
  }

  prepareStatus(module: Module) {
    if (module.status) {
      module.status.due_date_edit = module.status.due_date;
      module.status.is_late = module.status.due_date < new Date().toJSON().substr(0, 10);

      module.status.progress = Math.floor(Math.random() * 100);
      if (module.status.progress > 70) {
        module.status.progress = 100;
      }
    }
  }

  showUnderConstructionMessage(module: Module) {
    module.underConstruction = true;

    setTimeout(() => module.underConstruction = false, 3000);
  }
}
