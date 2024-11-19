/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { select, Store } from '@ngrx/store';
import { getMerchantById, updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
import { Observable, Subject } from 'rxjs';
import { selectDataLoading, selectedMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { selectDataSection } from 'src/app/store/section/section-selector';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { Country } from 'src/app/store/country/country.model';
import { Area } from 'src/app/store/area/area.model';
import { City } from 'src/app/store/City/city.model';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { UploadEvent } from 'src/app/shared/widget/image-upload/image-upload.component';
import { FormUtilService } from 'src/app/core/services/form-util.service';
@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent implements OnInit {
  @Input() type: string;
  merchantForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  private destroy$ = new Subject<void>();
  breadCrumbItems: Array<object>;

  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;
  fieldTextType!: boolean;
  imageURL: string | undefined;
  existantmerchantLogo: string = null;
  existantmerchantPicture: string = null
  merchantPictureBase64: string = null;
  storeLogoBase64: string = null;
  isEditing: boolean = false;
  fromPendingContext: boolean = false;

  countrylist: Country[] = [];
  countrylist$: Observable<Country[]>  ;
  arealist$:  Observable<Area[]>  ;
  currentMerchant :  Merchant  ;

  citylist$:  Observable<City[]> ;
  loading$: Observable<boolean>;

  sectionlist:  any[] = [];
  
  filteredCountries: Country[] = [];
  filteredAreas :  Area[] = [];
  filteredCities:  City[] = [];
  serviceTypes: string[] = ['company', 'entreprise'];
  originalMerchantData: Merchant = {}; 
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  
 
  constructor(
    private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private formUtilService: FormUtilService,
    public store: Store) {

      this.loading$ = this.store.pipe(select(selectDataLoading)); 
      const ID = this.getCurrentUserId();

      this.store.dispatch(getMerchantById({merchantId: ID }));
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 100, status: 'active' }));
      this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 1000, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 10000, status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 100, status: 'active' }));
     
      this.initForm();
      
     }
     private getCurrentUserId(): number {
      // Replace with your actual logic to retrieve the user role
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if(currentUser.role.translation_data[0].name !== 'Admin'){
         return currentUser.merchantId ;
      }
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
    country_id:[null,Validators.required],
    city_id:[null,Validators.required],
    area_id:[null,Validators.required], 
    serviceType: ['', Validators.required],
    supervisorName: ['', Validators.required],
    supervisorName_ar: ['', Validators.required],
    supervisorPhone: ['', Validators.required],
    bankAccountNumber: [''],
    qrCode: [''],
    activationCode:[''],
    merchantName:['', Validators.required],
    merchantName_ar:['', Validators.required],
    merchantPicture: ['', Validators.required],
    merchantLogo: ['', Validators.required],
    section_id:['', Validators.required],
    website: [''],
    whatsup:[''],
    facebook: [''],
    twitter: [''],
    instagram: ['']
    

  });} 
  // set the currenr year
  year: number = new Date().getFullYear();
  fileName1: string = ''; 
  fileName2: string = ''; 
  globalId : number = null;

  ngOnInit() {
    this.fetchCountry();
    this.fetchAreas();
    this.fetchCities();
    this.fetchSection();

    this.store.select(selectedMerchant).subscribe(
      merchant => {
        if (merchant) {
          
          this.existantmerchantLogo = merchant.merchantLogo;
          this.existantmerchantPicture = merchant.merchantPicture;
          this.fileName1 = merchant.merchantLogo.split('/').pop();
          this.fileName2 = merchant.merchantPicture.split('/').pop();
          
          this.merchantForm.controls['country_id'].setValue(merchant.user.city.area.country_id);
          this.merchantForm.controls['area_id'].setValue(merchant.user.city.area_id);
          this.merchantForm.controls['city_id'].setValue(merchant.user.city_id);
          this.merchantForm.controls['section_id'].setValue(merchant.section_id);

          this.globalId = merchant.id;
          this.patchValueForm(merchant);
          this.originalMerchantData = _.cloneDeep(merchant);
          this.isEditing = true;

        }this.currentMerchant = merchant
      
    });
    }
   
    patchValueForm(merchant: Merchant){
      this.merchantForm.patchValue(merchant);
      this.merchantForm.patchValue(merchant.user);
      this.merchantForm.patchValue({
        merchantName: merchant.translation_data[0].name,
        merchantName_ar: merchant.translation_data[1].name,
        supervisorName: merchant.translation_data[0].supervisorName,
        supervisorName_ar: merchant.translation_data[1].supervisorName,
        
      });
    
    }
    fetchCountry(){
      this.store.select(selectDataCountry).subscribe((data) =>{
        this.filteredCountries = [...data].map(country =>{
          const translatedName = country.translation_data && country.translation_data[0]?.name || 'No name available';
      
          return {
            ...country,  
            translatedName 
          };
        }).sort((a, b) => {
          // Sort by translatedName
          return a.translatedName.localeCompare(b.translatedName);
        });
      });
    }
    fetchSection(){
      this.store.select(selectDataSection).subscribe((data) => {
        this.sectionlist = [...data].map(section => {
          // Extract the translated name (assuming translation_data[0] exists)
          const translatedName = section.translation_data && section.translation_data[0]?.name || 'No name available';
      
          return {
            ...section,  // Spread the original section data
            translatedName // Add the translatedName property for easy binding
          };
        }).sort((a, b) => {
          // Sort by translatedName
          return a.translatedName.localeCompare(b.translatedName);
        });
      });
  
    }
    fetchAreas(){
      this.store.select(selectDataArea).subscribe(data =>
        this.filteredAreas =  [...data].map(area =>{
        const translatedName = area.translation_data && area.translation_data[0]?.name || 'No name available';
        return {
          ...area,  
          translatedName 
        };
      })
      .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
      }));
    }
    fetchCities(){
      this.store.select(selectDataCity).subscribe((data) => {
        this.filteredCities = [...data].map(city =>{
         const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
     
         return {
           ...city,  
           translatedName 
         };
       })
       .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
       });
     });
    }

    onChangeCountrySelection(event: Country){
      const country = event;
      console.log(country);
      this.merchantForm.get('area_id').setValue(null);
      this.merchantForm.get('city_id').setValue(null);
      this.filteredAreas = [];
      this.filteredCities = [];
  
      if(country){
        this.store.select(selectDataArea).subscribe(data =>
          this.filteredAreas =  [...data].map(area =>{
          const translatedName = area.translation_data && area.translation_data[0]?.name || 'No name available';
          return {
            ...area,  
            translatedName 
          };
        })
        .filter(area => area.country_id === country.id)
        .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
        }));
      }
     
      
    }
    onChangeAreaSelection(event: Area){
      const area = event;
      this.filteredCities = [];
      this.merchantForm.get('city_id').setValue(null);
  
      if(area){
        this.store.select(selectDataCity).subscribe((data) => {
          this.filteredCities = [...data].map(city =>{
           const translatedName = city.translation_data && city.translation_data[0]?.name || 'No name available';
       
           return {
             ...city,  
             translatedName 
           };
         })
         .filter(city => city.area_id === area.id)
         .sort((a, b) => {return a.translatedName.localeCompare(b.translatedName);
         });
       });
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
    const merchant = formValue;
    merchant.translation_data = [];
    const enFields = [
      { field: 'merchantName', name: 'name' },
      { field: 'supervisorName', name: 'supervisorName' }
    ];
    const arFields = [
      { field: 'merchantName_ar', name: 'name' },
      { field: 'supervisorName_ar', name: 'supervisorName' }
    ];
   // Create the English translation if valid
    const enTranslation = this.formUtilService.createTranslation(merchant,'en', enFields );
    if (enTranslation) {
      merchant.translation_data.push(enTranslation);
    }
   
    // Create the Arabic translation if valid
    const arTranslation = this.formUtilService.createTranslation(merchant,'ar', arFields );
    if (arTranslation) {
      merchant.translation_data.push(arTranslation);
    }
    if(merchant.translation_data.length <= 0)
      delete merchant.translation_data;
    // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(merchant).forEach(key => {
      if (merchant[key] === undefined || merchant[key] === null) {
          delete merchant[key];  // Delete property if it's undefined or null
       }
    });

   delete merchant.merchantName;  
   delete merchant.merchantName_ar;    
   delete merchant.supervisorName;
   delete merchant.supervisorName_ar;
   delete merchant.area_id;
   delete merchant.country_id;

   return merchant;
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
      this.formUtilService.focusOnFirstInvalid(this.merchantForm);
      return;
    }
    this.formError = null;
      const newData = this.merchantForm.value;
      if(this.storeLogoBase64){
        newData.merchantLogo = this.storeLogoBase64;
      }
      if(this.merchantPictureBase64){
        newData.merchantPicture = this.merchantPictureBase64;
      }
          
      newData.id = this.globalId;
      const updatedDta = this.formUtilService.detectChanges(this.merchantForm, this.originalMerchantData);
      if (Object.keys(updatedDta).length > 0) {
        const changedData = this.createMerchantFromForm(updatedDta);
        console.log(changedData);
        changedData.id = newData.id;
        this.store.dispatch(updateMerchantlist({ updatedData: changedData }));
      }
      else{
        this.formError = 'Nothing has been changed!!!';
        this.formUtilService.scrollToTopOfForm(this.formElement);
      }
        
      
    
  }
     
  onImageUpload(event: UploadEvent): void {
    if (event.type === 'image') {
      // Handle Merchant Picture Upload
      this.merchantPictureBase64 = event.file;
      this.fileName2 = ''; // Set the file name
      this.existantmerchantPicture = event.file;
      this.merchantForm.controls['merchantPicture'].setValue(this.existantmerchantPicture);
    }
  }
  
  onLogoUpload(event: UploadEvent): void {
    if (event.type === 'logo') {
      // Handle Logo Upload
      this.storeLogoBase64 = event.file;
      this.fileName1 = ''; // Set the file name
      this.existantmerchantLogo = event.file;
      this.merchantForm.controls['merchantLogo'].setValue(this.existantmerchantLogo);
    }
  }
  onCancel(){

    this.merchantForm.reset();
    this.router.navigateByUrl('/private/coupons');
  }
  
}