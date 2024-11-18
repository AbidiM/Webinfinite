import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface NotificationListModel  extends PaginateModel
{   
    data?: Notification[];
    total?: number;
    unseen?: number; 
}
export interface Notification {
    
        id?: number;
        user_id?: number;
        seen?: boolean,
        status?: string,
        type?: string,
        cronExpression?: string
        translation_data?: Translation[];

        }