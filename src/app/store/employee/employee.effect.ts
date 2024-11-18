/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import { addEmployeelist, addEmployeelistFailure, addEmployeelistSuccess, deleteEmployeelist, deleteEmployeelistFailure, deleteEmployeelistSuccess, fetchEmployeelistData, fetchEmployeelistFail, fetchEmployeelistSuccess, getEmployeeById, getEmployeeByIdFailure, getEmployeeByIdSuccess, updateEmployeelist, updateEmployeelistFailure, updateEmployeelistSuccess } from './employee.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable()
export class EmployeeslistEffects {
  

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchEmployeelistData),
            mergeMap(({ page, itemsPerPage, role }) =>
                this.CrudService.fetchData('/users', { limit:itemsPerPage , page: page, role: role}).pipe(
                    map((response: any) => fetchEmployeelistSuccess({ EmployeeListdata : response.result })),
                    catchError((error) =>{
                      this.toastr.error('An error occurred while fetching the Employee list. Please try again later.'); 
                      console.error('Fetch error:', error); 
                      return of(fetchEmployeelistFail({ error: 'Error fetching data' })); 
                    })
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addEmployeelist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/users', newData).pipe(
                    map((newData) => {
                        this.toastr.success('The new Employee has been added successfully.');
                        this.router.navigate(['/private/employees']);
                        // Dispatch the action to fetch the updated Employee list after adding a new Employee
                        return addEmployeelistSuccess({newData});
                      }),
                      catchError((error) => {
                       // const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(error.message);
                        return of(addEmployeelistFailure({ error: error.message })); // Dispatch failure action
                      })                )
            )
        )
    );
    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateEmployeelist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/users/${updatedData.id}`, updatedData).pipe(
              map(() => {
                this.toastr.success('The Employee has been updated successfully.');
                this.router.navigate(['/private/employees']);
                return updateEmployeelistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) =>{
                const errorMessage = this.getErrorMessage(error); 
                this.toastr.error(errorMessage);
                return of(updateEmployeelistFailure({ error }));
              })             )
          )
        )
      );
      

      getEmployeeById$ = createEffect(() =>
        this.actions$.pipe(
          ofType(getEmployeeById),
          mergeMap(({ employeeId }) => {
            // Use the selector to get the Employee from the store
            return this.CrudService.getDataById('/users', employeeId).pipe(
              map((response: any) => {
                if (response) {
                  // Dispatch success action with the Employee data
                  return getEmployeeByIdSuccess({ employee: response.result });
                } else {
                  //this.toastr.error('Employee not found.'); // Show error notification
                  return getEmployeeByIdFailure({ error: 'Employee not found' });
                }
              })
            );
          })
        )
      );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteEmployeelist),
            mergeMap(({ employeeId }) =>
                    this.CrudService.deleteData(`/users/${employeeId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            return deleteEmployeelistSuccess({ employeeId });
                          }),
                          catchError((error) => {
                            this.toastr.error('Failed to delete the Employee. Please try again.');
                            return  of(deleteEmployeelistFailure({ error: error.message }))})                )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private store: Store
    ) { }
    private getErrorMessage(error: any): string {
      // Implement logic to convert backend error to user-friendly message
      if (error.status === 400) {
        return 'Invalid Employee data. Please check your inputs and try again.';
      } else if (error.status === 409) {
        return 'A Employee with this code already exists.';
      } else {
        return 'An unexpected error occurred. Please try again later.';
      }
    }
}