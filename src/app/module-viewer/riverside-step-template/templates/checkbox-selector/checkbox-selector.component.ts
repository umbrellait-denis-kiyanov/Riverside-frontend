import {Component, forwardRef, Input} from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import txt from '!!raw-loader!./index.ts';
import {Item} from '.';
import { CheckboxSelectorTemplateData } from '.';
import {Observable, of} from 'rxjs';
import {Validate} from 'src/app/common/validator.class';

@Component({
  selector: 'app-checkbox-selector',
  templateUrl: './checkbox-selector.component.html',
  styleUrls: ['./checkbox-selector.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => CheckboxSelectorComponent) }]
})
export class CheckboxSelectorComponent extends TemplateComponent {

  items: Item[];
  checkedItemsAmount = 0;

  contentData: CheckboxSelectorTemplateData['template_params_json'];
  params = txt;

  getDescription(): string {
    return 'Checkbox selector';
  }

  getName(): string {
    return 'Checkbox selector';
  }

  hasInputs(): boolean {
    return true;
  }

  validate(): Observable<boolean> {

    const minValidator = Validate.min( this.contentData.minimum_of_required_selections );
    const maxValidator = Validate.max( this.contentData.maximum_of_required_selections );
    this.checkedItemsAmount = this.items.filter( (item: Item) => item.checked ).length;

    if ( this.contentData.minimum_of_required_selections && this.contentData.maximum_of_required_selections ) {
      return of(minValidator.isValid(this.checkedItemsAmount) && maxValidator.isValid(this.checkedItemsAmount));
    }

    if ( this.contentData.minimum_of_required_selections && !this.contentData.maximum_of_required_selections ) {
      return of(minValidator.isValid(this.checkedItemsAmount));
    }

    if ( !this.contentData.minimum_of_required_selections && this.contentData.maximum_of_required_selections ) {
      return of(maxValidator.isValid(this.checkedItemsAmount));
    }

    return of(true);
  }

  protected init() {

    this.contentData = this.data.data.template_params_json as CheckboxSelectorTemplateData['template_params_json'];
    this.items = this.contentData.options;

  }

}
