// src/app/Notificationlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  NotificationlistState } from './notification.reducer';

export const selectDataState = createFeatureSelector<NotificationlistState>('NotificationList');

export const selectDataNotification = createSelector(
  selectDataState,
  (state: NotificationlistState) => state?.NotificationListdata || []
);
export const selectDataUnseenCount = createSelector(
  selectDataState,
  (state: NotificationlistState) => state?.unseen || 0
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: NotificationlistState) => state?.totalItems || 0
);
export const selectedNotification = createSelector(
  selectDataState,
  (state: NotificationlistState) =>  state?.selectedNotification || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: NotificationlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: NotificationlistState) => state?.error || null
);
