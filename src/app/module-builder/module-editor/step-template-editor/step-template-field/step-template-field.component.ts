import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { ModuleService } from '../../../../common/services/module.service';
import { TemplateField } from '.';

@Component({
  selector: 'app-step-template-field',
  templateUrl: './step-template-field.component.html',
  styleUrls: ['./step-template-field.component.sass']
})
export class StepTemplateFieldComponent implements OnInit {

  @Input() field: TemplateField;
  @Input() json: any; // @todo - a hot mess that somehow works
  @Input() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() jsonChange: EventEmitter<string> = new EventEmitter<string>();

  name: TemplateField[0];
  type: TemplateField[1];
  selectValues: string[];

  hasSubFields = false;
  rtEditor = InlineEditor;

  resourceValue$: Observable<string[]>;

  constructor(private moduleService: ModuleService) { }

  ngOnInit() {
    this.name = this.field[0];
    this.type = this.field[1];

    if ('string' === this.type) {
      // in case we still have some JSON data
      if (typeof this.json === 'object' && this.json !== null) {
        this.json = JSON.stringify(this.json);
        this.type = 'json';
      } else if (['title', 'sufix', 'input_sufix', 'key', 'question', 'option', 'behavior', 'image'].includes(this.name) ||
                  this.name.toLowerCase().indexOf('url') > -1) {
        this.type = 'text-input';
      } else {
        this.json = this.json || '';
      }
    }

    if (this.type instanceof Array) {
      if (this.name.substr(-7) === '_select') {
        this.selectValues = this.type;
        this.type = 'select';
      } else {
        this.hasSubFields = true;

        if (!(this.json instanceof Array)) {
          this.json = [{}];
        }
      }
    }

    if (this.name.substr(0, 11) === 'apiResource') {
      this.type = 'resource';
      this.resourceValue$ = this.moduleService.getTemplateResources(0, 'spreadsheet');
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

  onSubValueDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.json, event.previousIndex, event.currentIndex);
  }
}
