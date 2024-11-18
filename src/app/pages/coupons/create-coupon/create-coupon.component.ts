import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrl: './create-coupon.component.css'
})
export class CreateCouponComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Coupons' }, { label: 'Add coupon', active: true }];
  }
}
