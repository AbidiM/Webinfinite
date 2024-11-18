/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import {  Observable,  Subject, takeUntil } from 'rxjs';
import { DatepickerConfigService } from 'src/app/core/services/date.service';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { _User } from 'src/app/store/Authentication/auth.models';
import { selectDataLoading, selectedGiftCard } from 'src/app/store/giftCard/giftCard-selector';
import { addGiftCardlist, getGiftCardById, updateGiftCardlist } from 'src/app/store/giftCard/giftCard.action';
import { GiftCard } from 'src/app/store/giftCard/giftCard.model';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { fetchMerchantlistData } from 'src/app/store/merchantsList/merchantlist1.action';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { selectData } from 'src/app/store/store/store-selector';
import { fetchStorelistData } from 'src/app/store/store/store.action';
import { Branch } from 'src/app/store/store/store.model';

@Component({
  selector: 'app-form-gift-card',
  templateUrl: './form-gift-card.component.html',
  styleUrl: './form-gift-card.component.css'
})
export class FormGiftCardComponent implements OnInit, OnDestroy{

  @Input() type: string;

  merchantList$: Observable<Merchant[]>;
  loading$: Observable<boolean>
  storeList$: Observable<Branch[]> | undefined ;
  storeList: Branch[] = [];
  formError: string | null = null;
  formSubmitted = false;

  selectedStores: Branch[]= [];
  merchantList: Merchant[] = [];
  existantGiftCardLogo: string = null;
  fileName: string = ''; 

  merchantId: number =  null;
  currentRole: string = '';

  fromPendingContext: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>;
  public currentUser: Observable<_User>;

  dropdownSettings : any;
  formGiftCard: UntypedFormGroup;
  private destroy$ = new Subject<void>();
  GiftCardLogoBase64: string = null;
  originalGiftCardData: GiftCard = {};
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  isEditing = false;
  isLoading = false;


  constructor(
    private store: Store, 
    private formBuilder: UntypedFormBuilder, 
    private router: Router,
    private datepickerConfigService: DatepickerConfigService,
    private formUtilService: FormUtilService,
    private route: ActivatedRoute){
      
      this.getNavigationState();
      this.loading$ = this.store.pipe(select(selectDataLoading));

      this.currentRole = this.getCurrentUser()?.role.translation_data[0].name;
      this.merchantId =  this.getCurrentUser()?.merchantId;

      if(this.currentRole !== 'Admin')
          this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 1000 ,status:'', merchant_id: this.merchantId}));
    this.store.dispatch(fetchMerchantlistData({ page: 1, itemsPerPage: 100 , status: 'active'})); 
    
    this.initForm();
    this.bsConfig = this.datepickerConfigService.getConfig();

   
  }
  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = new Date(control.get('startDateGiftCard')?.value);
    const endDate = new Date(control.get('endDateGiftCard')?.value);
    const currentDate = new Date();
  
    if (startDate && endDate) {
      // Check if both dates are valid
      if (startDate < currentDate || endDate < currentDate) {
        return { invalidDate: true }; // Both dates must be >= current date
      }
      if (startDate >= endDate) {
        return { dateMismatch: true }; // Start date must be before end date
      }
    }
    return null; // Valid
  }
  private getCurrentUser(): _User {
    // Replace with your actual logic to retrieve the user role
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
   return currentUser;
} 
  private initForm() {
    this.formGiftCard = this.formBuilder.group({
      id: [null],
      name_ar: ['', Validators.required],
      name: ['', Validators.required],
      description_ar: ['', Validators.required],
      description: ['', Validators.required],
      termsAndConditions_ar: [''],
      termsAndConditions: [''],
      quantity: [null, Validators.required],
      merchant_id: [null, Validators.required],
      stores: [null, Validators.required],
      managerName: [''],
      managerName_ar: [''],
      managerPhone: [''],
      startDateGiftCard: ['', Validators.required],
      endDateGiftCard: ['', Validators.required],
      sectionOrderAppearance: [null],
      categoryOrderAppearance: [null],
      giftCardImage: ['',Validators.required],
      giftCardValue: ['',Validators.required],
      discount:[null]
      

    }, { validators: this.dateValidator });
  }
  ngOnInit() {
    

    this.merchantList$ = this.store.pipe(select(selectDataMerchant)); 
    this.merchantList$.subscribe(data => {
      if(data && data.length > 0){
          this.merchantList = [...data].map(merchant =>{
          const translatedName = merchant.translation_data && merchant.translation_data[0]?.name || 'No name available';
          return {
            ...merchant,  
            translatedName 
          };
        }).sort((a, b) => {
          // Sort by translatedName
          return a.translatedName.localeCompare(b.translatedName);
        });
    }
  }
  );
  

    this.storeList$ = this.store.pipe(select(selectData));

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
         

    if(this.currentRole !== 'Admin'){
      this.formGiftCard.get('merchant_id').setValue(this.merchantId);
      this.isLoading = true;
      }
    const GiftCardId = this.route.snapshot.params['id'];
    if (GiftCardId) {
      // Dispatch action to retrieve the GiftCard by ID
      this.store.dispatch(getGiftCardById({ GiftCardId }));
      // Subscribe to the selected GiftCard from the store
      this.store
        .pipe(select(selectedGiftCard), takeUntil(this.destroy$))
        .subscribe(GiftCard => {
          if (GiftCard) {
            
            if(this.currentRole == 'Admin'){
              this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 1000, status:'', merchant_id: GiftCard.merchant_id}));
            }
            this.storeList$ = this.store.pipe(select(selectData));
            // Patch the form with GiftCard data
            this.existantGiftCardLogo = GiftCard.giftCardImage;
            if(GiftCard.giftCardImage){
              this.fileName = GiftCard.giftCardImage.split('/').pop();
            }
            //GiftCard.startDateGiftCard = this.formatDate(GiftCard.startDateGiftCard);
            //GiftCard.endDateGiftCard = this.formatDate(GiftCard.endDateGiftCard);
            this.patchValueForm(GiftCard);
            this.originalGiftCardData = { ...GiftCard };
            this.isEditing = true;

          }
        });
    }
  
}
patchValueForm(giftCard: GiftCard){
  this.formGiftCard.patchValue(giftCard);
  this.formGiftCard.patchValue({
    name: giftCard.translation_data[0].name,
    name_ar: giftCard.translation_data[1].name,
    description: giftCard.translation_data[0].description,
    description_ar: giftCard.translation_data[1].description,
    termsAndConditions: giftCard.translation_data[0].termsAndConditions,
    termsAndConditions_ar: giftCard.translation_data[1].termsAndConditions,
  });

}
private getNavigationState(){
  /**Determining the context of the routing if it is from Approved State or Pending State */
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.fromPendingContext = navigation.extras.state.fromPending ;
    }
}
getMerchantName(MerchantId: any){
  
  return this.merchantList.find(merchant => merchant.id === MerchantId)?.translation_data[0].name ;
  
}

getFileNameFromUrl(url: string): string {
  if (!url) return '';
  const parts = url.split('/');
  return parts[parts.length - 1]; // Returns the last part, which is the filename
}
onChangeMerchantSelection(event: Merchant){
  const merchant = event;
  this.storeList = [];
  this.formGiftCard.get('stores').setValue(null);
  if(merchant){
    this.isLoading = true;
    this.store.pipe(select(selectData)).subscribe(data => {
      if(data && data.length > 0){
        this.storeList = [...data].map(store =>{
        const translatedName = store.translation_data && store.translation_data[0]?.name || 'No name available';
        return {
          ...store,  
          translatedName 
        };
      })
      .filter(store => store.merchant_id === merchant.id)
      .sort((a, b) => {
        // Sort by translatedName
        return a.translatedName.localeCompare(b.translatedName);
      })
     }
  });

  }
   
}
onPhoneNumberChanged(phoneNumber: string) {
  this.formGiftCard.get('managerPhone').setValue(phoneNumber);
}
createGiftCardFromForm(formValue): GiftCard{
  const giftCard = formValue;
  giftCard.translation_data= [];
  const enFields = [
    { field: 'name', name: 'name' },
    { field: 'description', name: 'description' },
    { field: 'termsAndConditions', name: 'termsAndConditions' },
    { field: 'managerName', name: 'managerName' }
  ];
  const arFields = [
    { field: 'name_ar', name: 'name' },
    { field: 'description_ar', name: 'description' },
    { field: 'termsAndConditions_ar', name: 'termsAndConditions' },
    { field: 'managerName_ar', name: 'managerName' }


  ];
  // Create the English translation if valid
  const enTranslation = this.formUtilService.createTranslation(giftCard,'en', enFields);
  if (enTranslation) {
    giftCard.translation_data.push(enTranslation);
  }

  // Create the Arabic translation if valid
  const arTranslation = this.formUtilService.createTranslation(giftCard,'ar', arFields);
  if (arTranslation) {
    giftCard.translation_data.push(arTranslation);
  }
  if(giftCard.translation_data.length <= 0)
    delete giftCard.translation_data;

  // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(giftCard).forEach(key => {
      if (giftCard[key] === undefined || giftCard[key] === null) {
        delete giftCard[key];  // Delete property if it's undefined or null
      }
    });
    delete giftCard.name;  
    delete giftCard.name_ar;    
    delete giftCard.description;
    delete giftCard.description_ar;
    delete giftCard.termsAndConditions;
    delete giftCard.termsAndConditions_ar;
  console.log(giftCard);
  return giftCard;

  
}
onSubmit(){

      this.formSubmitted = true;
      if (this.formGiftCard.invalid) {
        this.formError = 'Please complete all required fields.';
        Object.keys(this.formGiftCard.controls).forEach(control => {
          this.formGiftCard.get(control).markAsTouched();
        });
        this.formUtilService.focusOnFirstInvalid(this.formGiftCard);
        return;
      }
      this.formError = null;
      let newData = this.formGiftCard.value;
           
      newData.stores = this.formGiftCard.get('stores').value.map((store) =>(store.id ) );
      if(!this.isEditing)
      {         
          //Dispatch Action
          delete newData.id;
          newData = this.createGiftCardFromForm(newData);
          this.store.dispatch(addGiftCardlist({ newData }));
      }
      else{
        const updatedDta = this.formUtilService.detectChanges(this.formGiftCard, this.originalGiftCardData);
        if (Object.keys(updatedDta).length > 0) {
          const changedData = this.createGiftCardFromForm(updatedDta);
          console.log(changedData);
          changedData.id =  this.formGiftCard.value.id;
          this.store.dispatch(updateGiftCardlist({ updatedData: changedData }));
        }
        else{
          this.formError = 'Nothing has been changed!!!';
          this.formUtilService.scrollToTopOfForm(this.formElement);
        }
      }
      
    }
      
/**
 * Upload GiftCard Logo
 */
async uploadGiftCardLogo(event: any){
  if (event.type === 'logo') {
    this.existantGiftCardLogo = event.file;
    this.formGiftCard.controls['giftCardImage'].setValue(event.file);
  } 
}
  onCancel(){
    this.formGiftCard.reset();
    this.router.navigateByUrl('/private/giftCards');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleViewMode(){

    if(this.fromPendingContext)
      this.router.navigateByUrl('/private/giftCards/approve');
    else
      this.router.navigateByUrl('/private/giftCards');

  }

  
}