import { Component, OnInit } from '@angular/core';
import { Module } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor(private moduleService: ModuleService) { }

  modules$: Observable<any>;

  ngOnInit() {
    this.modules$ = this.moduleService.getCategories().pipe(map(categories => {
      return categories.map(category => {
        if (category.modules.length >= 12) {
          const chunkSize = Math.ceil(category.modules.length / 2);
          category.modules = [category.modules.slice(0, chunkSize), category.modules.slice(chunkSize)];
          console.log(category.modules);
        } else {
          category.modules = [category.modules];
        }

        return category;
      })
    }));
  }
}
