/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class DashboardService {
    constructor(private HttpClient: HttpClient) {
    }
    getStatistics(rateDuration: string): Observable<any>{

        return this.HttpClient.get<any>(` ${environment.baseURL}/dashboard?rateDuration=${rateDuration}`);

    }
}