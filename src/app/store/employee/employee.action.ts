import { createAction, props } from '@ngrx/store';
import { Employee, EmployeeListModel } from './employee.model';

// fetch all list
export const fetchEmployeelistData = createAction('[Data] fetch Employeelist', props<{ page?: number; itemsPerPage?: number, role?: number}>());
export const fetchEmployeelistSuccess = createAction('[Data] fetch Employeelist success', props<{ EmployeeListdata: EmployeeListModel}>())
export const fetchEmployeelistFail = createAction('[Data fetch Employeelist failed]', props<{ error: string }>())

// Add Data
export const addEmployeelist = createAction('[Data] Add Employeelist',  props<{ newData: Employee }>());
export const addEmployeelistSuccess = createAction('[Data] Add Employeelist Success', props<{ newData: Employee }>());
export const addEmployeelistFailure = createAction('[Data] Add Employeelist Failure', props<{ error: string }>());
//get Employee by ID
export const getEmployeeById = createAction('[Data] get Employee', props<{ employeeId: number }>());
export const getEmployeeByIdSuccess = createAction('[Data] get Employee success', props<{ employee: Employee }>());
export const getEmployeeByIdFailure = createAction('[Data] get Employee Failure', props<{ error: string }>());

// Update Data
export const updateEmployeelist = createAction(
    '[Data] Update Employeelist',
    props<{ updatedData: Employee }>()
);
export const updateEmployeelistSuccess = createAction(
    '[Data] Update Employeelist Success',
    props<{ updatedData: Employee }>()
);
export const updateEmployeelistFailure = createAction(
    '[Data] Update Employeelist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteEmployeelist = createAction(
    '[Data] Delete Employeelist',
    props<{ employeeId: number }>()
);
export const deleteEmployeelistSuccess = createAction(
    '[Data] Delete Employeelist Success',
    props<{ employeeId: number }>()
);
export const deleteEmployeelistFailure = createAction(
    '[Data] Delete Employeelist Failure',
    props<{ error: string }>()
);