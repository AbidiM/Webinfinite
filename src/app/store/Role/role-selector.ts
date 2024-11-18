// src/app/Rolelist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  RolelistState } from './role.reducer';

export const selectDataState = createFeatureSelector<RolelistState>('RoleList');

export const selectDataRole = createSelector(
  selectDataState,
  (state: RolelistState) => state?.RoleListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: RolelistState) => state?.totalItems || 0
);
export const selectRoleById = createSelector(
  selectDataState,
  (state: RolelistState) =>  state?.selectedRole || null
  );
  
export const selectDataLoading = createSelector(
  selectDataState,
  (state: RolelistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: RolelistState) => state?.error || null
);
