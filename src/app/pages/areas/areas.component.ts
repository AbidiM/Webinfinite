import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import {  select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { deleteArealist,  fetchArealistData,  updateArealist} from 'src/app/store/area/area.action';
import { selectDataArea } from 'src/app/store/area/area-selector';
import { Modules, Permission } from 'src/app/store/Role/role.models';


@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.css'
})
export class AreasComponent  implements OnInit {
 // bread crumb items
 breadCrumbItems: Array<{}>;
 public Modules = Modules;
 public Permission = Permission;

 areasList$: Observable<any[]>;
 isDropdownOpen : boolean = false;
 filteredArray: any[] = [];
 originalArray: any[] = [];

 itemPerPage: number = 10;
 currentPage : number = 1;
 
 columns : any[]= [
   { property: 'name', label: 'Area' },
   { property: 'country.name', label: 'Country' },
   { property: 'status', label: 'Status' },
 ];
 
 constructor(public store: Store) {
     
     this.areasList$ = this.store.pipe(select(selectDataArea)); 

 }

 ngOnInit() {
  
   this.store.dispatch(fetchArealistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'' }));
   this.areasList$.subscribe(data => {
     this.originalArray = data; // Area the full Area list
     this.filteredArray = [...this.originalArray];
     document.getElementById('elmLoader')?.classList.add('d-none');
     console.log('Finish get Area list');
     console.log(this.filteredArray);

   });
      
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
   const newStatus = event.checked ? 'active' : 'inactive'; 
   console.log('Area ID:', event.data.id, 'New Status:', newStatus);
   event.data.status = newStatus;
   this.store.dispatch(updateArealist({ updatedData: event.data }));
 }
 
 }
 




