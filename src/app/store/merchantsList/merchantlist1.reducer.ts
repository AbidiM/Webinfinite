// src/app/merchantlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addMerchantlist, addMerchantlistFailure, addMerchantlistSuccess, deleteMerchantlist, deleteMerchantlistFailure, deleteMerchantlistSuccess, fetchMerchantlistData, fetchMerchantlistFail, fetchMerchantlistSuccess, getMerchantById, getMerchantByIdFailure, getMerchantByIdSuccess, updateMerchantlist, updateMerchantlistFailure, updateMerchantlistSuccess } from './merchantlist1.action';
import { Merchant } from './merchantlist1.model';

export interface MerchantlistState {
  MerchantListdata: Merchant[];
  currentPage: number;
  totalItems: number;
  selectedMerchant: Merchant,
  loading: boolean;
  error: string;
}

export const initialState: MerchantlistState = {
  MerchantListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedMerchant: null,
  loading: false,
  error: null,
};

export const MerchantListReducer = createReducer(
  initialState,
  on(fetchMerchantlistData,(state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchMerchantlistSuccess, (state, { MerchantListdata }) => ({
    ...state,
    MerchantListdata: MerchantListdata.data,
    totalItems:MerchantListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchMerchantlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
   //Handle adding Merchant 
   on(addMerchantlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding merchant success
  on(addMerchantlistSuccess, (state, { newData }) => ({
    ...state,
    MerchantListdata: [newData, ...state.MerchantListdata],
    loading: false,
    error: null 

  })),
    //Handle adding Merchant failure
    on(addMerchantlistFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false, 
    })),

    //Handle getting Merchant by id
  on(getMerchantById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  
  // Handle success of getting Employee by ID and store the Employee object in the state
  on(getMerchantByIdSuccess, (state, { merchant }) => ({
    ...state,
    selectedMerchant: merchant,
    loading: false,
    error: null 
  })),
  // Handle success of getting Merchant by ID and store the Merchant object in the state
  on(getMerchantByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
   // Handle updating Merchant list
   on(updateMerchantlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
 
// Handle updating merchant status
  on(updateMerchantlistSuccess, (state, { updatedData }) => {
   const merchantListUpdated = state.MerchantListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      MerchantListdata: merchantListUpdated,
      loading: false,
      error: null
    };
  }),
   // Handle updating Merchant failure
   on(updateMerchantlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Merchant 
  on(deleteMerchantlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a merchant
  on(deleteMerchantlistSuccess, (state, { userId }) => {
    
    const updatedMerchantList = state.MerchantListdata.filter(merchant => merchant.id !== userId);
    return { 
    ...state,
    MerchantListdata: updatedMerchantList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a merchant
  on(deleteMerchantlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
