import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface AreaListModel  extends PaginateModel
{   
    data?: Area[]; 
}
export interface Area {
    
     id?: number;
     translation_data?: Translation[];
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     country?: any;
     country_id?: number;
     status? : string;
     updatedAt? :  string;
     createdAt?: string;

}
export enum Status {

   pending = 1,
   active = 2,
   inactive = 3,
   deleted = 4

  }
