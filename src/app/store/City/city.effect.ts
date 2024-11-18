/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchCitylistData, fetchCitylistSuccess,
    fetchCitylistFail,
    addCitylistFailure,
    addCitylistSuccess,
    addCitylist,
    updateCitylistFailure,
    updateCitylistSuccess,
    updateCitylist,
    deleteCitylistFailure,
    deleteCitylistSuccess,
    deleteCitylist,
    getCityById,
    getCityByIdSuccess,
    getCityByIdFailure
} from './city.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable()
export class CityEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCitylistData),
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/cities',{ limit: itemsPerPage, page: page}).pipe(
                    map((response: any) => fetchCitylistSuccess({ CityListdata: response.result })),
                    catchError((error) =>{
                        this.toastr.error('An error occurred while fetching the City list. Please try again later.'); 
                        console.error('Fetch error:', error); 
                        return of(fetchCitylistFail({ error: 'Error fetching data' })); 
                      })
                )
            ),
        ),
    );
  
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCitylist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/cities', newData).pipe(
                    map((response) => {
                        this.toastr.success('The new City has been added successfully.');
                        this.router.navigate(['/private/cities']);
                        // Dispatch the action to fetch the updated City list after adding a new City
                        return addCitylistSuccess({newData: response});
                      }),
                      catchError((error) => {
                        const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(errorMessage);
                        return of(addCitylistFailure({ error: error.message })); // Dispatch failure action
                      })                )
            )
        )
    );
    getCityById$ =  createEffect(() =>
      this.actions$.pipe(
        ofType(getCityById),
        mergeMap(({ CityId }) => {
          return this.CrudService.getDataById('/cities', CityId).pipe(
            map((City: any) => {
              if (City ) {
                return getCityByIdSuccess({ City: City.result});
              } else {
                return getCityByIdFailure({ error: 'City not found' });
              }
            })
          );
        })
      )
    );
   
  

    updateData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateCitylist),
            mergeMap(({ updatedData }) => {
               
                return this.CrudService.updateData(`/cities/${updatedData.id}`, updatedData).pipe(
                    map((response : any) => 
                    {
                        this.toastr.success('The City has been updated successfully.');
                        this.router.navigate(['/private/cities']); 
                        return updateCitylistSuccess({ updatedData : response.result})
                    }),
                    catchError((error) =>{
                        const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(errorMessage);
                        return of(updateCitylistFailure({ error }));
                      })                );
            })
        )
    );


   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteCitylist),
            mergeMap(({ CityId }) =>
                    this.CrudService.deleteData(`/cities/${CityId}`).pipe(
                        map(() => {
                            // If response contains a success message or status, you might want to check it here
                            return deleteCitylistSuccess({ CityId });
                          }),
                          catchError((error) => {
                            this.toastr.error('Failed to delete the City. Please try again.');
                            return  of(deleteCitylistFailure({ error: error.message }))})                )
            )
        )
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
          return 'Invalid City data. Please check your inputs and try again.';
        } else if (error.status === 409) {
          return 'A City with this code already exists.';
        } else {
          return 'An unexpected error occurred. Please try again later.';
        }
      }
}