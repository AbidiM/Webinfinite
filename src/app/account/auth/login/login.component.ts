import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';

import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { login } from 'src/app/store/Authentication/authentication.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  returnUrl: string;
  fieldTextType!: boolean;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private store: Store,
    ) { }

  ngOnInit() {
    
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/private']);
    }
    else
    {
    // form validation
      this.loginForm = this.formBuilder.group({
        // email: ['admin@themesbrand.com', [Validators.required, Validators.email]],
        // password: ['123456', [Validators.required]],
          email: ['refka.fouzai@gmail.com', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
      });
  }
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    const email = this.f['email'].value; // Get the username from the form
    const password = this.f['password'].value; // Get the password from the form

    // Login Api
    this.store.dispatch(login({ email: email, password: password }));
    

  }

  /**
 * Password Hide/Show
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
