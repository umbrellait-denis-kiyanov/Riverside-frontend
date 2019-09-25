import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap, RouterState, NavigationEnd, Event, Params, RoutesRecognized } from '@angular/router';
import { ModuleService } from '../../common/services/module.service';


@Component({
  selector: 'app-module-selector',
  templateUrl: './module-selector.component.html',
  styleUrls: ['./module-selector.component.sass']
})
export class ModuleSelectorComponent implements OnInit {

  public selectedModule = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public moduleService: ModuleService
  ) {

  }

  ngOnInit() {
    this.selectedModule = parseInt(this.router.url.split('/').pop(), 10) || 1;
    this.navigateToModuleIfNeeded(this.selectedModule);
  }

  navigateToModuleIfNeeded(moduleId: number) {
    if (!moduleId) {
      this.moduleService.loadModules({}).then(() => {
        this.selectedModule = this.moduleService.modules[0].id;
        this.router.navigateByUrl(`/builder/${this.selectedModule}`);
      });

    }
  }

  onChange(m) {
    this.router.navigateByUrl(`/builder/${m}`);
  }
}
