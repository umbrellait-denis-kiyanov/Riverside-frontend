import { Component, ViewChild, forwardRef, ElementRef, Type } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { QuestionImageTemplateData, TemplateParams } from '.';
import { DomSanitizer, SafeStyle, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-question-image',
  templateUrl: './question-image.component.html',
  styleUrls: ['./question-image.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => QuestionImageComponent) }],
  preserveWhitespaces: true
})
export class QuestionImageComponent extends TemplateComponent {
  params = TemplateParams;
  contentData: QuestionImageTemplateData['template_params_json'];

  pdf: SafeResourceUrl;
  image: SafeStyle;

  pdfLoaded = false;

  iframeInterval;

  @ViewChild('iframe') iframe: ElementRef;

  getDescription() {
    return '';
  }

  getName() {
    return 'Image and Questions';
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as QuestionImageTemplateData['template_params_json'];

    const sanitizer = this.injectorObj.get<DomSanitizer>(DomSanitizer as Type<DomSanitizer>);
    if (this.contentData.image.toLowerCase().substr(-4) === '.pdf') {
      this.pdf = sanitizer.bypassSecurityTrustResourceUrl(this.contentData.image);
    } else {
      this.image = sanitizer.bypassSecurityTrustStyle('url(' + this.contentData.image + ')');
    }
  }

  iframeLoaded() {
    this.pdfLoaded = true;
  }
}
