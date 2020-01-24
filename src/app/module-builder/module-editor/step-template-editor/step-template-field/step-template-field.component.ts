import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, of } from 'rxjs';
import { ModuleService } from '../../../../common/services/module.service';
import { TemplateField } from '.';
import { map } from 'rxjs/operators';

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
  // should be Observable<[string | number, string][]> but TS 3.1 doesn't like it
  selectValues$: Observable<string[][]>;

  hasSubFields = false;
  rtEditor = InlineEditor;

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

    if (this.type === 'Module') {
      this.type = 'select';
      this.selectValues$ = this.moduleService.getModules().pipe(
        map(modules => modules.map(module => [module.id.toString(), module.name]))
      );
    }

    if (this.type instanceof Array) {
      if (this.name.substr(-7) === '_select') {
        this.selectValues$ = of(this.type.map(val => [val, val]));
        this.type = 'select';
      } else {
        this.hasSubFields = true;

        if (!(this.json instanceof Array)) {
          this.json = [{}];
        }
      }
    }

    if (this.name.substr(0, 11) === 'apiResource') {
      this.type = 'select';
      this.selectValues$ = this.moduleService.getTemplateResources(0, 'spreadsheet').pipe(
        map(resources => resources.map(resource => [resource, resource]))
      );
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
