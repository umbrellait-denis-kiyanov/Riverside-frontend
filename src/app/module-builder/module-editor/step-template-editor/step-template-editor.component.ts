import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Step, Template } from 'src/app/common/interfaces/module.interface';
import { Templates } from '../../../module-viewer/riverside-step-template/templates';
import { TemplateField } from './step-template-field';

@Component({
  selector: 'app-step-template-editor',
  templateUrl: './step-template-editor.component.html',
  styleUrls: ['./step-template-editor.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class StepTemplateEditorComponent implements OnInit {
  @Input() step: Step;

  stepEdit: Step;

  templates: Template[];

  templateFields: TemplateField[];

  description = '';

  constructor(public modal: NgbActiveModal) {}

  ngOnInit() {
    this.stepEdit = JSON.parse(JSON.stringify(this.step));
    if ('[]' === JSON.stringify(this.stepEdit.template_params_json)) {
      this.stepEdit.template_params_json = {};
    }

    this.templates = Object.keys(Templates).map(id => {
      const inst = new Templates[id]();

      return {
        id,
        name: inst.getName(),
        description: inst.getDescription(),
        hasInputs: inst.hasInputs(),
        params_json: inst.getBuilderParams()
      };
    });
    this.onTemplateChange(this.stepEdit.template_component);
  }

  save() {
    this.step.template_component = this.stepEdit.template_component;
    this.step.template_params_json = this.stepEdit.template_params_json;
    this.modal.close();
  }

  onTemplateChange(templateId: string) {
    const template = this.templates.find(tpl => tpl.id === templateId);

    const fields = template
      ? template.params_json
          .replace(/\s/g, '')
          .split(/inputs\:\s{0,}\[\]/)
          .join('inputs:Array<{key: string}>')
          .split(';')
          .join(',')
          .split('Array<')
          .join('[')
          .split('>')
          .join(']')
          .replace(/([_a-zA-Z0-9]+)/g, '"$1"')
          .split(',}')
          .join('}')
          .split('{')
          .join('[')
          .split('}')
          .join(']')
          .split(',')
          .join('],[')
          .split(':')
          .join(',')
          .split('?')
          .join('')
          .split("'")
          .join('')
          .split('|')
          .join(',')
      : '';

    this.templateFields = JSON.parse('[' + fields + ']').map(field =>
      field.length === 2 ? field : [field[0], field.slice(1)]
    );

    if (template.hasInputs && !fields.includes('number_of_inputs')) {
      this.templateFields.push(['number_of_inputs', 'number']);
    }

    this.description = template ? template.description : '';
  }
}
