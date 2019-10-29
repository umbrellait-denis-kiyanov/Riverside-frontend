import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'builderSelectOption'
})
export class BuilderSelectOptionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value? value.replace(/_/g, " ") : value;
  }

}
