/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,  OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectData, selectDataLoading, selectDataTotalItems } from 'src/app/store/coupon/coupon-selector';
import { deleteCouponlist, fetchCouponlistData, updateCouponlist } from 'src/app/store/coupon/coupon.action';
import { Coupon } from 'src/app/store/coupon/coupon.model';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent  implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  couponList$: Observable<Coupon[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>


  isDropdownOpen : boolean = false;
  filteredArray: Coupon[] = [];
  originalArray: Coupon[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  columns : any[]= [
    { property: 'translation_data[0].name', label: 'Title' },
    { property: 'merchant.translation_data[0].name', label: 'Merchant_Name' },
    { property: 'startDateCoupon', label: 'Start_Date' },
    { property: 'endDateCoupon', label: 'End_Date' },
    { property: 'status', label: 'Status' },
  ];

  constructor(
    public toastr:ToastrService,
    public store: Store) {
      
      this.couponList$ = this.store.pipe(select(selectData)); 
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

  }

  ngOnInit() {
   
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'' }));
    this.couponList$.subscribe(data => {
      this.originalArray = data; // Coupon the full Coupon list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
     

    });
       
  }
  onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: totalItems}));
   }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchCouponlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }

  // Delete coupon
  onDelete(id: number) {
    this.store.dispatch(deleteCouponlist({ couponId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateCouponlist({ updatedData: newData }));
  }

 }

