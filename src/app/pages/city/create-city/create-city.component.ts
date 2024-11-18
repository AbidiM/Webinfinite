import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-city',
  templateUrl: './create-city.component.html',
  styleUrl: './create-city.component.css'
})
export class CreateCityComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/ban-types
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Cities' }, { label: 'Add_City', active: true }];
  }
}
