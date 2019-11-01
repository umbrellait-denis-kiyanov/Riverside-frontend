import { Component, OnInit, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { SegmentCriteriaDefineTemplateData } from './segment-criteria-define.interface';

const inputs = ['on', 'name', 'industries', 'pain_points', 'brainstorm', 'where_mine', 'criteria'];

interface SegmentCriteria {
  name: {content: string, comments_json: string};
  description: {content: string, comments_json: string};
  weight?: number;
}

@Component({
  selector: 'app-segment-criteria-define',
  templateUrl: './segment-criteria-define.component.html',
  styleUrls: ['./segment-criteria-define.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => SegmentCriteriaDefineComponent) }]
})
export class SegmentCriteriaDefineComponent extends TemplateComponent implements OnInit {
  contentData: SegmentCriteriaDefineTemplateData['template_params_json'];

  allSegments = [1, 2, 3, 4, 5];
  activeSegments: number[] = [];

  step: number;

  criterias: {[key: number]: SegmentCriteria[]};
  selectedGrades: {[customerIndex: number]: {[criteriaIndex: number]: number}} = {};

  public prefix = 'segment_criteria_define_';

  gradePrefix = '';

  grades = [];

  getDescription() {
    return 'Ideal Customer Profiles';
  }

  getName() {
    return 'ICP: Segment-Criteria';
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as SegmentCriteriaDefineTemplateData['template_params_json'];

    this.initSegments();
    this.condenseSegments();
    this.initCriterias();

    if (5 === this.step) {
      this.gradePrefix = this.contentData.inputs.split(',').map(s => s.trim()).find(s => s.substr(-5) === '_name').slice(0, -5);
      this.grades = Array.from(Array(this.contentData.number_of_inputs + 1).keys()).slice(1);

      this.initGrades();
    }
  }

  initGrades() {
    this.selectedGrades = this.grades.reduce((grades, seg) => {
      const inp = this.getInput(this.gradePrefix, seg);
      grades[seg] = inp && inp.content ? JSON.parse(inp.content) : {};

      Array.from(Array(6).keys()).slice(1).forEach(k => grades[seg][k] = grades[seg][k] || null);

      return grades;
    }, {});
  }

  syncGrade(customerIndex: number) {
    const input = this.getInput(this.gradePrefix, customerIndex);

    input.content = JSON.stringify(this.selectedGrades[customerIndex]);

    this.moduleService.saveInput(input).subscribe();
  }

  gradeSum(customerIndex: number) {
    return Object.values(this.selectedGrades[customerIndex] || {}).reduce((total, grade) => total + grade, 0);
  }

  allGradesSelected(customerIndex: number) {
    const seg = this.getInput(this.gradePrefix + '_segment', customerIndex).content;
    return Object.values(this.selectedGrades[customerIndex]).filter(a => a !== null).length === this.criterias[seg].length;
  }

  resetGradeSelection(customerIndex: number) {
    this.selectedGrades[customerIndex] = {};
    this.syncGrade(customerIndex);
    this.initGrades();
  }

  initSegments() {
    this.activeSegments = this.allSegments.filter(num => this.getInput('on', num).content);

    if (!this.activeSegments.length) {
      this.addSegment();
    }

    this.step = Number(this.contentData.step_select.substr(0, 1));
  }

  getEmptyCriteria() {
    const emptyDef = JSON.stringify({content: '', comments_json: ''});
    return {name: JSON.parse(emptyDef), description: JSON.parse(emptyDef), weight: 0};
  }

  initCriterias() {
    const defaultSegments = () => {
      return [0, 1, 2].map(i => this.getEmptyCriteria());
    };

    this.criterias = this.activeSegments.reduce((segments, num) => {
      const segData = this.getInput('criteria', num);
      segments[num] = segData.content ? JSON.parse(segData.content) : defaultSegments();

      return segments;
    }, {});
  }

  // remove empty segments in the middle of the list
  condenseSegments() {
    let needsRefresh = false;
    this.activeSegments.map((num, idx) =>
      inputs.forEach(field => {
        if (num > idx + 1) {
          const src = this.getInput(field, num);
          const target = this.getInput(field, idx + 1);

          target.content = JSON.parse(JSON.stringify(src.content));
          target.comments_json = JSON.parse(JSON.stringify(src.comments_json));

          src.content = null;
          src.comments_json = null;
          needsRefresh = true;
        }
      })
    );

    if (needsRefresh) {
      const l = this.activeSegments.length;
      if (l && this.activeSegments[l - 1] !== l) {
        this.moduleService.saveMultipleInputs(Object.values(this.inputs)).subscribe();
      }

      this.initSegments();

      // force input re-render
      const seg = this.activeSegments;
      this.activeSegments = [];
      setTimeout(_ => this.activeSegments = seg, 1);
    }
  }

  addSegment() {
    if (this.activeSegments.length < this.allSegments.length) {
      const num = this.activeSegments.length + 1;
      this.activeSegments.push(num);

      const inp = this.getInput('on', num);
      inp.content = num.toString();

      this.moduleService.saveInput(inp).subscribe();
    }
  }

  removeSegment(idx: number) {
    if (this.activeSegments.length === 1) {
      return;
    }

    const inp = this.getInput('on', this.activeSegments[idx]);
    inp.content = null;
    this.moduleService.saveInput(inp).subscribe();

    this.activeSegments.splice(idx, 1);
    this.condenseSegments();
  }

  addCriteria(seg: number) {
    if (this.criterias[seg].length < 5) {
      this.criterias[seg].push(this.getEmptyCriteria());
    }
  }

  removeCriteria(seg: number, idx: number) {
    if (this.criterias[seg].length > 3) {
      this.criterias[seg].splice(idx, 1);
      this.syncCriteria(seg);
    }
  }

  pointsSum(criteria: SegmentCriteria[]) {
    return criteria.reduce((sum, cr) => sum + (cr.weight || 0), 0);
  }

  allWeightsSelected(criteria: SegmentCriteria[]) {
    return !criteria.find(cr => !cr.weight);
  }

  syncCriteria(seg: number) {
    const input = this.getInput('criteria', seg);

    input.content = JSON.stringify(this.criterias[seg].map(c =>
      ({description: {comments_json: c.description.comments_json, content: c.description.content},
        name:        {comments_json: c.name.comments_json, content: c.name.content},
        weight:      c.weight
      }))
    );

    this.moduleService.saveInput(input).subscribe();
  }
}
