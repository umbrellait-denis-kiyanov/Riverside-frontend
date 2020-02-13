import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { <%= classify(name) %>TemplateData, TemplateParams } from '.';

@Component({
    selector: '<%=dasherize(name)%>',
    templateUrl: '<%=dasherize(name)%>.component.html',
    styleUrls: ['./<%=dasherize(name)%>.component.sass'],
    providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => <%= classify(name) %>Component) }]
})
export class <%= classify(name) %>Component extends TemplateComponent {
    params = TemplateParams;

    contentData: <%= classify(name) %>TemplateData['template_params_json'];

    getDescription() {
        return '<%= capitalize(description) %>';
    }

    getName() {
        return '<%= capitalizeAll(name) %>';
    }
<% if (hasInput) { %>
    hasInput() {
        return true;
    }
<% } %>
}
