// src/app/Couponlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  CouponlistState } from './coupon.reducer';

export const selectDataState = createFeatureSelector<CouponlistState>('CouponList');

export const selectData = createSelector(
  selectDataState,
  (state: CouponlistState) => state?.CouponListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: CouponlistState) => state?.totalItems || 0
);
export const selectApprovalData = createSelector(
  selectDataState,
  (state: CouponlistState) => state?.CouponListdata.filter(coupon => coupon.status === 'pending') || []
);

export const selectedCoupon = createSelector(
    selectDataState,
    (state: CouponlistState) =>  state?.selectedCoupon || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: CouponlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: CouponlistState) => state?.error || null
);
