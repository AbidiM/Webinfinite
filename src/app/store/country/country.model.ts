import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface CountryListModel  extends PaginateModel
{   
    data?: Country[]; 
}
export interface Country {
    
     id?: number;
     translation_data?: Translation[];
     phoneCode?: string;
     flag?: string;
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
