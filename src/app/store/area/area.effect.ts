/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchArealistData, fetchArealistSuccess,
    fetchArealistFail,
    addArealistFailure,
    addArealistSuccess,
    addArealist,
    updateArealistFailure,
    updateArealistSuccess,
    updateArealist,
    deleteArealistFailure,
    deleteArealistSuccess,
    deleteArealist,
    getAreaById,
    getAreaByIdSuccess,
    getAreaByIdFailure
} from './area.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable()
export class AreaEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchArealistData),
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/areas',{ limit: itemsPerPage, page: page}).pipe(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    map((response: any) => fetchArealistSuccess({ AreaListdata: response.result })),
                    catchError((error) =>{
                        this.toastr.error('An error occurred while fetching the Area list. Please try again later.'); 
                        console.error('Fetch error:', error); 
                        return of(fetchArealistFail({ error: 'Error fetching data' })); 
                      })
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addArealist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/areas', newData).pipe(
                    map((response) => {
                        this.toastr.success('The new Area has been added successfully.');
                        this.router.navigate(['/private/areas']);
                        // Dispatch the action to fetch the updated Area list after adding a new Area
                        return addArealistSuccess({newData: response});
                      }),
                      catchError((error) => {
                        const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(errorMessage);
                        return of(addArealistFailure({ error: error.message })); // Dispatch failure action
                      })                )
            )
        )
    );
    getAreaById$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getAreaById),
        mergeMap(({ AreaId }) => {
          return this.CrudService.getDataById('/cities', AreaId).pipe(
            map((Area: any) => {
              if (Area ) {
                return getAreaByIdSuccess({ Area: Area.result});
              } else {
                return getAreaByIdFailure({ error: 'Area not found' });
              }
            })
          );
        })
      )
    );
    
    
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateArealist),
            mergeMap(({ updatedData }) => {
                
                return this.CrudService.updateData(`/areas/${updatedData.id}`, updatedData).pipe(
                    map((response : any) =>
                    {
                        this.toastr.success('The Area has been updated successfully.');
                        this.router.navigate(['/private/areas']);
                        return updateArealistSuccess({ updatedData : response.result})
                    }),
                    catchError((error) =>{
                        //const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(error.message);
                        return of(updateArealistFailure({ error:error.message  }));
                      }));
            }))
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteArealist),
            mergeMap(({ AreaId }) =>
                    this.CrudService.deleteData(`/areas/${AreaId}`).pipe(
                        map( ()=> {
                            // If response contains a success message or status, you might want to check it here
                            return deleteArealistSuccess({ AreaId });
                          }),
                          catchError((error) => {
                            this.toastr.error('Failed to delete the Area. Please try again.');
                            return  of(deleteArealistFailure({ error: error.message }))})                )
            ))
    );
    
    
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastr:ToastrService,
        private router: Router,
        private store: Store
    ) { 
    }
    private getErrorMessage(error: any): string {
        // Implement logic to convert backend error to user-friendly message
        if (error.status === 400) {
          return 'Invalid Area data. Please check your inputs and try again.';
        } else if (error.status === 409) {
          return 'A Area with this code already exists.';
        } else {
          return 'An unexpected error occurred. Please try again later.';
        }
      }
}