import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DirectiveModule } from '../directive/directive.module';


@NgModule({
  declarations: [PagetitleComponent,  LoaderComponent, CustomTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    UiSwitchModule,
    DirectiveModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  exports: [PagetitleComponent, LoaderComponent, CustomTableComponent],
 providers:[DatePipe] 
})
export class UIModule { }
