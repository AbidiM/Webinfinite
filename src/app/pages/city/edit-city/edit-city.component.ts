import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrl: './edit-city.component.css'
})
export class EditCityComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/ban-types
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Cities' }, { label: 'Edit_City', active: true }];
  }
}
