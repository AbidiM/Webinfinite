import { createAction, props } from '@ngrx/store';
import { User } from './auth.models';

// Register action
export const Register = createAction('[Authentication] Register', props<{ email: string, username: string, password: string }>());
export const RegisterSuccess = createAction('[Authentication] Register Success', props<{ user: User }>());
export const RegisterFailure = createAction('[Authentication] Register Failure', props<{ error: string }>());

// login action
export const login = createAction('[Authentication] Login', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[Authentication] Login Success', props<{ user: any }>());
export const loginFailure = createAction('[Authentication] Login Failure', props<{ error: any }>());

// forgotPassword action
export const forgetPassword = createAction('[Authentication] forgetPassword', props<{ email: string }>());
export const forgetPasswordSuccess = createAction('[Authentication] forgetPassword Success', props<{ user: any }>());
export const forgetPasswordFailure = createAction('[Authentication] forgetPassword Failure', props<{ error: any }>());

// UpdatePassword action
export const updatePassword = createAction('[Authentication] updatePassword', props<{ password: string }>());
export const updatePasswordSuccess = createAction('[Authentication] updatePassword Success', props<{ user: any }>());
export const updatePasswordFailure = createAction('[Authentication] updatePassword Failure', props<{ error: any }>());

// logout action
export const logout = createAction('[Authentication] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');


