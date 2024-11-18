/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction, props } from '@ngrx/store';
import { NotificationListModel, Notification } from './notification.model';

// fetch all list
export const fetchNotificationlistData = createAction('[Data] fetch Notificationlist',props<{ page: number; itemsPerPage: number }>());
export const fetchNotificationlistSuccess = createAction('[Data] fetch Notificationlist success', props<{ NotificationListdata: NotificationListModel }>())
export const fetchNotificationlistFail = createAction('[Data fetch Notificationlist failed]', props<{ error: string }>())
export const fetchMyNotificationlistData = createAction('[Data] fetch My Notification List');
export const fetchMyNotificationlistSuccess = createAction('[Data] fetch My Notification List success',  props<{ NotificationListdata: any }>());
export const fetchMyNotificationlistFail = createAction('[Data fetch Notificationlist failed]', props<{ error: string }>())


// Add Data
export const addNotificationlist = createAction('[Data] Add Notificationlist',  props<{ newData: Notification }>());
export const addNotificationlistSuccess = createAction('[Data] Add Notificationlist Success', props<{ newData: Notification }>());
export const addNotificationlistFailure = createAction('[Data] Add Notificationlist Failure', props<{ error: string }>());

//get Notification by ID
export const getNotificationById = createAction('[Data] get Notification', props<{ notificationId: number }>());
export const getNotificationByIdSuccess = createAction('[Data] get Notification success', props<{ Notification: Notification }>());
export const getNotificationByIdFailure = createAction('[Data] get Notification Failure', props<{ error: string }>());

// Update Data
export const updateNotificationlist = createAction(
    '[Data] Update Notificationlist',
    props<{ updatedData: Notification }>()
);
export const updateNotificationlistSuccess = createAction(
    '[Data] Update Notificationlist Success',
    props<{ updatedData: Notification }>()
);
export const updateNotificationlistFailure = createAction(
    '[Data] Update Notificationlist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteNotificationlist = createAction(
    '[Data] Delete Notificationlist',
    props<{ notificationId: number }>()
);
export const deleteNotificationlistSuccess = createAction(
    '[Data] Delete Notificationlist Success',
    props<{ notificationId: number }>()
);
export const deleteNotificationlistFailure = createAction(
    '[Data] Delete Notificationlist Failure',
    props<{ error: string }>()
);