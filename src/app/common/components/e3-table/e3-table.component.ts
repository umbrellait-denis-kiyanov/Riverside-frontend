import { Component, Input } from '@angular/core';
import { E3TableHeader, E3TableData, E3TableHeaderCol, E3TableDataRow, E3TableCell } from './e3-table.interface';

@Component({
  selector: 'e3-table',
  templateUrl: './e3-table.component.html',
  styleUrls: ['./e3-table.component.sass']
})
export class E3TableComponent {
  @Input() header: E3TableHeader;
  @Input() data: E3TableData;
  @Input() sortable: boolean = false;

  sortBy = new SortBy();

  headerClicked(col: E3TableHeaderCol) {
    if (!this.sortable) { return; }

    this.sortBy.id = col.id;
    this.data = this.sortBy.sort(this.data);
  }

  cellClicked(cell: E3TableCell, col: E3TableHeaderCol, row: E3TableDataRow, rowIndex: number, colIndex: number) {
    (cell.onClick || row.onClick || (_ => {}))(cell, col, row, rowIndex, colIndex);
  }
}

class SortBy {
  private _id: string;
  set id(val: string) {
    if (this._id === val) {
      this.orderMult = this.orderMult * -1;
    } else {
      this.orderMult = 1;
      this._id = val;
    }
  }

  get id() {
    return this._id;
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
