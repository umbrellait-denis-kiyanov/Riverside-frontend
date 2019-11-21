import { Component, OnInit, forwardRef, QueryList, ViewChildren } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { SegmentCriteriaDefineTemplateData } from './segment-criteria-define.interface';
import { SegmentCriteria } from './segment-criteria.interface';
import { Input } from 'src/app/common/interfaces/module.interface';
import { IcpInputComponent } from './icp-input/icp-input.component';
import { Validate } from 'src/app/common/validator.class';

const inputs = ['on', 'name', 'industries', 'pain_points', 'brainstorm', 'where_mine', 'criteria'];

@Component({
  selector: 'app-segment-criteria-define',
  templateUrl: './segment-criteria-define.component.html',
  styleUrls: ['./segment-criteria-define.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => SegmentCriteriaDefineComponent) }]
})
export class SegmentCriteriaDefineComponent extends TemplateComponent implements OnInit {

  @ViewChildren(IcpInputComponent) icpInputs: QueryList<IcpInputComponent>;

  contentData: SegmentCriteriaDefineTemplateData['template_params_json'];

  allSegments = [1, 2, 3, 4, 5];
  activeSegments: number[] = [];

  step: number;

  criterias: {[key: number]: SegmentCriteria[]};

  public prefix = 'segment_criteria_define_';

  gradePrefix = '';

  grades = [];

  gradeSections: {prefix: string, title: string, grades: number[]}[];

  gradeLevels = [
    {grade: 'A', i: 1, level: 88},
    {grade: 'B', i: 2, level: 75},
    {grade: 'C', i: 3, level: 65},
    {grade: 'D', i: 4, level: 55}
  ];
  lastGradeLevel = this.gradeLevels[this.gradeLevels.length - 1];

  userGradeLevels = {};

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

    // grade customers
    if (7 === this.step) {
      this.gradePrefix = this.contentData.inputs.split(',').map(s => s.trim()).find(s => s.substr(-5) === '_name').slice(0, -5);
      this.grades = Array.from(Array(this.contentData.number_of_inputs + 1).keys()).slice(1);
      this.userGradeLevels = this.getUserGradeLevels();
    }

    // final feedback step
    if (8 === this.step) {
      const getSection = (prefix: string, title: string) => {
        const grades = [];
        for (let k = 1; k <= 6; k++) {
          const inp = this.getInput(prefix, k);
          if (inp && inp.content) {
            grades.push(k);
          }
        }

        return {prefix, title, grades};
      };

      this.gradeSections = [getSection('grade_customers', 'Existing Customers'),
                            getSection('grade_new_customers', 'New Customers')];

      this.userGradeLevels = this.getUserGradeLevels();
    }
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

  private getUserGradeLevels() {
    return this.gradeLevels.reduce((levels, entry) => {
      levels[entry.grade] = this.getInput('grade_pct', entry.i).getValue();
      return levels;
    }, {});
  }

  validate() {
    if (this.step === 1) {
      return this.validateBrainstorm();
    } else if (this.step === 2) {
      return this.validateBrainstorm(['brainstorm']);
    } else if (this.step === 3) {
      return this.validateCriteria(['where_mine']);
    } else if (this.step === 4) {
      return this.validateCriteria();
    } else if (this.step === 5) {
      return true;
    } else if (this.step === 6) {
      return this.validateGradeLevels();
    } else if (this.step === 7) {
      return this.validateGradeCustomers();
    } else if (this.step === 8) {
      return true;
    }

    return false;
  }

  private validateBrainstorm(fields = ['name', 'industries', 'pain_points']) {
    return this.activeSegments.reduce((isValid, segment) =>
      fields.reduce((isValidField, field) => {
        const inp = this.getInput(field, segment);

        if (!this.validateInput(inp)) {
          isValidField = false;
        }

        return isValidField;
      }, isValid), true);
  }

  private validateCriteria(extraInputs: string[] = []) {
    return this.activeSegments.reduce((isValid, segment, idx) => {
      extraInputs.forEach(field => {
        if (!this.validateInput(this.getInput(field, segment))) {
          isValid = false;
        }
      });

      const icp = this.icpInputs.toArray()[idx];
      if (!icp.validate()) {
        isValid = false;
      }

      return isValid;
    }, true);
  }

  private validateGradeLevels() {
    return this.gradeLevels.reduce((isValid, level) => {
      const inp = this.getInput('grade_pct', level.i);

      const max = level.i === 1 ? 100 : Math.min(Number(this.getInput('grade_pct', level.i - 1).getValue()) - 1, 100);

      if (!this.validateInput(inp, [
        Validate.required('Please enter the grade level'),
        Validate.number(),
        Validate.max(max),
        Validate.min(0)
      ])) {
        isValid = false;
      }

      return isValid;
    }, true);
  }

  private validateGradeCustomers() {
    return this.grades.reduce((isValid, segment, idx) => {
      ['name', 'segment'].forEach(field => {
        const validator = 'segment' === field ? [Validate.required('Please select the customer segment')] : undefined;
        if (!this.validateInput(this.getInput(this.gradePrefix + '_' + field, segment), validator)) {
          isValid = false;
        }
      });

      const icp = this.icpInputs.toArray()[idx];
      if (!icp.validate()) {
        isValid = false;
      }

      return isValid;
    }, true);
  }
}

