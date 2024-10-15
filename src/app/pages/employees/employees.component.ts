import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Observable } from 'rxjs';
import { selectData } from 'src/app/store/employee/employee-selector';
import { deleteEmployeelist, fetchEmployeelistData, updateEmployeelist } from 'src/app/store/employee/employee.action';
import { Modules, Permission } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  public Modules = Modules;
  public Permission = Permission;

  EmployeeList$: Observable<any[]>;
  isDropdownOpen : boolean = false;
  filteredArray: any[] = [];
  originalArray: any[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  columns : any[]= [
    { property: 'username', label: 'Employee Name' },
    { property: 'email', label: 'Email' },
    { property: 'role.name', label: 'Role' },
    { property: 'status', label: 'Status' },
  ];

  constructor(public store: Store) {
      
      this.EmployeeList$ = this.store.pipe(select(selectData)); // Observing the Employee list from Employee

  }

  ngOnInit() {
          
        this.store.dispatch(fetchEmployeelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage}));
        this.EmployeeList$.subscribe(data => {
        this.originalArray = data; // Employee the full Employee list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
        console.log('Finish get Employee list');
        console.log(this.filteredArray);
    
        });
   }

 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchEmployeelistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }

  // Delete Employee
  onDelete(id: any) {
    this.store.dispatch(deleteEmployeelist({employeeId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.checked ? 'active' : 'inactive'; 
    console.log('Employee ID:', event.data.id, 'New Status:', newStatus);
    event.data.status = newStatus;
    this.store.dispatch(updateEmployeelist({ updatedData: event.data }));
  }

}

