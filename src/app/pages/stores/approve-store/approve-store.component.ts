/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/store/store-selector';
import { fetchStorelistData, updateStorelist } from 'src/app/store/store/store.action';
import { Branch } from 'src/app/store/store/store.model';



@Component({
  selector: 'app-approve-store',
  templateUrl: './approve-store.component.html',
  styleUrl: './approve-store.component.css'
})
export class ApproveStoreComponent implements OnInit {
// bread crumb items
breadCrumbItems: Array<object>;
public Modules = Modules;
public Permission = Permission;

storeApprovalList$: Observable<Branch[]>;
totalItems$: Observable<number>;
loading$: Observable<boolean>

isDropdownOpen : boolean = false;
filteredArray: Branch[] = [];
originalArray: Branch[] = [];

itemPerPage: number = 10;
currentPage : number = 1;

columns : any[]= [
  { property: 'translation_data[0].name', label: 'Title' },
  { property: 'merchant.translation_data[0].name', label: 'Merchant_Name' },
  { property: 'createdAt', label: 'Request_Date' },
  { property: 'status', label: 'Status' },
];
  constructor(public toastr:ToastrService,  public store: Store) {
    this.store.dispatch(fetchStorelistData({ page: 1, itemsPerPage: 10, status: 'pending' }));
    this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
       
    setTimeout(() => {
       this.storeApprovalList$ = this.store.pipe(select(selectData));
       this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
       this.storeApprovalList$.subscribe(
          data => {
            this.originalArray = data;
        });
        document.getElementById('elmLoader')?.classList.add('d-none')
      }, 1200);
    }
     
    onPageSizeChanged(event: any): void {
      const totalItems =  event.target.value;
      this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: totalItems, status:'pending' }));
     }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchStorelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'pending' }));
    
  }

  onApproveEvent( event: any) {
    const newData = { id: event.id , status: event.status};
    this.store.dispatch(updateStorelist({ updatedData: newData }));
  }

}
