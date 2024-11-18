/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select , Store} from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { deleteStorelist, fetchStorelistData, updateStorelist } from 'src/app/store/store/store.action';
import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/store/store-selector';
import { Branch } from 'src/app/store/store/store.model';

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
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  storeList$: Observable<Branch[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;

  isDropdownOpen : boolean = false;
  filteredArray: Branch[] = [];
  originalArray: Branch[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  columns : any[]= [
    { property: 'translation_data[0].name', label: 'Branch Name' },
    { property: 'merchant.translation_data[0].name', label: 'Merchant' },
    { property: 'city.translation_data[0].name', label: 'City' },
    { property: 'totalOffres', label: 'Total Offers' },
    { property: 'status', label: 'Status' },
  ];

  constructor(public store: Store) {
      
      this.storeList$ = this.store.pipe(select(selectData)); // Observing the Store list from store
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

    }

  ngOnInit() {
          
        this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'', merchant_id:null}));
        this.storeList$.subscribe(data => {
        this.originalArray = data; // Store the full Store list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
   
        });
   }
   onSearchEvent(event: any){
    this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, query: event.target.value }));

   }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: totalItems,status:'', merchant_id:null}));
   }
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage,status:'', merchant_id:null}));
    
  }

  // Delete Store
  onDelete(id: number) {
    this.store.dispatch(deleteStorelist({ storeId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const updatedData = {id:event.data.id, status: newStatus}
    this.store.dispatch(updateStorelist({ updatedData: updatedData }));
  }


}
