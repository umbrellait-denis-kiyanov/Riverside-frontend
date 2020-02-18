import { Pipe, PipeTransform } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Pipe({
  name: 'canModify'
})
export class CanModifyPipe implements PipeTransform {
  transform(
    response: HttpResponse<any>,
    header: string = 'X-Can-Modify'
  ): boolean {
    if (!response) {
      return false;
    }

    switch ((response.headers.get(header) || '').toLowerCase().trim()) {
      case 'true':
      case 'yes':
      case '1':
        return true;
      case 'false':
      case 'no':
      case '0':
      case null:
        return false;
      default:
        return false;
    }
  }
}
