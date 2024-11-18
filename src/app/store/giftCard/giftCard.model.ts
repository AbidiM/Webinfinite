/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";
import { Country } from "../country/country.model";
import { Area } from "../area/area.model";
import { City } from "../City/city.model";
import { Merchant } from "../merchantsList/merchantlist1.model";
export interface GiftCardListModel  extends PaginateModel
{   
    data?: GiftCard[]; 
}
export interface GiftCard {
    
        id?: number;
        translation_data?: Translation[];    
        codeGiftCard?: string;
        qrCode?: string;
        urlStore?: string;
        country?: Country;
        area?:  Area;
        city?:  City;
        quantity?: number;
        merchant_id?: number;
        merchant?: Merchant;
        store?: any;//Store;
        managerName?: string;
        managerPhone?: string;
        startDateGiftCard?: Date;
        endDateGiftCard?: Date;
        contractRepName?: string;
        sectionOrderAppearnance?: string;
        categoryOrderAppearnce?: string;
        merchantLogo?: string;
        giftCardImage?: string;
        GiftCardType?: string;// free,discountPercent,discountAmount,servicePrice
        GiftCardValueBeforeDiscount?:number;
        GiftCardValueAfterDiscount?:number;
        PaymentDiscountRate?: number;
        status?: string;//pending,approved,active, expired, closed
        }