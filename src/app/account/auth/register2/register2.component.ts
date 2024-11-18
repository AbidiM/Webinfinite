import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Register } from 'src/app/store/Authentication/authentication.actions';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { fetchArealistData } from 'src/app/store/area/area.action';
import { fetchCitylistData } from 'src/app/store/City/city.action';
import { Observable } from 'rxjs';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { selectDataCity } from 'src/app/store/City/city-selector';
import { fetchSectionlistData } from 'src/app/store/section/section.action';
import { selectDataSection } from 'src/app/store/section/section-selector';
import { selectDataLoading } from 'src/app/store/Authentication/authentication-selector';
import { Country } from 'src/app/store/country/country.model';
import { Area } from 'src/app/store/area/area.model';
import { City } from 'src/app/store/City/city.model';
import { SectionListModel } from 'src/app/store/section/section.model';
import { UploadEvent } from 'src/app/shared/widget/image-upload/image-upload.component';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.scss']
})
export class Register2Component implements OnInit {

  signupForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;

  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;
  fieldTextType!: boolean;
  confirmFieldTextType: boolean = false;

  imageURL: string | undefined;
  merchantPictureBase64: string = null;
  storeLogoBase64: string = null;
  
  countrylist: Country[] = [];
  arealist$:  Observable<Area[]>  ;
  citylist$:  Observable<City[]> ;
  loading$: Observable<boolean>;
  serviceTypes: string[] = ['company', 'entreprise'];
  existantmerchantLogo: string = null;
  existantmerchantPicture: string = null

  sectionlist:  SectionListModel[] = [];

  filteredAreas :  Area[] = [];
  filteredCities:  City[] = [];

 
  constructor  (
    private formBuilder: UntypedFormBuilder, 
    private router: Router, 
    private formUtilService: FormUtilService,
    public store: Store) { 

      this.loading$ = this.store.pipe(select(selectDataLoading));
      this.store.dispatch(fetchCountrylistData({page: 1, itemsPerPage: 100, status: 'active' }));
      this.store.dispatch(fetchArealistData({page: 1, itemsPerPage: 1000, status: 'active' }));
      this.store.dispatch(fetchCitylistData({page: 1, itemsPerPage: 10000, status: 'active' }));
      this.store.dispatch(fetchSectionlistData({page: 1, itemsPerPage: 100, status: 'active' }));
      this.initForm();


  }
  initForm(){
    

    this.signupForm = this.formBuilder.group({
      
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confpassword: ['', Validators.required],
      id_number: ['', Validators.required],
      phone:['',Validators.required], //Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)*/],
      country_id:[''],
      city_id:[''],
      area_id:[''], 
      serviceType: ['',Validators.required],
      supervisorName: ['', Validators.required],
      supervisorName_ar: ['', Validators.required],
      supervisorPhone: [''],
      bankAccountNumber: [''],
      merchantName:['', Validators.required],
      merchantName_ar:['', Validators.required],
      merchantPicture: [''],
      merchantLogo: [''],
      section_id:['', Validators.required],
      website: [''],
      whatsup:[''],
      facebook: [''],
      twitter: [''],
      instagram: [''],

    }, {validators: [this.passwordMatchValidator]});
  }
  // set the currenr year
  year: number = new Date().getFullYear();
  fileName1: string = ''; 
  fileName2: string = ''; 

  ngOnInit() {
    document.body.classList.add("auth-body-bg");
    this.fetchCountry();
    this.fetchAreas();
    this.fetchCities();
    this.fetchSection();
    
  }
  fetchCountry(){
    this.store.select(selectDataCountry).subscribe((data) =>{
      this.countrylist = [...data].map(country =>{
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
  get passwordMatchError() {
    return (
      this.signupForm.getError('passwordMismatch') &&
      this.signupForm.get('confpassword')?.touched
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
  
  onChangeCountrySelection(event: Country){
    const country = event;
    console.log(country);
    this. signupForm.get('area_id').setValue(null);
    this. signupForm.get('city_id').setValue(null);
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
    this. signupForm.get('city_id').setValue(null);

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
    this.signupForm.get('phone').setValue(phoneNumber);
  }

  onSupervisorPhoneChanged(phoneNumber: string) {
    this.signupForm.get('supervisorPhone').setValue(phoneNumber);
  }
  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true
  };
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

    if (this.signupForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.signupForm.controls).forEach(control => {
        this.signupForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.signupForm);
      return;
    }
    this.formError = null;
      
      
      const newData = this.signupForm.value;
      if(this.storeLogoBase64){
        newData.merchantLogo = this.storeLogoBase64;
      }
      if(this.merchantPictureBase64){
        newData.merchantPicture = this.merchantPictureBase64;
      }
      delete newData.confpassword;
  
      //Dispatch Action
      this.store.dispatch(Register({ newData: this.createMerchantFromForm(newData) }));

   
  }
  
  onCancel(){
 
    this.signupForm.reset();
    this.router.navigateByUrl('/auth/login');
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
  
  onImageUpload(event: UploadEvent): void {
    if (event.type === 'image') {
      // Handle Merchant Picture Upload
      this.merchantPictureBase64 = event.file;
      this.fileName2 = ''; // Set the file name
      this.existantmerchantPicture = event.file;
      this. signupForm.controls['merchantPicture'].setValue(this.existantmerchantPicture);
    }
  }
  
  onLogoUpload(event: UploadEvent): void {
    if (event.type === 'logo') {
      // Handle Logo Upload
      this.storeLogoBase64 = event.file;
      this.fileName1 = ''; // Set the file name
      this.existantmerchantLogo = event.file;
      this. signupForm.controls['merchantLogo'].setValue(this.existantmerchantLogo);
    }
  }
}
