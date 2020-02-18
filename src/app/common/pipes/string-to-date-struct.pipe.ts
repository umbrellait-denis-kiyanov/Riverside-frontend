import { Pipe, PipeTransform } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Pipe({
  name: 'stringToDateStruct'
})
export class StringToDateStructPipe implements PipeTransform {
  constructor(private ngbDateAdapter: NgbDateAdapter<string>) {}

  transform(value: string): NgbDateStruct {
    return this.ngbDateAdapter.fromModel(value);
  }
}
