import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-gift-card',
  templateUrl: './create-gift-card.component.html',
  styleUrl: './create-gift-card.component.css'
})
export class CreateGiftCardComponent implements OnInit {
 // bread crumb items
 breadCrumbItems: Array<object>;

 ngOnInit() {
   this.breadCrumbItems = [{ label: 'Gift Cards' }, { label: 'Add gift card', active: true }];
}
}