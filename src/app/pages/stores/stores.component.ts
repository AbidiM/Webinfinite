import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { deleteStorelist, fetchStorelistData, updateStorelist } from 'src/app/store/store/store.action';
import { selectData } from 'src/app/store/store/store-selector';

/**
 * Stores component
 */

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.css'
})
export class StoresComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  public Modules = Modules;
  public Permission = Permission;

  storeList$: Observable<any[]>;
  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  columns : any[]= [
    { property: 'name', label: 'Store Name' },
    { property: 'merchant.merchantName', label: 'Merchant' },
    { property: 'city.name', label: 'City' },
    { property: 'totalOffres', label: 'Total Offers' },
    { property: 'status', label: 'Status' },
  ];

  constructor(public store: Store) {
      
      this.storeList$ = this.store.pipe(select(selectData)); // Observing the Store list from store
  }

  ngOnInit() {
          
        this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, merchant_id: '' }));
        this.storeList$.subscribe(data => {
        this.originalArray = data; // Store the full Store list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
        console.log('Finish get Store list');
        console.log(this.filteredArray);
        });
   }
   onSearchEvent(event: any){
    console.log(event);
    //this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,query: event.target.value }));

   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,merchant_id: '' }));
    
  }

  // Delete Store
  onDelete(id: any) {
    this.store.dispatch(deleteStorelist({ storeId: id }));
  }

 
  onChangeEvent( event: any) {
   // console.log(event);
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    console.log('Store ID:', event.data.id, 'New Status:', newStatus);
    event.data.status = newStatus;
    const updatedData = {id:event.data.id, status: event.data.status}
    this.store.dispatch(updateStorelist({ updatedData: updatedData }));
  }


}
