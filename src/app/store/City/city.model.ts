/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface CityListModel  extends PaginateModel
{   
    data?: City[]; 
}
export interface City {
    
     id?: number;
     translation_data?: Translation[];
     country_id?: number;
     area_id?: number;
     area?: any;
     latitude?: string;
     longitude?: string;
     status? : string;
     updatedAt? :  string;
     createdAt?: string;

}


export enum Status {

     active = 2,
     inactive = 3,
     deleted = 4
  
    }