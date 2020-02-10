import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/common/services/user.service';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted: Subscription;
  returnUrl: string;
  isInvalid = false;
  isSessionExpired = false;

  fields = ['username', 'password'];

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
  ) {
      // redirect to home if already logged in
      // if (this.authenticationService.currentUserValue) {
      //     this.router.navigate(['/']);
      // }
    this.route.queryParams.subscribe( (params) => {
      if ( params.session_expire ) {
        this.isSessionExpired = true;
      }
    } );
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  submit(event: Event) {
    this.isInvalid = false;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    const form = new FormData();
    this.fields.forEach(field => form.append(field, this.loginForm.get(field).value));
    form.append('json', 'true');

    this.submitted = this.userService.signin(form)
      .subscribe(res => {
        if (res) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.isInvalid = true;
        }
      }, err => this.isInvalid = true);
  }
}
