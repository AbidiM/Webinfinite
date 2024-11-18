import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-area',
  templateUrl: './view-area.component.html',
  styleUrl: './view-area.component.css'
})
export class ViewAreaComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/ban-types
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'areas' }, { label: 'View_area', active: true }];
  }
}
