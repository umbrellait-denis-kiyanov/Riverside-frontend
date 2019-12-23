import { Component, OnChanges, Input } from '@angular/core';
import User from 'src/app/common/interfaces/user.model';
import { IceEditorTracker } from '../ice.component';

@Component({
  selector: 'ice-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnChanges {
  @Input() user: User;
  @Input() time: string;
  @Input() tracker: IceEditorTracker;

  className: string;
  firstLetter: string;

  constructor() { }

  ngOnChanges() {
    this.className = 'b' + this.tracker.getUserStyle(this.user.id);
    this.firstLetter = this.user.name[0].toUpperCase();
  }
}
