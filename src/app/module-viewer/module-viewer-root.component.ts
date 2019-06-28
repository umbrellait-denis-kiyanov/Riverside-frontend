import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../common/services/user.service';

@Component({
  selector: 'app-module-viewer-root',
  templateUrl: './module-viewer-root.component.html',
  styleUrls: ['./module-viewer-root.component.sass']
})
export class ModuleViewerRootComponent implements OnInit {
  @Input() set me(value: any) {
    this.userService.setMeFromData(value);
    if (value) {
      this.ready = true;
    }
  }
  ready = false;

  constructor(private userService: UserService) { }

  ngOnInit() {

  }

}

