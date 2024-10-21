// src/app/Employeelist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  EmployeelistState } from './employee.reducer';

export const selectDataState = createFeatureSelector<EmployeelistState>('EmployeeList');

export const selectData = createSelector(
  selectDataState,
  (state: EmployeelistState) => state?.EmployeeListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: EmployeelistState) => state?.totalItems || 0
);

export const selectEmployeeById = (EmployeeId: string) =>createSelector(
  selectDataState,
  (state: EmployeelistState) =>  state?.EmployeeListdata.find(Employee => Employee.id === +EmployeeId)
  );

export const selectDataLoading = createSelector(
  selectDataState,
  (state: EmployeelistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: EmployeelistState) => state?.error || null
);
