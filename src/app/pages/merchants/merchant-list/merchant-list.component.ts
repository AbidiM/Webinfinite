/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectDataLoading, selectDataMerchant, selectDataTotalItems } from 'src/app/store/merchantsList/merchantlist1-selector';
import { deleteMerchantlist, fetchMerchantlistData, updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';
import { Modules, Permission } from 'src/app/store/Role/role.models';

/**
 * Merchants list component
 */

@Component({
  selector: 'app-merchant-list',
  templateUrl: './merchant-list.component.html',
  styleUrl: './merchant-list.component.css'
})
export class MerchantListComponent implements OnInit {


  breadCrumbItems: Array<{}>;
  
  public Modules = Modules;
  public Permission = Permission;


  MerchantList$: Observable<Merchant[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>

  isDropdownOpen : boolean = false;
  filteredArray: Merchant[] = [];
  originalArray: Merchant[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  checked : any = {status: 'active', label: 'Active'};
  unChecked : any = {status: 'inactive', label: 'inActive'};
  
  columns : any[]= [
    { property: 'merchantLogo', label: 'Merchant Logo' },
    { property: 'qrCode', label: 'Qr Merchant' },
    { property: 'activationCode', label: 'Activation Code' },
    { property: 'translation_data[0].name', label: 'Merchant_Name' },
    { property: 'user.city.translation_data[0].name', label: 'City' },
    { property: 'totalOffres', label: 'Total Offers' },
    { property: 'totalStores', label: 'Total Stores' },
    { property: 'user.status', label: 'Status' },
  ];

  constructor(public store: Store) {
      
      this.MerchantList$ = this.store.pipe(select(selectDataMerchant)); // Observing the Merchant list from Merchant
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
          
        this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status: ''  }));
        this.MerchantList$.subscribe(data => {
        this.originalArray = data; // Merchant the full Merchant list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
       
        });
   }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: totalItems, status:'' }));
   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage , status: ''}));
    
  }

  // Delete Merchant
  onDelete(id: any) {
    this.store.dispatch(deleteMerchantlist({userId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateMerchantlist({ updatedData: newData }));
  }
}