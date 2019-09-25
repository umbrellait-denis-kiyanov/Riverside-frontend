import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-module-builder-root',
  templateUrl: './module-builder-root.component.html',
  styleUrls: ['./module-builder-root.component.sass']
})
export class ModuleBuilderRootComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    (window as any).jQuery('.loading-site-content').hide();
  }

}
