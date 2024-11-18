import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrl: './create-store.component.css'
})
export class CreateStoreComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Stores' }, { label: 'Add_store', active: true }];
  }
}
