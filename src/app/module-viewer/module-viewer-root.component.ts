import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../common/services/user.service';
import User from '../common/interfaces/user.model';

@Component({
  selector: 'app-module-viewer-root',
  templateUrl: './module-viewer-root.component.html',
  styleUrls: ['./module-viewer-root.component.sass']
})
export class ModuleViewerRootComponent implements OnInit {

  me: User;

  constructor(private userService: UserService) {
    this.userService.getAccount().subscribe(me => {
      this.userService.setMeFromData(me);
      this.me = this.userService.me;
    });
  }

  ngOnInit() {
    // (document.querySelector('.loading-site-content') as HTMLElement).style.display = 'none';
  }

}

