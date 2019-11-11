import { Component, Input, OnChanges } from '@angular/core';
import { TemplateComponent } from '../../template-base.cass';
import { ModuleService } from 'src/app/common/services/module.service';
import { SegmentCriteria } from '../segment-criteria.interface';

@Component({
  selector: 'app-icp-input',
  templateUrl: './icp-input.component.html',
  styleUrls: ['./icp-input.component.sass']
})
export class IcpInputComponent implements OnChanges {

  @Input() mode: 'criteria' | 'weight' | 'score';
  @Input() inputPrefix;
  @Input() criterias;
  @Input() inputIndex: number;

  selectedGrades: {[criteriaIndex: number]: number} = {};

  constructor(private template: TemplateComponent,
              private moduleService: ModuleService) { }

  ngOnChanges() {
    if (Object.values(this.selectedGrades).length) {
      this.resetGradeSelection();
    }

    this.initGrades();
  }

  initGrades() {
    const inp = this.template.getInput(this.inputPrefix, this.inputIndex);
    this.selectedGrades = inp && inp.content ? JSON.parse(inp.content) : {};
  }

  syncGrade() {
    const input = this.template.getInput(this.inputPrefix, this.inputIndex);

    input.content = JSON.stringify(this.selectedGrades);

    this.moduleService.saveInput(input).subscribe();
  }

  gradeSum() {
    return Object.values(this.selectedGrades || {}).reduce((total, grade) => total + grade, 0);
  }

  allGradesSelected() {
    return Object.values(this.selectedGrades).filter(a => a !== null).length === this.criterias.length;
  }

  resetGradeSelection() {
    this.selectedGrades = {};
    this.syncGrade();
    this.initGrades();
  }

  getEmptyCriteria() {
    const emptyDef = JSON.stringify({content: '', comments_json: ''});
    return {name: JSON.parse(emptyDef), description: JSON.parse(emptyDef), weight: 0};
  }

  addCriteria() {
    if (this.criterias.length < 5) {
      this.criterias.push(this.getEmptyCriteria());
    }
  }

  removeCriteria(idx: number) {
    if (this.criterias.length > 3) {
      this.criterias.splice(idx, 1);
      this.syncCriteria();
    }
  }

  pointsSum(criteria: SegmentCriteria[]) {
    return criteria.reduce((sum, cr) => sum + (cr.weight || 0), 0);
  }

  allWeightsSelected(criteria: SegmentCriteria[]) {
    return !criteria.find(cr => !cr.weight);
  }

  syncCriteria() {
    const input = this.template.getInput('criteria', this.inputIndex);

    input.content = JSON.stringify(this.criterias.map(c =>
      ({description: {comments_json: c.description.comments_json, content: c.description.content},
        name:        {comments_json: c.name.comments_json, content: c.name.content},
        weight:      c.weight
      }))
    );

    this.moduleService.saveInput(input).subscribe();
  }
}
