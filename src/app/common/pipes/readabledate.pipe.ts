import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'readabledate'
})
export class ReadableDatePipe implements PipeTransform {
  transform(date: string) {
    const d = moment(date);

    if (d.isSame(new Date(), 'day')) {
        return 'Today';
    } else if (d.isSame(new Date(), 'year')) {
        return d.format('MMM D');
    } else {
        return d.format('MMM D, YYYY');
    }
  }
}
