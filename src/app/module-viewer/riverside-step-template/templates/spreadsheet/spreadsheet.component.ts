import { Component, forwardRef, ViewChild } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { SpreadsheetTemplateData } from './spreadsheet.interface';
import * as Handsontable from 'handsontable';
import { Observable, Subscription } from 'rxjs';
import { SpreadsheetResource, Input } from 'src/app/common/interfaces/module.interface';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: ['./spreadsheet.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => SpreadsheetComponent) }]
})
export class SpreadsheetComponent extends TemplateComponent {

  contentData: SpreadsheetTemplateData['template_params_json'];

  sheet: SpreadsheetResource;

  settings: Handsontable.default.GridSettings;

  types: string[][];

  cellSettings: { editable: boolean; className: string; }[][];

  hiddenRows = [];

  visibleRows: number[];

  isRendered = false;

  renderedRows: undefined[];
  renderedCols: undefined[];

  input: Input;

  @ViewChild('hot') hot;

  init() {
    const contentData = this.data.data.template_params_json;

    this.input = this.getInput('spreadsheet', 1);

    this.visibleRows = this.textContent(contentData.visibleRows).split(',').reduce((rows, intv) => {
      const highLow = intv.split('-');
      for (let idx = Number(highLow[0]) - 1; idx <= Number(highLow[highLow.length - 1]) - 1; idx++) {
        rows.push(idx);
      }

      return rows;
    }, []);

    this.contentData = contentData;

    this.getSpreadsheetObservable().subscribe();

    this.renderedRows = Array(this.visibleRows.length).fill(undefined);
    this.renderedCols = Array(14).fill(undefined);
  }

  getSpreadsheetObservable() {
    return this.moduleService.getSpreadsheet(this.input, this.contentData.apiResource).pipe(
      tap(data => {
        this.cellSettings = data.data.map((row, rowIndex) => row.map((cell, cellIndex) => ({editable: false, className: ''})));

        this.types = data.data.map((row, rowIndex) => row.map((cell, cellIndex) => {
          if (null === cell) {
            return null;
          }

          let cellType = null;

          if (cell.match(/^[\.0-9]+\%$/)) {
            cell = parseFloat(cell).toString();
            cellType = 'percent';
          } else
          if (cell.match(/^\$[ ]{0,}[\.,0-9]+$/)) {
            cell = parseFloat(cell.split(/[^\.0-9]/).join('')).toString();
            cellType = 'currency';
          } else
          if (cell.match(/^[\.,0-9]+$/)) {
            cell = parseFloat(cell.split(/[^\.0-9]/).join('')).toString();
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

        this.cellSettings = Object.entries(data.meta.formatting).reduce((settings, [range, classNames]) => {
          if ('*' === range.substr(-1)) {
            range = range.slice(0, -1) + 'A-' + data.meta.maxColumn;
          }
          const rowRange = range.match(/[\-0-9]+/)[0].split('-');
          const colRange = range.split(/[0-9]/).join('').match(/[\-A-Z]+/)[0].split('-').filter(a => a);

          for (let col = colRange[0].charCodeAt(0) - 65; col <= colRange[colRange.length - 1].charCodeAt(0) - 65; col++) {
            for (let row = Number(rowRange[0]); row <= Number(rowRange[rowRange.length - 1]); row++) {
              settings[row - 1][col].className += ' ' + classNames;
            }
          }

          return settings;
        }, this.cellSettings);

        this.sheet = data;

        if (this.contentData.visibleRows) {
          this.hiddenRows = Array.from(Array(data.data.length).keys());

          this.visibleRows.forEach(idx => this.hiddenRows.splice(this.hiddenRows.indexOf(idx), 1));
        } else {
          this.hiddenRows = [];
        }

        this.settings = {
          autoRowSize: false,
          autoColumnSize: false,
          data: this.sheet.data,
          rowHeaders: false,
          colHeaders: false,
          cells: this.formatCell.bind(this),
          formulas: true,
          trimRows: this.hiddenRows,
          beforeChange: this.beforeChange.bind(this),
          afterChange: this.afterChange.bind(this),
          invalidCellClassName: 'invalidCell',
          colWidths: this.sheet.meta.colWidths,
          mergeCells: this.sheet.meta.mergeCells
                        .filter(cell => this.hiddenRows.indexOf(cell.row) === -1)
                        .map(cell => {
                          cell.row = this.visibleRows.indexOf(cell.row);
                          return cell;
                        }),
          viewportRowRenderingOffset: 0,
          viewportColumnRenderingOffset: 0,
          licenseKey: 'non-commercial-and-evaluation'
        };

        const rendered = () => {
          this.isRendered = true;

          Handsontable.default.hooks.remove('afterRender', rendered);
        };

        Handsontable.default.hooks.add('afterRender', rendered);
      }
    ));
  }

  getDescription() {
    return '';
  }

  getName() {
    return 'Spreadsheet';
  }

  formatCell(row, column, prop) {
    const cell = {} as any;

    const settings = this.cellSettings[row][column];

    cell.readOnly = !settings.editable;
    if (!cell.readOnly) {
      cell.className += ' editable';
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

    if (settings.className) {
      cell.className += ' ' + settings.className;
    }

    return cell;
  }

  beforeChange(changes, source) {
    if (source !== 'edit' && source !== 'Autofill.fill') {
      return;
    }

    for (let i = changes.length - 1; i >= 0; i--) {
      const change = changes[i];
      const newVal = change[3];

      const dataRow = this.visibleRows[change[0]];

      const tp = this.types[dataRow][change[1]];

      if (tp) {
        changes[i][3] = parseFloat(newVal) || 0;
      }

      changes[i][4] = changes[i][3];

      // % values need to be sent as decimals
      if ('percent' === tp) {
        changes[i][4] = changes[i][4] / 100;
      }
    }
  }

  afterChange(changes, source) {
    if (source !== 'edit' && source !== 'Autofill.fill') {
      return;
    }

    const hot = this.hot.hotInstance;

    const content = this.input.content ? JSON.parse(this.input.content) : {};

    changes.forEach(change => {
      const row = change[0];
      const col = change[1];

      const dataRow = this.visibleRows[row];

      content[dataRow] = content[dataRow] || {};
      content[dataRow][col] = change[4];

      hot.getCell(row, col).className += ' hot-saving';
    });

    this.input.content = JSON.stringify(content);

    this.moduleService.saveInput(this.input, '/xls?xls=' + this.contentData.apiResource).subscribe(_ =>
        this.getSpreadsheetObservable().subscribe(__ => {
          hot.updateSettings(this.settings);
        }));
  }
}
