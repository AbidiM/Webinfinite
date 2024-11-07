import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { addMerchantlist, getLoggedMerchantById, getMerchantById, updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectedMerchant, selectMerchantById } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { selectDataSection } from 'src/app/store/section/section-selector';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { Merchant } from '../../../store/merchantsList/merchantlist1.model';


@Component({
  selector: 'app-form-merchant',
  templateUrl: './form-merchant.component.html',
  styleUrl: './form-merchant.component.css'
})
export class FormMerchantComponent implements OnInit {
  
  @Input() type: string;
  merchantForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  private destroy$ = new Subject<void>();

  submitted: any = false;
  error: any = '';
  successmsg: any = false;
  merchant: Merchant = null;
  imageURL: string | undefined;
  existantmerchantLogo: string = null;
  existantmerchantPicture: string = null
  merchantPictureBase64: string = null;
  storeLogoBase64: string = null;
  isEditing: boolean = false;
  fromPendingContext: boolean = false;

  countrylist: any[] = [];
  arealist$:  Observable<any[]>  ;
  citylist$:  Observable<any[]> ;
  loading$: Observable<any>

  sectionlist:  any[] = [];
  
  filteredCountries: any[] = [];
  filteredAreas :  any[] = [];
  filteredCities:  any[] = [];
  serviceTypes: any[] = ['company', 'entreprise'];
  originalMerchantData: any = {}; 

  fieldTextType: boolean  = false;;
  confirmFieldTextType: boolean = false;
  @ViewChild('formTop', { static: false }) formTop: ElementRef;
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    public store: Store) {

      this.getNavigationState();
      this.loading$ = this.store.pipe(select(selectDataLoading)); 

      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 10, status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 10, status: 'active' }));
     
      this.initForm();
      
     }

     get passwordMatchError() {
      return (
        this.merchantForm.getError('passwordMismatch') &&
        this.merchantForm.get('confpassword')?.touched
      );
    }
  
    passwordMatchValidator(formGroup: FormGroup) {
      const newPassword = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confpassword')?.value;
    
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          formGroup.get('confpassword')?.setErrors({ passwordMismatch: true });
          return { passwordMismatch: true }; // Return an error object
        } else {
          formGroup.get('confpassword')?.setErrors(null); // Clear errors if they match
        }
      }
    
      return null; // Return null if valid
    }
   private initForm() {
    this.merchantForm = this.formBuilder.group({
    id: [null],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', this.type === 'create' ? Validators.required : null],
    confpassword: ['', this.type === 'create' ? Validators.required : null],
    id_number: [null, Validators.required],
    phone:['',Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
    country_id:[null, Validators.required],
    city_id:[null, Validators.required],
    area_id:[null, Validators.required], 
    serviceType: [null, Validators.required],
    supervisorName: ['', Validators.required],
    supervisorName_ar: ['', Validators.required],
    supervisorPhone: ['', Validators.required],
    bankAccountNumber: [''],
    merchantName:['', Validators.required],
    merchantName_ar:['', Validators.required],
    merchantPicture: ['', Validators.required],
    merchantLogo: ['', Validators.required],
    activationCode: [''],
    qrCode: [''],
    section_id:[null, Validators.required],
    website: [undefined],
    whatsup:[null],
    facebook: [undefined],
    twitter: [undefined],
    instagram: [undefined]
    

  }, {
    validators: this.type === 'create' ? this.passwordMatchValidator : null 
  });} 
  // set the currenr year
  year: number = new Date().getFullYear();
  fileName1: string = ''; 
  fileName2: string = ''; 
  globalId : number = null;

  ngOnInit() {
    
    this.store.select(selectDataCountry).subscribe((data) =>{
        this.filteredCountries = data;
    });
    this.arealist$ = this.store.select(selectDataArea);
    this.arealist$.subscribe((areas) => { this.filteredAreas = areas});
    

    this.citylist$ = this.store.select(selectDataCity);
    this.citylist$.subscribe((cities) => { this.filteredCities = cities});
  
    this.store.select(selectDataSection).subscribe((data) => {
      this.sectionlist = [...data].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    });


    const merchantId = this.route.snapshot.params['id'];
    if (merchantId) {
      // Dispatch action to retrieve the merchant by ID
      this.store.dispatch(getLoggedMerchantById({ merchantId }));
      
      // Subscribe to the selected merchant from the store
      this.store
        .pipe(select(selectedMerchant), takeUntil(this.destroy$))
        .subscribe((merchant: any) => {
          if (merchant) {
            console.log(merchant);

           
            this.existantmerchantLogo = merchant.merchantLogo;
            this.existantmerchantPicture = merchant.merchantPicture;
            this.fileName1 = merchant.merchantLogo.split('/').pop();
            this.fileName2 = merchant.merchantPicture.split('/').pop();
            

            this.merchantForm.controls['country_id'].setValue(merchant.user.city.area.country_id);
            this.merchantForm.controls['area_id'].setValue(merchant.user.city.area_id);
            this.merchantForm.controls['city_id'].setValue(merchant.user.city_id);
            this.merchantForm.controls['section_id'].setValue(merchant.section_id);

            this.merchantForm.patchValue(merchant);
            this.globalId = merchant.id;
            this.merchantForm.patchValue(merchant.user);
            this.originalMerchantData = { ...merchant };
            this.isEditing = true;

          }
        });
    }
   
  }
  private getNavigationState(){
    /**Determining the context of the routing if it is from Approved State or Pending State */
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.fromPendingContext = navigation.extras.state.fromPending ;
      }
  }
  getCountryName(id: any){
    return this.filteredCountries.find(country => country.id === id)?.name ;
  }
  getAreaName(id: any){
    return this.filteredAreas.find(area => area.id === id)?.name ;
  }
  getCityName(id: any){
    return this.filteredCities.find(city => city.id === id)?.name ;
  }
  getSectionName(id: any){
    return this.sectionlist.find(section => section.id === id)?.name ;
  }
  

  onChangeCountrySelection(event: any){
    console.log(event);
    
    const country = event.id;
    if(country){
      this.arealist$.subscribe(
        areas => 
          this.filteredAreas = areas.filter(c =>c.country_id == country )
      );
    }
    else{
      this.filteredAreas = [];
    }
    
  }
  onChangeAreaSelection(event: any){
    const area = event.id;
    if(area){
      this.citylist$.subscribe(
        cities => 
          this.filteredCities = cities.filter(c =>c.area_id == area )
      );
    }
    else{
      this.filteredCities = [];
    }
    
  }

  onPhoneNumberChanged(phoneNumber: string) {
    this.merchantForm.get('phone').setValue(phoneNumber);
  }

  onSupervisorPhoneChanged(phoneNumber: string) {
    this.merchantForm.get('supervisorPhone').setValue(phoneNumber);
  }
  // convenience getter for easy access to form fields
  get f() { return this.merchantForm.controls; }
  
  createMerchantFromForm(formValue): Merchant {
      //const formValue = this.merchantForm.value;
      const merchant: any = {
      
          id : Number(this.globalId),
          username: formValue.username,
          email: formValue.email,
          password: formValue.password,
          id_number: Number(formValue.id_number),
          phone: formValue.phone,
          merchantName: formValue.merchantName,
          merchantName_ar: formValue.merchantName_ar,
          serviceType: formValue.serviceType,
          supervisorName: formValue.supervisorName,
          supervisorName_ar: formValue.supervisorName_ar,
          supervisorPhone: formValue.supervisorPhone,
          merchantLogo : formValue.merchantLogo,
          merchantPicture: formValue.merchantPicture,
          bankAccountNumber : formValue.bankAccountNumber,
          section_id: Number(formValue.section_id),
          city_id : Number(formValue.city_id),
          
          }
          if (formValue.website) {
            merchant.website = formValue.website;
          }
          if (formValue.facebook) {
            merchant.facebook = formValue.facebook;
          }
          if (formValue.twitter) {
            merchant.twitter = formValue.twitter;
          }
          if (formValue.instagram) {
            merchant.twitter = formValue.instagram;
          }
          if (formValue.whatsup) {
            merchant.twitter = Number(formValue.whatsup);
          }
          return merchant;
  }
 
  /**
   * 
   * Change Detection in form field
   */
  detectChanges(): any {
    const updatedData = {};

    // Compare each field and add only the modified fields
    for (const key in this.merchantForm.controls) {
      if (this.merchantForm.controls[key].dirty) {
        // Check if the value is different from the original
        if (this.merchantForm.controls[key].value !== this.originalMerchantData[key]) {
          updatedData[key] = this.merchantForm.controls[key].value;
        }
      }
    }
    console.log(updatedData);
    return updatedData;
  }
    
  /**
   * On submit form
   */
  onSubmit() {
    this.formSubmitted = true;

    if (this.merchantForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.merchantForm.controls).forEach(control => {
        this.merchantForm.get(control).markAsTouched();
      });
      this.focusOnFirstInvalid();
      return;
    }
    this.formError = null;
      //const newData = this.merchantForm.value;
      const newData = this.merchantForm.value;
      console.log(newData);
      if(this.storeLogoBase64){
        newData.merchantLogo = this.storeLogoBase64;
      }
      if(this.merchantPictureBase64){
        newData.merchantPicture = this.merchantPictureBase64;
      }
      delete newData.confpassword;
      delete newData.area_id;
      delete newData.country_id;
      delete newData.qrCode;
      delete newData.activationCode;

      this.merchant = this.createMerchantFromForm(newData);
      if(!this.isEditing)
        {           
         
          
          delete this.merchant.id;
          //this.merchant = newData;
          console.log(this.merchant);
          //Dispatch Action
          this.store.dispatch(addMerchantlist({ newData: this.merchant }));
        }
        else
        { 
          delete this.merchant.password;
          delete this.merchant.email;
          const updatedDta = this.detectChanges();
          if (Object.keys(updatedDta).length > 0) {
            console.log(updatedDta);
            updatedDta.id = this.globalId;
            this.store.dispatch(updateMerchantlist({ updatedData: updatedDta }));
          }
          else{
            this.formError = 'Nothing has been changed!!!';
            this.scrollToTopOfForm();
          }
        }
      
    
  }
  scrollToTopOfForm(): void {
    // First, scroll to the form element (or to the input element at the top)
    if (this.formElement) {
     
        window.scrollTo({
        top: this.formElement.nativeElement.offsetTop - 50, // Scroll position minus offset for margin/padding if needed
        behavior: 'smooth', // Smooth scroll
      });
    }

    
  }
  private focusOnTopForm(): void {
      if (this.formTop) {
        this.formTop.nativeElement.focus();  // Focus on the element with reference #formTop
      }
  }
  private focusOnFirstInvalid() {
    const firstInvalidControl = this.getFirstInvalidControl();
    if (firstInvalidControl) {
      firstInvalidControl.focus();
    }
  }

  private getFirstInvalidControl(): HTMLInputElement | null {
    const controls = this.merchantForm.controls;
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
    /**
 * Password Hide/Show
 */
    toggleFieldTextType() {
      this.fieldTextType = !this.fieldTextType;
    }
    toggleConfirmFieldTextType() {
      this.confirmFieldTextType = !this.confirmFieldTextType;
    }
  

  
    onImageUpload(event: any): void {
      if (event.type === 'image') {
        // Handle Merchant Picture Upload
        this.merchantPictureBase64 = event.file;
        this.fileName2 = ''; // Set the file name
        this.existantmerchantPicture = event.file;
        this.merchantForm.controls['merchantPicture'].setValue(this.existantmerchantPicture);
      }
    }
    
    onLogoUpload(event: any): void {
      if (event.type === 'logo') {
        // Handle Logo Upload
        this.storeLogoBase64 = event.file;
        this.fileName1 = ''; // Set the file name
        this.existantmerchantLogo = event.file;
        this.merchantForm.controls['merchantLogo'].setValue(this.existantmerchantLogo);
      }
    }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
   
    this.merchantForm.reset();
    this.router.navigateByUrl('/private/merchants/list');
  }
  toggleViewMode(){

    if(this.fromPendingContext)
      this.router.navigateByUrl('/private/merchants/approve');
    else
      this.router.navigateByUrl('/private/merchants/list');

  }

}