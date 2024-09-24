import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrl: './edit-coupon.component.scss'
})
export class EditCouponComponent implements OnInit{
// bread crumb items
breadCrumbItems: Array<{}>;

ngOnInit() {
  console.log('i am in edit coupon');
  this.breadCrumbItems = [{ label: 'Coupons' }, { label: 'Edit Coupon', active: true }];
}
}
