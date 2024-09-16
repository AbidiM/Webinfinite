import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    claims: any[] = [];
    private currentUserSubject: BehaviorSubject<_User>;
    public currentUser: Observable<_User>;
    constructor(
        private router: Router,
       
    ) { 
      this.currentUserSubject = new BehaviorSubject<_User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
    }

    canActivate(route: ActivatedRouteSnapshot) {
 
        console.log('in claim guard');
        this.currentUser.subscribe(user => {
          if (user) {
               
                this.claims = user.role.claims;
              }
          });
          const requiredClaim = route.data?.['claim'];
                console.log('***********************');
                console.log(this.claims);
                console.log(requiredClaim);
                console.log('***********************');
          if (!requiredClaim) {
                  return true; // no permission required, allow access
                }
            
         const hasRequiredClaims = requiredClaim.some(requiredClaim => {
             return this.claims.some(claim => {
             return claim.type === requiredClaim.claimType && requiredClaim.claimValue.every(value => claim.value.includes(value));
          });
           });
         if (hasRequiredClaims) {
            return true; // user has all required permissions, allow access
          }
          else
         {
          this.router.navigate(['/pages/403']);
          return false; // user doesn't have required permissions, deny access
        }

        
        
        }
    
 
}
