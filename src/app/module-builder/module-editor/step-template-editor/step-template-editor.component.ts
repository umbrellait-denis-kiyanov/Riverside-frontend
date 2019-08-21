import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Step } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from '../../../common/services/module.service';

@Component({
  selector: 'app-step-template-editor',
  templateUrl: './step-template-editor.component.html',
  styleUrls: ['./step-template-editor.component.sass']
})
export class StepTemplateEditorComponent implements OnInit {

  @Input() step: Step;

  stepEdit: Step;

  templates: any;

  templateFields: any;

  templateConfig: any;

  initialized = false;

  constructor(public modal: NgbActiveModal,
              private moduleService: ModuleService) {}

  async ngOnInit() {
    this.stepEdit = JSON.parse(JSON.stringify(this.step));
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
    const fields = this.templates.
      filter(template => template.id === this.stepEdit.template_id).shift().params_json.
      replace(/\s/g, '').
      split(';').join(',').
      split('Array<').join('[').
      split('>').join(']').
      replace(/([_a-zA-Z0-9]+)/g, '"$1"').
      split(',}').join('}').
      split('{').join('[').
      split('}').join(']').
      split(',').join('],[').
      split(':').join(',').
      split('?').join('')
      ;

    this.templateFields = JSON.parse('[' + fields + ']');
    this.templateFields.push(['number_of_inputs', 'number']);
  }
}