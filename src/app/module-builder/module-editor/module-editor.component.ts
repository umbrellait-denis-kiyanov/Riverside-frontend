import { Component, OnInit } from '@angular/core';
import { Module, LearningElementTypes, Step, Section, LearningElement } from '../../common/interfaces/module.interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ModuleService } from '../../common/services/module.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StepTemplateEditorComponent } from './step-template-editor/step-template-editor.component';
import { StepLinkEditorComponent } from './step-link-editor/step-link-editor.component';

@Component({
  selector: 'app-module-editor',
  templateUrl: './module-editor.component.html',
  styleUrls: ['./module-editor.component.sass']
})
export class ModuleEditorComponent implements OnInit {
  moduleData: Module;
  sections: Section[];
  elementTypes = LearningElementTypes;
  ready = false;
  saving = false;
  lastSavedModule: string;

  hasChanges = () => {
    this.moduleData.steps = this.generateStepsData();
    return this.lastSavedModule !== JSON.stringify(this.moduleData);
  }

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.moduleService.loadModules({}).then(() => this.moduleService.selectModule(Number(params.id)).then(moduleData => {
        this.moduleData = moduleData;
        this.sections = this.getSections(moduleData);
        this.ready = true;
        this.setPristineState();
      }));
    });
  }

  onClickAddStep(sectionIndex: number) {
    this.sections[sectionIndex].steps.push(this.newStep());
  }

  onClickRemoveStep(sectionIndex: number, index: number) {
    if (!confirm('Are you sure you want to remove this step?')) { return; }
    this.sections[sectionIndex].steps.splice(index, 1);
  }

  onClickEditStepTemplate(sectionIndex: number, index: number) {
    const modalRef = this.modalService.open(StepTemplateEditorComponent,
        { windowClass: 'step-template-editor-modal', backdrop: 'static' });
    modalRef.componentInstance.step = this.sections[sectionIndex].steps[index];
  }

  onClickEditSectionTemplate(sectionIndex: number) {
    const modalRef = this.modalService.open(StepTemplateEditorComponent,
        { windowClass: 'section-template-editor-modal', backdrop: 'static' });
    modalRef.componentInstance.step = this.sections[sectionIndex].section;
  }

  onClickLinkStep(sectionIndex: number, index: number) {
    const modalRef = this.modalService.open(StepLinkEditorComponent,
      { windowClass: 'step-link-editor-modal', backdrop: 'static' });

    if (index === undefined) {
      modalRef.componentInstance.step = this.sections[sectionIndex].section;
    } else {
      modalRef.componentInstance.step = this.sections[sectionIndex].steps[index];
    }

    modalRef.componentInstance.module = this.moduleData;
  }

  onClickAddSection(sectionIndex: number) {
    const newSection = { section: this.newStep(), steps: [] };
    newSection.section.is_section_break = true;
    this.sections.push(newSection);
  }

  onClickRemoveSection(sectionIndex: number) {
    if (!confirm('Are you sure you want to remove this section? The following steps it contains will be removed as well: \n* ' +
    this.sections[sectionIndex].steps.map(step => step.description).join('\n* '))) { return; }
    this.sections.splice(sectionIndex, 1);
  }

  onClickAddElement(step: Step) {
    if (!step.elements) {
      step.elements = [];
    }
    step.elements.push(this.newElement());
  }

  onClickRemoveElement(step: Step, index: number) {
    if (!confirm('Are you sure you want to remove this learning element?')) { return; }
    step.elements.splice(index, 1);
  }

  onClickSave() {
    this.saving = true;
    this.moduleData.steps = this.generateStepsData();
    this.moduleService.saveModule(this.moduleData)
    .finally(() => {
      this.saving = false;
      this.setPristineState();
    });
  }

  onSectionDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

  onStepDrop(event: CdkDragDrop<string[]>) {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
  }

  getSortableListIDs(): string[] {
    return Array.from(this.sections.keys()).map(id => 'drop-' + id);
  }

  getSections(moduleData: Module): Section[] {
    return moduleData.steps.
      reduce((sections, step) => {
        if (step.is_section_break) {
          sections.push({section: step, steps: []});
        } else {
          sections[sections.length - 1].steps.push(step);
        }
        return sections;
      }, []);
  }

  generateStepsData(): Step[] {
    return this.sections.reduce((steps, section: Section) => {
      steps.push(section.section);

      section.steps.forEach(step => steps.push(step));

      return steps;
    }, []);
  }

  setPristineState() {
    this.lastSavedModule = JSON.stringify(this.moduleData);
  }

  private newStep(): Step {
    return {
      description: '',
      elements: [],
      is_section_break: false,
      id: 0,
      module_id: this.moduleData.id,
      requires_feedback: false,
      template_params_json: {},
      template_component: ''
    };
  }

  private newElement(): LearningElement {
    return {
      type: 'pdf',
      data: ''
    };
  }
}

