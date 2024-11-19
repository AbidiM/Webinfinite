import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.css'
})
export class EditRoleComponent implements OnInit {
  breadCrumbItems: Array<object>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Roles' }, { label: 'Edit_role', active: true }];
  }
}
