import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
  styleUrl: './view-store.component.css'
})
export class ViewStoreComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Stores' }, { label: 'View_store', active: true }];
  }
}
