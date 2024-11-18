import { createAction, props } from '@ngrx/store';
import { Branch, StoreListModel } from './store.model';

// fetch all list
export const fetchStorelistData = createAction('[Data] fetch Storelist', props<{ page?: number; itemsPerPage?: number, query?: string, status?: string, city_id?:number,  merchant_id?: number }>());
export const fetchStorelistSuccess = createAction('[Data] fetch Storelist success', props<{ StoreListdata: StoreListModel }>())
export const fetchStorelistFail = createAction('[Data fetch Storelist failed]', props<{ error: string }>())

// Add Data
export const addStorelist = createAction('[Data] Add Storelist',  props<{ newData: Branch }>());
export const addStorelistSuccess = createAction('[Data] Add Storelist Success', props<{ newData: Branch }>());
export const addStorelistFailure = createAction('[Data] Add Storelist Failure', props<{ error: string }>());

//get Store by ID
export const getStoreById = createAction('[Data] get Store', props<{ StoreId: number }>());
export const getStoreByIdSuccess = createAction('[Data] get Store success', props<{ Store: Branch }>());
export const getStoreByIdFailure = createAction('[Data] get Store Failure', props<{ error: string }>());

// Update Data
export const updateStorelist = createAction(
    '[Data] Update Storelist',
    props<{ updatedData: Branch }>()
);
export const updateStorelistSuccess = createAction(
    '[Data] Update Storelist Success',
    props<{ updatedData: Branch }>()
);
export const updateStorelistFailure = createAction(
    '[Data] Update Storelist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteStorelist = createAction(
    '[Data] Delete Storelist',
    props<{ storeId: number }>()
);
export const deleteStorelistSuccess = createAction(
    '[Data] Delete Storelist Success',
    props<{ storeId: number }>()
);
export const deleteStorelistFailure = createAction(
    '[Data] Delete Storelist Failure',
    props<{ error: string }>()
);