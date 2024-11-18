import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-area',
  templateUrl: './create-area.component.html',
  styleUrl: './create-area.component.css'
})
export class CreateAreaComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/ban-types
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'areas' }, { label: 'Add_area', active: true }];
  }
}
