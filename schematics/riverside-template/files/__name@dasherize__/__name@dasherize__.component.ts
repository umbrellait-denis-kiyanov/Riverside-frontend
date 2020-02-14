import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { <%= classify(name) %>TemplateData } from '.';
import txt from '!!raw-loader!./index.ts';
<% if (hasInput) { %>
declare interface <%= classify(name) %>InputData {
  hasData: boolean;
}
<% } %>
@Component({
  selector: '<%=dasherize(name)%>',
  templateUrl: '<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => <%= classify(name) %>Component) }]
})
export class <%= classify(name) %>Component extends TemplateComponent {
  params = txt;

  contentData: <%= classify(name) %>TemplateData['template_params_json'];

  getDescription() {
    return '<%= capitalize(description) %>';
  }

  getName() {
    return '<%= capitalizeAll(name) %>';
  }
<% if (hasInput) { %>
  get input() {
    return this.getInput('<%= underscore(name) %>');
  }

  set <%= camelize(name) %>InputData(<%= camelize(name) %>InputData: <%= classify(name) %>InputData) {
    this.input.content = JSON.stringify(<%= camelize(name) %>InputData);
    this.contentChanged(this.input);
  }

  get <%= camelize(name) %>InputData() {
    return JSON.parse(this.input.getValue() || '{}') as <%= classify(name) %>InputData;
  }
<% } %>}
