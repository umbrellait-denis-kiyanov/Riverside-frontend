import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'builderSelectOption'
})
export class BuilderSelectOptionPipe implements PipeTransform {

  transform(value: string): string {
    return value ? value.replace(/_/g, ' ') : value;
  }

}
