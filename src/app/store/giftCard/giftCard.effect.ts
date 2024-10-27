import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap, switchMap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchGiftCardlistData, fetchGiftCardlistSuccess,
    fetchGiftCardlistFail,
    addGiftCardlistFailure,
    addGiftCardlistSuccess,
    addGiftCardlist,
    updateGiftCardlistFailure,
    updateGiftCardlistSuccess,
    updateGiftCardlist,
    deleteGiftCardlistFailure,
    deleteGiftCardlistSuccess,
    deleteGiftCardlist,
    getGiftCardById,
    getGiftCardByIdSuccess
} from './giftCard.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { selectGiftCardById } from './giftCard-selector';
import { Store } from '@ngrx/store';
import { getCouponByIdFailure } from '../coupon/coupon.action';

@Injectable()
export class GiftCardsEffects {

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchGiftCardlistData),
            tap(() => console.log('Request to fetch GiftCard list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage, status }) =>
                this.CrudService.fetchData('/gift-cards',{ limit: itemsPerPage, page: page, status: status}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchGiftCardlistSuccess({ GiftCardListdata : response.result })),
                    catchError((error) =>{
                      this.toastr.error('An error occurred while fetching the Gift Cards list. Please try again later.'); 
                      console.error('Fetch error:', error); 
                      return of(fetchGiftCardlistFail({ error: 'Error fetching data' })); 
                    })
                    )
                ),
            ),
        
    );
    
    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addGiftCardlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/gift-cards', newData).pipe(
                    map((newData) => {
                      const userRole = this.getCurrentUserRole(); 
                      console.log(userRole);// Replace with your logic to get the role
                        if (userRole === 'Admin') {
                            this.toastr.success('The new GiftCard has been added successfully.');
                            this.router.navigate(['/private/giftCards']);
                        } else {
                            this.toastr.success('The new GiftCard Request has been sent to Admin.');
                            this.router.navigate(['/private/giftCards/approve']); // Redirect to pending coupons for non-admins
                        }
                        
                        // Dispatch the action to fetch the updated GiftCard list after adding a new GiftCard
                        return addGiftCardlistSuccess({newData});
                      }),
                    catchError((error) => {
                      const errorMessage = this.getErrorMessage(error); 
                      this.toastr.error(errorMessage);
                      return of(addGiftCardlistFailure({ error }));})
                )
            )
        )
    );
   

    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateGiftCardlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/gift-cards/${updatedData.id}`, updatedData).pipe(
              map(() => {
                
                this.toastr.success('The GiftCard has been updated successfully.');
                this.router.navigate(['/private/giftCards']);
                return updateGiftCardlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) => {
                const errorMessage = this.getErrorMessage(error); 
                this.toastr.error(errorMessage);
                return of(updateGiftCardlistFailure({ error }));}) // Catch errors and return the failure action
            )
          )
        )
      );
      

   getGiftCardById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGiftCardById),
      tap(action => console.log('get GiftCard action received:', action)),
      mergeMap(({ GiftCardId }) => {
        // Use the selector to get the GiftCard from the store
        return this.store.select(selectGiftCardById(GiftCardId)).pipe(
          map(GiftCard => {
            if (GiftCard) {
              console.log('GiftCard',GiftCard);
              // Dispatch success action with the GiftCard data
              return getGiftCardByIdSuccess({ GiftCard });
            } else {
              console.log('GiftCard NULL');
              this.toastr.error('GiftCard not found.')
              return getCouponByIdFailure({ error: 'GiftCard not found' }); // or handle it differently
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteGiftCardlist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ GiftCardId }) =>
                    this.CrudService.deleteData(`/gift-cards/${GiftCardId}`).pipe(
                        map((response: string) => {
                          this.toastr.success('GiftCard deleted successfully.');
                          return deleteGiftCardlistSuccess({ GiftCardId });
                          }),
                    catchError((error) => {
                      this.toastr.error('Failed to delete the GiftCard. Please try again.');
                      return  of(deleteGiftCardlistFailure({ error }))})
                )
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
        return 'Invalid Gift Card data. Please check your inputs and try again.';
      } else if (error.status === 409) {
        return 'A Gift Card with this code already exists.';
      } else {
        return 'An unexpected error occurred. Please try again later.';
      }
    }
    private getCurrentUserRole(): string {
      // Replace with your actual logic to retrieve the user role
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log(currentUser);
      return currentUser ? currentUser.role.name : '';
  }
}