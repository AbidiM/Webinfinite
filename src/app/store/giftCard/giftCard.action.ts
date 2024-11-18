import { createAction, props } from '@ngrx/store';
import { GiftCard, GiftCardListModel } from './giftCard.model';

// fetch all list
export const fetchGiftCardlistData = createAction('[Data] fetch GiftCardlist',props<{ page: number; itemsPerPage: number, status?: string }>());
export const fetchGiftCardlistSuccess = createAction('[Data] fetch GiftCardlist success', props<{ GiftCardListdata: GiftCardListModel }>())
export const fetchGiftCardlistFail = createAction('[Data fetch GiftCardlist failed]', props<{ error: string }>())

// Add Data
export const addGiftCardlist = createAction('[Data] Add GiftCardlist',  props<{ newData: GiftCard }>());
export const addGiftCardlistSuccess = createAction('[Data] Add GiftCardlist Success', props<{ newData: GiftCard }>());
export const addGiftCardlistFailure = createAction('[Data] Add GiftCardlist Failure', props<{ error: string }>());

//get GiftCard by ID
export const getGiftCardById = createAction('[Data] get GiftCard', props<{ GiftCardId: number }>());
export const getGiftCardByIdSuccess = createAction('[Data] get GiftCard success', props<{ GiftCard: GiftCard }>());
export const getGiftCardByIdFailure = createAction('[Data] get GiftCard Failure', props<{ error: string }>());

// Update Data
export const updateGiftCardlist = createAction('[Data] Update GiftCardlist', props<{ updatedData: GiftCard }>());
export const updateGiftCardlistSuccess = createAction('[Data] Update GiftCardlist Success', props<{ updatedData: GiftCard }>());
export const updateGiftCardlistFailure = createAction('[Data] Update GiftCardlist Failure', props<{ error: string }>());

// Delete Data
export const deleteGiftCardlist = createAction('[Data] Delete GiftCardlist', props<{ GiftCardId: number }>());
export const deleteGiftCardlistSuccess = createAction('[Data] Delete GiftCardlist Success', props<{ GiftCardId: number }>());
export const deleteGiftCardlistFailure = createAction('[Data] Delete GiftCardlist Failure', props<{ error: string }>());