import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GiftCardRoutingModule } from './gift-card-routing.module';
import { GiftCardComponent } from './gift-card.component';
import { CreateGiftCardComponent } from './create-gift-card/create-gift-card.component';
import { EditGiftCardComponent } from './edit-gift-card/edit-gift-card.component';
import { FormGiftCardComponent } from './form-gift-card/form-gift-card.component';
import { ApproveGiftCardComponent } from './approve-gift-card/approve-gift-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewGiftCardComponent } from './view-gift-card/view-gift-card.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    GiftCardComponent,
    CreateGiftCardComponent,
    EditGiftCardComponent,
    FormGiftCardComponent,
    ApproveGiftCardComponent,
    ViewGiftCardComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    BsDatepickerModule,
    FormsModule, 
    UIModule,
    WidgetModule,
    ReactiveFormsModule ,
    TranslateModule,
    NgMultiSelectDropDownModule,
    GiftCardRoutingModule
  ]
})
export class GiftCardModule { }
