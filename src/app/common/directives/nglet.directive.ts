import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface NgLetContext {
  $implicit: any;
  ngLet: any;
}

@Directive({
  selector: '[ngLet]'
})
export class NgLetDirective {
  current: any;

  @Input()
  set ngLet(value: any) {
    if (value === this.current) {
      return;
    }

    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      $implicit: value,
      ngLet: value
    });

    this.current = value;
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<NgLetContext>
  ) {}
}
