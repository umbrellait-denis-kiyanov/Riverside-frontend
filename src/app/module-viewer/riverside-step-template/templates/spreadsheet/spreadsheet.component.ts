import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { SpreadsheetTemplateData } from './spreadsheet.interface';
import * as Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { Observable, Subscription } from 'rxjs';
import { SpreadsheetResource } from 'src/app/common/interfaces/module.interface';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: ['./spreadsheet.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => SpreadsheetComponent) }]
})
export class SpreadsheetComponent extends TemplateComponent {

  contentData: SpreadsheetTemplateData['template_params_json'];

  sheetSub: Subscription;

  sheet: SpreadsheetResource;

  settings: Handsontable.default.GridSettings;

  types: string[][];

  cellSettings: { editable: boolean; className: string; }[][];

  hiddenRows = {
    rows: []
  };

  init() {
    const contentData = this.data.data.template_params_json;

    this.sheetSub =
      this.moduleService.getSpreadsheet(0, contentData.apiResource)
        .pipe(
          tap(data => {
            this.cellSettings = data.data.map((row, rowIndex) => row.map((cell, cellIndex) => ({editable: false, className: ''})));

            this.types = data.data.map((row, rowIndex) => row.map((cell, cellIndex) => {
              if (null === cell) {
                return null;
              }

              let cellType = null;

              if (cell.match(/^[0-9]+\%$/)) {
                cell = parseInt(cell, 10).toString();
                cellType = 'percent';
              } else
              if (cell.match(/^\$[ ]{0,}[,0-9]+$/)) {
                cell = parseInt(cell.split(/[^0-9]/).join(''), 10).toString();
                cellType = 'currency';
              } else
              if (cell.match(/^[,0-9]+$/)) {
                cell = parseInt(cell.split(/[^0-9]/).join(''), 10).toString();
                cellType = 'numeric';
              }

              data.data[rowIndex][cellIndex] = cell;

              return cellType;
            }));

            this.cellSettings = data.meta.editable.reduce((editable, range) => {
              const row = parseInt(range, 10);
              const cellRange = range.split(/[0-9]/).join('').split('-');

              for (let idx = cellRange[0].charCodeAt(0) - 65; idx <= cellRange[cellRange.length - 1].charCodeAt(0) - 65; idx++) {
                editable[row - 1][idx].editable = true;
              }

              return editable;
            }, this.cellSettings);

            this.sheet = data;

            if (contentData.visibleRows) {
              this.hiddenRows.rows = Array.from(Array(data.data.length).keys());

              this.textContent(contentData.visibleRows).split(',').map(intv => {
                const highLow = intv.split('-');
                for (let idx = Number(highLow[0]) - 1; idx <= Number(highLow[highLow.length - 1]) - 1; idx++) {
                  this.hiddenRows.rows.splice(this.hiddenRows.rows.indexOf(idx), 1);
                }
              });
            } else {
              this.hiddenRows.rows = [];
            }

            this.settings = {
              data: this.sheet.data,
              rowHeaders: false,
              colHeaders: false,
              cells: this.formatCell.bind(this),
              formulas: true,
              hiddenRows: this.hiddenRows,
              beforeChange: this.beforeChange.bind(this),
              invalidCellClassName: 'invalidCell',
              colWidths: this.sheet.meta.colWidths,
              mergeCells: this.sheet.meta.mergeCells
            };
          }
        ))
        .subscribe();
  }

  getDescription() {
    return '';
  }

  getName() {
    return 'Spreadsheet';
  }

  formatCell(row, column, prop) {
    const cell = {} as any;

    cell.readOnly = !this.cellSettings[row][column].editable;
    if (!cell.readOnly) {
      cell.className = 'editable';
    }

    const tp = this.types[row][column];
    if (tp) {
      cell.type = 'numeric';

      if (!cell.readOnly) {
        cell.validatorName = 'numeric';
      }

      if ('currency' === tp) {
        cell.numericFormat = {
          pattern: '$ 0,0',
          culture: 'en-US'
        };
      } else if ('percent' === tp) {
        cell.numericFormat = {
          pattern: '0,0',
          culture: 'en-US'
        };

        cell.className += ' percent';
      } else if ('numeric' === tp) {
        cell.numericFormat = {
          pattern: '0,0',
          culture: 'en-US'
        };
      }
    }

    return cell;
  }

  beforeChange(changes, source) {
    for (let i = changes.length - 1; i >= 0; i--) {
      const change = changes[i];
      const newVal = change[3];
      const tp = this.types[change[0]][change[1]];

      if (tp) {
        changes[i][3] = parseFloat(newVal) || 0;
      }
    }
  }
}
