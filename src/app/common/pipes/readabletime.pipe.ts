import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';
import 'moment-timezone';

@Pipe({
  name: 'readabletime'
})
export class ReadableTimePipe implements PipeTransform {
    noYearLocalFormat: string;

    getNoYearLocaleFormat() {
        if (!this.noYearLocalFormat) {
            this.noYearLocalFormat = moment
                .localeData()
                .longDateFormat('LL')
                .replace(/[,\/-/.]*\s*Y+\s*/, '')
                .trim()
                .replace(/ \[de\]$/, '') // Spanish
        }

        return this.noYearLocalFormat;
    }

    transform(datetime: string, forceFormat?: string) {
        moment.locale(window.navigator.language);

        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const d = tz ? moment(datetime).tz(tz) : moment(datetime);

        if (forceFormat) {
            return d.format(forceFormat);
        } else if (d.isSame(new Date(), 'day')) {
            return d.format('LT');
        } else if (d.isSame(new Date(), 'year')) {
            return d.format(this.getNoYearLocaleFormat());
        } else {
            return d.format('LL');
        }
    }
}
