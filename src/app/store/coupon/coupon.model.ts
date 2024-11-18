/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";
import { City } from "../City/city.model";
import { Area } from "../area/area.model";
import { Country } from "../country/country.model";
import { Merchant } from "../merchantsList/merchantlist1.model";

export interface CouponListModel  extends PaginateModel
{   
    data?: Coupon[]; 
}
export interface Coupon {
    
        id?: number;
        translation_data?: Translation[];    
        codeCoupon?: string;
        qrCode?: string;
        urlStore?: string;
        country?: Country;
        area?: Area;
        city?:  City;
        quantity?: number;
        merchant?: Merchant;
        stores?: any;//Store;
        managerPhone?: string;
        startDateCoupon?: Date;
        endDateCoupon?: Date;
        contractRepName?: string;
        sectionOrderAppearnance?: string;
        merchant_id?: number;
        categoryOrderAppearnce?: string;
        merchantLogo?: string;
        couponLogo?: string;
        couponType?: string;// free,discountPercent,discountAmount,servicePrice
        couponValueBeforeDiscount?:number;
        couponValueAfterDiscount?:number;
        PaymentDiscountRate?: number;
        status?: string;//pending,approved,active, expired, closed
        }