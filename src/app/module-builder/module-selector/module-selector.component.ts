import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap, RouterState, NavigationEnd, Event, Params, RoutesRecognized } from '@angular/router';
import { ModuleService } from '../../common/services/module.service';


@Component({
  selector: 'app-module-selector',
  templateUrl: './module-selector.component.html',
  styleUrls: ['./module-selector.component.sass']
})
export class ModuleSelectorComponent implements OnInit {

  public selectedModule: number;

  modules$ = this.moduleService.getModules();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public moduleService: ModuleService
  ) {

  }

  ngOnInit() {
    this.selectedModule = parseInt(this.router.url.split('/').pop(), 10);
    this.navigateToModuleIfNeeded(this.selectedModule);
  }

  navigateToModuleIfNeeded(moduleId: number = null) {
    if (!Number(moduleId)) {
      this.moduleService.getDefaultModule().subscribe(module => {
        this.router.navigateByUrl(`/builder/${module.id}`);
        this.selectedModule = module.id;
      });
    }
  }

  onChange(m) {
    this.router.navigateByUrl(`/builder/${m}`);
  }
}
