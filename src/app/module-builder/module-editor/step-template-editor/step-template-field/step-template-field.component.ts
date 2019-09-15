import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';

@Component({
  selector: 'app-step-template-field',
  templateUrl: './step-template-field.component.html',
  styleUrls: ['./step-template-field.component.sass']
})
export class StepTemplateFieldComponent implements OnInit {

  @Input() field: any;
  @Input() json: any;
  @Input() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() jsonChange: EventEmitter<string> = new EventEmitter<string>();

  name: string;
  type: any;

  hasSubFields = false;
  rtEditor: any;

  constructor() { }

  ngOnInit() {
    this.name = this.field[0];
    this.type = this.field[1];

    if ('string' === this.type) {
      // in case we still have some JSON data
      if (typeof this.json === 'object' && this.json !== null) {
        this.json = JSON.stringify(this.json);
        this.type = 'json';
      } else if (['title', 'sufix', 'input_sufix', 'key', 'question', 'option', 'behavior'].includes(this.name)) {
        this.type = 'text-input';
      } else {
        this.rtEditor = InlineEditor;
        this.json = this.json || '';
      }
    }

    if (this.type instanceof Array) {
      this.hasSubFields = true;

      if (!(this.json instanceof Array)) {
        this.json = [{}];
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
    if ('input_sufix' === this.name) {
      this.json = this.json.replace(/[\W]+/g, '');
    }

    this.jsonChange.emit(this.json);
  }

  onClickAddSubField() {
    this.json.push({});
  }

  onClickRemoveSubField(idx: number) {
    this.json.splice(idx, 1);
    this.valueChange();
  }
}
