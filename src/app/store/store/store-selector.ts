// src/app/Storelist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  StorelistState } from './store.reducer';

export const selectDataState = createFeatureSelector<StorelistState>('StoreList');

export const selectData = createSelector(
  selectDataState,
  (state: StorelistState) => state?.StoreListdata || []
);
export const selectStoreById = (StoreId: string) =>createSelector(
  selectDataState,
  (state: StorelistState) =>  state?.StoreListdata.find(Store => Store.id === +StoreId)
  );
export const selectDataLoading = createSelector(
  selectDataState,
  (state: StorelistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: StorelistState) => state?.error || null
);
