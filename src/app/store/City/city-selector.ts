// src/app/Citylist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CitylistState } from './city.reducer';

export const selectDataState = createFeatureSelector<CitylistState>('CityList');

export const selectDataCity = createSelector(
  selectDataState,
  (state: CitylistState) => state?.CityListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: CitylistState) => state?.totalItems || 0
);
export const selectCityById = (CityId: string) =>createSelector(
  selectDataState,
  (state: CitylistState) =>  state?.CityListdata.find(City => City.id === +CityId)
  );
export const selectDataLoading = createSelector(
  selectDataState,
  (state: CitylistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: CitylistState) => state?.error || null
);
