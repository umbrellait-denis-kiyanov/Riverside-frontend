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

  view = 'list';

  organizations$: Observable<any>;

  sortOrder$ = new BehaviorSubject<string>('Alphabetical');

  listSortOrder$ = new BehaviorSubject<Sort>({active: 'name', direction: 'asc'});

  sortAsc$ = new BehaviorSubject<boolean>(true);

  gridHeight$: Observable<string>;

  @ViewChild('orgItem') orgItem: ElementRef;

  constructor(private moduleService: ModuleService) { }

  quarters = [];

  currentQuarter = '';

  colorScheme = {
    domain: ['#00529f']
  };

  ngOnInit() {
    this.organizations$ = combineLatest([this.moduleService.getOrganizations(), this.sortOrder$, this.listSortOrder$, this.sortAsc$]).
      pipe(map(([items, sortOrder, listSortOrder, sortAsc]) => {
        return items
          .map(item => {
            item.chart = [{name: 'Progress', series: this.quarters.map((quarter, idx) =>
                            ({name: idx, value: item[quarter]})).filter((entry, idx) => !idx || entry.value)}];

            return item;
          })
          .sort((a, b) => {
            const direction = ('grid' === this.view ? sortAsc : (listSortOrder.direction === 'asc')) ? 1 : -1;

            const field = 'grid' === this.view ? (sortOrder === 'Alphabetical' ? 'name' : 'progress') : listSortOrder.active;

            // keep rows with empty column values at the bottom of the table
            let defLowValue = isNaN(parseInt(a[field], 10)) && isNaN(parseInt(b[field], 10)) || ('due_date' === field) ? 'ZZZ' : 9999;
            let defHiValue = '' as any;

            if ('assessment' === field) {
              defLowValue = 9999 * direction;
              defHiValue = 9999 * direction;
            }

            const defValue = -1 === direction ? defHiValue : defLowValue;

            return ((a[field] || defValue) < (b[field] || defValue)) ? -1 * direction : direction;
          });
      }));

    this.gridHeight$ = combineLatest([this.moduleService.getOrganizations(), fromEvent(window, 'resize').pipe(startWith(null))]).
      pipe(map(([items, event]) => {
        const el = this.orgItem.nativeElement;
        const columns = 100 / parseInt(window.getComputedStyle(el, null).getPropertyValue('max-width'), 10);
        const containerHeight = (Math.ceil(items.length / columns) + 0.5) * el.clientHeight;

        return containerHeight.toString(10) + 'px';
      }));

    // @todo: load from API
    this.currentQuarter = 'q3';

    const quarters = ['q1', 'q2', 'q3', 'q4'];
    this.quarters = quarters.concat(quarters).slice(quarters.indexOf(this.currentQuarter) + 1, 8).slice(0, 4);
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
