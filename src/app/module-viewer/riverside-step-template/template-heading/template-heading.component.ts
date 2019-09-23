import { Component, OnInit, Input } from '@angular/core';
import { TemplateContentData } from '../templates/template-data.class';

@Component({
  selector: 'template-heading',
  templateUrl: './template-heading.component.html',
  styleUrls: ['./template-heading.component.sass']
})
export class TemplateHeadingComponent implements OnInit {

  @Input() content: TemplateContentData;

  contentData: any;

  constructor() { }

  ngOnInit() {
    console.log(JSON.parse(JSON.stringify(this.content)));
    this.contentData = this.content.data.template_params_json;
  }

}
