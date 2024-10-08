// src/app/Notificationlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  NotificationlistState } from './notification.reducer';

export const selectDataState = createFeatureSelector<NotificationlistState>('NotificationList');

export const selectDataNotification = createSelector(
  selectDataState,
  (state: NotificationlistState) => state?.NotificationListdata || []
);

export const selectNotificationById = (NotificationId: string) =>createSelector(
  selectDataState,
  (state: NotificationlistState) =>  state?.NotificationListdata.find(Notification => Notification.id === +NotificationId)
  );

export const selectDataLoading = createSelector(
  selectDataState,
  (state: NotificationlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: NotificationlistState) => state?.error || null
);
