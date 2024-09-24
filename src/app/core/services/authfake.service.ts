import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
        return this.http.post('/forgot-password',{email}) ;
    }
    updateProfilePassword(id: string, currentPassword: string, newPassword: string){
       // const id = this.currentUserSubject.value.userId;
         return this.http.put(`/${id}/password`,{currentPassword,newPassword})
        .pipe(map(message => {
            console.log(message)
            return message;
        }));
    }
    updatePassword(password: string, token: string){

        return this.http.post(`/reset-password/${token}`,{password})
       .pipe(map(message => {
           console.log(message)
           return message;
       }));
   }
    updateProfile(user: any){
        console.log(user);
        return this.http.put('/user',user.user) ;
    }

    refreshToken(refreshToken: string): Observable<any> {
        return this.http.post('auth/refresh', { refreshToken });
    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('timeLifeToken');
        this.currentUserSubject.next(null);
    }
}
