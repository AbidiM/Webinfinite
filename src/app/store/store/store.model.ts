import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";
import { City } from "../City/city.model";
import { Merchant } from "../merchantsList/merchantlist1.model";

export interface StoreListModel  extends PaginateModel
{   
    data?: Branch[]; 
}
export interface Branch {
    
     id?: number;
     translation_data?: Translation[];    
     phone?: string;
     url?: string;
     merchant_id?: number;
     merchant ?:   Merchant;
     city_id?: number;
     city? :  City ;
     images?:  string[];  
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
