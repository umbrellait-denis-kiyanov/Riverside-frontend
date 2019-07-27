import { Component, OnInit, Input } from '@angular/core';
import User from 'src/app/common/interfaces/user.model';

@Component({
  selector: 'ice-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {
  @Input() user: User;
  @Input() className: string;
  @Input() time: string;

  constructor() { }

  ngOnInit() {
  }

  firstLetter() {
    return this.user.name[0].toUpperCase();
  }

}
