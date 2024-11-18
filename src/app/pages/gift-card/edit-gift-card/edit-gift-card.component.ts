import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-gift-card',
  templateUrl: './edit-gift-card.component.html',
  styleUrl: './edit-gift-card.component.css'
})
export class EditGiftCardComponent implements OnInit {
 // bread crumb items
 breadCrumbItems: Array<object>;

 ngOnInit() {
   this.breadCrumbItems = [{ label: 'Gift Cards' }, { label: 'Edit gift card', active: true }];
}
}
