import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/common/services/user.service';

import toastr from 'src/app/common/lib/toastr';

const ERROR_MESSAGES = {
  INVALID_PASSWORD: 'New password is invalid',
  PASSWORDS_DONT_MATCH: 'Passwords should match',
  CURRENT_PASSWORD_INVALID: 'Current password is invalid',
};

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
          this.error = ERROR_MESSAGES[e.error.failure];

          if (e.error.failure === 'PASSWORDS_DONT_MATCH') {
            this.form.controls.newPwd2.setErrors({incorrect: true});
            this.form.controls.newPwd.setErrors({incorrect: true});
          }

          if (e.error.failure === 'CURRENT_PASSWORD_INVALID') {
            this.form.controls.curPwd.setErrors({incorrect: true});
          }

          this.saving = false;
        }
      );
    }
  }

}
