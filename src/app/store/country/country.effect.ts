/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCountrylistData, fetchCountrylistSuccess,
    fetchCountrylistFail,
    addCountrylistFailure,
    addCountrylistSuccess,
    addCountrylist,
    updateCountrylistFailure,
    updateCountrylistSuccess,
    updateCountrylist,
    deleteCountrylistFailure,
    deleteCountrylistSuccess,
    deleteCountrylist,
    getCountryById,
    getCountryByIdSuccess,
    getCountryByIdFailure
} from './country.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable()
export class countrieslistEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCountrylistData),
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/countries',{ limit: itemsPerPage, page: page}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchCountrylistSuccess({ CountryListdata: response.result })),
                    catchError((error) =>
                        of(fetchCountrylistFail({ error }))
                    )
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCountrylist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/countries', newData).pipe(
                    map((response) => {
                        this.toastr.success('The new Country has been added successfully.');
                        this.router.navigate(['/private/countries']);
                        // Dispatch the action to fetch the updated Country list after adding a new Country
                        return addCountrylistSuccess({newData: response});
                      }),
                      catchError((error) => {
                        const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(errorMessage);
                        return of(addCountrylistFailure({ error: error.message })); // Dispatch failure action
                      })                )
            )
        )
    );
    getCountryById$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getCountryById),
        mergeMap(({ CountryId }) => {
          return this.CrudService.getDataById('/countries', CountryId).pipe(
            map((Country: any) => {
              if (Country ) {
                return getCountryByIdSuccess({ Country: Country.result});
              } else {
                return getCountryByIdFailure({ error: 'Country not found' });
              }
            })
          );
        })
      )
    );
   
    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateCountrylist),
            mergeMap(({ updatedData }) => {
                
                return this.CrudService.updateData(`/countries/${updatedData.id}`, updatedData).pipe(
                    map((response : any) => {
                        this.toastr.success('The Country has been updated successfully.');
                        this.router.navigate(['/private/countries']);
                        return updateCountrylistSuccess({ updatedData : response.result})}),
                        catchError((error) =>{
                            const errorMessage = this.getErrorMessage(error); 
                            this.toastr.error(errorMessage);
                            return of(updateCountrylistFailure({ error }));
                          })                );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteCountrylist),
            mergeMap(({ CountryId }) =>
                    this.CrudService.deleteData(`/countries/${CountryId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            return deleteCountrylistSuccess({ CountryId });
                          }),
                          catchError((error) => {
                            this.toastr.error('Failed to delete the Country. Please try again.');
                            return  of(deleteCountrylistFailure({ error: error.message }))})                )
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
          return 'Invalid Country data. Please check your inputs and try again.';
        } else if (error.status === 409) {
          return 'A Country with this code already exists.';
        } else {
          return 'An unexpected error occurred. Please try again later.';
        }
      }
}