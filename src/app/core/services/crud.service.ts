/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';


@Injectable({ providedIn: 'root' })
export class CrudService {
    currentLge: string = '[]';

    constructor(
        private http: HttpClient,    
        private cookieService: CookieService,
    ) {       
        this.currentLge = this.cookieService.get('lang');
        console.log(this.currentLge);
  
    }
   
    
    /***
     * Get 
     */
    fetchMyNotif<T>(url: string): Observable<T> {
        let params = new HttpParams();

        // Add language parameter if it's set
        if (this.currentLge) {
            const lge = `["${this.currentLge}"]`;
            params = params.set('lang', lge);
        }
        return this.http.get<T>(` ${environment.baseURL}${url}`,{params: params});
    }

    fetchData<T>(url: string, payload?: Params ): Observable<T> {
         return this.http.get<T>(` ${environment.baseURL}${url}`, {params: this.setParams(payload)});
    }
    
    addData<T>(url: string, newData: T): Observable<T> {
        return this.http.post<T>(` ${environment.baseURL}${url}`, newData);
    }

    updateData<T>(url: string, updatedData: T): Observable<T> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (updatedData as any).id;
        return this.http.patch<T>(` ${environment.baseURL}${url}`, updatedData);
    }
    getDataById<T>(url, id: number): Observable<T> {
        return this.http.get<T>(` ${environment.baseURL}${url}/${id}`);

    }
    deleteData(url: string): Observable<string> {
        return this.http.delete<string>(` ${environment.baseURL}${url}`);
    }

    private setParams(payload: any): any{
        let params = new HttpParams();

        // Add language parameter if it's set
        if (this.currentLge) {
            const lge = `["${this.currentLge}"]`;
            params = params.set('lang', lge);
        }

        // Add any additional parameters from the payload
        if (payload) {
        for (const key in payload) {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
            params = params.set(key, payload[key]);
            }
        }
        }
        return params;
      }
      
}

export interface Params {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}