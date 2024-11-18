// src/app/Storelist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  StorelistState } from './store.reducer';

export const selectDataState = createFeatureSelector<StorelistState>('StoreList');

export const selectData = createSelector(
  selectDataState,
  (state: StorelistState) => state?.StoreListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: StorelistState) => state?.totalItems || 0
);
export const selectStoreById = createSelector(
  selectDataState,
  (state: StorelistState) =>  state?.selectedStore || null
  );
export const selectDataLoading = createSelector(
  selectDataState,
  (state: StorelistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: StorelistState) => state?.error || null
);
