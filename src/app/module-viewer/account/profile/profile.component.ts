import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { Observable, Subscription } from 'rxjs';
import { AccountProfile } from 'src/app/common/interfaces/account.interface';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { tap, first } from 'rxjs/operators';
import toastr from 'src/app/common/lib/toastr';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  account$: Observable<AccountProfile>;
  form: FormGroup;
  saving: Subscription = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: new FormControl({value: '', disabled: true}, Validators.required),
      meta: this.formBuilder.group({
        profile_picture: ['', Validators.required]
      })
    });

    this.account$ = this.userService
      .getAccount()
      .pipe(tap(user => this.form.patchValue(user)));
  }

  save() {
    if (this.form.valid) {
      this.saving = this.userService.saveAccount(this.form.value).pipe(first()).subscribe(() => {
        this.userService.me.profile_picture = this.form.value.meta.profile_picture;
        this.userService.meChanged.next(this.userService.me);
        toastr.success('Saved!');
      });
    }
  }
}
