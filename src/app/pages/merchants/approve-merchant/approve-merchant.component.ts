/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import { select, Store } from '@ngrx/store';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { fetchMerchantlistData, updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
import { selectDataLoading, selectDataMerchant, selectDataTotalItems } from 'src/app/store/merchantsList/merchantlist1-selector';
import { Merchant } from 'src/app/store/merchantsList/merchantlist1.model';

@Component({
  selector: 'app-approve-merchant',
  templateUrl: './approve-merchant.component.html',
  styleUrl: './approve-merchant.component.css',
  providers: [DatePipe]
})
export class ApproveMerchantComponent implements OnInit {

// bread crumb items
// eslint-disable-next-line @typescript-eslint/ban-types
breadCrumbItems: Array<{}>;
public Modules = Modules;
public Permission = Permission;

merchantApprovalList$: Observable<Merchant[]>;
totalItems$: Observable<number>;
loading$: Observable<boolean>;

isDropdownOpen : boolean = false;
filteredArray: any[] = [];
originalArray: any[] = [];

itemPerPage: number = 10;
currentPage : number = 1;

columns : any[]= [
  { property: 'translation_data[0].name', label: 'Merchant Name' },
  { property: 'user.email', label: 'Email' },
  { property: 'user.createdAt', label: 'Request Date' },
  { property: 'user.status', label: 'Status' },
];
  constructor(public toastr:ToastrService,  public store: Store) {
    this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage , status: 'pending'}));
    this.loading$ = this.store.pipe(select(selectDataLoading));

  }
 

  ngOnInit() {
  
     
      setTimeout(() => {
        
        this.merchantApprovalList$ = this.store.pipe(select(selectDataMerchant));
        this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
        this.merchantApprovalList$.subscribe(
          data => {
            this.originalArray = data;
        }
      );
        document.getElementById('elmLoader')?.classList.add('d-none')
      }, 1200);
    }
     
    onPageSizeChanged(event: any): void {
      const totalItems =  event.target.value;
      this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: totalItems, status:'pending' }));
     }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'pending' }));
    
  }

  onApproveEvent( event: any) {
    this.store.dispatch(updateMerchantlist({ updatedData: event }));
  }


 
}