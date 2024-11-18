import { createAction, props } from '@ngrx/store';
import { City, CityListModel } from './city.model';

// fetch all list
export const fetchCitylistData = createAction('[Data] fetch Citylist',props<{ page: number; itemsPerPage: number, status: string }>());
export const fetchCitylistSuccess = createAction('[Data] fetch Citylist success', props<{ CityListdata: CityListModel}>())
export const fetchCitylistFail = createAction('[Data fetch Citylist failed]', props<{ error: string }>())

// Add Data
export const addCitylist = createAction('[Data] Add Citylist',  props<{ newData: City }>());
export const addCitylistSuccess = createAction('[Data] Add Citylist Success', props<{ newData: City }>());
export const addCitylistFailure = createAction('[Data] Add Citylist Failure', props<{ error: string }>());
//get City by ID
export const getCityById = createAction('[Data] get City', props<{ CityId: number }>());
export const getCityByIdSuccess = createAction('[Data] get City success', props<{ City: City }>());
export const getCityByIdFailure = createAction('[Data] get City Failure', props<{ error: string }>());

// Update Data
export const updateCitylist = createAction(
    '[Data] Update Citylist',
    props<{ updatedData: City }>()
);
export const updateCitylistSuccess = createAction(
    '[Data] Update Citylist Success',
    props<{ updatedData: City }>()
);
export const updateCitylistFailure = createAction(
    '[Data] Update Citylist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteCitylist = createAction(
    '[Data] Delete Citylist',
    props<{ CityId: number }>()
);
export const deleteCitylistSuccess = createAction(
    '[Data] Delete Citylist Success',
    props<{ CityId: number }>()
);
export const deleteCitylistFailure = createAction(
    '[Data] Delete Citylist Failure',
    props<{ error: string }>()
);