// src/app/Citylist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addCitylist, addCitylistFailure, addCitylistSuccess, deleteCitylist, deleteCitylistFailure, deleteCitylistSuccess, fetchCitylistData, fetchCitylistFail, fetchCitylistSuccess, getCityById, getCityByIdFailure, getCityByIdSuccess, updateCitylist, updateCitylistFailure, updateCitylistSuccess } from './city.action';
import { City } from './city.model';

export interface CitylistState {
  CityListdata: City[];
  currentPage: number;
  totalItems: number;
  selectedCity: City,
  loading: boolean;
  error: string;
}

export const initialState: CitylistState = {
  CityListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedCity: null,
  loading: false,
  error: null,
};

export const CityListReducer = createReducer(
  initialState,
  on(fetchCitylistData, (state,{ page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchCitylistSuccess, (state, { CityListdata }) => ({
    ...state,
    CityListdata: CityListdata.data,
    totalItems: CityListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchCitylistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle adding City 
  on(addCitylist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding City success
  on(addCitylistSuccess, (state, { newData }) => ({
    ...state,
    CityListdata: [...state.CityListdata, newData],
    loading: false,
    error: null 

  })),
     //Handle adding City failure
     on(addCitylistFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false 
    })),
    //Handle getting City by id
    on(getCityById, (state) => ({
      ...state,
      loading: true,
      error: null 
    })),
  // Handle success of getting City by ID and City the City object in the state
  on(getCityByIdSuccess, (state, { City }) => ({
    ...state,
    selectedCity: City,
    loading: false,
      error: null 
  })),
  on(getCityByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
  // Handle updating City list
  on(updateCitylist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  
// Handle updating City 
  on(updateCitylistSuccess, (state, { updatedData }) => {
   const CityListUpdated = state.CityListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      CityListdata: CityListUpdated,
      loading: false,
      error: null
    };
  }),
   // Handle updating City failure
   on(updateCitylistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting City 
  on(deleteCitylist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a City
  on(deleteCitylistSuccess, (state, { CityId }) => {
    const updatedCityList = state.CityListdata.filter(City => City.id !== CityId);
    return { 
    ...state,
    CityListdata: updatedCityList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a City
  on(deleteCitylistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
