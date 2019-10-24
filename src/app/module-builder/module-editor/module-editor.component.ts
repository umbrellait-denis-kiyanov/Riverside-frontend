import { Component, OnInit } from '@angular/core';
import { Module, Step, Section } from '../../common/interfaces/module.interface';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from '../../common/services/module.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StepTemplateEditorComponent } from './step-template-editor/step-template-editor.component';
import { StepLinkEditorComponent } from './step-link-editor/step-link-editor.component';
import { Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import toastr from 'src/app/common/lib/toastr';

@Component({
  selector: 'app-module-editor',
  templateUrl: './module-editor.component.html',
  styleUrls: ['./module-editor.component.sass']
})
export class ModuleEditorComponent implements OnInit {
  moduleData: Module;
  sections: Section[];
  ready = false;
  saving: Subscription;
  lastSavedModule: string;

  hasChanges = () => {
    if (!this.moduleData) {
      return false;
    }

    this.moduleData.steps = this.generateStepsData();
    return this.lastSavedModule !== JSON.stringify(this.moduleData);
  }

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => this.moduleService.getModuleConfig(Number(params.id))),
      catchError(err => this.moduleService.getDefaultModule())
    ).subscribe(moduleData => {
      this.moduleData = moduleData;
      this.sections = this.getSections(moduleData) || [];
      this.ready = true;
      this.setPristineState();
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

  onClickAddSection() {
    const newSection = { section: this.newStep(), steps: [] };
    newSection.section.is_section_break = true;
    this.sections.push(newSection);
  }

  onClickRemoveSection(sectionIndex: number) {
    if (!confirm('Are you sure you want to remove this section? The following steps it contains will be removed as well: \n* ' +
    this.sections[sectionIndex].steps.map(step => step.description).join('\n* '))) { return; }
    this.sections.splice(sectionIndex, 1);
  }

  onClickSave() {
    this.moduleData.steps = this.generateStepsData();
    this.saving = this.moduleService.saveModule(this.moduleData).subscribe(_ => {
      this.setPristineState();
      toastr.success('Saved!');
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
    return (this.sections || []).reduce((steps, section: Section) => {
      steps.push(section.section);

      section.steps.forEach(step => steps.push(step));

      return steps;
    }, []);
  }

  setPristineState() {
    this.lastSavedModule = JSON.stringify(this.moduleData);
  }

  export() {
    window.location.href = this.moduleService.exportUrl();
  }

  sync() {
    if (prompt(`Data synchronization is a destructive action which will overwrite your current module and step configuration. Please make sure to export a data backup before proceeding. Are you sure you want to continue with the synchronization? Type "Yes" to confirm.`) !== 'Yes') {
      return;
    }

    this.moduleService.sync().subscribe((res) => {
      alert('Synchronization complete. The application will be reloaded to refresh your data.');
      window.location.reload();
    });
  }

  private newStep(): Step {
    return {
      description: '',
      is_section_break: false,
      id: 0,
      module_id: this.moduleData.id,
      requires_feedback: false,
      template_params_json: {},
      template_component: ''
    };
  }
}

