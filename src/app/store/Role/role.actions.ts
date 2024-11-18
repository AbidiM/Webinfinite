import { createAction, props } from '@ngrx/store';
import { Role, RoleListModel } from './role.models';

// fetch all list
export const fetchRolelistData = createAction('[Data] fetch Rolelist',props<{ page?: number; itemsPerPage?: number , status?: string}>());
export const fetchRolelistSuccess = createAction('[Data] fetch Rolelist success', props<{ RoleListdata: RoleListModel }>())
export const fetchRolelistFail = createAction('[Data fetch Rolelist failed]', props<{ error: string }>())

// Add Data
export const addRolelist = createAction('[Data] Add Rolelist',  props<{ newData: Role }>());
export const addRolelistSuccess = createAction('[Data] Add Rolelist Success', props<{ newData: Role }>());
export const addRolelistFailure = createAction('[Data] Add Rolelist Failure', props<{ error: string }>());
//get Role by ID
export const getRoleById = createAction('[Data] get Role', props<{ RoleId: number }>());
export const getRoleByIdSuccess = createAction('[Data] get Role success', props<{ Role: Role }>());
export const getRoleByIdFailure = createAction('[Data] get Role Failure', props<{ error: string }>());

// Update Data
export const updateRolelist = createAction(
    '[Data] Update Rolelist',
    props<{ updatedData: Role }>()
);
export const updateRolelistSuccess = createAction(
    '[Data] Update Rolelist Success',
    props<{ updatedData: Role }>()
);
export const updateRolelistFailure = createAction(
    '[Data] Update Rolelist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteRolelist = createAction(
    '[Data] Delete Rolelist',
    props<{ RoleId: number }>()
);
export const deleteRolelistSuccess = createAction(
    '[Data] Delete Rolelist Success',
    props<{ RoleId: number }>()
);
export const deleteRolelistFailure = createAction(
    '[Data] Delete Rolelist Failure',
    props<{ error: string }>()
);