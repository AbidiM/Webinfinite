/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';


import { ChartType } from './profile.model';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';
import { updateProfile, updateProfilePassword } from 'src/app/store/Authentication/authentication.actions';
import { TranslateService } from '@ngx-translate/core';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Contacts-profile component
 */
export class ProfileComponent  {
  // bread crumb items
  breadCrumbItems: Array<object>;
  loading$: Observable<any>

  profileForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  fieldTextType!: boolean;
  fieldTextType1!: boolean;

  fieldTextType2!: boolean;

  passwordMatchError: boolean = false;


  passwordForm: UntypedFormGroup;
  revenueBarChart: ChartType;
  statData:any;
  submitted: any = false;

  private currentUserSubject: BehaviorSubject<_User>;
  public currentUser: Observable<_User>;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store, 
    public translate: TranslateService) {
      
      this.loading$ = this.store.pipe(select(selectDataLoading));

      this.currentUserSubject = new BehaviorSubject<_User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
      
   

    // fill up the form for updating the profile
    this.currentUser.subscribe(user =>{
    this.profileForm = this.formBuilder.group({
      id: [user?.id],
      // name: [this.currentUserValue.user.name, [Validators.required]],
      username: [user?.username, [Validators.required]],
      email: [user?.email, [Validators.required, Validators.email]],
      phone:  [user?.phone, [Validators.required]],
      logo:[user?.logo]
    });
    

  this.passwordForm = this.formBuilder.group({
    id: [user?.id],
    currentPassword: ['', [Validators.required]],      
    newPassword: ['', [Validators.required]],
    confirmpwd:['', [Validators.required]],
  },{validators: [this.passwordMatchValidator]});}); 
 
  }
  public get currentUserValue(): _User {
    return this.currentUserSubject.value;
}
// get passwordMatchError() {
//   return (
//     this.passwordForm.getError('passwordMismatch') &&
//     this.passwordForm.get('confirmpwd')?.touched
//   );
// }
checkPasswordMatch() {
  const password = this.passwordForm.get('newPassword').value;
  const confirmPassword = this.passwordForm.get('confirmpwd').value;

  this.passwordMatchError = password !== confirmPassword;
}
passwordMatchValidator(formGroup: FormGroup) {
  const newPassword = formGroup.get('newPassword')?.value;
  const confirmPassword = formGroup.get('confirmpwd')?.value;

  if (newPassword && confirmPassword) {
    if (newPassword !== confirmPassword) {
      formGroup.get('confirmpwd')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true }; // Return an error object
    } else {
      formGroup.get('confirmpwd')?.setErrors(null); // Clear errors if they match
    }
  }

  return null; // Return null if valid
}
  
     /**
 * Password Hide/Show
 */
     toggleFieldTextType() {
      this.fieldTextType = !this.fieldTextType;
    }
    toggleFieldTextType1() {
      this.fieldTextType1 = !this.fieldTextType1;
    }
    toggleFieldTextType2() {
      this.fieldTextType2 = !this.fieldTextType2;
    }
  onSubmit() {
    this.formSubmitted = true;

      if (this.profileForm.invalid) {
        this.formError = 'Please complete all required fields.';
        Object.keys(this.profileForm.controls).forEach(control => {
          this.profileForm.get(control).markAsTouched();
        });
        this.focusOnFirstInvalid();
        return;
      }

      this.formError = null;

      const updatedUser =  this.profileForm.value;
      this.store.dispatch(updateProfile({ user: updatedUser }));

   
  }
private focusOnFirstInvalid() {
      const firstInvalidControl = this.getFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
    }
  
    private getFirstInvalidControl(): HTMLInputElement | null {
      const controls = this.profileForm.controls;
      for (const key in controls) {
        if (controls[key].invalid) {
          const inputElement = document.getElementById(key) as HTMLInputElement;
          if (inputElement) {
            return inputElement;
          }
        }
      }
      return null;
    }

  
    // convenience getter for easy access to form fields
    get f() { return this.passwordForm.controls; }

    /**
   * Submit the password
   */
  passwordFormSubmit() {

    this.submitted = true;
    if (this.profileForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.profileForm.controls).forEach(control => {
        this.profileForm.get(control).markAsTouched();
      });
      this.focusOnFirstInvalid();
      return;
    }

    this.formError = null;

      const currentPassword = this.f['currentPassword'].value;
      const newPassword = this.f['newPassword'].value;

      this.store.dispatch(updateProfilePassword({ oldPassword:currentPassword ,newPassword:newPassword}))  

    
  }
}
