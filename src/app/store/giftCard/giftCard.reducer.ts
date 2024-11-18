// src/app/GiftCardlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addGiftCardlist, addGiftCardlistFailure, addGiftCardlistSuccess, deleteGiftCardlist, deleteGiftCardlistFailure, deleteGiftCardlistSuccess, fetchGiftCardlistData, fetchGiftCardlistFail, fetchGiftCardlistSuccess, getGiftCardById, getGiftCardByIdFailure, getGiftCardByIdSuccess, updateGiftCardlist, updateGiftCardlistFailure, updateGiftCardlistSuccess } from './giftCard.action';
import { GiftCard } from './giftCard.model';

export interface GiftCardlistState {
  GiftCardListdata: GiftCard[];
  currentPage: number;
  totalItems: number;
  selectedGiftCard: GiftCard;
  loading: boolean;
  error: string;
}

export const initialState: GiftCardlistState = {
  GiftCardListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedGiftCard: null,
  loading: false,
  error: null,
};

export const GiftCardListReducer = createReducer(
  initialState,
  on(fetchGiftCardlistData, (state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchGiftCardlistSuccess, (state, { GiftCardListdata }) => ({
    ...state,
    GiftCardListdata: GiftCardListdata.data,
    totalItems: GiftCardListdata.totalItems,
    loading: false,
    error: null 

  })),
  on(fetchGiftCardlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
   //Handle adding GiftCard 
   on(addGiftCardlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding GiftCard success
  on(addGiftCardlistSuccess, (state, { newData }) => ({
    ...state,
    GiftCardListdata: [newData,...state.GiftCardListdata ],
    loading: false,
    error: null

  })),
  //Handle adding GiftCard failure
  on(addGiftCardlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
    //Handle getting GiftCard by id
    on(getGiftCardById, (state) => ({
      ...state,
      loading: true,
      error: null 
    })),
  // Handle success of getting GiftCard by ID and store the GiftCard object in the state
   on(getGiftCardByIdSuccess, (state, { GiftCard }) => ({
    ...state,
    selectedGiftCard: GiftCard,
    loading: false,
    error: null

  })),
// Handle failure of getting GiftCard by ID and store the GiftCard object in the state
on(getGiftCardByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
// Handle updating Coupon list
on(updateGiftCardlist, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
 // Handle updating GiftCard status
  on(updateGiftCardlistSuccess, (state, { updatedData }) => {
   const GiftCardListUpdated = state.GiftCardListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      GiftCardListdata: GiftCardListUpdated,
      loading: false,
      error: null 
    };
  }),
   // Handle updating GiftCard failure
   on(updateGiftCardlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting GiftCard 
  on(deleteGiftCardlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a GiftCard
  on(deleteGiftCardlistSuccess, (state, { GiftCardId }) => {
    const updatedGiftCardList = state.GiftCardListdata.filter(GiftCard => GiftCard.id !== GiftCardId);
    return { 
    ...state,
    GiftCardListdata: updatedGiftCardList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a GiftCard
  on(deleteGiftCardlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
