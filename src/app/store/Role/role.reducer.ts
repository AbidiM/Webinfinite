// src/app/Rolelist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addRolelist, addRolelistFailure, addRolelistSuccess, deleteRolelist, deleteRolelistFailure, deleteRolelistSuccess, fetchRolelistData, fetchRolelistFail, fetchRolelistSuccess, getRoleById, getRoleByIdFailure, getRoleByIdSuccess, updateRolelist, updateRolelistFailure, updateRolelistSuccess } from './role.actions';
import { Role } from './role.models';

export interface RolelistState {
  RoleListdata: Role[];
  currentPage: number;
  totalItems: number;
  selectedRole: Role;
  loading: boolean;
  error: string;
}

export const initialState: RolelistState = {
  RoleListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedRole: null,
  loading: false,
  error: null,
};

export const RoleListReducer = createReducer(
  initialState,
  on(fetchRolelistData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchRolelistSuccess, (state, { RoleListdata }) => ({
    ...state,
    RoleListdata: RoleListdata.data,
    totalItems:RoleListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchRolelistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  //Handle adding Role 
  on(addRolelist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Role success
  on(addRolelistSuccess, (state, { newData }) => ({
    ...state,
    RoleListdata: [newData,...state.RoleListdata],
    loading: false,
    error: null 

  })),
    //Handle adding Role failure
    on(addRolelistFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false
    })),
    //Handle getting Role by id
    on(getRoleById, (state) => ({
      ...state,
      loading: true,
      error: null 
    })),
  // Handle success of getting Role by ID and store the Role object in the state
   on(getRoleByIdSuccess, (state, { Role }) => ({
    ...state,
    selectedRole: Role,
    loading: false,
    error: null 

  })),
 // Handle success of getting Role by ID and store the Role object in the state
 on(getRoleByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
// Handle updating Role list
on(updateRolelist, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
// Handle updating Role success
  on(updateRolelistSuccess, (state, { updatedData }) => {
   const RoleListUpdated = state.RoleListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      RoleListdata: RoleListUpdated,
      loading: false,
      error: null
    };
  }),
  // Handle updating Role failure
  on(updateRolelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Role 
  on(deleteRolelist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Role
  on(deleteRolelistSuccess, (state, { RoleId }) => {
    const updatedRoleList = state.RoleListdata.filter(Role => Role.id !== RoleId);
    return { 
    ...state,
    RoleListdata: updatedRoleList,
    loading: false,
    error: null
  };
  }),
  // Handle failure of deleting a Role
  on(deleteRolelistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
