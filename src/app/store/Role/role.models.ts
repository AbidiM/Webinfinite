
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface RoleListModel  extends PaginateModel
{   
    data?: Role[]; 
}
export class Role{
  id?: number ;
  translation_data?: Translation[];
  claims ?: Claim[];
  status ?: Status;
}


export class Claim{
  claimType !: Modules;
  claimValue : Permission[]= [];
}
export enum  Status {
  isActive = 0,
  isDeleted = 1,
  isUpdated = 2,
  isBlackListed = 3,
  isDefault = 4,
  isInactive = 5,
  isExpired = 6,
  isApproved = 7,
  isRejected = 8,
  isPending = 9,
}
export  enum Modules
    {

        All = 0,
        Dashboard = 1,
        Employees = 2,
        Customers = 3,
        Merchants = 4,
        Stores = 5,
        Coupons = 6,
        Gift_Cards = 7,
        Offers = 8,
        Special_Coupons = 9,
        Role = 10,    
        Merchant_Wallet = 11,
        Merchant_Invoices = 12,
        Merchant_Commissions = 13,
        Customer_Wallet = 14,
        Customer_Commissions = 15,
        Customer_Abondoned_Tasks = 16,
        Customer_Reviews = 17,
        Customer_Invoice = 18,
        Notification_Management = 19,
        Payment = 20, 
        Subscription_Reports = 21,
        Coupon_Reports = 22,
        Card_Reports = 23,
        Subscriptions = 24,
        Company_Subscriptions = 25,
        PrePrinted_Membership = 26,
        Marketing_Compaigns = 27,
        Marketing_Offers = 28,
        Department = 29,
        System_Administration = 30,     
        Missions = 31,
        Contracts = 32,
        Complaints = 33,
        Delegate_Statistics = 34,
        Social_Media = 35,
        AppSettings = 36
        
        
       
       


}
export enum Permission {

  All = 1,
  ViewAll = 2,
  View = 3,
  Create = 4,
  Update = 5,
  Delete = 6,
  Hide = 7, 
  Activate = 8,
  Deactivate = 9,
  Approve = 10,
  Print = 11,
  Download = 12,
  Filter = 13,
  Decline = 14
}



