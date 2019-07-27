import { Component, OnInit, ViewChild, Input, ComponentFactoryResolver } from '@angular/core';
import { RTemplateDirective } from './riverside-step-template-host.directive';
import { Templates } from './templates';
import { TemplateContentData } from './templates/template-data.class';
import { TemplateComponent } from './templates/template-base.cass';

@Component({
  selector: 'riverside-step-template',
  templateUrl: './riverside-step-template.component.html',
  styleUrls: ['./riverside-step-template.component.sass']
})
export class RiversideStepTemplateComponent implements OnInit {

  templates = Templates;
  @Input() template: string;
  @Input() data: TemplateContentData;
  @ViewChild(RTemplateDirective) templateHost: RTemplateDirective;

  templateInstance: TemplateComponent;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.templates[this.template]);
    const viewContainerRef = this.templateHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    this.templateInstance = (componentRef.instance as TemplateComponent);
    this.templateInstance.data = this.data;
  }

  prepareData() {
    return this.templateInstance.prepareData();
  }
}
