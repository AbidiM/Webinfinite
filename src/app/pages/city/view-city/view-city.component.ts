import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-city',
  templateUrl: './view-city.component.html',
  styleUrl: './view-city.component.css'
})
export class ViewCityComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/ban-types
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Cities' }, { label: 'View_city', active: true }];
  }
}
