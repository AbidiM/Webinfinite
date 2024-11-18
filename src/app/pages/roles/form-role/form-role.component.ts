/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { _User } from 'src/app/store/Authentication/auth.models';
import { selectDataLoading, selectRoleById } from 'src/app/store/Role/role-selector';
import { addRolelist, getRoleById, updateRolelist } from 'src/app/store/Role/role.actions';
import { Modules, Permission, Role } from 'src/app/store/Role/role.models';

@Component({
  selector: 'app-form-role',
  templateUrl: './form-role.component.html',
  styleUrl: './form-role.component.css'
})
export class FormRoleComponent implements OnInit, OnDestroy {
  
  @Input() type: string;
  roleForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;

  private destroy$ = new Subject<void>();
  Rolelist$: Observable<Role[]>;
  loading$: Observable<boolean>;

  role: Role;
  claims: { claimType: Modules; claimValue: Permission[] }[] = [];

  submitted: boolean = false;
  error: string = '';
  isEditing: boolean = false;
  ALLPermissionChecked: boolean = false;
  ALLModulesChecked : boolean = false;

  public Permission: Permission;
  public Module: Modules;
  currentRole: string = '';
  merchantClaims: any = null;
  moduleKeys: any[] = [];
  permissionKeys: any[] = [];
  originalRoleData: Role = {}; 
  @ViewChild('formElement', { static: false }) formElement: ElementRef;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private formUtilService: FormUtilService,
    public store: Store) {
     
      this.loading$ = this.store.pipe(select(selectDataLoading)); 
      this.currentRole = this.getCurrentUser()?.role.translation_data[0].name;
      if(this.currentRole !== 'Admin'){
        //Modify moduleskeys and permissions key when a merchant or an employee is logged in
         this.merchantClaims = this.getCurrentUser()?.role.claims;
         this.mapClaimsToEnums(this.merchantClaims);
        }
      else
      {
        // Extract the keys from Modules and Permissions enums when its an admin logged
        this.moduleKeys = Object.keys(Modules).filter(key => isNaN(Number(key))); // Get the module names
        this.permissionKeys = Object.keys(Permission).filter(key => isNaN(Number(key))); // Get the permission names
      }
      this.roleForm = this.formBuilder.group({
        id:[null],
        name: ['', Validators.required],
        name_ar: ['', Validators.required],
        claims: [[]],
        
      });
     }
     mapClaimsToEnums(claims: any[]) {
      
      claims.forEach(claim => {
          if (claim.claimType in Modules) {
              this.moduleKeys.push(Modules[claim.claimType]); // Get module name
              claim.claimValue.forEach(value => {
                  if (value in Permission) {
                      if(!this.permissionKeys.includes(Permission[value]))
                        this.permissionKeys.push(Permission[value]); // Get permission name
                  }
              });
          }
      });

  
  }
     private getCurrentUser(): _User {
      // Replace with your actual logic to retrieve the user role
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser;
  } 
 

  ngOnInit() {
        

    const roleId = this.route.snapshot.params['id'];
    if (roleId) {
      // Dispatch action to retrieve the role by ID
      this.store.dispatch(getRoleById({ RoleId: roleId }));
      
      // Subscribe to the selected role from the store
      this.store
        .pipe(select(selectRoleById), takeUntil(this.destroy$))
        .subscribe(role => {
          if (role) {
            this.role = role;
            this.patchValueForm(role);
            this.claims = this.role.claims;
            this.originalRoleData = { ...role };
            this.isEditing = true;
            this.patchClaimsToCheckboxes(role.claims);

          }
        });
    }
   
  }
  patchValueForm(role: Role){
    this.roleForm.patchValue(role);
    this.roleForm.patchValue({
      name: role.translation_data[0].name,
      name_ar: role.translation_data[1].name,
      
      
    });
  
  }
  initializePermission(){
    this.claims = [];
    this.ALLModulesChecked = false;
  }
  shouldDisableCheckbox(module: string, permission: string): boolean {
    // Check if all modules are checked
    if (this.ALLModulesChecked) {
        return true; // Disable all checkboxes in this case
    }

    
    const moduleClaim = this.claims.find(claim => claim.claimType === Modules[module as keyof typeof Modules]);
    if (moduleClaim && moduleClaim.claimValue.includes(Permission.All)) {
        return permission !== 'All'; // Disable all permissions except for the "All" permission for this module
    }

    // Allow other checkboxes to be enabled by default
    return false;
}
createRoleFromForm(formValue): Role {
  const role = formValue;
  role.translation_data = [];
  const enFields = [
    { field: 'name', name: 'name' },
  
  ];
  const arFields = [
    { field: 'name_ar', name: 'name' },
   
  ];
  
  // Create the English translation if valid
  const enTranslation = this.formUtilService.createTranslation(role,'en', enFields);
  if (enTranslation) {
    role.translation_data.push(enTranslation);
  }

  // Create the Arabic translation if valid
  const arTranslation = this.formUtilService.createTranslation(role,'ar', arFields);
  if (arTranslation) {
    role.translation_data.push(arTranslation);
  }
  if(role.translation_data.length <= 0)
    delete role.translation_data;

  // Dynamically remove properties that are undefined or null at the top level of city object
  Object.keys(role).forEach(key => {
    if (role[key] === undefined || role[key] === null) {
        delete role[key];  // Delete property if it's undefined or null
     }
  });
      
 return role;
}


  /**
   * On submit form
   */
  onSubmit() {
    this.formSubmitted = true;

    if (this.roleForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.roleForm.controls).forEach(control => {
        this.roleForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.roleForm);
      return;
    }
    this.formError = null;
      let newData = this.roleForm.value;
      
       if(!this.isEditing)
        {                   
              //Dispatch Action
              delete newData.id;
              newData = this.createRoleFromForm(newData);
              this.store.dispatch(addRolelist({ newData}));
        }
        else
        { 
          const updatedDta = this.formUtilService.detectChanges(this.roleForm, this.originalRoleData);
          if (Object.keys(updatedDta).length > 0) {
            const changedData = this.createRoleFromForm(updatedDta);
            changedData.id =  this.roleForm.value.id;
            this.store.dispatch(updateRolelist({ updatedData: changedData }));
          }
          else{
            this.formError = 'Nothing has been changed!!!';
            this.formUtilService.scrollToTopOfForm(this.formElement);
          }
        }
   
  }
 
  
  hasPermission(module: string, permission: string): boolean {
    const moduleEnum = Modules[module as keyof typeof Modules];
    const permissionEnum = Permission[permission as keyof typeof Permission];
    
    if(this.claims && this.claims.length > 0){
      const claim = this.claims.find((claim) => claim.claimType === moduleEnum);
      return claim ? claim.claimValue.includes(permissionEnum) : false;
    }
    return false;
  }

  patchClaimsToCheckboxes(claims : any[]) {
    claims.forEach(claim => {
        // const moduleKey = Modules[claim.claimType];
        const claimValue = claim.claimValue;

        // Check if "All" permission is present for this module
        const hasAllPermission = claimValue.includes(Permission.All);

        // If the "All" permission is present, check the "All" checkbox for the module
        if (claim.claimType === Modules.All) {
            this.ALLModulesChecked = hasAllPermission;
        }
         else
          {
            // For other modules, set the ALL permission checkbox state
            const existingClaim = this.claims.find(c => c.claimType === claim.claimType);
            if (existingClaim) {
                existingClaim.claimValue = claimValue; // Set the permissions for the module
            } else {
                // If the claim doesn't exist, add it
                this.claims.push({ claimType: claim.claimType, claimValue });
            }
        }
    });

    // Update the form's claims value
    this.roleForm.patchValue({ claims: this.claims });
}

  toggleGlobalAll(checked: boolean): void {
    if (checked) {
        // If "All Modules" is checked, set all claims to 'All' and disable other checkboxes
        this.claims = [];
        this.claims.push({ claimType: Modules.All, claimValue: [Permission.All] });
        this.ALLModulesChecked = true;

      
    } else {
        // Uncheck all if "All Modules" is unchecked
        this.ALLModulesChecked = false;
        this.ALLPermissionChecked = false;
        this.claims = []
          }
    // Update the form's claims value
    this.roleForm.patchValue({ claims: this.claims });
}

  togglePermission(moduleKey: string, permissionKey: string, event: any): void {

    const module = Modules[moduleKey as keyof typeof Modules]; // Get the enum value for the module
    const permission = Permission[permissionKey as keyof typeof Permission]; // Get the enum value for the permission
    
    const checked = event.target.checked;
    const claimIndex = this.claims.findIndex(c => c.claimType === module); // Find the claim for the module

    if (permission === Permission.All) {
        // If the "All" permission checkbox is checked
        if (checked) {
           this.ALLPermissionChecked = true;
           if(moduleKey == 'All'){
              this.ALLModulesChecked = true;
           }
            // Clear other permissions for this module
            if (claimIndex === -1) {
                // If the module doesn't exist in claims, add a new claim
                this.claims.push({ claimType: module, claimValue: [Permission.All] });
            } else {
                // If the module exists, set its permissions to "All"
                this.claims[claimIndex].claimValue = [Permission.All];
            }
        } else {
            // If the "All" checkbox is unchecked, allow other permissions to be checked
            this.ALLPermissionChecked = false;
            if(moduleKey == 'All'){
              this.ALLModulesChecked = false;
           }
            if (claimIndex !== -1) {
                const existingClaim = this.claims[claimIndex];
                existingClaim.claimValue = existingClaim.claimValue.filter(p => p !== Permission.All);
                
                // If no permissions remain for this module, remove the claim altogether
                if (existingClaim.claimValue.length === 0) {
                    this.claims.splice(claimIndex, 1);
                }
            }
        }
    } else {
        // For other permissions
        if (checked) {
            // If the checkbox is checked, add the permission to the claims
            if (claimIndex === -1) {
                // If the module doesn't exist in claims, add a new claim
                this.claims.push({ claimType: module, claimValue: [permission] });
            } else {
                // If the module exists, add the permission to the existing claim
                const existingClaim = this.claims[claimIndex];
                if (!existingClaim.claimValue.includes(permission)) {
                    existingClaim.claimValue.push(permission);
                }
            }
        } else {
            // If the checkbox is unchecked, remove the permission from the claims
            if (claimIndex !== -1) {
                const existingClaim = this.claims[claimIndex];
                existingClaim.claimValue = existingClaim.claimValue.filter(p => p !== permission);
                
                // If no permissions remain for this module, remove the claim altogether
                if (existingClaim.claimValue.length === 0) {
                    this.claims.splice(claimIndex, 1);
                }
            }
        }
    }

    // Update the form's claims value
    this.roleForm.patchValue({ claims: this.claims });
}
checkExistance(moduleKey : string): boolean {
  const module = Modules[moduleKey as keyof typeof Modules];
  return this.claims.find(c => c.claimType === module)?.claimValue.includes(Permission.All)|| false;
}
toggleModule(moduleKey: string, event: any): void {
    const checked = event.target.checked;
    const module = Modules[moduleKey as keyof typeof Modules];

    if (checked) {
        // If "All" is checked, set the claims for this module
        this.claims = this.claims.filter(c => c.claimType !== module); // Remove existing claims for this module
        this.claims.push({ claimType: module, claimValue: [Permission.All] }); // Add only the All permission
        this.permissionKeys.forEach(permission => {
            const checkbox = document.querySelector(`#permission-${moduleKey}-${permission}`);
            if (checkbox) {
                (checkbox as HTMLInputElement).disabled = true; // Disable all specific permissions
            }
        });
    } else {
        // If "All" is unchecked, remove it from claims
        this.claims = this.claims.filter(c => c.claimType !== module);
        this.permissionKeys.forEach(permission => {
            const checkbox = document.querySelector(`#permission-${moduleKey}-${permission}`);
            if (checkbox) {
                (checkbox as HTMLInputElement).disabled = false; // Enable all specific permissions
            }
        });
    }

    // Update the form's claims value
    this.roleForm.patchValue({ claims: this.claims });
}


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    
    this.roleForm.reset();
    this.router.navigateByUrl('/private/roles');
  }
  toggleViewMode(){
    this.router.navigateByUrl('/private/roles');
}
}

   