/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrl: './edit-country.component.css'
})
export class EditCountryComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Countries' }, { label: 'Edit country', active: true }];
  }
}
