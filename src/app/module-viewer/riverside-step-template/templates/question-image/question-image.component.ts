import { Component } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { QuestionImageTemplateData } from './question-image.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-question-image',
  templateUrl: './question-image.component.html',
  styleUrls: ['./question-image.component.sass'],
  preserveWhitespaces: true
})
export class QuestionImageComponent extends TemplateComponent {

  contentData: QuestionImageTemplateData['template_params_json'];

  questionIndex = 1;

  pdf = '';

  protected init() {
    this.contentData = this.data.data.template_params_json as QuestionImageTemplateData['template_params_json'];

    if (this.contentData.image.toLowerCase().substr(-4) === '.pdf') {
      this.pdf = 'https://docs.google.com/gview?url=' + this.contentData.image + '&embedded=true';
    }
  }

  public next() {
    this.questionIndex = Math.min(this.questionIndex + 1, this.contentData.questions.length);
  }

  public prev() {
    this.questionIndex = Math.max(1, this.questionIndex - 1);
  }
}
