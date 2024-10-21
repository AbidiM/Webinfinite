import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { DefaultComponent } from './dashboards/default/default.component';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
   //{ path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  { path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule) },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule) },
  { path: 'merchants', loadChildren: () => import('./merchants/merchants.module').then(m => m.MerchantsModule),canActivate: [RoleGuard]  },
  { path: 'stores', loadChildren: () => import('./stores/stores.module').then(m => m.StoresModule), canActivate: [RoleGuard] },
  { path: 'coupons',loadChildren: () => import('./coupons/coupons.module').then(m => m.CouponsModule), canActivate: [RoleGuard] },
  { path: 'giftCards',loadChildren: () => import('./gift-card/gift-card.module').then(m => m.GiftCardModule), canActivate: [RoleGuard] },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [RoleGuard] },
  { path: 'employees', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule), canActivate: [RoleGuard] },
  { path: 'countries', loadChildren: () => import('./country/country.module').then(m => m.CountryModule), canActivate: [RoleGuard] },
  { path: 'areas', loadChildren: () => import('./areas/areas.module').then(m => m.AreasModule), canActivate: [RoleGuard] },
  { path: 'cities', loadChildren: () => import('./city/city.module').then(m => m.CityModule), canActivate: [RoleGuard] },
  { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule), canActivate: [RoleGuard] },
  { path: 'pages', loadChildren: () => import('./utility/utility.module').then(m => m.UtilityModule) },
  { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
