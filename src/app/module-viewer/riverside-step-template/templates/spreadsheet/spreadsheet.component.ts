import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { SpreadsheetTemplateData } from './spreadsheet.interface';
import * as Handsontable from 'handsontable';
import { Observable } from 'rxjs';
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

  csv$: Observable<CsvResource>;

  csv: CsvResource;

  types

  init() {
    console.log(this.data.data.template_params_json.apiResource);
    this.csv$ = this.moduleService.getCsv(0, this.data.data.template_params_json.apiResource)
                  .pipe(tap(data => {
                    this.csv = data;
                    this.types = data.data.reduce((rows, row) => {

                      return rows;
                    }, {});
                    console.log(data);
                  }));
  }

  getDescription() {
    return '';
  }

  getName() {
    return 'Spreadsheet';
  }

  formatCell(row, column, data, smth, snth2) {
    console.log(row, column, data, smth, snth2);

    return {};
  }
}
