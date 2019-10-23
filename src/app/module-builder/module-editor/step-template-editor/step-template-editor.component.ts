import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Step, Template } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from '../../../common/services/module.service';
import { Templates } from '../../../module-viewer/riverside-step-template/templates';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-step-template-editor',
  templateUrl: './step-template-editor.component.html',
  styleUrls: ['./step-template-editor.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class StepTemplateEditorComponent implements OnInit {

  @Input() step: Step;

  stepEdit: Step;

  templates$ = new BehaviorSubject<Template[]>(null);

  templateFields: any;

  templateConfig: any;

  description = '';

  constructor(public modal: NgbActiveModal,
              private moduleService: ModuleService) {}

  ngOnInit() {
    this.stepEdit = JSON.parse(JSON.stringify(this.step));
    if ('[]' === JSON.stringify(this.stepEdit.template_params_json)) {
      this.stepEdit.template_params_json = {};
    }

    this.moduleService.getTemplates(this.step.module_id).pipe(
      map(templates => templates.map(tpl => {
        const inst = new Templates[tpl.id]();
        tpl.name = inst.getName();
        tpl.description = inst.getDescription();
        tpl.hasInputs = inst.hasInputs();
        return tpl;
      }))
    ).subscribe(tpls => {
      this.templates$.next(tpls);
      this.onTemplateChange(this.stepEdit.template_component);
    });
  }

  save() {
    this.step.template_component = this.stepEdit.template_component;
    this.step.template_params_json = this.stepEdit.template_params_json;
    this.modal.close();
  }

  onTemplateChange(templateId: string) {
    const template = this.templates$.value.find(tpl => tpl.id === templateId);

    const fields = template ? template.params_json.
      replace(/\s/g, '').
      split(/inputs\:\s{0,}\[\]/).join('inputs:Array<{key: string}>').
      split(';').join(',').
      split('Array<').join('[').
      split('>').join(']').
      replace(/([_a-zA-Z0-9]+)/g, '"$1"').
      split(',}').join('}').
      split('{').join('[').
      split('}').join(']').
      split(',').join('],[').
      split(':').join(',').
      split('?').join('').
      split('\'').join('')
      : '';

    this.templateFields = JSON.parse('[' + fields + ']');

    if (template.hasInputs) {
      this.templateFields.push(['number_of_inputs', 'number']);
    }

    this.description = template ? template.description : '';
  }
}
