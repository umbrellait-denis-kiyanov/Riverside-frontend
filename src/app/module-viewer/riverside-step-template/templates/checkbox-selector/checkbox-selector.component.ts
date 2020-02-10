import {Component, forwardRef, Input} from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import {TemplateParams} from '.';
import {Item} from './Item';
import { CheckboxSelectorTemplateData } from '.';

@Component({
  selector: 'app-checkbox-selector',
  templateUrl: './checkbox-selector.component.html',
  styleUrls: ['./checkbox-selector.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => CheckboxSelectorComponent) }]
})
export class CheckboxSelectorComponent extends TemplateComponent {

  @Input() minimum;
  @Input() maximum;
  @Input() showDescriptions;
  @Input() alignRight;
  items: Item[];

  contentData: CheckboxSelectorTemplateData['template_params_json'];
  params = TemplateParams;

  getDescription(): string {
    return 'Checkbox selector component';
  }

  getName(): string {
    return 'Checkbox selector';
  }

  hasInputs(): boolean {
    return true;
  }

  protected init() {

    this.contentData = this.data.data.template_params_json as CheckboxSelectorTemplateData['template_params_json'];

    this.items = [
      {
        id: 1,
        title: 'title 1',
        description: 'Description of item'
      },
      {
        id: 2,
        title: 'title 2',
        description: 'Description of item'
      },
      {
        id: 3,
        title: 'title 3',
        description: 'Description of item'
      },
      {
        id: 4,
        title: 'title 4',
        description: 'Description of item'
      },
      {
        id: 5,
        title: 'title 5',
        description: 'Description of item'
      },
      {
        id: 6,
        title: 'title 6',
        description: 'Description of item'
      },
      {
        id: 7,
        title: 'title 7',
        description: 'Description of item'
      },
      {
        id: 8,
        title: 'title 8',
        description: 'Description of item'
      },
    ];

  }

}
