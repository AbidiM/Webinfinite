// src/app/Notificationlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addNotificationlist, addNotificationlistFailure, addNotificationlistSuccess, deleteNotificationlist, deleteNotificationlistFailure, deleteNotificationlistSuccess, fetchMyNotificationlistData, fetchMyNotificationlistFail, fetchMyNotificationlistSuccess, fetchNotificationlistData, fetchNotificationlistFail, fetchNotificationlistSuccess, getNotificationById, getNotificationByIdFailure, getNotificationByIdSuccess, updateNotificationlist, updateNotificationlistFailure, updateNotificationlistSuccess } from './notification.action';
import { Notification } from './notification.model';

export interface NotificationlistState {
  NotificationListdata: Notification[];
  currentPage: number;
  totalItems: number;
  selectedNotification: Notification;
  unseen: number;
  loading: boolean;
  error: string;
}

export const initialState: NotificationlistState = {
  NotificationListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedNotification: null,
  unseen: 0,
  loading: false,
  error: null,
};

export const NotificationListReducer = createReducer(
  initialState,
  on(fetchNotificationlistData, (state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchNotificationlistSuccess, (state, { NotificationListdata }) => ({
    ...state,
    NotificationListdata: NotificationListdata.data,
    totalItems: NotificationListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchNotificationlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(fetchMyNotificationlistData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchMyNotificationlistSuccess, (state, { NotificationListdata }) => ({
    ...state,
    NotificationListdata: NotificationListdata.notifications,
    unseen: NotificationListdata.unseen,
    loading: false,
    error: null 

  })),
  on(fetchMyNotificationlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding Notification 
  on(addNotificationlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Notification success
  on(addNotificationlistSuccess, (state, { newData }) => ({
    ...state,
    NotificationListdata: [ newData,...state.NotificationListdata],
    loading: false,
    error: null
  })),
   //Handle adding Notification failure
   on(addNotificationlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 

  })),
  //Handle getting Notification by id
  on(getNotificationById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  
  // Handle success of getting Notification by ID and store the Notification object in the state
   on(getNotificationByIdSuccess, (state, { Notification }) => ({
    ...state,
    selectedNotification: Notification,
    loading: false,
    error: null

  })),
// Handle success of getting Notification by ID and store the Notification object in the state
on(getNotificationByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
// Handle updating Notification list
on(updateNotificationlist, (state) => ({
  ...state,
  loading: true,
  error: null 
})),

// Handle updating Notification success
  on(updateNotificationlistSuccess, (state, { updatedData }) => {
   const NotificationListUpdated = state.NotificationListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      NotificationListdata: NotificationListUpdated,
      loading: false,
      error: null
    };
  }),
  // Handle updating Notification failure
  on(updateNotificationlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Notification 
  on(deleteNotificationlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Notification
  on(deleteNotificationlistSuccess, (state, { notificationId }) => {
    const updatedNotificationList = state.NotificationListdata.filter(Notification => Notification.id !== notificationId);
    return { 
    ...state,
    NotificationListdata: updatedNotificationList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a Notification
  on(deleteNotificationlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
