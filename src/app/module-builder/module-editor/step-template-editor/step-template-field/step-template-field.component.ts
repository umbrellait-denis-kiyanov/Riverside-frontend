import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step-template-field',
  templateUrl: './step-template-field.component.html',
  styleUrls: ['./step-template-field.component.sass']
})
export class StepTemplateFieldComponent implements OnInit {

  @Input() section: string;
  @Input() index: number;
  @Input() field: any;
  @Input() json: string;
  @Input() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() jsonChange: EventEmitter<string> = new EventEmitter<string>();

  name: string;
  type: any;
  value: any;

  hasSubFields = false;

  constructor() { }

  ngOnInit() {
    this.name = this.field[0];
    this.type = this.field[1];

    let json = JSON.parse(this.json);

    if (this.section) {
      json = ((json[this.section] || [])[this.index]) || {};
    }
    this.value = json[this.name];

    if ('string' === this.type) {
      // in case we still have some JSON data
      if (typeof this.value !== 'string') {
        this.value = JSON.stringify(this.value);
      }

      if (['title', 'sufix', 'input_sufix'].includes(this.name)) {
        this.type = 'text-input';
      }
    }

    if (this.type instanceof Array) {
      this.hasSubFields = true;

      if (!(this.value instanceof Array)) {
        this.value = [{}];
      }
    }
  }

  fieldTitle(fieldName: string) {
    return fieldName.
      split(/(?=[A-Z])/).join(' ').
      split('_').
      map(word => word[0].toUpperCase() + word.substr(1)).
      join(' ');
  }

  valueChange() {
    const json = JSON.parse(this.json);

    if (this.section) {
      if (!json[this.section]) {
        json[this.section] = [];
      }
      if (!json[this.section][this.index]) {
        json[this.section][this.index] = {};
      }

      json[this.section][this.index][this.name] = this.value;

    } else {
      json[this.name] = this.value;
    }

    this.jsonChange.emit(JSON.stringify(json));
  }

  subValueChange() {
    this.jsonChange.emit(JSON.stringify(JSON.parse(this.json)));
  }

  onClickAddSubField() {
    this.value.push({});
  }

  onClickRemoveSubField(idx: number) {
    this.value.splice(idx, 1);
    this.valueChange();
  }
}
