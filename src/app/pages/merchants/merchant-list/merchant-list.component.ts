
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectDataMerchant } from 'src/app/store/merchantsList/merchantlist1-selector';
import { deleteMerchantlist, fetchMerchantlistData, updateMerchantlist } from 'src/app/store/merchantsList/merchantlist1.action';
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


  MerchantList$: Observable<any[]>;
  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  checked : any = {status: 'active', label: 'Active'};
  unChecked : any = {status: 'inactive', label: 'inActive'};
  columns : any[]= [
    { property: 'merchantName', label: 'Merchant Name' },
    { property: 'user.email', label: 'Email' },
    { property: 'user.city.name', label: 'City' },
    { property: 'totalOffres', label: 'Total Offers' },
    { property: 'totalStores', label: 'Total Stores' },
    { property: 'user.status', label: 'Status' },
  ];

  constructor(public store: Store) {
      
      this.MerchantList$ = this.store.pipe(select(selectDataMerchant)); // Observing the Merchant list from Merchant

  }

  ngOnInit() {
          
        this.store.dispatch(fetchMerchantlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status: ''  }));
        this.MerchantList$.subscribe(data => {
        this.originalArray = data; // Merchant the full Merchant list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
        console.log('Finish get Merchant list');
        console.log(this.filteredArray);
    
        });
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
    const newStatus = event.checked ? 'active' : 'inactive'; 
    console.log('Merchant ID:', event.data.id, 'New Status:', newStatus);
    event.data.status = newStatus;
    this.store.dispatch(updateMerchantlist({ updatedData: event.data }));
  }
}