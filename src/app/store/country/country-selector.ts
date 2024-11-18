// src/app/Countrylist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CountrylistState } from './country.reducer';

export const selectDataState = createFeatureSelector<CountrylistState>('CountryList');

export const selectDataCountry = createSelector(
  selectDataState,
  (state: CountrylistState) => state?.CountryListdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: CountrylistState) => state?.totalItems || 0
);
export const selectedCountry = createSelector(
    selectDataState,
    (state: CountrylistState) =>  state?.selectedCountry || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: CountrylistState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: CountrylistState) => state?.error || null
);
