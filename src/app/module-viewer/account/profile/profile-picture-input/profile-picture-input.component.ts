import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';


@Component({
  selector: 'profile-picture-input',
  templateUrl: './profile-picture-input.component.html',
  styleUrls: ['./profile-picture-input.component.sass']
})
export class ProfilePictureInputComponent implements OnInit {
  @Input() fileUrl: FormControl;
  @Output() fileUrlChange = new EventEmitter();
  isSelect = false;
  user: User;
  className = '';

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.me;
  }

  selectImage() {
    this.isSelect = true;
  }

  onImageUploaded(src: string) {
    this.fileUrl.setValue(src + '?v=' + ((new Date()).getTime() / 1000));
    this.fileUrlChange.emit(this.fileUrl );
    this.isSelect = false;
  }
}
