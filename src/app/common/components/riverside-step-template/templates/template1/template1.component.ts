import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';

@Component({
  selector: 'app-template1',
  templateUrl: './template1.component.html',
  styleUrls: ['./template1.component.sass']
})
export class Template1Component extends TemplateComponent {
  inputIds = ['box1', 'box2'];

  protected init() {
    this.inputIds.forEach(id => {
      this.inputs[id] = this.inputs[id] || '';
    });
  }
}
