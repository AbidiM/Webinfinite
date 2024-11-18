import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";
import {  Role } from "../Role/role.models";
import { City } from "../City/city.model";

export interface EmployeeListModel  extends PaginateModel
{   
    data?: Employee[]; 
}
export interface Employee {
    
        id?: number;
        translation_data?: Translation[];
        email?: string;
        phone?: string;
        password?: string;
        image?: string;
        city_id?: number; // City;
        city?: City;
        bank_id?: number;
        bankAccountNumber?: string;
        bankName?: string;
        role_id?: number;
        role?: Role;
        createdBy?: string;
        status?: string;//pending,approved,active, inactive, disabled
}