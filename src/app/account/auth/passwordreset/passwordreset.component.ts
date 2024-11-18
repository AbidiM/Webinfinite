import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { forgetPassword } from 'src/app/store/Authentication/authentication.actions';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit {

  resetForm: FormGroup;
  loading$: Observable<boolean>

  submitted: boolean = false;
  error: string = '';
  success: string = '';
  loading: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, 
    private store: Store,
    public toastr:ToastrService) {   
          this.loading$ = this.store.pipe(select(selectDataLoading));
    }

  ngOnInit() {

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    this.store.dispatch(forgetPassword({ email: this.f.email.value }));
    
  }
 
  }

