/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { _User, User } from 'src/app/store/Authentication/auth.models';
import { environment } from 'src/environments/environment';
//import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthfakeauthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<_User>;
    

    constructor(private http: HttpClient) {
        
        const storedUser = localStorage.getItem('currentUser');
        const user = storedUser ? JSON.parse(storedUser) : null;
        this.currentUserSubject = new BehaviorSubject<_User>(user);
        this.currentUser = this.currentUserSubject.asObservable();
    }
   
    public get currentUserValue(): _User {
        return this.currentUserSubject.value;
    }
    register ( data: any){
        return this.http.post<any>(`${environment.baseURL}/auth/register-merchant`, data );

    }
    login(loginKey: string, password: string) {
       
        return this.http.post<any>(`${environment.baseURL}/auth/login`, { loginKey, password });
      
    }
    forgotPassword(email: string){
        return this.http.post(`${environment.baseURL}/auth/forgot-password`,{email}) ;
    }
    updateProfilePassword( oldPassword: string, newPassword: string){
       // const id = this.currentUserSubject.value.userId;
         return this.http.post(`${environment.baseURL}/auth/change-password`,{oldPassword,newPassword});
        
    }
    updatePassword(password: string, token: string){

        return this.http.post(`${environment.baseURL}/auth/reset-password`,{password, token});
      
   }
    updateProfile(user: any){
        return this.http.patch(` ${environment.baseURL}/users/${user.id}`,user) ;
    }

    refreshToken(refreshToken: string): Observable<any> {
        return this.http.post(` ${environment.baseURL}/auth/refresh`, { refreshToken: refreshToken });
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('timeLifeToken');
        //clean up the cookies
        document.cookie = 'lang=; Max-Age=-99999999; path=/';
        this.currentUserSubject.next(null);
    }
}
