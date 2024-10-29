import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap, switchMap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchRolelistData, fetchRolelistSuccess,
    fetchRolelistFail,
    addRolelistFailure,
    addRolelistSuccess,
    addRolelist,
    updateRolelistFailure,
    updateRolelistSuccess,
    updateRolelist,
    deleteRolelistFailure,
    deleteRolelistSuccess,
    deleteRolelist,
    getRoleById,
    getRoleByIdSuccess,
    getRoleByIdFailure
} from './role.actions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { selectRoleById } from './role-selector';
import { Store } from '@ngrx/store';

@Injectable()
export class RolesEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchRolelistData),
            tap(() => console.log('Request to fetch Role list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage, status }) =>
                this.CrudService.fetchData('/roles/me',{ limit: itemsPerPage, page: page,status: status}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchRolelistSuccess({ RoleListdata : response.result })),
                    catchError((error) =>{
                      this.toastr.error('An error occurred while fetching the Role list. Please try again later.'); 
                      console.error('Fetch error:', error); 
                      return of(fetchRolelistFail({ error: 'Error fetching data' })); 
                    })
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addRolelist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/roles', newData).pipe(
                    map((newData) => {
                        
                        this.router.navigate(['/private/roles']);
                        this.toastr.success('The new Role has been added successfully.');
                        // Dispatch the action to fetch the updated Role list after adding a new Role
                        return addRolelistSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(errorMessage);
                        return of(addRolelistFailure({ error: error.message })); // Dispatch failure action
                      })                )
            )
        )
    );
   updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateRolelist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/roles/${updatedData.id}`, updatedData).pipe(
              map(() => {
                this.router.navigate(['/private/roles']);
                this.toastr.success('The Role has been updated successfully.');
                return updateRolelistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) =>{
                const errorMessage = this.getErrorMessage(error); 
                this.toastr.error(errorMessage);
                return of(updateRolelistFailure({ error }));
              })             )
          )
        )
      );
      

   getRoleById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRoleById),
      tap(action => console.log('get Role action received:', action)),
      mergeMap(({ RoleId }) => {
        // Use the selector to get the Role from the store
        return this.store.select(selectRoleById(RoleId)).pipe(
          map(Role => {
            if (Role) {
              console.log('Role',Role);
              // Dispatch success action with the Role data
              return getRoleByIdSuccess({ Role });
            } else {
              console.log('Role NULL');
              //this.toastr.error('Role not found.'); // Show error notification
              return getRoleByIdFailure({ error: 'Role not found' });
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteRolelist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ RoleId }) =>
                    this.CrudService.deleteData(`/roles/${RoleId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            this.toastr.success('The Role has been deleted successfully.');
                            return deleteRolelistSuccess({ RoleId });
                          }),
                          catchError((error) => {
                            this.toastr.error('Failed to delete the Role. Please try again.');
                            return  of(deleteRolelistFailure({ error: error.message }))})                )
            )
        )
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        private router: Router,
        private store: Store,
        public toastr:ToastrService
    ) { }
    private getErrorMessage(error: any): string {
      // Implement logic to convert backend error to user-friendly message
      if (error.status === 400) {
        return 'Invalid Role data. Please check your inputs and try again.';
      } else if (error.status === 409) {
        return 'A Role with this code already exists.';
      } else {
        return 'An unexpected error occurred. Please try again later.';
      }
    }
}