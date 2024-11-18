/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import {  select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { deleteArealist,  fetchArealistData,  updateArealist} from 'src/app/store/area/area.action';
import { selectDataArea, selectDataLoading, selectDataTotalItems } from 'src/app/store/area/area-selector';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { Area } from 'src/app/store/area/area.model';


@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.css'
})
export class AreasComponent  implements OnInit {
 // bread crumb items
 // eslint-disable-next-line @typescript-eslint/ban-types
 breadCrumbItems: Array<{}>;
 public Modules = Modules;
 public Permission = Permission;

 areasList$: Observable<Area[]>;
 totalItems$: Observable<number>;
 loading$: Observable<boolean>

 isDropdownOpen : boolean = false;
 filteredArray: Area[] = [];
 originalArray: Area[] = [];

 itemPerPage: number = 10;
 currentPage : number = 1;
 
 columns : any[]= [
   { property: 'translation_data[0].name', label: 'Area' },
   { property: 'country.translation_data[0].name', label: 'Country' },
   { property: 'status', label: 'Status' },
 ];
 
 constructor(public store: Store) {
     
     this.areasList$ = this.store.pipe(select(selectDataArea)); 
     this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
     this.loading$ = this.store.pipe(select(selectDataLoading));


 }

 ngOnInit() {
  
   this.store.dispatch(fetchArealistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'' }));
   this.areasList$.subscribe(data => {
     this.originalArray = data; // Area the full Area list
     this.filteredArray = [...this.originalArray];
     document.getElementById('elmLoader')?.classList.add('d-none');
     

   });
      
 }
 onPageSizeChanged(event: any): void {
  const totalItems =  event.target.value;
  this.store.dispatch(fetchArealistData({ page: this.currentPage, itemsPerPage: totalItems, status:'' }));
 }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
   this.currentPage = event.page;
   this.store.dispatch(fetchArealistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status: '' }));
   
 }

 onDelete(id: any) {
   this.store.dispatch(deleteArealist({ AreaId: id }));
 }


 onChangeEvent( event: any) {
  const newStatus = event.event.checked ? 'active' : 'inactive'; 
  const newData = {id: event.data.id, status: newStatus }
  this.store.dispatch(updateArealist({ updatedData: newData }));
 }
 
 }
 




