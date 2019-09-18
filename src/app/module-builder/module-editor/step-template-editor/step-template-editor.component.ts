import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Step } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from '../../../common/services/module.service';

@Component({
  selector: 'app-step-template-editor',
  templateUrl: './step-template-editor.component.html',
  styleUrls: ['./step-template-editor.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class StepTemplateEditorComponent implements OnInit {

  @Input() step: Step;

  stepEdit: Step;

  templates: any;

  templateFields: any;

  templateConfig: any;

  initialized = false;

  description: '';

  constructor(public modal: NgbActiveModal,
              private moduleService: ModuleService) {}

  async ngOnInit() {
    this.stepEdit = JSON.parse(JSON.stringify(this.step));
    if ('[]' === JSON.stringify(this.stepEdit.template_params_json)) {
      this.stepEdit.template_params_json = {};
    }

    this.templates = await this.moduleService.getTemplates(this.step.module_id);
    this.onTemplateChange();
    this.initialized = true;
  }

  save() {
    this.step.template_id = this.stepEdit.template_id;
    this.step.template_params_json = this.stepEdit.template_params_json;
    this.modal.close();
  }

  onTemplateChange() {
    const template = this.templates.filter(tpl => tpl.id === this.stepEdit.template_id).shift();
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
    this.templateFields.push(['number_of_inputs', 'number']);
    this.description = template ? template.description : '';
  }
}