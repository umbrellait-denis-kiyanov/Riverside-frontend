import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Module } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';

declare global {
  interface Window { $: any; }
}

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.sass']
})
export class LeftMenuComponent implements OnInit {

  @Input() width: number;
  @Input() module: Module;
  @Output() collapse = new EventEmitter();

  constructor(
    private moduleService: ModuleService
  ) { }

  ngOnInit() {
    this.module.percComplete = this.module.percComplete || 0;
    window.$('#datepicker').datepicker({
      dateFormat: 'dd M yy'
    });
  }

  onExpand() {
    this.collapse.emit();
  }

  updateProgress() {
    this.moduleService.updateProgress(this.module);
  }
}
