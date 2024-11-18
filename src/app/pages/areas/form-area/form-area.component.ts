import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { addArealist,  getAreaById, updateArealist } from 'src/app/store/area/area.action';
import { selectedArea, selectDataLoading } from 'src/app/store/area/area-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { Country } from '../../../store/country/country.model';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { Area } from 'src/app/store/area/area.model';



@Component({
  selector: 'app-form-area',
  templateUrl: './form-area.component.html',
  styleUrl: './form-area.component.css'
})

export class FormAreaComponent implements OnInit, OnDestroy {
  
  @Input() type: string;
  areaForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  loading$: Observable<boolean>;

  private destroy$ = new Subject<void>();
  areaFlagBase64 : string;
  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;
  fieldTextType!: boolean;
  imageURL: string | undefined;
  isEditing: boolean = false;
  countries : Country[];
 
  originalAreaData: Area = {}; 
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private formUtilService: FormUtilService,
    public store: Store) {
     
      this.loading$ = this.store.pipe(select(selectDataLoading)); 
      this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 1000, status:'active' }));

      this.areaForm = this.formBuilder.group({
        id:[null],
        name: ['', Validators.required],
        name_ar: ['', Validators.required],
        country_id:[null, Validators.required]
                   
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
  patchValueForm(area: Area){
      this.areaForm.patchValue({
        id: area.id,
        name: area.translation_data[0].name,
        name_ar: area.translation_data[1].name,
        country_id: area.country_id,
        });
    }
  ngOnInit() {
    this.fetchCountry();
    const AreaId = this.route.snapshot.params['id'];
    if (AreaId) {
      // Dispatch action to retrieve the Area by ID
      this.store.dispatch(getAreaById({ AreaId }));
      
      // Subscribe to the selected Area from the Area
      this.store
        .pipe(select(selectedArea), takeUntil(this.destroy$))
        .subscribe(Area => {
          if (Area) {

            this.patchValueForm(Area);
            this.originalAreaData = { ...Area };
            this.isEditing = true;
            }
        });
    }
   
  }
  createAreaFromForm(formValue): Area{
    const area = formValue;
      area.translation_data= [];
      const enFields = [
        { field: 'name', name: 'name' },
           
      ];
      const arFields = [
        { field: 'name_ar', name: 'name' },
            ];
      
      // Create the English translation if valid
      const enTranslation = this.formUtilService.createTranslation(area,'en', enFields);
      if (enTranslation) {
        area.translation_data.push(enTranslation);
      }

      // Create the Arabic translation if valid
      const arTranslation = this.formUtilService.createTranslation(area,'ar', arFields);
      if (arTranslation) {
        area.translation_data.push(arTranslation);
      }
      if(area.translation_data.length <= 0)
        delete area.translation_data;
         
      // Dynamically remove properties that are undefined or null at the top level of area object
      Object.keys(area).forEach(key => {
        if (area[key] === undefined || area[key] === null) {
          delete area[key];  // Delete property if it's undefined or null
        }
      });
    
    console.log(area);
    return area;

    
  }
  
  /**
   * On submit form
   */
  onSubmit() {
    this.formSubmitted = true;

    if (this.areaForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.areaForm.controls).forEach(control => {
        this.areaForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.areaForm);
      return;
    }
    this.formError = null;
            
    
      if(!this.isEditing)
        { const newData = this.createAreaFromForm(this.areaForm.value);
          delete newData.id;
          this.store.dispatch(addArealist({ newData }));          }
        else
        {
          const updatedDta = this.formUtilService.detectChanges<Area>(this.areaForm, this.originalAreaData);
          if (Object.keys(updatedDta).length > 0) {
            const changedData = this.createAreaFromForm(updatedDta);
            changedData.id = this.areaForm.value.id;
            this.store.dispatch(updateArealist({ updatedData: changedData }));
          }
          else{
            this.formError = 'Nothing has been changed!!!';
            this.formUtilService.scrollToTopOfForm(this.formElement);
          }
        }
      
    
  }
 
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    
    this.areaForm.reset();
    this.router.navigateByUrl('/private/areas');
  }
  getCountryName(id: number){
    return this.countries.find(country => country.id === id)?.translation_data[0].name ;
  }
  toggleViewMode(){
    this.router.navigateByUrl('/private/areas');

}
}

