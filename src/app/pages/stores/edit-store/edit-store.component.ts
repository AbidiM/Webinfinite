import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrl: './edit-store.component.css'
})
export class EditStoreComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Stores' }, { label: 'Edit_store', active: true }];
  }
}
