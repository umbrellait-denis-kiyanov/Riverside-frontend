import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class NgbStringAdapter extends NgbDateAdapter<string> {

  fromModel(date: string): NgbDateStruct {
    return date ? {
      year: parseInt(date.substr(0, 4), 10),
      month: parseInt(date.substr(5, 2), 10),
      day: parseInt(date.substr(8, 2), 10)
    } : null;
  }

  toModel(date: NgbDateStruct): string {
    return date ? date.year.toString() + '-' +
                  ('0' + date.month.toString()).substr(-2) + '-' +
                  ('0' + date.day.toString()).substr(-2) : null;
  }
}