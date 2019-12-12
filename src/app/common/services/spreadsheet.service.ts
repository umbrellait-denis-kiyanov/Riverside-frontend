import { Injectable } from '@angular/core';
import { SpreadsheetResource, Input } from '../interfaces/module.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModuleService } from './module.service';

@Injectable()
export class SpreadsheetService {

    constructor(
        private httpClient: HttpClient,
        private moduleServide: ModuleService
    ) { }

    getSpreadsheet(input: Input, xlsFile: string, visibleRows?: number[], keepFormulas?: boolean): Observable<SpreadsheetResource> {
        return this.httpClient.get<SpreadsheetResource>(
            `${this.moduleServide.baseUrl}/${input.module_id}/org/${input.org_id}/input/${input.id}/xls?xls=` + xlsFile
            + (visibleRows.length ? '&rows=' + JSON.stringify(visibleRows) : '')
            + (keepFormulas ? '&keepFormulas=true' : '')
            );
    }

    exportXlsUrl(input: Input, xlsFile: string) {
        return `${this.moduleServide.baseUrl}/${input.module_id}/org/${input.org_id}/input/${input.id}/xls-export?xls=` + xlsFile;
    }
}