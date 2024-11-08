import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
  import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { select, Store } from '@ngrx/store';
  import {  Observable, Subject, takeUntil } from 'rxjs';
  import { fetchCountrylistData } from 'src/app/store/country/country.action';
  import { selectDataCountry } from 'src/app/store/country/country-selector';
  import { selectDataArea } from 'src/app/store/area/area-selector';

import { fetchArealistData } from 'src/app/store/area/area.action';
import { selectCityById, selectDataLoading } from 'src/app/store/City/city-selector';
import { addCitylist, getCityById, updateCitylist } from 'src/app/store/City/city.action';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { CityListModel } from 'src/app/store/City/city.model';
import { AreaListModel } from 'src/app/store/area/area.model';
import { CountryListModel } from 'src/app/store/country/country.model';
  
@Component({
  selector: 'app-form-city',
  templateUrl: './form-city.component.html',
  styleUrl: './form-city.component.css'
})
export class FormCityComponent  implements OnInit, OnDestroy {
    
    @Input() type: string;
    cityForm: UntypedFormGroup;
    formError: string | null = null;
    formSubmitted = false;
    loading$: Observable<boolean>;

    private destroy$ = new Subject<void>();
    submitted: boolean = false;
    error: string = '';
    successmsg: boolean = false;
    fieldTextType!: boolean;
    imageURL: string | undefined;
    isEditing: boolean = false;
    countries : CountryListModel[];
    areas : AreaListModel[];
    filteredAreas: AreaListModel[];

    originalCityData: CityListModel = {}; 
    @ViewChild('formElement', { static: false }) formElement: ElementRef;

    
    
    constructor(
      private formBuilder: UntypedFormBuilder,
      private route: ActivatedRoute, 
      private router: Router,
      private formUtilService: FormUtilService,
      public store: Store) {
        
        this.loading$ = this.store.pipe(select(selectDataLoading)); 
        this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 1000, status:'active' }));
        this.store.select(selectDataCountry).subscribe(
          countries => {
            this.countries = countries
          });

        this.store.dispatch(fetchArealistData({ page: 1, itemsPerPage: 10000, status:'active' }));
        this.store.select(selectDataArea).subscribe(
            areas => {
              this.areas = areas
            })
        this.cityForm = this.formBuilder.group({
          id:[null],
          name: ['', Validators.required],
          name_ar: ['', Validators.required],
          country_id:[null, Validators.required],
          area_id:[null, Validators.required],
          longitude: ['long'],
          latitude: ['lat']
                     
        });
       }
    
      
    ngOnInit() {
  
      const CityId = this.route.snapshot.params['id'];
      if (CityId) {
        // Dispatch action to retrieve the city by ID
        this.store.dispatch(getCityById({ CityId }));
        
        // Subscribe to the selected city from the city
        this.store
          .pipe(select(selectCityById(CityId)), takeUntil(this.destroy$))
          .subscribe(city => {
            if (city) {
              this.filteredAreas = this.areas;
              this.cityForm.controls['country_id'].setValue(city.area.country_id);
              this.cityForm.patchValue(city);

              this.originalCityData = { ...city };

              this.isEditing = true;
              }
          });
      }
     
    }
    getCountryName(id: number){
      this.filteredAreas = this.areas.filter(area => area.country_id == id);
      return this.countries.find(country => country.id === id)?.name ;
    }
    getAreaName(id: number){
      return this.filteredAreas.find(area => area.id === id)?.name ;
    }
    /**
     * On submit form
     */
    onSubmit() {
      this.formSubmitted = true;

    if (this.cityForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.cityForm.controls).forEach(control => {
        this.cityForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.cityForm);
      return;
    }
    this.formError = null;
    
              
        const newData = this.cityForm.value;
      
        if(!this.isEditing)
          { delete newData.id;
            delete newData.country_id;
            
            this.store.dispatch(addCitylist({ newData }));          }
          else
          { 
            const updatedDta = this.formUtilService.detectChanges<CityListModel>(this.cityForm, this.originalCityData);
            if (Object.keys(updatedDta).length > 0) {
              updatedDta.id = newData.id;
              console.log(updatedDta);
              this.store.dispatch(updateCitylist({ updatedData: newData }));
            }
            else{
              this.formError = 'Nothing has been changed!!!';
              this.formUtilService.scrollToTopOfForm(this.formElement);
            }
          }
    
    }
   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChangeCountrySelection(event : any){
      const country = event.id;
      if(country){
        this.filteredAreas = this.areas.filter(area => area.country_id == country);
      }
      else
      {
        this.filteredAreas = [];

      }
      
    }
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
    onCancel(){
     
      this.cityForm.reset();
      this.router.navigateByUrl('/private/cities');
    }
    toggleViewMode(){
      this.router.navigateByUrl('/private/cities');
}
  
  }
  
  
