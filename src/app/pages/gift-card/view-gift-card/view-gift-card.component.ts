import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-gift-card',
  templateUrl: './view-gift-card.component.html',
  styleUrl: './view-gift-card.component.css'
})
export class ViewGiftCardComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Gift Cards' }, { label: 'View_giftcard', active: true }];
}
}
