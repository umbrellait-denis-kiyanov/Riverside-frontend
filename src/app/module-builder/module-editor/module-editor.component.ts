import { Component, OnInit } from '@angular/core';
import { Module, LearningElementTypes, Step, LearningElement } from './module.interface';
import { modules } from '../mockData';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ModuleService } from '../module.service';

@Component({
  selector: 'app-module-editor',
  templateUrl: './module-editor.component.html',
  styleUrls: ['./module-editor.component.sass']
})
export class ModuleEditorComponent implements OnInit {
  moduleData: Module;
  elementTypes = LearningElementTypes;
  ready = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.moduleService.loadModules({}).then(() => this.moduleService.selectModule(Number(params.id)).then(moduleData => {
        this.moduleData = moduleData;
        this.ready = true;
      }));

    });
  }

  onClickAddStep() {
    this.moduleData.steps.push(this.newStep());
  }

  onClickRemoveStep(index: number) {
    if (!confirm('Are you sure you want to remove this step?')) { return; }
    this.moduleData.steps.splice(index, 1);
  }

  onClickAddElement(step: Step) {
    step.elements.push(this.newElement());
  }

  onClickRemoveElement(step: Step, index: number) {
    if (!confirm('Are you sure you want to remove this learning element?')) { return; }
    step.elements.splice(index, 1);
  }

  onClickSave() {
    this.saving = true;
    this.moduleService.saveModule(this.moduleData)
    .finally(() => {
      this.saving = false;
    });
  }

  private newStep(): Step {
    return {
      description: '',
      elements: []
    };
  }

  private newElement(): LearningElement {
    return {
      type: 'pdf',
      data: ''
    };
  }
}

