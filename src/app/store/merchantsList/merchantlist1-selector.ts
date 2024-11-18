// src/app/merchantlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  MerchantlistState } from './merchantlist1.reducer';

export const selectDataState = createFeatureSelector<MerchantlistState>('MerchantList');

export const selectDataMerchant = createSelector(
  selectDataState,
  (state: MerchantlistState) => state?.MerchantListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: MerchantlistState) => state?.totalItems || 0
);

export const selectedMerchant = createSelector(
    selectDataState,
    (state: MerchantlistState) =>  state?.selectedMerchant || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: MerchantlistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: MerchantlistState) => state?.error || null
);
