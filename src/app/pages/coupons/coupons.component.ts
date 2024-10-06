import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectData } from 'src/app/store/coupon/coupon-selector';
import { deleteCouponlist, fetchCouponlistData, updateCouponlist } from 'src/app/store/coupon/coupon.action';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent  implements OnInit {



  // bread crumb items
  breadCrumbItems: Array<{}>;
  
  couponList$: Observable<any[]>;
  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  columns : any[]= [
    { property: 'name', label: 'Title' },
    { property: 'merchant.name', label: 'Merchant_Name' },
    { property: 'startDateCoupon', label: 'Start_Date' },
    { property: 'endDateCoupon', label: 'End_Date' },
    { property: 'status', label: 'Status' },
  ];

  constructor(
    public toastr:ToastrService,
    public store: Store) {
      
      this.couponList$ = this.store.pipe(select(selectData)); 

  }

  ngOnInit() {
   
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    this.couponList$.subscribe(data => {
      this.originalArray = data; // Coupon the full Coupon list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
      console.log('Finish get Coupon list');
      console.log(this.filteredArray);

    });
       
  }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }

  // Delete Store
  onDelete(id: any) {
    this.store.dispatch(deleteCouponlist({ couponId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.checked ? 'active' : 'expired'; 
    console.log('Coupon ID:', event.data.id, 'New Status:', newStatus);
    event.data.status = newStatus;
    this.store.dispatch(updateCouponlist({ updatedData: event.data }));
  }

 }

