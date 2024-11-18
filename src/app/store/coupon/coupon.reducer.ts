// src/app/Couponlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addCouponlist, addCouponlistFailure, addCouponlistSuccess, deleteCouponlist, deleteCouponlistFailure, deleteCouponlistSuccess, fetchCouponlistData, fetchCouponlistFail, fetchCouponlistSuccess, getCouponById, getCouponByIdFailure, getCouponByIdSuccess, updateCouponlist, updateCouponlistFailure, updateCouponlistSuccess } from './coupon.action';
import { Coupon } from './coupon.model';

export interface CouponlistState {
  CouponListdata: Coupon[];
  currentPage: number;
  totalItems: number;
  selectedCoupon: Coupon;
  loading: boolean;
  error: string;
}

export const initialState: CouponlistState = {
  CouponListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedCoupon: null,
  loading: false,
  error: null,
};

export const CouponListReducer = createReducer(
  initialState,
  on(fetchCouponlistData, (state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchCouponlistSuccess, (state, { CouponListdata }) => ({
    ...state,
    CouponListdata: CouponListdata.data,
    totalItems: CouponListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchCouponlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  //Handle adding Coupon 
  on(addCouponlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),

  //Handle adding Coupon success
  on(addCouponlistSuccess, (state, { newData }) => ({
    ...state,
    CouponListdata: [newData,...state.CouponListdata ],
    loading: false,
    error: null
  })),
    //Handle adding Coupon failure
  on(addCouponlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  //Handle getting Coupon by id
  on(getCouponById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle success of getting coupon by ID and store the coupon object in the state
   on(getCouponByIdSuccess, (state, { coupon }) => ({
    ...state,
    selectedCoupon: coupon,
    loading: false,
    error: null
  })),
  // Handle success of getting coupon by ID and store the coupon object in the state
  on(getCouponByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
  // Handle updating Coupon list
  on(updateCouponlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
// Handle updating Coupon success
  on(updateCouponlistSuccess, (state, { updatedData }) => {
   const CouponListUpdated = state.CouponListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      CouponListdata: CouponListUpdated,
      loading: false,
      error: null
    };
  }),
  // Handle updating Coupon failure
  on(updateCouponlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Coupon 
  on(deleteCouponlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Coupon
  on(deleteCouponlistSuccess, (state, { couponId }) => {
    const updatedCouponList = state.CouponListdata.filter(Coupon => Coupon.id !== couponId);
    return { 
    ...state,
    CouponListdata: updatedCouponList,
    loading: false,
    error: null
  };
  }),
  // Handle failure of deleting a Coupon
  on(deleteCouponlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
