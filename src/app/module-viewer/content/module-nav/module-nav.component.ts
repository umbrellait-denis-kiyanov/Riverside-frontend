import { Component, OnInit } from '@angular/core';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';

@Component({
  selector: 'module-nav',
  templateUrl: './module-nav.component.html',
  styleUrls: ['./module-nav.component.sass']
})
export class ModuleNavComponent implements OnInit {
  showPrevious = true;
  showNext = true;

  constructor(private navService: ModuleNavService) { }

  ngOnInit() {
  }

  next() {
    this.navService.nextStep();
  }

  previous() {
    this.navService.previousStep();
  }

}
