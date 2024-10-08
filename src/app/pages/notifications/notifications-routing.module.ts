import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { CreateNotificationComponent } from './create-notification/create-notification.component';
import { EditNotificationComponent } from './edit-notification/edit-notification.component';
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RoleGuard],
    data: {
      claim : [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.NotifManagement, claimValue: [Permission.ViewAll]}]

    },
    component: NotificationsComponent
  },
  {
    path: "create",
    component: CreateNotificationComponent,
    canActivate: [RoleGuard],
    data: {
      claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.NotifManagement, claimValue:[Permission.ViewAll,Permission.Create]}]
  
    }
  },
  {
    path: "edit/:id",
    component: EditNotificationComponent,
    canActivate: [RoleGuard],
    data: {
    claim: [{claimType: Modules.All, claimValue: [Permission.All]},{ claimType:Modules.NotifManagement, claimValue:[Permission.ViewAll,Permission.Update]}]
  
     }
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
