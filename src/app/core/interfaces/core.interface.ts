export interface Params {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface PaginateModel {
    current_page?: number;
    first_page_url?: string;
    from?: number;
    last_page?: number;
    last_page_url?: string;
    //links?: Link[];
    next_page_url?: string;
    path?: string;
    per_page?: number;
    prev_page_url?: string;
    to?: number;
    totalItems?: number;
}
export interface Translation{
    id?: number;
    name?: string;
    title?: string;
    f_name?: string;
    l_name?: string;
    supervisorName?: string;
    termsAndConditions?: string;
    description?: string;
    managerName?: string;
    language?: string;
}