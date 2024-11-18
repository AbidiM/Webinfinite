  import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
  import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { select, Store } from '@ngrx/store';
  import {  Observable, Subject, takeUntil } from 'rxjs';
  import { fetchCountrylistData } from 'src/app/store/country/country.action';
  import { selectDataCountry } from 'src/app/store/country/country-selector';
  import { selectDataArea } from 'src/app/store/area/area-selector';

import { fetchArealistData } from 'src/app/store/area/area.action';
import { selectedCity, selectDataLoading } from 'src/app/store/City/city-selector';
import { addCitylist, getCityById, updateCitylist } from 'src/app/store/City/city.action';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { City } from 'src/app/store/City/city.model';
import { Area } from 'src/app/store/area/area.model';
import { Country } from 'src/app/store/country/country.model';
  
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
    countries : Country[];
    areas : Area[];
    filteredAreas: Area[];

    originalCityData: City = {}; 
    @ViewChild('formElement', { static: false }) formElement: ElementRef;

    
    
    constructor(
      private formBuilder: UntypedFormBuilder,
      private route: ActivatedRoute, 
      private router: Router,
      private formUtilService: FormUtilService,
      public store: Store) {
        
        this.loading$ = this.store.pipe(select(selectDataLoading)); 
        this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 1000, status:'active' }));
        this.store.dispatch(fetchArealistData({ page: 1, itemsPerPage: 10000, status:'active' }));
        
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
       fetchCountry(){
        this.store.select(selectDataCountry).subscribe((data) =>{
          this.countries = [...data].map(country =>{
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
     
    ngOnInit() {
      this.fetchCountry();
      this.fetchAreas();
  
      const CityId = this.route.snapshot.params['id'];
      if (CityId) {
        // Dispatch action to retrieve the city by ID
        this.store.dispatch(getCityById({ CityId }));
        
        // Subscribe to the selected city from the city
        this.store
          .pipe(select(selectedCity), takeUntil(this.destroy$))
          .subscribe(city => {
            if (city) {
              this.cityForm.controls['country_id'].setValue(city.area.country_id);
              this.patchValueForm(city);
              this.originalCityData = { ...city };

              this.isEditing = true;
              }
          });
      }
     
    }
    patchValueForm(city: City){
      this.cityForm.patchValue({
        id: city.id,
        name: city.translation_data[0].name,
        name_ar: city.translation_data[1].name,
        area_id: city.area_id,
        longitude: city.latitude,
        latitude: city.longitude

      });

    }
    
    createCityFromForm(formValue): City{

      const city = formValue;
      city.translation_data= [];
      const enFields = [
        { field: 'name', name: 'name' },
           
      ];
      const arFields = [
        { field: 'name_ar', name: 'name' },
            ];
      
      // Create the English translation if valid
      const enTranslation = this.formUtilService.createTranslation(city,'en', enFields);
      if (enTranslation) {
        city.translation_data.push(enTranslation);
      }

      // Create the Arabic translation if valid
      const arTranslation = this.formUtilService.createTranslation(city,'ar', arFields);
      if (arTranslation) {
        city.translation_data.push(arTranslation);
      }
      if(city.translation_data.length <= 0)
        delete city.translation_data;
         
      // Dynamically remove properties that are undefined or null at the top level of city object
        Object.keys(city).forEach(key => {
          if (city[key] === undefined || city[key] === null) {
            delete city[key];  // Delete property if it's undefined or null
          }
        });
      
      console.log(city);
      return city;
     
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
                
        if(!this.isEditing)
          { 
            const newData = this.createCityFromForm(this.cityForm.value);
            delete newData.id;
            this.store.dispatch(addCitylist({ newData }));         
          }
          else
          { 
            const updatedDta = this.formUtilService.detectChanges<City>(this.cityForm, this.originalCityData);
            if (Object.keys(updatedDta).length > 0) {
              const changedData = this.createCityFromForm(updatedDta);
              changedData.id = this.cityForm.value.id;
              this.store.dispatch(updateCitylist({ updatedData: changedData }));
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
  
  
