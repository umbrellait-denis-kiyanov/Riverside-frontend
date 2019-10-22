import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/common/services/user.service';

import toastr from 'src/app/common/lib/toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  saving = false;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      curPwd: ['', Validators.required],
      newPwd: ['', Validators.required],
      newPwd2: ['', Validators.required],
    });
  }

  save() {
    if (this.form.valid) {
      this.saving = true;
      this.error = '';
      this.userService.updatePassword(this.form.value).subscribe(
        () => {
          this.saving = false;
          toastr.success('Saved!');
        },
        (e) => {
          this.error = e.error.failure;
          this.saving = false;
        }
      );
    }
  }

}
