import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-coupon',
  templateUrl: './view-coupon.component.html',
  styleUrl: './view-coupon.component.css'
})
export class ViewCouponComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Coupons' }, { label: 'View_coupon', active: true }];
  }
}
