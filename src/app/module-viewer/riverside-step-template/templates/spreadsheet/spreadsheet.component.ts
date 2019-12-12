import { Component, forwardRef, ViewChild } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { SpreadsheetTemplateData } from './spreadsheet.interface';
import * as Handsontable from 'handsontable';
import { Subscription } from 'rxjs';
import { SpreadsheetResource, Input } from 'src/app/common/interfaces/module.interface';
import { tap } from 'rxjs/operators';
import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import { SpreadsheetService } from 'src/app/common/services/spreadsheet.service';

class PercentageEditor extends Handsontable.default.editors.TextEditor {
  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue * 100, cellProperties);
  }

  getValue() {
    return (parseFloat(this.TEXTAREA.value) / 100) || 0;
  }
}

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
  rounding: number[][];

  cellSettings: { editable: boolean; className: string; renderer: string; validator?: () => boolean }[][];

  visibleRows: number[];

  isRendered = false;

  previewRows: undefined[];
  previewCols: undefined[];

  input: Input;

  keepFormulas: boolean;
  downloadProgress: boolean;

  @ViewChild('hot') hot;
  @ViewChild('widthContainer') widthContainer;

  watchMenuExpand: Subscription;

  spreadsheetService: SpreadsheetService;

  init() {
    this.spreadsheetService = this.injectorObj.get(SpreadsheetService);

    const contentData = this.data.data.template_params_json;

    this.input = this.getInput('spreadsheet', 1);

    const visibleRowConfig = this.textContent(contentData.visibleRows);
    this.visibleRows = visibleRowConfig ? visibleRowConfig.split(',').reduce((rows, intv) => {
      const highLow = intv.split('-');
      for (let idx = Number(highLow[0]) - 1; idx <= Number(highLow[highLow.length - 1]) - 1; idx++) {
        rows.push(idx);
      }

      return rows;
    }, []) : [];

    this.contentData = contentData;

    this.keepFormulas = this.visibleRows.length > 0 && !this.contentData.calculateFormulasOnServer;

    this.getSpreadsheetObservable().subscribe();

    this.previewRows = Array(this.visibleRows.length || 50).fill(undefined);
    this.previewCols = Array(14).fill(undefined);

    this.injectorObj.get(LeftMenuService).onExpand.pipe(this.whileExists()).subscribe((state: boolean) => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  getRealRow(fullIndex) {
    const idx = this.visibleRows.length ? this.visibleRows.indexOf(fullIndex) : fullIndex;
    return idx > -1 ? idx : null;
  }

  getSpreadsheetObservable() {
    return this.spreadsheetService.getSpreadsheet(this.input, this.contentData.apiResource, this.visibleRows, this.keepFormulas).pipe(
      tap(data => {
        if (!(data.data instanceof Array)) {
          data.data = [];
        }

        this.cellSettings = data.data.map((row) => row.map(() => ({editable: false, className: '', renderer: ''})));

        this.types = data.data.map((row, rowIndex) => row.map((cell, cellIndex) => {
          if (null === cell) {
            return null;
          }

          let cellType = null;

          if (cell.match(/^[\.0-9]+\%$/)) {
            cell = (parseFloat(cell) / 100).toString();
            cellType = 'percent';
          } else
          if (cell.match(/^\$[ ]{0,}[\.,0-9]+$/)) {
            cell = parseFloat(cell.split(/[^\.0-9]/).join('')).toString();
            cellType = 'currency';
          } else
          if (cell.match(/^[\.,0-9]+$/)) {
            cell = parseFloat(cell.split(/[^\.0-9]/).join('')).toString();
            cellType = 'numeric';
          } else
          if (cell.substr(0, 1) === '=') {
            cellType = 'numeric';
          }

          data.data[rowIndex][cellIndex] = cell;

          return cellType;
        }));

        this.rounding = data.data.map((row, rowIndex) => row.map((cell, cellIndex) => 2));

        const types = {p: 'percent', 'c': 'currency', 'n': 'numeric'};
        data.types.forEach((row, rowIndex) =>
          row.forEach((type, cellIndex) => {
            if (type.length == 2) {
              this.types[rowIndex][cellIndex] = types[type[0]];
              this.rounding[rowIndex][cellIndex] = Number(type[1]);
            }
          })
        );

        this.cellSettings = data.meta.editable.reduce((editable, range) => {
          const row = this.getRealRow(parseInt(range, 10) - 1);

          if (row === null) {
            return editable;
          }

          const cellRange = range.split(/[0-9]/).join('').split('-');

          for (let idx = cellRange[0].charCodeAt(0) - 65; idx <= cellRange[cellRange.length - 1].charCodeAt(0) - 65; idx++) {
            editable[row][idx].editable = true;
          }

          return editable;
        }, this.cellSettings);

        const metaConfig = (field: string, callback) => {
          this.cellSettings = Object.entries(data.meta[field]).reduce((settings, [range, value]) => {
            if ('*' === range.substr(-1)) {
              range = range.slice(0, -1) + 'A-' + data.meta.maxColumn;
            }
            const rowRange = range.match(/[\-0-9]+/)[0].split('-');
            const colRange = range.split(/[0-9]/).join('').match(/[\-A-Z]+/)[0].split('-').filter(a => a);

            for (let col = colRange[0].charCodeAt(0) - 65; col <= colRange[colRange.length - 1].charCodeAt(0) - 65; col++) {
              for (let row = Number(rowRange[0]); row <= Number(rowRange[rowRange.length - 1]); row++) {
                const realRow = this.getRealRow(row - 1);
                if (realRow !== null) {
                  callback(settings[realRow][col], value, realRow, col);
                }
              }
            }

            return settings;
          }, this.cellSettings);
        };

        metaConfig('types', (cell, type, row, col) => this.types[row][col] = type);
        metaConfig('formatting', (cell, classNames) => cell.className += ' ' + classNames);
        metaConfig('renderer', (cell, renderer) => cell.renderer = renderer);
        metaConfig('requireValue', (cell, value) => cell.validator = (cellValue, cb) => {
          cb(value == cellValue || (Math.abs(Number(value) - Number(cellValue)) < 0.0001));
        });

        this.sheet = data;

        const totalWidth = data.meta.colWidths.reduce((a, b) => a + b);

        this.settings = {
          autoRowSize: false,
          autoColumnSize: false,
          data: this.sheet.data,
          rowHeaders: false,
          colHeaders: false,
          cells: this.formatCell.bind(this),
          formulas: true,
          afterRender: (() => {
            this.isRendered = true;
            setTimeout(_ => this.hot.hotInstance.validateCells());
          }).bind(this),
          beforeChange: this.beforeChange.bind(this),
          afterChange: this.afterChange.bind(this),
          beforeKeyDown: ((event) => {
            if (46 === event.keyCode || 8 === event.keyCode) {
              event.stopImmediatePropagation();
              (event as any).realTarget.value = '0';
              const hot = this.hot.hotInstance;
              hot.getSelected().forEach(sel => hot.setDataAtCell(sel[0], sel[1], 0));
            }
          }).bind(this),
          invalidCellClassName: 'invalidCell',
          rowHeights: () => this.widthContainer.nativeElement.clientWidth / 46,
          colWidths: ((col) => {
            return data.meta.colWidths[col] * ((this.widthContainer.nativeElement.clientWidth + 20) / totalWidth);
          }).bind(this),
          mergeCells: this.sheet.meta.mergeCells
                        .filter(cell => this.getRealRow(cell.row) !== null)
                        .map(cell => {
                          cell.row = this.getRealRow(cell.row);
                          return cell;
                        }),
          licenseKey: 'non-commercial-and-evaluation'
        };
      }
    ));
  }

  getDescription() {
    return '';
  }

  getName() {
    return 'Spreadsheet';
  }

  validate() {
    return !this.hot.container.nativeElement.querySelector('td.invalidCell:not(.dontValidate)');
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
          pattern: {
            thousandSeparated: true,
            optionalMantissa: true,
            output: "currency"
          },
          culture: 'en-US'
        };
      } else if ('percent' === tp) {
        cell.numericFormat = {
          pattern: {
            trimMantissa: true,
            output: "percent",
            thousandSeparated: true,
          }
        };

        cell.editor = PercentageEditor;

        cell.className += ' percent';
      } else if ('numeric' === tp) {
        cell.numericFormat = {
          pattern: {
            thousandSeparated: true,
            optionalMantissa: true,
          }
        };
      }

      if (cell.numericFormat) {
        cell.numericFormat.pattern.mantissa = this.rounding[row][column];
      }
    }

    if (settings.className) {
      cell.className += ' ' + settings.className;
    }

    if (settings.renderer) {
      cell.renderer = this[settings.renderer].bind(this);
    }

    if (settings.validator) {
      cell.validator = settings.validator;
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
      const row = change[0];

      const tp = this.types[row][change[1]];

      if (tp) {
        changes[i][3] = parseFloat(newVal) || 0;
      }

      changes[i][4] = changes[i][3];
    }
  }

  afterChange(changes, source) {
    if (source !== 'edit' && source !== 'Autofill.fill') {
      return;
    }

    if (!changes.filter(change => change[2] != change[3]).length) {
      return;
    }

    const reloadData = !this.keepFormulas;

    const content = this.input.content ? JSON.parse(this.input.content) : {};

    changes.forEach(change => {
      const row = change[0];
      const col = change[1];

      const dataRow = this.visibleRows.length ? this.visibleRows[row] : row;

      content[dataRow] = content[dataRow] || {};
      content[dataRow][col] = change[4];

      if (reloadData) {
        this.hot.hotInstance.getCell(row, col).className += ' hot-saving';
      }
    });

    this.input.content = JSON.stringify(content);

    this.moduleService.saveInput(this.input).subscribe(_ => {
      if (reloadData) {
        this.getSpreadsheetObservable().subscribe(__ => {
          this.hot.hotInstance.updateSettings(this.settings);
        });
      }
    });
  }

  aboveBelowQuota(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.default.renderers.NumericRenderer.apply(this, arguments);
    td.style.fontWeight = 'bold';

    if ('Above Quota' === this.sheet.data[7][5]) {
      td.style.color = 'green';
      td.style.background = '#CEC';
    } else {
      td.style.color = 'white';
      td.style.background = '#C00';
    }
  }

  formulaError(instance, td, row, col, prop, value, cellProperties) {
    if (value && value.substr && value.substr(0, 1) == '#') {
      arguments[5] = 0;
      td.className += 'dontValidate';
    }

    Handsontable.default.renderers.NumericRenderer.apply(this, arguments);
  }

  exportXls() {
    this.downloadProgress = true;
    window.location.href = this.spreadsheetService.exportXlsUrl(this.input, this.contentData.apiResource);

    setTimeout(_ => this.downloadProgress = false, 3000);
  }
}
