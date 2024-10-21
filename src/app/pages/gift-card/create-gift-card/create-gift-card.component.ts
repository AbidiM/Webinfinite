import { Component } from '@angular/core';

@Component({
  selector: 'app-create-gift-card',
  templateUrl: './create-gift-card.component.html',
  styleUrl: './create-gift-card.component.css'
})
export class CreateGiftCardComponent {
 // bread crumb items
 breadCrumbItems: Array<{}>;

 ngOnInit() {
   console.log('i am in create gift cards');
   this.breadCrumbItems = [{ label: 'Gift Cards' }, { label: 'Add Gift-Card', active: true }];
}
}