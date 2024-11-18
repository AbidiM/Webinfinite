/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-country',
  templateUrl: './create-country.component.html',
  styleUrl: './create-country.component.css'
})
export class CreateCountryComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Countries' }, { label: 'Add_country', active: true }];
  }
}
