import { createAction, props } from '@ngrx/store';
import { Merchant, MerchantListModel } from './merchantlist1.model';

// fetch all list
export const fetchMerchantlistData = createAction('[Data] fetch Merchantlist', props<{ page?: number; itemsPerPage?: number, status?: string }>());
export const fetchMerchantlistSuccess = createAction('[Data] fetch Merchantlist success', props<{ MerchantListdata: MerchantListModel}>())
export const fetchMerchantlistFail = createAction('[Data fetch Merchantlist failed]', props<{ error: string }>())


// Add Data
export const addMerchantlist = createAction('[Data] Add Merchantlist',  props<{ newData: Merchant }>());
export const addMerchantlistSuccess = createAction('[Data] Add Merchantlist Success', props<{ newData: Merchant }>());
export const addMerchantlistFailure = createAction('[Data] Add Merchantlist Failure', props<{ error: string }>());

//get Merchant by ID

export const getMerchantById = createAction('[Data] get Merchant', props<{ merchantId: number }>());
export const getMerchantByIdSuccess = createAction('[Data] get Merchant success', props<{ merchant: Merchant }>());
export const getMerchantByIdFailure = createAction('[Data] get Merchant Failure', props<{ error: string }>());

// Update Data
export const updateMerchantlist = createAction(
    '[Data] Update Merchantlist',
   // props<{ updatedData: MerchantListModel }>()
   props<{ updatedData: Merchant }>()

);
export const updateMerchantlistSuccess = createAction(
    '[Data] Update Merchantlist Success',
    props<{ updatedData: Merchant }>()
);
export const updateMerchantlistFailure = createAction(
    '[Data] Update Merchantlist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteMerchantlist = createAction(
    '[Data] Delete Merchantlist',
    props<{ userId: number }>()
);
export const deleteMerchantlistSuccess = createAction(
    '[Data] Delete Merchantlist Success',
    props<{ userId: number }>()
);
export const deleteMerchantlistFailure = createAction(
    '[Data] Delete Merchantlist Failure',
    props<{ error: string }>()
);