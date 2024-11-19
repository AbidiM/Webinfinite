import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';

import { StatComponent } from './stat/stat.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [StatComponent, TransactionComponent, PhoneNumberComponent, ImageUploadComponent],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,
    ModalModule.forRoot()
  ],
  exports: [StatComponent, TransactionComponent,PhoneNumberComponent,ImageUploadComponent]
})
export class WidgetModule { }
