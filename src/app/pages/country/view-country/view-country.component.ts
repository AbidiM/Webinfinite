import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-country',
  templateUrl: './view-country.component.html',
  styleUrl: './view-country.component.css'
})
export class ViewCountryComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/ban-types
  breadCrumbItems: Array<{}>;
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Countries' }, { label: 'View_country', active: true }];
  }
}
