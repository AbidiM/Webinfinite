import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, tap, switchMap } from 'rxjs/operators';

import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {
    fetchNotificationlistData, fetchNotificationlistSuccess,
    fetchNotificationlistFail,
    addNotificationlistFailure,
    addNotificationlistSuccess,
    addNotificationlist,
    updateNotificationlistFailure,
    updateNotificationlistSuccess,
    updateNotificationlist,
    deleteNotificationlistFailure,
    deleteNotificationlistSuccess,
    deleteNotificationlist,
    getNotificationById,
    getNotificationByIdSuccess,
    fetchMyNotificationlistData,
    fetchMyNotificationlistSuccess,
    fetchMyNotificationlistFail,
    getNotificationByIdFailure
} from './notification.action';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { selectNotificationById } from './notification-selector';
import { Store } from '@ngrx/store';

@Injectable()
export class NotificationsEffects {
   // path : string = '/assets/data/Notification.json';

    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchNotificationlistData),
            tap(() => console.log('Request to fetch Notification list has been launched')), // Add console log here
            mergeMap(({ page, itemsPerPage }) =>
                this.CrudService.fetchData('/notifications/',{ limit: itemsPerPage, page: page}).pipe(
                    tap((response : any) => console.log('Fetched data:', response.result)), 
                    map((response) => fetchNotificationlistSuccess({ NotificationListdata : response.result })),
                    catchError((error) =>{
                      this.toastr.error('An error occurred while fetching the Notification list. Please try again later.'); 
                      console.error('Fetch error:', error); 
                      return of(fetchNotificationlistFail({ error: 'Error fetching data' })); 
                    })
                )
            ),
        ),
    );
    fetchDataNotif$ = createEffect(() =>
      this.actions$.pipe(
          ofType(fetchMyNotificationlistData),
          tap(() => console.log('Request to fetch My Notification list')), // Add console log here
          mergeMap(() =>
              this.CrudService.fetchData('/notifications/my-notifications ').pipe(
                  tap((response : any) => console.log('Fetched data:', response.result)), 
                  map((response) => fetchMyNotificationlistSuccess({ NotificationListdata : response.result })),
                  catchError((error) =>{
                    this.toastr.error('An error occurred while fetching the My Notification list. Please try again later.'); 
                    console.error('Fetch error:', error); 
                    return of(fetchMyNotificationlistFail({ error: 'Error fetching data' })); 
                  })
              )
          ),
      ),
  );

    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addNotificationlist),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/notifications/schedule-notif/mobile', newData).pipe(
                    map((newData) => {
                        
                        this.router.navigate(['/private/notifications']);
                        this.toastr.success('The new Notification has been added .');
                        // Dispatch the action to fetch the updated Notification list after adding a new Notification
                        return addNotificationlistSuccess({newData});
                      }),
                      catchError((error) => {
                        const errorMessage = this.getErrorMessage(error); 
                        this.toastr.error(errorMessage);
                        return of(addNotificationlistFailure({ error: error.message })); // Dispatch failure action
                      })                )
            )
        )
    );
   
    updateData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateNotificationlist),
          mergeMap(({ updatedData }) =>
            this.CrudService.updateData(`/notifications/${updatedData.id}`, updatedData).pipe(
              map(() => {
                //this.router.navigate(['/private/notifications']);
                //this.toastr.success('The Notification has been updated successfully.');
                return updateNotificationlistSuccess({ updatedData }); // Make sure to return the action
              }),
              catchError((error) =>{
                const errorMessage = this.getErrorMessage(error); 
                this.toastr.error(errorMessage);
                return of(updateNotificationlistFailure({ error }));
              })             )
          )
        )
      );
      

   getNotificationById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getNotificationById),
      tap(action => console.log('get Notification action received:', action)),
      mergeMap(({ notificationId }) => {
        // Use the selector to get the Notification from the store
        return this.store.select(selectNotificationById(notificationId)).pipe(
          map(Notification => {
            if (Notification) {
              console.log('Notification',Notification);
              // Dispatch success action with the Notification data
              return getNotificationByIdSuccess({ Notification });
            } else {
              console.log('Notification NULL');
              //this.toastr.error('Notification not found.'); // Show error notification
              return getNotificationByIdFailure({ error: 'Notification not found' });
            }
          })
        );
      })
    )
  );
   deleteData$ = createEffect(() =>
    
        this.actions$.pipe(
            ofType(deleteNotificationlist),
            tap(action => console.log('Delete action received:', action)),
            mergeMap(({ notificationId }) =>
                    this.CrudService.deleteData(`/notifications/${notificationId}`).pipe(
                        map((response: string) => {
                            // If response contains a success message or status, you might want to check it here
                            console.log('API response:', response);
                            this.toastr.success('The Notification has been deleted successfully.');
                            return deleteNotificationlistSuccess({ notificationId });
                          }),
                          catchError((error) => {
                            this.toastr.error('Failed to delete the Notification. Please try again.');
                            return  of(deleteNotificationlistFailure({ error: error.message }))})
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
        return 'Invalid Notification data. Please check your inputs and try again.';
      } else if (error.status === 409) {
        return 'A Notification with this code already exists.';
      } else {
        return 'An unexpected error occurred. Please try again later.';
      }
    }
}