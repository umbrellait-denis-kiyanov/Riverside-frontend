import { Component, OnChanges, Input } from '@angular/core';
import { TemplateInput } from 'src/app/common/interfaces/module.interface';
import { TemplateComponent } from '../riverside-step-template/templates/template-base.cass';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: '[inputText]',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.sass']
})
export class InputTextComponent implements OnChanges {

  @Input() inputText: TemplateInput | string;
  @Input() num: number;
  @Input() inline: boolean;

  text$: Observable<string>;

  constructor(private template: TemplateComponent) { }

  isInput(obj: any): obj is TemplateInput {
    return obj.content !== undefined;
  }

  ngOnChanges() {
    const input = this.isInput(this.inputText) ?
      this.template.decorateInput(this.inputText) : this.template.getInput(this.inputText, this.num);

    if (input) {
      this.text$ = input.observer.pipe(map(text => text.trim()));
    }
  }
}
