/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent {

  modalRef?: BsModalRef;

  @Input() transactions: Array<{
    id?: string;
    index?: number,
    name?: string,
    nbrCoupons?: number,
    date?: string,
    total?: string,
    status?: string,
    payment?: string[],
  }>;

  constructor(private modalService: BsModalService) { }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalRef = this.modalService.show(content);
  }

}
