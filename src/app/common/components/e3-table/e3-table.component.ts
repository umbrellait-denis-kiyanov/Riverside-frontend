import { Component, Input, OnInit } from '@angular/core';
import { E3TableHeader, E3TableData, E3TableHeaderCol, E3TableDataRow, E3TableCell } from '.';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'e3-table',
  templateUrl: './e3-table.component.html',
  styleUrls: ['./e3-table.component.sass']
})
export class E3TableComponent implements OnInit {
  @Input() header: E3TableHeader;
  @Input() data: Observable<E3TableData>;
  @Input() sortable: boolean = false;

  sortBy = new SortBy();

  tableData$: Observable<E3TableData>;

  ngOnInit() {
    this.tableData$ = combineLatest(this.data, this.sortBy.getObservable()).pipe(
      map(([data]) =>
        (this.sortable ? this.sortBy.sort(data) : data)
          .map(row => {
            row.cells = row.cells.map((cell, index) => {
              const headerCol = this.header[index];
              cell.formattedValue = headerCol.transform ? headerCol.transform(cell.value) : cell.value;

              return cell;
            });

            return row;
          }
        )
      )
    );
  }

  headerClicked(col: E3TableHeaderCol) {
    if (this.sortable) {
      this.sortBy.id = col.id;
    }
  }

  cellClicked(cell: E3TableCell, col: E3TableHeaderCol, row: E3TableDataRow, rowIndex: number, colIndex: number) {
    (cell.onClick || row.onClick || (_ => {}))(cell, col, row, rowIndex, colIndex);
  }
}

class SortBy {
  private _id: string;
  private observable$ = new BehaviorSubject<string>(null);
  set id(val: string) {
    if (this._id === val) {
      this.orderMult = this.orderMult * -1;
    } else {
      this.orderMult = 1;
      this._id = val;
    }

    this.observable$.next(this._id);
  }

  get id() {
    return this._id;
  }

  getObservable() {
    return this.observable$;
  }

  orderMult = 1;

  sort(data: E3TableData) {
    return data.sort((a, b) => {
      const aString = a[this.id] ? a[this.id].toString() : '';
      const bString = b[this.id] ? b[this.id].toString() : '';
      return aString.localeCompare(bString.toString()) * this.orderMult;
    });
  }
}
