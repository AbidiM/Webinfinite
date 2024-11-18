/* eslint-disable @typescript-eslint/no-explicit-any */

  import { Component, OnInit } from '@angular/core';
  import { Observable } from 'rxjs';

  import {  select, Store } from '@ngrx/store';
  import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { deleteCountrylist, fetchCountrylistData, updateCountrylist } from 'src/app/store/country/country.action';
import { selectDataCountry, selectDataLoading, selectDataTotalItems } from 'src/app/store/country/country-selector';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { Country } from 'src/app/store/country/country.model';
  
 
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrl: './country.component.css'
})
export class CountryComponent implements OnInit {
  
  // bread crumb items
  // eslint-disable-next-line @typescript-eslint/ban-types
  breadCrumbItems: Array<{}>;
  public Modules = Modules;
  public Permission = Permission;
  
  countriesList$: Observable<Country[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>

  isDropdownOpen : boolean = false;
  filteredArray: Country[] = [];
  originalArray: Country[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  columns : any[]= [
    { property: 'flag', label: 'Flag' },
    { property: 'translation_data[0].name', label: 'Country' },
    { property: 'phoneCode', label: 'Country_Code' },
    { property: 'status', label: 'Status' },
  ];
  
  constructor(public store: Store) {
      
      this.countriesList$ = this.store.pipe(select(selectDataCountry)); 
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));


  }

  ngOnInit() {
   
    this.store.dispatch(fetchCountrylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'' }));
    this.countriesList$.subscribe(data => {
      this.originalArray = data; // Country the full Country list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
   

    });
       
  }
  onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchCountrylistData({ page: this.currentPage, itemsPerPage: totalItems, status:'' }));
   }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCountrylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status: '' }));
    
  }

  onDelete(id: any) {
    this.store.dispatch(deleteCountrylist({ CountryId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateCountrylist({ updatedData: newData }));
  }
  
  }
  
