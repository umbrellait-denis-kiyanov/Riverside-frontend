import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';

const STATUS = {
  DISPLAY: 'DISPLAY',
  SELECT: 'SELECT'
};

@Component({
  selector: 'profile-picture-input',
  templateUrl: './profile-picture-input.component.html',
  styleUrls: ['./profile-picture-input.component.sass']
})
export class ProfilePictureInputComponent implements OnInit {
  @Input() fileUrl: FormControl;
  @Output() fileUrlChange = new EventEmitter();
  status = STATUS.DISPLAY;
  STATUS = STATUS;
  user: User;
  className = '';

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.me;
  }

  firstLetter() {
    return this.user.name[0].toUpperCase() + this.user.lname[0].toUpperCase();
  }

  selectImage() {
    this.status = STATUS.SELECT;
  }

  onImageUploaded(src: string) {
    this.fileUrl.setValue(src + '?v=' + Date.now());
    this.fileUrlChange.emit(this.fileUrl );
    this.status = STATUS.DISPLAY;
  }
}
