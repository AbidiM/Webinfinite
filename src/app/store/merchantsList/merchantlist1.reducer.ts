// src/app/merchantlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addMerchantlistSuccess, deleteMerchantlistFailure, deleteMerchantlistSuccess, fetchMerchantlistData, fetchMerchantlistFail, fetchMerchantlistSuccess, updateMerchantlistSuccess, updateMerchantStatusSuccess } from './merchantlist1.action';

export interface MerchantlistState {
  MerchantListdata: any[];
  loading: boolean;
  error: any;
}

export const initialState: MerchantlistState = {
  MerchantListdata: [],
  loading: false,
  error: null,
};

export const MerchantListReducer = createReducer(
  initialState,
  on(fetchMerchantlistData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchMerchantlistSuccess, (state, { MerchantListdata }) => ({
    ...state,
    MerchantListdata: MerchantListdata,
    loading: false
  })),
  on(fetchMerchantlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding merchant success
  on(addMerchantlistSuccess, (state, { newData }) => ({
    ...state,
    MerchantListdata: [...state.MerchantListdata, newData],
    loading: false
  })),
  
  // Handle updating merchant list
  on(updateMerchantStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      MerchantListdata: state.MerchantListdata.map(item =>
        item._id === updatedData.userId ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating merchant status
  on(updateMerchantlistSuccess, (state, { updatedData }) => {
   const merchantListUpdated = state.MerchantListdata.map(item => item.id === updatedData.id ? updatedData : item );
   console.log('MerchantListdata after update:', merchantListUpdated);
   return {
      ...state,
      MerchantListdata: merchantListUpdated
    };
  }),
  // Handle the success of deleting a merchant
  on(deleteMerchantlistSuccess, (state, { userId }) => {
    console.log('Deleting merchant with ID:', userId);
    console.log('MerchantListdata before deletion:', state.MerchantListdata);
    const updatedMerchantList = state.MerchantListdata.filter(merchant => merchant._id !== userId);
    console.log('MerchantListdata after deletion:', updatedMerchantList);
    return { 
    ...state,
    MerchantListdata: updatedMerchantList};
  }),
  // Handle failure of deleting a merchant
  on(deleteMerchantlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
