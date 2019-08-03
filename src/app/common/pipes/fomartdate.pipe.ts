import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
@Pipe({
  name: 'formatdate'
})
export class FormatDatePipe implements PipeTransform {

  constructor() {}

  transform(date: string, format: 'MMM DD YYYY hh:mm:ssa') {
    return window.moment(date).format(format);
  }

}
