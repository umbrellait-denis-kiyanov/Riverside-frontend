import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Step } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from '../../../common/services/module.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-step-template-editor',
  templateUrl: './step-template-editor.component.html',
  styleUrls: ['./step-template-editor.component.sass']
})
export class StepTemplateEditorComponent implements OnInit {

  @Input() step: Step;

  stepEdit: Step;

  templates$: Observable<object>;

  constructor(public modal: NgbActiveModal,
              private moduleService: ModuleService) {}

  ngOnInit() {
    this.stepEdit = JSON.parse(JSON.stringify(this.step));
    this.templates$ = this.moduleService.getTemplates(this.step.module_id);
  }

  save() {
    this.step.template_id = this.stepEdit.template_id;
    this.step.template_params_json = this.stepEdit.template_params_json;
    this.modal.close();
  }
}