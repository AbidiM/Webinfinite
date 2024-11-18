/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, Input, SimpleChanges, TemplateRef, ViewContainerRef, OnChanges, OnInit  } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';
import { Claim } from 'src/app/store/Role/role.models';



@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasClaim]'
})
export class HasClaimDirective implements OnChanges, OnInit {

  @Input('hasClaim') claim: Claim[]; // Ensure claim is of type Claim

  //claims$: any[];
  private currentUserSubject: BehaviorSubject<_User>;
  public currentUser: Observable<_User>;
  public permissions: any[] = [];
  private isViewCreated = false;

  constructor(  private templateRef: TemplateRef<string>,
    private viewContainerRef: ViewContainerRef) {
      
      this.currentUserSubject = new BehaviorSubject<_User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
      
    }
  ngOnChanges(changes: SimpleChanges) {
   
      if (changes['claim'] && !changes['claim'].firstChange) {
        this.checkPermissions();
      }
    }
  
  private checkPermissions() {
    if (this.hasPermission(this.claim)) {
      if (!this.isViewCreated) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
        this.isViewCreated = true;
      }
    } else {
      if (this.isViewCreated) {
        this.viewContainerRef.clear();
        this.isViewCreated = false;
      }
    }
  }

private hasPermission(claim: Claim[]): boolean {
 if (claim && this.permissions) {
       return claim.some(requiredClaim => 
         this.permissions.some(permission => 
           permission.claimType === requiredClaim.claimType && 
           requiredClaim.claimValue.some(value => permission.claimValue.includes(value))//should change this  from every to some
       ));
      }
    return false;
  }

 
  ngOnInit() {
    this.currentUser.subscribe(user => {
      if (user) {
      this.permissions = user.role.claims;
      this.checkPermissions();
    }});
  }
 
}
