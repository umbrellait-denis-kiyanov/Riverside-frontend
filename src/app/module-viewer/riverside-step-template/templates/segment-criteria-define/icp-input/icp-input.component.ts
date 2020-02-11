import { Component, Input, OnChanges } from '@angular/core';
import { TemplateComponent } from '../../template-base.class';
import { ModuleService } from 'src/app/common/services/module.service';
import { SegmentCriteria } from '..';

@Component({
  selector: 'app-icp-input',
  templateUrl: './icp-input.component.html',
  styleUrls: ['./icp-input.component.sass']
})
export class IcpInputComponent implements OnChanges {
  @Input() mode: 'criteria' | 'weight' | 'grade';
  @Input() inputPrefix;
  @Input() criterias;
  @Input() inputIndex: number;
  @Input() review = false;
  @Input() gradeLevels: { A: number; B: number; C: number; D: number };

  selectedGrades: { [criteriaIndex: number]: number } = {};

  calcWeightSum = 0;
  calcAllWeightsSelected = false;
  calcGradeSum = 0;
  calcAllGradesSelected = false;

  constructor(
    public template: TemplateComponent,
    private moduleService: ModuleService
  ) {}

  ngOnChanges() {
    if (Object.values(this.selectedGrades).length) {
      this.resetGradeSelection();
    }

    this.initGrades();
    this.syncCriteria(true, true);
  }

  initGrades() {
    const inp = this.template.getInput(this.inputPrefix, this.inputIndex, '');
    this.selectedGrades = inp && inp.content ? JSON.parse(inp.content) : {};

    // in case the grade weight has been changed, make sure previously set values don't exceed the new threshold
    this.selectedGrades = Object.entries(this.selectedGrades).reduce(
      (grades, entry) => {
        grades[entry[0]] = Math.min(entry[1], this.criterias[entry[0]].weight);

        return grades;
      },
      {}
    );

    this.syncGrade(true);
  }

  syncGrade(onlyCalculate = false) {
    this.calcGradeSum = this.gradeSum();
    this.calcAllGradesSelected = this.allGradesSelected();

    if (this.calcAllGradesSelected) {
      const input = this.template.getInput(
        this.inputPrefix,
        this.inputIndex,
        ''
      );

      input.content = JSON.stringify(this.selectedGrades);

      this.moduleService.saveInput(input).subscribe();
    }
  }

  gradeSum() {
    return Object.values(this.selectedGrades || {}).reduce(
      (total, grade) => total + grade,
      0
    );
  }

  allGradesSelected() {
    return (
      this.criterias &&
      Object.values(this.selectedGrades).filter(a => a !== null).length ===
        this.criterias.length
    );
  }

  resetGradeSelection() {
    this.selectedGrades = {};
    this.syncGrade();
    this.initGrades();
  }

  getEmptyCriteria() {
    const emptyDef = JSON.stringify({ content: '', comments_json: '' });

    return {
      name: JSON.parse(emptyDef),
      description: JSON.parse(emptyDef),
      weight: 0
    };
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
    return criteria
      ? criteria.reduce((sum, cr) => sum + (cr.weight || 0), 0)
      : 0;
  }

  allWeightsSelected(criteria: SegmentCriteria[]) {
    return criteria ? !criteria.find(cr => !cr.weight) : false;
  }

  syncCriteria(validateWeight = false, onlyCalculate = false) {
    const input = this.template.getInput('criteria', this.inputIndex);

    this.calcWeightSum = this.pointsSum(this.criterias);
    this.calcAllWeightsSelected = this.allWeightsSelected(this.criterias);

    if (validateWeight) {
      if (!this.calcAllWeightsSelected && this.calcWeightSum !== 100) {
        return;
      }
    }

    if (!onlyCalculate) {
      input.content = JSON.stringify(
        this.criterias.map(c => ({
          description: {
            comments_json: c.description.comments_json,
            content: c.description.content
          },
          name: {
            comments_json: c.name.comments_json,
            content: c.name.content
          },
          weight: c.weight || 0
        }))
      );

      this.moduleService.saveInput(input).subscribe();
    }
  }

  validate() {
    if ('criteria' === this.mode) {
      return this.criterias.reduce((isValid, criteria) => {
        ['name', 'description'].forEach(field => {
          this.template.decorateInput(criteria[field]);
          if (!this.template.validateInput(criteria[field])) {
            isValid = false;
          }
        });

        return isValid;
      }, true);
    } else if ('weight' === this.mode) {
      return (
        this.criterias.reduce((isValid, criteria) => {
          this.template.decorateInput(criteria);

          if (criteria.weight <= 0) {
            isValid = false;
            criteria.error.next('Select a weight for this criteria');
          } else {
            criteria.error.next(null);
          }

          return isValid;
        }, true) &&
        this.allWeightsSelected(this.criterias) &&
        this.pointsSum(this.criterias) === 100
      );
    } else if ('grade' === this.mode) {
      return this.allGradesSelected();
    }

    return false;
  }
}
