export interface CountryListModel {
    
     id?: string;
     name?: string;
     nameTrans?: string;
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
