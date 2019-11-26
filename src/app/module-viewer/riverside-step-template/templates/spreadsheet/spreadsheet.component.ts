import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { SpreadsheetTemplateData } from './spreadsheet.interface';
import * as Handsontable from 'handsontable';
import { Observable, Subscription } from 'rxjs';
import { CsvResource } from 'src/app/common/interfaces/module.interface';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: ['./spreadsheet.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => SpreadsheetComponent) }]
})
export class SpreadsheetComponent extends TemplateComponent {

  contentData: SpreadsheetTemplateData['template_params_json'];

  csvSub: Subscription;

  csv: CsvResource;

  types: string[][];

  init() {
    this.csvSub = this.moduleService.getCsv(0, this.data.data.template_params_json.apiResource)
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

                      this.csv = data;

                      console.log(this.types);

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
