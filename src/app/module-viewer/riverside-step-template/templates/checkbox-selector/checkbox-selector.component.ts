import {Component, forwardRef, Input} from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import {TemplateParams} from '.';

@Component({
  selector: 'app-checkbox-selector',
  templateUrl: './checkbox-selector.component.html',
  styleUrls: ['./checkbox-selector.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => CheckboxSelectorComponent) }]
})
export class CheckboxSelectorComponent extends TemplateComponent {
  @Input() minimum;
  @Input() maximum;
  contentData;
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

}
