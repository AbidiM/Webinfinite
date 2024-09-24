import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../../core/services/token-storage.service';
import { Observable } from 'rxjs';

// const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end
const TOKEN_HEADER_KEY = 'x-auth-token';   // for Node.js Express back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');  // Adjust the key as needed

      if (token) {
          // Clone the request and add the token to the headers
          const cloned  = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
          return next.handle(cloned);
      } else {
          // No token, continue with the original request
          return next.handle(request);
      }
    
  }
  
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];