import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TemplateComponent } from '../template-base.cass';
import { QuestionImageTemplateData } from './question-image.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-question-image',
  templateUrl: './question-image.component.html',
  styleUrls: ['./question-image.component.sass'],
  preserveWhitespaces: true
})
export class QuestionImageComponent extends TemplateComponent implements AfterViewInit {

  contentData: QuestionImageTemplateData['template_params_json'];

  pdf = '';

  pdfLoaded = false;

  iframeInterval;

  @ViewChild('iframe') iframe;

  protected init() {
    this.contentData = this.data.data.template_params_json as QuestionImageTemplateData['template_params_json'];

    if (this.contentData.image.toLowerCase().substr(-4) === '.pdf') {
      this.pdf = this.injectorObj.get(DomSanitizer).bypassSecurityTrustResourceUrl(
      'https://docs.google.com/viewer?url=' + this.contentData.image + '&embedded=true');
    }
  }

  ngAfterViewInit() {
    if (!this.pdf) {
      return;
    }

    const iframe = this.iframe.nativeElement;
    this.iframeInterval = setInterval(_ => {
      iframe.src += '';
    }, 1000);
  }

  iframeLoaded() {
    this.pdfLoaded = true;
    clearInterval(this.iframeInterval);
  }
}
