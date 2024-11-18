/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, take } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    claims: any[] = [];
    private currentUserSubject: BehaviorSubject<_User>;
    public currentUser: Observable<_User>;
    constructor( private router: Router  
    ) { 
      const storedUser = localStorage.getItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<_User | null>(storedUser ? JSON.parse(storedUser) : null);
      this.currentUser = this.currentUserSubject.asObservable();
      
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
 
         return this.currentUser.pipe(
          take(1), // Take the first value of the observable and complete it
          map(user => {
              if (user) {
                  const claims = user.role.claims;
                  const requiredClaim = route.data?.['claim'];

                  if (!requiredClaim) {
                      return true; // No permission required, allow access
                  }

                  const hasRequiredClaims = requiredClaim.some(required => {
                      return claims.some(claim => {
                          return claim.claimType === required.claimType &&
                              required.claimValue.some(value => claim.claimValue.includes(value));
                      });
                  });

                  return hasRequiredClaims;
              } else {
                  this.router.navigate(['/auth/login']);
                  return false; // User is not authenticated
              }
          }),
          catchError(() => {
              this.router.navigate(['/pages/403']);
              return of(false); // In case of error (e.g. no user data), deny access
          })
      );
        
        }
    
 
}
