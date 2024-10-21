
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import { select, Store } from '@ngrx/store';

import { PageChangedEvent } from 'ngx-bootstrap/pagination';


import { ToastrService } from 'ngx-toastr';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { fetchGiftCardlistData, updateGiftCardlist } from 'src/app/store/giftCard/giftCard.action';
import { selectDataGiftCard, selectDataTotalItems } from 'src/app/store/giftCard/giftCard-selector';

@Component({
  selector: 'app-approve-gift-card',
  templateUrl: './approve-gift-card.component.html',
  styleUrl: './approve-gift-card.component.css'
})
export class ApproveGiftCardComponent implements OnInit {
    // bread crumb items
    breadCrumbItems: Array<{}>;
    public Modules = Modules;
    public Permission = Permission;
    
    giftCardApprovalList$: Observable<any[]>;
    totalItems$: Observable<number>;

    isDropdownOpen : boolean = false;
    filteredArray: any[] = [];
    originalArray: any[] = [];
    
    itemPerPage: number = 10;
    currentPage : number = 1;
    
    columns : any[]= [
      { property: 'name_en', label: 'Title' },
      { property: 'merchant.merchantName', label: 'Merchant_Name' },
      { property: 'createdAt', label: 'Request_Date' },
      { property: 'status', label: 'Status' },
    
    
    ];
      constructor(public toastr:ToastrService,  public store: Store) {
       
        this.giftCardApprovalList$ = this.store.pipe(select(selectDataGiftCard));
        this.totalItems$ = this.store.pipe(select(selectDataTotalItems));

      }
    
      ngOnInit() {
      
         
          setTimeout(() => {
            this.store.dispatch(fetchGiftCardlistData({ page: 1, itemsPerPage: 10, status:'pending' }));
            this.giftCardApprovalList$.subscribe(
              data => {
                this.originalArray = data;
              console.log(this.originalArray);}
          );
            document.getElementById('elmLoader')?.classList.add('d-none')
          }, 1200);
        }
        onPageSizeChanged(event: any): void {
          const totalItems =  event.target.value;
          this.store.dispatch(fetchGiftCardlistData({ page: this.currentPage, itemsPerPage: totalItems, status:'pending' }));
         } 
      
       // pagechanged
       onPageChanged(event: PageChangedEvent): void {
        this.currentPage = event.page;
        this.store.dispatch(fetchGiftCardlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status:'pending' }));
        
      }
    
      onApproveEvent( event: any) {
        console.log('giftCard ID:', event.id, 'New Status:', event.status);
        this.store.dispatch(updateGiftCardlist({ updatedData: event }));
      }
    
    
     
    
    }

