import { Component, OnInit, Input } from '@angular/core';
import { Module } from 'src/app/common/interfaces/module.interface';

@Component({
  selector: 'app-module-link',
  templateUrl: './module-link.component.html',
  styleUrls: ['./module-link.component.sass']
})
export class ModuleLinkComponent implements OnInit {

  @Input()
  module: Module;

  underConstruction = false;

  constructor() { }

  ngOnInit() {
  }

  showUnderConstructionMessage(module: Module) {
    this.underConstruction = true;

    setTimeout(() => this.underConstruction = false, 3000);
  }

}
