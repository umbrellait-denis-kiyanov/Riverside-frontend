import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { SpreadsheetTemplateData } from './spreadsheet.interface';
import * as Handsontable from 'handsontable';
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

  types: string[][];

  hiddenRows = {
    rows: [],
  };

  init() {
    const contentData = this.data.data.template_params_json;
    this.sheetSub = this.moduleService.getSpreadsheet(0, contentData.apiResource)
                  .pipe(
                    tap(data => {
                      this.types = data.data.map((row, rowIndex) => row.map((cell, cellIndex) => {
                        if (null === cell) {
                          return null;
                        }

                        let cellType = null;

                        if (cell.match(/^[0-9]+\%$/)) {
                          cell = parseInt(cell, 10).toString();
                          cellType = 'percent';
                        } else
                        if (cell.match(/^\$[,0-9]+$/)) {
                          cell = parseInt(cell.split(/[^0-9]/).join(''), 10).toString();
                          cellType = 'currency';
                        }

                        data.data[rowIndex][cellIndex] = cell;

                        return cellType;
                      }));

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

  formatCell(row, column, data, smth, snth2) {
    // console.log(row, column, data, smth, snth2);

    return {};
  }
}
