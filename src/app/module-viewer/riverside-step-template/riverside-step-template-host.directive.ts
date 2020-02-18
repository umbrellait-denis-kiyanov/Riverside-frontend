import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[riverside-step-template-host]"
})
export class RTemplateDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
