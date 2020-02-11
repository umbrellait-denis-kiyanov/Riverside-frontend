import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/common/services/user.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

const ERROR_MESSAGES = {
  INVALID_PASSWORD: 'New password is invalid',
  PASSWORDS_DONT_MATCH: 'Passwords should match',
  CURRENT_PASSWORD_INVALID: 'Current password is invalid'
};

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  saving: Subscription = null;
  error: string;
  showText: { [key: string]: boolean };

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      curPwd: ['', Validators.required],
      newPwd: ['', Validators.required],
      newPwd2: ['', Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      this.error = '';
      this.saving = this.userService
        .updatePassword(this.form.value)
        .pipe(first())
        .subscribe(
          () => {
            this.toastr.success('Saved!');
          },
          e => {
            this.error = ERROR_MESSAGES[e.error.failure];

            if (e.error.failure === 'PASSWORDS_DONT_MATCH') {
              this.form.controls.newPwd2.setErrors({ incorrect: true });
              this.form.controls.newPwd.setErrors({ incorrect: true });
            }

            if (e.error.failure === 'CURRENT_PASSWORD_INVALID') {
              this.form.controls.curPwd.setErrors({ incorrect: true });
            }
          }
        );
    }
  }
}
