import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModuleService } from 'src/app/common/services/module.service';
import { Observable, fromEvent, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-master-dashboard',
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.sass']
})
export class MasterDashboardComponent implements OnInit {

  view = 'grid';

  organizations$: Observable<any>;

  sortOrder$ = new BehaviorSubject<string>('Alphabetical');

  listSortOrder$ = new BehaviorSubject<Sort>({active: 'name', direction: 'asc'});

  sortAsc$ = new BehaviorSubject<boolean>(true);

  gridHeight$: Observable<string>;

  @ViewChild('orgItem') orgItem: ElementRef;

  constructor(private moduleService: ModuleService) { }

  ngOnInit() {
    this.organizations$ = combineLatest([this.moduleService.getOrganizations(), this.sortOrder$, this.listSortOrder$, this.sortAsc$]).
      pipe(map(([items, sortOrder, listSortOrder, sortAsc]) => {
        return items.map(item => { item.progress = item.progress || 0; return item; }).sort((a, b) => {
          const direction = ('grid' === this.view ? sortAsc : (listSortOrder.direction === 'asc')) ? 1 : -1;

          const field = 'grid' === this.view ? (sortOrder === 'Alphabetical' ? 'name' : 'progress') : listSortOrder.active;

          // keep rows with empty column values at the bottom of the table
          const defValue = -1 === direction ? '' : 'ZZZ';

          return (a[field] || defValue) < (b[field] || defValue) ? -1 * direction : direction;
        });
      }));

    this.gridHeight$ = combineLatest([this.moduleService.getOrganizations(), fromEvent(window, 'resize').pipe(startWith(null))]).
      pipe(map(([items, event]) => {
        const el = this.orgItem.nativeElement;
        const columns = 100 / parseInt(window.getComputedStyle(el, null).getPropertyValue('max-width'), 10);
        const containerHeight = (Math.ceil(items.length / columns) + 0.5) * el.clientHeight;

        return containerHeight.toString(10) + 'px';
      }));
  }

  setSort(sortLabel: string) {
    this.sortOrder$.next(sortLabel);
  }

  setListSort(sortLabel: Sort) {
    this.listSortOrder$.next(sortLabel);
  }

  toggleSortOrder() {
    this.sortAsc$.next(!this.sortAsc$.getValue());
  }
}
