import { ActionReducerMap } from "@ngrx/store";
import { AuthenticationState, authenticationReducer } from "./Authentication/authentication.reducer";

import { CandidateReducer, CandidateState } from "./Candidate/candidate.reducer";

import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";
import { CustomerReducer, CustomerState } from "./customer/customer.reducer";
import { MerchantListReducer, MerchantlistState } from "./merchantsList/merchantlist1.reducer";
import { CouponListReducer, CouponlistState } from "./coupon/coupon.reducer";
import { EmployeeListReducer, EmployeelistState } from "./employee/employee.reducer";
import { StoreListReducer, StorelistState } from "./store/store.reducer";
import { CountryListReducer, CountrylistState } from "./country/country.reducer";
import { AreaListReducer, ArealistState } from "./area/area.reducer";
import { CityListReducer, CitylistState } from "./City/city.reducer";
import { NotificationListReducer, NotificationlistState } from "./notification/notification.reducer";
import { RoleListReducer, RolelistState } from "./Role/role.reducer";
import { SectionListReducer, SectionlistState } from "./section/section.reducer";
import { GiftCardListReducer, GiftCardlistState } from "./giftCard/giftCard.reducer";


export interface RootReducerState {
    layout: LayoutState;
    auth: AuthenticationState;
  
    CandidateList: CandidateState;
 
    Customer: CustomerState;
    MerchantList: MerchantlistState;
    CouponList: CouponlistState;
    EmployeeList: EmployeelistState;
    StoreList: StorelistState;
    CountryList: CountrylistState;
    AreaList: ArealistState;
    CityList: CitylistState;
    NotificationList: NotificationlistState;
    RoleList: RolelistState;
    SectionList: SectionlistState;
    GiftCardList: GiftCardlistState;
    
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    auth: authenticationReducer,
    CandidateList: CandidateReducer,
    Customer: CustomerReducer,
    MerchantList:MerchantListReducer,
    CouponList: CouponListReducer,
    EmployeeList: EmployeeListReducer,
    StoreList: StoreListReducer,
    CountryList: CountryListReducer,
    AreaList: AreaListReducer,
    CityList: CityListReducer,
    NotificationList: NotificationListReducer,
    RoleList: RoleListReducer,
    SectionList: SectionListReducer,
    GiftCardList: GiftCardListReducer

}