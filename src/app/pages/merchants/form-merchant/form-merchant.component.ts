import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';

import { UserProfileService } from '../../../core/services/user.service';
import { Store } from '@ngrx/store';
import { Register } from 'src/app/store/Authentication/authentication.actions';
import { addMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';


@Component({
  selector: 'app-form-merchant',
  templateUrl: './form-merchant.component.html',
  styleUrl: './form-merchant.component.css'
})
export class FormMerchantComponent implements OnInit {
  
  @Input() type: string;
  merchantForm: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  successmsg: any = false;
  fieldTextType!: boolean;
  imageURL: string | undefined;
  merchantPictureBase64: string = null;
  storeLogoBase64: string = null;
  categories: string[] = ['discount','coupon', 'card'];
  sections: string[] = ['Restaurant', 'Fashion and style','Daily services', 'Entertainment', 'Tourism and travel','Cafes and sweets', 'Health and beauty', 'Gifts and occasions', 'Online stores', 'Electronics'];
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private userService: UserProfileService, public store: Store) { }
  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit() {

    document.body.classList.add("auth-body-bg");

    this.merchantForm = this.formBuilder.group({
      
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['' ],
      confpassword: [''],
      cin: [''],
     // storeName:['',Validators.required],
      merchantLogo: [''],
      phone:[''], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
      country:[''],
      city:[''],
      area:[''], 
      startDateContract: [''],
      endDateContract:[''],
      serviceType: [''],
      supervisorName: [''],
      supervisorPhone: [''],  
      representative: [''],
      bankAccountNumber: [''],
      registerCode:[''],
      mapLocation:[''],
      longitude:[''],
      latitude:[''],
      merchantName: [''],
      merchantPicture: [''],
      website: [''],
      whatsup:[''],
      facebook: [''],
      twitter: [''],
      instagram: [''],
      merchantSection:[''],
      merchantCategory: [''],
      status: ['active']

    }/*, {validators: [this.passwordMatchValidator]}*/);
  }
  get passwordMatchError() {
    return (
      this.merchantForm.getError('passwordMismatch') &&
      this.merchantForm.get('confpassword')?.touched
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {

    const newPassword = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confpassword').value;
    
    
    if (confirmPassword && newPassword !== confirmPassword) {
        console.log("password mismatch");
        formGroup.get('confpassword').setErrors({ passwordMismatch: true });
        formGroup.get('confpassword').markAsDirty(); // Mark as dirty to trigger validation
        formGroup.get('confpassword').updateValueAndValidity(); // Update validity to trigger error message
    return { passwordMismatch: true };
        
      }
    
      // Only clear errors if the field is not empty
    if (confirmPassword) {
      formGroup.get('confpassword').setErrors(null);
      formGroup.get('confpassword').markAsPristine(); // Mark as pristine to clear validation

    }
  
   
    return null;
  }


  onPhoneNumberChanged(phoneNumber: string) {
    this.merchantForm.get('phone').setValue(phoneNumber);
  }

  onSupervisorPhoneChanged(phoneNumber: string) {
    this.merchantForm.get('supervisorPhone').setValue(phoneNumber);
  }
  // convenience getter for easy access to form fields
  get f() { return this.merchantForm.controls; }

  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  };

  /**
   * On submit form
   */
  onSubmit() {
    console.log('Form status:', this.merchantForm.status);
    console.log('Form errors:', this.merchantForm.errors);
    if (this.merchantForm.valid) {
      console.log('i am on onSubmit');
      console.log(this.merchantForm.value);
      console.log('Form status:', this.merchantForm.status);
      console.log('Form errors:', this.merchantForm.errors);
      
      
      const newData = this.merchantForm.value;
      if(this.storeLogoBase64){
        newData.merchantLogo = this.storeLogoBase64;
      }
      if(this.merchantPictureBase64){
        newData.merchantPicture = this.merchantPictureBase64;
      }
      delete newData.confpassword;
  
      console.log(newData);
      //Dispatch Action
      this.store.dispatch(addMerchantlist({ newData }));
    } else {
      // Form is invalid, display error messages
      console.log('Form is invalid');
      this.merchantForm.markAllAsTouched();
    }
  }
  onCancel(){
    console.log('Form status:', this.merchantForm.status);
    console.log('Form errors:', this.merchantForm.errors);
    this.merchantForm.reset();
    this.router.navigateByUrl('/private/merchants/list');
  }
    /**
 * Password Hide/Show
 */
    toggleFieldTextType() {
      this.fieldTextType = !this.fieldTextType;
    }
  /**
   * File Upload Image
   */
 
  
  async fileChange(event: any): Promise<string> {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Upload Store Logo
   */
  async uploadStoreLogo(event: any){
    try {
      const imageURL = await this.fileChange(event);
      console.log(imageURL);
      //this.merchantForm.controls['storeLogo'].setValue(imageURL);
      this.storeLogoBase64 = imageURL;
    } catch (error: any) {
      console.error('Error reading file:', error);
    }
  }
  /**
   * Upload Merchant Picture
   */
  async uploadMerchantPicture(event: any){
    try {
      const imageURL = await this.fileChange(event);
      console.log(imageURL);
      //this.merchantForm.controls['merchantPicture'].setValue(imageURL);
      this.merchantPictureBase64 = imageURL;
    } catch (error: any) {
      console.error('Error reading file:', error);
    }
    
  }
}