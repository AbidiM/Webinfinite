import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrl: './view-role.component.css'
})
export class ViewRoleComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Role' }, { label: 'View_role', active: true }];
  }
}
