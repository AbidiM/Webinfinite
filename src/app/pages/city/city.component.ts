/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import {  select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { deleteCitylist, fetchCitylistData, updateCitylist } from 'src/app/store/City/city.action';
import { selectDataCity, selectDataLoading, selectDataTotalItems } from 'src/app/store/City/city-selector';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { City } from 'src/app/store/City/city.model';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent  implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  public Modules = Modules;
  public Permission = Permission;

  citiesList$: Observable<City[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;

  isDropdownOpen : boolean = false;
  filteredArray: City[] = [];
  originalArray: City[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  columns : any[]= [
    { property: 'translation_data[0].name', label: 'Name' },
    { property: 'area.translation_data[0].name', label: 'Area' },
    { property: 'status', label: 'Status' },
  ];
  
  constructor(public store: Store) {
      
      this.citiesList$ = this.store.pipe(select(selectDataCity)); 
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));


  }

  ngOnInit() {
   
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'' }));
    this.citiesList$.subscribe(data => {
      this.originalArray = data; // City the full City list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
     

    });
       
  }
  onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: totalItems, status:'' }));
   }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCitylistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status: '' }));
    
  }

  onDelete(id: number) {
    this.store.dispatch(deleteCitylist({ CityId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateCitylist({ updatedData: newData }));
  }
  
  }
  



