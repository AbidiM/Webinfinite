import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })

export class CrudService {
    constructor(private http: HttpClient) { }

    
    
    /***
     * Get 
     */
   
    fetchData(url: any, payload?: Params ): Observable<any[]> {

        return this.http.get<any[]>(`https://legislative-eveleen-infiniteee-d57d0fbe.koyeb.app/api${url}`, {params: payload});
    }
    
    addData(url: any, newData: any): Observable<any[]> {
        return this.http.post<any[]>(`https://legislative-eveleen-infiniteee-d57d0fbe.koyeb.app/api${url}`, newData);
    }

    updateData(url: any, updatedData: any): Observable<any[]> {
        delete updatedData.id;
        return this.http.patch<any[]>(`https://legislative-eveleen-infiniteee-d57d0fbe.koyeb.app/api${url}`, updatedData);
    }

    deleteData(url: any): Observable<string> {
        return this.http.delete<string>(`https://legislative-eveleen-infiniteee-d57d0fbe.koyeb.app/api${url}`);
    }

    disableData(url: string, userId: string): Observable<string> {
        return this.http.post<string>(url, { userId },{ responseType: 'text' as 'json' })
        .pipe(
          tap(response => console.log('Service response:', response)), // Log service response
          catchError(error => {
            console.error('Service error:', error); // Log error details
            return of(''); // Return a default empty string or a specific error message
          })
        );
    }
      
}

export interface Params {
    [key: string]: any;
}
